(function(){
 const E=window.MAKERS_ENGINE,Y=window.MAKERS_2026;if(!E||!Y)return;
 const week=Number(document.body.dataset.week||1),d=Y.weekly?.[String(week)]||{};
 const pagehead=document.querySelector('.pagehead');
 if(pagehead){const box=document.createElement('div');box.innerHTML=E.renderScoreboard(week);const section=box.firstElementChild;if(section)pagehead.insertAdjacentElement('afterend',section)}
 const slate=[...document.querySelectorAll('section')].find(s=>s.querySelector('h2')?.textContent.trim()==='The slate');
 if(slate&&d.matchups?.length){slate.innerHTML=`<div class="wrap"><div class="section-head"><div><div class="kicker">MATCHUP FILES</div><h2>The slate</h2></div><p class="section-intro">Every matchup carries the old H2H receipts, latest archived meeting, biggest archived margin and current model edge.</p></div><div class="matchup-pro-grid">${d.matchups.map(m=>E.renderMatchupCard(week,m[0],m[1])).join('')}</div></div>`}
})();
