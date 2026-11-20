(() => {
  'use strict';
  const params = new URLSearchParams(location.search);
  const topicId = params.get('topic');
  const unitId = Number.parseInt(params.get('unit') || '0', 10);
  const unit = window.ENGLISH_QUEST_DATA?.labs?.vocabulary?.units?.find((item) => item.id === unitId);
  const activity = unit?.activities?.find((item) => item.topicId === topicId);
  const group = unit?.wordBank?.find((item) => item.topic === activity?.wordBankTopic);
  const words = group?.words || [];
  const chooseEngine = window.UNIT1_CHOOSE_RIGHT_WORD;
  const chooseTasks = chooseEngine?.BANKS?.[topicId] || [];
  const unitHub = `vocabulary.html?unit=${Number.isInteger(unitId) ? unitId : 0}#activity-panel`;
  if (!activity || !words.length) { document.body.innerHTML = `<main class="shell"><h1>Mission not found</h1><a href="${unitHub}">Back to Vocabulary Lab</a></main>`; return; }

  const RULES = window.VOCABULARY_GAME_RULES;
  const STORAGE_KEY = 'englishQuestLab.progress.v1';
  const STAGES = Array.isArray(activity.stages) && activity.stages.length ? activity.stages : ['Meet the Words', 'Spelling Attack', 'Use It!', 'Recall Challenge'];
  const isMemoryMission = unitId === 1 && STAGES[2] === 'Memory Match';
  document.body.classList.toggle('is-unit1-memory', isMemoryMission);
  if (isMemoryMission) document.body.classList.add(`vocabulary-topic-${topicId}`);
  const firstTryReward = RULES.learningMissions.sparksPerFirstTryAnswer;
  const perfectReward = words.length * RULES.recallMission.perfectRecallRewardPerWord;
  const maxScore = isMemoryMission ? (words.length + chooseTasks.length) * firstTryReward + words.length : words.length * firstTryReward * 2 + perfectReward;
  const $ = (selector) => document.querySelector(selector);
  const el = {
    intro:$('[data-intro]'),game:$('[data-game]'),result:$('[data-result]'),start:$('[data-start]'),replay:$('[data-replay]'),stageLauncher:$('[data-stage-launcher]'),stageMenu:$('[data-stage-menu]'),sparks:$('[data-sparks]'),best:$('[data-best]'),strip:$('[data-mission-strip]'),progress:$('[data-progress]'),track:$('.progress-track'),missionLabel:$('[data-mission-label]'),taskLabel:$('[data-task-label]'),missionName:$('[data-mission-name]'),instruction:$('[data-instruction]'),taskArea:$('[data-task-area]'),feedback:$('[data-feedback]'),previous:$('[data-previous]'),check:$('[data-check]'),next:$('[data-next]'),ziggy:$('[data-ziggy]'),ziggyMessage:$('[data-ziggy-message]'),hardCount:$('[data-hard-count]'),finalScore:$('[data-final-score]'),finalMax:$('[data-final-max]'),perfect:$('[data-perfect-recall]'),attempts:$('[data-recall-attempts]'),saved:$('[data-saved]'),resultMessage:$('[data-result-message]'),resultTitle:$('[data-result-title]'),perfectLine:$('[data-perfect-line]'),attemptsLine:$('[data-attempts-line]')
  };
  let state;
  const escapeHtml = (value) => String(value).replace(/[&<>'"]/g,(char)=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
  const normalize = (value) => window.VOCABULARY_NORMALIZE_ANSWER(value).replace(/[.!?]+$/,'');
  const shuffle = (items) => { const result=[...items]; for(let i=result.length-1;i>0;i-=1){const j=Math.floor(Math.random()*(i+1));[result[i],result[j]]=[result[j],result[i]];} return result; };
  const loadProgress = () => { try { const data=JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}'); return {...data,games:{...(data.games||{})}}; } catch { return {brainSparks:0,games:{}}; } };
  const saveProgress = (progress) => localStorage.setItem(STORAGE_KEY,JSON.stringify(progress));
  const booster = window.ENGLISH_QUEST_MISTAKE_BOOSTER.create(`vocabulary:${activity.gameKey}`, { singular: 'word', unit: 'words' });
  const sound = (name,token) => window.ENGLISH_QUEST_MUSIC?.playEffect(name,token);
  const spellingMistake = (entry, letter) => {
    learningMistake(entry,`“${letter}” is the wrong letter here. Try a different one.`);
    if (state.practiceReplay || state.spellingMistakes.has(entry.word)) return;
    state.spellingMistakes.add(entry.word);
    const progress = loadProgress();
    const old = progress.games[activity.gameKey] || {};
    const priorMistakes = Array.isArray(old.spellingMistakes) ? old.spellingMistakes : [];
    progress.games[activity.gameKey] = { ...old, spellingMistakes: [...new Set([...priorMistakes, entry.word])] };
    saveProgress(progress);
  };
  const savedGame = () => loadProgress().games[activity.gameKey] || {};
  const unitOneAccess = (game=savedGame()) => {
    const completed=new Set(Array.isArray(game.stageProgress)?game.stageProgress:[]);
    const unlocked=[true,completed.has('Meet the Words'),completed.has('Spelling Attack'),completed.has('Memory Match')];
    const nextIndex=STAGES.findIndex((stage)=>!completed.has(stage));
    return {completed,unlocked,nextIndex:nextIndex<0?0:nextIndex,allComplete:STAGES.every((stage)=>completed.has(stage))};
  };
  const saveUnitOneDraft = (nextStage) => { if(!isMemoryMission||state.practiceReplay)return;const progress=loadProgress();const old=progress.games[activity.gameKey]||{};progress.games[activity.gameKey]={...old,activeRun:{nextStage,score:state.score,firstCorrect:state.firstCorrect,updatedAt:new Date().toISOString()}};saveProgress(progress); };
  const clearUnitOneDraft = () => { if(!isMemoryMission)return;const progress=loadProgress();const old=progress.games[activity.gameKey]||{};if(!old.activeRun)return;const next={...old};delete next.activeRun;progress.games[activity.gameKey]=next;saveProgress(progress); };
  const prepareChoicePlan = () => { if(!isMemoryMission)return[];const progress=loadProgress();const old=progress.games[activity.gameKey]||{};const plan=chooseEngine.createPlan(chooseTasks);progress.games[activity.gameKey]={...old,choiceLastPlan:chooseEngine.compactPlan(plan)};saveProgress(progress);return plan; };
  const saveChoiceRun = () => {
    if(!isMemoryMission||state?.stage!==3)return;
    const progress=loadProgress();const old=progress.games[activity.gameKey]||{};
    progress.games[activity.gameKey]={...old,activeRun:{nextStage:3,score:state.score,firstCorrect:state.firstCorrect,choicePlan:chooseEngine.compactPlan(state.choicePlan),choiceMainIndex:state.index,choiceQueue:state.choiceQueue.map((item)=>({...item})),choiceReviewId:state.choiceReviewId||null,choiceReviewOptions:state.choiceReviewOptions?[...state.choiceReviewOptions]:null,choicePendingReviewId:state.choicePendingReviewId||null,choicePause:Boolean(state.choicePause),choiceCurrentFailed:Boolean(state.choiceCurrentFailed),choiceAnswered:Boolean(state.choiceAnswered),choiceFirstCorrect:state.choiceFirstCorrect,choiceCorrectedIds:[...state.choiceCorrectedIds],choicePracticeReplay:Boolean(state.practiceReplay),updatedAt:new Date().toISOString()}};
    saveProgress(progress);
  };
  const persistUseOrder = (order) => { const progress=loadProgress();const old=progress.games[activity.gameKey]||{};progress.games[activity.gameKey]={...old,activeUseOrder:order.map((entry)=>entry.word)};saveProgress(progress); };
  const prepareUseOrder = (forceNew=false) => { const saved=forceNew?[]:(savedGame().activeUseOrder||[]);const order=RULES.useMission.createUniqueUseOrder(words,saved,(entry)=>entry.word);persistUseOrder(order);return order; };
  const saveStage = (stageName) => { const progress=loadProgress(); const old=progress.games[activity.gameKey]||{}; progress.games[activity.gameKey]={...old,stageProgress:[...new Set([...(old.stageProgress||[]),stageName])]}; saveProgress(progress); };
  const rememberDifficult = (word) => { state.difficult.add(word); const progress=loadProgress(); const old=progress.games[activity.gameKey]||{}; progress.games[activity.gameKey]={...old,difficultWords:[...new Set([...(old.difficultWords||[]),word])]}; saveProgress(progress); el.hardCount.textContent=String(state.difficult.size); };
  const audioUrl = (entry) => entry.audio || window.VOCABULARY_AUDIO_FILES?.urlFor(topicId,entry.word) || '';
  const mobileImageUrl = (source) => isMemoryMission && source ? `${source}${source.includes('?')?'&':'?'}v=u1-mobile-20261114-2` : source;
  const picture = (entry, alt='Vocabulary illustration') => `<div class="transport-showcase"><img class="transport-image" src="${escapeHtml(mobileImageUrl(entry.image))}" alt="${escapeHtml(alt)}" width="1200" height="1200" loading="eager" decoding="async" fetchpriority="high"></div>`;
  const setZiggy = (kind,message) => { const sources={thinking:'assets/characters/ziggy-tricky.png',correct:'assets/characters/ziggy-surprised.png',happy:'assets/characters/ziggy-happy.png'};el.ziggy.src=sources[kind];el.ziggyMessage.textContent=message; };
  const showFeedback = (correct,title,message) => { el.feedback.hidden=false;el.feedback.className=`feedback ${correct?'correct':'wrong'}`;el.feedback.innerHTML=`<strong>${escapeHtml(title)}</strong><p>${escapeHtml(message)}</p>`; };
  const resetActions = () => { el.feedback.hidden=true;el.previous.hidden=true;el.check.hidden=true;el.next.hidden=false;el.next.disabled=true;el.check.onclick=null;el.next.onclick=null;el.previous.onclick=null;$('.mission-card').classList.remove('is-correct','mistake-booster-review','memory-match-stage','stage-completion'); };
  const learningComplete = (message) => {
    if(state.answered)return;
    state.answered=true;
    state.spellingError=false;
    const canEarnSpellingBonus=!isMemoryMission||(!state.practiceReplay&&!unitOneAccess().completed.has(STAGES[1]));
    const earnBonus=state.firstAttempt&&canEarnSpellingBonus;
    if(state.firstAttempt)state.firstCorrect+=1;
    if(earnBonus){state.score+=firstTryReward;el.sparks.textContent=String(state.score);}
    sound('correct',`vocabulary:${activity.gameKey}:${state.stage}:${state.index}:correct`);
    const reaction=earnBonus?'First try!':state.firstAttempt?'Correct spelling!':'Nice correction!';
    setZiggy(state.firstAttempt?'correct':'happy',reaction);
    showFeedback(true,earnBonus?`+${firstTryReward} Brain Sparks!`:'Correct!',message);
    el.check.hidden=true;
    el.next.disabled=false;
    if(isMemoryMission&&state.stage===1&&state.index===words.length-1)el.next.textContent='Finish Spelling Attack';
    $('.mission-card').classList.add('is-correct');
  };
  const learningMistake = (entry,message) => { const firstMistake=!state.mistakeThisTask;state.firstAttempt=false;state.mistakeThisTask=true;state.spellingError=state.stage===1;rememberDifficult(entry.word);if(firstMistake)booster.recordMistake({id:`${state.stage}:${entry.word}`,hint:message,rule:message,payload:{entry,sourceStage:state.stage}});sound('incorrect',`vocabulary:${activity.gameKey}:${state.stage}:${entry.word}:${message}`);setZiggy('thinking','Try again. Your progress is safe.');showFeedback(false,'Try again',message); };
  const topicPrompt = { 'places-in-town':'Which place is shown in the picture?',jobs:'Which job is shown in the picture?','places-in-school':'Which place in the school is shown?','food-and-drink':'Which food or drink is shown in the picture?' }[topicId];
  const FOOD_USE_CONTENT = {
    apple:{clue:'Ziggy wants a round fruit that can be red or green.',sentence:'I eat an ___ as a snack.'},
    biscuit:{clue:'Choose a small baked snack that is often crisp.',sentence:'Ziggy has a ___ with tea.'},
    bread:{clue:'Choose the food we slice to make a sandwich.',sentence:'We need two slices of ___ for a sandwich.'},
    butter:{clue:'Choose the food we spread on bread.',sentence:'I spread ___ on my toast.'},
    carrot:{clue:'Choose the orange root vegetable that rabbits like.',sentence:'The rabbit eats a ___.'},
    cereal:{clue:'Choose the breakfast food we usually eat from a bowl with milk.',sentence:'I pour milk on my ___.'},
    chocolate:{clue:'Choose the sweet brown treat that can come in a bar.',sentence:'She eats a bar of ___.'},
    cucumber:{clue:'Choose the long green vegetable often used in a salad.',sentence:'We put ___ in the salad.'},
    egg:{clue:'Choose the food that a hen lays.',sentence:'The hen lays an ___.'},
    flour:{clue:'Choose the white powder used for baking bread and cakes.',sentence:'We use ___ to bake bread.'},
    juice:{clue:'Choose the drink made from fruit.',sentence:'I drink orange ___.'},
    orange:{clue:'Choose the citrus fruit with a peel.',sentence:'I peel an ___.'},
    rice:{clue:'Choose the small grains often served with curry.',sentence:'We eat curry with ___.'},
    strawberry:{clue:'Choose the small red fruit with seeds on the outside.',sentence:'The ___ is red and has seeds outside.'},
    sugar:{clue:'Choose the sweet crystals people may put in tea.',sentence:'I put ___ in my tea.'},
    tuna:{clue:'Choose the fish that is often sold in a can.',sentence:'We opened a can of ___.'},
    water:{clue:'Choose the clear drink we need when we are thirsty.',sentence:'I drink ___ when I am thirsty.'},
    yoghurt:{clue:'Choose the creamy dairy food eaten with a spoon.',sentence:'I eat ___ with fruit for breakfast.'}
  };
  const NEW_FOOD_PICTURES = new Set(['biscuit','carrot','cereal','rice','strawberry','yoghurt']);
  const SAFE_FOOD_PICTURES = new Set(['apple','biscuit','bread','carrot','cereal','cucumber','egg','orange','rice','strawberry','yoghurt']);
  const buildUseTasks = (order) => order.map((entry,index) => {
    if(topicId!=='food-and-drink') return {entry,mechanic:index%2===0?'picture':'audio'};
    if(NEW_FOOD_PICTURES.has(entry.word)) return {entry,mechanic:'picture'};
    const cycle=['picture','audio','sentence','situation'];
    const planned=cycle[index%cycle.length];
    return {entry,mechanic:planned==='picture'&&!SAFE_FOOD_PICTURES.has(entry.word)?'situation':planned};
  });
  const prepareRecall = () => { const previous=state.recallOrder?.map((entry)=>entry.word).join('|');let order=shuffle(words);if(previous&&order.map((entry)=>entry.word).join('|')===previous)order=[...order.slice(1),order[0]];state.recallOrder=order;state.recallAttempts+=1;state.recallCorrect=0;state.index=0; };
  const tasks = () => isMemoryMission ? (state.stage===3?state.choicePlan:words) : state.stage===3 ? state.recallOrder : state.stage===2 ? state.useTasks : words;
  const choiceTaskById = (id) => chooseTasks.find((task)=>task.id===id);
  const currentChoiceTask = () => {
    if(state.choiceReviewId){const task=choiceTaskById(state.choiceReviewId);return task?{...task,options:[...(state.choiceReviewOptions||task.options)]}:null;}
    return state.choicePlan[state.index]||null;
  };
  const selectChoiceReview = (id) => { const task=choiceTaskById(id);if(!task)return false;state.choiceReviewId=id;state.choiceReviewOptions=chooseEngine.shuffle(task.options);state.choicePendingReviewId=null;state.choicePause=false;state.choiceCurrentFailed=false;state.choiceAnswered=false;return true; };
  const updateProgress = () => {
    const memoryMatched = state.memoryMatched || 0;
    const completed = isMemoryMission
      ? (state.stage === 0 ? state.index : state.stage === 1 ? words.length + state.index : state.stage === 2 ? words.length * 2 + memoryMatched : words.length * 3 + Math.min(state.index,chooseTasks.length))
      : state.stage * words.length + state.index;
    const total = isMemoryMission ? words.length * 3 + chooseTasks.length : words.length * STAGES.length;
    el.progress.style.width=`${completed/total*100}%`;el.track.setAttribute('aria-valuemax',String(total));el.track.setAttribute('aria-valuenow',String(completed));
    el.missionLabel.textContent=`Mission ${state.stage+1} of ${STAGES.length}`;
    el.taskLabel.textContent=isMemoryMission&&state.stage===2?`Round ${state.memoryRoundIndex+1} of ${state.memoryRounds.length}`:isMemoryMission&&state.stage===3&&state.choicePause?'Extra Practice':isMemoryMission&&state.stage===3&&state.choiceReviewId?`Mistake Booster · ${state.choiceQueue.length} to practise`:`${state.stage===0?'Word':'Task'} ${Math.min(state.index+1,isMemoryMission&&state.stage===3?state.choicePlan.length:words.length)} of ${isMemoryMission&&state.stage===3?state.choicePlan.length:words.length}`;
    el.strip.innerHTML=STAGES.map((name,index)=>`<div class="mission-pill${index<state.stage?' is-done':index===state.stage?' is-current':''}">${index+1}. ${name}</div>`).join('');el.missionName.textContent=`Mission ${state.stage+1} · ${STAGES[state.stage]}`;
  };
  const renderStageLauncher = () => {
    if(!isMemoryMission){el.stageLauncher.hidden=true;return;}
    const access=unitOneAccess();
    el.stageLauncher.hidden=false;
    el.stageLauncher.innerHTML=`<p>Choose a stage</p><div>${STAGES.map((stage,index)=>{const complete=access.completed.has(stage),unlocked=access.unlocked[index];const stateText=complete?'Completed · practise again':unlocked?'Ready':'Locked';return `<button type="button" data-stage-launch="${index}"${unlocked?'':' disabled'}><b>${index+1}. ${escapeHtml(stage)}</b><small>${stateText}</small></button>`;}).join('')}</div>`;
    el.stageLauncher.querySelectorAll('[data-stage-launch]:not(:disabled)').forEach((button)=>button.onclick=()=>{const index=Number(button.dataset.stageLaunch);start(false,index,access.completed.has(STAGES[index]));});
    el.start.textContent=access.allComplete?'Play Full Mission Again':access.nextIndex===0?'Start Dictionary':`Continue: ${STAGES[access.nextIndex]}`;
    el.start.onclick=()=>start(access.allComplete,access.nextIndex,false);
  };
  const showIntro = () => { window.VOCABULARY_AUDIO?.stop();window.VOCABULARY_LISTEN_BUILD?.destroyActive();window.VOCABULARY_MEMORY_MATCH?.destroyActive();el.game.hidden=true;el.result.hidden=true;el.intro.hidden=false;renderStageLauncher();scrollTo({top:0,behavior:'smooth'}); };
  const renderStageComplete = () => {
    const completedStage=state.stageInterstitial.completedStage;
    const nextStage=completedStage+1;
    const dictionary=completedStage===0;
    const spelling=completedStage===1;
    const memory=completedStage===2;
    $('.mission-card').classList.add('stage-completion');
    el.missionName.textContent=`Stage ${completedStage+1} complete`;
    el.instruction.textContent=dictionary?'Dictionary complete!':spelling?'Spelling Attack complete!':'Memory Match complete!';
    el.taskArea.innerHTML=`<div class="stage-complete-panel"><span aria-hidden="true">✓</span><strong>${dictionary?`You studied all ${words.length} words.`:spelling?`You spelled all ${words.length} words.`:`You matched all ${words.length} word pairs.`}</strong><p>${state.practiceReplay?'Practice complete. Choose any unlocked stage to continue.':dictionary?'Every word has been viewed. Spelling Attack is now unlocked.':spelling?'Every spelling task is complete. Memory Match is now unlocked.':'Choose the Right Word! is now unlocked.'}</p></div>`;
    setZiggy('happy',state.practiceReplay?'Great practice!':dictionary?'Dictionary complete! Ready to spell?':spelling?'Spelling complete! Ready to match?':'Every pair matched! Ready for the final challenge?');
    el.next.disabled=false;
    el.next.textContent=state.practiceReplay?'Back to Stage Menu':nextStage===1?'Start Spelling Attack':nextStage===2?'Start Memory Match':'Start Choose the Right Word!';
    el.next.onclick=()=>{if(state.practiceReplay){showIntro();return;}state.stageInterstitial=null;render();};
  };
  const completeLearningStage = (completedStage) => { saveStage(STAGES[completedStage]);state.stage=completedStage+1;state.index=0;if(!state.practiceReplay)saveUnitOneDraft(state.stage);state.stageInterstitial={completedStage};render(); };
  const advanceChoice = () => {
    const task=currentChoiceTask();if(!task)return;
    const lastId=task.id;
    state.choiceQueue=chooseEngine.tickRetries(state.choiceQueue,state.choiceCurrentFailed?lastId:'');
    if(!state.choiceReviewId)state.index+=1;
    state.choiceReviewId=null;state.choiceReviewOptions=null;state.choiceAnswered=false;state.choiceCurrentFailed=false;
    const mainRemaining=state.index<state.choicePlan.length;
    const retry=chooseEngine.nextRetry(state.choiceQueue,{excludeId:lastId,force:!mainRemaining});
    if(retry){
      if(retry.id===lastId){state.choicePause=true;state.choicePendingReviewId=retry.id;saveChoiceRun();render();return;}
      selectChoiceReview(retry.id);saveChoiceRun();render();return;
    }
    if(mainRemaining){saveChoiceRun();render();return;}
    saveStage(STAGES[state.stage]);finish(state.practiceReplay);
  };
  const advance = () => {
    if(!state.answered)return;
    if(isMemoryMission&&state.stage===3){advanceChoice();return;}
    if(isMemoryMission&&state.stage===2){
      if(state.memoryRoundIndex<state.memoryRounds.length-1){state.memoryRoundIndex+=1;state.index=0;state.answered=false;render();return;}
      completeLearningStage(2);return;
    }
    if(state.reviewItem){state.reviewItem=null;}else if(state.stage<3&&(!isMemoryMission||state.stage===1)){const task=tasks()[state.index];const entry=state.stage===2?task.entry:task;booster.tick(state.mistakeThisTask?`${state.stage}:${entry.word}`:'');const due=booster.nextDue();if(due){state.reviewItem=due;render();return;}}
    if(state.index<tasks().length-1){state.index+=1;render();return;}
    if(isMemoryMission&&state.stage<2){completeLearningStage(state.stage);return;}
    saveStage(STAGES[state.stage]);
    if(state.stage<3){state.stage+=1;state.index=0;if(state.stage===3&&!isMemoryMission)prepareRecall();render();return;}
    finish();
  };
  const renderMeet = (entry) => {
    state.answered=true;el.instruction.textContent='Study the picture, read the word and listen.';
    const imageMarkup=picture(entry,entry.word);
    el.taskArea.innerHTML=isMemoryMission
      ? `<button class="vocabulary-picture-audio" type="button" aria-label="Play pronunciation for ${escapeHtml(entry.word)}">${imageMarkup}</button><p class="word-label">${escapeHtml(entry.word)}</p><p class="word-translation" lang="ru">${escapeHtml(entry.translation)}</p><div class="listen-row"><button class="play-word" type="button">Play pronunciation</button><p data-recording-status role="status" hidden></p></div>`
      : `${imageMarkup}<p class="word-label">${escapeHtml(entry.word)}</p><div class="listen-row"><button class="play-word" type="button">Play pronunciation</button></div>`;
    const play=()=>isMemoryMission
      ? window.VOCABULARY_AUDIO.playRecordingFrom(audioUrl(entry),el.taskArea.querySelector('[data-recording-status]'))
      : window.VOCABULARY_AUDIO.play(entry.word,audioUrl(entry));
    el.taskArea.querySelector('.vocabulary-picture-audio')?.addEventListener('click',play);el.taskArea.querySelector('.play-word').onclick=play;el.previous.hidden=state.index===0;el.previous.onclick=()=>{state.index-=1;render();};el.next.disabled=false;el.next.textContent=isMemoryMission&&state.index===words.length-1?'Finish Dictionary':state.index===words.length-1?'Start Spelling Attack':'Next';el.next.onclick=advance;
  };
  const renderSpelling = (entry) => {
    const listenBuild=window.VOCABULARY_LISTEN_BUILD;
    el.instruction.textContent='Listen to the word and build it from the mixed letters.';
    el.taskArea.innerHTML=`${picture(entry)}<p class="prompt">Tap each letter in the correct order.</p><div data-listen-build-host></div>`;
    el.check.hidden=false;el.check.disabled=true;
    const source=audioUrl(entry);
    const host=el.taskArea.querySelector('[data-listen-build-host]');
    if(isMemoryMission){
      el.feedback.setAttribute('role','status');
      if(!state.practiceReplay&&state.spellingMistakes.has(entry.word)){
        state.firstAttempt=false;
        state.mistakeThisTask=true;
      }
      const builder=listenBuild.mount(host,entry.word,{
        audioUrl:source,
        recordedOnly:true,
        onWrongLetter:(letter)=>spellingMistake(entry,letter),
        onChange:(complete)=>{
          el.check.disabled=!complete;
          if(state.spellingError){
            state.spellingError=false;
            el.feedback.hidden=true;
            setZiggy('thinking','Keep building the word.');
          }
        }
      });
      el.check.onclick=()=>{
        if(state.answered||!builder.isComplete()||builder.value().toLowerCase()!==builder.model.answer.toLowerCase())return;
        builder.reveal();
        learningComplete(`Correct spelling: ${entry.word}.`);
      };
      return;
    }
    let builder;
    let spellingLocked=false;
    builder=listenBuild.mount(host,entry.word,{audioUrl:source,onChange:(complete)=>{el.check.disabled=spellingLocked||!complete;if(state.spellingError&&!spellingLocked){state.spellingError=false;el.feedback.hidden=true;el.feedback.className='feedback';setZiggy('thinking','Now build the word again from memory.');}},onLockChange:(locked)=>{spellingLocked=locked;el.check.disabled=locked||!builder.isComplete();}});
    window.VOCABULARY_AUDIO.schedule(entry.word,source);
    const check=()=>{if(builder.isLocked())return;if(normalize(builder.value())===normalize(entry.word)){builder.reveal();learningComplete(`Correct spelling: ${entry.word}.`);}else{learningMistake(entry,'Not quite! Look and remember.');builder.startMemoryRetry();}};
    el.check.onclick=check;
  };
  const renderMemory = () => {
    const round=state.memoryRounds[state.memoryRoundIndex];
    el.instruction.textContent='Find every English word and its exact Russian translation.';
    el.taskArea.innerHTML='<div data-memory-host></div>';
    $('.mission-card').classList.add('memory-match-stage');
    el.next.hidden=true;
    setZiggy('thinking',`Round ${state.memoryRoundIndex+1}: match ${round.length} pairs.`);
    window.VOCABULARY_MEMORY_MATCH.mount(el.taskArea.querySelector('[data-memory-host]'),round,{
      sound:(name)=>sound(name,`vocabulary:${activity.gameKey}:memory:${state.memoryRoundIndex}:${name}:${state.memoryMatched}`),
      pronounce:(entry)=>window.VOCABULARY_AUDIO.playRecording(audioUrl(entry)),
      onMatch:(entry,firstTry)=>{
        state.memoryMatched+=1;
        if(firstTry)state.firstCorrect+=1;
        if(!state.practiceReplay){
          state.score+=1;
          el.sparks.textContent=String(state.score);
        }
        updateProgress();
      },
      onMismatch:(entries)=>{entries.forEach((entry)=>rememberDifficult(entry.word));setZiggy('thinking','Not a pair. Watch the cards and try again.');},
      onComplete:()=>{
        state.answered=true;
        sound('complete',`vocabulary:${activity.gameKey}:memory-round:${state.memoryRoundIndex}`);
        const lastRound=state.memoryRoundIndex===state.memoryRounds.length-1;
        if(lastRound&&!state.practiceReplay){
          saveStage(STAGES[2]);
          saveUnitOneDraft(3);
        }
        setZiggy('happy',lastRound?'You matched every word!':'Round complete! Ready for the next one?');
        showFeedback(true,'Round complete!',`${state.memoryMatched} / ${words.length} pairs · ${state.memoryMatched} pts`);
        el.next.hidden=false;el.next.disabled=false;el.next.textContent=lastRound?'See Results':'Next Round';el.next.onclick=advance;
      }
    });
  };
  const renderChooseWord = (task) => {
    const entry=words.find((item)=>item.word===task.correct);
    const review=Boolean(state.choiceReviewId);
    el.instruction.textContent=review?(state.index>=state.choicePlan.length?'Extra Practice · Master every missed sentence.':'Mistake Booster · Try this sentence again.'):'Read the clue and choose the right word.';
    el.taskArea.innerHTML=`<section class="choose-word-stage"><img class="choose-word-cover" src="${chooseEngine.COVER_IMAGE}" alt="Choose the Right Word!" width="1100" height="880"><div class="choose-word-question">${review?`<span class="choose-review-tag">${state.index>=state.choicePlan.length?'Extra Practice':'Mistake Booster'} · ${state.choiceQueue.length} left</span>`:`<span>${escapeHtml(task.group)}</span>`}<p>${escapeHtml(task.sentence)}</p><div class="choose-word-options">${task.options.map((option)=>`<button type="button" data-choice-option="${escapeHtml(option)}">${escapeHtml(option)}</button>`).join('')}</div></div></section>`;
    el.next.disabled=true;
    if(state.choiceAnswered){
      el.taskArea.querySelectorAll('[data-choice-option]').forEach((option)=>{option.disabled=true;option.classList.toggle('is-correct',option.dataset.choiceOption===task.correct);});
      setZiggy('happy',state.choiceCurrentFailed?'Nice correction!':'Great choice!');
      showFeedback(true,state.choiceCurrentFailed?'Correct!':review?'Mistake mastered!':`+${firstTryReward} Brain Sparks!`,`The right word is “${task.correct}”.`);
      el.next.disabled=false;el.next.textContent='Next';return;
    }
    setZiggy('thinking',review?'You have seen this clue before. Try it from memory!':'Read every word carefully. You can do it!');
    el.taskArea.querySelectorAll('[data-choice-option]').forEach((button)=>button.onclick=()=>{
      if(state.answered||button.disabled)return;
      const answer=button.dataset.choiceOption;
      if(answer===task.correct){
        state.answered=true;state.choiceAnswered=true;
        if(review){
          if(!state.choiceCurrentFailed){state.choiceQueue=chooseEngine.resolveRetry(state.choiceQueue,task.id);booster.resolveReview(`choose:${task.id}`);}
        }else if(state.firstAttempt){state.choiceFirstCorrect+=1;state.firstCorrect+=1;if(!state.practiceReplay){state.score+=firstTryReward;el.sparks.textContent=String(state.score);}}
        else state.choiceCorrectedIds.add(task.id);
        el.taskArea.querySelectorAll('[data-choice-option]').forEach((option)=>{option.disabled=true;option.classList.remove('is-wrong');});
        button.classList.add('is-correct');
        sound('correct',`vocabulary:${activity.gameKey}:choose:${task.id}:correct`);
        setZiggy(!review&&state.firstAttempt?'correct':'happy',review&&!state.choiceCurrentFailed?'Mistake mastered!':state.firstAttempt?'Great choice!':'Nice correction!');
        showFeedback(true,review&&!state.choiceCurrentFailed?'Mistake mastered!':!review&&state.firstAttempt?`+${firstTryReward} Brain Sparks!`:'Correct!',`The right word is “${task.correct}”.`);
        el.next.disabled=false;el.next.textContent='Next';saveChoiceRun();
        return;
      }
      button.classList.add('is-wrong');button.disabled=true;
      const firstMistake=!state.mistakeThisTask;state.firstAttempt=false;state.mistakeThisTask=true;state.choiceCurrentFailed=true;rememberDifficult(entry.word);
      if(firstMistake){state.choiceQueue=chooseEngine.enqueueRetry(state.choiceQueue,task.id);booster.recordMistake({id:`choose:${task.id}`,hint:task.hint,rule:task.hint,payload:{entry,taskId:task.id,sourceStage:3}});saveChoiceRun();}
      sound('incorrect',`vocabulary:${activity.gameKey}:choose:${task.id}:incorrect`);showFeedback(false,'Try again',task.hint);
      setZiggy('thinking',task.hint);
    });
  };
  const renderChoicePause = () => {
    el.instruction.textContent='Extra Practice · Quick brain break';
    el.taskArea.innerHTML='<div class="stage-complete-panel choice-practice-pause"><span aria-hidden="true">★</span><strong>One more practice turn!</strong><p>Take a breath, remember Ziggy’s hint, then try the sentence again.</p></div>';
    setZiggy('thinking','A quick pause helps your memory. Ready to try again?');state.answered=true;el.next.disabled=false;el.next.textContent='Try Again';
    el.next.onclick=()=>{const id=state.choicePendingReviewId;selectChoiceReview(id);saveChoiceRun();render();};
  };
  const renderUse = (task) => {
    const entry=task.entry,distractors=shuffle(words.filter((item)=>item.word!==entry.word)).slice(0,2),options=shuffle([entry,...distractors]);let selected='';
    const content=FOOD_USE_CONTENT[entry.word];
    if(task.mechanic==='picture'){el.instruction.textContent=topicPrompt;el.taskArea.innerHTML=picture(entry,'Vocabulary illustration');}
    if(task.mechanic==='audio'){el.instruction.textContent='Listen and choose the matching word.';el.taskArea.innerHTML=`<div class="use-context-card"><span>Audio clue</span><button class="play-word" type="button" data-use-audio>Play pronunciation</button></div>`;}
    if(task.mechanic==='sentence'){el.instruction.textContent='Choose the word that completes the sentence.';el.taskArea.innerHTML=`<div class="use-context-card"><span>Complete the sentence</span><p>${escapeHtml(content.sentence).replace('___','<b>___</b>')}</p></div>`;}
    if(task.mechanic==='situation'){el.instruction.textContent='Find the correct food or drink for the situation.';el.taskArea.innerHTML=`<div class="use-context-card"><span>Situation clue</span><p>${escapeHtml(content.clue)}</p></div>`;}
    el.taskArea.insertAdjacentHTML('beforeend',`<div class="choice-grid">${options.map((option)=>`<button class="choice-button" type="button" data-word="${escapeHtml(option.word)}">${escapeHtml(option.word)}</button>`).join('')}</div>`);
    el.taskArea.querySelector('[data-use-audio]')?.addEventListener('click',()=>window.VOCABULARY_AUDIO.play(entry.word,audioUrl(entry)));
    el.check.hidden=false;el.check.disabled=true;
    el.taskArea.querySelectorAll('[data-word]').forEach((button)=>button.onclick=()=>{selected=button.dataset.word;el.taskArea.querySelectorAll('[data-word]').forEach((option)=>option.classList.toggle('is-selected',option===button));el.check.disabled=false;});
    el.check.onclick=()=>{const button=[...el.taskArea.querySelectorAll('[data-word]')].find((option)=>option.dataset.word===selected);if(selected===entry.word){button.classList.add('is-correct');el.taskArea.querySelectorAll('[data-word]').forEach((option)=>option.disabled=true);learningComplete(`The target word is ${entry.word}.`);}else{button.disabled=true;button.classList.add('is-wrong');learningMistake(entry,'That answer does not match the clue. Try again.');}};
  };
  const renderReview = (item) => { const entry=item.payload.entry,distractors=shuffle(words.filter((word)=>word.word!==entry.word)).slice(0,2),options=shuffle([entry,...distractors]);let selected='';const safePicture=topicId!=='food-and-drink'||SAFE_FOOD_PICTURES.has(entry.word);el.taskLabel.textContent=`Extra Practice · Task ${state.index+1} of ${words.length}`;el.instruction.textContent='Extra Practice · Mistake Booster';el.taskArea.innerHTML=`<span class="mistake-booster-tag">Extra Practice · Mistake Booster · ${item.streak||0} of 2</span>${safePicture?picture(entry,'Vocabulary illustration'):`<div class="use-context-card"><span>Audio clue</span><button class="play-word" type="button" data-review-audio>Play pronunciation</button></div>`}<div class="choice-grid">${options.map((option)=>`<button class="choice-button" type="button" data-word="${escapeHtml(option.word)}">${escapeHtml(option.word)}</button>`).join('')}</div>`;el.taskArea.querySelector('[data-review-audio]')?.addEventListener('click',()=>window.VOCABULARY_AUDIO.play(entry.word,audioUrl(entry)));$('.mission-card').classList.add('mistake-booster-review');el.check.hidden=false;el.check.disabled=true;el.taskArea.querySelectorAll('[data-word]').forEach((button)=>button.onclick=()=>{selected=button.dataset.word;el.taskArea.querySelectorAll('[data-word]').forEach((option)=>option.classList.toggle('is-selected',option===button));el.check.disabled=false;});el.check.onclick=()=>{const correct=selected===entry.word,button=[...el.taskArea.querySelectorAll('[data-word]')].find((option)=>option.dataset.word===selected),result=booster.answerReview(item.id,correct);sound(correct?'correct':'incorrect',`vocabulary:${activity.gameKey}:review:${item.id}:${selected}:${item.streak||0}`);if(!correct){button.disabled=true;button.classList.add('is-wrong');const rule=result.showRule?` Rule: ${escapeHtml(result.rule)} You can return to Meet the Words before trying again.`:'';showFeedback(false,'Not yet — try again',`Choose a different word.${rule}`);return;}state.answered=true;el.taskArea.querySelectorAll('[data-word]').forEach((option)=>option.disabled=true);button.classList.add('is-correct');showFeedback(true,result.mastered?"Great! You've mastered it!":'Correct repeat · 1 of 2',result.mastered?'This word has left your practice queue.':'It will return once more after a few tasks.');el.check.hidden=true;el.next.disabled=false;}; };
  const renderRecall = (entry) => {
    const audio=window.VOCABULARY_AUDIO;
    el.instruction.textContent=`Listen and type all ${words.length} words correctly in a row.`;
    el.taskArea.innerHTML=`<div class="strict-recall-card">${picture(entry)}<div class="recall-audio-controls">${audio.buttonMarkup()}</div><label class="sr-only" for="strict-answer">Type the word you hear</label><input class="answer-input" id="strict-answer" type="text" autocomplete="off" autocapitalize="none" spellcheck="false"></div>`;
    const input=el.taskArea.querySelector('input');const listenAgain=el.taskArea.querySelector('[data-listen-again]');
    const source=audioUrl(entry);listenAgain.onclick=()=>audio.play(entry.word,source);
    el.check.hidden=false;el.check.disabled=true;input.oninput=()=>{el.check.disabled=!input.value.trim();};
    const check=()=>{if(normalize(input.value)===normalize(entry.word)){sound('correct',`vocabulary:${activity.gameKey}:recall:${state.recallAttempts}:${state.index}`);input.disabled=true;state.recallCorrect+=1;state.answered=true;const perfect=state.recallCorrect===words.length;if(perfect&&!state.perfectAwarded){state.perfectAwarded=true;state.score+=perfectReward;el.sparks.textContent=String(state.score);}showFeedback(true,perfect?`Perfect Recall! +${perfectReward} Brain Sparks`:'Correct!',perfect?`Perfect Recall: ${words.length}/${words.length}.`:'Keep the streak going!');el.check.hidden=true;el.next.disabled=false;return;}sound('incorrect',`vocabulary:${activity.gameKey}:recall:${state.recallAttempts}:failed`);audio.stop();state.answered=true;rememberDifficult(entry.word);input.disabled=true;el.check.hidden=true;el.next.disabled=true;setZiggy('thinking','One mistake ends this Recall attempt.');showFeedback(false,'Recall attempt ended','Your learning progress and Brain Sparks are safe. Practise difficult words, then start a new Recall attempt.');const practise=document.createElement('button');practise.type='button';practise.className='primary-action recall-restart';practise.textContent='Practise Difficult Words';practise.onclick=()=>{state.stage=1;state.index=0;render();};const restart=document.createElement('button');restart.type='button';restart.className='secondary-action recall-restart';restart.textContent='Try Again';restart.onclick=()=>{prepareRecall();render();};el.taskArea.append(practise,restart);practise.focus({preventScroll:true});};
    el.check.onclick=check;input.onkeydown=(event)=>{if(event.key==='Enter'&&input.value.trim())check();};input.focus();if(entry.audio)audio.schedule(entry.word,entry.audio);else audio.schedule(entry.word,source);
  };
  const render = () => { window.VOCABULARY_AUDIO?.stop();window.VOCABULARY_LISTEN_BUILD?.destroyActive();window.VOCABULARY_MEMORY_MATCH?.destroyActive();resetActions();const choiceStage=isMemoryMission&&state.stage===3;state.answered=choiceStage?Boolean(state.choiceAnswered):false;state.firstAttempt=choiceStage?!state.choiceCurrentFailed:true;state.mistakeThisTask=choiceStage?state.choiceCurrentFailed:false;state.spellingError=false;updateProgress();if(state.stageInterstitial){renderStageComplete();return;}setZiggy('thinking',state.reviewItem?'Mistake Booster: two correct returns build mastery.':state.stage===3?(isMemoryMission?'Choose the word that makes the clue true.':'One mistake ends Recall.'):'Learn, try and correct your mistakes.');el.next.textContent='Next';el.next.onclick=advance;if(state.reviewItem){renderReview(state.reviewItem);return;}if(isMemoryMission&&state.stage===2){renderMemory();return;}if(choiceStage&&state.choicePause){renderChoicePause();return;}const entry=choiceStage?currentChoiceTask():tasks()[state.index];if(state.stage===0)renderMeet(entry);else if(state.stage===1)renderSpelling(entry);else if(state.stage===2)renderUse(entry);else if(isMemoryMission)renderChooseWord(entry);else renderRecall(entry); };
  const start = (forceNewOrder=false,startStage=0,practiceReplay=false) => {
    if(isMemoryMission&&startStage===0&&!practiceReplay)clearUnitOneDraft();
    const old=savedGame();const canResumeDraft=isMemoryMission&&startStage>0&&Number(old.activeRun?.nextStage)===startStage&&(!practiceReplay||Boolean(old.activeRun?.choicePracticeReplay));const draft=canResumeDraft?old.activeRun:null;
    const useOrder=isMemoryMission?[]:prepareUseOrder(forceNewOrder);const restoredPlan=startStage===3&&draft?chooseEngine.restorePlan(draft.choicePlan,chooseTasks):null;const choicePlan=isMemoryMission?(restoredPlan||prepareChoicePlan()):[];
    const startingScore=Number(draft?.score)||(isMemoryMission&&startStage===3?Number(old.bestScore)||0:0);const effectivePractice=practiceReplay||Boolean(draft?.choicePracticeReplay);
    const restoredIndex=Math.min(Math.max(0,Number(draft?.choiceMainIndex)||0),choicePlan.length);const restoredReview=choiceTaskById(draft?.choiceReviewId)?draft.choiceReviewId:null;
    state={stage:startStage,index:startStage===3&&draft?restoredIndex:0,score:startingScore,firstCorrect:Number(draft?.firstCorrect)||0,answered:false,firstAttempt:true,mistakeThisTask:false,spellingError:false,reviewItem:null,difficult:new Set(old.difficultWords||[]),spellingMistakes:new Set(Array.isArray(old.spellingMistakes)?old.spellingMistakes:[]),useTasks:isMemoryMission?[]:buildUseTasks(useOrder),choicePlan,choiceQueue:Array.isArray(draft?.choiceQueue)?draft.choiceQueue.map((item)=>({...item})):[],choiceReviewId:restoredReview,choiceReviewOptions:restoredReview&&Array.isArray(draft?.choiceReviewOptions)?[...draft.choiceReviewOptions]:null,choicePendingReviewId:choiceTaskById(draft?.choicePendingReviewId)?draft.choicePendingReviewId:null,choicePause:Boolean(draft?.choicePause),choiceCurrentFailed:Boolean(draft?.choiceCurrentFailed),choiceAnswered:Boolean(draft?.choiceAnswered),choiceFirstCorrect:Number(draft?.choiceFirstCorrect)||0,choiceCorrectedIds:new Set(Array.isArray(draft?.choiceCorrectedIds)?draft.choiceCorrectedIds:[]),recallOrder:null,recallAttempts:0,recallCorrect:0,perfectAwarded:false,memoryRounds:isMemoryMission?window.VOCABULARY_MEMORY_MATCH.createRounds(words):[],memoryRoundIndex:0,memoryMatched:0,stageInterstitial:null,practiceReplay:effectivePractice,runStartStage:startStage};
    el.sparks.textContent=String(state.score);el.intro.hidden=true;el.result.hidden=true;el.game.hidden=false;if(isMemoryMission&&startStage===3&&!draft)saveChoiceRun();render();scrollTo({top:0,behavior:'smooth'});
  };
  const finish = (practiceOnly=false) => {
    window.VOCABULARY_AUDIO?.stop();window.VOCABULARY_MEMORY_MATCH?.destroyActive();if(!isMemoryMission)saveStage('Recall Challenge');
    const progress=loadProgress();const old=progress.games[activity.gameKey]||{};const oldBest=Number(old.bestScore)||0;const best=Math.max(oldBest,state.score);const gained=practiceOnly?0:best-oldBest,boosterStats=booster.stats();
    if(!practiceOnly){
      progress.brainSparks=(Number(progress.brainSparks)||0)+gained;
      const nextGame={...old,activeUseOrder:null,bestScore:best,lastScore:state.score,bestCorrect:Math.max(Number(old.bestCorrect)||0,state.firstCorrect),firstAttemptCorrect:isMemoryMission?(old.firstAttemptCorrect??state.firstCorrect):state.firstCorrect,firstRunFirstAttemptCorrect:isMemoryMission?(old.firstRunFirstAttemptCorrect??state.firstCorrect):old.firstRunFirstAttemptCorrect,chooseWordBestFirstAttempt:Math.max(Number(old.chooseWordBestFirstAttempt)||0,state.choiceFirstCorrect||0),chooseWordFirstRunFirstAttempt:isMemoryMission?(old.chooseWordFirstRunFirstAttempt??state.choiceFirstCorrect):undefined,maxQuestions:isMemoryMission?words.length*2+chooseTasks.length:words.length*2,retryAttempts:boosterStats.retryAttempts,masteredMistakes:boosterStats.masteredCount,pendingMistakes:boosterStats.pending,completed:true,perfectRecallCompleted:!isMemoryMission,lastRecallAttempts:isMemoryMission?undefined:state.recallAttempts,memoryRoundsCompleted:isMemoryMission?(old.memoryRoundsCompleted??state.memoryRounds.length):undefined,memoryPairsCompleted:isMemoryMission?(old.memoryPairsCompleted??state.memoryMatched):undefined,plays:(Number(old.plays)||0)+1,completedAt:new Date().toISOString(),stageProgress:STAGES,difficultWords:[...state.difficult]};
      if(isMemoryMission){nextGame.firstRunFirstAttemptCorrect=old.firstRunFirstAttemptCorrect??state.firstCorrect;delete nextGame.activeRun;}
      progress.games[activity.gameKey]=nextGame;saveProgress(progress);
    }else if(isMemoryMission&&old.activeRun){
      const nextGame={...old};delete nextGame.activeRun;progress.games[activity.gameKey]=nextGame;saveProgress(progress);
    }
    sound('complete',`vocabulary:${activity.gameKey}:complete:${Number(old.plays)||0}`);el.game.hidden=true;el.result.hidden=false;el.finalScore.textContent=String(state.score);el.finalMax.textContent=`/ ${maxScore} Brain Sparks`;el.saved.textContent=`+${gained}`;
    if(isMemoryMission){el.resultTitle.textContent=practiceOnly?'Choose the Right Word Practice Complete!':'Choose the Right Word Complete!';el.perfectLine.innerHTML=`Correct on the first try: <strong>${state.choiceFirstCorrect} / ${state.choicePlan.length}</strong>`;el.attemptsLine.innerHTML=`Corrected errors: <strong>${state.choiceCorrectedIds.size}</strong>`;el.resultMessage.textContent=practiceOnly?'Ziggy says: “Great practice! You mastered every missed sentence.”':`Ziggy says: “Fantastic! You completed all ${state.choicePlan.length} clues and mastered every mistake.”`;el.stageMenu.hidden=false;}else{el.perfect.textContent=`${words.length} / ${words.length}`;el.attempts.textContent=String(state.recallAttempts);el.resultMessage.textContent=`Ziggy says: “Perfect Recall! You wrote all ${words.length} words correctly in a row.”`;}
    scrollTo({top:0,behavior:'smooth'});
  };

  const titleWords=activity.title.replace(/!$/,'').split(' ');const titleLead=titleWords.shift();
  document.title=`${activity.title} · Vocabulary Lab`; $('[data-topic-title]').textContent=activity.title;$('[data-topic-label]').textContent=activity.type;$('[data-game-title]').innerHTML=`${escapeHtml(titleLead)}<span> ${escapeHtml(titleWords.join(' '))}</span>`;$('[data-word-total]').textContent=String(words.length);$('[data-stage-total]').textContent=String(STAGES.length);$('[data-max-sparks]').textContent=String(maxScore);$('[data-cover]').src=activity.cover;$('[data-cover]').alt=`${activity.type} illustration`;$('[data-unit-label]').textContent=`Vocabulary Lab · Unit ${unitId}`;$('[data-unit-back]').href=unitHub;$('[data-unit-result-back]').href=unitHub;$('[data-unit-result-back]').textContent=`Back to Unit ${unitId}`;if(isMemoryMission){$('[data-intro-description]').textContent='Meet every word and its Russian translation, master the spelling, match every pair, then choose the right word.';$('[data-intro-ziggy]').textContent='Learn, spell, match and finish with the right word!';el.stageMenu.hidden=false;renderStageLauncher();}else{el.start.onclick=()=>start(false);}const oldBest=Number(savedGame().bestScore)||0;if(oldBest){el.best.hidden=false;el.best.querySelector('strong').textContent=String(oldBest);}el.hardCount.textContent=String((savedGame().difficultWords||[]).length);el.replay.onclick=()=>isMemoryMission?start(false,3,true):start(true,0,false);if(el.stageMenu)el.stageMenu.onclick=showIntro;
  if(isMemoryMission)$('[data-cover]').src=mobileImageUrl(activity.cover);
})();
