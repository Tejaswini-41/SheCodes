# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Add package files
COPY package*.json ./

# Install dependencies using clean install
RUN npm ci --legacy-peer-deps

# Copy remaining files
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY package*.json ./

RUN npm ci --production --legacy-peer-deps

# Expose port
EXPOSE 5173

# Start dev server with host flag
CMD ["npm", "run", "preview", "--", "--host"]
