const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', err => errors.push(err.message));
  
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
  
  const root = await page.$eval('#root', el => el.innerHTML);
  console.log('Root HTML length:', root.length);
  console.log('Root content:', root.substring(0, 300));
  
  if (errors.length) {
    console.log('\n❌ Console errors:');
    errors.forEach(e => console.log(' -', e));
  }
  
  await page.screenshot({ path: '/tmp/app-screenshot.png', fullPage: true });
  console.log('\nScreenshot saved to /tmp/app-screenshot.png');
  
  await browser.close();
})();
