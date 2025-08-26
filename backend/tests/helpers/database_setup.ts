// import db from '@adonisjs/lucid/services/db'

// /**
//  * Helper functions for database operations in tests
//  */

// export async function setupTestDatabase() {
//   // Ensure database connection is established
//   await db.manager.closeAll()
//   await db.manager.connection('test').connect()
// }

// export async function cleanupTestDatabase() {
//   // Clean up all test data
//   try {
//     await db.raw('TRUNCATE TABLE transactions CASCADE')
//     await db.raw('TRUNCATE TABLE categories CASCADE')
//   } catch (error) {
//     console.warn('Error during test cleanup:', error)
//   }
// }

// export async function insertTestCategory(name: string) {
//   const [result] = await db.table('categories').insert({ name }).returning('id')
//   return result.id
// }

// export async function insertTestTransaction(data: {
//   amount: number
//   currency: string
//   date: string
//   description: string
//   category_id: number
// }) {
//   const [result] = await db.table('transactions').insert(data).returning('id')
//   return result.id
// }

// export async function getTestCategories() {
//   return await db.from('categories').select('*')
// }

// export async function getTestTransactions() {
//   return await db.from('transactions').select('*')
// }
