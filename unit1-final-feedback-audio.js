(() => {
  'use strict';
  const FILES=Object.freeze({
    wellDone:'assets/audio/feedback/├── well-done.mp3.mp3',
    tryAgain:'assets/audio/feedback/└── try-again.mp3.mp3'
  });
  const create=({music=window.ENGLISH_QUEST_MUSIC,AudioCtor=window.Audio}={})=>{
    let active=null,duckToken=null,lastToken='';
    const release=()=>{if(duckToken){music?.unduck?.(duckToken);duckToken=null;}active=null;};
    const stop=()=>{const audio=active;active=null;if(audio){try{audio.pause();audio.currentTime=0;}catch{/* A failed or missing MP3 must never block the game. */}}if(duckToken){music?.unduck?.(duckToken);duckToken=null;}};
    const play=async(kind,token='')=>{
      const url=FILES[kind];if(!url||!music?.settings?.effectsEnabled||typeof AudioCtor!=='function')return false;
      if(token&&token===lastToken)return false;lastToken=token;stop();music.activate?.();
      let audio;
      const finish=()=>{if(active===audio)release();};
      try{
        audio=new AudioCtor(url);
        audio.preload='auto';
        active=audio;
        duckToken=music.duck?.(`unit1-final-feedback:${kind}`)||null;
        audio.addEventListener?.('ended',finish,{once:true});
        audio.addEventListener?.('error',finish,{once:true});
        await audio.play();
        return active===audio;
      }catch{
        finish();
        if(lastToken===token)lastToken='';
        return false;
      }
    };
    return {FILES,play,stop,active:()=>active};
  };
  const controller=create();
  if(typeof document!=='undefined')document.addEventListener('click',(event)=>{if(event.target?.closest?.('[data-effects-toggle]'))queueMicrotask(()=>{if(!window.ENGLISH_QUEST_MUSIC?.settings?.effectsEnabled)controller.stop();});});
  window.UNIT1_FINAL_FEEDBACK_AUDIO={...controller,FILES,create};
})();
