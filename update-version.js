const fs = require("fs");
const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({
    headless: "new",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--window-size=1920,1080",
      "--disable-background-timer-throttling",
      "--disable-renderer-backgrounding",
      "--disable-backgrounding-occluded-windows",
    ],
  });
  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
      "(KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
  );
  
  await page.goto("https://web.whatsapp.com", { waitUntil: "networkidle2" });
  await page.waitForSelector("#app", { timeout: 90000 });

  await page.waitForFunction(
    () =>
      typeof window.Debug !== "undefined" &&
      typeof window.Debug.VERSION !== "undefined",
    { timeout: 90000 } // 90 segundos
  );

  const content = await page.content();
  console.log(content);

  const version = await page.evaluate(() => window.Debug.VERSION);
  const versionArray = version.split(".").map((v) => parseInt(v));

  fs.writeFileSync(
    "baileys-version.json",
    JSON.stringify({ version: versionArray }, null, 2)
  );
  console.log("✅ Versão atualizada:", versionArray);

  await browser.close();
})();
