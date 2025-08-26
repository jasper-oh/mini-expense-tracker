import { test } from '@japa/runner'
import { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import CategoriesController from '#controllers/categories_controller'
import CategoryService from '#services/category_service'
import { CategoryResponse } from '#types/category'

test.group('CategoriesController', (group) => {
  let controller: CategoriesController
  let mockCategoryService: CategoryService

  group.each.setup(async () => {
    // Create mock service
    mockCategoryService = {
      getAllCategories: async () => [],
    } as any

    controller = new CategoriesController(mockCategoryService)
  })

  test('should return categories successfully', async ({ assert }) => {
    // Arrange
    const mockCategories: CategoryResponse[] = [
      {
        id: 1,
        name: 'Food',
        createdAt: DateTime.fromISO('2024-01-01'),
        updatedAt: DateTime.fromISO('2024-01-01'),
      },
      {
        id: 2,
        name: 'Transport',
        createdAt: DateTime.fromISO('2024-01-01'),
        updatedAt: DateTime.fromISO('2024-01-01'),
      },
    ]

    mockCategoryService.getAllCategories = async () => mockCategories

    const mockResponse = {
      json: (data: any) => data,
      status: (code: number) => ({ json: (data: any) => data }),
    } as any

    const mockContext = { response: mockResponse } as HttpContext

    // Act
    const result = await controller.index(mockContext)

    // Assert
    assert.deepEqual(result, {
      success: true,
      data: mockCategories,
    })
  })

  test('should handle service errors gracefully', async ({ assert }) => {
    // Arrange
    const errorMessage = 'Database connection failed'
    mockCategoryService.getAllCategories = async () => {
      throw new Error(errorMessage)
    }

    const mockResponse = {
      json: (data: any) => data,
      status: (code: number) => ({ json: (data: any) => data }),
    } as any

    const mockContext = { response: mockResponse } as HttpContext

    // Act
    const result = await controller.index(mockContext)

    // Assert
    assert.deepEqual(result, {
      success: false,
      message: 'Failed to fetch categories',
      error: errorMessage,
    })
  })

  test('should handle unknown errors', async ({ assert }) => {
    // Arrange
    mockCategoryService.getAllCategories = async () => {
      throw 'String error' // Non-Error object
    }

    const mockResponse = {
      json: (data: any) => data,
      status: (code: number) => ({ json: (data: any) => data }),
    } as any

    const mockContext = { response: mockResponse } as HttpContext

    // Act
    const result = await controller.index(mockContext)

    // Assert
    assert.deepEqual(result, {
      success: false,
      message: 'Failed to fetch categories',
      error: 'String error',
    })
  })

  test('should return 500 status for errors', async ({ assert }) => {
    // Arrange
    mockCategoryService.getAllCategories = async () => {
      throw new Error('Service error')
    }

    let statusCode: number | undefined
    const mockResponse = {
      json: (data: any) => data,
      status: (code: number) => {
        statusCode = code
        return { json: (data: any) => data }
      },
    } as any

    const mockContext = { response: mockResponse } as HttpContext

    // Act
    await controller.index(mockContext)

    // Assert
    assert.equal(statusCode, 500)
  })
})
