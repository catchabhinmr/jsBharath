import path from "node:path";
import fs from "node:fs/promises"
path.join("photos","beach.jpg");
path.extname("beach.jpg");
path.basename("photos/beach.jgp",".jpg");

const entries = await fs.readdir("./photos", {withFileTypes: true});
for(const entry of entries){
    console.log(entry.name, entry.isFile()?"file":folder);
}
await fs.mkdir("./photos/old",{recursive: true});
await fs.writeFile("./photos/empty.txt", "");
await fs.rename("./photos/a.jpg", "./photos/old/a.jpg");

try{
    await fs.access("./photos/a.jpg");
    console.log("exists");
}catch(err){
    if(err.code == "ENOENT") console.log("doesnt exist");
    else throw err;
}

for( const file of files){
    await processFile(file); //waits for each one;
}
//node organize.js ./test-folder --dry-run
const args = process.argv.slice(2);
const dryRun = args.includes("--dry_run");
const folder = args.find(a=>!a.startsWith("--"));
