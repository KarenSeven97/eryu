import type {ScoreEvent} from './composition';
export type Clef = 'treble'|'bass';
export const inClef=(midi:number,clef:Clef)=>clef==='bass'?midi<60:midi>=60;
export const partNotes=(event:ScoreEvent,clef:Clef)=>event.notes.filter(n=>inClef(n,clef));
export function replacePart(event:ScoreEvent,clef:Clef,notes:number[]):ScoreEvent {
 return {...event,notes:[...new Set([...event.notes.filter(n=>!inClef(n,clef)),...notes.filter(n=>inClef(n,clef)&&n>=48&&n<=84)])].sort((a,b)=>a-b)};
}
export function transposePart(event:ScoreEvent,clef:Clef,delta:number):ScoreEvent {
 const notes=partNotes(event,clef),shifted=notes.map(n=>n+delta);
 return shifted.every(n=>n>=48&&n<=84&&inClef(n,clef))?replacePart(event,clef,shifted):event;
}
