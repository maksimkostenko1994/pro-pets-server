const Pet = require('../models/Pet')

class PetController {
    async create(req, res) {
        const {userId, sex, breed, color, height, features, description, location, status} = req.body
        const pet = await Pet.create({userId, sex, breed, color, height, features, description, location, status})
        return res.json(pet)
    }

    async getAll(req, res) {
        const pets = await Pet.findAll()
        return res.json(pets)
    }

}

module.exports = new PetController()