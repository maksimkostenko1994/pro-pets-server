const Post = require('../models/Post')
const User = require('../models/User')
const Like = require('../models/Like')
const Comment = require('../models/Comment')
const ApiError = require("../errors/ApiError");
const uuid = require("uuid");

const path = require('path')

class PostController {
    async create(req, res, next) {
        const {userId, title, text, likes} = req.body
        const {photo} = req.files
        let postPhoto = `${uuid.v4()}.jpg`
        await photo.mv(path.resolve(__dirname, '..', 'static', postPhoto))
        if (!userId) return next(ApiError.badRequest('Missing user id'))
        const post = await Post.create({userId, title, text, likes, photo: postPhoto})
        return res.json(post)
    }

    async getAll(req, res) {
        try {
            let {limit, page} = req.query
            limit = limit || 2
            page = page || 1
            let offset = page * limit - limit
            const posts = await Post.findAndCountAll({offset, limit, order: [['createdAt', 'DESC']]})
            const users = await User.findAll()
            const likes = await Like.findAll()
            const postsArr = posts.rows.map(post => {
                const userItem = users.find(user => user.id === post.userId)
                const likesCount = likes.filter(like => like.postId === post.id)
                return {
                    ...post.dataValues,
                    full_name: userItem.full_name,
                    avatar: userItem.avatar,
                    count: likesCount.length
                }
            })
            return res.json({rows: postsArr, count: posts.count})
        } catch (e) {
            return new Error(e.message)
        }
    }

    async getOne(req, res, next) {
        try {
            const {id} = req.params
            let {page, limit} = req.query
            page = page || 1
            limit = limit || 10
            let offset = page * limit - limit
            if (isNaN(id)) return next(ApiError.badRequest('Invalid id'))
            const post = await Post.findOne({where: {id}})
            const comments = await Comment.findAndCountAll({
                offset,
                limit,
                where: {postId: id},
                order: [['createdAt', 'DESC']]
            })
            const likes = await Like.findAndCountAll({where: {postId: id}})
            const users = await User.findAll()
            if (!post) return next(ApiError.badRequest('Not found'))

            const user = await User.findOne({where: {id: post.userId}})
            const commentsArr = comments.rows.map(comment => {
                const userObj = users.find(item => item.id === comment.userId)
                return {...comment.dataValues, user: userObj}
            })
            return res.json({
                ...post.dataValues,
                full_name: user.full_name,
                avatar: user.avatar,
                comments: commentsArr,
                likes: likes.rows,
                count: likes.count,
                commentsCount: comments.count
            })
        } catch (e) {
            return new Error(e.message)
        }
    }

}

module.exports = new PostController()