// Verify against official sources before release.
// This content is intentionally static so it remains useful without a backend.

export interface EmergencyContact {
  label: string;
  number: string;
  description: string;
  category: 'emergency' | 'police' | 'medical' | 'fire' | 'women' | 'travel' | 'road' | 'cyber' | 'disaster';
}

export interface TravellerTipGroup {
  title: string;
  tips: string[];
}

export const lastVerified = '2026-10-24';

export const EMERGENCY_CONTACTS: EmergencyContact[] = [
  { label: 'National Emergency Number', number: '112', description: 'Police, fire and ambulance support', category: 'emergency' },
  { label: 'Police', number: '100', description: 'Police assistance', category: 'police' },
  { label: 'Ambulance', number: '108', description: 'Maharashtra Emergency Medical Service', category: 'medical' },
  { label: 'Fire', number: '101', description: 'Fire and rescue', category: 'fire' },
  { label: 'Women Helpline', number: '1091', description: 'Women’s emergency assistance', category: 'women' },
  { label: 'Women Helpline (state)', number: '181', description: 'State women’s support helpline', category: 'women' },
  { label: 'Tourist Helpline', number: '1363', description: 'Ministry of Tourism, Incredible India', category: 'travel' },
  { label: 'NHAI Highway Helpline', number: '1033', description: 'Highway assistance', category: 'road' },
  { label: 'Cyber Crime Helpline', number: '1930', description: 'Report cyber financial fraud quickly', category: 'cyber' },
  { label: 'Disaster Management (state)', number: '1070', description: 'State disaster management support', category: 'disaster' },
];

export const TRAVELLER_TIPS: TravellerTipGroup[] = [
  {
    title: 'General',
    tips: [
      'Share your itinerary and expected arrival time with someone you trust.',
      'Keep an offline map, a charged power bank and a little cash with you.',
      'Use official counters, registered operators or app-based transport where possible.',
      'Carry drinking water and take regular breaks in heat or on long drives.',
      'Keep photo ID, bookings and key contacts accessible offline.',
      'Check local weather and route conditions before setting out each day.',
    ],
  },
  {
    title: 'Solo travellers',
    tips: [
      'Tell a trusted person your daily plan and update them if it changes.',
      'Choose well-reviewed stays and confirm how you will reach them before dark.',
      'Keep your phone charged and download maps for areas with weak signal.',
      'Trust your comfort level; it is fine to leave a place or change plans.',
      'Keep valuables close and use a small day bag in busy places.',
      'Ask accommodation staff or official information desks for local route advice.',
    ],
  },
  {
    title: 'Women travellers',
    tips: [
      'Share your itinerary, stay details and transport plan with someone you trust.',
      'Prefer verified transport and confirm the vehicle and driver details before boarding.',
      'Arrange your arrival at a new stay in daylight where practical.',
      'Keep emergency contacts and your accommodation address easy to access.',
      'Choose public, well-lit meeting points when meeting a guide or driver.',
      'If a situation feels uncomfortable, move to a staffed public place and seek help.',
    ],
  },
  {
    title: 'Monsoon & trekking',
    tips: [
      'Check weather alerts, trail access and return timings before leaving.',
      'Wear footwear with reliable grip and carry a rain layer and drinking water.',
      'Use an experienced local guide for unfamiliar forts, trails and valleys.',
      'Stay on marked paths and turn back if visibility, weather or footing worsens.',
      'Avoid waterfalls, fast streams and slippery rock edges during heavy rain.',
      'Start early enough to finish the route well before dark.',
    ],
  },
  {
    title: 'Wildlife (Tadoba etc.)',
    tips: [
      'Follow forest staff and your registered guide at all times.',
      'Keep a quiet distance from animals and never feed or approach them.',
      'Stay inside the vehicle or on permitted paths unless staff direct otherwise.',
      'Carry water, sun protection and any essentials before entering the reserve.',
      'Respect entry times, permits and photography rules.',
      'Keep the habitat clean and take all litter back with you.',
    ],
  },
  {
    title: 'Coastal & water',
    tips: [
      'Check local conditions and follow lifeguard or beach signage.',
      'Do not enter the sea where a red flag is displayed or conditions look rough.',
      'Swim only in designated areas and keep children within close reach.',
      'Be careful on wet rocks, jetties and cliffs, especially around high tide.',
      'Wear a life jacket for boating and water activities when one is provided.',
      'Keep an eye on tides and leave enough time to return before dark.',
    ],
  },
];
