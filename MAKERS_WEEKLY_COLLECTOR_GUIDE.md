# Makers Weekly Collector v1.3.3 — Wednesday workflow

The Makers collector uses the hardened Yahoo parsing/validation engine developed for Mis.Exp while remaining isolated to The Makers.

## Isolation
- Yahoo league: **471058 — The Makers**
- Schema: `makers-weekly-collector/v2`
- Tampermonkey/storage prefix: `MAKERSFF`
- Export prefix: `MAKERS_`
- The script hard-stops on Yahoo league IDs other than `471058`.
- Makers team aliases and accepted 2026 Yahoo team IDs remain built in as fallbacks.

## Wednesday — one collection, one update
Set **Upcoming week** to the week that is about to be played. Example: once Week 1 is final and Week 2 waivers clear, set it to **2**.

1. Wait until Wednesday waivers have processed.
2. Use **WEDNESDAY** mode.
3. Run **AUTO COLLECT LEAGUE**.
4. Confirm all validation checks are green. The Wednesday build specifically requires structured transaction/waiver activity to be captured, in addition to the recap and preview data. If Yahoo does not expose something automatically, open that page and use **CAPTURE THIS PAGE**.
5. Export the JSON.
6. Send the exported `MAKERS_<season>_W<upcoming-week>_WEDNESDAY.json` file to ChatGPT.

The Wednesday collection gathers and validates the full recap, roster, waiver and preview state in one pass:
- 10/10 standings with W-L, PF/PA, streak, FAAB and waiver priority where Yahoo exposes them;
- 5/5 final matchups from the completed week covering all 10 franchises;
- all 10 completed-week lineups with starter/bench slots and actual player scoring;
- starter-score reconciliation against Yahoo final team scores;
- all 10 current **post-waiver** rosters with player projections;
- 5/5 upcoming matchups and Yahoo projections;
- 100-player available pool: QB 15, RB 25, WR 25, TE 15, K 10, DEF 10;
- structured transactions with adds, drops and waiver/FAAB information.

## What the Wednesday site update includes
### Previous-week recap
- final results and standings;
- five-game Results Recap;
- Game of the Week, biggest blowout, closest finish, high/low score and bad beat;
- all-play standings and lineup-efficiency/optimal-lineup receipts;
- Makers-vs-Yahoo prediction grading;
- completed-week storylines and awards;
- H2H matrix/game log, franchise history, career standings, League Ledger and Record Book updates.

### Waivers and current state
- post-waiver rosters;
- transaction / FAAB / waiver-priority breakdown;
- who addressed last week's needs;
- remaining waiver/free-agent opportunities;
- meaningful injury and player-status changes;
- refreshed What Everybody Needs notes.

### Upcoming-week preview
- full five-game preview;
- locked Makers winner pick for every matchup;
- locked Makers projected score for every matchup;
- frozen Yahoo projection snapshot for comparison;
- Game of the Week;
- matchup-specific H2H/history notes where useful;
- lineup, roster, injury and playoff implications.

### Weekly model refresh
- Power Rankings / Power Index;
- playoff odds;
- first-round bye odds;
- title equity;
- Toilet/punishment risk;
- projected playoff field and race tiers;
- Franchise Stock Market;
- weekly storylines and Season Timeline / Weekly Pulse.

## Important weekly rule
The previous week's recap and the upcoming week's preview are published together on Wednesday. Completed historical receipts remain permanent. Preview projections and picks are frozen as the Wednesday receipt and graded after the week ends.

## Files
- `Makers_Weekly_Collector.user.js` — install/update this in Tampermonkey
- `Makers_Weekly_Collector_v1.3.3.txt` — identical versioned copy

The collector is natively Wednesday-only: one mode, one validation path, one export.


## v1.3.3 workflow cleanup
- Internal collector mode is now `WEDNESDAY` with no split-mode compatibility state.
- The export always reports `mode: "WEDNESDAY"` and `workflow: "wednesday-combined"`.
- Validation always requires the full completed-week + current-roster + upcoming-preview dataset.
- The v1.3.2 Billy team-name alias fix remains preserved.
