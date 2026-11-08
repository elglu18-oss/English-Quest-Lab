(() => {
  'use strict';

  const icons = {
    home: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11.5 12 4l9 7.5"></path><path d="M5.5 10.5V21h13V10.5"></path><path d="M9.5 21v-6h5v6"></path></svg>',
    back: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5"></path><path d="m11 6-6 6 6 6"></path></svg>'
  };

  const setLabel = (element, kind, label) => {
    if (element.dataset.navEnhanced === kind) return;
    element.classList.add(`nav-${kind}`);
    element.innerHTML = `${icons[kind]}<span class="nav-label">${label}</span>`;
    element.dataset.navEnhanced = kind;
  };

  const enhance = (element) => {
    if (!(element instanceof HTMLAnchorElement || element instanceof HTMLButtonElement) || element.matches('[data-nav-plain]')) return;
    const text = element.textContent.trim();
    const href = element instanceof HTMLAnchorElement ? element.getAttribute('href') || '' : '';
    const isBack = element.matches('[data-back], [data-back-level], [data-back-task], [data-hub]') || /^\s*(←\s*)?back\b/i.test(text) || /^\s*←\s*(writing|grammar|vocabulary|games|levels|tasks)/i.test(text);
    if (isBack) { setLabel(element, 'back', 'BACK'); return; }
    if (element instanceof HTMLAnchorElement && /^(\.\/)?index\.html(?:[#?].*)?$/.test(href)) { setLabel(element, 'home', 'HOME'); return; }
    if (element.matches('[data-next], [data-dialog-next], [data-chat-next]')) {
      if (/→\s*$/.test(text)) element.textContent = text.replace(/\s*→\s*$/, '');
      element.classList.add('nav-next');
    }
  };

  const enhanceTree = (root) => {
    if (root instanceof HTMLElement) enhance(root);
    root.querySelectorAll?.('a, button').forEach(enhance);
  };

  enhanceTree(document);
  new MutationObserver((records) => records.forEach(record => record.addedNodes.forEach(node => {
    if (node.nodeType === Node.ELEMENT_NODE) enhanceTree(node);
  }))).observe(document.body, { childList: true, subtree: true });
})();
