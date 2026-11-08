(() => {
  'use strict';
  if (window.ENGLISH_QUEST_WORD_ORDER) return;
  const normalize = value => String(value).trim().toLowerCase().replace(/[’‘]/g, "'").replace(/\s+/g, ' ').replace(/[.?!]+$/g, '');
  const cache = new WeakMap();
  const sequences = task => {
    if (cache.has(task)) return cache.get(task);
    const accepted = new Set([task.answer, ...(task.alternatives || []), ...(task.accepted || [])].map(normalize));
    const matches = [];
    const visit = (selected, remaining) => {
      if (!remaining.length) {
        if (accepted.has(normalize(selected.map(index => task.words[index]).join(' ')))) matches.push(selected);
        return;
      }
      remaining.forEach((wordIndex, position) => visit(
        [...selected, wordIndex],
        [...remaining.slice(0, position), ...remaining.slice(position + 1)]
      ));
    };
    visit([], task.words.map((_, index) => index));
    cache.set(task, matches);
    return matches;
  };
  const matching = (task, selection = []) => sequences(task).filter(sequence => selection.every((wordIndex, position) => sequence[position] === wordIndex));
  const allows = (task, selection, wordIndex) => matching(task, selection).some(sequence => sequence[selection.length] === wordIndex);
  window.ENGLISH_QUEST_WORD_ORDER = { normalize, sequences, matching, allows };
})();
