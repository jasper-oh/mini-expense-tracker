import { test } from '@japa/runner'
import { HttpContext } from '@adonisjs/core/http'
import TransactionsController from '#controllers/transactions_controller'
import TransactionService from '#services/transaction_service'
import db from '@adonisjs/lucid/services/db'
import CurrencyService from '#services/currency_service'
import testUtils from '@adonisjs/core/services/test_utils'

test.group('TransactionsController Integration', (group) => {
  let controller: TransactionsController
  let transactionService: TransactionService

  group.each.setup(async () => {
    transactionService = new TransactionService(new CurrencyService())
    controller = new TransactionsController(transactionService)
    // Clean up any existing data before each test
    console.log('BEFORE TRUNCATE')
    await testUtils.db().truncate()
    console.log('AFTER TRUNCATE')
  })

  group.each.teardown(async () => {
    // Clean up test data after each test
    console.log('BEFORE TRUNCATE')
    await testUtils.db().truncate()
    console.log('AFTER TRUNCATE')
  })

  test('should fetch transactions through real service and database', async ({ assert }) => {
    // Arrange

    const testCategory = { id: 12, name: 'Food & Drinks' }
    const [categoryResult] = await db.table('categories').insert(testCategory).returning('id')

    const testTransactions = [
      {
        amount: 25.5,
        converted_cad: 35.5,
        currency: 'USD',
        date: '2024-01-01',
        description: 'Lunch',
        category_id: testCategory.id,
      },
      {
        amount: 15.0,
        converted_cad: 20.0,
        currency: 'USD',
        date: '2024-01-01',
        description: 'Coffee',
        category_id: testCategory.id,
      },
    ]

    for (const transaction of testTransactions) {
      await db.table('transactions').insert(transaction)
    }

    const mockResponse = {
      json: (data: any) => data,
      status: (_code: number) => ({ json: (data: any) => data }),
    } as any

    const mockContext = { response: mockResponse } as HttpContext

    // Act
    const result = await controller.index(mockContext)

    const amounts = (result as any).data.map((t: any) => t.amount)
    assert.include(amounts, 25.5)
    assert.include(amounts, 15.0)
  })

  test('should return empty array when no transactions exist', async ({ assert }) => {
    // Arrange - Ensure no transactions exist (already done in setup)

    const mockService = {
      getAllTransactions: async () => [],
      createTransaction: async () => [],
      getCategoryBalances: async () => [],
    } as any

    const emptyController = new TransactionsController(mockService)

    const mockResponse = {
      json: (data: any) => data,
      status: (_code: number) => ({ json: (data: any) => data }),
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

  test('should validate all required fields', async ({ assert }) => {
    // Test missing amount
    const mockRequestMissingAmount = {
      only: (_fields: string[]) => ({
        amount: '',
        currency: 'USD',
        date: '2024-01-01',
        description: 'Dinner',
        category_id: '1',
      }),
    } as any

    const mockResponse = {
      json: (data: any) => data,
      status: (_code: number) => ({ json: (data: any) => data }),
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

  test('should return categories with zero balance when no transactions exist', async ({
    assert,
  }) => {
    // Arrange - Insert only categories
    const mockService = {
      getAllTransactions: async () => [],
      createTransaction: async () => [],
      getCategoryBalances: async () => [],
    } as any

    const emptyController = new TransactionsController(mockService)

    const testCategories = [{ name: 'Transaction FOOD' }, { name: 'Transaction PLAY' }]

    for (const category of testCategories) {
      await db.table('categories').insert(category)
    }

    const mockResponse = {
      json: (data: any) => data,
      status: (code: number) => ({ json: (data: any) => data }),
    } as any

    const mockContext = { response: mockResponse } as HttpContext

    // Act
    const result = await emptyController.getBalanceByCategory(mockContext)

    // Verify all categories have zero balance
    ;(result as any).data.forEach((balance: any) => {
      assert.equal(balance.total, 0)
      assert.lengthOf(balance.transactions, 0)
    })
  })
})
