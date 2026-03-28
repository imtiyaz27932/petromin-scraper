# Petromin Offer Scraper v5

Automated scraper for **Petromin Express** + **Petromin Autocare** offers with **English & Arabic** support.

## Features

- ✅ Scrapes from **2 websites**: Petromin Express + Petromin Autocare
- ✅ **20 rows per sheet**: 10 Express + 10 Autocare
- ✅ Export to Excel with **2 sheets** (English & Arabic)
- ✅ **🔥 Google Sheets Integration** - Auto-sync to your Google Sheet
- ✅ Tab interface to switch between EN/AR offers
- ✅ Visual separation between Express and Autocare offers

## Google Sheets Integration Setup

### Step 1: Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Enable the **Google Sheets API**:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click "Enable"

### Step 2: Create a Service Account
1. Go to "IAM & Admin" > "Service Accounts"
2. Click "Create Service Account"
3. Give it a name (e.g., "petromin-scraper")
4. Click "Create and Continue"
5. Skip the optional steps and click "Done"

### Step 3: Create a Key
1. Click on the service account you created
2. Go to "Keys" tab
3. Click "Add Key" > "Create new key" > JSON
4. Download the JSON file

### Step 4: Share Your Google Sheet
1. Open your Google Sheet: https://docs.google.com/spreadsheets/d/1ESKk3gYHl7KvbblRRJvpVDnEaI-GOGCHud1OQhzFgR4
2. Click "Share"
3. Add the service account email (looks like: `name@project.iam.gserviceaccount.com`)
4. Give it **"Editor"** access

### Step 5: Add Environment Variable to Vercel
1. Go to your Vercel project settings
2. Go to "Environment Variables"
3. Add a new variable:
   - Name: `GOOGLE_SERVICE_ACCOUNT_KEY`
   - Value: Paste the **entire JSON content** from the downloaded file
4. Click "Save"
5. **Redeploy your app** (go to Deployments > click "..." > Redeploy)

## Sheet Layout

| Rows | Business |
|------|----------|
| 1-10 | Petromin Express |
| 11-20 | Petromin Autocare |

## Column Structure (11 Columns)

| # | Column | Description |
|---|--------|-------------|
| 1 | ID | 1-20 (1-10 Express, 11-20 Autocare) |
| 2 | Business Name | Petromin Express / Petromin Autocare |
| 3 | Language | English / Arabic |
| 4 | Section Name | Our Offers / اكتشف عروضنا |
| 5 | Main Heading | Title + Summary merged |
| 6 | Summary | Detail page content |
| 7 | Image URL | Full URL to image |
| 8 | Additional Info | Copy of Summary |
| 9 | Terms and Conditions | T&C or "NA" if none |
| 10 | T&C Formatted | Bullet-point formatted T&C |
| 11 | Additional Info Formatted | Bullet-point formatted Additional Info |

## Data Sources

### Petromin Express
- **English:** https://petromin.express/en/petromin-express-offers/
- **Arabic:** https://petromin.express/petromin-express-offers/

### Petromin Autocare
- **English:** https://petrominauto.care/en/petromin-autocare-offers/
- **Arabic:** https://petrominauto.care/petromin-autocare-offers/

## Deployment

1. Push to GitHub
2. Connect to Vercel
3. Add `GOOGLE_SERVICE_ACCOUNT_KEY` environment variable
4. Deploy automatically

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Google Sheets API (googleapis)
- SheetJS (Excel export)
