/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/
import AutoSwagger from 'adonis-autoswagger'
import swagger from '#config/swagger'
import TransactionsController from '#controllers/transactions_controller'
import router from '@adonisjs/core/services/router'

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.get('/swagger', async () => {
  return AutoSwagger.default.docs(router.toJSON(), swagger)
})

router.get('/docs', async () => {
  return AutoSwagger.default.ui('/swagger', swagger)
})

// Transaction routes
router.group(() => {
  router.get('/api/transactions', [TransactionsController, 'index'] as const)
  router.post('/api/transactions', [TransactionsController, 'store'] as const)
  router.get('/api/transactions/balance', [TransactionsController, 'getBalanceByCategory'] as const)
})
