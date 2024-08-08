/*
  Warnings:

  - A unique constraint covering the columns `[accountNumber]` on the table `PaymentAccount` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PaymentAccount_accountNumber_key" ON "PaymentAccount"("accountNumber");
