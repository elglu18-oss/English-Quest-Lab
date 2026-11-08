/*
  Add new units or activities here. The page templates do not need to change.
  An activity is shown only when it is explicitly added to a unit's activities array.
*/
window.ENGLISH_QUEST_DATA = {
  labs: {
    grammar: {
      title: 'Grammar Lab',
      activityLayout: 'missions',
      emptyMessage: 'Grammar activities for Unit 0 will appear here when they are ready.',
      units: [
        {
          id: 0,
          title: 'Get Started!',
          status: 'available',
          activities: [
            {
              type: 'Present Simple',
              title: 'Grammar Glitch!',
              status: 'available',
              href: 'grammar-glitch.html',
              gameKey: 'grammarGlitchPresentSimple',
              cover: 'assets/characters/lexi-thinking.png.png',
              itemCount: '25 challenges',
              description: 'Repair Present Simple sentences with Lexi.'
            },
            {
              type: 'There is / There are · Some / Any',
              title: 'Supermarket Mystery!',
              status: 'available',
              href: 'supermarket-mystery.html',
              gameKey: 'supermarketMysteryThereIsAre',
              cover: 'assets/characters/lexi-happy.png.png',
              itemCount: '25 challenges',
              description: 'Solve there is, there are, some and any clues.'
            },
            {
              type: 'How much / How many',
              title: 'Quantity Quest!',
              status: 'available',
              href: 'quantity-quest.html',
              gameKey: 'quantityQuestHowMuchMany',
              cover: 'assets/characters/lexi-surprised.png.png',
              itemCount: '25 challenges',
              description: 'Master how much and how many.'
            }
          ]
        },
        { id: 1, title: 'Coming Soon', status: 'coming-soon', activities: [] },
        { id: 2, title: 'Coming Soon', status: 'coming-soon', activities: [] }
      ]
    },
    vocabulary: {
      title: 'Vocabulary Lab',
      activityLayout: 'missions',
      emptyMessage: 'Vocabulary activities for Unit 0 will appear here when they are ready.',
      units: [
        {
          id: 0,
          title: 'Get Started!',
          status: 'available',
          wordBank: [
            {
              topic: 'Places in town',
              source: 'Go Getter 3 · Unit 0',
              words: [
                { word: 'bank', image: 'assets/places-in-town/bank.png' },
                { word: 'café', image: 'assets/places-in-town/cafe.png' },
                { word: 'cinema', image: 'assets/places-in-town/cinema.png' },
                { word: 'hospital', image: 'assets/places-in-town/hospital.png' },
                { word: 'hotel', image: 'assets/places-in-town/hotel.png' },
                { word: 'museum', image: 'assets/places-in-town/museum.png' },
                { word: 'park', image: 'assets/places-in-town/park.png' },
                { word: 'restaurant', image: 'assets/places-in-town/restaurant.png' },
                { word: 'stadium', image: 'assets/places-in-town/stadium.png' },
                { word: 'theatre', image: 'assets/places-in-town/theatre.png' }
              ]
            },
            {
              topic: 'Means of transport',
              source: 'Go Getter 3 · Unit 0',
              featured: true,
              words: [
                { word: 'bike', image: 'assets/transport/bike.png' },
                { word: 'boat', image: 'assets/transport/boat.png' },
                { word: 'bus', image: 'assets/transport/bus.png' },
                { word: 'car', image: 'assets/transport/car.png' },
                { word: 'motorbike', image: 'assets/transport/motorbike.png' },
                { word: 'plane', image: 'assets/transport/plane.png' },
                { word: 'taxi', image: 'assets/transport/taxi.png' },
                { word: 'train', image: 'assets/transport/train.png' },
                { word: 'tram', image: 'assets/transport/tram.png' },
                { word: 'underground', image: 'assets/transport/underground.png' }
              ]
            },
            {
              topic: 'Places in a school',
              source: 'Go Getter 3 · Unit 0',
              words: [
                { word: 'canteen', image: 'assets/school/canteen.png' },
                { word: 'classroom', image: 'assets/school/classroom.png' },
                { word: 'computer room', image: 'assets/school/computer-room.png' },
                { word: 'gym', image: 'assets/school/gym.png' },
                { word: 'hall', image: 'assets/school/hall.png' },
                { word: 'library', image: 'assets/school/library.png' },
                { word: 'playground', image: 'assets/school/playground.png' },
                { word: 'staff room', image: 'assets/school/staff-room.png' }
              ]
            },
            {
              topic: 'Food and drink',
              source: 'Go Getter 3 · Unit 0',
              words: [
                { word: 'apple', image: 'assets/food/apple.png' },
                { word: 'biscuit', image: 'assets/products/biscuit.png' },
                { word: 'bread', image: 'assets/food/bread.png' },
                { word: 'butter', image: 'assets/food/butter.png' },
                { word: 'carrot', image: 'assets/products/carrot.png' },
                { word: 'cereal', image: 'assets/products/cereal.png' },
                { word: 'chocolate', image: 'assets/food/chocolate.png' },
                { word: 'cucumber', image: 'assets/food/cucumber.png' },
                { word: 'egg', image: 'assets/food/egg.png' },
                { word: 'flour', image: 'assets/food/flour.png' },
                { word: 'juice', image: 'assets/food/juice.png' },
                { word: 'orange', image: 'assets/food/orange.png' },
                { word: 'rice', image: 'assets/products/rice.png' },
                { word: 'strawberry', image: 'assets/products/strawberry.png' },
                { word: 'sugar', image: 'assets/food/sugar.png' },
                { word: 'tuna', image: 'assets/food/tuna.png' },
                { word: 'water', image: 'assets/food/water.png' },
                { word: 'yoghurt', image: 'assets/products/yoghurt.png' }
              ]
            },
            {
              topic: 'Jobs',
              source: 'Go Getter 3 · Unit 0',
              words: [
                { word: 'artist', image: 'assets/jobs/artist.png' },
                { word: 'builder', image: 'assets/jobs/builder.png' },
                { word: 'bus driver', image: 'assets/jobs/bus-driver.png' },
                { word: 'chef', image: 'assets/jobs/chef.png' },
                { word: 'doctor', image: 'assets/jobs/doctor.png' },
                { word: 'farmer', image: 'assets/jobs/farmer.png' },
                { word: 'footballer', image: 'assets/jobs/footballer.png' },
                { word: 'nurse', image: 'assets/jobs/nurse.png' },
                { word: 'office worker', image: 'assets/jobs/office-worker.png' },
                { word: 'pilot', image: 'assets/jobs/pilot.png' },
                { word: 'police officer', image: 'assets/jobs/police-officer.png' },
                { word: 'shop assistant', image: 'assets/jobs/shop-assistant.png' },
                { word: 'singer', image: 'assets/jobs/singer.png' },
                { word: 'teacher', image: 'assets/jobs/teacher.png' },
                { word: 'vet', image: 'assets/jobs/vet.png' }
              ]
            },
            {
              topic: 'Containers',
              source: 'Go Getter 3 · Unit 0',
              words: [
                { word: 'a bar of chocolate', image: 'assets/containers/bar-of-chocolate.png' },
                { word: 'a bottle of water', image: 'assets/containers/bottle-of-water.png' },
                { word: 'a can of tuna', image: 'assets/containers/can-of-tuna.png' },
                { word: 'a carton of milk', image: 'assets/containers/carton-of-milk.png' },
                { word: 'a jar of jam', image: 'assets/containers/jar-of-jam.png' },
                { word: 'a packet of flour', image: 'assets/containers/packet-of-flour.png' }
              ]
            }
          ],
          activities: [
            {
              type: 'Places in town',
              title: 'City Explorer',
              topicId: 'places-in-town',
              wordBankTopic: 'Places in town',
              status: 'available',
              href: 'vocabulary-mission.html?topic=places-in-town',
              gameKey: 'placesInTownVocabulary',
              cover: 'assets/places-in-town/cinema.png',
              wordCount: 10,
              stages: ['Meet the Words', 'Spelling Attack', 'Use It!', 'Recall Challenge']
            },
            {
              type: 'Means of transport',
              title: 'Transport Rush',
              status: 'available',
              href: 'transport-rush.html',
              gameKey: 'transportRushVocabulary',
              cover: 'assets/transport/bus.png',
              wordCount: 10,
              stages: ['Meet the Words', 'Spelling Attack', 'Use It!', 'Recall Challenge']
            },
            {
              type: 'Jobs',
              title: 'Job Detective',
              topicId: 'jobs',
              wordBankTopic: 'Jobs',
              status: 'available',
              href: 'vocabulary-mission.html?topic=jobs',
              gameKey: 'jobsVocabulary',
              cover: 'assets/jobs/doctor.png',
              wordCount: 15,
              stages: ['Meet the Words', 'Spelling Attack', 'Use It!', 'Recall Challenge']
            },
            {
              type: 'Places in school',
              title: 'School Explorer',
              topicId: 'places-in-school',
              wordBankTopic: 'Places in a school',
              status: 'available',
              href: 'vocabulary-mission.html?topic=places-in-school',
              gameKey: 'placesInSchoolVocabulary',
              cover: 'assets/school/classroom.png',
              wordCount: 8,
              stages: ['Meet the Words', 'Spelling Attack', 'Use It!', 'Recall Challenge']
            },
            {
              type: 'Food and drink',
              title: 'Food Hunt',
              topicId: 'food-and-drink',
              wordBankTopic: 'Food and drink',
              status: 'available',
              href: 'vocabulary-mission.html?topic=food-and-drink',
              gameKey: 'foodAndDrinkVocabulary',
              cover: 'assets/food/apple.png',
              wordCount: 18,
              stages: ['Meet the Words', 'Spelling Attack', 'Use It!', 'Recall Challenge']
            },
            {
              type: 'Containers',
              title: 'Containers Challenge!',
              status: 'available',
              href: 'containers-challenge.html',
              gameKey: 'containersChallengeVocabulary',
              cover: 'assets/containers/carton-of-milk.png',
              wordCount: 6,
              stages: ['Meet the Words', 'Spelling Attack', 'Use It!', 'Recall Challenge'],
              stageDetails: { 'Use It!': 'Find and Tap · Put It in the Basket' }
            }
          ]
        },
        { id: 1, title: 'Coming Soon', status: 'coming-soon', activities: [] },
        { id: 2, title: 'Coming Soon', status: 'coming-soon', activities: [] }
      ]
    },
    writing: {
      title: 'Writing Lab',
      activityLayout: 'missions',
      emptyMessage: 'Sentence and text writing activities for Unit 0 will appear here when they are ready.',
      units: [
        {
          id: 0,
          title: 'Get Started!',
          status: 'available',
          activities: [
            {
              type: 'Sentence skills',
              title: 'Build a Sentence',
              status: 'available',
              href: 'writing-mission.html?mission=build',
              gameKey: 'writingBuildSentence',
              cover: 'assets/characters/max-thinking.png',
              itemCount: '12 challenges',
              description: 'Put the words in the right order and build clear sentences.',
              stages: ['Present Simple', 'Questions', 'Future plans', 'There is / are']
            },
            {
              type: 'Connected writing',
              title: "Max's Story Builder",
              status: 'available',
              href: 'writing-mission.html?mission=story',
              gameKey: 'writingStoryBuilder',
              cover: 'assets/characters/max-happy.png',
              itemCount: '3 story levels',
              description: 'Complete three original stories, then read and retell them.',
              stages: ['Easy', 'Medium', 'Hard']
            },
            {
              type: 'Everyday English',
              title: 'Communication',
              status: 'available',
              href: 'writing-mission.html?mission=communication',
              gameKey: 'writingCommunication',
              cover: 'assets/characters/max-happy.png',
              itemCount: '3 conversation games',
              description: 'Ask for help, offer help and choose natural replies.',
              stages: ['What Should I Say?', 'Complete the Dialogue', 'Chat with Max']
            }
          ],
          deferredActivities: [
            {
              type: 'Independent writing',
              title: 'Write Your Own',
              status: 'available',
              href: 'writing-mission.html?mission=write',
              gameKey: 'writingYourOwn',
              cover: 'assets/characters/max-thinking.png',
              itemCount: '3 writing tasks',
              description: 'Plan, draft, save and share your own short texts.',
              stages: ['My School Day', 'My Town and Weekend', 'A Message to a Friend']
            },
            {
              type: 'Final mission',
              title: 'Writing Challenge',
              status: 'available',
              href: 'writing-mission.html?mission=challenge',
              gameKey: 'writingChallenge',
              cover: 'assets/characters/max-cheering.png',
              itemCount: '60–80 words',
              description: 'Write about your life, school and weekend plans.',
              stages: ['Plan', 'Write', 'Checklist', 'Teacher review']
            }
          ]
        },
        { id: 1, title: 'Coming Soon', status: 'coming-soon', activities: [] },
        { id: 2, title: 'Coming Soon', status: 'coming-soon', activities: [] }
      ]
    }
  }
};
