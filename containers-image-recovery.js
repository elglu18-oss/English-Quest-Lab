(() => {
  'use strict';

  const original = new WeakMap();
  const matchesChallengeImage = (image) => image instanceof HTMLImageElement && (
    /(?:^|\/)assets\/characters\/ziggy-(?:tricky|surprised|happy)\.png(?:[?#]|$)/i.test(image.getAttribute('src') || '')
    || /(?:^|\/)assets\/containers\/[a-z0-9-]+\.png(?:[?#]|$)/i.test(image.getAttribute('src') || '')
  );

  const remember = (image) => {
    if (!original.has(image)) original.set(image, {
      src: image.getAttribute('src') || '',
      alt: image.getAttribute('alt') || ''
    });
    return original.get(image);
  };

  const markLoaded = (image) => {
    if (!matchesChallengeImage(image)) return;
    const saved = remember(image);
    image.classList.remove('is-image-retrying', 'is-image-unavailable');
    image.removeAttribute('aria-busy');
    image.alt = saved.alt;
  };

  const retryOnce = (image) => {
    if (!matchesChallengeImage(image)) return;
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

  document.addEventListener('error', (event) => retryOnce(event.target), true);
  document.addEventListener('load', (event) => markLoaded(event.target), true);
  window.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('img').forEach((image) => {
      if (matchesChallengeImage(image) && image.complete && image.naturalWidth === 0) retryOnce(image);
    });
  }, { once: true });

  window.CONTAINERS_IMAGE_RECOVERY = { retryOnce, markLoaded };
})();
