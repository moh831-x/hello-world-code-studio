import test from 'node:test';
import assert from 'node:assert/strict';
import {createCloudStore,validConfig} from '../firestore.mjs';
const config={apiKey:'test-key',authDomain:'test.example',projectId:'test-project',appId:'test-app'};
const language={name:'C++',file:'hello.cpp'};
function fixture({existing=false,fail=false}={}) {
  const records=new Map(); const calls=[];
  const sdk={
    initializeApp:()=>({}),
    getAuth:()=>({authStateReady:async()=>{},currentUser:existing?{uid:'existing-user'}:null}),
    signInAnonymously:async()=>{calls.push('sign-in');return {user:{uid:'test-user'}};},
    getFirestore:()=>({}),
    doc:(_, ...path)=>path.join('/'),
    serverTimestamp:()=> 'SERVER_TIMESTAMP',
    setDoc:async(ref,data)=>{if(fail)throw new Error('permission-denied');records.set(ref,data);},
    getDocFromServer:async(ref)=>({exists:()=>records.has(ref),data:()=>records.get(ref)})
  };
  return {store:createCloudStore(config,async()=>sdk),records,calls};
}
test('configuration requires all public web fields',()=>{
  assert.equal(validConfig(null),false);assert.equal(validConfig({projectId:'one'}),false);
  assert.equal(validConfig({...config,apiKey:' '}),false);assert.equal(validConfig(config),true);
});
test('missing config does not initialize Firebase',async()=>{
  const store=createCloudStore(null,async()=>{throw new Error('must not load SDK');});
  await assert.rejects(store.load(language),/not configured/);
});
test('anonymous user draft is written to an encoded owner path and round-trips',async()=>{
  const {store,records,calls}=fixture();
  await store.save(language,'Hello from C++');
  const record=records.get('helloWorldUsers/test-user/drafts/C%2B%2B');
  assert.deepEqual(record,{language:'C++',filename:'hello.cpp',code:'Hello from C++',updatedAt:'SERVER_TIMESTAMP'});
  assert.equal(await store.load(language),'Hello from C++');
  assert.equal(calls.length,1);
});
test('persisted identity is reused without new anonymous signup',async()=>{
  const {store,records,calls}=fixture({existing:true});await store.save(language,'');
  assert.equal(records.get('helloWorldUsers/existing-user/drafts/C%2B%2B').code,'');assert.equal(calls.length,0);
});
test('missing document returns null, not empty code',async()=>{
  const {store}=fixture();assert.equal(await store.load(language),null);
});
test('empty saved draft survives round-trip',async()=>{
  const {store}=fixture();await store.save(language,'');assert.equal(await store.load(language),'');
});
test('oversize code rejected before connecting',async()=>{
  let connected=false;const store=createCloudStore(config,async()=>{connected=true;});
  await assert.rejects(store.save(language,'x'.repeat(100001)),/100,000/);assert.equal(connected,false);
});
test('write failure is propagated rather than reported as saved',async()=>{
  await assert.rejects(fixture({fail:true}).store.save(language,'code'),/permission-denied/);
});
test('malformed cloud records cannot replace editor code',async()=>{
  const {store,records}=fixture();await store.save(language,'code');
  records.get('helloWorldUsers/test-user/drafts/C%2B%2B').language='Python';
  await assert.rejects(store.load(language),/not valid/);
});
