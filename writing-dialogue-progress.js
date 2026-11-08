(() => {
  'use strict';
  const GAME_KEY = 'writingCompleteDialogueOneReplyV1';
  const CONTENT_VERSION = 'one-missing-reply-v1';

  const exactCount = (value, total) => {
    const number = Number(value);
    return Number.isInteger(number) && number >= 0 && number <= total ? number : null;
  };

  const mergeResult = (input, result) => {
    const progress = input && typeof input === 'object' ? { ...input } : {};
    progress.games = { ...(progress.games || {}) };
    const total = Number(result.total);
    const correct = exactCount(result.correct, total);
    const score = Number(result.score);
    if (!Number.isInteger(total) || total <= 0 || correct === null || !Number.isFinite(score)) throw new Error('Dialogue result is incomplete.');
    const old = progress.games[GAME_KEY] || {};
    const oldBestScore = Number(old.bestScore) || 0;
    const bestScore = Math.max(oldBestScore, score);
    const gain = bestScore - oldBestScore;
    const completedAt = result.completedAt || new Date().toISOString();
    const history = Array.isArray(old.attemptHistory) ? old.attemptHistory : [];
    const stats = result.stats || {};
    progress.brainSparks = (Number(progress.brainSparks) || 0) + gain;
    progress.games[GAME_KEY] = {
      ...old,
      contentVersion: CONTENT_VERSION,
      bestScore,
      lastScore: score,
      bestCorrect: Math.max(exactCount(old.bestCorrect, total) ?? 0, correct),
      firstAttemptCorrect: correct,
      lastFirstAttemptCorrect: correct,
      maxQuestions: total,
      completed: true,
      plays: (Number(old.plays) || 0) + 1,
      attemptHistory: [...history, { contentVersion: CONTENT_VERSION, correct, total, score, completedAt }],
      retryAttempts: Number(stats.retryAttempts) || 0,
      masteredMistakes: Number(stats.masteredCount) || 0,
      pendingMistakes: Number(stats.pending) || 0,
      completedAt,
      updatedAt: completedAt
    };
    return { progress, gain };
  };

  window.WRITING_DIALOGUE_PROGRESS = { GAME_KEY, CONTENT_VERSION, mergeResult };
})();
