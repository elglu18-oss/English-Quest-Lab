(() => {
  'use strict';

  const WORDS = [
    { id: 'bike', word: 'bike', image: 'assets/transport/bike.png' },
    { id: 'boat', word: 'boat', image: 'assets/transport/boat.png' },
    { id: 'bus', word: 'bus', image: 'assets/transport/bus.png' },
    { id: 'car', word: 'car', image: 'assets/transport/car.png' },
    { id: 'motorbike', word: 'motorbike', image: 'assets/transport/motorbike.png' },
    { id: 'plane', word: 'plane', image: 'assets/transport/plane.png' },
    { id: 'taxi', word: 'taxi', image: 'assets/transport/taxi.png' },
    { id: 'train', word: 'train', image: 'assets/transport/train.png' },
    { id: 'tram', word: 'tram', image: 'assets/transport/tram.png' },
    { id: 'underground', word: 'underground', image: 'assets/transport/underground.png' }
  ].map((item) => ({ ...item, audio: window.VOCABULARY_AUDIO_FILES?.urlFor('transport', item.word) || '' }));
  const WORD_MAP = Object.fromEntries(WORDS.map((item) => [item.id, item]));
  const SPELLING = WORDS.map(({ id: wordId }) => ({ wordId, type: 'listenBuild' }));
  const USE_IT = [
    { wordId: 'bike', type: 'fillGap', showImage: true, prompt: 'Maya is pedalling on two wheels. Complete: She goes to the park by ___.', options: ['bike', 'plane', 'underground'], answer: 'bike', explanation: 'We say by bike when someone pedals a bike.', uniqueClue: 'The PNG and the verb pedalling identify a bike.' },
    { wordId: 'boat', type: 'situationChoice', prompt: 'We need to cross a lake on the water. Which transport do we use?', options: ['boat', 'bus', 'tram'], answer: 'boat', explanation: 'A boat travels on water.', uniqueClue: 'Only a boat in the options travels on a lake.' },
    { wordId: 'bus', type: 'sentenceBuilder', showImage: true, prompt: 'The number 24 stops at the school bus stop. Build the sentence.', chunks: ['I', 'go to school', 'by bus'], answer: 'I go to school by bus.', explanation: 'Use by + transport: by bus.', uniqueClue: 'The PNG, route number and bus stop identify a bus.' },
    { wordId: 'car', type: 'fillGap', showImage: true, prompt: 'The yellow vehicle in the picture is in our garage. Complete: My dad drives our ___ to work.', options: ['car', 'train', 'bike'], answer: 'car', explanation: 'We drive a car, so the natural phrase is drives our car.', uniqueClue: 'The PNG, garage and verb drives identify a car.' },
    { wordId: 'motorbike', type: 'situationChoice', prompt: 'Ben wears a helmet and rides a vehicle with two wheels and an engine. What is it?', options: ['motorbike', 'boat', 'taxi'], answer: 'motorbike', explanation: 'A motorbike has two wheels and an engine.', uniqueClue: 'Only a motorbike matches two wheels plus an engine.' },
    { wordId: 'plane', type: 'sentenceBuilder', showImage: true, prompt: 'Our flight goes from Paris to New York. Build the sentence.', chunks: ['We', 'travel to New York', 'by plane'], answer: 'We travel to New York by plane.', explanation: 'Use by plane for air travel.', uniqueClue: 'The PNG and the word flight identify a plane.' },
    { wordId: 'taxi', type: 'fillGap', showImage: true, prompt: 'We pay a driver to take us directly to the hotel. Complete: We go by ___.', options: ['taxi', 'tram', 'boat'], answer: 'taxi', explanation: 'A taxi takes passengers directly to a destination for a fare.', uniqueClue: 'A paid driver and direct hotel trip identify a taxi.' },
    { wordId: 'train', type: 'sentenceBuilder', showImage: true, prompt: 'The railway announcement says “Platform 4”. Build the sentence.', chunks: ['The train', 'arrives', 'at the station'], answer: 'The train arrives at the station.', explanation: 'A train arrives at a railway station.', uniqueClue: 'The PNG, platform and railway station identify a train.' },
    { wordId: 'tram', type: 'situationChoice', prompt: 'This electric vehicle runs on rails along city streets. Which transport is it?', options: ['tram', 'plane', 'bike'], answer: 'tram', explanation: 'A tram runs on rails along city streets.', uniqueClue: 'Only a tram uses rails along city streets.' },
    { wordId: 'underground', type: 'fillGap', showImage: true, prompt: 'In London, we travel below the city through tunnels. Complete: We take the ___.', options: ['underground', 'boat', 'car'], answer: 'underground', explanation: 'The underground railway runs through tunnels below the city.', uniqueClue: 'London tunnels and the PNG identify the underground.' }
  ];
  const RECALL = WORDS.map(({ id: wordId }) => ({
    wordId, type: 'recallInput', prompt: 'What transport is this? Type one word.', answer: wordId
  }));
  const MISSIONS = [
    { name: 'Meet the Words', instruction: 'Study the picture and word. Listen, then continue.', guide: 'Look, read and listen carefully.' },
    { name: 'Spelling Attack', instruction: 'Listen & Build! Hear the word and build it from the mixed letters.', guide: 'Hear it, then tap every letter in order!' },
    { name: 'Use It!', instruction: 'Use the transport word in an exact situation.', guide: 'The clue gives one clear answer.' },
    { name: 'Recall Challenge', instruction: 'Listen and write all 10 transport words correctly in a row.', guide: 'Listen Again is always safe. One spelling mistake restarts Recall.' }
  ];
  window.TRANSPORT_RUSH_DATA = { words: WORDS, spelling: SPELLING, useIt: USE_IT, recall: RECALL, missions: MISSIONS };

  const GAME_RULES = window.VOCABULARY_GAME_RULES || {
    learningMissions: { sparksPerFirstTryAnswer: 10, retryAfterMistake: true, resetProgressAfterMistake: false },
    recallMission: { shuffleEveryAttempt: true, restartAttemptAfterMistake: true, revealHints: false, perfectRecallReward: 100 }
  };

  if (typeof document === 'undefined') return;
  const GAME_KEY = 'transportRushVocabulary';
  const STORAGE_KEY = 'englishQuestLab.progress.v1';
  const MAX_SCORE = 300;
  const TOTAL_STEPS = WORDS.length + SPELLING.length + USE_IT.length + RECALL.length;
  const LEARNING_TASKS = SPELLING.length + USE_IT.length;
  const ZIGGY = {
    thinking: ['assets/characters/ziggy-tricky.png', 'Ziggy thinking'],
    correct: ['assets/characters/ziggy-surprised.png', 'Ziggy surprised and impressed'],
    happy: ['assets/characters/ziggy-happy.png', 'Ziggy happy']
  };
  const $ = (selector) => document.querySelector(selector);
  const el = {
    intro: $('[data-intro]'), game: $('[data-game]'), result: $('[data-result]'), start: $('[data-start]'), replay: $('[data-replay]'),
    sparks: $('[data-sparks]'), best: $('[data-best]'), strip: $('[data-mission-strip]'), progress: $('[data-progress]'), progressTrack: $('.progress-track'), missionLabel: $('[data-mission-label]'), taskLabel: $('[data-task-label]'), missionName: $('[data-mission-name]'), instruction: $('[data-instruction]'), taskArea: $('[data-task-area]'), feedback: $('[data-feedback]'), previous: $('[data-previous]'), clear: $('[data-clear]'), check: $('[data-check]'), next: $('[data-next]'), ziggy: $('[data-ziggy]'), ziggyMessage: $('[data-ziggy-message]'), hardCount: $('[data-hard-count]'), clearHard: $('[data-clear-hard]'), finalScore: $('[data-final-score]'), finalCorrect: $('[data-final-correct]'), perfectRecall: $('[data-perfect-recall]'), recallAttempts: $('[data-recall-attempts]'), saved: $('[data-saved]'), finalHard: $('[data-final-hard]'), resultMessage: $('[data-result-message]')
  };
  let state;

  const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
  const normalize = (value) => window.VOCABULARY_NORMALIZE_ANSWER(value).replace(/[’]/g, "'").replace(/[.!?]+$/, '');
  const shuffle = (items) => {
    const result = [...items];
    for (let i = result.length - 1; i > 0; i -= 1) { const j = Math.floor(Math.random() * (i + 1)); [result[i], result[j]] = [result[j], result[i]]; }
    return result;
  };
  const loadProgress = () => {
    try { const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); return { ...parsed, games: { ...(parsed.games || {}) } }; }
    catch { return { brainSparks: 0, games: {} }; }
  };
  const saveProgress = (progress) => localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  const savedGame = () => loadProgress().games[GAME_KEY] || {};
  const prepareUseOrder = (forceNew = false) => {
    const savedIds = forceNew ? [] : (savedGame().activeUseOrder || []);
    const order = GAME_RULES.useMission.createUniqueUseOrder(USE_IT, savedIds, (task) => task.wordId);
    const progress = loadProgress(); const current = progress.games[GAME_KEY] || {};
    progress.games[GAME_KEY] = { ...current, activeUseOrder: order.map((task) => task.wordId) };
    saveProgress(progress);
    return order;
  };
  const updateBest = () => {
    const best = Number(savedGame().bestScore) || 0;
    if (best) { el.best.hidden = false; el.best.querySelector('strong').textContent = String(best); }
    const hardTotal = (savedGame().difficultWords || []).length; el.hardCount.textContent = String(hardTotal); el.clearHard.hidden = hardTotal === 0;
  };
  const rememberDifficult = (word) => {
    state.difficult.add(word);
    const progress = loadProgress(); const current = progress.games[GAME_KEY] || {};
    progress.games[GAME_KEY] = { ...current, difficultWords: [...new Set([...(current.difficultWords || []), word])] };
    saveProgress(progress); el.hardCount.textContent = String(progress.games[GAME_KEY].difficultWords.length); el.clearHard.hidden = false;
  };
  const saveStageProgress = (stageName) => {
    const progress = loadProgress(); const current = progress.games[GAME_KEY] || {};
    progress.games[GAME_KEY] = { ...current, stageProgress: [...new Set([...(current.stageProgress || []), stageName])] };
    saveProgress(progress);
  };
  const setZiggy = (kind, message) => {
    const [src, alt] = ZIGGY[kind]; el.ziggy.classList.add('is-changing');
    window.setTimeout(() => { el.ziggy.src = src; el.ziggy.alt = alt; el.ziggy.classList.remove('is-changing'); }, 120);
    el.ziggyMessage.textContent = message;
  };
  const picture = (item, alt = item.word) => `<div class="transport-showcase" data-transport="${item.id}"><img class="transport-image" src="${item.image}" alt="${escapeHtml(alt)}" width="1200" height="1200" decoding="async"></div>`;
  const showFeedback = (correct, title, message) => {
    el.feedback.hidden = false; el.feedback.className = `feedback ${correct ? 'correct' : 'wrong'}`;
    el.feedback.innerHTML = `<strong>${escapeHtml(title)}</strong><p>${escapeHtml(message)}</p>`;
  };
  const sound = (name, token) => window.ENGLISH_QUEST_MUSIC?.playEffect(name, token);
  const resetActions = () => {
    el.feedback.hidden = true; el.previous.hidden = true; el.clear.hidden = true; el.check.hidden = true; el.next.hidden = false; el.next.disabled = true;
    el.check.onclick = null; el.clear.onclick = null; el.previous.onclick = null; el.next.onclick = null; $('.mission-card').classList.remove('is-correct');
  };
  const markWrong = (word, message, terminal = false) => {
    state.firstAttempt = false; rememberDifficult(word); setZiggy('thinking', 'That word is saved for extra practice.'); showFeedback(false, 'Check it again', message);
    if (terminal) { state.answered = true; el.check.hidden = true; el.next.disabled = false; }
  };
  const complete = (message, { award = state.mission > 0 && state.mission < 3, title = '' } = {}) => {
    if (state.answered) return; state.answered = true;
    const awarded = award && state.firstAttempt;
    if (awarded) { state.score += GAME_RULES.learningMissions.sparksPerFirstTryAnswer; state.correctFirst += 1; el.sparks.textContent = String(state.score); }
    setZiggy(state.firstAttempt ? 'correct' : 'happy', state.firstAttempt ? 'No way! First try!' : 'Nice recovery!');
    showFeedback(true, title || (awarded ? `+${GAME_RULES.learningMissions.sparksPerFirstTryAnswer} Brain Sparks!` : 'Correct!'), message); $('.mission-card').classList.add('is-correct'); el.check.hidden = true; el.clear.hidden = true; el.next.disabled = false;
  };
  const tasksForMission = () => state.mission === 0 ? WORDS : state.mission === 1 ? SPELLING : state.mission === 2 ? state.useOrder : (state.recallOrder || RECALL);
  const currentTask = () => tasksForMission()[state.index];
  const prepareRecallAttempt = () => {
    const previousOrder = state.recallOrder?.map((task) => task.wordId).join('|');
    let nextOrder = shuffle(RECALL);
    if (previousOrder && nextOrder.map((task) => task.wordId).join('|') === previousOrder) nextOrder = [...nextOrder.slice(1), nextOrder[0]];
    state.recallOrder = nextOrder; state.recallAttemptCount += 1; state.recallCorrect = 0; state.index = 0; state.recallFailed = false;
  };
  const updateProgress = () => {
    const completed = [WORDS.length, SPELLING.length, USE_IT.length, RECALL.length].slice(0, state.mission).reduce((total, length) => total + length, 0) + state.index;
    el.progress.style.width = `${(completed / TOTAL_STEPS) * 100}%`; el.progressTrack.setAttribute('aria-valuenow', String(completed));
    el.missionLabel.textContent = `Mission ${state.mission + 1} of 4`; el.taskLabel.textContent = `${state.mission === 0 ? 'Word' : 'Task'} ${state.index + 1} of ${tasksForMission().length}`;
    el.strip.innerHTML = MISSIONS.map((mission, index) => `<div class="mission-pill${index < state.mission ? ' is-done' : index === state.mission ? ' is-current' : ''}">${index + 1}. ${escapeHtml(mission.name)}</div>`).join('');
    el.missionName.textContent = `Mission ${state.mission + 1} · ${MISSIONS[state.mission].name}`; el.instruction.textContent = MISSIONS[state.mission].instruction;
  };
  const advance = () => {
    if (!state.answered) return;
    if (state.index < tasksForMission().length - 1) { state.index += 1; render(); return; }
    saveStageProgress(MISSIONS[state.mission].name);
    if (state.mission < 3) { state.mission += 1; state.index = 0; render(); return; }
    finish();
  };

  const renderMeet = (item) => {
    state.answered = true;
    el.taskArea.innerHTML = `${picture(item)}<p class="word-label">${escapeHtml(item.word)}</p><div class="listen-row"><button class="play-word" type="button">Play pronunciation</button></div>`;
    const play = el.taskArea.querySelector('.play-word');
    play.addEventListener('click', () => window.VOCABULARY_AUDIO.play(item.word, item.audio));
    el.previous.hidden = state.index === 0; el.previous.onclick = () => { state.index -= 1; render(); };
    el.next.disabled = false; el.next.textContent = state.index === 9 ? 'Start Spelling Attack' : 'Next'; el.next.onclick = advance;
  };
  const renderInput = (item, task, missing = false) => {
    el.taskArea.innerHTML = `${picture(item)}${missing ? `<p class="missing-pattern" aria-label="Word with missing letters">${escapeHtml(task.pattern)}</p>` : '<p class="prompt">Type the transport word.</p>'}<input class="answer-input" type="text" autocomplete="off" autocapitalize="none" spellcheck="false" aria-label="Your answer" placeholder="Type your answer">`;
    const input = el.taskArea.querySelector('input'); el.check.hidden = false; el.check.disabled = true;
    input.addEventListener('input', () => { el.check.disabled = !input.value.trim(); });
    const check = () => { if (normalize(input.value) === item.word) { input.disabled = true; complete(`Correct spelling: ${item.word}.`); } else { markWrong(item.word, 'Check every letter and try again.'); input.select(); } };
    el.check.onclick = check; input.addEventListener('keydown', (event) => { if (event.key === 'Enter' && input.value.trim()) check(); }); window.setTimeout(() => input.focus(), 0);
  };
  const renderBuilder = (item) => {
    const letters = shuffle([...item.word]); state.selection = [];
    el.taskArea.innerHTML = `${picture(item)}<p class="prompt">Build the word from the mixed letters.</p><div class="letter-lane" data-lane></div><div class="letter-bank">${letters.map((letter, index) => `<button class="letter-button" type="button" data-letter="${index}">${letter}</button>`).join('')}</div>`;
    const draw = () => {
      el.taskArea.querySelector('[data-lane]').innerHTML = state.selection.map((index) => `<button class="letter-button" type="button" data-remove="${index}">${letters[index]}</button>`).join('');
      el.taskArea.querySelectorAll('[data-letter]').forEach((button) => button.classList.toggle('is-used', state.selection.includes(Number(button.dataset.letter))));
      el.check.disabled = state.selection.length !== item.word.length;
      el.taskArea.querySelectorAll('[data-remove]').forEach((button) => button.onclick = () => { state.selection.splice(state.selection.lastIndexOf(Number(button.dataset.remove)), 1); draw(); });
    };
    el.taskArea.querySelectorAll('[data-letter]').forEach((button) => button.onclick = () => { const index = Number(button.dataset.letter); if (!state.selection.includes(index)) { state.selection.push(index); draw(); } });
    el.clear.hidden = false; el.clear.onclick = () => { state.selection = []; draw(); }; el.check.hidden = false; el.check.disabled = true;
    el.check.onclick = () => { const answer = state.selection.map((index) => letters[index]).join(''); if (answer === item.word) complete(`Correct spelling: ${item.word}.`); else { markWrong(item.word, 'The letters are in the wrong order. Try again.'); state.selection = []; draw(); } };
  };
  const renderSpelling = (task) => {
    const item = WORD_MAP[task.wordId];
    const listenBuild = window.VOCABULARY_LISTEN_BUILD;
    el.taskArea.innerHTML = `${picture(item)}<p class="prompt">Tap each letter in the correct order.</p><div data-listen-build-host></div>`;
    el.check.hidden = false; el.check.disabled = true;
    let builder;
    let spellingLocked = false;
    let spellingRetry = false;
    builder = listenBuild.mount(el.taskArea.querySelector('[data-listen-build-host]'), item.word, { audioUrl: item.audio, onChange: (complete) => { el.check.disabled = spellingLocked || !complete; }, onLockChange: (locked) => { spellingLocked = locked; el.check.disabled = locked || !builder.isComplete(); if (!locked && spellingRetry) { spellingRetry = false; el.feedback.hidden = true; el.feedback.className = 'feedback'; setZiggy('thinking', 'Now build the word again from memory.'); } } });
    window.VOCABULARY_AUDIO.schedule(item.word, item.audio);
    el.check.onclick = () => {
      if (builder.isLocked()) return;
      if (normalize(builder.value()) === normalize(item.word)) { builder.reveal(); sound('correct', `transport:spelling:${item.word}:correct`); complete(`Correct spelling: ${item.word}.`); }
      else { spellingRetry = true; sound('incorrect', `transport:spelling:${item.word}:incorrect`); markWrong(item.word, 'Not quite! Look and remember.'); builder.startMemoryRetry(); }
    };
  };
  const renderChoices = (task, imageChoices = false) => {
    const options = shuffle(task.options); const contextImage = task.showImage ? picture(WORD_MAP[task.wordId]) : '';
    el.taskArea.innerHTML = `${contextImage}<p class="prompt">${escapeHtml(task.prompt)}</p><div class="choice-grid">${options.map((option) => imageChoices ? `<button class="choice-button" type="button" data-answer="${option}" aria-label="${option}"><img src="${WORD_MAP[option].image}" alt="Transport choice" width="1200" height="1200"></button>` : `<button class="choice-button" type="button" data-answer="${option}">${escapeHtml(option)}</button>`).join('')}</div>`;
    el.taskArea.querySelectorAll('[data-answer]').forEach((button) => button.onclick = () => {
      if (button.dataset.answer === task.answer) { button.classList.add('is-correct'); complete(task.explanation); }
      else { button.classList.add('is-wrong'); button.disabled = true; markWrong(WORD_MAP[task.wordId].word, `That does not match the clue. ${task.explanation}`); }
    });
  };
  const renderSentence = (task) => {
    const chunks = shuffle(task.chunks); state.selection = [];
    el.taskArea.innerHTML = `${task.showImage ? picture(WORD_MAP[task.wordId]) : ''}<p class="prompt">${escapeHtml(task.prompt)}</p><div class="sentence-lane" data-lane></div><div class="sentence-bank">${chunks.map((text, index) => `<button class="chunk-button" type="button" data-chunk="${index}">${escapeHtml(text)}</button>`).join('')}</div>`;
    const draw = () => {
      el.taskArea.querySelector('[data-lane]').innerHTML = state.selection.map((index) => `<button class="chunk-button" type="button" data-remove="${index}">${escapeHtml(chunks[index])}</button>`).join('');
      el.taskArea.querySelectorAll('[data-chunk]').forEach((button) => button.classList.toggle('is-used', state.selection.includes(Number(button.dataset.chunk)))); el.check.disabled = state.selection.length !== chunks.length;
      el.taskArea.querySelectorAll('[data-remove]').forEach((button) => button.onclick = () => { state.selection.splice(state.selection.lastIndexOf(Number(button.dataset.remove)), 1); draw(); });
    };
    el.taskArea.querySelectorAll('[data-chunk]').forEach((button) => button.onclick = () => { const index = Number(button.dataset.chunk); if (!state.selection.includes(index)) { state.selection.push(index); draw(); } });
    el.clear.hidden = false; el.clear.onclick = () => { state.selection = []; draw(); }; el.check.hidden = false; el.check.disabled = true;
    el.check.onclick = () => { const built = `${state.selection.map((index) => chunks[index]).join(' ')}.`; if (normalize(built) === normalize(task.answer)) complete(`${task.answer} ${task.explanation}`); else { markWrong(WORD_MAP[task.wordId].word, 'Check the sentence order and try again.'); state.selection = []; draw(); } };
  };
  const renderUse = (task) => task.type === 'sentenceBuilder' ? renderSentence(task) : renderChoices(task, task.type === 'situationChoice');
  const renderRecall = (task) => {
    const item = WORD_MAP[task.wordId];
    const audio = window.VOCABULARY_AUDIO;
    el.taskArea.innerHTML = `<div class="strict-recall-card">${picture(item, 'Transport illustration')}<div class="recall-audio-controls">${audio.buttonMarkup()}</div><label class="sr-only" for="recall-answer">Type the word you hear</label><input class="answer-input" id="recall-answer" type="text" autocomplete="off" autocapitalize="none" spellcheck="false"></div>`;
    const input = el.taskArea.querySelector('input');
    el.taskArea.querySelector('[data-listen-again]').onclick = () => audio.play(item.word, item.audio);
    el.check.hidden = false; el.check.disabled = true; el.check.textContent = 'Check Answer';
    input.addEventListener('input', () => { el.check.disabled = !input.value.trim(); });
    const check = () => {
      if (state.answered) return;
      if (normalize(input.value) === normalize(task.answer)) {
        input.disabled = true; state.recallCorrect += 1;
        const perfect = state.recallCorrect === RECALL.length;
        if (perfect && !state.perfectRecallAwarded) {
          state.perfectRecallAwarded = true; state.score += GAME_RULES.recallMission.perfectRecallReward; el.sparks.textContent = String(state.score);
        }
        complete(perfect ? `Perfect Recall: ${RECALL.length} out of ${RECALL.length}.` : 'Correct. Keep the streak going!', { award: false, title: perfect ? `Perfect Recall! +${GAME_RULES.recallMission.perfectRecallReward} Brain Sparks` : 'Correct!' }); return;
      }
      audio.stop(); state.firstAttempt = false; state.answered = true; state.recallFailed = true; rememberDifficult(item.word); input.disabled = true;
      setZiggy('thinking', 'One mistake ends this Recall attempt. Start again!');
      showFeedback(false, 'Recall attempt ended', 'The spelling was not exact. Your learning progress and Brain Sparks are safe. Start Recall again from word 1.');
      el.check.hidden = true; el.next.disabled = true;
      const restart = document.createElement('button'); restart.type = 'button'; restart.className = 'primary-action recall-restart'; restart.textContent = 'Try Again';
      restart.addEventListener('click', () => { prepareRecallAttempt(); render(); }); el.taskArea.append(restart); restart.focus({ preventScroll: true });
    };
    el.check.onclick = check; input.addEventListener('keydown', (event) => { if (event.key === 'Enter' && input.value.trim()) check(); }); window.setTimeout(() => input.focus(), 0); audio.schedule(item.word, item.audio);
  };
  const render = () => {
    window.VOCABULARY_AUDIO?.stop();
    window.VOCABULARY_LISTEN_BUILD?.destroyActive();
    if (state.mission === 3 && !state.recallOrder) prepareRecallAttempt();
    resetActions(); state.answered = false; state.firstAttempt = true; updateProgress(); setZiggy('thinking', MISSIONS[state.mission].guide);
    el.next.textContent = state.mission === 3 && state.index === RECALL.length - 1 ? 'See Results' : 'Next'; el.next.onclick = advance;
    const task = currentTask(); if (state.mission === 0) renderMeet(task); else if (state.mission === 1) renderSpelling(task); else if (state.mission === 2) renderUse(task); else renderRecall(task);
  };
  const start = (forceNewOrder = false) => {
    const previousHard = savedGame().difficultWords || []; state = { mission: 0, index: 0, score: 0, correctFirst: 0, answered: false, firstAttempt: true, difficult: new Set(previousHard), selection: [], useOrder: prepareUseOrder(forceNewOrder), recallOrder: null, recallAttemptCount: 0, recallCorrect: 0, recallFailed: false, perfectRecallAwarded: false };
    el.sparks.textContent = '0'; el.intro.hidden = true; el.result.hidden = true; el.game.hidden = false; render(); window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const finish = () => {
    window.VOCABULARY_AUDIO?.stop();
    const progress = loadProgress(); const previous = progress.games[GAME_KEY] || {}; const oldBest = Number(previous.bestScore) || 0; const newBest = Math.max(oldBest, state.score);
    const runLearningScore = state.score - GAME_RULES.recallMission.perfectRecallReward;
    const previousLearningBest = Number.isFinite(Number(previous.bestLearningScore))
      ? Number(previous.bestLearningScore)
      : Math.max(0, oldBest - GAME_RULES.recallMission.perfectRecallReward);
    const newLearningBest = Math.max(previousLearningBest, runLearningScore);
    const learningGain = newLearningBest - previousLearningBest;
    const perfectRecallGain = previous.perfectRecallRewarded ? 0 : GAME_RULES.recallMission.perfectRecallReward;
    const newlySaved = learningGain + perfectRecallGain;
    progress.brainSparks = (Number(progress.brainSparks) || 0) + newlySaved;
    progress.games[GAME_KEY] = { ...previous, activeUseOrder: null, bestScore: newBest, bestLearningScore: newLearningBest, bestCorrect: Math.max(Number(previous.bestCorrect) || 0, state.correctFirst), maxQuestions: LEARNING_TASKS, perfectRecallRewarded: true, perfectRecallCompleted: true, lastRecallAttempts: state.recallAttemptCount, bestRecallAttempts: previous.bestRecallAttempts ? Math.min(Number(previous.bestRecallAttempts), state.recallAttemptCount) : state.recallAttemptCount, lastScore: state.score, plays: (Number(previous.plays) || 0) + 1, completed: true, completedAt: new Date().toISOString(), stageProgress: MISSIONS.map((mission) => mission.name), difficultWords: [...state.difficult] };
    saveProgress(progress); el.game.hidden = true; el.result.hidden = false; el.finalScore.textContent = String(state.score); el.finalCorrect.textContent = `${state.correctFirst} / ${LEARNING_TASKS}`; el.perfectRecall.textContent = `${RECALL.length} / ${RECALL.length}`; el.recallAttempts.textContent = String(state.recallAttemptCount); el.saved.textContent = `+${newlySaved}`; el.finalHard.textContent = String(state.difficult.size);
    el.resultMessage.textContent = `Ziggy says: “Perfect Recall! You wrote all ${RECALL.length} words correctly in a row.”`; updateBest(); window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  el.clearHard.addEventListener('click', () => {
    const progress = loadProgress(); const current = progress.games[GAME_KEY] || {}; progress.games[GAME_KEY] = { ...current, difficultWords: [] }; saveProgress(progress);
    if (state?.difficult) state.difficult.clear(); el.hardCount.textContent = '0'; el.clearHard.hidden = true;
  });
  el.start.addEventListener('click', () => start(false)); el.replay.addEventListener('click', () => start(true)); updateBest();
})();
