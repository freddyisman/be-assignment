const fastify = require("fastify")({ logger: true });
const errorCodes = require("fastify").errorCodes;
require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);
const { verifyAuthFromRequest } = require("./middlewares/supabase.middleware");

fastify.after(() => {
  fastify.addHook('preHandler',(request, reply, done) => {
    try {
      if (request.url.startsWith("/user")) {
        return done(); // Skip token check for user registration and login
      }
      verifyAuthFromRequest(request, reply, done, supabase);
    } catch (e) {
      return reply.code(500).send(e);
    }
  });
  fastify.register(require("./routes/user/api"), { supabase });
  fastify.register(require("./routes/account/api"), { supabase });
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