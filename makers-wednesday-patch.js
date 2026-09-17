(function(){
'use strict';
const T=window.MAKERS_TUESDAY||{};
const e=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const f=(v,d=1)=>Number(v||0).toFixed(d);
const sec=(title,body,intro='',ey='')=>`<section class="section makers-wed-extra"><div class="wrap"><div class="section-head"><div>${ey?`<div class="kicker">${e(ey)}</div>`:''}<h2>${e(title)}</h2></div>${intro?`<p class="section-intro">${e(intro)}</p>`:''}</div>${body}</div></section>`;
const beforeFooter=html=>{const ft=document.querySelector('.footer');if(ft)ft.insertAdjacentHTML('beforebegin',html);else document.body.insertAdjacentHTML('beforeend',html)};
function locks(){
  const rows=(T.week2Locks||[]).map(x=>`<tr><td><b>${e(x.teamA)}</b><br><span class="small">vs ${e(x.teamB)}</span></td><td>${f(x.yahooA)}–${f(x.yahooB)}</td><td><b>${f(x.modelA)}–${f(x.modelB)}</b></td><td><b>${e(x.pick)}</b><div class="small">${f(x.confidence)}% model confidence${x.disagreement?' · disagrees with Yahoo':''}</div></td></tr>`).join('');
  return `<div class="table-wrap"><table><thead><tr><th>Matchup</th><th>Yahoo Wed.</th><th>Makers projection</th><th>Locked pick</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}
function waiverCards(){return `<div class="grid two">${(T.waiverHighlights||[]).map(x=>`<div class="card"><div class="kicker">WEDNESDAY WAIVERS</div><h3>${e(x.title)}</h3><p>${e(x.copy)}</p></div>`).join('')}</div>`}
function recentMoves(){return `<div class="activity-feed">${(T.recentTransactions||[]).map(x=>`<div class="activity-card"><div><span class="activity-type">${e(x.type)}</span><strong>${e(x.manager)} · ${e(x.team)}</strong></div><p>${e(x.description)}</p><small>${e(x.time)}</small></div>`).join('')}</div>`}
const replacements=[
['Tuesday closes the previous week; Thursday will replace the featured current item with the Week 2 preview while this recap stays archived.','Wednesday combines the completed-week recap, waiver results, updated rankings and the locked upcoming-week preview in one publication.'],
['Tuesday archives the finished week. Thursday publishes the next preview without erasing the recap.','Wednesday publishes the completed-week recap and the upcoming-week preview together after waivers clear.'],
['Thursday Preview Pending','Preview + Picks Locked'],
['Week 2 early Yahoo board is live; Makers picks lock Thursday.','Week 2 preview is live with post-waiver projections and locked Makers picks.'],
['Makers Week 2 score projections and winner picks lock Thursday after waivers.','Makers Week 2 score projections and winner picks are locked from Wednesday’s post-waiver snapshot.'],
['Tuesday Yahoo projections are live. The full Week 2 preview and locked Makers picks publish Thursday.','Wednesday post-waiver projections are live with the full Week 2 preview and locked Makers picks.'],
['These are provisional Yahoo projections, not the Thursday Makers picks.','Yahoo’s Wednesday projections are frozen beside the locked Makers picks for later grading.'],
['Thursday / Tuesday workflow','Wednesday workflow'],
['This week will receive a preview before kickoff and a results recap after MNF.','Each Wednesday publishes the previous week’s recap and the upcoming week’s preview after waivers clear.'],
['Thursday adds the locked Makers score projections and picks.','The locked Makers score projections and picks are now live.'],
['Makers picks lock Thursday.','Makers picks are locked Wednesday.'],
['Week 2 shows the current Tuesday Yahoo projection until Thursday preview lock.','Week 2 shows the Wednesday Yahoo projection beside the locked Makers pick.'],
['Tuesday Power Index','Wednesday Power Index'],
['TUESDAY POWER INDEX','WEDNESDAY POWER INDEX'],
['30,000-RUN TUESDAY MODEL','WEDNESDAY REPRICE'],
['Every table below has been rerun for the Tuesday close.','Every table below has been rerun for the Wednesday update.'],
['This is a Tuesday snapshot, not a season verdict.','This is a Wednesday snapshot, not a season verdict.'],
['This is the Tuesday state of the race, market, needs and Week 2 early board.','This is the Wednesday state of the race, market, needs and locked Week 2 board.'],
['Repriced every Tuesday.','Repriced every Wednesday.'],
['The season timeline advances every Tuesday.','The season timeline advances every Wednesday.'],
['Tuesday recommendations from the validated 100-player available pool, current FAAB and Week 1 needs.','Wednesday post-waiver recommendations from the validated 100-player available pool, current FAAB and Week 1 needs.'],
['Availability reflects the Tuesday collector and can change before waivers process.','Availability reflects the Wednesday post-waiver collector.'],
['Modern franchise history plus the live 2026 Tuesday state.','Modern franchise history plus the live 2026 Wednesday state.'],
['Tuesday dashboard','Wednesday dashboard'],
['TUESDAY AUDIT','WEDNESDAY AUDIT'],
['Tuesday publishes the early Week 2 Yahoo board; Makers Week 2 picks lock Thursday.','Wednesday publishes the post-waiver Week 2 Yahoo board with Makers picks locked.'],
['Week 2 early Yahoo board','Week 2 Wednesday board'],
['Early Week 2 Yahoo board','Week 2 Wednesday board'],
['NOT LOCKED YET','LOCKED WEDNESDAY'],
['Tuesday Waivers','Wednesday Waivers'],
['THE TUESDAY STATE','THE WEDNESDAY STATE']
];
const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
for(const n of nodes){let s=n.nodeValue;for(const [a,b] of replacements)s=s.split(a).join(b);n.nodeValue=s}
const page=(document.body.dataset.page||'').toLowerCase();const q=new URLSearchParams(location.search);const hero=document.querySelector('.hero');
if(page==='home'&&hero){
  const eyebrow=hero.querySelector('.eyebrow');if(eyebrow)eyebrow.textContent='2026 WEEK 2 · WEDNESDAY UPDATE';
  const p=hero.querySelector('p');if(p)p.textContent='Week 1 is final, waivers are processed, the rankings and odds are repriced, and the Week 2 Makers picks are locked.';
  const actions=hero.querySelector('.hero-actions');if(actions)actions.insertAdjacentHTML('beforeend','<a class="btn ghost" href="week.html?week=2">Week 2 Preview</a>');
  hero.insertAdjacentHTML('afterend',sec('Week 2 preview & locked picks',locks(),'Post-waiver Yahoo projections are frozen next to the Makers score forecast and winner pick.','WEDNESDAY · LOCKED'));
  const extras=document.querySelectorAll('.makers-wed-extra');if(extras.length)extras[extras.length-1].insertAdjacentHTML('afterend',sec('Waiver run: what changed',waiverCards(),'The moves that reshaped the Week 2 board.','POST-WAIVERS'));
}
if(page==='week'&&Number(q.get('week')||1)===2){
  const h=document.querySelector('.pagehead h1');if(h)h.textContent='Week 2 — Preview & Locked Picks';
  const p=document.querySelector('.pagehead p');if(p)p.textContent='The Wednesday post-waiver board is final: matchup previews, Yahoo projections and Makers picks are locked before kickoff.';
  beforeFooter(sec('Locked Makers projections',locks(),'These are the official Week 2 prediction receipts.','WEDNESDAY LOCK'));
  beforeFooter(sec('Waiver recap',waiverCards(),'How the rosters changed before the Week 2 picks were locked.','POST-WAIVERS'));
}
if(page==='predictions')beforeFooter(sec('Week 2 locked prediction receipt',locks(),'Yahoo Wednesday projections and Makers projections are frozen here for next week’s grading.','OFFICIAL PICKS'));
if(page==='waivers'){
  const ph=document.querySelector('.pagehead');if(ph)ph.insertAdjacentHTML('afterend',sec('Wednesday waiver results',waiverCards(),'Waivers are complete; the rest of this page is the post-waiver free-agent board.','RESULTS'));
}
if(page==='transactions'){
  const ph=document.querySelector('.pagehead');if(ph)ph.insertAdjacentHTML('afterend',sec('Moves since the Week 1 close',recentMoves(),`${(T.recentTransactions||[]).length} post-MNF transactions captured before the Week 2 lock.`,'WEDNESDAY TAPE'));
  document.querySelectorAll('.kicker,.pagehead p,.section-intro').forEach(el=>{el.innerHTML=el.innerHTML.replace(/17 STRUCTURED MOVES/g,`${(T.transactions||[]).length} STRUCTURED MOVES`).replace(/all 17 structured transactions/gi,`all ${(T.transactions||[]).length} structured transactions`)})
}
if(page==='warroom'){
  beforeFooter(sec('Week 2 locked board',locks(),'The one-week matchup layer after waivers.','NEXT UP'));
  beforeFooter(sec('What waivers changed',waiverCards(),'The roster moves behind the Wednesday repricing.','TRANSACTION IMPACT'));
}
const foot=document.querySelector('.footer .small:last-child');if(foot)foot.textContent='Wednesday update · Week 1 final · waivers processed · Week 2 picks locked.';
})();
