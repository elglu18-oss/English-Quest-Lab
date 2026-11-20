(() => {
  'use strict';

  const CLOSE_DELAY_MS = 1000;
  const CARD_BACK_IMAGE = 'assets/images/vocabulary/unit1/memory-match/memory-card-back.png?v=u1-mobile-20261114-2';
  const lastDeckOrders = new Map();
  let activeGame = null;

  const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[char]));
  const shuffle = (items, random = Math.random) => {
    const result = [...items];
    for (let index = result.length - 1; index > 0; index -= 1) {
      const other = Math.floor(random() * (index + 1));
      [result[index], result[other]] = [result[other], result[index]];
    }
    return result;
  };

  const createRounds = (entries, random = Math.random) => {
    if (!Array.isArray(entries) || entries.length < 4) return entries?.length ? [[...entries]] : [];
    const mixed = shuffle(entries, random);
    const roundCount = Math.ceil(mixed.length / 5);
    const baseSize = Math.floor(mixed.length / roundCount);
    const largerRounds = mixed.length % roundCount;
    const rounds = [];
    let cursor = 0;
    for (let round = 0; round < roundCount; round += 1) {
      const size = baseSize + (round < largerRounds ? 1 : 0);
      rounds.push(mixed.slice(cursor, cursor + size));
      cursor += size;
    }
    return rounds;
  };

  const createDeck = (entries, random = Math.random) => shuffle(entries.flatMap((entry, index) => [
    { id: `${index}:en`, pairId: String(index), language: 'en', label: entry.word, entry },
    { id: `${index}:ru`, pairId: String(index), language: 'ru', label: entry.translation, entry }
  ]), random);
  const deckSignature = (deck) => deck.map((card) => `${card.language}:${card.entry.word}`).join('|');
  const createFreshDeck = (entries, random = Math.random, previousSignature = '') => {
    let deck = createDeck(entries, random);
    if (deck.length > 1 && deckSignature(deck) === previousSignature) deck = [...deck.slice(1), deck[0]];
    return deck;
  };
  const shouldPronounce = (card) => card?.language === 'en';

  const destroyActive = () => activeGame?.destroy();

  const mount = (host, entries, options = {}) => {
    destroyActive();
    const deckKey = entries.map((entry) => entry.word).sort().join('|');
    const deck = createFreshDeck(entries, options.random || Math.random, lastDeckOrders.get(deckKey) || '');
    lastDeckOrders.set(deckKey, deckSignature(deck));
    const opened = [];
    const matched = new Set();
    const mistakes = new Set();
    let locked = false;
    let timer = null;
    let destroyed = false;
    let resizeFrame = null;

    const pointsLabel = () => `${matched.size} / ${entries.length} pairs · ${matched.size} pts`;

    host.innerHTML = `<div class="memory-match" data-memory-match>
      <p class="memory-help">Open an English card and its Russian translation.</p>
      <div class="memory-grid" data-memory-grid>${deck.map((card) => `<button class="memory-card" type="button" data-card-id="${card.id}" aria-label="Hidden memory card">
        <span class="memory-card-inner"><span class="memory-card-back" aria-hidden="true"><img src="${CARD_BACK_IMAGE}" alt="" width="1672" height="941"></span><span class="memory-card-face${card.label.length >= 28 ? ' is-extra-long' : card.label.length >= 20 ? ' is-long' : ''}" lang="${card.language}">${escapeHtml(card.label)}</span></span>
      </button>`).join('')}</div>
      <p class="memory-status" data-memory-status role="status" aria-live="polite">${pointsLabel()}</p>
    </div>`;

    const root = host.querySelector('[data-memory-match]');
    const status = host.querySelector('[data-memory-status]');
    const cardButton = (id) => host.querySelector(`[data-card-id="${CSS.escape(id)}"]`);
    const fitFaces = () => {
      host.querySelectorAll('.memory-card-face').forEach((face) => {
        face.style.fontSize = '';
        let size = Number.parseFloat(getComputedStyle(face).fontSize);
        const minimum = face.lang === 'ru' ? 11 : 13;
        while ((face.scrollWidth > face.clientWidth || face.scrollHeight > face.clientHeight) && size > minimum) {
          size = Math.max(minimum, size - 0.5);
          face.style.fontSize = `${size}px`;
        }
      });
    };
    const queueFaceFit = () => {
      if (resizeFrame !== null) window.cancelAnimationFrame?.(resizeFrame);
      resizeFrame = window.requestAnimationFrame ? window.requestAnimationFrame(() => { resizeFrame = null; fitFaces(); }) : null;
      if (resizeFrame === null) fitFaces();
    };
    const onResize = () => queueFaceFit();
    const setOpen = (card, open) => {
      const button = cardButton(card.id);
      button?.classList.toggle('is-open', open);
      if (button) button.setAttribute('aria-label', open ? card.label : 'Hidden memory card');
    };

    const choose = (card) => {
      if (destroyed || locked || matched.has(card.pairId) || opened.some((item) => item.id === card.id)) return;
      opened.push(card);
      setOpen(card, true);
      if (shouldPronounce(card)) options.pronounce?.(card.entry);
      if (opened.length < 2) return;
      locked = true;
      const [first, second] = opened;
      const isMatch = first.pairId === second.pairId && first.language !== second.language;
      if (isMatch) {
        matched.add(first.pairId);
        const firstButton = cardButton(first.id);
        const secondButton = cardButton(second.id);
        [firstButton, secondButton].forEach((button) => { button?.classList.add('is-matched'); if (button) button.disabled = true; });
        opened.length = 0;
        locked = false;
        status.textContent = pointsLabel();
        options.sound?.('correct');
        options.onMatch?.(first.entry, !mistakes.has(first.pairId));
        if (matched.size === entries.length) {
          root.classList.add('is-complete');
          status.textContent = `Round complete · ${pointsLabel()}`;
          options.onComplete?.();
        }
        return;
      }

      mistakes.add(first.pairId); mistakes.add(second.pairId);
      [cardButton(first.id), cardButton(second.id)].forEach((button) => button?.classList.add('is-wrong'));
      status.textContent = `Not a pair. ${pointsLabel()}`;
      options.sound?.('incorrect');
      options.onMismatch?.([first.entry, second.entry]);
      timer = window.setTimeout(() => {
        [first, second].forEach((item) => { const button = cardButton(item.id); button?.classList.remove('is-wrong'); setOpen(item, false); });
        opened.length = 0;
        locked = false;
        status.textContent = pointsLabel();
        timer = null;
      }, CLOSE_DELAY_MS);
    };

    host.querySelectorAll('[data-card-id]').forEach((button) => button.addEventListener('click', () => {
      const card = deck.find((item) => item.id === button.dataset.cardId);
      if (card) choose(card);
    }));
    window.addEventListener?.('resize', onResize);
    queueFaceFit();

    const destroy = () => {
      if (destroyed) return;
      destroyed = true;
      if (timer !== null) window.clearTimeout(timer);
      if (resizeFrame !== null) window.cancelAnimationFrame?.(resizeFrame);
      window.removeEventListener?.('resize', onResize);
      if (activeGame === api) activeGame = null;
    };
    const api = { destroy, matchedCount: () => matched.size, pairCount: entries.length };
    activeGame = api;
    return api;
  };

  window.addEventListener?.('pagehide', destroyActive);
  window.VOCABULARY_MEMORY_MATCH = { CLOSE_DELAY_MS, CARD_BACK_IMAGE, createRounds, createDeck, createFreshDeck, deckSignature, shouldPronounce, mount, destroyActive };
})();
