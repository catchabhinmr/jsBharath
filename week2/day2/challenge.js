import http from "node:http";
import {sendJson, readJson, addUrl,getOriginalUrl, redirect} from "./helper.js"
import { randomInt } from "node:crypto";

function getShortCode(){
    const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for(let i=0;i<6;i++){
        code+=alphabet[randomInt(alphabet.length)];
    }
    return code;

}
const server = http.createServer(async (request, response) => {
    const {method, url} = request;
    if(method === "POST" && url==="/links"){
        const data = await readJson(request,response);
        if(!data.url.trim()){
            return sendJson(response,400,{error:"Bad request, Body is not proper"});
        }
        try{
            const longUrl = new URL(data.url);
            const protocol = longUrl.protocol;
            if(protocol!=="https:" && protocol!=="http:"){
                return sendJson(response,400,{error:"url must be a valid http or https URL"});
            }
            const shortCode = getShortCode();
            await addUrl(shortCode,data.url);
            return sendJson(response,201,{code: shortCode, shortUrl:`http://localhost:3000/${shortCode}`,url:longUrl});

        }catch(err){
            console.error(err.message);
            return sendJson(response,400,{error:`Failed to create a shortcode for the URL ${err.message}`});
        }
    } 
    else if(method === "GET"){
        if(url.startsWith("/links")){
            const formedUrl= new URL(url,"http://localhost");           
            const [resource, code] = formedUrl.pathname.split("/").filter(Boolean);
            const originalUrl = await getOriginalUrl(code,false);
            return sendJson(response,200,originalUrl);
        }
        else{
            const [code]= url.split("/").filter(Boolean);
            const entry = await getOriginalUrl(code,true);
            if(!entry){
                return sendJson(response,400,{error:"Short link not found"});
            }
            const redirectUrl = entry.url;
            return redirect(response,redirectUrl);
        }
    }
    else{
        return sendJson(response, 404, { error: "Not found" });
    }
});

server.listen(3000, () => console.log(`Listening on http://localhost:3000`));