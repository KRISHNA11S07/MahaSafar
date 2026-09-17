// MahaSafar — Region & Chapter Data
// Defines the 5 regional chapters for the Maharashtra scroll journey

import type { Region } from '../types';

export const regions: Region[] = [
  {
    _id: 'region-1',
    name: 'Mumbai & Konkan',
    slug: 'mumbai-konkan',
    chapterNumber: 1,
    description: 'From the urban energy of Mumbai to the serene coastline of Konkan — where the Sahyadri meets the Arabian Sea.',
    visualPersonality: {
      primaryColor: '#2A5F9E',
      mood: 'urban to coastal, architectural to oceanic, amber to blue',
      typography: 'bold, transitioning to fluid'
    },
    districts: ['mumbai', 'raigad', 'ratnagiri', 'sindhudurg'],
    order: 1
  },
  {
    _id: 'region-2',
    name: 'Western Maharashtra',
    slug: 'western-maharashtra',
    chapterNumber: 2,
    description: 'The heart of Maratha heritage — forts that guard the Sahyadri, hill stations that cool the soul, and cities steeped in culture.',
    visualPersonality: {
      primaryColor: '#4A6741',
      mood: 'heritage, cultural, green hills, fort silhouettes',
      typography: 'strong, serif-heavy, grounded'
    },
    districts: ['pune', 'satara', 'kolhapur', 'sangli', 'solapur'],
    order: 2
  },
  {
    _id: 'region-3',
    name: 'North Maharashtra',
    slug: 'north-maharashtra',
    chapterNumber: 3,
    description: 'Where spirituality meets nature — ancient temples, vineyard trails, and the rugged beauty of the northern Sahyadris.',
    visualPersonality: {
      primaryColor: '#8B6F47',
      mood: 'earthy, spiritual, vineyard, nature',
      typography: 'warm, organic, rooted'
    },
    districts: ['nashik', 'ahilyanagar', 'dhule', 'nandurbar', 'jalgaon', 'palghar', 'thane'],
    order: 3
  },
  {
    _id: 'region-4',
    name: 'Marathwada',
    slug: 'marathwada',
    chapterNumber: 4,
    description: 'The cradle of ancient art — from the UNESCO-inscribed caves of Ajanta and Ellora to the resilient spirit of the Deccan plateau.',
    visualPersonality: {
      primaryColor: '#A67B5B',
      mood: 'historical, architectural, warm stone, carved',
      typography: 'stately, carved feel, warm tones'
    },
    districts: ['chhatrapati-sambhajinagar', 'latur', 'dharashiv', 'nanded', 'beed', 'parbhani', 'jalna', 'hingoli'],
    order: 4
  },
  {
    _id: 'region-5',
    name: 'Vidarbha',
    slug: 'vidarbha',
    chapterNumber: 5,
    description: 'The wild east — tiger reserves, crater lakes, and landscapes that feel like a different world within Maharashtra.',
    visualPersonality: {
      primaryColor: '#6B8E4E',
      mood: 'wildlife, natural, raw landscape, untamed',
      typography: 'earthy, natural, organic'
    },
    districts: ['nagpur', 'wardha', 'bhandara', 'gondia', 'chandrapur', 'gadchiroli', 'amravati', 'akola', 'washim', 'yavatmal', 'buldhana'],
    order: 5
  }
];

export const REGION_COLORS: Record<string, string> = {
  'mumbai-konkan': '#2A5F9E',
  'western-maharashtra': '#4A6741',
  'north-maharashtra': '#8B6F47',
  'marathwada': '#A67B5B',
  'vidarbha': '#6B8E4E',
};
