import { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Blood Donor Registry — Find & Register Blood Donors in Malad',
  description: 'Find blood donors in Malad or register as a donor. Help save lives in your community. All blood groups — A+, B+, O+, AB+, and more.',
  keywords: ['blood donor Malad', 'blood bank Malad', 'donate blood Mumbai', 'OneMalad blood donor'],
};
export default function BloodDonorsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
