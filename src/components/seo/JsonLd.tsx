export default function JsonLd() {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'NGO',
    name: 'OneMalad Foundation',
    url: 'https://onemalad.in',
    logo: 'https://onemalad.in/logo.png',
    description:
      'OneMalad Foundation — Building a stronger Malad through community service, cleanliness drives, health camps, food distribution, education programs, and grassroots engagement.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Malad',
      addressRegion: 'Maharashtra',
      addressCountry: 'IN',
      postalCode: '400064',
    },
    areaServed: {
      '@type': 'City',
      name: 'Malad, Mumbai',
    },
    sameAs: [
      'https://x.com/onemalad',
      'https://instagram.com/onemalad',
      'https://facebook.com/onemalad',
      'https://youtube.com/@onemalad',
    ],
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'OneMalad Foundation',
    url: 'https://onemalad.in',
    description:
      'Community foundation serving Malad through volunteer-driven social initiatives, events, and ward-level engagement.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://onemalad.in/our-work?search={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };

  const nonprofitSchema = {
    '@context': 'https://schema.org',
    '@type': 'NonprofitType',
    name: 'OneMalad Foundation',
    url: 'https://onemalad.in',
    description:
      'A community foundation connecting Malad residents through social service, volunteer work, and ward-level community engagement.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Malad West',
      addressLocality: 'Mumbai',
      addressRegion: 'Maharashtra',
      postalCode: '400064',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 19.1874,
      longitude: 72.8484,
    },
    areaServed: [
      { '@type': 'AdministrativeArea', name: 'Malad West, Mumbai' },
      { '@type': 'AdministrativeArea', name: 'Malwani, Mumbai' },
      { '@type': 'AdministrativeArea', name: 'Madh Island, Mumbai' },
      { '@type': 'AdministrativeArea', name: 'Marve, Mumbai' },
    ],
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://onemalad.in' },
      { '@type': 'ListItem', position: 2, name: 'Our Work', item: 'https://onemalad.in/our-work' },
      { '@type': 'ListItem', position: 3, name: 'Wards', item: 'https://onemalad.in/wards' },
      { '@type': 'ListItem', position: 4, name: 'Events', item: 'https://onemalad.in/events' },
      { '@type': 'ListItem', position: 5, name: 'Volunteer', item: 'https://onemalad.in/volunteer' },
      { '@type': 'ListItem', position: 6, name: 'Gallery', item: 'https://onemalad.in/gallery' },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(nonprofitSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}
