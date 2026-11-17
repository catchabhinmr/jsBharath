import Fastify from "fastify";
import {z} from "zod";
import { addNote, deleteNote,getNote, getNotes, updateNote} from "./helper-notes.js";
const app = Fastify({logger:true});

const textSchema = z.object({
    text: z.string().min(1)
});
const idSchema = z.object({
    id: z.coerce.number().positive().min(1)
});

type NoteText= z.infer<typeof textSchema>;
app.get("/notes",async (req,reply)=>{
    const note = await getNotes();
    if(!note.ok){
        return reply.code(400).send({error:note.error}); 
    }
    return reply.code(200).send(note.value);
});
app.get<{Params:{id:string}}>("/notes/:id",async (req,reply) => {
    const {id}= req.params; 
    const parsedId = idSchema.safeParse({id:`${id}`});
    if(!parsedId.success){
        return reply.code(400).send({error: parsedId.error.issues});
    }
    const note = await getNote(parsedId.data.id);
    if(!note.ok){
        return reply.code(404).send({error:note.error}); 
    }
    return reply.code(200).send(note.value);
});
app.post("/notes",async (req,reply)=>{
    const parsed = textSchema.safeParse(req.body);
    if(!parsed.success){
        return reply.code(400).send({error: parsed.error.issues});
    }
    const noteText: NoteText= parsed.data;
    const newNote = await addNote(noteText.text);
    if(!newNote.ok){
        return reply.code(400).send({error:newNote.error}); 
    }
    return reply.code(201).send(newNote.value);
});
app.put<{Params:{id:string}}>("/notes/:id",async (req,reply)=>{
    const {id}= req.params; 
    const parsedId = idSchema.safeParse({id:`${id}`});
    if(!parsedId.success){
        return reply.code(400).send({error: parsedId.error.issues});
    }
    const parsed = textSchema.safeParse(req.body);
    if(!parsed.success){
        return reply.code(400).send({error: parsed.error.issues});
    }
    const noteText: NoteText= parsed.data;
    const res = await updateNote(noteText.text,parsedId.data.id);
    if(!res.ok){
        return reply.code(404).send({ error: res.error }); 
    }
    return reply.code(200).send(res.value);
});
app.delete<{Params:{id:string}}>("/notes/:id",async (req,reply)=>{
    const {id}= req.params; 
    const parsedId = idSchema.safeParse({id:`${id}`});
    if(!parsedId.success){
        return reply.code(400).send({error: parsedId.error.issues});
    }
    const res = await deleteNote(parsedId.data.id);
    if(!res.ok){
        return reply.code(404).send({ error: res.error }); 
    }
    return reply.code(204).send(res.value);
});
await app.listen({port:3000})