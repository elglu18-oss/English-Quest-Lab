window.WRITING_MISSION_DATA = {
  build: [
    {words:['school','I','bus','usually','to','by','go'],answer:'I usually go to school by bus.',accepted:['I usually go to school by bus.','I usually go by bus to school.','I go usually to school by bus.','I go usually by bus to school.','I go to school usually by bus.','I go by bus usually to school.','I go to school by bus usually.','I go by bus to school usually.'],explanation:'Usually can move in this sentence, and both place phrases can change order without changing the basic meaning.'},
    {words:['football','brother','Does','your','play'],answer:'Does your brother play football?',explanation:'Use Does + subject + base verb in Present Simple questions.'},
    {words:['never','late','class','is','for','Mia'],answer:'Mia is never late for class.',accepted:['Mia is never late for class.','Mia never is late for class.'],explanation:'The usual A1/A2 order is “is never”, but “never is” can also be grammatical when never is emphasised.'},
    {words:['you','Where','weekends','do','at','go'],answer:'Where do you go at weekends?',explanation:'Use question word + do + subject + base verb.'},
    {words:['going','museum','visit','a','are','We','to'],answer:'We are going to visit a museum.',explanation:'Use be going to + base verb for a plan.'},
    {words:['is','cook','going','dinner','Max','to'],answer:'Max is going to cook dinner.',explanation:'The form is is going to + base verb.'},
    {words:['fridge','some','There','apples','the','are','in'],answer:'There are some apples in the fridge.',explanation:'Use There are with plural nouns and some in affirmative sentences.'},
    {words:['milk','any','Is','there','carton','the','in'],answer:'Is there any milk in the carton?',explanation:'Use Is there any with an uncountable noun.'},
    {words:['our','near','school','a','There','park','is'],answer:'There is a park near our school.',accepted:['There is a park near our school.','There is a school near our park.'],explanation:'Both the park and the school are singular, so either can follow “There is a” with this word set.'},
    {words:['homework','When','your','do','you','do'],answer:'When do you do your homework?',explanation:'Use When + do + subject + base verb.'},
    {words:['often','library','We','after','visit','school','the'],answer:'We often visit the library after school.',accepted:['We often visit the library after school.','We visit the library often after school.','We visit the library after school often.'],explanation:'The standard learning pattern puts often before visit, but the two end positions are also grammatical.'},
    {words:['aren’t','table','There','any','on','eggs','the'],answer:'There aren’t any eggs on the table.',explanation:'Use aren’t any with a plural noun in a negative sentence.'}
  ],
  stories: [
    {id:'easy',title:'Easy · A Saturday in Town',mode:'select',sentences:[
      'On Saturday, Mia and I {{go}} to the town centre by {{bus}}.',
      'We usually meet near the {{cinema}} at ten o’clock.',
      'First, we visit the museum because Mia likes {{history}}.',
      'Then we have lunch in a small {{café}}.',
      'There are some sandwiches, but there isn’t any {{juice}}.',
      'In the afternoon, we are going to walk home through the park.'
    ],answers:{go:'go',bus:'bus',cinema:'cinema',history:'history',café:'café',juice:'juice'},options:{go:['go','goes','going'],bus:['bus','boat','underground'],cinema:['cinema','canteen','gym'],history:['history','milk','tram'],café:['café','hospital','classroom'],juice:['juice','rice','flour']}},
    {id:'medium',title:'Medium · Our School Project',mode:'bank',sentences:[
      'Our class is making a project about a healthy school {{meal}}.',
      'I usually travel to school by {{tram}}.',
      'Before class, I meet Leo in the computer {{room}}.',
      'We find pictures of fruit and write a shopping {{list}}.',
      'There are some apples, but there isn’t any {{yoghurt}} in our plan.',
      'On Friday, we are going to show the project in the school {{hall}}.'
    ],answers:{meal:'meal',tram:'tram',room:'room',list:'list',yoghurt:'yoghurt',hall:'hall'},bank:['meal','tram','room','list','yoghurt','hall','taxi','museum','teacher']},
    {id:'hard',title:'Hard · Max’s Weekend Plan',mode:'input',sentences:[
      'Max usually {{gets}} up at eight o’clock on Saturday.',
      'This weekend, he is going to {{visit}} his friend Ben.',
      'They are going there by {{train}} because Ben lives in another town.',
      'There is a new sports {{centre}} near the station.',
      'After basketball, they are going to make {{dinner}} together in the evening.',
      'They have pasta and vegetables for the meal, but they need to buy some {{cheese}} to put on top.',
      'Max thinks it is going to be a brilliant day.'
    ],answers:{gets:'gets',visit:'visit',train:'train',centre:'centre',dinner:'dinner',cheese:'cheese'},accepted:{gets:['gets'],visit:['visit'],train:['train'],centre:['centre'],dinner:['dinner'],cheese:['cheese']}}
  ],
  dialogues: [
    {title:'Ask for help',message:'You look worried. What’s the problem?',answer:'Can you help me with this exercise, please?',options:['Can you help me with this exercise, please?','Can I help you with your exercise?','No, that’s fine, thank you.'],hint:'You need Max to help you.',explanation:'Use “Can you help me…?” to ask another person for help.'},
    {title:'Offer help',message:'I can’t carry all these books.',answer:'Can I help you with the books?',options:['Can I help you with the books?','Can you help me with the books?','No, I can’t carry them.'],hint:'Max has a problem. Offer your help.',explanation:'Use “Can I help you…?” when you offer to help someone.'},
    {title:'Agree politely',message:'Can you help me put up this poster, please?',answer:'Yes, of course.',options:['Yes, of course.','Yes, please.','No, that’s fine, thank you.'],hint:'Max is asking you to do something. Agree politely.',explanation:'“Yes, of course” is a natural way to agree to a polite request.'},
    {title:'Refuse politely',message:'Can you come to the park now?',answer:'I’m sorry, I can’t. I’m doing my homework.',options:['I’m sorry, I can’t. I’m doing my homework.','No, that’s fine, thank you.','Yes, please. I’m doing my homework.'],hint:'You cannot go now. Refuse politely and give a reason.',explanation:'“I’m sorry, I can’t” is a polite refusal, and the reason makes it clear.'},
    {title:'Say thank you',message:'Here’s your notebook. I found it in the library.',answer:'Thanks a lot, Max.',options:['Thanks a lot, Max.','Yes, of course.','Can you find my notebook, please?'],hint:'Max gives your notebook back. Thank him.',explanation:'“Thanks a lot” is a friendly and natural response.'},
    {title:'Ask to repeat',message:'The school trip starts at quarter past eight.',answer:'Sorry, can you say that again, please?',options:['Sorry, can you say that again, please?','Can you start the trip again, please?','Yes, the trip starts at school.'],hint:'You did not hear or understand. Ask Max to repeat.',explanation:'“Can you say that again, please?” is a polite request for repetition.'}
  ],
  chats: [
    {
      situation:'Max is leaving the library with six books. One book is slipping from the pile, and your hands are free.',
      message:'These books are really heavy. I can’t carry all of them to the classroom.',
      answer:'Can I help you with the books?',
      options:['Can I help you with the books?','Can you help me with the books, please?','No, that’s fine, thank you.'],
      hint:'Max has a problem, so offer him your help.',
      reaction:'Yes, please! Could you carry the blue ones?'
    },
    {
      situation:'You have spilled some juice. You are holding clean glasses, and Max is standing beside the dirty table.',
      message:'Oh no! There is juice all over the table, and your hands are full.',
      answer:'Can you clean the table, please?',
      options:['Do you need any help with the table?','Can you clean the table, please?','I’m sorry, I can’t help you right now.'],
      hint:'You need Max to do the job, so ask him for help.',
      reaction:'Yes, of course. I’ll get a cloth.'
    },
    {
      situation:'Your class poster must be ready today. You still need to print the title when Max offers to help.',
      message:'Can I help you with your class poster?',
      answer:'Yes, please. Can you print the title?',
      options:['No, that’s fine, thank you.','Can I help you with the poster?','Yes, please. Can you print the title?'],
      hint:'You still have an important job to do, so accept Max’s offer.',
      reaction:'No problem. I’ll print it now.'
    },
    {
      situation:'Your model is almost finished. You only need to add one small door, and you want to finish it yourself.',
      message:'Can I help you with your model?',
      answer:'No, that’s fine, thank you.',
      options:['Yes, please. Can you make the door?','I’m sorry, I can’t help you right now.','No, that’s fine, thank you.'],
      hint:'You do not need help, so refuse Max’s offer politely.',
      reaction:'OK. It looks nearly finished!'
    },
    {
      situation:'You are in the middle of a live online English lesson. The dishes can wait until the lesson ends.',
      message:'Can you wash the dishes now, please?',
      answer:'I’m busy right now.',
      options:['Yes, of course.','No, that’s fine, thank you.','I’m busy right now.'],
      hint:'Max is asking you to do something, but you cannot do it now.',
      reaction:'No problem. You can do them after your lesson.'
    }
  ],
  writingTasks: [
    {id:'school-day',title:'My School Day',target:'Write 5–6 sentences.',minSentences:5,maxSentences:6,situation:'Tell Max what a normal school day is like for you.',plan:['How do you get to school?','What lessons do you have?','What do you do at break time?','What do you do after school?'],phrases:['I usually…','My favourite lesson is…','At break time…','After school…']},
    {id:'town-weekend',title:'My Town and My Weekend',target:'Write 6–8 sentences.',minSentences:6,maxSentences:8,situation:'Describe your town and your plans for this weekend.',plan:['Name two places in your town.','Say where you often go.','Explain how you travel there.','Describe one weekend plan.'],phrases:['There is / There are…','I often go…','I go there by…','I’m going to…']},
    {id:'english-friend',title:'A Message to My English Friend',target:'Write 50–60 words.',minWords:50,maxWords:60,situation:'Write a friendly message about school, free time and your weekend plan.',plan:['Greet your friend.','Describe school and a favourite subject.','Mention a free-time activity.','Ask one question and say goodbye.'],phrases:['Hi …,','My favourite…','At weekends…','What about you?']}
  ]
};
