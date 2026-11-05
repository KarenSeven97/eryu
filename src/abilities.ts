import {modes} from './music';
import type {Attempt} from './storage';
export function abilities(attempts:Attempt[]){return modes.map(m=>{const a=attempts.filter(x=>x.mode===m.id);const weighted=a.reduce((sum,x)=>sum+(x.correct?(x.level==='normal'?1:0.6):0),0);return {...m,count:a.length,accuracy:a.length?Math.round(a.filter(x=>x.correct).length/a.length*100):0,value:a.length?Math.round(100*weighted/a.length*Math.min(a.length/20,1)):0};});}
