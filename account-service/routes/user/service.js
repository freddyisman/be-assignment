const register = async (opts, request) => {
    try {
        const prisma = opts.prisma;
        const { email, name, password } = request.body;
        const user = await prisma.User.create({
            data: {
                email,
                name,
                password,
            },
        });
        return user;
    } catch (e) {
        console.log(e);
        throw e;
    }
};

const login = async (opts, request) => {
    try {
        const prisma = opts.prisma;
        const { email, password } = request.body;
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
        return user;
    } catch (e) {
        console.log(e);
        throw e;
    }
};

module.exports = {
    register,
    login,
};