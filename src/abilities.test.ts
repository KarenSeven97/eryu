import {expect,it} from 'vitest';
import {abilities} from './abilities';
import {generate} from './music';
import type {Attempt} from './storage';
const attempt=(level:'easy'|'normal',correct=true):Attempt=>({id:crypto.randomUUID(),mode:'note',level,date:'2026-11-05',correct,selected:[],question:generate('note',level),course:false});
it('五维起点全为0，不因无练习而显示能力',()=>expect(abilities([]).map(a=>a.value)).toEqual([0,0,0,0,0]));
it('题量与难度贡献，20题全对入门60，进阶100',()=>{expect(abilities([attempt('normal')])[0].value).toBe(5);expect(abilities(Array.from({length:20},()=>attempt('easy')))[0].value).toBe(60);expect(abilities(Array.from({length:20},()=>attempt('normal')))[0].value).toBe(100);});
it('错误会降低能力值，老记录按入门计算',()=>{const a=Array.from({length:20},(_,i)=>attempt('normal',i<10));expect(abilities(a)[0].value).toBe(50);const old=attempt('easy');delete old.level;expect(abilities([old])[0].value).toBe(3);expect(abilities([attempt('normal',false)])[0].value).toBe(0);});
