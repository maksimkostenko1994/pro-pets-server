const Router = require('express')
const router = new Router()

const userController = require('../controllers/userController')

const authMiddleware = require('../middleware/authMiddleware')

router.post('/registration', userController.registration)
router.post('/login', userController.login)
router.get('/auth', authMiddleware, userController.isAuth)
router.get('/:id', userController.getOne)
router.put('/:id', userController.update)

module.exports = router