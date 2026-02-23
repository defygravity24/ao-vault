# AO Vault - Never Lose Your Fanfiction Again

A modern fanfiction management platform that helps avid readers save, organize, and rediscover their favorite stories across multiple platforms.

## 🚀 Live Demo

**Production:** https://ao-vault-kmqu5gtq2-christina-coopers-projects.vercel.app
**Custom Domain:** https://aovault.net (DNS configuration pending)
**Local Development:** http://localhost:5173

## ✨ Features

### Core Features (MVP - Complete)
- **User Authentication**: Secure registration and login system
- **AO3 Integration**: Automatically fetch metadata from Archive of Our Own
- **Library Management**: Save and organize your fanfictions
- **Smart Organization**: Tag system and folder structure (backend ready)
- **Lost Fic Finder**: Community-driven lost story recovery
- **Search & Filter**: Find stories in your library quickly
- **Reading Status**: Track what you're reading, completed, or plan to read
- **Star Ratings**: Rate your favorite stories
- **Responsive Design**: Works on desktop, tablet, and mobile

### Technical Features
- **SQLite Database**: Lightweight, efficient data storage
- **JWT Authentication**: Secure token-based auth
- **Rate Limiting**: API protection against abuse
- **Modern UI**: Clean, intuitive interface with Tailwind CSS
- **Real-time Updates**: Check if stories have been updated

## 🏁 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation & Running

The app is already installed and running! To access it:

1. **Open your browser** and go to: http://localhost:5173

2. **Create an account**:
   - Click "Sign up" on the login page
   - Enter a username, email, and password
   - Your account will be created instantly

3. **Start adding fanfictions**:
   - Click "Add Fanfic" button
   - Paste an AO3 URL (e.g., https://archiveofourown.org/works/[ID])
   - Add optional tags
   - The story metadata will be fetched automatically

### To Stop the Server
Press `Ctrl+C` in the terminal where the server is running

### To Restart Later
```bash
cd ~/Desktop/ao-vault
npm run dev
```

## 📱 How to Use

### Adding Your First Fanfiction
1. Log in to your account
2. Click the "Add Fanfic" button in the top right
3. Paste an AO3 URL
4. Add tags like "to-read", "favorite", "angst", etc.
5. Click "Save Fanfiction"

### Managing Your Library
- **Grid/List View**: Toggle between card and list layouts
- **Search**: Find stories by title, author, or summary
- **Filter**: Show only active, deleted, or lost stories
- **Quick Actions**: Edit bookmarks, check for updates, or remove stories

### Lost Fic Finder
1. Go to "Lost Fics" in the sidebar
2. Click "Post Lost Fic"
3. Describe what you remember about the story
4. Add details like fandom, plot points, when you last saw it
5. Community members can help find it

### Reading Status
Mark stories as:
- **To Read**: Your reading list
- **Reading**: Currently in progress
- **Completed**: Finished stories
- **On Hold**: Paused for later
- **Dropped**: Discontinued reading

## 🛠 Tech Stack

### Frontend
- React 18 with Hooks
- React Router for navigation
- TanStack Query for data fetching
- Zustand for state management (ready to implement)
- Tailwind CSS for styling
- Lucide React for icons

### Backend
- Node.js + Express
- SQLite3 database
- JWT authentication
- Cheerio for web scraping
- bcrypt for password hashing

## 📊 Database Schema

The app uses a comprehensive database structure:
- **Users**: Account management
- **Fanfictions**: Story metadata and links
- **Bookmarks**: Personal notes and reading progress
- **Tags & Folders**: Organization system
- **Lost Fics**: Community finder feature
- **Reading Lists**: Curated collections

## 🔒 Security Features

- Passwords hashed with bcrypt (10 rounds)
- JWT tokens with 7-day expiry
- Rate limiting (100 requests per 15 minutes)
- SQL injection protection
- XSS protection

## 🚦 API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Sign in
- `GET /api/auth/me` - Get current user
- `PATCH /api/auth/me` - Update profile

### Fanfictions
- `GET /api/fanfictions` - Get user's library
- `POST /api/fanfictions` - Save new story
- `PATCH /api/fanfictions/:id/bookmark` - Update bookmark
- `DELETE /api/fanfictions/:id` - Remove story
- `POST /api/fanfictions/:id/check-update` - Check for updates

## 🎯 Roadmap

### Phase 1 (Complete) ✅
- Core authentication
- AO3 integration
- Basic library management
- Lost fic finder UI

### Phase 2 (Next)
- Wattpad & FFN support
- Download stories as PDF/EPUB
- Advanced folder system
- Smart folders with rules
- Mobile apps (iOS/Android)

### Phase 3 (Future)
- Browser extensions
- AI-powered recommendations
- Reading clubs
- Author support features
- Import/export functionality

## 💡 Tips

1. **Quick Save**: Bookmark the "Add Fanfic" modal for faster saves
2. **Bulk Operations**: Select multiple stories for batch tagging (coming soon)
3. **Keyboard Shortcuts**: Use `/` to focus search (coming soon)
4. **Privacy**: Your library is private by default

## 🐛 Known Limitations (MVP)

- Only AO3 is supported currently
- No offline reading yet
- Folders/tags backend ready but UI pending
- Lost fics are mock data (backend pending)
- No email verification yet

## 📝 License

This is a personal project for demonstration purposes.

## 🙏 Acknowledgments

- Archive of Our Own for being an amazing fanfiction platform
- The fanfiction community for inspiration
- All the readers who've lost stories they loved

---

**Built with love for fanfiction readers everywhere** 📚❤️

For questions or feedback, this is your personal vault - enjoy!