
# This Dockerfile is for Railway deployment
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN yarn build

# Expose port
EXPOSE 3000

# Start the application
CMD ["sh", "-c", "npx prisma migrate deploy && yarn start"]
