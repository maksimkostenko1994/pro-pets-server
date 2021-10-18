const Comment = require('../models/Comment')

class CommentController {
    async create(req, res) {
        const {postId, userId, text} = req.body
        const comment = await Comment.create({postId, userId, text})
        return res.json(comment)
    }

    async getAll(req, res) {
        const comments = Comment.findAll()
        return res.json(comments)
    }
}

module.exports = new CommentController()