// MahaSafar — Category Data

import type { Category } from '../types';

export const categories: Category[] = [
  {
    slug: 'beach',
    name: 'Beaches',
    count: 24,
    image: '/images/categories/beaches.webp',
    description: 'From the bustling shores of Alibaug to the untouched sands of Bhogwe'
  },
  {
    slug: 'mountain',
    name: 'Mountains',
    count: 18,
    image: '/images/categories/mountains.webp',
    description: 'Hill stations and peaks across the Sahyadri range'
  },
  {
    slug: 'fort',
    name: 'Forts',
    count: 35,
    image: '/images/categories/forts.webp',
    description: 'Maratha legacy carved in stone — from Raigad to Pratapgad'
  },
  {
    slug: 'wildlife',
    name: 'Wildlife',
    count: 12,
    image: '/images/categories/wildlife.webp',
    description: 'Tiger reserves, bird sanctuaries, and untamed landscapes'
  },
  {
    slug: 'heritage',
    name: 'Heritage',
    count: 20,
    image: '/images/categories/heritage.webp',
    description: 'Ajanta, Ellora, and centuries of architectural brilliance'
  },
  {
    slug: 'spiritual',
    name: 'Spiritual',
    count: 15,
    image: '/images/categories/spiritual.webp',
    description: 'Ancient temples and pilgrimage routes across Maharashtra'
  },
  {
    slug: 'food',
    name: 'Food & Culture',
    count: 22,
    image: '/images/categories/food.webp',
    description: 'Regional cuisines that define Maharashtra\'s identity'
  },
  {
    slug: 'hidden',
    name: 'Hidden Maharashtra',
    count: 30,
    image: '/images/categories/hidden.webp',
    description: 'Places worth getting lost for — offbeat and undiscovered'
  }
];

export const CATEGORY_ICONS: Record<string, string> = {
  beach: '🏖',
  mountain: '⛰',
  fort: '🏰',
  wildlife: '🐅',
  heritage: '🏛',
  spiritual: '🛕',
  food: '🍽',
  hidden: '✦',
  'water-sports': '🤿',
  trek: '🥾',
  cave: '🕳',
  'hill-station': '🌿',
  waterfall: '💧',
  adventure: '🧗',
};
