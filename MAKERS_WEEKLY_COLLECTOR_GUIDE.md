# Makers Weekly Collector v1.3.9 — Wednesday workflow

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
- `Makers_Weekly_Collector_v1.3.9.txt` — identical versioned copy

The collector is natively Wednesday-only: one mode, one validation path, one export.


## v1.3.4 workflow cleanup
- Internal collector mode is now `WEDNESDAY` with no split-mode compatibility state.
- The export always reports `mode: "WEDNESDAY"` and `workflow: "wednesday-combined"`.
- Validation always requires the full completed-week + current-roster + upcoming-preview dataset.
- The v1.3.2 Billy team-name alias fix remains preserved.
- v1.3.4 removes the hard-coded Week 2 startup default and self-advances the suggested Upcoming week.

## Install or update v1.3.9 in Chrome / Tampermonkey

Chrome stores its own installed script. A GitHub release alone does not verify that Chrome has updated it.

1. Open [the canonical userscript](https://raw.githubusercontent.com/TheMakersFFL/the-makers/main/Makers_Weekly_Collector.user.js) and update the existing **Makers Weekly Collector — Wednesday** entry. If the URL displays source text, replace the code in that existing entry and save. Do not delete the entry or create a duplicate.
2. Reload [The Makers Yahoo league](https://football.fantasysports.yahoo.com/f1/471058) and confirm the panel displays **v1.3.9**. Existing captures, week selection, team mappings, and league binding are preserved.
3. Click **EXPORT JSON**. Confirm the downloaded file exists in Chrome Downloads and opens as JSON. A request or Save As dialog alone does not confirm completion. If Tampermonkey rejects the download, the collector displays the actual error and a **SAVE JSON** link. Clipboard export remains available.
4. For archived data, use Tampermonkey's **Makers: Export a saved weekly snapshot** menu on the league page. Both old raw snapshots and compressed snapshots export as normal JSON.

If Tampermonkey fails before the script starts because its stored message exceeds 64 MiB, updating code cannot run a migration. Export a fresh Tampermonkey ZIP with script storage and settings included, and use a verified Makers-only recovery ZIP built from that backup. Import through **Dashboard → Utilities → Import from file**, review the one-script selection, then reload Yahoo. Do not restore an older backup over newer Makers captures or settings.

## v1.3.9 download and storage repair

- Requests the JSON file immediately using a Blob, independently of archive storage. Handles native success, rejection, cancellation, and timeout; offers a persistent user-click save link when completion is not confirmed.
- Compresses new saved weekly snapshots losslessly and verifies their SHA-256 and byte length before writing. Current captures and parsed data remain unchanged.
- Guards writes below the extension message ceiling; refuses oversized writes without deleting saved data.
- Removes the version-change workspace reset. Upgrading no longer clears the current collection.
- Preserves Makers' league restriction, names, aliases, team IDs, parser, validation, schema, storage keys, and filename prefix.

Runtime reference: [Tampermonkey GM_download](https://www.tampermonkey.net/documentation.php?q=GM_download) supports Blob input in v5.4.6226 and newer. Browser verification still requires an actual download in the installed Chrome profile.

Regression check: `node tests/collector-regression.cjs`. This exercises upgrade retention, league isolation, unchanged parsing/export data, lossless snapshots, size-limit protection, download callbacks, and failure fallbacks with simulated browser APIs. It does not certify a user's Chrome installation.

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
