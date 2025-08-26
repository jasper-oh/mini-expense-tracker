import { test } from '@japa/runner'
import { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import CategoriesController from '#controllers/categories_controller'
import CategoryService from '#services/category_service'
import db from '@adonisjs/lucid/services/db'

test.group('CategoriesController Integration', (group) => {
  let controller: CategoriesController
  let categoryService: CategoryService

  group.each.setup(async () => {
    categoryService = new CategoryService()
    controller = new CategoriesController(categoryService)
  })

  group.each.teardown(async () => {
    // Clean up test data
    await db.raw('TRUNCATE TABLE categories CASCADE')
  })

  test('should fetch categories through real service and database', async ({ assert }) => {
    // Arrange
    const testCategories = [{ name: 'Food' }, { name: 'Transport' }, { name: 'Entertainment' }]

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

    // Assert
    assert.deepEqual(result, {
      success: true,
      data: [
        {
          id: assert.isNumber(1),
          name: assert.isString('Food'),
          createdAt: assert.isObject(DateTime.fromISO('2024-01-01')),
          updatedAt: assert.isObject(DateTime.fromISO('2024-01-01')),
        },
      ],
    })

    // Verify data was actually fetched from database
    assert.lengthOf((result as any).data, 3)

    const names = (result as any).data.map((c: any) => c.name)
    assert.include(names, 'Food')
    assert.include(names, 'Transport')
    assert.include(names, 'Entertainment')
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
    await db.raw('TRUNCATE TABLE categories CASCADE')

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
      data: [],
    })
  })
})
