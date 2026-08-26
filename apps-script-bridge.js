/*
 * Puente GitHub Pages ↔ Google Apps Script
 * Conserva la sintaxis google.script.run usada por el frontend original.
 * V3.16 · Edupsic / EPOANT
 */
(() => {
  'use strict';

  // Dentro de HtmlService ya existe google.script.run: no sustituirlo.
  if (window.google && window.google.script && window.google.script.run) return;

  const cfg = window.EDUPSIC_CONFIG || {};
  const endpoint = String(cfg.APPS_SCRIPT_URL || '').trim();
  if (!/^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(endpoint)) {
    console.error('EDUPSIC: falta una URL válida de Google Apps Script en config.js');
    return;
  }

  const iframe = document.createElement('iframe');
  iframe.id = 'edupsicAppsScriptBridge';
  iframe.src = endpoint + '?bridge=1&v=3.16';
  iframe.title = 'Puente seguro de Google Apps Script';
  iframe.setAttribute('aria-hidden', 'true');
  iframe.style.cssText = 'position:fixed;width:1px;height:1px;left:-10000px;top:-10000px;border:0;opacity:0;pointer-events:none';

  let bridgeReady = false;
  const queue = [];
  const pending = new Map();
  let seq = 0;

  function send(message) {
    if (bridgeReady && iframe.contentWindow) {
      iframe.contentWindow.postMessage(message, '*');
    } else {
      queue.push(message);
    }
  }

  function flush() {
    while (queue.length && iframe.contentWindow) {
      iframe.contentWindow.postMessage(queue.shift(), '*');
    }
  }

  window.addEventListener('message', (event) => {
    if (!iframe.contentWindow || event.source !== iframe.contentWindow) return;
    const data = event.data || {};

    if (data.type === 'EDUPSIC_BRIDGE_READY') {
      bridgeReady = true;
      flush();
      return;
    }

    if (data.type !== 'EDUPSIC_RPC_RESULT' || !data.id) return;
    const job = pending.get(data.id);
    if (!job) return;
    pending.delete(data.id);
    clearTimeout(job.timer);

    if (data.ok) {
      if (typeof job.success === 'function') job.success(data.result);
    } else {
      const err = new Error(data.error || 'Error de Google Apps Script.');
      if (typeof job.failure === 'function') job.failure(err);
      else console.error(err);
    }
  });

  function invoke(method, args, success, failure) {
    const id = 'rpc_' + Date.now().toString(36) + '_' + (++seq).toString(36);
    const timer = setTimeout(() => {
      const job = pending.get(id);
      if (!job) return;
      pending.delete(id);
      const err = new Error('El servidor tardó demasiado en responder. Verifica la implementación de Apps Script y vuelve a intentar.');
      if (typeof job.failure === 'function') job.failure(err);
      else console.error(err);
    }, 120000);

    pending.set(id, { success, failure, timer });
    send({
      type: 'EDUPSIC_RPC',
      id,
      method: String(method),
      args: Array.isArray(args) ? args : []
    });
  }

  function runner(successHandler, failureHandler) {
    return new Proxy({}, {
      get(_target, prop) {
        if (prop === 'withSuccessHandler') {
          return (fn) => runner(fn, failureHandler);
        }
        if (prop === 'withFailureHandler') {
          return (fn) => runner(successHandler, fn);
        }
        if (prop === 'then') return undefined;
        return (...args) => invoke(prop, args, successHandler, failureHandler);
      }
    });
  }

  window.google = window.google || {};
  window.google.script = window.google.script || {};
  Object.defineProperty(window.google.script, 'run', {
    configurable: false,
    enumerable: true,
    get() { return runner(null, null); }
  });

  function mount() {
    if (!iframe.isConnected) (document.body || document.documentElement).appendChild(iframe);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount, { once: true });
  else mount();
})();
