import http from "node:http";
import type { IncomingMessage, ServerResponse } from "node:http";

type Handler = (req: IncomingMessage, res: ServerResponse) => void | Promise<void>;
function withHello(handler: Handler): Handler{
    return (req,res)=>{
        console.log("hello");
        return handler(req,res);
    }
}

