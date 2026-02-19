import express from 'express';
import db from '../database/index.js';
import {
  hashPassword,
  comparePassword,
  generateToken,
  authenticateUser
} from '../middleware/auth.js';

const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, displayName } = req.body;

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({
        error: 'Username, email, and password are required'
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        error: 'Password must be at least 8 characters long'
      });
    }

    // Check if user already exists
    const existingUser = await db.get(
      'SELECT id FROM users WHERE username = ? OR email = ?',
      [username, email]
    );

    if (existingUser) {
      return res.status(400).json({
        error: 'Username or email already exists'
      });
    }

    // Hash password and create user
    const passwordHash = await hashPassword(password);
    const result = await db.run(
      `INSERT INTO users (username, email, password_hash, display_name)
       VALUES (?, ?, ?, ?)`,
      [username, email, passwordHash, displayName || username]
    );

    // Generate token
    const token = generateToken(result.id);

    // Return user info and token
    res.status(201).json({
      user: {
        id: result.id,
        username,
        email,
        displayName: displayName || username,
        isPremium: false
      },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        error: 'Username and password are required'
      });
    }

    // Find user by username or email
    const user = await db.get(
      `SELECT id, username, email, password_hash, display_name,
              is_premium, storage_used, storage_limit
       FROM users
       WHERE username = ? OR email = ?`,
      [username, username]
    );

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isValidPassword = await comparePassword(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login
    await db.run(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
      [user.id]
    );

    // Generate token
    const token = generateToken(user.id);

    // Return user info and token
    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        displayName: user.display_name,
        isPremium: Boolean(user.is_premium),
        storageUsed: user.storage_used,
        storageLimit: user.storage_limit
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get current user
router.get('/me', authenticateUser, async (req, res) => {
  try {
    const user = await db.get(
      `SELECT id, username, email, display_name, bio, avatar_url,
              is_premium, storage_used, storage_limit, created_at
       FROM users
       WHERE id = ?`,
      [req.userId]
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get user statistics
    const stats = await db.get(
      `SELECT
        (SELECT COUNT(*) FROM fanfictions WHERE user_id = ?) as fanfictionCount,
        (SELECT COUNT(*) FROM folders WHERE user_id = ?) as folderCount,
        (SELECT COUNT(*) FROM tags WHERE user_id = ?) as tagCount,
        (SELECT COUNT(*) FROM lost_fics WHERE user_id = ?) as lostFicCount`,
      [req.userId, req.userId, req.userId, req.userId]
    );

    res.json({
      ...user,
      isPremium: Boolean(user.is_premium),
      stats
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user data' });
  }
});

// Update user profile
router.patch('/me', authenticateUser, async (req, res) => {
  try {
    const { displayName, bio, avatarUrl } = req.body;
    const updates = [];
    const values = [];

    if (displayName !== undefined) {
      updates.push('display_name = ?');
      values.push(displayName);
    }

    if (bio !== undefined) {
      updates.push('bio = ?');
      values.push(bio);
    }

    if (avatarUrl !== undefined) {
      updates.push('avatar_url = ?');
      values.push(avatarUrl);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No updates provided' });
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(req.userId);

    await db.run(
      `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Change password
router.post('/change-password', authenticateUser, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        error: 'Current password and new password are required'
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        error: 'New password must be at least 8 characters long'
      });
    }

    // Get user's current password hash
    const user = await db.get(
      'SELECT password_hash FROM users WHERE id = ?',
      [req.userId]
    );

    // Verify current password
    const isValid = await comparePassword(currentPassword, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Hash new password and update
    const newPasswordHash = await hashPassword(newPassword);
    await db.run(
      'UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [newPasswordHash, req.userId]
    );

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
});

export default router;