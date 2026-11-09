import fs from "node:fs/promises";
import path from "node:path";
const folder_types_dict = {
    "images":[".jpg", ".jpeg", ".png", ".gif"],
    "documents": [".pdf", ".docx", ".txt", ".md"],
    "audio": [".mp3", ".wav"],
    "archives": [".zip", ".tar", ".gz"],
    "videos": [".mp4", ".mov"],

}; 
function getCategory(extension){
    for(const category of Object.keys(folder_types_dict)){
        if(folder_types_dict[category].includes(extension)){
            return category;
        }
    }
    return "";
}
const folder_types = Object.keys(folder_types_dict); 
const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const folder = args.find(a=> !a.startsWith("--"));
if(dryRun){
    let count = {};
    const files = await fs.readdir("./test-folder");
    for(const file of files){
        if(!file.isFile()){
            continue;
        }
        const extension = path.extname(file);
        // console.log(extension);
        
        let category = getCategory(extension);
        if(category.length == 0){
            category = "other";
        }
        console.log(`[dry-run] ${file} -> ${category}/${file} `);
        count[category] = (count[category]??0)+1;
    }
    const summary = Object.entries(count).map(([k,v])=>`${k}:${v}`);
    console.log(`Summary: ${summary.join(", ")}`);
}
else if(folder){
    
    let count = {};
    const files = await fs.readdir("./test-folder");
    for(const file of files){
        const extension = path.extname(file);
        // console.log(extension);
        const category = getCategory(extension);
        await fs.mkdir(path.join(`test-folder`,category),{recursive: true});
        await fs.rename(path.join(`test-folder`,file),path.join(`test-folder`,category,file));
        console.log(`Moved ${file} -> ${category}/${file} `);
        count[category] = (count[category]??0)+1;
    }
    const summary = Object.entries(count).map(([k,v])=>`${k}:${v}`);
    const total = Object.values(count).reduce((a,b)=>(a+b,0));
    console.log(`Summary: ${summary.join(", ")} - ${total} moved`);
}