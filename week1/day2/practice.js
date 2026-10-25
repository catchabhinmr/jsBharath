const prices = [12, 15, 10, 2, 5, 80];

prices.map(p => 2 * p); //convert
prices.filter(p => p > 10);//all elements that passe the given condition
prices.find(p => p > 10); //first element that passes the condition
prices.some(p => p > 5); //does any pass
prices.reduce((sum, p) => sum + p, 0);
//you can chain them

//closure examples
function makeGreeter(greeting) {
  return name => `${greeting}, ${name}`;
}
const hello = makeGreeter("Hello");
const hola = makeGreeter("Hola");
console.log(hello("Ana"));
console.log(hola("Abi"));

//the remembered values can also change which give it a private state

function makeLogger() {
  let count = 0;
  return msg => {
    count++;
    console.log(`#${count} ${msg}`);
  };
}
const log = makeLogger();
log("Hey there");
log("GoodBye");

