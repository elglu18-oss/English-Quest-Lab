(() => {
  'use strict';
  const params = new URLSearchParams(location.search);
  const topicId = params.get('topic');
  const unit = window.ENGLISH_QUEST_DATA?.labs?.vocabulary?.units?.find((item) => item.id === 0);
  const activity = unit?.activities?.find((item) => item.topicId === topicId);
  const group = unit?.wordBank?.find((item) => item.topic === activity?.wordBankTopic);
  const words = group?.words || [];
  if (!activity || !words.length) { document.body.innerHTML = '<main class="shell"><h1>Mission not found</h1><a href="vocabulary.html?unit=0#activity-panel">Back to Vocabulary Lab</a></main>'; return; }

  const RULES = window.VOCABULARY_GAME_RULES;
  const STORAGE_KEY = 'englishQuestLab.progress.v1';
  const STAGES = ['Meet the Words', 'Spelling Attack', 'Use It!', 'Recall Challenge'];
  const firstTryReward = RULES.learningMissions.sparksPerFirstTryAnswer;
  const perfectReward = words.length * RULES.recallMission.perfectRecallRewardPerWord;
  const maxScore = words.length * firstTryReward * 2 + perfectReward;
  const $ = (selector) => document.querySelector(selector);
  const el = {
    intro:$('[data-intro]'),game:$('[data-game]'),result:$('[data-result]'),start:$('[data-start]'),replay:$('[data-replay]'),sparks:$('[data-sparks]'),best:$('[data-best]'),strip:$('[data-mission-strip]'),progress:$('[data-progress]'),track:$('.progress-track'),missionLabel:$('[data-mission-label]'),taskLabel:$('[data-task-label]'),missionName:$('[data-mission-name]'),instruction:$('[data-instruction]'),taskArea:$('[data-task-area]'),feedback:$('[data-feedback]'),previous:$('[data-previous]'),check:$('[data-check]'),next:$('[data-next]'),ziggy:$('[data-ziggy]'),ziggyMessage:$('[data-ziggy-message]'),hardCount:$('[data-hard-count]'),finalScore:$('[data-final-score]'),finalMax:$('[data-final-max]'),perfect:$('[data-perfect-recall]'),attempts:$('[data-recall-attempts]'),saved:$('[data-saved]'),resultMessage:$('[data-result-message]')
  };
  let state;
  const escapeHtml = (value) => String(value).replace(/[&<>'"]/g,(char)=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
  const normalize = (value) => window.VOCABULARY_NORMALIZE_ANSWER(value).replace(/[.!?]+$/,'');
  const shuffle = (items) => { const result=[...items]; for(let i=result.length-1;i>0;i-=1){const j=Math.floor(Math.random()*(i+1));[result[i],result[j]]=[result[j],result[i]];} return result; };
  const loadProgress = () => { try { const data=JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}'); return {...data,games:{...(data.games||{})}}; } catch { return {brainSparks:0,games:{}}; } };
  const saveProgress = (progress) => localStorage.setItem(STORAGE_KEY,JSON.stringify(progress));
  const booster = window.ENGLISH_QUEST_MISTAKE_BOOSTER.create(`vocabulary:${activity.gameKey}`, { singular: 'word', unit: 'words' });
  const sound = (name,token) => window.ENGLISH_QUEST_MUSIC?.playEffect(name,token);
  const savedGame = () => loadProgress().games[activity.gameKey] || {};
  const persistUseOrder = (order) => { const progress=loadProgress();const old=progress.games[activity.gameKey]||{};progress.games[activity.gameKey]={...old,activeUseOrder:order.map((entry)=>entry.word)};saveProgress(progress); };
  const prepareUseOrder = (forceNew=false) => { const saved=forceNew?[]:(savedGame().activeUseOrder||[]);const order=RULES.useMission.createUniqueUseOrder(words,saved,(entry)=>entry.word);persistUseOrder(order);return order; };
  const saveStage = (stageName) => { const progress=loadProgress(); const old=progress.games[activity.gameKey]||{}; progress.games[activity.gameKey]={...old,stageProgress:[...new Set([...(old.stageProgress||[]),stageName])]}; saveProgress(progress); };
  const rememberDifficult = (word) => { state.difficult.add(word); const progress=loadProgress(); const old=progress.games[activity.gameKey]||{}; progress.games[activity.gameKey]={...old,difficultWords:[...new Set([...(old.difficultWords||[]),word])]}; saveProgress(progress); el.hardCount.textContent=String(state.difficult.size); };
  const audioUrl = (entry) => entry.audio || window.VOCABULARY_AUDIO_FILES?.urlFor(topicId,entry.word) || '';
  const picture = (entry, alt='Vocabulary illustration') => `<div class="transport-showcase"><img class="transport-image" src="${entry.image}" alt="${alt}" width="1200" height="1200"></div>`;
  const setZiggy = (kind,message) => { const sources={thinking:'assets/characters/ziggy-tricky.png',correct:'assets/characters/ziggy-surprised.png',happy:'assets/characters/ziggy-happy.png'};el.ziggy.src=sources[kind];el.ziggyMessage.textContent=message; };
  const showFeedback = (correct,title,message) => { el.feedback.hidden=false;el.feedback.className=`feedback ${correct?'correct':'wrong'}`;el.feedback.innerHTML=`<strong>${escapeHtml(title)}</strong><p>${escapeHtml(message)}</p>`; };
  const resetActions = () => { el.feedback.hidden=true;el.previous.hidden=true;el.check.hidden=true;el.next.disabled=true;el.check.onclick=null;el.next.onclick=null;el.previous.onclick=null;$('.mission-card').classList.remove('is-correct','mistake-booster-review'); };
  const learningComplete = (message) => { if(state.answered)return;state.answered=true;state.spellingError=false;if(state.firstAttempt){state.score+=firstTryReward;state.firstCorrect+=1;el.sparks.textContent=String(state.score);}sound('correct',`vocabulary:${activity.gameKey}:${state.stage}:${state.index}:correct`);setZiggy(state.firstAttempt?'correct':'happy',state.firstAttempt?'First try!':'Nice correction!');showFeedback(true,state.firstAttempt?`+${firstTryReward} Brain Sparks!`:'Correct!',message);el.check.hidden=true;el.next.disabled=false;$('.mission-card').classList.add('is-correct'); };
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
  const tasks = () => state.stage===3 ? state.recallOrder : state.stage===2 ? state.useTasks : words;
  const updateProgress = () => { const completed=state.stage*words.length+state.index;const total=words.length*4;el.progress.style.width=`${completed/total*100}%`;el.track.setAttribute('aria-valuemax',String(total));el.track.setAttribute('aria-valuenow',String(completed));el.missionLabel.textContent=`Mission ${state.stage+1} of 4`;el.taskLabel.textContent=`${state.stage===0?'Word':'Task'} ${state.index+1} of ${words.length}`;el.strip.innerHTML=STAGES.map((name,index)=>`<div class="mission-pill${index<state.stage?' is-done':index===state.stage?' is-current':''}">${index+1}. ${name}</div>`).join('');el.missionName.textContent=`Mission ${state.stage+1} · ${STAGES[state.stage]}`; };
  const advance = () => { if(!state.answered)return;if(state.reviewItem){state.reviewItem=null;}else if(state.stage<3){const task=tasks()[state.index];const entry=state.stage===2?task.entry:task;booster.tick(state.mistakeThisTask?`${state.stage}:${entry.word}`:'');const due=booster.nextDue();if(due){state.reviewItem=due;render();return;}}if(state.index<words.length-1){state.index+=1;render();return;}saveStage(STAGES[state.stage]);if(state.stage<3){state.stage+=1;state.index=0;if(state.stage===3)prepareRecall();render();return;}finish(); };
  const renderMeet = (entry) => { state.answered=true;el.instruction.textContent='Study the picture, read the word and listen.';el.taskArea.innerHTML=`${picture(entry,entry.word)}<p class="word-label">${escapeHtml(entry.word)}</p><div class="listen-row"><button class="play-word" type="button">Play pronunciation</button></div>`;el.taskArea.querySelector('.play-word').onclick=()=>window.VOCABULARY_AUDIO.play(entry.word,audioUrl(entry));el.previous.hidden=state.index===0;el.previous.onclick=()=>{state.index-=1;render();};el.next.disabled=false;el.next.textContent=state.index===words.length-1?'Start Spelling Attack':'Next';el.next.onclick=advance; };
  const renderSpelling = (entry) => {
    const listenBuild=window.VOCABULARY_LISTEN_BUILD;
    el.instruction.textContent='Listen to the word and build it from the mixed letters.';
    el.taskArea.innerHTML=`${picture(entry)}<p class="prompt">Tap each letter in the correct order.</p><div data-listen-build-host></div>`;
    el.check.hidden=false;el.check.disabled=true;
    const source=audioUrl(entry);
    let builder;
    let spellingLocked=false;
    builder=listenBuild.mount(el.taskArea.querySelector('[data-listen-build-host]'),entry.word,{audioUrl:source,onChange:(complete)=>{el.check.disabled=spellingLocked||!complete;if(state.spellingError&&!spellingLocked){state.spellingError=false;el.feedback.hidden=true;el.feedback.className='feedback';setZiggy('thinking','Now build the word again from memory.');}},onLockChange:(locked)=>{spellingLocked=locked;el.check.disabled=locked||!builder.isComplete();}});
    window.VOCABULARY_AUDIO.schedule(entry.word,source);
    const check=()=>{if(builder.isLocked())return;if(normalize(builder.value())===normalize(entry.word)){builder.reveal();learningComplete(`Correct spelling: ${entry.word}.`);}else{learningMistake(entry,'Not quite! Look and remember.');builder.startMemoryRetry();}};
    el.check.onclick=check;
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
  const render = () => { window.VOCABULARY_AUDIO?.stop();window.VOCABULARY_LISTEN_BUILD?.destroyActive();resetActions();state.answered=false;state.firstAttempt=true;state.mistakeThisTask=false;state.spellingError=false;updateProgress();setZiggy('thinking',state.reviewItem?'Mistake Booster: two correct returns build mastery.':state.stage===3?'One mistake ends Recall.':'Learn, try and correct your mistakes.');el.next.textContent=state.stage===3&&state.index===words.length-1?'See Results':'Next';el.next.onclick=advance;if(state.reviewItem){renderReview(state.reviewItem);return;}const entry=tasks()[state.index];if(state.stage===0)renderMeet(entry);else if(state.stage===1)renderSpelling(entry);else if(state.stage===2)renderUse(entry);else renderRecall(entry); };
  const start = (forceNewOrder=false) => { const old=savedGame();const useOrder=prepareUseOrder(forceNewOrder);state={stage:0,index:0,score:0,firstCorrect:0,answered:false,firstAttempt:true,mistakeThisTask:false,spellingError:false,reviewItem:null,difficult:new Set(old.difficultWords||[]),useTasks:buildUseTasks(useOrder),recallOrder:null,recallAttempts:0,recallCorrect:0,perfectAwarded:false};el.sparks.textContent='0';el.intro.hidden=true;el.result.hidden=true;el.game.hidden=false;render();scrollTo({top:0,behavior:'smooth'}); };
  const finish = () => { window.VOCABULARY_AUDIO?.stop();saveStage('Recall Challenge');const progress=loadProgress();const old=progress.games[activity.gameKey]||{};const oldBest=Number(old.bestScore)||0;const best=Math.max(oldBest,state.score);const gained=best-oldBest,boosterStats=booster.stats();progress.brainSparks=(Number(progress.brainSparks)||0)+gained;progress.games[activity.gameKey]={...old,activeUseOrder:null,bestScore:best,lastScore:state.score,bestCorrect:Math.max(Number(old.bestCorrect)||0,state.firstCorrect),firstAttemptCorrect:state.firstCorrect,maxQuestions:words.length*2,retryAttempts:boosterStats.retryAttempts,masteredMistakes:boosterStats.masteredCount,pendingMistakes:boosterStats.pending,completed:true,perfectRecallCompleted:true,lastRecallAttempts:state.recallAttempts,plays:(Number(old.plays)||0)+1,completedAt:new Date().toISOString(),stageProgress:STAGES,difficultWords:[...state.difficult]};saveProgress(progress);sound('complete',`vocabulary:${activity.gameKey}:complete:${Number(old.plays)||0}`);el.game.hidden=true;el.result.hidden=false;el.finalScore.textContent=String(state.score);el.finalMax.textContent=`/ ${maxScore} Brain Sparks`;el.perfect.textContent=`${words.length} / ${words.length}`;el.attempts.textContent=String(state.recallAttempts);el.saved.textContent=`+${gained}`;el.resultMessage.textContent=`Ziggy says: “Perfect Recall! You wrote all ${words.length} words correctly in a row.”`;scrollTo({top:0,behavior:'smooth'}); };

  const titleWords=activity.title.replace(/!$/,'').split(' ');const titleLead=titleWords.shift();
  document.title=`${activity.title} · Vocabulary Lab`; $('[data-topic-title]').textContent=activity.title;$('[data-topic-label]').textContent=activity.type;$('[data-game-title]').innerHTML=`${escapeHtml(titleLead)}<span>${escapeHtml(titleWords.join(' '))}</span>`;$('[data-word-total]').textContent=String(words.length);$('[data-max-sparks]').textContent=String(maxScore);$('[data-cover]').src=activity.cover;$('[data-cover]').alt=`${activity.type} illustration`;const oldBest=Number(savedGame().bestScore)||0;if(oldBest){el.best.hidden=false;el.best.querySelector('strong').textContent=String(oldBest);}el.hardCount.textContent=String((savedGame().difficultWords||[]).length);el.start.onclick=()=>start(false);el.replay.onclick=()=>start(true);
})();
