import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import TransactionService from '#services/transaction_service'

@inject()
export default class TransactionsController {
  constructor(private transactionService: TransactionService) {}

  /**
   * Display a list of transactions
   */
  async index({ response }: HttpContext) {
    try {
      const transactions = await this.transactionService.getAllTransactions()

      return response.json({
        success: true,
        data: transactions,
      })
    } catch (error) {
      return response.status(500).json({
        success: false,
        message: 'Failed to fetch transactions',
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }

  /**
   * Create a new transaction
   */
  async store({ request, response }: HttpContext) {
    try {
      const { amount, currency, date, description, category_id } = request.only([
        'amount',
        'currency',
        'date',
        'description',
        'category_id',
      ])

      // Validate required fields
      if (!amount || !currency || !date || !description || !category_id) {
        return response.status(400).json({
          success: false,
          message: 'All fields are required',
        })
      }

      const transaction = await this.transactionService.createTransaction({
        amount: parseFloat(amount),
        currency,
        date,
        description,
        categoryId: parseInt(category_id),
      })

      return response.status(201).json({
        success: true,
        data: transaction,
      })
    } catch (error) {
      return response.status(500).json({
        success: false,
        message: 'Failed to create transaction',
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }

  /**
   * Get balance grouped by category
   */
  async getBalanceByCategory({ response }: HttpContext) {
    try {
      const balances = await this.transactionService.getCategoryBalances()

      return response.json({
        success: true,
        data: balances,
      })
    } catch (error) {
      return response.status(500).json({
        success: false,
        message: 'Failed to fetch balance by category',
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }
}
