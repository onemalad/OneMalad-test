import { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Local Business Directory — Malad Businesses & Services',
  description: 'Find local businesses, shops, restaurants, medical stores, and services in Malad West. Support your local community.',
  keywords: ['Malad business directory', 'shops in Malad', 'local services Malad West', 'OneMalad directory'],
};
export default function DirectoryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
