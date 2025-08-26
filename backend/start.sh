#!/bin/sh

echo "🚀 Starting Adonis.js Backend..."

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 15

# Check if migration file exists
echo "📁 Checking migration files..."
ls -la database/migrations/

# Check migration status
echo "📊 Checking migration status..."
node ace migration:status

# Build TypeScript
echo "📦 Building TypeScript..."
npm run build

# Run migrations with error checking
echo "🗄️ Running database migrations..."
if node ace migration:run --force; then
    echo "✅ Migrations completed successfully"
else
    echo "❌ Migrations failed with exit code $?"
    echo "🔍 Checking for migration errors..."
    node ace migration:status
    exit 1
fi

# Check if table was created
echo "🔍 Checking if transactions table exists..."
node ace migration:status

# Add category seeder
echo "🏃 Add category seeder"
node ace db:seed

# Start the development server
echo "🔥 Starting development server..."
npm run dev
