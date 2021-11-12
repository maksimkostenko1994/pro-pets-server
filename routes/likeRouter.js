const Router = require('express')
const router = new Router()

const likeController = require('../controllers/likeController')

router.get('/', likeController.getAll)
router.get('/:postId', likeController.getCount)
router.post('/', likeController.create)
router.delete('/', likeController.delete)

module.exports = router