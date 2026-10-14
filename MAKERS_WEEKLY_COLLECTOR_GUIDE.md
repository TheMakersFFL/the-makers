# Makers Weekly Collector v1.3.6 — Wednesday workflow

The Makers collector uses the hardened Yahoo parsing/validation engine developed for Mis.Exp while remaining isolated to The Makers.

## Isolation
- Yahoo league: **471058 — The Makers**
- Schema: `makers-weekly-collector/v2`
- Tampermonkey/storage prefix: `MAKERSFF`
- Export prefix: `MAKERS_`
- The script hard-stops on Yahoo league IDs other than `471058`.
- Makers team aliases and accepted 2026 Yahoo team IDs remain built in as fallbacks.

## Wednesday — one collection, one update
Set **Upcoming week** to the week that is about to be played. The collector now auto-suggests the current upcoming week from the season calendar (and honors a Yahoo `week=` URL when present), but confirm the number before collecting. Example: once Week 1 is final and Week 2 waivers clear, use **2**.

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
- `Makers_Weekly_Collector_v1.3.6.txt` — identical versioned copy

The collector is natively Wednesday-only: one mode, one validation path, one export.


## v1.3.4 workflow cleanup
- Internal collector mode is now `WEDNESDAY` with no split-mode compatibility state.
- The export always reports `mode: "WEDNESDAY"` and `workflow: "wednesday-combined"`.
- Validation always requires the full completed-week + current-roster + upcoming-preview dataset.
- The v1.3.2 Billy team-name alias fix remains preserved.
- v1.3.4 removes the hard-coded Week 2 startup default and self-advances the suggested Upcoming week.

## Install or update v1.3.6 in Chrome / Tampermonkey

The code in GitHub is **v1.3.6**, but Chrome stores its own installed userscript copy. Updating GitHub does **not** update the Tampermonkey dashboard until Tampermonkey installs or refreshes the script.

1. Open the canonical userscript URL: https://raw.githubusercontent.com/TheMakersFFL/the-makers/main/Makers_Weekly_Collector.user.js
2. In Tampermonkey, choose **Update**, **Reinstall**, or **Install** as prompted. If the URL displays text instead, edit the existing **Makers Weekly Collector — Wednesday** script, replace all code with the current source, and save it.
3. Verify the single **Makers Weekly Collector — Wednesday** entry shows version **1.3.6** and is enabled. Keep the retired **Makers Weekly Collector — Tuesday + Thursday** disabled. Do not run two Makers collector scripts simultaneously.
4. Open Yahoo league 471058, refresh, verify the collector header says v1.3.6, set Upcoming week to the week about to be played, clear any stale workspace, and run AUTO COLLECT LEAGUE after Wednesday waivers.
5. Do not export/import data for the site until the required recap and preview checks pass. Preserve the export JSON privately for source-level QA.

## Changes already incorporated by v1.3.6

- Corrected transaction parsing for traded players and Yahoo transaction row variants; validation now requires actual structured trade assets.
- Tracks explicitly empty Yahoo starter slots rather than falsely marking otherwise valid current rosters as incomplete.
- Avoids treating future-week bye/calendar metadata as current player fantasy points.
- Retains 2026 Makers team ID mapping, team aliases, isolated league ID, and the Wednesday-only combined workflow.

## v1.3.6 Wednesday collector QA (Week 6)

- Treat Yahoo compact bye rows (for example `6Bye100%` and `6Bye76%`) as **no projected points** rather than reading a roster/start percentage as a fantasy projection.
- Treat Ravens/Baltimore BAL DEF as the same asset when deduplicating one timestamp/team/action/FAAB transaction; do not double-charge the Wednesday waiver.
- Current rosters with real empty starter slots and bye-week starters remain valid when their summed numeric starter projections reconcile to official Yahoo team projections.
- Historical Week 5 export is not modified; the Week 6 Phase 2 sanitized import contains the corrections. Updating a Tampermonkey installation later requires the user to update the Wednesday userscript locally.
