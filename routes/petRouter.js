const Router = require('express')
const router = new Router()
const petController = require('../controllers/petController')

router.post('/', petController.create)
router.get('/', petController.getAll)

module.exports = router