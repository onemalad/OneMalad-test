import { Metadata } from 'next';
import { getPlaceBySlug, placesData } from '@/data/places';
import { wardsData } from '@/data/wards';
import DiscoverPlaceClient from './DiscoverPlaceClient';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const place = getPlaceBySlug(params.slug);

  if (!place) {
    return { title: 'Place Not Found' };
  }

  const ward = wardsData.find((w) => w.number === place.ward);
  const description = `${place.shortDesc} Located in Ward ${place.ward}${ward ? ` (${ward.area})` : ''}, Malad, Mumbai. Discover photos, visitor info, how to reach, and nearby attractions.`;

  return {
    title: `${place.title} — Discover Malad`,
    description,
    keywords: [
      place.title, `${place.title} Malad`, `${place.title} Mumbai`,
      place.tag, `Ward ${place.ward} Malad`,
      ...place.nearbyPlaces,
      'Malad places to visit', 'things to do in Malad', 'Malad tourism',
    ],
    openGraph: {
      title: `${place.title} — Discover Malad | OneMalad`,
      description,
      url: `https://onemalad.in/discover/${place.slug}`,
      type: 'article',
      images: place.images[0] ? [{ url: place.images[0], width: 1200, height: 630, alt: place.title }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${place.title} — Discover Malad`,
      description: place.shortDesc,
      images: place.images[0] ? [place.images[0]] : [],
    },
    alternates: {
      canonical: `https://onemalad.in/discover/${place.slug}`,
    },
  };
}

export function generateStaticParams() {
  return placesData.map((place) => ({ slug: place.slug }));
}

export default function DiscoverPlacePage() {
  return <DiscoverPlaceClient />;
}
