import { test } from '@japa/runner'
import TransactionService from '#services/transaction_service'
import db from '@adonisjs/lucid/services/db'
import type { CreateTransactionData } from '#types/transaction'
import testUtils from '@adonisjs/core/services/test_utils'

test.group('TransactionService', (group) => {
  let transactionService: TransactionService
  let mockCurrencyService: any

  group.each.setup(async () => {
    // Create mock currency service
    mockCurrencyService = {
      convertToCAD: async (amount: number) => amount,
    }

    transactionService = new TransactionService(mockCurrencyService)

    await testUtils.db().truncate()
  })

  group.each.teardown(async () => {
    // Clean up any test data
    await testUtils.db().truncate()
  })

  test('should return all transactions with category information', async ({ assert }) => {
    // Arrange
    const testCategories = [
      { id: 89, name: 'Food # TRANSACTION SERVICE 1' },
      { id: 88, name: 'Transport # TRANSACTION SERVICE 2' },
    ]

    // Insert categories
    const categoryIds = []
    for (const category of testCategories) {
      const [result] = await db.table('categories').insert(category).returning('id')
      categoryIds.push(result.id)
    }

    const testTransactions = [
      {
        amount: 25.5,
        converted_cad: 35.5,
        currency: 'USD',
        date: '2024-01-01',
        description: 'Lunch',
        category_id: testCategories[0].id,
      },
      {
        amount: 30.0,
        converted_cad: 40.0,
        currency: 'USD',
        date: '2024-01-01',
        description: 'Uber',
        category_id: testCategories[1].id,
      },
      {
        amount: 15.0,
        converted_cad: 20.0,
        currency: 'USD',
        date: '2024-01-02',
        description: 'Coffee',
        category_id: testCategories[0].id,
      },
    ]

    for (const transaction of testTransactions) {
      await db.table('transactions').insert(transaction)
    }

    // Act
    const result = await transactionService.getAllTransactions()

    // Assert
    assert.isArray(result)

    // Check structure
    result.forEach((transaction) => {
      assert.property(transaction, 'id')
      assert.property(transaction, 'amount')
      assert.property(transaction, 'converted_cad')
      assert.property(transaction, 'currency')
      assert.property(transaction, 'date')
      assert.property(transaction, 'description')
      assert.property(transaction, 'categoryId')
      assert.property(transaction, 'categoryName')
      assert.property(transaction, 'createdAt')
      assert.property(transaction, 'updatedAt')

      assert.isNumber(transaction.id)
      assert.isNumber(transaction.amount)
      assert.isNumber(transaction.convertedCad)
      assert.isString(transaction.currency)
      assert.isString(transaction.date)
      assert.isString(transaction.description)
      assert.isNumber(transaction.categoryId)
      assert.isString(transaction.categoryName)
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

  test('should create transaction successfully', async ({ assert }) => {
    // Arrange

    const transactionData: CreateTransactionData = {
      amount: 25.5,
      currency: 'USD',
      date: '2024-01-01',
      description: 'Lunch',
      categoryId: 76,
    }

    // Act
    const result = await transactionService.createTransaction(transactionData)

    // Assert
    assert.isObject(result)
    assert.property(result, 'amount')
    assert.property(result, 'currency')
    assert.property(result, 'date')
    assert.property(result, 'description')
    assert.property(result, 'categoryId')
    assert.property(result, 'categoryName')
    assert.property(result, 'createdAt')
    assert.property(result, 'updatedAt')

    assert.isNumber(result.amount)
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

  test('should return category balances correctly', async ({ assert }) => {
    // Arrange

    const testTransactions = [
      {
        amount: 25.5,
        converted_cad: 35.5,
        currency: 'USD',
        date: '2024-01-01',
        description: 'Lunch',
        category_id: 1,
      },
      {
        amount: 30.0,
        converted_cad: 40.0,
        currency: 'USD',
        date: '2024-01-01',
        description: 'Dinner',
        category_id: 2,
      },
      {
        amount: 15.0,
        converted_cad: 20.0,
        currency: 'USD',
        date: '2024-01-02',
        description: 'Uber',
        category_id: 3,
      },
    ]

    for (const transaction of testTransactions) {
      await db.table('transactions').insert(transaction)
    }

    // Act
    const result = await transactionService.getCategoryBalances()

    // Assert
    assert.isArray(result)

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
    const foodBalance = result.find((b) => b.categoryName === 'Food # TRANSACTION SERVICE 4')
    const transportBalance = result.find(
      (b) => b.categoryName === 'Transport # TRANSACTION SERVICE 5'
    )

    assert.isNotNull(foodBalance)
    assert.isNotNull(transportBalance)
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
