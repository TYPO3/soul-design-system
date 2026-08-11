import { chromium } from 'playwright';

const url = process.argv[2] ?? 'http://site:4173/index.html';
const out = process.argv[3] ?? 'scratch-header.png';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
await page.goto(url, { waitUntil: 'networkidle' });
await page.locator('.sds-bar').screenshot({ path: out });
await browser.close();
