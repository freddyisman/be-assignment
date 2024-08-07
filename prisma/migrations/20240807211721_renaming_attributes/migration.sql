/*
  Warnings:

  - You are about to drop the column `receiverId` on the `PaymentHistory` table. All the data in the column will be lost.
  - You are about to drop the column `senderId` on the `PaymentHistory` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "PaymentHistory" DROP CONSTRAINT "PaymentHistory_receiverId_fkey";

-- DropForeignKey
ALTER TABLE "PaymentHistory" DROP CONSTRAINT "PaymentHistory_senderId_fkey";

-- AlterTable
ALTER TABLE "PaymentAccount" ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'IDR';

-- AlterTable
ALTER TABLE "PaymentHistory" DROP COLUMN "receiverId",
DROP COLUMN "senderId",
ADD COLUMN     "receiverAccountId" TEXT,
ADD COLUMN     "senderAccountId" TEXT,
ALTER COLUMN "status" SET DEFAULT 'SUCCESS';

-- AddForeignKey
ALTER TABLE "PaymentHistory" ADD CONSTRAINT "PaymentHistory_senderAccountId_fkey" FOREIGN KEY ("senderAccountId") REFERENCES "PaymentAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentHistory" ADD CONSTRAINT "PaymentHistory_receiverAccountId_fkey" FOREIGN KEY ("receiverAccountId") REFERENCES "PaymentAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;
