(() => {
  'use strict';

  const products = [
    { id: 'chocolate', label: 'a bar of chocolate', plural: 'bars of chocolate', containerType: 'bar', substance: 'chocolate', substanceCountable: false, image: 'assets/products/bar-of-chocolate.png', countable: true, countSafe: true, imageUnitCount: 1 },
    { id: 'water', label: 'a bottle of water', plural: 'bottles of water', containerType: 'bottle', substance: 'water', substanceCountable: false, image: 'assets/products/bottle-of-water.png', countable: true, countSafe: true, imageUnitCount: 1 },
    { id: 'tuna', label: 'a can of tuna', plural: 'cans of tuna', containerType: 'can', substance: 'tuna', substanceCountable: false, image: 'assets/products/can-of-tuna.png', countable: true, countSafe: true, imageUnitCount: 1 },
    { id: 'milk', label: 'a carton of milk', plural: 'cartons of milk', containerType: 'carton', substance: 'milk', substanceCountable: false, image: 'assets/products/carton-of-milk.png', countable: true, countSafe: true, imageUnitCount: 1 },
    { id: 'jam', label: 'a jar of jam', plural: 'jars of jam', containerType: 'jar', substance: 'jam', substanceCountable: false, image: 'assets/products/jar-of-jam.png', countable: true, countSafe: true, imageUnitCount: 1 },
    { id: 'flour', label: 'a packet of flour', plural: 'packets of flour', containerType: 'packet', substance: 'flour', substanceCountable: false, image: 'assets/products/packet-of-flour.png', countable: true, countSafe: true, imageUnitCount: 1 },
    { id: 'avocado', label: 'an avocado', plural: 'avocados', containerType: 'loose', substance: 'avocado', substanceCountable: true, image: 'assets/products/avocado.png', countable: true, countSafe: false, imageUnitCount: null },
    { id: 'cucumber', label: 'a cucumber', plural: 'cucumbers', containerType: 'loose', substance: 'cucumber', substanceCountable: true, image: 'assets/products/cucumber.png', countable: true, countSafe: false, imageUnitCount: null },
    { id: 'lettuce', label: 'a head of lettuce', plural: 'heads of lettuce', containerType: 'head', substance: 'lettuce', substanceCountable: false, image: 'assets/products/lettuce.png', countable: true, countSafe: true, imageUnitCount: 1 },
    { id: 'apple', label: 'an apple', plural: 'apples', containerType: 'loose', substance: 'apple', substanceCountable: true, image: 'assets/products/apple.png', countable: true, countSafe: true, imageUnitCount: 1 },
    { id: 'banana', label: 'a banana', plural: 'bananas', containerType: 'loose', substance: 'banana', substanceCountable: true, image: 'assets/products/banana.png', countable: true, countSafe: false, imageUnitCount: 3 },
    { id: 'potato', label: 'a potato', plural: 'potatoes', containerType: 'loose', substance: 'potato', substanceCountable: true, image: 'assets/products/potato.png', countable: true, countSafe: false, imageUnitCount: null },
    { id: 'orange', label: 'an orange', plural: 'oranges', containerType: 'loose', substance: 'orange', substanceCountable: true, image: 'assets/products/orange.png', countable: true, countSafe: false, imageUnitCount: null },
    { id: 'tomato', label: 'a tomato', plural: 'tomatoes', containerType: 'loose', substance: 'tomato', substanceCountable: true, image: 'assets/products/tomato.png', countable: true, countSafe: false, imageUnitCount: null },
    { id: 'egg', label: 'an egg', plural: 'eggs', containerType: 'loose', substance: 'egg', substanceCountable: true, image: 'assets/products/egg.png', countable: true, countSafe: false, imageUnitCount: 4 },
    { id: 'bread', label: 'a loaf of bread', plural: 'loaves of bread', containerType: 'loaf', substance: 'bread', substanceCountable: false, image: 'assets/products/bread-loaf.png', countable: true, countSafe: true, imageUnitCount: 1 },
    { id: 'cheese', label: 'a piece of cheese', plural: 'pieces of cheese', containerType: 'piece', substance: 'cheese', substanceCountable: false, image: 'assets/products/cheese.png', countable: true, countSafe: false, imageUnitCount: 4 },
    { id: 'butter', label: 'a block of butter', plural: 'blocks of butter', containerType: 'block', substance: 'butter', substanceCountable: false, image: 'assets/products/butter.png', countable: true, countSafe: true, imageUnitCount: 1 },
    { id: 'sugar', label: 'a packet of sugar', plural: 'packets of sugar', containerType: 'packet', substance: 'sugar', substanceCountable: false, image: 'assets/products/sugar-packet.png', countable: true, countSafe: true, imageUnitCount: 1 },
    { id: 'juice', label: 'a carton of juice', plural: 'cartons of juice', containerType: 'carton', substance: 'juice', substanceCountable: false, image: 'assets/products/juice-carton.png', countable: true, countSafe: true, imageUnitCount: 1 }
  ];

  const numberWords = ['zero', 'one', 'two', 'three', 'four', 'five', 'six'];
  const productMap = Object.fromEntries(products.map((product) => [product.id, product]));
  const singularUnit = (product) => product.label.replace(/^(?:a|an) /, '');

  const createScene = ({ id, title, areaId, inventory }) => ({
    id,
    title,
    zone: areaId.replaceAll('-', ' '),
    areaId,
    completeInventory: true,
    products: Object.keys(inventory).map((itemId) => productMap[itemId]),
    inventory: { ...inventory },
    items: Object.entries(inventory).map(([itemId, quantity]) => ({
      itemId,
      quantity,
      containerType: productMap[itemId].containerType,
      areaId
    })),
    label: `${title}. Complete inventory for ${areaId.replaceAll('-', ' ')}: ${Object.entries(inventory).map(([itemId, quantity]) => `${quantity} ${quantity === 1 ? singularUnit(productMap[itemId]) : productMap[itemId].plural}`).join(', ')}.`
  });

  const inventory = { avocado: 4, cucumber: 3, lettuce: 2, apple: 3, banana: 2, potato: 2 };

  const scene = {
    ...createScene({ id: 'neon-supermarket-shelf-01', title: 'Fresh produce shelf', areaId: 'fresh-produce-display', inventory }),
    label: 'A complete fresh produce shelf with four avocados, three cucumbers, two heads of lettuce, three apples, two bananas and two potatoes.',
    checks: {
      findAndTap: { target: 'apple', answer: 'apple' },
      putInBasket: { request: { apple: 2, lettuce: 1 }, answer: 'apple:2|lettuce:1' },
      thereAre: { prompt: 'Look at the shelf. Which sentence is true?', answer: 'There are four avocados.' },
      someAny: { prompt: 'There are ___ apples on this shelf.', answer: 'some' },
      howMuchMany: { prompt: '___ avocados are there on this shelf?', answer: 'How many' },
      count: { productId: 'cucumber', answer: 3 }
    }
  };

  const scenes = [
    scene,
    createScene({ id: 'neon-supermarket-shelf-02', title: 'Packaged essentials shelf', areaId: 'packaged-essentials-display', inventory: { chocolate: 2, water: 3, tuna: 1, milk: 2, jam: 2, flour: 3 } }),
    createScene({ id: 'neon-supermarket-shelf-03', title: 'Colourful produce shelf', areaId: 'colourful-produce-display', inventory: { orange: 3, tomato: 4, apple: 2, banana: 3, potato: 4, cucumber: 2 } }),
    createScene({ id: 'neon-supermarket-shelf-04', title: 'Breakfast and dairy shelf', areaId: 'breakfast-dairy-display', inventory: { egg: 6, bread: 2, cheese: 2, butter: 2, milk: 2, juice: 3 } }),
    createScene({ id: 'neon-supermarket-shelf-05', title: 'Baking and drinks shelf', areaId: 'baking-drinks-display', inventory: { flour: 3, sugar: 2, water: 3, chocolate: 2, tuna: 2, jam: 1 } })
  ];

  const countScenes = [
    createScene({ id: 'count-safe-shelf-01', title: 'Single-item produce shelf', areaId: 'count-produce-display', inventory: { apple: 3, lettuce: 2, water: 2, tuna: 1 } }),
    createScene({ id: 'count-safe-shelf-02', title: 'Container shelf', areaId: 'count-container-display', inventory: { chocolate: 2, water: 3, tuna: 1, milk: 2, jam: 2, flour: 3 } }),
    createScene({ id: 'count-safe-shelf-03', title: 'Breakfast packs shelf', areaId: 'count-breakfast-display', inventory: { bread: 2, juice: 3, sugar: 2, milk: 2 } }),
    createScene({ id: 'count-safe-shelf-04', title: 'Mixed count shelf', areaId: 'count-mixed-display', inventory: { tuna: 3, chocolate: 1, apple: 4, lettuce: 3 } }),
    createScene({ id: 'count-safe-shelf-05', title: 'Pantry count shelf', areaId: 'count-pantry-display', inventory: { milk: 2, jam: 1, flour: 2, bread: 3, sugar: 4 } })
  ];

  const assertCountSafe = (product, taskKind) => {
    if (!product.countSafe || product.imageUnitCount !== 1) throw new Error(`${taskKind}: ${product.image} does not show exactly one countable unit.`);
  };

  const quantitySentence = (sceneData, itemId, quantity = sceneData.inventory[itemId]) => {
    const product = productMap[itemId];
    return quantity === 1
      ? `There is one ${singularUnit(product)}.`
      : `There are ${numberWords[quantity]} ${product.plural}.`;
  };

  const distractorQuantities = (quantity) => [1, 2, 3, 4].filter((value) => value !== quantity).slice(0, 2);

  const makeTruthTask = (sceneData, itemId) => {
    assertCountSafe(productMap[itemId], 'Truth task');
    return ({
    type: 'shelfChoice', auditMode: 'picture', scene: sceneData,
    instruction: 'Look at the picture. Which sentence is true?',
    prompt: 'Look at the picture. Which sentence is true?',
    options: [quantitySentence(sceneData, itemId), ...distractorQuantities(sceneData.inventory[itemId]).map((quantity) => quantitySentence(sceneData, itemId, quantity))],
    answer: quantitySentence(sceneData, itemId),
    explanation: `The ${sceneData.title.toLowerCase()} contains exactly ${numberWords[sceneData.inventory[itemId]]} ${sceneData.inventory[itemId] === 1 ? singularUnit(productMap[itemId]) : productMap[itemId].plural}.`,
    generatedFromScene: { kind: 'truthSentence', itemId }
    });
  };

  const makeCountTask = (sceneData, itemId) => {
    const product = productMap[itemId];
    assertCountSafe(product, 'Count task');
    const quantity = sceneData.inventory[itemId];
    return {
      type: 'shelfChoice', auditMode: 'picture', scene: sceneData,
      instruction: `How many ${product.plural} are there?`,
      prompt: `How many ${product.plural} are there on this shelf?`,
      options: [quantity, ...distractorQuantities(quantity)].map((optionQuantity) => quantitySentence(sceneData, itemId, optionQuantity)),
      answer: quantitySentence(sceneData, itemId),
      explanation: quantity === 1
        ? `Count the separate pictures: there is one ${singularUnit(product)}.`
        : `Count the separate pictures: there are ${numberWords[quantity]} ${product.plural}.`,
      generatedFromScene: { kind: 'count', itemId }
    };
  };

  const makePresenceTask = (sceneData, itemId, { focus = 'units' } = {}) => {
    const product = productMap[itemId];
    const quantity = sceneData.inventory[itemId];
    const asksAboutSubstance = focus === 'substance';
    if (!asksAboutSubstance) assertCountSafe(product, 'Presence task');
    if (asksAboutSubstance && product.substanceCountable !== false) throw new Error(`Presence task: ${product.substance} is not uncountable.`);
    const pluralUnits = !asksAboutSubstance && quantity > 1;
    const scope = sceneData.title.toLowerCase();
    const prompt = asksAboutSubstance
      ? `Is there any ${product.substance} on the ${scope}?`
      : pluralUnits
        ? `Are there any ${product.plural} on the ${scope}?`
        : `Is there ${product.label} on the ${scope}?`;
    const answer = pluralUnits ? 'Yes, there are.' : 'Yes, there is.';
    return {
      type: 'shelfChoice', auditMode: 'picture', scene: sceneData,
      instruction: 'Answer the Is there / Are there question from this display.',
      prompt,
      options: pluralUnits ? ['Yes, there are.', 'No, there aren’t.', 'Yes, there is.'] : ['Yes, there is.', 'No, there isn’t.', 'Yes, there are.'],
      answer,
      explanation: asksAboutSubstance
        ? `The complete ${scope} shows ${numberWords[quantity]} ${quantity === 1 ? singularUnit(product) : product.plural}, so there is some ${product.substance} there.`
        : pluralUnits
          ? `The complete ${sceneData.title.toLowerCase()} shows ${numberWords[quantity]} ${product.plural}, so use Are there / Yes, there are.`
          : `The complete ${sceneData.title.toLowerCase()} shows one ${singularUnit(product)}, so use Is there / Yes, there is.`,
      generatedFromScene: { kind: 'presence', itemId, focus, form: asksAboutSubstance ? 'uncountable' : pluralUnits ? 'plural' : 'singular' }
    };
  };

  const makeSomeAnyTask = (sceneData, itemId) => {
    const product = productMap[itemId];
    return {
      type: 'shelfChoice', auditMode: 'grammar', scene: sceneData,
      instruction: 'Choose some or any to complete the shelf sentence.',
      prompt: `There are ___ ${product.plural} on this shelf.`,
      options: ['some', 'any', 'much'], answer: 'some',
      explanation: `The scene contains ${numberWords[sceneData.inventory[itemId]]} ${product.plural}; use some in an affirmative plural sentence.`,
      generatedFromScene: { kind: 'someAny', itemId }
    };
  };

  const makeHowMuchManyTask = (sceneData, itemId, askAboutSubstance = false) => {
    const product = productMap[itemId];
    const prompt = askAboutSubstance
      ? `___ ${product.substance} is in these ${product.containerType}s?`
      : `___ ${product.plural} are there on this shelf?`;
    const answer = askAboutSubstance ? 'How much' : 'How many';
    return {
      type: 'shelfChoice', auditMode: 'grammar', scene: sceneData,
      instruction: 'Choose How much or How many for the pictured products.',
      prompt, options: ['How much', 'How many', 'Are there'], answer,
      explanation: askAboutSubstance
        ? `${product.substance[0].toUpperCase()}${product.substance.slice(1)} is uncountable, so use How much.`
        : `${product.plural[0].toUpperCase()}${product.plural.slice(1)} are countable, so use How many.`,
      generatedFromScene: { kind: 'howMuchMany', itemId, askAboutSubstance }
    };
  };

  const signature = (selection) => Object.entries(selection)
    .filter(([, count]) => Number(count) > 0)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([id, count]) => `${id}:${Number(count)}`)
    .join('|');

  const productIds = new Set(products.map((product) => product.id));
  if (products.length !== 20 || Object.keys(inventory).some((id) => !productIds.has(id))) {
    throw new Error('Supermarket shelf: the twenty required product records are incomplete.');
  }
  Object.entries(inventory).forEach(([id, count]) => {
    if (!Number.isInteger(count) || count < 1) throw new Error(`Supermarket shelf: invalid count for ${id}.`);
  });
  if (new Set(products.map((product) => product.image)).size !== products.length || products.some((product) => !product.image.endsWith('.png'))) {
    throw new Error('Supermarket shelf: every product needs its own PNG image.');
  }
  if (!productIds.has(scene.checks.findAndTap.answer)) throw new Error('Supermarket shelf: Find and Tap answer is not on the shelf.');
  Object.entries(scene.checks.putInBasket.request).forEach(([id, count]) => {
    if (!productIds.has(id) || count > inventory[id]) throw new Error(`Supermarket shelf: basket request is impossible for ${id}.`);
  });
  if (signature(scene.checks.putInBasket.request) !== scene.checks.putInBasket.answer) {
    throw new Error('Supermarket shelf: basket answer does not match its request.');
  }
  const usedProductIds = new Set(scenes.flatMap((sceneData) => Object.keys(sceneData.inventory)));
  if (products.some((product) => !usedProductIds.has(product.id))) throw new Error('Supermarket shelf: every PNG product must appear in at least one scene.');

  window.SUPERMARKET_SHELF = { products, productMap, scene, scenes, countScenes, numberWords, signature, quantitySentence, makeTruthTask, makeCountTask, makePresenceTask, makeSomeAnyTask, makeHowMuchManyTask };
})();
