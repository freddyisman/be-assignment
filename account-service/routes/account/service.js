function generateAccountNumber() {
    const min = 1000000000; // Minimum 10-digit number
    const max = 9999999999; // Maximum 10-digit number
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const createAccount = async (opts, request) => {
    try {
        const prisma = opts.prisma;
        const { user_id, account_type } = request.body;

        const user = await prisma.User.findUnique({
            where: {
                id: user_id,
            },
        });
        if (!user) {
            throw new Error("User not found");
        }

        const account_number = generateAccountNumber().toString();
        const account = await prisma.PaymentAccount.create({
            data: {
                accountType: account_type,
                accountNumber: account_number,
            },
        });
        return account;
    } catch (e) {
        console.log(e);
        throw e;
    }
};

const getAccounts = async (opts, request) => {
    try {
        const prisma = opts.prisma;
        const { user_id } = request.params;
        const accounts = await prisma.PaymentAccount.findMany({
            where: {
                UserId: user_id,
            },
        });
        return accounts;
    } catch (e) {
        console.log(e);
        throw e;
    }
};

const getAccountHistory = async (opts, request) => {
    try {
        const prisma = opts.prisma;
        const { account_id } = request.params;
        const sendingHistory = await prisma.PaymentHistory.findMany({
            where: {
                senderId: account_id,
            },
        });
        const receivingHistory = await prisma.PaymentHistory.findMany({
            where: {
                receiverId: account_id,
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
    createAccount,
    getAccounts,
    getAccountHistory,
};