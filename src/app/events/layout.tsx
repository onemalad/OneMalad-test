import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Community Events in Malad',
  description:
    'Discover upcoming community events, festivals, cleanliness drives, and gatherings in Malad, Mumbai. Stay connected with your neighbourhood through OneMalad.',
  keywords: [
    'Malad events', 'Malad community events', 'Malwani events', 'Malad festival',
    'Malad cleanliness drive', 'Mumbai community events', 'Malad gathering',
  ],
  openGraph: {
    title: 'Community Events in Malad | OneMalad',
    description: 'Upcoming community events, festivals, and gatherings in Malad, Mumbai.',
    url: 'https://onemalad.in/events',
  },
};

export default function EventsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
