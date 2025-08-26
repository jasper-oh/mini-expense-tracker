import { test } from '@japa/runner'
import TransactionService from '#services/transaction_service'
import db from '@adonisjs/lucid/services/db'
import type { CreateTransactionData } from '#types/transaction'

test.group('TransactionService', (group) => {
  let transactionService: TransactionService
  let mockCurrencyService: any

  group.each.setup(async () => {
    // Create mock currency service
    mockCurrencyService = {
      convertToCAD: async (amount: number, currency: string, date: string) => amount,
    }

    transactionService = new TransactionService(mockCurrencyService)
  })

  group.each.teardown(async () => {
    // Clean up any test data
    await db.raw('TRUNCATE TABLE transactions CASCADE')
    await db.raw('TRUNCATE TABLE categories CASCADE')
  })

  test.group('getAllTransactions', () => {
    test('should return all transactions with category information', async ({ assert }) => {
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
          description: 'Uber',
          category_id: categoryIds[1],
        },
        {
          amount: 15.0,
          currency: 'USD',
          date: '2024-01-02',
          description: 'Coffee',
          category_id: categoryIds[0],
        },
      ]

      for (const transaction of testTransactions) {
        await db.table('transactions').insert(transaction)
      }

      // Act
      const result = await transactionService.getAllTransactions()

      // Assert
      assert.isArray(result)
      assert.lengthOf(result, 3)

      // Check structure
      result.forEach((transaction) => {
        assert.property(transaction, 'id')
        assert.property(transaction, 'amount')
        assert.property(transaction, 'currency')
        assert.property(transaction, 'date')
        assert.property(transaction, 'description')
        assert.property(transaction, 'categoryId')
        assert.property(transaction, 'categoryName')
        assert.property(transaction, 'createdAt')
        assert.property(transaction, 'updatedAt')

        assert.isNumber(transaction.id)
        assert.isNumber(transaction.amount)
        assert.isString(transaction.currency)
        assert.isString(transaction.date)
        assert.isString(transaction.description)
        assert.isNumber(transaction.categoryId)
        assert.isString(transaction.categoryName)
        assert.instanceOf(transaction.createdAt, Date)
        assert.instanceOf(transaction.updatedAt, Date)
      })

      // Check amounts are parsed as numbers
      result.forEach((transaction) => {
        assert.isNumber(transaction.amount)
        assert.notStrictEqual(transaction.amount, '25.50') // Should not be string
      })

      // Check ordering (should be by created_at desc)
      const dates = result.map((t) => t.createdAt)
      assert.isTrue(dates[0] >= dates[1] && dates[1] >= dates[2])
    })

    test('should return empty array when no transactions exist', async ({ assert }) => {
      // Act
      const result = await transactionService.getAllTransactions()

      // Assert
      assert.isArray(result)
      assert.lengthOf(result, 0)
    })

    test('should handle database errors gracefully', async ({ assert }) => {
      // Arrange - Mock the db.from method to throw an error
      const originalFrom = db.from
      db.from = () => {
        throw new Error('Database query failed')
      }

      // Act & Assert
      try {
        await transactionService.getAllTransactions()
        assert.fail('Expected error to be thrown')
      } catch (error) {
        assert.instanceOf(error, Error)
        assert.equal(error.message, 'Database query failed')
      } finally {
        // Restore original method
        db.from = originalFrom
      }
    })
  })

  test.group('createTransaction', () => {
    test('should create transaction successfully', async ({ assert }) => {
      // Arrange
      const testCategory = { name: 'Food' }
      const [categoryResult] = await db.table('categories').insert(testCategory).returning('*')

      const transactionData: CreateTransactionData = {
        amount: 25.5,
        currency: 'USD',
        date: '2024-01-01',
        description: 'Lunch',
        categoryId: categoryResult.id,
      }

      // Act
      const result = await transactionService.createTransaction(transactionData)

      // Assert
      assert.isObject(result)
      assert.property(result, 'id')
      assert.property(result, 'amount')
      assert.property(result, 'currency')
      assert.property(result, 'date')
      assert.property(result, 'description')
      assert.property(result, 'categoryId')
      assert.property(result, 'categoryName')
      assert.property(result, 'createdAt')
      assert.property(result, 'updatedAt')

      assert.isNumber(result.id)
      assert.isNumber(result.amount)
      assert.equal(result.amount, 25.5)
      assert.equal(result.currency, 'USD')
      assert.equal(result.date, '2024-01-01')
      assert.equal(result.description, 'Lunch')
      assert.equal(result.categoryId, categoryResult.id)
      assert.equal(result.categoryName, 'Food')
    })

    test('should handle service errors gracefully', async ({ assert }) => {
      // Arrange
      const transactionData: CreateTransactionData = {
        amount: 25.5,
        currency: 'USD',
        date: '2024-01-01',
        description: 'Lunch',
        categoryId: 999, // Non-existent category
      }

      // Act & Assert
      try {
        await transactionService.createTransaction(transactionData)
        assert.fail('Expected error to be thrown')
      } catch (error) {
        assert.instanceOf(error, Error)
      }
    })
  })

  test.group('getCategoryBalances', () => {
    test('should return category balances correctly', async ({ assert }) => {
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
      const result = await transactionService.getCategoryBalances()

      // Assert
      assert.isArray(result)
      assert.lengthOf(result, 2)

      // Check structure
      result.forEach((balance) => {
        assert.property(balance, 'categoryId')
        assert.property(balance, 'categoryName')
        assert.property(balance, 'transactions')
        assert.property(balance, 'total')

        assert.isNumber(balance.categoryId)
        assert.isString(balance.categoryName)
        assert.isArray(balance.transactions)
        assert.isNumber(balance.total)
      })

      // Check specific values
      const foodBalance = result.find((b) => b.categoryName === 'Food')
      const transportBalance = result.find((b) => b.categoryName === 'Transport')

      assert.isNotNull(foodBalance)
      assert.isNotNull(transportBalance)
      assert.lengthOf(foodBalance!.transactions, 2)
      assert.lengthOf(transportBalance!.transactions, 1)
    })

    test('should return empty array when no categories exist', async ({ assert }) => {
      // Act
      const result = await transactionService.getCategoryBalances()

      // Assert
      assert.isArray(result)
      assert.lengthOf(result, 0)
    })

    test('should handle database errors gracefully', async ({ assert }) => {
      // Arrange - Mock the db.from method to throw an error
      const originalFrom = db.from
      db.from = () => {
        throw new Error('Database query failed')
      }

      // Act & Assert
      try {
        await transactionService.getCategoryBalances()
        assert.fail('Expected error to be thrown')
      } catch (error) {
        assert.instanceOf(error, Error)
        assert.equal(error.message, 'Database query failed')
      } finally {
        // Restore original method
        db.from = originalFrom
      }
    })
  })
})
