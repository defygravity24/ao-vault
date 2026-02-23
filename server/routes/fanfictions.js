import express from 'express';
import db from '../database/index.js';
import { authenticateUser } from '../middleware/auth.js';
import ao3Scraper from '../utils/ao3-puppeteer.js';

const router = express.Router();

// Get user's fanfictions
router.get('/', authenticateUser, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      platform,
      status,
      search,
      sortBy = 'saved_date',
      order = 'DESC'
    } = req.query;

    const offset = (page - 1) * limit;
    let query = 'SELECT * FROM fanfictions WHERE user_id = ?';
    const params = [req.userId];

    // Add filters
    if (platform) {
      query += ' AND platform = ?';
      params.push(platform);
    }

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    if (search) {
      query += ' AND (title LIKE ? OR author LIKE ? OR summary LIKE ?)';
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern);
    }

    // Add sorting
    const validSorts = ['saved_date', 'title', 'author', 'word_count', 'updated_date'];
    const sortField = validSorts.includes(sortBy) ? sortBy : 'saved_date';
    const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    query += ` ORDER BY ${sortField} ${sortOrder}`;

    // Add pagination
    query += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const fanfictions = await db.all(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM fanfictions WHERE user_id = ?';
    const countParams = [req.userId];

    if (platform) {
      countQuery += ' AND platform = ?';
      countParams.push(platform);
    }

    if (status) {
      countQuery += ' AND status = ?';
      countParams.push(status);
    }

    if (search) {
      countQuery += ' AND (title LIKE ? OR author LIKE ? OR summary LIKE ?)';
      const searchPattern = `%${search}%`;
      countParams.push(searchPattern, searchPattern, searchPattern);
    }

    const { total } = await db.get(countQuery, countParams);

    // Get bookmark data for each fanfiction
    const fanfictionsWithBookmarks = await Promise.all(
      fanfictions.map(async (fic) => {
        const bookmark = await db.get(
          'SELECT * FROM bookmarks WHERE user_id = ? AND fanfiction_id = ?',
          [req.userId, fic.id]
        );

        // Get tags
        const tags = await db.all(
          `SELECT t.* FROM tags t
           JOIN fanfiction_tags ft ON t.id = ft.tag_id
           WHERE ft.fanfiction_id = ?`,
          [fic.id]
        );

        // Get folders
        const folders = await db.all(
          `SELECT f.id, f.name, f.color FROM folders f
           JOIN fanfiction_folders ff ON f.id = ff.folder_id
           WHERE ff.fanfiction_id = ?`,
          [fic.id]
        );

        return {
          ...fic,
          bookmark,
          tags,
          folders,
          metadata: JSON.parse(fic.metadata || '{}')
        };
      })
    );

    res.json({
      fanfictions: fanfictionsWithBookmarks,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching fanfictions:', error);
    res.status(500).json({ error: 'Failed to fetch fanfictions' });
  }
});

// Save a new fanfiction
router.post('/', authenticateUser, async (req, res) => {
  try {
    const {
      url,
      folderId,
      tags,
      title,
      author,
      summary,
      relationships,
      fandoms,
      rating
    } = req.body;

    if (!url && !title) {
      return res.status(400).json({ error: 'URL or title is required' });
    }

    // Check if already saved
    const existing = await db.get(
      'SELECT id FROM fanfictions WHERE user_id = ? AND url = ?',
      [req.userId, url]
    );

    if (existing) {
      return res.status(400).json({
        error: 'This fanfiction is already in your library',
        fanfictionId: existing.id
      });
    }

    // Fetch metadata from AO3 or use manual data
    let metadata;
    if (url && url.includes('archiveofourown.org') && !url.includes('/manual/')) {
      try {
        metadata = await ao3Scraper.fetchMetadata(url);
      } catch (error) {
        console.error('Scraping error:', error);
        // Fall back to manual data
        metadata = null;
      }
    }

    // Use manual data if provided or scraping failed
    if (!metadata) {
      const workIdMatch = url ? url.match(/works\/(\d+)/) : null;
      const workId = workIdMatch ? workIdMatch[1] : Date.now().toString();

        // For the specific fic mentioned, let's add some fallback data
        metadata = {
          externalId: workId,
          platform: 'ao3',
          url,
          title: req.body.title || `AO3 Work #${workId}`,
          author: req.body.author || 'AO3 Author',
          summary: req.body.summary || 'This story was saved from Archive of Our Own. Due to connection issues, the full metadata could not be retrieved. You can update these details by editing the bookmark.',
          rating: req.body.rating || 'Not Rated',
          fandoms: req.body.fandoms || 'Fandom',
          relationships: req.body.relationships || '',
          characters: req.body.characters || '',
          additionalTags: req.body.tags || '',
          language: 'English',
          wordCount: 0,
          chapterCount: 1,
          complete: false,
          status: 'active'
        };
    }

    // Start transaction
    const result = await db.transaction(async () => {
      // Insert fanfiction
      const ficResult = await db.run(
        `INSERT INTO fanfictions (
          user_id, external_id, platform, url, title, author, author_url,
          summary, rating, warnings, categories, fandoms, relationships,
          characters, additional_tags, language, word_count, chapter_count,
          complete, published_date, updated_date, metadata
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          req.userId,
          metadata.externalId,
          metadata.platform,
          metadata.url,
          metadata.title,
          metadata.author,
          metadata.authorUrl,
          metadata.summary,
          metadata.rating,
          metadata.warnings,
          metadata.categories,
          metadata.fandoms,
          metadata.relationships,
          metadata.characters,
          metadata.additionalTags,
          metadata.language,
          metadata.wordCount,
          metadata.chapterCount?.current || 1,
          metadata.complete ? 1 : 0,
          metadata.publishedDate,
          metadata.updatedDate,
          JSON.stringify(metadata)
        ]
      );

      const fanfictionId = ficResult.id;

      // Create bookmark
      await db.run(
        `INSERT INTO bookmarks (user_id, fanfiction_id, reading_status)
         VALUES (?, ?, 'to-read')`,
        [req.userId, fanfictionId]
      );

      // Add to folder if specified
      if (folderId) {
        await db.run(
          'INSERT INTO fanfiction_folders (fanfiction_id, folder_id) VALUES (?, ?)',
          [fanfictionId, folderId]
        );
      }

      // Add tags if specified
      if (tags && Array.isArray(tags)) {
        for (const tagName of tags) {
          // Get or create tag
          let tag = await db.get(
            'SELECT id FROM tags WHERE user_id = ? AND name = ?',
            [req.userId, tagName]
          );

          if (!tag) {
            const tagResult = await db.run(
              'INSERT INTO tags (user_id, name) VALUES (?, ?)',
              [req.userId, tagName]
            );
            tag = { id: tagResult.id };
          }

          // Link tag to fanfiction
          await db.run(
            'INSERT INTO fanfiction_tags (fanfiction_id, tag_id) VALUES (?, ?)',
            [fanfictionId, tag.id]
          );

          // Update usage count
          await db.run(
            'UPDATE tags SET usage_count = usage_count + 1 WHERE id = ?',
            [tag.id]
          );
        }
      }

      // Log activity
      await db.run(
        `INSERT INTO activity_log (user_id, action, entity_type, entity_id, metadata)
         VALUES (?, 'saved', 'fanfiction', ?, ?)`,
        [req.userId, fanfictionId, JSON.stringify({ title: metadata.title })]
      );

      return fanfictionId;
    });

    res.status(201).json({
      message: 'Fanfiction saved successfully',
      fanfictionId: result,
      metadata
    });
  } catch (error) {
    console.error('Error saving fanfiction:', error);
    res.status(500).json({ error: 'Failed to save fanfiction' });
  }
});

// Update bookmark data
router.patch('/:id/bookmark', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      rating,
      notes,
      privateNotes,
      currentChapter,
      readingStatus,
      priority
    } = req.body;

    // Check if fanfiction belongs to user
    const fanfiction = await db.get(
      'SELECT id FROM fanfictions WHERE id = ? AND user_id = ?',
      [id, req.userId]
    );

    if (!fanfiction) {
      return res.status(404).json({ error: 'Fanfiction not found' });
    }

    // Update bookmark
    const updates = [];
    const values = [];

    if (rating !== undefined) {
      updates.push('rating = ?');
      values.push(rating);
    }

    if (notes !== undefined) {
      updates.push('notes = ?');
      values.push(notes);
    }

    if (privateNotes !== undefined) {
      updates.push('private_notes = ?');
      values.push(privateNotes);
    }

    if (currentChapter !== undefined) {
      updates.push('current_chapter = ?');
      values.push(currentChapter);
    }

    if (readingStatus !== undefined) {
      updates.push('reading_status = ?');
      values.push(readingStatus);

      if (readingStatus === 'reading') {
        updates.push('last_read = CURRENT_TIMESTAMP');
      }
    }

    if (priority !== undefined) {
      updates.push('priority = ?');
      values.push(priority);
    }

    if (updates.length > 0) {
      updates.push('updated_at = CURRENT_TIMESTAMP');
      values.push(req.userId, id);

      await db.run(
        `UPDATE bookmarks SET ${updates.join(', ')}
         WHERE user_id = ? AND fanfiction_id = ?`,
        values
      );
    }

    res.json({ message: 'Bookmark updated successfully' });
  } catch (error) {
    console.error('Error updating bookmark:', error);
    res.status(500).json({ error: 'Failed to update bookmark' });
  }
});

// Delete fanfiction
router.delete('/:id', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;

    // Check ownership
    const fanfiction = await db.get(
      'SELECT title FROM fanfictions WHERE id = ? AND user_id = ?',
      [id, req.userId]
    );

    if (!fanfiction) {
      return res.status(404).json({ error: 'Fanfiction not found' });
    }

    // Delete fanfiction (cascade will handle related records)
    await db.run(
      'DELETE FROM fanfictions WHERE id = ? AND user_id = ?',
      [id, req.userId]
    );

    // Log activity
    await db.run(
      `INSERT INTO activity_log (user_id, action, entity_type, entity_id, metadata)
       VALUES (?, 'deleted', 'fanfiction', ?, ?)`,
      [req.userId, id, JSON.stringify({ title: fanfiction.title })]
    );

    res.json({ message: 'Fanfiction deleted successfully' });
  } catch (error) {
    console.error('Error deleting fanfiction:', error);
    res.status(500).json({ error: 'Failed to delete fanfiction' });
  }
});

// Check for updates
router.post('/:id/check-update', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;

    const fanfiction = await db.get(
      'SELECT * FROM fanfictions WHERE id = ? AND user_id = ?',
      [id, req.userId]
    );

    if (!fanfiction) {
      return res.status(404).json({ error: 'Fanfiction not found' });
    }

    if (fanfiction.platform !== 'ao3') {
      return res.status(400).json({
        error: 'Update checking only supported for AO3'
      });
    }

    // Fetch latest metadata
    const metadata = await ao3Scraper.fetchMetadata(fanfiction.url);

    // Check for changes
    const hasUpdates =
      metadata.wordCount > fanfiction.word_count ||
      metadata.chapterCount?.current > fanfiction.chapter_count ||
      metadata.complete !== Boolean(fanfiction.complete);

    if (hasUpdates) {
      // Update database
      await db.run(
        `UPDATE fanfictions SET
         word_count = ?, chapter_count = ?, complete = ?,
         updated_date = ?, last_checked = CURRENT_TIMESTAMP,
         metadata = ?
         WHERE id = ?`,
        [
          metadata.wordCount,
          metadata.chapterCount?.current || fanfiction.chapter_count,
          metadata.complete ? 1 : 0,
          metadata.updatedDate,
          JSON.stringify(metadata),
          id
        ]
      );
    } else {
      // Just update last checked
      await db.run(
        'UPDATE fanfictions SET last_checked = CURRENT_TIMESTAMP WHERE id = ?',
        [id]
      );
    }

    res.json({
      hasUpdates,
      metadata: hasUpdates ? metadata : null
    });
  } catch (error) {
    console.error('Error checking for updates:', error);
    res.status(500).json({ error: 'Failed to check for updates' });
  }
});

export default router;