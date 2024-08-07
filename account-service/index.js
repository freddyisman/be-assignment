const fastify = require("fastify")({ logger: true });
const errorCodes = require("fastify").errorCodes;

fastify.after(() => { 
  fastify.register(require("./routes/user/api"));
  fastify.register(require("./routes/account/api"));
});

const start = async () => {
    try {
      fastify.listen({ port: process.env.PORT || 3000, host: "0.0.0.0" });
    } catch (err) {
      fastify.log.error(err);
      process.exit(1);
    }
  };

start();