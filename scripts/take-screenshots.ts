import puppeteer from 'puppeteer-core';

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const BASE = 'http://localhost:5000/calculus-lab/#';

async function main() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--window-size=1400,900'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900 });

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

  // Scientific tab
  await page.goto(`${BASE}/scientific`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 1000));

  // Type a calculation to show the calculator in action
  const sciInput = await page.$('input[type="text"]');
  if (sciInput) {
    await sciInput.type('sin(45)');
  }
  await clickBtn('=');
  await new Promise((r) => setTimeout(r, 500));

  await page.screenshot({ path: 'public/docs/scientific-tab.png' });
  console.log('Captured scientific tab');

  // Graph tab - with equations plotted
  await page.goto(`${BASE}/graphing`, { waitUntil: 'networkidle0' });
  await page.waitForSelector('input[placeholder*="sin"]');

  await page.type('input[placeholder*="sin"]', 'sin(x)');
  await page.click('button[type="submit"]');
  await new Promise((r) => setTimeout(r, 500));

  await page.type('input[placeholder*="sin"]', 'x^2');
  await page.click('button[type="submit"]');
  await new Promise((r) => setTimeout(r, 500));

  await page.type('input[placeholder*="sin"]', 'cos(x)');
  await page.click('button[type="submit"]');
  await new Promise((r) => setTimeout(r, 1500));

  await page.screenshot({ path: 'public/docs/graph-tab.png' });
  console.log('Captured graph tab');

  // Calculus tab
  await page.goto(`${BASE}/calculus`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 500));

  // Compute derivative of x^3
  const calcInputs = await page.$$('input[type="text"]');
  await calcInputs[0].type('x^3');
  await clickBtn('d/dx');
  await new Promise((r) => setTimeout(r, 500));

  // Compute integral of x^2 from 0 to 1
  const integralInputs = await page.$$('.flex.flex-col.gap-2 input[type="text"]');
  if (integralInputs.length >= 4) {
    await integralInputs[1].type('x^2');
    await integralInputs[2].type('0');
    await integralInputs[3].type('1');
  }

  // Click first Compute button for integral
  await clickBtn('Compute');
  await new Promise((r) => setTimeout(r, 500));

  // Compute limit of sin(x)/x as x->0
  const limitInputs = await page.$$('input[placeholder*="sin(x)/x"], input[placeholder*="x ->"]');
  if (limitInputs.length >= 2) {
    await limitInputs[0].type('sin(x)/x');
    await limitInputs[1].type('0');
  }

  // Click second Compute button for limit
  const computeBtns = await page.$$('button');
  let computeCount = 0;
  for (const btn of computeBtns) {
    const text = await btn.evaluate((el) => el.textContent?.trim());
    if (text === 'Compute') {
      computeCount++;
      if (computeCount === 2) {
        await btn.click();
        break;
      }
    }
  }
  await new Promise((r) => setTimeout(r, 1500));

  await page.screenshot({ path: 'public/docs/calculus-tab.png' });
  console.log('Captured calculus tab');

  // Matrix tab
  await page.goto(`${BASE}/matrix`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 500));

  // Fill matrix A with [[1,2],[3,4]]
  const matrixInputs = await page.$$('input[type="number"]');
  if (matrixInputs.length >= 4) {
    await matrixInputs[0].click({ clickCount: 3 });
    await matrixInputs[0].type('1');
    await matrixInputs[1].click({ clickCount: 3 });
    await matrixInputs[1].type('2');
    await matrixInputs[2].click({ clickCount: 3 });
    await matrixInputs[2].type('3');
    await matrixInputs[3].click({ clickCount: 3 });
    await matrixInputs[3].type('4');
  }

  await clickBtn('det(A)');
  await new Promise((r) => setTimeout(r, 300));
  await clickBtn('Compute');
  await new Promise((r) => setTimeout(r, 1500));

  await page.screenshot({ path: 'public/docs/matrix-tab.png' });
  console.log('Captured matrix tab');

  // Stats tab
  await page.goto(`${BASE}/statistics`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 500));

  const textarea = await page.$('textarea');
  if (textarea) {
    await textarea.type('2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 5, 7, 11, 13, 15');
  }
  await new Promise((r) => setTimeout(r, 2000));

  await page.screenshot({ path: 'public/docs/stats-tab.png' });
  console.log('Captured stats tab');

  // Dark mode screenshot - go to graphing and toggle
  await page.goto(`${BASE}/graphing`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 500));

  // Toggle dark mode via header button
  const headerBtns = await page.$$('header button');
  if (headerBtns.length > 0) {
    await headerBtns[0].click();
  }
  await new Promise((r) => setTimeout(r, 1500));

  await page.screenshot({ path: 'public/docs/dark-mode.png' });
  console.log('Captured dark mode');

  // Toggle dark mode back to light
  const headerBtns2 = await page.$$('header button');
  if (headerBtns2.length > 0) {
    await headerBtns2[0].click();
  }
  await new Promise((r) => setTimeout(r, 500));

  // --- Responsive screenshots ---

  // Desktop graphing (1280px) - plot some equations first
  await page.setViewport({ width: 1280, height: 900 });
  await page.goto(`${BASE}/graphing`, { waitUntil: 'networkidle0' });
  await page.waitForSelector('input[placeholder*="sin"]');

  await page.type('input[placeholder*="sin"]', 'sin(x)');
  await page.click('button[type="submit"]');
  await new Promise((r) => setTimeout(r, 500));

  await page.type('input[placeholder*="sin"]', 'x^2');
  await page.click('button[type="submit"]');
  await new Promise((r) => setTimeout(r, 1500));

  await page.screenshot({ path: 'public/docs/desktop-graphing.png' });
  console.log('Captured desktop graphing');

  // Tablet graphing (768px)
  await page.setViewport({ width: 768, height: 1024 });
  await page.goto(`${BASE}/graphing`, { waitUntil: 'networkidle0' });
  await page.waitForSelector('input[placeholder*="sin"]');

  await page.type('input[placeholder*="sin"]', 'sin(x)');
  await page.click('button[type="submit"]');
  await new Promise((r) => setTimeout(r, 1500));

  await page.screenshot({ path: 'public/docs/tablet-graphing.png' });
  console.log('Captured tablet graphing');

  // Mobile screenshots (375px)
  await page.setViewport({ width: 375, height: 812 });

  // Mobile scientific
  await page.goto(`${BASE}/scientific`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: 'public/docs/mobile-scientific.png' });
  console.log('Captured mobile scientific');

  // Mobile graphing
  await page.goto(`${BASE}/graphing`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: 'public/docs/mobile-graphing.png' });
  console.log('Captured mobile graphing');

  // Mobile calculus
  await page.goto(`${BASE}/calculus`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: 'public/docs/mobile-calculus.png' });
  console.log('Captured mobile calculus');

  // Mobile statistics
  await page.goto(`${BASE}/statistics`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: 'public/docs/mobile-statistics.png' });
  console.log('Captured mobile statistics');

  // Mobile drawer - open the right panel drawer
  await page.goto(`${BASE}/scientific`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 500));

  // Click the panel toggle button in the header to open the drawer
  const panelToggle = await page.$(
    'header button[aria-label*="panel"], header button[aria-label*="Panel"], header button[aria-label*="sidebar"], header button[aria-label*="Sidebar"]',
  );
  if (panelToggle) {
    await panelToggle.click();
  } else {
    // Fallback: try the last button in header (usually the panel toggle)
    const allHeaderBtns = await page.$$('header button');
    if (allHeaderBtns.length > 1) {
      await allHeaderBtns[allHeaderBtns.length - 1].click();
    }
  }
  await new Promise((r) => setTimeout(r, 1000));

  await page.screenshot({ path: 'public/docs/mobile-drawer.png' });
  console.log('Captured mobile drawer');

  await browser.close();
  console.log('All screenshots captured!');
}

main().catch(console.error);
