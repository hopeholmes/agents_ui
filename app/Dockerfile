# --- Stage 1: Build the Vite React app ---
FROM node:20-alpine AS build
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# 👇 Copy everything, including postcss.config.cjs and src
COPY . .

# Build
RUN npm run build

# --- Stage 2: Serve with Nginx ---
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
