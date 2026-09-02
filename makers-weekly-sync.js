(function(){
  const Y=window.MAKERS_2026;
  if(!Y) return;

  const imports=Array.isArray(window.MAKERS_WEEKLY_IMPORTS)&&window.MAKERS_WEEKLY_IMPORTS.length
    ? window.MAKERS_WEEKLY_IMPORTS
    : (window.MAKERS_WEEKLY_IMPORT?[window.MAKERS_WEEKLY_IMPORT]:[]);
  const valid=imports.filter(I=>I&&/^makers-weekly-collector\//.test(String(I.schema||'')));
  if(!valid.length) return;

  const TEAM_MANAGER={
    'The Eviscerators':'Andrew',
    'The Moose Knuckles':'Jim',
    'TDs In Your Face':'Nick',
    'The Mustache riders':'TomD',
    'Criterus':'Chris',
    'Kareem all over your Hunt':'Billy',
    'Pump and Go':'Tommy',
    'The A Gap':'Adam',
    'Predacious Fungi':'Max',
    'Revenge of the period bloods':'Nate'
  };
  const MANAGER_TEAM=Object.fromEntries(Object.entries(TEAM_MANAGER).map(([t,m])=>[m,t]));
  const TEAM_ALIASES={
    'Eviscerators':'The Eviscerators',
    'TDs IN YO FACE':'TDs In Your Face',
    'TDs IN YOUR FACE':'TDs In Your Face',
    'The Mustache Riders':'The Mustache riders',
    'Revenge of the Period Bloods':'Revenge of the period bloods'
  };
  const canonical=t=>TEAM_ALIASES[String(t||'').trim()]||String(t||'').trim();
  const num=v=>{const n=Number(String(v??'').replace(/[$,% ,]/g,''));return Number.isFinite(n)?n:null};
  const teamName=x=>canonical(x?.team||x?.name||x?.teamName||MANAGER_TEAM[x?.manager]||'');
  const managerName=x=>x?.manager||TEAM_MANAGER[teamName(x)]||'';
  const pairKey=(week,a,b)=>`${Number(week)||0}|${[canonical(a),canonical(b)].sort().join('|')}`;
  const txText=v=>String(v??'').replace(/[\uE000-\uF8FF]/g,'').replace(/\s+/g,' ').trim();
  const txKey=x=>[x.type||'MOVE',x.manager||'',x.team||'',x.add||'',x.drop||'',x.faab??'',x.time||''].map(txText).join('|').toLowerCase();
  const seasonTransactions=new Map();
  let transactionSequence=0;
  Y.predictionSnapshots=Y.predictionSnapshots||{};
  const round2=v=>Math.round(Number(v)*100)/100;
  const rankForTeam=t=>Number((Y.draftRankings||[]).find(x=>canonical(x.team)===canonical(t))?.rank)||5.5;
  function makersProjection(team,yahoo,meanYahoo,completedWeek,standings){
    const y=Number(yahoo),hasYahoo=Number.isFinite(y)&&y>0;
    const base=hasYahoo?y:(Number.isFinite(meanYahoo)&&meanYahoo>0?meanYahoo:100);
    const rank=rankForTeam(team),preAdj=(5.5-rank)*1.35;
    const rows=Array.isArray(standings)?standings:[];
    const ppgs=completedWeek>0?rows.map(x=>(num(x.pf)??0)/completedWeek).filter(Number.isFinite):[];
    const leaguePpg=ppgs.length?ppgs.reduce((a,b)=>a+b,0)/ppgs.length:base;
    const row=rows.find(x=>canonical(teamName(x))===canonical(team));
    const teamPpg=completedWeek>0&&row?(num(row.pf)??0)/completedWeek:leaguePpg;
    const liveAdj=completedWeek>0?Math.max(-9,Math.min(9,(teamPpg-leaguePpg)*0.30)):0;
    const liveWeight=Math.min(.70,(completedWeek/8)*.70);
    const adjustment=preAdj*(1-liveWeight)+liveAdj*liveWeight;
    return round2((hasYahoo?.87:1)*base+(hasYahoo?.13:0)*meanYahoo+adjustment);
  }
  Y.collectorSnapshots=[];

  function applyImport(I,isLatest){
    const data=I.data||{};
    Y.collectorSnapshots.push({
      mode:I.mode||'',capturedAt:I.capturedAt||'',completedWeek:Number(I.completedWeek)||0,
      targetWeek:Number(I.targetWeek)||1,validation:I.validation||{}
    });
    if(isLatest){
      Y.collectorStatus={active:true,schema:I.schema,mode:I.mode||'',capturedAt:I.capturedAt||'',completedWeek:Number(I.completedWeek)||0,targetWeek:Number(I.targetWeek)||Number(Y.week)||1,validation:I.validation||{},source:'Makers Yahoo browser collector',snapshotCount:valid.length};
      if(I.capturedAt)Y.lastUpdated=I.capturedAt;
      if(Number(I.targetWeek)>=1)Y.week=Number(I.targetWeek);
      Y.weeklyCollectorDelta=I.delta||null;
    }

    if(Array.isArray(data.standings)&&data.standings.length){
      const previous=new Map((Y.standings||[]).map(x=>[x.manager||TEAM_MANAGER[x.team],x]));
      Y.standings=data.standings.map((s,i)=>{
        const team=teamName(s),manager=managerName(s),prior=previous.get(manager)||{},w=num(s.w),l=num(s.l);
        return {team,manager,rank:num(s.rank)??i+1,w:w??0,l:l??0,pf:num(s.pf)??0,pa:num(s.pa)??0,moves:num(prior.moves)??0,trades:num(prior.trades)??0,record:s.record||`${w??0}-${l??0}`,streak:s.streak||'—',movement:s.movement||'—'};
      }).filter(s=>s.team&&s.manager);
    }

    const finals=(data.matchups||[]).filter(m=>{
      const sa=num(m.scoreA),sb=num(m.scoreB);
      return sa!=null&&sb!=null&&(m.final===true||/final|closed|complete/i.test(String(m.status||''))||Number(m.week)<=Number(I.completedWeek||0));
    });
    if(finals.length){
      const existing=new Map((Y.results||[]).map(r=>[pairKey(r.week,r.teamA||r.home,r.teamB||r.away),r]));
      for(const m of finals){
        const a=canonical(m.teamA),b=canonical(m.teamB);if(!a||!b)continue;
        existing.set(pairKey(m.week,a,b),{year:Number(Y.season)||2026,week:Number(m.week)||Number(I.completedWeek)||1,round:`Week ${Number(m.week)||Number(I.completedWeek)||1}`,stage:'Regular Season',status:'FINAL',teamA:a,teamB:b,managerA:TEAM_MANAGER[a]||'',managerB:TEAM_MANAGER[b]||'',scoreA:num(m.scoreA),scoreB:num(m.scoreB),source:'Makers Yahoo browser collector'});
      }
      Y.results=[...existing.values()].sort((a,b)=>(a.week||0)-(b.week||0));
    }

    const completed=Number(I.completedWeek)||0;
    if(completed&&Y.weekly?.[String(completed)]){
      const weekFinals=finals.filter(m=>Number(m.week)===completed);
      if(weekFinals.length){
        Y.weekly[String(completed)].results=weekFinals.map(m=>[canonical(m.teamA),canonical(m.teamB),String(m.scoreA),String(m.scoreB)]);
        Y.weekly[String(completed)].collectorUpdatedAt=I.capturedAt||'';
      }
    }

    const target=Number(I.targetWeek)||Number(Y.week)||1;
    const upcoming=(data.matchupProjections?.length?data.matchupProjections:(data.matchups||[])).filter(m=>Number(m.week||target)===target);
    if(upcoming.length&&Y.weekly?.[String(target)]){
      const scheduleRows=Y.weekly[String(target)].matchups||[];
      const byPair=new Map(upcoming.map(m=>[[canonical(m.teamA),canonical(m.teamB)].sort().join('|'),m]));
      Y.weekly[String(target)].yahooProjections=scheduleRows.map(row=>{
        const m=byPair.get([canonical(row[0]),canonical(row[1])].sort().join('|'));
        if(!m)return [row[0],row[1],'',''];
        const same=canonical(m.teamA)===canonical(row[0]);
        const pa=same?(m.projA??m.scoreA):(m.projB??m.scoreB),pb=same?(m.projB??m.scoreB):(m.projA??m.scoreA);
        return [row[0],row[1],pa??'',pb??''];
      });
      if(String(I.mode||'').toLowerCase()==='post-waivers'){
        const positive=[];
        for(const m of upcoming)for(const v of [num(m.projA),num(m.projB)])if(v!=null&&v>0)positive.push(v);
        const meanYahoo=positive.length?positive.reduce((a,b)=>a+b,0)/positive.length:100;
        const existing=Y.predictionSnapshots[String(target)]||null;
        const oldByPair=new Map((existing?.matchups||[]).map(m=>[[canonical(m.teamA),canonical(m.teamB)].sort().join('|'),m]));
        const forecast=scheduleRows.map(row=>{
          const m=byPair.get([canonical(row[0]),canonical(row[1])].sort().join('|'));if(!m)return null;
          const same=canonical(m.teamA)===canonical(row[0]),ya=num(same?m.projA:m.projB),yb=num(same?m.projB:m.projA);
          const prior=oldByPair.get([canonical(row[0]),canonical(row[1])].sort().join('|'));
          if(existing?.locked&&prior)return prior;
          return {teamA:row[0],teamB:row[1],meA:makersProjection(row[0],ya,meanYahoo,completed,data.standings),meB:makersProjection(row[1],yb,meanYahoo,completed,data.standings),yahooA:ya??0,yahooB:yb??0};
        }).filter(Boolean);
        Y.predictionSnapshots[String(target)]={week:target,capturedAt:(existing?.locked?existing.capturedAt:(I.capturedAt||'')),phase:'THURSDAY FORECAST',source:'POST-WAIVERS Yahoo collector + Makers power/scoring model',model:'Makers Power Blend v1',locked:true,matchups:forecast};
      }
    }
    if(isLatest&&upcoming.length){
      Y.liveMatchupProjections=upcoming.map(m=>({...m,teamA:canonical(m.teamA),teamB:canonical(m.teamB)}));
      Y.liveScoring={week:target,mode:'YAHOO',label:'YAHOO COLLECTOR',lastUpdated:I.capturedAt||'',matchups:upcoming.map(m=>{
        const status=/final|closed|complete/i.test(String(m.status||''))?'FINAL':(/live|quarter|halftime/i.test(String(m.status||''))?'LIVE':'UPCOMING');
        const hp=num(m.projA),ap=num(m.projB),hs=num(m.scoreA),as=num(m.scoreB);
        const diff=(hp!=null&&ap!=null)?hp-ap:0,homeProb=Math.max(15,Math.min(85,50+diff*2.2));
        return {home:canonical(m.teamA),away:canonical(m.teamB),homeScore:status==='UPCOMING'?null:hs,awayScore:status==='UPCOMING'?null:as,homeProj:hp??0,awayProj:ap??0,status,detail:status==='UPCOMING'?'Yahoo projection':'Yahoo collector result',homeWinProb:homeProb};
      })};
    }

    if(Array.isArray(data.rosters)&&data.rosters.length){
      Y.liveRosters=data.rosters.map(r=>({team:teamName(r),manager:managerName(r),players:Array.isArray(r.players)?r.players:[],capturedAt:I.capturedAt||''})).filter(r=>r.team);
    }

    const tx=(data.transactions||[]).map(x=>({type:txText(x.type||'MOVE').toUpperCase(),manager:txText(x.manager||TEAM_MANAGER[canonical(x.team)]||''),team:canonical(txText(x.team||MANAGER_TEAM[x.manager]||'')),add:txText(x.add||''),drop:txText(x.drop||''),faab:x.faab==null?null:num(x.faab),description:txText(x.description||[x.add&&`Added ${x.add}`,x.drop&&`Dropped ${x.drop}`].filter(Boolean).join(' · ')||'Completed transaction'),time:txText(x.time||x.date||'')}));
    tx.forEach((x,order)=>{const key=txKey(x);if(key)seasonTransactions.set(key,{...x,_captureIndex:transactionSequence,_captureOrder:order})});
    transactionSequence++;
    const faab=(data.faab||[]).map((x,i)=>({priority:num(x.priority)??i+1,manager:x.manager||TEAM_MANAGER[canonical(x.team)]||'',team:canonical(x.team||MANAGER_TEAM[x.manager]||''),spent:num(x.spent)??Math.max(0,100-(num(x.remaining)??100)),remaining:num(x.remaining)??100,claimsWon:num(x.claimsWon)??0}));
    const available=(data.availablePlayers||[]).map(p=>({name:p.name||'',position:p.position||p.pos||'',nflTeam:p.nflTeam||p.nfl||'',status:p.status||'FA',recent:p.recent??p.points??'—',projected:p.projected??null,faabSuggestion:p.faabSuggestion||''})).filter(p=>p.name);
    if(faab.length)Y.faab=faab;
    if(available.length)Y.topAvailable=available;
    if(isLatest&&(tx.length||faab.length||available.length))Y.apiStatus='Yahoo collector connected';
  }

  valid.forEach((I,i)=>applyImport(I,i===valid.length-1));
  const seasonTx=[...seasonTransactions.values()].sort((a,b)=>b._captureIndex-a._captureIndex||a._captureOrder-b._captureOrder).map(({_captureIndex,_captureOrder,...x})=>x);
  if(seasonTx.length)Y.recentTransactions=seasonTx;
  const moveCounts=Object.fromEntries(Object.values(TEAM_MANAGER).map(m=>[m,0]));
  seasonTx.forEach(x=>{const m=x.manager||TEAM_MANAGER[x.team]||'';if(m)moveCounts[m]=(moveCounts[m]||0)+1});
  Y.transactionCounts2026=moveCounts;
  Y.standings=(Y.standings||[]).map(s=>({...s,moves:moveCounts[s.manager]??s.moves??0}));
})();
