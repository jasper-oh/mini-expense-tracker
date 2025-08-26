import { test } from '@japa/runner'
import { HttpContext } from '@adonisjs/core/http'
import TransactionsController from '#controllers/transactions_controller'
import TransactionService from '#services/transaction_service'
import db from '@adonisjs/lucid/services/db'
import CurrencyService from '#services/currency_service'
import { DateTime } from 'luxon'

test.group('TransactionsController Integration', (group) => {
  let controller: TransactionsController
  let transactionService: TransactionService

  group.each.setup(async () => {
    transactionService = new TransactionService(new CurrencyService())
    controller = new TransactionsController(transactionService)
  })

  group.each.teardown(async () => {
    // Clean up test data
    await db.raw('TRUNCATE TABLE transactions CASCADE')
    await db.raw('TRUNCATE TABLE categories CASCADE')
  })

  test.group('index method', () => {
    test('should fetch transactions through real service and database', async ({ assert }) => {
      // Arrange
      const testCategory = { name: 'Food' }
      const [categoryResult] = await db.table('categories').insert(testCategory).returning('id')

      const testTransactions = [
        {
          amount: 25.5,
          currency: 'USD',
          date: '2024-01-01',
          description: 'Lunch',
          category_id: categoryResult.id,
        },
        {
          amount: 15.0,
          currency: 'USD',
          date: '2024-01-01',
          description: 'Coffee',
          category_id: categoryResult.id,
        },
      ]

      for (const transaction of testTransactions) {
        await db.table('transactions').insert(transaction)
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
            amount: assert.isNumber(25.5),
            currency: assert.isString('USD'),
            date: assert.isString('2024-01-01'),
            description: assert.isString('Lunch'),
            categoryId: assert.isNumber(1),
            categoryName: assert.isString('Food'),
            createdAt: assert.isObject(DateTime.fromISO('2024-01-01')),
            updatedAt: assert.isObject(DateTime.fromISO('2024-01-01')),
          },
        ],
      })

      // Verify data was actually fetched from database
      assert.lengthOf((result as any).data, 2)

      const amounts = (result as any).data.map((t: any) => t.amount)
      assert.include(amounts, 25.5)
      assert.include(amounts, 15.0)
    })

    test('should return empty array when no transactions exist', async ({ assert }) => {
      // Arrange - Ensure no transactions exist
      await db.raw('TRUNCATE TABLE transactions CASCADE')

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

  test.group('store method', () => {
    test('should create transaction through real service and database', async ({ assert }) => {
      // Arrange
      const testCategory = { name: 'Food' }
      const [categoryResult] = await db.table('categories').insert(testCategory).returning('id')

      const mockRequest = {
        only: (fields: string[]) => ({
          amount: '50.00',
          currency: 'USD',
          date: '2024-01-01',
          description: 'Dinner',
          category_id: categoryResult.id.toString(),
        }),
      } as any

      const mockResponse = {
        json: (data: any) => data,
        status: (code: number) => ({ json: (data: any) => data }),
      } as any

      const mockContext = { request: mockRequest, response: mockResponse } as HttpContext

      // Act
      const result = await controller.store(mockContext)

      // Assert
      assert.deepEqual(result, {
        success: true,
        data: [
          {
            id: assert.isNumber(1),
            amount: assert.isNumber(50.0),
            currency: assert.isString('USD'),
            date: assert.isString('2024-01-01'),
            description: assert.isString('Dinner'),
            categoryId: categoryResult.id,
            categoryName: 'Food',
            createdAt: assert.isObject(DateTime.fromISO('2024-01-01')),
            updatedAt: assert.isObject(DateTime.fromISO('2024-01-01')),
          },
        ],
      })

      // Verify transaction was actually created in database
      const dbTransaction = await db
        .from('transactions')
        .where('id', (result as any).data.id)
        .first()
      assert.exists(dbTransaction)
      assert.equal(dbTransaction.amount, '50.00')
      assert.equal(dbTransaction.currency, 'USD')
      assert.equal(dbTransaction.date, '2024-01-01')
      assert.equal(dbTransaction.description, 'Dinner')
      assert.equal(dbTransaction.category_id, categoryResult.id)
    })

    test('should validate all required fields', async ({ assert }) => {
      // Test missing amount
      const mockRequestMissingAmount = {
        only: (fields: string[]) => ({
          amount: '',
          currency: 'USD',
          date: '2024-01-01',
          description: 'Dinner',
          category_id: '1',
        }),
      } as any

      const mockResponse = {
        json: (data: any) => data,
        status: (code: number) => ({ json: (data: any) => data }),
      } as any

      const mockContext = {
        request: mockRequestMissingAmount,
        response: mockResponse,
      } as HttpContext

      const result = await controller.store(mockContext)
      assert.deepEqual(result, {
        success: false,
        message: 'All fields are required',
      })
    })

    test('should handle service errors gracefully', async ({ assert }) => {
      // Arrange - Create a mock service that throws an error
      const mockService = {
        getAllTransactions: async () => [],
        createTransaction: async () => {
          throw new Error('Database insert failed')
        },
        getCategoryBalances: async () => [],
      } as any

      const errorController = new TransactionsController(mockService)

      const mockRequest = {
        only: (fields: string[]) => ({
          amount: '50.00',
          currency: 'USD',
          date: '2024-01-01',
          description: 'Dinner',
          category_id: '1',
        }),
      } as any

      const mockResponse = {
        json: (data: any) => data,
        status: (code: number) => ({ json: (data: any) => data }),
      } as any

      const mockContext = { request: mockRequest, response: mockResponse } as HttpContext

      // Act
      const result = await errorController.store(mockContext)

      // Assert
      assert.deepEqual(result, {
        success: false,
        message: 'Failed to create transaction',
        error: 'Database insert failed',
      })
    })
  })

  test.group('getBalanceByCategory method', () => {
    test('should fetch category balances through real service and database', async ({ assert }) => {
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
          amount: 15.0,
          currency: 'USD',
          date: '2024-01-01',
          description: 'Coffee',
          category_id: categoryIds[0],
        },
        {
          amount: 30.0,
          currency: 'USD',
          date: '2024-01-01',
          description: 'Uber',
          category_id: categoryIds[1],
        },
      ]

      for (const transaction of testTransactions) {
        await db.table('transactions').insert(transaction)
      }

      const mockResponse = {
        json: (data: any) => data,
        status: (code: number) => ({ json: (data: any) => data }),
      } as any

      const mockContext = { response: mockResponse } as HttpContext

      // Act
      const result = await controller.getBalanceByCategory(mockContext)

      // Assert
      assert.deepEqual(result, {
        success: true,
        data: [
          {
            categoryId: assert.isNumber(1),
            categoryName: assert.isString('Food'),
            transactions: [],
            total: assert.isNumber(40.5),
          },
        ],
      })

      // Verify data was actually fetched from database
      assert.lengthOf((result as any).data, 2)

      const foodBalance = (result as any).data.find((b: any) => b.categoryName === 'Food')
      const transportBalance = (result as any).data.find((b: any) => b.categoryName === 'Transport')

      assert.exists(foodBalance)
      assert.exists(transportBalance)
      assert.equal(foodBalance!.total, 40.5) // 25.50 + 15.00
      assert.equal(transportBalance!.total, 30.0)
    })

    test('should return categories with zero balance when no transactions exist', async ({
      assert,
    }) => {
      // Arrange - Insert only categories
      const testCategories = [{ name: 'Food' }, { name: 'Transport' }]

      for (const category of testCategories) {
        await db.table('categories').insert(category)
      }

      const mockResponse = {
        json: (data: any) => data,
        status: (code: number) => ({ json: (data: any) => data }),
      } as any

      const mockContext = { response: mockResponse } as HttpContext

      // Act
      const result = await controller.getBalanceByCategory(mockContext)

      // Assert
      assert.deepEqual(result, {
        success: true,
        data: [
          {
            categoryId: assert.isNumber(1),
            categoryName: assert.isString('Food'),
            transactions: [],
            total: 0,
          },
        ],
      })

      // Verify all categories have zero balance
      ;(result as any).data.forEach((balance: any) => {
        assert.equal(balance.total, 0)
        assert.lengthOf(balance.transactions, 0)
      })
    })
  })
})
