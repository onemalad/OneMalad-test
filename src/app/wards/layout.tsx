import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Malad Wards — Ward 32, 33, 34, 48, 49',
  description:
    'Explore all 5 wards of Malad, Mumbai — Ward 32 (Marve, Manori), Ward 33 (Rathodi, Malwani), Ward 34 (Malwani Gate 6/7), Ward 48 (MHADA), Ward 49 (Madh Island). View demographics, landmarks, and community activities.',
  keywords: [
    'Malad wards', 'Ward 32 Malad', 'Ward 33 Malad', 'Ward 34 Malad', 'Ward 48 Malad', 'Ward 49 Malad',
    'P North Ward Mumbai', 'P South Ward Mumbai', 'Malad community', 'BMC ward Malad',
    'Malwani ward', 'Marve ward', 'Madh Island ward',
  ],
  openGraph: {
    title: 'Malad Wards — Explore All 5 Wards | OneMalad',
    description: 'View ward details, community representatives, landmarks, and foundation activities for all Malad wards.',
    url: 'https://onemalad.in/wards',
  },
};

export default function WardsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
