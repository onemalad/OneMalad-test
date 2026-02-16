import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard — Your Issues & Activity',
  description:
    'Track your raised issues, view resolution status, and manage your civic engagement activity on OneMalad.',
  robots: { index: false, follow: false },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
