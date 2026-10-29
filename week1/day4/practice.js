// setTimeout(()=>console.log("later"),1000);
// console.log("now");
//A promise is a value that arrives later
// Its pending until its fulfilled with a value or rejected with an error
const myPromise = new Promise((resolve,reject)=>{
    const success = true;
    if(success){
        resolve("Operation was successsful");
    }
    else{
        reject("Something went wrong");
    }
});
async function main(){
    try{
        const value = await myPromise;
        console.log(value);

    }catch(err){
        console.error("Failed", err.message);
    }
}
