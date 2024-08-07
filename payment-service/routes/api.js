const service = require("./service");

module.exports = (fastify, opts, done) => {
    fastify.post(
        "/transaction/send",
        {
            schema: {
                description: "Send money to another account",
                tags: ["transaction"],
                body: {
                    type: "object",
                    properties: {
                        sender_account_id: { type: "string" },
                        receiver_account_id: { type: "string" },
                        amount: { type: "number" },
                    },
                    required: [
                        "sender_account_id",
                        "receiver_account_id",
                        "amount",
                    ],
                },
            },
        },
        async (request, reply) => {
            try {
                const data = await service.sendMoney(opts, request);
                return reply.send(data);
            } catch (e) {
                console.log(e);
                return reply.code(500).send(e);
            }
        }
    );

    fastify.post(
        "/transaction/withdraw",
        {
            schema: {
                description: "Withdraw money from account",
                tags: ["transaction"],
                body: {
                    type: "object",
                    properties: {
                        account_id: { type: "string" },
                        amount: { type: "number" },
                    },
                    required: [
                        "account_id",
                        "amount",
                    ],
                },
            },
        },
        async (request, reply) => {
            try {
                const data = await service.withdrawMoney(opts, request);
                return reply.send(data);
            } catch (e) {
                console.log(e);
                return reply.code(500).send(e);
            }
        }
    );

    fastify.post(
        "/transaction/deposit",
        {
            schema: {
                description: "Deposit money to account",
                tags: ["transaction"],
                body: {
                    type: "object",
                    properties: {
                        account_id: { type: "string" },
                        amount: { type: "number" },
                    },
                    required: [
                        "account_id",
                        "amount",
                    ],
                },
            },
        },
        async (request, reply) => {
            try {
                const data = await service.depositMoney(opts, request);
                return reply.send(data);
            } catch (e) {
                console.log(e);
                return reply.code(500).send(e);
            }
        }
    );

    done();
};