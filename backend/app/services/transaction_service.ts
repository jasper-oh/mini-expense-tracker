import { inject } from '@adonisjs/core'
import db from '@adonisjs/lucid/services/db'
import type {
  TransactionResponse,
  CreateTransactionData,
  CategoryBalanceResponse,
} from '../types/index.js'
import CurrencyService from './currency_service.js'

@inject()
export default class TransactionService {
  constructor(private currencyService: CurrencyService) {}
  /**
   * Get all transactions with category information
   */
  async getAllTransactions(): Promise<TransactionResponse[]> {
    const transactions = await db
      .from('transactions')
      .join('categories', 'transactions.category_id', 'categories.id')
      .select(
        'transactions.id',
        'transactions.amount',
        'transactions.currency',
        'transactions.converted_cad',
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
      convertedCad: parseFloat(transaction.converted_cad),
    }))
  }

  /**
   * Create a new transaction
   */
  async createTransaction(transactionData: CreateTransactionData): Promise<TransactionResponse> {
    // Convert amount to CAD using historical exchange rate
    const convertedCad = await this.currencyService.convertToCAD(
      transactionData.amount,
      transactionData.currency,
      transactionData.date
    )

    const [transaction] = await db
      .table('transactions')
      .insert({
        amount: transactionData.amount,
        currency: transactionData.currency,
        converted_cad: convertedCad,
        date: transactionData.date,
        description: transactionData.description,
        category_id: transactionData.categoryId,
      })
      .returning('*')

    // Get category name for the response
    const category = await db.from('categories').where('id', transactionData.categoryId).first()

    // Transform to match TransactionResponse interface
    return {
      id: transaction.id,
      amount: parseFloat(transaction.amount),
      currency: transaction.currency,
      convertedCad: parseFloat(transaction.converted_cad),
      date: transaction.date,
      description: transaction.description,
      categoryId: transaction.category_id,
      categoryName: category?.name || 'Unknown Category',
      createdAt: transaction.created_at,
      updatedAt: transaction.updated_at,
    } as TransactionResponse
  }

  /**
   * Get category balances
   */
  async getCategoryBalances(): Promise<CategoryBalanceResponse[]> {
    // Get all categories with their transactions (one-to-many relationship)
    const balances = await db
      .from('categories')
      .leftJoin('transactions', 'categories.id', 'transactions.category_id')
      .select(
        'categories.id as categoryId',
        'categories.name as categoryName',
        'transactions.id as transactionId',
        'transactions.amount',
        'transactions.currency',
        'transactions.converted_cad',
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

        if (row.transactionId && row.amount) {
          acc[categoryId].transactions.push({
            id: row.transactionId,
            amount: parseFloat(row.amount),
            currency: row.currency || '',
            convertedCad: parseFloat(row.converted_cad || '0'),
            date: row.date || new Date().toISOString(),
            description: row.description || '',
            categoryId: row.categoryId,
            categoryName: row.categoryName,
            createdAt: row.createdAt || new Date().toISOString(),
            updatedAt: row.updatedAt || new Date().toISOString(),
          })
          // Use converted CAD amount for total calculation
          acc[categoryId].total += parseFloat(row.converted_cad || '0')
        }

        return acc
      },
      {} as Record<number, CategoryBalanceResponse>
    )

    // Convert to array and sort by total descending
    const result = Object.values(groupedByCategory) as CategoryBalanceResponse[]
    return result.sort((a, b) => b.total - a.total)
  }
}
