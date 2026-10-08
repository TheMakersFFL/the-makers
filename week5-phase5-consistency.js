// Makers Week 5 Phase 5 consistency guard
(function(){
'use strict';
const Y=window.MAKERS_2026;if(!Y)return;
const completed=Number(Y.collectorStatus?.completedWeek)||4;
Y.weekly=Y.weekly||{};
for(let w=1;w<=completed;w++){
  const row=Y.weekly[String(w)];
  if(row&&(row.results||[]).length===5)row.status='FINAL';
}
if(Y.weekly['5'])Y.weekly['5'].status='WEDNESDAY PREVIEW';
window.MAKERS_WEEK5_PHASE5_CONSISTENCY_ACTIVE=true;
})();
