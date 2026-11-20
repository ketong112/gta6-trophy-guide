// Filter state and matching for the checklist. A trophy's kinds come from
// data/trophies.json; "missable" is a flag, not a kind, and "online" matches
// nothing — all 55 trophies are offline, which the empty state says outright.
export const state = {
  view: 'checklist',
  kind: 'all',
  grade: 'all',
  search: '',
  hideEarned: false,
  spoilers: true,
  sourceFilter: 'all',
  selectedId: null,
  revealed: new Set(),
};

export function isStoryTrophy(trophy) {
  return trophy.kinds.includes('story');
}

// A story trophy stays masked while spoiler-safe mode is on and it is not earned
// yet — unless the reader chose to reveal this one in the detail pane.
export function isMasked(trophy, earned) {
  if (!state.spoilers) return false;
  if (earned.has(trophy.id)) return false;
  if (state.revealed.has(trophy.id)) return false;
  return isStoryTrophy(trophy);
}

export function matchesFilters(trophy, earned) {
  if (state.kind === 'story' && !isStoryTrophy(trophy)) return false;
  if (state.kind === 'missable' && !trophy.missable) return false;
  if (state.kind === 'collectibles' && !trophy.kinds.includes('collectibles')) return false;
  if (state.kind === 'activities' && !trophy.kinds.includes('activities')) return false;
  if (state.kind === 'online') return false;
  if (state.grade !== 'all' && trophy.grade !== state.grade) return false;
  if (state.hideEarned && earned.has(trophy.id)) return false;
  if (state.search) {
    const needle = state.search.toLowerCase();
    const haystack = (trophy.name + ' ' + trophy.description + ' ' + trophy.guide).toLowerCase();
    if (!haystack.includes(needle)) return false;
  }
  return true;
}

export function emptyStateText() {
  if (state.kind === 'online') {
    return 'No online trophies — all 55 trophies in Grand Theft Auto VI are offline and single-player. Nothing to track here.';
  }
  if (state.kind === 'missable') {
    return 'Only one trophy is flagged missable. If it is earned already, this filter is empty — which is good news.';
  }
  return 'No trophies match these filters.';
}
