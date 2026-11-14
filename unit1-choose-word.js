(() => {
  'use strict';

  const COVER_IMAGE = 'assets/images/vocabulary/unit1/covers/choose-the-right-word-cover.png';
  const BANKS = Object.freeze({
    'household-chores': Object.freeze([
      { id:'H1', group:'Household Chores', sentence:'The plates are dirty after dinner. Please ...', options:['clear the table','feed the dog'], correct:'clear the table', hint:'Think about what you do with dishes after a meal.' },
      { id:'H2', group:'Household Chores', sentence:'Your clothes are wet. Please ...', options:['hang out the washing','make your bed'], correct:'hang out the washing', hint:'Wet clothes need to dry.' },
      { id:'H3', group:'Household Chores', sentence:'The flowers are very dry. Please ...', options:['water the plants','load the dishwasher'], correct:'water the plants', hint:'What do flowers need to grow?' },
      { id:'H4', group:'Household Chores', sentence:'The plates are clean now. Please ...', options:['empty the dishwasher','iron your T-shirt'], correct:'empty the dishwasher', hint:'The dishes are clean and ready to put away.' },
      { id:'H5', group:'Household Chores', sentence:'Your room is dusty. Please ...', options:['vacuum your room','set the table'], correct:'vacuum your room', hint:'Think about cleaning the floor.' },
      { id:'H6', group:'Household Chores', sentence:'Dinner is nearly ready. Please ...', options:['set the table','take out the rubbish'], correct:'set the table', hint:'Get the plates and cutlery ready for dinner.' },
      { id:'H7', group:'Household Chores', sentence:'Your T-shirt is creased. Please ...', options:['iron your T-shirt','feed the dog'], correct:'iron your T-shirt', hint:'An iron makes creased clothes smooth.' },
      { id:'H8', group:'Household Chores', sentence:'The bin is full. Please ...', options:['take out the rubbish','load the washing machine'], correct:'take out the rubbish', hint:'Where should the rubbish go when the bin is full?' }
    ]),
    'personality-adjectives': Object.freeze([
      { id:'P1', group:'Personality Challenge', sentence:'My brother always tells everyone what to do. He is very ...', options:['bossy','quiet'], correct:'bossy', hint:'He likes giving orders to other people.' },
      { id:'P2', group:'Personality Challenge', sentence:'Lucy shares her sweets with her friends. She is ...', options:['generous','greedy'], correct:'generous', hint:'She is happy to give things to other people.' },
      { id:'P3', group:'Personality Challenge', sentence:'Tom never puts his clothes away. He is ...', options:['tidy','messy'], correct:'messy', hint:'His things are not in the right places.' },
      { id:'P4', group:'Personality Challenge', sentence:'My dad never gets angry when he has to wait. He is ...', options:['patient','loud'], correct:'patient', hint:"Waiting doesn't upset him." },
      { id:'P5', group:'Personality Challenge', sentence:'Ben loves meeting new people and talking to them. He is ...', options:['sociable','quiet'], correct:'sociable', hint:'He enjoys spending time with other people.' },
      { id:'P6', group:'Personality Challenge', sentence:'My sister keeps her room clean and puts everything away. She is ...', options:['tidy','messy'], correct:'tidy', hint:'Everything in her room has its place.' },
      { id:'P7', group:'Personality Challenge', sentence:'Jack always wants more sweets and never shares them. He is ...', options:['greedy','generous'], correct:'greedy', hint:'He wants everything for himself.' },
      { id:'P8', group:'Personality Challenge', sentence:'My friend always helps me when I have a problem. She is ...', options:['kind','bossy'], correct:'kind', hint:'She cares about other people and helps them.' },
      { id:'G1', group:'Guess the Personality', sentence:"I don't talk much and I don't make a lot of noise.", options:['quiet','loud'], correct:'quiet', hint:"This person doesn't make much noise." },
      { id:'G2', group:'Guess the Personality', sentence:'I do lots of things and never get tired.', options:['energetic','patient'], correct:'energetic', hint:'This person has lots of energy.' },
      { id:'G3', group:'Guess the Personality', sentence:'I plan my day and always know what I need to do.', options:['organised','messy'], correct:'organised', hint:'This person plans things carefully.' },
      { id:'G4', group:'Guess the Personality', sentence:'I stay with my friends and support them when they need me.', options:['loyal','greedy'], correct:'loyal', hint:'This person never lets their friends down.' },
      { id:'G5', group:'Guess the Personality', sentence:"I don't get upset when plans change.", options:['easy-going','bossy'], correct:'easy-going', hint:'This person stays relaxed when things change.' },
      { id:'G6', group:'Guess the Personality', sentence:'I enjoy meeting people and making new friends.', options:['sociable','quiet'], correct:'sociable', hint:'This person enjoys being with other people.' },
      { id:'G7', group:'Guess the Personality', sentence:'I speak and laugh so loudly that everybody can hear me.', options:['loud','tidy'], correct:'loud', hint:'Everybody can hear this person.' }
    ])
  });

  const shuffle = (items, random = Math.random) => {
    const result = [...items];
    for (let index = result.length - 1; index > 0; index -= 1) {
      const other = Math.floor(random() * (index + 1));
      [result[index], result[other]] = [result[other], result[index]];
    }
    return result;
  };
  const taskOrder = (plan) => plan.map((task) => task.id).join('|');
  const optionOrder = (task) => task.options.join('|');
  const createPlan = (tasks, random = Math.random) => shuffle(tasks, random).map((task) => ({ ...task, options:shuffle(task.options, random) }));
  const compactPlan = (plan) => plan.map(({ id, options }) => ({ id, options:[...options] }));
  const restorePlan = (savedPlan, tasks) => {
    if (!Array.isArray(savedPlan) || savedPlan.length !== tasks.length) return null;
    const byId = new Map(tasks.map((task) => [task.id, task]));
    const restored = savedPlan.map((saved) => {
      const task = byId.get(saved?.id);
      if (!task || !Array.isArray(saved.options) || saved.options.length !== 2
        || saved.options.some((option) => !task.options.includes(option))) return null;
      return { ...task, options:[...saved.options] };
    });
    return restored.every(Boolean) && new Set(restored.map((task) => task.id)).size === tasks.length ? restored : null;
  };
  const retryDelay = (random = Math.random) => 2 + Math.floor(random() * 3);
  const enqueueRetry = (queue, id, random = Math.random) => {
    const next = (Array.isArray(queue) ? queue : []).map((item) => ({ ...item }));
    const existing = next.find((item) => item.id === id);
    if (existing) {
      existing.failures = (Number(existing.failures) || 0) + 1;
      existing.dueAfter = retryDelay(random);
    } else {
      next.push({ id, failures:1, dueAfter:retryDelay(random) });
    }
    return next;
  };
  const tickRetries = (queue, excludedId = '') => (Array.isArray(queue) ? queue : []).map((item) => ({
    ...item,
    dueAfter:item.id === excludedId ? item.dueAfter : Math.max(0, (Number(item.dueAfter) || 0) - 1)
  }));
  const resolveRetry = (queue, id) => (Array.isArray(queue) ? queue : []).filter((item) => item.id !== id).map((item) => ({ ...item }));
  const nextRetry = (queue, { excludeId = '', force = false } = {}) => {
    const items = (Array.isArray(queue) ? queue : []).filter((item) => force || Number(item.dueAfter) <= 0);
    return items.find((item) => item.id !== excludeId) || items[0] || null;
  };
  const validateBank = (tasks, allowedWords) => tasks.every((task) => task.id && task.sentence && task.hint
    && Array.isArray(task.options) && task.options.length === 2 && new Set(task.options).size === 2
    && task.options.includes(task.correct) && task.options.every((option) => allowedWords.has(option)));

  window.UNIT1_CHOOSE_RIGHT_WORD = { COVER_IMAGE, BANKS, shuffle, createPlan, compactPlan, restorePlan, retryDelay, enqueueRetry, tickRetries, resolveRetry, nextRetry, validateBank, taskOrder, optionOrder };
})();
