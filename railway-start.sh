
#!/bin/bash

echo "🚀 Starting Humniz SaaS on Railway..."

# Set production environment
export NODE_ENV=production

# Generate Prisma client (in case it's needed)
echo "📦 Ensuring Prisma client is generated..."
npx prisma generate

# Run database migrations
echo "🗄️ Running database migrations..."
npx prisma migrate deploy

# Start the application
echo "🌟 Starting Next.js application..."
exec yarn start
