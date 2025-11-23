FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY packages/server/package*.json ./packages/server/
COPY packages/client/package*.json ./packages/client/

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy application code
COPY . .

# Build client (if needed)
WORKDIR /app/packages/client
RUN npm run build || true

# Go back to app directory
WORKDIR /app

# Expose port
EXPOSE 3000

# Start server
CMD ["npm", "start"]
