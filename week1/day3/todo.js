import fs from "node:fs";
// class Task {
//     #id 
//     constructor(id,name){
//         this.id = id;
//         this.name = name;
//         this.completed = false;
//         this.deleted = false;
//     }
// }
let tasks = []
if(fs.existsSync("./todos.json")){
    const content = fs.readFileSync("./todos.json", "utf8").trim();   // text → object
    if(content){
        tasks = JSON.parse(content);
    }
}
const args = process.argv.slice(2);
if(args[0] === "add"){
    const taskName = args[1];
    if(!taskName){
        console.log("No taskname provided");
        process.exit(1);
    }
    const taskId = tasks.reduce((maxId,t) => Math.max(t.id ,maxId),0);
    const newTask = {id:taskId+1,taskName:taskName,completed:false,deleted:false,};
    tasks.push(newTask);
    fs.writeFileSync("todos.json", JSON.stringify(tasks, null, 2));    // object → readable text
    console.log(`Added #${taskId+1}: ${taskName}`);
}
else if(args[0]=== "done"){
    const taskId = Number(args[1]);
    const task = tasks.find(t=>(t.id === taskId && !t.deleted));
    if(!task){
        console.log(`No to-do with id ${taskId}`);
        process.exit(1);
    }
    task.completed = true;
    fs.writeFileSync("todos.json", JSON.stringify(tasks, null, 2));    // object → readable text
    console.log(`Completed #${task.id}: ${task.taskName}`);
}
else if(args[0] === "list"){
    tasks.filter(t => !t.deleted).forEach(t=>console.log(`${t.completed?"[x]":"[ ]"} ${t.id} ${t.taskName}`));
}
else if(args[0] === "delete"){
    const taskId = Number(args[1]);
    const taskToDelete = tasks.find(t=>t.id===taskId && !t.deleted);
    if(!taskToDelete){
        console.log(`No to-do to delete with id ${taskId}`);
        process.exit(1);
    }
    taskToDelete.deleted = true;
    fs.writeFileSync("todos.json", JSON.stringify(tasks, null, 2));    // object → readable text
    console.log(`Deleted #${taskId}: ${taskToDelete.taskName}`);
}
else if(args[0] === "frobnicate"){
    console.log(`Usage: node todo.js add "<text>" | list | done <id> | delete <id></id>`)
}