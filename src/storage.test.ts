import 'fake-indexeddb/auto';
import {it,expect} from 'vitest';
import {getAttempts,saveAttempt,getSettings,saveSettings,loadComposition,storeComposition,defaults} from './storage';
import {generate} from './music';
it('IndexedDB 保存记录、幂等写入与设置恢复',async()=>{
 const q=generate('note');const a={id:q.id,date:'2026-11-05',mode:q.mode,correct:true,selected:q.answer,question:q,course:true};
 await saveAttempt(a);await saveAttempt(a);const data=await getAttempts();expect(data.filter(x=>x.id===a.id)).toHaveLength(1);expect(data.find(x=>x.id===a.id)).toEqual(a);
 expect(await getSettings()).toEqual(defaults);await saveSettings({...defaults,base:48,flats:true});expect((await getSettings()).base).toBe(48);expect((await getSettings()).flats).toBe(true);
});
it('作品存储与旧版偏好、训练记录共存',async()=>{const before=await getAttempts();const settings=await getSettings();const value={events:[{id:'test',notes:[48,60],duration:'h',started:1}],bpm:90};await storeComposition(value);expect(await loadComposition()).toEqual(value);expect(await getAttempts()).toEqual(before);expect(await getSettings()).toEqual(settings);});
