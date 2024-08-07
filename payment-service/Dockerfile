# Use official Node.js image as the base image
FROM node:alpine

# Set working dir inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Copy prisma schema
COPY ../prisma ./prisma

# Copy .env file
COPY .env ./

# Copy rest of the application
COPY . .

# Install dependencies
RUN npm install
RUN npm i -g prisma
RUN prisma generate

# Command to run your application
EXPOSE 3001
CMD ["node", "index.js"]
