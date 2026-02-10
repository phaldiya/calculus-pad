import { test } from '../fixtures/app.fixture';

test.describe('Scientific Visual', () => {
  test('empty state, light mode', async ({ calcPage }) => {
    await calcPage.goToTab('scientific');
    await calcPage.ensureLightMode();
    await calcPage.stableScreenshot('scientific-empty-light.png');
  });

  test('empty state, dark mode', async ({ calcPage }) => {
    await calcPage.goToTab('scientific');
    await calcPage.enableDarkMode();
    await calcPage.stableScreenshot('scientific-empty-dark.png');
  });

  test('populated state, light mode', async ({ calcPage, page }) => {
    await calcPage.goToTab('scientific');
    await calcPage.ensureLightMode();

    // Compute sin(pi/2) = 1
    await page.getByRole('button', { name: 'sin', exact: true }).click();
    await page.getByRole('button', { name: 'π' }).click();
    await page.getByRole('button', { name: '÷', exact: true }).click();
    await page.getByRole('button', { name: '2', exact: true }).click();
    await page.getByRole('button', { name: ')', exact: true }).click();
    await page.getByRole('button', { name: '=', exact: true }).click();

    await calcPage.stableScreenshot('scientific-populated-light.png');
  });

  test('populated state, dark mode', async ({ calcPage, page }) => {
    await calcPage.goToTab('scientific');
    await calcPage.enableDarkMode();

    // Compute sin(pi/2) = 1
    await page.getByRole('button', { name: 'sin', exact: true }).click();
    await page.getByRole('button', { name: 'π' }).click();
    await page.getByRole('button', { name: '÷', exact: true }).click();
    await page.getByRole('button', { name: '2', exact: true }).click();
    await page.getByRole('button', { name: ')', exact: true }).click();
    await page.getByRole('button', { name: '=', exact: true }).click();

    await calcPage.stableScreenshot('scientific-populated-dark.png');
  });
});
