const fastify = require("fastify")({ logger: true });
const errorCodes = require("fastify").errorCodes;
const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);
const { verifyAuthFromRequest } = require("./middlewares/supabase.middleware");

fastify.after(() => { 
  fastify.addHook('preHandler',(request, reply, done) => {
    try {
      verifyAuthFromRequest(request, reply, done, supabase);
    } catch (e) {
      return reply.code(500).send(e);
    }
  });
  fastify.register(require("./routes/api"), { supabase }); 
});

const start = async () => {
    try {
      fastify.listen({ port: process.env.PORT || 3001, host: "0.0.0.0" });
    } catch (err) {
      fastify.log.error(err);
      process.exit(1);
    }
  };

start();