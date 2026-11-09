(() => {
  'use strict';

  if (window.ENGLISH_QUEST_IMAGE_RECOVERY) return;
  const original = new WeakMap();
  const isLocalAsset = image => image instanceof HTMLImageElement
    && /(?:^|\/)assets\/[A-Za-z0-9_ ./()'-]+\.(?:png|jpe?g|webp)(?:[?#]|$)/i.test(image.getAttribute('src') || '');
  const remember = image => {
    if (!original.has(image)) original.set(image, { src: image.getAttribute('src') || '', alt: image.getAttribute('alt') || '' });
    return original.get(image);
  };
  const markLoaded = image => {
    if (!isLocalAsset(image)) return;
    const saved = remember(image);
    image.classList.remove('is-image-retrying', 'is-image-unavailable');
    image.removeAttribute('aria-busy');
    image.alt = saved.alt;
  };
  const retryOnce = image => {
    if (!isLocalAsset(image)) return;
    const saved = remember(image);
    const attempts = Number(image.dataset.imageRetryCount || 0);
    image.classList.add(attempts ? 'is-image-unavailable' : 'is-image-retrying');
    image.classList.remove(attempts ? 'is-image-retrying' : 'is-image-unavailable');
    image.alt = '';
    image.removeAttribute('aria-busy');
    if (attempts >= 1) return;
    image.dataset.imageRetryCount = '1';
    image.setAttribute('aria-busy', 'true');
    window.setTimeout(() => {
      const retryUrl = new URL(saved.src, document.baseURI);
      retryUrl.searchParams.set('image-retry', String(Date.now()));
      image.src = retryUrl.href;
    }, 250);
  };

  document.addEventListener('error', event => retryOnce(event.target), true);
  document.addEventListener('load', event => markLoaded(event.target), true);
  window.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('img').forEach(image => {
      if (isLocalAsset(image) && image.complete && image.naturalWidth === 0) retryOnce(image);
    });
  }, { once: true });
  window.ENGLISH_QUEST_IMAGE_RECOVERY = { retryOnce, markLoaded };
})();
