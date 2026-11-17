import { readFile, writeFile } from "node:fs/promises";
import {z} from "zod";
const PATH = "./notes.json";
type Result<T> = {ok:true; value:T} | {ok:false;error: string};
const NoteSchema = z.object({
    id: z.coerce.number().int().positive(),
    text: z.string().min(1)
});
export type Note = z.infer<typeof NoteSchema>;

export async function loadNotes(path: string): Promise<Result<Note[]>>{
    let data: unknown;
    try{
        data = await readJson<unknown>(path,[]);
    }catch(error){
        const reason = error instanceof Error?error.message:String(error);
        return {ok:false, error: reason};
    }
    return parseNotes(path,data);
}

async function readJson<T>(path: string, fallback: T): Promise<unknown> {
    let text: string;
    try{
        text = await readFile(path,"utf8");
    }catch(error){
        if(error instanceof Error && "code" in error && error.code === "ENOENT")return fallback;
        throw error;
    }
    return text.trim()===""?fallback:JSON.parse(text);
}

function parseNotes(path:string,data:unknown): Result<Note[]>{
    if(!Array.isArray(data)){
        return {ok:false, error:"Notes.json is corrupted"};
    }
    let notes: Note[] = [];
    for(const [index,currentNote] of data.entries()){
        const parseNote = NoteSchema.safeParse(currentNote); 
        if(!parseNote.success){
            return {ok:false, error:`${path} is corrupted at, item ${index} is not a valid note`};
        }
        notes.push(parseNote.data);

    }
    return {ok:true,value:notes};
}
export async function addNote(text: string): Promise<Result<Note>>{
    let loaded= await loadNotes(PATH);
    if(!loaded.ok){
        return {ok:false, error:`Unable to loadNotes`};
    }
    let listNotes: Note[] = loaded.value; 
    let index:number = listNotes.reduce((maxId:number,n: Note)=>(Math.max(maxId,Number(n.id))),0);
    let newNote: Note = {id:index+1,text:text};
    listNotes.push(newNote);
    await updateNotes(listNotes,[]);
    return {ok:true,value:newNote};
}

export async function deleteNote(id: number):Promise<Result<number>>{
    let loaded =await loadNotes(PATH);
    if(!loaded.ok){
        return {ok:false, error:`Unable to loadNotes`};
    }
    let listNotes: Note[] = loaded.value;
    let deletedNote = listNotes.find(n=>n.id===id);
    if(!deletedNote){
        return {ok:false, error:`Note of id: ${id} not found`};
    }
    listNotes = listNotes.filter(n=>n.id!==id);
    await updateNotes(listNotes,[]);
    return {ok:true,value:id};
}
async function updateNotes<T>(notes: Note[],fallback: T):Promise<unknown>{
    try{
        await writeFile(PATH,JSON.stringify(notes,null,2)+"\n");
    }catch(error){
        if(error instanceof Error && "code" in error && error.code === "ENOENT")return fallback;
        throw error;
    }
}
export async function getNote(id: number):Promise<Result<Note>>{
    let loaded = await loadNotes(PATH);
    if(!loaded.ok){
        return {ok:false, error:`Unable to loadNotes`};
    }
    let listNotes: Note[] = loaded.value;
    let note = listNotes.find(n=> n.id ===id);
    if(!note){
        return {ok:false, error: `Note not found for id: ${id}`};
    }
    return {ok:true, value:note};
}
export async function getNotes():Promise<Result<Note[]>>{

    let loaded = await loadNotes(PATH);
    if(!loaded.ok){
        return {ok:false, error:`Unable to loadNotes`};
    }
    let listNotes: Note[] = loaded.value;
    return {ok:true, value:listNotes};
}
export async function updateNote(text: string,id: number):Promise<Result<Note>>{
    let loaded = await loadNotes(PATH);
    if(!loaded.ok){
        return {ok:false, error:loaded.error};
    }
    let listNotes: Note[] = loaded.value;
    let note = listNotes.find(n=> n.id ===Number(id));
    if(!note){
        return {ok:false, error: `Note not found for id: ${id}`};
    }
    note.text = text;
    await updateNotes(listNotes,[]);
    return {ok:true,value:{id:Number(id),text:text}};
}

