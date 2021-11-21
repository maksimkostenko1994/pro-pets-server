const ApiError = require("../errors/ApiError");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('../models/User')
const uuid = require("uuid");
const path = require("path");

const generateJwt = (id, role) => {
    return jwt.sign({id, role}, process.env.SECRET_KEY, {expiresIn: '24h'})
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
        if (!user) return next(ApiError.internal('User not found'))
        let comparePassword = bcrypt.compareSync(password, user.password)
        if (!comparePassword) return next(ApiError.internal('Incorrect password'))
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
            const {pet_photo, avatar} = req.files
            let avatarName = avatar !== undefined ? `${uuid.v4()}.jpg` : null,
                petName = pet_photo !== undefined ? `${uuid.v4()}.jpg` : null
            if (avatar || avatar !== undefined)
                await avatar.mv(path.resolve(__dirname, '..', 'static', avatarName))
            if (pet_photo || pet_photo !== undefined)
                await pet_photo.mv(path.resolve(__dirname, '..', 'static', petName))
            if (!id) return next(ApiError("id is not specified"))
            const [, user] = await User.update({
                email,
                phone,
                user_pet,
                nick,
                full_name,
                pet_photo: petName || null,
                avatar: avatarName || null
            }, {
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