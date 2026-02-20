import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard — Admin & Corporator Panel',
  description:
    'Admin and corporator dashboard for managing issues and platform activity on OneMalad.',
  robots: { index: false, follow: false },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
