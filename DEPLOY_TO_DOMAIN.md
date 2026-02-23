# 🚀 Deploy AO Vault to Your Domain

## Quick Deploy to Vercel (Recommended)

### Step 1: Build the App
```bash
cd ~/Desktop/ao-vault
npm run build
```

### Step 2: Deploy to Vercel
```bash
npx vercel --prod
```

When prompted:
- **Set up and deploy?** → Yes
- **Which scope?** → Select your account
- **Link to existing project?** → No (create new)
- **Project name?** → ao-vault (or your preference)
- **Directory?** → ./ (current directory)
- **Override settings?** → No

### Step 3: Add Your Custom Domain

1. Note the URL Vercel gives you (like `ao-vault-xyz.vercel.app`)
2. Go to https://vercel.com/dashboard
3. Click on your project
4. Go to **Settings** → **Domains**
5. Click **Add Domain**
6. Enter your domain (e.g., `aovault.com` or whatever you bought)
7. Follow the DNS instructions:

#### Option A: Using CNAME (Easiest)
Add this to your domain's DNS:
```
Type: CNAME
Name: @ (or www)
Value: cname.vercel-dns.com
```

#### Option B: Using A Records
Add these to your domain's DNS:
```
Type: A
Name: @
Value: 76.76.21.21
```

### Step 4: Configure Environment Variables

1. In Vercel dashboard → Settings → Environment Variables
2. Add:
```
VITE_API_URL = https://ao-vault-api.herokuapp.com
```
(You'll need to deploy the backend separately)

---

## Backend Deployment Options

### Option 1: Heroku (Free tier available)
```bash
# Install Heroku CLI
brew tap heroku/brew && brew install heroku

# Login
heroku login

# Create app
heroku create ao-vault-api

# Deploy
git init
git add .
git commit -m "Initial commit"
heroku git:remote -a ao-vault-api
git push heroku main
```

### Option 2: Railway (Simpler)
```bash
# Install Railway
npm install -g @railway/cli

# Deploy
railway login
railway init
railway up
```

### Option 3: Render (Free tier)
1. Go to https://render.com
2. Connect GitHub repo
3. Deploy automatically

---

## Testing Your Domain

After DNS propagates (5-30 minutes):
1. Visit `https://yourdomain.com`
2. Your AO Vault app should load!

---

## SSL Certificate
Vercel automatically provides SSL (HTTPS) for your custom domain ✅

---

## Quick Commands Reference

```bash
# Deploy updates
cd ~/Desktop/ao-vault
npm run build
npx vercel --prod

# Check deployment
open https://yourdomain.com

# View logs
vercel logs

# List deployments
vercel ls
```

---

## Domain Registrar DNS Settings

### Namecheap
1. Dashboard → Domain List → Manage
2. Advanced DNS → Add New Record
3. Add CNAME record pointing to `cname.vercel-dns.com`

### GoDaddy
1. My Products → DNS → Manage DNS
2. Add → CNAME → Points to: `cname.vercel-dns.com`

### Google Domains
1. My domains → Manage → DNS
2. Custom records → Create new record
3. Type: CNAME, Data: `cname.vercel-dns.com`

### Cloudflare
1. DNS → Records → Add record
2. Type: CNAME, Target: `cname.vercel-dns.com`
3. Proxy status: DNS only (gray cloud)

---

## Your Domain is Live! 🎉

Once deployed, share your domain and people can:
- Create accounts
- Save their fanfiction
- Access from anywhere
- Use on mobile devices

No app store needed - it works in any browser!