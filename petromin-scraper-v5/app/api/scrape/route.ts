import { NextResponse } from 'next/server';
import { scrapeOffers } from '@/lib/scraper';

export async function GET() {
  try {
    const result = await scrapeOffers();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to scrape offers',
        englishOffers: [],
        arabicOffers: [],
        scrapedAt: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
