import { inject } from '@adonisjs/core'
import db from '@adonisjs/lucid/services/db'

@inject()
export default class TransactionService {
  /**
   * Get all transactions with category information
   */
  async getAllTransactions() {
    const transactions = await db
      .from('transactions')
      .join('categories', 'transactions.category_id', 'categories.id')
      .select(
        'transactions.id',
        'transactions.amount',
        'transactions.currency',
        'transactions.date',
        'transactions.description',
        'transactions.category_id as categoryId',
        'categories.name as categoryName',
        'transactions.created_at as createdAt',
        'transactions.updated_at as updatedAt'
      )
      .orderBy('transactions.created_at', 'desc')

    // Transform to match our API format and convert amounts to numbers
    return transactions.map((transaction) => ({
      ...transaction,
      amount: parseFloat(transaction.amount),
    }))
  }

  /**
   * Create a new transaction
   */
  async createTransaction(transactionData: {
    amount: number
    currency: string
    date: string
    description: string
    categoryId: number
  }) {
    const [transaction] = await db
      .table('transactions')
      .insert({
        amount: transactionData.amount,
        currency: transactionData.currency,
        date: transactionData.date,
        description: transactionData.description,
        category_id: transactionData.categoryId,
      })
      .returning('*')

    return transaction
  }

  /**
   * Get category balances
   */
  async getCategoryBalances() {
    const balances = await db
      .from('transactions')
      .join('categories', 'transactions.category_id', 'categories.id')
      .select('categories.name as categoryName')
      .sum('transactions.amount as total')
      .groupBy('categories.name')
      .orderBy('total', 'desc')

    // Convert string totals to numbers
    return balances.map((balance) => ({
      ...balance,
      total: parseFloat(balance.total),
    }))
  }
}
