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
  for (const type of ['copy', 'cut', 'paste', 'contextmenu']) {
    document.addEventListener(type, stop, true);
    window.addEventListener(type, stop, true);
  }

  for (const p of ['onvisibilitychange', 'onwebkitvisibilitychange',
                   'onblur', 'onpagehide', 'onfreeze']) {
    try { Object.defineProperty(document, p, { get: () => null, set: () => {}, configurable: true }); } catch (_) {}
    try { Object.defineProperty(window, p, { get: () => null, set: () => {}, configurable: true }); } catch (_) {}
  }
})();
