import Fastify from "fastify";
import { habitRoutes } from "./routes/habits.js";
import {config} from "./config.js";
import { AppError } from "./errors.js";
export function buildApp(){
    const app = Fastify({logger:true});
    app.get("/health",async ()=>({status:'ok',environment:`${config.NODE_ENV}`}));
    app.register(habitRoutes, {prefix:"/habits"});
    
    app.setErrorHandler((err,req,reply)=>{
        if(err instanceof AppError){
            return reply.status(err.statusCode).send({
                statusCode: err.statusCode,
                code: err.code ?? "BAD_REQUEST",
                message: err.message
            });
        }
        req.log.error(err);
        return reply.status(500).send({
            statusCode: 500,
            code: "INTERNAL_ERROR",
            message: 'Something went wrong'
        });
    });

    return app;
}
