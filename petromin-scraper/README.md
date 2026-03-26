# Petromin Express Offer Scraper

A live web application that automatically scrapes offers from the Petromin Express website and exports them to Excel or Google Sheets.

![Petromin Scraper](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue?logo=typescript)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)

## Features

- 🚀 **One-click scraping** - Automatically scrape all offers from Petromin Express
- 📊 **Excel Export** - Download formatted .xlsx file
- 📋 **Google Sheets** - Copy tab-separated data for direct paste
- 🔄 **Live Data** - Always fetch the latest offers
- 👥 **Team Ready** - Deploy once, use by entire team

## Quick Deploy to Vercel

### Option 1: Deploy with Git (Recommended)

1. **Push to GitHub**
   ```bash
   # Initialize git repository
   git init
   git add .
   git commit -m "Initial commit"
   
   # Create a new repo on GitHub, then:
   git remote add origin https://github.com/YOUR_USERNAME/petromin-scraper.git
   git branch -M main
   git push -u origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up/Login with GitHub
   - Click "New Project"
   - Import your `petromin-scraper` repository
   - Click "Deploy"
   - Done! Your app is live at `https://your-project.vercel.app`

### Option 2: Deploy with Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow the prompts to link/create project
```

## Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

## Project Structure

```
petromin-scraper/
├── app/
│   ├── api/
│   │   ├── scrape/route.ts    # Scraping API endpoint
│   │   └── export/route.ts    # Excel export endpoint
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Main page with UI
├── lib/
│   └── scraper.ts             # Core scraping logic
├── public/                    # Static assets
├── package.json
├── next.config.js
├── tailwind.config.js
└── tsconfig.json
```

## API Endpoints

### GET /api/scrape
Scrapes all offers from Petromin Express website.

**Response:**
```json
{
  "success": true,
  "offers": [...],
  "scrapedAt": "2024-03-26T10:30:00.000Z"
}
```

### POST /api/export
Generates Excel file from offers data.

**Request Body:**
```json
{
  "offers": [...]
}
```

**Response:** Downloads `.xlsx` file

## Data Columns

| Column | Description |
|--------|-------------|
| ID | Unique identifier |
| Business Name | Always "Petromin Express" |
| Language | EN |
| Section Name | Offers |
| Main Heading | Offer title |
| Summary | Brief description |
| Image Description | Image alt text |
| Image URL | Link to offer image |
| Additional Info | Extra details |
| Terms and Conditions | Full T&C text |
| T&C Formatted | Bullet-point T&C |
| Additional Info Formatted | Bullet-point info |
| Offer URL | Link to offer page |

## Customization

### Add New Offer Sources
Edit `lib/scraper.ts` to add more pages to scrape:

```typescript
const OFFER_PAGES = [
  { url: 'https://...', mainPageHeading: '...' },
  // Add more pages here
];
```

### Styling
Modify `app/globals.css` and `tailwind.config.js` for custom branding.

## Environment Variables

No environment variables required for basic deployment.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Scraping:** Cheerio
- **Excel:** SheetJS (xlsx)
- **Icons:** Lucide React

## License

MIT
