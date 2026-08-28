FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY prisma ./prisma
COPY prisma7.config.ts tsconfig.json ./
COPY src ./src

# Prisma 7 loads DATABASE_URL while generating the client.
ENV DATABASE_URL=postgresql://postgres:postgres@postgres:5432/jalsevadb
RUN npx prisma generate
RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]
