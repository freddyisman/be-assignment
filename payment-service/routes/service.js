const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const sendMoney = async (opts, request) => {
    try {
        const supabase = opts.supabase;
        const token = request.headers.token;
        const email = request.headers.email;
        const { sender_account_id, receiver_account_id, amount } = request.body;

        const user = await prisma.User.findUnique({
            where: {
                email: email,
            },
        });
        if (!user) {
            throw new Error("User not found");
        }

        const sender = await prisma.PaymentAccount.findUnique({
            where: {
                id: sender_account_id,
                userId: user.id,
            },
        });
        if (!sender) {
            throw new Error("User account not found");
        }

        const receiver = await prisma.PaymentAccount.findUnique({
            where: {
                id: receiver_account_id,
            },
        });
        
        if (!sender || !receiver) {
            throw new Error("Destination account not found");
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
        const supabase = opts.supabase;
        const token = request.headers.token;
        const email = request.headers.email;
        const { account_id, amount } = request.body;

        const user = await prisma.User.findUnique({
            where: {
                email: email,
            },
        });
        if (!user) {
            throw new Error("User not found");
        }

        const account = await prisma.PaymentAccount.findUnique({
            where: {
                id: account_id,
                userId: user.id,
            },
        });
        if (!account) {
            throw new Error("User account not found");
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
        const supabase = opts.supabase;
        const token = request.headers.token;
        const email = request.headers.email;
        const { account_id, amount } = request.body;

        const user = await prisma.User.findUnique({
            where: {
                email: email,
            },
        });
        if (!user) {
            throw new Error("User not found");
        }

        const account = await prisma.PaymentAccount.findUnique({
            where: {
                id: account_id,
                userId: user.id,
            },
        });
        if (!account) {
            throw new Error("User account not found");
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

const getAccountHistory = async (opts, request) => {
    try {
        const supabase = opts.supabase;
        const token = request.headers.token;
        const email = request.headers.email;
        const { account_id } = request.params;

        const user = await prisma.User.findUnique({
            where: {
                email: email,
            },
        });
        if (!user) {
            throw new Error("User not found");
        }

        const account = await prisma.PaymentAccount.findUnique({
            where: {
                id: account_id,
                userId: user.id,
            },
        });
        if (!account) {
            throw new Error("User account not found");
        }

        const sendingHistory = await prisma.PaymentHistory.findMany({
            where: {
                senderAccountId: account_id,
            },
        });
        const receivingHistory = await prisma.PaymentHistory.findMany({
            where: {
                receiverAccountId: account_id,
            },
        });

        sendingHistory.forEach((history) => {
            history.amount = history.amount * -1;
        });

        const history = sendingHistory.concat(receivingHistory);
        history.sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
        });

        return history;
    } catch (e) {
        console.log(e);
        throw e;
    }
};

module.exports = {
    sendMoney,
    withdrawMoney,
    depositMoney,
    getAccountHistory,
};

