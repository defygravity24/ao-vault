# Setting Up AO Vault in Xcode

## Quick Setup Instructions

### Step 1: Create New Xcode Project

1. Open Xcode (it should be opening now)
2. Click "Create New Project"
3. Choose **iOS** → **App**
4. Configure:
   - Product Name: **AOVault**
   - Team: Select your Apple ID
   - Organization Identifier: **com.christinacooper**
   - Bundle Identifier: Will auto-fill as `com.christinacooper.AOVault`
   - Interface: **Storyboard** (or SwiftUI if you prefer)
   - Language: **Swift**
   - Use Core Data: **Unchecked**
   - Include Tests: Optional

5. Save to: `~/Desktop/ao-vault/ios-app/`

### Step 2: Replace Generated Files

After creating the project, replace these files with the ones I've created:

1. **Replace ViewController.swift** with:
   - `/Users/christinacooper/Desktop/ao-vault/ios-app/AOVault/ViewController.swift`

2. **Replace Info.plist** settings to include:
   ```xml
   <key>NSAppTransportSecurity</key>
   <dict>
       <key>NSAllowsArbitraryLoads</key>
       <true/>
       <key>NSAllowsLocalNetworking</key>
       <true/>
   </dict>
   ```

### Step 3: Start Your Web Server

Before running the iOS app, make sure your web server is running:

```bash
cd ~/Desktop/ao-vault
npm run dev
```

This will start:
- Frontend on http://localhost:5173
- Backend on http://localhost:3001

### Step 4: Run the iOS App

1. Select your iPhone simulator (or connect your device)
2. Click the Run button (▶️)
3. The app will open and load your AO Vault web app

## Features in the iOS App

### WebView Features:
- ✅ Loads your local development server
- ✅ JavaScript enabled for full functionality
- ✅ Pull-to-refresh support
- ✅ Navigation controls (back/forward)
- ✅ Progress bar for page loading
- ✅ Share button for URLs

### AO3 Metadata Extraction:
The iOS app includes JavaScript injection that:
- Detects when you're on AO3 pages
- Extracts metadata (title, author, summary, tags, relationships)
- Sends data back to your web app
- Prints metadata to Xcode console for debugging

## Testing AO3 Fanfiction Saving

1. **Start the servers** (if not already running):
   ```bash
   cd ~/Desktop/ao-vault && npm run dev
   ```

2. **Run the iOS app** in Xcode

3. **Test saving a fanfiction**:
   - Navigate to Library in the app
   - Click "Add Fanfiction"
   - Enter an AO3 URL like: `https://archiveofourown.org/works/[work_id]`
   - The app will attempt to scrape metadata

4. **Check the console** in Xcode for extracted metadata

## Troubleshooting

### "Server Not Running" Error
- Make sure you ran `npm run dev` in the ao-vault directory
- Check that ports 5173 and 3001 are not blocked

### AO3 Scraping Issues (525 Error)
- This is a known Cloudflare issue
- Use manual entry as fallback
- The iOS app's JavaScript injection might help bypass some restrictions

### Can't See Saved Fanfictions
- Check the database: `sqlite3 ~/Desktop/ao-vault/database/ao_vault.db`
- Verify the backend is running on port 3001

## Next Steps

Once you have the basic app working:

1. **Test on Real Device**:
   - Connect your iPhone
   - Select it as the run destination
   - You may need to trust your developer certificate on the device

2. **Enhance Metadata Extraction**:
   - The ViewController.swift includes JavaScript for extracting AO3 data
   - Modify the extraction script to get more fields

3. **Add Native Features**:
   - Share extension to save from Safari
   - Push notifications for updated fics
   - Offline reading mode

## Current Limitations

- **AO3 Cloudflare Protection**: The site blocks automated requests
- **Manual Entry Fallback**: Required when scraping fails
- **Local Server Required**: App needs the dev server running

## Files Created for iOS App

```
ios-app/
├── AOVault/
│   ├── AppDelegate.swift       # App lifecycle management
│   ├── SceneDelegate.swift     # Scene management
│   ├── ViewController.swift    # Main WebView controller with AO3 extraction
│   └── Info.plist              # App configuration
```

---

Ready to test! Open Xcode and follow the steps above to create your project.