import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Emergency Helplines — Malad Police, Hospital, BMC, Fire',
  description: 'Important emergency phone numbers for Malad — police, hospitals, fire brigade, BMC, women helpline, and more. Save these numbers.',
  keywords: ['Malad emergency numbers', 'helpline Malad', 'police station Malad', 'hospital Malad', 'BMC helpline'],
};

export default function HelplinesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
