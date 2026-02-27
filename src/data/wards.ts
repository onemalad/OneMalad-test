import { Ward, Corporator } from '@/types';

export const wardsData: Ward[] = [
  {
    number: 32,
    name: 'P North Ward 32',
    zone: 'P-North',
    area: 'Malad West',
    description:
      'Ward 32 covers the stretch from Jankalyan Old MHADA to Marve and Manori Village. This ward includes the coastal areas of Marve and the historic fishing village of Manori, along with the residential Jankalyan area.',
    landmarks: ['Jankalyan Old MHADA', 'Jankalyan', 'Marve', 'Manori Village'],
    population: 85000,
    voters: 38450,
    image: '/wards/ward-32.svg',
  },
  {
    number: 33,
    name: 'P North Ward 33',
    zone: 'P-North',
    area: 'Malad West',
    description:
      'Ward 33 covers the Rathodi and Malwani 6 No areas in Malad West. A densely populated residential ward with a mix of housing colonies and local markets.',
    landmarks: ['Rathodi', 'Malwani 6 No'],
    population: 92000,
    voters: 42680,
    image: '/wards/ward-33.svg',
  },
  {
    number: 34,
    name: 'P North Ward 34',
    zone: 'P-North',
    area: 'Malad West',
    description:
      'Ward 34 covers from Malwani 1 No to NCC, including Gate 6 and Gate 7 areas. One of the most densely populated wards in the Malwani region with a strong community presence.',
    landmarks: ['Malwani 1 No', 'NCC', 'Gate 6', 'Gate 7'],
    population: 110000,
    voters: 51230,
    image: '/wards/ward-34.svg',
  },
  {
    number: 48,
    name: 'P South Ward 48',
    zone: 'P-South',
    area: 'Malad West',
    description:
      'Ward 48 covers the Malwani MHADA colony and Malwani 7 No area. A residential ward with government housing and community facilities.',
    landmarks: ['Malwani MHADA', 'Malwani 7 No'],
    population: 78000,
    voters: 35120,
    image: '/wards/ward-48.svg',
  },
  {
    number: 49,
    name: 'P South Ward 49',
    zone: 'P-South',
    area: 'Malad West',
    description:
      'Ward 49 covers Madh Island and Ambujwadi. This ward includes the scenic Madh Island with its historic fort and jetty, along with the residential Ambujwadi settlement.',
    landmarks: ['Madh Island', 'Ambujwadi', 'Madh Jetty', 'Madh Fort'],
    population: 72000,
    voters: 32540,
    image: '/wards/ward-49.svg',
  },
];

export const corporatorsData: Corporator[] = [
  {
    id: 'corp-32',
    name: 'Geeta Kiran Bhandari',
    party: 'Shiv Sena (UBT)',
    wardNumber: 32,
    votes: 8677,
    photo: '/corporators/ward-32.jfif',
    bio: 'Geeta Kiran Bhandari is a dedicated community leader representing Ward 32. A veteran corporator who also won in 2017, she has been actively working on improving infrastructure from Jankalyan Old MHADA through Marve to Manori Village.',
  },
  {
    id: 'corp-33',
    name: 'Qumarjahan Siddiqui',
    party: 'Indian National Congress',
    wardNumber: 33,
    votes: 12644,
    photo: '/corporators/ward-33.jfif',
    bio: 'Qumarjahan Siddiqui represents the Rathodi and Malwani 6 No ward. Sister of MLA Aslam Shaikh, she has been instrumental in improving public amenities and sanitation in the area.',
  },
  {
    id: 'corp-34',
    name: 'Haider Aslam Shaikh',
    party: 'Indian National Congress',
    wardNumber: 34,
    votes: 16622,
    photo: '/corporators/ward-34.jfif',
    bio: 'Haider Aslam Shaikh serves Ward 34 covering Malwani 1 No to NCC including Gate 6 and Gate 7. Son of Congress MLA Aslam Shaikh, he focuses on infrastructure development and water supply improvements in the Malwani area.',
  },
  {
    id: 'corp-48',
    name: 'Rafiq Iliyas Shaikh',
    party: 'Indian National Congress',
    wardNumber: 48,
    votes: 13154,
    photo: '/corporators/ward-48.png',
    bio: 'Rafiq Iliyas Shaikh has been working to improve the residential infrastructure in the Malwani MHADA colony and Malwani 7 No area of Ward 48.',
  },
  {
    id: 'corp-49',
    name: 'Sangeeta Chandrakant Koli',
    party: 'Indian National Congress',
    wardNumber: 49,
    votes: 10733,
    photo: '/corporators/ward-49.webp',
    bio: 'Sangeeta Chandrakant Koli represents the Madh Island and Ambujwadi areas. She is committed to improving infrastructure, housing conditions, and public spaces across Ward 49.',
  },
];

export function getCorporatorByWard(wardNumber: number): Corporator | undefined {
  return corporatorsData.find((c) => c.wardNumber === wardNumber);
}

export function getWardByNumber(wardNumber: number): Ward | undefined {
  return wardsData.find((w) => w.number === wardNumber);
}
