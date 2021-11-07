const Post = require('../models/Post')
const User = require('../models/User')
const ApiError = require("../errors/ApiError");

class PostController {
    async create(req, res, next) {
        const {userId, title, text, likes} = req.body
        if (!userId) return next(ApiError.forbidden('Missing user id'))
        const post = await Post.create({userId, title, text, likes})
        return res.json(post)
    }

    async getAll(req, res) {
        try {
            const posts = await Post.findAll()
            return res.json(posts)
        } catch (e) {
            return new Error(e.message)
        }
    }

    async getOne(req, res, next) {
        try {
            const {id} = req.params
            if (isNaN(id)) return next(ApiError.badRequest('Invalid id'))
            const post = await Post.findOne({where: {id}})
            if (!post) {
                return next(ApiError.badRequest('Not found'))
            }
            const user = await User.findOne({where: {id: post.userId}})
            return res.json({...post.dataValues, full_name: user.full_name, avatar: user.avatar})
        } catch (e) {
            return new Error(e.message)
        }
    }

}

module.exports = new PostController()