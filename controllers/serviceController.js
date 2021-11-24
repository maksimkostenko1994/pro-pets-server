const uuid = require('uuid')
const path = require('path')

const Service = require('../models/Service')
const User = require('../models/User')

const ApiError = require('../errors/ApiError')
const {log} = require("nodemon/lib/utils");

class ServiceController {
    async create(req, res, next) {
        try {
            const {userId, location, type, title, text, date, contacts} = req.body
            const {photo} = req.files
            let fileName = `${uuid.v4()}.jpg`
            await photo.mv(path.resolve(__dirname, '..', 'static', fileName))
            const service = await Service.create({
                userId,
                location,
                type,
                title,
                text,
                date,
                contacts,
                photo: fileName
            })
            return res.json(service)
        } catch (error) {
            next(ApiError.badRequest(error.message))
        }
    }

    async getAll(req, res) {
        const {type} = req.params
        let {page, limit} = req.query
        page = page || 1
        limit = limit || 4
        let offset = page * limit - limit
        const services = await Service.findAndCountAll({offset, limit, where: {type}, order: [['createdAt', 'DESC']]})
        const users = await User.findAll()
        const serviceArr = services.rows.map(service => {
            const user = users.find(item => item.id === service.userId)
            return {...service.dataValues, full_name: user.full_name, avatar: user.avatar}
        })
        return res.json({...services, rows: serviceArr})
    }

    async getOne(req, res, next) {
        try {
            const {id} = req.params
            if (!id) return res.json({message: "ID is not specified"})
            const service = await Service.findOne({where: {id}})
            const user = await User.findOne({where: {id: service.userId}})
            return res.json({...service.dataValues, user})
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new ServiceController()