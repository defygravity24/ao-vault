import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * AO3 Download Service - Respectful and Legal Implementation
 * This uses AO3's official download endpoints which they provide for offline reading
 */

class AO3Downloader {
  constructor() {
    // Respect rate limiting - wait at least 1 second between requests
    this.lastRequestTime = 0;
    this.minRequestInterval = 1000; // 1 second

    // User agent to identify our app
    this.headers = {
      'User-Agent': 'AO-Vault/1.0 (Personal Library Manager; +https://github.com/yourusername/ao-vault)'
    };

    // Download directory
    this.downloadDir = path.join(__dirname, '../../downloads');
    if (!fs.existsSync(this.downloadDir)) {
      fs.mkdirSync(this.downloadDir, { recursive: true });
    }
  }

  /**
   * Extract work ID from AO3 URL
   */
  extractWorkId(url) {
    const match = url.match(/works\/(\d+)/);
    return match ? match[1] : null;
  }

  /**
   * Rate limiting helper
   */
  async respectRateLimit() {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;

    if (timeSinceLastRequest < this.minRequestInterval) {
      const waitTime = this.minRequestInterval - timeSinceLastRequest;
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }

    this.lastRequestTime = Date.now();
  }

  /**
   * Download a work in specified format using AO3's official download URLs
   * Formats: epub, pdf, mobi, azw3, html
   */
  async downloadWork(url, format = 'epub', userId) {
    try {
      await this.respectRateLimit();

      const workId = this.extractWorkId(url);
      if (!workId) {
        throw new Error('Invalid AO3 URL');
      }

      // First, get the work page to extract the title for filename
      const workPageUrl = `https://archiveofourown.org/works/${workId}`;
      const pageResponse = await axios.get(workPageUrl, {
        headers: this.headers,
        timeout: 30000
      });

      // Extract title from the page (used in download URL)
      const titleMatch = pageResponse.data.match(/<h2[^>]*class="title[^"]*"[^>]*>([^<]+)<\/h2>/);
      const title = titleMatch ? titleMatch[1].trim() : `work_${workId}`;

      // Clean title for URL (AO3's format)
      const urlTitle = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '_')      // Replace spaces with underscores
        .substring(0, 50);         // Limit length

      // Construct official AO3 download URL
      // Format: https://archiveofourown.org/downloads/[work_id]/[url_title].[format]
      const downloadUrl = `https://archiveofourown.org/downloads/${workId}/${urlTitle}.${format}`;

      console.log(`Downloading from official AO3 URL: ${downloadUrl}`);

      // Download the file
      const response = await axios({
        method: 'GET',
        url: downloadUrl,
        responseType: 'stream',
        headers: this.headers,
        timeout: 60000 // 60 seconds for download
      });

      // Create user-specific directory
      const userDir = path.join(this.downloadDir, userId);
      if (!fs.existsSync(userDir)) {
        fs.mkdirSync(userDir, { recursive: true });
      }

      // Save file with work ID and format
      const filename = `${workId}_${urlTitle}.${format}`;
      const filepath = path.join(userDir, filename);

      const writer = fs.createWriteStream(filepath);
      response.data.pipe(writer);

      return new Promise((resolve, reject) => {
        writer.on('finish', () => {
          console.log(`Downloaded successfully: ${filename}`);
          resolve({
            success: true,
            workId,
            title,
            format,
            filename,
            filepath,
            size: fs.statSync(filepath).size
          });
        });

        writer.on('error', (error) => {
          console.error('Download error:', error);
          reject(error);
        });
      });

    } catch (error) {
      console.error('Download failed:', error.message);

      // If download fails, return helpful error
      if (error.response?.status === 404) {
        throw new Error('Work not found or may be restricted. Try logging into AO3 first.');
      } else if (error.response?.status === 429) {
        throw new Error('Rate limited by AO3. Please wait a moment and try again.');
      } else {
        throw error;
      }
    }
  }

  /**
   * Get available download formats for a work
   */
  getAvailableFormats() {
    return [
      {
        format: 'epub',
        name: 'EPUB',
        description: 'Best for e-readers and phones. Preserves formatting and images.'
      },
      {
        format: 'pdf',
        name: 'PDF',
        description: 'Universal format. Good for printing or reading on any device.'
      },
      {
        format: 'mobi',
        name: 'MOBI',
        description: 'For older Kindle devices.'
      },
      {
        format: 'azw3',
        name: 'AZW3',
        description: 'For newer Kindle devices. Better formatting than MOBI.'
      },
      {
        format: 'html',
        name: 'HTML',
        description: 'Preserves AO3 styling. Can be opened in any browser.'
      }
    ];
  }

  /**
   * Check if a work is already downloaded
   */
  isDownloaded(workId, userId, format = 'epub') {
    const userDir = path.join(this.downloadDir, userId);
    const files = fs.existsSync(userDir) ? fs.readdirSync(userDir) : [];

    return files.some(file =>
      file.startsWith(`${workId}_`) && file.endsWith(`.${format}`)
    );
  }

  /**
   * Get path to downloaded file
   */
  getDownloadPath(workId, userId, format = 'epub') {
    const userDir = path.join(this.downloadDir, userId);
    if (!fs.existsSync(userDir)) return null;

    const files = fs.readdirSync(userDir);
    const file = files.find(f =>
      f.startsWith(`${workId}_`) && f.endsWith(`.${format}`)
    );

    return file ? path.join(userDir, file) : null;
  }

  /**
   * List all downloaded works for a user
   */
  listDownloads(userId) {
    const userDir = path.join(this.downloadDir, userId);
    if (!fs.existsSync(userDir)) return [];

    const files = fs.readdirSync(userDir);
    return files.map(file => {
      const stats = fs.statSync(path.join(userDir, file));
      const match = file.match(/^(\d+)_(.+)\.(\w+)$/);

      return {
        filename: file,
        workId: match ? match[1] : null,
        title: match ? match[2].replace(/_/g, ' ') : file,
        format: match ? match[3] : null,
        size: stats.size,
        downloadedAt: stats.birthtime
      };
    });
  }

  /**
   * Delete a downloaded file
   */
  deleteDownload(workId, userId, format = 'epub') {
    const filepath = this.getDownloadPath(workId, userId, format);
    if (filepath && fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
      return true;
    }
    return false;
  }
}

export default new AO3Downloader();