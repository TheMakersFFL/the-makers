// Makers Week 10 factual rollover; forecasts are locked separately in Phase 3.
(function(){'use strict';
const Y=window.MAKERS_2026;
if(!Y||Number(Y.week)!==10||Number(Y.collectorStatus?.targetWeek)!==10)return;
Y.weekly=Y.weekly||{};
if(Y.weekly['9']){Y.weekly['9'].status='FINAL';Y.weekly['9'].collectorFinalizedAt=Y.collectorStatus.capturedAt;}
if(Y.weekly['10']){Y.weekly['10'].status=Y.predictionSnapshots?.['10']?.locked?'WEDNESDAY PREVIEW · PICKS LOCKED':'WEDNESDAY PREVIEW · PROVISIONAL';Y.weekly['10'].collectorUpdatedAt=Y.collectorStatus.capturedAt;}
if(Y.week9ModelSnapshot){Y.previousModelSnapshot=Y.week9ModelSnapshot;Y.modelPendingWeek=10;}
Y.lastUpdated='November 12, 2026 · Week 10 post-waiver collector';
})();
