import type { Metadata, Viewport } from 'next';
import { Suspense } from 'react';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/context/AuthContext';
import FirestoreSync from '@/components/FirestoreSync';
import NavigationProgress from '@/components/ui/NavigationProgress';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import JsonLd from '@/components/seo/JsonLd';
import './globals.css';

const SITE_URL = 'https://onemalad.in';
const SITE_NAME = 'OneMalad';
const SITE_DESC = 'OneMalad Foundation — Building a stronger Malad through community service, social initiatives, and grassroots engagement. Volunteer for cleanliness drives, health camps, food distribution, education programs, and more across all 5 wards of Malad, Mumbai.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'OneMalad — Community Foundation | Serving Malad Through Action',
    template: '%s | OneMalad',
  },
  description: SITE_DESC,
  keywords: [
    'OneMalad', 'OneMalad Foundation', 'Malad', 'Malad West', 'Malad East', 'Malwani', 'Marve Beach', 'Madh Fort',
    'community foundation', 'volunteer Malad', 'social service Mumbai', 'cleanliness drive Malad',
    'health camp Malad', 'food distribution Mumbai', 'tree planting Malad', 'blood donation Malad',
    'P North Ward', 'P South Ward', 'Malad community', 'Malad events', 'Malad development',
    'NGO Malad', 'community service Mumbai', 'youth empowerment Malad',
  ],
  authors: [{ name: 'OneMalad Foundation', url: SITE_URL }],
  creator: 'OneMalad Foundation',
  publisher: 'OneMalad Foundation',
  formatDetection: { email: false, address: false, telephone: false },
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: 'OneMalad — Community Foundation | Serving Malad Through Action',
    description: SITE_DESC,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OneMalad — Community Foundation',
    description: SITE_DESC,
    creator: '@OneMalad',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  category: 'community',
};

export const viewport: Viewport = {
  themeColor: '#2563eb',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <JsonLd />
        <AuthProvider>
          <FirestoreSync />
          <Suspense fallback={null}>
            <NavigationProgress />
          </Suspense>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                borderRadius: '12px',
                background: '#1f2937',
                color: '#fff',
                fontSize: '14px',
              },
            }}
          />
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
