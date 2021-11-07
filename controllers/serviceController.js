const uuid = require('uuid')
const path = require('path')

const Service = require('../models/Service')

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
        return res.json(services)
    }

    async getOne(req, res) {
        const {id} = req.params
        const service = await Service.findOne({where: {id}})
        return res.json(service)
    }
}

module.exports = new ServiceController()