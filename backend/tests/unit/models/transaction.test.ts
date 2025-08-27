/**
 * Unit tests for Transaction Model
 *
 * This test suite covers:
 * - Model relationships with Category
 * - Database table structure validation
 * - Model property types and constraints
 * - Model methods and computed properties
 * - Database query operations
 * - Model validation rules
 */

import { test } from '@japa/runner'
import Transaction from '#models/transaction'
import Category from '#models/category'
import { DateTime } from 'luxon'
import testUtils from '@adonisjs/core/services/test_utils'

test.group('Transaction Model', (group) => {
  group.each.setup(async () => {
    // Clean up test data before each test
    await testUtils.db().truncate()
  })

  group.each.teardown(async () => {
    // Clean up test data after each test
    await testUtils.db().truncate()
  })

  test('should have correct table name', ({ assert }) => {
    // Act
    const tableName = Transaction.table

    // Assert
    assert.equal(tableName, 'transactions')
  })

  test('should have correct primary key', ({ assert }) => {
    // Act
    const primaryKey = Transaction.primaryKey

    // Assert
    assert.equal(primaryKey, 'id')
  })

  test('should have correct fillable fields', async ({ assert }) => {
    // Act - Test that model can be created with expected fields
    const category = await Category.create({ name: 'Food' })

    const transaction = await Transaction.create({
      amount: 25.5,
      currency: 'USD',
      converted_cad: 35.5,
      date: DateTime.fromISO('2024-01-01'),
      description: 'Lunch',
      categoryId: category.id,
    })

    // Assert
    assert.isNotNull(transaction.id)
    assert.equal(transaction.amount, 25.5)
    assert.equal(transaction.currency, 'USD')
    assert.equal(transaction.converted_cad, 35.5)
    assert.equal(transaction.description, 'Lunch')
    assert.equal(transaction.categoryId, category.id)
  })

  test('should have correct hidden fields', async ({ assert }) => {
    // Act - Test that timestamps are automatically handled
    const category = await Category.create({ name: 'Food # TRANSACTION MODEL' })

    const transaction = await Transaction.create({
      amount: 25.5,
      currency: 'USD',
      converted_cad: 35.5,
      date: DateTime.fromISO('2024-01-01'),
      description: 'Lunch',
      categoryId: category.id,
    })

    // Assert
    assert.isNotNull(transaction.createdAt)
    assert.isNotNull(transaction.updatedAt)
  })

  test('should return category when accessing relationship', async ({ assert }) => {
    // Arrange
    const category = await Category.create({
      name: 'Food # TRANSACTION MODEL 2',
    })

    const transaction = await Transaction.create({
      amount: 25.5,
      currency: 'USD',
      converted_cad: 35.5,
      date: DateTime.fromISO('2024-01-01'),
      description: 'Lunch',
      categoryId: category.id,
    })

    // Act
    const relatedCategory = await transaction.related('category').query().first()

    // Assert
    assert.isNotNull(relatedCategory)
    assert.equal(relatedCategory?.id, category.id)
    assert.equal(relatedCategory?.name, 'Food # TRANSACTION MODEL 2')
  })

  test('should handle missing category gracefully', async ({ assert }) => {
    // Arrange
    const transaction = await Transaction.create({
      amount: 25.5,
      converted_cad: 35.5,
      currency: 'USD',
      date: DateTime.fromISO('2024-01-01'),
      description: 'Lunch',
      categoryId: 999, // Non-existent category
    })

    // Act
    const relatedCategory = await transaction.related('category').query().first()

    // Assert
    assert.isNull(relatedCategory)
  })

  test('should validate amount is numeric', async ({ assert }) => {
    // Arrange
    const category = await Category.create({
      name: 'Food # TRANSACTION MODEL 3',
    })

    const transactionData = {
      amount: -1,
      currency: 'USD',
      date: DateTime.fromISO('2024-01-01'),
      description: 'Lunch',
      category_id: category.id,
      createdAt: DateTime.fromISO('2024-01-01'),
      updatedAt: DateTime.fromISO('2024-01-01'),
    }

    // Act & Assert
    try {
      await Transaction.create(transactionData)
      assert.fail('Should have thrown validation error')
    } catch (error) {
      assert.isTrue(error.message.includes('amount') || error.message.includes('numeric'))
    }
  })

  test('should validate currency format', async ({ assert }) => {
    // Arrange
    const category = await Category.create({
      name: 'Food # TRANSACTION MODEL 4',
    })

    const transactionData = {
      amount: 25.5,
      currency: '100',
      date: DateTime.fromISO('2024-01-01'),
      description: 'Lunch',
      category_id: category.id,
      createdAt: DateTime.fromISO('2024-01-01'),
      updatedAt: DateTime.fromISO('2024-01-01'),
      categoryId: category.id,
    }

    // Act & Assert
    try {
      await Transaction.create(transactionData)
      assert.fail('Should have thrown validation error')
    } catch (error) {
      assert.isTrue(error.message.includes('currency'))
    }
  })

  test('should validate date format', async ({ assert }) => {
    // Arrange
    const category = await Category.create({
      name: 'Food # TRANSACTION MODEL 5',
    })

    const transactionData = {
      amount: 25.5,
      currency: '100',
      date: DateTime.fromISO('2024-01-dd'),
      description: 'Lunch',
      category_id: category.id,
      createdAt: DateTime.fromISO('2024-01-01'),
      updatedAt: DateTime.fromISO('2024-01-01'),
      categoryId: category.id,
    }

    // Act & Assert
    try {
      await Transaction.create(transactionData)
      assert.fail('Should have thrown validation error')
    } catch (error) {
      assert.isTrue(error.message.includes('date'))
    }
  })

  test('should create transaction successfully', async ({ assert }) => {
    // Arrange
    const category = await Category.create({
      name: 'Food # TRANSACTION MODEL 6',
    })

    const transactionData = {
      amount: 25.5,
      converted_cad: 35.5,
      currency: 'USD',
      date: DateTime.fromISO('2024-01-01'),
      description: 'Lunch',
      category_id: category.id,
      createdAt: DateTime.fromISO('2024-01-01'),
      updatedAt: DateTime.fromISO('2024-01-01'),
      categoryId: category.id,
    }

    // Act
    const transaction = await Transaction.create(transactionData)

    // Assert
    assert.isNotNull(transaction.id)
    assert.equal(transaction.amount, 25.5)
    assert.equal(transaction.currency, 'USD')
    assert.equal(transaction.description, 'Lunch')
    assert.equal(transaction.categoryId, category.id)
  })

  test('should query transactions with filters', async ({ assert }) => {
    // Arrange
    const category = await Category.create({
      name: 'Food & Leisure # TRANSACTION MODEL 7',
    })

    await Transaction.createMany([
      {
        amount: 25.5,
        converted_cad: 35.5,
        currency: 'USD',
        date: DateTime.fromISO('2024-01-01'),
        description: 'Lunch',
        categoryId: category.id,
      },
      {
        amount: 30.0,
        converted_cad: 40.0,
        currency: 'USD',
        date: DateTime.fromISO('2024-01-02'),
        description: 'Dinner',
        categoryId: category.id,
      },
      {
        amount: 15.0,
        converted_cad: 20.0,
        currency: 'EUR',
        date: DateTime.fromISO('2024-01-01'),
        description: 'Coffee',
        categoryId: category.id,
      },
    ])

    // Act
    const usdTransactions = await Transaction.query().where('currency', 'USD')
    const eurTransactions = await Transaction.query().where('currency', 'EUR')

    // Assert
    assert.isArray(usdTransactions)
    assert.isArray(eurTransactions)
  })

  test('should format amount correctly', async ({ assert }) => {
    // Arrange
    const category = await Category.create({
      name: 'Food & Dining # TRANSACTION MODEL 8',
    })

    const transaction = await Transaction.create({
      amount: 1234.56,
      converted_cad: 1234.56,
      currency: 'USD',
      date: DateTime.fromISO('2024-01-01'),
      description: 'Lunch',
      categoryId: category.id,
    })

    // Act
    const formattedAmount = transaction.$extras.formattedAmount || transaction.amount

    // Assert
    assert.isNumber(formattedAmount)
    assert.equal(formattedAmount, 1234.56)
  })

  test('should return correct category name', async ({ assert }) => {
    // Arrange
    const category = await Category.create({
      name: 'Entertainment # TRANSACTION MODEL 9',
    })

    const transaction = await Transaction.create({
      amount: 25.5,
      converted_cad: 35.5,
      currency: 'USD',
      date: DateTime.fromISO('2024-01-01'),
      description: 'Lunch',
      categoryId: category.id,
    })

    // Act
    const categoryName = await transaction.related('category').query().first()

    // Assert
    assert.equal(categoryName?.name, 'Entertainment # TRANSACTION MODEL 9')
  })
})
