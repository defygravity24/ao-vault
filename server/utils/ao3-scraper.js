import axios from 'axios';
import * as cheerio from 'cheerio';

class AO3Scraper {
  constructor() {
    this.baseUrl = 'https://archiveofourown.org';
    this.headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
      'Cache-Control': 'max-age=0'
    };
  }

  async fetchMetadata(url) {
    try {
      // Extract work ID from URL
      const workIdMatch = url.match(/works\/(\d+)/);
      if (!workIdMatch) {
        throw new Error('Invalid AO3 URL');
      }

      const workId = workIdMatch[1];
      const response = await axios.get(url, {
        headers: this.headers,
        timeout: 10000
      });

      const $ = cheerio.load(response.data);

      // Extract metadata
      const metadata = {
        externalId: workId,
        platform: 'ao3',
        url: url,
        title: $('h2.title').first().text().trim(),
        author: $('.byline a[rel="author"]').first().text().trim(),
        authorUrl: this.baseUrl + $('.byline a[rel="author"]').first().attr('href'),
        summary: $('.summary .userstuff').first().text().trim(),
        rating: $('dd.rating').text().trim(),
        warnings: this.extractList($, 'dd.warning'),
        categories: this.extractList($, 'dd.category'),
        fandoms: this.extractList($, 'dd.fandom'),
        relationships: this.extractList($, 'dd.relationship'),
        characters: this.extractList($, 'dd.character'),
        additionalTags: this.extractList($, 'dd.freeform'),
        language: $('dd.language').text().trim() || 'English',
        wordCount: this.parseNumber($('dd.words').text()),
        chapterCount: this.parseChapterCount($('dd.chapters').text()),
        complete: this.isComplete($('dd.chapters').text()),
        publishedDate: this.parseDate($('dd.published').text()),
        updatedDate: this.parseDate($('dd.status').text()) || this.parseDate($('dd.published').text()),
        kudos: this.parseNumber($('dd.kudos').text()),
        bookmarks: this.parseNumber($('dd.bookmarks').text()),
        hits: this.parseNumber($('dd.hits').text()),
        comments: this.parseNumber($('dd.comments').text())
      };

      // Check if work is part of a series
      const seriesLink = $('.series').first();
      if (seriesLink.length > 0) {
        metadata.series = {
          name: seriesLink.find('a').first().text().trim(),
          url: this.baseUrl + seriesLink.find('a').first().attr('href'),
          part: parseInt(seriesLink.find('.position').text().match(/\d+/)?.[0] || '1')
        };
      }

      return metadata;
    } catch (error) {
      console.error('Error fetching AO3 metadata:', error.message);
      throw new Error(`Failed to fetch metadata: ${error.message}`);
    }
  }

  extractList($, selector) {
    return $(selector)
      .find('a.tag')
      .map((i, el) => $(el).text().trim())
      .get()
      .join(', ');
  }

  parseNumber(text) {
    const num = parseInt(text.replace(/,/g, '').match(/\d+/)?.[0] || '0');
    return isNaN(num) ? 0 : num;
  }

  parseChapterCount(text) {
    const match = text.match(/(\d+)\/(\d+|\?)/);
    if (match) {
      return {
        current: parseInt(match[1]),
        total: match[2] === '?' ? null : parseInt(match[2])
      };
    }
    return { current: 1, total: 1 };
  }

  isComplete(text) {
    const match = text.match(/(\d+)\/(\d+|\?)/);
    if (match) {
      return match[2] !== '?' && match[1] === match[2];
    }
    return true;
  }

  parseDate(text) {
    if (!text) return null;
    const date = new Date(text.trim());
    return isNaN(date.getTime()) ? null : date.toISOString();
  }

  // Check if a work still exists
  async checkWorkStatus(url) {
    try {
      const response = await axios.head(url, {
        headers: this.headers,
        timeout: 5000
      });
      return response.status === 200 ? 'active' : 'lost';
    } catch (error) {
      if (error.response?.status === 404) {
        return 'deleted';
      }
      return 'unknown';
    }
  }

  // Get chapter list
  async getChapterList(url) {
    try {
      const response = await axios.get(url + '?view_full_work=true', {
        headers: this.headers,
        timeout: 10000
      });

      const $ = cheerio.load(response.data);
      const chapters = [];

      $('#chapters .chapter').each((i, chapter) => {
        const $chapter = $(chapter);
        chapters.push({
          number: i + 1,
          title: $chapter.find('.title').text().trim(),
          summary: $chapter.find('.summary').text().trim(),
          notes: $chapter.find('.notes').text().trim(),
          wordCount: this.parseNumber($chapter.find('.stats').text())
        });
      });

      return chapters;
    } catch (error) {
      console.error('Error fetching chapters:', error.message);
      return [];
    }
  }
}

export default new AO3Scraper();