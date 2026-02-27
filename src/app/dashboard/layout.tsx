import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard — Foundation Admin',
  description:
    'OneMalad Foundation admin dashboard for managing activities, volunteers, events, and platform settings.',
  robots: { index: false, follow: false },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
