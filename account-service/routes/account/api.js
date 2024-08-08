const service = require("./service");

module.exports = (fastify, opts, done) => {
    fastify.post(
        "/account",
        {
            schema: {
                description: "Create payment account",
                tags: ["account"],
                body: {
                    type: "object",
                    properties: {
                        account_type: { type: "string" },
                    },
                    required: [
                        "account_type",
                    ],
                },
            },
        },
        async (request, reply) => {
            try {
                const data = await service.createAccount(opts, request);
                return reply.code(201).send(data);
            } catch (e) {
                console.log(e);
                return reply.code(500).send(e);
            }
        }
    );

    fastify.get(
        "/account",
        {
            schema: {
                description: "Get all user payment accounts",
                tags: ["account"],
            },
        },
        async (request, reply) => {
            try {
                const data = await service.getAccounts(opts, request);
                return reply.send(data);
            } catch (e) {
                console.log(e);
                return reply.code(500).send(e);
            }
        }
    );

    done();
};