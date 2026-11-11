import { readFile, writeFile } from "node:fs/promises";
import http from "node:http";

export function sendJson(response, status, body) {
    response.writeHead(status, { "Content-Type": "application/json" });
    response.end(JSON.stringify(body));

}
export function redirect(response,location,status=302){
    response.writeHead(status, { Location: location});
    response.end();
}
export async function readJson(request,response){
    try{
        const raw = await readBody(request);
        const data = JSON.parse(raw);
        return data;
    }catch(err){
        console.error(err.message);
        return sendJson(response,400,{error:"Invalid JSON"});
    }

}
async function readBody(request, limit = 1024*1024){
    return new Promise((resolve, reject) => {
        const chunks = [];
        let size = 0;

        request
        .on('error', reject)
        .on('data', chunk => {
            size += chunk.length;
            if (size > limit) {
                reject(Object.assign(new Error('Payload too large'), { statusCode: 413 }));
                request.destroy();
                return;
            }
            chunks.push(chunk);
        })
        .on('end', () => {
            resolve(Buffer.concat(chunks).toString('utf8'));
        });
    });

}
async function readUrls(){
    let links = [];
    let data;
    try{
        data = await readFile("./links.json","utf8");
        if(!data.trim()){
            return [];
        }
    }catch(err){
        return links; 
    }
    try{
        links = JSON.parse(data); 
        return Array.isArray(links)?links:[];
    }catch(err){
        console.error(`Unable to parse data ${err.message}`);
    }
}
async function updateUrls(urls){
    try{
        await writeFile("./links.json",JSON.stringify(urls,null,2),"utf8");
    }catch(err){
        console.error("Unable to write to links.json",err.message);
        return sendJson(response,400,{error:"Unable to write to links.json"});
    }

}
export async function addUrl(shortcode,longUrl){
    const urls= await readUrls();
    const createdAt= new Date().toISOString();
    const newUrl={url:longUrl,code:shortcode,clicks:0,createdAt:createdAt}; 
    urls.push(newUrl);
    await updateUrls(urls);
}
export async function getOriginalUrl(code,update){
    const urls = await readUrls();
    const originalUrl = urls.find(url=>url.code===code);
    if(!originalUrl){
        return "";
    }
    if(update){
        originalUrl.clicks+=1;
        updateUrls(urls);
    }
    return originalUrl;
}