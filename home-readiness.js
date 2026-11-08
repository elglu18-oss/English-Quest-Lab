(() => {
  'use strict';
  const result = window.Unit0Readiness.evaluate();
  const names = ['grammar', 'vocabulary', 'writing'];
  document.querySelectorAll('.lab-card').forEach((card, index) => {
    const lab = result.labs[names[index]];
    if (!lab) return;
    const panel = document.createElement('div');
    panel.className = `lab-readiness ${lab.passed ? 'is-ready' : ''}`;
    const completionBlocks = lab.blocks || [];
    const scoreBlocks = lab.scored || lab.blocks || [];
    const completedCount = completionBlocks.filter(block => block.completed ?? block.done).length;
    const confirmedCount = scoreBlocks.filter(block => block.verified).length;
    const unverified = scoreBlocks.filter(block => !block.verified).map(block => block.title);
    const communication = Array.isArray(lab.communication) ? `<div class="communication-readiness"><b>Communication</b>${lab.communication.map(block => `<span class="${block.verified ? 'is-confirmed' : block.done ? 'needs-confirmation' : ''}"><i>${block.title}</i><em>${block.verified ? `${block.correct} / ${block.total} confirmed` : block.done ? 'Result needs confirmation' : 'Not complete'}</em></span>`).join('')}</div>` : '';
    panel.innerHTML = `<div><strong>${lab.percentage === null ? 'Not yet verified' : `${lab.percentage}%`}</strong><span>${completedCount} / ${completionBlocks.length} required blocks complete</span></div><span class="confirmed-count">${confirmedCount} / ${scoreBlocks.length} results confirmed${lab.verified ? ` · ${lab.correct} / ${lab.total} correct` : ''}</span><div class="readiness-track"><i style="width:${lab.percentage ?? 0}%"></i></div><small>${lab.passed ? 'Ready for Final Quest' : unverified.length ? `Confirm: ${unverified.join(', ')}` : lab.complete ? 'Confirmed result must reach 70%' : 'Confirmed result saved · finish the remaining blocks'}</small>${communication}`;
    card.append(panel);
  });
  const entry = document.querySelector('.final-quest-entry');
  const link = entry?.querySelector('[data-final-action]');
  const note = entry?.querySelector('[data-final-note]');
  const requirements = entry?.querySelector('[data-final-requirements]');
  if (!entry || !link || !note || !requirements) return;
  entry.classList.toggle('is-unlocked', result.unlocked);
  if (result.unlocked) {
    note.textContent = 'Final Quest Unlocked!';
    note.classList.add('is-unlocked');
    requirements.hidden = true;
    link.classList.remove('is-locked');
    link.removeAttribute('aria-disabled');
    link.innerHTML = 'Open Final Quest <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  } else {
    note.textContent = 'Complete all three Labs with at least 70% in each to unlock.';
    note.classList.remove('is-unlocked');
    requirements.hidden = false;
    link.classList.add('is-locked');
    link.setAttribute('aria-disabled', 'true');
    link.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg><span>Locked</span>';
    link.addEventListener('click', event => event.preventDefault());
  }

  const dataTools = window.ENGLISH_QUEST_PROGRESS_DATA;
  const status = document.querySelector('[data-progress-data-status]');
  const report = message => { if (status) status.textContent = message; };
  document.querySelector('[data-progress-export]')?.addEventListener('click', () => {
    try { dataTools.exportProgress(); report('Backup downloaded.'); }
    catch (error) { report(`Export failed: ${error.message}`); }
  });
  document.querySelector('[data-progress-migrate]')?.addEventListener('click', () => {
    try {
      const result = dataTools.migrateStoredProgress();
      report(result.changed ? 'Backup downloaded and migration completed. Reloading…' : 'Migration was already applied. No data changed.');
      if (result.changed) location.reload();
    } catch (error) { report(`Migration stopped without changing progress: ${error.message}`); }
  });
  document.querySelector('[data-progress-import]')?.addEventListener('change', async event => {
    const file = event.target.files?.[0]; if (!file) return;
    try {
      dataTools.restoreProgress(JSON.parse(await file.text()));
      report('Backup restored. Reloading…'); location.reload();
    } catch (error) { report(`Restore failed without changing progress: ${error.message}`); }
  });
})();
