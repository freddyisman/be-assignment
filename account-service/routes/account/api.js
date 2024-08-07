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
                        user_id: { type: "string" },
                        account_type: { type: "string" },
                    },
                    required: [
                        "user_id",
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
        "/account/:user_id",
        {
            schema: {
                description: "Get all user payment accounts",
                tags: ["account"],
                params: {
                    type: "object",
                    properties: {
                        user_id: { type: "string" },
                    },
                    required: ["user_id"],
                },
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

    fastify.get(
        "/account/:account_id/history",
        {
            schema: {
                description: "Get user specific account transaction history",
                tags: ["account"],
                params: {
                    type: "object",
                    properties: {
                        account_id: { type: "string" },
                    },
                    required: ["account_id"],
                },
            },
        },
        async (request, reply) => {
            try {
                const data = await service.getAccountHistory(opts, request);
                return reply.send(data);
            } catch (e) {
                console.log(e);
                return reply.code(500).send(e);
            }
        }
    );

    done();
};