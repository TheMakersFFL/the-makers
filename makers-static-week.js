(function(){
 const E=window.MAKERS_ENGINE,Y=window.MAKERS_2026;if(!E||!Y)return;
 const week=Number(document.body.dataset.week||1),d=Y.weekly?.[String(week)]||{};
 const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const pair=(a,b)=>[a,b].map(String).sort().join('||');
 const score=(a,b)=>`${Number(a).toFixed(2)}–${Number(b).toFixed(2)}`;
 const pagehead=document.querySelector('.pagehead');
 if(pagehead&&Y.features?.liveScoring===true){const box=document.createElement('div');box.innerHTML=E.renderScoreboard(week);const section=box.firstElementChild;if(section)pagehead.insertAdjacentElement('afterend',section)}
 const slate=[...document.querySelectorAll('section')].find(s=>s.querySelector('h2')?.textContent.trim()==='The slate');
 if(slate&&d.matchups?.length){slate.innerHTML=`<div class="wrap"><div class="section-head"><div><div class="kicker">MATCHUP FILES</div><h2>The slate</h2></div><p class="section-intro">Every matchup carries the old H2H receipts, latest archived meeting, biggest archived margin and current model edge.</p></div><div class="matchup-pro-grid">${d.matchups.map(m=>E.renderMatchupCard(week,m[0],m[1])).join('')}</div></div>`}

 const snap=Y.predictionSnapshots?.[String(week)]||null;
 const forecasts=new Map((snap?.matchups||[]).map(x=>[pair(x.teamA,x.teamB),x]));
 const custom=new Map((d.gameBreakdowns||[]).map(x=>[pair(x.teamA,x.teamB),x]));
 const gotw=String(d.gameOfWeek||'').split(/\s+vs\.?\s+/i).map(x=>x.trim()).filter(Boolean);
 const isGotw=(a,b)=>gotw.length===2&&pair(a,b)===pair(gotw[0],gotw[1]);
 const normalized=(a,b)=>{const m=forecasts.get(pair(a,b));if(!m)return null;return m.teamA===a?m:{...m,teamA:a,teamB:b,meA:m.meB,meB:m.meA,yahooA:m.yahooB,yahooB:m.yahooA}};
 const projection=(m)=>{if(!m)return '';const mePick=Number(m.meA)>=Number(m.meB)?m.teamA:m.teamB,yPick=Number(m.yahooA)>=Number(m.yahooB)?m.teamA:m.teamB;return `<div class="weekly-projection-pair"><div class="weekly-projection-row makers"><span>MAKERS</span><b>${score(m.meA,m.meB)}</b><small>${esc(mePick)}</small></div><div class="weekly-projection-row yahoo"><span>YAHOO</span><b>${score(m.yahooA,m.yahooB)}</b><small>${esc(yPick)}</small></div></div>`};

 if(d.matchups?.length&&forecasts.size){
   const cards=d.matchups.map(([a,b])=>{const m=normalized(a,b),copy=custom.get(pair(a,b))?.preview||`${a} vs ${b}.`;return `<article class="weekly-breakdown-card${isGotw(a,b)?' game-of-week-tile':''}">${isGotw(a,b)?'<div class="gotw-ribbon">GAME OF THE WEEK</div>':''}<div class="weekly-breakdown-head"><span>${esc(a)}</span><b>VS</b><span>${esc(b)}</span></div>${projection(m)}<p>${esc(copy)}</p></article>`}).join('');
   const preview=document.createElement('section');preview.className='section weekly-breakdowns';preview.innerHTML=`<div class="wrap"><div class="section-head"><div><div class="kicker">EVERY MATCHUP</div><h2>Week ${week} preview</h2></div></div><div class="weekly-breakdown-grid">${cards}</div></div>`;
   const rows=d.matchups.map(([a,b])=>{const m=normalized(a,b);if(!m)return '';const mePick=Number(m.meA)>=Number(m.meB)?a:b,yPick=Number(m.yahooA)>=Number(m.yahooB)?a:b;return `<tr><td><b>${esc(a)}</b><div class="small">vs ${esc(b)}</div></td><td><b>${score(m.meA,m.meB)}</b><div class="small">${esc(mePick)} · Total ${(Number(m.meA)+Number(m.meB)).toFixed(2)}</div></td><td><b>${score(m.yahooA,m.yahooB)}</b><div class="small">${esc(yPick)} · Total ${(Number(m.yahooA)+Number(m.yahooB)).toFixed(2)}</div></td></tr>`}).join('');
   const table=document.createElement('section');table.className='section alt prediction-week-section';table.innerHTML=`<div class="wrap"><div class="section-head"><div><div class="kicker">${esc(snap?.phase||'WEEKLY FORECAST')}</div><h2>Makers vs Yahoo projections</h2></div></div><div class="table-wrap"><table class="prediction-table"><thead><tr><th>Matchup</th><th>Makers projection</th><th>Yahoo projection</th></tr></thead><tbody>${rows}</tbody></table></div></div>`;
   const article=[...document.querySelectorAll('section')].find(s=>s.querySelector('.writeup-copy'));
   if(article){article.insertAdjacentElement('afterend',preview);preview.insertAdjacentElement('afterend',table)}
 }
})();
