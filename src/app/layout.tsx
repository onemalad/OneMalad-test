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
const SITE_DESC = 'OneMalad is Malad\'s civic engagement platform — raise local issues, track ward developments, connect with your corporator, discover iconic places like Marve Beach & Madh Fort, and participate in community events across all 5 wards of Malad, Mumbai.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'OneMalad — Malad\'s Civic Engagement Platform | Raise Issues, Track Wards, Discover Malad',
    template: '%s | OneMalad',
  },
  description: SITE_DESC,
  keywords: [
    'OneMalad', 'Malad', 'Malad West', 'Malad East', 'Malwani', 'Marve Beach', 'Madh Fort', 'Aksa Beach',
    'BMC', 'civic engagement', 'ward', 'corporator', 'Mumbai', 'P North Ward', 'P South Ward',
    'raise issues Malad', 'Malad ward corporator', 'Malad community', 'civic platform Mumbai',
    'Malad issues', 'Malwani community', 'Madh Island', 'St Bonaventure Church Malad',
    'Malad events', 'Malad development', 'Mumbai local governance', 'BMC complaints Malad',
  ],
  authors: [{ name: 'OneMalad', url: SITE_URL }],
  creator: 'OneMalad',
  publisher: 'OneMalad',
  formatDetection: { email: false, address: false, telephone: false },
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: 'OneMalad — Malad\'s Civic Engagement Platform',
    description: SITE_DESC,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'OneMalad - For the People of Malad, Mumbai',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OneMalad — Malad\'s Civic Engagement Platform',
    description: SITE_DESC,
    images: ['/og-image.png'],
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
  verification: {
    google: 'YOUR_GOOGLE_VERIFICATION_CODE',
  },
  category: 'civic engagement',
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
