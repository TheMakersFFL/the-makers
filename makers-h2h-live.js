(function(){
 const E=window.MAKERS_ENGINE,D=window.MAKERS_DATA;if(!E||!D)return;
 const managers=['Chris','Andrew','Nate','Max','Tommy','Adam','Nick','TomD','Jim','Billy','El Rubio'];
 const tbody=document.querySelector('.h2h-matrix tbody');
 if(tbody){tbody.innerHTML=managers.map(a=>`<tr><td><b>${E.esc(a)}</b></td>${managers.map(b=>{if(a===b)return '<td class="h2h-self">—</td>';if((a==='Billy'&&b==='El Rubio')||(a==='El Rubio'&&b==='Billy'))return '<td>—</td>';const s=E.series(a,b),cls=s.w>s.l?'h2h-win':s.w<s.l?'h2h-loss':'h2h-even';return `<td class="${cls}"><b>${s.w}-${s.l}</b><div class="small">REG ${s.regW}-${s.regL} · PO ${s.postW}-${s.postL}</div></td>`}).join('')}</tr>`).join('')}
 const real=(window.MAKERS_2026?.results||[]).filter(x=>x&&x.status!=='DEMO');
 const metrics=document.querySelectorAll('.metric-grid .metric b');
 if(metrics.length>=3&&real.length){const reg=real.filter(x=>(x.stage||'Regular Season')==='Regular Season').length,post=real.length-reg;metrics[0].textContent=280+reg;metrics[1].textContent=38+post;metrics[2].textContent=318+real.length}
 if(real.length){const sec=document.createElement('section');sec.className='section';sec.innerHTML=`<div class="wrap"><div class="kicker">2026 RESULTS</div><h2>Current-season H2H additions</h2><div class="table-wrap"><table><thead><tr><th>Week</th><th>Team A</th><th>Score</th><th>Team B</th><th>Stage</th></tr></thead><tbody>${real.map(g=>`<tr><td>${E.esc(g.round||`Week ${g.week}`)}</td><td><b>${E.esc(g.teamA||g.home)}</b><div class="small">${E.esc(g.managerA||E.managerByTeam(g.teamA||g.home))}</div></td><td><b>${Number(g.scoreA??g.homeScore).toFixed(2)}–${Number(g.scoreB??g.awayScore).toFixed(2)}</b></td><td><b>${E.esc(g.teamB||g.away)}</b><div class="small">${E.esc(g.managerB||E.managerByTeam(g.teamB||g.away))}</div></td><td>${E.esc(g.stage||'Regular Season')}</td></tr>`).join('')}</tbody></table></div></div>`;document.querySelector('.footer')?.insertAdjacentElement('beforebegin',sec)}
})();
