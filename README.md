# Mini Expense Tracker

A full-stack expense tracking application built with Adonis.js backend and Vue.js frontend, featuring category-based analytics and multi-currency support.

[Figma](https://www.figma.com/design/XOXV82VWtKLN2Lj35iiFfm/mini-expense-tracker?node-id=0-1&t=JyTpS47KCMkth2PN-1)
[Project Management](https://github.com/users/jasper-oh/projects/4)

## 🚀 Quick Start

### 1. Start Docker

```bash
docker compose up --build

```

### 2. Get JWT

#### Access to [http://localhost:3333/swagger](http://localhost:3333/swagger)

![Swagger Image](https://github.com/user-attachments/assets/d087fe56-f576-440e-a253-596e2167a578)

#### Execute the `/token` api and copy the token

![Get JWT](https://github.com/user-attachments/assets/cb1b0b82-ef1e-4c26-8cbc-e58a14564f27)

### 3. Put JWT

#### Access to [http://localhost:5173/transactions](http://localhost:5173/transactions), click `Add Transaction` and paste JWT

![Paste JWT](https://github.com/user-attachments/assets/fcf046cb-4b01-43bf-9793-5c1c2c97cd2d)

#### Enter proceed

## 🏗️ Architecture

### Backend (Adonis.js)

-   **Framework**: Adonis.js 6 with TypeScript
-   **Database**: SQLite (dev-test) / PostgreSQL (prod)
-   **Authentication**: JWT-based auth system
-   **API**: RESTful endpoints with Swagger documentation
-   **Testing**: Unit and functional tests with Japa

[More Detail](https://github.com/jasper-oh/mini-expense-tracker/tree/main/backend)

### Frontend (Vue.js 3)

-   **Framework**: Vue 3 with Composition API
-   **Build Tool**: Vite for fast development
-   **Styling**: Tailwind CSS with custom design system
-   **State Management**: Pinia stores
-   **Testing**: Vitest with Vue Test Utils

[More Detail](https://github.com/jasper-oh/mini-expense-tracker/tree/main/frontend)

### Key Features

-   **Multi-currency Support**: Automatic CAD conversion
-   **Category Analytics**: Visual charts and balance tracking
-   **Responsive Design**: Mobile-first approach
-   **Real-time Updates**: Live data synchronization
-   **JWT Authentication**: Secure API access

## 📱 Features

### Expense Management

-   Add/edit/delete transactions
-   Category-based organization
-   Multi-currency support
-   Date-based filtering

### Analytics & Reporting

-   Category balance overview
-   Interactive pie charts
-   Transaction history

## 🧪 Testing

### Backend Tests

```bash
cd backend
mkdir tmp
touch test.sqlite
npm run test                    # Run all tests
```

### Frontend Tests

```bash
cd frontend
npm run test               # Run all tests
```
