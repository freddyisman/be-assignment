#!/bin/bash

# Source the .env file
if [ -f .env ]; then
  export $(cat .env | xargs)
fi

# Reset the database
export DATABASE_URL=postgres://$POSTGRES_USER:$POSTGRES_PASSWORD@localhost:5432/$POSTGRES_DB
npx prisma migrate reset -f