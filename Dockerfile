# Use lightweight Node base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Run migrations and start (force fresh prisma client generation before build)
CMD ["sh", "-c", "npx prisma generate && npx prisma migrate deploy && yarn build && yarn start"]