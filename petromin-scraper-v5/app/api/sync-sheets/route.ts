import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

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

// Google Sheet ID from URL
const SPREADSHEET_ID = '1i06C134REepCwvr-LXaIIQnEOyYJp6yQGDClCWQjbx4';

async function getAuthClient() {h
  // Get credentials from environment variable
  const credentials = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  
  if (!credentials) {
    throw new Error('GOOGLE_SERVICE_ACCOUNT_KEY environment variable is not set');
  }

  const parsedCredentials = JSON.parse(credentials);
  
  const auth = new google.auth.GoogleAuth({
    credentials: parsedCredentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  return auth;
}

export async function POST(request: NextRequest) {
  try {
    const { englishOffers, arabicOffers } = await request.json();
    
    const auth = await getAuthClient();
    const sheets = google.sheets({ version: 'v4', auth });

    // Headers for the sheets (11 columns)
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

    // Prepare English data
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

    // Prepare Arabic data
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

    // Clear and update English sheet (Petromin(Eng))
    await sheets.spreadsheets.values.clear({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Petromin(Eng)!A:K',
    });

    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Petromin(Eng)!A1',
      valueInputOption: 'RAW',
      requestBody: {
        values: englishData,
      },
    });

    // Check if Petromin(Ar) exists, if not create it
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
    });

    const sheetNames = spreadsheet.data.sheets?.map(s => s.properties?.title) || [];
    
    if (!sheetNames.includes('Petromin(Ar)')) {
      // Create Petromin(Ar)
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
        requestBody: {
          requests: [
            {
              addSheet: {
                properties: {
                  title: 'Petromin(Ar)',
                },
              },
            },
          ],
        },
      });
    }

    // Clear and update Arabic sheet (Petromin(Ar))
    await sheets.spreadsheets.values.clear({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Petromin(Ar)!A:K',
    });

    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Petromin(Ar)!A1',
      valueInputOption: 'RAW',
      requestBody: {
        values: arabicData,
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: `Successfully synced ${englishOffers.length} English + ${arabicOffers.length} Arabic offers to Google Sheets`,
      sheetsUrl: `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}`
    });

  } catch (error) {
    console.error('Google Sheets sync error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to sync with Google Sheets' 
      },
      { status: 500 }
    );
  }
}
