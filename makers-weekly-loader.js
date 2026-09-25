(function(){
  'use strict';
  const bust='makers-20260924-phase4';
  const load=file=>new Promise((resolve,reject)=>{
    const s=document.createElement('script');
    s.src=file+(file.includes('?')?'&':'?')+'v='+bust;
    s.onload=resolve;
    s.onerror=()=>reject(new Error('Failed to load '+file));
    document.head.appendChild(s);
  });
  (async()=>{
    try{
      await load('season-2026.js');
      await load('weekly-import.js');
      await load('makers-weekly-sync.js');
      await load('makers-engine.js');
      await load('league-analytics.js');
      if((document.body.dataset.page||'')==='waivers'){
        await load('api-config.js');
        await load('waiver-model.js');
      }
      await load('live.js');
      await load('site.js');
    }catch(err){
      console.error('Makers weekly loader failed',err);
      document.body.insertAdjacentHTML('beforeend','<div class="notice"><b>Site update failed to load.</b> Refresh the page to retry.</div>');
    }
  })();
})();
