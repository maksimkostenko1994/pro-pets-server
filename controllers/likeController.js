const Like = require('../models/Like')

class LikeController {
    async create(req, res) {
        const {userId, postId} = req.body
        const like = await Like.create({userId, postId})
        res.json(like)
    }

    async getAll(req ,res) {
        const likes = await Like.findAll()
        return res.json(likes)
    }

    async getCount(req, res) {
        const {postId} = req.params
        const likes = Like.findAndCountAll({where: {postId}})
        return res.json(likes)
    }
}

module.exports = new LikeController()