/* Shared progression rules for every Vocabulary Lab topic. */
const createUniqueUseOrder = (items, savedIds = [], idFor = (item) => item.id, random = Math.random) => {
  const itemMap = new Map(items.map((item) => [idFor(item), item]));
  const savedIsComplete = savedIds.length === items.length
    && new Set(savedIds).size === items.length
    && savedIds.every((id) => itemMap.has(id));
  if (savedIsComplete) return savedIds.map((id) => itemMap.get(id));
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(random() * (index + 1));
    [result[index], result[randomIndex]] = [result[randomIndex], result[index]];
  }
  return result;
};

const hasOneTaskPerWord = (items, idFor = (item) => item.id) => items.length > 0 && new Set(items.map(idFor)).size === items.length;

window.VOCABULARY_GAME_RULES = Object.freeze({
  learningMissions: Object.freeze({
    missionNumbers: Object.freeze([1, 2, 3]),
    mode: 'learning',
    retryAfterMistake: true,
    resetProgressAfterMistake: false,
    sparksPerFirstTryAnswer: 10
  }),
  recallMission: Object.freeze({
    missionNumber: 4,
    mode: 'strict',
    requiredCorrect: 'all-topic-words',
    shuffleEveryAttempt: true,
    restartAttemptAfterMistake: true,
    revealHints: false,
    perfectRecallReward: 100,
    perfectRecallRewardPerWord: 10
  }),
  useMission: Object.freeze({ createUniqueUseOrder, hasOneTaskPerWord })
});
