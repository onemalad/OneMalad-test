export interface Place {
  slug: string;
  title: string;
  ward: number;
  tag: string;
  tagColor: string;
  gradient: string;
  emoji: string;
  shortDesc: string;
  heroGradient: string;
  images: string[];
  content: string[];
  highlights: { label: string; value: string }[];
  nearbyPlaces: string[];
  bestTimeToVisit?: string;
  howToReach?: string;
}

export const placesData: Place[] = [
  {
    slug: 'marve-beach',
    title: 'Marve Beach',
    ward: 32,
    tag: 'Beach',
    tagColor: 'bg-cyan-50 text-cyan-700',
    gradient: 'from-cyan-500/10 to-blue-500/10',
    emoji: '\u{1F3D6}',
    shortDesc: 'A serene getaway at the tip of Malad West. Known for its calm shores, stunning sunsets, and the iconic ferry service to Manori and Essel World.',
    heroGradient: 'from-cyan-600 via-blue-700 to-indigo-800',
    images: [
      'https://mumbaitourism.travel/images/places-to-visit/headers/marve-beach-mumbai-tourism-entry-fee-timings-holidays-reviews-header.jpg',
      'https://mumbaitourism.travel/images/tourist-places/marve-beach-mumbai/marve-beach-mumbai-india-tourism-history.jpg',
      'https://mumbaitourism.travel/images/tourist-places/marve-beach-mumbai/marve-beach-mumbai-india-tourism-photo-gallery.jpg',
      'https://mumbaitourism.travel/images/tourist-places/marve-beach-mumbai/marve-beach-mumbai-tourism-opening-time-closing.jpg',
    ],
    content: [
      'Marve Beach is one of Mumbai\'s hidden gems, tucked away at the western tip of Malad. Unlike the crowded Juhu or Versova, Marve offers a quieter, more peaceful seaside experience that locals have cherished for generations.',
      'The beach is famous for its iconic ferry service that connects Malad to Manori, Gorai, and Essel World. Every 10 minutes, colourful ferry boats shuttle families, couples, and tourists across the serene creek. The short boat ride itself has become a beloved experience, offering stunning views of the coastline.',
      'During sunset hours, Marve transforms into a magical spectacle. The golden light reflecting off the Arabian Sea, silhouettes of fishing boats returning with the day\'s catch, and the gentle sound of waves create an atmosphere that rivals any premium beach resort.',
      'For the local fishing community, Marve is more than just a beach \u2014 it\'s their livelihood. The Koli community has been fishing these waters for centuries, and their colourful boats and traditional practices add an authentic cultural touch to the area.',
      'Street food vendors line the approach road to the beach, offering everything from fresh coconut water and bhel puri to local Malwani fish fry. The area also has several seafood restaurants where you can enjoy the freshest catch of the day.',
    ],
    highlights: [
      { label: 'Best For', value: 'Sunset views, family picnics' },
      { label: 'Famous For', value: 'Ferry to Manori & Essel World' },
      { label: 'Food', value: 'Seafood, bhel puri, coconut water' },
      { label: 'Crowd', value: 'Moderate, peaceful on weekdays' },
    ],
    nearbyPlaces: ['Manori Beach', 'Essel World', 'Jankalyan MHADA'],
    bestTimeToVisit: 'October to March, evenings for sunset',
    howToReach: 'Auto/rickshaw from Malad station West. Get down at Marve bus stop.',
  },
  {
    slug: 'madh-fort',
    title: 'Madh Fort',
    ward: 49,
    tag: 'Heritage',
    tagColor: 'bg-amber-50 text-amber-700',
    gradient: 'from-amber-500/10 to-orange-500/10',
    emoji: '\u{1F3F0}',
    shortDesc: 'A 17th-century Portuguese watchtower standing guard over the Arabian Sea with panoramic ocean views.',
    heroGradient: 'from-amber-700 via-orange-800 to-red-900',
    images: [
      'https://media3.thrillophilia.com/filestore/klmq0f5fn2qknwzlnoksjnvmo976_1573213125_madh-fort-mumbai-1920x1434.jpg',
      'https://media3.thrillophilia.com/filestore/sh6vouszgvfcrgk939fyngwoqzb0_shutterstock_1924548245.jpg',
      'https://media3.thrillophilia.com/filestore/9rwt2qz4884ajn25dp4w8csxaknm_shutterstock_1980977645.jpg',
      'https://media3.thrillophilia.com/filestore/8zjoh8725qcyf6ljlz14wyra40pj_shutterstock_1980977678.jpg',
    ],
    content: [
      'Madh Fort, also known as Versova Fort, is a magnificent 17th-century watchtower built by the Portuguese during their colonial rule. Perched on the rocky coastline of Madh Island, it has been silently guarding the entrance to the Marve creek for over 400 years.',
      'The fort was strategically built to protect the northern approach to Mumbai\'s harbour. Its thick stone walls, arched windows, and watchtower design reflect classic Portuguese military architecture. Though weathered by centuries of Arabian Sea winds, the fort retains its imposing presence.',
      'Today, Madh Fort is a photographer\'s paradise. The dramatic backdrop of crashing waves, the rustic stone structure, and the panoramic views of the Mumbai coastline make it one of the most photographed locations in the city. Bollywood has frequently used this location for film shoots.',
      'The surrounding area is equally captivating. Rocky tidepools teem with marine life during low tide, making it a natural classroom for curious children. Local fishermen cast their nets from the rocks nearby, continuing traditions that predate the fort itself.',
      'The fort area is best visited during the monsoon when massive waves crash against the rocks creating a spectacular display of nature\'s power. During winter, the calm seas and clear skies offer perfect conditions for photography and peaceful contemplation.',
    ],
    highlights: [
      { label: 'Built By', value: 'Portuguese, 17th Century' },
      { label: 'Best For', value: 'Photography, history walks' },
      { label: 'Views', value: 'Arabian Sea panorama' },
      { label: 'Bollywood', value: 'Popular film shoot location' },
    ],
    nearbyPlaces: ['Aksa Beach', 'St. Bonaventure Church', 'Madh Jetty'],
    bestTimeToVisit: 'Monsoon for waves, Winter for clear views',
    howToReach: 'Bus 271 from Malad station to Madh Island, then auto to the fort.',
  },
  {
    slug: 'malwani',
    title: 'Malwani',
    ward: 34,
    tag: 'Community',
    tagColor: 'bg-purple-50 text-purple-700',
    gradient: 'from-purple-500/10 to-pink-500/10',
    emoji: '\u{1F3D8}',
    shortDesc: 'The heart of Malad\'s community life with vibrant markets, famous Malwani cuisine, and one of Mumbai\'s most culturally rich neighbourhoods.',
    heroGradient: 'from-purple-700 via-indigo-800 to-blue-900',
    images: [
      'https://media3.thrillophilia.com/filestore/fx2oqw5y8nllsmkoaco390nn68nd_shutterstock_1980977681.jpg',
      'https://media3.thrillophilia.com/filestore/q16rh9h69zcn3b6rfm7dmd4werg5_shutterstock_1998388574.jpg',
      'https://media3.thrillophilia.com/filestore/tpbxtchx960ju8i23zgwp8s31ucb_shutterstock_1694948845.jpg',
      'https://media3.thrillophilia.com/filestore/8zjoh8725qcyf6ljlz14wyra40pj_shutterstock_1980977678.jpg',
    ],
    content: [
      'Malwani is the beating heart of Malad West \u2014 a vibrant, densely packed neighbourhood that pulses with energy from dawn to dusk. With areas like Gate 6, Gate 7, NCC, and Malwani 1 No, it\'s one of the most culturally diverse and tightly-knit communities in all of Mumbai.',
      'The neighbourhood is world-famous for Malwani cuisine, a coastal cooking tradition that blends Konkani, East Indian, and Koli flavours. From the fiery Malwani fish curry with red chilli masala to the crispy bombil fry and surmai thali, the food here is legendary. Small eateries and home kitchens across Malwani serve dishes that foodies travel from across Mumbai to taste.',
      'Life in Malwani revolves around its bustling lanes. Narrow streets lined with shops selling everything from fresh produce to electronics create a maze of commerce and conversation. The Gate 6 and Gate 7 areas are commercial hubs where the community gathers for daily needs.',
      'Despite the dense urban setting, Malwani has a strong sense of community. Neighbours know each other by name, festivals are celebrated together regardless of religion, and the local youth are active in sports, cultural events, and civic engagement. Cricket matches in open grounds and football tournaments unite the community.',
      'Malwani is also home to numerous places of worship \u2014 mosques, temples, churches, and dargahs \u2014 standing side by side as a living example of Mumbai\'s famous secular spirit. During festivals like Eid, Diwali, and Christmas, the entire neighbourhood comes alive with decorations, food sharing, and collective celebrations.',
    ],
    highlights: [
      { label: 'Famous For', value: 'Malwani cuisine, seafood' },
      { label: 'Population', value: '1.1 Lakh+ residents' },
      { label: 'Key Areas', value: 'Gate 6, Gate 7, NCC, 1 No' },
      { label: 'Spirit', value: 'Unity in diversity' },
    ],
    nearbyPlaces: ['Malwani MHADA', 'Marve Beach', 'Rathodi'],
    bestTimeToVisit: 'Anytime! Morning for markets, evening for food',
    howToReach: 'Auto/bus from Malad station West towards Marve Road.',
  },
  {
    slug: 'aksa-beach',
    title: 'Aksa Beach',
    ward: 49,
    tag: 'Beach',
    tagColor: 'bg-cyan-50 text-cyan-700',
    gradient: 'from-cyan-500/10 to-teal-500/10',
    emoji: '\u{1F30A}',
    shortDesc: 'A peaceful stretch of golden sand between Malad and Madh Island. Perfect for evening strolls and picnics.',
    heroGradient: 'from-teal-600 via-cyan-700 to-blue-800',
    images: [
      'https://media3.thrillophilia.com/filestore/8ernb5ogs4w98zn5fftrc8pgnrbw_shutterstock_1271510506.jpg',
      'https://media3.thrillophilia.com/filestore/tpbxtchx960ju8i23zgwp8s31ucb_shutterstock_1694948845.jpg',
      'https://media3.thrillophilia.com/filestore/fx2oqw5y8nllsmkoaco390nn68nd_shutterstock_1980977681.jpg',
      'https://media3.thrillophilia.com/filestore/q16rh9h69zcn3b6rfm7dmd4werg5_shutterstock_1998388574.jpg',
    ],
    content: [
      'Aksa Beach is a tranquil oasis nestled between Malad and Madh Island, offering a rare blend of natural beauty and accessibility. Named after the nearby Aksa village, this beach has been a beloved retreat for Malad residents for generations.',
      'Unlike Mumbai\'s more commercial beaches, Aksa retains a raw, untouched charm. The wide stretch of golden sand, backed by casuarina trees and palm groves, creates a natural amphitheatre where the soundtrack is nothing but waves and birdsong.',
      'The beach is particularly beautiful during the monsoon season when the Arabian Sea turns dramatic. Massive waves crash onto the shore, and the surrounding hills turn a lush emerald green. It\'s a popular spot for monsoon photography and romantic walks in the rain.',
      'Families flock to Aksa on weekends for picnics, kite flying, and sandcastle building. The flat, wide beach provides ample space for children to play safely. Local vendors offer horse rides, camel rides, and an array of street food that includes pav bhaji, vada pav, and chana jor garam.',
      'The approach road to Aksa Beach passes through a scenic stretch with views of the creek and mangroves, making the journey itself a visual treat. The area around the beach has several small resorts and farmhouses that cater to weekend getaways.',
    ],
    highlights: [
      { label: 'Best For', value: 'Family picnics, evening walks' },
      { label: 'Vibe', value: 'Peaceful, less crowded' },
      { label: 'Activities', value: 'Horse rides, kite flying' },
      { label: 'Season', value: 'Beautiful year-round' },
    ],
    nearbyPlaces: ['Madh Fort', 'Madh Island', 'Ambujwadi'],
    bestTimeToVisit: 'October to February for pleasant weather',
    howToReach: 'Bus 271 from Malad station or auto via Madh-Marve road.',
  },
  {
    slug: 'st-bonaventure-church',
    title: 'St. Bonaventure Church',
    ward: 49,
    tag: 'Heritage',
    tagColor: 'bg-amber-50 text-amber-700',
    gradient: 'from-amber-500/10 to-yellow-500/10',
    emoji: '\u26EA',
    shortDesc: 'A 16th-century Portuguese church on Madh Island. One of the oldest churches in Mumbai.',
    heroGradient: 'from-yellow-700 via-amber-800 to-orange-900',
    images: [
      'https://media3.thrillophilia.com/filestore/sh6vouszgvfcrgk939fyngwoqzb0_shutterstock_1924548245.jpg',
      'https://media3.thrillophilia.com/filestore/klmq0f5fn2qknwzlnoksjnvmo976_1573213125_madh-fort-mumbai-1920x1434.jpg',
      'https://media3.thrillophilia.com/filestore/9rwt2qz4884ajn25dp4w8csxaknm_shutterstock_1980977645.jpg',
      'https://media3.thrillophilia.com/filestore/8ernb5ogs4w98zn5fftrc8pgnrbw_shutterstock_1271510506.jpg',
    ],
    content: [
      'St. Bonaventure Church on Madh Island is one of the oldest surviving churches in Mumbai, built by the Portuguese in the 16th century. This beautiful house of worship stands as a living monument to over 400 years of Christian heritage in the Malad region.',
      'The church was built during the Portuguese colonial period when Madh Island (then known as "Ilha de Madh") was an important outpost. The Portuguese left behind a rich architectural and cultural legacy, and St. Bonaventure Church is perhaps the finest example of that heritage in the area.',
      'Architecturally, the church features classic Portuguese colonial design with whitewashed walls, arched doorways, and a distinctive bell tower that can be seen from far across the island. Inside, beautiful stained glass windows filter sunlight into colourful patterns across the stone floor, creating an atmosphere of serene devotion.',
      'The church is an active place of worship for the local East Indian Catholic community of Madh Island. The East Indians, who are among Mumbai\'s oldest inhabitants, have maintained their unique culture, language (a Marathi dialect), and traditions for centuries. Annual feast celebrations at St. Bonaventure draw devotees from across Mumbai.',
      'The church grounds are beautifully maintained with old trees providing shade and a peaceful graveyard that tells stories of families who have called Madh Island home for generations. For history enthusiasts and architecture lovers, a visit to St. Bonaventure is a journey back in time.',
    ],
    highlights: [
      { label: 'Built', value: '16th Century by Portuguese' },
      { label: 'Style', value: 'Portuguese colonial architecture' },
      { label: 'Community', value: 'East Indian Catholic' },
      { label: 'Feature', value: 'Stained glass windows' },
    ],
    nearbyPlaces: ['Madh Fort', 'Madh Jetty', 'Aksa Beach'],
    bestTimeToVisit: 'Morning hours, Sunday for Mass',
    howToReach: 'Bus 271 to Madh Island from Malad station.',
  },
];

export function getPlaceBySlug(slug: string): Place | undefined {
  return placesData.find((p) => p.slug === slug);
}
