// ============================================================================
//  ui/audio.js — Pengaturan Suara (BGM + SFX) Algebra-Mart
// ============================================================================

import { onStoreOpened } from './opening.js';

// Konfigurasi volume default, batas suara, dan daftar file di bagian atas file
export const AUDIO_CONFIG = {
  storageKey: 'algebraMart_audioPrefs',
  tooltipSeenKey: 'algebraMart_soundTooltipSeen',
  defaultBgmOn: false,               // Default BGM: OFF
  defaultSfxOn: false,               // Default SFX: OFF
  defaultVolumePct: 40,              // Default slider volume: 40%
  maxVolumeCap: 0.5,                 // Volume maksimum 0,5
  sfxMinIntervalMs: 80,              // Jeda minimal antar SFX: 80 ms
  sfxMaxConcurrent: 4,               // Maksimal 4 suara SFX bersamaan
  bgmFadeMs: 600,                    // Durasi fade in/out BGM: 600 ms
  tooltipDurationMs: 3000,           // Tooltip "Mau suara?" tampil 3 detik setelah shutter terbuka
  files: {
    bgm: 'assets/audio/bgm.mp3',
    sfx: {
      coin: 'assets/audio/confirmation_003.ogg',    // Klik tombol CTA keluar/aksi = bunyi koin
      right: 'assets/audio/select_001.ogg',         // Jawaban benar di demo kasir = "ting" kasir
      wrong: 'assets/audio/confirmation_001.ogg',   // Jawaban salah = "tok" lembut
      wood: 'assets/audio/select_006.ogg'           // Buka/tutup akordeon = klik kayu
    }
  }
};

const state = {
  bgmOn: AUDIO_CONFIG.defaultBgmOn,
  sfxOn: AUDIO_CONFIG.defaultSfxOn,
  volumePct: AUDIO_CONFIG.defaultVolumePct,
  hasGesture: false,
  unavailable: false,
  popoverOpen: false,
  sfxPreloaded: false,
  sfxBank: {},
  activeSfxCount: 0,
  lastSfxAt: 0,
  bgmAudio: null,
  bgmFadeRaf: 0,
  audioCtx: null,
  tooltipShown: false
};

function computeGain() {
  const ratio = Math.min(100, Math.max(0, Number(state.volumePct) || 0)) / 100;
  return Math.min(AUDIO_CONFIG.maxVolumeCap, ratio * AUDIO_CONFIG.maxVolumeCap);
}

function loadPrefs() {
  try {
    const raw = localStorage.getItem(AUDIO_CONFIG.storageKey);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (typeof parsed.bgmOn === 'boolean') state.bgmOn = parsed.bgmOn;
    if (typeof parsed.sfxOn === 'boolean') state.sfxOn = parsed.sfxOn;
    if (typeof parsed.volumePct === 'number' && !Number.isNaN(parsed.volumePct)) {
      state.volumePct = Math.min(100, Math.max(0, Math.round(parsed.volumePct)));
    }
  } catch { /* abaikan bila localStorage diblokir */ }
}

function savePrefs() {
  try {
    localStorage.setItem(AUDIO_CONFIG.storageKey, JSON.stringify({
      bgmOn: state.bgmOn,
      sfxOn: state.sfxOn,
      volumePct: state.volumePct
    }));
  } catch { /* abaikan */ }
}

function markAudioUnavailable() {
  state.unavailable = true;
  state.bgmOn = false;
  state.sfxOn = false;
  state.popoverOpen = false;
  cancelAnimationFrame(state.bgmFadeRaf);
  try {
    if (state.bgmAudio) {
      state.bgmAudio.pause();
      state.bgmAudio = null;
    }
  } catch { /* abaikan */ }

  const btn = document.getElementById('sound-toggle');
  const pop = document.getElementById('sound-popover');
  const tip = document.getElementById('sound-tooltip');
  if (pop) pop.hidden = true;
  if (tip) tip.hidden = true;
  if (btn) {
    btn.disabled = true;
    btn.setAttribute('aria-disabled', 'true');
    btn.setAttribute('aria-pressed', 'false');
    btn.setAttribute('aria-expanded', 'false');
    btn.title = 'Suara tidak tersedia';
    btn.setAttribute('aria-label', 'Suara tidak tersedia');
    btn.querySelector('.mute-line')?.removeAttribute('hidden');
  }
}

function ensureAudioContext() {
  if (state.unavailable) return null;
  if (state.audioCtx) return state.audioCtx;
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) {
      markAudioUnavailable();
      return null;
    }
    state.audioCtx = new Ctx();
    if (state.audioCtx.state === 'suspended') {
      state.audioCtx.resume().catch(() => {});
    }
    return state.audioCtx;
  } catch {
    markAudioUnavailable();
    return null;
  }
}

/** Fallback sintesis Web Audio API bila mode sintesis dipakai */
function playWebAudioSynth(kind) {
  const ctx = ensureAudioContext();
  if (!ctx) return;
  const gainVal = computeGain();
  if (gainVal <= 0.001) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (kind === 'coin') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(987.77, now);
      osc.frequency.setValueAtTime(1318.51, now + 0.06);
      gain.gain.setValueAtTime(gainVal * 0.7, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc.start(now);
      osc.stop(now + 0.23);
    } else if (kind === 'right') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.setValueAtTime(1174.66, now + 0.08);
      gain.gain.setValueAtTime(gainVal * 0.75, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
      osc.start(now);
      osc.stop(now + 0.29);
    } else if (kind === 'wrong') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(165, now + 0.16);
      gain.gain.setValueAtTime(gainVal * 0.55, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      osc.start(now);
      osc.stop(now + 0.19);
    } else {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(340, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.06);
      gain.gain.setValueAtTime(gainVal * 0.6, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
      osc.start(now);
      osc.stop(now + 0.08);
    }
  } catch { /* abaikan */ }
}

/** Preload SFX kecil hanya setelah ada gestur pengguna */
function preloadSfxFiles() {
  if (state.sfxPreloaded || state.unavailable || !state.hasGesture) return;
  state.sfxPreloaded = true;
  try {
    const entries = Object.entries(AUDIO_CONFIG.files.sfx || {});
    entries.forEach(([key, src]) => {
      if (!src) return;
      const a = new Audio();
      a.preload = 'auto';
      a.addEventListener('error', () => {
        markAudioUnavailable();
      }, { once: true });
      a.src = src;
      state.sfxBank[key] = a;
    });
  } catch {
    markAudioUnavailable();
  }
}

/** Fade volume BGM selama 600 ms */
function fadeBgm(targetVol, durationMs = AUDIO_CONFIG.bgmFadeMs, onDone = null) {
  cancelAnimationFrame(state.bgmFadeRaf);
  const audio = state.bgmAudio;
  if (!audio) {
    if (onDone) onDone();
    return;
  }
  const startVol = audio.volume;
  const diff = targetVol - startVol;
  if (Math.abs(diff) < 0.005 || durationMs <= 0) {
    audio.volume = Math.min(AUDIO_CONFIG.maxVolumeCap, Math.max(0, targetVol));
    if (onDone) onDone();
    return;
  }
  const startTime = performance.now();
  const step = (now) => {
    const t = Math.min(1, Math.max(0, (now - startTime) / durationMs));
    const nextVol = startVol + diff * t;
    try {
      audio.volume = Math.min(AUDIO_CONFIG.maxVolumeCap, Math.max(0, nextVol));
    } catch { /* abaikan */ }
    if (t < 1) {
      state.bgmFadeRaf = requestAnimationFrame(step);
    } else if (onDone) {
      onDone();
    }
  };
  state.bgmFadeRaf = requestAnimationFrame(step);
}

/** Muat & putar BGM secara lazy hanya saat pertama kali diaktifkan setelah gestur */
function syncBgmPlayback() {
  if (state.unavailable || !state.hasGesture) return;
  const shouldPlay = state.bgmOn && document.visibilityState !== 'hidden' && document.hasFocus() !== false;

  if (shouldPlay) {
    if (!state.bgmAudio) {
      const src = AUDIO_CONFIG.files.bgm;
      if (!src) return;
      try {
        const a = new Audio();
        a.loop = true;
        a.preload = 'auto';
        a.volume = 0;
        a.addEventListener('error', () => {
          markAudioUnavailable();
        }, { once: true });
        a.src = src;
        state.bgmAudio = a;
      } catch {
        markAudioUnavailable();
        return;
      }
    }
    const targetVol = computeGain();
    const p = state.bgmAudio.play();
    if (p && typeof p.then === 'function') {
      p.then(() => {
        if (!state.unavailable && state.bgmOn) {
          fadeBgm(targetVol, AUDIO_CONFIG.bgmFadeMs);
        }
      }).catch(() => {
        // Jika file BGM tidak ditemukan / gagal dimuat
        if (state.bgmAudio?.error) {
          markAudioUnavailable();
        }
      });
    } else {
      fadeBgm(targetVol, AUDIO_CONFIG.bgmFadeMs);
    }
  } else if (state.bgmAudio && !state.bgmAudio.paused) {
    fadeBgm(0, AUDIO_CONFIG.bgmFadeMs, () => {
      try { state.bgmAudio?.pause(); } catch { /* abaikan */ }
    });
  }
}

/**
 * Putar SFX sesuai pemetaan:
 * 'coin' (klik CTA), 'section' (ganti bagian), 'right' (benar), 'wrong' (salah), 'wood' (akordeon)
 */
export function playSfx(kind = 'coin') {
  try {
    if (state.unavailable || !state.sfxOn || !state.hasGesture) return;
    const now = performance.now();
    if (now - state.lastSfxAt < AUDIO_CONFIG.sfxMinIntervalMs) return;
    if (state.activeSfxCount >= AUDIO_CONFIG.sfxMaxConcurrent) return;

    const gain = computeGain();
    if (gain <= 0.001) return;

    state.lastSfxAt = now;
    preloadSfxFiles();

    const master = state.sfxBank[kind];
    if (!master) {
      playWebAudioSynth(kind);
      return;
    }

    state.activeSfxCount++;
    const release = () => {
      state.activeSfxCount = Math.max(0, state.activeSfxCount - 1);
    };

    try {
      const node = master.cloneNode();
      node.volume = gain;
      node.addEventListener('ended', release, { once: true });
      node.addEventListener('error', () => {
        release();
        markAudioUnavailable();
      }, { once: true });
      const p = node.play();
      if (p && typeof p.catch === 'function') {
        p.catch(() => {
          release();
          if (node.error || master.error) markAudioUnavailable();
        });
      }
      setTimeout(release, 1500);
    } catch {
      release();
      playWebAudioSynth(kind);
    }
  } catch { /* abaikan */ }
}

function syncAudioUi() {
  const sndBtn = document.getElementById('sound-toggle');
  const bgmBtn = document.getElementById('bgm-toggle');
  const sfxBtn = document.getElementById('sfx-toggle');
  const volInput = document.getElementById('sound-volume');
  const volVal = document.getElementById('sound-vol-val');
  const pop = document.getElementById('sound-popover');

  if (state.unavailable) {
    markAudioUnavailable();
    return;
  }

  const anyActive = state.bgmOn || state.sfxOn;
  if (sndBtn) {
    sndBtn.setAttribute('aria-pressed', String(anyActive));
    sndBtn.setAttribute('aria-expanded', String(state.popoverOpen));
    sndBtn.setAttribute('aria-label', anyActive ? 'Pengaturan suara (aktif)' : 'Pengaturan suara (nonaktif)');
    sndBtn.title = anyActive ? 'Pengaturan Suara (Aktif)' : 'Pengaturan Suara (Senyap)';
    sndBtn.querySelector('.mute-line')?.toggleAttribute('hidden', anyActive);
  }
  if (bgmBtn) {
    bgmBtn.setAttribute('aria-pressed', String(state.bgmOn));
    const st = bgmBtn.querySelector('.sound-pop__state');
    if (st) st.textContent = state.bgmOn ? 'AKTIF' : 'MATI';
  }
  if (sfxBtn) {
    sfxBtn.setAttribute('aria-pressed', String(state.sfxOn));
    const st = sfxBtn.querySelector('.sound-pop__state');
    if (st) st.textContent = state.sfxOn ? 'AKTIF' : 'MATI';
  }
  if (volInput && Number(volInput.value) !== state.volumePct) {
    volInput.value = String(state.volumePct);
  }
  if (volVal) {
    volVal.textContent = `${state.volumePct}%`;
  }
  if (pop) {
    pop.hidden = !state.popoverOpen;
  }
}

export function initAudio() {
  try {
    const sndBtn = document.getElementById('sound-toggle');
    if (!sndBtn) return;

    // Cek dukungan dasar Audio / AudioContext
    const hasWebAudio = typeof window !== 'undefined' && Boolean(window.AudioContext || window.webkitAudioContext);
    const hasHtmlAudio = typeof Audio !== 'undefined';
    if (!hasWebAudio && !hasHtmlAudio) {
      markAudioUnavailable();
      return;
    }

    loadPrefs();

    // Bungkus #sound-toggle di dalam .sound-control agar popover dan tooltip "Mau suara?" menempel rapi
    let wrap = sndBtn.closest('.sound-control');
    if (!wrap) {
      wrap = document.createElement('div');
      wrap.className = 'sound-control';
      sndBtn.parentNode.insertBefore(wrap, sndBtn);
      wrap.appendChild(sndBtn);
    }

    let tooltipEl = document.getElementById('sound-tooltip');
    if (!tooltipEl) {
      tooltipEl = document.createElement('div');
      tooltipEl.id = 'sound-tooltip';
      tooltipEl.className = 'sound-tooltip';
      tooltipEl.setAttribute('role', 'status');
      tooltipEl.setAttribute('aria-hidden', 'true');
      tooltipEl.hidden = true;
      tooltipEl.textContent = 'Mau suara?';
      wrap.appendChild(tooltipEl);
    }

    let popEl = document.getElementById('sound-popover');
    if (!popEl) {
      popEl = document.createElement('div');
      popEl.id = 'sound-popover';
      popEl.className = 'sound-pop';
      popEl.setAttribute('role', 'dialog');
      popEl.setAttribute('aria-label', 'Pengaturan suara gim');
      popEl.hidden = true;
      popEl.innerHTML = `
        <div class="sound-pop__label">Pratinjau suara gim</div>
        <button type="button" class="sound-pop__toggle" id="bgm-toggle" aria-pressed="false">
          <span>Musik Latar (BGM)</span>
          <strong class="sound-pop__state">MATI</strong>
        </button>
        <button type="button" class="sound-pop__toggle" id="sfx-toggle" aria-pressed="false">
          <span>Efek Suara (SFX)</span>
          <strong class="sound-pop__state">MATI</strong>
        </button>
        <div class="sound-pop__slider-row">
          <label for="sound-volume" class="sound-pop__vol-label">
            <span>Volume</span>
            <b id="sound-vol-val">${state.volumePct}%</b>
          </label>
          <input id="sound-volume" type="range" min="0" max="100" step="5" value="${state.volumePct}" aria-label="Volume suara">
        </div>
        <button type="button" class="btn btn--small btn--secondary sound-pop__mute-all" id="sound-mute-all">Matikan semua</button>
      `;
      wrap.appendChild(popEl);
    }

    syncAudioUi();

    // Tampilkan tooltip "Mau suara?" sekali saja selama 3 detik setelah shutter terbuka
    onStoreOpened(() => {
      if (state.unavailable || state.tooltipShown) return;
      try {
        if (sessionStorage.getItem(AUDIO_CONFIG.tooltipSeenKey) === '1') return;
        sessionStorage.setItem(AUDIO_CONFIG.tooltipSeenKey, '1');
      } catch { /* abaikan */ }
      state.tooltipShown = true;
      tooltipEl.hidden = false;
      tooltipEl.classList.add('is-visible');
      setTimeout(() => {
        tooltipEl.classList.remove('is-visible');
        setTimeout(() => { tooltipEl.hidden = true; }, 220);
      }, AUDIO_CONFIG.tooltipDurationMs);
    });

    // Catat gestur pengguna pertama (kebijakan autoplay browser)
    const unlockGesture = () => {
      if (state.hasGesture || state.unavailable) return;
      state.hasGesture = true;
      ensureAudioContext();
      if (state.sfxOn) preloadSfxFiles();
      if (state.bgmOn) syncBgmPlayback();
    };
    document.addEventListener('pointerdown', unlockGesture, { passive: true });
    document.addEventListener('keydown', unlockGesture, { passive: true });

    // Buka/tutup popover saat ikon speaker diklik
    sndBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (state.unavailable) return;
      unlockGesture();
      tooltipEl.hidden = true;
      state.popoverOpen = !state.popoverOpen;
      syncAudioUi();
    });

    const bgmBtn = popEl.querySelector('#bgm-toggle');
    const sfxBtn = popEl.querySelector('#sfx-toggle');
    const volInput = popEl.querySelector('#sound-volume');
    const muteAllBtn = popEl.querySelector('#sound-mute-all');

    bgmBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      if (state.unavailable) return;
      unlockGesture();
      state.bgmOn = !state.bgmOn;
      savePrefs();
      syncAudioUi();
      syncBgmPlayback();
    });

    sfxBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      if (state.unavailable) return;
      unlockGesture();
      state.sfxOn = !state.sfxOn;
      savePrefs();
      syncAudioUi();
      if (state.sfxOn) {
        preloadSfxFiles();
        playSfx('coin');
      }
    });

    volInput?.addEventListener('input', (e) => {
      e.stopPropagation();
      if (state.unavailable) return;
      unlockGesture();
      state.volumePct = Math.min(100, Math.max(0, Number(volInput.value) || 0));
      savePrefs();
      syncAudioUi();
      if (state.bgmAudio && state.bgmOn && !state.bgmAudio.paused) {
        state.bgmAudio.volume = computeGain();
      }
    });

    muteAllBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      if (state.unavailable) return;
      state.bgmOn = false;
      state.sfxOn = false;
      savePrefs();
      syncAudioUi();
      syncBgmPlayback();
    });

    // Tutup popover saat klik di luar atau tekan Escape
    document.addEventListener('click', (e) => {
      if (!state.popoverOpen) return;
      if (!wrap.contains(e.target)) {
        state.popoverOpen = false;
        syncAudioUi();
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && state.popoverOpen) {
        state.popoverOpen = false;
        syncAudioUi();
        sndBtn.focus();
      }
    });

    // Pause BGM otomatis saat tab tersembunyi atau jendela kehilangan fokus
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        if (state.bgmAudio && !state.bgmAudio.paused) {
          fadeBgm(0, AUDIO_CONFIG.bgmFadeMs, () => {
            try { state.bgmAudio?.pause(); } catch { /* abaikan */ }
          });
        }
      } else if (state.bgmOn && state.hasGesture) {
        syncBgmPlayback();
      }
    });
    window.addEventListener('blur', () => {
      if (state.bgmAudio && !state.bgmAudio.paused) {
        fadeBgm(0, AUDIO_CONFIG.bgmFadeMs, () => {
          try { state.bgmAudio?.pause(); } catch { /* abaikan */ }
        });
      }
    });
    window.addEventListener('focus', () => {
      if (state.bgmOn && state.hasGesture && document.visibilityState !== 'hidden') {
        syncBgmPlayback();
      }
    });

    // Pemetaan SFX global: klik tombol CTA keluar/aksi = bunyi koin; buka/tutup akordeon = klik kayu.
    // Navigasi antarbagian (menu navbar, tautan #anchor, tombol loncat bagian, carousel, barang melayang) 100% HENING.
    document.addEventListener('click', (e) => {
      if (!state.sfxOn || state.unavailable) return;
      const t = e.target;
      if (!t || typeof t.closest !== 'function') return;
      // Jangan pernah memicu SFX untuk navigasi bagian, tautan #anchor internal, menu, carousel, atau barang melayang
      if (t.closest('a[href^="#"], .nav, .header__nav, .footer ul, .cara-carousel, .guru-carousel, .stepper-phases, .fx-floaters, .fx-floater')) {
        return;
      }
      const acc = t.closest('.accordion__btn');
      if (acc) {
        playSfx('wood');
        return;
      }
      const cta = t.closest('.btn[data-fx~="cta"], .store-badge, [data-burst]');
      if (cta && !cta.matches('[disabled], [aria-disabled="true"]')) {
        playSfx('coin');
      }
    });

    // Hook pengujian untuk verifikasi browser agent
    window.__audioApi = {
      getState: () => ({
        bgmOn: state.bgmOn,
        sfxOn: state.sfxOn,
        volumePct: state.volumePct,
        gain: computeGain(),
        unavailable: state.unavailable,
        bgmPaused: state.bgmAudio ? state.bgmAudio.paused : true
      }),
      simulateMissingAudioFile: () => {
        AUDIO_CONFIG.files.bgm = 'assets/audio/tidak-ada-file.mp3';
        AUDIO_CONFIG.files.sfx.coin = 'assets/audio/tidak-ada-file.ogg';
        state.sfxPreloaded = false;
        state.sfxBank = {};
        if (state.bgmAudio) {
          state.bgmAudio.pause();
          state.bgmAudio = null;
        }
        preloadSfxFiles();
        syncBgmPlayback();
      },
      restoreAudioFiles: () => {
        state.unavailable = false;
        AUDIO_CONFIG.files.bgm = 'assets/audio/bgm.mp3';
        AUDIO_CONFIG.files.sfx.coin = 'assets/audio/confirmation_003.ogg';
        const btn = document.getElementById('sound-toggle');
        if (btn) {
          btn.disabled = false;
          btn.removeAttribute('aria-disabled');
        }
        syncAudioUi();
      }
    };
  } catch (e) {
    console.error('[modul:audio]', e);
    markAudioUnavailable();
  }
}

