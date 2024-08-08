const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const register = async (opts, request) => {
    try {
        const supabase = opts.supabase;
        const { email, name, password } = request.body;

        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
        });

        const user = await prisma.User.create({
            data: {
                email,
                name,
                password,
            },
        });

        return {
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
        };
    } catch (e) {
        console.log(e);
        throw e;
    }
};

const login = async (opts, request) => {
    try {
        const supabase = opts.supabase;
        const { email, password } = request.body;

        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        const user = await prisma.User.findUnique({
            where: {
                email,
            },
        });
        if (!user) {
            throw new Error("User not found");
        }
        if (user.password !== password) {
            throw new Error("Invalid password");
        }

        return {
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
        };
    } catch (e) {
        console.log(e);
        throw e;
    }
};

module.exports = {
    register,
    login,
};