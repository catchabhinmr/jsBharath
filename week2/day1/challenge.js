import http from "node:http";
import { addNotes, updateNotes, getNotes, getNote, deleteNote} from "./notesAccess.js";

function sendJson(response, status, body) {
  response.writeHead(status, { "Content-Type": "application/json" });
  response.end(JSON.stringify(body));
}

const server = http.createServer(async (request, response) => {
    const {method, url} = request;
    if(method === "PUT" || method == "POST"){
        let body = [];
        request
        .on('data', chunk => {
            body.push(chunk);
        })
        .on('end', async () => {
            body = Buffer.concat(body).toString();
            let data;
            try{
                data = JSON.parse(body);
            }catch(err){
                console.error(err.message);
                return sendJson(response,400,{error:"Invalid JSON"});
            }

            if(!data.text.trim()){
                return sendJson(response,400,{error:"text must be a non-empty string"});
            }
            if(method === "POST"){
                try{
                    const res = await addNotes(data);
                    return sendJson(response,201,res);
                }catch(err){
                    console.error(err);
                    return sendJson(response,500,{error:"failed to save note"});
                }
                
            }
            else if(method === "PUT"){

                const match = url.match(/^\/notes\/([^/]+)$/);
                if (match) {
                    const id = Number(match[1]);
                    if (!Number.isInteger(id)) {
                        return sendJson(res, 400, { error: "Note id must be a number" });
                    }
                    try{
                        const previousNote = await getNote(id);
                        if(!previousNote){
                            return sendJson(response,404,{error:"Note not found"});
                        }
                        const res = await updateNotes(id, data.text);
                        return sendJson(response,200,res);
                    }catch(err){
                        console.error(err);
                        return sendJson(response,500,{error:"failed to Update note"});
                    }
                }
            }
        });

    }
    else if(method === "GET"){  
        const notes = await getNotes();
        if (url=== "/notes") {
            sendJson(response,200,notes);
        }
        else{
            // GET /notes/:id
            const match = url.match(/^\/notes\/([^/]+)$/);
            if (match) {
                const id = Number(match[1]);
                if (!Number.isInteger(id)) {
                    return sendJson(response, 400, { error: "Note id must be a number" });
                }
                const note = notes.find(n => n.id === id);
                if (!note) {
                    return sendJson(response, 404, { error: "Note not found" });
                }
                return sendJson(response, 200, note);
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
                    return sendJson(response,404,{error:"Note not found"});
                }
                const res = await deleteNote(id);
                return sendJson(response,200,res);
            }catch(err){
                console.error(err);
                return sendJson(response,500,{error:"failed to Update note"});
            }
        }
    }
});
server.listen(3000, () => console.log(`Listening on http://localhost:${3000}`));