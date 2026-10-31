// tools/capture-game-screens.mjs
import puppeteer from '../scratch/node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const chromePath = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const gamePath = path.join(rootDir, '_sumber-game', 'www', 'index.html');
const gameUrl = 'file:///' + gamePath.replace(/\\/g, '/');
const imgDir = path.join(rootDir, 'assets', 'img');

async function main() {
  console.log('[capture] Membuka game dari:', gameUrl);
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--allow-file-access-from-files']
  });
  const page = await browser.newPage();
  // Standar lanskap game 1024x576 (16:9)
  await page.setViewport({ width: 1024, height: 576 });
  
  await page.goto(gameUrl, { waitUntil: 'load' });
  await new Promise(r => setTimeout(r, 1000));

  // 1. Dari welcome screen -> Mulai Game -> Login / Profil Screen
  const btnStart = await page.$('#btn-start-game-gateway');
  if (btnStart) {
    await btnStart.click();
    await new Promise(r => setTimeout(r, 600));
  }
  // Ambil screenshot profil
  await page.screenshot({ path: path.join(imgDir, 'ss-profil.png') });
  console.log('[capture] ss-profil.png berhasil');

  // Buat profil atau pilih profil jika ada
  await page.evaluate(() => {
    // Buat profil default
    if (window.state && window.engine) {
      const u = { id: 'u_1', name: 'Kasir Pintar', avatar: 'anaksmp.png', title: 'Kasir Magang', score: 100, stars: { 1: 3, 2: 2 }, unlockedLevels: 5 };
      window.state.users = [u];
      window.state.currentUser = u;
      localStorage.setItem('algebraMart_users', JSON.stringify([u]));
      if (typeof window.showScreen === 'function') {
        window.showScreen('screen-level-select');
      }
    }
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(imgDir, 'ss-tantangan.png') });
  console.log('[capture] ss-tantangan.png berhasil');

  // Buka level kasir tutorial
  await page.evaluate(() => {
    if (typeof window.startLevel === 'function') {
      window.startLevel(0); // Level 0 adalah tutorial
    } else if (typeof window.showScreen === 'function') {
      window.showScreen('screen-cashier');
    }
  });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(imgDir, 'ss-kasir-tutorial.png') });
  console.log('[capture] ss-kasir-tutorial.png berhasil');

  // Buka level kasir gameplay (Level 1)
  await page.evaluate(() => {
    if (typeof window.startLevel === 'function') {
      window.startLevel(1);
    }
  });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(imgDir, 'ss-kasir.png') });
  console.log('[capture] ss-kasir.png berhasil');

  await browser.close();
  console.log('[capture] Selesai mengambil semua screenshot game!');
}

main().catch(err => {
  console.error('[capture] Error:', err);
});

