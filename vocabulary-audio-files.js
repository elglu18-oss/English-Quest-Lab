(() => {
  'use strict';

  const ROOT = 'assets/audio/words';
  const FOLDERS = {
    'places-in-town': 'places-in-town',
    transport: 'transport',
    jobs: 'jobs',
    'places-in-school': 'school',
    school: 'school',
    'food-and-drink': 'food',
    food: 'food',
    containers: 'containers'
  };

  const slug = (value) => String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  const urlFor = (topic, word) => {
    const folder = FOLDERS[topic];
    return folder && word ? `${ROOT}/${folder}/${slug(word)}.mp3.mp3` : '';
  };

  window.VOCABULARY_AUDIO_FILES = { urlFor, slug };
})();
