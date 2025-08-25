import { inject } from '@adonisjs/core'
import Category from '../models/category.js'

@inject()
export default class CategoryService {
  /**
   * Get all categories
   */
  async getAllCategories() {
    const categories = await Category.all()

    // Transform to camelCase
    return categories.map((category) => ({
      id: category.id,
      name: category.name,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    }))
  }
}
