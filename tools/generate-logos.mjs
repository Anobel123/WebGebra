// tools/generate-logos.mjs
import puppeteer from '../scratch/node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const chromePath = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const imgDir = path.join(rootDir, 'assets', 'img');

const items = [
  {
    file: 'logo-algebramart.png',
    width: 512,
    height: 512,
    html: `
      <div style="width:512px;height:512px;display:flex;flex-direction:column;align-items:center;justify-content:center;background:radial-gradient(circle at 35% 30%, #fef3c7, #f59e0b 70%, #b45309);border-radius:50%;border:20px solid #451a03;box-sizing:border-box;box-shadow:0 20px 40px rgba(69,26,3,0.3)">
        <span style="font-family:'Fredoka',sans-serif;font-size:240px;font-weight:900;color:#064937;line-height:1;margin-top:-20px">x</span>
        <span style="font-family:'Nunito',sans-serif;font-size:38px;font-weight:900;color:#451a03;letter-spacing:4px;margin-top:10px">ALGEBRA-MART</span>
      </div>
    `
  },
  {
    file: 'logo-tim.png',
    width: 512,
    height: 512,
    html: `
      <div style="width:512px;height:512px;display:flex;flex-direction:column;align-items:center;justify-content:center;background:linear-gradient(135deg, #064937 0%, #0d5c46 100%);border-radius:50%;border:20px solid #fbbf24;box-sizing:border-box;box-shadow:0 20px 40px rgba(6,73,55,0.4)">
        <div style="font-size:120px;color:#fbbf24;margin-bottom:10px">👥</div>
        <span style="font-family:'Fredoka',sans-serif;font-size:46px;font-weight:900;color:#fef3c7;letter-spacing:3px">TIM PENGEMBANG</span>
        <span style="font-family:'Nunito',sans-serif;font-size:30px;font-weight:700;color:#fbbf24">UNJA 2026</span>
      </div>
    `
  },
  {
    file: 'logo-kampus.png',
    width: 512,
    height: 512,
    html: `
      <div style="width:512px;height:512px;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#ffffff;border-radius:50%;border:16px solid #d97706;box-sizing:border-box;box-shadow:0 15px 30px rgba(0,0,0,0.15)">
        <div style="font-size:110px;margin-bottom:12px">🏛️</div>
        <span style="font-family:'Fredoka',sans-serif;font-size:48px;font-weight:900;color:#78350f">UNIVERSITAS</span>
        <span style="font-family:'Fredoka',sans-serif;font-size:56px;font-weight:900;color:#064937">JAMBI</span>
      </div>
    `
  },
  {
    file: 'logo-lidm.png',
    width: 512,
    height: 512,
    html: `
      <div style="width:512px;height:512px;display:flex;flex-direction:column;align-items:center;justify-content:center;background:linear-gradient(135deg, #1e3a8a, #3b82f6);border-radius:50%;border:16px solid #fbbf24;box-sizing:border-box;box-shadow:0 15px 30px rgba(30,58,138,0.3)">
        <div style="font-size:110px;margin-bottom:8px">🏆</div>
        <span style="font-family:'Fredoka',sans-serif;font-size:68px;font-weight:900;color:#ffffff;letter-spacing:2px">LIDM</span>
        <span style="font-family:'Nunito',sans-serif;font-size:36px;font-weight:800;color:#fbbf24">2026 · IPDP</span>
      </div>
    `
  }
];

async function main() {
  console.log('[logos] Membuat placeholder logo resmi...');
  const browser = await puppeteer.launch({ executablePath: chromePath, headless: 'new' });

  for (const item of items) {
    const page = await browser.newPage();
    await page.setViewport({ width: item.width, height: item.height });
    await page.setContent(`
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"><style>body{margin:0;padding:0;background:transparent;overflow:hidden;display:flex;align-items:center;justify-content:center;width:${item.width}px;height:${item.height}px;}</style></head>
      <body>${item.html}</body>
      </html>
    `, { waitUntil: 'load' });
    const p = path.join(imgDir, item.file);
    await page.screenshot({ path: p, omitBackground: true });
    console.log('[logos] Selesai:', item.file);
    await page.close();
  }

  await browser.close();
  console.log('[logos] Semua logo berhasil dibuat!');
}

main().catch(err => console.error('[logos] Error:', err));

