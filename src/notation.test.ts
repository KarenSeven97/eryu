import {expect,it} from 'vitest';
import {partNotes,replacePart,transposePart,inClef} from './notation';
import type {ScoreEvent} from './composition';
const event:ScoreEvent={id:'mixed',notes:[48,52,60,64],duration:'h',started:100};
it('两谱表按中央C划分，低音编辑不改高音',()=>{expect(inClef(59,'bass')).toBe(true);expect(inClef(60,'treble')).toBe(true);const next=transposePart(event,'bass',1);expect(next.notes).toEqual([49,53,60,64]);expect(next.duration).toBe('h');expect(partNotes(next,'treble')).toEqual([60,64]);});
it('低音休止位置可补音，重弹替换保留另一谱表音符',()=>{const onlyHigh={...event,notes:[60,64]};expect(replacePart(onlyHigh,'bass',[50]).notes).toEqual([50,60,64]);expect(replacePart(event,'bass',[55]).notes).toEqual([55,60,64]);});
it('只删除所选谱表音符，最后一个声部删除后由编辑器移除事件',()=>{expect(replacePart(event,'bass',[]).notes).toEqual([60,64]);expect(replacePart({...event,notes:[50]},'bass',[]).notes).toEqual([]);});
it('音高调整不越过谱号分界及采样范围',()=>{expect(transposePart({...event,notes:[59,64]},'bass',1).notes).toEqual([59,64]);expect(transposePart({...event,notes:[48,60]},'bass',-1).notes).toEqual([48,60]);expect(transposePart({...event,notes:[48,60]},'treble',-1).notes).toEqual([48,60]);expect(replacePart(event,'bass',[70,20,55]).notes).toEqual([55,60,64]);});
