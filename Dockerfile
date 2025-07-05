# Use official Node.js runtime
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy client package files
COPY client/package*.json ./client/

# Install client dependencies and build
WORKDIR /app/client
RUN npm ci --only=production && npm run build

# Go back to app directory
WORKDIR /app

# Copy application code
COPY . .

# Create downloads directory
RUN mkdir -p downloads/soundcloud

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/api/health || exit 1

# Start the application
CMD ["npm", "start"]
