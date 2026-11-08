(() => {
  'use strict';

  const config = window.FOOD_QUEST_CONFIG;
  if (!config) return;

  const STORAGE_KEY = 'englishQuestLab.progress.v1';
  const TASKS_PER_ROUND = 5;
  const SPARKS_PER_TASK = 10;
  const TOTAL_TASKS = 25;

  if (!Array.isArray(config.rounds) || config.rounds.length !== 5) {
    throw new Error(`${config.gameKey}: exactly five rounds are required.`);
  }
  config.rounds.forEach((round, index) => {
    if (!Array.isArray(round.bank) || round.bank.length < 15) {
      throw new Error(`${config.gameKey}: round ${index + 1} needs at least 15 tasks.`);
    }
  });

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
    board: document.querySelector('[data-game]'),
    roundIcon: document.querySelector('[data-round-icon]'),
    roundName: document.querySelector('[data-round-name]'),
    instruction: document.querySelector('[data-instruction]'),
    sceneStatus: document.querySelector('[data-scene-status]'),
    taskArea: document.querySelector('[data-task-area]'),
    feedback: document.querySelector('[data-feedback]'),
    reset: document.querySelector('[data-reset]'),
    check: document.querySelector('[data-check]'),
    next: document.querySelector('[data-next]'),
    guideImage: document.querySelector('[data-guide-image]'),
    guideName: document.querySelector('[data-guide-name]'),
    guideStatus: document.querySelector('[data-guide-status]'),
    guideMessage: document.querySelector('[data-guide-message]'),
    energy: document.querySelector('[data-energy]'),
    energyLabel: document.querySelector('[data-energy-label]'),
    sparkShower: document.querySelector('[data-spark-shower]'),
    finalScore: document.querySelector('[data-final-score]'),
    finalCorrect: document.querySelector('[data-final-correct]'),
    savedSparks: document.querySelector('[data-saved-sparks]'),
    finalBest: document.querySelector('[data-final-best]'),
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
    .replace(/[,.?!]+/g, '');

  const formatOrderAnswer = (words) => {
    const answer = words.join(' ').trim();
    return /^(?:Yes|No)\b/i.test(answer)
      ? `${answer.replace(/^(Yes|No)\b/i, '$1,')}.`
      : answer;
  };

  const refreshOrderPunctuation = () => {
    const task = currentTask();
    const isShortAnswer = /^(?:Yes|No),/i.test(task.answer || '');
    const selectedButtons = [...elements.taskArea.querySelectorAll('[data-selected-index]')];
    const isComplete = selectedButtons.length === task.words.length;
    selectedButtons.forEach((button, position) => {
      const word = task.words[Number(button.dataset.selectedIndex)];
      button.textContent = isShortAnswer
        ? `${position === 0 ? `${word},` : word}${isComplete && position === selectedButtons.length - 1 ? '.' : ''}`
        : word;
    });
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
      console.warn(`Could not read ${config.title} progress.`, error);
    }
    return { brainSparks: 0, games: {} };
  };

  const saveProgress = (progress) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (error) {
      console.warn(`Could not save ${config.title} progress.`, error);
    }
  };

  const getBestScore = () => Number(loadProgress().games[config.gameKey]?.bestScore) || 0;

  const updateBestLabel = () => {
    const best = getBestScore();
    elements.bestScore.hidden = best === 0;
    elements.bestScore.querySelector('strong').textContent = String(best);
  };

  const allGuideImages = [...new Set(config.rounds.flatMap((round) => [round.guide.think, round.guide.happy, round.guide.wrong]))];
  allGuideImages.forEach((source) => {
    const image = new Image();
    image.src = source;
  });

  const updateGuide = (source, alt, name, message) => {
    window.clearTimeout(guideTimer);
    elements.guideName.textContent = name;
    elements.guideStatus.textContent = `${name} online`;
    elements.guideMessage.textContent = message;
    if (elements.guideImage.getAttribute('src') === source) {
      elements.guideImage.alt = alt;
      return;
    }
    elements.guideImage.classList.add('is-changing');
    guideTimer = window.setTimeout(() => {
      elements.guideImage.src = source;
      elements.guideImage.alt = alt;
      elements.guideImage.classList.remove('is-changing');
    }, 140);
  };

  const currentRound = () => config.rounds[state.roundIndex];
  const currentTask = () => state.selectedRounds[state.roundIndex][state.taskIndex];

  const updateEnergy = (completed) => {
    const percent = Math.round((completed / TOTAL_TASKS) * 100);
    elements.energy.style.width = `${percent}%`;
    elements.energyLabel.textContent = `${percent}%`;
  };

  const renderProgress = () => {
    const completed = state.roundIndex * TASKS_PER_ROUND + state.taskIndex;
    elements.roundLabel.textContent = `Round ${state.roundIndex + 1} of ${config.rounds.length}`;
    elements.taskLabel.textContent = `Task ${state.taskIndex + 1} of ${TASKS_PER_ROUND}`;
    elements.progress.style.width = `${(completed / TOTAL_TASKS) * 100}%`;
    elements.progressTrack.setAttribute('aria-valuenow', String(completed));
    elements.roundDots.innerHTML = config.rounds.map((round, index) => {
      const className = index < state.roundIndex ? ' is-done' : index === state.roundIndex ? ' is-current' : '';
      return `<span class="round-dot${className}" title="Round ${index + 1}: ${escapeHtml(round.name)}"></span>`;
    }).join('');
    updateEnergy(completed);
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
    window.setTimeout(() => { elements.sparkShower.innerHTML = ''; }, 900);
  };

  const sentencePrompt = (prompt) => escapeHtml(prompt)
    .replaceAll('___', '<span class="blank">___</span>')
    .replaceAll('\n', '<br>');

  const shelfProductMap = new Map((window.SUPERMARKET_SHELF?.products || []).map((product) => [product.id, product]));

  const shelfInstances = (scene) => scene.products.flatMap((product) => Array.from(
    { length: Number(scene.inventory[product.id]) || 0 },
    (_, index) => ({ ...product, instanceId: `${product.id}-${index + 1}` })
  ));

  const shelfProductArt = (product) => `<img class="shelf-product-art" src="${escapeHtml(product.image)}" alt="" aria-hidden="true">`;

  const renderInteractiveShelf = (scene, interactive = false, showLabels = false) => {
    const tag = interactive ? 'button' : 'div';
    const controls = shelfInstances(scene).map((product) => `<${tag} class="shelf-instance"${interactive ? ' type="button"' : ''} data-product-id="${escapeHtml(product.id)}" data-instance-id="${escapeHtml(product.instanceId)}" aria-label="${escapeHtml(product.label)}">${shelfProductArt(product)}<span class="shelf-instance-label">${escapeHtml(product.label)}</span></${tag}>`).join('');
    return `<div class="interactive-shelf${showLabels ? '' : ' labels-hidden'}" role="group" aria-label="${escapeHtml(scene.label)}"><div class="interactive-shelf-header"><span>${escapeHtml(scene.title)}</span><small>${escapeHtml(scene.zone)} · every item shown separately</small></div><div class="shelf-instance-grid">${controls}</div></div>`;
  };

  const renderScene = (scene, showShelfLabels = false) => {
    if (!scene) return '';
    if (Array.isArray(scene.products) && scene.inventory) return renderInteractiveShelf(scene, false, showShelfLabels);
    return `<div class="visual-scene" role="img" aria-label="${escapeHtml(scene.label)}">
      <div class="scene-header"><span>${escapeHtml(scene.title)}</span><span>${escapeHtml(scene.zone || 'visual clue')}</span></div>
      <div class="scene-items">${scene.items.map((item) => `<div class="scene-item"><b aria-hidden="true">${escapeHtml(item.emoji)}</b><span>${escapeHtml(item.label)}</span>${item.count === undefined ? '' : `<i>×${escapeHtml(item.count)}</i>`}</div>`).join('')}</div>
      ${scene.note ? `<p class="scene-note">${escapeHtml(scene.note)}</p>` : ''}
    </div>`;
  };

  const renderChoice = (task) => {
    elements.taskArea.innerHTML = `${renderScene(task.scene, false)}<p class="prompt">${sentencePrompt(task.prompt)}</p><div class="option-grid${task.longOptions ? ' sentences' : ''}">${shuffle(task.options).map((option) => `<button class="option-button" type="button" data-option="${escapeHtml(option)}">${escapeHtml(option)}</button>`).join('')}</div>`;
    elements.taskArea.querySelectorAll('[data-option]').forEach((button) => {
      button.addEventListener('click', () => submitAnswer(button.dataset.option, button));
    });
  };

  const renderOrder = (task) => {
    state.orderSelection = [];
    const words = shuffle(task.words.map((word, index) => ({ word, index })));
    elements.taskArea.innerHTML = `${renderScene(task.scene)}${task.givenAnswer ? `<div class="ziggy-answer-clue"><span>Ziggy’s answer</span><strong>${escapeHtml(task.givenAnswer)}</strong></div>` : ''}<p class="prompt">${sentencePrompt(task.prompt || 'Build the sentence.')}</p><div class="answer-lane" data-answer-lane></div><div class="word-bank">${words.map(({ word, index }) => `<button class="word-button" type="button" data-word-index="${index}">${escapeHtml(word)}</button>`).join('')}</div>`;
    if (task.focusProductId) elements.taskArea.querySelectorAll(`[data-product-id="${task.focusProductId}"]`).forEach((item) => item.classList.add('is-evidence-target'));
    elements.taskArea.querySelectorAll('[data-word-index]').forEach((button) => {
      button.addEventListener('click', () => addWord(Number(button.dataset.wordIndex), button));
    });
    elements.reset.hidden = false;
    elements.check.hidden = false;
    elements.check.disabled = true;
  };

  const addWord = (index, sourceButton) => {
    if (state.answered || state.orderSelection.includes(index)) return;
    state.orderSelection.push(index);
    sourceButton.classList.add('is-used');
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'word-button';
    button.dataset.selectedIndex = String(index);
    button.textContent = currentTask().words[index];
    button.addEventListener('click', () => removeWord(index));
    elements.taskArea.querySelector('[data-answer-lane]').append(button);
    refreshOrderPunctuation();
    elements.check.disabled = state.orderSelection.length !== currentTask().words.length;
  };

  const removeWord = (index) => {
    if (state.answered) return;
    state.orderSelection = state.orderSelection.filter((item) => item !== index);
    elements.taskArea.querySelector(`[data-selected-index="${index}"]`)?.remove();
    elements.taskArea.querySelector(`[data-word-index="${index}"]`)?.classList.remove('is-used');
    refreshOrderPunctuation();
    elements.check.disabled = true;
  };

  const clearOrder = () => {
    if (state.answered) return;
    state.orderSelection = [];
    elements.taskArea.querySelector('[data-answer-lane]').innerHTML = '';
    elements.taskArea.querySelectorAll('[data-word-index]').forEach((button) => button.classList.remove('is-used'));
    elements.check.disabled = true;
  };

  const renderInput = (task) => {
    elements.taskArea.innerHTML = `${renderScene(task.scene)}<p class="prompt">${sentencePrompt(task.prompt)}</p><label class="sr-only" for="quest-answer">Your answer</label><input class="text-answer" id="quest-answer" type="text" autocomplete="off" autocapitalize="sentences" placeholder="Type your answer" maxlength="120"><p class="answer-hint">Spelling counts. Press Enter or choose Check Answer.</p>`;
    const input = elements.taskArea.querySelector('.text-answer');
    input.addEventListener('input', () => { elements.check.disabled = input.value.trim().length === 0; });
    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' && input.value.trim() && !state.answered) elements.check.click();
    });
    elements.check.hidden = false;
    elements.check.disabled = true;
    window.setTimeout(() => input.focus(), 0);
  };

  const renderMatch = (task) => {
    state.matchSelection = Array(task.pairs.length).fill(null);
    elements.taskArea.innerHTML = `<p class="prompt">${sentencePrompt(task.prompt)}</p><div class="match-board">${task.pairs.map((pair, pairIndex) => `<div class="match-row"><span class="match-label">${escapeHtml(pair.left)}</span><div class="match-options">${shuffle(pair.options).map((option) => `<button class="match-option" type="button" data-pair="${pairIndex}" data-match-option="${escapeHtml(option)}">${escapeHtml(option)}</button>`).join('')}</div></div>`).join('')}</div>`;
    elements.taskArea.querySelectorAll('[data-match-option]').forEach((button) => {
      button.addEventListener('click', () => {
        if (state.answered) return;
        const pairIndex = Number(button.dataset.pair);
        state.matchSelection[pairIndex] = button.dataset.matchOption;
        elements.taskArea.querySelectorAll(`[data-pair="${pairIndex}"]`).forEach((item) => item.classList.remove('is-selected'));
        button.classList.add('is-selected');
        elements.check.disabled = state.matchSelection.some((item) => item === null);
      });
    });
    elements.check.hidden = false;
    elements.check.disabled = true;
  };

  const packagingSignature = (items, assignments) => items
    .map((item) => `${item.containerId}:${assignments[item.containerId] || ''}`)
    .join('|');

  const updatePackagingStation = (task) => {
    elements.taskArea.querySelectorAll('[data-package-product]').forEach((button) => {
      const productId = button.dataset.packageProduct;
      const assigned = Object.values(state.packagingAssignments).includes(productId);
      button.classList.toggle('is-assigned', assigned);
      button.classList.toggle('is-selected', state.selectedPackagingProduct === productId);
      button.setAttribute('aria-pressed', String(state.selectedPackagingProduct === productId));
    });
    elements.taskArea.querySelectorAll('[data-package-card]').forEach((card) => {
      const productId = state.packagingAssignments[card.dataset.packageCard];
      const product = shelfProductMap.get(productId);
      const slot = card.querySelector('[data-package-slot]');
      slot.innerHTML = product ? shelfProductArt(product) : '<span>Choose a product</span>';
      card.classList.toggle('has-product', Boolean(product));
    });
    elements.check.disabled = Object.keys(state.packagingAssignments).length !== task.items.length;
  };

  const assignPackagingProduct = (task, containerId) => {
    if (state.answered || !state.selectedPackagingProduct) return;
    const productId = state.selectedPackagingProduct;
    Object.keys(state.packagingAssignments).forEach((key) => {
      if (state.packagingAssignments[key] === productId) delete state.packagingAssignments[key];
    });
    state.packagingAssignments[containerId] = productId;
    state.selectedPackagingProduct = null;
    updatePackagingStation(task);
  };

  const renderPackagingStation = (task) => {
    state.packagingAssignments = {};
    state.selectedPackagingProduct = null;
    elements.taskArea.innerHTML = `<p class="prompt">${sentencePrompt(task.prompt)}</p><div class="packaging-station"><div class="packaging-product-tray" role="group" aria-label="Products to pack">${shuffle(task.items).map((item) => {
      const product = shelfProductMap.get(item.productId);
      return `<button class="packaging-product" type="button" data-package-product="${escapeHtml(item.productId)}" aria-label="Select product picture ${escapeHtml(item.productId)}">${shelfProductArt(product)}</button>`;
    }).join('')}</div><div class="packaging-card-grid" role="group" aria-label="Container cards">${task.items.map((item) => `<button class="packaging-card" type="button" data-package-card="${escapeHtml(item.containerId)}"><strong>${escapeHtml(item.cardLabel || item.starter)}</strong><span class="packaging-card-slot" data-package-slot><span>Choose a product</span></span></button>`).join('')}</div></div><p class="packaging-hint">Choose a product picture, then choose its container card. Focus on container + of + product; a and the are both accepted in complete phrases.</p>`;
    elements.taskArea.querySelectorAll('[data-package-product]').forEach((button) => button.addEventListener('click', () => {
      if (state.answered) return;
      state.selectedPackagingProduct = state.selectedPackagingProduct === button.dataset.packageProduct ? null : button.dataset.packageProduct;
      updatePackagingStation(task);
    }));
    elements.taskArea.querySelectorAll('[data-package-card]').forEach((button) => button.addEventListener('click', () => assignPackagingProduct(task, button.dataset.packageCard)));
    elements.reset.hidden = false;
    elements.check.hidden = false;
    elements.check.textContent = 'Check Answers';
    updatePackagingStation(task);
  };

  const renderContainerRecall = (task) => {
    elements.taskArea.innerHTML = `<p class="prompt">${sentencePrompt(task.prompt)}</p><div class="container-recall-grid">${task.items.map((item, index) => {
      const product = shelfProductMap.get(item.productId);
      return `<label class="container-recall-row"><span class="container-recall-picture">${shelfProductArt(product)}</span><span class="sr-only">Full container phrase for picture ${index + 1}</span><input class="container-recall-input" data-recall-input="${index}" type="text" autocomplete="off" autocapitalize="none" placeholder="Type the full phrase" maxlength="60"></label>`;
    }).join('')}</div><p class="packaging-hint">Type each complete phrase with <b>a</b> or <b>the</b>, then the container + <b>of</b> + product.</p>`;
    const inputs = [...elements.taskArea.querySelectorAll('[data-recall-input]')];
    const updateCheck = () => { elements.check.disabled = inputs.some((input) => !input.value.trim()); };
    inputs.forEach((input) => {
      input.addEventListener('input', updateCheck);
      input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && !elements.check.disabled && !state.answered) elements.check.click();
      });
    });
    elements.reset.hidden = false;
    elements.check.hidden = false;
    elements.check.textContent = 'Check Answers';
    elements.check.disabled = true;
  };

  const clearPackagingStation = () => {
    if (state.answered) return;
    state.packagingAssignments = {};
    state.selectedPackagingProduct = null;
    updatePackagingStation(currentTask());
  };

  const clearContainerRecall = () => {
    if (state.answered) return;
    elements.taskArea.querySelectorAll('[data-recall-input]').forEach((input) => { input.value = ''; });
    elements.check.disabled = true;
  };

  const showInteractiveMistake = (message, button = null) => {
    state.hadMistake = true;
    if (button) {
      button.classList.remove('is-wrong');
      void button.offsetWidth;
      button.classList.add('is-wrong');
    }
    const guide = currentRound().guide;
    updateGuide(guide.wrong, `${guide.name} reacting to a mistake`, guide.name, guide.incorrect);
    elements.feedback.className = 'feedback wrong';
    elements.feedback.innerHTML = `<strong>Try the shelf again</strong><p>${escapeHtml(message)} No Brain Sparks are awarded after an incorrect attempt.</p>`;
    elements.feedback.hidden = false;
  };

  const renderShelfFind = (task) => {
    elements.taskArea.innerHTML = `<p class="prompt">${sentencePrompt(task.prompt)}</p>${renderInteractiveShelf(task.scene, true, false)}<p class="shelf-retry-note" hidden data-shelf-note></p>`;
    elements.taskArea.querySelectorAll('[data-instance-id]').forEach((button) => button.addEventListener('click', () => {
      if (state.answered || button.disabled) return;
      if (button.dataset.productId === task.answer) {
        submitAnswer(task.answer, button);
        return;
      }
      const product = shelfProductMap.get(button.dataset.productId);
      button.disabled = true;
      showInteractiveMistake(`That is ${product?.label || 'a different product'}. Find ${task.targetLabel}.`, button);
    }));
  };

  const basketCounts = () => state.basketInstances.reduce((counts, instanceId) => {
    const productId = instanceId.replace(/-\d+$/, '');
    counts[productId] = (counts[productId] || 0) + 1;
    return counts;
  }, {});

  const renderBasketContents = () => {
    const basket = elements.taskArea.querySelector('[data-shelf-basket-items]');
    const basketShell = elements.taskArea.querySelector('.shelf-basket');
    const basketCount = elements.taskArea.querySelector('[data-basket-count]');
    basket.innerHTML = state.basketInstances.map((instanceId) => {
      const product = shelfProductMap.get(instanceId.replace(/-\d+$/, ''));
      return `<button class="basket-product-instance" type="button" data-remove-instance="${escapeHtml(instanceId)}" aria-label="Remove ${escapeHtml(product.label)} from the basket">${shelfProductArt(product)}</button>`;
    }).join('');
    basketShell?.classList.toggle('has-items', state.basketInstances.length > 0);
    if (basketCount) basketCount.textContent = `${state.basketInstances.length} ${state.basketInstances.length === 1 ? 'item' : 'items'}`;
    basket.querySelectorAll('[data-remove-instance]').forEach((button) => button.addEventListener('click', () => {
      if (state.answered) return;
      state.basketInstances = state.basketInstances.filter((id) => id !== button.dataset.removeInstance);
      elements.taskArea.querySelector(`[data-instance-id="${button.dataset.removeInstance}"]`)?.classList.remove('is-in-basket');
      renderBasketContents();
      elements.check.disabled = state.basketInstances.length === 0;
    }));
  };

  const animateProductToBasket = (button) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const art = button.querySelector('.shelf-product-art');
    const basket = elements.taskArea.querySelector('[data-shelf-basket-items]');
    if (!art || !basket) return;
    const from = art.getBoundingClientRect();
    const to = basket.getBoundingClientRect();
    const flight = art.cloneNode();
    flight.classList.add('shelf-product-flight');
    Object.assign(flight.style, { left: `${from.left}px`, top: `${from.top}px`, width: `${from.width}px`, height: `${from.height}px` });
    document.body.append(flight);
    const deltaX = to.left + to.width / 2 - (from.left + from.width / 2);
    const deltaY = to.top + to.height / 2 - (from.top + from.height / 2);
    const animation = flight.animate([
      { transform: 'translate(0, 0) scale(1)', opacity: 1 },
      { transform: `translate(${deltaX}px, ${deltaY}px) scale(.82) rotate(5deg)`, opacity: .88 }
    ], { duration: 480, easing: 'cubic-bezier(.22,.75,.28,1)' });
    animation.finished.finally(() => flight.remove());
  };

  const clearShelfBasket = () => {
    if (state.answered) return;
    state.basketInstances = [];
    elements.taskArea.querySelectorAll('.shelf-instance').forEach((item) => item.classList.remove('is-in-basket'));
    renderBasketContents();
    elements.check.disabled = true;
  };

  const renderShelfBasket = (task) => {
    state.basketInstances = [];
    elements.taskArea.innerHTML = `<p class="prompt">${sentencePrompt(task.prompt)}</p><div class="shelf-packing-layout">${renderInteractiveShelf(task.scene, true, false)}<div class="shelf-basket"><div class="shelf-basket-heading"><span class="shelf-basket-title">Your basket</span><span class="shelf-basket-count" data-basket-count>0 items</span></div><div class="shelf-basket-items" data-shelf-basket-items role="group" aria-label="Products in your basket" aria-live="polite"></div><p class="shelf-basket-hint">Tap an item to add it. Tap an item in the basket to remove it.</p></div></div>`;
    elements.taskArea.querySelectorAll('[data-instance-id]').forEach((button) => button.addEventListener('click', () => {
      if (state.answered || button.classList.contains('is-in-basket')) return;
      animateProductToBasket(button);
      state.basketInstances.push(button.dataset.instanceId);
      button.classList.add('is-in-basket');
      renderBasketContents();
      elements.check.disabled = false;
    }));
    elements.reset.hidden = false;
    elements.check.hidden = false;
    elements.check.disabled = true;
  };

  const evidenceSignature = () => {
    const counts = state.evidenceInstances.reduce((result, instanceId) => {
      const productId = instanceId.replace(/-\d+$/, '');
      result[productId] = (result[productId] || 0) + 1;
      return result;
    }, {});
    return Object.entries(counts).sort(([a], [b]) => a.localeCompare(b)).map(([id, count]) => `${id}:${count}`).join('|');
  };

  const clearShelfEvidence = () => {
    if (state.answered) return;
    state.evidenceInstances = [];
    elements.taskArea.querySelectorAll('[data-instance-id]').forEach((button) => button.classList.remove('is-selected-evidence'));
    elements.check.disabled = true;
  };

  const renderShelfEvidence = (task) => {
    state.evidenceInstances = [];
    elements.taskArea.innerHTML = `<p class="prompt">${sentencePrompt(task.prompt)}</p>${renderInteractiveShelf(task.scene, true, false)}<p class="evidence-counter" data-evidence-counter>Selected: 0 of ${task.quantity}</p>`;
    const counter = elements.taskArea.querySelector('[data-evidence-counter]');
    elements.taskArea.querySelectorAll('[data-instance-id]').forEach((button) => button.addEventListener('click', () => {
      if (state.answered) return;
      const instanceId = button.dataset.instanceId;
      if (state.evidenceInstances.includes(instanceId)) state.evidenceInstances = state.evidenceInstances.filter((id) => id !== instanceId);
      else state.evidenceInstances.push(instanceId);
      button.classList.toggle('is-selected-evidence', state.evidenceInstances.includes(instanceId));
      counter.textContent = `Selected: ${state.evidenceInstances.length} of ${task.quantity}`;
      elements.check.disabled = state.evidenceInstances.length === 0;
    }));
    elements.reset.hidden = false;
    elements.check.hidden = false;
    elements.check.textContent = 'Check Evidence';
    elements.check.disabled = true;
  };

  const clearFixZiggy = () => {
    if (state.answered) return;
    state.fixTokenIndex = null;
    state.fixReplacement = null;
    elements.taskArea.querySelectorAll('[data-fix-token], [data-fix-replacement]').forEach((button) => button.classList.remove('is-selected'));
    elements.check.disabled = true;
  };

  const renderFixZiggy = (task) => {
    state.fixTokenIndex = null;
    state.fixReplacement = null;
    elements.taskArea.innerHTML = `${renderScene(task.scene)}<p class="prompt">${sentencePrompt(task.prompt)}</p><div class="ziggy-mistake-sentence" aria-label="Ziggy's sentence">${task.tokens.map((token, index) => `<button type="button" data-fix-token="${index}">${escapeHtml(token)}</button>`).join(' ')}</div><div class="ziggy-fix-panel"><span>Replace it with:</span><div>${shuffle(task.replacements).map((replacement) => `<button type="button" class="match-option" data-fix-replacement="${escapeHtml(replacement)}">${escapeHtml(replacement)}</button>`).join('')}</div></div>`;
    elements.taskArea.querySelectorAll('[data-fix-token]').forEach((button) => button.addEventListener('click', () => {
      if (state.answered) return;
      state.fixTokenIndex = Number(button.dataset.fixToken);
      elements.taskArea.querySelectorAll('[data-fix-token]').forEach((item) => item.classList.toggle('is-selected', item === button));
      elements.check.disabled = state.fixReplacement === null;
    }));
    elements.taskArea.querySelectorAll('[data-fix-replacement]').forEach((button) => button.addEventListener('click', () => {
      if (state.answered) return;
      state.fixReplacement = button.dataset.fixReplacement;
      elements.taskArea.querySelectorAll('[data-fix-replacement]').forEach((item) => item.classList.toggle('is-selected', item === button));
      elements.check.disabled = state.fixTokenIndex === null;
    }));
    elements.reset.hidden = false;
    elements.check.hidden = false;
    elements.check.textContent = 'Check Fix';
    elements.check.disabled = true;
  };

  const renderTask = () => {
    const round = currentRound();
    const task = currentTask();
    const guide = round.guide;
    state.answered = false;
    state.hadMistake = false;
    state.orderSelection = [];
    state.matchSelection = [];
    state.basketInstances = [];
    state.evidenceInstances = [];
    state.fixTokenIndex = null;
    state.fixReplacement = null;
    state.packagingAssignments = {};
    state.selectedPackagingProduct = null;
    elements.feedback.hidden = true;
    elements.feedback.className = 'feedback';
    elements.feedback.innerHTML = '';
    elements.reset.hidden = true;
    elements.check.hidden = true;
    elements.check.disabled = false;
    elements.check.textContent = 'Check Answer';
    elements.next.disabled = true;
    elements.next.textContent = state.roundIndex === 4 && state.taskIndex === 4 ? 'See Results' : 'Next';
    elements.challenge.classList.remove('is-wrong', 'is-correct');
    elements.board.dataset.roundTheme = round.theme;
    elements.roundIcon.textContent = round.icon;
    elements.roundName.textContent = round.name;
    elements.instruction.textContent = task.instruction || round.instruction;
    elements.sceneStatus.textContent = round.status;
    updateGuide(guide.think, `${guide.name} thinking`, guide.name, guide.read);
    renderProgress();

    if (task.type === 'choice' || task.type === 'sceneChoice' || task.type === 'shelfChoice') renderChoice(task);
    if (task.type === 'order') renderOrder(task);
    if (task.type === 'input') renderInput(task);
    if (task.type === 'match') renderMatch(task);
    if (task.type === 'shelfFind') renderShelfFind(task);
    if (task.type === 'shelfBasket') renderShelfBasket(task);
    if (task.type === 'shelfEvidence') renderShelfEvidence(task);
    if (task.type === 'fixZiggy') renderFixZiggy(task);
    if (task.type === 'packagingStation') renderPackagingStation(task);
    if (task.type === 'containerRecall') renderContainerRecall(task);
  };

  const answerIsCorrect = (task, answer) => {
    if (task.type === 'match') return task.pairs.every((pair, index) => normalize(answer[index]) === normalize(pair.answer));
    if (task.type === 'containerRecall') return task.items.every((item, index) => (item.accepted || [item.full]).some((accepted) => normalize(answer[index]) === normalize(accepted)));
    const accepted = [task.answer, ...(task.alternatives || [])].map(normalize);
    return accepted.includes(normalize(answer));
  };

  const displayCorrectAnswer = (task) => {
    if (task.displayAnswer) return task.displayAnswer;
    if (task.type === 'match') return task.pairs.map((pair) => `${pair.left} ${pair.answer}`).join('; ');
    if (task.type === 'packagingStation' || task.type === 'containerRecall') return task.items.map((item) => item.full).join('; ');
    return task.answer;
  };

  const revealAnswer = (task, correct, selectedButton) => {
    elements.taskArea.querySelectorAll('button, input').forEach((control) => { control.disabled = true; });
    if (selectedButton) selectedButton.classList.add(correct ? 'is-correct' : 'is-wrong');
    if (correct && task.type === 'shelfFind' && selectedButton) selectedButton.classList.add('is-revealed');
    if (task.type === 'choice' || task.type === 'sceneChoice' || task.type === 'shelfChoice') {
      elements.taskArea.querySelectorAll('[data-option]').forEach((button) => {
        if (normalize(button.dataset.option) === normalize(task.answer)) button.classList.add('is-correct');
      });
    }
    if (task.type === 'match') {
      task.pairs.forEach((pair, index) => {
        elements.taskArea.querySelectorAll(`[data-pair="${index}"]`).forEach((button) => {
          if (normalize(button.dataset.matchOption) === normalize(pair.answer)) button.classList.add('is-correct');
          else if (button.classList.contains('is-selected')) button.classList.add('is-wrong');
        });
      });
    }
    if (task.type === 'shelfEvidence') elements.taskArea.querySelectorAll('.is-selected-evidence').forEach((button) => button.classList.add('is-correct'));
    if (task.type === 'fixZiggy') {
      elements.taskArea.querySelector(`[data-fix-token="${task.errorIndex}"]`)?.classList.add('is-correct');
      elements.taskArea.querySelector(`[data-fix-replacement="${task.replacement}"]`)?.classList.add('is-correct');
    }
    if (task.type === 'packagingStation') {
      task.items.forEach((item) => {
        const card = elements.taskArea.querySelector(`[data-package-card="${item.containerId}"]`);
        const isCorrect = state.packagingAssignments[item.containerId] === item.productId;
        card?.classList.add(isCorrect ? 'is-correct' : 'is-wrong');
      });
      elements.taskArea.insertAdjacentHTML('beforeend', `<div class="packaging-solutions"><strong>Correct combinations</strong>${task.items.map((item) => `<p><b>${escapeHtml(item.full)}</b> — ${escapeHtml(item.explanation)}</p>`).join('')}</div>`);
    }
    if (task.type === 'containerRecall') {
      task.items.forEach((item, index) => {
        const input = elements.taskArea.querySelector(`[data-recall-input="${index}"]`);
        const row = input?.closest('.container-recall-row');
        row?.classList.add(normalize(input?.value) === normalize(item.full) ? 'is-correct' : 'is-wrong');
        row?.insertAdjacentHTML('beforeend', `<span class="container-recall-answer"><b>${escapeHtml((item.accepted || [item.full]).join(' / '))}</b><small>${escapeHtml(item.explanation)}</small></span>`);
      });
    }
  };

  const submitAnswer = (answer, selectedButton = null) => {
    if (state.answered) return;
    const task = currentTask();
    const guide = currentRound().guide;
    const correct = answerIsCorrect(task, answer);
    state.answered = true;

    if (correct) {
      const earnsSparks = !state.hadMistake;
      if (earnsSparks) state.score += SPARKS_PER_TASK;
      state.correct += 1;
      elements.sparks.textContent = String(state.score);
      elements.challenge.classList.add('is-correct');
      updateGuide(guide.happy, `${guide.name} celebrating`, guide.name, guide.correct);
      if (earnsSparks) fireSparks();
      if (task.type === 'shelfBasket') elements.taskArea.querySelector('.shelf-basket')?.classList.add('is-complete');
    } else {
      elements.challenge.classList.remove('is-wrong');
      void elements.challenge.offsetWidth;
      elements.challenge.classList.add('is-wrong');
      updateGuide(guide.wrong, `${guide.name} reacting to a mistake`, guide.name, guide.incorrect);
    }

    updateEnergy(state.roundIndex * TASKS_PER_ROUND + state.taskIndex + 1);
    revealAnswer(task, correct, selectedButton);
    const correctDisplay = displayCorrectAnswer(task);
    const visualTypes = ['sceneChoice', 'shelfChoice', 'shelfFind', 'shelfBasket', 'shelfEvidence'];
    const pictureError = task.auditMode === 'picture' || (visualTypes.includes(task.type) && task.auditMode !== 'grammar');
    const errorKind = pictureError ? 'Picture clue' : 'Grammar clue';
    const errorLead = pictureError
      ? (['shelfFind', 'shelfBasket'].includes(task.type)
          ? 'That selection does not match the complete picture or requested quantity.'
          : 'That sentence does not match the complete picture.')
      : 'That answer does not follow the target grammar pattern.';
    elements.feedback.className = `feedback ${correct ? 'correct' : 'wrong'}`;
    elements.feedback.innerHTML = correct
      ? `<strong>${escapeHtml(guide.name)}: ${escapeHtml(guide.correct)}</strong><p>${escapeHtml(task.explanation)}${state.hadMistake ? ' Correct after a retry: no Brain Sparks this time.' : ''}</p>`
      : `<strong>${escapeHtml(errorKind)} · ${escapeHtml(guide.name)}’s clue</strong><p>${escapeHtml(errorLead)} Correct answer: <b>${escapeHtml(correctDisplay)}</b> ${escapeHtml(task.explanation)}</p>`;
    elements.feedback.hidden = false;
    elements.reset.hidden = true;
    elements.check.hidden = true;
    elements.next.disabled = false;
    elements.next.focus({ preventScroll: true });
  };

  const checkConstructedAnswer = () => {
    const task = currentTask();
    if (task.type === 'order') submitAnswer(formatOrderAnswer(state.orderSelection.map((index) => task.words[index])));
    if (task.type === 'input') submitAnswer(elements.taskArea.querySelector('.text-answer').value);
    if (task.type === 'match') submitAnswer(state.matchSelection);
    if (task.type === 'shelfEvidence') {
      const answer = evidenceSignature();
      if (normalize(answer) === normalize(task.answer)) submitAnswer(answer);
      else showInteractiveMistake(`Select exactly ${task.quantity} ${shelfProductMap.get(task.productId)?.plural || 'requested products'} and no other products. Then check again.`);
    }
    if (task.type === 'fixZiggy') {
      if (state.fixTokenIndex === task.errorIndex && normalize(state.fixReplacement) === normalize(task.replacement)) submitAnswer(task.answer);
      else {
        showInteractiveMistake(task.explanation);
        clearFixZiggy();
      }
    }
    if (task.type === 'packagingStation') submitAnswer(packagingSignature(task.items, state.packagingAssignments));
    if (task.type === 'containerRecall') submitAnswer([...elements.taskArea.querySelectorAll('[data-recall-input]')].map((input) => input.value));
    if (task.type === 'shelfBasket') {
      const answer = window.SUPERMARKET_SHELF.signature(basketCounts());
      if (normalize(answer) === normalize(task.answer)) submitAnswer(answer);
      else showInteractiveMistake('The basket does not match the requested products and quantities. Remove or add individual items, then check again.');
    }
  };

  const resetCurrentTask = () => {
    if (currentTask().type === 'shelfBasket') clearShelfBasket();
    else if (currentTask().type === 'shelfEvidence') clearShelfEvidence();
    else if (currentTask().type === 'fixZiggy') clearFixZiggy();
    else if (currentTask().type === 'packagingStation') clearPackagingStation();
    else if (currentTask().type === 'containerRecall') clearContainerRecall();
    else clearOrder();
  };

  const nextTask = () => {
    if (!state.answered) return;
    if (state.taskIndex < TASKS_PER_ROUND - 1) {
      state.taskIndex += 1;
      renderTask();
      return;
    }
    if (state.roundIndex < config.rounds.length - 1) {
      state.roundIndex += 1;
      state.taskIndex = 0;
      renderTask();
      return;
    }
    finishGame();
  };

  const startGame = () => {
    const startedProgress = loadProgress(); const startedGame = startedProgress.games[config.gameKey] || {};
    if (!startedGame.startedAt) { startedProgress.games[config.gameKey] = { ...startedGame, started: true, startedAt: new Date().toISOString() }; saveProgress(startedProgress); }
    const selectRoundTasks = (round) => {
      if (Array.isArray(round.mechanicCycle)) {
        const used = new Set();
        return round.mechanicCycle.map((mechanic) => {
          const available = round.bank.filter((task) => task.mechanic === mechanic && !used.has(task));
          const selected = shuffle(available)[0];
          if (!selected) throw new Error(`${config.gameKey}: no task available for mechanic ${mechanic}.`);
          used.add(selected);
          return selected;
        });
      }
      const featured = round.bank.find((task) => task.featured);
      if (!featured) return shuffle(round.bank).slice(0, TASKS_PER_ROUND);
      return [featured, ...shuffle(round.bank.filter((task) => task !== featured)).slice(0, TASKS_PER_ROUND - 1)];
    };
    state = {
      roundIndex: 0,
      taskIndex: 0,
      score: 0,
      correct: 0,
      answered: false,
      orderSelection: [],
      matchSelection: [],
      basketInstances: [],
      evidenceInstances: [],
      fixTokenIndex: null,
      fixReplacement: null,
      packagingAssignments: {},
      selectedPackagingProduct: null,
      selectedRounds: config.rounds.map(selectRoundTasks)
    };
    elements.sparks.textContent = '0';
    elements.intro.hidden = true;
    elements.result.hidden = true;
    elements.game.hidden = false;
    renderTask();
    window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  };

  const finishGame = () => {
    const progress = loadProgress();
    const previous = progress.games[config.gameKey] || {};
    const oldBest = Number(previous.bestScore) || 0;
    const newBest = Math.max(oldBest, state.score);
    const newlySaved = newBest - oldBest;
    progress.brainSparks = (Number(progress.brainSparks) || 0) + newlySaved;
    progress.games[config.gameKey] = {
      ...previous,
      bestScore: newBest,
      bestCorrect: Math.max(Number(previous.bestCorrect) || 0, state.correct),
      maxQuestions: TOTAL_TASKS,
      plays: (Number(previous.plays) || 0) + 1,
      completed: true,
      lastScore: state.score,
      completedAt: new Date().toISOString()
    };
    saveProgress(progress);

    elements.game.hidden = true;
    elements.result.hidden = false;
    elements.finalScore.textContent = String(state.score);
    elements.finalCorrect.textContent = `${state.correct} / ${TOTAL_TASKS}`;
    elements.savedSparks.textContent = `+${newlySaved}`;
    elements.finalBest.textContent = `${newBest} / 250`;
    elements.resultMessage.textContent = state.score >= 220 ? config.results.excellent : state.score >= 150 ? config.results.good : config.results.keepGoing;
    window.ENGLISH_QUEST_COMPLETION?.renderAll();
    updateBestLabel();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  elements.start.addEventListener('click', startGame);
  elements.playAgain.addEventListener('click', startGame);
  elements.reset.addEventListener('click', resetCurrentTask);
  elements.check.addEventListener('click', checkConstructedAnswer);
  elements.next.addEventListener('click', nextTask);
  updateBestLabel();
})();
