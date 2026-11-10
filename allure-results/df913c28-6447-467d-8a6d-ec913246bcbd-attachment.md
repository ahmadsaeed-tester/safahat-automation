# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: safahat.spec.ts >> Safahat Automation Suite >> 2. Search for a book, open it, and verify readable chapter
- Location: tests\safahat.spec.ts:20:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('link', { name: 'الفيزياء الفلكية: مقدمة قصيرة جدًّا', exact: true })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByRole('link', { name: 'الفيزياء الفلكية: مقدمة قصيرة جدًّا', exact: true }) with timeout 5000ms
  - waiting for getByRole('link', { name: 'الفيزياء الفلكية: مقدمة قصيرة جدًّا', exact: true })

```

```yaml
- heading "Server Error in '/' Application." [level=1]:
  - text: Server Error in '/' Application.
  - separator
- heading "A potentially dangerous Request.Path value was detected from the client (:)." [level=2]
- text: "Description: An unhandled exception occurred during the execution of the current web request. Please review the stack trace for more information about the error and where it originated in the code. Exception Details: System.Web.HttpException: A potentially dangerous Request.Path value was detected from the client (:). Source Error:"
- table:
  - rowgroup:
    - row "An unhandled exception was generated during the execution of the current web request. Information regarding the origin and location of the exception can be identified using the exception stack trace below.":
      - cell "An unhandled exception was generated during the execution of the current web request. Information regarding the origin and location of the exception can be identified using the exception stack trace below.":
        - code: An unhandled exception was generated during the execution of the current web request. Information regarding the origin and location of the exception can be identified using the exception stack trace below.
- text: "Stack Trace:"
- table:
  - rowgroup:
    - 'row "[HttpException (0x80004005): A potentially dangerous Request.Path value was detected from the client (:).] System.Web.HttpRequest.ValidateInputIfRequiredByConfig() +11982692 System.Web.PipelineStepManager.ValidateHelper(HttpContext context) +52"':
      - 'cell "[HttpException (0x80004005): A potentially dangerous Request.Path value was detected from the client (:).] System.Web.HttpRequest.ValidateInputIfRequiredByConfig() +11982692 System.Web.PipelineStepManager.ValidateHelper(HttpContext context) +52"':
        - code: "[HttpException (0x80004005): A potentially dangerous Request.Path value was detected from the client (:).] System.Web.HttpRequest.ValidateInputIfRequiredByConfig() +11982692 System.Web.PipelineStepManager.ValidateHelper(HttpContext context) +52"
- separator
- text: "Version Information: Microsoft .NET Framework Version:4.0.30319; ASP.NET Version:4.7.3535.0"
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
  24 | 
  25 |     await safahat.navigateTo();
  26 |     await safahat.searchInput.fill(bookTitle);
  27 |     await safahat.searchInput.press('Enter');
  28 | 
  29 |     await expect(page).toHaveURL(/\/search\/keyword\//);
  30 |     const bookResult = page.getByRole('link', { name: bookTitle, exact: true });
> 31 |     await expect(bookResult).toBeVisible();
     |                              ^ Error: expect(locator).toBeVisible() failed
  32 |     await bookResult.click();
  33 | 
  34 |     await expect(page).toHaveURL(/\/books\/58169180\/$/);
  35 |     await expect(page.locator('main')).toContainText(bookTitle);
  36 | 
  37 |     const chapterLink = page.getByRole('link', { name: chapterTitle, exact: true });
  38 |     await expect(chapterLink).toBeVisible();
  39 |     await chapterLink.click();
  40 | 
  41 |     await expect(page).toHaveURL(/\/books\/58169180\/1\/$/);
  42 |     const readingContent = page.locator('main');
  43 |     await expect(readingContent).toContainText(chapterTitle);
  44 |     await expect(readingContent).toContainText('قبل نيوتن، كان علم الفلك قائمًا');
  45 |   });
  46 | });
  47 | 
```