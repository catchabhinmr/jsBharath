import Fastify from "fastify";
import {z} from "zod";
import { addLink, getLink } from "./helper-shortner.js";
const app = Fastify({logger:true});
await app.register(import('@fastify/rate-limit'), {
  max: 2,
  timeWindow: '1 minute'
})
const CodeSchema= z.object({
    code: z.string().length(6)
})
const LinkSchema = z.object({
    longUrl: z.httpUrl()
});
type Code = z.infer<typeof CodeSchema>;
type Link = z.infer<typeof LinkSchema>;
app.get("/health", async () => {
  return { status: "ok" };                      // returned object → 200 JSON
});
app.get<{Params:{code:string}}>("/links/:code",async (req,reply)=>{
    const {code} =  req.params;
    const parseCode = CodeSchema.safeParse({code});
    if(!parseCode.success){
        return reply.code(400).send({error:`Improper Code`})
    }
    const shortCode = parseCode.data.code;
    const originalURL = await getLink(shortCode,false); 
    if(!originalURL.ok){
        return reply.code(404).send({error:originalURL.error});
    }
    return reply.code(200).send(originalURL.value);

});
app.get<{Params:{code:string}}>("/:code",async (req,reply)=>{
    const {code} =  req.params;
    const parseCode = CodeSchema.safeParse({code});
    if(!parseCode.success){
        return reply.code(400).send({error:`Improper Code`})
    }
    const shortCode = parseCode.data.code;
    const originalURL = await getLink(shortCode,true); 
    if(!originalURL.ok){
        return reply.code(404).send({error:originalURL.error});
    }
    return reply.redirect(originalURL.value.url,302);    
});
app.post("/links",async (req, reply)=>{
    const parseData= LinkSchema.safeParse(req.body);
    if(!parseData.success){
        return reply.code(400).send({error:`Please provide a http url`});
    }
    const {longUrl} = parseData.data;
    const res  = await addLink(longUrl);
    if(!res.ok){
        return reply.code(400).send(res.error);
    }
    const shortUrl = new URL(res.value.code,"http://127.0.0.1:3000")
    return reply.code(201).send({url: shortUrl.toString()})
});

app.listen({port:3000},err=>{
    if(err) throw err ;
    console.log("Server listening at http://localhost:3000");
})
