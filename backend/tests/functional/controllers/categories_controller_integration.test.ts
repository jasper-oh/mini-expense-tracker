import { test } from '@japa/runner'
import { HttpContext } from '@adonisjs/core/http'
import CategoriesController from '#controllers/categories_controller'
import CategoryService from '#services/category_service'
import testUtils from '@adonisjs/core/services/test_utils'
import db from '@adonisjs/lucid/services/db'

test.group('CategoriesController Integration', (group) => {
  let controller: CategoriesController
  let categoryService: CategoryService

  group.each.setup(async () => {
    categoryService = new CategoryService()
    controller = new CategoriesController(categoryService)
    console.log('BEFORE TRUNCATE')
    await testUtils.db().truncate()
    console.log('AFTER TRUNCATE')
  })

  group.each.teardown(async () => {
    // Clean up test data
    console.log('BEFORE TRUNCATE')
    await testUtils.db().truncate()
    console.log('AFTER TRUNCATE')
  })

  test('should fetch categories through real service and database', async ({ assert }) => {
    // Arrange
    const testCategories = [
      { name: 'Food # CATEGORY CONTROLLER INTEGRATION 1' },
      { name: 'Transport # CATEGORY CONTROLLER INTEGRATION 2' },
      { name: 'Entertainment # CATEGORY CONTROLLER INTEGRATION 3' },
    ]

    // Insert test data into database
    for (const category of testCategories) {
      await db.table('categories').insert(category)
    }

    const mockResponse = {
      json: (data: any) => data,
      status: (code: number) => ({ json: (data: any) => data }),
    } as any

    const mockContext = { response: mockResponse } as HttpContext

    // Act
    const result = await controller.index(mockContext)

    const names = (result as any).data.map((c: any) => c.name)
    assert.include(names, 'Food # CATEGORY CONTROLLER INTEGRATION 1')
    assert.include(names, 'Transport # CATEGORY CONTROLLER INTEGRATION 2')
    assert.include(names, 'Entertainment # CATEGORY CONTROLLER INTEGRATION 3')
  })

  test('should handle database connection errors gracefully', async ({ assert }) => {
    // Arrange - Create a mock service that throws an error
    const mockService = {
      getAllCategories: async () => {
        throw new Error('Database connection failed')
      },
    } as any

    const errorController = new CategoriesController(mockService)

    const mockResponse = {
      json: (data: any) => data,
      status: (code: number) => ({ json: (data: any) => data }),
    } as any

    const mockContext = { response: mockResponse } as HttpContext

    // Act
    const result = await errorController.index(mockContext)

    // Assert
    assert.deepEqual(result, {
      success: false,
      message: 'Failed to fetch categories',
      error: 'Database connection failed',
    })
  })

  test('should return empty array when no categories exist', async ({ assert }) => {
    // Arrange - Ensure no categories exist

    const mockService = {
      getAllCategories: async () => [],
    } as any

    const emptyController = new CategoriesController(mockService)

    const mockResponse = {
      json: (data: any) => data,
      status: (code: number) => ({ json: (data: any) => data }),
    } as any

    const mockContext = { response: mockResponse } as HttpContext

    // Act
    const result = await emptyController.index(mockContext)

    // Assert
    assert.deepEqual(result, {
      success: true,
      data: [],
    })
  })
})
