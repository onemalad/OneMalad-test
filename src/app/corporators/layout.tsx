import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Community Representatives — Malad Ward Leaders',
  description:
    'Meet Malad\'s community representatives — Geeta Bhandari (Ward 32), Qumarjahan Siddiqui (Ward 33), Haider Shaikh (Ward 34), Rafiq Shaikh (Ward 48), Sangeeta Koli (Ward 49). Learn about the leaders serving your ward.',
  keywords: [
    'Malad representative', 'Ward 32 representative', 'Ward 33 representative', 'Ward 34 representative',
    'Geeta Bhandari', 'Qumarjahan Siddiqui', 'Haider Shaikh', 'Rafiq Shaikh', 'Sangeeta Koli',
    'Malad elected representative', 'BMC ward Malad', 'Malwani representative',
  ],
  openGraph: {
    title: 'Community Representatives — Malad Ward Leaders | OneMalad',
    description: 'Meet the elected representatives serving Malad\'s 5 wards through OneMalad Foundation.',
    url: 'https://onemalad.in/corporators',
  },
};

export default function CorporatorsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
