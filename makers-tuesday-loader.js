(function(){
  'use strict';
  const BASE='https://miscexpffl.github.io/the-makers/';
  const bust='20260915-tuesday3';
  const load=(file)=>new Promise((resolve,reject)=>{
    const s=document.createElement('script');
    s.src=`${BASE}${file}?v=${bust}`;
    s.async=false;
    s.onload=()=>resolve();
    s.onerror=()=>reject(new Error(`Makers Tuesday loader failed: ${file}`));
    document.head.appendChild(s);
  });
  const go=async()=>{
    const filename=(location.pathname.split('/').pop()||'index.html').toLowerCase();
    const page=(document.body.dataset.page||'').toLowerCase();
    const dynamic=new Set(['home','weeks','week','power','odds','transactions','waivers','schedule','records','franchises','franchise','warroom','predictions','analytics']);
    const staticPatch=new Set(['history.html','head-to-head.html']);

    if(filename==='week-01.html'){
      document.body.dataset.page='week';
      await load('makers-week1-tuesday-data.js');
      await load('makers-tuesday.js');
      return;
    }
    if(dynamic.has(page)){
      await load('makers-week1-tuesday-data.js');
      await load('makers-tuesday.js');
      return;
    }
    if(staticPatch.has(filename)){
      await load('makers-week1-tuesday-data.js');
      await load('makers-static-tuesday.js');
    }
  };
  go().catch(err=>console.error(err));
})();
