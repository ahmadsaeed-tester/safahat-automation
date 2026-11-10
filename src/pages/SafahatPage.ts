import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class SafahatPage extends BasePage {
  readonly searchInput: Locator;
  readonly bookCards: Locator;
  readonly readButton: Locator;
  readonly downloadButton: Locator;
  readonly pdfDownloadButton: Locator;

  constructor(page: Page) {
    super(page);
    this.searchInput = page.locator('input[type="search"], input[name="q"], input[placeholder*="بحث"]');
    this.bookCards = page.locator('article, .card, [class*="book"], a[href*="/book"]');
    this.readButton = page.locator('a:has-text("اقرأ"), button:has-text("اقرأ"), [aria-label*="قراءة"], a[href*="/read"]');
    this.downloadButton = page.locator('a:has-text("تحميل"), button:has-text("تحميل"), a[href*=".pdf"], a[href*="download"]');
    this.pdfDownloadButton = page.locator('a[href*=".pdf"], a:has-text("تحميل بهيئة PDF"), button:has-text("تحميل بهيئة PDF")');
  }

  async getBooksCount(): Promise<number> {
    return await this.bookCards.count();
  }

  async openFirstBook() {
    await this.bookCards.first().click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async clickReadBook() {
    await this.readButton.first().click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async downloadBook(): Promise<string> {
    return await this.handleDownload(async () => {
      await this.downloadButton.first().click();
    });
  }

  async downloadBookAsPdf(): Promise<string> {
    return await this.handleDownload(async () => {
      await this.pdfDownloadButton.first().click();
    });
  }
}
