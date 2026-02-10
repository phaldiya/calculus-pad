import { expect, test } from '../fixtures/app.fixture';

test.describe('Graphing', () => {
  test.beforeEach(async ({ calcPage }) => {
    await calcPage.goToTab('graphing');
  });

  test('plotting an equation adds it to the list and renders chart', async ({ calcPage, page }) => {
    const input = page.getByLabel('Function expression');
    await input.fill('sin(x)');
    await page.getByRole('button', { name: 'Plot', exact: true }).click();

    // Equation appears in list
    await expect(page.getByText('sin(x)').first()).toBeVisible();

    // Plotly chart rendered
    await calcPage.waitForPlotly();
    await expect(page.locator('.js-plotly-plot')).toBeVisible();
  });

  test('plotting multiple equations shows all in list', async ({ page }) => {
    const input = page.getByLabel('Function expression');

    await input.fill('sin(x)');
    await page.getByRole('button', { name: 'Plot', exact: true }).click();

    await input.fill('x^2');
    await page.getByRole('button', { name: 'Plot', exact: true }).click();

    await expect(page.getByText('sin(x)').first()).toBeVisible();
    await expect(page.getByText('x^2').first()).toBeVisible();
  });

  test('removing an equation clears the list', async ({ page }) => {
    const input = page.getByLabel('Function expression');
    await input.fill('sin(x)');
    await page.getByRole('button', { name: 'Plot', exact: true }).click();

    await page.getByLabel('Remove sin(x)').click();

    await expect(page.getByText('No equations yet')).toBeVisible();
  });

  test('toggling visibility switch flips aria-checked', async ({ page }) => {
    const input = page.getByLabel('Function expression');
    await input.fill('sin(x)');
    await page.getByRole('button', { name: 'Plot', exact: true }).click();

    const toggle = page.getByRole('switch', { name: /sin\(x\)/ });
    await expect(toggle).toHaveAttribute('aria-checked', 'true');

    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-checked', 'false');
  });
});
