FROM node:18-alpine

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

EXPOSE 3000

CMD ["sh","-c","npx prisma generate --schema ./app/prisma/schema.prisma && npx prisma migrate deploy --schema ./app/prisma/schema.prisma && yarn build && yarn start"]