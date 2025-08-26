import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import CategoryService from '#services/category_service'
import type { ApiResponse, ErrorResponse } from '../types/index.js'

@inject()
export default class CategoriesController {
  constructor(private categoryService: CategoryService) {}

  /**
   * Display a list of categories
   */
  async index({ response }: HttpContext) {
    try {
      const categories = await this.categoryService.getAllCategories()

      return response.json({
        success: true,
        data: categories,
      } as ApiResponse)
    } catch (error) {
      return response.status(500).json({
        success: false,
        message: 'Failed to fetch categories',
        error: error instanceof Error ? error.message : 'Unknown error',
      } as ErrorResponse)
    }
  }
}
