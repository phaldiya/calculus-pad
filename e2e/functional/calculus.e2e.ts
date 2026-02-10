import { expect, test } from '../fixtures/app.fixture';

test.describe('Calculus', () => {
  test.beforeEach(async ({ calcPage }) => {
    await calcPage.goToTab('calculus');
  });

  test('derivative of x^3 contains 3 * x^2', async ({ page }) => {
    await page.getByLabel('Derivative expression').fill('x^3');
    await page.getByRole('button', { name: 'd/dx' }).click();

    const result = page.getByRole('status').first();
    await expect(result).toContainText('3');
  });

  test('definite integral of x^2 from 0 to 1 ≈ 0.333', async ({ page }) => {
    await page.getByLabel('Integral expression').fill('x^2');
    await page.getByLabel('Lower bound').fill('0');
    await page.getByLabel('Upper bound').fill('1');
    await page.getByRole('group', { name: 'Definite Integral' }).getByRole('button', { name: 'Compute' }).click();

    const result = page.getByRole('group', { name: 'Definite Integral' }).getByRole('status');
    await expect(result).toContainText('0.333');
  });

  test('limit of sin(x)/x as x→0 = 1', async ({ page }) => {
    await page.getByLabel('Limit expression').fill('sin(x)/x');
    await page.getByLabel('Limit point').fill('0');
    await page.getByRole('group', { name: 'Limit' }).getByRole('button', { name: 'Compute' }).click();

    const result = page.getByRole('group', { name: 'Limit' }).getByRole('status');
    await expect(result).toContainText('1');
  });

  test('Clear All resets all inputs', async ({ page }) => {
    await page.getByLabel('Derivative expression').fill('x^3');
    await page.getByRole('button', { name: 'd/dx' }).click();

    await page.getByRole('button', { name: 'Clear All' }).click();

    await expect(page.getByLabel('Derivative expression')).toHaveValue('');
  });
});
