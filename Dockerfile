# Multi-stage build for production-ready News Aggregator

# Stage 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production=false

# Copy source code
COPY . .

# Accept build arguments for environment variables
ARG VITE_NEWS_API_KEY
ARG VITE_GUARDIAN_API_KEY
ARG VITE_NEW_YORK_TIMES_API_KEY

# Set environment variables for the build
ENV VITE_NEWS_API_KEY=$VITE_NEWS_API_KEY
ENV VITE_GUARDIAN_API_KEY=$VITE_GUARDIAN_API_KEY
ENV VITE_NEW_YORK_TIMES_API_KEY=$VITE_NEW_YORK_TIMES_API_KEY

# Build the application
RUN npm run build

# Stage 2: Production
FROM nginx:alpine AS production

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
