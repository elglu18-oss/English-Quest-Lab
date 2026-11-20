(() => {
  'use strict';
  const STAGES = Object.freeze(['Meet the Words','Spelling Attack','Memory Match','Choose the Right Word!']);
  const REQUIREMENTS = Object.freeze(['unit1HouseholdChoresVocabulary','unit1PersonalityAdjectivesVocabulary']);
  const TASKS = Object.freeze([
    {id:'C1',type:'choose',topic:'household',points:4,sentence:'After lunch, please take the plates and glasses off the table.',question:'What should you do?',options:['clear the table','set the table','make your bed'],correct:'clear the table'},
    {id:'C2',type:'choose',topic:'household',points:4,sentence:'All the dishes in the dishwasher are clean. Please put them in the cupboards.',question:'What should you do?',options:['load the dishwasher','empty the dishwasher','take out the rubbish'],correct:'empty the dishwasher'},
    {id:'C3',type:'choose',topic:'household',points:4,sentence:'The dirty plates and cups need washing in the dishwasher.',question:'What should you do?',options:['empty the dishwasher','iron your T-shirt','load the dishwasher'],correct:'load the dishwasher'},
    {id:'C4',type:'choose',topic:'household',points:4,sentence:'Mum is cooking dinner. Put the plates, knives and forks on the table.',question:'What should you do?',options:['set the table','clear the table','vacuum your room'],correct:'set the table'},
    {id:'C5',type:'choose',topic:'household',points:4,sentence:'The kitchen bin is full of rubbish.',question:'What should you do?',options:['feed the dog','take out the rubbish','water the plants'],correct:'take out the rubbish'},
    {id:'C6',type:'choose',topic:'personality',points:4,sentence:'Harry always tells his classmates what to do and tries to control every game.',options:['patient','bossy','easy-going'],correct:'bossy'},
    {id:'C7',type:'choose',topic:'personality',points:4,sentence:'Emma loves sharing her things and giving presents to others.',options:['greedy','quiet','generous'],correct:'generous'},
    {id:'C8',type:'choose',topic:'personality',points:4,sentence:'Mr Green can wait for a long time without getting annoyed.',options:['patient','energetic','loud'],correct:'patient'},
    {id:'C9',type:'choose',topic:'personality',points:4,sentence:'Sam wants all the chocolate for himself and refuses to share.',options:['loyal','greedy','friendly'],correct:'greedy'},
    {id:'C10',type:'choose',topic:'personality',points:4,sentence:'Jack always supports his best friend, even when things are difficult.',options:['loyal','sociable','messy'],correct:'loyal'},
    {id:'T1',type:'type',topic:'household',points:6,sentence:'Before school, I straighten my duvet and pillows. I always ______.',question:'Write the full three-word expression. The first word is "make".',correct:'make my bed'},
    {id:'T2',type:'type',topic:'household',points:6,sentence:'The clothes are clean but still wet. Please ______ on the line outside.',question:'Write the full four-word expression. The first word is "hang".',correct:'hang out the washing'},
    {id:'T3',type:'type',topic:'household',points:6,sentence:'Put the dirty clothes into the washing machine before turning it on. You need to ______.',question:'Write the full four-word expression. The first word is "load".',correct:'load the washing machine'},
    {id:'T4',type:'type',topic:'household',points:6,sentence:'Your bedroom floor is dusty. You need to ______.',question:'Write the full three-word expression. The first word is "vacuum".',correct:'vacuum your room'},
    {id:'T5',type:'type',topic:'household',points:6,sentence:"The soil in the flowerpots is dry. Don't forget to ______.",question:'Write the full three-word expression. The first word is "water".',correct:'water the plants'},
    {id:'T6',type:'type',topic:'personality',points:6,sentence:'Mia is always moving, playing sport and doing something exciting. She is very ______.',question:'Write one Unit 1 personality adjective.',correct:'energetic'},
    {id:'T7',type:'type',topic:'personality',points:6,sentence:'Alex makes a careful homework plan and follows a clear timetable every day. He is very ______.',question:'Write one Unit 1 personality adjective.',correct:'organised'},
    {id:'T8',type:'type',topic:'personality',points:6,sentence:"Ben happily accepts other people's plans and never gets upset when they change. He is ______.",question:'Write one Unit 1 personality adjective.',correct:'easy-going'},
    {id:'T9',type:'type',topic:'personality',points:6,sentence:"There are clothes and books all over Leo's floor. His room is very ______.",question:'Write one Unit 1 personality adjective.',correct:'messy'},
    {id:'T10',type:'type',topic:'personality',points:6,sentence:'Lily enjoys parties, meeting new people and chatting with everyone. She is ______.',question:'Write one Unit 1 personality adjective.',correct:'sociable'}
  ]);
  const shuffle = (items, random = Math.random) => { const result=[...items];for(let i=result.length-1;i>0;i-=1){const j=Math.floor(random()*(i+1));[result[i],result[j]]=[result[j],result[i]];}return result; };
  const createPlan = (random = Math.random) => shuffle(TASKS,random).map((task)=>({...task,options:task.options?shuffle(task.options,random):undefined}));
  const compactPlan = (plan) => plan.map((task)=>({id:task.id,options:task.options?[...task.options]:undefined}));
  const restorePlan = (saved) => {
    if(!Array.isArray(saved)||saved.length!==TASKS.length)return null;const map=new Map(TASKS.map((task)=>[task.id,task]));
    const result=saved.map((item)=>{const task=map.get(item?.id);if(!task)return null;if(task.type==='choose'&&(!Array.isArray(item.options)||item.options.length!==3||item.options.some((option)=>!task.options.includes(option))))return null;return {...task,options:task.options?[...item.options]:undefined};});
    return result.every(Boolean)&&new Set(result.map((task)=>task.id)).size===TASKS.length?result:null;
  };
  const normalize = (value) => String(value??'').normalize('NFKC').trim().toLowerCase().replace(/[‐‑‒–—−]/g,'-').replace(/\s+/g,' ').replace(/\.+$/,'').trim();
  const isCorrect = (task, answer) => normalize(answer)===normalize(task.correct);
  const grade = (answers) => {
    const records=Array.isArray(answers)?answers:[];const correct=records.filter((answer)=>answer.correct);const chooseScore=correct.filter((answer)=>answer.type==='choose').reduce((sum,answer)=>sum+4,0);const typeScore=correct.filter((answer)=>answer.type==='type').reduce((sum,answer)=>sum+6,0);
    return {score:chooseScore+typeScore,correct:correct.length,chooseScore,typeScore,errors:TASKS.length-correct.length};
  };
  const band = (score) => score>=95?'ENGLISH MASTER!':score>=85?'GREAT JOB!':score>=70?'WELL DONE!':'KEEP PRACTISING!';
  const totalStages = REQUIREMENTS.length * STAGES.length;
  const minimumStages = Math.ceil(totalStages * 0.8);
  const stageProgress = (progress) => {
    const completedStages = REQUIREMENTS.reduce((count, key) => {
      const saved = progress?.games?.[key]?.stageProgress;
      const stages = new Set(Array.isArray(saved) ? saved : []);
      return count + STAGES.filter((stage) => stages.has(stage)).length;
    }, 0);
    return { completedStages, totalStages, minimumStages, unlocked: completedStages >= minimumStages };
  };
  const mistakes = (answers) => (Array.isArray(answers)?answers:[]).filter((answer)=>!answer.correct);
  const attemptKey = (attempt) => `${attempt?.completedAt||''}|${Number(attempt?.score)||0}|${Number(attempt?.correct)||0}`;
  const mergeResult = (oldGame, attempt) => {
    const {activeRun,...old}=oldGame||{},history=[...(Array.isArray(old.completedAttempts)?old.completedAttempts:[]),old.firstCompletedAttempt,old.bestCompletedAttempt,old.lastAttempt,attempt].filter(Boolean),seen=new Set();
    const completedAttempts=history.filter((item)=>{const key=attemptKey(item);if(seen.has(key))return false;seen.add(key);return true;}).slice(-20);
    const bestCompletedAttempt=completedAttempts.reduce((best,item)=>!best||Number(item.score)>Number(best.score)?item:best,null);
    return {...old,completed:true,firstCompletedAttempt:old.firstCompletedAttempt||attempt,bestCompletedAttempt,completedAttempts,bestScore:Math.max(Number(old.bestScore)||0,attempt.score),bestCorrect:Math.max(Number(old.bestCorrect)||0,attempt.correct),lastAttempt:attempt,plays:(Number(old.plays)||0)+1,completedAt:attempt.completedAt};
  };
  window.UNIT1_FINAL_VOCABULARY = { TASKS, STAGES, REQUIREMENTS, shuffle, createPlan, compactPlan, restorePlan, normalize, isCorrect, grade, band, stageProgress, mistakes, mergeResult };
})();
