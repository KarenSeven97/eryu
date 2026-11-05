import {useEffect,useRef,useState} from 'react';
import {Renderer,Stave,StaveNote,Accidental,Formatter} from 'vexflow/bravura';
import {name} from './music';
export function Staff({notes,flats=false,hidden=false,simultaneous=false}:{notes:number[];flats?:boolean;hidden?:boolean;simultaneous?:boolean}){
 const ref=useRef<HTMLDivElement>(null);const [error,setError]=useState(false);
 useEffect(()=>{const el=ref.current!;el.replaceChildren();setError(false);try{
 const renderer=new Renderer(el,Renderer.Backends.SVG);renderer.resize(640,230);const ctx=renderer.getContext();ctx.setFillStyle('#43415e');ctx.setStrokeStyle('#626079');
 const draw=(clef:'treble'|'bass',y:number,pitches:number[])=>{const stave=new Stave(12,y,610);stave.addClef(clef).setContext(ctx).draw();if(!pitches.length)return;
 const groups=simultaneous?[pitches]:pitches.map(p=>[p]);const ns=groups.map(group=>{const names=group.map(n=>name(n,flats));const note=new StaveNote({clef,keys:names.map(n=>n.replace(/(\d+)$/,'/$1').toLowerCase()),duration:'q'});names.forEach((n,i)=>{if(n.includes('#'))note.addModifier(new Accidental('#'),i);if(n.includes('b'))note.addModifier(new Accidental('b'),i);});return note;});Formatter.FormatAndDraw(ctx,stave,ns);};
 draw('treble',0,hidden?[]:notes.filter(n=>n>=60));draw('bass',110,hidden?[]:notes.filter(n=>n<60));
 const svg=el.querySelector('svg');if(svg){svg.setAttribute('viewBox','0 0 640 230');svg.style.width='100%';svg.style.height='auto';}
 }catch{setError(true);}},[notes,flats,hidden,simultaneous]);
 return <div className="staff-wrap"><div className="staff" ref={ref} role="img" aria-label={hidden?'答案乐谱已隐藏':`五线谱：${notes.map(n=>name(n,flats)).join('、')||'等待演奏'}`}/>{hidden&&<div className="staff-hint">答题后显示乐谱</div>}{error&&<p role="alert">乐谱暂时无法显示，请重新打开页面。</p>}</div>;
}
