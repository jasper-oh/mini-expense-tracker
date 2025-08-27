# Mini Expense Tracker - Frontend

A modern Vue 3 frontend application for expense tracking with TypeScript, Tailwind CSS, and comprehensive testing.

## 🚀 Quick Start

### Prerequisites

-   Node.js 18+
-   npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

## 🏗️ Architecture

### Framework & Libraries

-   **Vue 3**: Composition API with `<script setup>` syntax
-   **TypeScript**: Type-safe development
-   **Vite**: Fast build tool and dev server
-   **Tailwind CSS**: Utility-first CSS framework
-   **Pinia**: State management
-   **Vue Router**: Client-side routing
-   **Axios**: HTTP client for API calls
-   **Chart.js**: Data visualization

## 📁 Folder Structure

### `./src/components/`

Reusable Vue components organized by functionality:

```
components/
├── ui/                       # Base UI components
│   ├── BaseButton.vue        # Reusable button component
│   ├── BaseCard.vue          # Card container component
│   ├── BaseInput.vue         # Form input component
│   ├── BaseSelect.vue        # Select dropdown component
│   ├── BaseTextarea.vue      # Textarea component
│   └── index.ts              # Component exports
├── JWTModal.vue              # JWT token input modal
├── NoDataCompact.vue         # Compact no-data state
├── NoDataDisplay.vue         # Full no-data state display
└── TransactionsModal.vue     # Transaction form modal
```

### `./src/router/`

Vue Router configuration for application routing:

```
router/
└── index.ts                  # Route definitions and router setup
```

### `./src/stores/`

Pinia stores for state management:

```
stores/
├── authStore.ts              # Authentication state management
├── categoryStore.ts          # Category data and operations
└── transactionStore.ts       # Transaction data and operations
```

### `./src/types/`

TypeScript type definitions:

```
types/
├── Category.ts               # Category interface and types
└── Transaction.ts            # Transaction interface and types
```

### `./src/utils/`

Utility functions and helpers:

```
utils/
├── categoryUtils.ts          # Category-related utility functions
├── formatAmount.ts           # Currency amount formatting
├── formatDate.ts             # Date formatting utilities
├── formatNumber.ts           # Number formatting helpers
├── mathUtils.ts              # Mathematical operations
└── index.ts                  # Utility exports
```

### `./src/views/`

Page-level Vue components:

```
views/
├── AddTransaction.vue        # Transaction creation page
├── CategoryBalance.vue       # Category balance overview with charts
└── TransactionList.vue       # Transaction listing and management
```

## 🧪 Testing

### Test Setup

```bash
# Run all tests
npm test
```

### Test Structure

```
src/test/
├── unit/                     # Unit tests
│   ├── components/           # Component tests
│   │   └── TransactionsModal.test.ts
│   └── stores/               # Store tests
│       └── transactionStore.test.ts
├── setup.ts                  # Test configuration
└── README.md                 # Testing documentation
```

### Test Configuration

-   **Vitest**: Fast unit testing framework
-   **Vue Test Utils**: Vue component testing utilities
-   **jsdom**: DOM environment for testing
-   **Coverage**: V8 coverage reporting

## 🎨 Styling

-   **Tailwind CSS**: Utility-first CSS framework
-   **PostCSS**: CSS processing with autoprefixer
-   **Responsive Design**: Mobile-first approach
-   **Component-based**: Modular UI components

## 📊 Features

-   **JWT Authentication**: Secure user authentication
-   **Multi-currency Support**: Transaction handling in multiple currencies
-   **Data Visualization**: Charts for expense analytics
-   **Responsive Design**: Works on desktop and mobile
-   **Real-time Updates**: Reactive state management
-   **Form Validation**: Client-side validation
-   **Error Handling**: Comprehensive error management
