export type Duration = 'q'|'h'|'w';
export interface ScoreEvent {id:string;notes:number[];duration:Duration;started:number}
export const beats:Record<Duration,number>={q:1,h:2,w:4};
export const durationName:Record<Duration,string>={q:'四分音符',h:'二分音符',w:'全音符'};
export function transposeEvent(event:ScoreEvent,delta:number):ScoreEvent {return event.notes.every(n=>n+delta>=48&&n+delta<=84)?{...event,notes:event.notes.map(n=>n+delta)}:event;}
export function changeDuration(event:ScoreEvent,direction:1|-1):ScoreEvent {const order:Duration[]=['q','h','w'];return {...event,duration:order[Math.max(0,Math.min(2,order.indexOf(event.duration)+direction))]};}
export function validEvents(value:unknown):ScoreEvent[]{if(!Array.isArray(value))throw Error('无效曲谱');if(value.length>128)throw Error('曲谱最多128组音符');const ids=new Set<string>();return value.map((e:unknown)=>{const n=e as ScoreEvent;if(!n||typeof n.id!=='string'||!Array.isArray(n.notes)||!n.notes.length||n.notes.length>25||!n.notes.every(p=>Number.isInteger(p)&&p>=48&&p<=84)||!['q','h','w'].includes(n.duration)||!Number.isFinite(n.started))throw Error('曲谱音符数据无效');if(ids.has(n.id))throw Error('重复音符ID');ids.add(n.id);return {...n,notes:[...new Set(n.notes)].sort((a,b)=>a-b)};});}
export const quantize=(ms:number,bpm:number):Duration=>{const b=ms/(60000/bpm);return b<1.5?'q':b<3?'h':'w';};
export function appendNote(events:ScoreEvent[],midi:number,ms:number,bpm:number,started:number):ScoreEvent[]{
 const duration=quantize(ms,bpm);const near=events.find(e=>Math.abs(e.started-started)<90);
 if(near)return events.map(e=>e.id===near.id?{...e,notes:[...new Set([...e.notes,midi])].sort((a,b)=>a-b),duration:beats[duration]>beats[e.duration]?duration:e.duration}:e);
 if(events.length>=128)return events;
 return [...events,{id:globalThis.crypto?.randomUUID?.()??`${Date.now()}-${Math.random().toString(36).slice(2)}`,notes:[midi],duration,started}].sort((a,b)=>a.started-b.started);
}
export function timeline(events:ScoreEvent[],bpm:number){let time=0;return events.map(e=>{const duration=beats[e.duration]*60/bpm;const event={...e,time,seconds:duration};time+=duration;return event;});}
