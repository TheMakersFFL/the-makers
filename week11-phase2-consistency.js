// Makers Week 11 factual rollover; current forecasts remain provisional until Phase 3.
(function(){'use strict';
const Y=window.MAKERS_2026;
if(!Y||+Y.week!==11||+Y.collectorStatus?.targetWeek!==11)return;
const I=[...(window.MAKERS_WEEKLY_IMPORTS||[])].reverse().find(x=>+x.targetWeek===11&&+x.completedWeek===10);
if(!I)return;
Y.weekly=Y.weekly||{};
if(Y.weekly['10']){Y.weekly['10'].status='FINAL';Y.weekly['10'].collectorFinalizedAt=I.capturedAt;}
if(Y.weekly['11']){Y.weekly['11'].status=Y.predictionSnapshots?.['11']?.locked?'WEDNESDAY PREVIEW · PICKS LOCKED':'WEDNESDAY PREVIEW · PROVISIONAL';Y.weekly['11'].collectorUpdatedAt=I.capturedAt;}
Y.previousModelSnapshot=Y.week10ModelSnapshot;
Y.modelPendingWeek=Y.predictionSnapshots?.['11']?.locked?null:11;
Y.lastUpdated='November 18, 2026 · Week 11 post-waiver collector';
// Preserve availability, waiver dates and all verified numeric fields separately
// from injury status. Keep the existing render-layer aliases without inventing ranks.
Y.topAvailable=(I.data.availablePlayers||[]).map(p=>({...p,
 position:p.position||p.pos||'',recent:p.recent??p.points??'—',faabSuggestion:p.faabSuggestion||''
}));
})();
