import { expect, test } from '../fixtures/app.fixture';

test.describe('Statistics', () => {
  test.beforeEach(async ({ calcPage }) => {
    await calcPage.goToTab('statistics');
  });

  test('entering data shows value count and descriptive stats', async ({ page }) => {
    await page.getByLabel('Data values').fill('10, 20, 30, 40, 50');

    await expect(page.getByText('5 values loaded')).toBeVisible();
    await expect(page.getByText('Descriptive Statistics')).toBeVisible();
  });

  test('mean of 10,20,30,40,50 is 30.0000', async ({ page }) => {
    await page.getByLabel('Data values').fill('10, 20, 30, 40, 50');

    await expect(page.getByText('30.0000').first()).toBeVisible();
  });

  test('histogram is rendered with data', async ({ calcPage, page }) => {
    await page.getByLabel('Data values').fill('10, 20, 30, 40, 50');

    await calcPage.waitForPlotly();
    await expect(page.locator('.js-plotly-plot')).toBeVisible();
  });

  test('Clear All resets data', async ({ page }) => {
    await page.getByLabel('Data values').fill('10, 20, 30, 40, 50');
    await expect(page.getByText('5 values loaded')).toBeVisible();

    await page.getByRole('button', { name: 'Clear All' }).click();

    await expect(page.getByText('5 values loaded')).not.toBeVisible();
    await expect(page.getByText('Descriptive Statistics')).not.toBeVisible();
  });
});
