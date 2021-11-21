const Pet = require('../models/Pet')
const ApiError = require("../errors/ApiError");
const uuid = require("uuid");
const path = require("path");
const User = require('../models/User')

class PetController {
    async create(req, res, next) {
        try {
            const {
                userId,
                type,
                sex,
                breed,
                contacts,
                color,
                height,
                features,
                description,
                location,
                status,
                nick
            } = req.body

            if (!userId) return res.json({message: "ID is not specified"})

            const {image} = req.files
            const imageName = `${uuid.v4()}.jpg`
            await image.mv(path.resolve(__dirname, '..', 'static', imageName))
            const pet = await Pet.create({
                userId,
                contacts,
                image: imageName,
                type,
                sex,
                breed,
                color,
                height,
                features,
                description,
                location,
                status
            })
            if (nick)
                await User.update({nick}, {where: {id: userId}})
            return res.json(pet)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getAll(req, res, next) {
        try {
            const {status} = req.params
            const pets = await Pet.findAll({where: {status}})
            const users = await User.findAll()
            const petsArr = pets.map(pet => {
                const user = users.find(item => item.id === pet.userId)
                return {...pet.dataValues, nick: user.nick}
            })
            return res.json(petsArr)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getOne(req, res, next) {
        try {
            const {id} = req.params
            if (!id) return res.json({message: "ID is not specified"})
            const pet = await Pet.findOne({where: {id}})
            return res.json(pet)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async update(req, res, next) {
        try {
            const {id} = req.params
            if (!id) return res.json({message: "ID is not specified"})
            const {status, contacts} = req.body
            if (!status) return res.json({message: "STATUS is not specified"})
            if (!contacts) return res.json({message: "CONTACTS is not specified"})
            const [, pet] = await Pet.update({status, contacts}, {where: {id}, returning: true})
            return res.json(pet[0])
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }


}

module.exports = new PetController()