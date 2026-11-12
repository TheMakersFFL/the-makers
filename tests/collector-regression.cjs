// Run with Node 22+: node tests/collector-regression.cjs [private-recovery-directory]
// Browser and Tampermonkey APIs are mocked; this is not live Chrome verification.
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm');
const assert = require('node:assert/strict');
const {webcrypto} = require('node:crypto');
const source = fs.readFileSync(path.join(__dirname, '../Makers_Weekly_Collector.user.js'), 'utf8');
const previous = fs.readFileSync(path.join(__dirname, '../Makers_Weekly_Collector_v1.3.8.txt'), 'utf8');
const clone = value => JSON.parse(JSON.stringify(value));
const prefix = 'MAKERSFF:2026:471058:';
const fixture = {schema:'makers-weekly-collector/v2', collectorVersion:'1.3.9',
  league:{season:2026,leagueId:'471058',name:'The Makers'}, mode:'WEDNESDAY', targetWeek:10,
  captures:[{url:'https://football.fantasysports.yahoo.com/f1/471058',text:'Unicode — café 🏈\n"quote"'}],
  data:{rosters:[],transactions:[]},teamMap:[{team:'The A Gap',yahooTeamId:8}]};
const state = {mode:'WEDNESDAY',targetWeek:9,captures:fixture.captures,data:fixture.data,
  teamMap:fixture.teamMap,updatedAt:'2026-11-04T17:17:43.643Z'};
const encode = v => typeof v === 'object' ? 'o'+JSON.stringify(v) : 's'+v;
const decode = v => v[0] === 'o' ? JSON.parse(v.slice(1)) : v[0] === 's' ? v.slice(1) : v[0] === 'b' ? v.slice(1)==='true' : Number(v.slice(1));
let original = {data:{
  [prefix+'state']:encode(state), [prefix+'collectorVersion']:'s1.3.8',
  [prefix+'snapshot:2:post-mnf']:encode({...fixture,targetWeek:2}),
  'MAKERSFF:weeklyCollector:boundLeague':'s2026:471058',
  'MAKERSFF:2025:471058:state':encode({captures:[{text:'keep historical state'}]})
}};
let repaired = clone(original);
if (process.argv[2]) {
  original = JSON.parse(fs.readFileSync(path.join(process.argv[2], 'original.storage.json')));
  repaired = JSON.parse(fs.readFileSync(path.join(process.argv[2], 'repaired.storage.json')));
}
const db = new Map(Object.entries(repaired.data).map(([k,v])=>[k,decode(v)]));
let toasts=[],notices=[],requests=[],events=[],answer='1',nextTimer=0,nextUrl=0,clicks=0,writes=0;
const timers=new Map(),urls=new Map(),revoked=new Set();
class Element {
  constructor(tag){this.tag=tag;this.style={};this.children=[];this.textContent='';this.parent=null;this.classList={add(){},remove(){}};}
  appendChild(el){this.children.push(el);el.parent=this;return el;}
  remove(){if(this.parent)this.parent.children=this.parent.children.filter(c=>c!==this);this.parent=null;}
  click(){clicks++;this.onclick?.({stopPropagation(){}});}
  querySelector(selector){return this.children.find(el=>el.id===selector.slice(1))||this.appendChild(Object.assign(new Element('button'),{id:selector.slice(1)}));}
}
const body=new Element('body');body.innerText='2026 Season';
const find=(el,id)=>el.id===id?el:el.children.map(c=>find(c,id)).find(Boolean);
const document={body,createElement:tag=>new Element(tag),getElementById:id=>find(body,id)};
const payload=JSON.stringify(fixture,null,2),filename='MAKERS_2026_W10_WEDNESDAY.json';
const ctx=vm.createContext({Blob,Response,Uint8Array,TextEncoder,TextDecoder,CompressionStream,DecompressionStream,atob,btoa,crypto:webcrypto,
  document,URL:{createObjectURL:blob=>{const u='blob:test-'+(++nextUrl);urls.set(u,blob);return u},revokeObjectURL:u=>{revoked.add(u);urls.delete(u)}},
  setTimeout:(fn,ms)=>{const id=++nextTimer;timers.set(id,{fn,ms});return id},clearTimeout:id=>timers.delete(id),
  console:{error(){},warn(){},log(){}},toast:s=>toasts.push(s),notice:(...args)=>notices.push(args),
  GM_download:request=>{events.push('download');requests.push(request)},
  GM_listValues:()=>Array.from(db.keys()),GM_getValue:(k,d)=>db.has(k)?clone(db.get(k)):d,
  GM_setValue:(k,v)=>{writes++;db.set(k,clone(v))},GM_registerMenuCommand(){},prompt:()=>answer,
  CTX:{season:2026,leagueId:'471058'},key:s=>prefix+s,buildExport:()=>clone(fixture),payload,filename});
const call=code=>vm.runInContext(code,ctx);
call(source.slice(source.indexOf('  // MAKERS_STORAGE_139'),source.indexOf('  // END_MAKERS_STORAGE_139')));
call(source.slice(source.indexOf('  // Keep download permission/errors'),source.indexOf('  function copyJson(){')));
const textOf=el=>el.textContent+' '+el.children.map(textOf).join(' ');
const reset=()=>{toasts=[];notices=[];requests=[];events=[]};

function startup(script, league='471058', brokenMenu=false){
  const store=new Map(Object.entries(repaired.data).map(([k,v])=>[k,decode(v)]));
  const before=JSON.stringify([...store]);let writes=0,reads=0;
  const root=new Element('body');root.innerText='2026 Season';
  const context=vm.createContext({URL,Blob,Date,console:{warn(){},error(){}},document:{body:root,createElement:tag=>new Element(tag),getElementById:id=>find(root,id)},
    location:{href:'https://football.fantasysports.yahoo.com/f1/'+league,pathname:'/f1/'+league,origin:'https://football.fantasysports.yahoo.com'},
    GM_getValue:(k,d)=>{reads++;return store.has(k)?clone(store.get(k)):d},GM_setValue:(k,v)=>{writes++;store.set(k,clone(v))},GM_listValues:()=>[...store.keys()],
    GM_addStyle(){},GM_registerMenuCommand(){if(brokenMenu)throw Error('menu unavailable')}});
  const hooked=script.replace('  render();\n})();','  globalThis.probe={state,buildExport};\n  render();\n})();');
  assert.notEqual(hooked,script);
  vm.runInContext(hooked,context);
  return {context,store,writes,reads,before,root};
}

(async()=>{
  // Reproduce the old failure: storage exception prevents even requesting the file.
  const oldContext=vm.createContext({buildExport:()=>fixture,key:s=>prefix+s,GM_setValue(){throw Error('storage failure')},GM_download(){throw Error('must not run')}});
  vm.runInContext(previous.match(/^  function downloadJson\(\).*$/m)[0],oldContext);
  assert.throws(()=>vm.runInContext('downloadJson()',oldContext),/storage failure/);

  // Read the real script at startup, including render; preserve state across version change.
  const boot=startup(source);
  assert.equal(boot.writes,0);assert.equal(JSON.stringify([...boot.store]),boot.before);
  assert.deepEqual(clone(boot.context.probe.state),decode(repaired.data[prefix+'state']));
  assert(find(boot.root,'makersff-panel'));
  assert(find(startup(source,'471058',true).root,'makersff-panel'),'A missing menu API must not prevent rendering');
  for(const league of ['94870','1']){const other=startup(source,league);assert.equal(other.reads,0);assert.equal(other.writes,0);assert(!other.context.probe)}
  const beforeUpgrade=startup(previous.replaceAll('1.3.8','1.3.9'));
  assert.equal(beforeUpgrade.context.probe.state.captures.length,0,'Old version-change bug reproduced');
  assert(beforeUpgrade.writes>0);
  // Parsers, validation, aliases and team IDs are unchanged.
  const section=(s,start,end)=>s.slice(s.indexOf(start),s.indexOf(end));
  assert.equal(section(source,'  const KNOWN_TEAMS=','  function notice('),section(previous,'  const KNOWN_TEAMS=','  const BIND_KEY='));
  assert.equal(section(source,'  function textOf(','  // Keep download permission/errors'),section(previous,'  function textOf(','  function browserDownload('));
  const legacyExport=clone(startup(previous).context.probe.buildExport());
  const updatedExport=clone(boot.context.probe.buildExport());
  delete legacyExport.capturedAt;delete updatedExport.capturedAt;delete legacyExport.collectorVersion;delete updatedExport.collectorVersion;
  assert.deepEqual(updatedExport,legacyExport,'Exported data must not change with the transport repair');

  // Verify every recovered archive through the userscript codec, exact original bytes.
  let recovered=0;
  assert.deepEqual(Object.keys(repaired.data),Object.keys(original.data));
  for(const [k,v] of Object.entries(original.data)){
    if(!k.includes(':snapshot:')){assert.equal(repaired.data[k],v);continue}
    ctx.snapshot=db.get(k);
    const decoded=await call('unpackSnapshot(snapshot)');
    if(ctx.snapshot.format==='makers-snapshot/gzip-v1'){assert.equal(decoded,v.slice(1));recovered++}
    else assert.deepEqual(JSON.parse(decoded),decode(v));
  }
  ctx.sample=payload;const packed=await call('packSnapshot(sample)');ctx.snapshot=packed;
  assert.equal(await call('unpackSnapshot(snapshot)'),payload);
  for(const bad of [{...packed,sha256:'0'.repeat(64)},{...packed,jsonBytes:packed.jsonBytes+1},{...packed,data:packed.data.slice(0,-12)}]){
    ctx.snapshot=bad;await assert.rejects(call('unpackSnapshot(snapshot)'));
  }
  const savedState=JSON.stringify(db.get(prefix+'state'));const priorWrites=writes;
  ctx.huge='x'.repeat(49*1024*1024);
  assert.throws(()=>call("saveValue(key('state'),huge)"),/safe limit/);
  assert.equal(writes,priorWrites);assert.equal(JSON.stringify(db.get(prefix+'state')),savedState);ctx.huge=null;

  reset();let pending=call('browserDownload(filename,payload)');
  const request=requests[0];assert(request.url instanceof Blob);assert.equal(await request.url.text(),payload);
  assert.equal(request.name,filename);assert.equal(request.saveAs,true);assert.equal(request.conflictAction,'uniquify');
  assert(!toasts.some(s=>s.startsWith('JSON downloaded:')));assert.equal(clicks,0);
  request.onload();assert.equal(await pending,true);assert.equal(timers.size,0);
  assert(toasts.includes('JSON downloaded: '+filename));
  for(const error of ['not_enabled','not_permitted','not_whitelisted','not_succeeded','user_cancelled']){
    reset();pending=call('browserDownload(filename,payload)');requests[0].onerror({error});assert.equal(await pending,false);
    assert(!toasts.some(s=>s.startsWith('JSON downloaded:')));
    const box=find(body,'makersff-download-help');assert(textOf(box).includes(error));
    const link=box.children.find(c=>c.tag==='a');assert.equal(link.download,filename);assert.equal(await urls.get(link.href).text(),payload);
    box.children.find(c=>c.tag==='button').onclick();assert(revoked.has(link.href));
  }
  const native=ctx.GM_download;ctx.GM_download=()=>{throw Error('native exception')};
  assert.equal(await call('browserDownload(filename,payload)'),false);assert(textOf(body).includes('native exception'));
  ctx.GM_download=undefined;assert.equal(await call('browserDownload(filename,payload)'),false);assert(textOf(body).includes('GM_download unavailable'));ctx.GM_download=native;
  reset();pending=call('browserDownload(filename,payload)');[...timers.values()].find(t=>t.ms===60000).fn();
  assert.equal(await pending,false);assert(textOf(body).includes('no_confirmation'));
  requests[0].onload();assert(!toasts.some(s=>s.startsWith('JSON downloaded:')));assert.equal(timers.size,0);
  reset();pending=call('browserDownload(filename,payload)');requests[0].ontimeout();assert.equal(await pending,false);

  reset();const pack=ctx.packSnapshot;ctx.packSnapshot=text=>{events.push('pack');return pack(text)};
  pending=call('downloadJson()');assert.deepEqual(events.slice(0,2),['download','pack']);
  await call('downloadJson()');assert.equal(requests.length,1);
  requests[0].onload();await pending;assert.equal(call('exportingSnapshot'),false);
  const snapshotKey=prefix+'snapshot:10:WEDNESDAY';const saved=clone(db.get(snapshotKey));ctx.snapshot=saved;
  assert.equal(saved.format,'makers-snapshot/gzip-v1');assert.equal(await call('unpackSnapshot(snapshot)'),payload);
  const nativeSet=ctx.GM_setValue;
  for(const failure of ['storage','codec']){
    if(failure==='storage')ctx.GM_setValue=()=>{throw Error('storage failure')};
    else {ctx.GM_setValue=nativeSet;ctx.packSnapshot=async()=>{throw Error('codec failure')}}
    reset();pending=call('downloadJson()');assert.equal(requests.length,1);requests[0].onload();await pending;
    assert.deepEqual(db.get(snapshotKey),saved);assert(notices.some(n=>n[0].includes('archive snapshot could not be saved')));
  }
  ctx.GM_setValue=nativeSet;ctx.packSnapshot=pack;
  reset();pending=call('downloadJson()');requests[0].onerror({error:'not_permitted'});await pending;
  assert.equal(call('exportingSnapshot'),false);assert(!toasts.some(s=>s.startsWith('JSON downloaded:')));

  reset();answer='1';pending=call('downloadSavedSnapshot()');
  for(let i=0;!requests.length&&i<2000;i++)await new Promise(resolve=>setTimeout(resolve,2));
  assert(requests.length);assert.equal(requests[0].name,'MAKERS_2026_W02_post-mnf.json');
  assert.deepEqual(JSON.parse(await requests[0].url.text()),decode(original.data[prefix+'snapshot:2:post-mnf']));
  requests[0].onload();await pending;
  for(const choice of [null,'0','garbage','999']){reset();answer=choice;await call('downloadSavedSnapshot()');assert.equal(requests.length,0);assert.equal(call('exportingSnapshot'),false)}
  for(const [k,v] of Object.entries(repaired.data))assert.deepEqual(db.get(k),decode(v),'Prior storage must remain unchanged: '+k);
  assert.equal(source.match(/GM_setValue\(/g).length,1);assert(!source.includes('data:application/json'));assert.equal(clicks,0);
  assert.equal(source,fs.readFileSync(path.join(__dirname,'../Makers_Weekly_Collector_v1.3.9.txt'),'utf8'));
  console.log('PASS: upgrade retention, full mocked startup, wrong-league isolation, parser/export parity, codec integrity, storage guard, Blob bytes/name, success/error/cancel/timeout, save link cleanup, duplicate-click guard, archive failure independence, archive download/cancel.');
  console.log('Recovered private snapshots verified:',recovered,'; actual Chrome/Tampermonkey download remains unverified.');
})().catch(error=>{console.error(error);process.exitCode=1});
