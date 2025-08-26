import { inject } from '@adonisjs/core'
import Category from '../models/category.js'
import db from '@adonisjs/lucid/services/db'
import type { CategoryResponse, CategoryWithTransactionCount } from '../types/index.js'

@inject()
export default class CategoryService {
  /**
   * Get all categories with their transaction counts
   */
  async getAllCategories(): Promise<CategoryResponse[]> {
    const categories = await Category.all()

    // Transform to camelCase
    return categories.map((category) => ({
      id: category.id,
      name: category.name,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    }))
  }

  /**
   * Get categories with transaction counts
   */
  async getCategoriesWithTransactionCounts(): Promise<CategoryWithTransactionCount[]> {
    const categories = await db
      .from('categories')
      .leftJoin('transactions', 'categories.id', 'transactions.category_id')
      .select(
        'categories.id',
        'categories.name',
        'categories.created_at as createdAt',
        'categories.updated_at as updatedAt',
        db.raw('COUNT(transactions.id) as transaction_count')
      )
      .groupBy('categories.id', 'categories.name', 'categories.created_at', 'categories.updated_at')
      .orderBy('categories.name')

    return categories.map((category: any) => ({
      id: category.id,
      name: category.name,
      transactionCount: parseInt(category.transaction_count),
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    }))
  }
}
