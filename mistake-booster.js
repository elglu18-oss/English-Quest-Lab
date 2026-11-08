(() => {
  'use strict';

  if (window.ENGLISH_QUEST_MISTAKE_BOOSTER) return;

  const STORAGE_KEY = 'englishQuestLab.mistakeBooster.v1';
  const MAX_FAILURES_BEFORE_RULE = 3;
  const load = () => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') || {}; }
    catch { return {}; }
  };
  const save = (value) => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(value)); }
    catch { /* Storage can be unavailable in private file:// sessions. */ }
  };
  const randomDelay = () => 2 + Math.floor(Math.random() * 3);
  const clone = (value) => JSON.parse(JSON.stringify(value));

  const mountIndicator = () => {
    let indicator = document.querySelector('[data-mistake-booster-indicator]');
    if (indicator) return indicator;
    if (!document.querySelector('link[href="mistake-booster.css"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'mistake-booster.css';
      document.head.append(link);
    }
    indicator = document.createElement('div');
    indicator.className = 'mistake-booster-indicator';
    indicator.dataset.mistakeBoosterIndicator = '';
    indicator.hidden = true;
    indicator.setAttribute('role', 'status');
    indicator.setAttribute('aria-live', 'polite');
    document.body.append(indicator);
    return indicator;
  };

  const create = (gameKey, options = {}) => {
    const store = load();
    const saved = store[gameKey] || {};
    const state = {
      queue: Array.isArray(saved.queue) ? saved.queue : [],
      retryAttempts: Number(saved.retryAttempts) || 0,
      masteredCount: Number(saved.masteredCount) || 0
    };
    const indicator = mountIndicator();
    const unit = options.unit || 'items';

    const persist = () => {
      const latest = load();
      latest[gameKey] = { ...state, updatedAt: new Date().toISOString() };
      save(latest);
      updateIndicator();
    };
    const updateIndicator = (message = '') => {
      if (!indicator) return;
      if (message) {
        indicator.hidden = false;
        indicator.classList.add('is-mastered');
        indicator.textContent = message;
        clearTimeout(indicator._masteredTimer);
        indicator._masteredTimer = setTimeout(() => updateIndicator(), 2400);
        return;
      }
      indicator.classList.remove('is-mastered');
      indicator.hidden = state.queue.length === 0;
      indicator.textContent = `Mistake Booster · ${state.queue.length} ${state.queue.length === 1 ? (options.singular || 'item') : unit} to practise`;
    };
    const find = (id) => state.queue.find((item) => item.id === id);
    const recordMistake = (item) => {
      const existing = find(item.id);
      if (existing) {
        existing.streak = 0;
        existing.failures = (Number(existing.failures) || 0) + 1;
        existing.dueAfter = randomDelay();
        existing.payload = clone(item.payload);
        existing.hint = item.hint;
      } else {
        state.queue.push({
          id: item.id,
          hint: item.hint || '',
          rule: item.rule || item.hint || '',
          payload: clone(item.payload),
          streak: 0,
          failures: 1,
          dueAfter: randomDelay(),
          addedAt: new Date().toISOString()
        });
      }
      state.retryAttempts += 1;
      persist();
      return find(item.id);
    };
    const tick = (excludedId = '') => {
      state.queue.forEach((item) => { if (item.id !== excludedId && item.dueAfter > 0) item.dueAfter -= 1; });
      persist();
    };
    const nextDue = () => state.queue.find((item) => item.dueAfter <= 0) || null;
    const answerReview = (id, correct) => {
      const item = find(id);
      if (!item) return { mastered: false, streak: 0 };
      state.retryAttempts += 1;
      if (!correct) {
        item.streak = 0;
        item.failures = (Number(item.failures) || 0) + 1;
        item.dueAfter = randomDelay();
        persist();
        return { mastered: false, streak: 0, showRule: item.failures >= MAX_FAILURES_BEFORE_RULE, rule: item.rule };
      }
      item.streak = (Number(item.streak) || 0) + 1;
      if (item.streak >= 2) {
        state.queue = state.queue.filter((entry) => entry.id !== id);
        state.masteredCount += 1;
        persist();
        updateIndicator("Great! You've mastered it!");
        return { mastered: true, streak: 2 };
      }
      item.dueAfter = randomDelay();
      persist();
      return { mastered: false, streak: item.streak };
    };
    const pendingItems = () => state.queue.map(clone);
    const resolveReview = (id) => {
      if (!find(id)) return false;
      state.retryAttempts += 1;
      state.queue = state.queue.filter((entry) => entry.id !== id);
      state.masteredCount += 1;
      persist();
      updateIndicator("Great! You've mastered it!");
      return true;
    };
    const stats = () => ({ retryAttempts: state.retryAttempts, masteredCount: state.masteredCount, pending: state.queue.length });

    updateIndicator();
    return { recordMistake, tick, nextDue, answerReview, pendingItems, resolveReview, stats, updateIndicator };
  };

  window.ENGLISH_QUEST_MISTAKE_BOOSTER = { create, storageKey: STORAGE_KEY };
})();
