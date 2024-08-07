# Use official Node.js image as the base image
FROM node:16-alpine

# Set working dir inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY ./payment-service/package*.json ./

# Copy .env file
COPY ./payment-service/.env ./

# Copy rest of the application
COPY ./payment-service .

# Copy prisma schema
COPY ./prisma ./prisma

# Install dependencies
RUN npm install
RUN npm i -g prisma
RUN npx prisma generate

# Command to run your application
EXPOSE 3001
CMD ["node", "index.js"]
