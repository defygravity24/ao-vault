# AO Vault - Project Context

## 📚 Project Overview
**AO Vault** - Never Lose Your Fanfiction Again
A modern fanfiction management platform for saving, organizing, and rediscovering stories across multiple platforms.

**Status:** MVP Complete with Dark Theme
**Created:** February 18, 2026
**Location:** `~/Desktop/ao-vault`

## 🛠 Tech Stack

### Frontend
- **React 18** with Hooks
- **Vite** for build tooling
- **Tailwind CSS** for styling (dark theme)
- **React Router** for navigation
- **TanStack Query** for data fetching
- **Lucide React** for icons
- **Zustand** for state management (ready, not implemented)

### Backend
- **Node.js + Express** server
- **SQLite3** database
- **JWT** authentication
- **bcrypt** for password hashing
- **Cheerio** for web scraping (AO3)
- **Rate limiting** with express-rate-limit

### Development
- **Port 5173:** Frontend (Vite)
- **Port 3001:** Backend API
- **Database:** `~/Desktop/ao-vault/database/ao_vault.db`

## ✅ What's Working

### Core Features
1. **User Authentication**
   - Registration/Login system
   - JWT token-based auth
   - Profile management
   - Secure password hashing

2. **Library Management**
   - Beautiful dark theme UI with purple accents
   - Card-based layout for fanfictions
   - Search functionality
   - Grid view of saved stories

3. **Fanfiction Features**
   - Save stories from AO3 (URL input)
   - Display metadata (title, author, summary, relationships)
   - Custom hashtag system
   - Manual entry option when AO3 blocks

4. **Special Features** ✨
   - **"Give Thanks" button** - Show appreciation
   - **"Mark as Outrageously Horny" button** - Special designation with pulsing badge
   - **Direct AO3 links** - Click to read original
   - Progress bars for reading status
   - Ship/relationship display with 💕

5. **UI/UX**
   - Dark theme with gradient backgrounds
   - Responsive design
   - Clean card layouts
   - Smooth animations and transitions

## ❌ What's Not Working / Limitations

1. **AO3 Scraping**
   - Getting 525 errors (Cloudflare blocking)
   - Falls back to manual entry
   - Need browser automation (Puppeteer) for reliable scraping

2. **Missing Features**
   - Chapter-specific thanks/horny marking (requested but not built)
   - Folder system (backend ready, no UI)
   - Download as PDF/EPUB
   - Only supports AO3 (no Wattpad, FFN yet)
   - Lost Fics feature has no backend

3. **Data Persistence**
   - Thanks/Horny status not persisting to database
   - Need to implement bookmark updates

## 🚀 Next Steps Needed

### Immediate (Priority)
1. **Fix Data Persistence**
   - Save thanks/horny status to database
   - Update bookmark table schema
   - Persist user interactions

2. **Chapter Management**
   - Add chapter list view
   - Enable per-chapter thanks/horny marking
   - Track reading progress by chapter

3. **Fix AO3 Scraping**
   - Implement Puppeteer for browser automation
   - Or use AO3's unofficial API
   - Better error handling with user feedback

### Short Term
1. **Folder/Collection System**
   - UI for creating folders
   - Drag-and-drop organization
   - Smart folders with rules

2. **Enhanced Tagging**
   - Tag autocomplete
   - Tag management page
   - Bulk tag operations

3. **Lost Fics Backend**
   - Connect UI to database
   - Implement search/response system
   - Community features

### Long Term
1. **Multi-Platform Support**
   - Add Wattpad scraper
   - Add Fanfiction.net scraper
   - Tumblr integration

2. **Download Features**
   - PDF generation
   - EPUB export
   - Offline reading

3. **Social Features**
   - Share reading lists
   - Follow other users
   - Recommendations

## 📁 Project Structure
```
ao-vault/
├── src/
│   ├── components/
│   │   ├── Layout.jsx (main layout, dark sidebar)
│   │   └── AddFanfictionModal.jsx
│   ├── pages/
│   │   ├── Library.jsx (dark theme version)
│   │   ├── Dashboard.jsx
│   │   ├── Login.jsx
│   │   └── LostFics.jsx
│   ├── contexts/
│   │   └── AuthContext.jsx
│   └── utils/
│       └── api.js
├── server/
│   ├── index.js (main server)
│   ├── database/
│   │   └── schema.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── fanfictions.js
│   └── utils/
│       └── ao3-scraper.js
├── database/
│   └── ao_vault.db (SQLite database)
└── package.json
```

## 🐛 Known Issues
1. AO3 returns 525 error (Cloudflare SSL handshake failed)
2. Thanks/Horny buttons don't persist state
3. Add Fanfic modal needs better error handling
4. Manual entry fields should be more prominent

## 💡 How to Continue Development

### In a New Claude Chat:
```
I'm working on AO Vault at ~/Desktop/ao-vault
Read PROJECT_CONTEXT.md for full details
I need to [specific task]
```

### Common Commands:
```bash
# Start the app
cd ~/Desktop/ao-vault && npm run dev

# Check database
sqlite3 ~/Desktop/ao-vault/database/ao_vault.db

# View latest changes
git log --oneline -10
```

## 🎯 Current User Story
"As a fanfiction reader, I want to:
1. Save fics with custom hashtags
2. Mark stories as 'outrageously horny'
3. Give thanks to authors
4. Do all of the above for individual chapters
5. Never lose my favorite stories"

## 📝 Notes
- Created for demonstration/personal use
- Focus on core features over breadth
- Prioritize user experience and visual appeal
- Dark theme is essential to the aesthetic

---
*Last Updated: February 18, 2026*