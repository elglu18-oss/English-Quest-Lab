(() => {
  'use strict';

  const PRODUCTS = [
    { id: 'chocolate', label: 'a bar of chocolate', short: 'chocolate', className: 'product-chocolate', image: 'assets/containers/bar-of-chocolate.png' },
    { id: 'water', label: 'a bottle of water', short: 'water', className: 'product-water', image: 'assets/containers/bottle-of-water.png' },
    { id: 'tuna', label: 'a can of tuna', short: 'tuna', className: 'product-tuna', image: 'assets/containers/can-of-tuna.png' },
    { id: 'milk', label: 'a carton of milk', short: 'milk', className: 'product-milk', image: 'assets/containers/carton-of-milk.png' },
    { id: 'jam', label: 'a jar of jam', short: 'jam', className: 'product-jam', image: 'assets/containers/jar-of-jam.png' },
    { id: 'flour', label: 'a packet of flour', short: 'flour', className: 'product-flour', image: 'assets/containers/packet-of-flour.png' }
  ].map((product) => ({ ...product, audio: window.VOCABULARY_AUDIO_FILES?.urlFor('containers', product.label) || '' }));
  const PRODUCT_MAP = Object.fromEntries(PRODUCTS.map((product) => [product.id, product]));
  const containerWord = (product) => product.label.match(/^an? (\w+) of /)?.[1] || '';

  const meetBank = PRODUCTS.flatMap((product) => [
    { type: 'meet', productId: product.id, prompt: 'Tap the product to reveal its full label.' },
    { type: 'meet', productId: product.id, prompt: 'Meet this supermarket item. Tap to listen.' },
    { type: 'meet', productId: product.id, prompt: 'What is this container phrase? Tap to reveal it.' }
  ]);

  const findBank = PRODUCTS.flatMap((product) => [
    { type: 'find', productId: product.id, prompt: `Find and tap ${product.label}.` },
    { type: 'find', productId: product.id, prompt: `Ziggy needs ${product.label}. Where is it?` },
    { type: 'find', productId: product.id, prompt: `Tap the picture that means “${product.label}”.` }
  ]);

  const spellingBank = PRODUCTS.flatMap((product) => [
    { type: 'listenBuild', productId: product.id, prompt: 'Listen and build the complete container phrase.', answer: product.label },
    { type: 'listenBuild', productId: product.id, prompt: 'Tap the mixed letters in the correct order.', answer: product.label },
    { type: 'listenBuild', productId: product.id, prompt: 'Build every word in this container phrase.', answer: product.label }
  ]);

  const packBank = [
    { type: 'pack', needs: [{ id: 'water', count: 1 }], prompt: 'Put one bottle of water in the basket.' },
    { type: 'pack', needs: [{ id: 'chocolate', count: 1 }], prompt: 'Put one bar of chocolate in the basket.' },
    { type: 'pack', needs: [{ id: 'tuna', count: 1 }], prompt: 'Put one can of tuna in the basket.' },
    { type: 'pack', needs: [{ id: 'milk', count: 1 }], prompt: 'Put one carton of milk in the basket.' },
    { type: 'pack', needs: [{ id: 'jam', count: 1 }], prompt: 'Put one jar of jam in the basket.' },
    { type: 'pack', needs: [{ id: 'flour', count: 1 }], prompt: 'Put one packet of flour in the basket.' },
    { type: 'pack', needs: [{ id: 'water', count: 2 }], prompt: 'Put two bottles of water in the basket.' },
    { type: 'pack', needs: [{ id: 'tuna', count: 2 }], prompt: 'Put two cans of tuna in the basket.' },
    { type: 'pack', needs: [{ id: 'milk', count: 2 }], prompt: 'Put two cartons of milk in the basket.' },
    { type: 'pack', needs: [{ id: 'jam', count: 2 }], prompt: 'Put two jars of jam in the basket.' },
    { type: 'pack', needs: [{ id: 'water', count: 1 }, { id: 'chocolate', count: 1 }], prompt: 'Pack one bottle of water and one bar of chocolate.' },
    { type: 'pack', needs: [{ id: 'tuna', count: 1 }, { id: 'milk', count: 1 }], prompt: 'Pack one can of tuna and one carton of milk.' },
    { type: 'pack', needs: [{ id: 'jam', count: 1 }, { id: 'flour', count: 1 }], prompt: 'Pack one jar of jam and one packet of flour.' },
    { type: 'pack', needs: [{ id: 'chocolate', count: 2 }, { id: 'water', count: 1 }], prompt: 'Pack two bars of chocolate and one bottle of water.' },
    { type: 'pack', needs: [{ id: 'milk', count: 1 }, { id: 'flour', count: 1 }], prompt: 'Pack one carton of milk and one packet of flour.' }
  ];

  const useBank = [
    { type: 'choice', prompt: 'Choose the grammatically correct sentence.', options: ['There is a bar of chocolate on the shelf.', 'There are a bar of chocolate on the shelf.', 'There is bar of chocolate on the shelf.'], answer: 'There is a bar of chocolate on the shelf.', explanation: 'Use there is + a bar of chocolate for one item.' },
    { type: 'choice', prompt: 'Choose the grammatically correct question.', options: ['Is there a bottle of water in the basket?', 'Are there a bottle of water in the basket?', 'Is there bottle of water in the basket?'], answer: 'Is there a bottle of water in the basket?', explanation: 'Use Is there + a bottle of water for one item.' },
    { type: 'choice', prompt: 'Choose the grammatically correct sentence.', options: ["There isn’t a can of tuna in the cupboard.", "There aren’t a can of tuna in the cupboard.", "There isn’t can of tuna in the cupboard."], answer: "There isn’t a can of tuna in the cupboard.", explanation: 'Use there isn’t + a can of tuna for one item.' },
    { type: 'choice', prompt: 'Choose the grammatically correct sentence.', options: ['There is a carton of milk in the fridge.', 'There are a carton of milk in the fridge.', 'There is carton of milk in the fridge.'], answer: 'There is a carton of milk in the fridge.', explanation: 'Use there is + a carton of milk.' },
    { type: 'choice', prompt: 'Choose the grammatically correct question.', options: ['Is there a jar of jam on the table?', 'Are there a jar of jam on the table?', 'Is there jar of jam on the table?'], answer: 'Is there a jar of jam on the table?', explanation: 'Use Is there + a jar of jam for one item.' },
    { type: 'choice', prompt: 'Choose the grammatically correct sentence.', options: ['There is a packet of flour by the bread.', 'There are a packet of flour by the bread.', 'There is packet of flour by the bread.'], answer: 'There is a packet of flour by the bread.', explanation: 'Use there is + a packet of flour.' },
    { type: 'choice', prompt: 'Choose the grammatically correct sentence.', options: ['There are two bars of chocolate in the bag.', 'There is two bars of chocolate in the bag.', 'There are two bar of chocolate in the bag.'], answer: 'There are two bars of chocolate in the bag.', explanation: 'Use there are and the plural bars after two.' },
    { type: 'choice', prompt: 'Choose the grammatically correct question.', options: ['Are there two bottles of water?', 'Is there two bottles of water?', 'Are there two bottle of water?'], answer: 'Are there two bottles of water?', explanation: 'Use Are there and plural bottles after two.' },
    { type: 'choice', prompt: 'Choose the grammatically correct sentence.', options: ['There are three cans of tuna on the shelf.', 'There is three cans of tuna on the shelf.', 'There are three can of tuna on the shelf.'], answer: 'There are three cans of tuna on the shelf.', explanation: 'Use there are and plural cans after three.' },
    { type: 'choice', prompt: 'Choose the grammatically correct question.', options: ['Are there two cartons of milk in the fridge?', 'Is there two cartons of milk in the fridge?', 'Are there two carton of milk in the fridge?'], answer: 'Are there two cartons of milk in the fridge?', explanation: 'Use Are there and plural cartons after two.' },
    { type: 'choice', prompt: 'Choose the grammatically correct sentence.', options: ['There are two jars of jam in the cupboard.', 'There is two jars of jam in the cupboard.', 'There are two jar of jam in the cupboard.'], answer: 'There are two jars of jam in the cupboard.', explanation: 'Use there are and plural jars after two.' },
    { type: 'choice', prompt: 'Choose the grammatically correct question.', options: ['Are there two packets of flour?', 'Is there two packets of flour?', 'Are there two packet of flour?'], answer: 'Are there two packets of flour?', explanation: 'Use Are there and plural packets after two.' },
    { type: 'choice', prompt: 'Complete the shop assistant’s sentence.', options: ['There is a bottle of water for you.', 'There are a bottle of water for you.', 'There is bottle water for you.'], answer: 'There is a bottle of water for you.', explanation: 'One bottle takes there is and the full phrase a bottle of water.' },
    { type: 'choice', prompt: 'Complete the shopping question correctly.', options: ['Is there a can of tuna in aisle four?', 'Are there a can of tuna in aisle four?', 'Is a can of tuna there aisle four?'], answer: 'Is there a can of tuna in aisle four?', explanation: 'Use Is there before one can of tuna.' },
    { type: 'choice', prompt: 'Choose the correct reply.', options: ['Yes, there is a jar of jam.', 'Yes, there are a jar of jam.', 'Yes, is there a jar of jam.'], answer: 'Yes, there is a jar of jam.', explanation: 'Use there is with one jar of jam.' },
    { type: 'choice', prompt: 'Choose the grammatically correct sentence.', options: ['There isn’t a packet of flour here.', 'There aren’t a packet of flour here.', 'There not a packet of flour here.'], answer: 'There isn’t a packet of flour here.', explanation: 'Use there isn’t with one packet.' },
    { type: 'choice', prompt: 'Choose the grammatically correct sentence.', options: ["There isn’t a carton of milk on the shelf.", "There aren’t a carton of milk on the shelf.", "There isn’t carton of milk on the shelf."], answer: "There isn’t a carton of milk on the shelf.", explanation: 'Use there isn’t + a carton of milk for one item.' },
    { type: 'choice', prompt: 'Choose the grammatically correct question.', options: ['Are there any bars of chocolate?', 'Is there any bars of chocolate?', 'Are there any bar of chocolate?'], answer: 'Are there any bars of chocolate?', explanation: 'Use Are there any with plural bars.' }
  ];

  const recallBank = PRODUCTS.flatMap((product) => {
    const distractors = PRODUCTS.filter((item) => item.id !== product.id).slice(0, 2).map((item) => item.label);
    return [
      { type: 'recallChoice', productId: product.id, prompt: 'Choose the full container phrase.', options: [product.label, ...distractors], answer: product.label },
      { type: 'recallInput', productId: product.id, prompt: 'Type the full container phrase.', answer: product.label },
      { type: 'recallChoice', productId: product.id, prompt: 'What is this product called in the lesson?', options: [product.label, ...distractors.reverse()], answer: product.label }
    ];
  });

  const ROUNDS = [
    { name: 'Meet the Words', icon: '◉', instruction: 'Tap the product to reveal and hear its label.', status: 'Label scanner online', theme: 'shop', guide: 'Tap the picture and listen carefully.', bank: meetBank },
    { name: 'Spelling Attack', icon: '⌁', instruction: 'Listen & Build! Hear the phrase and build it from mixed letters.', status: 'Spelling scanner online', theme: 'fridge', guide: 'Hear the phrase, then tap every letter in order.', bank: spellingBank },
    { name: 'Use It! · Basket Mission', icon: '▣', instruction: 'Drag or tap the correct products into the basket.', status: 'Packing lane online', theme: 'pack', guide: 'You can drag on a computer or tap on a phone.', bank: packBank },
    { name: 'Use It! · Sentence Mission', icon: '↔', instruction: 'Choose the one grammatically correct sentence.', status: 'Context scanner online', theme: 'ask', guide: 'Check there is, there are and the full phrase.', bank: useBank },
    { name: 'Recall Challenge', icon: '★', instruction: 'Listen and type every container phrase correctly in a row.', status: 'Memory scanner online', theme: 'boss', guide: 'Listen Again is safe. One spelling mistake restarts Recall.', bank: recallBank }
  ];

  window.CONTAINERS_CHALLENGE_DATA = { products: PRODUCTS, rounds: ROUNDS };
  if (typeof document === 'undefined') return;

  const STORAGE_KEY = 'englishQuestLab.progress.v1';
  const GAME_KEY = 'containersChallengeVocabulary';
  const TASKS_PER_ROUND = 5;
  const SPARKS_PER_TASK = 10;
  const TOTAL_TASKS = 25;
  const ZIGGY = {
    thinking: 'assets/characters/ziggy-tricky.png',
    correct: 'assets/characters/ziggy-surprised.png',
    happy: 'assets/characters/ziggy-happy.png'
  };

  const elements = {
    intro: document.querySelector('[data-intro]'), game: document.querySelector('[data-game]'), result: document.querySelector('[data-result]'),
    start: document.querySelector('[data-start]'), playAgain: document.querySelector('[data-play-again]'), sparks: document.querySelector('[data-sparks]'),
    bestScore: document.querySelector('[data-best-score]'), roundLabel: document.querySelector('[data-round-label]'), taskLabel: document.querySelector('[data-task-label]'),
    progressTrack: document.querySelector('.progress-track'), progress: document.querySelector('[data-progress]'), roundDots: document.querySelector('[data-round-dots]'),
    challenge: document.querySelector('[data-challenge]'), roundIcon: document.querySelector('[data-round-icon]'), roundName: document.querySelector('[data-round-name]'),
    instruction: document.querySelector('[data-instruction]'), sceneStatus: document.querySelector('[data-scene-status]'), taskArea: document.querySelector('[data-task-area]'),
    feedback: document.querySelector('[data-feedback]'), reset: document.querySelector('[data-reset]'), check: document.querySelector('[data-check]'), next: document.querySelector('[data-next]'),
    guideImage: document.querySelector('[data-guide-image]'), guideMessage: document.querySelector('[data-guide-message]'), energy: document.querySelector('[data-energy]'),
    energyLabel: document.querySelector('[data-energy-label]'), sparkShower: document.querySelector('[data-spark-shower]'), finalScore: document.querySelector('[data-final-score]'),
    finalCorrect: document.querySelector('[data-final-correct]'), savedSparks: document.querySelector('[data-saved-sparks]'), finalBest: document.querySelector('[data-final-best]'),
    resultMessage: document.querySelector('[data-result-message]')
  };

  let state = {};
  let guideTimer;

  const shuffle = (items) => {
    const copy = [...items];
    for (let index = copy.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
    }
    return copy;
  };
  const escapeHtml = (value) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
  const normalize = (value) => window.VOCABULARY_NORMALIZE_ANSWER(value).replace(/[’‘]/g, "'").replace(/[,.?!]+/g, '');
  const sound = (name, token) => window.ENGLISH_QUEST_MUSIC?.playEffect(name, token);

  const loadProgress = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (saved && typeof saved === 'object') {
        saved.games = saved.games && typeof saved.games === 'object' ? saved.games : {};
        saved.brainSparks = Number(saved.brainSparks) || 0;
        return saved;
      }
    } catch (error) { console.warn('Could not read Containers Challenge progress.', error); }
    return { brainSparks: 0, games: {} };
  };
  const saveProgress = (progress) => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)); }
    catch (error) { console.warn('Could not save Containers Challenge progress.', error); }
  };
  const getBestScore = () => Number(loadProgress().games[GAME_KEY]?.bestScore) || 0;
  const updateBestLabel = () => {
    const best = getBestScore();
    elements.bestScore.hidden = best === 0;
    elements.bestScore.querySelector('strong').textContent = String(best);
  };

  const selectDistinctProducts = (bank, count) => shuffle(PRODUCTS).slice(0, count).map((product) => shuffle(bank.filter((task) => task.productId === product.id))[0]);
  const selectRecallTasks = () => {
    const products = shuffle(PRODUCTS).slice(0, 5);
    return products.map((product) => shuffle(recallBank.filter((task) => task.productId === product.id && task.type === 'recallInput'))[0]);
  };
  const selectRounds = () => [selectDistinctProducts(meetBank, 5), selectDistinctProducts(spellingBank, 5), shuffle(packBank).slice(0, 5), shuffle(useBank).slice(0, 5), selectRecallTasks()];
  const currentRound = () => ROUNDS[state.roundIndex];
  const currentTask = () => state.selectedRounds[state.roundIndex][state.taskIndex];
  const prepareContainerRecall = () => {
    const previousOrder = state.selectedRounds[4]?.map((task) => task.productId).join('|');
    let nextOrder = selectRecallTasks();
    if (previousOrder && nextOrder.map((task) => task.productId).join('|') === previousOrder) nextOrder = [...nextOrder.slice(1), nextOrder[0]];
    state.selectedRounds[4] = nextOrder; state.taskIndex = 0; state.recallAttempts += 1;
  };

  const updateGuide = (source, alt, message) => {
    window.clearTimeout(guideTimer);
    elements.guideMessage.textContent = message;
    if (elements.guideImage.getAttribute('src') === source) { elements.guideImage.alt = alt; return; }
    elements.guideImage.classList.add('is-changing');
    guideTimer = window.setTimeout(() => { elements.guideImage.src = source; elements.guideImage.alt = alt; elements.guideImage.classList.remove('is-changing'); }, 140);
  };
  const speak = (text, audioUrl = '') => window.VOCABULARY_AUDIO?.play(text, audioUrl);
  const fireSparks = () => {
    elements.sparkShower.innerHTML = '';
    for (let index = 0; index < 14; index += 1) {
      const spark = document.createElement('span'); spark.className = 'spark-particle';
      spark.style.setProperty('--spark-x', `${30 + Math.random() * 45}%`); spark.style.setProperty('--spark-y', `${38 + Math.random() * 28}%`);
      spark.style.setProperty('--spark-size', `${5 + Math.random() * 6}px`); spark.style.setProperty('--spark-dx', `${-80 + Math.random() * 160}px`); spark.style.setProperty('--spark-dy', `${-95 + Math.random() * 55}px`);
      elements.sparkShower.append(spark);
    }
    window.setTimeout(() => { elements.sparkShower.innerHTML = ''; }, 900);
  };
  const updateEnergy = (completed) => {
    const percent = Math.round((completed / TOTAL_TASKS) * 100);
    elements.energy.style.width = `${percent}%`; elements.energyLabel.textContent = `${percent}%`;
  };
  const renderProgress = () => {
    const completed = state.roundIndex * TASKS_PER_ROUND + state.taskIndex;
    elements.roundLabel.textContent = `Round ${state.roundIndex + 1} of 5`; elements.taskLabel.textContent = `Task ${state.taskIndex + 1} of 5`;
    elements.progress.style.width = `${(completed / TOTAL_TASKS) * 100}%`; elements.progressTrack.setAttribute('aria-valuenow', String(completed));
    elements.roundDots.innerHTML = ROUNDS.map((round, index) => `<span class="round-dot${index < state.roundIndex ? ' is-done' : index === state.roundIndex ? ' is-current' : ''}" title="${escapeHtml(round.name)}"></span>`).join('');
    updateEnergy(completed);
  };

  const productArt = (product) => `<img class="product-art ${product.className}" src="${product.image}" alt="" width="900" height="900" aria-hidden="true">`;
  const productButton = (product, options = {}) => `<button class="product-card${options.className ? ` ${options.className}` : ''}${options.target ? ' is-target' : ''}" type="button" data-product-id="${product.id}"${options.draggable ? ' draggable="true"' : ''} aria-label="${escapeHtml(product.label)}">${productArt(product)}<span class="product-label">${escapeHtml(product.label)}</span></button>`;
  const renderShelf = ({ showLabels = true, draggable = false } = {}) => `<div class="container-scene${showLabels ? '' : ' labels-hidden'}"><div class="shelf-header"><span>Neon supermarket shelf</span><small>6 products · complete display</small></div><div class="product-grid">${PRODUCTS.map((product) => productButton(product, { draggable })).join('')}</div></div>`;
  const showFeedback = (correct, title, message) => {
    elements.feedback.className = `feedback ${correct ? 'correct' : 'wrong'}`;
    elements.feedback.innerHTML = `<strong>${escapeHtml(title)}</strong><p>${escapeHtml(message)}</p>`;
    elements.feedback.hidden = false;
  };
  const markMistake = (message) => {
    state.firstAttempt = false;
    updateGuide(ZIGGY.thinking, 'Ziggy looking tricky', 'Not that one—try again!');
    showFeedback(false, 'Try again', message);
  };
  const completeTask = (message, { award = true } = {}) => {
    if (state.answered) return;
    state.answered = true;
    const awarded = state.firstAttempt && award;
    if (awarded) {
      state.score += SPARKS_PER_TASK; state.correctFirst += 1; elements.sparks.textContent = String(state.score); fireSparks();
    }
    elements.challenge.classList.add('is-correct');
    updateGuide(ZIGGY.correct, 'Ziggy surprised and impressed', state.firstAttempt ? 'No way! First try!' : 'You found it! Nice recovery!');
    updateEnergy(state.roundIndex * TASKS_PER_ROUND + state.taskIndex + 1);
    showFeedback(true, awarded ? '+10 Brain Sparks!' : 'Correct!', message);
    elements.check.hidden = true; elements.reset.hidden = true; elements.next.disabled = false; elements.next.focus({ preventScroll: true });
  };

  const renderMeet = (task) => {
    const product = PRODUCT_MAP[task.productId];
    elements.taskArea.innerHTML = `<p class="round-prompt">${escapeHtml(task.prompt)}</p><div class="spotlight-wrap labels-hidden">${productButton(product, { className: 'spotlight-product' })}</div><p class="listen-hint"><span>Tap once</span> to reveal the phrase and hear it aloud.</p>`;
    elements.taskArea.querySelector('[data-product-id]').addEventListener('click', (event) => {
      event.currentTarget.classList.add('is-revealed', 'is-correct');
      event.currentTarget.closest('.labels-hidden').classList.remove('labels-hidden');
      speak(product.label, product.audio);
      completeTask(`This is ${product.label}.`);
    }, { once: true });
  };

  const renderFind = (task) => {
    elements.taskArea.innerHTML = `<p class="round-prompt">${escapeHtml(task.prompt)}</p>${renderShelf({ showLabels: false })}`;
    elements.taskArea.querySelectorAll('[data-product-id]').forEach((button) => button.addEventListener('click', () => {
      if (state.answered) return;
      if (button.dataset.productId === task.productId) {
        button.classList.add('is-revealed', 'is-correct');
        speak(PRODUCT_MAP[task.productId].label, PRODUCT_MAP[task.productId].audio);
        completeTask(`Correct: ${PRODUCT_MAP[task.productId].label}.`);
      } else {
        button.classList.remove('is-wrong'); void button.offsetWidth; button.classList.add('is-wrong');
        markMistake(`That picture is ${PRODUCT_MAP[button.dataset.productId].label}. Look for ${PRODUCT_MAP[task.productId].label}.`);
      }
    }));
  };

  const renderSpellingLetters = (task) => {
    const product = PRODUCT_MAP[task.productId];
    state.spellingSelection = [];
    const letters = shuffle([...task.answer].map((letter, index) => ({ letter, index })));
    const drawAnswer = () => {
      const lane = elements.taskArea.querySelector('[data-spelling-answer]');
      lane.innerHTML = state.spellingSelection.map((index) => `<button type="button" class="spelling-letter is-answer" data-remove-letter="${index}">${escapeHtml([...task.answer][index])}</button>`).join('');
      elements.taskArea.querySelectorAll('[data-letter-index]').forEach((button) => button.classList.toggle('is-used', state.spellingSelection.includes(Number(button.dataset.letterIndex))));
      elements.check.disabled = state.spellingSelection.length !== task.answer.length;
      lane.querySelectorAll('[data-remove-letter]').forEach((button) => button.addEventListener('click', () => {
        if (state.answered) return;
        const index = state.spellingSelection.lastIndexOf(Number(button.dataset.removeLetter));
        if (index >= 0) state.spellingSelection.splice(index, 1);
        drawAnswer();
      }));
    };
    elements.taskArea.innerHTML = `<div class="spelling-card"><div class="spelling-picture">${productArt(product)}</div><div class="spelling-work"><p class="round-prompt">${escapeHtml(task.prompt)}</p><div class="spelling-answer-lane" data-spelling-answer aria-label="Your spelling"></div><div class="spelling-letter-bank">${letters.map(({ letter, index }) => `<button type="button" class="spelling-letter" data-letter-index="${index}">${escapeHtml(letter)}</button>`).join('')}</div></div></div>`;
    elements.taskArea.querySelectorAll('[data-letter-index]').forEach((button) => button.addEventListener('click', () => {
      if (state.answered || state.spellingSelection.includes(Number(button.dataset.letterIndex))) return;
      state.spellingSelection.push(Number(button.dataset.letterIndex));
      drawAnswer();
    }));
    elements.reset.hidden = false; elements.reset.textContent = 'Clear Letters'; elements.check.hidden = false; elements.check.disabled = true; elements.check.textContent = 'Check Spelling';
    elements.reset.onclick = () => { state.spellingSelection = []; drawAnswer(); };
    elements.check.onclick = () => {
      const answer = state.spellingSelection.map((index) => [...task.answer][index]).join('');
      if (normalize(answer) === normalize(task.answer)) completeTask(`Correct spelling: ${task.answer}.`);
      else { markMistake('The letters are not in the correct order yet. Change them and try again.'); state.spellingSelection = []; drawAnswer(); }
    };
  };

  const renderSpellingInput = (task) => {
    const product = PRODUCT_MAP[task.productId];
    elements.taskArea.innerHTML = `<div class="spelling-card"><div class="spelling-picture">${productArt(product)}</div><div class="spelling-work"><p class="round-prompt">${escapeHtml(task.prompt)}</p><label class="sr-only" for="spelling-answer">Spelling answer</label><input class="text-answer" id="spelling-answer" type="text" autocomplete="off" autocapitalize="none" placeholder="Type your answer" maxlength="60"><p class="answer-hint">${escapeHtml(task.hint)}</p></div></div>`;
    const input = elements.taskArea.querySelector('input');
    const check = () => {
      if (state.answered) return;
      if (normalize(input.value) === normalize(task.answer)) { input.disabled = true; speak(task.answer, product.audio); completeTask(`Correct spelling: ${task.answer}.`); }
      else { markMistake('Check every letter and try again.'); input.select(); }
    };
    elements.check.hidden = false; elements.check.disabled = true; elements.check.textContent = 'Check Answer';
    input.addEventListener('input', () => { elements.check.disabled = input.value.trim().length === 0; });
    input.addEventListener('keydown', (event) => { if (event.key === 'Enter' && input.value.trim()) check(); });
    elements.check.onclick = check;
    window.setTimeout(() => input.focus(), 0);
  };

  const renderListenBuild = (task) => {
    const product = PRODUCT_MAP[task.productId];
    const listenBuild = window.VOCABULARY_LISTEN_BUILD;
    elements.taskArea.innerHTML = `<div class="spelling-card"><div class="spelling-picture"><img class="listen-build-picture" src="${product.image}" alt="Container product illustration" width="900" height="900"></div><div class="spelling-work"><p class="round-prompt">${escapeHtml(task.prompt)}</p><div data-listen-build-host></div></div></div>`;
    elements.check.hidden = false; elements.check.disabled = true; elements.check.textContent = 'Check Answer';
    let builder;
    let spellingLocked = false;
    builder = listenBuild.mount(elements.taskArea.querySelector('[data-listen-build-host]'), task.answer, { audioUrl: product.audio, onChange: (complete) => { elements.check.disabled = spellingLocked || !complete; }, onLockChange: (locked) => { spellingLocked = locked; elements.check.disabled = locked || !builder.isComplete(); } });
    elements.check.onclick = () => {
      if (state.answered || builder.isLocked()) return;
      if (normalize(builder.value()) === normalize(task.answer)) {
        builder.reveal(); sound('correct', `containers:spelling:${task.answer}:correct`); speak(task.answer, product.audio); completeTask(`Correct spelling: ${task.answer}.`);
      } else {
        sound('incorrect', `containers:spelling:${task.answer}:incorrect`); markMistake('Not quite! Look and remember.'); builder.startMemoryRetry();
      }
    };
    window.VOCABULARY_AUDIO.schedule(task.answer, product.audio);
  };

  const basketMatches = (needs) => {
    const expected = Object.fromEntries(PRODUCTS.map((product) => [product.id, 0]));
    needs.forEach((need) => { expected[need.id] = need.count; });
    return PRODUCTS.every((product) => (state.basket[product.id] || 0) === expected[product.id]);
  };
  const renderBasketItems = () => {
    const basketItems = elements.taskArea.querySelector('[data-basket-items]');
    basketItems.innerHTML = PRODUCTS.flatMap((product) => Array.from({ length: state.basket[product.id] || 0 }, () => `<button class="basket-chip" type="button" data-remove-product="${product.id}" title="Remove one ${escapeHtml(product.label)}" aria-label="Remove one ${escapeHtml(product.label)}"><img src="${product.image}" alt="" width="900" height="900"></button>`)).join('');
    basketItems.querySelectorAll('[data-remove-product]').forEach((button) => button.addEventListener('click', () => {
      const id = button.dataset.removeProduct; state.basket[id] -= 1; if (state.basket[id] <= 0) delete state.basket[id]; renderBasketItems();
    }));
    elements.check.disabled = Object.keys(state.basket).length === 0;
  };
  const addToBasket = (id) => { if (state.answered) return; state.basket[id] = (state.basket[id] || 0) + 1; renderBasketItems(); };
  const renderPack = (task) => {
    state.basket = {};
    elements.taskArea.innerHTML = `<p class="round-prompt">${escapeHtml(task.prompt)}</p><div class="packing-layout">${renderShelf({ showLabels: true, draggable: true })}<div class="basket-zone" data-basket><span class="basket-title">Your basket</span><div class="basket-items" data-basket-items></div><p class="basket-hint">Drag products here, or tap them. Tap a basket product to remove one.</p></div></div>`;
    const basket = elements.taskArea.querySelector('[data-basket]');
    elements.taskArea.querySelectorAll('[draggable="true"]').forEach((button) => {
      button.addEventListener('dragstart', (event) => { event.dataTransfer.setData('text/plain', button.dataset.productId); button.classList.add('is-dragging'); });
      button.addEventListener('dragend', () => button.classList.remove('is-dragging'));
      button.addEventListener('click', () => addToBasket(button.dataset.productId));
    });
    basket.addEventListener('dragover', (event) => { event.preventDefault(); basket.classList.add('is-over'); });
    basket.addEventListener('dragleave', () => basket.classList.remove('is-over'));
    basket.addEventListener('drop', (event) => { event.preventDefault(); basket.classList.remove('is-over'); const id = event.dataTransfer.getData('text/plain'); if (PRODUCT_MAP[id]) addToBasket(id); });
    elements.reset.hidden = false; elements.reset.textContent = 'Empty Basket'; elements.check.hidden = false; elements.check.disabled = true; elements.check.textContent = 'Check Basket';
    elements.reset.onclick = () => { state.basket = {}; renderBasketItems(); };
    elements.check.onclick = () => {
      if (basketMatches(task.needs)) completeTask('Your basket matches the shopping clue exactly.');
      else markMistake('The basket does not match the requested products or quantities. Empty it or tap labels to remove items, then try again.');
    };
  };

  const renderChoice = (task, recall = false) => {
    const product = recall ? PRODUCT_MAP[task.productId] : null;
    elements.taskArea.innerHTML = recall
      ? `<div class="recall-card"><div class="recall-image">${productArt(product)}</div><div class="recall-copy"><p class="round-prompt">${escapeHtml(task.prompt)}</p><div class="option-grid sentences">${shuffle(task.options).map((option) => `<button class="option-button" type="button" data-option="${escapeHtml(option)}">${escapeHtml(option)}</button>`).join('')}</div></div></div>`
      : `${renderShelf({ showLabels: true })}<p class="round-prompt">${escapeHtml(task.prompt)}</p><div class="option-grid sentences">${shuffle(task.options).map((option) => `<button class="option-button" type="button" data-option="${escapeHtml(option)}">${escapeHtml(option)}</button>`).join('')}</div>`;
    elements.taskArea.querySelectorAll('[data-option]').forEach((button) => button.addEventListener('click', () => {
      if (state.answered) return;
      if (normalize(button.dataset.option) === normalize(task.answer)) {
        button.classList.add('is-correct'); speak(recall ? task.answer : 'Correct', recall ? product.audio : ''); completeTask(recall ? `The phrase is ${task.answer}.` : task.explanation);
      } else {
        button.classList.add('is-wrong'); button.disabled = true; markMistake(recall ? 'That phrase belongs to a different product. Look at the illustration again.' : 'That option does not follow the target grammar pattern.');
      }
    }));
  };

  const renderRecallInput = (task) => {
    const product = PRODUCT_MAP[task.productId];
    const audio = window.VOCABULARY_AUDIO;
    elements.taskArea.innerHTML = `<div class="strict-recall-card"><div class="strict-recall-picture"><img src="${product.image}" alt="Container product illustration" width="900" height="900"></div><div class="recall-audio-controls">${audio.buttonMarkup()}</div><label class="sr-only" for="recall-answer">Type the phrase you hear</label><input class="text-answer" id="recall-answer" type="text" autocomplete="off" autocapitalize="none" spellcheck="false" maxlength="60"></div>`;
    const input = elements.taskArea.querySelector('input'); elements.check.hidden = false; elements.check.disabled = true; elements.check.textContent = 'Check Answer';
    elements.taskArea.querySelector('[data-listen-again]').addEventListener('click', () => audio.play(task.answer, product.audio));
    input.addEventListener('input', () => { elements.check.disabled = input.value.trim().length === 0; });
    const check = () => {
      if (state.answered) return;
      if (normalize(input.value) === normalize(task.answer)) {
        input.disabled = true;
        const award = !state.recallAwarded.has(task.productId); state.recallAwarded.add(task.productId);
        completeTask('Correct. Keep the streak going!', { award });
        return;
      }
      audio.stop(); state.firstAttempt = false; state.answered = true; input.disabled = true;
      updateGuide(ZIGGY.thinking, 'Ziggy looking tricky', 'One mistake ends this Recall attempt.');
      showFeedback(false, 'Recall attempt ended', 'Your earlier stages and Brain Sparks are safe. Try Recall again from task 1.');
      elements.check.hidden = true; elements.next.disabled = true;
      const restart = document.createElement('button'); restart.type = 'button'; restart.className = 'primary-button recall-restart'; restart.textContent = 'Try Again';
      restart.addEventListener('click', () => { prepareContainerRecall(); renderTask(); }); elements.taskArea.append(restart); restart.focus({ preventScroll: true });
    };
    elements.check.onclick = check;
    input.addEventListener('keydown', (event) => { if (event.key === 'Enter' && input.value.trim()) check(); });
    window.setTimeout(() => input.focus(), 0); audio.schedule(task.answer, product.audio);
  };

  const renderTask = () => {
    window.VOCABULARY_AUDIO?.stop();
    window.VOCABULARY_LISTEN_BUILD?.destroyActive();
    const round = currentRound(); const task = currentTask();
    state.answered = false; state.firstAttempt = true; state.basket = {};
    elements.feedback.hidden = true; elements.feedback.className = 'feedback'; elements.feedback.innerHTML = '';
    elements.reset.hidden = true; elements.check.hidden = true; elements.check.disabled = false; elements.check.textContent = 'Check Answer'; elements.next.disabled = true;
    elements.next.textContent = state.roundIndex === 4 && state.taskIndex === 4 ? 'See Results' : 'Next';
    elements.challenge.classList.remove('is-correct', 'is-wrong'); elements.game.dataset.roundTheme = round.theme;
    elements.roundIcon.textContent = round.icon; elements.roundName.textContent = round.name; elements.instruction.textContent = round.instruction; elements.sceneStatus.textContent = round.status;
    updateGuide(ZIGGY.thinking, 'Ziggy looking tricky', round.guide); renderProgress();
    if (task.type === 'meet') renderMeet(task);
    if (task.type === 'find') renderFind(task);
    if (task.type === 'spellLetters') renderSpellingLetters(task);
    if (task.type === 'spellInput') renderSpellingInput(task);
    if (task.type === 'listenBuild') renderListenBuild(task);
    if (task.type === 'pack') renderPack(task);
    if (task.type === 'choice') renderChoice(task);
    if (task.type === 'recallInput') renderRecallInput(task);
  };

  const nextTask = () => {
    if (!state.answered) return;
    if (state.taskIndex < 4) { state.taskIndex += 1; renderTask(); return; }
    if (state.roundIndex < 4) { state.roundIndex += 1; state.taskIndex = 0; if (state.roundIndex === 4) prepareContainerRecall(); renderTask(); return; }
    finishGame();
  };
  const startGame = () => {
    state = { roundIndex: 0, taskIndex: 0, score: 0, correctFirst: 0, answered: false, firstAttempt: true, basket: {}, selectedRounds: selectRounds(), recallAttempts: 0, recallAwarded: new Set() };
    elements.sparks.textContent = '0'; elements.intro.hidden = true; elements.result.hidden = true; elements.game.hidden = false; renderTask();
    window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  };
  const finishGame = () => {
    window.VOCABULARY_AUDIO?.stop();
    const progress = loadProgress(); const previous = progress.games[GAME_KEY] || {}; const oldBest = Number(previous.bestScore) || 0;
    const newBest = Math.max(oldBest, state.score); const newlySaved = newBest - oldBest;
    progress.brainSparks = (Number(progress.brainSparks) || 0) + newlySaved;
    progress.games[GAME_KEY] = { ...previous, bestScore: newBest, bestCorrect: Math.max(Number(previous.bestCorrect) || 0, state.correctFirst), maxQuestions: TOTAL_TASKS, plays: (Number(previous.plays) || 0) + 1, completed: true, lastScore: state.score, completedAt: new Date().toISOString() };
    saveProgress(progress); elements.game.hidden = true; elements.result.hidden = false;
    elements.finalScore.textContent = String(state.score); elements.finalCorrect.textContent = `${state.correctFirst} / 25`; elements.savedSparks.textContent = `+${newlySaved}`; elements.finalBest.textContent = `${newBest} / 250`;
    elements.resultMessage.textContent = state.score >= 220 ? 'Ziggy says: “No way! You know every container phrase!”' : state.score >= 150 ? 'Ziggy says: “Great packing! Try again for a perfect shelf.”' : 'Ziggy says: “Good start! Listen, look and pack the shelf again.”';
    updateGuide(ZIGGY.happy, 'Ziggy happy', 'Challenge complete!'); updateBestLabel(); window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  elements.start.addEventListener('click', startGame); elements.playAgain.addEventListener('click', startGame); elements.next.addEventListener('click', nextTask);
  updateBestLabel();
})();
