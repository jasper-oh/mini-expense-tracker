# Frontend Testing Guide

This directory contains comprehensive unit tests for the frontend application using Vitest and Vue Test Utils.

## Test Structure

```
src/test/
├── setup.ts                    # Test environment configuration
├── unit/                       # Unit tests
│   ├── stores/                # Pinia store tests
│   │   └── transactionStore.test.ts
│   ├── components/            # Vue component tests
│   │   └── TransactionsModal.test.ts
│   └── utils/                 # Utility function tests
│       └── formatters.test.ts
└── README.md                  # This file
```

## Test Coverage

### Store Tests (`stores/`)

-   **Transaction Store**: Tests state management, actions, getters, and error handling
-   Covers API interactions, JWT token validation, and state mutations
-   Tests loading states and error scenarios

### Component Tests (`components/`)

-   **TransactionsModal**: Tests component rendering, props, events, and user interactions
-   Covers modal visibility, table rendering, and formatting functions
-   Tests accessibility features and responsive behavior

### Utility Tests (`utils/`)

-   **Formatters**: Tests date formatting, currency formatting, and validation functions
-   Covers number formatting, email validation, and text manipulation
-   Tests error handling and edge cases

## Running Tests

### Install Dependencies

```bash
npm install
```

### Run All Tests

```bash
npm test
```

### Run Tests with UI

```bash
npm run test:ui
```

### Run Tests with Coverage

```bash
npm run test:coverage
```

### Run Specific Test Files

```bash
npm test -- formatters.test.ts
npm test -- transactionStore.test.ts
npm test -- TransactionsModal.test.ts
```

## Test Configuration

The testing environment is configured in `vitest.config.ts` with:

-   JSDOM environment for DOM testing
-   Vue plugin support
-   Coverage reporting with V8
-   Test setup file integration

## Test Setup

The `setup.ts` file provides:

-   Mock environment variables
-   Axios mocking for API calls
-   SessionStorage mocking
-   Pinia store configuration
-   Vue Test Utils global configuration

## Writing Tests

### Test Structure

```typescript
describe('Component/Function Name', () => {
    describe('Feature Group', () => {
        it('should do something specific', () => {
            // Arrange - Setup test data
            // Act - Execute the function/action
            // Assert - Verify the result
        });
    });
});
```

### Component Testing

```typescript
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';

const wrapper = mount(Component, {
    props: {
        /* props */
    },
    global: { plugins: [pinia] },
});
```

### Store Testing

```typescript
import { setActivePinia, createPinia } from 'pinia';

beforeEach(() => {
    setActivePinia(createPinia());
    store = useStore();
});
```

### Mocking

```typescript
import { vi } from 'vitest';

// Mock functions
vi.fn();
vi.mocked(axios);

// Mock modules
vi.mock('axios');
```

## Best Practices

1. **Test Organization**: Group related tests using `describe` blocks
2. **Test Names**: Use descriptive test names that explain the expected behavior
3. **Arrange-Act-Assert**: Structure tests with clear setup, execution, and verification
4. **Mocking**: Mock external dependencies and API calls
5. **Coverage**: Aim for high test coverage, especially for critical business logic
6. **Edge Cases**: Test error conditions and boundary cases
7. **Cleanup**: Use `beforeEach` and `afterEach` for test isolation

## Debugging Tests

### Verbose Output

```bash
npm test -- --reporter=verbose
```

### Debug Mode

```bash
npm test -- --reporter=verbose --no-coverage
```

### Watch Mode

```bash
npm test -- --watch
```

## Common Issues

### Import Paths

Ensure import paths use `@/` alias for `src/` directory:

```typescript
import Component from '@/components/Component.vue';
import { useStore } from '@/stores/store';
```

### TypeScript Errors

Run type checking separately:

```bash
npx vue-tsc --noEmit
```

### Test Environment

If tests fail due to missing DOM APIs, ensure JSDOM is properly configured in `vitest.config.ts`.

## Coverage Reports

Coverage reports are generated in multiple formats:

-   **Text**: Console output during test runs
-   **HTML**: Detailed coverage report in `coverage/` directory
-   **JSON**: Machine-readable coverage data

Open `coverage/index.html` in a browser to view detailed coverage information.
