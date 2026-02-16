import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Malad Corporators — Your Elected Representatives',
  description:
    'Meet your Malad ward corporators — Geeta Bhandari (Ward 32), Qumarjahan Siddiqui (Ward 33), Haider Shaikh (Ward 34), Rafiq Shaikh (Ward 48), Sangeeta Koli (Ward 49). Track their work, achievements, and issue resolution.',
  keywords: [
    'Malad corporator', 'Ward 32 corporator', 'Ward 33 corporator', 'Ward 34 corporator',
    'Geeta Bhandari', 'Qumarjahan Siddiqui', 'Haider Shaikh', 'Rafiq Shaikh', 'Sangeeta Koli',
    'Malad elected representative', 'BMC corporator Malad', 'Malwani corporator',
  ],
  openGraph: {
    title: 'Malad Corporators — Your Elected Representatives | OneMalad',
    description: 'Know your ward corporator, track their work, and connect with them through OneMalad.',
    url: 'https://onemalad.in/corporators',
  },
};

export default function CorporatorsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
