import * as Tone from 'tone';
import {name} from './music';
import {timeline,type ScoreEvent} from './composition';
let sampler:Tone.Sampler|undefined;
let loading:Promise<void>|undefined;
let volume=-12,sequence=0;
const pending=new Set<ReturnType<typeof setTimeout>>();
export function prepare():Promise<void>{
 if(loading)return loading;
 loading=new Promise<void>((resolve,reject)=>{
 const urls:Record<string,string>={};for(const octave of [3,4,5])for(const [note,file] of [['C','C'],['D#','Ds'],['F#','Fs'],['A','A']])urls[`${note}${octave}`]=`${file}${octave}.mp3`;urls.C6='C6.mp3';
 sampler=new Tone.Sampler({urls,baseUrl:`${import.meta.env.BASE_URL}samples/salamander/`,release:0.7,onload:resolve,onerror:reject}).toDestination();sampler.volume.value=volume;
 }).catch(error=>{sampler?.dispose();sampler=undefined;loading=undefined;throw error;});return loading;
}
export async function unlock(){await Tone.start();await prepare();}
export function setVolume(v:number){volume=v;sampler?.volume.rampTo(v,0.1);}
export function stop(){sequence++;pending.forEach(clearTimeout);pending.clear();sampler?.releaseAll();}
export async function attack(midi:number){await unlock();sampler!.triggerAttack(name(midi),undefined,0.85);}
export function release(midi:number){sampler?.triggerRelease(name(midi));}
function schedule(fn:()=>void,ms:number,token:number){if(ms===0){if(token===sequence)fn();return;}const timer=setTimeout(()=>{pending.delete(timer);if(token===sequence)fn();},ms);pending.add(timer);}
export async function play(notes:number[],simultaneous=false){stop();const token=sequence;await unlock();if(token!==sequence)return 0;if(simultaneous)sampler!.triggerAttackRelease(notes.map(n=>name(n)),0.9,undefined,0.8);else notes.forEach((n,i)=>schedule(()=>sampler!.triggerAttackRelease(name(n),0.65,undefined,0.85),i*850,token));return simultaneous?1500:notes.length*850+500;}
export async function playScore(events:ScoreEvent[],bpm:number,onEvent:(id:string)=>void){stop();const token=sequence;await unlock();if(token!==sequence)return 0;const line=timeline(events,bpm);line.forEach(e=>schedule(()=>{onEvent(e.id);sampler!.triggerAttackRelease(e.notes.map(n=>name(n)),e.seconds*0.94,undefined,0.85);},e.time*1000,token));const last=line.at(-1);return last?(last.time+last.seconds)*1000+700:0;}
