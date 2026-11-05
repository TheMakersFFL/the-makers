// Makers Week 9 Phase 2 — factual source rollover, no forecast lock or publication.
(function(){'use strict';
const Y=window.MAKERS_2026;
if(!Y||Number(Y.week)!==9||Number(Y.collectorStatus?.targetWeek)!==9)return;
Y.weekly=Y.weekly||{};
if(Y.weekly['8']){
  Y.weekly['8'].status='FINAL';
  Y.weekly['8'].collectorFinalizedAt=Y.collectorStatus.capturedAt||'';
}
if(Y.weekly['9']){
  Y.weekly['9'].status=Y.predictionSnapshots?.['9']?.locked?'WEDNESDAY PREVIEW · PICKS LOCKED':'WEDNESDAY PREVIEW · PROVISIONAL';
  Y.weekly['9'].collectorUpdatedAt=Y.collectorStatus.capturedAt||'';
}
if(Y.week8ModelSnapshot){
  Y.previousModelSnapshot=Y.week8ModelSnapshot;
  Y.modelPendingWeek=9;
}
Y.lastUpdated='November 4, 2026 · Wednesday Week 9 factual collector';
})();
