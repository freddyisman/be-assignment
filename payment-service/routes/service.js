const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const sendMoney = async (opts, request) => {
    try {
        const { sender_account_id, receiver_account_id, amount } = request.body;

        const sender = await prisma.PaymentAccount.findUnique({
            where: {
                id: sender_account_id,
            },
        });
        const receiver = await prisma.PaymentAccount.findUnique({
            where: {
                id: receiver_account_id,
            },
        });
        
        if (!sender || !receiver) {
            throw new Error("Account not found");
        }
        if (sender.balance < amount) {
            throw new Error("Insufficient balance");
        }

        const senderBalance = sender.balance - amount;
        const receiverBalance = receiver.balance + amount;

        await prisma.PaymentAccount.update({
            where: {
                id: sender_account_id,
            },
            data: {
                balance: senderBalance,
            },
        });
        await prisma.PaymentAccount.update({
            where: {
                id: receiver_account_id,
            },
            data: {
                balance: receiverBalance,
            },
        });

        await prisma.PaymentHistory.create({
            data: {
                senderAccountId: sender_account_id,
                receiverAccountId: receiver_account_id,
                amount: amount,
                transactionType: "SEND",
            },
        });

        return {
            message: "Money sent",
        };
    } catch (e) {
        console.log(e);
        throw e;
    }
};

const withdrawMoney = async (opts, request) => {
    try {
        const { account_id, amount } = request.body;

        const account = await prisma.PaymentAccount.findUnique({
            where: {
                id: account_id,
            },
        });

        if (!account) {
            throw new Error("Account not found");
        }
        if (account.balance < amount) {
            throw new Error("Insufficient balance");
        }

        const newBalance = account.balance - amount;

        await prisma.PaymentAccount.update({
            where: {
                id: account_id,
            },
            data: {
                balance: newBalance,
            },
        });

        await prisma.PaymentHistory.create({
            data: {
                senderAccountId: account_id,
                amount: amount,
                transactionType: "WITHDRAW",
            },
        });

        return {
            message: "Money withdrawn",
        };
    } catch (e) {
        console.log(e);
        throw e;
    }
};

const depositMoney = async (opts, request) => {
    try {
        const { account_id, amount } = request.body;

        const account = await prisma.PaymentAccount.findUnique({
            where: {
                id: account_id,
            },
        });

        if (!account) {
            throw new Error("Account not found");
        }

        const newBalance = account.balance + amount;
        
        await prisma.PaymentAccount.update({
            where: {
                id: account_id,
            },
            data: {
                balance: newBalance,
            },
        });
        
        await prisma.PaymentHistory.create({
            data: {
                receiverAccountId: account_id,
                amount: amount,
                transactionType: "DEPOSIT",
            },
        });
        
        return {
            message: "Money deposited",
        };
    } catch (e) {
        console.log(e);
        throw e;
    }
};

module.exports = {
    sendMoney,
    withdrawMoney,
    depositMoney,
};

