import puppeteer from 'puppeteer';

class AO3PuppeteerScraper {
  constructor() {
    this.baseUrl = 'https://archiveofourown.org';
  }

  async fetchMetadata(url) {
    let browser;
    try {
      // Extract work ID from URL
      const workIdMatch = url.match(/works\/(\d+)/);
      if (!workIdMatch) {
        throw new Error('Invalid AO3 URL');
      }

      const workId = workIdMatch[1];

      // Launch browser
      browser = await puppeteer.launch({
        headless: 'new',
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu'
        ]
      });

      const page = await browser.newPage();

      // Set user agent to appear as a real browser
      await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

      // Navigate to the page
      await page.goto(url, {
        waitUntil: 'networkidle2',
        timeout: 30000
      });

      // Wait for the main content to load
      await page.waitForSelector('h2.title', { timeout: 10000 });

      // Extract metadata
      const metadata = await page.evaluate(() => {
        const getText = (selector) => {
          const el = document.querySelector(selector);
          return el ? el.textContent.trim() : '';
        };

        const getList = (selector) => {
          const elements = document.querySelectorAll(selector + ' a.tag');
          return Array.from(elements).map(el => el.textContent.trim()).join(', ');
        };

        const parseNumber = (text) => {
          const num = parseInt(text.replace(/,/g, '').match(/\d+/)?.[0] || '0');
          return isNaN(num) ? 0 : num;
        };

        // Get title
        const title = getText('h2.title');

        // Get author
        const authorEl = document.querySelector('.byline a[rel="author"]');
        const author = authorEl ? authorEl.textContent.trim() : 'Anonymous';
        const authorUrl = authorEl ? authorEl.href : '';

        // Get summary
        const summary = getText('.summary .userstuff');

        // Get stats
        const rating = getText('dd.rating');
        const warnings = getList('dd.warning');
        const categories = getList('dd.category');
        const fandoms = getList('dd.fandom');
        const relationships = getList('dd.relationship');
        const characters = getList('dd.character');
        const additionalTags = getList('dd.freeform');
        const language = getText('dd.language') || 'English';

        // Get counts
        const wordCount = parseNumber(getText('dd.words'));
        const kudos = parseNumber(getText('dd.kudos'));
        const bookmarks = parseNumber(getText('dd.bookmarks'));
        const hits = parseNumber(getText('dd.hits'));
        const comments = parseNumber(getText('dd.comments'));

        // Get chapter info
        const chapterText = getText('dd.chapters');
        const chapterMatch = chapterText.match(/(\d+)\/(\d+|\?)/);
        let chapterCount = 1;
        let complete = false;

        if (chapterMatch) {
          chapterCount = parseInt(chapterMatch[1]);
          complete = chapterMatch[2] !== '?' && chapterMatch[1] === chapterMatch[2];
        }

        return {
          title,
          author,
          authorUrl,
          summary,
          rating,
          warnings,
          categories,
          fandoms,
          relationships,
          characters,
          additionalTags,
          language,
          wordCount,
          chapterCount,
          complete,
          kudos,
          bookmarks,
          hits,
          comments
        };
      });

      await browser.close();

      // Add additional fields
      return {
        externalId: workId,
        platform: 'ao3',
        url: url,
        ...metadata,
        status: 'active'
      };

    } catch (error) {
      if (browser) {
        await browser.close();
      }
      console.error('Puppeteer scraping error:', error.message);
      throw new Error(`Failed to fetch metadata: ${error.message}`);
    }
  }
}

export default new AO3PuppeteerScraper();