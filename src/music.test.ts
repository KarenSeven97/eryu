import {describe,it,expect} from 'vitest';
import {generate,isCorrect,modes,chords,intervals,frequency,name,localDate} from './music';
describe('统一 MIDI 题库',()=>{
 for(const level of ['easy','normal'] as const)for(const base of [48,60])for(const mode of modes){it(`${level}/${base}/${mode.id}：音高、答案、选项一致`,()=>{for(let i=0;i<100;i++){
 const q=generate(mode.id,level,base);expect(q.notes.every(n=>Number.isInteger(n)&&n>=base&&n<=base+24)).toBe(true);expect(q.answer.every(a=>q.options.includes(a))).toBe(true);expect(isCorrect(q,q.answer)).toBe(true);expect(isCorrect(q,[])).toBe(false);
 if(q.mode==='note')expect(q.answer).toEqual([name(q.notes[0])]);
 if(q.mode==='pitch')expect(q.answer[0]).toBe(['更低','相同','更高'][Math.sign(q.notes[1]-q.notes[0])+1]);
 if(q.mode==='interval')expect(q.answer[0]).toBe(intervals[q.notes[1]-q.notes[0]]);
 if(q.mode==='poly'){expect(new Set(q.notes).size).toBe(q.notes.length);expect(q.answer).toEqual(q.notes.map(n=>name(n)));expect(q.notes.length).toBeGreaterThanOrEqual(level==='easy'?2:3);expect(isCorrect(q,[...q.answer].reverse())).toBe(true);expect(isCorrect(q,q.answer.slice(1))).toBe(false);}
 if(q.mode==='chord')expect(q.notes.map(n=>n-q.notes[0])).toEqual(chords.find(c=>c.label===q.answer[0])!.steps);
 }});}
 it('等音与频率使用相同 MIDI',()=>{expect(name(61)).toBe('C#4');expect(name(61,true)).toBe('Db4');expect(frequency(69)).toBeCloseTo(440);});
 it('按本地日历计算每日课程日期',()=>expect(localDate(new Date(2026,10,5,23,59))).toBe('2026-11-05'));
});
