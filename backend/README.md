# Mini Expense Tracker - Backend

A robust Adonis.js 6 backend API for expense tracking with JWT authentication, multi-currency support, and comprehensive testing.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- SQLite (development) or PostgreSQL (production)
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

## 🗄️ Database Design

### Schema Overview

```
┌─────────────────┐    ┌──────────────────┐
│   categories    │    │   transactions   │
├─────────────────┤    ├──────────────────┤
│ id (PK)         │----│ id (PK)          │
│ name            │    │ amount           │
│ created_at      │    │ currency         │
│ updated_at      │    │ date             │
└─────────────────┘    │ description      │
                       │ category_id (FK) │
                       │ converted_cad    │
                       │ created_at       │
                       │ updated_at       │
                       └──────────────────┘
```

### Key Relationships

- **One-to-Many**: Category → Transactions
- **Foreign Key**: `transactions.category_id` references `categories.id`
- **Currency Conversion**: All amounts stored with CAD equivalent for analytics

### Database Configuration

- **Testing**: SQLite for fast iteration
- **Production & Development**: PostgreSQL for scalability
- **Migrations**: Version-controlled schema changes
- **Seeders**: Initial data population

## 🔌 API Specification

### Authentication

All protected endpoints require JWT token in Authorization header:

```
Authorization: Bearer <jwt_token>
```

### Core Endpoints

#### Categories

```
GET    /api/categories              # List all categories
```

#### Transactions

```
GET    /api/transactions            # List transactions
POST   /api/transactions            # Create transaction
GET    /api/transactions/balance    # Get transactions by balance
```

## 🏗️ Architecture

### Framework

- **Adonis.js 6**: Modern Node.js framework with TypeScript
- **Lucid ORM**: Database abstraction and migrations
- **Japa**: Testing framework for unit and functional tests
- **VineJS**: Request validation and sanitization

### Key Services

- **CategoryService**: Category CRUD operations
- **TransactionService**: Transaction management and analytics
- **CurrencyService**: Exchange rate conversion
- **AuthService**: JWT token management

### Middleware

- **AuthJWT**: JWT token validation
- **ForceJsonResponse**: Consistent API responses
- **ContainerBindings**: Dependency injection setup

## 🧪 Testing

### Test Setup

```bash
# Create test database
mkdir tmp
touch tmp/test.sqlite

# Run all tests
npm test

# Run specific test types
npm run test:unit          # Unit tests
npm run test:functional    # Functional tests
npm run test:coverage      # Coverage report
```

### Test Structure

```
tests/
├── unit/                  # Unit tests
│   ├── controllers/       # Controller tests
│   ├── models/           # Model tests
│   ├── services/         # Service tests
│   └── middleware/       # Middleware tests
├── functional/            # Integration tests
│   └── controllers/      # API endpoint tests
└── bootstrap.ts           # Test configuration
```

### Test Configuration

- **SQLite**: In-memory database for fast tests
- **Japa**: Modern testing framework
- **Coverage**: Istanbul coverage reporting
- **Mocking**: Service and external API mocking

## 📚 API Documentation

### Swagger UI

Once running, visit: `http://localhost:3333/swagger`

### OpenAPI Specification

- **Version**: 3.0.0
- **Authentication**: Bearer token
- **Response Format**: JSON

### Code Quality

- **ESLint**: Code linting and style enforcement
- **Prettier**: Automatic code formatting
- **TypeScript**: Strict type checking
- **AdonisJS**: Framework-specific best practices
