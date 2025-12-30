# Cloudflare DNS Configuration for beamlaktareke.com

## Quick Setup Guide

### Step 1: Log into Cloudflare
1. Go to https://dash.cloudflare.com
2. Select your domain: **beamlaktareke.com**

### Step 2: Navigate to DNS Settings
1. Click **"DNS"** in the left sidebar
2. Click **"Records"**

### Step 3: Add/Update DNS Records

#### A Records (for apex domain - beamlaktareke.com)

Add these **4 A records** (one for each IP address):

| Type | Name | IPv4 Address | Proxy | TTL |
|------|------|--------------|-------|-----|
| A | @ | 185.199.108.153 | DNS only or Proxied | Auto |
| A | @ | 185.199.109.153 | DNS only or Proxied | Auto |
| A | @ | 185.199.110.153 | DNS only or Proxied | Auto |
| A | @ | 185.199.111.153 | DNS only or Proxied | Auto |

**How to add:**
1. Click **"Add record"**
2. Select **Type**: A
3. Enter **Name**: `@` (this represents the apex domain)
4. Enter **IPv4 address**: One of the IPs above
5. **Proxy status**: Choose either:
   - **DNS only** (gray cloud icon) - Direct DNS resolution
   - **Proxied** (orange cloud icon) - Goes through Cloudflare CDN (recommended for performance)
6. **TTL**: Auto
7. Click **"Save"**
8. Repeat for all 4 IP addresses

#### CNAME Record (for www subdomain - optional but recommended)

| Type | Name | Target | Proxy | TTL |
|------|------|--------|-------|-----|
| CNAME | www | YOUR_USERNAME.github.io | DNS only or Proxied | Auto |

**Note**: Replace `YOUR_USERNAME` with your actual GitHub username.

**How to add:**
1. Click **"Add record"**
2. Select **Type**: CNAME
3. Enter **Name**: `www`
4. Enter **Target**: `YOUR_USERNAME.github.io` (replace YOUR_USERNAME)
5. **Proxy status**: DNS only or Proxied
6. **TTL**: Auto
7. Click **"Save"**

### Step 4: Configure SSL/TLS

1. Click **"SSL/TLS"** in the left sidebar
2. Under **"Overview"**, select:
   - **Full** (works with GitHub Pages)
   - **Full (strict)** (more secure, recommended if available)

### Step 5: Verify Settings

Your DNS records should look similar to this:

```
Type    Name    Content                    Proxy   TTL
A       @       185.199.108.153            ✓       Auto
A       @       185.199.109.153            ✓       Auto
A       @       185.199.110.153            ✓       Auto
A       @       185.199.111.153            ✓       Auto
CNAME   www     YOUR_USERNAME.github.io    ✓       Auto
```

### Important Notes

- **Proxy Status**: 
  - **Gray cloud (DNS only)**: Direct DNS, faster propagation
  - **Orange cloud (Proxied)**: Uses Cloudflare CDN, better performance and security
  - Both work with GitHub Pages, choose based on your preference

- **TTL**: Leave as "Auto" - Cloudflare will optimize this automatically

- **Existing Records**: If you have existing A or CNAME records for `@` or `www`, you may need to delete or update them first

### After Configuration

1. **Wait 5-30 minutes** for DNS propagation
2. Check DNS propagation: https://www.whatsmydns.net/#A/beamlaktareke.com
3. Visit your site: https://beamlaktareke.com
4. GitHub will provision SSL certificate within 24 hours

### Troubleshooting

**If DNS isn't working:**
- Verify all 4 A records are added correctly
- Check that IP addresses are exactly as shown above
- Ensure no conflicting records exist
- Wait a bit longer (DNS can take up to 48 hours, but usually works in minutes)

**If SSL certificate isn't working:**
- Ensure SSL/TLS mode is set to "Full" or "Full (strict)"
- Wait up to 24 hours for GitHub to provision the certificate
- Check GitHub Pages settings show your custom domain






