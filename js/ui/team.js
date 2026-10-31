import { TEAM, VALIDATORS, INSTITUTION } from '../content.js';
import { SITE_CONFIG } from '../config.js';
import { attachImgFallback, esc } from '../utils/safe.js';
import { slugify, resolveSlots } from '../slots.js';

const initials = (n) => n.replace(/\b(Dr|M\.Kom|M\.Pd)\.?,?/g, '').split(/\s+/).filter(Boolean).map((w) => w[0]).slice(0, 2).join('').toUpperCase();

const isTodo = (v) => typeof v === 'string' && /^\s*TODO/i.test(v);

/** Label lencana peran: diambil dari data `role` (content.js); hanya tampil sekali per kartu. */
function roleLabel(p, kind) {
  if (p.role && !isTodo(p.role)) return p.role;
  return kind === 'val' ? 'Dosen Pembimbing' : (p.isLead ? 'Ketua Tim' : 'Anggota Tim');
}

function card(p, kind) {
  const links = p.links || {};
  const l = [];
  if (links.github) l.push(`<a href="${esc(links.github)}" target="_blank" rel="noopener noreferrer">GitHub</a>`);
  if (links.instagram) l.push(`<a href="${esc(links.instagram)}" target="_blank" rel="noopener noreferrer">Instagram</a>`);
  if (links.email) l.push(`<a href="mailto:${esc(links.email)}">Email</a>`);
  // Program studi / bidang: tidak dirender bila masih TODO atau kosong
  const prodi = p.prodi && !isTodo(p.prodi) ? esc(p.prodi) : '';
  const chipClass = kind === 'val' || p.isLead ? 'chip chip--green' : 'chip';
  const slug = slugify(p.name);
  const slotFolder = kind === 'val' ? 'assets/validator' : 'assets/tim';
  const slotId = kind === 'val' ? `validator-${slug}` : `tim-${slug}`;

  // Urutan: foto/inisial -> lencana peran -> nama -> program studi -> tautan
  return `<article class="card id-card reveal" data-reveal="shelf">
    <div class="id-card__photo">
      <figure class="slot-container slot-container--round" data-slot="${slotId}" data-folder="${slotFolder}" data-file="${slug}" data-ratio="1:1" data-width="800" data-height="800" data-alt="Foto ${esc(p.name)}" data-fallback="initials">
        <div class="img-fallback img-fallback--round" role="img" aria-label="Inisial ${esc(p.name)}">${initials(p.name)}</div>
      </figure>
    </div>
    <span class="${chipClass} id-card__badge">${esc(roleLabel(p, kind))}</span>
    <h3 class="id-card__name">${esc(p.name)}</h3>
    ${prodi ? `<div class="id-card__meta">${prodi}</div>` : ''}
    ${l.length ? `<div class="id-card__links">${l.join('')}</div>` : ''}
  </article>`;
}

export function initTeam() {
  const t = document.getElementById('team-grid'), v = document.getElementById('validator-grid');
  if (t) {
    t.innerHTML = TEAM.map((p) => card(p, 'dev')).join('');
    resolveSlots(t);
  }
  if (v) {
    v.innerHTML = VALIDATORS.map((p) => card(p, 'val')).join('');
    resolveSlots(v);
  }
  document.querySelectorAll('.id-card img').forEach((img) => attachImgFallback(img, img.alt.replace('Foto ', '')));

  const inst = document.getElementById('institution');
  if (inst) {
    const logoCards = INSTITUTION.logos.map((lg) => {
      // Detail institusi (prodi/fakultas) cukup tampil sekali: pada kartu logo kampus
      const desc = lg.key === 'kampus' && INSTITUTION.detail && !isTodo(INSTITUTION.detail) ? INSTITUTION.detail : (lg.desc || '');
      return `
      <article class="card card--tilt logo-card" data-fx="tilt" data-logo-key="${esc(lg.key || '')}">
        <div class="logo-card__box">
          <img class="logo-card__img" src="${esc(lg.src)}" alt="${esc(lg.alt)}" width="96" height="96" loading="lazy" hidden>
          <div class="logo-card__fallback" aria-label="Placeholder ${esc(lg.title)}">
            <span class="logo-card__emblem">${esc(lg.badge || 'LOGO')}</span>
            <small class="logo-card__status">Menunggu file logo</small>
          </div>
        </div>
        <h4 class="logo-card__title">${esc(lg.title)}</h4>
        ${desc ? `<p class="logo-card__desc">${esc(desc)}</p>` : ''}
        <code class="logo-card__path">${esc(lg.src)}</code>
      </article>`;
    }).join('');

    const comp = SITE_CONFIG.competition || {};
    const category = comp.category && !isTodo(comp.category) ? String(comp.category).trim() : '';
    inst.innerHTML = `
      <div class="logo-showcase">${logoCards}</div>
      <div class="institution-meta">
        <p class="note" id="competition-banner" style="max-width:740px;margin:0 auto">Dikembangkan untuk ${esc(comp.name)} ${esc(comp.year)}${category ? ' · Kategori ' + esc(category) : ''}</p>
      </div>`;

    inst.querySelectorAll('.logo-card').forEach((cardEl) => {
      const img = cardEl.querySelector('.logo-card__img');
      const fb = cardEl.querySelector('.logo-card__fallback');
      if (!img) return;

      const initialSrc = img.getAttribute('src');
      const candidates = [initialSrc];

      let idx = 0;
      function tryLoad() {
        if (idx >= candidates.length) {
          img.hidden = true;
          if (fb) fb.hidden = false;
          return;
        }
        const srcToTry = candidates[idx++];
        const probe = new Image();
        probe.onload = () => {
          img.src = srcToTry;
          img.hidden = false;
          if (fb) fb.hidden = true;
          cardEl.classList.add('has-logo');
        };
        probe.onerror = () => {
          tryLoad();
        };
        probe.src = srcToTry;
      }
      tryLoad();
    });
  }
}

