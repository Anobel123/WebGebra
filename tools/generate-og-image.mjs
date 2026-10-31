// tools/generate-og-image.mjs
// Generator Open Graph image statis (1200x630) untuk Algebra-Mart
import puppeteer from '../scratch/node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const chromePath = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const outputPath = path.join(rootDir, 'assets', 'img', 'og-image.png');

const htmlContent = `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
  body {
    width: 1200px;
    height: 630px;
    background: radial-gradient(circle at 80% 20%, #fef3c7 0%, #fffbeb 50%, #fdf6ec 100%);
    overflow: hidden;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 60px 70px;
    border: 12px solid #78350f;
  }
  .bg-decor {
    position: absolute;
    right: -40px;
    bottom: -40px;
    width: 480px;
    height: 480px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(245, 158, 11, 0.18) 0%, rgba(217, 119, 6, 0.05) 70%, transparent 100%);
    pointer-events: none;
  }
  .bg-stripes {
    position: absolute;
    top: 0; left: 0; width: 100%; height: 16px;
    background: repeating-linear-gradient(45deg, #f59e0b, #f59e0b 20px, #fbbf24 20px, #fbbf24 40px);
  }
  .header-tag {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: #78350f;
    color: #fef3c7;
    padding: 8px 18px;
    border-radius: 999px;
    font-size: 16px;
    font-weight: 700;
    letter-spacing: 0.5px;
    box-shadow: 0 4px 10px rgba(120, 53, 15, 0.2);
    width: fit-content;
  }
  .main-content {
    margin-top: 20px;
  }
  .brand-row {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 12px;
  }
  .coin-logo {
    width: 72px;
    height: 72px;
    background: linear-gradient(135deg, #fbbf24, #d97706);
    border: 4px solid #78350f;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 38px;
    font-weight: 900;
    color: #451a03;
    box-shadow: 0 6px 14px rgba(120, 53, 15, 0.25);
  }
  .title {
    font-size: 64px;
    font-weight: 900;
    color: #451a03;
    line-height: 1.1;
    letter-spacing: -0.5px;
    text-shadow: 2px 2px 0 #fed7aa;
  }
  .subtitle {
    font-size: 26px;
    color: #78350f;
    margin-top: 14px;
    max-width: 820px;
    line-height: 1.4;
    font-weight: 600;
  }
  .pills {
    display: flex;
    gap: 14px;
    margin-top: 28px;
    flex-wrap: wrap;
  }
  .pill {
    background: #ffffff;
    color: #92400e;
    border: 2px solid #fcd34d;
    padding: 10px 20px;
    border-radius: 12px;
    font-size: 17px;
    font-weight: 700;
    box-shadow: 0 4px 6px rgba(180, 83, 9, 0.08);
  }
  .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 2px dashed #d97706;
    padding-top: 20px;
    margin-top: 20px;
  }
  .competition-info {
    font-size: 18px;
    font-weight: 700;
    color: #78350f;
  }
  .url-text {
    font-size: 18px;
    font-weight: 800;
    color: #d97706;
  }
</style>
</head>
<body>
  <div class="bg-stripes"></div>
  <div class="bg-decor"></div>
  
  <div>
    <div class="header-tag">
      <span>🏪 GIM EDUKASI ALJABAR & LITERASI KEUANGAN</span>
    </div>

    <div class="main-content">
      <div class="brand-row">
        <div class="coin-logo">x</div>
        <h1 class="title">Algebra-Mart</h1>
      </div>
      <p class="subtitle">Petualangan Belajar Aljabar di Toko Kelontong Modern untuk Siswa SMP Kelas VII · Kurikulum Merdeka</p>
      
      <div class="pills">
        <div class="pill">🛒 Simulasi Kasir Interaktif</div>
        <div class="pill">📈 20 Level Bloom C1–C6</div>
        <div class="pill">📱 Web & Android APK</div>
        <div class="pill">🏫 Mode Kelas Real-time</div>
      </div>
    </div>
  </div>

  <div class="footer">
    <div class="competition-info">Inovasi Pembelajaran Digital Pendidikan (IPDP) · LIDM 2026</div>
    <div class="url-text">algebramart.github.io</div>
  </div>
</body>
</html>`;

async function main() {
  console.log('[og-image] Memulai pembuatan og-image.png (1200x630)...');
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new'
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 630 });
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
  await page.screenshot({ path: outputPath, type: 'png' });
  await browser.close();
  console.log('[og-image] Sukses dibuat di:', outputPath);
}

main().catch(err => {
  console.error('[og-image] Gagal membuat og-image:', err);
  process.exit(1);
});
