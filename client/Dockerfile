# ===============================
# Stage 1: Builder
# ===============================
FROM node:20 AS builder

WORKDIR /app

# Copy và cài deps
COPY package.json package-lock.json ./
RUN npm ci

# Copy toàn bộ source code
COPY . .

# Copy file .env vào (dùng chung cho production)
COPY .env .env

# Build Next.js
RUN npm run build

# ===============================
# Stage 2: Runner
# ===============================
FROM node:20-alpine AS runner

WORKDIR /app
RUN apk add --no-cache libc6-compat

# Copy kết quả build từ builder sang
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.env ./.env

EXPOSE 3000

# Start Next.js production
CMD ["npm", "run", "start"]
