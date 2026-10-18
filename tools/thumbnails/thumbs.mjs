// Portfolio covers (1600x1200) from live sites: screenshots desktop + phone, renders a branded card.
// Usage: node thumbs.mjs sites.json [outDir]
// Needs: npm i && npx playwright install chromium (or set CHROMIUM_PATH to an existing Chrome binary).
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const [cfgPath = 'sites.json', outDir = 'out'] = process.argv.slice(2);
const sites = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
fs.mkdirSync(outDir, { recursive: true });

// Cookie banners and badges that ruin screenshots. Hidden, never accepted.
const HIDE = `#cookie-law-info-bar,.cli-modal,.cky-consent-container,.cky-overlay,#cookie-notice,.cookie-notice,
#moove_gdpr_cookie_info_bar,.cmplz-cookiebanner,#CybotCookiebotDialog,[class*="cookie-banner"],[id*="cookie-banner"],
#cookiescan-plugin,.elementor-popup-modal,.dialog-widget,.grecaptcha-badge{display:none!important}`;

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const dataUri = buf => 'data:image/png;base64,' + buf.toString('base64');

function card(s, desktop, mobile) {
  const a = s.accent || '#F26B5B';
  const scores = (s.scores || []).filter(x => x.value >= 90); // only show scores worth showing
  return `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@500;700;800&family=IBM+Plex+Mono:wght@500&display=block" rel="stylesheet">
<style>
*{margin:0;box-sizing:border-box}
body{width:1600px;height:1200px;overflow:hidden;background:#0D0E11;font-family:Archivo,sans-serif;color:#F4F4F2;position:relative}
.glow{position:absolute;right:-200px;bottom:-260px;width:1100px;height:900px;background:radial-gradient(closest-side,${a}40,transparent)}
.top{position:absolute;left:80px;top:72px;right:80px;display:flex;justify-content:space-between;font:500 22px 'IBM Plex Mono',monospace;letter-spacing:.06em}
.k{color:${a};text-transform:uppercase}.k:before{content:'';display:inline-block;width:14px;height:14px;border-radius:50%;background:${a};margin-right:14px;vertical-align:1px}
.p{color:#8B8E96}
h1{position:absolute;left:80px;top:122px;width:1080px;font-weight:800;font-size:76px;line-height:1.02;letter-spacing:-.025em}
.row{position:absolute;left:80px;top:318px;display:flex;gap:12px}
.chip{font:500 20px 'IBM Plex Mono',monospace;padding:10px 18px;border:1.5px solid #34363D;border-radius:999px;color:#C9CBD1}
.scores{position:absolute;right:80px;top:118px;display:flex;flex-direction:column;gap:14px;align-items:flex-end}
.score{display:flex;align-items:baseline;gap:14px}.score b{width:140px;text-align:right;font-size:56px;font-weight:800;color:${a};letter-spacing:-.02em}
.score span{font:500 19px 'IBM Plex Mono',monospace;color:#8B8E96;text-transform:uppercase;letter-spacing:.05em;width:200px}
.src{font:500 15px 'IBM Plex Mono',monospace;color:#5E616A;text-transform:uppercase;letter-spacing:.05em}
.browser{position:absolute;left:80px;top:410px;width:1180px;border-radius:16px;overflow:hidden;background:#1B1C21;box-shadow:0 40px 80px -20px #000a,0 0 0 1.5px #2A2C32}
.bar{height:40px;display:flex;align-items:center;gap:9px;padding-left:18px}.bar i{width:12px;height:12px;border-radius:50%;background:#3A3C43}
.browser img{display:block;width:100%}
.phone{position:absolute;left:1210px;top:500px;width:310px;border-radius:44px;padding:11px;background:#1B1C21;box-shadow:0 40px 80px -10px #000c,0 0 0 1.5px #34363D}
.phone img{display:block;width:100%;border-radius:34px}
</style></head><body><div class="glow"></div>
<div class="top"><span class="k">${esc(s.kicker || 'Website build')}</span><span class="p">${esc(new URL(s.url).hostname.replace(/^www\./, ''))}</span></div>
<h1>${esc(s.headline)}</h1>
<div class="row">${(s.chips || []).map(c => `<span class="chip">${esc(c)}</span>`).join('')}</div>
<div class="scores">${scores.map(x => `<div class="score"><b>${x.value}</b><span>${esc(x.label)}</span></div>`).join('')}
${scores.length && s.scoreSource ? `<div class="src">${esc(s.scoreSource)}</div>` : ''}</div>
<div class="browser"><div class="bar"><i></i><i></i><i></i></div><img src="${dataUri(desktop)}"></div>
<div class="phone"><img src="${dataUri(mobile)}"></div></body></html>`;
}

const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
async function shot(url, opts) {
  const ctx = await browser.newContext(opts);
  const page = await ctx.newPage();
  try { await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 }); } catch { /* slow sites still render */ }
  await page.addStyleTag({ content: HIDE });
  await page.waitForTimeout(2500);
  const buf = await page.screenshot();
  await ctx.close();
  return buf;
}

for (const [i, s] of sites.entries()) {
  const desktop = await shot(s.url, { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  const mobile = await shot(s.url, { viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  const page = await browser.newPage({ viewport: { width: 1600, height: 1200 } });
  await page.setContent(card(s, desktop, mobile), { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  const file = path.join(outDir, `${i + 1}-${new URL(s.url).hostname.replace(/^www\./, '').replace(/\W+/g, '-')}.png`);
  await page.screenshot({ path: file });
  await page.close();
  console.log('wrote', file);
}
await browser.close();
