// ============================================================
//  KONFIGURASI SITUS. Semua tautan akses gim ada di SINI saja.
//  Tautan kosong / bukan https:// => kartu otomatis "Segera Hadir".
// ============================================================
export const SITE_CONFIG = {
  // ====== EDIT DI SINI: tautan akses gim ======
  links: {
    playStore: "",        // TODO: https://play.google.com/store/apps/details?id=com.ansharudin.algebramart
    webGame:   "https://algebramart.github.io/game/",        // TODO: URL GitHub Pages hasil hosting gim (mis. https://ansharudinsahid.github.io/<repo>/)
    apkDownload: "",      // TODO: tautan unduh APK (GitHub Releases / Drive)
    repo: "https://github.com/ansharudinsahid/algebra-mart-7"
  },
  apkMeta: { size: "", sha256: "" },   // TODO: ukuran (mis. "25 MB") & checksum SHA-256 APK, kosongkan bila belum ada
  contactEmail: "ansharudinsahid@gmail.com",
  competition: { name: "LIDM", year: 2026, category: "" } // TODO kategori
};

/** URL valid = string, berskema https://, dan bisa di-parse. */
export function isValidUrl(u) {
  if (typeof u !== 'string' || !/^https:\/\//i.test(u.trim())) return false;
  try { new URL(u.trim()); return true; } catch { return false; }
}

/** Validasi config saat startup; peringatan hanya ke console. */
export function validateConfig(cfg = SITE_CONFIG) {
  const warn = (m) => console.warn('[config]', m);
  if (!cfg || typeof cfg !== 'object') { warn('SITE_CONFIG tidak valid'); return; }
  if (!cfg.links || typeof cfg.links !== 'object') { warn('links hilang'); return; }
  for (const k of ['playStore', 'webGame', 'apkDownload', 'repo']) {
    const v = cfg.links[k];
    if (typeof v !== 'string') warn(`links.${k} harus string`);
    else if (v && !isValidUrl(v)) warn(`links.${k} bukan URL https:// yang valid, kartu jadi "Segera Hadir"`);
    else if (!v) warn(`links.${k} kosong (TODO)`);
  }
  if (!cfg.contactEmail) warn('contactEmail kosong (TODO)');
  if (!cfg.competition?.category) warn('competition.category kosong (TODO)');
}

