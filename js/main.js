import { safeInit, installGlobalHandlers } from './utils/safe.js';

installGlobalHandlers();

// Tiap modul dimuat dinamis + dibungkus safeInit: satu gagal, yang lain tetap jalan.
const MODULES = [
  ['config', './config.js', (m) => m.validateConfig()],
  ['content', './content.js', async (m) => m.validateContent(m)],
  ['opening', './ui/opening.js', (m) => m.initOpening()],
  ['audio', './ui/audio.js', (m) => m.initAudio()],
  ['nav', './ui/nav.js', (m) => m.initNav()],
  ['scrollProgress', './ui/scrollProgress.js', (m) => m.initScrollProgress()],
  ['effects', './ui/effects.js', (m) => m.initEffects()],
  ['sparkFx', './ui/sparkFx.js', (m) => m.initSparkFx()],
  ['reveal', './ui/motion.js', (m) => { m.initReveal(); m.initParallax(); m.initCounters(); }],
  ['carousel', './ui/carousel.js', (m) => m.initCarousel()],
  ['demo', './ui/demo.js', (m) => m.initDemo()],
  ['kelas', './ui/kelas.js', (m) => m.initKelas()],
  ['materi', './ui/materi.js', (m) => m.initMateri()],
  ['features', './ui/features.js', (m) => m.initFeatures()],
  ['access', './ui/access.js', (m) => m.initAccess()],
  ['team', './ui/team.js', (m) => m.initTeam()],
  ['feedback', './ui/feedback.js', (m) => m.initFeedback()],
  ['hoverFx', './ui/hoverFx.js', (m) => m.initHoverFx()],
  ['year', './config.js', (m) => {
    document.querySelectorAll('[data-competition]').forEach((el) => { el.textContent = `${m.SITE_CONFIG.competition.name} ${m.SITE_CONFIG.competition.year}`; });
    const mail = m.SITE_CONFIG.contactEmail;
    document.querySelectorAll('[data-email]').forEach((el) => {
      if (mail) { el.innerHTML = ''; const a = document.createElement('a'); a.href = 'mailto:' + mail; a.textContent = mail; el.appendChild(a); }
    });
  }]
];

(async () => {
  // reveal harus dipasang setelah konten dinamis; urutan: konten dulu, lalu reveal
  const order = ['config', 'content', 'sparkFx', 'opening', 'audio', 'nav', 'scrollProgress', 'effects', 'carousel', 'demo', 'kelas', 'features', 'materi', 'access', 'team', 'feedback', 'hoverFx', 'year', 'reveal'];
  for (const name of order) {
    const [, path, run] = MODULES.find((m) => m[0] === name);
    await new Promise((res) => {
      safeInit(name, () => import(path).then(run).catch((e) => console.error(`[modul:${name}]`, e)).finally(res));
      setTimeout(res, 3000);
    });
  }
})();
