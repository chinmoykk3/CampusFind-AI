# BUILD STAGE
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# PRODUCTION SSR SERVER
FROM nginx:alpine

COPY --from=builder /usr/src/app/dist /usr/share/nginx/html

# Forward SPA routing correctly inside Nginx
RUN echo 'server { \
    listen 80; \
    location / { \
    root /usr/share/nginx/html; \
    index index.html index.htm; \
    try_files $uri $uri/ /index.html; \
    } \
    }' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
