(() => {
  const A = 'assets/characters/';
  const max = (read) => ({ name: 'Max', think: `${A}max-thinking.png`, happy: `${A}max-cheering.png`, wrong: `${A}max-thinking.png`, read, correct: 'Yes! That quantity is spot on!', incorrect: 'Think: can we count the noun itself?' });
  const lexi = (read, incorrect = 'Check the noun and the grammar clue again!') => ({ name: 'Lexi', think: `${A}lexi-thinking.png.png`, happy: `${A}lexi-happy.png.png`, wrong: `${A}lexi-surprised.png.png`, read, correct: 'Brilliant counting and grammar!', incorrect });
  const ziggy = (read) => ({ name: 'Ziggy', think: `${A}ziggy-tricky.png`, happy: `${A}ziggy-surprised.png`, wrong: `${A}ziggy-tricky.png`, read, correct: 'No way! You beat my quantity trick!', incorrect: 'Hee-hee! My quantity clue is still hiding!' });
  const PICTURE_PROMPT = 'Look at the picture. Which sentence is true?';
  const scene = (title, zone, rawItems, note = '') => ({
    title,
    zone,
    completeInventory: true,
    note: `${note ? `${note} ` : ''}The scanner shows every item in this area.`,
    label: `${title}. ${rawItems.map((item) => `${item[2]} ${item[1]}`).join(', ')}${note ? `. ${note}` : ''}. The scanner shows every item in this area.`,
    items: rawItems.map(([emoji, label, count]) => ({ emoji, label, count }))
  });
  const pair = (left, answer) => ({ left, answer, options: [answer, `of ${answer}`, `${answer} are`] });

  const muchMany = [
    { type: 'choice', prompt: '___ apples are in the basket?', options: ['How many', 'How much', 'Is there'], answer: 'How many', explanation: 'Apples are countable and plural, so use how many.' },
    { type: 'choice', prompt: '___ milk do we need?', options: ['How much', 'How many', 'Are there'], answer: 'How much', explanation: 'Milk is uncountable, so use how much.' },
    { type: 'choice', prompt: '___ eggs are in the fridge?', options: ['How many', 'How much', 'Is there'], answer: 'How many', explanation: 'Eggs are countable and plural, so use how many.' },
    { type: 'choice', prompt: '___ rice is in the bag?', options: ['How much', 'How many', 'Are there'], answer: 'How much', explanation: 'Rice is uncountable, so use how much.' },
    { type: 'choice', prompt: '___ bottles of water are there?', options: ['How many', 'How much', 'Is there'], answer: 'How many', explanation: 'Bottles are countable and plural, so use how many.' },
    { type: 'choice', prompt: '___ orange juice is in the carton?', options: ['How much', 'How many', 'Are there'], answer: 'How much', explanation: 'Orange juice is uncountable, so use how much.' },
    { type: 'choice', prompt: '___ bananas have we got?', options: ['How many', 'How much', 'Is there'], answer: 'How many', explanation: 'Bananas are countable and plural, so use how many.' },
    { type: 'choice', prompt: '___ bread is on the table?', options: ['How much', 'How many', 'Are there'], answer: 'How much', explanation: 'Bread is uncountable when we do not count loaves or slices, so use how much.' },
    { type: 'choice', prompt: '___ tins of beans do you want?', options: ['How many', 'How much', 'Is there'], answer: 'How many', explanation: 'Tins are countable and plural, so use how many.' },
    { type: 'choice', prompt: '___ cheese is in this sandwich?', options: ['How much', 'How many', 'Are there'], answer: 'How much', explanation: 'Cheese is uncountable here, so use how much.' },
    { type: 'choice', prompt: '___ tomatoes are in the salad?', options: ['How many', 'How much', 'Is there'], answer: 'How many', explanation: 'Tomatoes are countable and plural, so use how many.' },
    { type: 'choice', prompt: '___ sugar is in your tea?', options: ['How much', 'How many', 'Are there'], answer: 'How much', explanation: 'Sugar is uncountable, so use how much.' },
    { type: 'choice', prompt: '___ packets of pasta are on the shelf?', options: ['How many', 'How much', 'Is there'], answer: 'How many', explanation: 'Packets are countable and plural, so use how many.' },
    { type: 'choice', prompt: '___ butter do we have?', options: ['How much', 'How many', 'Are there'], answer: 'How much', explanation: 'Butter is uncountable, so use how much.' },
    { type: 'choice', prompt: '___ sandwiches are ready?', options: ['How many', 'How much', 'Is there'], answer: 'How many', explanation: 'Sandwiches are countable and plural, so use how many.' }
  ];

  let countFood = [
    { type: 'sceneChoice', scene: scene('Fruit basket', 'Kitchen', [['🍎','apples',5],['🍌','bananas',2]]), prompt: PICTURE_PROMPT, options: ['There are five apples.', 'There are two apples.', 'There are seven apples.'], answer: 'There are five apples.', explanation: 'The complete basket scan shows exactly five apples.' },
    { type: 'sceneChoice', scene: scene('Breakfast tray', 'Table', [['🥚','eggs',6],['🥐','croissants',3]]), prompt: PICTURE_PROMPT, options: ['There are six eggs.', 'There are three eggs.', 'There are four eggs.'], answer: 'There are six eggs.', explanation: 'The complete tray scan shows exactly six eggs.' },
    { type: 'sceneChoice', scene: scene('Drink shelf', 'Shop', [['💧','water bottles',4],['🧃','juice cartons',2]]), prompt: PICTURE_PROMPT, options: ['There are four water bottles.', 'There are two water bottles.', 'There are six water bottles.'], answer: 'There are four water bottles.', explanation: 'The complete shelf scan shows exactly four water bottles.' },
    { type: 'sceneChoice', scene: scene('Picnic box', 'Park', [['🥪','sandwiches',3],['🍎','apples',2],['🧃','juice cartons',1]]), prompt: PICTURE_PROMPT, options: ['There are three sandwiches.', 'There are two sandwiches.', 'There is one sandwich.'], answer: 'There are three sandwiches.', explanation: 'The complete picnic scan shows exactly three sandwiches.' },
    { type: 'sceneChoice', scene: scene('Vegetable crate', 'Market', [['🍅','tomatoes',7],['🥒','cucumbers',3]]), prompt: PICTURE_PROMPT, options: ['There are seven tomatoes.', 'There are three tomatoes.', 'There are five tomatoes.'], answer: 'There are seven tomatoes.', explanation: 'The complete crate scan shows exactly seven tomatoes.' },
    { type: 'sceneChoice', scene: scene('Bakery rack', 'Shop', [['🥖','loaves of bread',4],['🧁','cupcakes',6]]), prompt: PICTURE_PROMPT, options: ['There are four loaves of bread.', 'There are six loaves of bread.', 'There are two loaves of bread.'], answer: 'There are four loaves of bread.', explanation: 'The complete rack scan shows exactly four loaves of bread.' },
    { type: 'sceneChoice', scene: scene('Party table', 'Party', [['🧁','cupcakes',8],['🥤','lemonade cups',5]]), prompt: PICTURE_PROMPT, options: ['There are eight cupcakes.', 'There are five cupcakes.', 'There are six cupcakes.'], answer: 'There are eight cupcakes.', explanation: 'The complete table scan shows exactly eight cupcakes.' },
    { type: 'sceneChoice', scene: scene('Tinned food shelf', 'Shop', [['🥫','bean tins',5],['🥫','tomato tins',3]]), prompt: PICTURE_PROMPT, options: ['There are five tins of beans.', 'There are three tins of beans.', 'There are seven tins of beans.'], answer: 'There are five tins of beans.', explanation: 'The complete shelf scan shows exactly five tins of beans.' },
    { type: 'sceneChoice', scene: scene('Lunch counter', 'Café', [['🍕','pizza slices',4],['🥗','salad bowls',2]]), prompt: PICTURE_PROMPT, options: ['There are four slices of pizza.', 'There are two slices of pizza.', 'There are six slices of pizza.'], answer: 'There are four slices of pizza.', explanation: 'The complete counter scan shows exactly four pizza slices.' },
    { type: 'sceneChoice', scene: scene('Dairy case', 'Shop', [['🥛','milk cartons',3],['🧀','cheese packs',2],['🧈','butter packs',1]]), prompt: PICTURE_PROMPT, options: ['There are three milk cartons.', 'There are two milk cartons.', 'There is one milk carton.'], answer: 'There are three milk cartons.', explanation: 'The complete case scan shows exactly three milk cartons.' },
    { type: 'sceneChoice', scene: scene('Snack box', 'Kitchen', [['🍪','biscuits',9],['🍫','chocolate bars',4]]), prompt: PICTURE_PROMPT, options: ['There are nine biscuits.', 'There are four biscuits.', 'There are six biscuits.'], answer: 'There are nine biscuits.', explanation: 'The complete box scan shows exactly nine biscuits.' },
    { type: 'sceneChoice', scene: scene('Pasta shelf', 'Shop', [['🍝','pasta packets',6],['🍚','rice bags',2]]), prompt: PICTURE_PROMPT, options: ['There are six packets of pasta.', 'There are two packets of pasta.', 'There are four packets of pasta.'], answer: 'There are six packets of pasta.', explanation: 'The complete shelf scan shows exactly six pasta packets.' },
    { type: 'sceneChoice', scene: scene('School lunch', 'Canteen', [['🍊','oranges',5],['🥪','sandwiches',7]]), prompt: PICTURE_PROMPT, options: ['There are seven sandwiches.', 'There are five sandwiches.', 'There are three sandwiches.'], answer: 'There are seven sandwiches.', explanation: 'The complete lunch scan shows exactly seven sandwiches.' },
    { type: 'sceneChoice', scene: scene('Freezer drawer', 'Freezer', [['🍦','ice cream tubs',3],['🍕','pizzas',2]]), prompt: PICTURE_PROMPT, options: ['There are three tubs of ice cream.', 'There are two tubs of ice cream.', 'There are five tubs of ice cream.'], answer: 'There are three tubs of ice cream.', explanation: 'The complete drawer scan shows exactly three ice cream tubs.' },
    { type: 'sceneChoice', scene: scene('Juice delivery', 'Stockroom', [['🧃','apple juice cartons',8],['🧃','orange juice cartons',5]]), prompt: PICTURE_PROMPT, options: ['There are five orange juice cartons.', 'There are eight orange juice cartons.', 'There are three orange juice cartons.'], answer: 'There are five orange juice cartons.', explanation: 'The complete delivery scan shows exactly five orange juice cartons.' }
  ];

  const pack = [
    { type: 'match', prompt: 'Match each container to the food or drink.', pairs: [pair('a bottle of', 'water', 'rice', 'bread'), pair('a loaf of', 'bread', 'milk', 'beans'), pair('a bag of', 'rice', 'juice', 'cheese')], explanation: 'We say a bottle of water, a loaf of bread and a bag of rice.' },
    { type: 'match', prompt: 'Pack the shopping correctly.', pairs: [pair('a carton of', 'milk', 'pasta', 'honey'), pair('a jar of', 'honey', 'bread', 'water'), pair('a packet of', 'pasta', 'juice', 'beans')], explanation: 'Milk comes in a carton, honey in a jar and pasta in a packet.' },
    { type: 'match', prompt: 'Choose the natural container phrase.', pairs: [pair('a tin of', 'beans', 'tea', 'bread'), pair('a cup of', 'tea', 'rice', 'milk cartons'), pair('a box of', 'cereal', 'water', 'butter')], explanation: 'Use a tin of beans, a cup of tea and a box of cereal.' },
    { type: 'match', prompt: 'Match the quantities.', pairs: [pair('a slice of', 'pizza', 'milk', 'rice'), pair('a piece of', 'cheese', 'juice', 'beans'), pair('a glass of', 'orange juice', 'bread', 'pasta')], explanation: 'Pizza can be a slice, cheese a piece and juice a glass.' },
    { type: 'match', prompt: 'Complete the shopping list.', pairs: [pair('a bottle of', 'lemonade', 'cereal', 'cake'), pair('a kilo of', 'potatoes', 'tea', 'juice'), pair('a packet of', 'biscuits', 'water', 'honey')], explanation: 'These are natural container and quantity phrases.' },
    { type: 'match', prompt: 'Match each food to its pack.', pairs: [pair('a tub of', 'ice cream', 'bread', 'water'), pair('a bag of', 'sugar', 'milk', 'pizza'), pair('a tin of', 'tomatoes', 'tea', 'cheese')], explanation: 'Ice cream comes in a tub, sugar in a bag and tomatoes in a tin.' },
    { type: 'match', prompt: 'Build three correct phrases.', pairs: [pair('a carton of', 'orange juice', 'rice', 'honey'), pair('a loaf of', 'brown bread', 'milk', 'beans'), pair('a jar of', 'jam', 'pasta', 'water')], explanation: 'Use carton of juice, loaf of bread and jar of jam.' },
    { type: 'match', prompt: 'Choose the correct quantity word.', pairs: [pair('a bowl of', 'soup', 'lemonade', 'bread loaf'), pair('a plate of', 'pasta', 'milk', 'jam'), pair('a cup of', 'coffee', 'rice bag', 'beans')], explanation: 'Soup goes in a bowl, pasta on a plate and coffee in a cup.' },
    { type: 'match', prompt: 'Pack the café order.', pairs: [pair('a slice of', 'cake', 'tea', 'cereal'), pair('a cup of', 'hot chocolate', 'bread', 'rice'), pair('a glass of', 'water', 'biscuits', 'pasta')], explanation: 'These phrases match a café order.' },
    { type: 'match', prompt: 'Match the shop containers.', pairs: [pair('a box of', 'eggs', 'juice', 'honey'), pair('a bottle of', 'olive oil', 'bread', 'cereal'), pair('a packet of', 'crisps', 'milk', 'jam')], explanation: 'Eggs use a box, oil a bottle and crisps a packet.' },
    { type: 'match', prompt: 'Choose all three correct packs.', pairs: [pair('a can of', 'lemonade', 'bread', 'rice'), pair('a bar of', 'chocolate', 'water', 'pasta'), pair('a bag of', 'flour', 'juice', 'cheese')], explanation: 'Use a can of lemonade, a bar of chocolate and a bag of flour.' },
    { type: 'match', prompt: 'Match each breakfast item.', pairs: [pair('a bowl of', 'cereal', 'milk bottle', 'bread'), pair('a slice of', 'toast', 'juice', 'rice'), pair('a jar of', 'marmalade', 'tea', 'eggs')], explanation: 'Cereal goes in a bowl, toast is a slice and marmalade comes in a jar.' },
    { type: 'match', prompt: 'Prepare the picnic basket.', pairs: [pair('a bottle of', 'water', 'sandwich', 'apple'), pair('a packet of', 'crisps', 'juice carton', 'cheese piece'), pair('a piece of', 'fruit', 'lemonade', 'bread loaf')], explanation: 'The natural phrases are bottle of water, packet of crisps and piece of fruit.' },
    { type: 'match', prompt: 'Match the cooking ingredients.', pairs: [pair('a bag of', 'rice', 'oil', 'tomatoes'), pair('a bottle of', 'oil', 'flour', 'beans'), pair('a tin of', 'beans', 'bread', 'milk')], explanation: 'Rice uses a bag, oil a bottle and beans a tin.' },
    { type: 'match', prompt: 'Complete the final delivery.', pairs: [pair('a crate of', 'oranges', 'tea', 'butter'), pair('a pot of', 'yoghurt', 'water', 'bread'), pair('a kilo of', 'apples', 'juice', 'cereal')], explanation: 'These container phrases fit the delivered products.' }
  ];
  pack.forEach((task) => { task.prompt = 'Choose the grammatically correct completion for each container phrase.'; });

  const packagingItems = [
    { containerId: 'bar', productId: 'chocolate', starter: 'a bar of', cardLabel: 'bar of', full: 'a bar of chocolate', accepted: ['a bar of chocolate', 'the bar of chocolate'], explanation: 'We use bar for a solid piece of chocolate.' },
    { containerId: 'bottle', productId: 'water', starter: 'a bottle of', cardLabel: 'bottle of', full: 'a bottle of water', accepted: ['a bottle of water', 'the bottle of water'], explanation: 'Water is commonly sold in a bottle.' },
    { containerId: 'can', productId: 'tuna', starter: 'a can of', cardLabel: 'can of', full: 'a can of tuna', accepted: ['a can of tuna', 'the can of tuna'], explanation: 'Tuna is commonly sold in a can.' },
    { containerId: 'carton', productId: 'milk', starter: 'a carton of', cardLabel: 'carton of', full: 'a carton of milk', accepted: ['a carton of milk', 'the carton of milk'], explanation: 'Milk is commonly sold in a carton.' },
    { containerId: 'jar', productId: 'jam', starter: 'a jar of', cardLabel: 'jar of', full: 'a jar of jam', accepted: ['a jar of jam', 'the jar of jam'], explanation: 'Jam is commonly kept in a jar.' },
    { containerId: 'packet', productId: 'flour', starter: 'a packet of', cardLabel: 'packet of', full: 'a packet of flour', accepted: ['a packet of flour', 'the packet of flour'], explanation: 'In this Unit 0 phrase, flour comes in a packet.' }
  ];
  const packagingSignature = (items) => items.map((item) => `${item.containerId}:${item.productId}`).join('|');
  const recallTask = (...indexes) => {
    const items = indexes.map((index) => packagingItems[index]);
    return {
      type: 'containerRecall',
      prompt: `Recall ${items.length} complete container phrases from the pictures.`,
      instruction: 'Look at each picture and type the complete container phrase.',
      items,
      answer: items.map((item) => item.full),
      explanation: 'Use a or the, then the correct container + of + product phrase.'
    };
  };
  const packagingStation = [
    {
      type: 'packagingStation', featured: true,
      prompt: 'Ziggy mixed up the products and packages. Build all six Unit 0 orders.',
      instruction: 'Choose a product, then choose the matching container card.',
      items: packagingItems,
      answer: packagingSignature(packagingItems),
      explanation: 'All six products are matched with their natural Go Getter 3 Unit 0 container phrases.'
    },
    recallTask(0, 1), recallTask(2, 3), recallTask(4, 5), recallTask(0, 2, 4), recallTask(1, 3, 5),
    recallTask(0, 3), recallTask(1, 4), recallTask(2, 5), recallTask(0, 4, 5), recallTask(1, 2, 3),
    recallTask(0, 2, 5), recallTask(1, 3, 4), recallTask(0, 1, 5), recallTask(2, 3, 4)
  ];

  const askAnswer = [
    { type: 'order', prompt: 'Build the question.', words: ['How many', 'apples', 'are', 'in the basket'], answer: 'How many apples are in the basket?', orderHint: 'Start with the question phrase and noun. Put the verb before the place phrase.', explanation: 'Use How many + plural noun + are.' },
    { type: 'order', prompt: 'Build the question.', words: ['How much', 'milk', 'is', 'in the fridge'], answer: 'How much milk is in the fridge?', orderHint: 'Start with the question phrase and noun. Put the verb before the place phrase.', explanation: 'Use How much with uncountable milk.' },
    { type: 'order', prompt: 'Build the answer.', words: ['There', 'are', 'six', 'eggs'], answer: 'There are six eggs.', orderHint: 'Start with There and the verb. Put the number before the plural noun.', explanation: 'Use there are with a plural quantity.' },
    { type: 'order', prompt: 'Build the question.', words: ['How many', 'bottles of water', 'do', 'we need'], answer: 'How many bottles of water do we need?', orderHint: 'Start with the question phrase and noun. Then use the helper verb before the subject.', explanation: 'Count the bottles, so use how many.' },
    { type: 'order', prompt: 'Build the answer.', words: ['We', 'need', 'two', 'cartons'], answer: 'We need two cartons.', orderHint: 'Start with the subject and verb. Put the number before the plural noun.', explanation: 'Two comes before the plural container cartons.' },
    { type: 'order', prompt: 'Build the question.', words: ['How much', 'rice', 'have', 'we got'], answer: 'How much rice have we got?', orderHint: 'Start with the question phrase and noun. Put the helper verb before the subject.', explanation: 'Rice is uncountable, so use how much.' },
    { type: 'order', prompt: 'Build the answer.', words: ['There', 'is', 'a little', 'cheese'], answer: 'There is a little cheese.', orderHint: 'Start with There and the verb. Put the quantity phrase before the food noun.', explanation: 'A little is used with uncountable cheese.' },
    { type: 'order', prompt: 'Build the question.', words: ['How many', 'sandwiches', 'are', 'there'], answer: 'How many sandwiches are there?', orderHint: 'Start with the question phrase and noun. Then put the verb before there.', explanation: 'Sandwiches are countable and plural.' },
    { type: 'input', prompt: 'Complete the question:\nHow ___ sugar is there?', answer: 'much', explanation: 'Sugar is uncountable.' },
    { type: 'input', prompt: 'Complete the question:\nHow ___ bananas do you want?', answer: 'many', explanation: 'Bananas are countable and plural.' },
    { type: 'input', prompt: 'Complete the answer:\nThere ___ four tins of beans.', answer: 'are', explanation: 'Use are with plural tins.' },
    { type: 'input', prompt: 'Complete the answer:\nThere ___ some orange juice.', answer: 'is', explanation: 'Use is with uncountable orange juice.' },
    { type: 'input', prompt: 'Write the missing container:\nWe need a ___ of bread.', answer: 'loaf', explanation: 'The natural phrase is a loaf of bread.' },
    { type: 'input', prompt: 'Complete the packaged product phrase:\na ___ of water', answer: 'bottle', explanation: 'Packaged water is commonly sold in a bottle: a bottle of water.' },
    { type: 'input', prompt: 'Complete the question:\nHow ___ packets of pasta are there?', answer: 'many', explanation: 'Packets are countable.' }
  ];

  let boss = [
    { type: 'choice', prompt: 'Choose the grammatically correct sentence.', options: ['How much bread do we need?', 'How many bread do we need?', 'How much loaves do we need?'], answer: 'How much bread do we need?', explanation: 'Bread is uncountable.', longOptions: true },
    { type: 'choice', prompt: 'How many ___ of milk are there?', options: ['cartons', 'milk', 'rice'], answer: 'cartons', explanation: 'Cartons are countable.' },
    { type: 'choice', prompt: 'Choose the grammatically correct phrase.', options: ['a jar of honey', 'an jar of honey', 'a jar honey of'], answer: 'a jar of honey', explanation: 'Use a + container + of + product: a jar of honey.' },
    { type: 'choice', prompt: '___ coffee is in the cup?', options: ['How much', 'How many', 'How'], answer: 'How much', explanation: 'Coffee is uncountable.' },
    { type: 'choice', prompt: 'There are ___ bottles on the table.', options: ['three', 'much', 'a little'], answer: 'three', explanation: 'Use a number with plural countable bottles.' },
    { type: 'order', prompt: 'Build the question.', words: ['How many', 'tomatoes', 'do', 'we need'], answer: 'How many tomatoes do we need?', explanation: 'Tomatoes are countable and plural.' },
    { type: 'order', prompt: 'Build the question.', words: ['How much', 'orange juice', 'is', 'there'], answer: 'How much orange juice is there?', explanation: 'Orange juice is uncountable.' },
    { type: 'order', prompt: 'Build the answer.', words: ['There', 'are', 'five', 'packets of biscuits'], answer: 'There are five packets of biscuits.', explanation: 'Use there are with five packets.' },
    { type: 'order', prompt: 'Build the request.', words: ['Can I have', 'a slice of', 'cake', 'please'], answer: 'Can I have a slice of cake please?', explanation: 'A slice of cake is the correct quantity phrase.' },
    { type: 'order', prompt: 'Build the answer.', words: ['We', 'have got', 'a little', 'rice'], answer: 'We have got a little rice.', explanation: 'A little is used with uncountable rice.' },
    { type: 'input', instruction: 'Write a complete answer with the plural noun.', prompt: 'Write the full answer:\nHow many apples are there?', answer: 'There are three apples.', explanation: 'A complete answer repeats the plural noun: There are three apples.' },
    { type: 'input', instruction: 'Write a complete answer with the plural noun.', prompt: 'Write the full answer:\nHow many eggs are there?', answer: 'There are twelve eggs.', explanation: 'A complete answer repeats the plural noun: There are twelve eggs.' },
    { type: 'input', instruction: 'Write a complete answer with the container phrase.', prompt: 'Write the full answer:\nHow many bottles of water are there?', answer: 'There are two bottles of water.', explanation: 'Count the containers and repeat the full phrase: two bottles of water.' },
    { type: 'input', instruction: 'Write a complete answer with the container phrase.', prompt: 'Write the full answer:\nHow many cartons of milk are there?', answer: 'There are four cartons of milk.', explanation: 'Count the containers and repeat the full phrase: four cartons of milk.' },
    { type: 'input', instruction: 'Write the complete Unit 0 container phrase.', prompt: 'Write the full phrase for one chocolate item.', answer: 'a bar of chocolate', explanation: 'The natural Unit 0 container phrase is a bar of chocolate.' }
  ];

  const interactiveShelf = window.SUPERMARKET_SHELF.scene;
  const visualScenes = window.SUPERMARKET_SHELF.countScenes;
  const countTargets = [
    ['apple', 'lettuce', 'water'],
    ['chocolate', 'tuna', 'jam'],
    ['bread', 'juice', 'sugar'],
    ['tuna', 'chocolate', 'apple'],
    ['milk', 'flour', 'bread']
  ];
  countFood = visualScenes.flatMap((sceneData, sceneIndex) => countTargets[sceneIndex].map((itemId) => window.SUPERMARKET_SHELF.makeCountTask(sceneData, itemId)));
  boss = boss.filter((task) => !task.scene);
  muchMany.unshift({ ...window.SUPERMARKET_SHELF.makeHowMuchManyTask(visualScenes[0], 'apple', false), featured: true });
  muchMany.push(window.SUPERMARKET_SHELF.makeHowMuchManyTask(visualScenes[4], 'flour', true));
  countFood.unshift({
    type: 'shelfFind', featured: true, scene: visualScenes[0],
    instruction: 'Find and tap the correct item.',
    prompt: 'Find and tap an apple. There are three apples, so any one is correct.',
    targetLabel: 'an apple', answer: 'apple',
    explanation: 'You found one of the three separate apples.'
  });
  boss.unshift({ ...window.SUPERMARKET_SHELF.makeTruthTask(visualScenes[1], 'chocolate'), featured: true });
  boss.push(window.SUPERMARKET_SHELF.makeCountTask(visualScenes[4], 'sugar'));

  const addSemanticAudit = (bank, mode) => bank.forEach((task) => {
    if (!['choice', 'sceneChoice', 'shelfChoice'].includes(task.type)) return;
    task.semanticAudit = {
      mode: task.auditMode || (task.scene ? 'picture' : mode),
      reviewed: true,
      trueOptions: [task.answer],
      falseOptions: task.options.filter((option) => option !== task.answer).map((option) => ({
        option,
        reason: (task.auditMode || (task.scene ? 'picture' : mode)) === 'picture'
          ? 'This sentence gives a quantity that does not match the complete visual count.'
          : 'This option breaks the target grammar or container pattern.'
      }))
    };
  });
  addSemanticAudit(muchMany, 'grammar');
  addSemanticAudit(countFood, 'picture');
  addSemanticAudit(boss, 'grammar');

  window.FOOD_QUEST_CONFIG = {
    gameKey: 'quantityQuestHowMuchMany',
    title: 'Quantity Quest!',
    results: {
      excellent: 'Max says: “Fantastic! Every count, container and quantity is correct!”',
      good: 'Max says: “Great quest! Try again to make every quantity perfect.”',
      keepGoing: 'Max says: “Good start! Sort the nouns, check the containers and try again.”'
    },
    rounds: [
      { name: 'How Much or How Many?', icon: '?', instruction: 'Choose the correct question starter.', status: 'Noun scanner active', theme: 'count', guide: max('First decide whether the noun is countable or uncountable.'), bank: muchMany },
      { name: 'Count the Food', icon: '#', instruction: PICTURE_PROMPT, status: 'Food counter active', theme: 'count', guide: lexi('Count every item, then choose the one sentence that matches.', 'Count the pictured items again—the sentence must match exactly!'), bank: countFood },
      { name: 'Packaging Station', icon: '▣', instruction: 'Match every product to the right Unit 0 container.', status: 'Ziggy’s packing line active', theme: 'pack', guide: ziggy('Focus on container + of + product. Both a and the are accepted in complete phrases.'), bank: packagingStation },
      { name: 'Ask & Answer', icon: '↔', instruction: 'Build or complete a quantity question and answer.', status: 'Question link active', theme: 'ask', guidedWordOrder: true, guide: lexi('Use the noun to choose the question pattern.'), bank: askAnswer },
      { name: 'Quantity Boss', icon: '★', instruction: 'Combine counting, containers and questions.', status: 'Boss scanner active', theme: 'boss', guide: ziggy('My final quantity tricks mix every skill!'), bank: boss }
    ]
  };
})();
