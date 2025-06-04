# Step 1: Build React App
FROM node:18-alpine AS builder

# Buat direktori kerja
WORKDIR /app

# Copy file config dan install dependensi
COPY package*.json ./
RUN npm install

# Copy semua file project dan build
COPY . .
RUN npm run build

# Step 2: Serve dengan Nginx
FROM nginx:alpine

# Hapus default HTML nginx
RUN rm -rf /usr/share/nginx/html/*

# Copy build React ke folder Nginx
COPY --from=builder /app/build /usr/share/nginx/html

# Salin konfigurasi nginx opsional (bisa diskip kalau nggak perlu)
# COPY nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

# Jalankan nginx
CMD ["nginx", "-g", "daemon off;"]
