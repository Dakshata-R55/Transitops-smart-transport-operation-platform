# ---------- Stage 1: Build React app ----------
    FROM node:20-alpine AS build

    WORKDIR /app
    
    # Copy package files first (better caching)
    COPY package.json package-lock.json ./
    RUN npm ci
    
    # Copy rest of frontend code
    COPY . .
    
    # API URL is baked in at build time (Vite requirement)
    ARG VITE_API_URL=http://localhost:8080
    ENV VITE_API_URL=$VITE_API_URL
    
    RUN npm run build
    
    # ---------- Stage 2: Serve with Nginx ----------
    FROM nginx:1.27-alpine
    
    # Custom nginx config for React Router
    COPY nginx.conf /etc/nginx/conf.d/default.conf
    
    # Copy built files from stage 1
    COPY --from=build /app/dist /usr/share/nginx/html
    
    EXPOSE 80
    
    CMD ["nginx", "-g", "daemon off;"]