import { randomInt } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import {z} from "zod";
const PATH = "./links.json";
type Result<T> = {ok:true; value:T} | {ok:false;error: string};
const LinkSchema = z.object({
    url:z.url(),
    code:z.string().length(6),
    clicks:z.number(),
    createdAt:z.iso.datetime()
});
export type Link= z.infer<typeof LinkSchema>;

export async function loadLinks(path: string): Promise<Result<Link[]>>{
    let data: unknown;
    try{
        data = await readJson<unknown>(path,[]);
    }catch(error){
        const reason = error instanceof Error?error.message:String(error);
        return {ok:false, error: reason};
    }
    return parseLinks(path,data);
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

function parseLinks(path:string,data:unknown): Result<Link[]>{
    if(!Array.isArray(data)){
        return {ok:false, error:"links.json is corrupted"};
    }
    let links: Link[] = [];
    for(const [index,currentLink] of data.entries()){
        const parseLink= LinkSchema.safeParse(currentLink); 
        if(!parseLink.success){
            return {ok:false, error:`link at id ${index} is corrupted`};
        }
        links.push(parseLink.data);

    }
    return {ok:true,value:links};
}
export async function addLink(longUrl: string): Promise<Result<Link>>{
    let loaded= await loadLinks(PATH);
    if(!loaded.ok){
        return {ok:false, error:`Unable to load links.json`};
    }
    let listLink: Link[] = loaded.value; 
    let newShortCode = getShortCode();
    let currentTime= new Date().toISOString();
    let newLink: Link = {url:longUrl,code:newShortCode,clicks:0,createdAt:currentTime};

    listLink.push(newLink);
    await updateLinks(listLink,[]);
    return {ok:true,value:newLink};
}

async function updateLinks<T>(links: Link[],fallback: T):Promise<unknown>{
    try{
        await writeFile(PATH,JSON.stringify(links,null,2)+"\n");
    }catch(error){
        if(error instanceof Error && "code" in error && error.code === "ENOENT")return fallback;
        throw error;
    }
}
export async function getLink(id: string,redirect: boolean):Promise<Result<Link>>{

    let loaded = await loadLinks(PATH);
    if(!loaded.ok){
        return {ok:false, error:`Unable to load links`};
    }
    let listLink: Link[] = loaded.value;
    let link= listLink.find(n=> n.code===id);
    if(!link){
        return {ok:false, error: `Link not found for shortCode: ${id}`};
    }
    if(redirect){
        link.clicks = link.clicks+1;
        updateLinks(listLink,[]);
    }
    return {ok:true, value:link};
}
export function getShortCode(){
    const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for(let i=0;i<6;i++){
        code+=alphabet[randomInt(alphabet.length)];
    }
    return code;

}
