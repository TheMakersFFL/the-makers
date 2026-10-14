// Makers Week 3 historical forecast recovery from Sep 24 published Wednesday article and original Yahoo collector.
(function(){'use strict';
const Y=window.MAKERS_2026;if(!Y)return;
const original=[{"teamA":"The Moose Knuckles","teamB":"Pump and Go","meA":118.52,"meB":108.76,"yahooA":115.74,"yahooB":106.82},{"teamA":"TDs In Your Face","teamB":"Revenge of the period bloods","meA":102.49,"meB":98.33,"yahooA":107.09,"yahooB":97.2},{"teamA":"Predacious Fungi","teamB":"The Eviscerators","meA":96.34,"meB":116.58,"yahooA":102.24,"yahooB":113.67},{"teamA":"Criterus","teamB":"Kareem all over your Hunt","meA":107.19,"meB":103.54,"yahooA":102.25,"yahooB":106.78},{"teamA":"The Mustache riders","teamB":"The A Gap","meA":108.18,"meB":95.19,"yahooA":108.68,"yahooB":95}];
const captured='2026-09-24T20:23:52.435Z';
const old=Y.predictionSnapshots?.['3'];
const same=(a,b)=>a?.teamA===b?.teamA&&a?.teamB===b?.teamB&&['meA','meB','yahooA','yahooB'].every(k=>Number(a[k])===Number(b[k]));
if(old?.matchups?.length===5&&!old.matchups.every((x,i)=>same(x,original[i]))){console.error('Week 3 original forecast differs from authenticated Sep 24 scores. Historical receipt not rewritten.');return;}
if(old?.locked===true&&old?.capturedAt!==captured){console.error('Different locked Week 3 timestamp found. Historical receipt not rewritten.');return;}
Y.predictionSnapshots=Y.predictionSnapshots||{};
Y.predictionSnapshots['3']={week:3,capturedAt:captured,phase:'WEDNESDAY FORECAST',source:'Archived September 24, 2026 Makers weekly write-up and original Yahoo Wednesday collector',model:'Makers Power Blend v1',locked:true,matchups:original};
Y.week3HistoricalReceiptRestored=true;
})();
