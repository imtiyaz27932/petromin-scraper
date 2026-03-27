import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';

interface Offer {
  id: number;
  businessName: string;
  language: string;
  sectionName: string;
  mainHeading: string;
  summary: string;
  imageUrl: string;
  additionalInfo: string;
  termsConditions: string;
  tcFormatted: string;
  additionalFormatted: string;
}

export async function POST(request: NextRequest) {
  try {
    const { englishOffers, arabicOffers } = await request.json();
    
    // Create workbook
    const workbook = XLSX.utils.book_new();
    
    // Headers - 11 columns
    const headers = [
      'ID',
      'Business Name',
      'Language',
      'Section Name',
      'Main Heading',
      'Summary',
      'Image URL',
      'Additional Info',
      'Terms and Conditions',
      'T&C Formatted',
      'Additional Info Formatted'
    ];
    
    // Create English sheet (Petromin Express 1-10 + Petromin Autocare 11-20)
    const englishData = [
      headers,
      ...englishOffers.map((offer: Offer) => [
        offer.id,
        offer.businessName,
        offer.language,
        offer.sectionName,
        offer.mainHeading,
        offer.summary,
        offer.imageUrl,
        offer.additionalInfo,
        offer.termsConditions,
        offer.tcFormatted,
        offer.additionalFormatted,
      ])
    ];
    
    const englishSheet = XLSX.utils.aoa_to_sheet(englishData);
    
    // Set column widths for English sheet
    englishSheet['!cols'] = [
      { wch: 5 },   // ID
      { wch: 18 },  // Business Name
      { wch: 10 },  // Language
      { wch: 20 },  // Section Name
      { wch: 50 },  // Main Heading
      { wch: 50 },  // Summary
      { wch: 60 },  // Image URL
      { wch: 50 },  // Additional Info
      { wch: 60 },  // Terms and Conditions
      { wch: 50 },  // T&C Formatted
      { wch: 50 },  // Additional Info Formatted
    ];
    
    XLSX.utils.book_append_sheet(workbook, englishSheet, 'Petromin Offers (Eng)');
    
    // Create Arabic sheet (Petromin Express 1-10 + Petromin Autocare 11-20)
    const arabicData = [
      headers,
      ...arabicOffers.map((offer: Offer) => [
        offer.id,
        offer.businessName,
        offer.language,
        offer.sectionName,
        offer.mainHeading,
        offer.summary,
        offer.imageUrl,
        offer.additionalInfo,
        offer.termsConditions,
        offer.tcFormatted,
        offer.additionalFormatted,
      ])
    ];
    
    const arabicSheet = XLSX.utils.aoa_to_sheet(arabicData);
    
    // Set column widths for Arabic sheet
    arabicSheet['!cols'] = [
      { wch: 5 },   // ID
      { wch: 18 },  // Business Name
      { wch: 10 },  // Language
      { wch: 20 },  // Section Name
      { wch: 50 },  // Main Heading
      { wch: 50 },  // Summary
      { wch: 60 },  // Image URL
      { wch: 50 },  // Additional Info
      { wch: 60 },  // Terms and Conditions
      { wch: 50 },  // T&C Formatted
      { wch: 50 },  // Additional Info Formatted
    ];
    
    XLSX.utils.book_append_sheet(workbook, arabicSheet, 'Petromin Offers (Arabic)');
    
    // Generate buffer
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="petromin_all_offers_${new Date().toISOString().split('T')[0]}.xlsx"`,
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
