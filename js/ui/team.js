import { TEAM, VALIDATORS, INSTITUTION } from '../content.js';
import { SITE_CONFIG } from '../config.js';
import { attachImgFallback, esc } from '../utils/safe.js';

const initials = (n) => n.replace(/\b(Dr|M\.Kom|M\.Pd)\.?,?/g, '').split(/\s+/).filter(Boolean).map((w) => w[0]).slice(0, 2).join('').toUpperCase();

function card(p, kind) {
  const links = p.links || {};
  const l = [];
  if (links.github) l.push(`<a href="${esc(links.github)}" target="_blank" rel="noopener">GitHub</a>`);
  if (links.instagram) l.push(`<a href="${esc(links.instagram)}" target="_blank" rel="noopener">Instagram</a>`);
  if (links.email) l.push(`<a href="mailto:${esc(links.email)}">Email</a>`);
  const role = /^TODO/.test(p.role) ? `<span class="todo">${esc(p.role)}</span>` : esc(p.role);
  const prodi = p.prodi ? (/^TODO/.test(p.prodi) ? `<span class="todo">${esc(p.prodi)}</span>` : esc(p.prodi)) : '';
  const chipLabel = kind === 'val' ? 'Dosen Pembimbing' : (p.isLead ? 'Ketua Tim' : 'Anggota Tim');
  const chipClass = kind === 'val' || p.isLead ? 'chip chip--green' : 'chip';
  return `<article class="card id-card reveal">
    <div class="id-card__photo">${p.photo ? `<img src="${esc(p.photo)}" alt="Foto ${esc(p.name)}" width="112" height="112" loading="lazy" data-round="1">` : `<div class="img-fallback img-fallback--round" role="img" aria-label="Inisial ${esc(p.name)}">${initials(p.name)}</div>`}</div>
    <span class="${chipClass}">${chipLabel}</span>
    <h3 style="margin-top:.6rem">${esc(p.name)}</h3>
    <div class="id-card__role">${role}</div>
    ${prodi ? `<div class="id-card__meta">${prodi}</div>` : ''}
    ${l.length ? `<div class="id-card__links">${l.join('')}</div>` : ''}
  </article>`;
}

export function initTeam() {
  const t = document.getElementById('team-grid'), v = document.getElementById('validator-grid');
  if (t) t.innerHTML = TEAM.map((p) => card(p, 'dev')).join('');
  if (v) v.innerHTML = VALIDATORS.map((p) => card(p, 'val')).join('');
  document.querySelectorAll('.id-card img').forEach((img) => attachImgFallback(img, img.alt.replace('Foto ', '')));

  const inst = document.getElementById('institution');
  if (inst) {
    const logoCards = INSTITUTION.logos.map((lg) => `
      <article class="card card--tilt logo-card" data-fx="tilt" data-logo-key="${esc(lg.key || '')}">
        <div class="logo-card__box">
          <img class="logo-card__img" src="${esc(lg.src)}" alt="${esc(lg.alt)}" width="96" height="96" loading="lazy" hidden>
          <div class="logo-card__fallback" aria-label="Placeholder ${esc(lg.title)}">
            <span class="logo-card__emblem">${esc(lg.badge || 'LOGO')}</span>
            <small class="logo-card__status">Menunggu file logo</small>
          </div>
        </div>
        <h4 class="logo-card__title">${esc(lg.title)}</h4>
        <p class="logo-card__desc">${esc(lg.desc || '')}</p>
        <code class="logo-card__path">${esc(lg.src)}</code>
      </article>
    `).join('');

    inst.innerHTML = `
      <div class="logo-showcase">${logoCards}</div>
      <div class="institution-meta">
        <p style="margin:0 0 .5rem"><b>${esc(INSTITUTION.name)}</b> · <span>${esc(INSTITUTION.detail)}</span></p>
        <p class="note" style="max-width:740px;margin:0 auto">Dikembangkan untuk ${esc(SITE_CONFIG.competition.name)} ${esc(SITE_CONFIG.competition.year)}${SITE_CONFIG.competition.category ? ' · ' + esc(SITE_CONFIG.competition.category) : ' <span class="todo">TODO: nama kategori lomba</span>'}.</p>
      </div>`;

    inst.querySelectorAll('.logo-card').forEach((cardEl) => {
      const img = cardEl.querySelector('.logo-card__img');
      const fb = cardEl.querySelector('.logo-card__fallback');
      if (!img) return;
      const showImg = () => {
        if (img.naturalWidth > 0) {
          img.hidden = false;
          if (fb) fb.hidden = true;
          cardEl.classList.add('has-logo');
        }
      };
      const showFallback = () => {
        img.hidden = true;
        if (fb) fb.hidden = false;
      };
      img.addEventListener('load', showImg, { once: true });
      img.addEventListener('error', showFallback, { once: true });
      if (img.complete) {
        if (img.naturalWidth > 0) showImg();
        else showFallback();
      }
    });
  }
}

