const ApiError = require("../errors/ApiError");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('../models/User')

const generateJwt = (id, email, full_name, avatar, role) => {
    return jwt.sign({id, full_name, email, role}, process.env.SECRET_KEY, {expiresIn: '24h'})
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
        const token = generateJwt(user.id, user.email, user.full_name, user.avatar, user.role)
        return res.json({token})
    }

    async login(req, res, next) {
        const {email, password} = req.body
        const user = await User.findOne({where: {email}})
        if (!user) return next(ApiError.internal('User not found'))
        let comparePassword = bcrypt.compareSync(password, user.password)
        if (!comparePassword) return next(ApiError.internal('Incorrect password'))
        const token = generateJwt(user.id, user.email, user.full_name, user.avatar, user.role)
        return res.json({token})
    }

    async isAuth(req, res) {
        const {id, email, role, full_name} = req.user
        const token = generateJwt(id, email, full_name, role)
        return res.json({token})
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
            const data = req.body
            if(!id)  return next(ApiError("id is not specified"))
            const [,user] = await User.update(data, {where: {id}, returning: true})
            return res.json(user[0])
        }catch (e) {
            throw Error(e.message)
        }
    }
}

module.exports = new UserController()