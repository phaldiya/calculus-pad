import { test } from '../fixtures/app.fixture';

test.describe('Matrix Visual', () => {
  test('empty state, light mode', async ({ calcPage }) => {
    await calcPage.goToTab('matrix');
    await calcPage.ensureLightMode();
    await calcPage.stableScreenshot('matrix-empty-light.png');
  });

  test('empty state, dark mode', async ({ calcPage }) => {
    await calcPage.goToTab('matrix');
    await calcPage.enableDarkMode();
    await calcPage.stableScreenshot('matrix-empty-dark.png');
  });

  test('populated state, light mode', async ({ calcPage, page }) => {
    await calcPage.goToTab('matrix');
    await calcPage.ensureLightMode();

    // Fill A = [[1,2],[3,4]] and compute det(A)
    await page.getByLabel('Matrix A row 1 column 1').fill('1');
    await page.getByLabel('Matrix A row 1 column 2').fill('2');
    await page.getByLabel('Matrix A row 2 column 1').fill('3');
    await page.getByLabel('Matrix A row 2 column 2').fill('4');

    await page.getByRole('button', { name: 'det(A)' }).click();
    await page.getByRole('button', { name: 'Compute' }).click();

    await calcPage.stableScreenshot('matrix-populated-light.png');
  });

  test('populated state, dark mode', async ({ calcPage, page }) => {
    await calcPage.goToTab('matrix');
    await calcPage.enableDarkMode();

    await page.getByLabel('Matrix A row 1 column 1').fill('1');
    await page.getByLabel('Matrix A row 1 column 2').fill('2');
    await page.getByLabel('Matrix A row 2 column 1').fill('3');
    await page.getByLabel('Matrix A row 2 column 2').fill('4');

    await page.getByRole('button', { name: 'det(A)' }).click();
    await page.getByRole('button', { name: 'Compute' }).click();

    await calcPage.stableScreenshot('matrix-populated-dark.png');
  });
});
