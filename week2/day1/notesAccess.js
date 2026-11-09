import { writeFile } from 'node:fs';
import fs, { readFile } from 'node:fs/promises';
async function readNotes(){
    let notes = [];
    try{
        const data = await readFile("./notes.json","utf8");
        if(!data.trim()){
            return [];
        }
        notes = JSON.parse(data);
        return Array.isArray(notes)?notes:[];
    }catch(err){
        console.log(`Uanble to readfile notes.json`,err.message);
    }
}
async function writeToNotes(notes){
    try{
        await fs.writeFile('./notes.json',JSON.stringify(notes,null,2),"utf8");
    }catch(err){
        console.log("Unable to write to notes.json",err.message);
    }
}
export async function getNotes(){
    let notes = readNotes();
    return notes;

}
export async function getNote(id){
    let notes = await readNotes();
    const note = notes.find(n=>n.id===id);
    if(!note){
        return "";
    }
    return note;
}
export async function addNotes(note){
    let notes = await readNotes();
    const maxId = notes.reduce((maxId,n)=>Math.max(maxId,n.id),0);
    const newNote = {id:maxId+1,text:note['text']};
    notes.push(newNote);
    await writeToNotes(notes);

    return newNote;
}
export async function updateNotes(id,newNote){

    let notes = await readNotes();
    const note= notes.find(n=>n.id===id);
    if(!id){
        return id;
    }
    note.text = newNote;
    await writeToNotes(notes);
    return note;
}
export async function deleteNote(id){
    let notes = await readNotes();
    const index = notes.findIndex(n=>n.id===id);
    if(index===-1){
        return "";
    }
    notes.splice(index,1);
    await writeToNotes(notes);
    return "Successfully deleted";
}