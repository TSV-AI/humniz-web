FROM node:18-alpine

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy --schema ./prisma/schema.prisma && yarn start"]
