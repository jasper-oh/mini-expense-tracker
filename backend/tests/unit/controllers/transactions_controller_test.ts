// import { test } from '@japa/runner'
// import { HttpContext } from '@adonisjs/core/http'
// import TransactionsController from '#controllers/transactions_controller'
// import TransactionService from '#services/transaction_service'
// import type { TransactionResponse, CategoryBalanceResponse } from '#types'

// test.group('TransactionsController', (group) => {
//   let controller: TransactionsController
//   let mockTransactionService: TransactionService

//   group.each.setup(async () => {
//     // Create mock service
//     mockTransactionService = {
//       getAllTransactions: async () => [],
//       createTransaction: async () => ({} as TransactionResponse),
//       getCategoryBalances: async () => [],
//     } as any

//     controller = new TransactionsController(mockTransactionService)
//   })

//   test.group('index method', () => {
//     test('should return transactions successfully', async ({ assert }) => {
//       // Arrange
//       const mockTransactions: TransactionResponse[] = [
//         {
//           id: 1,
//           amount: 25.50,
//           currency: 'USD',
//           date: '2024-01-01',
//           description: 'Lunch',
//           categoryId: 1,
//           categoryName: 'Food',
//           createdAt: new Date('2024-01-01'),
//           updatedAt: new Date('2024-01-01'),
//         },
//       ]

//       mockTransactionService.getAllTransactions = async () => mockTransactions

//       const mockResponse = {
//         json: (data: any) => data,
//         status: (code: number) => ({ json: (data: any) => data }),
//       } as any

//       const mockContext = { response: mockResponse } as HttpContext

//       // Act
//       const result = await controller.index(mockContext)

//       // Assert
//       assert.deepEqual(result, {
//         success: true,
//         data: mockTransactions,
//       })
//     })

//     test('should handle service errors gracefully', async ({ assert }) => {
//       // Arrange
//       mockTransactionService.getAllTransactions = async () => {
//         throw new Error('Database error')
//       }

//       const mockResponse = {
//         json: (data: any) => data,
//         status: (code: number) => ({ json: (data: any) => data }),
//       } as any

//       const mockContext = { response: mockResponse } as HttpContext

//       // Act
//       const result = await controller.index(mockContext)

//       // Assert
//       assert.deepEqual(result, {
//         success: false,
//         message: 'Failed to fetch transactions',
//         error: 'Database error',
//       })
//     })
//   })

//   test.group('store method', () => {
//     test('should create transaction successfully with valid data', async ({ assert }) => {
//       // Arrange
//       const mockTransaction: TransactionResponse = {
//         id: 1,
//         amount: 50.00,
//         currency: 'USD',
//         date: '2024-01-01',
//         description: 'Dinner',
//         categoryId: 1,
//         categoryName: 'Food',
//         createdAt: new Date('2024-01-01'),
//         updatedAt: new Date('2024-01-01'),
//       }

//       mockTransactionService.createTransaction = async () => mockTransaction

//       const mockRequest = {
//         only: (fields: string[]) => ({
//           amount: '50.00',
//           currency: 'USD',
//           date: '2024-01-01',
//           description: 'Dinner',
//           category_id: '1',
//         }),
//       } as any

//       const mockResponse = {
//         json: (data: any) => data,
//         status: (code: number) => ({ json: (data: any) => data }),
//       } as any

//       const mockContext = { request: mockRequest, response: mockResponse } as HttpContext

//       // Act
//       const result = await controller.store(mockContext)

//       // Assert
//       assert.deepEqual(result, {
//         success: true,
//         data: mockTransaction,
//       })
//     })

//     test('should return 400 when amount is missing', async ({ assert }) => {
//       // Arrange
//       const mockRequest = {
//         only: (fields: string[]) => ({
//           amount: '',
//           currency: 'USD',
//           date: '2024-01-01',
//           description: 'Dinner',
//           category_id: '1',
//         }),
//       } as any

//       const mockResponse = {
//         json: (data: any) => data,
//         status: (code: number) => ({ json: (data: any) => data }),
//       } as any

//       const mockContext = { request: mockRequest, response: mockResponse } as HttpContext

//       // Act
//       const result = await controller.store(mockContext)

//       // Assert
//       assert.deepEqual(result, {
//         success: false,
//         message: 'All fields are required',
//       })
//     })

//     test('should return 400 when currency is missing', async ({ assert }) => {
//       // Arrange
//       const mockRequest = {
//         only: (fields: string[]) => ({
//           amount: '50.00',
//           currency: '',
//           date: '2024-01-01',
//           description: 'Dinner',
//           category_id: '1',
//         }),
//       } as any

//       const mockResponse = {
//         json: (data: any) => data,
//         status: (code: number) => ({ json: (data: any) => data }),
//       } as any

//       const mockContext = { request: mockRequest, response: mockResponse } as HttpContext

//       // Act
//       const result = await controller.store(mockContext)

//       // Assert
//       assert.deepEqual(result, {
//         success: false,
//         message: 'All fields are required',
//       })
//     })

//     test('should return 400 when date is missing', async ({ assert }) => {
//       // Arrange
//       const mockRequest = {
//         only: (fields: string[]) => ({
//           amount: '50.00',
//           currency: 'USD',
//           date: '',
//           description: 'Dinner',
//           category_id: '1',
//         }),
//       } as any

//       const mockResponse = {
//         json: (data: any) => data,
//         status: (code: number) => ({ json: (data: any) => data }),
//       } as any

//       const mockContext = { request: mockRequest, response: mockResponse } as HttpContext

//       // Act
//       const result = await controller.store(mockContext)

//       // Assert
//       assert.deepEqual(result, {
//         success: false,
//         message: 'All fields are required',
//       })
//     })

//     test('should return 400 when description is missing', async ({ assert }) => {
//       // Arrange
//       const mockRequest = {
//         only: (fields: string[]) => ({
//           amount: '50.00',
//           currency: 'USD',
//           date: '2024-01-01',
//           description: '',
//           category_id: '1',
//         }),
//       } as any

//       const mockResponse = {
//         json: (data: any) => data,
//         status: (code: number) => ({ json: (data: any) => data }),
//       } as any

//       const mockContext = { request: mockRequest, response: mockResponse } as HttpContext

//       // Act
//       const result = await controller.store(mockContext)

//       // Assert
//       assert.deepEqual(result, {
//         success: false,
//         message: 'All fields are required',
//       })
//     })

//     test('should return 400 when category_id is missing', async ({ assert }) => {
//       // Arrange
//       const mockRequest = {
//         only: (fields: string[]) => ({
//           amount: '50.00',
//           currency: 'USD',
//           date: '2024-01-01',
//           description: 'Dinner',
//           category_id: '',
//         }),
//       } as any

//       const mockResponse = {
//         json: (data: any) => data,
//         status: (code: number) => ({ json: (data: any) => data }),
//       } as any

//       const mockContext = { request: mockRequest, response: mockResponse } as HttpContext

//       // Act
//       const result = await controller.store(mockContext)

//       // Assert
//       assert.deepEqual(result, {
//         success: false,
//         message: 'All fields are required',
//       })
//     })

//     test('should return 201 status for successful creation', async ({ assert }) => {
//       // Arrange
//       const mockTransaction: TransactionResponse = {
//         id: 1,
//         amount: 50.00,
//         currency: 'USD',
//         date: '2024-01-01',
//         description: 'Dinner',
//         categoryId: 1,
//         categoryName: 'Food',
//         createdAt: new Date('2024-01-01'),
//         updatedAt: new Date('2024-01-01'),
//       }

//       mockTransactionService.createTransaction = async () => mockTransaction

//       const mockRequest = {
//         only: (fields: string[]) => ({
//           amount: '50.00',
//           currency: 'USD',
//           date: '2024-01-01',
//           description: 'Dinner',
//           category_id: '1',
//         }),
//       } as any

//       let statusCode: number | undefined
//       const mockResponse = {
//         json: (data: any) => data,
//         status: (code: number) => {
//           statusCode = code
//           return { json: (data: any) => data }
//         },
//       } as any

//       const mockContext = { request: mockRequest, response: mockResponse } as HttpContext

//       // Act
//       await controller.store(mockContext)

//       // Assert
//       assert.equal(statusCode, 201)
//     })

//     test('should handle service errors gracefully', async ({ assert }) => {
//       // Arrange
//       mockTransactionService.createTransaction = async () => {
//         throw new Error('Database error')
//       }

//       const mockRequest = {
//         only: (fields: string[]) => ({
//           amount: '50.00',
//           currency: 'USD',
//           date: '2024-01-01',
//           description: 'Dinner',
//           category_id: '1',
//         }),
//       } as any

//       const mockResponse = {
//         json: (data: any) => data,
//         status: (code: number) => ({ json: (data: any) => data }),
//       } as any

//       const mockContext = { request: mockRequest, response: mockResponse } as HttpContext

//       // Act
//       const result = await controller.store(mockContext)

//       // Assert
//       assert.deepEqual(result, {
//         success: false,
//         message: 'Failed to create transaction',
//         error: 'Database error',
//       })
//     })
//   })

//   test.group('getBalanceByCategory method', () => {
//     test('should return category balances successfully', async ({ assert }) => {
//       // Arrange
//       const mockBalances: CategoryBalanceResponse[] = [
//         {
//           categoryId: 1,
//           categoryName: 'Food',
//           transactions: [
//             {
//               id: 1,
//               amount: 25.50,
//               currency: 'USD',
//               date: '2024-01-01',
//               description: 'Lunch',
//               categoryId: 1,
//               categoryName: 'Food',
//               createdAt: new Date('2024-01-01'),
//               updatedAt: new Date('2024-01-01'),
//             },
//           ],
//           total: 25.50,
//         },
//       ]

//       mockTransactionService.getCategoryBalances = async () => mockBalances

//       const mockResponse = {
//         json: (data: any) => data,
//         status: (code: number) => ({ json: (data: any) => data }),
//       } as any

//       const mockContext = { response: mockResponse } as HttpContext

//       // Act
//       const result = await controller.getBalanceByCategory(mockContext)

//       // Assert
//       assert.deepEqual(result, {
//         success: true,
//         data: mockBalances,
//       })
//     })

//     test('should handle service errors gracefully', async ({ assert }) => {
//       // Arrange
//       mockTransactionService.getCategoryBalances = async () => {
//         throw new Error('Database error')
//       }

//       const mockResponse = {
//         json: (data: any) => data,
//         status: (code: number) => ({ json: (data: any) => data }),
//       } as any

//       const mockContext = { response: mockResponse } as HttpContext

//       // Act
//       const result = await controller.getBalanceByCategory(mockContext)

//       // Assert
//       assert.deepEqual(result, {
//         success: false,
//         message: 'Failed to fetch balance by category',
//         error: 'Database error',
//       })
//     })
//   })
// })
