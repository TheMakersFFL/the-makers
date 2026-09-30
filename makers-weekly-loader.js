(function(){
  'use strict';
  const bust='makers-20260930-w4p4';
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
      await load('week4-import.js');
      await load('week4-rosters-a.js');
      await load('week4-rosters-b.js');
      await load('week4-completed-a.js');
      await load('week4-completed-b.js');
      await load('week4-transactions.js');
      await load('week4-faab.js');
      await load('week4-available-a.js');
      await load('week4-available-b.js');
      await load('makers-weekly-sync.js');
      await load('makers-engine.js');
      await load('week4-models.js');
      await load('week4-editorial.js');
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
