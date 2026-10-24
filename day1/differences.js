//difference 
equality = 5 == "5"; //doesnt check type
equalityByValueAndType = "5" === 5;
typeconversion = 0 == "";
typeconversion1 = null == undefined;
typeof1 = typeof null;
typeof2 = typeof [];
notANumber = (NaN === NaN);
addFloat = 0.1 + 0.2
divideNumbers = 7 / 2

console.log("5==\"5\"".padEnd(30) + `-> ${equality}`);
console.log("\"5\" === 5".padEnd(30) + `-> ${equalityByValueAndType}`);
console.log("0==\"\"".padEnd(30) + `-> ${typeconversion}`);
console.log("null == undefined".padEnd(30) + `-> ${typeconversion1}`);
console.log("typeof null".padEnd(30) + `-> ${typeof1}`);
console.log("typeof []".padEnd(30) + `-> ${typeof2}`);
console.log("Nan===Nan".padEnd(30) + `-> ${notANumber}`);
console.log("0.1 +0.2".padEnd(30) + `-> ${addFloat}`);
console.log("divideNumbers".padEnd(30) + `-> ${divideNumbers}`);
