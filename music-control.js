(() => {
  'use strict';

  if (window.ENGLISH_QUEST_MUSIC) return;

  const STORAGE_KEY = 'englishQuestLab.music.v1';
  const MUSIC_URL = 'assets/audio/music/background-music.mp3.mp3';
  const DEFAULTS = { enabled: false, volume: 0.15, effectsEnabled: true };
  const clampVolume = (value) => Math.min(0.5, Math.max(0, Number(value) || 0));
  const loadSettings = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      return { enabled: saved.enabled === true, volume: clampVolume(saved.volume ?? DEFAULTS.volume), effectsEnabled: saved.effectsEnabled !== false };
    } catch { return { ...DEFAULTS }; }
  };

  const settings = loadSettings();
  const music = new Audio(MUSIC_URL);
  music.loop = true;
  music.preload = 'auto';
  music.volume = 0;
  music.setAttribute('aria-hidden', 'true');
  const duckTokens = new Set();
  let userActivated = false;
  let volumeFrame = 0;
  let audioContext = null;
  const playedSignals = new Set();

  const context = () => {
    if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
    if (audioContext.state === 'suspended') audioContext.resume();
    return audioContext;
  };
  const tone = (ctx, start, frequency, duration, gainValue, type = 'sine', endFrequency = frequency) => {
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, start);
    oscillator.frequency.exponentialRampToValueAtTime(endFrequency, start + duration);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(gainValue, start + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    oscillator.connect(gain).connect(ctx.destination);
    oscillator.start(start); oscillator.stop(start + duration + 0.02);
  };
  const playEffect = (name, token = '') => {
    if (!settings.effectsEnabled) return false;
    const signalKey = token ? `${name}:${token}` : '';
    if (signalKey && playedSignals.has(signalKey)) return false;
    if (signalKey) playedSignals.add(signalKey);
    try {
      const ctx = context(); const now = ctx.currentTime + 0.01;
      if (name === 'correct') { tone(ctx, now, 440, .11, .055, 'sine', 554); tone(ctx, now + .09, 554, .14, .05, 'sine', 740); }
      if (name === 'incorrect') tone(ctx, now, 240, .18, .045, 'sine', 190);
      if (name === 'complete') { tone(ctx, now, 392, .12, .05, 'triangle', 523); tone(ctx, now + .1, 523, .12, .05, 'triangle', 659); tone(ctx, now + .21, 659, .22, .055, 'triangle', 784); }
      return true;
    } catch { return false; }
  };

  const syncStatus = () => {
    const root = document.querySelector('[data-music-control]');
    if (!root) return;
    root.dataset.playing = String(!music.paused);
    root.dataset.ducked = String(duckTokens.size > 0);
    root.dataset.effectiveVolume = music.volume.toFixed(3);
  };

  const saveSettings = () => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(settings)); } catch { /* file:// privacy modes can reject storage */ }
  };
  const targetVolume = () => settings.enabled ? settings.volume * (duckTokens.size ? 0.2 : 1) : 0;
  const glideToTarget = () => {
    cancelAnimationFrame(volumeFrame);
    const step = () => {
      const target = targetVolume();
      const difference = target - music.volume;
      if (Math.abs(difference) < 0.006) { music.volume = target; syncStatus(); return; }
      music.volume = clampVolume(music.volume + difference * 0.22);
      syncStatus();
      volumeFrame = requestAnimationFrame(step);
    };
    step();
  };
  const ensurePlaying = async () => {
    if (!settings.enabled || !userActivated || !music.paused) return;
    try { await music.play(); } catch { /* the next deliberate interaction retries */ }
    syncStatus();
  };
  const updateUi = () => {
    const root = document.querySelector('[data-music-control]');
    if (!root) return;
    root.dataset.enabled = String(settings.enabled);
    root.querySelector('[data-music-label]').textContent = settings.enabled ? 'MUSIC ON' : 'MUSIC OFF';
    root.querySelector('[data-panel-toggle]').textContent = settings.enabled ? 'ON' : 'OFF';
    root.querySelector('[data-music-volume]').value = String(Math.round(settings.volume * 100));
    root.querySelector('[data-volume-value]').textContent = `${Math.round(settings.volume * 100)}%`;
    root.querySelector('[data-effects-toggle]').textContent = settings.effectsEnabled ? 'ON' : 'OFF';
  };
  const setEnabled = (enabled) => {
    settings.enabled = Boolean(enabled);
    saveSettings(); updateUi();
    if (settings.enabled) ensurePlaying();
    else music.pause();
    glideToTarget();
  };
  const setVolume = (volume) => {
    settings.volume = clampVolume(volume);
    saveSettings(); updateUi(); glideToTarget();
  };
  const setEffectsEnabled = (enabled) => { settings.effectsEnabled = Boolean(enabled); saveSettings(); updateUi(); };
  const duck = (token = Symbol('learning-audio')) => { duckTokens.add(token); glideToTarget(); return token; };
  const unduck = (token) => { if (token) duckTokens.delete(token); glideToTarget(); };
  const activate = () => {
    userActivated = true;
    if (settings.enabled) ensurePlaying();
  };

  const noteIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18V5l10-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="16" cy="16" r="3"></circle></svg>';
  const settingsIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.56V21h-4v-.08A1.7 1.7 0 0 0 9 19.37a1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.63 15 1.7 1.7 0 0 0 3.08 14H3v-4h.08A1.7 1.7 0 0 0 4.63 9a1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 0 0 9 4.63a1.7 1.7 0 0 0 1-1.55V3h4v.08A1.7 1.7 0 0 0 15 4.63a1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 19.37 9a1.7 1.7 0 0 0 1.55 1H21v4h-.08A1.7 1.7 0 0 0 19.4 15Z"></path></svg>';
  const closeIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"></path></svg>';

  const mount = () => {
    if (!document.querySelector('link[href="music-control.css"]')) {
      const link = document.createElement('link'); link.rel = 'stylesheet'; link.href = 'music-control.css'; document.head.append(link);
    }
    const root = document.createElement('div');
    root.className = 'music-control'; root.dataset.musicControl = '';
    root.innerHTML = `<button class="music-toggle" type="button" data-music-toggle aria-label="Turn background music on or off">${noteIcon}<span data-music-label>MUSIC OFF</span></button><button class="music-settings-button" type="button" data-music-settings aria-label="Open sound settings" aria-expanded="false">${settingsIcon}</button><section class="music-panel" data-music-panel aria-label="Sound settings" hidden><div class="music-panel-head"><strong>Sound Control</strong><button class="music-panel-close" type="button" data-panel-close aria-label="Close sound settings">${closeIcon}</button></div><div class="music-panel-row"><span>Music</span><button class="music-panel-toggle" type="button" data-panel-toggle>OFF</button></div><label class="music-panel-row" for="music-volume">Music Volume</label><div class="music-volume-wrap"><input class="music-volume" id="music-volume" data-music-volume type="range" min="0" max="50" step="1" value="15"><output class="music-volume-value" data-volume-value for="music-volume">15%</output></div><div class="music-panel-row"><span>Sound Effects</span><button class="music-panel-toggle" type="button" data-effects-toggle>ON</button></div><p class="music-panel-note">Music, word pronunciation and feedback signals work independently.</p></section>`;

    const home = [...document.querySelectorAll('header a[href]')].find((link) => /(?:^|\/)index\.html(?:[?#]|$)/.test(link.getAttribute('href') || ''));
    if (home?.parentElement) home.insertAdjacentElement('afterend', root);
    else { root.classList.add('is-floating'); document.body.append(root); }

    const panel = root.querySelector('[data-music-panel]');
    const settingsButton = root.querySelector('[data-music-settings]');
    const closePanel = () => { panel.hidden = true; settingsButton.setAttribute('aria-expanded', 'false'); };
    root.querySelector('[data-music-toggle]').addEventListener('click', () => { activate(); setEnabled(!settings.enabled); });
    root.querySelector('[data-panel-toggle]').addEventListener('click', () => { activate(); setEnabled(!settings.enabled); });
    root.querySelector('[data-effects-toggle]').addEventListener('click', () => { activate(); setEffectsEnabled(!settings.effectsEnabled); });
    settingsButton.addEventListener('click', () => { activate(); panel.hidden = !panel.hidden; settingsButton.setAttribute('aria-expanded', String(!panel.hidden)); });
    root.querySelector('[data-panel-close]').addEventListener('click', closePanel);
    root.querySelector('[data-music-volume]').addEventListener('input', (event) => { activate(); setVolume(Number(event.target.value) / 100); });
    document.addEventListener('pointerdown', (event) => { if (!root.contains(event.target)) activate(); }, { capture: true });
    document.addEventListener('keydown', activate, { capture: true });
    document.addEventListener('click', (event) => { if (!panel.hidden && !root.contains(event.target)) closePanel(); });
    updateUi(); glideToTarget();
    music.addEventListener('play', syncStatus);
    music.addEventListener('pause', syncStatus);
    music.addEventListener('error', syncStatus);
    syncStatus();
  };

  if ('speechSynthesis' in window && typeof window.speechSynthesis.speak === 'function') {
    const originalSpeak = window.speechSynthesis.speak.bind(window.speechSynthesis);
    const originalCancel = window.speechSynthesis.cancel.bind(window.speechSynthesis);
    const speechTokens = new Set();
    window.speechSynthesis.speak = (utterance) => {
      const token = duck(Symbol('speech'));
      speechTokens.add(token);
      const release = () => { speechTokens.delete(token); unduck(token); };
      utterance.addEventListener?.('end', release, { once: true });
      utterance.addEventListener?.('error', release, { once: true });
      try { return originalSpeak(utterance); }
      catch (error) { release(); throw error; }
    };
    window.speechSynthesis.cancel = () => {
      speechTokens.forEach((token) => unduck(token));
      speechTokens.clear();
      return originalCancel();
    };
  }

  window.ENGLISH_QUEST_MUSIC = { setEnabled, setVolume, setEffectsEnabled, playEffect, duck, unduck, activate, settings, audio: music };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount, { once: true });
  else mount();
})();
