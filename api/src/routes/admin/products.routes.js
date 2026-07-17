const productsController = require('../../controllers/admin/products.controller')

const router = require('express').Router()

router.get('/', productsController.list)
router.get('/:id', productsController.getById)
router.post('/', productsController.create)
router.put('/:id', productsController.update)
router.delete('/:id', productsController.remove)
router.post('/bulk', productsController.bulkCreate)

module.exports = router
