import {useLayoutEffect,useRef,useState} from 'react';
import {Renderer,Stave,StaveNote,Accidental,Formatter,Voice} from 'vexflow/bravura';
import {name} from './music';
import {durationName,type ScoreEvent} from './composition';
export interface NoteAnchor {id:string;x:number;y:number}
export function Score({events,flats,active,onEdit,follow}:{events:ScoreEvent[];flats:boolean;active:string;onEdit:(note:NoteAnchor)=>void;follow:string}){
 const ref=useRef<HTMLDivElement>(null),callback=useRef(onEdit),hold=useRef<ReturnType<typeof setTimeout>|undefined>(undefined);
 const [error,setError]=useState(false);callback.current=onEdit;
 useLayoutEffect(()=>{
  const el=ref.current!,paper=el.closest('.score-paper') as HTMLElement;
  const previousScroll=paper.scrollTop;el.replaceChildren();setError(false);let cancelled=false;
  const render=()=>{if(cancelled)return;try{
   const rows=Math.max(1,Math.ceil(events.length/4)),renderer=new Renderer(el,Renderer.Backends.SVG);renderer.resize(640,rows*235);
   const ctx=renderer.getContext();ctx.setFillStyle('#554463');ctx.setStrokeStyle('#71647e');
   const targets:{note:StaveNote;event:ScoreEvent;index:number}[]=[];
   for(let row=0;row<rows;row++){
    const group=events.slice(row*4,row*4+4);
    const staves=(['treble','bass'] as const).map((clef,i)=>{const stave=new Stave(10,row*235+i*105,620).addClef(clef).setContext(ctx);stave.draw();return stave;});
    if(!group.length)continue;
    const voices=(['treble','bass'] as const).map(clef=>new Voice({numBeats:16,beatValue:4}).setMode(Voice.Mode.SOFT).addTickables(group.map((e,i)=>{
     const pitches=e.notes.filter(n=>clef==='treble'?n>=60:n<60),rest=!pitches.length,names=pitches.map(n=>name(n,flats));
     const note=new StaveNote({clef,keys:rest?[clef==='treble'?'b/4':'d/3']:names.map(n=>n.replace(/(\d+)$/,'/$1').toLowerCase()),duration:e.duration+(rest?'r':'')});
     names.forEach((n,i)=>{if(n.includes('#'))note.addModifier(new Accidental('#'),i);if(n.includes('b'))note.addModifier(new Accidental('b'),i);});
     if(e.id===active)note.setStyle({fillStyle:'#9470c3',strokeStyle:'#9470c3'});
     if(!rest)targets.push({note,event:e,index:row*4+i});return note;
    })));
    const formatter=new Formatter();voices.forEach(v=>formatter.joinVoices([v]));formatter.format(voices,520);voices.forEach((v,i)=>v.draw(ctx,staves[i]));
   }
   const svg=el.querySelector('svg')!;svg.querySelectorAll('g').forEach(g=>g.style.pointerEvents='none');svg.setAttribute('viewBox',`0 0 640 ${rows*235}`);svg.style.width='100%';svg.style.height='auto';
   for(const {note,event,index} of targets){
    const hit=document.createElementNS('http://www.w3.org/2000/svg','rect'),ys=note.getYs();
    hit.setAttribute('x',String(note.getAbsoluteX()-14));hit.setAttribute('y',String(Math.min(...ys)-24));hit.setAttribute('width','54');hit.setAttribute('height',String(Math.max(...ys)-Math.min(...ys)+48));hit.setAttribute('rx','7');hit.setAttribute('fill','transparent');hit.setAttribute('stroke','none');hit.setAttribute('pointer-events','all');hit.setAttribute('class','score-note-target');hit.setAttribute('data-note-id',event.id);hit.setAttribute('role','button');hit.setAttribute('tabindex','0');hit.setAttribute('aria-label',`第${index+1}组 ${event.notes.map(n=>name(n,flats)).join('+')} ${durationName[event.duration]}，长按编辑`);
    const open=()=>{const rect=hit.getBoundingClientRect();callback.current({id:event.id,x:rect.left+rect.width/2,y:rect.top+rect.height/2});};
    const clear=()=>{clearTimeout(hold.current);hold.current=undefined;};
    hit.addEventListener('pointerdown',e=>{if(e.button!==0)return;clear();const x=e.clientX,y=e.clientY;hit.dataset.startX=String(x);hit.dataset.startY=String(y);hold.current=setTimeout(open,450);});
    hit.addEventListener('pointermove',e=>{if(Math.abs(e.clientX-Number(hit.dataset.startX))>8||Math.abs(e.clientY-Number(hit.dataset.startY))>8)clear();});
    hit.addEventListener('pointerup',clear);hit.addEventListener('pointerleave',clear);hit.addEventListener('pointercancel',clear);
    hit.addEventListener('contextmenu',e=>{e.preventDefault();clear();open();});
    hit.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open();}});svg.append(hit);
   }
   paper.scrollTop=previousScroll;
   if(follow){const target=targets.find(t=>t.event.id===follow);if(target){const scale=svg.getBoundingClientRect().width/640;const row=Math.floor(target.index/4),top=row*235*scale,bottom=(row+1)*235*scale;if(top<paper.scrollTop||bottom>paper.scrollTop+paper.clientHeight)paper.scrollTop=Math.max(0,bottom-paper.clientHeight+25);}}
  }catch{setError(true);}};
  void document.fonts.ready.then(render);return()=>{cancelled=true;clearTimeout(hold.current);};
 },[events,flats,active,follow]);
 return <div className="written-score"><div ref={ref} role="group" aria-label={events.length?`创作五线谱，${events.length}组音符；长按音符或聚焦后回车编辑`:'创作五线谱，等待录入音符'}/>{error&&<p role="alert">乐谱渲染失败，请重新打开页面；草稿已保存在本机。</p>}</div>;
}
