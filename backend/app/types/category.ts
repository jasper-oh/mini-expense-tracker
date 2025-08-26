import { DateTime } from 'luxon'

/**
 * Base Category interface representing the database model
 */
export interface CategoryAttributes {
  id: number
  name: string
  createdAt: DateTime
  updatedAt: DateTime
}

/**
 * Category interface for API responses (camelCase)
 */
export interface CategoryResponse {
  id: number
  name: string
  createdAt: DateTime
  updatedAt: DateTime
}

/**
 * Interface for creating a new category
 */
export interface CreateCategoryData {
  name: string
}

/**
 * Interface for updating a category
 */
export interface UpdateCategoryData {
  name?: string
}

/**
 * Interface for category with transaction count
 */
export interface CategoryWithTransactionCount {
  id: number
  name: string
  transactionCount: number
  createdAt: DateTime
  updatedAt: DateTime
}
