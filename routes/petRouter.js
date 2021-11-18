const Router = require('express')
const router = new Router()
const petController = require('../controllers/petController')

router.post('/', petController.create)
router.get('/:status', petController.getAll)
router.get('/id/:id', petController.getOne)
router.put('/:id', petController.update)

module.exports = router