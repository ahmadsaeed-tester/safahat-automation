# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: safahat.spec.ts >> Safahat Automation Suite >> 2. Search for a book, open it, and verify readable chapter
- Location: tests\safahat.spec.ts:20:7

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('main')
Expected substring: "الفيزياء الفلكية: مقدمة قصيرة جدًّا"
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toContainText" locator('main') with timeout 5000ms
  - waiting for locator('main')

```

```yaml
- main:
  - img "Icon for www.safahat.org"
  - heading "www.safahat.org" [level=1]
  - heading "Performing security verification" [level=2]
  - paragraph: This website uses a security service to protect against malicious bots. This page is displayed while the website verifies you are not a bot.
- contentinfo:
  - text: "Ray ID:"
  - code: a55b1a54fbe3d4d4
  - text: Performance and Security by
  - link "Cloudflare, opens in a new tab":
    - /url: https://www.cloudflare.com?utm_source=challenge&utm_campaign=m
    - text: Cloudflare
  - link "Privacy, opens in a new tab":
    - /url: https://www.cloudflare.com/privacypolicy/
    - text: Privacy
```

# Test source

```ts
  1  | ﻿import { test, expect } from '@playwright/test';
  2  | import { SafahatPage } from '../src/pages/SafahatPage';
  3  | 
  4  | test.describe('Safahat Automation Suite', () => {
  5  |   test('1. Navigate, browse, and scroll catalog', async ({ page }) => {
  6  |     const safahat = new SafahatPage(page);
  7  | 
  8  |     console.log('Navigating to Safahat.org...');
  9  |     await safahat.navigateTo('https://www.safahat.org');
  10 |     await expect(page).toHaveURL(/safahat\.org/);
  11 | 
  12 |     console.log('Scrolling catalog to trigger dynamic content...');
  13 |     await safahat.scrollDown(3, 1200);
  14 | 
  15 |     const initialCount = await safahat.getBooksCount();
  16 |     console.log(`Visible books detected: ${initialCount}`);
  17 |     expect(initialCount).toBeGreaterThan(0);
  18 |   });
  19 | 
  20 |   test('2. Search for a book, open it, and verify readable chapter', async ({ page }) => {
  21 |     const safahat = new SafahatPage(page);
  22 |     const bookTitle = 'الفيزياء الفلكية: مقدمة قصيرة جدًّا';
  23 |     const chapterTitle = 'الأفكار الكبرى';
  24 |     const searchTerm = 'الفيزياء الفلكية';
  25 | 
  26 |     await safahat.navigateTo();
  27 |     await safahat.searchInput.fill(searchTerm);
  28 |     await safahat.searchInput.press('Enter');
  29 | 
  30 |     await expect(page).toHaveURL(/\/search\/keyword\//);
  31 |     const bookResult = page.getByRole('link', { name: bookTitle, exact: true });
  32 |     await expect(bookResult).toBeVisible();
  33 |     await bookResult.click();
  34 | 
  35 |     const securityVerification = page.getByRole('heading', {
  36 |       name: 'Performing security verification',
  37 |     });
  38 |     if (await securityVerification.isVisible()) {
  39 |       test.skip(true, 'The site blocked automated access with a security verification page.');
  40 |     } else {
  41 |       await expect(page).toHaveURL(/\/books\/58169180\/$/);
> 42 |       await expect(page.locator('main')).toContainText(bookTitle);
     |                                          ^ Error: expect(locator).toContainText(expected) failed
  43 | 
  44 |       const chapterLink = page.getByRole('link', { name: chapterTitle, exact: true });
  45 |       await expect(chapterLink).toBeVisible();
  46 |       await chapterLink.click();
  47 | 
  48 |       await expect(page).toHaveURL(/\/books\/58169180\/1\/$/);
  49 |       const readingContent = page.locator('main');
  50 |       await expect(readingContent).toContainText(chapterTitle);
  51 |       await expect(readingContent).toContainText('قبل نيوتن، كان علم الفلك قائمًا');
  52 |     }
  53 |   });
  54 | });
  55 | 
```