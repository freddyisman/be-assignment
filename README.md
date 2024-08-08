# User, Payment Account and Transaction Backend Services

## API Endpoints & Architecture

1. User Management Service:
   - `POST /user/register`: User registration
   - `POST /user/login`: User login

2. Payment Account Management Service:
   - `POST /account`: Create payment account for specific user
   - `GET /account`: List all payment accounts of specific user

3. Transaction Management Service:
   - `POST /transaction/send`: Send money to another account
   - `POST /transaction/withdraw`: Withdraw money
   - `POST /transaction/deposit`: Deposit money
   - `GET /transaction/history/:account_id`: List all transaction histories of specific user payment account

## Tech Stack, Frameworks & Authentication

- Node.js with Fastify framework
- PostgreSQL database with Prisma ORM for database management
- Docker for containerization with Docker Compose for multiple containers
- User authorization and authentication by using Supabase

## How to run

1. Clone the repository:
   ```
   git clone https://github.com/freddyisman/be-assignment.git
   ```

2. Set up environment variables:
   - Create a `.env` file following where the `.env.sample` files are located.
   - Add the necessary environment variable details.

3. Install dependencies for each service:
   ```
   cd account-service
   npm install

   cd ../payment-service
   npm install
   ```

4. Start the services by running script below (if error, then run it again):
   ```
   chmod +x ./start.sh
   ./start.sh
   ```

5. While the containers are running, reset the database (if required) by running script below:
   ```
   chmod +x ./reset.sh
   ./reset.sh
   ```

## Database Schema

```prisma
model User {
  id             String           @id @default(uuid())
  email          String           @unique
  name           String?
  password       String
  createdAt      DateTime         @default(now())
  updatedAt      DateTime         @updatedAt
  paymentAccount PaymentAccount[]
}

model PaymentAccount {
  id               String           @id @default(uuid())
  accountType      String
  accountNumber    String           @unique
  balance          Float            @default(0)
  currency         String           @default("IDR")
  createdAt        DateTime         @default(now())
  updatedAt        DateTime         @updatedAt
  user             User             @relation(fields: [userId], references: [id])
  userId           String
  sendingHistory   PaymentHistory[] @relation("sendingHistory")
  receivingHistory PaymentHistory[] @relation("receivingHistory")
}

model PaymentHistory {
  id                String          @id @default(uuid())
  amount            Float
  currency          String          @default("IDR")
  status            String          @default("SUCCESS")
  transactionType   String
  createdAt         DateTime        @default(now())
  updatedAt         DateTime        @updatedAt
  senderAccount     PaymentAccount? @relation("sendingHistory", fields: [senderAccountId], references: [id])
  senderAccountId   String?
  receiverAccount   PaymentAccount? @relation("receivingHistory", fields: [receiverAccountId], references: [id])
  receiverAccountId String?
}
```


# Take home assignment


## Description:
Build 2 Backend services which manages user’s accounts and transactions (send/withdraw). 

In Account Manager service, we have:
- User: Login with Id/Password
- Payment Account: One user can have multiple accounts like credit, debit, loan...
- Payment History: Records of transactions

In Payment Manager service, we have:
- Transaction: Include basic information like amount, timestamp, toAddress, status...
- We have a core transaction process function, that will be executed by `/send` or `/withdraw` API:

```js
function processTransaction(transaction) {
    return new Promise((resolve, reject) => {
        console.log('Transaction processing started for:', transaction);

        // Simulate long running process
        setTimeout(() => {
            // After 30 seconds, we assume the transaction is processed successfully
            console.log('transaction processed for:', transaction);
            resolve(transaction);
        }, 30000); // 30 seconds
    });
}

// Example usage
let transaction = { amount: 100, currency: 'USD' }; // Sample transaction input
processTransaction(transaction)
    .then((processedTransaction) => {
        console.log('transaction processing completed for:', processedTransaction);
    })
    .catch((error) => {
        console.error('transaction processing failed:', error);
    });
```

Features:
- Users need to register/log in and then be able to call APIs.
- APIs for 2 operations send/withdraw. Account statements will be updated after the transaction is successful.
- APIs to retrieve all accounts and transactions per account of the user.
- Write Swagger docs for implemented APIs (Optional)
- Auto Debit/Recurring Payments: Users should be able to set up recurring payments. These payments will automatically be processed at specified intervals. (Optional)

### Tech-stack:
- Recommend using authentication 3rd party: Supertokens, Supabase...
- `NodeJs/Golang` for API server (`Fastify/Gin` framework is the best choices)
- `PostgreSQL/MongoDB` for Database. Recommend using `Prisma` for ORM.
- `Docker` for containerization. Recommend using `docker-compose` for running containers.
 
## Target:
- Good document/README to describe your implementation.
- Make sure app functionality works as expected. Run and test it well.
- Containerized and run the app using Docker.
- Using `docker-compose` or any automation script to run the app with single command is a plus.
- Job schedulers utilization is a plus
