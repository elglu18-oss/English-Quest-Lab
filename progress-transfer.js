(() => {
  'use strict';
  const tools = window.ENGLISH_QUEST_PROGRESS_DATA;
  if (!tools) return;
  const escape = value => String(value ?? '').replace(/[&<>'"]/g, character => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' }[character]));
  const summary = value => `<ul><li><b>Brain Sparks:</b> ${value.brainSparks}</li><li><b>Home Helper:</b> ${value.householdStages} / 4 stages</li><li><b>Personality Power:</b> ${value.personalityStages} / 4 stages</li><li><b>Final Challenge:</b> ${value.finalCompleted ? `completed · ${value.finalAttempts} saved attempt${value.finalAttempts === 1 ? '' : 's'}` : 'not completed'}</li><li><b>Certificate name:</b> ${value.studentName ? escape(value.studentName) : 'not saved'}</li></ul>`;
  const closeModal = modal => { modal.remove(); document.body.classList.remove('progress-transfer-open'); };
  const showConfirmation = (prepared, status) => {
    const modal = document.createElement('div');
    modal.className = 'progress-transfer-overlay';
    modal.innerHTML = `<section class="progress-transfer-dialog" role="dialog" aria-modal="true" aria-labelledby="progress-transfer-title"><h2 id="progress-transfer-title">Import this progress?</h2><p class="progress-transfer-lead">Check the saved results before replacing progress on this address.</p><div class="progress-transfer-compare"><article><h3>Progress from the file</h3>${summary(prepared.imported)}</article><article><h3>Current progress here</h3>${summary(prepared.current)}</article></div><p class="progress-transfer-safety"><b>Your current progress will be downloaded as a backup first.</b> Nothing changes until you press CONFIRM IMPORT.</p><div class="progress-transfer-dialog-actions"><button type="button" data-transfer-cancel>CANCEL</button><button type="button" data-transfer-confirm>CONFIRM IMPORT</button></div></section>`;
    document.body.append(modal); document.body.classList.add('progress-transfer-open');
    modal.querySelector('[data-transfer-cancel]').addEventListener('click', () => closeModal(modal));
    modal.addEventListener('click', event => { if (event.target === modal) closeModal(modal); });
    modal.querySelector('[data-transfer-confirm]').addEventListener('click', () => {
      const button = modal.querySelector('[data-transfer-confirm]'); button.disabled = true;
      try {
        tools.applyTransferImport(prepared);
        status.textContent = 'Progress imported. Your previous localhost progress was downloaded as a backup. Reloading…';
        closeModal(modal); setTimeout(() => location.reload(), 700);
      } catch (error) {
        button.disabled = false;
        modal.querySelector('.progress-transfer-safety').textContent = `Nothing was changed: ${error.message}`;
      }
    });
  };
  document.querySelectorAll('[data-progress-transfer]').forEach(container => {
    container.innerHTML = `<div class="progress-transfer-copy"><strong>Move saved progress</strong><span>Use a JSON file to move results from file:// to localhost.</span></div><div class="progress-transfer-actions"><button type="button" data-nav-plain data-transfer-export>EXPORT PROGRESS</button><label>IMPORT PROGRESS<input type="file" accept="application/json,.json" data-transfer-import></label></div><small data-transfer-status aria-live="polite"></small>`;
    const status = container.querySelector('[data-transfer-status]');
    container.querySelector('[data-transfer-export]').addEventListener('click', () => {
      try { tools.exportTransfer(); status.textContent = 'Progress file downloaded. Open localhost and use IMPORT PROGRESS.'; }
      catch { status.textContent = 'The progress file could not be downloaded. Please try again.'; }
    });
    container.querySelector('[data-transfer-import]').addEventListener('change', async event => {
      const file = event.target.files?.[0]; if (!file) return;
      try { showConfirmation(tools.prepareTransferImport(JSON.parse(await file.text())), status); }
      catch (error) { status.textContent = `Import stopped safely: ${error.message}`; }
      finally { event.target.value = ''; }
    });
  });
})();
