import { Note, Interval } from 'tonal';
export type Mode = 'note'|'pitch'|'interval'|'poly'|'chord';
export type Level = 'easy'|'normal';
export const modes: {id:Mode;name:string;desc:string;symbol:string}[] = [
 {id:'note',name:'单音识别',desc:'认识每一个声音',symbol:'♪'},
 {id:'pitch',name:'音高比较',desc:'感受声音的起伏',symbol:'↗'},
 {id:'interval',name:'音程识别',desc:'听见音符间的距离',symbol:'♬'},
 {id:'poly',name:'多音听辨',desc:'拆解交织的声音',symbol:'≋'},
 {id:'chord',name:'和弦识别',desc:'发现和声的色彩',symbol:'♩'},
];
export const intervals = ['纯一度','小二度','大二度','小三度','大三度','纯四度','三全音','纯五度','小六度','大六度','小七度','大七度','纯八度'];
export const chords = [{label:'大三和弦',steps:[0,4,7]},{label:'小三和弦',steps:[0,3,7]},{label:'减三和弦',steps:[0,3,6]},{label:'增三和弦',steps:[0,4,8]},{label:'属七和弦',steps:[0,4,7,10]},{label:'大七和弦',steps:[0,4,7,11]},{label:'小七和弦',steps:[0,3,7,10]}];
export const range = (start:number,end:number) => Array.from({length:end-start+1},(_,i)=>i+start);
export const name = (midi:number,flats=false) => flats?Note.fromMidi(midi):Note.fromMidiSharps(midi);
export const frequency = (midi:number) => Note.freq(name(midi))!;
export interface Question {id:string;mode:Mode;notes:number[];answer:string[];options:string[];simultaneous:boolean}
const pick = <T,>(items:T[],rng:()=>number) => items[Math.floor(rng()*items.length)];
export function generate(mode:Mode,level:Level='easy',base=60,rng=Math.random):Question {
 const pool=range(base,base+11).filter(n=>level==='normal'||[0,2,4,5,7,9,11].includes(n%12));
 const root=pick(pool,rng); let notes=[root],answer=[name(root)],options=pool.map(n=>name(n));
 if(mode==='pitch') {const delta=pick(level==='easy'?[-7,-4,0,4,7]:[-2,-1,0,1,2],rng);const first=delta<0?Math.max(root,base-delta):root;notes=[first,first+delta];options=['更低','相同','更高'];answer=[options[Math.sign(delta)+1]];}
 if(mode==='interval'){const semitones=pick(level==='easy'?[0,2,4,5,7,12]:range(0,12),rng);notes=[root,root+semitones];const distance=Interval.semitones(Interval.fromSemitones(semitones))!;answer=[intervals[distance]];options=(level==='easy'?[0,2,4,5,7,12]:range(0,12)).map(i=>intervals[i]);}
 if(mode==='poly'){const count=level==='easy'?2:pick([3,4],rng);notes=[];const remaining=[...pool];while(notes.length<count){const n=pick(remaining,rng);notes.push(n);remaining.splice(remaining.indexOf(n),1);}notes.sort((a,b)=>a-b);answer=notes.map(n=>name(n));}
 if(mode==='chord'){const available=chords.slice(0,level==='easy'?2:7);const chord=pick(available,rng);notes=chord.steps.map(s=>root+s);answer=[chord.label];options=available.map(c=>c.label);}
 return {id:globalThis.crypto?.randomUUID?.()??`${Date.now()}-${Math.random().toString(36).slice(2)}`,mode,notes,answer,options,simultaneous:mode==='poly'||mode==='chord'};
}
export const isCorrect=(q:Question,selected:string[])=>q.answer.length===selected.length&&q.answer.every(n=>selected.includes(n));
export const localDate=(d=new Date())=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
