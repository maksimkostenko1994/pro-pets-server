const Post = require('../models/Post')

class PostController {
    async create(req, res) {
        const {userId, title, text, likes} = req.body
        const post = await Post.create({userId, title, text, likes})
        return res.json(post)

    }

    async getAll(req, res) {
        const posts = await Post.findAll()
        return res.json(posts)
    }

}

module.exports = new PostController()