import {openDB} from 'idb';
import type {Mode,Level,Question} from './music';
export interface Attempt {id:string;date:string;mode:Mode;level?:Level;correct:boolean;selected:string[];question:Question;course:boolean}
export interface Settings {level:Level;base:number;flats:boolean;volume:number;labels:boolean}
export const defaults:Settings={level:'easy',base:60,flats:false,volume:-12,labels:true};
const db=()=>openDB('ear-lab',1,{upgrade(d){d.createObjectStore('attempts',{keyPath:'id'});d.createObjectStore('settings');}});
export async function getAttempts():Promise<Attempt[]>{return (await db()).getAll('attempts');}
export async function saveAttempt(a:Attempt){return (await db()).put('attempts',a);}
export async function getSettings():Promise<Settings>{return {...defaults,...await(await db()).get('settings','preferences')};}
export async function saveSettings(s:Settings){return(await db()).put('settings',s,'preferences');}
export async function loadComposition(){return(await db()).get('settings','composition');}
export async function storeComposition(value:unknown){return(await db()).put('settings',value,'composition');}
