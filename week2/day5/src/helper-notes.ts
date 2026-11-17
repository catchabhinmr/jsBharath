import { error } from 'node:console';
import { unlink, writeFile } from 'node:fs';
import fs, { readFile } from 'node:fs/promises';
type Note = {id:number, text: string};
export type Result<T> = { ok: true; value: T } | { ok: false; error: string };
const PATH = "notes.json";
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
function isNote(note: unknown): note is Note{
    return (
        typeof note === "object" &&
        note!==null &&
        "id" in note && typeof note.id==="number" && Number.isInteger(note.id) &&
        "text" in note && typeof note.text==="string"
    );
}
function parseNotes(path:string, data:unknown): Result<Note[]>{
    if(!Array.isArray(data)){
        return {ok:false,error:`${path} is corrupted: expected a list of todos`};
    }
    let notes: Note[] = [];
    for(const [index,note] of data.entries()){
        if(!isNote(note)){
            return {ok:false,error:`${path} is corrupted, item ${index} is not valid note`};
        }
        notes.push(note);
    }
    return {ok:true,value:notes};
}
async function readJson<T>(path: string, fallback: T): Promise<T>{
    let text: string;
    try{
        text = await readFile("./notes.json","utf8");

    }catch(errror){
        if(error instanceof Error && "code" in error && error.code=="ENOENT")return fallback;
        throw error;
    }
    return text.trim() ===""?fallback: JSON.parse(text);
}
async function writeToNotes<T>(notes: Note[],fallback: T):Promise<T>{
    try{
        await fs.writeFile('./notes.json',JSON.stringify(notes,null,2),"utf8");
    }catch(err){
        if(error instanceof Error && "code" in error && error.code=="ENOENT")return fallback;
        throw error;
        
    }
    return fallback;
}
export async function getNotes(): Promise<Note[]>{
    const res = await loadNotes(PATH);
    if(!res.ok){
       return []; 
    }
    return res.value;
}
export async function getNote(id: number){
    let notes: Note[] = await getNotes();
    const note: Note | undefined= notes.find(n=>n.id===id);
    if(!note){
        return "";
    }
    return note;
}
export async function addNotes(note: Note){
    let notes = await getNotes();
    const maxId = notes.reduce((maxId,n)=>Math.max(maxId,n.id),0);
    const newNote = {id:maxId+1,text:note['text']};
    notes.push(newNote);
    await writeToNotes(notes,[]);

    return newNote;
}
export async function updateNotes(id:number,newNote:string){

    let notes = await getNotes();
    const note: Note|undefined= notes.find(n=>n.id===id);
    if(!id){
        return id;
    }
    if(!note){
        return "";//change here
    }
    note.text = newNote;
    await writeToNotes(notes,[]);
    return note;
}
export async function deleteNote(id: number){
    let notes = await getNotes();
    const index = notes.findIndex(n=>n.id===id);
    if(index===-1){
        return "";
    }
    notes.splice(index,1);
    await writeToNotes(notes,[]);
    return "Successfully deleted";
}
