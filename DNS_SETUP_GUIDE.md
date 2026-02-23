# 🌐 DNS Setup Guide for aovault.net

## ✅ Your Deployment is Live!

Your AO Vault app is successfully deployed to:
**https://ao-vault-kmqu5gtq2-christina-coopers-projects.vercel.app**

## 📝 DNS Configuration Steps

### Step 1: Add Domain to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on your **ao-vault** project
3. Go to **Settings** → **Domains**
4. Click **Add Domain**
5. Enter: `aovault.net`
6. Click **Add**

### Step 2: Configure Your Domain Registrar

Vercel will show you one of these options:

#### Option A: CNAME Record (Recommended)
Add this to your domain registrar's DNS settings:

```
Type: CNAME
Name: @ (or blank)
Value: cname.vercel-dns.com
TTL: Auto or 3600
```

For www subdomain:
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: Auto or 3600
```

#### Option B: A Records (Alternative)
If your registrar doesn't support CNAME on root domain:

```
Type: A
Name: @ (or blank)
Value: 76.76.21.21
TTL: Auto or 3600
```

### Step 3: Domain Registrar Specific Instructions

Based on your registrar, here's where to add the records:

#### Namecheap
1. Sign in to Namecheap
2. Dashboard → Domain List → Manage (next to aovault.net)
3. Advanced DNS tab
4. Add New Record → CNAME Record
5. Host: @
6. Value: cname.vercel-dns.com
7. Save changes

#### GoDaddy
1. Sign in to GoDaddy
2. My Products → Domains → aovault.net → Manage
3. DNS → Manage DNS
4. Add → Type: CNAME
5. Name: @
6. Points to: cname.vercel-dns.com
7. Save

#### Google Domains
1. Sign in to Google Domains
2. My domains → aovault.net → Manage
3. DNS → Manage custom records
4. Create new record
5. Type: CNAME, Name: @, Data: cname.vercel-dns.com

#### Cloudflare
1. Sign in to Cloudflare
2. Select aovault.net
3. DNS → Records → Add record
4. Type: CNAME
5. Name: @
6. Target: cname.vercel-dns.com
7. Proxy status: DNS only (gray cloud)
8. Save

## ⏱️ DNS Propagation

After adding the DNS records:
- **Time to propagate:** 5 minutes to 48 hours (usually under 1 hour)
- **Check status:** https://dnschecker.org/#CNAME/aovault.net
- **Vercel will show:** "Valid Configuration" ✅ when ready

## 🔍 Verify Your Setup

### Check DNS Records
```bash
# Check CNAME record
dig aovault.net CNAME

# Check if domain resolves
nslookup aovault.net

# Ping test
ping aovault.net
```

### Test the Live Site
Once DNS propagates, test these URLs:
- https://aovault.net
- https://www.aovault.net
- Both should load your AO Vault app

## 🚀 Additional Domains

You also own these domains that can be added as aliases:
- **aovault.app** - Great for app branding
- **aovault.cc** - Short alternative

To add them:
1. In Vercel: Settings → Domains → Add Domain
2. Add each domain
3. Configure DNS same as above

## ✨ SSL Certificate

Good news! Vercel automatically provides:
- Free SSL certificate
- Automatic HTTPS
- Certificate renewal
- No configuration needed

## 🔄 Updating Your App

When you make changes:
```bash
# Push to GitHub
git add .
git commit -m "Update message"
git push

# Or manual deploy
npx vercel --prod
```

## 📊 Domain Status Checklist

- [x] App deployed to Vercel
- [x] Production URL working
- [ ] Domain added to Vercel
- [ ] DNS records configured
- [ ] DNS propagated
- [ ] aovault.net working
- [ ] SSL certificate active

## 🆘 Troubleshooting

### "Invalid Configuration" in Vercel
- Double-check DNS records
- Wait for propagation (up to 48 hours)
- Ensure no conflicting records

### Site Not Loading
- Check DNS propagation: https://dnschecker.org
- Clear browser cache
- Try incognito/private mode

### SSL Error
- Wait 10 minutes after DNS propagation
- Vercel needs time to provision certificate
- Check Vercel dashboard for status

## 📞 Need Help?

- **Vercel Support:** https://vercel.com/support
- **DNS Checker:** https://dnschecker.org
- **What's My DNS:** https://www.whatsmydns.net

---

**Current Status:** App is live at temporary URL. Waiting for DNS configuration to point aovault.net to the app.