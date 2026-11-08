(() => {
  const labKey = document.body.dataset.lab;
  if (!labKey) return;

  const lab = window.ENGLISH_QUEST_DATA?.labs?.[labKey];
  const unitList = document.querySelector('[data-unit-list]');
  const activityPanel = document.querySelector('[data-activity-panel]');
  if (!lab || !unitList || !activityPanel) return;

  const loadProgress = () => {
    try {
      const saved = JSON.parse(localStorage.getItem('englishQuestLab.progress.v1'));
      return saved && typeof saved === 'object' ? saved : { games: {} };
    } catch {
      return { games: {} };
    }
  };

  const renderMissionGrid = (unit) => {
    const games = loadProgress().games || {};
    const missionCompleted = (activity, savedGame) => {
      if (!savedGame) return false;
      const stages = new Set(Array.isArray(savedGame.stageProgress) ? savedGame.stageProgress : []);
      if (activity.gameKey === 'writingStoryBuilder') return ['Easy', 'Medium', 'Hard'].every((stage) => stages.has(stage));
      if (activity.gameKey === 'writingCommunication') return (
        (games.whatShouldISayCommunication?.completed === true || stages.has('What Should I Say?')) &&
        games.writingCompleteDialogueOneReplyV1?.completed === true &&
        (games.writingChatWithMax?.completed === true || stages.has('Chat with Max'))
      );
      if (activity.gameKey === 'writingYourOwn') return ['My School Day', 'My Town and My Weekend', 'A Message to My English Friend'].every((stage) => stages.has(stage));
      return savedGame.completed === true;
    };
    activityPanel.classList.add('is-open', 'has-mission-grid');
    activityPanel.innerHTML = `
      <div class="activity-heading mission-heading">
        <div><p>${lab.title}</p><h2>Unit ${unit.id} · ${unit.title}</h2></div>
        <span class="unit-state">${unit.activities.length} missions</span>
      </div>
      <div class="mission-grid">${unit.activities.map((activity, index) => {
        const isAvailable = activity.status === 'available' && Boolean(activity.href);
        const savedGame = activity.gameKey ? games[activity.gameKey] : null;
        const isCompleted = missionCompleted(activity, savedGame);
        const isStarted = Boolean(savedGame && Object.keys(savedGame).length);
        const statusText = isAvailable ? (isCompleted ? 'Completed' : isStarted ? 'In Progress' : 'Not Started') : 'Coming Soon';
        const statusClass = isAvailable ? (isCompleted ? 'is-completed' : isStarted ? 'is-progress' : 'is-not-started') : 'is-coming-soon';
        const bestScore = isCompleted && Number(savedGame?.bestScore) > 0
          ? `<span class="mission-best">Best: ${Number(savedGame.bestScore)} Brain Sparks</span>`
          : '';
        const stages = Array.isArray(activity.stages) ? activity.stages : [];
        const completedStages = new Set(Array.isArray(savedGame?.stageProgress) ? savedGame.stageProgress : (isCompleted ? stages : []));
        const stageCount = completedStages.size;
        const totalStages = stages.length;
        const body = `
          <span class="mission-card-top"><span class="mission-number">Mission ${String(index + 1).padStart(2, '0')}</span><span class="mission-status ${statusClass}">${statusText}</span></span>
          <span class="mission-character"><img src="${activity.cover || activity.character || 'assets/characters/ziggy-happy.png'}" alt="${activity.type} illustration"></span>
          <span class="mission-topic">${activity.type}</span>
          <strong class="mission-title">${activity.title}</strong>
          <span class="mission-word-count">${activity.itemCount || `${activity.wordCount || 0} words`}</span>
          ${activity.description ? `<span class="mission-description">${activity.description}</span>` : ''}
          <span class="mission-stages" aria-label="Mission stages">${stages.map((stage) => `<span class="${completedStages.has(stage) ? 'is-stage-complete' : ''}"><b>${stage}</b>${activity.stageDetails?.[stage] ? `<small>${activity.stageDetails[stage]}</small>` : ''}</span>`).join('')}</span>
          <span class="mission-card-footer"><span class="mission-progress-count">${totalStages ? `${stageCount} / ${totalStages} stages` : statusText}</span>${bestScore}<span class="mission-action">${isAvailable ? (isCompleted ? 'PLAY AGAIN →' : 'PLAY →') : 'In development'}</span></span>`;

        return isAvailable
          ? `<a class="mission-card is-available${isCompleted ? ' is-mission-complete' : ' is-mission-open'}" href="${activity.href}" data-game-key="${activity.gameKey || ''}" data-mission-launch aria-label="${isCompleted ? 'Play again' : 'Play'} ${activity.title}">${body}</a>`
          : `<article class="mission-card is-locked" aria-label="${activity.title}: Coming Soon">${body}</article>`;
      }).join('')}</div>`;
    activityPanel.querySelectorAll('[data-mission-launch]').forEach((link) => {
      link.addEventListener('click', (event) => {
        if (event.defaultPrevented || event.button > 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        window.location.assign(link.href);
      });
    });
  };

  const renderActivityPanel = (unit) => {
    if (lab.activityLayout === 'missions') {
      renderMissionGrid(unit);
      return;
    }

    const availableActivities = unit.activities.filter((activity) => activity.status === 'available');
    activityPanel.classList.add('is-open');

    if (availableActivities.length === 0) {
      activityPanel.innerHTML = `
        <div class="activity-heading">
          <div><p>${lab.title}</p><h2>Unit ${unit.id} · ${unit.title}</h2></div>
          <span class="unit-state">Open</span>
        </div>
        <div class="empty-state">
          <span aria-hidden="true">◇</span>
          <div><h3>No activities available yet</h3><p>${lab.emptyMessage}</p></div>
        </div>`;
      return;
    }

    activityPanel.innerHTML = `
      <div class="activity-heading"><div><p>${lab.title}</p><h2>Unit ${unit.id} · ${unit.title}</h2></div></div>
      <div class="activity-list">${availableActivities.map((activity) => `
        <a class="activity-card" href="${activity.href}"><span>${activity.type}</span><strong>${activity.title}</strong><span aria-hidden="true">→</span></a>
      `).join('')}</div>`;
  };

  const selectUnit = (unitId, updateUrl = true) => {
    const unit = lab.units.find((item) => item.id === unitId && item.status === 'available');
    if (!unit) return;

    document.querySelectorAll('.unit-card').forEach((button) => {
      const selected = Number(button.dataset.unitId) === unitId;
      button.classList.toggle('is-selected', selected);
      button.setAttribute('aria-pressed', String(selected));
    });

    renderActivityPanel(unit);
    if (updateUrl) history.replaceState(null, '', `${location.pathname}?unit=${unitId}#activity-panel`);
    activityPanel.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  };

  lab.units.forEach((unit) => {
    const button = document.createElement('button');
    const available = unit.status === 'available';
    button.type = 'button';
    button.className = `unit-card${available ? '' : ' is-locked'}`;
    button.dataset.unitId = String(unit.id);
    button.disabled = !available;
    button.setAttribute('aria-pressed', 'false');
    button.innerHTML = `
      <span class="unit-index">${unit.id}</span>
      <span><small>Unit ${unit.id}</small><strong>${unit.title}</strong></span>
      <span class="unit-action" aria-hidden="true">${available ? '→' : 'Soon'}</span>`;
    if (available) button.addEventListener('click', () => selectUnit(unit.id));
    unitList.append(button);
  });

  activityPanel.innerHTML = '<div class="panel-prompt"><span aria-hidden="true">↑</span><p>Choose an available unit to view its activities.</p></div>';

  const requestedUnit = Number.parseInt(new URLSearchParams(location.search).get('unit'), 10);
  if (Number.isInteger(requestedUnit)) selectUnit(requestedUnit, false);

  document.querySelector('[data-back]')?.addEventListener('click', (event) => {
    if (document.referrer && new URL(document.referrer).origin === location.origin && history.length > 1) {
      event.preventDefault();
      history.back();
    }
  });
})();
