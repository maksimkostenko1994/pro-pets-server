const Router = require('express')
const router = new Router()
const userRouter = require('./userRouter')
const petRouter = require('./petRouter')
const postRouter = require('./postRouter')
const commentRouter = require('./commentRouter')
const serviceRouter = require('./serviceRouter')

router.use('/users', userRouter)
router.use('/pets', petRouter)
router.use('/posts', postRouter)
router.use('/services', serviceRouter)
router.use('/comments', commentRouter)

module.exports = router