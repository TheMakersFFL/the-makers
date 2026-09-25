THE MAKERS — GITHUB PAGES SITE

LIVE HOME
https://themakersffl.github.io/the-makers/

LEAGUE HISTORY
- The Makers was founded in 2003.
- The fully archived current iteration begins in 2022.
- Billy begins a separate franchise in 2025 and does not inherit El Rubio's 2022–24 history.

CURRENT 2026 BUILD
- The site uses one combined Wednesday update after waivers clear.
- The current week closes the prior week's results and opens the upcoming week's preview in one cumulative pass.
- Weekly Write-Ups preserve completed recaps and publish the locked upcoming preview.
- 2026 War Room includes standings, race dashboard, projected field and current season context.
- Power Rankings use the live Power Index instead of the frozen preseason board.
- Playoff Odds include playoff, first-round bye, title and toilet/punishment probabilities.
- Predictions tracks Makers vs Yahoo receipts and score/margin accuracy.
- Analytics includes all-play, lineup efficiency, transaction ROI, acquisition receipts and weekly awards.
- Moves, Waivers, Schedule, Franchise Files, Record Book, H2H and History roll forward cumulatively.
- Makers Weekly Collector v1.3.3 is the current collector.
- Collector mode: WEDNESDAY.
- Collector workflow: wednesday-combined.

ACTIVE WEEKLY RUNTIME
Dynamic weekly pages use the local Makers runtime:
- season-2026.js
- weekly-import.js
- makers-weekly-sync.js
- makers-engine.js
- league-analytics.js
- live.js
- makers-weekly-loader.js

The active site does not depend on the old Mis.Exp GitHub Pages path or the retired split-cadence renderer.

DEPLOYMENT
- GitHub Pages deploys automatically from the main branch.
- Do not manually upload a replacement ZIP for normal weekly maintenance.
- Each commit to main starts a Pages build.
- Confirm the latest Pages build/deployment before calling a production update complete.

NORMAL WEEKLY MAINTENANCE
- Wednesday after waivers: run the collector once, validate the snapshot, close the completed week, refresh standings/records/H2H/analytics, update rosters and transactions, rerun Power/Odds, grade the previous prediction receipt, and lock the upcoming Makers/Yahoo prediction receipt.
- Use UPDATE_GUIDE.txt and MAKERS_WEEKLY_UPDATE_CHECKLIST.md as the source of truth.
