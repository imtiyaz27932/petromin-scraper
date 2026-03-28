'use client';

import { useState } from 'react';
import { Play, Download, Copy, RefreshCw, CheckCircle, AlertCircle, Loader2, Cloud } from 'lucide-react';

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

export default function Home() {
  const [englishOffers, setEnglishOffers] = useState<Offer[]>([]);
  const [arabicOffers, setArabicOffers] = useState<Offer[]>([]);
  const [status, setStatus] = useState<'idle' | 'scraping' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [error, setError] = useState('');
  const [scrapedAt, setScrapedAt] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'english' | 'arabic'>('english');
  const [syncing, setSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [syncMessage, setSyncMessage] = useState('');

  const runScraper = async () => {
    setStatus('scraping');
    setError('');
    setEnglishOffers([]);
    setArabicOffers([]);

    const messages = [
      'Connecting to Petromin Express...',
      'Fetching English offers...',
      'Connecting to Petromin Autocare...',
      'Fetching Autocare offers...',
      'Fetching Arabic offers...',
      'Processing data...',
    ];

    for (const msg of messages) {
      setStatusMessage(msg);
      await new Promise(r => setTimeout(r, 500));
    }

    try {
      const response = await fetch('/api/scrape');
      const data = await response.json();

      if (data.success && (data.englishOffers.length > 0 || data.arabicOffers.length > 0)) {
        setEnglishOffers(data.englishOffers);
        setArabicOffers(data.arabicOffers);
        setScrapedAt(data.scrapedAt);
        setStatus('success');
        setStatusMessage(`Successfully scraped ${data.englishOffers.length} EN + ${data.arabicOffers.length} AR offers (Express + Autocare)`);
      } else {
        setStatus('error');
        setError(data.error || 'No offers found');
      }
    } catch (err) {
      setStatus('error');
      setError('Failed to connect to scraper API');
    }
  };

  const copyForSheets = () => {
    const offers = activeTab === 'english' ? englishOffers : arabicOffers;
    const headers = [
      'ID', 'Business Name', 'Language', 'Section Name', 'Main Heading', 
      'Summary', 'Image URL', 'Additional Info', 'Terms and Conditions',
      'T&C Formatted', 'Additional Info Formatted'
    ];
    
    const rows = offers.map(offer => [
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
    ].join('\t'));

    const content = [headers.join('\t'), ...rows].join('\n');
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exportExcel = async () => {
    try {
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ englishOffers, arabicOffers }),
      });

      if (!response.ok) throw new Error('Export failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `petromin_all_offers_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (err) {
      console.error('Export error:', err);
      alert('Failed to export Excel file');
    }
  };

  const syncToGoogleSheets = async () => {
    if (englishOffers.length === 0 && arabicOffers.length === 0) {
      alert('No data to sync. Run the scraper first.');
      return;
    }

    setSyncing(true);
    setSyncStatus('idle');
    setSyncMessage('Syncing to Google Sheets...');

    try {
      const response = await fetch('/api/sync-sheets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ englishOffers, arabicOffers }),
      });

      const data = await response.json();

      if (data.success) {
        setSyncStatus('success');
        setSyncMessage(data.message);
      } else {
        setSyncStatus('error');
        setSyncMessage(data.error || 'Sync failed');
      }
    } catch (err) {
      console.error('Sync error:', err);
      setSyncStatus('error');
      setSyncMessage('Failed to sync with Google Sheets');
    } finally {
      setSyncing(false);
    }
  };

  const currentOffers = activeTab === 'english' ? englishOffers : arabicOffers;

  // Separate Express and Autocare offers for display
  const expressOffers = currentOffers.filter(o => o.businessName === 'Petromin Express');
  const autocareOffers = currentOffers.filter(o => o.businessName === 'Petromin Autocare');

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-[2000px] mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-petromin-red rounded-2xl mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Petromin Offer Scraper v5</h1>
          <p className="text-gray-600">Scrape offers from Petromin Express + Petromin Autocare (EN &amp; AR)</p>
          <p className="text-sm text-gray-500 mt-1">20 rows per sheet: 10 Express + 10 Autocare</p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm text-gray-500 font-medium">Data Sources:</p>
              <p className="text-xs text-gray-400">• Petromin Express: petromin.express/en/ &amp; petromin.express/</p>
              <p className="text-xs text-gray-400">• Petromin Autocare: petrominauto.care/en/ &amp; petrominauto.care/</p>
              {scrapedAt && (
                <p className="text-xs text-gray-400 mt-1">
                  Last scraped: {new Date(scrapedAt).toLocaleString()}
                </p>
              )}
            </div>
            <button
              onClick={runScraper}
              disabled={status === 'scraping'}
              className="inline-flex items-center gap-2 px-6 py-3 bg-petromin-red text-white rounded-xl font-medium hover:bg-petromin-darkred transition-all disabled:opacity-50"
            >
              {status === 'scraping' ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Scraping...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  Run Scraper
                </>
              )}
            </button>
          </div>

          {status !== 'idle' && (
            <div className={`mt-4 p-3 rounded-lg flex items-center gap-2 ${
              status === 'scraping' ? 'bg-blue-50 text-blue-700' :
              status === 'success' ? 'bg-green-50 text-green-700' :
              'bg-red-50 text-red-700'
            }`}>
              {status === 'scraping' && <RefreshCw className="w-4 h-4 animate-spin" />}
              {status === 'success' && <CheckCircle className="w-4 h-4" />}
              {status === 'error' && <AlertCircle className="w-4 h-4" />}
              <span className="text-sm">{error || statusMessage}</span>
            </div>
          )}
        </div>

        {/* Results */}
        {(englishOffers.length > 0 || arabicOffers.length > 0) && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Tabs Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setActiveTab('english')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    activeTab === 'english' 
                      ? 'bg-petromin-red text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Petromin Offers (Eng) ({englishOffers.length})
                </button>
                <button
                  onClick={() => setActiveTab('arabic')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    activeTab === 'arabic' 
                      ? 'bg-petromin-red text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Petromin Offers (Arabic) ({arabicOffers.length})
                </button>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={copyForSheets}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  {copied ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy for Sheets
                    </>
                  )}
                </button>
                <button
                  onClick={exportExcel}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Export Excel
                </button>
                <button
                  onClick={syncToGoogleSheets}
                  disabled={syncing || (englishOffers.length === 0 && arabicOffers.length === 0)}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {syncing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Syncing...
                    </>
                  ) : (
                    <>
                      <Cloud className="w-4 h-4" />
                      Sync to Google Sheets
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Sync Status Message */}
            {syncStatus !== 'idle' && (
              <div className={`mx-6 mt-4 p-3 rounded-lg flex items-center gap-2 ${
                syncStatus === 'success' ? 'bg-blue-50 text-blue-700' : 'bg-red-50 text-red-700'
              }`}>
                {syncStatus === 'success' ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <AlertCircle className="w-4 h-4" />
                )}
                <span className="text-sm">{syncMessage}</span>
                {syncStatus === 'success' && (
                  <a 
                    href="https://docs.google.com/spreadsheets/d/1i06C134REepCwvr-LXaIIQnEOyYJp6yQGDClCWQjbx4" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="ml-2 underline font-medium"
                  >
                    Open Sheet
                  </a>
                )}
              </div>
            )}

            {/* Petromin Express Section */}
            {expressOffers.length > 0 && (
              <div>
                <div className="bg-red-600 text-white px-6 py-3 font-semibold">
                  Petromin Express ({expressOffers.length} offers)
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead className="bg-red-100 text-red-800 sticky top-0">
                      <tr>
                        <th className="px-3 py-2 text-left font-semibold border border-red-200 whitespace-nowrap">ID</th>
                        <th className="px-3 py-2 text-left font-semibold border border-red-200 whitespace-nowrap">Business Name</th>
                        <th className="px-3 py-2 text-left font-semibold border border-red-200 whitespace-nowrap">Language</th>
                        <th className="px-3 py-2 text-left font-semibold border border-red-200 whitespace-nowrap">Section Name</th>
                        <th className="px-3 py-2 text-left font-semibold border border-red-200 whitespace-nowrap min-w-[250px]">Main Heading</th>
                        <th className="px-3 py-2 text-left font-semibold border border-red-200 whitespace-nowrap min-w-[250px]">Summary</th>
                        <th className="px-3 py-2 text-left font-semibold border border-red-200 whitespace-nowrap min-w-[150px]">Image URL</th>
                        <th className="px-3 py-2 text-left font-semibold border border-red-200 whitespace-nowrap min-w-[250px]">Additional Info</th>
                        <th className="px-3 py-2 text-left font-semibold border border-red-200 whitespace-nowrap min-w-[300px]">Terms and Conditions</th>
                        <th className="px-3 py-2 text-left font-semibold border border-red-200 whitespace-nowrap min-w-[250px]">T&amp;C Formatted</th>
                        <th className="px-3 py-2 text-left font-semibold border border-red-200 whitespace-nowrap min-w-[250px]">Additional Info Formatted</th>
                      </tr>
                    </thead>
                    <tbody>
                      {expressOffers.map((offer, index) => (
                        <tr key={`express-${offer.id}`} className={`hover:bg-yellow-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                          <td className="px-3 py-2 text-gray-900 font-medium border border-gray-200 align-top">{offer.id}</td>
                          <td className="px-3 py-2 text-gray-600 border border-gray-200 align-top whitespace-nowrap">{offer.businessName}</td>
                          <td className="px-3 py-2 text-gray-600 border border-gray-200 align-top">{offer.language}</td>
                          <td className="px-3 py-2 text-gray-600 border border-gray-200 align-top">{offer.sectionName}</td>
                          <td className="px-3 py-2 text-gray-900 font-medium border border-gray-200 align-top">
                            <div className="whitespace-pre-line text-xs leading-relaxed">{offer.mainHeading}</div>
                          </td>
                          <td className="px-3 py-2 text-gray-600 border border-gray-200 align-top">
                            <div className="whitespace-pre-line text-xs leading-relaxed">{offer.summary}</div>
                          </td>
                          <td className="px-3 py-2 border border-gray-200 align-top">
                            {offer.imageUrl && (
                              <a href={offer.imageUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-xs break-all underline">
                                {offer.imageUrl}
                              </a>
                            )}
                          </td>
                          <td className="px-3 py-2 text-gray-600 border border-gray-200 align-top">
                            <div className="whitespace-pre-line text-xs leading-relaxed">{offer.additionalInfo}</div>
                          </td>
                          <td className="px-3 py-2 text-gray-600 border border-gray-200 align-top">
                            <div className="whitespace-pre-line text-xs leading-relaxed">{offer.termsConditions}</div>
                          </td>
                          <td className="px-3 py-2 text-gray-600 border border-gray-200 align-top">
                            <div className="whitespace-pre-line text-xs leading-relaxed">{offer.tcFormatted}</div>
                          </td>
                          <td className="px-3 py-2 text-gray-600 border border-gray-200 align-top">
                            <div className="whitespace-pre-line text-xs leading-relaxed">{offer.additionalFormatted}</div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Petromin Autocare Section */}
            {autocareOffers.length > 0 && (
              <div>
                <div className="bg-gray-800 text-white px-6 py-3 font-semibold">
                  Petromin Autocare ({autocareOffers.length} offers)
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead className="bg-gray-100 text-gray-800 sticky top-0">
                      <tr>
                        <th className="px-3 py-2 text-left font-semibold border border-gray-200 whitespace-nowrap">ID</th>
                        <th className="px-3 py-2 text-left font-semibold border border-gray-200 whitespace-nowrap">Business Name</th>
                        <th className="px-3 py-2 text-left font-semibold border border-gray-200 whitespace-nowrap">Language</th>
                        <th className="px-3 py-2 text-left font-semibold border border-gray-200 whitespace-nowrap">Section Name</th>
                        <th className="px-3 py-2 text-left font-semibold border border-gray-200 whitespace-nowrap min-w-[250px]">Main Heading</th>
                        <th className="px-3 py-2 text-left font-semibold border border-gray-200 whitespace-nowrap min-w-[250px]">Summary</th>
                        <th className="px-3 py-2 text-left font-semibold border border-gray-200 whitespace-nowrap min-w-[150px]">Image URL</th>
                        <th className="px-3 py-2 text-left font-semibold border border-gray-200 whitespace-nowrap min-w-[250px]">Additional Info</th>
                        <th className="px-3 py-2 text-left font-semibold border border-gray-200 whitespace-nowrap min-w-[300px]">Terms and Conditions</th>
                        <th className="px-3 py-2 text-left font-semibold border border-gray-200 whitespace-nowrap min-w-[250px]">T&amp;C Formatted</th>
                        <th className="px-3 py-2 text-left font-semibold border border-gray-200 whitespace-nowrap min-w-[250px]">Additional Info Formatted</th>
                      </tr>
                    </thead>
                    <tbody>
                      {autocareOffers.map((offer, index) => (
                        <tr key={`autocare-${offer.id}`} className={`hover:bg-yellow-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                          <td className="px-3 py-2 text-gray-900 font-medium border border-gray-200 align-top">{offer.id}</td>
                          <td className="px-3 py-2 text-gray-600 border border-gray-200 align-top whitespace-nowrap">{offer.businessName}</td>
                          <td className="px-3 py-2 text-gray-600 border border-gray-200 align-top">{offer.language}</td>
                          <td className="px-3 py-2 text-gray-600 border border-gray-200 align-top">{offer.sectionName}</td>
                          <td className="px-3 py-2 text-gray-900 font-medium border border-gray-200 align-top">
                            <div className="whitespace-pre-line text-xs leading-relaxed">{offer.mainHeading}</div>
                          </td>
                          <td className="px-3 py-2 text-gray-600 border border-gray-200 align-top">
                            <div className="whitespace-pre-line text-xs leading-relaxed">{offer.summary}</div>
                          </td>
                          <td className="px-3 py-2 border border-gray-200 align-top">
                            {offer.imageUrl && (
                              <a href={offer.imageUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-xs break-all underline">
                                {offer.imageUrl}
                              </a>
                            )}
                          </td>
                          <td className="px-3 py-2 text-gray-600 border border-gray-200 align-top">
                            <div className="whitespace-pre-line text-xs leading-relaxed">{offer.additionalInfo}</div>
                          </td>
                          <td className="px-3 py-2 text-gray-600 border border-gray-200 align-top">
                            <div className="whitespace-pre-line text-xs leading-relaxed">{offer.termsConditions}</div>
                          </td>
                          <td className="px-3 py-2 text-gray-600 border border-gray-200 align-top">
                            <div className="whitespace-pre-line text-xs leading-relaxed">{offer.tcFormatted}</div>
                          </td>
                          <td className="px-3 py-2 text-gray-600 border border-gray-200 align-top">
                            <div className="whitespace-pre-line text-xs leading-relaxed">{offer.additionalFormatted}</div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Legend */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>Click &quot;Run Scraper&quot; to fetch offers from Petromin Express &amp; Petromin Autocare.</p>
          <p>Use &quot;Export Excel&quot; to download with 2 sheets (English &amp; Arabic) - 20 rows each.</p>
          <p className="mt-2 text-xs text-gray-400">
            Sheet Layout: Rows 1-10 = Petromin Express | Rows 11-20 = Petromin Autocare
          </p>
        </div>
      </div>
    </main>
  );
}
