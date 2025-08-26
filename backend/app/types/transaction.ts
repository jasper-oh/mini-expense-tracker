import { DateTime } from 'luxon'

/**
 * Base Transaction interface representing the database model
 */
export interface TransactionAttributes {
  id: number
  amount: number
  currency: string
  convertedCad: number
  date: DateTime
  description: string
  categoryId: number
  createdAt: DateTime
  updatedAt: DateTime
}

/**
 * Transaction interface for API responses (camelCase)
 */
export interface TransactionResponse {
  id: number
  amount: number
  currency: string
  convertedCad: number
  date: string
  description: string
  categoryId: number
  categoryName: string
  createdAt: DateTime
  updatedAt: DateTime
}

/**
 * Interface for creating a new transaction
 */
export interface CreateTransactionData {
  amount: number
  currency: string
  date: string
  description: string
  categoryId: number
}

/**
 * Interface for updating a transaction
 */
export interface UpdateTransactionData {
  amount?: number
  currency?: string
  date?: string
  description?: string
  categoryId?: number
}

/**
 * Interface for category balance response
 */
export interface CategoryBalanceResponse {
  categoryId: number
  categoryName: string
  transactions: TransactionResponse[]
  total: number
}
