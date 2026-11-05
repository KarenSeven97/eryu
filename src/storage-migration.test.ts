import 'fake-indexeddb/auto';
import {openDB} from 'idb';
import {it,expect} from 'vitest';
import {generate} from './music';
it('从旧版数据库升级后保留草稿、偏好、训练记录，并可保存多份命名曲谱',async()=>{
 const legacy=await openDB('ear-lab',1,{upgrade(db){db.createObjectStore('attempts',{keyPath:'id'});db.createObjectStore('settings');}});
 const q=generate('note');const attempt={id:q.id,date:'2026-11-05',mode:q.mode,correct:true,selected:q.answer,question:q,course:false};
 const draft={events:[{id:'draft',notes:[60],duration:'q' as const,started:1}],bpm:90};
 await legacy.put('attempts',attempt);await legacy.put('settings',draft,'composition');await legacy.put('settings',{base:48},'preferences');legacy.close();
 const storage=await import('./storage');expect(await storage.loadComposition()).toEqual(draft);expect(await storage.getAttempts()).toEqual([attempt]);expect((await storage.getSettings()).base).toBe(48);
 await storage.saveScore({id:'one',title:'旋律一',events:draft.events,bpm:90,createdAt:1,updatedAt:1});await storage.saveScore({id:'two',title:'旋律二',events:draft.events,bpm:120,createdAt:2,updatedAt:2});
 expect((await storage.listScores()).map(s=>s.title)).toEqual(['旋律二','旋律一']);await storage.saveScore({id:'one',title:'修改名称',events:draft.events,bpm:100,createdAt:1,updatedAt:3});expect((await storage.listScores()).map(s=>s.title)).toEqual(['修改名称','旋律二']);expect(await storage.loadComposition()).toEqual(draft);
});
