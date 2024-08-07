const service = require("./service");

module.exports = (fastify, opts, done) => {
    fastify.post(
        "/user/register",
        {
            schema: {
                description: "User register",
                tags: ["user"],
                body: {
                    type: "object",
                    properties: {
                        email: { type: "string" },
                        name: { type: "string" },
                        password: { type: "string" },
                    },
                    required: [
                        "email",
                        "password",
                    ],
                },
            },
        },
        async (request, reply) => {
            try {
                const data = await service.register(opts, request);
                return reply.code(201).send(data);
            } catch (e) {
                console.log(e);
                return reply.code(500).send(e);
            }
        }
    );

    fastify.post(
        "/user/login",
        {
            schema: {
                description: "User login",
                tags: ["user"],
                body: {
                    type: "object",
                    properties: {
                        email: { type: "string" },
                        password: { type: "string" },
                    },
                    required: [
                        "email",
                        "password",
                    ],
                },
            },
        },
        async (request, reply) => {
            try {
                const data = await service.login(opts, request);
                return reply.code(200).send(data);
            } catch (e) {
                console.log(e);
                return reply.code(500).send(e);
            }
        }
    );

    done();
};
