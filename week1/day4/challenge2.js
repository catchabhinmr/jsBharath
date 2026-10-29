function myFlakyApi(failRate = 0.5){
    return new Promise((resolve,reject)=>{
        const delay = Math.random()*1000+200; //delay of 200 to 1200ms
        setTimeout(()=>{
            if(Math.random()<failRate){
                reject(new Error("Request failed, please try again"));
            }
            else{
                resolve({id:1,name:"Abhin",status:"ok"});
            }
        },delay);
    });

}
// A helper function for waiting a certain amount of time before the retry
const wait = (ms)=>new Promise((resolve)=>(setTimeout(resolve,ms)));

async function fetchWithRetries(retries = 3, baseDelay=500){
    for(let attempt=1;attempt<retries;attempt++){

        try {
            console.log(`Attemp ${attempt}`);
            const result = await myFlakyApi();
            console.log("Success:",result);
            return result
        }catch(err){
            console.log(`Attempt ${attempt} failed: `, err.message);
            if(attempt == 3){
                throw new Error(`All ${retries} attempts failed`);
            }
            await wait(baseDelay*2**(attempt-1));
            
        }

    }
}
async function main(){
    try{
        await fetchWithRetries(3);
    }catch(err){
        console.error("Giving up", err.message);
    }
}
main();