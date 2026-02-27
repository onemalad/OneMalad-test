import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gallery — Foundation Activities',
  description:
    'Browse photos from OneMalad Foundation activities — cleanliness drives, health camps, food distribution, tree planting, and more across Malad, Mumbai.',
  keywords: [
    'OneMalad gallery', 'Malad foundation photos', 'community activities Malad',
    'cleanliness drive photos', 'health camp Malad', 'Malad volunteers',
    'Mumbai community gallery', 'OneMalad foundation',
  ],
  openGraph: {
    title: 'Gallery | OneMalad Foundation',
    description: 'Moments from our foundation activities and community events in Malad, Mumbai.',
    url: 'https://onemalad.in/gallery',
  },
};

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
