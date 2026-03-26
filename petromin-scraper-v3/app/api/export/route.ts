import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';

interface Offer {
  id: number;
  businessName: string;
  language: string;
  sectionName: string;
  mainHeading: string;
  summary: string;
  imageDescription: string;
  imageUrl: string;
  additionalInfo: string;
  termsConditions: string;
}

export async function POST(request: NextRequest) {
  try {
    const { englishOffers, arabicOffers } = await request.json();
    
    // Create workbook
    const workbook = XLSX.utils.book_new();
    
    // Headers matching Google Sheet format
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
      'Terms and Conditions'
    ];
    
    // Create English sheet
    const englishData = [
      headers,
      ...englishOffers.map((offer: Offer) => [
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
      ])
    ];
    
    const englishSheet = XLSX.utils.aoa_to_sheet(englishData);
    
    // Set column widths for English sheet
    englishSheet['!cols'] = [
      { wch: 5 },   // ID
      { wch: 18 },  // Business Name
      { wch: 10 },  // Language
      { wch: 15 },  // Section Name
      { wch: 40 },  // Main Heading
      { wch: 50 },  // Summary
      { wch: 40 },  // Image Description
      { wch: 60 },  // Image URL
      { wch: 50 },  // Additional Info
      { wch: 60 },  // Terms and Conditions
    ];
    
    XLSX.utils.book_append_sheet(workbook, englishSheet, 'Petromin Express (Eng)');
    
    // Create Arabic sheet
    const arabicData = [
      headers,
      ...arabicOffers.map((offer: Offer) => [
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
      ])
    ];
    
    const arabicSheet = XLSX.utils.aoa_to_sheet(arabicData);
    
    // Set column widths for Arabic sheet
    arabicSheet['!cols'] = [
      { wch: 5 },   // ID
      { wch: 18 },  // Business Name
      { wch: 10 },  // Language
      { wch: 15 },  // Section Name
      { wch: 40 },  // Main Heading
      { wch: 50 },  // Summary
      { wch: 40 },  // Image Description
      { wch: 60 },  // Image URL
      { wch: 50 },  // Additional Info
      { wch: 60 },  // Terms and Conditions
    ];
    
    XLSX.utils.book_append_sheet(workbook, arabicSheet, 'Petromin Express (Arabic)');
    
    // Generate buffer
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="petromin_offers_${new Date().toISOString().split('T')[0]}.xlsx"`,
      },
    });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'Failed to export offers' },
      { status: 500 }
    );
  }
}
