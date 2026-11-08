(() => {
  'use strict';

  const MEMORY_DURATION_MS = 5000;
  let activeBuilder = null;

  const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[character]));

  const createModel = (answer) => {
    const words = String(answer).trim().split(/\s+/).map((word) => Array.from(word));
    const letters = words.flat().map((letter, index) => ({ id: `letter-${index}`, letter }));
    return { words, letters, answer: words.map((word) => word.join('')).join(' ') };
  };

  const shuffle = (items) => {
    const result = [...items];
    for (let index = result.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [result[index], result[randomIndex]] = [result[randomIndex], result[index]];
    }
    return result;
  };

  const shuffledDifferently = (items, previous = []) => {
    let result = shuffle(items);
    const previousIds = previous.map((item) => item.id).join('|');
    if (result.length > 1 && result.map((item) => item.id).join('|') === previousIds) result = [...result.slice(1), result[0]];
    return result;
  };

  const playPronunciation = (text, audioUrl) => window.VOCABULARY_AUDIO?.play(text, audioUrl) || false;
  const destroyActive = () => activeBuilder?.destroy();

  const mount = (host, answer, options = {}) => {
    destroyActive();
    const model = createModel(answer);
    let bank = shuffledDifferently(model.letters);
    let selected = [];
    let solved = false;
    let locked = false;
    let memoryTimer = null;
    let destroyed = false;

    host.innerHTML = `<div class="listen-build" data-listen-build>
      <div class="listen-build-toolbar">
        <button class="play-word" type="button" data-build-play>Play pronunciation</button>
        <span>Listen &amp; Build!</span>
      </div>
      <div class="build-lane" data-build-lane aria-label="Your word"></div>
      <div class="build-letter-bank" data-build-bank aria-label="Mixed letters"></div>
      <div class="build-edit-actions">
        <button class="secondary-action" type="button" data-build-undo disabled>Undo</button>
        <button class="secondary-action" type="button" data-build-clear disabled>Clear</button>
      </div>
      <section class="spelling-memory" data-build-memory hidden aria-live="assertive">
        <p class="spelling-memory-message">Not quite! Look and remember.</p>
        <strong class="spelling-memory-word">${escapeHtml(model.answer)}</strong>
        <div class="spelling-memory-timer" aria-label="Correct spelling hides in 5 seconds">
          <span class="spelling-memory-track"><i data-build-memory-bar></i></span>
          <span data-build-memory-count>5</span>
        </div>
      </section>
      <p class="spelling-complete-word" data-build-complete hidden>${escapeHtml(model.answer)}</p>
    </div>`;

    const lane = host.querySelector('[data-build-lane]');
    const letterBank = host.querySelector('[data-build-bank]');
    const undo = host.querySelector('[data-build-undo]');
    const clear = host.querySelector('[data-build-clear]');
    const play = host.querySelector('[data-build-play]');
    const root = host.querySelector('[data-listen-build]');
    const memory = host.querySelector('[data-build-memory]');
    const memoryBar = host.querySelector('[data-build-memory-bar]');
    const memoryCount = host.querySelector('[data-build-memory-count]');

    const clearMemoryTimer = () => {
      if (memoryTimer !== null) window.clearInterval(memoryTimer);
      memoryTimer = null;
    };

    const draw = () => {
      let selectedIndex = 0;
      lane.innerHTML = model.words.map((word, wordIndex) => `<span class="build-word" aria-label="Word ${wordIndex + 1}">${word.map(() => {
        const item = selected[selectedIndex++];
        return `<span class="build-slot${item ? ' is-filled' : ''}">${item ? escapeHtml(item.letter) : ''}</span>`;
      }).join('')}</span>`).join('');
      letterBank.innerHTML = bank.map((item) => `<button class="build-letter-card" type="button" data-build-letter="${item.id}"${selected.some((chosen) => chosen.id === item.id) || solved || locked ? ' disabled' : ''}>${escapeHtml(item.letter)}</button>`).join('');
      undo.disabled = solved || locked || selected.length === 0;
      clear.disabled = solved || locked || selected.length === 0;
      options.onChange?.(selected.length === model.letters.length, {
        selectedCount: selected.length,
        totalCount: model.letters.length,
        value: value()
      });
    };

    letterBank.addEventListener('click', (event) => {
      const button = event.target.closest('[data-build-letter]');
      if (!button || solved || locked) return;
      const item = bank.find((entry) => entry.id === button.dataset.buildLetter);
      if (!item || selected.some((entry) => entry.id === item.id)) return;
      selected.push(item); draw();
    });
    undo.addEventListener('click', () => { if (!solved && !locked) { selected.pop(); draw(); } });
    clear.addEventListener('click', () => { if (!solved && !locked) { selected = []; draw(); } });
    play.addEventListener('click', () => playPronunciation(model.answer, options.audioUrl));

    const newAttempt = () => {
      const previousBank = bank;
      selected = [];
      bank = shuffledDifferently(model.letters, previousBank);
      draw();
    };
    const finishMemoryRetry = () => {
      if (destroyed || !locked) return;
      clearMemoryTimer();
      memory.hidden = true;
      root.classList.remove('is-memory-locked');
      locked = false;
      options.onLockChange?.(false);
      newAttempt();
    };
    const startMemoryRetry = () => {
      if (destroyed || solved || locked) return false;
      clearMemoryTimer();
      locked = true;
      memory.hidden = false;
      root.classList.add('is-memory-locked');
      memoryBar.style.width = '100%';
      memoryCount.textContent = '5';
      draw();
      options.onLockChange?.(true);
      const startedAt = performance.now();
      memoryTimer = window.setInterval(() => {
        const remaining = Math.max(0, MEMORY_DURATION_MS - (performance.now() - startedAt));
        memoryBar.style.width = `${remaining / MEMORY_DURATION_MS * 100}%`;
        memoryCount.textContent = String(Math.max(1, Math.ceil(remaining / 1000)));
        if (remaining === 0) finishMemoryRetry();
      }, 50);
      return true;
    };
    const reveal = () => {
      clearMemoryTimer();
      locked = false;
      memory.hidden = true;
      root.classList.remove('is-memory-locked');
      solved = true; draw();
      play.disabled = false;
      const complete = host.querySelector('[data-build-complete]');
      if (complete) complete.hidden = false;
      host.querySelector('[data-listen-build]')?.classList.add('is-complete');
    };
    const value = () => {
      let cursor = 0;
      return model.words.map((word) => word.map(() => selected[cursor++]?.letter || '').join('')).join(' ');
    };
    const destroy = () => {
      if (destroyed) return;
      destroyed = true;
      clearMemoryTimer();
      locked = false;
      if (activeBuilder === api) activeBuilder = null;
    };

    draw();
    const api = { model, value, isComplete: () => selected.length === model.letters.length, isLocked: () => locked, newAttempt, startMemoryRetry, reveal, destroy, play: () => play.click() };
    activeBuilder = api;
    return api;
  };

  window.addEventListener?.('pagehide', destroyActive);
  window.VOCABULARY_LISTEN_BUILD = { MEMORY_DURATION_MS, createModel, mount, destroyActive, playPronunciation };
})();
