const Like = require("../models/Like");

class LikeController {
    async create(req, res) {
        const { userId, postId } = req.body;
        if (!userId || !postId)
            return res.json({ message: "Missed userId or postId" });
        const like = await Like.create({ userId, postId });
        res.json(like);
    }

    async getAll(req, res) {
        const likes = await Like.findAll();
        return res.json(likes);
    }

    async getCount(req, res) {
        const { postId } = req.params;
        const likes = Like.findAndCountAll({ where: { postId } });
        return res.json(likes);
    }

    async delete(req, res) {
        try {
            const { userId } = req.body;
            console.log(req);
            console.log(userId);
            if (!userId) return res.json({ message: "ID is not specified" });
            await Like.destroy({ where: { userId } });
            return res.json({ message: "Delete successfully" });
        } catch (e) {
            return res.json({ message: e });
        }
    }
}

module.exports = new LikeController();
