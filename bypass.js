(() => {
  'use strict';

  const forceGet = (obj, prop, value) => {
    try { Object.defineProperty(obj, prop, { get: () => value, configurable: true }); }
    catch (_) { }
  };
  forceGet(document, 'visibilityState', 'visible');
  forceGet(document, 'hidden', false);
  forceGet(document, 'webkitVisibilityState', 'visible');
  forceGet(document, 'webkitHidden', false);
  document.hasFocus = () => true;

  const stop = (e) => e.stopImmediatePropagation();

  window.addEventListener('blur', stop, true);
  window.addEventListener('focus', stop, true);
  document.addEventListener('blur', stop, true);
  document.addEventListener('focus', stop, true);

  for (const type of ['visibilitychange', 'webkitvisibilitychange',
                      'pagehide', 'freeze', 'resume', 'mouseleave']) {
    document.addEventListener(type, stop, true);
    window.addEventListener(type, stop, true);
  }
  for (const type of ['copy', 'cut', 'contextmenu']) {
    document.addEventListener(type, stop, true);
    window.addEventListener(type, stop, true);
  }

  // --- Ošetření vkládání (Paste) ---
  document.addEventListener('paste', async (e) => {
    e.stopImmediatePropagation();
    e.preventDefault();

    const text = e.clipboardData.getData('text');
    if (!text) return;

    const target = document.activeElement;
    if (!target) return;

    // Postupné vypisování (2 znaky za sekundu = 500 ms na 1 znak)
    const delay = 170; 

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      
      if (typeof target.value === 'string') {
        const start = target.selectionStart;
        const end = target.selectionEnd;
        target.value = target.value.substring(0, start) + char + target.value.substring(end);
        target.selectionStart = target.selectionEnd = start + 1;
        target.dispatchEvent(new Event('input', { bubbles: true }));
      } else if (target.isContentEditable) {
        document.execCommand('insertText', false, char);
      }

      if (i < text.length - 1) {
        await new Promise(r => setTimeout(r, delay));
      }
    }
  }, true);

  for (const p of ['onvisibilitychange', 'onwebkitvisibilitychange',
                   'onblur', 'onpagehide', 'onfreeze']) {
    try { Object.defineProperty(document, p, { get: () => null, set: () => {}, configurable: true }); } catch (_) {}
    try { Object.defineProperty(window, p, { get: () => null, set: () => {}, configurable: true }); } catch (_) {}
  }
})();
