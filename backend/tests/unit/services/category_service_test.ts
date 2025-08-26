import { test } from '@japa/runner'
import CategoryService from '#services/category_service'
import Category from '#models/category'
import db from '@adonisjs/lucid/services/db'

test.group('CategoryService', (group) => {
  let categoryService: CategoryService

  group.each.setup(async () => {
    categoryService = new CategoryService()
  })

  group.each.teardown(async () => {
    // Clean up any test data
    await db.raw('TRUNCATE TABLE categories CASCADE')
  })

  test.group('getAllCategories', () => {
    test('should return all categories with correct format', async ({ assert }) => {
      // Arrange
      const testCategories = [{ name: 'Food' }, { name: 'Transport' }, { name: 'Entertainment' }]

      // Insert test data
      for (const category of testCategories) {
        await db.table('categories').insert(category)
      }

      // Act
      const result = await categoryService.getAllCategories()

      // Assert
      assert.isArray(result)
      assert.lengthOf(result, 3)

      // Check structure
      result.forEach((category) => {
        assert.property(category, 'id')
        assert.property(category, 'name')
        assert.property(category, 'createdAt')
        assert.property(category, 'updatedAt')
        assert.isNumber(category.id)
        assert.isString(category.name)
        assert.instanceOf(category.createdAt, Date)
        assert.instanceOf(category.updatedAt, Date)
      })

      // Check names
      const names = result.map((c) => c.name)
      assert.include(names, 'Food')
      assert.include(names, 'Transport')
      assert.include(names, 'Entertainment')
    })

    test('should return empty array when no categories exist', async ({ assert }) => {
      // Act
      const result = await categoryService.getAllCategories()

      // Assert
      assert.isArray(result)
      assert.lengthOf(result, 0)
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
  })

  test.group('getCategoriesWithTransactionCounts', () => {
    test('should return categories with transaction counts', async ({ assert }) => {
      // Arrange
      const testCategories = [{ name: 'Food' }, { name: 'Transport' }]

      // Insert categories
      const categoryIds = []
      for (const category of testCategories) {
        const [result] = await db.table('categories').insert(category).returning('id')
        categoryIds.push(result.id)
      }

      const testTransactions = [
        {
          amount: 25.5,
          currency: 'USD',
          date: '2024-01-01',
          description: 'Lunch',
          category_id: categoryIds[0],
        },
        {
          amount: 30.0,
          currency: 'USD',
          date: '2024-01-01',
          description: 'Dinner',
          category_id: categoryIds[0],
        },
        {
          amount: 15.0,
          currency: 'USD',
          date: '2024-01-02',
          description: 'Uber',
          category_id: categoryIds[1],
        },
      ]

      for (const transaction of testTransactions) {
        await db.table('transactions').insert(transaction)
      }

      // Act
      const result = await categoryService.getCategoriesWithTransactionCounts()

      // Assert
      assert.isArray(result)
      assert.lengthOf(result, 2)

      // Check structure
      result.forEach((category) => {
        assert.property(category, 'id')
        assert.property(category, 'name')
        assert.property(category, 'transactionCount')
        assert.property(category, 'createdAt')
        assert.property(category, 'updatedAt')

        assert.isNumber(category.id)
        assert.isString(category.name)
        assert.isNumber(category.transactionCount)
        assert.instanceOf(category.createdAt, Date)
        assert.instanceOf(category.updatedAt, Date)
      })

      // Check specific values
      const foodCategory = result.find((c) => c.name === 'Food')
      const transportCategory = result.find((c) => c.name === 'Transport')

      assert.isNotNull(foodCategory)
      assert.isNotNull(transportCategory)
      assert.equal(foodCategory?.transactionCount, 2)
      assert.equal(transportCategory?.transactionCount, 1)
    })

    test('should return categories with zero transaction count', async ({ assert }) => {
      // Arrange
      const testCategories = [{ name: 'Food' }, { name: 'Transport' }]

      // Insert only categories (no transactions)
      for (const category of testCategories) {
        await db.table('categories').insert(category)
      }

      // Act
      const result = await categoryService.getCategoriesWithTransactionCounts()

      // Assert
      assert.isArray(result)
      assert.lengthOf(result, 2)

      result.forEach((category) => {
        assert.equal(category.transactionCount, 0)
      })
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
})
