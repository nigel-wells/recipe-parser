import type { Metadata } from 'next';
import './globals.css';
import '../styles/print.css';

export const metadata: Metadata = {
  title: 'Recipe Parser - Convert and Save Recipes',
  description: 'Parse recipes from any URL, convert measurements to metric (NZ), and save them locally.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-gray-50 via-white to-gray-100 min-h-screen">
        <nav className="print:hidden bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <a href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent hover:from-blue-700 hover:to-indigo-700 transition-all">
              🍳 Recipe Parser
            </a>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 print:py-0">
          {children}
        </main>
      </body>
    </html>
  );
}
