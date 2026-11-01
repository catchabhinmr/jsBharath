import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";

// Create 30 files of format of images ,documents, audio, video, archives
const folder_types_dict = {
    "images":[".jpg", ".jpeg", ".png", ".gif"],
    "documents": [".pdf", ".docx", ".txt", ".md"],
    "audio": [".mp3", ".wav"],
    "archives": [".zip", ".tar", ".gz"],
    "videos": [".mp4", ".mov"],

}; 
const folder_types = Object.keys(folder_types_dict); 
let count =0 ;
await fs.mkdir("./test-folder", { recursive: true });
while(count<30){

    const folder_type = folder_types[Math.floor(Math.random()*(folder_types.length))];
    const len = folder_types_dict[folder_type].length;
    const extension = folder_types_dict[folder_type][Math.floor(Math.random()*(len))];
    const name = randomUUID();
    const fileName = `${name}${extension}`;
    await fs.writeFile(`./test-folder/${fileName}`,"");
    count+=1;

}
console.log(`Created 30 files in ./test-folder`);
