import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createLikesHandler } from '../netlify/functions/_shared/likes-core.mjs';

function setup(){
  const records=new Map();
  const store={set:async(k,v)=>records.set(k,v),delete:async k=>records.delete(k),list:async()=>({blobs:[...records.keys()].map(key=>({key}))})};
  const handler=createLikesHandler(()=>store,['prompt-one','prompt-two']);
  const call=async(method='GET',cookie='',body,origin='https://promptverse.example')=>handler(new Request('https://promptverse.example/api/likes',{method,headers:{cookie,origin,'content-type':'application/json'},...(body===undefined?{}:{body:typeof body==='string'?body:JSON.stringify(body)})}));
  const visitor=async()=>{const response=await call();return response.headers.get('set-cookie').split(';')[0];};
  return {records,call,visitor};
}
test('repeated likes are idempotent and unlike removes the vote',async()=>{
  const {call,visitor}=setup(),cookie=await visitor();
  await call('POST',cookie,{id:'prompt-one',liked:true});
  const duplicate=await call('POST',cookie,{id:'prompt-one',liked:true});
  const data=await duplicate.json();assert.equal(data.counts['prompt-one'],1);assert.deepEqual(data.liked,['prompt-one']);
  const removed=await call('POST',cookie,{id:'prompt-one',liked:false});assert.equal((await removed.json()).counts['prompt-one'],0);
});
test('votes from separate visitors accumulate without overwriting each other',async()=>{
  const {call,visitor}=setup();const a=await visitor(),b=await visitor();
  await Promise.all([call('POST',a,{id:'prompt-one',liked:true}),call('POST',b,{id:'prompt-one',liked:true}),call('POST',a,{id:'prompt-two',liked:true})]);
  const data=await (await call('GET',b)).json();assert.equal(data.counts['prompt-one'],2);assert.equal(data.counts['prompt-two'],1);assert.deepEqual(data.liked,['prompt-one']);
});
test('invalid and cross-origin mutations fail without changing votes',async()=>{
  const {call,visitor,records}=setup(),cookie=await visitor();
  assert.equal((await call('POST',cookie,{id:'prompt-one',liked:true},'https://other.example')).status,403);
  assert.equal((await call('POST',cookie,{id:'unknown',liked:true})).status,400);
  assert.equal((await call('POST',cookie,{id:'prompt-one',liked:'yes'})).status,400);
  assert.equal((await call('POST',cookie,'not JSON')).status,400);
  assert.equal((await call('POST',cookie,'x'.repeat(1025))).status,413);
  assert.equal(records.size,0);
});
test('new visitors receive a secure private identifier and results cannot be cached publicly',async()=>{
  const {call}=setup(),response=await call();
  assert.match(response.headers.get('set-cookie'),/HttpOnly; SameSite=Strict; Secure/);
  assert.equal(response.headers.get('cache-control'),'private, no-store');
});
test('storage failures return a recoverable unavailable response',async()=>{
  const handler=createLikesHandler(()=>({list:async()=>{throw Error('offline');}}),['prompt-one']);
  const response=await handler(new Request('https://promptverse.example/api/likes'));
  assert.equal(response.status,503);assert.match((await response.json()).error,/temporarily unavailable/);
});
