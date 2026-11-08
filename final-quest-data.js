(() => {
  const q=(id,points,a,b)=>({id,points,variants:[a,b]});
  const v=(prompt,options,answer,context='',explanation='')=>({prompt,options,answer,context,explanation:explanation||`“${answer}” is the only option that correctly completes this item.`});
  const c=(prompt,options,answer,goal,optionIntents,context,explanation)=>({...v(prompt,options,answer,context,explanation),goal,optionIntents});
  window.FINAL_QUEST_DATA={sections:[
    {id:'grammar',title:'Grammar',max:30,tasks:[
      q('g1',4,v('My sister ___ to school by bus every day.',['go','goes','is going'],'goes'),v('Ben ___ football after school on Fridays.',['play','plays','is play'],'plays')),
      q('g2',4,v('___ your brother like science?',['Do','Does','Is'],'Does'),v('___ Mia and Eva live near the park?',['Do','Does','Are'],'Do')),
      q('g3',4,v('I ___ late for English lessons.',['am never','never am','don’t never'],'am never'),v('We ___ lunch in the school canteen.',['usually have','have usually','are usually have'],'usually have')),
      q('g4',3,v('Where ___ you do your homework?',['do','does','are'],'do'),v('What time ___ the lesson start?',['do','does','is'],'does')),
      q('g5',3,v('We ___ visit the museum on Saturday.',['are going to','going to','are go to'],'are going to'),v('Max ___ cook dinner tonight.',['is going to','does going to','is go to'],'is going to')),
      q('g6',3,v('There ___ a café next to the cinema.',['is','are','be'],'is'),v('There ___ two computer rooms in our school.',['is','are','has'],'are')),
      q('g7',3,v('There are ___ apples in the bag.',['some','any','a'],'some'),v('We haven’t got ___ yoghurt.',['some','any','a'],'any')),
      q('g8',3,v('___ there any milk in the fridge?',['Is','Are','Does'],'Is'),v('___ there any cartons on the shelf?',['Is','Are','Do'],'Are')),
      q('g9',3,v('How ___ bottles of water are there?',['much','many','any'],'many'),v('How ___ flour do we need?',['much','many','some'],'much'))
    ]},
    {id:'vocabulary',title:'Vocabulary',max:30,tasks:[
      q('v1',4,v('You can watch a film at the ___.',['cinema','hospital','bank'],'cinema'),v('You can see old objects at the ___.',['museum','stadium','café'],'museum')),
      q('v2',4,v('A ___ travels on rails through a city street.',['tram','boat','plane'],'tram'),v('You can fly to another country by ___.',['plane','underground','bike'],'plane')),
      q('v3',4,v('A person who helps sick animals is a ___.',['vet','builder','pilot'],'vet'),v('A person who prepares food in a restaurant is a ___.',['chef','farmer','nurse'],'chef')),
      q('v4',3,v('Students borrow books from the school ___.',['library','gym','canteen'],'library'),v('Students have lunch in the school ___.',['canteen','hall','staff room'],'canteen')),
      q('v5',3,v('Please buy a ___ of water.',['bottle','bar','jar'],'bottle'),v('We need a ___ of tuna.',['can','carton','packet'],'can')),
      q('v6',3,v('Mum bought a ___ of chocolate.',['bar','bottle','loaf'],'bar'),v('Put the jam back in the ___.',['jar','packet','can'],'jar')),
      q('v7',3,v('Bread, rice and pasta are types of ___.',['food','transport','jobs'],'food'),v('Water, milk and juice are ___.',['drinks','places','subjects'],'drinks')),
      q('v8',3,v('A person who serves customers and takes payment works in a ___.',['shop','hospital','school'],'shop'),v('A pilot flies a ___.',['plane','tram','boat'],'plane')),
      q('v9',3,v('We need a ___ of flour for the cake.',['packet','bottle','bar'],'packet'),v('There is a ___ of milk in the fridge.',['carton','jar','can'],'carton'))
    ]},
    {id:'communication',title:'Communication',max:20,tasks:[
      q('c1',4,
        c('Max: “Can you help me with my homework?” You: “___”',['Yes, of course.',"I’m sorry, I can’t.",'You’re welcome.'],'Yes, of course.','accept-request',['accept-request','refuse-request','respond-to-thanks'],'You are free and want to help Max.','“Yes, of course.” clearly accepts Max’s request.'),
        c('Mia: “Can you carry this bag, please?” You: “___”',['No problem.',"I’m sorry, I can’t.",'You’re welcome.'],'No problem.','accept-request',['accept-request','refuse-request','respond-to-thanks'],'Your hands are free and you want to help Mia.','“No problem.” clearly accepts Mia’s request.')),
      q('c2',4,
        c('Max: “Do you need any help with dinner?” You: “___”',['Yes, please.','You’re welcome.','I can help you.'],'Yes, please.','accept-offer',['accept-offer','respond-to-thanks','offer-help'],'You need help and want to accept Max’s offer.','“Yes, please.” accepts an offer of help.'),
        c('Leo: “Can I help you with the boxes?” You: “___”',['Yes, please.','You’re welcome.','I can help you.'],'Yes, please.','accept-offer',['accept-offer','respond-to-thanks','offer-help'],'The boxes are heavy, and you want Leo’s help.','“Yes, please.” accepts Leo’s offer.')),
      q('c3',3,
        c('You want to offer help with the dishes. You say: “___”',['Can I help you with the dishes?','Can you help me with the dishes?',"I’m busy right now."],'Can I help you with the dishes?','offer-help',['offer-help','ask-for-help','refuse-request'],'Someone else has dishes to wash.','“Can I help you with the dishes?” offers help to another person.'),
        c('Your friend is carrying many books. You say: “___”',['Do you need any help with the books?','Can you carry my books, please?','No, that’s fine, thank you.'],'Do you need any help with the books?','offer-help',['offer-help','ask-for-help','refuse-offer'],'Your hands are free and you want to help.','“Do you need any help with the books?” offers help to your friend.')),
      q('c4',3,
        c('Dad asks you to clean now, but your online lesson is starting. You say: “___”',["I’m busy right now.",'Yes, of course.','Can you help me, please?'],"I’m busy right now.",'refuse-request',['refuse-request','accept-request','ask-for-help'],'You cannot clean now.','“I’m busy right now.” explains why you cannot accept Dad’s request.'),
        c('A friend asks you to move a desk, but your arm hurts. You say: “___”',["I’m sorry, I can’t.",'Yes, of course.','Can you help me, please?'],"I’m sorry, I can’t.",'refuse-request',['refuse-request','accept-request','ask-for-help'],'You must not lift the desk.','“I’m sorry, I can’t.” politely refuses the request.')),
      q('c5',3,
        c('Max: “Can I help you with your model?” You want to finish it alone: “___”',["No, that’s fine, thank you.",'Yes, please.','You’re welcome.'],"No, that’s fine, thank you.",'refuse-offer',['refuse-offer','accept-offer','respond-to-thanks'],'The last step is easy, so you do not need help.','“No, that’s fine, thank you.” politely refuses Max’s offer.'),
        c('Mum offers to water the plants, but you can do it: “___”',["No, that’s fine, thank you.",'Yes, please.','You’re welcome.'],"No, that’s fine, thank you.",'refuse-offer',['refuse-offer','accept-offer','respond-to-thanks'],'You want to water the plants yourself.','“No, that’s fine, thank you.” politely refuses Mum’s offer.')),
      q('c6',3,
        c('You need Max to print a title. You say: “___”',['Can you print the title, please?','Can I print the title, please?','You’re welcome.'],'Can you print the title, please?','ask-for-help',['ask-for-help','ask-permission','respond-to-thanks'],'Max is standing near the printer.','“Can you print the title, please?” asks Max to do the task.'),
        c('You need help with a science task. You say: “___”',['Can you help me with this science task?','Can I help you with this science task?','You’re welcome.'],'Can you help me with this science task?','ask-for-help',['ask-for-help','offer-help','respond-to-thanks'],'Your friend knows how to do the task.','“Can you help me with this science task?” asks another person for help.'))
    ]},
    {id:'reading',title:'Reading & Writing',max:20,tasks:[
      q('r1',4,v('On Saturday, Ava and Ben are going to ___ the town museum.',['visit','visits','visiting'],'visit','A Weekend in Town'),v('On Friday, our class is going to ___ a healthy-food project.',['make','makes','making'],'make','A School Project')),
      q('r2',4,v('They usually travel there by ___. The station is next to Ava’s house.',['train','flour','library'],'train','A Weekend in Town'),v('I travel to school by ___. It stops outside the school gate.',['bus','boat','jar'],'bus','A School Project')),
      q('r3',3,v('There ___ a new café opposite the museum.',['is','are','have'],'is','A Weekend in Town'),v('There ___ two large tables in the computer room.',['are','is','has'],'are','A School Project')),
      q('r4',3,v('The café has some sandwiches, but it hasn’t got ___ juice.',['any','some','a'],'any','A Weekend in Town'),v('We have some apples, but we haven’t got ___ yoghurt.',['any','some','an'],'any','A School Project')),
      q('r5',3,v('Ben asks, “___ you help me choose a sandwich, please?”',['Can','Do need','Are'],'Can','A Weekend in Town'),v('Mia asks, “Can you print the pictures, ___?”',['please','help','of course'],'please','A School Project')),
      q('r6',3,v('Ava answers, “Yes, ___.” Then they order lunch.',['of course',"I’m busy",'thank you'],'of course','A Weekend in Town','“Yes, of course.” naturally agrees to Ben’s request.'),v('I answer, “No ___.” Then we finish the poster.',['problem','thanks','way'],'problem','A School Project','“No problem.” naturally agrees to Mia’s request.'))
    ]}
  ]};
})();
