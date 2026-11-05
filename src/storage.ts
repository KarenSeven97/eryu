import {openDB} from 'idb';
import type {Mode,Level,Question} from './music';
import type {ScoreEvent} from './composition';
export interface SavedScore {id:string;title:string;events:ScoreEvent[];bpm:number;createdAt:number;updatedAt:number}
export interface Attempt {id:string;date:string;mode:Mode;level?:Level;correct:boolean;selected:string[];question:Question;course:boolean}
export interface Settings {level:Level;base:number;flats:boolean;volume:number;labels:boolean}
export const defaults:Settings={level:'easy',base:60,flats:false,volume:-12,labels:true};
const db=()=>openDB('ear-lab',2,{upgrade(d){if(!d.objectStoreNames.contains('attempts'))d.createObjectStore('attempts',{keyPath:'id'});if(!d.objectStoreNames.contains('settings'))d.createObjectStore('settings');if(!d.objectStoreNames.contains('scores'))d.createObjectStore('scores',{keyPath:'id'});}});
export async function getAttempts():Promise<Attempt[]>{return (await db()).getAll('attempts');}
export async function saveAttempt(a:Attempt){return (await db()).put('attempts',a);}
export async function getSettings():Promise<Settings>{return {...defaults,...await(await db()).get('settings','preferences')};}
export async function saveSettings(s:Settings){return(await db()).put('settings',s,'preferences');}
export async function loadComposition(){return(await db()).get('settings','composition');}
export async function storeComposition(value:unknown){return(await db()).put('settings',value,'composition');}
export async function listScores():Promise<SavedScore[]>{const scores=await(await db()).getAll('scores');return scores.sort((a,b)=>b.updatedAt-a.updatedAt);}
export async function saveScore(value:SavedScore){return(await db()).put('scores',value);}
