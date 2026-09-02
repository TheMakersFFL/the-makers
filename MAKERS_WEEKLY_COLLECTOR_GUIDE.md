# The Makers — Twice-Weekly Yahoo Collector

This is a separate Tampermonkey collector for **The Makers**. It does not use Yahoo API credentials and uses its own `MAKERSFF` Tampermonkey storage namespace, separate from the Miscellaneous Expenditures collector.

## Install once

1. Open Tampermonkey and create a new userscript.
2. Replace the template with `Makers_Weekly_Collector.user.js` (the `v1.0.2` `.txt` copy is identical).
3. Save/enable it.
4. Open the **Makers** Yahoo league homepage. The collector intentionally stays hidden on unrelated Yahoo leagues unless it is already bound to the current league.
5. Click **USE COLLECTOR ON THIS LEAGUE** once. That binds the script to the Makers Yahoo league for the season.

## Tuesday / after MNF

1. Open the Makers Yahoo league.
2. Select **POST-MNF**.
3. Set **Upcoming week** to the next fantasy week. Example: after Week 1 MNF, use Week 2.
4. Click **AUTO COLLECT LEAGUE**.
5. Wait for the validation checks. The target coverage is 10 standings teams, 10 rosters, completed results for the prior week (once the season is underway), and 100 available players split QB 15 / RB 25 / WR 25 / TE 15 / K 10 / DEF 10.
6. Click **EXPORT JSON** and upload the resulting `MAKERS_YYYY_WXX_POST_MNF.json` for site import.

The Tuesday snapshot is the authoritative post-week result snapshot. It is designed to update completed scores, standings, rosters, waiver pool and the inputs used by Makers Power/Odds/War Room/H2H.

## Thursday / after waivers

1. Open the Makers Yahoo league.
2. Select **POST-WAIVERS**.
3. Keep **Upcoming week** on the week about to be played.
4. Click **AUTO COLLECT LEAGUE**.
5. Export `MAKERS_YYYY_WXX_POST_WAIVERS.json` and upload it for site import.

The Thursday snapshot preserves Tuesday's completed results and adds the post-waiver state: roster changes, FAAB balances/priorities, completed transactions, available players and upcoming Yahoo matchup projections.

## Week 1 acceptance status

The first real Yahoo DOM collection was accepted on September 2, 2026 for Yahoo league **471058 — The Makers**. Collector v1.0.2 includes the two live-DOM fixes found in that acceptance run: side-aware Yahoo matchup projection parsing and direct cleanup of Yahoo's glued `NA` player-status suffix.

For the next real cycle, run **POST-MNF** after Week 1 is final with Upcoming week = **2**, then run **POST-WAIVERS** on Thursday with Upcoming week = **2**.

## Safety / privacy

- The collector never contains a Yahoo password, OAuth token, API key or client secret.
- The raw export can contain Yahoo page text as a parser recovery aid. Do not deploy the raw export publicly.
- `tools/apply-weekly-export.py` creates the compact public snapshot and strips raw page captures/source text from `weekly-import.js` and the archived deployable snapshot.
- The site binds each season to the first accepted Yahoo league ID. An export from another Yahoo league is rejected.
- Makers and Misc.Exp use different userscript names, schemas, binding keys and Tampermonkey storage namespaces.

## Site import

From the site root:

```bash
python tools/apply-weekly-export.py /path/to/MAKERS_2026_W02_POST_MNF.json .
```

Run the same command for the Thursday file. `weekly-import.js` is rebuilt cumulatively in this order:

1. earlier weeks
2. POST-MNF
3. POST-WAIVERS

That means Thursday cannot erase Tuesday's final scores, and later weeks cannot erase earlier results.
