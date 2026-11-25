// Makers Week 12 factual rollover; current forecasts remain provisional until Phase 3.
(function(){'use strict';
const Y=window.MAKERS_2026;
if(!Y||+Y.week!==12||+Y.collectorStatus?.targetWeek!==12)return;
const I=[...(window.MAKERS_WEEKLY_IMPORTS||[])].reverse().find(x=>+x.targetWeek===12&&+x.completedWeek===11);
if(!I)return;
Y.weekly=Y.weekly||{};
if(Y.weekly['11']){Y.weekly['11'].status='FINAL';Y.weekly['11'].collectorFinalizedAt=I.capturedAt;}
if(Y.weekly['12']){Y.weekly['12'].status=Y.predictionSnapshots?.['12']?.locked?'WEDNESDAY PREVIEW · PICKS LOCKED':'WEDNESDAY PREVIEW · PROVISIONAL';Y.weekly['12'].collectorUpdatedAt=I.capturedAt;}
Y.previousModelSnapshot=Y.week11ModelSnapshot;
Y.modelPendingWeek=Y.predictionSnapshots?.['12']?.locked?null:12;
Y.lastUpdated='November 25, 2026 · Week 12 post-waiver collector';
Y.topAvailable=(I.data.availablePlayers||[]).map(p=>({...p,
 position:p.position||p.pos||'',recent:p.recent??p.points??'—',faabSuggestion:p.faabSuggestion||''
}));
})();
