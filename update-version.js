const fs = require('fs');
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();

  await page.goto('https://web.whatsapp.com', { waitUntil: 'networkidle2' });
  await page.waitForSelector('#app', { timeout: 60000 });

  await page.waitForFunction(() =>
    typeof window.Debug !== 'undefined' && typeof window.Debug.VERSION !== 'undefined'
  );

  const version = await page.evaluate(() => window.Debug.VERSION);
  const versionArray = version.split('.').map(v => parseInt(v));

  fs.writeFileSync('baileys-version.json', JSON.stringify({ version: versionArray }, null, 2));
  console.log('✅ Versão atualizada:', versionArray);

  await browser.close();
})();