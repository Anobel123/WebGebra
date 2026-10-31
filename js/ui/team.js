import { TEAM, VALIDATORS, INSTITUTION } from '../content.js';
import { SITE_CONFIG } from '../config.js';
import { attachImgFallback, esc } from '../utils/safe.js';
import { slugify, resolveSlots } from '../slots.js';

const initials = (n) => n.replace(/\b(Dr|M\.Kom|M\.Pd)\.?,?/g, '').split(/\s+/).filter(Boolean).map((w) => w[0]).slice(0, 2).join('').toUpperCase();

const isTodo = (v) => typeof v === 'string' && /^\s*TODO/i.test(v);

function card(p, kind) {
  const links = p.links || {};
  const l = [];
  if (links.github) l.push(`<a href="${esc(links.github)}" target="_blank" rel="noopener noreferrer">GitHub</a>`);
  if (links.instagram) l.push(`<a href="${esc(links.instagram)}" target="_blank" rel="noopener noreferrer">Instagram</a>`);
  if (links.email) l.push(`<a href="mailto:${esc(links.email)}">Email</a>`);
  const prodi = p.prodi && !isTodo(p.prodi) ? esc(p.prodi) : '';
  const slug = slugify(p.name);
  const slotFolder = kind === 'val' ? 'assets/validator' : 'assets/tim';
  const slotId = kind === 'val' ? `validator-${slug}` : `tim-${slug}`;

  // Plakat Akademis Dosen Pembimbing
  if (kind === 'val') {
    return `<article class="advisor-card card reveal" data-reveal="shelf" style="--shelf-rot:1.5deg">
      <div class="advisor-card__inner">
        <div class="advisor-card__seal" aria-hidden="true">★</div>
        <div class="advisor-card__photo">
          <figure class="slot-container slot-container--round" data-slot="${slotId}" data-folder="${slotFolder}" data-file="${slug}" data-ratio="1:1" data-width="800" data-height="800" data-alt="Foto ${esc(p.name)}" data-fallback="initials">
            <div class="img-fallback img-fallback--round" role="img" aria-label="Inisial ${esc(p.name)}">${initials(p.name)}</div>
          </figure>
        </div>
        <div class="advisor-card__info">
          <span class="advisor-card__tag">Dosen Pembimbing Akademik</span>
          <h3 class="advisor-card__name">${esc(p.name)}</h3>
          ${prodi ? `<div class="advisor-card__meta">${prodi} · Universitas Jambi</div>` : ''}
          <p class="advisor-card__note">Supervisi pedagogis materi aljabar &amp; keterpaduan Kurikulum Merdeka Fase D.</p>
          ${l.length ? `<div class="advisor-card__links" style="display:flex;gap:.8rem;margin-top:.6rem">${l.join('')}</div>` : ''}
        </div>
      </div>
    </article>`;
  }

  // ID Card Pegawai Kasir Tim Pengembang: Tali Lanyard Menggantung dari Rel
  const isLead = Boolean(p.isLead);
  const tiltDeg = isLead ? '-1.8deg' : (slug.includes('ansharudin') ? '2deg' : (slug.includes('jean') ? '-1.2deg' : '2.4deg'));
  const leadClass = isLead ? 'id-card--lead' : '';
  const badgeLabel = isLead ? 'Ketua Tim / Project Lead' : 'Anggota Tim Pengembang';
  const badgeClass = isLead ? 'chip chip--gold id-card__badge--lead' : 'chip id-card__badge';

  return `<article class="card id-card ${leadClass} reveal" data-reveal="shelf" style="--tilt:${tiltDeg};position:relative" data-tilt-allowed>
    <div class="id-card__lanyard-strap" aria-hidden="true"></div>
    <div class="id-card__photo" style="margin-top:.4rem">
      <figure class="slot-container slot-container--round" data-slot="${slotId}" data-folder="${slotFolder}" data-file="${slug}" data-ratio="1:1" data-width="800" data-height="800" data-alt="Foto ${esc(p.name)}" data-fallback="initials">
        <div class="img-fallback img-fallback--round" role="img" aria-label="Inisial ${esc(p.name)}">${initials(p.name)}</div>
      </figure>
    </div>
    <span class="${badgeClass}">${esc(badgeLabel)}</span>
    <h4 class="id-card__name" style="margin:.4rem 0 .2rem;font-size:1.15rem">${esc(p.name)}</h4>
    ${prodi ? `<div class="id-card__meta">${prodi}</div>` : ''}
    ${l.length ? `<div class="id-card__links" style="display:flex;gap:.7rem;justify-content:center;margin-top:.5rem">${l.join('')}</div>` : ''}
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

  // Baris Minimalis Logo Instansi Tanpa Kartu di Bawah Plakat Pembimbing
  const inst = document.getElementById('institution');
  if (inst) {
    const logosHtml = INSTITUTION.logos.map((lg) => `
      <img src="${esc(lg.src)}" alt="${esc(lg.alt)}" title="${esc(lg.title)}" width="64" height="64" loading="lazy" onerror="this.style.display='none'">
    `).join('');

    const comp = SITE_CONFIG.competition || {};
    const category = comp.category && !isTodo(comp.category) ? String(comp.category).trim() : '';

    inst.innerHTML = `
      <div style="text-align:center;width:100%">
        <div class="minimal-logos-strip">${logosHtml}</div>
        <p class="note" id="competition-banner" style="max-width:740px;margin:0 auto">Dikembangkan untuk ${esc(comp.name)} ${esc(comp.year)}${category ? ' · Kategori ' + esc(category) : ''} · Universitas Jambi</p>
      </div>
    `;
  }
}
