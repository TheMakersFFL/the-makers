(async function(){
  'use strict';
  const BASE='https://raw.githubusercontent.com/MiscExpFFL/the-makers/main/';
  const bust='20260915-tuesday1';
  const run=async(file)=>{
    const r=await fetch(`${BASE}${file}?v=${bust}`,{cache:'no-store'});
    if(!r.ok) throw new Error(`Makers Tuesday loader failed: ${file} ${r.status}`);
    const code=await r.text();
    (0,eval)(`${code}\n//# sourceURL=${file}`);
  };
  const filename=(location.pathname.split('/').pop()||'index.html').toLowerCase();
  const page=(document.body.dataset.page||'').toLowerCase();
  const dynamic=new Set(['home','weeks','week','power','odds','transactions','waivers','schedule','records','franchises','franchise','warroom','predictions','analytics']);
  const staticPatch=new Set(['history.html','head-to-head.html']);

  if(filename==='week-01.html'){
    document.body.dataset.page='week';
    await run('makers-week1-tuesday-data.js');
    await run('makers-tuesday.js');
    return;
  }
  if(dynamic.has(page)){
    await run('makers-week1-tuesday-data.js');
    await run('makers-tuesday.js');
    return;
  }
  if(staticPatch.has(filename)){
    await run('makers-week1-tuesday-data.js');
    await run('makers-static-tuesday.js');
  }
})().catch(err=>console.error(err));
