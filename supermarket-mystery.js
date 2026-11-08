(() => {
  const A = 'assets/characters/';
  const lexi = (read, incorrect = 'Look at the grammar clue again!') => ({ name: 'Lexi', think: `${A}lexi-thinking.png.png`, happy: `${A}lexi-happy.png.png`, wrong: `${A}lexi-surprised.png.png`, read, correct: 'Excellent clue work!', incorrect });
  const ziggy = (read) => ({ name: 'Ziggy', think: `${A}ziggy-tricky.png`, happy: `${A}ziggy-surprised.png`, wrong: `${A}ziggy-tricky.png`, read, correct: 'Oops! You solved my sentence!', incorrect: 'My word scramble is still tricky!' });
  const max = (read) => ({ name: 'Max', think: `${A}max-thinking.png`, happy: `${A}max-cheering.png`, wrong: `${A}max-thinking.png`, read, correct: 'Mystery solved! Great job!', incorrect: 'Pause and inspect every clue!' });
  const PICTURE_PROMPT = 'Look at the picture. Which sentence is true?';
  const scene = (title, zone, rawItems, note = '') => ({
    title,
    zone,
    completeInventory: true,
    note: `${note ? `${note} ` : ''}The scanner shows every item in this area.`,
    label: `${title}. ${rawItems.map((item) => `${item[2]} ${item[1]}`).join(', ')}${note ? `. ${note}` : ''}. The scanner shows every item in this area.`,
    items: rawItems.map(([emoji, label, count]) => ({ emoji, label, count }))
  });

  const someAny = [
    { type: 'choice', prompt: 'There is ___ cheese in the fridge.', options: ['some', 'any', 'an'], answer: 'some', explanation: 'Use some in an affirmative sentence with uncountable cheese.' },
    { type: 'choice', prompt: 'There isn’t ___ orange juice.', options: ['any', 'many', 'an'], answer: 'any', explanation: 'Use any in a negative sentence with uncountable orange juice.' },
    { type: 'choice', prompt: 'There aren’t ___ tomatoes in the bag.', options: ['any', 'much', 'a'], answer: 'any', explanation: 'Use any in a negative plural sentence.' },
    { type: 'choice', prompt: 'There are ___ apples on the shelf.', options: ['some', 'any', 'much'], answer: 'some', explanation: 'Use some in an affirmative sentence with plural apples.' },
    { type: 'choice', prompt: 'We haven’t got ___ bread.', options: ['any', 'many', 'an'], answer: 'any', explanation: 'Use any after haven’t got with uncountable bread.' },
    { type: 'choice', prompt: 'There isn’t ___ milk in this bottle.', options: ['any', 'many', 'a'], answer: 'any', explanation: 'Use any in a negative sentence about uncountable milk.' },
    { type: 'choice', prompt: 'There are ___ biscuits in the cupboard.', options: ['some', 'any', 'much'], answer: 'some', explanation: 'Use some in a positive plural sentence.' },
    { type: 'choice', prompt: 'There isn’t ___ rice in the packet.', options: ['any', 'many', 'a'], answer: 'any', explanation: 'Use any with a negative uncountable noun.' },
    { type: 'choice', prompt: 'I can see ___ bananas near the till.', options: ['some', 'much', 'a'], answer: 'some', explanation: 'Use some in this affirmative sentence with plural bananas.' },
    { type: 'choice', prompt: 'We haven’t got ___ eggs.', options: ['any', 'much', 'a'], answer: 'any', explanation: 'Use any in a negative sentence with plural eggs.' },
    { type: 'choice', prompt: 'There is ___ pasta in aisle three.', options: ['some', 'any', 'many'], answer: 'some', explanation: 'Use some with pasta in a positive sentence.' },
    { type: 'choice', prompt: 'There aren’t ___ onions in the basket.', options: ['any', 'much', 'a'], answer: 'any', explanation: 'Use any in a negative plural sentence.' },
    { type: 'choice', prompt: 'Mum buys ___ yoghurt for breakfast.', options: ['some', 'many', 'an'], answer: 'some', explanation: 'Use some in an affirmative sentence with uncountable yoghurt.' },
    { type: 'choice', prompt: 'We don’t need ___ lemonade today.', options: ['any', 'many', 'an'], answer: 'any', explanation: 'Use any after don’t with uncountable lemonade.' },
    { type: 'choice', prompt: 'There isn’t ___ chocolate in my trolley.', options: ['any', 'many', 'an'], answer: 'any', explanation: 'Use any after isn’t with uncountable chocolate.' }
  ];

  let shop = [
    { type: 'sceneChoice', scene: scene('Fresh fruit shelf', 'Aisle 1', [['🍎','apples',5],['🍌','bananas',3],['🍊','oranges',4]]), prompt: PICTURE_PROMPT, options: ['There are some bananas.', 'There aren’t any bananas.', 'There are some eggs.'], answer: 'There are some bananas.', explanation: 'The complete shelf scan shows three bananas and no eggs.' },
    { type: 'sceneChoice', scene: scene('Bakery shelf', 'Aisle 2', [['🥖','loaves of bread',2],['🥐','croissants',4]]), prompt: PICTURE_PROMPT, options: ['There is some bread.', 'There aren’t any croissants.', 'There is some milk.'], answer: 'There is some bread.', explanation: 'The complete shelf scan shows two loaves and four croissants, but no milk.' },
    { type: 'sceneChoice', scene: scene('Cold drinks', 'Aisle 4', [['🧃','juice cartons',3],['🥤','lemonade cups',2]]), prompt: PICTURE_PROMPT, options: ['There are some juice cartons.', 'There aren’t any juice cartons.', 'There are some milk cartons.'], answer: 'There are some juice cartons.', explanation: 'The complete shelf scan shows three juice cartons and no milk cartons.' },
    { type: 'sceneChoice', scene: scene('Dairy shelf', 'Aisle 5', [['🥛','milk bottles',2],['🧀','cheese packs',1],['🧈','butter packs',2]]), prompt: PICTURE_PROMPT, options: ['There is some cheese.', 'There isn’t any cheese.', 'There are some apples.'], answer: 'There is some cheese.', explanation: 'The complete shelf scan shows one cheese pack and no apples.' },
    { type: 'sceneChoice', scene: scene('Vegetable shelf', 'Aisle 1', [['🥕','carrots',6],['🥦','broccoli',2]], 'The tomato tray is empty.'), prompt: PICTURE_PROMPT, options: ['There aren’t any tomatoes.', 'There are some tomatoes.', 'There isn’t any broccoli.'], answer: 'There aren’t any tomatoes.', explanation: 'The tomato tray is explicitly empty, while broccoli is visible.' },
    { type: 'sceneChoice', scene: scene('Breakfast shelf', 'Aisle 6', [['🥣','cereal boxes',3],['🍯','honey jars',2]]), prompt: PICTURE_PROMPT, options: ['There are some cereal boxes.', 'There isn’t any cereal.', 'There are some eggs.'], answer: 'There are some cereal boxes.', explanation: 'The complete scan shows three cereal boxes and two honey jars, but no eggs.' },
    { type: 'sceneChoice', scene: scene('Tinned food', 'Aisle 7', [['🥫','tomato tins',5],['🥫','bean tins',4]]), prompt: PICTURE_PROMPT, options: ['There are some tins of beans.', 'There aren’t any tins of beans.', 'There are some tins of soup.'], answer: 'There are some tins of beans.', explanation: 'The complete shelf scan shows four bean tins and no soup tins.' },
    { type: 'sceneChoice', scene: scene('Snack shelf', 'Aisle 8', [['🍪','biscuit packs',3],['🍫','chocolate bars',4]]), prompt: PICTURE_PROMPT, options: ['There are some chocolate bars.', 'There isn’t any chocolate.', 'There are some apples.'], answer: 'There are some chocolate bars.', explanation: 'The complete scan shows four chocolate bars and no apples.' },
    { type: 'sceneChoice', scene: scene('Frozen food', 'Freezer', [['🍕','pizzas',2],['🍦','ice cream tubs',3]]), prompt: PICTURE_PROMPT, options: ['There is some ice cream.', 'There isn’t any ice cream.', 'There are some burgers.'], answer: 'There is some ice cream.', explanation: 'The complete freezer scan shows three tubs of ice cream and no burgers.' },
    { type: 'sceneChoice', scene: scene('Pasta and rice', 'Aisle 3', [['🍝','pasta packs',4],['🍚','rice bags',3]]), prompt: PICTURE_PROMPT, options: ['There is some rice.', 'There aren’t any rice bags.', 'There is some yoghurt.'], answer: 'There is some rice.', explanation: 'The complete shelf scan shows three rice bags and no yoghurt.' },
    { type: 'sceneChoice', scene: scene('Picnic display', 'Front table', [['🥪','sandwiches',5],['🧃','juice cartons',2],['🍎','apples',3]]), prompt: PICTURE_PROMPT, options: ['There are some sandwiches.', 'There aren’t any sandwiches.', 'There is some cheese.'], answer: 'There are some sandwiches.', explanation: 'The complete display shows five sandwiches and no cheese.' },
    { type: 'sceneChoice', scene: scene('Empty bakery corner', 'Aisle 2', [['🧁','cupcakes',3]], 'The bread basket is empty.'), prompt: PICTURE_PROMPT, options: ['There isn’t any bread.', 'There is some bread.', 'There aren’t any cupcakes.'], answer: 'There isn’t any bread.', explanation: 'The bread basket is explicitly empty, while three cupcakes are visible.' },
    { type: 'sceneChoice', scene: scene('Healthy shelf', 'Aisle 1', [['🥑','avocados',4],['🥒','cucumbers',3],['🥬','lettuces',2]]), prompt: PICTURE_PROMPT, options: ['There are some cucumbers.', 'There isn’t any lettuce.', 'There is some milk.'], answer: 'There are some cucumbers.', explanation: 'The complete scan shows three cucumbers and two lettuces, but no milk.' },
    { type: 'sceneChoice', scene: scene('Tea corner', 'Aisle 9', [['🫖','tea boxes',4],['🍯','honey jars',1]], 'There is no coffee here.'), prompt: PICTURE_PROMPT, options: ['There isn’t any coffee.', 'There is some coffee.', 'There isn’t any honey.'], answer: 'There isn’t any coffee.', explanation: 'The scene explicitly says there is no coffee, while one honey jar is visible.' },
    { type: 'sceneChoice', scene: scene('Checkout display', 'Till 2', [['🍬','sweet bags',5],['🍫','chocolate bars',2],['💧','water bottles',3]]), prompt: PICTURE_PROMPT, options: ['There are some bottles of water.', 'There isn’t any water.', 'There are some bananas.'], answer: 'There are some bottles of water.', explanation: 'The complete checkout scan shows three water bottles and no bananas.' }
  ];

  let fridge = [
    { type: 'sceneChoice', scene: scene('Top shelf', 'Fridge', [['🥛','milk bottle',1],['🧀','cheese pack',1],['🥚','eggs',6]]), prompt: PICTURE_PROMPT, options: ['There are some eggs.', 'There aren’t any eggs.', 'There are some apples.'], answer: 'There are some eggs.', explanation: 'The complete fridge scan shows six eggs and no apples.' },
    { type: 'sceneChoice', scene: scene('Fruit drawer', 'Fridge', [['🍎','apples',3],['🍇','grape box',1]], 'There are no oranges.'), prompt: PICTURE_PROMPT, options: ['There aren’t any oranges.', 'There are some oranges.', 'There aren’t any apples.'], answer: 'There aren’t any oranges.', explanation: 'The scene explicitly says there are no oranges, while three apples are visible.' },
    { type: 'sceneChoice', scene: scene('Door shelf', 'Fridge', [['🧃','orange juice carton',1],['💧','water bottle',2]]), prompt: PICTURE_PROMPT, options: ['There is some orange juice.', 'There isn’t any orange juice.', 'There is some milk.'], answer: 'There is some orange juice.', explanation: 'The complete door scan shows orange juice and water, but no milk.' },
    { type: 'sceneChoice', scene: scene('Vegetable drawer', 'Fridge', [['🥕','carrots',4],['🥦','broccoli',1],['🌽','sweetcorn',2]]), prompt: PICTURE_PROMPT, options: ['There are some carrots.', 'There isn’t any broccoli.', 'There is some cake.'], answer: 'There are some carrots.', explanation: 'The complete drawer scan shows four carrots and broccoli, but no cake.' },
    { type: 'sceneChoice', scene: scene('Empty middle shelf', 'Fridge', [['🧈','butter pack',1]], 'The yoghurt space is empty.'), prompt: PICTURE_PROMPT, options: ['There isn’t any yoghurt.', 'There is some yoghurt.', 'There isn’t any butter.'], answer: 'There isn’t any yoghurt.', explanation: 'The yoghurt space is explicitly empty, while butter is visible.' },
    { type: 'sceneChoice', scene: scene('Lunch shelf', 'Fridge', [['🥪','sandwiches',2],['🥗','salad bowl',1]]), prompt: PICTURE_PROMPT, options: ['There are some sandwiches.', 'There aren’t any sandwiches.', 'There is some pizza.'], answer: 'There are some sandwiches.', explanation: 'The complete shelf scan shows two sandwiches and no pizza.' },
    { type: 'sceneChoice', scene: scene('Dessert shelf', 'Fridge', [['🍰','cake slice',1],['🍮','puddings',3]]), prompt: PICTURE_PROMPT, options: ['There is some cake.', 'There aren’t any puddings.', 'There is some rice.'], answer: 'There is some cake.', explanation: 'The complete shelf scan shows cake and three puddings, but no rice.' },
    { type: 'sceneChoice', scene: scene('Drink shelf', 'Fridge', [['🥤','lemonade bottle',1]], 'There is no milk.'), prompt: PICTURE_PROMPT, options: ['There isn’t any milk.', 'There is some milk.', 'There isn’t any lemonade.'], answer: 'There isn’t any milk.', explanation: 'The scene explicitly says there is no milk, while lemonade is visible.' },
    { type: 'sceneChoice', scene: scene('Breakfast box', 'Fridge', [['🥚','eggs',4],['🥓','bacon packs',2],['🧈','butter pack',1]]), prompt: PICTURE_PROMPT, options: ['There is some butter.', 'There isn’t any butter.', 'There aren’t any eggs.'], answer: 'There is some butter.', explanation: 'The complete box scan shows butter and four eggs.' },
    { type: 'sceneChoice', scene: scene('Cheese drawer', 'Fridge', [['🧀','cheese packs',3]]), prompt: PICTURE_PROMPT, options: ['There is some cheese.', 'There isn’t any cheese.', 'There are some tomatoes.'], answer: 'There is some cheese.', explanation: 'The complete drawer scan shows cheese and no tomatoes.' },
    { type: 'sceneChoice', scene: scene('Leftovers shelf', 'Fridge', [['🍕','pizza slices',2],['🍝','pasta bowl',1]]), prompt: PICTURE_PROMPT, options: ['There are some pizza slices.', 'There aren’t any pizza slices.', 'There is some soup.'], answer: 'There are some pizza slices.', explanation: 'The complete shelf scan shows two pizza slices and no soup.' },
    { type: 'sceneChoice', scene: scene('Fresh drawer', 'Fridge', [['🍅','tomatoes',5],['🥒','cucumbers',2]]), prompt: PICTURE_PROMPT, options: ['There are some tomatoes.', 'There isn’t any cucumber.', 'There is some orange juice.'], answer: 'There are some tomatoes.', explanation: 'The complete drawer scan shows five tomatoes and cucumbers, but no orange juice.' },
    { type: 'sceneChoice', scene: scene('Small fridge', 'Fridge', [['🍎','apple',1],['💧','water bottle',1]], 'There are no eggs.'), prompt: PICTURE_PROMPT, options: ['There aren’t any eggs.', 'There are some eggs.', 'There isn’t any water.'], answer: 'There aren’t any eggs.', explanation: 'The scene explicitly says there are no eggs, while water is visible.' },
    { type: 'sceneChoice', scene: scene('Party shelf', 'Fridge', [['🧁','cupcakes',4],['🧃','juice cartons',3]]), prompt: PICTURE_PROMPT, options: ['There are some cupcakes.', 'There isn’t any juice.', 'There is some cheese.'], answer: 'There are some cupcakes.', explanation: 'The complete shelf scan shows four cupcakes and juice, but no cheese.' },
    { type: 'sceneChoice', scene: scene('Bottom shelf', 'Fridge', [['🥩','meat pack',1],['🐟','fish pack',1]], 'The chicken tray is empty.'), prompt: PICTURE_PROMPT, options: ['There isn’t any chicken.', 'There is some chicken.', 'There isn’t any fish.'], answer: 'There isn’t any chicken.', explanation: 'The chicken tray is explicitly empty, while fish is visible.' }
  ];

  const build = [
    { type: 'order', prompt: 'Build an affirmative sentence.', words: ['There', 'is', 'some', 'milk', 'in the fridge'], answer: 'There is some milk in the fridge.', explanation: 'Use There is + some + uncountable noun.' },
    { type: 'order', prompt: 'Build a negative sentence.', words: ['There', 'aren’t', 'any', 'apples', 'in the basket'], answer: 'There aren’t any apples in the basket.', explanation: 'Use There aren’t any with a plural noun.' },
    { type: 'order', prompt: 'Build a question.', words: ['Are', 'there', 'any', 'eggs', 'on the shelf'], answer: 'Are there any eggs on the shelf?', explanation: 'Use Are there any with plural eggs.' },
    { type: 'order', prompt: 'Build a question.', words: ['Is', 'there', 'any', 'bread', 'in the shop'], answer: 'Is there any bread in the shop?', explanation: 'Use Is there any with uncountable bread.' },
    { type: 'order', prompt: 'Build an affirmative sentence.', words: ['There', 'are', 'some', 'tomatoes', 'near the till'], answer: 'There are some tomatoes near the till.', explanation: 'Use There are some with plural tomatoes.' },
    { type: 'order', prompt: 'Build a short answer.', words: ['Yes', 'there', 'is'], answer: 'Yes, there is.', explanation: 'The short answer to Is there...? is Yes, there is.' },
    { type: 'order', prompt: 'Build a short answer.', words: ['No', 'there', 'aren’t'], answer: 'No, there aren’t.', explanation: 'The negative short answer to Are there...? is No, there aren’t.' },
    { type: 'order', prompt: 'Build a negative sentence.', words: ['There', 'isn’t', 'any', 'cheese', 'in my sandwich'], answer: 'There isn’t any cheese in my sandwich.', explanation: 'Use There isn’t any with uncountable cheese.' },
    { type: 'order', prompt: 'Build an affirmative sentence.', words: ['There', 'are', 'some', 'biscuits', 'in the cupboard'], answer: 'There are some biscuits in the cupboard.', explanation: 'Use There are some with plural biscuits.' },
    { type: 'order', prompt: 'Build a question.', words: ['Are', 'there', 'any', 'bananas', 'in your trolley'], answer: 'Are there any bananas in your trolley?', explanation: 'Use Are there any with plural bananas.' },
    { type: 'order', prompt: 'Build a negative sentence.', words: ['There', 'isn’t', 'any', 'rice', 'in this packet'], answer: 'There isn’t any rice in this packet.', explanation: 'Use There isn’t any with uncountable rice.' },
    { type: 'order', prompt: 'Build an affirmative sentence.', words: ['There', 'is', 'some', 'orange juice', 'in the bottle'], answer: 'There is some orange juice in the bottle.', explanation: 'Use There is some with uncountable orange juice.' },
    { type: 'order', prompt: 'Build a question.', words: ['Is', 'there', 'any', 'yoghurt', 'in the fridge'], answer: 'Is there any yoghurt in the fridge?', explanation: 'Use Is there any with yoghurt.' },
    { type: 'order', prompt: 'Build a negative sentence.', words: ['There', 'aren’t', 'any', 'onions', 'on this shelf'], answer: 'There aren’t any onions on this shelf.', explanation: 'Use There aren’t any with plural onions.' },
    { type: 'order', prompt: 'Build an affirmative sentence.', words: ['There', 'are', 'some', 'water bottles', 'by the door'], answer: 'There are some water bottles by the door.', explanation: 'Use There are some with plural bottles.' }
  ];

  let boss = [
    { type: 'choice', prompt: 'Choose the grammatically correct sentence.', options: ['There are some grapes in the bowl.', 'There is some grapes in the bowl.', 'There are any grapes in the bowl.'], answer: 'There are some grapes in the bowl.', explanation: 'Use there are and some with plural grapes.', longOptions: true },
    { type: 'choice', prompt: '___ there any butter in the fridge?', options: ['Is', 'Are', 'Do'], answer: 'Is', explanation: 'Butter is uncountable, so use Is there.' },
    { type: 'choice', prompt: 'There ___ any carrots in the bag.', options: ['aren’t', 'isn’t', 'not'], answer: 'aren’t', explanation: 'Carrots are plural, so use there aren’t.' },
    { type: 'choice', prompt: 'There is ___ pasta for dinner.', options: ['some', 'any', 'many'], answer: 'some', explanation: 'Use some in an affirmative sentence.' },
    { type: 'choice', prompt: 'Are there any lemons? — No, there ___.', options: ['aren’t', 'isn’t', 'not'], answer: 'aren’t', explanation: 'The plural short answer is No, there aren’t.' },
    { type: 'order', prompt: 'Build the question.', words: ['Are', 'there', 'any', 'sandwiches', 'for lunch'], answer: 'Are there any sandwiches for lunch?', explanation: 'Use Are there any with plural sandwiches.' },
    { type: 'order', prompt: 'Build the sentence.', words: ['There', 'is', 'some', 'chocolate', 'in the cupboard'], answer: 'There is some chocolate in the cupboard.', explanation: 'Use There is some with uncountable chocolate.' },
    { type: 'order', prompt: 'Build the negative sentence.', words: ['There', 'aren’t', 'any', 'drinks', 'on the table'], answer: 'There aren’t any drinks on the table.', explanation: 'Use There aren’t any with plural drinks.' },
    { type: 'order', prompt: 'Build the short answer.', words: ['No', 'there', 'isn’t'], answer: 'No, there isn’t.', explanation: 'Use No, there isn’t after an Is there...? question.' },
    { type: 'order', prompt: 'Build the question.', words: ['Is', 'there', 'any', 'milk', 'for breakfast'], answer: 'Is there any milk for breakfast?', explanation: 'Use Is there any with milk.' },
    { type: 'input', prompt: 'Complete with two words:\nThere ___ ___ apples in the fridge.', answer: 'are some', explanation: 'The affirmative plural form is there are some.' },
    { type: 'input', prompt: 'Complete with two words:\nThere ___ ___ orange juice.', answer: "isn't any", explanation: 'Use there isn’t any in a negative sentence.' },
    { type: 'input', prompt: 'Complete the question:\n___ there any eggs?', answer: 'are', explanation: 'Eggs are plural, so use Are there.' },
    { type: 'input', prompt: 'Complete the short answer:\nIs there any cheese? Yes, there ___.', answer: 'is', explanation: 'The affirmative short answer is Yes, there is.' },
    { type: 'input', scene: scene('Final fridge scan', 'Fridge', [['🥛','milk bottle',1],['🍎','apples',4]], 'There is no cheese.'), prompt: 'Complete from the scene:\nThere ___ any cheese.', answer: "isn't", alternatives: ['is not'], explanation: 'The scene says there is no cheese, so use isn’t.' }
  ];

  const interactiveShelf = window.SUPERMARKET_SHELF.scene;
  const visualScenes = window.SUPERMARKET_SHELF.scenes;
  const detectiveScenes = window.SUPERMARKET_SHELF.countScenes;
  const visualTargets = [
    ['apple', 'lettuce'],
    ['water', 'tuna', 'jam', 'chocolate', 'milk', 'flour'],
    ['apple'],
    ['bread', 'butter', 'milk', 'juice'],
    ['sugar', 'chocolate']
  ];
  shop = visualScenes.flatMap((sceneData, sceneIndex) => visualTargets[sceneIndex].map((itemId) => window.SUPERMARKET_SHELF.makeTruthTask(sceneData, itemId)));
  const uncountablePresence = new Set(['water', 'bread', 'sugar']);
  const evidenceTask = (sceneData, itemId) => {
    const product = window.SUPERMARKET_SHELF.productMap[itemId];
    const quantity = sceneData.inventory[itemId];
    return {
      type: 'shelfEvidence', mechanic: 'evidence', auditMode: 'picture', scene: sceneData,
      instruction: 'Find the evidence. Select the exact number of requested products.',
      prompt: `Find ${window.SUPERMARKET_SHELF.numberWords[quantity]} ${product.plural}.`,
      productId: itemId, quantity, answer: `${itemId}:${quantity}`,
      explanation: `The complete shelf contains exactly ${window.SUPERMARKET_SHELF.numberWords[quantity]} ${product.plural}. Select only those separate pictures.`,
      generatedFromShelfDetective: { kind: 'evidence', itemId }
    };
  };
  const askTask = (sceneData, itemId, words, answer, givenAnswer) => ({
    type: 'order', mechanic: 'askZiggy', auditMode: 'grammar', scene: sceneData,
    instruction: 'Ask Ziggy. Build the one question that matches the highlighted product and answer.',
    prompt: 'Build Ziggy’s question about the highlighted product.', focusProductId: itemId,
    givenAnswer, words, answer,
    explanation: `${answer} matches the highlighted quantity. ${givenAnswer} uses the same singular or plural form.`,
    generatedFromShelfDetective: { kind: 'ask', itemId }
  });
  const fixTask = (sceneData, itemId, tokens, errorIndex, replacements, replacement, answer, rule) => ({
    type: 'fixZiggy', mechanic: 'fix', auditMode: 'grammar', scene: sceneData,
    instruction: "Fix Ziggy’s Mistake. Select the one wrong word, then replace it.",
    prompt: "Ziggy made exactly one grammar mistake.", itemId, tokens, errorIndex, replacements, replacement, answer,
    explanation: rule,
    generatedFromShelfDetective: { kind: 'fix', itemId }
  });
  const secretTask = (sceneData, itemId, question, answer, rule) => ({
    type: 'input', mechanic: 'secret', auditMode: 'grammar', scene: sceneData,
    instruction: 'Secret Answer. Type the complete short answer.', prompt: question, answer,
    explanation: rule,
    generatedFromShelfDetective: { kind: 'secret', itemId }
  });

  fridge = [
    evidenceTask(detectiveScenes[0], 'lettuce'),
    evidenceTask(detectiveScenes[1], 'milk'),
    evidenceTask(detectiveScenes[2], 'juice'),
    evidenceTask(detectiveScenes[3], 'apple'),
    evidenceTask(detectiveScenes[4], 'bread'),

    askTask(detectiveScenes[1], 'chocolate', ['Are', 'there', 'any', 'bars of chocolate', 'on this shelf'], 'Are there any bars of chocolate on this shelf?', 'Yes, there are.'),
    askTask(detectiveScenes[0], 'tuna', ['Is', 'there', 'a', 'can of tuna', 'on this shelf'], 'Is there a can of tuna on this shelf?', 'Yes, there is.'),
    askTask(detectiveScenes[2], 'sugar', ['Are', 'there', 'any', 'packets of sugar', 'on this shelf'], 'Are there any packets of sugar on this shelf?', 'Yes, there are.'),
    askTask(detectiveScenes[4], 'jam', ['Is', 'there', 'a', 'jar of jam', 'on this shelf'], 'Is there a jar of jam on this shelf?', 'Yes, there is.'),
    askTask(detectiveScenes[3], 'apple', ['Are', 'there', 'any', 'apples', 'on this shelf'], 'Are there any apples on this shelf?', 'Yes, there are.'),

    fixTask(detectiveScenes[1], 'milk', ['Is', 'there', 'any', 'cartons', 'of', 'milk', 'on', 'this', 'shelf?'], 0, ['Is', 'Are', 'Do'], 'Are', 'Are there any cartons of milk on this shelf?', 'Cartons is a plural noun, so the question begins with Are there any.'),
    fixTask(detectiveScenes[0], 'tuna', ['Are', 'there', 'a', 'can', 'of', 'tuna', 'on', 'this', 'shelf?'], 0, ['Are', 'Is', 'Do'], 'Is', 'Is there a can of tuna on this shelf?', 'One can is singular, so the question begins with Is there a.'),
    fixTask(detectiveScenes[2], 'juice', ['Is', 'there', 'any', 'cartons', 'of', 'juice', 'on', 'this', 'shelf?'], 0, ['Is', 'Are', 'Do'], 'Are', 'Are there any cartons of juice on this shelf?', 'Cartons is a plural noun, so use Are there any, not Is there any.'),
    fixTask(detectiveScenes[4], 'jam', ['Are', 'there', 'a', 'jar', 'of', 'jam', 'on', 'this', 'shelf?'], 0, ['Are', 'Is', 'Do'], 'Is', 'Is there a jar of jam on this shelf?', 'One jar is singular, so use Is there a, not Are there a.'),
    fixTask(detectiveScenes[3], 'apple', ['Is', 'there', 'any', 'apples', 'on', 'this', 'shelf?'], 0, ['Is', 'Are', 'Do'], 'Are', 'Are there any apples on this shelf?', 'Apples is a plural noun, so use Are there any, not Is there any.'),

    secretTask(detectiveScenes[1], 'water', 'Are there any bottles of water on this shelf?', 'Yes, there are.', 'The shelf shows three bottles. A positive plural short answer is Yes, there are.'),
    secretTask(detectiveScenes[0], 'tuna', 'Is there a can of tuna on this shelf?', 'Yes, there is.', 'The shelf shows one can. A positive singular short answer is Yes, there is.'),
    secretTask(detectiveScenes[2], 'egg', 'Are there any eggs on this shelf?', "No, there aren't.", "The complete shelf has no eggs. A negative plural short answer is No, there aren’t."),
    secretTask(detectiveScenes[4], 'butter', 'Is there any butter on this shelf?', "No, there isn't.", "The complete shelf has no butter. A negative singular short answer is No, there isn’t."),
    secretTask(detectiveScenes[3], 'chocolate', 'Is there a bar of chocolate on this shelf?', 'Yes, there is.', 'The shelf shows one bar. A positive singular short answer is Yes, there is.')
  ];
  boss = boss.filter((task) => !task.scene);
  someAny.unshift({ ...window.SUPERMARKET_SHELF.makeSomeAnyTask(interactiveShelf, 'apple'), featured: true });
  shop.unshift({
    type: 'shelfFind', featured: true, scene: interactiveShelf,
    instruction: 'Find and tap the correct item.',
    prompt: 'Find and tap an apple.', targetLabel: 'an apple',
    answer: interactiveShelf.checks.findAndTap.answer,
    explanation: 'You found one of the three separate apples shown on the shelf.'
  });
  const featuredPresence = fridge.find((task) => task.generatedFromScene?.itemId === 'apple' && task.scene.id === interactiveShelf.id);
  if (featuredPresence) featuredPresence.featured = true;
  boss.unshift({
    type: 'shelfBasket', featured: true, scene: window.SUPERMARKET_SHELF.countScenes[1],
    instruction: 'Put the requested items in the basket.',
    prompt: 'Put one bar of chocolate and two bottles of water in the basket.',
    request: { chocolate: 1, water: 2 },
    answer: window.SUPERMARKET_SHELF.signature({ chocolate: 1, water: 2 }),
    displayAnswer: 'one bar of chocolate and two bottles of water',
    explanation: 'The basket contains exactly one chocolate bar and two separate water bottles.'
  });

  const addSemanticAudit = (bank, mode) => bank.forEach((task) => {
    if (!['choice', 'sceneChoice', 'shelfChoice'].includes(task.type)) return;
    task.semanticAudit = {
      mode: task.auditMode || (task.scene ? 'picture' : mode),
      reviewed: true,
      trueOptions: [task.answer],
      falseOptions: task.options.filter((option) => option !== task.answer).map((option) => ({
        option,
        reason: (task.auditMode || (task.scene ? 'picture' : mode)) === 'picture'
          ? 'This sentence does not match the complete inventory shown by the scanner.'
          : 'This option breaks the target grammar rule or does not complete the grammar prompt.'
      }))
    };
  });
  addSemanticAudit(someAny, 'grammar');
  addSemanticAudit(shop, 'picture');
  addSemanticAudit(fridge, 'picture');
  addSemanticAudit(boss, 'grammar');

  window.FOOD_QUEST_CONFIG = {
    gameKey: 'supermarketMysteryThereIsAre',
    title: 'Supermarket Mystery!',
    results: {
      excellent: 'Lexi says: “Amazing! Every supermarket shelf clue is correct!”',
      good: 'Lexi says: “Great detective work! One more visit can make your grammar even stronger.”',
      keepGoing: 'Lexi says: “Good start! Inspect the clues and try the mystery again.”'
    },
    rounds: [
      { name: 'Choose Some or Any', icon: '◇', instruction: 'Choose the word that completes the sentence.', status: 'Word scanner active', theme: 'shop', guide: lexi('Check whether the sentence is positive, negative or a question.'), bank: someAny },
      { name: "What's in the Shop?", icon: '▦', instruction: PICTURE_PROMPT, status: 'Shop camera active', theme: 'shop', guide: lexi('Look closely at every item on the shelf.', 'Check what the complete shelf scan actually shows!'), bank: shop },
      { name: 'Shelf Detective', icon: '▤', instruction: 'Investigate the shelf with four different detective tools.', status: 'Shelf scan active', theme: 'fridge', mechanicCycle: ['evidence', 'askZiggy', 'fix', 'secret', 'evidence'], guide: lexi('Follow the current detective tool and use the complete shelf as evidence.', 'Check the highlighted product, its quantity and the grammar form again!'), bank: fridge },
      { name: 'Build a Sentence', icon: '↔', instruction: 'Tap every word in the correct order.', status: 'Sentence mixer active', theme: 'build', guide: ziggy('Can you unscramble my supermarket sentences?'), bank: build },
      { name: 'Shopping Boss', icon: '★', instruction: 'Use every grammar skill to solve the final case.', status: 'Boss checkout active', theme: 'boss', guide: ziggy('Can you fill the basket before my next trick?'), bank: boss }
    ]
  };
})();
