(() => {
  'use strict';
  const STORAGE_KEY = 'englishQuestLab.progress.v1';
  const REQUIRED = {
    grammar: { title: 'Grammar Lab', href: 'grammar.html?unit=0', blocks: [
      { key: 'grammarGlitchPresentSimple', title: 'Grammar Glitch!', total: 25 },
      { key: 'supermarketMysteryThereIsAre', title: 'Supermarket Mystery!', total: 25 },
      { key: 'quantityQuestHowMuchMany', title: 'Quantity Quest!', total: 25 }
    ] },
    vocabulary: { title: 'Vocabulary Lab', href: 'vocabulary.html?unit=0', blocks: [
      { key: 'placesInTownVocabulary', title: 'City Explorer', total: 20 },
      { key: 'transportRushVocabulary', title: 'Transport Rush', total: 20 },
      { key: 'jobsVocabulary', title: 'Job Detective', total: 30 },
      { key: 'placesInSchoolVocabulary', title: 'School Explorer', total: 16 },
      { key: 'foodAndDrinkVocabulary', title: 'Food Hunt', total: 36 },
      { key: 'containersChallengeVocabulary', title: 'Containers Challenge!', total: 25 }
    ] }
  };
  const WRITING_SCORES = [
    { key: 'writingBuildSentence', title: 'Build a Sentence', total: 12, value: game => game.bestCorrect },
    { key: 'writingStoryBuilder', title: "Max's Story Builder", total: 18, value: game => {
      const blocks = game.verifiedBlocks || {};
      return ['Easy', 'Medium', 'Hard'].every(name => Number.isFinite(Number(blocks[name]?.correct)))
        ? ['Easy', 'Medium', 'Hard'].reduce((sum, name) => sum + Number(blocks[name].correct), 0) : null;
    } },
    { key: 'whatShouldISayCommunication', title: 'What Should I Say?', total: 10, value: game => game.bestCorrect ?? game.bestFirstTry },
    { key: 'writingCompleteDialogueOneReplyV1', title: 'Complete the Dialogue', total: 6, value: game => game.bestCorrect },
    { key: 'writingChatWithMax', title: 'Chat with Max', total: 5, value: game => game.bestCorrect }
  ];
  const loadProgress = () => { try { const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); return { ...value, games: { ...(value.games || {}) } }; } catch { return { games: {}, brainSparks: 0 }; } };
  const finiteScore = (value, total) => { if (value === null || value === undefined || value === '') return null; const number = Number(value); return Number.isFinite(number) ? Math.max(0, Math.min(total, number)) : null; };
  const confirmedScore = (key, game, total, value = game.bestCorrect) => finiteScore(
    value ?? window.ENGLISH_QUEST_PROGRESS_DATA?.recoverCorrect(key, game), total
  );
  const legacyDialogueCorrect = games => {
    const game = games.writingCommunication || {};
    if (game.completed !== true) return null;
    return finiteScore(game.lastFirstAttemptCorrect ?? game.firstAttemptCorrect, 6);
  };
  const automaticLab = (definition, games) => {
    const blocks = definition.blocks.map(block => { const game = games[block.key] || {}, correct = confirmedScore(block.key, game, block.total); return { ...block, completed: game.completed === true, verified: correct !== null, correct }; });
    const complete = blocks.every(block => block.completed), verified = blocks.every(block => block.verified);
    const correct = verified ? blocks.reduce((sum, block) => sum + block.correct, 0) : null, total = blocks.reduce((sum, block) => sum + block.total, 0);
    const percentage = verified ? Math.round(correct / total * 100) : null;
    return { title: definition.title, href: definition.href, blocks, complete, verified, correct, total, percentage, passed: complete && verified && correct / total >= 0.7 };
  };
  const writingLab = games => {
    const legacyCorrect = legacyDialogueCorrect(games);
    const scored = WRITING_SCORES.map(block => {
      const game = games[block.key] || {}, value = block.value(game);
      const currentCorrect = confirmedScore(block.key, game, block.total, value);
      const correct = block.key === 'writingCompleteDialogueOneReplyV1' && currentCorrect === null ? legacyCorrect : currentCorrect;
      return { ...block, correct, verified: correct !== null, source: currentCorrect !== null ? 'current' : correct !== null ? 'legacy-confirmed' : null };
    });
    const communicationStages = games.writingCommunication?.stageProgress || [];
    const scoreFor = key => scored.find(block => block.key === key);
    const communication = [
      { ...scoreFor('whatShouldISayCommunication'), done: games.whatShouldISayCommunication?.completed === true || communicationStages.includes('What Should I Say?') },
      { ...scoreFor('writingCompleteDialogueOneReplyV1'), done: games.writingCompleteDialogueOneReplyV1?.completed === true || legacyCorrect !== null },
      { ...scoreFor('writingChatWithMax'), done: games.writingChatWithMax?.completed === true || communicationStages.includes('Chat with Max') }
    ];
    const completion = [
      { title: 'Build a Sentence', done: games.writingBuildSentence?.completed === true },
      { title: "Max's Story Builder", done: ['Easy', 'Medium', 'Hard'].every(stage => (games.writingStoryBuilder?.stageProgress || []).includes(stage)) },
      { title: 'Communication', done: communication.every(block => block.done) }
    ];
    const complete = completion.every(block => block.done), verified = scored.every(block => block.verified);
    const correct = verified ? scored.reduce((sum, block) => sum + block.correct, 0) : null, total = scored.reduce((sum, block) => sum + block.total, 0);
    const percentage = verified ? Math.round(correct / total * 100) : null;
    return { title: 'Writing Lab', href: 'writing.html?unit=0', blocks: completion, scored, communication, complete, verified, correct, total, percentage, passed: complete && verified && correct / total >= 0.7 };
  };
  const evaluate = (progress = loadProgress()) => {
    const games = progress.games || {}, labs = { grammar: automaticLab(REQUIRED.grammar, games), vocabulary: automaticLab(REQUIRED.vocabulary, games), writing: writingLab(games) };
    const unlocked = Object.values(labs).every(lab => lab.passed);
    const remaining = Object.values(labs).flatMap(lab => { const messages = [], missing=(lab.blocks||[]).filter(block => !(block.completed ?? block.done)).map(block => block.title), unverified=(lab.scored||lab.blocks||[]).filter(block => !block.verified).map(block => block.title); if (missing.length) messages.push(`${lab.title}: complete ${missing.join(', ')}.`); if (unverified.length) messages.push(`${lab.title}: repeat for a confirmed score — ${unverified.join(', ')}.`); else if (lab.correct / lab.total < 0.7) messages.push(`${lab.title}: improve the confirmed result from ${lab.percentage}% to at least 70%.`); return messages; });
    return { unlocked, labs, remaining };
  };
  window.Unit0Readiness = { STORAGE_KEY, evaluate, loadProgress };
})();
