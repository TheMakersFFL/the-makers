// Makers Week 4 locked model snapshot — Phase 3
(function(){
'use strict';
const Y=window.MAKERS_2026;if(!Y)return;
const power=[
{rank:1,team:'The Moose Knuckles',manager:'Jim',powerIndex:92.02},
{rank:2,team:'The Eviscerators',manager:'Andrew',powerIndex:86.86},
{rank:3,team:'The Mustache riders',manager:'TomD',powerIndex:83.42},
{rank:4,team:'TDs In Your Face',manager:'Nick',powerIndex:61.26},
{rank:5,team:'Kareem all over your Hunt',manager:'Billy',powerIndex:56.70},
{rank:6,team:'Criterus',manager:'Chris',powerIndex:48.86},
{rank:7,team:'Pump and Go',manager:'Tommy',powerIndex:37.63},
{rank:8,team:'Predacious Fungi',manager:'Max',powerIndex:25.09},
{rank:9,team:'Revenge of the period bloods',manager:'Nate',powerIndex:24.80},
{rank:10,team:'The A Gap',manager:'Adam',powerIndex:19.62}
];
const odds=[
{team:'The Moose Knuckles',manager:'Jim',playoff:98.2,bye:68.1,title:24.8,toilet:0.3,avgSeed:2.23,seedLow:1,seedHigh:4},
{team:'The Mustache riders',manager:'TomD',playoff:96.0,bye:46.7,title:18.0,toilet:0.6,avgSeed:2.93,seedLow:1,seedHigh:5},
{team:'The Eviscerators',manager:'Andrew',playoff:95.2,bye:53.1,title:26.7,toilet:0.5,avgSeed:2.81,seedLow:1,seedHigh:5},
{team:'Kareem all over your Hunt',manager:'Billy',playoff:76.8,bye:12.2,title:8.1,toilet:4.5,avgSeed:4.95,seedLow:2,seedHigh:8},
{team:'TDs In Your Face',manager:'Nick',playoff:74.4,bye:9.6,title:10.4,toilet:3.6,avgSeed:5.14,seedLow:3,seedHigh:8},
{team:'Criterus',manager:'Chris',playoff:60.8,bye:5.4,title:6.3,toilet:7.0,avgSeed:5.89,seedLow:3,seedHigh:9},
{team:'Pump and Go',manager:'Tommy',playoff:43.0,bye:2.7,title:3.0,toilet:13.6,avgSeed:6.70,seedLow:4,seedHigh:9},
{team:'Revenge of the period bloods',manager:'Nate',playoff:22.3,bye:0.9,title:1.1,toilet:23.0,avgSeed:7.90,seedLow:5,seedHigh:10},
{team:'Predacious Fungi',manager:'Max',playoff:21.4,bye:0.9,title:1.0,toilet:23.4,avgSeed:7.93,seedLow:5,seedHigh:10},
{team:'The A Gap',manager:'Adam',playoff:11.9,bye:0.3,title:0.7,toilet:23.5,avgSeed:8.52,seedLow:6,seedHigh:10}
];
const forecasts=[
{teamA:'The Mustache riders',teamB:'The Eviscerators',meA:110.51,meB:113.05,yahooA:110.72,yahooB:109.53},
{teamA:'The Moose Knuckles',teamB:'Criterus',meA:115.57,meB:111.14,yahooA:111.55,yahooB:108.15},
{teamA:'TDs In Your Face',teamB:'Predacious Fungi',meA:101.71,meB:98.00,yahooA:104.72,yahooB:102.86},
{teamA:'The A Gap',teamB:'Kareem all over your Hunt',meA:95.14,meB:104.64,yahooA:96.06,yahooB:107.69},
{teamA:'Pump and Go',teamB:'Revenge of the period bloods',meA:105.38,meB:102.59,yahooA:104.10,yahooB:102.34}
];
Y.predictionSnapshots=Y.predictionSnapshots||{};
Y.predictionSnapshots['4']={week:4,capturedAt:'2026-09-30T14:34:24.607Z',phase:'WEDNESDAY FORECAST',source:'September 30 Wednesday Yahoo collector + Makers Power Blend v1',model:'Makers Power Blend v1',locked:true,matchups:forecasts};
Y.week4ModelSnapshot={week:4,label:'Makers Power Blend v1 · Week 4 rollover',powerRankings:power,odds,forecasts,predictionGrading:{week3:{makers:{correct:3,total:5},yahoo:{correct:3,total:5}},season:{makers:{correct:11,total:15},yahoo:{correct:10,total:15}}}};
Y.currentModelSnapshot=Y.week4ModelSnapshot;
Y.playoffOdds=odds;
Y.powerRankings=power;
function patch(E){if(!E)return;const standings=Object.fromEntries((E.currentStandings?E.currentStandings():Y.standings||[]).map(x=>[x.team,x]));E.powerMetrics=()=>power.map((p,i)=>({...standings[p.team],...p,powerRank:p.rank||i+1}));E.simulate=()=>odds.map(o=>({...o,press:o.toilet}));window.MAKERS_WEEK4_MODEL_LOCK_ACTIVE=true;}
if(window.MAKERS_ENGINE)patch(window.MAKERS_ENGINE);else{let engine;Object.defineProperty(window,'MAKERS_ENGINE',{configurable:true,enumerable:true,get(){return engine},set(v){engine=v;patch(v)}})}
})();
