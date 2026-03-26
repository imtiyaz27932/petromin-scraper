import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Petromin Express Offer Scraper',
  description: 'Automatically scrape offers from Petromin Express website and export to Excel/Google Sheets',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
