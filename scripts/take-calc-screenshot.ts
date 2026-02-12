import puppeteer from 'puppeteer-core';

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

async function main() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--window-size=1400,900'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900 });

  await page.goto('http://localhost:5000/calculus-lab/#/scientific', { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 1000));

  const clickBtn = async (text: string) => {
    const btns = await page.$$('button');
    for (const btn of btns) {
      const t = await btn.evaluate((el) => el.textContent?.trim());
      if (t === text) {
        await btn.click();
        return;
      }
    }
  };

  // Calculation 1: sin(π) = 0
  await clickBtn('AC');
  await new Promise((r) => setTimeout(r, 100));
  await clickBtn('sin');
  await clickBtn('π');
  await clickBtn(')');
  await clickBtn('=');
  await new Promise((r) => setTimeout(r, 300));

  // Calculation 2: sqrt(144) = 12
  await clickBtn('AC');
  await new Promise((r) => setTimeout(r, 100));
  await clickBtn('√');
  await clickBtn('1');
  await clickBtn('4');
  await clickBtn('4');
  await clickBtn(')');
  await clickBtn('=');
  await new Promise((r) => setTimeout(r, 300));

  // Calculation 3: 2^10 = 1024
  await clickBtn('AC');
  await new Promise((r) => setTimeout(r, 100));
  await clickBtn('2');
  await clickBtn('xʸ');
  await clickBtn('1');
  await clickBtn('0');
  await clickBtn('=');
  await new Promise((r) => setTimeout(r, 300));

  // Calculation 4: ln(e) = 1
  await clickBtn('AC');
  await new Promise((r) => setTimeout(r, 100));
  await clickBtn('ln');
  await clickBtn('e');
  await clickBtn(')');
  await clickBtn('=');
  await new Promise((r) => setTimeout(r, 500));

  await page.screenshot({ path: 'public/docs/scientific-tab.png' });
  console.log('Captured scientific tab');

  await browser.close();
}

main().catch(console.error);
