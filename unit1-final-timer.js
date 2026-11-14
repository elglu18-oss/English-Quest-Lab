(() => {
  'use strict';
  const IDLE_MS=60000;
  const create=({now=()=>Date.now(),doc=typeof document!=='undefined'?document:null,target=typeof window!=='undefined'?window:null,schedule=setTimeout,cancel=clearTimeout,onCheckpoint=()=>{}}={})=>{
    let accumulatedMs=0,activeSince=null,lastActivityAt=null,idleHandle=null,started=false,destroyed=false;
    const visible=()=>!doc||doc.visibilityState!=='hidden';
    const clearIdle=()=>{if(idleHandle!==null){cancel(idleHandle);idleHandle=null;}};
    const elapsedMs=()=>{if(activeSince===null)return Math.max(0,accumulatedMs);const end=Math.min(now(),lastActivityAt+IDLE_MS);return Math.max(0,accumulatedMs+Math.max(0,end-activeSince));};
    const commit=(end=now())=>{if(activeSince===null)return;const capped=Math.min(end,lastActivityAt+IDLE_MS);accumulatedMs+=Math.max(0,capped-activeSince);activeSince=null;};
    const pause=(checkpoint=true)=>{clearIdle();commit();if(checkpoint)onCheckpoint(elapsedMs());};
    const armIdle=()=>{clearIdle();if(activeSince===null)return;const delay=Math.max(0,lastActivityAt+IDLE_MS-now());idleHandle=schedule(()=>{idleHandle=null;commit(lastActivityAt+IDLE_MS);onCheckpoint(elapsedMs());},delay);};
    const resume=()=>{if(!started||destroyed||!visible()||activeSince!==null)return;const stamp=now();activeSince=stamp;lastActivityAt=stamp;armIdle();};
    const touch=()=>{if(!started||destroyed||!visible())return;const stamp=now();if(activeSince===null)activeSince=stamp;lastActivityAt=stamp;armIdle();};
    const start=(initialMs=0)=>{accumulatedMs=Math.max(0,Number(initialMs)||0);started=true;destroyed=false;resume();return elapsedMs();};
    const stop=()=>{pause(false);started=false;return elapsedMs();};
    const onVisibility=()=>{if(!visible())pause(true);else{resume();onCheckpoint(elapsedMs());}};
    const onActivity=()=>touch();
    const onPageHide=()=>pause(true);
    doc?.addEventListener?.('visibilitychange',onVisibility);
    ['pointerdown','keydown','touchstart'].forEach((event)=>target?.addEventListener?.(event,onActivity,{passive:true}));
    target?.addEventListener?.('pagehide',onPageHide);
    const destroy=()=>{if(destroyed)return;pause(false);destroyed=true;started=false;doc?.removeEventListener?.('visibilitychange',onVisibility);['pointerdown','keydown','touchstart'].forEach((event)=>target?.removeEventListener?.(event,onActivity));target?.removeEventListener?.('pagehide',onPageHide);};
    return {start,stop,pause,resume,touch,elapsedMs,destroy,isRunning:()=>activeSince!==null,isStarted:()=>started};
  };
  const durationSeconds=(milliseconds)=>Math.max(0,Math.round((Number(milliseconds)||0)/1000));
  const clock=(seconds)=>{if(!Number.isFinite(Number(seconds)))return 'Not recorded';const value=Math.max(0,Math.round(Number(seconds))),minutes=Math.floor(value/60);return `${String(minutes).padStart(2,'0')}:${String(value%60).padStart(2,'0')}`;};
  const long=(seconds)=>{if(!Number.isFinite(Number(seconds)))return 'Not recorded';const value=Math.max(0,Math.round(Number(seconds))),minutes=Math.floor(value/60);return `${minutes} min ${value%60} sec`;};
  window.UNIT1_FINAL_TIMER={IDLE_MS,create,durationSeconds,clock,long};
})();
