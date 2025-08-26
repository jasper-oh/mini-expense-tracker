# Test Documentation

This directory contains comprehensive tests for the mini-expense-tracker backend application.

## Test Structure

### Unit Tests (`tests/unit/`)
- **Controllers**: Test individual controller methods with mocked dependencies
- **Services**: Test service logic with mocked database operations

### Functional Tests (`tests/functional/`)
- **Controllers**: Test controllers with real services and database integration

### Helpers (`tests/helpers/`)
- **Database utilities**: Helper functions for test database operations

## Test Categories

### CategoriesController Tests
- ✅ Successfully fetch categories
- ✅ Handle service errors gracefully
- ✅ Handle unknown errors
- ✅ Return proper HTTP status codes

### TransactionsController Tests
- ✅ Successfully fetch transactions
- ✅ Create transactions with valid data
- ✅ Validate required fields (amount, currency, date, description, category_id)
- ✅ Return proper HTTP status codes (201 for creation, 400 for validation errors)
- ✅ Handle service errors gracefully
- ✅ Get category balances successfully

### CategoryService Tests
- ✅ Fetch all categories with correct format
- ✅ Handle empty results
- ✅ Handle database errors gracefully
- ✅ Get categories with transaction counts
- ✅ Order categories alphabetically
- ✅ Handle categories with zero transactions

### TransactionService Tests
- ✅ Fetch all transactions with category information
- ✅ Parse amounts as numbers correctly
- ✅ Order transactions by creation date (descending)
- ✅ Create transactions successfully
- ✅ Handle unknown categories gracefully
- ✅ Calculate category balances correctly
- ✅ Sort balances by total (descending)
- ✅ Handle mixed currency transactions
- ✅ Handle database errors gracefully

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Specific Test Files
```bash
# Run only controller tests
npm test tests/unit/controllers/

# Run only service tests
npm test tests/unit/services/

# Run only integration tests
npm test tests/functional/
```

### Run Tests with Coverage
```bash
npm test -- --coverage
```

### Run Tests in Watch Mode
```bash
npm test -- --watch
```

## Test Configuration

Tests are configured using Japa test runner with the following plugins:
- `@japa/assert`: For assertions
- `@japa/api-client`: For API testing
- `@japa/plugin-adonisjs`: For AdonisJS integration

## Database Testing

Tests use a separate test database to avoid affecting development data. The test database is automatically cleaned up between test runs.

### Test Database Setup
- Tests automatically connect to the test database
- Data is cleaned up after each test group
- Helper functions are provided for common database operations

## Best Practices

1. **Arrange-Act-Assert**: All tests follow the AAA pattern
2. **Meaningful Test Names**: Test names clearly describe what is being tested
3. **Comprehensive Coverage**: Tests cover success, error, and edge cases
4. **Mocking**: External dependencies are mocked in unit tests
5. **Integration Testing**: Real database operations are tested in functional tests
6. **Cleanup**: Test data is properly cleaned up after each test

## Adding New Tests

When adding new functionality:

1. **Unit Tests**: Test individual methods with mocked dependencies
2. **Integration Tests**: Test the full flow with real services
3. **Edge Cases**: Include tests for error conditions and boundary cases
4. **Validation**: Test input validation thoroughly
5. **Database Operations**: Verify data persistence and retrieval

## Example Test Structure

```typescript
test.group('FeatureName', (group) => {
  group.each.setup(async () => {
    // Setup test data
  })

  group.each.teardown(async () => {
    // Clean up test data
  })

  test('should do something successfully', async ({ assert }) => {
    // Arrange
    // Act
    // Assert
  })

  test('should handle errors gracefully', async ({ assert }) => {
    // Arrange
    // Act
    // Assert
  })
})
```
