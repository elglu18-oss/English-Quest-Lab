(() => {
  'use strict';

  const STORAGE_KEY = 'englishQuestLab.progress.v1';
  const LABS = {
    grammar: {
      title: 'Grammar',
      hub: 'grammar.html?unit=0#activity-panel',
      character: 'assets/characters/lexi-happy.png.png',
      characterAlt: 'Lexi celebrating',
      missions: [
        { key: 'grammarGlitchPresentSimple', title: 'Grammar Glitch!', href: 'grammar-glitch.html' },
        { key: 'supermarketMysteryThereIsAre', title: 'Supermarket Mystery!', href: 'supermarket-mystery.html' },
        { key: 'quantityQuestHowMuchMany', title: 'Quantity Quest!', href: 'quantity-quest.html' }
      ]
    }
  };

  const loadGames = () => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}').games || {}; }
    catch { return {}; }
  };
  const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (character) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' }[character]));
  const nextIncomplete = (missions, currentKey, games) => {
    const currentIndex = missions.findIndex((mission) => mission.key === currentKey);
    const ordered = [...missions.slice(currentIndex + 1), ...missions.slice(0, Math.max(0, currentIndex))];
    return ordered.find((mission) => games[mission.key]?.completed !== true) || null;
  };

  const render = (container) => {
    const lab = LABS[container.dataset.completionLab];
    if (!lab) return;
    const currentKey = container.dataset.currentMission;
    const games = loadGames();
    const allComplete = lab.missions.every((mission) => games[mission.key]?.completed === true);
    const next = nextIncomplete(lab.missions, currentKey, games);
    const heading = allComplete ? `All ${lab.title} Missions Complete!` : 'Mission Complete!';
    const message = allComplete
      ? 'Fantastic work! Every Grammar Lab mission is complete.'
      : 'Great job! Ready for your next mission?';
    const primary = !allComplete && next
      ? `<a class="mission-next-action" href="${next.href}">Next Mission → <span>${escapeHtml(next.title)}</span></a>`
      : '';
    const replayPicker = allComplete
      ? `<button class="mission-another-action" type="button" data-play-another aria-expanded="false">Play Another Mission</button>`
      : '';
    const replayList = allComplete
      ? `<div class="mission-replay-list" data-replay-list hidden><p>Choose any Grammar mission to play again:</p>${lab.missions.map((mission) => `<a href="${mission.href}"><span>Completed</span><strong>${escapeHtml(mission.title)}</strong><b>PLAY AGAIN →</b></a>`).join('')}</div>`
      : '';
    container.className = `mission-completion-nav${allComplete ? ' is-all-complete' : ''}`;
    container.innerHTML = `<div class="mission-completion-copy"><img src="${lab.character}" alt="${lab.characterAlt}"><div><h3>${heading}</h3><p>${message}</p></div></div><div class="mission-completion-actions">${primary}<a class="mission-back-action" data-nav-enhanced="back" href="${lab.hub}">Back to Grammar Lab</a>${replayPicker}${allComplete ? '' : '<a class="mission-home-action" href="index.html">Home</a>'}</div>${replayList}`;
    const playAnother = container.querySelector('[data-play-another]');
    const list = container.querySelector('[data-replay-list]');
    if (playAnother && list) playAnother.addEventListener('click', () => {
      list.hidden = !list.hidden;
      playAnother.setAttribute('aria-expanded', String(!list.hidden));
      if (!list.hidden) list.querySelector('a')?.focus({ preventScroll: true });
    });
  };

  const renderAll = () => document.querySelectorAll('[data-completion-lab]').forEach(render);
  if (!document.querySelector('link[href="mission-completion.css"]')) {
    const link = document.createElement('link'); link.rel = 'stylesheet'; link.href = 'mission-completion.css'; document.head.append(link);
  }
  window.ENGLISH_QUEST_COMPLETION = { renderAll };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', renderAll, { once: true });
  else renderAll();
})();
