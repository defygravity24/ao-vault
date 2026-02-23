import express from 'express';
import jwt from 'jsonwebtoken';
import ao3Downloader from '../utils/ao3-downloader.js';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

/**
 * GET /api/downloads/formats
 * Get available download formats
 */
router.get('/formats', (req, res) => {
  const formats = ao3Downloader.getAvailableFormats();
  res.json(formats);
});

/**
 * POST /api/downloads/download
 * Download a fanfiction from AO3 in specified format
 */
router.post('/download', authenticateToken, async (req, res) => {
  try {
    const { url, format = 'epub' } = req.body;
    const userId = req.user.id.toString();

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Extract work ID to check if already downloaded
    const workId = ao3Downloader.extractWorkId(url);
    if (!workId) {
      return res.status(400).json({ error: 'Invalid AO3 URL' });
    }

    // Check if already downloaded
    if (ao3Downloader.isDownloaded(workId, userId, format)) {
      const filepath = ao3Downloader.getDownloadPath(workId, userId, format);
      return res.json({
        success: true,
        message: 'Already downloaded',
        workId,
        format,
        filepath,
        alreadyDownloaded: true
      });
    }

    // Download the work
    const result = await ao3Downloader.downloadWork(url, format, userId);

    res.json({
      success: true,
      message: `Downloaded successfully as ${format.toUpperCase()}`,
      ...result
    });

  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({
      error: error.message || 'Failed to download fanfiction'
    });
  }
});

/**
 * GET /api/downloads/list
 * List all downloads for the authenticated user
 */
router.get('/list', authenticateToken, (req, res) => {
  try {
    const userId = req.user.id.toString();
    const downloads = ao3Downloader.listDownloads(userId);

    res.json({
      success: true,
      downloads,
      count: downloads.length
    });

  } catch (error) {
    console.error('List downloads error:', error);
    res.status(500).json({
      error: 'Failed to list downloads'
    });
  }
});

/**
 * GET /api/downloads/check/:workId
 * Check if a work is downloaded
 */
router.get('/check/:workId', authenticateToken, (req, res) => {
  try {
    const { workId } = req.params;
    const { format = 'epub' } = req.query;
    const userId = req.user.id.toString();

    const isDownloaded = ao3Downloader.isDownloaded(workId, userId, format);
    const downloadPath = isDownloaded
      ? ao3Downloader.getDownloadPath(workId, userId, format)
      : null;

    res.json({
      workId,
      format,
      isDownloaded,
      downloadPath
    });

  } catch (error) {
    console.error('Check download error:', error);
    res.status(500).json({
      error: 'Failed to check download status'
    });
  }
});

/**
 * GET /api/downloads/read/:workId
 * Stream a downloaded file for reading
 */
router.get('/read/:workId', authenticateToken, (req, res) => {
  try {
    const { workId } = req.params;
    const { format = 'epub' } = req.query;
    const userId = req.user.id.toString();

    const filepath = ao3Downloader.getDownloadPath(workId, userId, format);

    if (!filepath || !fs.existsSync(filepath)) {
      return res.status(404).json({ error: 'Download not found' });
    }

    // Set appropriate headers based on format
    const contentTypes = {
      epub: 'application/epub+zip',
      pdf: 'application/pdf',
      mobi: 'application/x-mobipocket-ebook',
      azw3: 'application/vnd.amazon.ebook',
      html: 'text/html'
    };

    res.setHeader('Content-Type', contentTypes[format] || 'application/octet-stream');
    res.setHeader('Content-Disposition', `inline; filename="${path.basename(filepath)}"`);

    // Stream the file
    const fileStream = fs.createReadStream(filepath);
    fileStream.pipe(res);

  } catch (error) {
    console.error('Read download error:', error);
    res.status(500).json({
      error: 'Failed to read downloaded file'
    });
  }
});

/**
 * DELETE /api/downloads/:workId
 * Delete a downloaded file
 */
router.delete('/:workId', authenticateToken, (req, res) => {
  try {
    const { workId } = req.params;
    const { format = 'epub' } = req.query;
    const userId = req.user.id.toString();

    const deleted = ao3Downloader.deleteDownload(workId, userId, format);

    if (deleted) {
      res.json({
        success: true,
        message: 'Download deleted successfully'
      });
    } else {
      res.status(404).json({
        error: 'Download not found'
      });
    }

  } catch (error) {
    console.error('Delete download error:', error);
    res.status(500).json({
      error: 'Failed to delete download'
    });
  }
});

export default router;