// Database schema for AO Vault

export const schema = `
-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  is_premium BOOLEAN DEFAULT 0,
  storage_used INTEGER DEFAULT 0,
  storage_limit INTEGER DEFAULT 1073741824, -- 1GB in bytes
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_login DATETIME,
  preferences JSON DEFAULT '{}'
);

-- Fanfictions table
CREATE TABLE IF NOT EXISTS fanfictions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  external_id TEXT,
  platform TEXT NOT NULL, -- 'ao3', 'ffn', 'wattpad', etc.
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  author_url TEXT,
  summary TEXT,
  rating TEXT,
  warnings TEXT,
  categories TEXT,
  fandoms TEXT,
  relationships TEXT,
  characters TEXT,
  additional_tags TEXT,
  language TEXT DEFAULT 'English',
  word_count INTEGER DEFAULT 0,
  chapter_count INTEGER DEFAULT 1,
  complete BOOLEAN DEFAULT 0,
  published_date DATETIME,
  updated_date DATETIME,
  saved_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_checked DATETIME,
  status TEXT DEFAULT 'active', -- 'active', 'deleted', 'private', 'lost'
  metadata JSON DEFAULT '{}',
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(user_id, url)
);

-- Folders table
CREATE TABLE IF NOT EXISTS folders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#0ea5e9',
  icon TEXT DEFAULT 'folder',
  parent_folder_id INTEGER,
  sort_order INTEGER DEFAULT 0,
  is_smart BOOLEAN DEFAULT 0,
  smart_rules JSON,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (parent_folder_id) REFERENCES folders(id) ON DELETE CASCADE
);

-- Fanfiction to Folder junction table
CREATE TABLE IF NOT EXISTS fanfiction_folders (
  fanfiction_id INTEGER NOT NULL,
  folder_id INTEGER NOT NULL,
  added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (fanfiction_id, folder_id),
  FOREIGN KEY (fanfiction_id) REFERENCES fanfictions(id) ON DELETE CASCADE,
  FOREIGN KEY (folder_id) REFERENCES folders(id) ON DELETE CASCADE
);

-- Tags table
CREATE TABLE IF NOT EXISTS tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#d946ef',
  usage_count INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(user_id, name)
);

-- Fanfiction to Tags junction table
CREATE TABLE IF NOT EXISTS fanfiction_tags (
  fanfiction_id INTEGER NOT NULL,
  tag_id INTEGER NOT NULL,
  PRIMARY KEY (fanfiction_id, tag_id),
  FOREIGN KEY (fanfiction_id) REFERENCES fanfictions(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

-- Bookmarks table (additional metadata for saved fanfictions)
CREATE TABLE IF NOT EXISTS bookmarks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  fanfiction_id INTEGER NOT NULL,
  rating INTEGER CHECK(rating >= 1 AND rating <= 5),
  notes TEXT,
  private_notes TEXT,
  current_chapter INTEGER DEFAULT 1,
  reading_status TEXT DEFAULT 'to-read', -- 'reading', 'completed', 'on-hold', 'dropped', 'to-read'
  priority INTEGER DEFAULT 0,
  last_read DATETIME,
  read_count INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (fanfiction_id) REFERENCES fanfictions(id) ON DELETE CASCADE,
  UNIQUE(user_id, fanfiction_id)
);

-- Lost Fics table
CREATE TABLE IF NOT EXISTS lost_fics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  title TEXT,
  author TEXT,
  platform TEXT,
  fandom TEXT,
  description TEXT NOT NULL,
  remembered_details TEXT,
  last_seen_date TEXT,
  status TEXT DEFAULT 'searching', -- 'searching', 'found', 'closed'
  found_url TEXT,
  found_by_user_id INTEGER,
  bounty_points INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  resolved_at DATETIME,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (found_by_user_id) REFERENCES users(id)
);

-- Lost Fic Responses table
CREATE TABLE IF NOT EXISTS lost_fic_responses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lost_fic_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  message TEXT NOT NULL,
  suggested_url TEXT,
  helpful_votes INTEGER DEFAULT 0,
  is_solution BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (lost_fic_id) REFERENCES lost_fics(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Reading Lists table
CREATE TABLE IF NOT EXISTS reading_lists (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT 0,
  follower_count INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Reading List Items table
CREATE TABLE IF NOT EXISTS reading_list_items (
  reading_list_id INTEGER NOT NULL,
  fanfiction_id INTEGER NOT NULL,
  sort_order INTEGER DEFAULT 0,
  added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (reading_list_id, fanfiction_id),
  FOREIGN KEY (reading_list_id) REFERENCES reading_lists(id) ON DELETE CASCADE,
  FOREIGN KEY (fanfiction_id) REFERENCES fanfictions(id) ON DELETE CASCADE
);

-- Downloads table (track downloaded content)
CREATE TABLE IF NOT EXISTS downloads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  fanfiction_id INTEGER NOT NULL,
  format TEXT NOT NULL, -- 'pdf', 'epub', 'html'
  file_path TEXT,
  file_size INTEGER,
  downloaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (fanfiction_id) REFERENCES fanfictions(id) ON DELETE CASCADE
);

-- Activity Log table
CREATE TABLE IF NOT EXISTS activity_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id INTEGER,
  metadata JSON,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_fanfictions_user_id ON fanfictions(user_id);
CREATE INDEX IF NOT EXISTS idx_fanfictions_platform ON fanfictions(platform);
CREATE INDEX IF NOT EXISTS idx_fanfictions_status ON fanfictions(status);
CREATE INDEX IF NOT EXISTS idx_folders_user_id ON folders(user_id);
CREATE INDEX IF NOT EXISTS idx_tags_user_id ON tags(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_fanfic ON bookmarks(user_id, fanfiction_id);
CREATE INDEX IF NOT EXISTS idx_lost_fics_status ON lost_fics(status);
CREATE INDEX IF NOT EXISTS idx_lost_fics_user_id ON lost_fics(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_user_id ON activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_fanfictions_title ON fanfictions(title);
CREATE INDEX IF NOT EXISTS idx_fanfictions_author ON fanfictions(author);
`;