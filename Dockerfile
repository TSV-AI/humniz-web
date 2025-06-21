# ---------- base ----------
FROM node:18-alpine

# ---------- paths ----------
#  /app         – container root
#  /app/app     – your Next.js project (because local repo has “app/...”)

WORKDIR /app

# ---------- deps ----------
COPY package.json yarn.lock ./app/
COPY ./app ./app/

WORKDIR /app/app
RUN yarn install --frozen-lockfile

# ---------- prisma ----------
RUN npx prisma generate && npx prisma migrate deploy

# ---------- build / start ----------
RUN yarn build
EXPOSE 3000
CMD ["yarn", "start"]