// Rendering: the checklist, the detail pane, the roadmap, the missables page and
// the source matrix. All views read the same trophy list and earned set, so a tick
// in one view is a tick everywhere.
import { ROADMAP, SOURCES, gradeLabel, kindLabel, sourceById } from './data.js';
import { isMasked, isStoryTrophy, matchesFilters, emptyStateText, state } from './filters.js';

const METHOD_LABEL = {
  confirmed: 'Method confirmed in public guides',
  partial: 'Method partly confirmed — some steps still being checked',
  unconfirmed: 'Method not yet confirmed in public guides',
};

function gradeDot(grade) {
  return `<span class="gradeDot ${grade}" title="${gradeLabel(grade)}"></span>`;
}

function trophyChip(trophy, earned) {
  const masked = isMasked(trophy, earned);
  const label = masked ? 'Hidden story trophy' : trophy.name;
  return `<button type="button" data-open="${trophy.id}" class="${earned.has(trophy.id) ? 'done' : ''}">${gradeDot(trophy.grade)}${escapeHtml(label)}</button>`;
}

function escapeHtml(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function renderProgress(trophies, earned) {
  document.getElementById('earnedCount').textContent = earned.size;
  const percent = Math.round((earned.size / trophies.length) * 100);
  document.getElementById('progressBar').style.width = percent + '%';
  document.getElementById('progressText').textContent =
    earned.size === trophies.length
      ? 'Platinum earned — you are a Leonida Legend.'
      : `${percent}% to the Platinum — ${trophies.length - earned.size} to go`;
  const chips = document.getElementById('gradeChips');
  chips.innerHTML = ['platinum', 'gold', 'silver', 'bronze']
    .map((grade) => {
      const total = trophies.filter((t) => t.grade === grade).length;
      const got = trophies.filter((t) => t.grade === grade && earned.has(t.id)).length;
      return `<span class="gradeChip">${gradeDot(grade)}${gradeLabel(grade)} ${got}/${total}</span>`;
    })
    .join('');
}

export function renderChecklist(trophies, earned, onToggle, onSelect) {
  const list = document.getElementById('trophyList');
  const visible = trophies.filter((t) => matchesFilters(t, earned));
  document.getElementById('listCount').textContent =
    `Showing ${visible.length} of ${trophies.length} trophies` +
    (state.kind === 'online' ? ' — every trophy in this game is offline.' : '');
  document.getElementById('emptyState').hidden = visible.length > 0;
  document.getElementById('emptyState').textContent = emptyStateText();
  list.replaceChildren();
  for (const trophy of visible) {
    const li = document.createElement('li');
    if (earned.has(trophy.id)) li.classList.add('earned');
    if (state.selectedId === trophy.id) li.classList.add('selected');
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = earned.has(trophy.id);
    box.setAttribute('aria-label', 'Mark ' + trophy.name + ' earned');
    box.addEventListener('change', () => onToggle(trophy.id));
    li.append(box);
    const body = document.createElement('div');
    const masked = isMasked(trophy, earned);
    const name = document.createElement('div');
    name.className = 'tname';
    name.innerHTML = masked
      ? '<span class="spoilerMask">Hidden story trophy — earn it to reveal</span>'
      : escapeHtml(trophy.name) + (trophy.hidden ? '<span class="hiddenTag">Hidden on PSN</span>' : '');
    const desc = document.createElement('div');
    desc.className = 'tdesc';
    desc.textContent = masked ? 'Its name and description stay hidden while spoiler-safe mode is on.' : trophy.description;
    const meta = document.createElement('div');
    meta.className = 'tmeta';
    meta.innerHTML =
      `<span class="gradeLabel">${gradeDot(trophy.grade)}${gradeLabel(trophy.grade)}</span>` +
      trophy.kinds.map((k) => `<span class="badge">${kindLabel(k)}</span>`).join('') +
      (trophy.missable ? '<span class="badge missable">Missable</span>' : '') +
      (trophy.target ? `<span class="badge">${escapeHtml(trophy.target)} needed</span>` : '');
    body.append(name, desc, meta);
    li.append(body);
    const grade = document.createElement('span');
    grade.className = 'gradeLabel';
    grade.textContent = '#' + trophy.id;
    li.append(grade);
    li.addEventListener('click', (event) => {
      if (event.target === box) return;
      onSelect(trophy.id);
    });
    list.append(li);
  }
}

export function renderDetail(trophies, earned, onReveal, onSelectFromDetail) {
  const pane = document.getElementById('detailPane');
  const trophy = trophies.find((t) => t.id === state.selectedId) ?? null;
  if (!trophy) {
    pane.innerHTML = '<p class="placeholder">Select a trophy on the left to read its guide and sources.</p>';
    return;
  }
  if (isMasked(trophy, earned)) {
    pane.innerHTML =
      `<p class="officialLabel">Official trophy — hidden</p>` +
      `<h2>Hidden story trophy</h2>` +
      `<p class="official">Spoiler-safe mode hides this trophy's name and description until you earn it.</p>` +
      `<p><button type="button" id="revealBtn">Show this trophy anyway</button></p>` +
      `<p class="placeholder">Turn spoiler-safe mode off in the toolbar to reveal every story trophy at once.</p>`;
    document.getElementById('revealBtn').addEventListener('click', () => onReveal(trophy.id));
    return;
  }
  const guideHtml = trophy.guide
    .split('\n')
    .filter((p) => p.trim().length > 0)
    .map((p) => `<p class="guide">${escapeHtml(p)}</p>`)
    .join('');
  const sourcesHtml = trophy.sources
    .map((s) => {
      const known = sourceById(s.id);
      const label = known ? known.label : s.label;
      return `<li><a href="${s.url}" target="_blank" rel="noopener">${escapeHtml(label)}</a></li>`;
    })
    .join('');
  pane.innerHTML =
    `<p class="officialLabel">Official trophy</p>` +
    `<h2>${escapeHtml(trophy.name)}</h2>` +
    `<p class="official">${escapeHtml(trophy.description)}</p>` +
    `<div class="facts">` +
    `<span class="gradeLabel">${gradeDot(trophy.grade)}${gradeLabel(trophy.grade)}</span>` +
    (trophy.hidden ? '<span class="badge">Hidden on PSN</span>' : '') +
    trophy.kinds.map((k) => `<span class="badge">${kindLabel(k)}</span>`).join('') +
    (trophy.missable ? '<span class="badge missable">Missable</span>' : '') +
    (trophy.target ? `<span class="badge">${escapeHtml(trophy.target)} needed</span>` : '') +
    `<span class="badge">${METHOD_LABEL[trophy.method] ?? ''}</span>` +
    `</div>` +
    (trophy.missable
      ? `<p class="warn"><strong>Missable — read this first.</strong> ${escapeHtml(trophy.missableNote ?? '')}</p>`
      : '') +
    `<p class="guideLabel">Guide — our words, sources below</p>` +
    guideHtml +
    `<ul class="sources"><li><span class="srcLabel">Sources for this guide</span></li>${sourcesHtml}</ul>` +
    `<p class="placeholder">Roadmap stage ${trophy.roadmap} of 4 — see the Roadmap tab for where this trophy sits on the way to the platinum.</p>`;
  void onSelectFromDetail;
}

export function renderRoadmap(trophies, earned, onOpen) {
  const pane = document.getElementById('roadmapPane');
  const byId = new Map(trophies.map((t) => [t.id, t]));
  const ordered = ROADMAP.flatMap((stage) => stage.trophyIds);
  const next = ordered.map((id) => byId.get(id)).find((t) => t && !earned.has(t.id));
  let html = '<h2 class="sectionTitle">Roadmap to the Platinum</h2>';
  html += '<p class="paneIntro">Four stages, about 200 hours in all (PowerPyx rates the set 4/10). The story first, then the 100% checklist, then the stranger strands and cleanup — and the platinum pops on its own at the end. Trophies already earned are struck through.</p>';
  if (next) {
    html += `<div class="callout"><h2>Next up: ${isMasked(next, earned) ? 'a hidden story trophy' : escapeHtml(next.name)}</h2><p>${isMasked(next, earned) ? 'Keep playing the story — the next trophy on the road is a hidden story trophy.' : escapeHtml(next.description)}</p><p><button type="button" data-open="${next.id}">Open it in the checklist</button></p></div>`;
  } else {
    html += '<div class="callout safe"><h2>Every trophy earned.</h2><p>“Vice Got a Price!” should already be yours. Congratulations — you are a Leonida Legend.</p></div>';
  }
  for (const stage of ROADMAP) {
    const stageTrophies = stage.trophyIds.map((id) => byId.get(id)).filter(Boolean);
    const got = stageTrophies.filter((t) => earned.has(t.id)).length;
    html += `<section class="stage"><h2>Stage ${stage.stage} — ${escapeHtml(stage.title)}</h2>` +
      `<p class="hours">${escapeHtml(stage.hours)}</p><p>${escapeHtml(stage.blurb)}</p>` +
      `<div class="trophies">${stageTrophies.map((t) => trophyChip(t, earned)).join('')}</div>` +
      `<p class="stageCount">${got} of ${stageTrophies.length} earned in this stage.</p></section>`;
  }
  pane.innerHTML = html;
  pane.querySelectorAll('[data-open]').forEach((button) => {
    button.addEventListener('click', () => onOpen(Number(button.dataset.open)));
  });
}

export function renderMissables(trophies, earned, onOpen) {
  const pane = document.getElementById('missablesPane');
  const missable = trophies.filter((t) => t.missable);
  const story = trophies.filter((t) => isStoryTrophy(t));
  let html = '<h2 class="sectionTitle">Missables</h2>';
  html += '<p class="paneIntro">Built from the official descriptions and PowerPyx’s roadmap: exactly one trophy can be missed. Everything else either pops when its mission is completed — and the story cannot be finished without those missions — or stays available in free roam after the story, because there is no point of no return for side content.</p>';
  for (const trophy of missable) {
    html += `<div class="callout"><h2>${gradeDot(trophy.grade)}${escapeHtml(trophy.name)} — potentially missable</h2>` +
      `<p>${escapeHtml(trophy.description)}</p>` +
      `<p>${escapeHtml(trophy.missableNote ?? '')}</p>` +
      `<p><button type="button" data-open="${trophy.id}">Read the full guide</button></p></div>`;
  }
  html += '<div class="callout safe"><h2>Everything else is safe.</h2><p>After the story you return to the open world and the 100% Completion checklist opens under Progress &gt; Stats. Progress you made during the story already counts toward it, and nothing on it is missable. Cheats are the only thing that can lock you out: any cheat disables trophies and saving, so leave cheats off until the platinum pops.</p></div>';
  html += `<h2 class="sectionTitle">Story trophies — unmissable by design</h2><p class="paneIntro">These ${story.length} trophies unlock when their missions are completed. You cannot reach the ending without completing them.</p>`;
  html += `<div class="trophies" style="display:flex;flex-wrap:wrap;gap:6px;">${story.map((t) => trophyChip(t, earned)).join('')}</div>`;
  pane.innerHTML = html;
  pane.querySelectorAll('[data-open]').forEach((button) => {
    button.addEventListener('click', () => onOpen(Number(button.dataset.open)));
  });
}

export function renderSources(trophies, earned) {
  const pane = document.getElementById('sourcesPane');
  const citing = (id) => trophies.filter((t) => t.sources.some((s) => s.id === id));
  const citedOnce = trophies.filter((t) => t.sources.length > 0).length;
  const citedTwice = trophies.filter((t) => t.sources.length >= 2).length;
  const citedThrice = trophies.filter((t) => t.sources.length >= 3).length;
  let html = '<h2 class="sectionTitle">Source Matrix</h2>';
  html += `<p class="paneIntro">The twist this atlas is built on: every guide names where its facts come from, and this page shows the whole map at a glance. ${citedOnce} of ${trophies.length} trophies cite at least one source, ${citedTwice} cite two or more, ${citedThrice} cite three or more. The official names, descriptions and grades come from Exophase and PSNProfiles, which agree on all 55; the methods and the roadmap come from the published guides below. Pick a source to see every trophy that cites it.</p>`;
  html += `<div class="srcFilterRow"><button type="button" data-src="all" class="${state.sourceFilter === 'all' ? 'active' : ''}">All sources</button>` +
    SOURCES.map((s) => `<button type="button" data-src="${s.id}" class="${state.sourceFilter === s.id ? 'active' : ''}">${escapeHtml(s.label.split(' — ')[0])}</button>`).join('') + '</div>';
  html += '<table class="matrix"><thead><tr><th>Source</th><th>Backs what</th><th style="text-align:right">Trophies</th></tr></thead><tbody>';
  for (const source of SOURCES) {
    const count = citing(source.id).length;
    html += `<tr><td><a href="${source.url}" target="_blank" rel="noopener">${escapeHtml(source.label)}</a></td><td>${escapeHtml(source.backs)}</td><td class="num">${count} of 55</td></tr>`;
  }
  html += '</tbody></table>';
  if (state.sourceFilter !== 'all') {
    const source = sourceById(state.sourceFilter);
    const list = citing(state.sourceFilter);
    html += `<h2 class="sectionTitle" style="margin-top:18px;">Cited by ${escapeHtml(source.label)}</h2>`;
    html += `<div class="trophies" style="display:flex;flex-wrap:wrap;gap:6px;">${list.map((t) => trophyChip(t, earned)).join('') || '<p class="paneIntro">No trophy cites this source.</p>'}</div>`;
  }
  pane.innerHTML = html;
  pane.querySelectorAll('[data-src]').forEach((button) => {
    button.addEventListener('click', () => {
      state.sourceFilter = button.dataset.src;
      renderSources(trophies, earned);
    });
  });
  pane.querySelectorAll('[data-open]').forEach((button) => {
    button.addEventListener('click', () => {
      const id = Number(button.dataset.open);
      state.view = 'checklist';
      state.selectedId = id;
      document.dispatchEvent(new CustomEvent('atlas:open-trophy', { detail: id }));
    });
  });
}
