'use client';

import { useState } from 'react';
import { Play, Download, Copy, RefreshCw, CheckCircle, AlertCircle, ExternalLink, Loader2 } from 'lucide-react';

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
  tcFormatted: string;
  additionalFormatted: string;
  offerUrl: string;
}

type Status = 'idle' | 'scraping' | 'success' | 'error';

const HEADERS = [
  'ID', 'Business Name', 'Language', 'Section Name', 'Main Heading',
  'Summary', 'Image Description', 'Image URL', 'Additional Info',
  'Terms and Conditions', 'T&C Formatted', 'Additional Info Formatted'
];

export default function Home() {
  const [status, setStatus] = useState<Status>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [offers, setOffers] = useState<Offer[]>([]);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [scrapedAt, setScrapedAt] = useState('');

  const runScraper = async () => {
    setStatus('scraping');
    setError('');
    setOffers([]);
    
    const messages = [
      'Connecting to Petromin Express...',
      'Fetching offers page...',
      'Extracting offer details...',
      'Scraping Terms & Conditions...',
      'Processing data...',
    ];
    
    for (const msg of messages) {
      setStatusMessage(msg);
      await new Promise(r => setTimeout(r, 600));
    }
    
    try {
      const response = await fetch('/api/scrape');
      const data = await response.json();
      
      if (data.success && data.offers.length > 0) {
        setOffers(data.offers);
        setScrapedAt(data.scrapedAt);
        setStatus('success');
        setStatusMessage(`Successfully scraped ${data.offers.length} offers`);
      } else {
        throw new Error(data.error || 'No offers found');
      }
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Scraping failed');
      setStatusMessage('');
    }
  };

  const copyForSheets = async () => {
    const rows = [HEADERS];
    offers.forEach(o => {
      rows.push([
        String(o.id), o.businessName, o.language, o.sectionName,
        o.mainHeading, o.summary, o.imageDescription, o.imageUrl,
        o.additionalInfo, o.termsConditions, o.tcFormatted, o.additionalFormatted
      ]);
    });
    const tsv = rows.map(r => r.join('\t')).join('\n');
    
    await navigator.clipboard.writeText(tsv);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exportExcel = async () => {
    try {
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ offers }),
      });
      
      if (!response.ok) throw new Error('Export failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `petromin_offers_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (err) {
      console.error('Export error:', err);
      alert('Failed to export Excel file');
    }
  };

  return (
    <main className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-petromin-red to-red-500 shadow-lg mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Petromin Express Offer Scraper</h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            Automatically scrape all offers from Petromin Express and export to Excel or Google Sheets
          </p>
        </div>

        {/* Control Panel */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                <span>Target:</span>
                <code className="bg-gray-100 px-2 py-1 rounded text-xs">petromin.express/en/petromin-express-offers/</code>
              </div>
              {scrapedAt && (
                <p className="text-xs text-gray-400">
                  Last scraped: {new Date(scrapedAt).toLocaleString()}
                </p>
              )}
            </div>
            
            <button
              onClick={runScraper}
              disabled={status === 'scraping'}
              className="inline-flex items-center gap-2 px-6 py-3 bg-petromin-red text-white rounded-xl font-medium hover:bg-petromin-darkred transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
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
          
          {/* Status Message */}
          {status === 'scraping' && (
            <div className="mt-4 flex items-center gap-3 text-sm text-blue-600 bg-blue-50 rounded-lg px-4 py-3">
              <Loader2 className="w-4 h-4 animate-spin" />
              {statusMessage}
            </div>
          )}
          
          {status === 'success' && (
            <div className="mt-4 flex items-center gap-3 text-sm text-green-600 bg-green-50 rounded-lg px-4 py-3">
              <CheckCircle className="w-4 h-4" />
              {statusMessage}
            </div>
          )}
          
          {status === 'error' && (
            <div className="mt-4 flex items-center gap-3 text-sm text-red-600 bg-red-50 rounded-lg px-4 py-3">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}
        </div>

        {/* Results */}
        {offers.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-slide-in">
            {/* Results Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Scraped Offers ({offers.length})
              </h2>
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
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-petromin-red rounded-lg hover:bg-petromin-darkred transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Export Excel
                </button>
              </div>
            </div>
            
            {/* Data Table - ALL 12 COLUMNS */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-red-600 text-white">
                  <tr>
                    <th className="px-3 py-3 text-left font-semibold whitespace-nowrap">ID</th>
                    <th className="px-3 py-3 text-left font-semibold whitespace-nowrap">Business Name</th>
                    <th className="px-3 py-3 text-left font-semibold whitespace-nowrap">Language</th>
                    <th className="px-3 py-3 text-left font-semibold whitespace-nowrap">Section Name</th>
                    <th className="px-3 py-3 text-left font-semibold whitespace-nowrap min-w-[200px]">Main Heading</th>
                    <th className="px-3 py-3 text-left font-semibold whitespace-nowrap min-w-[250px]">Summary</th>
                    <th className="px-3 py-3 text-left font-semibold whitespace-nowrap min-w-[180px]">Image Description</th>
                    <th className="px-3 py-3 text-left font-semibold whitespace-nowrap">Image URL</th>
                    <th className="px-3 py-3 text-left font-semibold whitespace-nowrap min-w-[200px]">Additional Info</th>
                    <th className="px-3 py-3 text-left font-semibold whitespace-nowrap min-w-[250px]">Terms & Conditions</th>
                    <th className="px-3 py-3 text-left font-semibold whitespace-nowrap min-w-[180px]">T&C Formatted</th>
                    <th className="px-3 py-3 text-left font-semibold whitespace-nowrap min-w-[180px]">Additional Info Formatted</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {offers.map((offer, idx) => (
                    <tr key={offer.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-3 py-3 text-gray-900 font-medium">{offer.id}</td>
                      <td className="px-3 py-3 text-gray-700">{offer.businessName}</td>
                      <td className="px-3 py-3 text-gray-700">{offer.language}</td>
                      <td className="px-3 py-3 text-gray-700">{offer.sectionName}</td>
                      <td className="px-3 py-3 text-gray-900 font-semibold">{offer.mainHeading}</td>
                      <td className="px-3 py-3 text-gray-700 text-xs">{offer.summary}</td>
                      <td className="px-3 py-3 text-gray-700 text-xs">{offer.imageDescription}</td>
                      <td className="px-3 py-3">
                        {offer.imageUrl && (
                          <a
                            href={offer.imageUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-xs underline"
                          >
                            View Image
                          </a>
                        )}
                      </td>
                      <td className="px-3 py-3 text-gray-700 text-xs">{offer.additionalInfo}</td>
                      <td className="px-3 py-3 text-gray-700 text-xs">{offer.termsConditions}</td>
                      <td className="px-3 py-3 text-gray-700 text-xs whitespace-pre-line">{offer.tcFormatted?.replace(/\\n/g, '\n')}</td>
                      <td className="px-3 py-3 text-gray-700 text-xs whitespace-pre-line">{offer.additionalFormatted?.replace(/\\n/g, '\n')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Click &quot;Run Scraper&quot; to fetch the latest offers from Petromin Express.</p>
          <p className="mt-1">Use &quot;Copy for Sheets&quot; to paste directly into Google Sheets, or &quot;Export Excel&quot; to download.</p>
        </div>
      </div>
    </main>
  );
}
