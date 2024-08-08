#!/bin/bash

# Source the .env file
if [ -f .env ]; then
  export $(cat .env | xargs)
fi

# Run the migrations
export DATABASE_URL=postgres://$POSTGRES_USER:$POSTGRES_PASSWORD@localhost:5432/$POSTGRES_DB
npx prisma migrate deploy

# Generate the Prisma client
export DATABASE_URL=postgres://$POSTGRES_USER:$POSTGRES_PASSWORD@postgres_db:5432/$POSTGRES_DB
npx prisma generate

# Start the server
sudo docker compose up