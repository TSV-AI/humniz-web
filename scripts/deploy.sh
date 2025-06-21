
#!/bin/bash

echo "🚀 Starting Railway deployment setup..."

# Generate Prisma client
echo "📦 Generating Prisma client..."
npx prisma generate

# Run database migrations
echo "🗄️ Running database migrations..."
npx prisma migrate deploy

# Seed database (optional, only in development)
if [ "$NODE_ENV" != "production" ]; then
  echo "🌱 Seeding database..."
  npx prisma db seed || true
fi

echo "✅ Deployment setup complete!"
