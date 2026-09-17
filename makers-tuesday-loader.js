(function(){
  'use strict';
  const BASE='https://miscexpffl.github.io/the-makers/';
  const bust='20260916-wed1';
  const load=(file,remote=false)=>new Promise((resolve,reject)=>{
    const s=document.createElement('script');
    s.src=`${remote?BASE:''}${file}?v=${bust}`;
    s.async=false;
    s.onload=()=>resolve();
    s.onerror=()=>reject(new Error(`Makers Wednesday loader failed: ${file}`));
    document.head.appendChild(s);
  });
  const loadWednesday=async()=>{
    await load('makers-week1-tuesday-data.js',true);
    await load('makers-wed-1.js');
    await load('makers-wed-2a.js');
    await load('makers-wed-2b.js');
    await load('makers-wed-3.js');
  };
  const go=async()=>{
    const filename=(location.pathname.split('/').pop()||'index.html').toLowerCase();
    const page=(document.body.dataset.page||'').toLowerCase();
    const dynamic=new Set(['home','weeks','week','power','odds','transactions','waivers','schedule','records','franchises','franchise','warroom','predictions','analytics']);
    const staticPatch=new Set(['history.html','head-to-head.html']);

    if(filename==='week-01.html'){
      document.body.dataset.page='week';
      await loadWednesday();
      await load('makers-tuesday.js',true);
      await load('makers-wednesday-patch.js');
      return;
    }
    if(dynamic.has(page)){
      await loadWednesday();
      await load('makers-tuesday.js',true);
      await load('makers-wednesday-patch.js');
      return;
    }
    if(staticPatch.has(filename)){
      await loadWednesday();
      await load('makers-static-tuesday.js',true);
    }
  };
  go().catch(err=>console.error(err));
})();
