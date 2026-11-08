(() => {
  'use strict';
  const STORAGE_KEY = 'englishQuestLab.progress.v1';
  const BACKUP_KEY = 'englishQuestLab.progress.backup.v1';
  const MIGRATION_ID = 'unit0ConfirmedScoresV2';
  const MIGRATION_VERSION = 3;
  const TOTALS = {
    grammarGlitchPresentSimple: 25, supermarketMysteryThereIsAre: 25, quantityQuestHowMuchMany: 25,
    placesInTownVocabulary: 20, transportRushVocabulary: 20, jobsVocabulary: 30,
    placesInSchoolVocabulary: 16, foodAndDrinkVocabulary: 36, containersChallengeVocabulary: 25,
    writingBuildSentence: 12, whatShouldISayCommunication: 10,
    writingCommunication: 6, writingCompleteDialogueOneReplyV1: 6, writingChatWithMax: 5
  };

  const clone = value => JSON.parse(JSON.stringify(value));
  const confirmed = (value, total) => {
    if (value === null || value === undefined || value === '') return null;
    const number = Number(value);
    return Number.isFinite(number) && number >= 0 && number <= total ? number : null;
  };
  const recoverCorrect = (key, game) => {
    const total = TOTALS[key];
    if (!total) return null;
    const existing = confirmed(game.bestCorrect, total);
    if (existing !== null) return existing;
    const exactFields = key === 'whatShouldISayCommunication'
      ? ['bestFirstTry', 'firstAttemptCorrect', 'lastFirstTry']
      : key === 'writingCommunication' || key === 'writingCompleteDialogueOneReplyV1'
        ? ['lastFirstAttemptCorrect', 'firstAttemptCorrect']
        : ['firstAttemptCorrect'];
    for (const field of exactFields) {
      const value = confirmed(game[field], total);
      if (value !== null) return value;
    }
    if (key === 'writingCommunication') {
      const bestScore = Number(game.bestScore);
      if (Number.isFinite(bestScore) && bestScore >= 0 && bestScore < 60 && bestScore % 10 === 0) return bestScore / 10;
      const lastScore = Number(game.lastScore);
      if (Number.isFinite(lastScore) && lastScore >= 0 && lastScore < 60 && lastScore % 10 === 0) return lastScore / 10;
    }
    return null;
  };
  const migrate = input => {
    const progress = clone(input && typeof input === 'object' ? input : {});
    progress.games = progress.games && typeof progress.games === 'object' ? progress.games : {};
    progress.migrations = progress.migrations && typeof progress.migrations === 'object' ? progress.migrations : {};
    if (Number(progress.migrations[MIGRATION_ID]?.version) >= MIGRATION_VERSION) return progress;
    Object.entries(TOTALS).forEach(([key]) => {
      const game = progress.games[key];
      if (!game || typeof game !== 'object' || game.bestCorrect !== undefined) return;
      const recovered = recoverCorrect(key, game);
      if (recovered !== null) game.bestCorrect = recovered;
    });
    const legacyDialogue = progress.games.writingCommunication;
    const currentDialogue = progress.games.writingCompleteDialogueOneReplyV1;
    const legacyDialogueCorrect = legacyDialogue?.completed === true
      ? confirmed(legacyDialogue.lastFirstAttemptCorrect ?? legacyDialogue.firstAttemptCorrect, 6)
      : null;
    if (legacyDialogueCorrect !== null && confirmed(currentDialogue?.bestCorrect, 6) === null) {
      progress.games.writingCompleteDialogueOneReplyV1 = {
        ...(currentDialogue || {}),
        contentVersion: currentDialogue?.contentVersion || 'legacy-confirmed-v1',
        bestCorrect: legacyDialogueCorrect,
        firstAttemptCorrect: legacyDialogueCorrect,
        lastFirstAttemptCorrect: legacyDialogueCorrect,
        maxQuestions: 6,
        completed: true,
        migratedFrom: 'writingCommunication',
        updatedAt: currentDialogue?.updatedAt || new Date().toISOString()
      };
    }
    const communication = progress.games.writingCommunication;
    if (communication && typeof communication === 'object') {
      const stages = new Set(Array.isArray(communication.stageProgress) ? communication.stageProgress : []);
      if (progress.games.whatShouldISayCommunication?.completed === true) stages.add('What Should I Say?');
      if (progress.games.writingChatWithMax?.completed === true) stages.add('Chat with Max');
      communication.stageProgress = [...stages];
    }
    progress.migrations[MIGRATION_ID] = { version: MIGRATION_VERSION, appliedAt: new Date().toISOString() };
    return progress;
  };
  const parseStored = () => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const value = JSON.parse(raw);
    if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Progress JSON must contain an object.');
    return value;
  };
  const createBackup = () => {
    const raw = localStorage.getItem(STORAGE_KEY) || '{}';
    JSON.parse(raw);
    const backup = { format: 'englishQuestLab.progress.backup.v1', createdAt: new Date().toISOString(), raw };
    localStorage.setItem(BACKUP_KEY, JSON.stringify(backup));
    return backup;
  };
  const exportEnvelope = () => ({
    format: 'englishQuestLab.progress.export.v1',
    exportedAt: new Date().toISOString(),
    progress: clone(parseStored())
  });
  const downloadJson = (value, filename = `english-quest-progress-${new Date().toISOString().slice(0, 10)}.json`) => {
    if (typeof document === 'undefined') return;
    const url = URL.createObjectURL(new Blob([JSON.stringify(value, null, 2)], { type: 'application/json' }));
    const link = document.createElement('a');
    link.href = url; link.download = filename; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 0);
  };
  const exportProgress = () => { const envelope = exportEnvelope(); downloadJson(envelope); return envelope; };
  const migrateStoredProgress = () => {
    const current = parseStored();
    if (Number(current.migrations?.[MIGRATION_ID]?.version) >= MIGRATION_VERSION) return { changed: false, progress: current };
    const backup = createBackup();
    downloadJson({ format: backup.format, createdAt: backup.createdAt, progress: JSON.parse(backup.raw) }, `english-quest-before-migration-${new Date().toISOString().slice(0, 10)}.json`);
    const progress = migrate(current);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    return { changed: true, progress, backup };
  };
  const restoreProgress = value => {
    const progress = value?.progress ?? value;
    if (!progress || typeof progress !== 'object' || Array.isArray(progress)) throw new Error('The selected file is not an English Quest progress backup.');
    createBackup();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    return progress;
  };
  window.ENGLISH_QUEST_PROGRESS_DATA = {
    STORAGE_KEY, BACKUP_KEY, MIGRATION_ID, MIGRATION_VERSION,
    recoverCorrect, migrate, createBackup, exportEnvelope, exportProgress, migrateStoredProgress, restoreProgress
  };
})();
