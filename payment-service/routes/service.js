const sendMoney = async (opts, request) => {
    try {
        const prisma = opts.prisma;
        const { sender_id, receiver_id, amount } = request.body;

        const sender = await prisma.PaymentAccount.findUnique({
            where: {
                id: sender_id,
            },
        });
        const receiver = await prisma.PaymentAccount.findUnique({
            where: {
                id: receiver_id,
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
                id: sender_id,
            },
            data: {
                balance: senderBalance,
            },
        });
        await prisma.PaymentAccount.update({
            where: {
                id: receiver_id,
            },
            data: {
                balance: receiverBalance,
            },
        });

        await prisma.PaymentHistory.create({
            data: {
                senderId: sender_id,
                receiverId: receiver_id,
                amount: amount,
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
        const prisma = opts.prisma;
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
                senderId: account_id,
                amount: amount,
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
        const prisma = opts.prisma;
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
                receiverId: account_id,
                amount: amount,
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

