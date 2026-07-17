const internalController = require('../controllers/admin/internal.controller')
const internalAuth = require('../middleware/internalAuth')

const router = require('express').Router()

router.post('/create-admin', internalAuth, internalController.createAdmin)
router.get('/admin-status', internalAuth, internalController.getAdminStatus)
router.post('/resend-activation', internalAuth, internalController.resendActivation)
router.post('/seed-settings', internalAuth, internalController.seedSettings)
router.post('/seed-products', internalAuth, internalController.seedProducts)
router.post('/seed-services', internalAuth, internalController.seedServices)

module.exports = router
