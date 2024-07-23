FROM node:20-bullseye-slim

COPY package*.json ./

RUN yarn

COPY . .

ARG DATABASE_URL

ENV DATABASE_URL ${DATABASE_URL}

RUN npx prisma generate

EXPOSE 8000

CMD ["yarn", "start"]