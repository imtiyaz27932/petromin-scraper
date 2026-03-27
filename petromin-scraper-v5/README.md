# Petromin Offer Scraper v5

Automated scraper for **Petromin Express** + **Petromin Autocare** offers with **English & Arabic** support.

## Features

- ✅ Scrapes from **2 websites**: Petromin Express + Petromin Autocare
- ✅ **20 rows per sheet**: 10 Express + 10 Autocare
- ✅ Export to Excel with **2 sheets** (English & Arabic)
- ✅ Tab interface to switch between EN/AR offers
- ✅ Visual separation between Express and Autocare offers

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

## Offers Scraped

### Petromin Express (4 base offers → 10 rows)
1. Buy Tires Now & Pay Later with Tamara
2. FREE Roadside Assistance Service
3. Headlight Polish Service
4. Battery Buy-Back Offer

### Petromin Autocare (2 base offers → 10 rows)
1. Hyundai Brake Pad Offer (SAR 399-599)
2. Toyota Brake Pad Offer (SAR 399-599)

## Deployment

1. Push to GitHub
2. Connect to Vercel
3. Deploy automatically

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- SheetJS (Excel export)
