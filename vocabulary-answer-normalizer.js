(() => {
  'use strict';

  // Vocabulary answers are compared without case, repeated whitespace or
  // Unicode diacritics. This keeps British spellings such as “café” and the
  // keyboard-friendly “cafe” equivalent while leaving real spelling errors
  // (for example “caffee”) different.
  const normalize = (value) => String(value ?? '')
    .normalize('NFKD')
    .replace(/\p{M}+/gu, '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');

  window.VOCABULARY_NORMALIZE_ANSWER = normalize;
})();
