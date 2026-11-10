import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import { SafahatPage } from '../src/pages/SafahatPage';

test('Safahat end-to-end catalog, search, reading, and download flows', async ({ page }) => {
  const safahat = new SafahatPage(page);
  const securityVerification = page.getByRole('heading', {
    name: 'Performing security verification',
  });
  const blockedFlows: string[] = [];

  const canContinue = async (flowName: string, expectedContent: ReturnType<typeof page.locator>) => {
    await expect(securityVerification.or(expectedContent)).toBeVisible();
    if (await securityVerification.isVisible()) {
      blockedFlows.push(flowName);
      console.warn(`${flowName} blocked by the site's security verification page.`);
      return false;
    }

    return true;
  };

  await test.step('Browse the catalog', async () => {
    await safahat.navigateTo();
    if (await canContinue('Catalog browsing', safahat.bookCards.first())) {
      expect(await safahat.getBooksCount()).toBeGreaterThan(0);
    }
  });

  await test.step('Search for a book and read a chapter online', async () => {
    const bookTitle = 'الفيزياء الفلكية: مقدمة قصيرة جدًّا';
    const chapterTitle = 'الأفكار الكبرى';

    await safahat.navigateTo();
    if (!(await canContinue('Book search', safahat.searchInput))) return;
    await safahat.searchInput.fill('الفيزياء الفلكية');
    await safahat.searchInput.press('Enter');

    const bookResult = page.getByRole('link', { name: bookTitle, exact: true });
    if (!(await canContinue('Book search', bookResult))) return;
    await expect(page).toHaveURL(/\/search\/keyword\//);
    await bookResult.click();

    const bookTitleOnPage = page.getByText(bookTitle, { exact: true }).first();
    if (!(await canContinue('Online book reading', bookTitleOnPage))) return;
    await expect(page).toHaveURL(/\/books\/58169180\/$/);

    const chapterLink = page.getByRole('link', { name: chapterTitle, exact: true });
    await expect(chapterLink).toBeVisible();
    await chapterLink.click();

    const readableChapter = page.getByText('قبل نيوتن، كان علم الفلك قائمًا');
    if (!(await canContinue('Online chapter reading', readableChapter))) return;
    await expect(page).toHaveURL(/\/books\/58169180\/1\/$/);
    await expect(page.locator('main')).toContainText(chapterTitle);
    await expect(readableChapter).toBeVisible();
  });

  await test.step('Search for الدنيا في باريس and download its PDF', async () => {
    const bookTitle = 'الدنيا في باريس';

    await safahat.navigateTo();
    if (!(await canContinue('PDF book search', safahat.searchInput))) return;
    await safahat.searchInput.fill(bookTitle);
    await safahat.searchInput.press('Enter');

    const bookResult = page.getByRole('link', { name: bookTitle, exact: true });
    if (!(await canContinue('PDF book search', bookResult))) return;
    await expect(page).toHaveURL(/\/search\/keyword\//);
    await bookResult.click();

    const bookTitleOnPage = page.getByText(bookTitle, { exact: true }).first();
    if (!(await canContinue('PDF book page', bookTitleOnPage))) return;
    await expect(page).toHaveURL(/\/books\/59640846\/$/);

    const pdfDownloadLink = page.getByRole('link', { name: 'تحميل بهيئة PDF' });
    await expect(pdfDownloadLink).toBeVisible();
    const downloadedPath = await safahat.downloadBookAsPdf();

    expect(downloadedPath).toMatch(/\.pdf$/i);
    expect(fs.statSync(downloadedPath).size).toBeGreaterThan(0);
    expect(fs.readFileSync(downloadedPath).subarray(0, 5).toString('ascii')).toBe('%PDF-');
  });

  await test.step('Filter books by author and read a book online', async () => {
    const bookTitle = 'الفيزياء الفلكية: مقدمة قصيرة جدًّا';
    const authorName = 'جيمس بيني';
    const chapterTitle = 'الأفكار الكبرى';

    await safahat.navigateTo();
    if (!(await canContinue('Author-filter search', safahat.searchInput))) return;
    await safahat.searchInput.fill('الفيزياء الفلكية');
    await safahat.searchInput.press('Enter');

    const authorFilter = page.getByRole('textbox', { name: 'اسم الكاتب:' });
    if (!(await canContinue('Author-filter search', authorFilter))) return;
    await authorFilter.fill(authorName);
    await page.getByRole('button', { name: 'ابحث', exact: true }).click();

    const bookResult = page.getByRole('link', { name: bookTitle, exact: true });
    if (!(await canContinue('Author-filter results', bookResult))) return;
    await expect(bookResult).toBeVisible();
    await expect(page.getByRole('link', { name: authorName, exact: true })).toBeVisible();
    await bookResult.click();

    const bookTitleOnPage = page.getByText(bookTitle, { exact: true }).first();
    if (!(await canContinue('Author-filter online reading', bookTitleOnPage))) return;
    await expect(page).toHaveURL(/\/books\/58169180\/$/);

    const chapterLink = page.getByRole('link', { name: chapterTitle, exact: true });
    await expect(chapterLink).toBeVisible();
    await chapterLink.click();

    const readableChapter = page.getByText('قبل نيوتن، كان علم الفلك قائمًا');
    if (!(await canContinue('Author-filter chapter reading', readableChapter))) return;
    await expect(page).toHaveURL(/\/books\/58169180\/1\/$/);
    await expect(page.locator('main')).toContainText(chapterTitle);
    await expect(readableChapter).toBeVisible();
  });

  test.skip(
    blockedFlows.length > 0,
    `The site blocked these flows with a security verification page: ${blockedFlows.join(', ')}`,
  );
});
