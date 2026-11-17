import http from "node:http";
import type { IncomingMessage, ServerResponse } from "node:http";
import { getNote, getNotes } from "./helper-notes.js";
type Handler = (req: IncomingMessage, res: ServerResponse) => void | Promise<void>;
export type Result<T> = { ok: true; value: T } | { ok: false; error: string };

function sendJson(res: ServerResponse, status: number, body: unknown){
    res.writeHead(status,{"Content-Type":"application/json"});
    res.end(JSON.stringify(body));
}
//how is this similar to a server
async function readBody(req: IncomingMessage): Promise<string>{
    return new Promise((resolve,reject)=>{
        const chunks: Buffer[] = [];
        req
            .on("error",reject)
            .on("data",(chunk:Buffer)=>(chunks.push(chunk)))
            .on("end",()=>resolve(Buffer.concat(chunks).toString("utf8")));

    });
}
const handler: Handler = async (req,res)=>{
    const {method = "GET", url="/"} = req;
    let data: unknown;
    if(method == "GET"){
        const notes = await getNotes();
        if (url=== "/notes") {
            sendJson(res,200,notes);
        }
        else{
            // GET /notes/:id
            const match = url.match(/^\/notes\/([^/]+)$/);
            if (match) {
                const id = Number(match[1]);
                if (!Number.isInteger(id)) {
                    return sendJson(res, 400, { error: "Note id must be a number" });
                }
                const note = notes.find(n => n.id === id);
                if (!note) {
                    return sendJson(res, 404, { error: "Note not found" });
                }
                return sendJson(res, 200, note);
            }
        }

    }
    else if(method == "DELETE"){
        const match = url.match(/^\/notes\/([^/]+)$/);
    
        if (match) {
            const id = Number(match[1]);
            if (!Number.isInteger(id)) {
                return sendJson(res, 400, { error: "Note id must be a number" });
            }
            try{
                const note = await getNote(id);
                if(!note){
                    return sendJson(res,404,{error:"Note not found"});
                }
                const res = await deleteNote(id);
                return sendJson(res,200,res);
            }catch(err){
                console.error(err);
                return sendJson(res,500,{error:"failed to Update note"});
            }
        }

    }
    else if(method == "PUT"){

        try{
            data = JSON.parse(await readBody(req));
        }catch(err){
            const reason = err instanceof Error ? err.message:String(err);
            return sendJson(res,400,reason);
        }
    }
    


};
const server = http.createServer()
server.listen(3000,()=>console.log(`Listening on http://localhost:3000`));

