import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import { Offer } from '@/lib/scraper';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { offers }: { offers: Offer[] } = await request.json();
    
    if (!offers || !Array.isArray(offers)) {
      return NextResponse.json({ error: 'Invalid offers data' }, { status: 400 });
    }
    
    // Create workbook
    const wb = XLSX.utils.book_new();
    
    // Prepare data with headers
    const headers = [
      'ID',
      'Business Name',
      'Language',
      'Section Name',
      'Main Heading',
      'Summary',
      'Image Description',
      'Image URL',
      'Additional Info',
      'Terms and Conditions',
      'T&C Formatted',
      'Additional Info Formatted',
      'Offer URL',
    ];
    
    const data = offers.map(offer => [
      offer.id,
      offer.businessName,
      offer.language,
      offer.sectionName,
      offer.mainHeading,
      offer.summary,
      offer.imageDescription,
      offer.imageUrl,
      offer.additionalInfo,
      offer.termsConditions,
      offer.tcFormatted,
      offer.additionalFormatted,
      offer.offerUrl,
    ]);
    
    // Create worksheet
    const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);
    
    // Set column widths
    ws['!cols'] = [
      { wch: 5 },   // ID
      { wch: 18 },  // Business Name
      { wch: 10 },  // Language
      { wch: 12 },  // Section Name
      { wch: 40 },  // Main Heading
      { wch: 60 },  // Summary
      { wch: 40 },  // Image Description
      { wch: 70 },  // Image URL
      { wch: 50 },  // Additional Info
      { wch: 70 },  // Terms and Conditions
      { wch: 40 },  // T&C Formatted
      { wch: 40 },  // Additional Info Formatted
      { wch: 50 },  // Offer URL
    ];
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Petromin Offers');
    
    // Generate buffer
    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    
    // Return as downloadable file
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="petromin_offers_${new Date().toISOString().split('T')[0]}.xlsx"`,
      },
    });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Export failed' },
      { status: 500 }
    );
  }
}
