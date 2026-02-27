import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Work — Foundation Activities',
  description: 'See the impact OneMalad Foundation is making through cleanliness drives, health camps, food distribution, education programs, and more across Malad.',
};

export default function OurWorkLayout({ children }: { children: React.ReactNode }) {
  return children;
}
