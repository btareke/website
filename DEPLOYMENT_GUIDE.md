# Deployment Guide: Publishing to beamlaktareke.com

This guide will walk you through deploying your website to GitHub Pages and configuring your Cloudflare DNS.

## Prerequisites
- GitHub account
- Cloudflare account with beamlaktareke.com domain
- Git installed on your machine

---

## Step 1: Create GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the **"+"** icon in the top right corner
3. Select **"New repository"**
4. Fill in the repository details:
   - **Repository name**: `website` (or any name you prefer)
   - **Description**: (optional) "Personal portfolio website"
   - **Visibility**: Choose **Public** (required for free GitHub Pages)
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
5. Click **"Create repository"**

---

## Step 2: Push Your Code to GitHub

After creating the repository, GitHub will show you commands. Run these in your terminal:

```bash
cd /Users/beamlaktareke/Documents/website

# Add the remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/website.git

# Push your code
git branch -M main
git push -u origin main
```

**Note**: Replace `YOUR_USERNAME` with your actual GitHub username.

---

## Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on **"Settings"** (top menu bar)
3. Scroll down to **"Pages"** in the left sidebar
4. Under **"Source"**, select:
   - **Branch**: `main`
   - **Folder**: `/ (root)`
5. Click **"Save"**

Your site will be available at: `https://YOUR_USERNAME.github.io/website`

---

## Step 4: Configure Custom Domain in GitHub

1. Still in the **"Pages"** settings section
2. Under **"Custom domain"**, enter: `beamlaktareke.com`
3. Check the box **"Enforce HTTPS"** (this will be available after DNS is configured)
4. Click **"Save"**

**Note**: The CNAME file is already in your repository, which tells GitHub to use your custom domain.

---

## Step 5: Configure Cloudflare DNS

Now you need to configure your DNS records in Cloudflare:

### Option A: Using Apex Domain (beamlaktareke.com)

1. Log in to your [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Select your domain **beamlaktareke.com**
3. Go to **"DNS"** → **"Records"**
4. You need to add/update the following records:

#### For Apex Domain (beamlaktareke.com):

Add or update these **A records** (IPv4 addresses for GitHub Pages):
- **Type**: A
- **Name**: @ (or beamlaktareke.com)
- **IPv4 address**: `185.199.108.153`
- **Proxy status**: DNS only (gray cloud) or Proxied (orange cloud) - both work
- **TTL**: Auto

Repeat for these additional IPs (GitHub Pages uses multiple IPs):
- `185.199.109.153`
- `185.199.110.153`
- `185.199.111.153`

#### For www subdomain (optional but recommended):

Add a **CNAME record**:
- **Type**: CNAME
- **Name**: www
- **Target**: `YOUR_USERNAME.github.io` (replace with your actual GitHub username)
- **Proxy status**: DNS only (gray cloud) or Proxied (orange cloud)
- **TTL**: Auto

### Option B: Using CNAME (Alternative method)

If you prefer using CNAME for the apex domain (requires Cloudflare's CNAME flattening):

1. Add a **CNAME record**:
   - **Type**: CNAME
   - **Name**: @ (or beamlaktareke.com)
   - **Target**: `YOUR_USERNAME.github.io`
   - **Proxy status**: DNS only (gray cloud) or Proxied (orange cloud)
   - **TTL**: Auto

**Note**: Cloudflare automatically handles CNAME flattening for apex domains, so this should work.

---

## Step 6: SSL/TLS Settings in Cloudflare

1. In Cloudflare, go to **"SSL/TLS"** → **"Overview"**
2. Set encryption mode to **"Full"** or **"Full (strict)"**
   - **Full**: Works with GitHub Pages certificates
   - **Full (strict)**: More secure, validates certificate (recommended)

---

## Step 7: Wait for DNS Propagation

- DNS changes can take a few minutes to several hours to propagate
- You can check propagation status at: https://www.whatsmydns.net/
- GitHub Pages may take up to 24 hours to provision SSL certificate for your custom domain

---

## Step 8: Verify Deployment

1. After DNS propagates (usually 5-30 minutes), visit: `https://beamlaktareke.com`
2. If you see your website, you're done! 🎉
3. If not, wait a bit longer and check:
   - DNS propagation status
   - GitHub Pages settings show your custom domain
   - Cloudflare DNS records are correct

---

## Troubleshooting

### Website not loading?
1. Check DNS propagation: https://www.whatsmydns.net/#A/beamlaktareke.com
2. Verify GitHub Pages is enabled and shows your custom domain
3. Check Cloudflare DNS records are correct
4. Clear your browser cache

### SSL Certificate issues?
1. In Cloudflare, ensure SSL/TLS mode is set to "Full" or "Full (strict)"
2. Wait up to 24 hours for GitHub to provision the certificate
3. Check GitHub Pages settings show "Enforce HTTPS" is enabled

### "Enforce HTTPS — Unavailable" Error?
This means GitHub hasn't detected your DNS configuration yet. Follow these steps:

1. **Verify DNS Records in Cloudflare:**
   - Go to Cloudflare Dashboard → DNS → Records
   - Ensure you have all 4 A records pointing to GitHub Pages IPs:
     - `185.199.108.153`
     - `185.199.109.153`
     - `185.199.110.153`
     - `185.199.111.153`
   - All should have Name: `@` (or `beamlaktareke.com`)

2. **IMPORTANT: Disable Cloudflare Proxy Temporarily:**
   - If your DNS lookup shows Cloudflare IPs (104.21.x.x or 172.67.x.x), your proxy is enabled
   - GitHub Pages can't verify your domain when it sees Cloudflare IPs instead of GitHub Pages IPs
   - **Solution:** In Cloudflare DNS records, click the orange cloud icon next to each A record
   - Change it to **gray cloud (DNS only)** - this disables the proxy
   - Wait 5-10 minutes for DNS to update
   - Check whatsmydns.net again - it should now show GitHub Pages IPs (185.199.108.x range)
   - Once GitHub enables HTTPS, you can re-enable the proxy (orange cloud) if desired

3. **Check DNS Propagation:**
   - Visit: https://www.whatsmydns.net/#A/beamlaktareke.com
   - Verify that DNS shows the GitHub Pages IPs (185.199.108.x range)
   - If it shows Cloudflare IPs (104.21.x.x or 172.67.x.x), go back to step 2 and disable proxy
   - If it shows different IPs or errors, DNS hasn't propagated yet

4. **Verify CNAME File in Repository:**
   - Ensure `CNAME` file exists in your repository root
   - It should contain only: `beamlaktareke.com` (no www, no trailing slash)
   - If missing, create it and push to GitHub

5. **Check Cloudflare SSL/TLS Mode:**
   - Go to Cloudflare → SSL/TLS → Overview
   - Set to **"Full"** (not "Flexible" - this breaks GitHub Pages)
   - "Full (strict)" works too, but "Full" is safer during setup

6. **Remove and Re-add Custom Domain in GitHub:**
   - In GitHub repo → Settings → Pages
   - Remove the custom domain (clear the field and save)
   - Wait 5 minutes
   - Re-add `beamlaktareke.com` and save
   - This forces GitHub to re-check DNS

7. **Wait for GitHub Detection:**
   - GitHub checks DNS periodically (every few hours)
   - After DNS propagates, it may take 1-6 hours for GitHub to detect it
   - Once detected, "Enforce HTTPS" will become available
   - Then wait up to 24 hours for SSL certificate provisioning

### DNS not resolving?
1. Verify A records point to GitHub Pages IPs (listed above)
2. Check Cloudflare proxy status (try both DNS only and Proxied)
3. Ensure no conflicting DNS records exist

### Getting a 404 "File not found" Error?
This means GitHub Pages can't find your `index.html` file. Try these steps:

1. **Verify GitHub Pages Source Settings:**
   - Go to your GitHub repository: `https://github.com/btareke/website`
   - Click **"Settings"** → **"Pages"**
   - Under **"Source"**, ensure:
     - **Branch**: `main` (or `master`)
     - **Folder**: `/ (root)` (not `/docs` or another folder)
   - Click **"Save"** if you made changes

2. **Verify index.html is in Repository:**
   - In your GitHub repo, check that `index.html` exists in the root directory
   - Visit: `https://github.com/btareke/website/blob/main/index.html`
   - If it's missing, you need to push it

3. **Push All Files to GitHub:**
   ```bash
   cd /Users/beamlaktareke/Documents/website
   git add .
   git commit -m "Ensure all files are committed"
   git push origin main
   ```

4. **Check Deployment Status:**
   - In your GitHub repo, go to **"Settings"** → **"Pages"**
   - Look for deployment status (should show "Your site is live at...")
   - If there are errors, they'll be shown here

5. **Wait for Deployment:**
   - After pushing, wait 1-2 minutes for GitHub Pages to rebuild
   - Clear your browser cache (Ctrl+Shift+R or Cmd+Shift+R)
   - Try accessing your site again

6. **Verify CNAME File:**
   - Make sure `CNAME` file exists in your repo root
   - It should contain only: `beamlaktareke.com` (no www, no trailing slash)
   - If missing, create it and push:
     ```bash
     echo "beamlaktareke.com" > CNAME
     git add CNAME
     git commit -m "Add CNAME file"
     git push origin main
     ```

7. **Check File Case Sensitivity:**
   - Ensure `index.html` is lowercase (not `Index.html` or `INDEX.HTML`)
   - GitHub Pages is case-sensitive for some configurations

---

## Important Notes

- **GitHub Pages IPs**: GitHub Pages uses multiple IP addresses. It's recommended to add all 4 A records for redundancy.
- **CNAME File**: The CNAME file in your repository tells GitHub to use your custom domain. Don't delete it!
- **HTTPS**: GitHub will automatically provision an SSL certificate once DNS is configured correctly.
- **Updates**: Any time you push changes to the `main` branch, GitHub Pages will automatically rebuild and deploy your site.

---

## Quick Reference: GitHub Pages IP Addresses

```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

---

## After Deployment

Once your site is live:
1. Test all pages and links
2. Verify mobile responsiveness
3. Check that images load correctly
4. Test the contact form (if it has backend functionality)

---

## Updating Your Site After Deployment

After your initial deployment, you can easily update your website by pushing changes to GitHub. GitHub Pages will automatically rebuild and deploy your site whenever you push to the `main` branch.

### Step 1: Make Your Changes Locally

Edit your files in your local directory (`/Users/beamlaktareke/Documents/website`):
- Edit HTML files (index.html, build.html, create.html, design.html, share.html)
- Update styles.css for styling changes
- Modify script.js for functionality changes
- Add or update images in the Pictures folder

### Step 2: Check What Changed

Before committing, you can see what files you've modified:

```bash
cd /Users/beamlaktareke/Documents/website
git status
```

This shows you which files have been changed, added, or deleted.

### Step 3: Stage Your Changes

Add the files you want to commit. You can add specific files or all changes:

**To add all changes:**
```bash
git add .
```

**To add specific files:**
```bash
git add index.html styles.css script.js
```

### Step 4: Commit Your Changes

Create a commit with a descriptive message:

```bash
git commit -m "Update homepage content and styles"
```

**Good commit messages:**
- "Fix mobile navigation menu"
- "Add new project to portfolio"
- "Update contact information"
- "Improve accessibility on build page"

### Step 5: Push to GitHub

Push your changes to GitHub:

```bash
git push origin main
```

### Step 6: Wait for Deployment

- GitHub Pages automatically rebuilds your site (usually takes 1-2 minutes)
- You can check deployment status in your GitHub repo:
  - Go to your repository
  - Click on **"Actions"** tab (if visible)
  - Or check the **"Settings"** → **"Pages"** section
- Your changes will be live at `https://beamlaktareke.com` within a few minutes

### Quick Update Workflow (Summary)

```bash
# Navigate to your project directory
cd /Users/beamlaktareke/Documents/website

# Make your changes to files (edit in your code editor)

# Stage all changes
git add .

# Commit with a message
git commit -m "Your descriptive message here"

# Push to GitHub
git push origin main
```

### Tips for Updating

1. **Test locally first**: Open your HTML files in a browser to preview changes before pushing
2. **Commit often**: Make small, focused commits rather than one large commit
3. **Use descriptive messages**: Your future self will thank you
4. **Don't delete the CNAME file**: Keep it in your repository to maintain your custom domain
5. **Check your site after deployment**: Visit your live site to verify changes appear correctly

### Common Update Scenarios

**Updating content:**
- Edit HTML files → `git add .` → `git commit -m "Update content"` → `git push origin main`

**Changing styles:**
- Edit styles.css → `git add styles.css` → `git commit -m "Update styling"` → `git push origin main`

**Adding new images:**
- Add image to Pictures folder → `git add Pictures/newimage.jpg` → `git commit -m "Add new image"` → `git push origin main`

**Updating multiple files:**
- Make changes → `git add .` → `git commit -m "Multiple updates"` → `git push origin main`

---

**Need Help?** 
- GitHub Pages Documentation: https://docs.github.com/en/pages
- Cloudflare DNS Documentation: https://developers.cloudflare.com/dns/


