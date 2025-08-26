// import { test } from '@japa/runner'
// import { TransactionService } from '#services/transaction_service'
// import db from '@adonisjs/lucid/services/db'
// import type { TransactionResponse, CreateTransactionData, CategoryBalanceResponse } from '#types'

// test.group('TransactionService', (group) => {
//   let transactionService: TransactionService

//   group.each.setup(async () => {
//     transactionService = new TransactionService()
//   })

//   group.each.teardown(async () => {
//     // Clean up any test data
//     await db.raw('TRUNCATE TABLE transactions CASCADE')
//     await db.raw('TRUNCATE TABLE categories CASCADE')
//   })

//   test.group('getAllTransactions', () => {
//     test('should return all transactions with category information', async ({ assert }) => {
//       // Arrange
//       const testCategories = [
//         { name: 'Food' },
//         { name: 'Transport' },
//       ]

//       // Insert categories
//       const categoryIds = []
//       for (const category of testCategories) {
//         const [result] = await db.table('categories').insert(category).returning('id')
//         categoryIds.push(result.id)
//       }

//       const testTransactions = [
//         { amount: 25.50, currency: 'USD', date: '2024-01-01', description: 'Lunch', category_id: categoryIds[0] },
//         { amount: 30.00, currency: 'USD', date: '2024-01-01', description: 'Uber', category_id: categoryIds[1] },
//         { amount: 15.00, currency: 'USD', date: '2024-01-02', description: 'Coffee', category_id: categoryIds[0] },
//       ]

//       for (const transaction of testTransactions) {
//         await db.table('transactions').insert(transaction)
//       }

//       // Act
//       const result = await transactionService.getAllTransactions()

//       // Assert
//       assert.isArray(result)
//       assert.lengthOf(result, 3)

//       // Check structure
//       result.forEach((transaction) => {
//         assert.property(transaction, 'id')
//         assert.property(transaction, 'amount')
//         assert.property(transaction, 'currency')
//         assert.property(transaction, 'date')
//         assert.property(transaction, 'description')
//         assert.property(transaction, 'categoryId')
//         assert.property(transaction, 'categoryName')
//         assert.property(transaction, 'createdAt')
//         assert.property(transaction, 'updatedAt')

//         assert.isNumber(transaction.id)
//         assert.isNumber(transaction.amount)
//         assert.isString(transaction.currency)
//         assert.isString(transaction.date)
//         assert.isString(transaction.description)
//         assert.isNumber(transaction.categoryId)
//         assert.isString(transaction.categoryName)
//         assert.instanceOf(transaction.createdAt, Date)
//         assert.instanceOf(transaction.updatedAt, Date)
//       })

//       // Check amounts are parsed as numbers
//       result.forEach((transaction) => {
//         assert.isNumber(transaction.amount)
//         assert.notStrictEqual(transaction.amount, '25.50') // Should not be string
//       })

//       // Check ordering (should be by created_at desc)
//       const dates = result.map(t => t.createdAt)
//       assert.isTrue(dates[0] >= dates[1] && dates[1] >= dates[2])
//     })

//     test('should return empty array when no transactions exist', async ({ assert }) => {
//       // Act
//       const result = await transactionService.getAllTransactions()

//       // Assert
//       assert.isArray(result)
//       assert.lengthOf(result, 0)
//     })

//     test('should handle database errors gracefully', async ({ assert }) => {
//       // Arrange - Mock the db.from method to throw an error
//       const originalFrom = db.from
//       db.from = () => {
//         throw new Error('Database query failed')
//       } as any

//       // Act & Assert
//       try {
//         await transactionService.getAllTransactions()
//         assert.fail('Expected error to be thrown')
//       } catch (error) {
//         assert.instanceOf(error, Error)
//         assert.equal(error.message, 'Database query failed')
//       } finally {
//         // Restore original method
//         db.from = originalFrom
//       }
//     })
//   })

//   test.group('createTransaction', () => {
//     test('should create transaction successfully', async ({ assert }) => {
//       // Arrange
//       const testCategory = { name: 'Food' }
//       const [categoryResult] = await db.table('categories').insert(testCategory).returning('id')

//       const transactionData: CreateTransactionData = {
//         amount: 50.00,
//         currency: 'USD',
//         date: '2024-01-01',
//         description: 'Dinner',
//         categoryId: categoryResult.id,
//       }

//       // Act
//       const result = await transactionService.createTransaction(transactionData)

//       // Assert
//       assert.exists(result)
//       assert.property(result, 'id')
//       assert.property(result, 'amount')
//       assert.property(result, 'currency')
//       assert.property(result, 'date')
//       assert.property(result, 'description')
//       assert.property(result, 'categoryId')
//       assert.property(result, 'categoryName')
//       assert.property(result, 'createdAt')
//       assert.property(result, 'updatedAt')

//       assert.isNumber(result.id)
//       assert.equal(result.amount, 50.00)
//       assert.equal(result.currency, 'USD')
//       assert.equal(result.date, '2024-01-01')
//       assert.equal(result.description, 'Dinner')
//       assert.equal(result.categoryId, categoryResult.id)
//       assert.equal(result.categoryName, 'Food')
//       assert.instanceOf(result.createdAt, Date)
//       assert.instanceOf(result.updatedAt, Date)

//       // Verify transaction was actually created in database
//       const dbTransaction = await db.from('transactions').where('id', result.id).first()
//       assert.exists(dbTransaction)
//       assert.equal(dbTransaction.amount, '50.00') // Database stores as string
//       assert.equal(dbTransaction.currency, 'USD')
//       assert.equal(dbTransaction.date, '2024-01-01')
//       assert.equal(dbTransaction.description, 'Dinner')
//       assert.equal(dbTransaction.category_id, categoryResult.id)
//     })

//     test('should handle unknown category gracefully', async ({ assert }) => {
//       // Arrange
//       const transactionData: CreateTransactionData = {
//         amount: 50.00,
//         currency: 'USD',
//         date: '2024-01-01',
//         description: 'Dinner',
//         categoryId: 999, // Non-existent category
//       }

//       // Act
//       const result = await transactionService.createTransaction(transactionData)

//       // Assert
//       assert.exists(result)
//       assert.equal(result.categoryName, 'Unknown Category')
//     })

//     test('should handle database errors gracefully', async ({ assert }) => {
//       // Arrange
//       const transactionData: CreateTransactionData = {
//         amount: 50.00,
//         currency: 'USD',
//         date: '2024-01-01',
//         description: 'Dinner',
//         categoryId: 1,
//       }

//       // Mock the db.table method to throw an error
//       const originalTable = db.table
//       db.table = () => {
//         throw new Error('Database insert failed')
//       } as any

//       // Act & Assert
//       try {
//         await transactionService.createTransaction(transactionData)
//         assert.fail('Expected error to be thrown')
//       } catch (error) {
//         assert.instanceOf(error, Error)
//         assert.equal(error.message, 'Database insert failed')
//       } finally {
//         // Restore original method
//         db.table = originalTable
//       }
//     })
//   })

//   test.group('getCategoryBalances', () => {
//     test('should return category balances with transactions', async ({ assert }) => {
//       // Arrange
//       const testCategories = [
//         { name: 'Food' },
//         { name: 'Transport' },
//       ]

//       // Insert categories
//       const categoryIds = []
//       for (const category of testCategories) {
//         const [result] = await db.table('categories').insert(category).returning('id')
//         categoryIds.push(result.id)
//       }

//       const testTransactions = [
//         { amount: 25.50, currency: 'USD', date: '2024-01-01', description: 'Lunch', category_id: categoryIds[0] },
//         { amount: 15.00, currency: 'USD', date: '2024-01-01', description: 'Coffee', category_id: categoryIds[0] },
//         { amount: 30.00, currency: 'USD', date: '2024-01-01', description: 'Uber', category_id: categoryIds[1] },
//       ]

//       for (const transaction of testTransactions) {
//         await db.table('transactions').insert(transaction)
//       }

//       // Act
//       const result = await transactionService.getCategoryBalances()

//       // Assert
//       assert.isArray(result)
//       assert.lengthOf(result, 2)

//       // Check structure
//       result.forEach((balance) => {
//         assert.property(balance, 'categoryId')
//         assert.property(balance, 'categoryName')
//         assert.property(balance, 'transactions')
//         assert.property(balance, 'total')

//         assert.isNumber(balance.categoryId)
//         assert.isString(balance.categoryName)
//         assert.isArray(balance.transactions)
//         assert.isNumber(balance.total)
//       })

//       // Check totals
//       const foodBalance = result.find(b => b.categoryName === 'Food')
//       const transportBalance = result.find(b => b.categoryName === 'Transport')

//       assert.exists(foodBalance)
//       assert.exists(transportBalance)
//       assert.equal(foodBalance!.total, 40.50) // 25.50 + 15.00
//       assert.equal(transportBalance!.total, 30.00)

//       // Check transaction counts
//       assert.lengthOf(foodBalance!.transactions, 2)
//       assert.lengthOf(transportBalance!.transactions, 1)

//       // Check sorting (should be by total descending)
//       assert.isTrue(result[0].total >= result[1].total)
//     })

//     test('should return categories with zero balance when no transactions exist', async ({ assert }) => {
//       // Arrange
//       const testCategories = [
//         { name: 'Food' },
//         { name: 'Transport' },
//       ]

//       // Insert only categories
//       for (const category of testCategories) {
//         await db.table('categories').insert(category)
//       }

//       // Act
//       const result = await transactionService.getCategoryBalances()

//       // Assert
//       assert.isArray(result)
//       assert.lengthOf(result, 2)

//       result.forEach((balance) => {
//         assert.equal(balance.total, 0)
//         assert.lengthOf(balance.transactions, 0)
//       })
//     })

//     test('should handle database errors gracefully', async ({ assert }) => {
//       // Arrange - Mock the db.from method to throw an error
//       const originalFrom = db.from
//       db.from = () => {
//         throw new Error('Database query failed')
//       } as any

//       // Act & Assert
//       try {
//         await transactionService.getCategoryBalances()
//         assert.fail('Expected error to be thrown')
//       } catch (error) {
//         assert.instanceOf(error, Error)
//         assert.equal(error.message, 'Database query failed')
//       } finally {
//         // Restore original method
//         db.from = originalFrom
//       }
//     })

//     test('should handle mixed currency transactions correctly', async ({ assert }) => {
//       // Arrange
//       const testCategory = { name: 'Mixed' }
//       const [categoryResult] = await db.table('categories').insert(testCategory).returning('id')

//       const testTransactions = [
//         { amount: 25.50, currency: 'USD', date: '2024-01-01', description: 'USD Transaction', category_id: categoryResult.id },
//         { amount: 30.00, currency: 'EUR', date: '2024-01-01', description: 'EUR Transaction', category_id: categoryResult.id },
//       ]

//       for (const transaction of testTransactions) {
//         await db.table('transactions').insert(transaction)
//       }

//       // Act
//       const result = await transactionService.getCategoryBalances()

//       // Assert
//       assert.isArray(result)
//       assert.lengthOf(result, 1)

//       const mixedBalance = result[0]
//       assert.equal(mixedBalance.categoryName, 'Mixed')
//       assert.equal(mixedBalance.total, 55.50) // 25.50 + 30.00
//       assert.lengthOf(mixedBalance.transactions, 2)

//       // Check that currencies are preserved in individual transactions
//       const usdTransaction = mixedBalance.transactions.find(t => t.currency === 'USD')
//       const eurTransaction = mixedBalance.transactions.find(t => t.currency === 'EUR')

//       assert.exists(usdTransaction)
//       assert.exists(eurTransaction)
//       assert.equal(usdTransaction!.amount, 25.50)
//       assert.equal(eurTransaction!.amount, 30.00)
//     })
//   })
// })
