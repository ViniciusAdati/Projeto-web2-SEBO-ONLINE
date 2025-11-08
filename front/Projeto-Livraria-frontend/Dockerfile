# ---- Estágio 1: Build do Frontend ----
FROM node:20-alpine AS builder
WORKDIR /app

# Copia os arquivos de dependência e instala
COPY package*.json ./
RUN npm install

# Copia todo o restante do projeto e faz o build
COPY . .
RUN npm run build

# ---- Estágio 2: Servir com Nginx ----
FROM nginx:stable-alpine

# Copia o build do React para o Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copia o nginx.conf customizado
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponha a porta padrão do Nginx
EXPOSE 80

# Inicia o Nginx
CMD ["nginx", "-g", "daemon off;"]
