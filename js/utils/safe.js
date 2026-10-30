// Helper ketahanan: modul gagal tidak menjatuhkan halaman.

export function safeInit(name, fn) {
  try {
    const r = fn();
    if (r && typeof r.catch === 'function') r.catch((e) => console.error(`[modul:${name}]`, e));
  } catch (e) {
    console.error(`[modul:${name}]`, e);
  }
}

let toastWrap = null;
export function toast(msg, ms = 4500) {
  try {
    if (!toastWrap) {
      toastWrap = document.createElement('div');
      toastWrap.className = 'toast-wrap';
      toastWrap.setAttribute('role', 'status');
      toastWrap.setAttribute('aria-live', 'polite');
      document.body.appendChild(toastWrap);
    }
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = msg;
    toastWrap.appendChild(t);
    setTimeout(() => t.remove(), ms);
  } catch (e) { console.error('[toast]', e); }
}

let lastErrToast = 0;
export function installGlobalHandlers() {
  const notify = () => {
    const now = Date.now();
    if (now - lastErrToast > 8000) { lastErrToast = now; toast('Ada bagian yang gagal dimuat, halaman tetap bisa dipakai.'); }
  };
  window.addEventListener('error', (e) => { console.error('[error]', e.message, e.filename, e.lineno); notify(); });
  window.addEventListener('unhandledrejection', (e) => { console.error('[unhandledrejection]', e.reason); notify(); });
}

/** Ganti gambar rusak dengan placeholder emas berinisial. */
export function attachImgFallback(img, label = '') {
  const swap = () => {
    if (img.dataset.fb) return;
    img.dataset.fb = '1';
    const d = document.createElement('div');
    d.className = 'img-fallback' + (img.dataset.round ? ' img-fallback--round' : '');
    d.setAttribute('role', 'img');
    d.setAttribute('aria-label', img.alt || label);
    const cleanLabel = (label || img.alt || 'AM').replace(/\b(Dr|M\.Kom|M\.Pd)\.?,?/g, '');
    const initials = cleanLabel.split(/\s+/).filter(Boolean).map((w) => w[0]).slice(0, 2).join('').toUpperCase();
    d.innerHTML = img.dataset.round ? '' : `<span>${esc(label || img.alt || '')}</span><small>TODO: gambar belum ditambahkan</small>`;
    if (img.dataset.round) d.textContent = initials;
    img.replaceWith(d);
  };
  img.addEventListener('error', swap, { once: true });
  if (img.complete && img.naturalWidth === 0 && img.getAttribute('src')) swap();
}

export function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

/** Salin teks; fallback execCommand, lalu pilih teks otomatis. */
export async function copyText(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) { await navigator.clipboard.writeText(text); return true; }
  } catch { /* lanjut ke fallback */ }
  try {
    const ta = document.createElement('textarea');
    ta.value = text; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0';
    document.body.appendChild(ta); ta.select();
    const ok = document.execCommand('copy');
    ta.remove();
    if (ok) return true;
  } catch { /* abaikan */ }
  try { window.prompt('Salin tautan ini (Ctrl+C):', text); } catch { /* abaikan */ }
  return false;
}

export const prefersReducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

