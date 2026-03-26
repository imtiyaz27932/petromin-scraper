import { NextResponse } from 'next/server';
import { scrapeOffers } from '@/lib/scraper';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET() {
  try {
    const result = await scrapeOffers();
    return NextResponse.json(result);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Scraping failed',
        offers: [],
        scrapedAt: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
