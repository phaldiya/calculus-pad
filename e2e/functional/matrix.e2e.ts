import { expect, test } from '../fixtures/app.fixture';

test.describe('Matrix', () => {
  test.beforeEach(async ({ calcPage }) => {
    await calcPage.goToTab('matrix');
  });

  test('determinant of [[1,2],[3,4]] = -2', async ({ page }) => {
    // Fill matrix A: row 1 col 1 = 1, row 1 col 2 = 2, row 2 col 1 = 3, row 2 col 2 = 4
    await page.getByLabel('Matrix A row 1 column 1').fill('1');
    await page.getByLabel('Matrix A row 1 column 2').fill('2');
    await page.getByLabel('Matrix A row 2 column 1').fill('3');
    await page.getByLabel('Matrix A row 2 column 2').fill('4');

    // Select det(A)
    await page.getByRole('button', { name: 'det(A)' }).click();

    // Compute
    await page.getByRole('button', { name: 'Compute' }).click();

    // Result should contain -2
    const result = page.getByRole('status');
    await expect(result).toContainText('-2');
  });

  test('matrix multiplication A×B produces result', async ({ page }) => {
    // Fill matrix A
    await page.getByLabel('Matrix A row 1 column 1').fill('1');
    await page.getByLabel('Matrix A row 1 column 2').fill('2');
    await page.getByLabel('Matrix A row 2 column 1').fill('3');
    await page.getByLabel('Matrix A row 2 column 2').fill('4');

    // Select A × B (shows matrix B input)
    await page.getByRole('button', { name: 'A × B' }).click();

    // Fill matrix B
    await page.getByLabel('Matrix B row 1 column 1').fill('5');
    await page.getByLabel('Matrix B row 1 column 2').fill('6');
    await page.getByLabel('Matrix B row 2 column 1').fill('7');
    await page.getByLabel('Matrix B row 2 column 2').fill('8');

    await page.getByRole('button', { name: 'Compute' }).click();

    // Result matrix should be rendered
    const result = page.getByRole('status');
    await expect(result).toBeVisible();
  });

  test('resizing to 3 rows shows 3-row grid', async ({ page }) => {
    await page.getByLabel('Matrix A rows').selectOption('3');

    // Should now have 3 rows × 2 cols = 6 inputs for matrix A
    const inputs = page.getByLabel(/Matrix A row 3/);
    await expect(inputs.first()).toBeVisible();
  });

  test('Show Steps button appears after computation', async ({ page }) => {
    await page.getByLabel('Matrix A row 1 column 1').fill('1');
    await page.getByLabel('Matrix A row 1 column 2').fill('2');
    await page.getByLabel('Matrix A row 2 column 1').fill('3');
    await page.getByLabel('Matrix A row 2 column 2').fill('4');

    await page.getByRole('button', { name: 'det(A)' }).click();
    await page.getByRole('button', { name: 'Compute' }).click();

    await expect(page.getByRole('button', { name: 'Show Steps' })).toBeVisible();
  });
});
