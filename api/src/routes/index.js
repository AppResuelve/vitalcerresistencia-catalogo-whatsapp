const authMiddleware = require('../middleware/auth')
const storeStatusMiddleware = require('../middleware/storeStatus')
const { authLimiter, generalLimiter } = require('../middleware/rateLimiter')

const mountRoutes = (app) => {
  // Aplicar rate limiting general a toda la API
  app.use('/api', generalLimiter)

  // Auth (pública, con rate limiting específico)
  app.use('/api/auth', authLimiter, require('./auth.routes'))

  // Admin (requiere JWT)
  app.use('/api/admin/dashboard', authMiddleware, require('./admin/dashboard.routes'))
  app.use('/api/admin/products', authMiddleware, require('./admin/products.routes'))
  app.use('/api/admin/categories', authMiddleware, require('./admin/categories.routes'))
  app.use('/api/admin/orders', authMiddleware, require('./admin/orders.routes'))
  app.use('/api/admin/settings', authMiddleware, require('./admin/settings.routes'))
  app.use('/api/admin/upload', authMiddleware, require('./admin/upload.routes'))
  app.use('/api/admin/change-requests', authMiddleware, require('./admin/changeRequests.routes'))
  app.use('/api/admin/services', authMiddleware, require('./admin/services.routes'))
  app.use('/api/admin/attributes', authMiddleware, require('./admin/attributes.routes'))
  app.use('/api/admin/tags', authMiddleware, require('./admin/tags.routes'))

  // Internal (requiere APPRESUELVE_SECRET — solo para la platform)
  app.use('/api/internal', require('./internal.routes'))

  // Store (pública — la consumen los templates de sitio web)
  app.use('/api/store/products', storeStatusMiddleware, require('./store/products.routes'))
  app.use('/api/store/categories', storeStatusMiddleware, require('./store/categories.routes'))
  app.use('/api/store/settings', require('./store/settings.routes'))
  app.use('/api/store/orders', storeStatusMiddleware, require('./store/orders.routes'))
  app.use('/api/store/services', storeStatusMiddleware, require('./store/services.routes'))
  app.use('/api/store/tags', storeStatusMiddleware, require('./store/tags.routes'))
}

module.exports = mountRoutes
