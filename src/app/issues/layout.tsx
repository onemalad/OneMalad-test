import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Raise & Track Civic Issues in Malad',
  description:
    'Report civic issues in Malad — potholes, water supply, garbage, streetlights, and more. Track issue resolution by ward corporators across Malad West, Malwani, Madh Island, and Marve.',
  keywords: [
    'Malad civic issues', 'BMC complaint Malad', 'Malad pothole', 'Malad water supply',
    'Malwani issues', 'Malad garbage complaint', 'report issue Malad Mumbai',
    'Malad West complaint', 'P North Ward issues', 'P South Ward issues',
  ],
  openGraph: {
    title: 'Raise & Track Civic Issues in Malad | OneMalad',
    description: 'Report and track civic issues in your Malad ward — potholes, water, garbage, streetlights, and more.',
    url: 'https://onemalad.in/issues',
  },
};

export default function IssuesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
