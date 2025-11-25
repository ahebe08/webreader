FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (utilise npm install au lieu de npm ci)
RUN npm install --omit=dev

# Copy source code
COPY . .

# Create uploads directories
RUN mkdir -p uploads/covers uploads/pdfs

# Expose port
EXPOSE 5000

# Start server
CMD ["node", "server.js"]