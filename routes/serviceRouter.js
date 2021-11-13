const Router = require('express')
const router = new Router()

const serviceController = require('../controllers/serviceController')

const checkRoleAndType = require('../middleware/checkRoleAndTypeMiddleware')

router.post('/', checkRoleAndType, serviceController.create)
router.get('/:type', serviceController.getAll)
router.get('/id/:id', serviceController.getOne)

module.exports = router