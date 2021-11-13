const uuid = require('uuid')
const path = require('path')

const Service = require('../models/Service')
const User = require('../models/User')

const ApiError = require('../errors/ApiError')

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
        limit = limit || 10
        let offset = page * limit - limit
        const services = await Service.findAndCountAll({offset, limit, where: {type}})
        const users = await User.findAll()
        const serviceArr = services.rows.map(service => {
            const user = users.find(item => item.id === service.userId)
            return {...service.dataValues, full_name: user.full_name, avatar: user.avatar}
        })
        return res.json({...services, rows: serviceArr})
    }

    async getOne(req, res) {
        const {id} = req.params
        const service = await Service.findOne({where: {id}})
        return res.json(service)
    }
}

module.exports = new ServiceController()