-- DropForeignKey
ALTER TABLE "PaymentHistory" DROP CONSTRAINT "PaymentHistory_senderId_fkey";

-- AlterTable
ALTER TABLE "PaymentHistory" ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'IDR',
ALTER COLUMN "senderId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "PaymentHistory" ADD CONSTRAINT "PaymentHistory_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "PaymentAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;
