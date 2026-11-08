(() => {
  'use strict';

  const SITUATIONS = [
    {
      topic: 'Asking for help', goal: 'ask-for-help', speaker: 'Leo',
      situation: 'A book is on a high shelf. You cannot reach it, but Leo can.',
      message: 'What do you need?',
      options: [
        { text: 'Can you get that book for me, please?', intent: 'ask-for-help', correct: true, explanation: 'This clearly asks Leo for the help you need.' },
        { text: 'Can I get that book for you?', intent: 'offer-help', correct: false, explanation: 'This offers help to Leo. You need to ask Leo to help you.' },
        { text: 'You’re welcome.', intent: 'respond-to-thanks', correct: false, explanation: 'Use this after someone thanks you. Here, ask Leo for the book.' }
      ]
    },
    {
      topic: 'Accepting a request', goal: 'accept-request', speaker: 'Liam',
      situation: 'Liam needs help with an exercise. You know the answer and have time.',
      message: 'Can you help me with this exercise, please?',
      options: [
        { text: 'Yes, of course.', intent: 'accept-request', correct: true, explanation: 'This politely agrees to Liam’s request.' },
        { text: 'Can you help me with my exercise, please?', intent: 'ask-for-help', correct: false, explanation: 'This asks Liam to help you. Liam is the person asking for help.' },
        { text: 'You’re welcome.', intent: 'respond-to-thanks', correct: false, explanation: 'Use this after someone thanks you. Liam is asking you for help.' }
      ]
    },
    {
      topic: 'Refusing a request', goal: 'refuse-request', speaker: 'Ruby',
      situation: 'Your arm hurts, and the doctor says you must not carry heavy things.',
      message: 'Can you carry this heavy bag, please?',
      options: [
        { text: 'I’m sorry, I can’t.', intent: 'refuse-request', correct: true, explanation: 'This politely refuses Ruby’s request because you cannot carry the bag.' },
        { text: 'Yes, of course.', intent: 'accept-request', correct: false, explanation: 'This accepts the request, but the doctor says you must not carry heavy things.' },
        { text: 'Can you help me, please?', intent: 'ask-for-help', correct: false, explanation: 'This asks Ruby to help you. Ruby has asked you to carry her bag.' }
      ]
    },
    {
      topic: 'Offering help', goal: 'offer-help', speaker: 'Sam',
      situation: 'Sam cooked dinner for everyone and looks tired. You are free and want to offer help.',
      message: 'I still have all these dishes to wash.',
      options: [
        { text: 'Can I help you with the dishes?', intent: 'offer-help', correct: true, explanation: 'This offers Sam help with the job he mentions.' },
        { text: 'Can you help me with the dishes?', intent: 'ask-for-help', correct: false, explanation: 'This asks Sam to help you. Here, Sam is the person who needs help.' },
        { text: 'You’re welcome.', intent: 'respond-to-thanks', correct: false, explanation: 'Use this after someone thanks you. Sam has not thanked you; offer to help him.' }
      ]
    },
    {
      topic: 'Asking for help when busy', goal: 'ask-for-help', speaker: 'Oliver',
      situation: 'You are cutting pictures for a poster. Oliver is free and is standing near the printer.',
      message: 'I’m free now. What can I do?',
      options: [
        { text: 'Can you print the title, please?', intent: 'ask-for-help', correct: true, explanation: 'This politely asks Oliver to do the task you need.' },
        { text: 'Can I help you with the printer?', intent: 'offer-help', correct: false, explanation: 'This offers help to Oliver. You need Oliver to help you.' },
        { text: 'I’m sorry, I can’t.', intent: 'refuse-request', correct: false, explanation: 'This refuses a request, but Oliver has not asked you to do anything.' }
      ]
    },
    {
      topic: 'Helping a friend at school', goal: 'offer-help', speaker: 'Mia',
      situation: 'Mia is carrying many books. Your hands are empty, and you want to help her.',
      message: 'These books are very heavy!',
      options: [
        { text: 'Can I help you with the books?', intent: 'offer-help', correct: true, explanation: 'This clearly offers Mia help with the books.' },
        { text: 'Can you help me with my books?', intent: 'ask-for-help', correct: false, explanation: 'This asks Mia to help you. Mia is the person carrying the heavy books.' },
        { text: 'Yes, please.', intent: 'accept-offer', correct: false, explanation: 'Use this to accept an offer. Mia has not offered help to you.' }
      ]
    },
    {
      topic: 'Accepting help', goal: 'accept-offer', speaker: 'Noah',
      situation: 'Your arm is in a sling, and the balcony plants need water. Noah offers to help.',
      message: 'Do you need any help with watering the plants?',
      options: [
        { text: 'Yes, please.', intent: 'accept-offer', correct: true, explanation: 'This politely accepts Noah’s offer of help.' },
        { text: 'No, that’s fine, thank you.', intent: 'refuse-offer', correct: false, explanation: 'This politely refuses the offer, but you need help because your arm is in a sling.' },
        { text: 'You’re welcome.', intent: 'respond-to-thanks', correct: false, explanation: 'Use this after someone thanks you. Noah is offering to help you.' }
      ]
    },
    {
      topic: 'Saying thank you', goal: 'thank-someone', speaker: 'Aunt May',
      situation: 'Aunt May has just fixed your broken model and gives it back to you.',
      message: 'Here is your model. It works now.',
      options: [
        { text: 'Thank you very much.', intent: 'thank-someone', correct: true, explanation: 'This thanks Aunt May for the help she has just given you.' },
        { text: 'Can you help me with my model, please?', intent: 'ask-for-help', correct: false, explanation: 'This asks for help, but Aunt May has already fixed the model.' },
        { text: 'I’m sorry, I can’t.', intent: 'refuse-request', correct: false, explanation: 'This refuses a request. Aunt May has finished helping you and gives the model back.' }
      ]
    },
    {
      topic: 'Replying to thanks', goal: 'respond-to-thanks', speaker: 'Dad',
      situation: 'You have just cleaned the kitchen for Dad. He is happy with your help.',
      message: 'Thank you for cleaning the kitchen.',
      options: [
        { text: 'You’re welcome.', intent: 'respond-to-thanks', correct: true, explanation: 'This is a polite reply to Dad’s thanks.' },
        { text: 'Can you clean the kitchen, please?', intent: 'ask-for-help', correct: false, explanation: 'This asks Dad to clean, but the kitchen is already clean and Dad is thanking you.' },
        { text: 'Can I help you with the kitchen?', intent: 'offer-help', correct: false, explanation: 'This offers help, but the job is finished and Dad is thanking you.' }
      ]
    },
    {
      topic: 'Politely refusing help', goal: 'refuse-offer', speaker: 'Max',
      situation: 'You are building a model and want to finish the last easy step by yourself. Max offers to help.',
      message: 'Can I help you with the model?',
      options: [
        { text: 'No, that’s fine, thank you.', intent: 'refuse-offer', correct: true, explanation: 'This politely refuses Max’s offer and still sounds friendly.' },
        { text: 'Yes, please.', intent: 'accept-offer', correct: false, explanation: 'This accepts Max’s offer, but you want to finish the model by yourself.' },
        { text: 'You’re welcome.', intent: 'respond-to-thanks', correct: false, explanation: 'Use this after someone thanks you. Max is offering to help you.' }
      ]
    }
  ];

  const shuffleCopy = (items) => { const result=[...items];for(let index=result.length-1;index>0;index-=1){const target=Math.floor(Math.random()*(index+1));[result[index],result[target]]=[result[target],result[index]];}return result; };
  const optionId = (situationIndex, optionIndex) => `s${situationIndex}-o${optionIndex}`;
  const createOrders = (situations, previous = []) => {
    const positionOffset=Math.floor(Math.random()*3),correctPositions=shuffleCopy(situations.map((_,index)=>(index+positionOffset)%3));
    const orders=situations.map((task,situationIndex)=>{
      const options=task.options.map((option,optionIndex)=>({id:optionId(situationIndex,optionIndex),option}));
      const correct=options.find(entry=>entry.option.correct),distractors=shuffleCopy(options.filter(entry=>!entry.option.correct));
      distractors.splice(correctPositions[situationIndex],0,correct);return distractors.map(entry=>entry.id);
    });
    if(JSON.stringify(orders)===JSON.stringify(previous)&&orders[0]?.length===3)[orders[0][1],orders[0][2]]=[orders[0][2],orders[0][1]];
    return orders;
  };
  const orderedOptions = (task, situationIndex, order) => (order||[]).map(id=>{const optionIndex=Number(id.split('-o')[1]);return {id,option:task.options[optionIndex]};}).filter(entry=>entry.option);
  window.WHAT_SHOULD_I_SAY_DATA = { situations: SITUATIONS };
  window.WHAT_SHOULD_I_SAY_ORDERING = { optionId, createOrders, orderedOptions };
  if (typeof document === 'undefined') return;

  const STORAGE_KEY = 'englishQuestLab.progress.v1';
  const SESSION_KEY = 'englishQuestLab.whatShouldISay.attempt.v1';
  const GAME_KEY = 'whatShouldISayCommunication';
  const SPARKS_PER_SITUATION = 10;
  const $ = (selector) => document.querySelector(selector);
  const elements = {
    intro:$('[data-intro]'),game:$('[data-game]'),result:$('[data-result]'),start:$('[data-start]'),replay:$('[data-replay]'),sparks:$('[data-sparks]'),best:$('[data-best]'),label:$('[data-situation-label]'),progress:$('[data-progress]'),track:$('.help-progress-track'),firstTry:$('[data-first-try]'),topic:$('[data-topic]'),situation:$('[data-situation]'),speaker:$('[data-speaker]'),initial:$('[data-contact-initial]'),message:$('[data-message]'),options:$('[data-options]'),feedback:$('[data-feedback]'),check:$('[data-check]'),next:$('[data-next]'),max:$('[data-max]'),maxMessage:$('[data-max-message]'),finalScore:$('[data-final-score]'),finalFirst:$('[data-final-first]'),saved:$('[data-saved]'),resultTitle:$('[data-result-title]'),resultMessage:$('[data-result-message]')
  };
  let state;
  let maxTimer;
  const escapeHtml = (value) => String(value).replace(/[&<>'"]/g,(character)=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[character]));
  const loadProgress = () => { try { const saved=JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}');return {...saved,games:{...(saved.games||{})}}; } catch { return {brainSparks:0,games:{}}; } };
  const saveProgress = (progress) => localStorage.setItem(STORAGE_KEY,JSON.stringify(progress));
  const loadSession = () => { try { const value=JSON.parse(sessionStorage.getItem(SESSION_KEY)||'{}');return value&&typeof value==='object'?value:{}; } catch { return {}; } };
  const saveSession = value => { try { sessionStorage.setItem(SESSION_KEY,JSON.stringify(value)); } catch { /* session persistence can be unavailable for file:// */ } };
  const saveAttempt = () => { const session=loadSession();session.active={...state,awarded:[...state.awarded],wrongIds:[...state.wrongIds]};saveSession(session); };
  const setMax = (mood,message) => { const images={thinking:'assets/characters/max-thinking.png',happy:'assets/characters/max-happy.png',cheering:'assets/characters/max-cheering.png'};window.clearTimeout(maxTimer);elements.maxMessage.textContent=message;if(elements.max.src.endsWith(images[mood]))return;elements.max.classList.add('is-changing');maxTimer=window.setTimeout(()=>{elements.max.src=images[mood];elements.max.alt=`Max ${mood}`;elements.max.classList.remove('is-changing');},120); };
  const showFeedback = (correct,title,message) => { elements.feedback.hidden=false;elements.feedback.className=`help-feedback ${correct?'correct':'wrong'}`;elements.feedback.innerHTML=`<strong>${escapeHtml(title)}</strong><p>${escapeHtml(message)}</p>`; };
  const updateProgress = () => { elements.label.textContent=`Situation ${state.index+1} of ${SITUATIONS.length}`;elements.progress.style.width=`${state.index/SITUATIONS.length*100}%`;elements.track.setAttribute('aria-valuenow',String(state.index));elements.firstTry.textContent=String(state.firstTry); };
  const render = (preserve=false) => {
    const task=SITUATIONS[state.index];if(!preserve){state.selectedId=null;state.answered=false;state.mistakeOnTask=false;state.wrongIds=new Set();}
    updateProgress();setMax('thinking','Read the situation and choose the best reply.');elements.topic.textContent=task.topic;elements.situation.textContent=task.situation;elements.speaker.textContent=task.speaker;elements.initial.textContent=task.speaker[0];elements.message.textContent=task.message;elements.feedback.hidden=true;elements.check.hidden=false;elements.check.disabled=true;elements.next.disabled=true;elements.next.textContent=state.index===SITUATIONS.length-1?'See Results':'Next';
    const ordered=orderedOptions(task,state.index,state.orders[state.index]);
    elements.options.innerHTML=`<legend>What should you say?</legend>${ordered.map(({id,option})=>`<button class="reply-option" type="button" data-option-id="${id}">${escapeHtml(option.text)}</button>`).join('')}`;
    elements.options.querySelectorAll('[data-option-id]').forEach((button)=>{if(state.wrongIds.has(button.dataset.optionId)){button.classList.add('is-wrong');button.disabled=true;}button.addEventListener('click',()=>{if(state.answered||button.disabled)return;elements.options.querySelectorAll('[data-option-id]').forEach((item)=>item.classList.remove('is-selected'));button.classList.add('is-selected');state.selectedId=button.dataset.optionId;elements.check.disabled=false;saveAttempt();});});
    if(state.answered){const correct=ordered.find(entry=>entry.option.correct),button=[...elements.options.querySelectorAll('[data-option-id]')].find(item=>item.dataset.optionId===correct?.id);button?.classList.add('is-correct');elements.options.querySelectorAll('[data-option-id]').forEach(item=>item.disabled=true);elements.check.hidden=true;elements.next.disabled=false;}
    else if(state.selectedId){const button=[...elements.options.querySelectorAll('[data-option-id]')].find(item=>item.dataset.optionId===state.selectedId);if(button&&!button.disabled){button.classList.add('is-selected');elements.check.disabled=false;}}
  };
  const checkAnswer = () => {
    if(state.answered||!state.selectedId)return;const task=SITUATIONS[state.index],entry=orderedOptions(task,state.index,state.orders[state.index]).find(item=>item.id===state.selectedId);if(!entry)return;const option=entry.option,button=[...elements.options.querySelectorAll('[data-option-id]')].find(item=>item.dataset.optionId===state.selectedId);
    if(option.correct){state.answered=true;if(!state.awarded.has(state.index)){state.awarded.add(state.index);state.score+=SPARKS_PER_SITUATION;elements.sparks.textContent=String(state.score);}if(!state.mistakeOnTask)state.firstTry+=1;elements.firstTry.textContent=String(state.firstTry);elements.progress.style.width=`${(state.index+1)/SITUATIONS.length*100}%`;elements.track.setAttribute('aria-valuenow',String(state.index+1));button.classList.add('is-correct');elements.options.querySelectorAll('[data-option-id]').forEach((item)=>item.disabled=true);elements.check.hidden=true;elements.next.disabled=false;setMax(state.index===SITUATIONS.length-1?'cheering':'happy',state.mistakeOnTask?'Nice correction!':'Perfect choice!');showFeedback(true,`+${SPARKS_PER_SITUATION} Brain Sparks!`,option.explanation);saveAttempt();return;}
    state.mistakeOnTask=true;state.wrongIds.add(state.selectedId);button.classList.remove('is-selected');button.classList.add('is-wrong');button.disabled=true;state.selectedId=null;elements.check.disabled=true;setMax('thinking','That reply is grammatical, but it does not fit this situation.');showFeedback(false,'Try another reply',option.explanation);saveAttempt();
  };
  const next = () => { if(!state.answered)return;if(state.index<SITUATIONS.length-1){state.index+=1;render();saveAttempt();return;}finish(); };
  const start = () => { const session=loadSession(),saved=session.active,valid=saved&&Array.isArray(saved.orders)&&saved.orders.length===SITUATIONS.length;if(valid){state={...saved,awarded:new Set(saved.awarded||[]),wrongIds:new Set(saved.wrongIds||[])};}else{state={index:0,score:0,firstTry:0,selectedId:null,answered:false,mistakeOnTask:false,awarded:new Set(),wrongIds:new Set(),orders:createOrders(SITUATIONS,session.lastOrders||[])};}elements.sparks.textContent=String(state.score);elements.intro.hidden=true;elements.result.hidden=true;elements.game.hidden=false;render(valid);saveAttempt();window.scrollTo({top:0,behavior:'smooth'}); };
  const finish = () => { const progress=loadProgress();const previous=progress.games[GAME_KEY]||{};const oldBest=Number(previous.bestScore)||0;const best=Math.max(oldBest,state.score);const gained=best-oldBest,bestCorrect=Math.max(Number(previous.bestCorrect??previous.bestFirstTry)||0,state.firstTry);progress.brainSparks=(Number(progress.brainSparks)||0)+gained;progress.games[GAME_KEY]={...previous,bestScore:best,lastScore:state.score,bestCorrect,bestFirstTry:bestCorrect,lastFirstTry:state.firstTry,completed:true,plays:(Number(previous.plays)||0)+1,completedAt:new Date().toISOString()};const communication=progress.games.writingCommunication||{},stages=new Set(communication.stageProgress||[]);stages.add('What Should I Say?');progress.games.writingCommunication={...communication,stageProgress:[...stages]};saveProgress(progress);saveSession({lastOrders:state.orders});const games=progress.games||{},writingComplete=games.writingBuildSentence?.completed===true&&['Easy','Medium','Hard'].every(stage=>(games.writingStoryBuilder?.stageProgress||[]).includes(stage))&&games.writingCompleteDialogueOneReplyV1?.completed===true&&(games.writingChatWithMax?.completed===true||games.writingCommunication?.stageProgress?.includes('Chat with Max'));elements.game.hidden=true;elements.result.hidden=false;elements.resultTitle.textContent=writingComplete?'All Writing Missions Complete!':'Great communication!';elements.finalScore.textContent=String(state.score);elements.finalFirst.textContent=`${state.firstTry} / ${SITUATIONS.length}`;elements.saved.textContent=`+${gained}`;elements.resultMessage.textContent=state.firstTry===10?'Max says: “Brilliant! Every reply fitted the situation first time.”':state.firstTry>=7?'Max says: “Great choices! You sound helpful and polite.”':'Max says: “Good work! Play again and look closely at who is asking or offering.”';window.scrollTo({top:0,behavior:'smooth'}); };
  const oldBest=Number(loadProgress().games[GAME_KEY]?.bestScore)||0;if(oldBest){elements.best.hidden=false;elements.best.querySelector('strong').textContent=String(oldBest);}if(loadSession().active)elements.start.textContent='Resume';elements.start.addEventListener('click',start);elements.replay.addEventListener('click',start);elements.check.addEventListener('click',checkAnswer);elements.next.addEventListener('click',next);
})();
