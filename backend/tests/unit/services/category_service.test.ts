import { test } from '@japa/runner'
import CategoryService from '#services/category_service'
import Category from '#models/category'
import db from '@adonisjs/lucid/services/db'
import testUtils from '@adonisjs/core/services/test_utils'

test.group('CategoryService', (group) => {
  let categoryService: CategoryService

  group.each.setup(async () => {
    categoryService = new CategoryService()
    await testUtils.db().truncate()
  })

  group.each.teardown(async () => {
    // Clean up any test data
    await testUtils.db().truncate()
  })

  test('should handle database errors gracefully', async ({ assert }) => {
    // Arrange - Mock the Category.all() method to throw an error
    const originalAll = Category.all
    Category.all = async () => {
      throw new Error('Database connection failed')
    }

    // Act & Assert
    try {
      await categoryService.getAllCategories()
      assert.fail('Expected error to be thrown')
    } catch (error) {
      assert.instanceOf(error, Error)
      assert.equal(error.message, 'Database connection failed')
    } finally {
      // Restore original method
      Category.all = originalAll
    }
  })

  test('should return categories with zero transaction count', async ({ assert }) => {
    // Arrange
    const testCategories = [
      { id: 97, name: 'Food # CATEGORY 2' },
      { id: 96, name: 'Transport # CATEGORY 2' },
    ]

    // Insert only categories (no transactions)
    for (const category of testCategories) {
      await db.table('categories').insert(category)
    }

    // Act
    const result = await categoryService.getCategoriesWithTransactionCounts()

    // Assert
    assert.isArray(result)
  })

  test('should handle database errors gracefully', async ({ assert }) => {
    // Arrange - Mock the db.from method to throw an error
    const originalFrom = db.from
    db.from = () => {
      throw new Error('Database connection failed')
    }

    // Act & Assert
    try {
      await categoryService.getCategoriesWithTransactionCounts()
      assert.fail('Expected error to be thrown')
    } catch (error) {
      assert.instanceOf(error, Error)
      assert.equal(error.message, 'Database connection failed')
    } finally {
      // Restore original method
      db.from = originalFrom
    }
  })
})
