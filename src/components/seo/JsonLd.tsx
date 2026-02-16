export default function JsonLd() {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'OneMalad',
    url: 'https://onemalad.in',
    logo: 'https://onemalad.in/logo.png',
    description:
      'OneMalad is a civic engagement platform for Malad, Mumbai — empowering residents to raise issues, track ward developments, and connect with local governance.',
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
      'https://twitter.com/OneMalad',
      'https://instagram.com/OneMalad',
    ],
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'OneMalad',
    url: 'https://onemalad.in',
    description:
      'Malad\'s civic engagement platform — raise issues, track wards, discover places, connect with corporators.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://onemalad.in/issues?search={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'GovernmentOrganization',
    name: 'OneMalad - Civic Engagement Platform',
    url: 'https://onemalad.in',
    description:
      'A civic platform connecting Malad residents with their ward corporators, tracking local issues, and celebrating the community.',
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
      { '@type': 'ListItem', position: 2, name: 'Issues', item: 'https://onemalad.in/issues' },
      { '@type': 'ListItem', position: 3, name: 'Wards', item: 'https://onemalad.in/wards' },
      { '@type': 'ListItem', position: 4, name: 'Events', item: 'https://onemalad.in/events' },
      { '@type': 'ListItem', position: 5, name: 'Corporators', item: 'https://onemalad.in/corporators' },
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}
