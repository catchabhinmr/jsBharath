function average(nums: number[]): number{
    const total = nums.reduce((s,n)=>s+n,0);
    return total/nums.length;
}
const double = (x:number): number=>x*2;

type Note = {
    id: number;
    text: string;
    createdAt?: string;
};
interface Named {
    readonly name: string;
}
type Point = {x:number,y:number};
function show(p: Point){
    console.log(p.x,p.y);
}
show({x:1,y:2});
const pos = {x:5,y:7,z:3};
show(pos);