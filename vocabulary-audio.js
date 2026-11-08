(() => {
  'use strict';

  let activeAudio = null;
  let scheduledPlayback = null;
  let generation = 0;
  let activeDuckToken = null;

  const startDuck = () => {
    if (activeDuckToken) window.ENGLISH_QUEST_MUSIC?.unduck(activeDuckToken);
    activeDuckToken = window.ENGLISH_QUEST_MUSIC?.duck(Symbol('vocabulary-audio')) || null;
    return activeDuckToken;
  };
  const endDuck = (token = activeDuckToken) => {
    if (!token) return;
    window.ENGLISH_QUEST_MUSIC?.unduck(token);
    if (activeDuckToken === token) activeDuckToken = null;
  };

  const stop = () => {
    generation += 1;
    if (scheduledPlayback) { window.clearTimeout(scheduledPlayback); scheduledPlayback = null; }
    if (activeAudio) { activeAudio.pause(); activeAudio.currentTime = 0; activeAudio = null; }
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    endDuck();
  };

  const speakBritish = (text, currentGeneration, duckToken = startDuck()) => {
    if (currentGeneration !== generation || !('speechSynthesis' in window) || typeof SpeechSynthesisUtterance === 'undefined') { endDuck(duckToken); return false; }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-GB'; utterance.rate = 0.82;
    const voices = window.speechSynthesis.getVoices?.() || [];
    const britishVoice = voices.find((voice) => /^en-GB$/i.test(voice.lang)) || voices.find((voice) => /^en-/i.test(voice.lang));
    if (britishVoice) utterance.voice = britishVoice;
    utterance.addEventListener('end', () => endDuck(duckToken), { once: true });
    utterance.addEventListener('error', () => endDuck(duckToken), { once: true });
    window.speechSynthesis.speak(utterance);
    return true;
  };

  const play = (text, audioUrl) => {
    stop();
    const currentGeneration = generation;
    if (!audioUrl) return speakBritish(text, currentGeneration);
    const duckToken = startDuck();
    const audio = new Audio(audioUrl);
    audio.preload = 'auto';
    activeAudio = audio;
    let fallbackUsed = false;
    const fallback = () => {
      if (fallbackUsed || currentGeneration !== generation) return;
      fallbackUsed = true; activeAudio = null; speakBritish(text, currentGeneration, duckToken);
    };
    audio.addEventListener('ended', () => { if (activeAudio === audio) activeAudio = null; endDuck(duckToken); }, { once: true });
    audio.addEventListener('error', fallback, { once: true });
    audio.play().catch((error) => {
      if (error?.name === 'NotAllowedError') {
        if (activeAudio === audio) activeAudio = null;
        endDuck(duckToken);
        return;
      }
      fallback();
    });
    return true;
  };

  const schedule = (text, audioUrl, delay = 180) => {
    stop();
    const currentGeneration = generation;
    scheduledPlayback = window.setTimeout(() => {
      scheduledPlayback = null;
      if (currentGeneration === generation) play(text, audioUrl);
    }, delay);
  };

  const buttonMarkup = () => `<button class="listen-again" type="button" data-listen-again aria-label="Listen Again">
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 9v6h4l5 4V5L8 9H4zm11.5 3a3.5 3.5 0 0 0-1.5-2.87v5.74A3.5 3.5 0 0 0 15.5 12zm0-7.05v2.06a6 6 0 0 1 0 9.98v2.06a8 8 0 0 0 0-14.1z"/></svg>
    <span>Listen Again</span>
  </button>`;

  window.VOCABULARY_AUDIO = { play, schedule, stop, buttonMarkup };
})();
