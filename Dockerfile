# Base image
FROM ubuntu:22.04

# Update system
RUN apt update && apt install -y \
    libreoffice \
    nodejs \
    npm \
    && apt clean

# Set working directory
WORKDIR /app

# Copy package.json first
COPY package.json .

# Install dependencies
RUN npm install

# Copy everything
COPY . .

# Create folders
RUN mkdir -p uploads output

# Expose port
EXPOSE 8080

# Start server
CMD ["node", "server.js"]
