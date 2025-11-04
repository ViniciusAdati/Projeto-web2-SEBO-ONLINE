# ---- Estágio 1: Build ----
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# ---- Estágio 2: Production ----
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY --from=builder /app/dist ./dist

# Expõe a porta que sua API usa
EXPOSE 3000

# O comando para iniciar seu servidor
CMD ["node", "dist/server.js"]