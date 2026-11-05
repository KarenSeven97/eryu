import {useEffect,useRef,useState} from 'react';
import {attack,release,stop} from './audio';
import {name,range} from './music';
export function Piano({base,labels,flats,highlight,onNotes,onError,onCommit,disabled=false}:{base:number;labels:boolean;flats:boolean;highlight:number[];onNotes:(notes:number[])=>void;onError:(s:string)=>void;onCommit?:(midi:number,ms:number,started:number)=>void;disabled?:boolean}){
 const [active,setActive]=useState<number[]>([]);const pointers=useRef(new Map<number,number>());const sounding=useRef(new Set<number>());
 const callback=useRef(onNotes);callback.current=onNotes;
 const starts=useRef(new Map<number,number>());const commit=useRef(onCommit);commit.current=onCommit;
 const clear=()=>{starts.current.clear();pointers.current.clear();sounding.current.clear();setActive([]);stop();callback.current([]);};
 useEffect(()=>{window.addEventListener('blur',clear);const visibility=()=>{if(document.hidden)clear();};document.addEventListener('visibilitychange',visibility);return()=>{window.removeEventListener('blur',clear);document.removeEventListener('visibilitychange',visibility);clear();};},[base]);
 const down=async(id:number,n:number)=>{starts.current.set(id,Date.now());pointers.current.set(id,n);setActive([...new Set(pointers.current.values())]);callback.current([...new Set(pointers.current.values())]);try{if(!sounding.current.has(n)){sounding.current.add(n);await attack(n);if(![...pointers.current.values()].includes(n)){release(n);sounding.current.delete(n);}}}catch{onError('声音未能启动，请检查设备音量并再次点按。');sounding.current.delete(n);}};
 const up=(id:number,record=true)=>{const n=pointers.current.get(id);const started=starts.current.get(id);starts.current.delete(id);if(record&&n!==undefined&&started!==undefined)commit.current?.(n,Date.now()-started,started);pointers.current.delete(id);if(n!==undefined&&![...pointers.current.values()].includes(n)){release(n);sounding.current.delete(n);}const notes=[...new Set(pointers.current.values())];setActive(notes);callback.current(notes);};
 const notes=range(base,base+24),black=(n:number)=>[1,3,6,8,10].includes(n%12);const whites=notes.filter(n=>!black(n));
 return <div className="piano-scroll"><div className="piano" style={{minWidth:600}}>{notes.map(n=>{const dark=black(n);const index=whites.filter(w=>w<n).length;return <button key={n} disabled={disabled} aria-label={`演奏 ${name(n,flats)}`} className={`key ${dark?'black':'white'} ${active.includes(n)?'pressed':''} ${highlight.includes(n)?'answer-key':''}`} style={{left:`${(dark?index-0.32:index)/whites.length*100}%`,width:`${(dark?0.64:1)/whites.length*100}%`}} onPointerDown={e=>{e.preventDefault();e.currentTarget.setPointerCapture(e.pointerId);void down(e.pointerId,n);}} onPointerUp={e=>up(e.pointerId)} onPointerCancel={e=>up(e.pointerId,false)} onLostPointerCapture={e=>up(e.pointerId,false)} onKeyDown={e=>{if(!e.repeat&&(e.key==='Enter'||e.key===' ')){e.preventDefault();void down(-n,n);}}} onKeyUp={e=>{if(e.key==='Enter'||e.key===' ')up(-n);}} onBlur={()=>up(-n,false)}>{labels&&<span>{name(n,flats).replace('#','♯')}</span>}</button>;})}</div></div>;
}


