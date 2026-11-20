// Boot: load the trophy list, restore saved progress, wire every control, render.
// One render function redraws the active view; ticks, filters and the spoiler
// setting all flow through it, so every view always agrees about progress.
import { loadTrophies } from './data.js';
import { loadEarned, saveEarned, toggleEarned, exportProgress, parseProgressFile } from './store.js';
import { state } from './filters.js';
import { renderProgress, renderChecklist, renderDetail, renderRoadmap, renderMissables, renderSources } from './views.js';

const trophies = await loadTrophies();
let earned = loadEarned();

// Open on the one trophy every reader must see first: the only missable one.
if (state.selectedId === null) state.selectedId = 28;

function renderAll() {
  renderProgress(trophies, earned);
  for (const view of ['checklist', 'roadmap', 'missables', 'sources']) {
    document.getElementById(view + 'Pane').hidden = state.view !== view;
  }
  document.getElementById('toolbar').style.display = state.view === 'checklist' ? '' : 'none';
  document.querySelectorAll('#viewTabs button').forEach((button) => {
    const active = button.dataset.view === state.view;
    button.classList.toggle('active', active);
    button.setAttribute('aria-selected', String(active));
  });
  if (state.view === 'checklist') {
    renderChecklist(trophies, earned, onToggle, onSelect);
    renderDetail(trophies, earned, onReveal);
  }
  if (state.view === 'roadmap') renderRoadmap(trophies, earned, openTrophy);
  if (state.view === 'missables') renderMissables(trophies, earned, openTrophy);
  if (state.view === 'sources') renderSources(trophies, earned);
}

function onToggle(id) {
  earned = toggleEarned(earned, id);
  renderAll();
}

function onSelect(id) {
  state.selectedId = id;
  renderAll();
}

function onReveal(id) {
  state.revealed.add(id);
  renderDetail(trophies, earned, onReveal);
}

function openTrophy(id) {
  state.view = 'checklist';
  state.selectedId = id;
  renderAll();
  document.getElementById('detailPane').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

document.addEventListener('atlas:open-trophy', (event) => openTrophy(event.detail));

document.querySelectorAll('#viewTabs button').forEach((button) => {
  button.addEventListener('click', () => {
    state.view = button.dataset.view;
    renderAll();
  });
});

document.querySelectorAll('#kindFilters button').forEach((button) => {
  button.addEventListener('click', () => {
    state.kind = button.dataset.kind;
    document.querySelectorAll('#kindFilters button').forEach((b) => b.classList.toggle('active', b === button));
    renderChecklist(trophies, earned, onToggle, onSelect);
  });
});

document.getElementById('gradeFilter').addEventListener('change', (event) => {
  state.grade = event.target.value;
  renderChecklist(trophies, earned, onToggle, onSelect);
});

document.getElementById('search').addEventListener('input', (event) => {
  state.search = event.target.value;
  renderChecklist(trophies, earned, onToggle, onSelect);
});

document.getElementById('hideEarned').addEventListener('change', (event) => {
  state.hideEarned = event.target.checked;
  renderChecklist(trophies, earned, onToggle, onSelect);
});

document.getElementById('spoilerToggle').addEventListener('change', (event) => {
  state.spoilers = event.target.checked;
  renderAll();
});

document.getElementById('exportBtn').addEventListener('click', () => exportProgress(earned));

document.getElementById('importFile').addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  try {
    earned = parseProgressFile(await file.text());
    saveEarned(earned);
    renderAll();
  } catch {
    alert('That file is not a trophy progress export from this atlas.');
  }
  event.target.value = '';
});

document.getElementById('resetBtn').addEventListener('click', () => {
  if (!confirm('Clear every earned tick? This cannot be undone.')) return;
  earned = new Set();
  state.revealed.clear();
  saveEarned(earned);
  renderAll();
});

renderAll();
