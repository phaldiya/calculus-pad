import { test } from '../fixtures/app.fixture';

test.describe('Calculus Visual', () => {
  test('empty state, light mode', async ({ calcPage }) => {
    await calcPage.goToTab('calculus');
    await calcPage.ensureLightMode();
    await calcPage.stableScreenshot('calculus-empty-light.png');
  });

  test('empty state, dark mode', async ({ calcPage }) => {
    await calcPage.goToTab('calculus');
    await calcPage.enableDarkMode();
    await calcPage.stableScreenshot('calculus-empty-dark.png');
  });

  test('populated state, light mode', async ({ calcPage, page }) => {
    await calcPage.goToTab('calculus');
    await calcPage.ensureLightMode();

    // Compute derivative of x^3
    await page.getByLabel('Derivative expression').fill('x^3');
    await page.getByRole('button', { name: 'd/dx' }).click();

    await calcPage.stableScreenshot('calculus-populated-light.png');
  });

  test('populated state, dark mode', async ({ calcPage, page }) => {
    await calcPage.goToTab('calculus');
    await calcPage.enableDarkMode();

    await page.getByLabel('Derivative expression').fill('x^3');
    await page.getByRole('button', { name: 'd/dx' }).click();

    await calcPage.stableScreenshot('calculus-populated-dark.png');
  });
});
