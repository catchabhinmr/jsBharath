//Unions, narrowing and generics
let id: string|number;
type Status = "pending"|"done";
let s: Status = "done";
// s = "finished";
//modeling one of several shapes
type Shape = | {kind: "circle"; radius: number} | {kind: "square"; side:number} | {kind:"triangle";base:number,height:number};
function area(s: Shape): number{
    switch(s.kind){
        case "circle": return Math.PI*s.radius**2;
        case "square": return s.side**2;
        default:{
            console.log("not a defined shape");
            return -1;
        }
    }
}
const circle: Shape = {kind:"circle",radius:5}; 
console.log(area(circle));