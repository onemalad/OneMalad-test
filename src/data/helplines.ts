import { Helpline } from '@/types';

export const helplineCategories: { value: 'all' | Helpline['category']; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'emergency', label: 'Emergency' },
  { value: 'police', label: 'Police' },
  { value: 'hospital', label: 'Hospital' },
  { value: 'fire', label: 'Fire' },
  { value: 'women', label: 'Women & Child' },
  { value: 'child', label: 'Child' },
  { value: 'municipal', label: 'Municipal (BMC)' },
  { value: 'utility', label: 'Utility' },
  { value: 'other', label: 'Other' },
];

export const helplines: Helpline[] = [
  // Emergency
  {
    id: 'h-1',
    name: 'Police Emergency',
    number: '100',
    category: 'emergency',
    description: 'All-India police emergency helpline',
    available: '24/7',
  },
  {
    id: 'h-2',
    name: 'Ambulance',
    number: '108',
    category: 'emergency',
    description: 'Free ambulance service across Maharashtra',
    available: '24/7',
  },
  {
    id: 'h-3',
    name: 'Fire Brigade',
    number: '101',
    category: 'emergency',
    description: 'Mumbai Fire Brigade emergency',
    available: '24/7',
  },
  {
    id: 'h-4',
    name: 'Disaster Management',
    number: '1077',
    category: 'emergency',
    description: 'NDMA disaster helpline — floods, earthquakes, cyclones',
    available: '24/7',
  },

  // Police
  {
    id: 'h-5',
    name: 'Malwani Police Station',
    number: '022-28820555',
    category: 'police',
    description: 'Local police station covering Malwani, Malad West area',
    available: '24/7',
  },
  {
    id: 'h-6',
    name: 'Malad Police Station',
    number: '022-28810333',
    category: 'police',
    description: 'Malad West police station on SV Road',
    available: '24/7',
  },
  {
    id: 'h-7',
    name: 'Anti-Narcotics Cell',
    number: '1800-209-3498',
    category: 'police',
    description: 'Report drug trafficking and substance abuse complaints',
    available: '24/7',
  },
  {
    id: 'h-8',
    name: 'Cyber Crime Helpline',
    number: '1930',
    category: 'police',
    description: 'Report online fraud, hacking, social media crimes',
    available: '24/7',
  },

  // Hospitals
  {
    id: 'h-9',
    name: 'Shatabdi Hospital',
    number: '022-28820455',
    category: 'hospital',
    description: 'Government hospital in Kandivali — nearest major facility for Malad residents',
    available: '24/7',
  },
  {
    id: 'h-10',
    name: 'Holy Family Hospital',
    number: '022-26401500',
    category: 'hospital',
    description: 'Multi-specialty hospital in Bandra — emergency and ICU services',
    available: '24/7',
  },
  {
    id: 'h-11',
    name: 'Cooper Hospital',
    number: '022-26207254',
    category: 'hospital',
    description: 'BMC-run major hospital in Vile Parle — trauma and emergency care',
    available: '24/7',
  },

  // Fire
  {
    id: 'h-12',
    name: 'Malad Fire Station',
    number: '022-28811099',
    category: 'fire',
    description: 'Local fire station for Malad area',
    available: '24/7',
  },

  // Women
  {
    id: 'h-13',
    name: 'Women Helpline',
    number: '181',
    category: 'women',
    description: 'National helpline for women in distress — domestic violence, harassment',
    available: '24/7',
  },
  {
    id: 'h-14',
    name: 'Women Helpline (NCW)',
    number: '7827-170-170',
    category: 'women',
    description: 'National Commission for Women — WhatsApp complaints also accepted',
    available: '24/7',
  },

  // Child
  {
    id: 'h-15',
    name: 'Childline',
    number: '1098',
    category: 'child',
    description: 'Emergency phone service for children in need of care and protection',
    available: '24/7',
  },

  // Municipal
  {
    id: 'h-16',
    name: 'BMC Helpline',
    number: '1916',
    category: 'municipal',
    description: 'Brihanmumbai Municipal Corporation — civic complaints, road, water, drainage',
    available: '24/7',
  },
  {
    id: 'h-17',
    name: 'P-North Ward Office',
    number: '022-28810208',
    category: 'municipal',
    description: 'Ward office for Malad West — Wards 32, 33, 34',
    available: '10:00 AM - 5:30 PM (Mon-Sat)',
  },
  {
    id: 'h-18',
    name: 'P-South Ward Office',
    number: '022-28811407',
    category: 'municipal',
    description: 'Ward office for Malad — Wards 48, 49',
    available: '10:00 AM - 5:30 PM (Mon-Sat)',
  },
  {
    id: 'h-19',
    name: 'BMC Water Complaint',
    number: '022-22620727',
    category: 'municipal',
    description: 'Water supply complaints, pipeline burst, low pressure issues',
    available: '24/7',
  },

  // Utility
  {
    id: 'h-20',
    name: 'BEST Electricity Complaint',
    number: '022-24727171',
    category: 'utility',
    description: 'Power outages, meter issues, new connection for Malad area',
    available: '24/7',
  },
  {
    id: 'h-21',
    name: 'Mahanagar Gas',
    number: '022-68674500',
    category: 'utility',
    description: 'Gas leak, new connection, meter reading issues',
    available: '24/7',
  },
  {
    id: 'h-22',
    name: 'MTNL Fault Complaint',
    number: '1504',
    category: 'utility',
    description: 'Landline, broadband fault and new connection',
    available: '24/7',
  },

  // Other
  {
    id: 'h-23',
    name: 'Blood Bank — Tata Memorial',
    number: '022-24177000',
    category: 'other',
    description: 'Blood requirement and donation — Tata Memorial Hospital, Parel',
    available: '24/7',
  },
  {
    id: 'h-24',
    name: 'OneMalad Foundation',
    number: '+91-99207-66971',
    category: 'other',
    description: 'Reach out for community service, volunteering, or any local help in Malad',
    available: '9:00 AM - 9:00 PM',
  },
];
