/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/
import router from '@adonisjs/core/services/router'
import TransactionsController from '#controllers/transactions_controller'
import CategoriesController from '#controllers/categories_controller'
import jwt from 'jsonwebtoken'
import './swagger.ts'
import { middleware } from './kernel.js'
import env from '#start/env'

const JWT_SECRET = env.get('JWT_SECRET')

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

/**
 * @swagger
 * /token:
 *   get:
 *     summary: Issue a JWT token
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Returns a JWT token
 */
router.get('/token', async () => {
  return {
    token: jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '1h' }),
  }
})

/**
 * @swagger
 * /validate-token:
 *   post:
 *     summary: Check if JWT token is valid
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Returns a JWT token if valid
 */
router.post('/validate-token', async (ctx) => {
  const token = ctx.request.input('token')
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    return {
      success: true,
      decoded,
    }
  } catch (error) {
    return ctx.response.status(401).json({
      success: false,
    })
  }
})

/**
 * @swagger
 * /api/transactions:
 *   get:
 *     summary: Get all transactions
 *     tags:
 *       - Transactions
 *     responses:
 *       200:
 *         description: A list of transactions
 *   post:
 *     summary: Create a new transaction
 *     tags:
 *       - Transactions
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *               currency:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               description:
 *                 type: string
 *               category_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Transaction created
 *       401:
 *         description: Unauthorized - Missing or invalid token
 */
router
  .group(() => {
    router.get('/', [TransactionsController, 'index'] as const)
    router.post('/', [TransactionsController, 'store'] as const).use([middleware.authJwt()])
  })
  .prefix('/api/transactions')

/**
 * @swagger
 * /api/transactions/balance:
 *   get:
 *     summary: Get balance grouped by category
 *     tags:
 *       - Transactions
 *     responses:
 *       200:
 *         description: Balance result
 */
router.get('/api/transactions/balance', [TransactionsController, 'getBalanceByCategory'] as const)

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories
 *     tags:
 *       - Categories
 *     responses:
 *       200:
 *         description: A list of categories
 */
router.get('/api/categories', [CategoriesController, 'index'] as const)
