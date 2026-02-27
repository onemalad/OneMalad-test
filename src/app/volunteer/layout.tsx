import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Volunteer with OneMalad',
  description:
    'Join the OneMalad volunteer movement. Sign up to participate in cleanliness drives, health camps, food distribution, education programs, and more across Malad, Mumbai.',
  keywords: [
    'OneMalad volunteer',
    'Malad volunteer',
    'Malwani volunteer',
    'community service Malad',
    'cleanliness drive Malad',
    'health camp volunteer Mumbai',
    'food distribution Malad',
    'tree planting Mumbai',
  ],
  openGraph: {
    title: 'Volunteer with OneMalad | Join the Movement',
    description:
      'Sign up as a volunteer and help make Malad a better place. No login required — just fill in your details and get started.',
    url: 'https://onemalad.in/volunteer',
  },
};

export default function VolunteerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
