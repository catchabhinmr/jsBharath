import Fastify from "fastify";

const app = Fastify({ logger: true });          // built-in request logging

app.get("/health", async () => {
  return { status: "ok" };                      // returned object → 200 JSON
});

app.get<{ Params: { id: string } }>("/items/:id", async (request, reply) => {
  const { id } = request.params;                // "/items/7" → "7"
  if (id === "0") {
    return reply.code(404).send({ error: "Not found" });
  }
  return {id};
});

await app.listen({ port: 3000 });