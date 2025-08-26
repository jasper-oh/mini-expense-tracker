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
    // Check if category already has a transaction (one-to-one relationship)
    const existingTransaction = await db
      .from('transactions')
      .where('category_id', transactionData.categoryId)
      .first()

    if (existingTransaction) {
      throw new Error('Category already has a transaction. One-to-one relationship enforced.')
    }

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
    // Get all categories with their transactions (one-to-one relationship)
    const balances = await db
      .from('categories')
      .leftJoin('transactions', 'categories.id', 'transactions.category_id')
      .select(
        'categories.id as categoryId',
        'categories.name as categoryName',
        'transactions.id as transactionId',
        'transactions.amount',
        'transactions.currency',
        'transactions.date',
        'transactions.description',
        'transactions.created_at as createdAt',
        'transactions.updated_at as updatedAt'
      )
      .orderBy('categories.id')

    // Group by category and format the response
    const groupedByCategory = balances.reduce(
      (acc, row) => {
        const categoryId = row.categoryId

        if (!acc[categoryId]) {
          acc[categoryId] = {
            categoryId,
            categoryName: row.categoryName,
            transactions: [],
            total: 0,
          }
        }

        if (row.transactionId) {
          acc[categoryId].transactions.push({
            id: row.transactionId,
            amount: parseFloat(row.amount),
            currency: row.currency,
            date: row.date,
            description: row.description,
            categoryId: row.categoryId,
            categoryName: row.categoryName,
            createdAt: row.createdAt,
            updatedAt: row.updatedAt,
          })
          acc[categoryId].total += parseFloat(row.amount)
        }

        return acc
      },
      {} as Record<
        number,
        { categoryId: number; categoryName: string; transactions: any[]; total: number }
      >
    )

    // Convert to array and sort by total descending
    return Object.values(groupedByCategory).sort((a, b) => (b as any).total - (a as any).total)
  }
}
