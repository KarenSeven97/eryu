import {useEffect,useRef,useState} from 'react';
import {Renderer,Stave,StaveNote,Accidental,Formatter,Voice} from 'vexflow/bravura';
import {name} from './music';
import type {ScoreEvent} from './composition';
export function Score({events,flats,active}:{events:ScoreEvent[];flats:boolean;active:string}){
 const ref=useRef<HTMLDivElement>(null),[error,setError]=useState(false);
 useEffect(()=>{const el=ref.current!;el.replaceChildren();setError(false);let cancelled=false;
 const render=()=>{if(cancelled)return;try{const rows=Math.max(1,Math.ceil(events.length/4));const renderer=new Renderer(el,Renderer.Backends.SVG);renderer.resize(640,rows*235);const ctx=renderer.getContext();ctx.setFillStyle('#554463');ctx.setStrokeStyle('#71647e');
 for(let row=0;row<rows;row++){
 const group=events.slice(row*4,row*4+4);const staves=(['treble','bass'] as const).map((clef,i)=>{const stave=new Stave(10,row*235+i*105,620).addClef(clef).setContext(ctx);stave.draw();return stave;});if(!group.length)continue;
 const voices=(['treble','bass'] as const).map(clef=>new Voice({numBeats:16,beatValue:4}).setMode(Voice.Mode.SOFT).addTickables(group.map(e=>{const pitches=e.notes.filter(n=>clef==='treble'?n>=60:n<60),rest=!pitches.length;const names=pitches.map(n=>name(n,flats));const note=new StaveNote({clef,keys:rest?[clef==='treble'?'b/4':'d/3']:names.map(n=>n.replace(/(\d+)$/,'/$1').toLowerCase()),duration:e.duration+(rest?'r':'')});names.forEach((n,i)=>{if(n.includes('#'))note.addModifier(new Accidental('#'),i);if(n.includes('b'))note.addModifier(new Accidental('b'),i);});if(e.id===active)note.setStyle({fillStyle:'#9470c3',strokeStyle:'#9470c3'});return note;})));
 const formatter=new Formatter();voices.forEach(v=>formatter.joinVoices([v]));formatter.format(voices,520);voices.forEach((v,i)=>v.draw(ctx,staves[i]));}
 const svg=el.querySelector('svg');if(svg){svg.setAttribute('viewBox',`0 0 640 ${rows*235}`);svg.style.width='100%';svg.style.height='auto';}
 }catch{setError(true);}};void document.fonts.ready.then(render);return()=>{cancelled=true;};},[events,flats,active]);
 return <div className="written-score"><div ref={ref} role="img" aria-label={events.length?`已写入${events.length}组音符，${events.map(e=>e.notes.map(n=>name(n,flats)).join('+')+' '+({q:'四分',h:'二分',w:'全音符'}[e.duration])).join('，')}`:'创作五线谱，等待录入音符'}/>{error&&<p role="alert">乐谱渲染失败，音符列表与播放仍可使用。</p>}</div>;
}
