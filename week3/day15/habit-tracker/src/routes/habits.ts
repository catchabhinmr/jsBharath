import type {FastifyInstance} from "fastify";
export async function habitRoutes(app: FastifyInstance){
    app.get("/",async ()=>[]);
}