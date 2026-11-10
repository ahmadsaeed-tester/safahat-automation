import { Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

export class BasePage {
  constructor(protected page: Page) {}

  async navigateTo(urlPath: string = 'https://www.safahat.org') {
    await this.page.goto(urlPath, { waitUntil: 'domcontentloaded' });
  }

  async scrollDown(times: number = 3, delayMs: number = 1000) {
    for (let i = 0; i < times; i++) {
      await this.page.evaluate(() => window.scrollBy(0, window.innerHeight));
      await this.page.waitForTimeout(delayMs);
    }
  }

  async handleDownload(triggerAction: () => Promise<void>, targetDir: string = './downloads'): Promise<string> {
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const [download] = await Promise.all([
      this.page.waitForEvent('download'),
      triggerAction(),
    ]);

    const destinationPath = path.join(targetDir, download.suggestedFilename());
    await download.saveAs(destinationPath);
    return destinationPath;
  }
}
