export type Duration = 'q'|'h'|'w';
export interface ScoreEvent {id:string;notes:number[];duration:Duration;started:number}
export const beats:Record<Duration,number>={q:1,h:2,w:4};
export const durationName:Record<Duration,string>={q:'四分音符',h:'二分音符',w:'全音符'};
export const quantize=(ms:number,bpm:number):Duration=>{const b=ms/(60000/bpm);return b<1.5?'q':b<3?'h':'w';};
export function appendNote(events:ScoreEvent[],midi:number,ms:number,bpm:number,started:number):ScoreEvent[]{
 const duration=quantize(ms,bpm);const near=events.find(e=>Math.abs(e.started-started)<90);
 if(near)return events.map(e=>e.id===near.id?{...e,notes:[...new Set([...e.notes,midi])].sort((a,b)=>a-b),duration:beats[duration]>beats[e.duration]?duration:e.duration}:e);
 if(events.length>=128)return events;
 return [...events,{id:globalThis.crypto?.randomUUID?.()??`${Date.now()}-${Math.random().toString(36).slice(2)}`,notes:[midi],duration,started}].sort((a,b)=>a.started-b.started);
}
export function timeline(events:ScoreEvent[],bpm:number){let time=0;return events.map(e=>{const duration=beats[e.duration]*60/bpm;const event={...e,time,seconds:duration};time+=duration;return event;});}
