# 🎯 Step-by-Step: Adding DNS Records in Namecheap

## Step 1: Log Into Namecheap

1. Go to: **https://www.namecheap.com**
2. Click **Sign In** (top right corner)
3. Enter your username/email and password
4. Click **Sign In**

---

## Step 2: Find Your Domain

Once logged in:
1. Look for **Domain List** in the left sidebar
   - OR click **Domains** in the top menu
2. You'll see a list of your domains including:
   - aovault.net ✅
   - aovault.app
   - aovault.cc

---

## Step 3: Access DNS Settings

1. Find **aovault.net** in your domain list
2. Click the **MANAGE** button next to it
   - It's usually a blue/green button on the right

---

## Step 4: Go to Advanced DNS

1. Once in the domain management page, look for tabs at the top
2. Click on **Advanced DNS** tab
   - You might see tabs like: Domain | Nameservers | Advanced DNS | etc.

---

## Step 5: Delete Default Records (Important!)

You'll probably see some default records like:
- URL Redirect Record
- CNAME with "parkingpage.namecheap.com"
- Or records pointing to "failed-whois-verification.namecheap.com"

**Delete these:**
1. Click the **trash can icon** 🗑️ next to each default record
2. Confirm deletion when asked

---

## Step 6: Add First A Record (Root Domain)

1. Click **ADD NEW RECORD** button (usually red/orange)
2. Fill in:
   - **Type:** Select `A Record` from dropdown
   - **Host:** Type `@` (just the @ symbol - this means the root domain)
   - **Value:** Type `76.76.21.21`
   - **TTL:** Leave as `Automatic` (or select 3600 if asked)
3. Click the **checkmark** ✓ or **Save** button

---

## Step 7: Add Second A Record (WWW)

1. Click **ADD NEW RECORD** again
2. Fill in:
   - **Type:** Select `A Record` from dropdown
   - **Host:** Type `www` (just the three letters)
   - **Value:** Type `76.76.21.21`
   - **TTL:** Leave as `Automatic` (or select 3600 if asked)
3. Click the **checkmark** ✓ or **Save** button

---

## Step 8: Save All Changes

**IMPORTANT:** Some Namecheap interfaces require you to:
1. Click **SAVE ALL CHANGES** button at the bottom
2. Or click **Save Changes** after adding records

Make sure you save!

---

## ✅ What Your DNS Records Should Look Like

After you're done, you should see exactly these 2 records:

| Type | Host | Value | TTL |
|------|------|-------|-----|
| A Record | @ | 76.76.21.21 | Automatic |
| A Record | www | 76.76.21.21 | Automatic |

Nothing else! Just these two.

---

## 🕐 Wait for DNS to Update

After saving:
- **Typical wait time:** 5-30 minutes
- **Maximum:** Up to 48 hours (rare)
- **Usually:** Works within 15 minutes

---

## 🔍 How to Check if It's Working

### Option 1: Just Try It
Wait 15 minutes, then go to:
- https://aovault.net

If you see your AO Vault app, it worked! 🎉

### Option 2: Check DNS Status
1. Go to: https://dnschecker.org
2. Enter: `aovault.net`
3. Select **A** record type
4. Click **Search**
5. You should see `76.76.21.21` appearing around the world

### Option 3: Command Line Check
Open Terminal and type:
```bash
nslookup aovault.net
```

You should see:
```
Server:     [your DNS server]
Address:    [DNS server IP]

Non-authoritative answer:
Name:   aovault.net
Address: 76.76.21.21
```

---

## ❓ Common Issues & Solutions

### "I don't see Advanced DNS tab"
- Make sure you clicked MANAGE next to your domain
- You might need to scroll or look for "DNS Settings" instead

### "I see lots of other records"
- Only keep the two A records we added
- Delete everything else (MX, TXT, CNAME records)

### "It says invalid value"
- Make sure you typed exactly: `76.76.21.21`
- No spaces before or after
- All dots (periods), no commas

### "I see a parking page"
- DNS hasn't updated yet - wait 15 more minutes
- Clear your browser cache (Cmd+Shift+R)
- Try incognito/private browser mode

---

## 🎉 Success!

Once the DNS updates, your site will be live at:
- **https://aovault.net** ← Main URL
- **https://www.aovault.net** ← Also works

Both will show your AO Vault app!

---

## 🆘 Still Need Help?

**Namecheap Support Chat:**
1. While logged in, look for chat bubble (bottom right)
2. Say: "I need help adding A records for my domain"
3. They can walk you through it

**Or ask me:** I can try to help troubleshoot any issues you encounter!

---

Remember: The exact values you need are:
- **Two A records**
- **Both pointing to:** 76.76.21.21
- **One for @, one for www**

That's it! 🚀