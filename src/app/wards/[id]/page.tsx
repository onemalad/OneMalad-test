import { Metadata } from 'next';
import { wardsData, getCorporatorByWard } from '@/data/wards';
import WardDetailClient from './WardDetailClient';

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const wardNum = Number(params.id);
  const ward = wardsData.find((w) => w.number === wardNum);
  const corporator = getCorporatorByWard(wardNum);

  if (!ward) {
    return { title: 'Ward Not Found' };
  }

  const description = `Ward ${ward.number} (${ward.name}) covers ${ward.landmarks.join(', ')} in ${ward.area}, Mumbai.${corporator ? ` Corporator: ${corporator.name} (${corporator.party}).` : ''} View issues, track development, and raise complaints.`;

  return {
    title: `Ward ${ward.number} — ${ward.area} | ${ward.name}`,
    description,
    keywords: [
      `Ward ${ward.number} Malad`, ward.name, ward.area, ward.zone,
      ...ward.landmarks,
      corporator?.name ?? '',
      `${ward.area} issues`, `${ward.area} corporator`, 'BMC ward Malad',
      'Malad ward development', 'Malad civic issues',
    ].filter(Boolean),
    openGraph: {
      title: `Ward ${ward.number} — ${ward.area} | OneMalad`,
      description,
      url: `https://onemalad.in/wards/${ward.number}`,
    },
    twitter: {
      card: 'summary',
      title: `Ward ${ward.number} — ${ward.area}`,
      description: `${ward.description.slice(0, 150)}...`,
    },
    alternates: {
      canonical: `https://onemalad.in/wards/${ward.number}`,
    },
  };
}

export function generateStaticParams() {
  return wardsData.map((ward) => ({ id: String(ward.number) }));
}

export default function WardDetailPage() {
  return <WardDetailClient />;
}
