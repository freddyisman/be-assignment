const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

function generateAccountNumber() {
    const min = 1000000000; // Minimum 10-digit number
    const max = 9999999999; // Maximum 10-digit number
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const createAccount = async (opts, request) => {
    try {
        const supabase = opts.supabase;
        const token = request.headers.token;
        const email = request.headers.email;
        const { account_type } = request.body;        

        const user = await prisma.User.findUnique({
            where: {
                email: email,
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
                userId: user.id,
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
        const supabase = opts.supabase;
        const token = request.headers.token;
        const email = request.headers.email;

        const user = await prisma.User.findUnique({
            where: {
                email: email,
            },
        });
        if (!user) {
            throw new Error("User not found");
        }

        const accounts = await prisma.PaymentAccount.findMany({
            where: {
                userId: user.id,
            },
        });

        return accounts;
    } catch (e) {
        console.log(e);
        throw e;
    }
};

module.exports = {
    createAccount,
    getAccounts,
};