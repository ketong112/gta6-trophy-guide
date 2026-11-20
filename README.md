# Leonida Trophy Atlas — GTA VI Trophy Guide & Tracker

[![GTA 6 Trophy Guide bounty](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![Rank](https://make.fun/badge/gta6-trophy-guide-01/ketong112/gta6-trophy-guide/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![Reward](https://make.fun/badge/gta6-trophy-guide-01/ketong112/gta6-trophy-guide/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01)

An offline guide and tracker for all **55 Grand Theft Auto VI trophies** on PlayStation 5 — built for the [make.fun GTA 6 trophy guide bounty](https://make.fun/bounty/gta6-trophy-guide-01).

## What it does

- **Every trophy, official and complete:** all 55 names, descriptions and grades exactly as PlayStation publishes them (1 Platinum, 2 Gold, 6 Silver, 46 Bronze; 28 hidden on PSN; 0 online), each with a guide written for this atlas that **cites its sources**.
- **Tracker:** a checklist saved in the browser (localStorage), with export to a file and import back. Progress is never sent anywhere.
- **Filters:** by kind (story, missable, collectibles, activities, online), by grade, by search text, and hide-earned.
- **Spoiler-safe mode:** hides the names and descriptions of story trophies until they are earned (on by default; an earned trophy always reveals itself, and any single trophy can be revealed on request).
- **Roadmap to the Platinum:** four stages — play the story (60–80 hours), the 100% Completion checklist (~100 hours), Strangers & Freaks and cleanup (~10 hours), then the platinum itself — with a "Next up" planner that points at the first unearned trophy on the road.
- **Missables:** exactly one trophy can be missed — Positive Mental Attitude, whose first meditation in Chapter 1 is reported gone after that chapter. The page says so plainly, with the warning, and audits why the other 54 are safe.
- **Source Matrix (the twist):** a filterable table of every source this atlas cites, what each one backs, and how many trophies cite it. All 55 trophies cite at least one source, and all 55 cite three or more. Where a method has not been confirmed in a published guide yet (5 trophies), the guide says so instead of guessing.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080. The guide is plain static files under `app/` — any static server works, and it runs with the network off. No build step, no dependencies.

## How it is built

- `app/index.html` — the page: header with progress, view tabs, filter toolbar, checklist + detail pane.
- `app/style.css` — a dark Vice-night look of its own (no Rockstar art, no web fonts).
- `app/js/main.js` — boot and wiring; `app/js/data.js` — the roadmap stages and the source registry; `app/js/store.js` — saved progress, export and import; `app/js/filters.js` — filter state and the spoiler rule; `app/js/views.js` — the checklist, detail pane, roadmap, missables and source matrix.
- `app/data/trophies.json` — the 55 trophies: official name, description and grade, hidden flag, kinds, missable flag, roadmap stage, target count, method confidence, guide and cited sources.
- `main.ts` — the entry program: copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the vendored make.fun library. Run it with `mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts`.
- `screenshots/` — four real renders of the guide in a browser.

## Sources

The official list: [Exophase](https://www.exophase.com/game/grand-theft-auto-vi-psn/trophies/) and [PSNProfiles](https://psnprofiles.com/trophies/43531-grand-theft-auto-vi). Roadmap and methods: [PowerPyx](https://www.powerpyx.com/gta-6-grand-theft-auto-vi-trophy-guide-roadmap/), [KeenGamer](https://www.keengamer.com/articles/guides/gta-6-trophy-guide-platinum-roadmap-all-55-trophies/), [GTA Zone](https://gta-zone.com/news/gta-6-trophies-achievements/), [GamesFuze](https://gamesfuze.com/gta-6-wiki/achievements/). Chapter and mission order: [KeenGamer walkthrough](https://www.keengamer.com/articles/guides/gta-6-walkthrough-all-chapters-and-story-missions-in-order/), [Space4Games](https://space4games.com/en/games-en/gta-6-all-missions-chapters-story-progress/), [GTA6Map](https://www.gta6map.net/wiki/gta-6/story-missions/gta-6-missions-list), [GTASpotter](https://gtaspotter.com/en/guides/gta-6-trophies-and-achievements/). Every trophy's guide names its sources beside it, in the app and in `app/data/trophies.json`.

## License

MIT — see [LICENSE](LICENSE). This guide is independent and not affiliated with Rockstar Games, Take-Two Interactive or PlayStation. It shows no Rockstar logo or official artwork.
