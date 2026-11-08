(() => {
  'use strict';

  const STORAGE_KEY = 'englishQuestLab.progress.v1';
  const GAME_KEY = 'grammarGlitchPresentSimple';
  const TASKS_PER_ROUND = 5;
  const SPARKS_PER_TASK = 10;
  const ROUND_THEMES = ['fix', 'catch', 'shuffle', 'question', 'boss'];
  const ROUND_GUIDE_MESSAGES = [
    'Choose the right part and repair the machine!',
    'Ziggy left a grammar glitch. Let’s catch it!',
    'Build the sentence one word at a time.',
    'Power up the factory with a perfect question!',
    'Final challenge! Use all your grammar power!'
  ];
  const CHARACTER_IMAGES = {
    lexiThinking: 'assets/characters/lexi-thinking.png.png',
    lexiHappy: 'assets/characters/lexi-happy.png.png',
    lexiSurprised: 'assets/characters/lexi-surprised.png.png',
    ziggyTricky: 'assets/characters/ziggy-tricky.png',
    ziggySurprised: 'assets/characters/ziggy-surprised.png'
  };
  const ZIGGY_CAUGHT_MESSAGES = [
    'Oops! You caught me!',
    'No way! You’re too good!'
  ];

  const rounds = [
    {
      name: 'Fix the Machine',
      icon: '⚙',
      instruction: 'Choose the correct verb form.',
      bank: [
        { prompt: 'My dad ___ a bus to work.', options: ['take', 'takes', 'taking'], answer: 'takes', explanation: 'Use -s with he, she or it: my dad takes.' },
        { prompt: 'We ___ science on Tuesdays.', options: ['studies', 'study', 'studying'], answer: 'study', explanation: 'Use the base verb with we: we study.' },
        { prompt: 'Mia ___ at the hospital.', options: ['work', 'works', 'working'], answer: 'works', explanation: 'Mia is a singular subject, so add -s to the verb.' },
        { prompt: 'I ___ to school by bike.', options: ['go', 'goes', 'going'], answer: 'go', explanation: 'Use the base verb with I: I go.' },
        { prompt: 'The library ___ at nine o’clock.', options: ['open', 'opens', 'opening'], answer: 'opens', explanation: 'The library is a singular subject, so add -s to the verb.' },
        { prompt: 'Tom and Eva ___ near the park.', options: ['lives', 'live', 'living'], answer: 'live', explanation: 'Tom and Eva form a plural subject, so use the base verb.' },
        { prompt: 'Our teacher ___ English and history.', options: ['teach', 'teachs', 'teaches'], answer: 'teaches', explanation: 'Verbs ending in -ch take -es: teaches.' },
        { prompt: 'Ziggy ___ the train at 8:15.', options: ['catch', 'catchs', 'catches'], answer: 'catches', explanation: 'Verbs ending in -ch take -es: catches.' },
        { prompt: 'You ___ maths in Room 12.', options: ['has', 'have', 'haves'], answer: 'have', explanation: 'Use have with you: you have.' },
        { prompt: 'A firefighter ___ people.', options: ['help', 'helps', 'helpes'], answer: 'helps', explanation: 'A firefighter is a singular subject, so add -s to the verb.' },
        { prompt: 'The buses ___ outside the station.', options: ['stops', 'stop', 'stopes'], answer: 'stop', explanation: 'The buses is a plural subject, so use the base verb.' },
        { prompt: 'Leo ___ his homework after school.', options: ['do', 'dos', 'does'], answer: 'does', explanation: 'The third-person form of do is does.' },
        { prompt: 'My sister ___ geography.', options: ['like', 'likes', 'likies'], answer: 'likes', explanation: 'My sister is a singular subject, so add -s to the verb.' },
        { prompt: 'I ___ lunch in the school café.', options: ['have', 'has', 'haves'], answer: 'have', explanation: 'Use have with I: I have.' },
        { prompt: 'The museum ___ at five.', options: ['close', 'closes', 'closies'], answer: 'closes', explanation: 'The museum is a singular subject, so add -s to the verb.' }
      ]
    },
    {
      name: 'Catch Ziggy!',
      icon: '⚡',
      instruction: 'Find the glitch and choose the corrected sentence.',
      kind: 'fix',
      bank: [
        { prompt: 'She walk to the library every Saturday.', options: ['She walks to the library every Saturday.', 'She walking to the library every Saturday.', 'She do walk to the library every Saturday.'], answer: 'She walks to the library every Saturday.', explanation: 'Use walks with she.' },
        { prompt: 'They doesn’t go to school by tram.', options: ['They not go to school by tram.', 'They don’t go to school by tram.', 'They doesn’t goes to school by tram.'], answer: 'They don’t go to school by tram.', explanation: 'Use don’t with they.' },
        { prompt: 'Does Ben likes art?', options: ['Do Ben likes art?', 'Does Ben like art?', 'Does Ben liking art?'], answer: 'Does Ben like art?', explanation: 'Use does + subject + base verb in a Present Simple question.' },
        { prompt: 'My mum work in a bank.', options: ['My mum works in a bank.', 'My mum working in a bank.', 'My mum workes in a bank.'], answer: 'My mum works in a bank.', explanation: 'My mum is a singular subject, so add -s to the verb.' },
        { prompt: 'I doesn’t have PE on Friday.', options: ['I don’t have PE on Friday.', 'I doesn’t has PE on Friday.', 'I not have PE on Friday.'], answer: 'I don’t have PE on Friday.', explanation: 'Use don’t with I.' },
        { prompt: 'Do your sister take the bus?', options: ['Does your sister takes the bus?', 'Do your sister takes the bus?', 'Does your sister take the bus?'], answer: 'Does your sister take the bus?', explanation: 'Your sister is a singular subject, so use does + subject + base verb.' },
        { prompt: 'The shop close at six.', options: ['The shop closes at six.', 'The shop closing at six.', 'The shop closees at six.'], answer: 'The shop closes at six.', explanation: 'The shop is a singular subject, so add -s to the verb.' },
        { prompt: 'We goes to the sports centre after school.', options: ['We go to the sports centre after school.', 'We going to the sports centre after school.', 'We does go to the sports centre after school.'], answer: 'We go to the sports centre after school.', explanation: 'Use the base verb with we.' },
        { prompt: 'A mechanic fix cars.', options: ['A mechanic fixs cars.', 'A mechanic fixes cars.', 'A mechanic fixing cars.'], answer: 'A mechanic fixes cars.', explanation: 'Verbs ending in -x take -es: fixes.' },
        { prompt: 'Where does they study music?', options: ['Where do they study music?', 'Where do they studies music?', 'Where does they studies music?'], answer: 'Where do they study music?', explanation: 'Use question word + do + plural subject + base verb.' },
        { prompt: 'Sam don’t live near the station.', options: ['Sam doesn’t lives near the station.', 'Sam doesn’t live near the station.', 'Sam don’t lives near the station.'], answer: 'Sam doesn’t live near the station.', explanation: 'Use doesn’t with Sam, then the base verb live.' },
        { prompt: 'The train leave at half past seven.', options: ['The train leaving at half past seven.', 'The train leaves at half past seven.', 'The train leavees at half past seven.'], answer: 'The train leaves at half past seven.', explanation: 'The train is a singular subject, so add -s to the verb.' },
        { prompt: 'Do Lexi teaches English?', options: ['Does Lexi teach English?', 'Does Lexi teaches English?', 'Do Lexi teach English?'], answer: 'Does Lexi teach English?', explanation: 'Lexi is a singular subject, so use does + subject + base verb.' },
        { prompt: 'Our lessons doesn’t start at eight.', options: ['Our lessons don’t start at eight.', 'Our lessons doesn’t starts at eight.', 'Our lessons not starts at eight.'], answer: 'Our lessons don’t start at eight.', explanation: 'Our lessons is a plural subject, so use don’t + base verb.' },
        { prompt: 'He have lunch at the café.', options: ['He haves lunch at the café.', 'He has lunch at the café.', 'He having lunch at the café.'], answer: 'He has lunch at the café.', explanation: 'The third-person form of have is has.' }
      ]
    },
    {
      name: 'Word Shuffle',
      icon: '↻',
      instruction: 'Tap the words to build a correct sentence.',
      kind: 'order',
      bank: [
        { words: ['school', 'I', 'walk', 'to', 'every day'], answer: 'I walk to school every day.', alternatives: ['Every day I walk to school.'], explanation: 'A common order is subject + verb + place + time. A time expression can also come first.' },
        { words: ['at', 'works', 'the hospital', 'My aunt'], answer: 'My aunt works at the hospital.', explanation: 'My aunt is a singular subject, so the verb takes -s.' },
        { words: ['don’t', 'We', 'by bus', 'travel'], answer: 'We don’t travel by bus.', explanation: 'Use don’t + base verb with we.' },
        { words: ['science', 'likes', 'very much', 'Alex'], answer: 'Alex likes science very much.', explanation: 'Alex is a singular subject, so the verb takes -s.' },
        { words: ['doesn’t', 'near', 'live', 'the station', 'She'], answer: 'She doesn’t live near the station.', explanation: 'After doesn’t, use the base verb live.' },
        { words: ['on Mondays', 'They', 'history', 'study'], answer: 'They study history on Mondays.', alternatives: ['On Mondays they study history.'], explanation: 'Use the base verb with the plural subject they. The time expression can come last or first.' },
        { words: ['the museum', 'at ten', 'opens'], answer: 'The museum opens at ten.', alternatives: ['At ten the museum opens.'], explanation: 'The museum is a singular subject, so the verb takes -s. The time expression can also come first.' },
        { words: ['A pilot', 'a plane', 'flies'], answer: 'A pilot flies a plane.', explanation: 'Change -y to -ies after a consonant: flies.' },
        { words: ['homework', 'after dinner', 'does', 'Ziggy', 'his'], answer: 'Ziggy does his homework after dinner.', alternatives: ['After dinner Ziggy does his homework.'], explanation: 'Use subject + verb + possessive adjective + noun. The time expression can come last or first.' },
        { words: ['don’t', 'Art', 'on Friday', 'have', 'I'], answer: 'I don’t have Art on Friday.', alternatives: ['On Friday I don’t have Art.'], explanation: 'Use subject + don’t + base verb. The time expression can come last or first.' },
        { words: ['by train', 'goes', 'to work', 'Mr Brown'], answer: 'Mr Brown goes to work by train.', alternatives: ['By train Mr Brown goes to work.'], explanation: 'Mr Brown is one person. In the Present Simple, go takes -es: go → goes. The transport phrase can come last or first.' },
        { words: ['at school', 'lunch', 'have', 'We'], answer: 'We have lunch at school.', alternatives: ['At school we have lunch.'], explanation: 'Use the base verb with we. The place expression can come last or first.' },
        { words: ['doesn’t', 'Maths', 'like', 'Eva'], answer: 'Eva doesn’t like Maths.', explanation: 'After doesn’t, use the base verb like.' },
        { words: ['people', 'A police officer', 'helps'], answer: 'A police officer helps people.', explanation: 'A police officer is a singular subject, so add -s to the verb.' },
        { words: ['the park', 'play', 'My friends', 'in'], answer: 'My friends play in the park.', alternatives: ['In the park my friends play.'], explanation: 'My friends is a plural subject, so use the base verb. The place expression can also come first.' }
      ]
    },
    {
      name: 'Question Factory',
      icon: '?',
      instruction: 'Put the words in order to make a question.',
      kind: 'order',
      bank: [
        { words: ['you', 'Do', 'English', 'like'], answer: 'Do you like English?', explanation: 'For a yes/no question, use do + subject + base verb.' },
        { words: ['your dad', 'Does', 'by car', 'travel'], answer: 'Does your dad travel by car?', explanation: 'Your dad is a singular subject, so use does + subject + base verb.' },
        { words: ['they', 'Where', 'live', 'do'], answer: 'Where do they live?', explanation: 'Use question word + do + plural subject + base verb.' },
        { words: ['start', 'the lesson', 'does', 'When'], answer: 'When does the lesson start?', explanation: 'Use question word + does + singular subject + base verb.' },
        { words: ['PE', 'on Tuesday', 'Do', 'we', 'have'], answer: 'Do we have PE on Tuesday?', explanation: 'We is a plural subject, so use do + subject + base verb.' },
        { words: ['at a school', 'your mum', 'work', 'Does'], answer: 'Does your mum work at a school?', explanation: 'Your mum is a singular subject, so use does + subject + base verb.' },
        { words: ['How', 'go', 'to the library', 'you', 'do'], answer: 'How do you go to the library?', explanation: 'Use question word + do + subject + base verb.' },
        { words: ['the bus', 'Does', 'here', 'stop'], answer: 'Does the bus stop here?', explanation: 'The bus is a singular subject, so use does + subject + base verb.' },
        { words: ['What subjects', 'study', 'they', 'do'], answer: 'What subjects do they study?', explanation: 'Use question word + do + plural subject + base verb.' },
        { words: ['a nurse', 'Where', 'work', 'does'], answer: 'Where does a nurse work?', explanation: 'Use question word + does + singular subject + base verb.' },
        { words: ['walk', 'to school', 'your friends', 'Do'], answer: 'Do your friends walk to school?', explanation: 'Your friends is a plural subject, so use do + subject + base verb.' },
        { words: ['Ziggy', 'Does', 'history', 'like'], answer: 'Does Ziggy like history?', explanation: 'Ziggy is a singular subject, so use does + subject + base verb.' },
        { words: ['close', 'What time', 'the shops', 'do'], answer: 'What time do the shops close?', explanation: 'The shops is a plural subject, so we use do, not does. Question word + do/does + subject + base verb?' },
        { words: ['teach', 'Ms Green', 'Does', 'science'], answer: 'Does Ms Green teach science?', explanation: 'Ms Green is a singular subject, so use does + subject + base verb.' },
        { words: ['by tram', 'go', 'Why', 'you', 'do'], answer: 'Why do you go by tram?', explanation: 'Use question word + do + subject + base verb.' }
      ]
    },
    {
      name: 'Grammar Boss',
      icon: '★',
      instruction: 'Use all your Present Simple powers!',
      kind: 'boss',
      bank: [
        { type: 'choice', prompt: 'A chef ___ food in a restaurant.', options: ['cook', 'cooks', 'cooking'], answer: 'cooks', explanation: 'A chef is a singular subject, so add -s to the verb.' },
        { type: 'choice', prompt: 'We ___ geography on Thursday.', options: ['has', 'have', 'haves'], answer: 'have', explanation: 'Use have with we.' },
        { type: 'choice', prompt: '___ Maya go to school by bus?', options: ['Do', 'Does', 'Is'], answer: 'Does', explanation: 'Maya is a singular subject, so use does + subject + base verb.' },
        { type: 'choice', prompt: 'My friends ___ near the sports centre.', options: ['lives', 'live', 'living'], answer: 'live', explanation: 'My friends is a plural subject, so use the base verb.' },
        { type: 'fix', prompt: 'He don’t study music.', options: ['He doesn’t study music.', 'He doesn’t studies music.', 'He not study music.'], answer: 'He doesn’t study music.', explanation: 'Use doesn’t with he, then the base verb.' },
        { type: 'fix', prompt: 'Does they work at the library?', options: ['Do they work at the library?', 'Do they works at the library?', 'Does they works at the library?'], answer: 'Do they work at the library?', explanation: 'They is a plural subject, so use do + subject + base verb.' },
        { type: 'fix', prompt: 'A doctor help sick people.', options: ['A doctor helps sick people.', 'A doctor helpes sick people.', 'A doctor helping sick people.'], answer: 'A doctor helps sick people.', explanation: 'Add -s with he or she.' },
        { type: 'fix', prompt: 'Where does you catch the train?', options: ['Where do you catch the train?', 'Where do you catches the train?', 'Where does you catches the train?'], answer: 'Where do you catch the train?', explanation: 'Use question word + do + subject + base verb with you.' },
        { type: 'order', words: ['doesn’t', 'The café', 'on Sundays', 'open'], answer: 'The café doesn’t open on Sundays.', explanation: 'Use doesn’t + base verb with it.' },
        { type: 'order', words: ['by bike', 'to work', 'goes', 'My uncle'], answer: 'My uncle goes to work by bike.', alternatives: ['By bike my uncle goes to work.'], explanation: 'My uncle is a singular subject, so the verb takes -s. The transport phrase can also come first.' },
        { type: 'order', words: ['Do', 'chemistry', 'study', 'you'], answer: 'Do you study chemistry?', explanation: 'For a yes/no question, use do + subject + base verb.' },
        { type: 'input', prompt: 'Complete the negative sentence:\nLexi ___ (not / work) at the bank.', answer: "doesn't work", alternatives: ['does not work'], displayAnswer: "Lexi doesn't work at the bank.", explanation: 'Use doesn’t + base verb with Lexi.' },
        { type: 'input', prompt: 'Write the missing words:\n___ your brother like maths?', answer: 'does', displayAnswer: 'Does your brother like maths?', explanation: 'Your brother is a singular subject, so use does + subject + base verb.' },
        { type: 'input', prompt: 'Complete the sentence:\nThe train ___ (leave) at nine.', answer: 'leaves', displayAnswer: 'The train leaves at nine.', explanation: 'The train is a singular subject, so add -s to the verb.' },
        { type: 'input', prompt: 'Write the missing words:\nWhere ___ they live?', answer: 'do', displayAnswer: 'Where do they live?', explanation: 'Use question word + do + plural subject + base verb.' }
      ]
    }
  ];

  const elements = {
    intro: document.querySelector('[data-intro]'),
    game: document.querySelector('[data-game]'),
    result: document.querySelector('[data-result]'),
    start: document.querySelector('[data-start]'),
    playAgain: document.querySelector('[data-play-again]'),
    sparks: document.querySelector('[data-sparks]'),
    bestScore: document.querySelector('[data-best-score]'),
    roundLabel: document.querySelector('[data-round-label]'),
    taskLabel: document.querySelector('[data-task-label]'),
    progressTrack: document.querySelector('.progress-track'),
    progress: document.querySelector('[data-progress]'),
    roundDots: document.querySelector('[data-round-dots]'),
    challenge: document.querySelector('[data-challenge]'),
    roundIcon: document.querySelector('[data-round-icon]'),
    roundName: document.querySelector('[data-round-name]'),
    instruction: document.querySelector('[data-instruction]'),
    taskArea: document.querySelector('[data-task-area]'),
    feedback: document.querySelector('[data-feedback]'),
    reset: document.querySelector('[data-reset]'),
    check: document.querySelector('[data-check]'),
    next: document.querySelector('[data-next]'),
    finalScore: document.querySelector('[data-final-score]'),
    finalCorrect: document.querySelector('[data-final-correct]'),
    savedSparks: document.querySelector('[data-saved-sparks]'),
    finalBest: document.querySelector('[data-final-best]'),
    resultMessage: document.querySelector('[data-result-message]')
  };
  elements.lexiMessage = document.querySelector('[data-lexi-message]');
  elements.guideImage = document.querySelector('[data-guide-image]');
  elements.guideName = document.querySelector('[data-guide-name]');
  elements.guideStatus = document.querySelector('[data-guide-status]');
  elements.energy = document.querySelector('[data-energy]');
  elements.energyLabel = document.querySelector('[data-energy-label]');
  elements.sparkShower = document.querySelector('[data-spark-shower]');

  let state = {};
  const booster = window.ENGLISH_QUEST_MISTAKE_BOOSTER.create(GAME_KEY, { singular: 'task', unit: 'tasks' });
  const sound = (name, token) => window.ENGLISH_QUEST_MUSIC?.playEffect(name, token);
  let orderSoundReadyAt = 0;
  const orderSound = (name, token) => {
    const now = performance.now();
    if (now < orderSoundReadyAt) return false;
    orderSoundReadyAt = now + 220;
    return sound(name, token);
  };
  let guideSwapTimer;

  Object.values(CHARACTER_IMAGES).forEach((source) => {
    const image = new Image();
    image.src = source;
  });

  const updateGuide = ({ source, alt, name, message }) => {
    window.clearTimeout(guideSwapTimer);
    elements.guideName.textContent = name;
    elements.guideStatus.textContent = `${name} online`;
    elements.lexiMessage.textContent = message;

    if (elements.guideImage.getAttribute('src') === source) {
      elements.guideImage.alt = alt;
      return;
    }

    elements.guideImage.classList.add('is-changing');
    guideSwapTimer = window.setTimeout(() => {
      elements.guideImage.src = source;
      elements.guideImage.alt = alt;
      elements.guideImage.classList.remove('is-changing');
    }, 140);
  };

  const shuffle = (items) => {
    const copy = [...items];
    for (let index = copy.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
    }
    return copy;
  };

  const escapeHtml = (value) => String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

  const normalize = (value) => String(value)
    .trim()
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/\s+/g, ' ')
    .replace(/[.?!]+$/g, '');

  const orderSequences = task => window.ENGLISH_QUEST_WORD_ORDER.sequences(task);
  const matchingOrderSequences = (task, selection = state.orderSelection) => window.ENGLISH_QUEST_WORD_ORDER.matching(task, selection);

  const orderHint = (task) => {
    const position = state.orderSelection.length;
    const sequences = matchingOrderSequences(task);
    const expectedWords = [...new Set(sequences.map((sequence) => task.words[sequence[position]]))];
    const firstWord = state.orderSelection.length ? task.words[state.orderSelection[0]] : '';
    const question = task.answer.endsWith('?');
    if (position === 0) {
      if (sequences.length > 1) return 'Start with the subject, or put the time or place expression first.';
      if (question && /^(what|where|when|how|why)\b/i.test(task.answer)) return 'Start with the question word or question phrase.';
      if (question) return 'Start with do or does before the subject.';
      if (/^(yes|no),/i.test(task.answer)) return 'Start the short answer with Yes or No.';
      return 'Start with the subject.';
    }
    if (/^(what|where|when|how|why)\b/i.test(firstWord)) return 'After the question word, use do or does.';
    if (/^(do|does)$/i.test(firstWord)) return 'The subject comes after do or does.';
    if (expectedWords.some((word) => /^(do|does)$/i.test(word))) return 'Use do or does before the subject.';
    if (question && position >= 2 && expectedWords.some((word) => /^(like|live|start|have|work|go|stop|study|walk|teach|close)$/i.test(word))) return 'After the subject, use the base verb.';
    if (expectedWords.some((word) => /^(don’t|doesn’t)$/i.test(word))) return 'Put don’t or doesn’t after the subject.';
    if (expectedWords.some((word) => /^(his|her|my|your|our|their)$/i.test(word))) return 'The possessive adjective goes before the noun.';
    if (expectedWords.some((word) => /^(every |on |after |at ten|on monday|on friday)/i.test(word))) return 'The time expression usually goes at the end, but it can also come first.';
    if (expectedWords.some((word) => /^(at|in|to|by)\b/i.test(word))) return 'Put the place or transport expression after the verb and object.';
    if (position === 1) return 'What comes after the subject? Think about the verb.';
    return question ? 'Keep the order: question word + do/does + subject + base verb.' : 'Think about what normally comes after the verb.';
  };

  const loadProgress = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (saved && typeof saved === 'object') {
        saved.games = saved.games && typeof saved.games === 'object' ? saved.games : {};
        saved.brainSparks = Number(saved.brainSparks) || 0;
        return saved;
      }
    } catch (error) {
      console.warn('Could not read saved Grammar Glitch progress.', error);
    }
    return { brainSparks: 0, games: {} };
  };

  const saveProgress = (progress) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (error) {
      console.warn('Could not save Grammar Glitch progress.', error);
    }
  };

  const getBestScore = () => Number(loadProgress().games[GAME_KEY]?.bestScore) || 0;

  const updateBestLabel = () => {
    const best = getBestScore();
    elements.bestScore.hidden = best === 0;
    elements.bestScore.querySelector('strong').textContent = `${best}`;
  };

  const selectBossTasks = (bank) => {
    const types = ['choice', 'fix', 'order', 'input'];
    const chosen = types.map((type) => shuffle(bank.filter((task) => task.type === type))[0]);
    const remaining = bank.filter((task) => !chosen.includes(task));
    chosen.push(shuffle(remaining)[0]);
    return shuffle(chosen);
  };

  const startGame = () => {
    const startedProgress = loadProgress(); const startedGame = startedProgress.games[GAME_KEY] || {};
    if (!startedGame.startedAt) { startedProgress.games[GAME_KEY] = { ...startedGame, started: true, startedAt: new Date().toISOString() }; saveProgress(startedProgress); }
    state = {
      roundIndex: 0,
      taskIndex: 0,
      score: 0,
      correctFirst: 0,
      answered: false,
      firstAttempt: true,
      mistakeThisTask: false,
      errorCount: 0,
      reviewItem: null,
      orderSelection: [],
      orderGuided: false,
      orderRepeat: false,
      orderHadMistake: false,
      orderPositionErrors: {},
      choiceSelection: '',
      selectedRounds: rounds.map((round) => (
        round.kind === 'boss' ? selectBossTasks(round.bank) : shuffle(round.bank).slice(0, TASKS_PER_ROUND)
      ))
    };
    elements.sparks.textContent = '0';
    elements.intro.hidden = true;
    elements.result.hidden = true;
    elements.game.hidden = false;
    renderTask();
    window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  };

  const currentRound = () => rounds[state.reviewItem?.payload?.roundIndex ?? state.roundIndex];
  const currentTask = () => state.reviewItem?.payload?.task || state.selectedRounds[state.roundIndex][state.taskIndex];
  const currentTaskType = () => state.reviewItem?.payload?.type || currentTask().type || currentRound().kind || 'choice';

  const renderProgress = () => {
    const completed = state.roundIndex * TASKS_PER_ROUND + state.taskIndex;
    elements.roundLabel.textContent = `Round ${state.roundIndex + 1} of ${rounds.length}`;
    elements.taskLabel.textContent = `Task ${state.taskIndex + 1} of ${TASKS_PER_ROUND}`;
    elements.progress.style.width = `${(completed / 25) * 100}%`;
    elements.progressTrack.setAttribute('aria-valuenow', String(completed));
    elements.roundDots.innerHTML = rounds.map((round, index) => {
      const className = index < state.roundIndex ? ' is-done' : index === state.roundIndex ? ' is-current' : '';
      return `<span class="round-dot${className}" title="Round ${index + 1}: ${escapeHtml(round.name)}"></span>`;
    }).join('');
    updateEnergy(completed);
  };

  const updateEnergy = (completedTasks) => {
    const percent = Math.round((completedTasks / 25) * 100);
    elements.energy.style.width = `${percent}%`;
    elements.energyLabel.textContent = `${percent}%`;
  };

  const fireSparks = () => {
    elements.sparkShower.innerHTML = '';
    for (let index = 0; index < 14; index += 1) {
      const spark = document.createElement('span');
      spark.className = 'spark-particle';
      spark.style.setProperty('--spark-x', `${30 + Math.random() * 45}%`);
      spark.style.setProperty('--spark-y', `${38 + Math.random() * 28}%`);
      spark.style.setProperty('--spark-size', `${5 + Math.random() * 6}px`);
      spark.style.setProperty('--spark-dx', `${-80 + Math.random() * 160}px`);
      spark.style.setProperty('--spark-dy', `${-95 + Math.random() * 55}px`);
      elements.sparkShower.append(spark);
    }
    setTimeout(() => { elements.sparkShower.innerHTML = ''; }, 900);
  };

  const sentencePrompt = (prompt) => escapeHtml(prompt).replace('___', '<span class="blank">___</span>').replaceAll('\n', '<br>');

  const renderChoice = (task, isFix = false) => {
    elements.taskArea.innerHTML = `
      <p class="prompt${isFix ? ' error-sentence' : ''}">${isFix ? '<span class="error-label">Ziggy\'s glitched sentence</span>' : ''}${sentencePrompt(task.prompt)}</p>
      <div class="option-grid${isFix ? ' sentences' : ''}">
        ${shuffle(task.options).map((option) => `<button class="option-button" type="button" data-option="${escapeHtml(option)}">${escapeHtml(option)}</button>`).join('')}
      </div>`;
    elements.taskArea.querySelectorAll('[data-option]').forEach((button) => {
      button.addEventListener('click', () => {
        state.choiceSelection = button.dataset.option;
        elements.taskArea.querySelectorAll('[data-option]').forEach((option) => option.classList.toggle('is-selected', option === button));
        elements.check.hidden = false;
        elements.check.disabled = false;
      });
    });
    elements.check.hidden = false;
    elements.check.disabled = true;
  };

  const renderOrder = (task, { repeat = false } = {}) => {
    state.orderSelection = [];
    state.choiceSelection = '';
    state.orderGuided = !state.reviewItem && !repeat;
    state.orderRepeat = repeat;
    const shuffledWords = shuffle(task.words.map((word, index) => ({ word, index })));
    elements.taskArea.innerHTML = `
      ${repeat ? '<p class="order-repeat-label">Build it again — No Hints!</p>' : ''}
      <div class="answer-lane" data-answer-lane></div>
      <div class="word-bank" data-word-bank>
        ${shuffledWords.map(({ word, index }) => `<button class="word-button" type="button" data-word-index="${index}">${escapeHtml(word)}</button>`).join('')}
      </div>`;
    elements.taskArea.querySelectorAll('[data-word-index]').forEach((button) => {
      button.addEventListener('click', () => addWord(Number(button.dataset.wordIndex), button));
    });
    elements.reset.hidden = state.orderGuided;
    elements.check.hidden = state.orderGuided;
    elements.check.disabled = true;
  };

  const renderInput = (task) => {
    elements.taskArea.innerHTML = `
      <p class="prompt">${sentencePrompt(task.prompt)}</p>
      <label class="sr-only" for="boss-answer">Your answer</label>
      <input class="text-answer" id="boss-answer" type="text" autocomplete="off" autocapitalize="sentences" placeholder="Type the missing word or words" maxlength="80">
      <p class="answer-hint">Spelling counts. Press Enter or choose Check Answer.</p>`;
    const input = elements.taskArea.querySelector('.text-answer');
    input.addEventListener('input', () => { elements.check.disabled = input.value.trim().length === 0; });
    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' && input.value.trim() && !state.answered) elements.check.click();
    });
    elements.check.hidden = false;
    elements.check.disabled = true;
    setTimeout(() => input.focus(), 0);
  };

  const renderTask = () => {
    const round = currentRound();
    const task = currentTask();
    const type = currentTaskType();
    state.answered = false;
    state.firstAttempt = true;
    state.mistakeThisTask = false;
    state.errorCount = 0;
    state.orderSelection = [];
    state.orderGuided = false;
    state.orderRepeat = false;
    state.orderHadMistake = false;
    state.orderPositionErrors = {};
    elements.feedback.hidden = true;
    elements.feedback.className = 'feedback';
    elements.feedback.innerHTML = '';
    elements.reset.hidden = true;
    elements.check.hidden = true;
    elements.check.disabled = false;
    elements.next.disabled = true;
    elements.next.textContent = state.roundIndex === 4 && state.taskIndex === 4 ? 'See Results' : 'Next';
    elements.challenge.classList.remove('is-wrong', 'is-correct');
    elements.challenge.classList.toggle('mistake-booster-review', Boolean(state.reviewItem));
    elements.game.dataset.roundTheme = ROUND_THEMES[state.roundIndex];
    if (state.roundIndex === 1) {
      updateGuide({
        source: CHARACTER_IMAGES.ziggyTricky,
        alt: 'Ziggy looking tricky',
        name: 'Ziggy',
        message: 'Can you fix my mistake?'
      });
    } else {
      updateGuide({
        source: CHARACTER_IMAGES.lexiThinking,
        alt: 'Lexi thinking',
        name: 'Lexi',
        message: ROUND_GUIDE_MESSAGES[state.roundIndex]
      });
    }
    elements.roundIcon.textContent = round.icon;
    elements.roundName.textContent = round.name;
    elements.instruction.textContent = round.instruction;
    if (state.reviewItem) {
      elements.instruction.textContent = 'Mistake Booster · Get it right twice on separate returns.';
      elements.taskArea.insertAdjacentHTML('beforebegin', '');
    }
    renderProgress();

    if (type === 'choice') renderChoice(task);
    if (type === 'fix') renderChoice(task, true);
    if (type === 'order') renderOrder(task);
    if (type === 'input') renderInput(task);
  };

  const appendOrderWord = (wordIndex, sourceButton, guided = false) => {
    state.orderSelection.push(wordIndex);
    sourceButton.classList.add('is-used');
    const task = currentTask();
    const answerButton = document.createElement('button');
    answerButton.type = 'button';
    answerButton.className = `word-button${guided ? ' is-step-correct' : ''}`;
    answerButton.dataset.selectedIndex = String(wordIndex);
    answerButton.textContent = task.words[wordIndex];
    if (!guided) answerButton.addEventListener('click', () => removeWord(wordIndex));
    else answerButton.disabled = true;
    elements.taskArea.querySelector('[data-answer-lane]').append(answerButton);
    elements.check.disabled = state.orderSelection.length !== task.words.length;
  };

  const beginOrderRepeat = (task) => {
    renderOrder(task, { repeat: true });
    elements.instruction.textContent = 'Build it again — No Hints!';
    updateGuide({
      source: CHARACTER_IMAGES.lexiThinking,
      alt: 'Lexi thinking',
      name: 'Lexi',
      message: 'Now build the whole sentence independently.'
    });
    elements.feedback.className = 'feedback order-repeat';
    elements.feedback.innerHTML = '<strong>Build it again — No Hints!</strong><p>Choose the complete word order, then press Check Answer.</p>';
    elements.feedback.hidden = false;
  };

  const addWord = (wordIndex, sourceButton) => {
    if (state.answered || state.orderSelection.includes(wordIndex)) return;
    const task = currentTask();
    if (!state.orderGuided) {
      appendOrderWord(wordIndex, sourceButton);
      return;
    }

    const position = state.orderSelection.length;
    const correctNext = matchingOrderSequences(task).some((sequence) => sequence[position] === wordIndex);
    if (!correctNext) {
      state.firstAttempt = false;
      state.orderHadMistake = true;
      state.orderPositionErrors[position] = (state.orderPositionErrors[position] || 0) + 1;
      const errorCount = state.orderPositionErrors[position];
      orderSound('incorrect', `${GAME_KEY}:order:${state.roundIndex}-${state.taskIndex}:${position}:wrong:${errorCount}`);
      sourceButton.classList.remove('is-order-wrong');
      void sourceButton.offsetWidth;
      sourceButton.classList.add('is-order-wrong');
      window.setTimeout(() => sourceButton.classList.remove('is-order-wrong'), 480);
      updateGuide({
        source: CHARACTER_IMAGES.lexiSurprised,
        alt: 'Lexi thinking about the word order',
        name: 'Lexi',
        message: errorCount === 1 ? 'Try again! Think about the word order.' : orderHint(task)
      });
      elements.feedback.className = 'feedback wrong order-coach';
      elements.feedback.innerHTML = errorCount === 1
        ? '<strong>Try again!</strong><p>Think about the word order.</p>'
        : `<strong>Lexi’s hint</strong><p>${escapeHtml(orderHint(task))}</p>`;
      elements.feedback.hidden = false;
      return;
    }

    appendOrderWord(wordIndex, sourceButton, true);
    orderSound('correct', `${GAME_KEY}:order:${state.roundIndex}-${state.taskIndex}:${position}:correct`);
    elements.feedback.hidden = true;
    updateGuide({
      source: CHARACTER_IMAGES.lexiHappy,
      alt: 'Lexi happy with the word order',
      name: 'Lexi',
      message: state.orderSelection.length === task.words.length ? 'Great! The guided sentence is complete.' : 'Good choice. What comes next?'
    });
    if (state.orderSelection.length !== task.words.length) return;
    if (state.orderHadMistake) beginOrderRepeat(task);
    else submitAnswer(orderAnswer(), null, { silentSound: true });
  };

  const removeWord = (wordIndex) => {
    if (state.answered || state.orderGuided) return;
    state.orderSelection = state.orderSelection.filter((index) => index !== wordIndex);
    elements.taskArea.querySelector(`[data-selected-index="${wordIndex}"]`)?.remove();
    elements.taskArea.querySelector(`[data-word-index="${wordIndex}"]`)?.classList.remove('is-used');
    elements.check.disabled = true;
  };

  const clearOrder = () => {
    if (state.answered || state.orderGuided) return;
    state.orderSelection = [];
    elements.taskArea.querySelector('[data-answer-lane]').innerHTML = '';
    elements.taskArea.querySelectorAll('[data-word-index]').forEach((button) => button.classList.remove('is-used'));
    elements.check.disabled = true;
  };

  const orderAnswer = () => {
    const task = currentTask();
    const sentence = state.orderSelection.map((index) => task.words[index]).join(' ');
    return `${sentence}${task.answer.endsWith('?') ? '?' : '.'}`;
  };

  const submitAnswer = (answer, selectedButton = null, { silentSound = false } = {}) => {
    if (state.answered) return;
    const task = currentTask();
    const accepted = [task.answer, ...(task.alternatives || [])].map(normalize);
    const correct = accepted.includes(normalize(answer));
    let reviewResult = null;
    if (correct) {
      state.answered = true;
      reviewResult = state.reviewItem ? booster.answerReview(state.reviewItem.id, true) : null;
      if (!state.reviewItem && state.firstAttempt) {
        state.score += SPARKS_PER_TASK;
        state.correctFirst += 1;
      }
      elements.sparks.textContent = String(state.score);
      elements.challenge.classList.add('is-correct');
      if (state.roundIndex === 1) {
        updateGuide({
          source: CHARACTER_IMAGES.ziggySurprised,
          alt: 'Ziggy surprised after being caught',
          name: 'Ziggy',
          message: ZIGGY_CAUGHT_MESSAGES[state.taskIndex % ZIGGY_CAUGHT_MESSAGES.length]
        });
      } else {
        updateGuide({
          source: CHARACTER_IMAGES.lexiHappy,
          alt: 'Lexi happy',
          name: 'Lexi',
          message: state.reviewItem ? (reviewResult.mastered ? "Great! You've mastered it!" : 'One correct repeat. One more to master it!') : (state.firstAttempt ? 'Great job! +10 Brain Sparks!' : 'Nice correction! Your first-try score stays unchanged.')
        });
      }
      fireSparks();
      if (!silentSound) sound('correct', `${GAME_KEY}:${state.reviewItem?.id || `${state.roundIndex}-${state.taskIndex}`}:correct:${state.reviewItem?.streak || 0}`);
    } else {
      state.firstAttempt = false;
      state.mistakeThisTask = true;
      state.errorCount += 1;
      const mistakeId = state.reviewItem?.id || `${state.roundIndex}:${task.prompt || task.answer}`;
      reviewResult = state.reviewItem
        ? booster.answerReview(mistakeId, false)
        : booster.recordMistake({ id: mistakeId, hint: task.explanation, rule: task.explanation, payload: { task, type: currentTaskType(), roundIndex: state.roundIndex } });
      sound('incorrect', `${GAME_KEY}:${mistakeId}:${normalize(answer)}`);
      elements.challenge.classList.remove('is-wrong');
      void elements.challenge.offsetWidth;
      elements.challenge.classList.add('is-wrong');
      if (state.roundIndex === 1) {
        updateGuide({
          source: CHARACTER_IMAGES.ziggyTricky,
          alt: 'Ziggy looking tricky',
          name: 'Ziggy',
          message: 'Can you fix my mistake?'
        });
      } else {
        updateGuide({
          source: CHARACTER_IMAGES.lexiSurprised,
          alt: 'Lexi surprised',
          name: 'Lexi',
          message: state.errorCount === 1 ? 'Try again.' : task.explanation
        });
      }
      const rule = state.reviewItem && reviewResult?.showRule ? `<div class="mistake-booster-rule">Rule: ${escapeHtml(reviewResult.rule)} <a href="grammar.html?unit=0#activity-panel">Return to the learning stage</a></div>` : '';
      elements.feedback.className = 'feedback wrong';
      elements.feedback.innerHTML = state.errorCount === 1
        ? '<strong>Try again!</strong><p>Check the grammar and choose or build a new answer.</p>'
        : `<strong>Lexi’s hint</strong><p>${escapeHtml(task.explanation)}</p>${rule}`;
      elements.feedback.hidden = false;
      if (selectedButton) { selectedButton.classList.add('is-wrong'); selectedButton.disabled = true; }
      if (currentTaskType() === 'order') clearOrder();
      if (currentTaskType() === 'input') { const input=elements.taskArea.querySelector('.text-answer'); input.select(); elements.check.disabled=false; }
      return;
    }
    updateEnergy(state.roundIndex * TASKS_PER_ROUND + state.taskIndex + 1);

    elements.taskArea.querySelectorAll('button, input').forEach((control) => { control.disabled = true; });
    if (selectedButton) selectedButton.classList.add(correct ? 'is-correct' : 'is-wrong');
    elements.taskArea.querySelectorAll('[data-option]').forEach((button) => {
      if (normalize(button.dataset.option) === normalize(task.answer)) button.classList.add('is-correct');
    });

    const correctDisplay = task.displayAnswer || task.answer;
    const correctFeedbackTitle = state.reviewItem
      ? (reviewResult.mastered ? "Great! You've mastered it!" : 'Correct repeat · 1 of 2')
      : state.roundIndex === 1
      ? `Ziggy: ${ZIGGY_CAUGHT_MESSAGES[state.taskIndex % ZIGGY_CAUGHT_MESSAGES.length]}`
      : (state.firstAttempt ? `Lexi: Great job! +${SPARKS_PER_TASK} Brain Sparks!` : 'Lexi: Corrected!');
    elements.feedback.className = `feedback ${correct ? 'correct' : 'wrong'}`;
    elements.feedback.innerHTML = correct
      ? `<strong>${escapeHtml(correctFeedbackTitle)}</strong><p>${escapeHtml(task.explanation)}</p>`
      : `<strong>Lexi’s hint</strong><p>Correct answer: <b>${escapeHtml(correctDisplay)}</b> ${escapeHtml(task.explanation)}</p>`;
    elements.feedback.hidden = false;
    elements.reset.hidden = true;
    elements.check.hidden = true;
    elements.next.disabled = false;
    elements.next.focus({ preventScroll: true });
  };

  const checkConstructedAnswer = () => {
    const type = currentTaskType();
    if (type === 'choice' || type === 'fix') submitAnswer(state.choiceSelection, [...elements.taskArea.querySelectorAll('[data-option]')].find((button) => button.dataset.option === state.choiceSelection));
    if (type === 'order') submitAnswer(orderAnswer());
    if (type === 'input') submitAnswer(elements.taskArea.querySelector('.text-answer').value);
  };

  const nextTask = () => {
    if (!state.answered) return;
    if (state.reviewItem) {
      state.reviewItem = null;
    } else {
      if (!state.mistakeThisTask) booster.tick();
      const due = booster.nextDue();
      if (due) { state.reviewItem = due; renderTask(); return; }
    }
    if (state.taskIndex < TASKS_PER_ROUND - 1) {
      state.taskIndex += 1;
      renderTask();
      return;
    }
    if (state.roundIndex < rounds.length - 1) {
      state.roundIndex += 1;
      state.taskIndex = 0;
      renderTask();
      return;
    }
    finishGame();
  };

  const finishGame = () => {
    const progress = loadProgress();
    const previous = progress.games[GAME_KEY] || {};
    const oldBest = Number(previous.bestScore) || 0;
    const newBest = Math.max(oldBest, state.score);
    const newlySaved = newBest - oldBest;
    progress.brainSparks = (Number(progress.brainSparks) || 0) + newlySaved;
    progress.games[GAME_KEY] = {
      ...previous,
      bestScore: newBest,
      bestCorrect: Math.max(Number(previous.bestCorrect) || 0, state.correctFirst),
      maxQuestions: 25,
      plays: (Number(previous.plays) || 0) + 1,
      completed: true,
      lastScore: state.score,
      firstAttemptCorrect: state.correctFirst,
      retryAttempts: booster.stats().retryAttempts,
      masteredMistakes: booster.stats().masteredCount,
      pendingMistakes: booster.stats().pending,
      completedAt: new Date().toISOString()
    };
    saveProgress(progress);
    sound('complete', `${GAME_KEY}:complete:${Number(previous.plays) || 0}`);

    elements.game.hidden = true;
    elements.result.hidden = false;
    elements.finalScore.textContent = String(state.score);
    elements.finalCorrect.textContent = `${state.correctFirst} / 25`;
    elements.savedSparks.textContent = `+${newlySaved}`;
    elements.finalBest.textContent = `${newBest} / 250`;
    elements.resultMessage.textContent = state.score >= 220
      ? 'Lexi says: “Brilliant! The grammar machine is running perfectly again!”'
      : state.score >= 150
        ? 'Lexi says: “Great repair work! Try again to make the machine even stronger.”'
        : 'Lexi says: “Good start! Every glitch helps your grammar power grow.”';
    window.ENGLISH_QUEST_COMPLETION?.renderAll();
    updateBestLabel();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  elements.start.addEventListener('click', startGame);
  elements.playAgain.addEventListener('click', startGame);
  elements.reset.addEventListener('click', clearOrder);
  elements.check.addEventListener('click', checkConstructedAnswer);
  elements.next.addEventListener('click', nextTask);

  updateBestLabel();
})();
