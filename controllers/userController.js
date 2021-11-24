const ApiError = require("../errors/ApiError");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('../models/User')
const uuid = require("uuid");
const path = require("path");
const Post = require("../models/Post");
const Service = require("../models/Service");
const Pet = require("../models/Pet");

const fs = require('fs')

const generateJwt = (id, role) => {
    return jwt.sign({id, role}, process.env.SECRET_KEY, {expiresIn: '900s'})
}

class UserController {
    async registration(req, res, next) {
        const {email, full_name, password, role} = req.body
        if (!email || !password || !full_name) {
            return next(ApiError.badRequest('Incorrect email er password'))
        }
        const candidate = await User.findOne({where: {email}})
        if (candidate) {
            return next(ApiError.badRequest(`User with ${email} already exist`))
        }
        const hashPassword = await bcrypt.hash(password, 5)
        const user = await User.create({email, full_name, password: hashPassword, role})
        const token = generateJwt(user.id, user.role)
        return res.json({token, user})
    }

    async login(req, res, next) {
        const {email, password} = req.body
        const user = await User.findOne({where: {email}})
        if (!user) return next(ApiError.badRequest('User not found'))
        let comparePassword = bcrypt.compareSync(password, user.password)
        if (!comparePassword) return next(ApiError.badRequest('Incorrect password'))
        const token = generateJwt(user.id, user.role)
        return res.json({token, user})
    }

    async isAuth(req, res) {
        try {
            const {id, role} = req.user
            const token = generateJwt(id, role)
            const user = await User.findOne({where: {id}})
            return res.json({token, user})
        } catch (e) {
            throw new Error(e.message)
        }
    }

    async getOne(req, res) {
        try {
            const {id} = req.params
            const user = await User.findOne({where: {id}})
            return res.json(user)
        } catch (e) {
            throw new Error(e.message)
        }
    }

    async update(req, res, next) {
        try {
            const {id} = req.params
            const {email, phone, user_pet, nick, full_name} = req.body
            let pet_photo, avatar
            if (req.files) {
                pet_photo = req.files.pet_photo || null
                avatar = req.files.avatar || null
            }
            let avatarName = avatar ? `${uuid.v4()}.jpg` : null,
                petName = pet_photo ? `${uuid.v4()}.jpg` : null
            if (avatar)
                await avatar.mv(path.resolve(__dirname, '..', 'static', avatarName))
            if (pet_photo)
                await pet_photo.mv(path.resolve(__dirname, '..', 'static', petName))
            if (!id) return next(ApiError("ID is not specified"))
            if (pet_photo && avatar) {
                const [, user] = await User.update({
                    email,
                    phone,
                    user_pet,
                    nick,
                    full_name,
                    avatar: avatarName,
                    pet_photo: petName
                }, {where: {id}, returning: true})
                return res.json(user[0])
            }
            if (pet_photo) {
                const [, user] = await User.update({
                    email,
                    phone,
                    user_pet,
                    nick,
                    full_name,
                    pet_photo: petName
                }, {where: {id}, returning: true})
                return res.json(user[0])
            }
            if (avatar) {
                const [, user] = await User.update({
                    email,
                    phone,
                    user_pet,
                    nick,
                    full_name,
                    avatar: avatarName
                }, {where: {id}, returning: true})
                return res.json(user[0])
            }
            const [, user] = await User.update({email, phone, user_pet, nick, full_name}, {
                where: {id},
                returning: true
            })
            return res.json(user[0])
        } catch (e) {
            throw Error(e.message)
        }
    }
}

module.exports = new UserController()

fs.readdir('./static', async (err, data) => {
    if (err) console.log(err)
    const userPhotos = await User.findAll({attributes: ['pet_photo', 'avatar']})
    const postPhotos = await Post.findAll({attributes: ['photo']})
    const servicePhotos = await Service.findAll({attributes: ['photo']})
    const petPhotos = await Pet.findAll({attributes: ['image']})
    const userPhotoArr = userPhotos.map(item => {
        return [item.pet_photo, item.avatar]
    })

    const postPhotoArr = postPhotos.map(item => {
        return [item.photo]
    })
    const servicePhotoArr = servicePhotos.map(item => {
        return [item.photo]
    })
    const petPhotoArr = petPhotos.map(item => {
        return [item.image]
    })

    const allPhotos = [...userPhotoArr, ...postPhotoArr, ...servicePhotoArr, ...petPhotoArr]
    const photoArray = allPhotos.flat(Infinity)
    const res = []

    for (let i = 0; i < data.length; i++) {
        const even = elem => elem === data[i]
        if(!photoArray.some(even)) {
            res.push(data[i])
        }
    }

    res.forEach(item => {
        fs.unlink(`./static/${item}`, () => {})
    })

})