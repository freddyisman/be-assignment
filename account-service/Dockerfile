# Use official Node.js image as the base image
FROM node:16-alpine

# Set working dir inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY ./account-service/package*.json ./

# Copy .env file
COPY ./account-service/.env ./

# Copy rest of the application
COPY ./account-service .

# Copy prisma schema
COPY ./prisma ./prisma

# Install dependencies
RUN npm install
RUN npm i -g prisma
RUN npx prisma generate

# Command to run your application
EXPOSE 3000
CMD ["node", "index.js"]
