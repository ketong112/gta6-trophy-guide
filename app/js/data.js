// Trophy data and the guide's fixed reference tables: the roadmap stages and the
// source registry. The 55 trophies themselves live in data/trophies.json, one item
// a trophy, each with its official name, description and grade plus this atlas's
// guide, kinds, missable flag, roadmap stage and cited sources.
export const DATA_URL = 'data/trophies.json';

// Every source this atlas cites, with what it backs. Only pages that were actually
// read while writing the guides are listed; no source is invented.
export const SOURCES = [
  { id: 'exophase', label: 'Exophase — official trophy list', url: 'https://www.exophase.com/game/grand-theft-auto-vi-psn/trophies/', backs: 'Official names, descriptions, grades and PSN earn rates for all 55 trophies' },
  { id: 'psnprofiles', label: 'PSNProfiles — official trophy list', url: 'https://psnprofiles.com/trophies/43531-grand-theft-auto-vi', backs: 'Official names, descriptions, grades and the counts PSN tracks' },
  { id: 'powerpyx', label: 'PowerPyx — trophy guide & roadmap', url: 'https://www.powerpyx.com/gta-6-grand-theft-auto-vi-trophy-guide-roadmap/', backs: 'Roadmap order, the 100% Completion checklist, the one missable warning, difficulty 4/10 and ~200 hours' },
  { id: 'keengamer-guide', label: 'KeenGamer — trophy guide & platinum roadmap', url: 'https://www.keengamer.com/articles/guides/gta-6-trophy-guide-platinum-roadmap-all-55-trophies/', backs: 'Per-trophy methods and which hidden methods are still unconfirmed' },
  { id: 'keengamer-walk', label: 'KeenGamer — walkthrough: all chapters and missions', url: 'https://www.keengamer.com/articles/guides/gta-6-walkthrough-all-chapters-and-story-missions-in-order/', backs: 'Chapter and mission order behind the story trophies' },
  { id: 'gtazone', label: 'GTA Zone — trophy list', url: 'https://gta-zone.com/news/gta-6-trophies-achievements/', backs: 'Counts: 42 Shooting Range golds, 14 drone-race spots, 18 meditation spots; which stranger strands count' },
  { id: 'space4games', label: 'Space4Games — mission list', url: 'https://space4games.com/en/games-en/gta-6-all-missions-chapters-story-progress/', backs: 'Chapter mission counts and the order of the story missions' },
  { id: 'gta6map', label: 'GTA6Map — missions list', url: 'https://www.gta6map.net/wiki/gta-6/story-missions/gta-6-missions-list', backs: 'Chapter 5 mission order and the final mission, The End Of The Road' },
  { id: 'gtaspotter', label: 'GTASpotter — trophies and achievements', url: 'https://gtaspotter.com/en/guides/gta-6-trophies-and-achievements/', backs: 'Lucia-only (Andy) and Jason-only (Tyrone, Bret) stranger strands; 80 challenges in 8 groups of 10' },
  { id: 'gamesfuze', label: 'GamesFuze — trophy list', url: 'https://gamesfuze.com/gta-6-wiki/achievements/', backs: 'Which 28 trophies are hidden on PSN, and the roadmap order' },
];

// The road to the platinum in four stages, built from PowerPyx's roadmap
// (story, then the 100% checklist, then Strangers & Freaks and cleanup, then the
// platinum itself). Trophy ids follow data/trophies.json.
export const ROADMAP = [
  {
    stage: 1,
    title: 'Play the story',
    hours: '60–80 hours',
    blurb: 'Finish all five chapters — 91 missions — and enjoy the game. Every story trophy pops on its own as you play, and the 100% Completion checklist is already counting your progress in the background, even though you cannot see it until after the story. There is no mission replay, so keep separate manual saves if you want to return to an earlier mission.',
    trophyIds: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 22, 23, 24, 26, 27, 28],
  },
  {
    stage: 2,
    title: 'The 100% Completion checklist',
    hours: 'About 100 hours',
    blurb: 'After the story, open Progress > Stats > 100% Completion. The checklist is lenient — closer to 60% true completion: you need 70 of the 80 challenges, 200 of 277 vehicles scanned and 100 of 255 animals studied. Only robberies, underwater discoveries, shooting ranges, drone races and Bret’s quests demand everything. This stage earns the Gold for 100% completion, the hardest trophy in the set.',
    trophyIds: [14, 15, 17, 18, 29, 30, 32, 35, 40, 42],
  },
  {
    stage: 3,
    title: 'Strangers & Freaks and cleanup',
    hours: 'About 10 hours',
    blurb: 'Finish the eight qualifying stranger strands for the Silver, try every activity type once, and sweep up the partner, crime, money and miscellaneous trophies. Nothing here is missable: after the story the whole map stays open, so work through the list at your own pace.',
    trophyIds: [16, 19, 20, 21, 25, 31, 33, 34, 36, 37, 38, 39, 41, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55],
  },
  {
    stage: 4,
    title: 'The Platinum',
    hours: 'The moment the last one pops',
    blurb: '“Vice Got a Price!” unlocks the instant the other 54 are earned. There is nothing extra to do — the platinum is the receipt for the other three stages.',
    trophyIds: [1],
  },
];

export async function loadTrophies() {
  const response = await fetch(DATA_URL);
  if (!response.ok) throw new Error('Could not load ' + DATA_URL);
  const document = await response.json();
  return document.trophies;
}

export function gradeLabel(grade) {
  return grade.charAt(0).toUpperCase() + grade.slice(1);
}

export function kindLabel(kind) {
  const labels = { story: 'Story', missable: 'Missable', collectibles: 'Collectibles', activities: 'Activities', online: 'Online' };
  return labels[kind] ?? kind;
}

export function sourceById(id) {
  return SOURCES.find((source) => source.id === id);
}
