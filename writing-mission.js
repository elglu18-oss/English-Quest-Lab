(() => {
  'use strict';
  const DATA=window.WRITING_MISSION_DATA, STORAGE='englishQuestLab.progress.v1', DIALOGUE_GAME_KEY='writingCompleteDialogueOneReplyV1';
  const $=(s,r=document)=>r.querySelector(s), esc=(v)=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const normalize=(v)=>String(v).trim().toLowerCase().replace(/[’‘]/g,"'").replace(/[^a-z0-9' ]/g,'').replace(/\s+/g,' ');
  const shuffle=(items)=>{const result=[...items];for(let i=result.length-1;i>0;i-=1){const j=Math.floor(Math.random()*(i+1));[result[i],result[j]]=[result[j],result[i]];}return result;};
  const load=()=>{try{return JSON.parse(localStorage.getItem(STORAGE))||{games:{},brainSparks:0};}catch{return{games:{},brainSparks:0};}};
  const persist=(p)=>localStorage.setItem(STORAGE,JSON.stringify(p));
  const addResult=(key,score,max,stages=[])=>{const p=load();p.games=p.games||{};const old=p.games[key]||{},oldBest=Number(old.bestScore)||0,best=Math.max(oldBest,score),gain=best-oldBest;p.brainSparks=(Number(p.brainSparks)||0)+gain;p.games[key]={...old,bestScore:best,lastScore:score,completed:score===max,stageProgress:[...new Set([...(old.stageProgress||[]),...stages])],updatedAt:new Date().toISOString()};persist(p);updateSparks();return gain;};
  const saveGameState=(key,patch)=>{const p=load();p.games=p.games||{};p.games[key]={...(p.games[key]||{}),...patch,updatedAt:new Date().toISOString()};persist(p);updateSparks();};
  const saveAssessment=(key,correct,total,blockName='')=>{const p=load();p.games=p.games||{};const old=p.games[key]||{};if(blockName){const blocks={...(old.verifiedBlocks||{})},previous=blocks[blockName];if(!previous||correct>Number(previous.correct))blocks[blockName]={correct,total};p.games[key]={...old,verifiedBlocks:blocks,updatedAt:new Date().toISOString()};}else p.games[key]={...old,bestCorrect:Math.max(Number(old.bestCorrect)||0,correct),maxQuestions:total,updatedAt:new Date().toISOString()};persist(p);};
  const saveDialogueResult=(correct,score,total,stats)=>{const result=window.WRITING_DIALOGUE_PROGRESS.mergeResult(load(),{correct,score,total,stats});persist(result.progress);updateSparks();return result.gain;};
  const saveDraft=(id,text,status)=>{const p=load();p.writingDrafts=p.writingDrafts||{};p.writingDrafts[id]={text,status,updatedAt:new Date().toISOString()};persist(p);};
  const draft=(id)=>load().writingDrafts?.[id]||{text:'',status:''};
  const updateSparks=()=>{$('[data-total-sparks]').textContent=String(Number(load().brainSparks)||0);};
  const setHero=(title,description,kicker='Writing Lab',mood='happy',message='Let’s write something great!')=>{$('[data-title]').textContent=title;$('[data-page-title]').textContent=title;$('[data-description]').textContent=description;$('[data-kicker]').textContent=kicker;$('[data-max]').src=`assets/characters/max-${mood}.png`;$('[data-max-message]').textContent=message;document.title=`${title} · Writing Lab`;};
  const setProgress=(label,value,max)=>{$('[data-progress-label]').textContent=label;$('[data-progress-bar]').style.width=`${max?value/max*100:0}%`;};
  const feedback=(ok,title,text)=>`<div class="wm-feedback ${ok?'is-correct':''}"><strong>${esc(title)}</strong><p>${esc(text)}</p></div>`;
  const workspace=$('[data-workspace]');
  const mission=new URLSearchParams(location.search).get('mission')||'build'; updateSparks();
  const sound=(name,token)=>window.ENGLISH_QUEST_MUSIC?.playEffect(name,token);

  function renderBuild(){
    setHero('Build a Sentence','Put every word in the right order. Punctuation is added automatically.','Mission 1','thinking','Build it step by step.');
    const booster=window.ENGLISH_QUEST_MISTAKE_BOOSTER.create('writingBuildSentence',{singular:'sentence',unit:'sentences'});
    const order=window.ENGLISH_QUEST_WORD_ORDER;
    let index=0,score=0,firstCorrect=0,firstAttempt=true,mistakeRegistered=false,wordErrors=0,challenge=false,reviewItem=null,challengeQueue=[],used=new Set(),built=[],soundSerial=0;
    const currentTask=()=>reviewItem?.payload?.task||DATA.build[index];
    const taskId=(task=currentTask())=>reviewItem?.id||`build:${index}:${task.answer}`;
    const sessionMistakes=new Set();
    const finishBuild=()=>{const stats=booster.stats();saveAssessment('writingBuildSentence',firstCorrect,DATA.build.length);saveGameState('writingBuildSentence',{firstAttemptCorrect:firstCorrect,retryAttempts:stats.retryAttempts,masteredMistakes:stats.masteredCount,pendingMistakes:stats.pending});complete('writingBuildSentence',score,120,['Present Simple','Questions','Future plans','There is / are'],'You built all twelve sentences.');};
    const registerMainMistake=(task)=>{
      firstAttempt=false;sessionMistakes.add(taskId(task));
      if(mistakeRegistered)return;
      booster.recordMistake({id:taskId(task),hint:task.explanation,rule:task.explanation,payload:{task}});
      mistakeRegistered=true;
    };
    const startChallenge=()=>{
      challengeQueue=booster.pendingItems().filter(item=>sessionMistakes.has(item.id));
      if(!challengeQueue.length){finishBuild();return;}
      challenge=true;reviewItem=challengeQueue[0];render();
    };
    const render=()=>{
      const task=currentTask(),bank=shuffle(task.words.map((word,i)=>({word,i})));firstAttempt=true;mistakeRegistered=false;wordErrors=0;
      setProgress(challenge?`No Hints Challenge · ${DATA.build.length-challengeQueue.length+1}`:`Sentence ${index+1} of ${DATA.build.length}`,challenge?DATA.build.length-challengeQueue.length:index,DATA.build.length);
      workspace.innerHTML=`<article class="wm-panel${challenge?' mistake-booster-review no-hints-challenge':''}"><h2>${challenge?'<span class="mistake-booster-tag">Mistake Booster · No Hints Challenge</span><br>Build the complete sentence':`Sentence ${index+1}`}</h2><p class="wm-instruction">${challenge?'No word-by-word checks or hints. Build the whole sentence, then check it.':'Choose each next word. Max checks every choice immediately.'}</p><div class="built-sentence" data-built></div><div class="word-bank" data-bank>${bank.map(({word,i})=>`<button class="word-chip" data-bank-index="${i}">${esc(word)}</button>`).join('')}</div><div data-feedback aria-live="polite"></div><div class="wm-actions"><button class="wm-button" data-undo disabled>Undo</button><button class="wm-button" data-clear disabled>Clear</button><button class="wm-button wm-primary" data-check disabled>Check Answer</button><button class="wm-button wm-primary" data-next hidden>${challenge?(challengeQueue.length===1?'Finish Challenge':'Next Challenge'):(index===DATA.build.length-1?'Continue':'Next')}</button></div></article>`;
      used=new Set();built=[];wire();
    };
    const redraw=()=>{const task=currentTask();$('[data-built]').innerHTML=built.map((x,position)=>`<button class="word-chip${challenge?'':' is-step-correct'}" data-built-position="${position}">${esc(x.word)}</button>`).join('');document.querySelectorAll('[data-bank-index]').forEach(button=>button.disabled=used.has(Number(button.dataset.bankIndex)));$('[data-check]').disabled=built.length!==task.words.length;$('[data-undo]').disabled=!built.length;$('[data-clear]').disabled=!built.length;document.querySelectorAll('[data-built-position]').forEach(button=>button.onclick=()=>{const position=Number(button.dataset.builtPosition),removed=built.splice(position);removed.forEach(item=>used.delete(item.i));redraw();});};
    const wire=()=>{
      document.querySelectorAll('[data-bank-index]').forEach(button=>button.onclick=()=>{
        const i=Number(button.dataset.bankIndex),task=currentTask(),selection=built.map(item=>item.i);
        if(!challenge&&!order.allows(task,selection,i)){
          registerMainMistake(task);wordErrors+=1;sound('incorrect',`writingBuildSentence:${taskId(task)}:word:${selection.length}:wrong:${++soundSerial}`);
          button.classList.remove('is-step-wrong');void button.offsetWidth;button.classList.add('is-step-wrong');setTimeout(()=>button.classList.remove('is-step-wrong'),480);
          const hint=wordErrors>=2?task.explanation:'Think about which word belongs in this position.';
          $('[data-feedback]').innerHTML=feedback(false,wordErrors>=2?'Max’s hint':'Try another word',hint);$('[data-max]').src='assets/characters/max-thinking.png';$('[data-max-message]').textContent=hint;return;
        }
        used.add(i);built.push({i,word:task.words[i]});redraw();
        if(!challenge){sound('correct',`writingBuildSentence:${taskId(task)}:word:${selection.length}:correct:${++soundSerial}`);if(wordErrors<2)$('[data-feedback]').innerHTML='';$('[data-max]').src='assets/characters/max-happy.png';$('[data-max-message]').textContent=built.length===task.words.length?'Great! Now check the complete sentence.':'Good choice. What comes next?';}
      });
      $('[data-undo]').onclick=()=>{const x=built.pop();if(x)used.delete(x.i);redraw();};$('[data-clear]').onclick=()=>{built=[];used.clear();redraw();};
      $('[data-check]').onclick=()=>{const task=currentTask(),answer=`${built.map(item=>item.word).join(' ')}${task.answer.endsWith('?')?'?':'.'}`,ok=new Set([task.answer,...(task.accepted||[]),...(task.alternatives||[])]).has(answer),id=taskId(task);if(!ok){if(challenge){booster.answerReview(id,false);sound('incorrect',`writingBuildSentence:${id}:challenge:wrong:${++soundSerial}`);$('[data-feedback]').innerHTML=feedback(false,'Not yet — try again','Build the sentence in a different order. No hint is shown in this challenge.');$('[data-max]').src='assets/characters/max-thinking.png';$('[data-max-message]').textContent='Try the complete sentence again — no hints.';}else{registerMainMistake(task);sound('incorrect',`writingBuildSentence:${id}:check:wrong:${++soundSerial}`);$('[data-feedback]').innerHTML=feedback(false,'Check the word order',task.explanation);}built=[];used.clear();redraw();return;}if(challenge){booster.resolveReview(id);sound('correct',`writingBuildSentence:${id}:challenge:correct:${++soundSerial}`);}else if(firstAttempt){firstCorrect+=1;score+=10;}$('[data-feedback]').innerHTML=feedback(true,challenge?'Challenge sentence complete!':'Correct sentence!',challenge?'This sentence has left the No Hints Challenge.':answer);document.querySelectorAll('button[data-bank-index],button[data-built-position]').forEach(button=>button.disabled=true);$('[data-check]').hidden=true;$('[data-next]').hidden=false;$('[data-max]').src='assets/characters/max-happy.png';$('[data-max-message]').textContent=challenge?'Strong independent work!':'Excellent sentence!';};
      $('[data-next]').onclick=()=>{if(challenge){challengeQueue.shift();if(challengeQueue.length){reviewItem=challengeQueue[0];render();}else finishBuild();return;}if(index<DATA.build.length-1){index+=1;render();}else startChallenge();};
    };
    render();
  }

  function renderStoryLegacy(){setHero("Max's Story Builder",'Complete three connected stories, then read and retell them.','Mission 2','happy','Every good story has a clear thread.');let selected='easy';const completed=new Set(load().games?.writingStoryBuilder?.stageProgress||[]),scores={};const menu=()=>{setProgress(`${completed.size} of 3 levels complete`,completed.size,3);workspace.innerHTML=`<article class="wm-panel"><h2>Choose a level</h2><p class="wm-instruction">Each story has one clear answer for every gap.</p><div class="level-grid">${DATA.stories.map(s=>`<button class="level-card ${selected===s.id?'is-selected':''}" data-level="${s.id}"><strong>${esc(s.title)}</strong><small>${completed.has(s.title.split(' · ')[0])?'Completed':'Open level'}</small></button>`).join('')}</div><div class="wm-actions"><button class="wm-button wm-primary" data-open>Open level</button></div></article>`;document.querySelectorAll('[data-level]').forEach(b=>b.onclick=()=>{selected=b.dataset.level;menu();});$('[data-open]').onclick=()=>level(DATA.stories.find(s=>s.id===selected));};
    const level=(story)=>{const keys=Object.keys(story.answers),chosen={};const makeBlank=(k)=>story.mode==='select'?`<select class="inline-select" data-gap="${k}"><option value="">choose</option>${story.options[k].map(x=>`<option>${esc(x)}</option>`).join('')}</select>`:story.mode==='input'?`<input class="inline-input" data-gap="${k}" autocomplete="off" aria-label="Missing word">`:`<button class="inline-input" data-gap="${k}" type="button">choose</button>`;const text=story.sentences.join(' ').replace(/\{\{(.*?)\}\}/g,(_,k)=>makeBlank(k));workspace.innerHTML=`<article class="wm-panel"><button class="wm-button" data-back-level>← Levels</button><h2>${esc(story.title)}</h2><p class="wm-instruction">${story.mode==='bank'?'Choose a gap, then choose a word from the bank.':'Complete every gap.'}</p><div class="story-text">${text}</div>${story.mode==='bank'?`<div class="phrase-bank">${story.bank.map(x=>`<button class="word-chip" data-bank-word="${x}">${x}</button>`).join('')}</div>`:''}<div data-feedback></div><div class="wm-actions"><button class="wm-button wm-primary" data-story-check>Check Story</button></div></article>`;if(story.mode==='bank'){let active=keys[0];document.querySelectorAll('[data-gap]').forEach(b=>b.onclick=()=>{active=b.dataset.gap;});document.querySelectorAll('[data-bank-word]').forEach(b=>b.onclick=()=>{chosen[active]=b.dataset.bankWord;$(`[data-gap="${active}"]`).textContent=b.dataset.bankWord;const next=keys.find(k=>!chosen[k]);if(next)active=next;});}$('[data-back-level]').onclick=menu;$('[data-story-check]').onclick=()=>{const values={};keys.forEach(k=>values[k]=story.mode==='bank'?(chosen[k]||''):normalize($(`[data-gap="${k}"]`).value));const wrong=keys.filter(k=>normalize(values[k])!==normalize(story.answers[k]));if(wrong.length){$('[data-feedback]').innerHTML=feedback(false,'Try again',`${wrong.length} gap${wrong.length===1?' needs':'s need'} another look. Use the whole story for clues.`);return;}scores[story.id]=30;completed.add(story.title.split(' · ')[0]);addResult('writingStoryBuilder',Object.values(scores).reduce((a,b)=>a+b,0),90,[...completed]);const full=story.sentences.join(' ').replace(/\{\{(.*?)\}\}/g,(_,k)=>story.answers[k]);workspace.innerHTML=`<article class="wm-panel"><h2>Story complete!</h2><div class="story-complete">${esc(full)}</div><p class="retell">Retell the story in your own words.</p><div class="wm-actions"><button class="wm-button wm-primary" data-levels>Choose another level</button></div></article>`;$('[data-levels]').onclick=menu;};};menu();}

  function renderStory(){
    setHero("Max's Story Builder",'Complete three connected stories, then read and retell them.','Mission 2','happy','Every good story has a clear thread.');
    let selected='easy';
    const completed=new Set(load().games?.writingStoryBuilder?.stageProgress||[]);
    const booster=window.ENGLISH_QUEST_MISTAKE_BOOSTER.create('writingStoryBuilder',{singular:'gap',unit:'gaps'});
    let revealDelay=0,revealTimeout=0,revealInterval=0,revealToken=0;
    const clearReveal=()=>{revealToken+=1;clearTimeout(revealDelay);clearTimeout(revealTimeout);clearInterval(revealInterval);revealDelay=0;revealTimeout=0;revealInterval=0;};
    window.addEventListener('pagehide',clearReveal,{once:true});
    const stageName=(story)=>story.title.split(' · ')[0];
    const acceptedFor=(story,key)=>story.accepted?.[key]||[story.answers[key]];
    const menu=()=>{
      clearReveal();
      setProgress(`${completed.size} of 3 levels complete`,completed.size,3);
      workspace.innerHTML=`<article class="wm-panel"><h2>Choose a level</h2><p class="wm-instruction">Easy uses choices, Medium uses a word bank, and Hard asks you to type each complete word.</p><div class="level-grid">${DATA.stories.map(story=>`<button class="level-card ${selected===story.id?'is-selected':''}" data-level="${story.id}"><strong>${esc(story.title)}</strong><small>${completed.has(stageName(story))?'Completed':'Open level'}</small></button>`).join('')}</div><div class="wm-actions"><button class="wm-button wm-primary" data-open>Open level</button></div></article>`;
      document.querySelectorAll('[data-level]').forEach(button=>button.onclick=()=>{selected=button.dataset.level;menu();});
      $('[data-open]').onclick=()=>level(DATA.stories.find(story=>story.id===selected));
    };
    const level=(story)=>{
      clearReveal();
      const keys=Object.keys(story.answers),chosen={},recordedMistakes=new Set();let firstCheck=true,firstCorrect=0,revealing=false;
      const makeBlank=(key)=>{
        const answer=story.answers[key];
        if(story.mode==='select')return `<select class="inline-select" data-gap="${key}" aria-label="Choose the missing word"><option value="">choose</option>${story.options[key].map(option=>`<option>${esc(option)}</option>`).join('')}</select>`;
        if(story.mode==='bank')return `<button class="inline-input" data-gap="${key}" type="button">choose</button>`;
        const letters=Array.from(answer),hint=`${letters[0]}${'_'.repeat(letters.length-1)}`;
        return `<span class="hard-gap" style="--gap-letters:${letters.length}"><span class="hard-hint" aria-hidden="true"><b>${esc(letters[0])}</b>${esc(hint.slice(1))}</span><input class="inline-input hard-input" data-gap="${key}" autocomplete="off" autocapitalize="none" spellcheck="false" maxlength="${letters.length+4}" aria-label="Type the complete word. It starts with ${esc(letters[0])} and has ${letters.length} letters."></span>`;
      };
      const text=story.sentences.join(' ').replace(/\{\{(.*?)\}\}/g,(_,key)=>makeBlank(key));
      const instruction=story.mode==='select'?'Choose one answer for each gap.':story.mode==='bank'?'Choose a gap, then choose a word from the bank.':'Use the first letter and the number of lines. Type the complete word in each empty field.';
      workspace.innerHTML=`<article class="wm-panel"><button class="wm-button" data-back-level>← Levels</button><h2>${esc(story.title)}</h2><p class="wm-instruction">${instruction}</p><div class="story-text">${text}</div>${story.mode==='bank'?`<div class="phrase-bank">${story.bank.map(word=>`<button class="word-chip" data-bank-word="${esc(word)}">${esc(word)}</button>`).join('')}</div>`:''}<div data-feedback></div><div class="wm-actions"><button class="wm-button wm-primary" data-story-check>Check Story</button></div></article>`;
      $('[data-back-level]').onclick=()=>{clearReveal();menu();};
      let active=keys[0];
      const gap=(key)=>$(`[data-gap="${key}"]`);
      const clearWrong=(element)=>element.classList.remove('is-wrong');
      const readValue=(key)=>story.mode==='bank'?(chosen[key]||''):gap(key).value;
      const writeValue=(key,value)=>{if(story.mode==='bank'){chosen[key]=value;gap(key).textContent=value||'choose';}else gap(key).value=value;};
      const lockAll=(locked)=>{keys.forEach(key=>gap(key).disabled=locked||gap(key).classList.contains('is-correct'));document.querySelectorAll('[data-bank-word]').forEach(button=>button.disabled=locked);$('[data-story-check]').disabled=locked;};
      if(story.mode==='bank'){
        document.querySelectorAll('[data-gap]').forEach(button=>button.onclick=()=>{if(!button.disabled)active=button.dataset.gap;});
        document.querySelectorAll('[data-bank-word]').forEach(button=>button.onclick=()=>{
          const target=gap(active);if(!target||target.disabled)return;
          chosen[active]=button.dataset.bankWord;target.textContent=button.dataset.bankWord;clearWrong(target);
          const next=keys.find(key=>!chosen[key]&&!gap(key).disabled);if(next)active=next;
        });
      }else{
        document.querySelectorAll('[data-gap]').forEach(element=>element.addEventListener(story.mode==='select'?'change':'input',()=>clearWrong(element)));
      }
      $('[data-story-check]').onclick=()=>{
        if(revealing)return;
        const wrong=[],resolved={};
        keys.forEach(key=>{
          const element=gap(key);
          const value=readValue(key);
          const match=acceptedFor(story,key).find(answer=>normalize(answer)===normalize(value));
          element.classList.toggle('is-correct',Boolean(match));element.classList.toggle('is-wrong',!match);
          if(match){resolved[key]=match;element.disabled=true;if(recordedMistakes.has(key)){booster.resolveReview(`story:${story.id}:${key}`);recordedMistakes.delete(key);}}else{wrong.push(key);}
        });
        if(firstCheck){firstCorrect=keys.length-wrong.length;firstCheck=false;}
        if(wrong.length){
          sound('incorrect',`writingStory:${story.id}:${wrong.join('-')}`);
          wrong.forEach(key=>{if(!recordedMistakes.has(key)){booster.recordMistake({id:`story:${story.id}:${key}`,hint:'Complete this story gap again.',rule:'Use the whole story for context.',payload:{storyId:story.id,key,answer:story.answers[key]}});recordedMistakes.add(key);}});
          revealing=true;lockAll(true);const token=++revealToken;
          $('[data-feedback]').innerHTML=feedback(false,'Check the red gaps','Correct words will appear inside the story.');
          revealDelay=setTimeout(()=>{if(token!==revealToken)return;const endAt=Date.now()+10000;wrong.forEach(key=>{const element=gap(key);writeValue(key,story.answers[key]);element.classList.remove('is-wrong');element.classList.add('is-revealed-answer');});
            $('[data-feedback]').innerHTML=`<div class="wm-feedback reveal-feedback"><strong>Study the correct words</strong><p>The highlighted answers stay visible for <b data-reveal-countdown>10</b> seconds.</p></div>`;
            const updateCountdown=()=>{if(token!==revealToken)return;const counter=$('[data-reveal-countdown]');if(counter)counter.textContent=String(Math.max(1,Math.ceil((endAt-Date.now())/1000)));};
            updateCountdown();revealInterval=setInterval(updateCountdown,250);
            revealTimeout=setTimeout(()=>{if(token!==revealToken)return;clearInterval(revealInterval);revealInterval=0;wrong.forEach(key=>{const element=gap(key);writeValue(key,'');element.classList.remove('is-revealed-answer','is-wrong');element.disabled=false;});document.querySelectorAll('[data-bank-word]').forEach(button=>button.disabled=false);$('[data-story-check]').disabled=false;$('[data-feedback]').innerHTML=feedback(false,'Now correct the gaps','Your first correct answers are still saved. Complete the cleared gaps yourself.');revealing=false;if(story.mode==='bank')active=wrong[0];gap(wrong[0])?.focus();},10000);
          },360);
          return;
        }
        clearReveal();
        const stage=stageName(story);completed.add(stage);
        sound('complete',`writingStory:${story.id}:complete`);
        saveAssessment('writingStoryBuilder',firstCorrect,keys.length,stage);
        const previousBest=Number(load().games?.writingStoryBuilder?.bestScore)||0;
        const completionCeiling=completed.size*30;
        const score=Math.min(completionCeiling,Math.max(previousBest,Math.max(0,(completed.size-1)*30)+firstCorrect*5));
        const gain=addResult('writingStoryBuilder',score,90,[...completed]);
        const full=story.sentences.join(' ').replace(/\{\{(.*?)\}\}/g,(_,key)=>resolved[key]||story.answers[key]);
        setProgress(`${completed.size} of 3 levels complete`,completed.size,3);
        $('[data-max]').src='assets/characters/max-cheering.png';$('[data-max-message]').textContent='Great story! Now read it and retell it.';
        workspace.innerHTML=`<article class="wm-panel"><h2>Story complete!</h2><div class="story-complete" data-full-story>${esc(full)}</div><p class="retell">Retell the story in your own words.</p><p class="story-reward">${gain?`+${gain} Brain Sparks saved.`:'This level was already rewarded. Your Brain Sparks are unchanged.'}</p><div class="wm-actions"><button class="wm-button" type="button" data-read-story>Read the Full Story</button><button class="wm-button wm-primary" type="button" data-levels>Choose another level</button></div></article>`;
        const readButton=$('[data-read-story]');
        if(!('speechSynthesis' in window)||typeof SpeechSynthesisUtterance==='undefined'){readButton.disabled=true;readButton.textContent='Read aloud unavailable';}
        else readButton.onclick=()=>{speechSynthesis.cancel();const utterance=new SpeechSynthesisUtterance(full);utterance.lang='en-GB';utterance.rate=.84;speechSynthesis.speak(utterance);};
        $('[data-levels]').onclick=()=>{clearReveal();window.speechSynthesis?.cancel?.();menu();};
      };
    };
    menu();
  }

  function renderCommunicationLegacy(){setHero('Communication: Everyday English','Practise asking for help, offering help and replying politely.','Mission 3','happy','Choose words that fit the situation.');let dialogIndex=0,dialogScore=0,chatIndex=0,chatCorrect=0;const existing=load().games||{};if(existing.whatShouldISayCommunication?.completed&&!existing.writingCommunication?.stageProgress?.includes('What Should I Say?'))saveGameState('writingCommunication',{stageProgress:[...(existing.writingCommunication?.stageProgress||[]),'What Should I Say?']});const hub=()=>{const p=load().games||{},done=new Set(p.writingCommunication?.stageProgress||[]);setProgress(`${done.size} of 3 games complete`,done.size,3);workspace.innerHTML=`<article class="wm-panel"><h2>Choose a conversation game</h2><div class="game-grid"><a class="game-card" href="what-should-i-say.html"><strong>What Should I Say?</strong><small>10 situations · choose the best reply</small></a><button class="game-card" data-dialogues><strong>Complete the Dialogue</strong><small>6 connected conversations</small></button><button class="game-card" data-chat><strong>Chat with Max</strong><small>Write natural short replies</small></button></div><p class="wm-instruction">If a free response is natural but cannot be checked reliably, you can send it for teacher review.</p></article>`;$('[data-dialogues]').onclick=dialog;$('[data-chat]').onclick=chat;};
    const dialog=()=>{const d=DATA.dialogues[dialogIndex],lineHtml=d.lines.map(([who,text])=>`<div class="bubble ${who==='You'?'you':'max'}"><strong>${who}</strong><br>${text==='{{answer}}'?'<span data-dialog-gap>...</span>':esc(text)}</div>`).join('');workspace.innerHTML=`<article class="wm-panel"><button class="wm-button" data-hub>← Games</button><h2>Dialogue ${dialogIndex+1} of ${DATA.dialogues.length}</h2><p class="wm-instruction">Read the whole conversation. Complete the missing reply.</p><div class="dialogue">${lineHtml}</div>${d.type==='choice'?`<div class="choice-grid">${d.options.map(x=>`<button class="choice-card" data-dialog-choice="${esc(x)}">${esc(x)}</button>`).join('')}</div>`:`<input class="chat-input" data-dialog-input placeholder="Type the missing reply" autocomplete="off">`}<div data-feedback></div><div class="wm-actions"><button class="wm-button wm-primary" data-dialog-check disabled>Check Answer</button><button class="wm-button wm-primary" data-dialog-next hidden>${dialogIndex===5?'Finish game':'Next dialogue'}</button></div></article>`;let selected='';$('[data-hub]').onclick=hub;if(d.type==='choice')document.querySelectorAll('[data-dialog-choice]').forEach(b=>b.onclick=()=>{selected=b.dataset.dialogChoice;document.querySelectorAll('[data-dialog-choice]').forEach(x=>x.classList.toggle('is-selected',x===b));$('[data-dialog-check]').disabled=false;$('[data-dialog-gap]').textContent=selected;});else{$('[data-dialog-input]').oninput=e=>{$('[data-dialog-check]').disabled=!e.target.value.trim();$('[data-dialog-gap]').textContent=e.target.value||'...';};}$('[data-dialog-check]').onclick=()=>{const answer=d.type==='choice'?selected:$('[data-dialog-input]').value,ok=d.type==='choice'?answer===d.answer:d.accepted.includes(normalize(answer));$('[data-feedback]').innerHTML=feedback(ok,ok?'Dialogue complete!':'Try again',d.explanation);if(ok){dialogScore+=10;$('[data-dialog-check]').hidden=true;$('[data-dialog-next]').hidden=false;}};$('[data-dialog-next]').onclick=()=>{if(dialogIndex<5){dialogIndex++;dialog();}else{addResult('writingCommunication',dialogScore,60,['Complete the Dialogue']);hub();}};};
    const chat=()=>{};hub();}

  function renderCommunication(){
    setHero('Communication: Everyday English','Practise asking for help, offering help and replying politely.','Mission 3','happy','Choose words that fit the situation.');
    let dialogIndex=0,dialogScore=0,dialogCorrect=0,chatIndex=0,chatCorrect=0;
    const booster=window.ENGLISH_QUEST_MISTAKE_BOOSTER.create('writingCommunication',{singular:'reply',unit:'replies'});
    const dialogueBooster=window.ENGLISH_QUEST_MISTAKE_BOOSTER.create(DIALOGUE_GAME_KEY,{singular:'reply',unit:'replies'});
    const reviewContext=(data)=>{const savedLines=Array.isArray(data.contextLines)?data.contextLines:null,dialogue=DATA.dialogues.find(entry=>entry.title===data.title),lines=savedLines||dialogue?.lines?.slice(0,dialogue.lines.findIndex(([,text])=>text==='{{answer}}'))||[];if(lines.length)return `<div class="booster-review-context" aria-label="Original conversation">${lines.map(([who,text])=>`<div class="bubble ${who==='You'?'you':'max'}"><strong>${esc(who)}</strong><br>${esc(text)}</div>`).join('')}</div>`;const chatMatch=String(data.title||'').match(/Chat with Max · (\d+)/),chat=chatMatch?DATA.chats[Number(chatMatch[1])-1]:null,situation=data.situation||chat?.situation,message=data.message||chat?.message,speaker=data.speaker||'Max';if(situation||message)return `<div class="booster-review-context"><p class="booster-review-situation"><strong>Situation</strong>${esc(situation||'')}</p>${message?`<div class="bubble max"><strong>${esc(speaker)}</strong><br>${esc(message)}</div>`:''}</div>`;return '';};
    const review=(item,resume,activeBooster=booster)=>{const data=item.payload,options=shuffle(data.options);let selected='';workspace.innerHTML=`<article class="wm-panel mistake-booster-review"><span class="mistake-booster-tag">Mistake Booster · ${item.streak||0} of 2</span><h2>${esc(data.title)}</h2><p class="wm-instruction">Choose the best reply again. No hint this time.</p>${reviewContext(data)}<div class="choice-grid">${options.map(option=>`<button class="choice-card" data-review-choice="${esc(option)}">${esc(option)}</button>`).join('')}</div><div data-feedback></div><div class="wm-actions"><button class="wm-button wm-primary" data-review-check disabled>Check Answer</button><button class="wm-button wm-primary" data-review-next hidden>Continue</button></div></article>`;document.querySelectorAll('[data-review-choice]').forEach(button=>button.onclick=()=>{selected=button.dataset.reviewChoice;document.querySelectorAll('[data-review-choice]').forEach(option=>option.classList.toggle('is-selected',option===button));$('[data-review-check]').disabled=false;});$('[data-review-check]').onclick=()=>{const correct=selected===data.answer,result=activeBooster.answerReview(item.id,correct),button=[...document.querySelectorAll('[data-review-choice]')].find(option=>option.dataset.reviewChoice===selected);sound(correct?'correct':'incorrect',`writingCommunication:review:${item.id}:${normalize(selected)}:${item.streak||0}`);if(!correct){button.disabled=true;button.classList.add('is-wrong');$('[data-feedback]').innerHTML=feedback(false,'Not yet — try again',result.showRule?`Rule: ${result.rule} Return to the Communication learning stage if you need more help.`:'Choose a different reply.');return;}button.classList.add('is-correct');document.querySelectorAll('[data-review-choice]').forEach(option=>option.disabled=true);$('[data-feedback]').innerHTML=feedback(true,result.mastered?"Great! You've mastered it!":'Correct repeat · 1 of 2',result.mastered?'This reply has left your practice queue.':'It will return once more after a few tasks.');$('[data-review-check]').hidden=true;$('[data-review-next]').hidden=false;};$('[data-review-next]').onclick=resume;};
    const continueWithBoost=(activeBooster,hadMistake,resume)=>{if(!hadMistake)activeBooster.tick();const due=activeBooster.nextDue();if(due)review(due,resume,activeBooster);else resume();};
    const existing=load().games||{};
    if(existing.whatShouldISayCommunication?.completed&&!existing.writingCommunication?.stageProgress?.includes('What Should I Say?'))saveGameState('writingCommunication',{stageProgress:[...(existing.writingCommunication?.stageProgress||[]),'What Should I Say?']});
    const hub=(showGames=false)=>{
      const games=load().games||{},done=new Set(games.writingCommunication?.stageProgress||[]);
      const whatDone=games.whatShouldISayCommunication?.completed===true||done.has('What Should I Say?'),dialogueDone=games[DIALOGUE_GAME_KEY]?.completed===true,chatDone=games.writingChatWithMax?.completed===true||done.has('Chat with Max'),communicationDone=[whatDone,dialogueDone,chatDone].filter(Boolean).length;
      $('[data-max]').src='assets/characters/max-happy.png';$('[data-max-message]').textContent='Choose words that fit the situation.';
      setProgress(`${communicationDone} of 3 games complete`,communicationDone,3);
      const writingComplete=games.writingBuildSentence?.completed===true&&['Easy','Medium','Hard'].every(stage=>(games.writingStoryBuilder?.stageProgress||[]).includes(stage))&&whatDone&&dialogueDone&&chatDone;
      if(writingComplete&&!showGames){
        $('[data-max]').src='assets/characters/max-cheering.png';$('[data-max-message]').textContent='You completed every Writing mission!';
        setProgress('All Writing Missions Complete!',3,3);
        workspace.innerHTML=`<article class="wm-panel mission-complete"><img src="assets/characters/max-cheering.png" alt="Max cheering"><h2>All Writing Missions Complete!</h2><p>You completed Build a Sentence, Max's Story Builder and Communication: Everyday English.</p><div class="wm-actions"><a class="wm-button" href="writing.html?unit=0#activity-panel">Back to Writing Lab</a><a class="wm-button" href="index.html">Home</a><button class="wm-button wm-primary" type="button" data-play-again>Play Mission 3 Again</button></div></article>`;
        $('[data-play-again]').onclick=()=>hub(true);
        return;
      }
      workspace.innerHTML=`<article class="wm-panel"><h2>Choose a conversation game</h2><div class="game-grid"><a class="game-card" href="what-should-i-say.html"><strong>What Should I Say?</strong><small>10 situations · choose the best reply</small></a><button class="game-card" data-dialogues><strong>Complete the Dialogue</strong><small>6 connected conversations</small></button><button class="game-card" data-chat><strong>Chat with Max</strong><small>5 situations · choose the best reply</small></button></div><p class="wm-instruction">Use Go Getter 3 expressions to ask for help, offer help and reply politely.</p></article>`;
      $('[data-dialogues]').onclick=()=>{dialogIndex=0;dialogScore=0;dialogCorrect=0;dialog();};$('[data-chat]').onclick=()=>{chatIndex=0;chatCorrect=0;chat();};
    };
    const dialog=()=>{
      const d=DATA.dialogues[dialogIndex],options=shuffle(d.options);
      workspace.innerHTML=`<article class="wm-panel one-missing-reply"><button class="wm-button" data-hub>← Games</button><h2>Dialogue ${dialogIndex+1} of ${DATA.dialogues.length}</h2><div class="one-reply-prompt"><div class="bubble max"><strong>Max</strong><br>${esc(d.message)}</div></div><h3 class="one-reply-question">What do you say?</h3><div class="choice-grid one-reply-options">${options.map(option=>`<button class="choice-card" data-dialog-choice="${esc(option)}">${esc(option)}</button>`).join('')}</div><div data-feedback></div><div class="wm-actions"><button class="wm-button wm-primary" data-dialog-check disabled>Check Answer</button><button class="wm-button wm-primary" data-dialog-next hidden disabled>${dialogIndex===DATA.dialogues.length-1?'Finish game':'Next dialogue'}</button></div></article>`;
      let selected='',firstAttempt=true,hadMistake=false;$('[data-hub]').onclick=hub;
      document.querySelectorAll('[data-dialog-choice]').forEach(button=>button.onclick=()=>{
        selected=button.dataset.dialogChoice;
        document.querySelectorAll('[data-dialog-choice]').forEach(option=>option.classList.remove('is-selected'));
        button.classList.add('is-selected');$('[data-dialog-check]').disabled=false;if(!hadMistake)$('[data-feedback]').innerHTML='';
      });
      $('[data-dialog-check]').onclick=()=>{
        const correct=selected===d.answer,selectedButton=[...document.querySelectorAll('[data-dialog-choice]')].find(button=>button.dataset.dialogChoice===selected);
        $('[data-feedback]').innerHTML=feedback(correct,correct?'Dialogue complete!':'Try another reply',correct?d.explanation:d.hint);
        if(!correct){sound('incorrect',`writingDialogueV1:${dialogIndex}:${normalize(selected)}`);firstAttempt=false;hadMistake=true;dialogueBooster.recordMistake({id:`one-reply:${dialogIndex}`,hint:d.hint,rule:d.explanation,payload:{title:d.title,message:d.message,speaker:'Max',options:d.options,answer:d.answer}});selectedButton?.classList.remove('is-selected');selectedButton?.classList.add('is-wrong');selectedButton.disabled=true;selected='';$('[data-dialog-check]').disabled=true;return;}
        sound('correct',`writingDialogueV1:${dialogIndex}:correct`);if(firstAttempt){dialogCorrect+=1;dialogScore+=10;}selectedButton?.classList.add('is-correct');document.querySelectorAll('[data-dialog-choice]').forEach(button=>button.disabled=true);
        $('[data-dialog-check]').hidden=true;$('[data-dialog-next]').hidden=false;$('[data-dialog-next]').disabled=false;
      };
      $('[data-dialog-next]').onclick=()=>{
        const resume=()=>{if(dialogIndex<DATA.dialogues.length-1){dialogIndex+=1;dialog();}else{saveDialogueResult(dialogCorrect,dialogScore,DATA.dialogues.length,dialogueBooster.stats());sound('complete','writingCommunication:dialogues:complete');hub();}};continueWithBoost(dialogueBooster,hadMistake,resume);
      };
    };
    const chat=()=>{
      const c=DATA.chats[chatIndex],options=shuffle(c.options);
      $('[data-max]').src='assets/characters/max-happy.png';$('[data-max-message]').textContent='Choose the reply that best fits the situation.';
      workspace.innerHTML=`<article class="wm-panel chat-with-max"><button class="wm-button" data-hub>← Games</button><h2>Chat with Max · ${chatIndex+1} of ${DATA.chats.length}</h2><p class="chat-situation"><strong>Situation</strong>${esc(c.situation)}</p><div class="dialogue"><div class="bubble max"><strong>Max</strong><br>${esc(c.message)}</div><div class="bubble you"><strong>You</strong><br><span data-live>Choose a reply below.</span></div><div class="bubble max max-reaction" data-max-reaction hidden><strong>Max</strong><br>${esc(c.reaction)}</div></div><div class="choice-grid chat-choice-grid" aria-label="Reply choices">${options.map(option=>`<button class="choice-card" data-chat-choice="${esc(option)}">${esc(option)}</button>`).join('')}</div><div data-feedback aria-live="polite"></div><div class="wm-actions"><button class="wm-button wm-primary" data-chat-check disabled>Check Reply</button><button class="wm-button wm-primary" data-chat-next hidden>${chatIndex===DATA.chats.length-1?'Finish game':'Next'}</button></div></article>`;
      let selected='',firstAttempt=true,hadMistake=false;$('[data-hub]').onclick=hub;
      document.querySelectorAll('[data-chat-choice]').forEach(button=>button.onclick=()=>{
        selected=button.dataset.chatChoice;
        document.querySelectorAll('[data-chat-choice]').forEach(option=>option.classList.remove('is-selected','is-wrong'));
        button.classList.add('is-selected');$('[data-live]').textContent=selected;$('[data-chat-check]').disabled=false;$('[data-feedback]').innerHTML='';
        $('[data-max]').src='assets/characters/max-happy.png';$('[data-max-message]').textContent='Good choice? Check your reply!';
      });
      $('[data-chat-check]').onclick=()=>{
        const correct=selected===c.answer,selectedButton=[...document.querySelectorAll('[data-chat-choice]')].find(button=>button.dataset.chatChoice===selected);
        if(!correct){sound('incorrect',`writingChat:${chatIndex}:${normalize(selected)}`);firstAttempt=false;hadMistake=true;booster.recordMistake({id:`chat:${chatIndex}`,hint:c.hint,rule:c.hint,payload:{title:`Chat with Max · ${chatIndex+1}`,situation:c.situation,speaker:'Max',message:c.message,options:c.options,answer:c.answer}});selectedButton?.classList.add('is-wrong');$('[data-feedback]').innerHTML=feedback(false,'Try another reply',c.hint);$('[data-max]').src='assets/characters/max-thinking.png';$('[data-max-message]').textContent=c.hint;return;}
        sound('correct',`writingChat:${chatIndex}:correct`);if(firstAttempt)chatCorrect+=1;selectedButton?.classList.add('is-correct');document.querySelectorAll('[data-chat-choice]').forEach(button=>button.disabled=true);
        $('[data-max-reaction]').hidden=false;$('[data-feedback]').innerHTML=feedback(true,'Great reply!','That is the most appropriate response in this situation.');
        $('[data-max]').src='assets/characters/max-cheering.png';$('[data-max-message]').textContent=c.reaction;$('[data-chat-check]').hidden=true;$('[data-chat-next]').hidden=false;
      };
      $('[data-chat-next]').onclick=()=>{
        const resume=()=>{if(chatIndex<DATA.chats.length-1){chatIndex+=1;chat();return;}const stats=booster.stats();saveAssessment('writingChatWithMax',chatCorrect,DATA.chats.length);addResult('writingChatWithMax',chatCorrect*10,50,['Chat with Max']);saveGameState('writingChatWithMax',{completed:true});saveGameState('writingCommunication',{stageProgress:[...new Set([...(load().games?.writingCommunication?.stageProgress||[]),'Chat with Max'])],retryAttempts:stats.retryAttempts,masteredMistakes:stats.masteredCount,pendingMistakes:stats.pending});sound('complete','writingCommunication:chat:complete');hub();};continueWithBoost(booster,hadMistake,resume);
      };
    };
    hub();
  }

  function renderWrite(){setHero('Write Your Own','Plan, save and share three pieces of independent writing.','Mission 4','thinking','Your draft is safe on this device.');let selected=DATA.writingTasks[0].id;const menu=()=>{const done=new Set(load().games?.writingYourOwn?.stageProgress||[]);setProgress(`${done.size} of 3 drafts submitted`,done.size,3);workspace.innerHTML=`<article class="wm-panel"><h2>Choose a writing task</h2><div class="level-grid">${DATA.writingTasks.map(t=>`<button class="level-card ${selected===t.id?'is-selected':''}" data-task="${t.id}"><strong>${esc(t.title)}</strong><small>${esc(t.target)}${done.has(t.title)?' · Submitted':''}</small></button>`).join('')}</div><div class="wm-actions"><button class="wm-button wm-primary" data-open>Open task</button></div></article>`;document.querySelectorAll('[data-task]').forEach(b=>b.onclick=()=>{selected=b.dataset.task;menu();});$('[data-open]').onclick=()=>editor(DATA.writingTasks.find(t=>t.id===selected));};const editor=(t)=>writingEditor(t,`write-${t.id}`,'writingYourOwn',t.title,menu);menu();}

  function renderChallenge(){setHero('Writing Challenge','Write 60–80 words about your life, school and plans.','Mission 5','cheering','Plan, write, check, then share.');setProgress('Final challenge',0,1);workspace.innerHTML=`<article class="wm-panel"><h2>My Life, My School and My Plans</h2><p class="wm-prompt">Write about yourself, school life, your usual activities, favourite places and plans for next weekend.</p><div class="writing-layout"><aside class="writing-plan"><strong>Your plan</strong><ol><li>Introduce yourself.</li><li>Describe school and a favourite subject.</li><li>Write about usual activities.</li><li>Name favourite places.</li><li>Describe weekend plans.</li></ol></aside><div><textarea class="writing-editor" data-editor placeholder="Write 60–80 words..."></textarea><div class="word-counter"><span data-count>0 words</span><span>Target: 60–80</span></div><div class="checklist">${['I answered all the questions.','I used capital letters.','I checked my spelling.','I used full stops.','I checked my verb forms.'].map((x,i)=>`<label><input type="checkbox" data-checklist="${i}"> ${x}</label>`).join('')}</div><div data-status></div><div class="wm-actions"><button class="wm-button" data-save>Save Draft</button><button class="wm-button" data-copy>Copy</button><button class="wm-button" data-download>Download</button><button class="wm-button wm-primary" data-submit disabled>Submit for Review</button></div></div></div></article>`;wireEditor('writing-challenge','writingChallenge','Teacher review',$('[data-editor]'),60,80,true);}

  function writingEditor(t,id,key,stage,back){const saved=draft(id);workspace.innerHTML=`<article class="wm-panel"><button class="wm-button" data-back-task>← Tasks</button><h2>${esc(t.title)}</h2><p class="wm-prompt">${esc(t.situation)} <strong>${esc(t.target)}</strong></p><div class="writing-layout"><aside class="writing-plan"><strong>Plan</strong><ol>${t.plan.map(x=>`<li>${esc(x)}</li>`).join('')}</ol><strong>Useful phrases</strong><ul>${t.phrases.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></aside><div><textarea class="writing-editor" data-editor placeholder="Write your text here...">${esc(saved.text)}</textarea><div class="word-counter"><span data-count>0 words</span><span>${esc(t.target)}</span></div><div data-status>${saved.status?`<div class="status-box">${esc(saved.status)}</div>`:''}</div><div class="wm-actions"><button class="wm-button" data-save>Save Draft</button><button class="wm-button" data-copy>Copy</button><button class="wm-button" data-download>Download</button><button class="wm-button wm-primary" data-submit>Submit for Review</button></div></div></div></article>`;$('[data-back-task]').onclick=back;wireEditor(id,key,stage,$('[data-editor]'),t.minWords||1,t.maxWords||999,false,t.minSentences||0,t.maxSentences||999);}
  function wireEditor(id,key,stage,editor,min,max,checklist,minSentences=0,maxSentences=999){const count=()=>editor.value.trim()?editor.value.trim().split(/\s+/).length:0,sentenceCount=()=>editor.value.trim()?editor.value.trim().split(/[.!?]+/).filter(part=>part.trim()).length:0,update=()=>{const words=count(),sentences=sentenceCount();$('[data-count]').textContent=minSentences?`${words} words · ${sentences} sentences`:`${words} words`;const checks=checklist?[...document.querySelectorAll('[data-checklist]')].every(x=>x.checked):true;$('[data-submit]').disabled=words<min||words>max||sentences<minSentences||sentences>maxSentences||!checks;};editor.addEventListener('input',update);document.querySelectorAll('[data-checklist]').forEach(x=>x.onchange=update);$('[data-save]').onclick=()=>{saveDraft(id,editor.value,'Draft saved');$('[data-status]').innerHTML='<div class="status-box">Draft saved on this device.</div>';};$('[data-copy]').onclick=async()=>{await navigator.clipboard.writeText(editor.value);$('[data-status]').innerHTML='<div class="status-box">Copied to the clipboard.</div>';};$('[data-download]').onclick=()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([editor.value],{type:'text/plain'}));a.download=`${id}.txt`;a.click();URL.revokeObjectURL(a.href);};$('[data-submit]').onclick=()=>{saveDraft(id,editor.value,'Waiting for teacher review');const old=load().games?.[key]?.stageProgress||[];saveGameState(key,{stageProgress:[...new Set([...old,stage])],status:'Waiting for teacher review',completed:checklist});$('[data-status]').innerHTML='<div class="status-box"><strong>Waiting for teacher review</strong><br>No automatic grammar score or Brain Sparks have been given.</div>';if(checklist){setProgress('Submitted for teacher review',1,1);}};update();}
  function complete(key,score,max,stages,message){const gain=addResult(key,score,max,stages);saveGameState(key,{completed:true});sound('complete',`${key}:complete:${load().games?.[key]?.updatedAt||score}`);setProgress('Mission complete',1,1);workspace.innerHTML=`<article class="wm-panel mission-complete"><img src="assets/characters/max-cheering.png" alt="Max cheering"><h2>Mission complete!</h2><p>${esc(message)}</p><p><strong>${score} / ${max}</strong> Brain Sparks · <strong>+${gain}</strong> newly saved</p><div class="wm-actions"><a class="wm-button" href="writing.html?unit=0#activity-panel">Back to Writing Lab</a><button class="wm-button wm-primary" onclick="location.reload()">Play Again</button></div></article>`;}
  const routes={build:renderBuild,story:renderStory,communication:renderCommunication,write:renderWrite,challenge:renderChallenge};(routes[mission]||renderBuild)();
})();
