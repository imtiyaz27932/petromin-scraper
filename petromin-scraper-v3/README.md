# Petromin Express Offer Scraper v3

Automated scraper for Petromin Express offers with **English & Arabic** support.

## Features

- ✅ Scrapes offers from both English and Arabic websites
- ✅ Always outputs exactly **10 offers per language** (duplicates if less, trims if more)
- ✅ Export to Excel with **2 separate sheets** (matching Google Sheets format)
- ✅ Tab interface to switch between EN/AR offers
- ✅ Copy for Google Sheets (tab-separated format)

## Output Format

### Excel Export (2 Sheets)
- **Sheet 1:** "Petromin Express (Eng)" - 10 English offers
- **Sheet 2:** "Petromin Express (Arabic)" - 10 Arabic offers

### Columns (Same for both sheets)
| Column | Description |
|--------|-------------|
| ID | 1-10 |
| Business Name | Petromin Express |
| Language | English / Arabic |
| Section Name | Our Offers / عروضنا |
| Main Heading | Offer title |
| Summary | Bullet points |
| Image Description | Image alt text |
| Image URL | Full URL to image |
| Additional Info | Extended description |
| Terms and Conditions | Full T&C text |

## Data Sources

- **English:** https://petromin.express/en/petromin-express-offers/
- **Arabic:** https://petromin.express/petromin-express-offers/

## Deployment

1. Push to GitHub
2. Connect to Vercel
3. Deploy automatically

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Cheerio (scraping)
- SheetJS (Excel export)
