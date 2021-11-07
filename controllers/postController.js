const Post = require('../models/Post')
const User = require('../models/User')
const Like = require('../models/Like')
const ApiError = require("../errors/ApiError");
const uuid = require("uuid");

const path = require('path')

class PostController {
    async create(req, res, next) {
        const {userId, title, text, likes} = req.body
        const {photo} = req.files
        let postPhoto = `${uuid.v4()}.jpg`
        await photo.mv(path.resolve(__dirname, '..', 'static', postPhoto))
        if (!userId) return next(ApiError.forbidden('Missing user id'))
        const post = await Post.create({userId, title, text, likes, photo: postPhoto})
        return res.json(post)
    }

    async getAll(req, res) {
        try {
            const posts = await Post.findAll()
            const users = await User.findAll()
            const likes = await Like.findAll()
            const postsArr = posts.map(post => {
                const userItem = users.find(user => user.id === post.userId)
                const likesCount = likes.filter(like => like.postId === post.id)
                return {
                    ...post.dataValues,
                    full_name: userItem.full_name,
                    avatar: userItem.avatar,
                    count: likesCount.length
                }
            })
            return res.json(postsArr)
        } catch (e) {
            return new Error(e.message)
        }
    }

    async getOne(req, res, next) {
        try {
            const {id} = req.params
            if (isNaN(id)) return next(ApiError.badRequest('Invalid id'))
            const post = await Post.findOne({where: {id}})
            const likes = await Like.findAndCountAll({where: {postId: id}})
            if (!post) {
                return next(ApiError.badRequest('Not found'))
            }
            const user = await User.findOne({where: {id: post.userId}})
            return res.json({...post.dataValues, full_name: user.full_name, avatar: user.avatar, count: likes.count})
        } catch (e) {
            return new Error(e.message)
        }
    }

}

module.exports = new PostController()