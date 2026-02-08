FROM node:20-alpine

# Instalar OpenSSL para Prisma
RUN apk add --no-cache openssl openssl-dev && \
    ln -s /usr/lib/libssl.so.3 /usr/lib/libssl.so.1.1 && \
    ln -s /usr/lib/libcrypto.so.3 /usr/lib/libcrypto.so.1.1

WORKDIR /app/server

# Copiar package files del servidor
COPY server/package*.json ./

# Instalar dependencias (incluyendo dev para Prisma y tsx)
RUN npm install --include=dev

# Copiar el código del servidor
COPY server/ ./

# Generar Prisma Client
RUN npx prisma generate

# Exponer puerto del backend
EXPOSE 4000

# Comando de inicio
CMD ["npm", "run", "dev"]
