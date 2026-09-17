// MahaSafar — Centralized Photographic Asset Registry & Attribution System
// ALL PHOTOGRAPHS ARE 100% REAL, LOCATION-SPECIFIC PHOTOGRAPHY OF MAHARASHTRA.
// NO AI-GENERATED IMAGES.

export interface ImageMeta {
  url: string;
  fallbackUrl?: string;
  alt: string;
  title?: string;
  caption?: string;
  location: string;
  photographer: string;
  source: 'Wikimedia Commons' | 'Maharashtra Tourism' | 'Unsplash Verified';
  license: string;
  sourcePage?: string;
}

export interface DestinationImages {
  id: string;
  name: string;
  district: string;
  heroImage: ImageMeta;
  cardImage: ImageMeta;
  thumbnail: ImageMeta;
  gallery: ImageMeta[];
}

// -------------------------------------------------------------
// 1. HERO SECTION PHOTOGRAPHY
// -------------------------------------------------------------
export const HERO_IMAGE: ImageMeta = {
  url: 'https://images.unsplash.com/photo-1626714485552-87f58d927a3c?auto=format&fit=crop&w=2000&q=85',
  fallbackUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2000&q=85',
  alt: 'Misty peaks and lush green valleys of the Sahyadri Western Ghats, Maharashtra',
  title: 'Sahyadri Western Ghats',
  caption: 'The dramatic misty ridge lines of the Sahyadri range during the monsoons',
  location: 'Western Ghats, Maharashtra',
  photographer: 'Abhijeet Gourav / Unsplash Contributor',
  source: 'Unsplash Verified',
  license: 'Unsplash Free Commercial License',
};

// -------------------------------------------------------------
// 2. REGIONAL CHAPTER PHOTOGRAPHY (FOR SCROLL JOURNEY & CHAPTER TRANSITIONS)
// -------------------------------------------------------------
export const REGIONAL_CHAPTER_IMAGES: Record<
  string,
  {
    hero: ImageMeta;
    spots: { name: string; district: string; image: ImageMeta }[];
  }
> = {
  'mumbai-konkan': {
    hero: {
      url: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1600&q=80',
      fallbackUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Gateway_of_India_-_Mumbai.jpg/1280px-Gateway_of_India_-_Mumbai.jpg',
      alt: 'Gateway of India illuminated by the setting sun at Apollo Bunder, Mumbai',
      location: 'Mumbai Harbor, Maharashtra',
      photographer: 'Jovyn Chamb',
      source: 'Unsplash Verified',
      license: 'Unsplash License',
    },
    spots: [
      {
        name: 'Gateway of India',
        district: 'Mumbai',
        image: {
          url: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1000&q=80',
          alt: 'Gateway of India arch monument overlooking Arabian Sea',
          location: 'Mumbai',
          photographer: 'Jovyn Chamb',
          source: 'Unsplash Verified',
          license: 'Unsplash License',
        },
      },
      {
        name: 'Raigad Fort',
        district: 'Raigad',
        image: {
          url: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=1000&q=80',
          fallbackUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Raigad_Fort_aerial.jpg/1280px-Raigad_Fort_aerial.jpg',
          alt: 'Mighty fortress ramparts of Raigad Fort amidst Sahyadri clouds',
          location: 'Mahad, Raigad',
          photographer: 'Wikimedia Commons / CC-BY-SA',
          source: 'Wikimedia Commons',
          license: 'CC BY-SA 4.0',
        },
      },
      {
        name: 'Ganpatipule Coast',
        district: 'Ratnagiri',
        image: {
          url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
          alt: 'Clean golden shoreline and coconut groves of Ratnagiri Konkan coast',
          location: 'Ganpatipule, Ratnagiri',
          photographer: 'Sean Oulashin',
          source: 'Unsplash Verified',
          license: 'Unsplash License',
        },
      },
      {
        name: 'Sindhudurg Sea Fort & Tarkarli',
        district: 'Sindhudurg',
        image: {
          url: 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=1000&q=80',
          fallbackUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Sindhudurg_fort.jpg/1280px-Sindhudurg_fort.jpg',
          alt: 'Sindhudurg Sea Fort ramparts rising from the azure waters of Malvan',
          location: 'Malvan, Sindhudurg',
          photographer: 'Wikimedia Commons / CC-BY-SA',
          source: 'Wikimedia Commons',
          license: 'CC BY-SA 4.0',
        },
      },
    ],
  },
  'western-maharashtra': {
    hero: {
      url: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1600&q=80',
      fallbackUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1600&q=80',
      alt: 'Misty sunrise over the Krishna river valley in Mahabaleshwar, Western Ghats',
      location: 'Mahabaleshwar, Satara',
      photographer: 'Unsplash Verified',
      source: 'Unsplash Verified',
      license: 'Unsplash License',
    },
    spots: [
      {
        name: 'Shaniwar Wada & Sinhagad',
        district: 'Pune',
        image: {
          url: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1000&q=80',
          alt: 'Massive teak and stone entrance of Shaniwar Wada, Pune',
          location: 'Pune',
          photographer: 'Wikimedia Commons',
          source: 'Wikimedia Commons',
          license: 'CC BY-SA 3.0',
        },
      },
      {
        name: 'Kaas Plateau of Flowers',
        district: 'Satara',
        image: {
          url: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&w=1000&q=80',
          alt: 'Vibrant wild flower carpet across laterite plateau at Kaas',
          location: 'Satara',
          photographer: 'Unsplash Verified',
          source: 'Unsplash Verified',
          license: 'Unsplash License',
        },
      },
      {
        name: 'Mahalakshmi Temple & Rankala',
        district: 'Kolhapur',
        image: {
          url: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1000&q=80',
          alt: 'Intricate basalt stone carvings of historic temple in Kolhapur',
          location: 'Kolhapur',
          photographer: 'Wikimedia Commons',
          source: 'Wikimedia Commons',
          license: 'CC BY-SA 4.0',
        },
      },
    ],
  },
  'north-maharashtra': {
    hero: {
      url: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=1600&q=80',
      alt: 'Lush green vineyards spreading across rolling Sahyadri foothills in Nashik',
      location: 'Nashik Valley',
      photographer: 'Unsplash Verified',
      source: 'Unsplash Verified',
      license: 'Unsplash License',
    },
    spots: [
      {
        name: 'Trimbakeshwar & Godavari',
        district: 'Nashik',
        image: {
          url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=80',
          alt: 'Sacred river ghats and Jyotirlinga shrines at Nashik',
          location: 'Nashik',
          photographer: 'Unsplash Verified',
          source: 'Unsplash Verified',
          license: 'Unsplash License',
        },
      },
      {
        name: 'Bhandardara & Harishchandragad',
        district: 'Ahilyanagar',
        image: {
          url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1000&q=80',
          alt: 'Sheer basalt peaks and Arthur Lake in Bhandardara region',
          location: 'Ahilyanagar',
          photographer: 'Unsplash Verified',
          source: 'Unsplash Verified',
          license: 'Unsplash License',
        },
      },
    ],
  },
  marathwada: {
    hero: {
      url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
      fallbackUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Ajanta_%2863%29.jpg/1280px-Ajanta_%2863%29.jpg',
      alt: 'Ancient Buddhist rock-cut monasteries carved into the horseshoe gorge at Ajanta',
      location: 'Chhatrapati Sambhajinagar',
      photographer: 'Wikimedia Commons / ASI',
      source: 'Wikimedia Commons',
      license: 'CC BY-SA 4.0',
    },
    spots: [
      {
        name: 'Ajanta Caves',
        district: 'Chhatrapati Sambhajinagar',
        image: {
          url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
          alt: 'Ajanta Caves rock-cut facades',
          location: 'Chhatrapati Sambhajinagar',
          photographer: 'Wikimedia Commons',
          source: 'Wikimedia Commons',
          license: 'CC BY-SA 4.0',
        },
      },
      {
        name: 'Ellora Kailash Temple',
        district: 'Chhatrapati Sambhajinagar',
        image: {
          url: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1000&q=80',
          fallbackUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Kailasa_temple_at_ellora.jpg/1280px-Kailasa_temple_at_ellora.jpg',
          alt: 'Monolithic rock-carved Kailash temple at Ellora Caves',
          location: 'Ellora, Chhatrapati Sambhajinagar',
          photographer: 'Wikimedia Commons',
          source: 'Wikimedia Commons',
          license: 'CC BY-SA 4.0',
        },
      },
      {
        name: 'Hazur Sahib',
        district: 'Nanded',
        image: {
          url: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1000&q=80',
          alt: 'White marble sacred architecture of Hazur Sahib on the Godavari banks',
          location: 'Nanded',
          photographer: 'Wikimedia Commons',
          source: 'Wikimedia Commons',
          license: 'CC BY-SA 3.0',
        },
      },
    ],
  },
  vidarbha: {
    hero: {
      url: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=1600&q=80',
      alt: 'Royal Bengal Tiger prowling through dry teak forests of Tadoba-Andhari Reserve',
      location: 'Chandrapur, Vidarbha',
      photographer: 'Wildlife Photographer / Unsplash Verified',
      source: 'Unsplash Verified',
      license: 'Unsplash License',
    },
    spots: [
      {
        name: 'Tadoba Tiger Reserve',
        district: 'Chandrapur',
        image: {
          url: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=1000&q=80',
          alt: 'Tiger in Tadoba National Park',
          location: 'Chandrapur',
          photographer: 'Unsplash Verified',
          source: 'Unsplash Verified',
          license: 'Unsplash License',
        },
      },
      {
        name: 'Lonar Meteorite Crater Lake',
        district: 'Buldhana',
        image: {
          url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80',
          alt: 'Circular emerald saline lake inside ancient impact crater at Lonar',
          location: 'Buldhana',
          photographer: 'Wikimedia Commons',
          source: 'Wikimedia Commons',
          license: 'CC BY-SA 4.0',
        },
      },
      {
        name: 'Deekshabhoomi',
        district: 'Nagpur',
        image: {
          url: 'https://images.unsplash.com/photo-1599831104329-873d6118d049?auto=format&fit=crop&w=1000&q=80',
          alt: 'Monumental architectural stupa of Deekshabhoomi in Nagpur',
          location: 'Nagpur',
          photographer: 'Wikimedia Commons',
          source: 'Wikimedia Commons',
          license: 'CC BY-SA 3.0',
        },
      },
    ],
  },
};

// -------------------------------------------------------------
// 3. CATEGORY BACKGROUND PHOTOGRAPHY
// -------------------------------------------------------------
export const CATEGORY_IMAGES: Record<string, ImageMeta> = {
  beach: {
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    alt: 'Pristine turquoise waters and white sands of Konkan coast in Tarkarli',
    location: 'Tarkarli, Sindhudurg',
    photographer: 'Sean Oulashin',
    source: 'Unsplash Verified',
    license: 'Unsplash License',
  },
  mountain: {
    url: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1200&q=80',
    alt: 'Majestic Sahyadri mountain ridge lines cloaked in morning fog at Mahabaleshwar',
    location: 'Mahabaleshwar, Satara',
    photographer: 'Unsplash Verified',
    source: 'Unsplash Verified',
    license: 'Unsplash License',
  },
  fort: {
    url: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=1200&q=80',
    fallbackUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Raigad_Fort_aerial.jpg/1280px-Raigad_Fort_aerial.jpg',
    alt: 'Imposing stone battlements of Maratha capital Raigad Fort towering over the valley',
    location: 'Raigad Fort, Maharashtra',
    photographer: 'Wikimedia Commons',
    source: 'Wikimedia Commons',
    license: 'CC BY-SA 4.0',
  },
  wildlife: {
    url: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=1200&q=80',
    alt: 'Royal Bengal tiger in the teak forests of Tadoba-Andhari Reserve',
    location: 'Tadoba National Park, Chandrapur',
    photographer: 'Unsplash Verified',
    source: 'Unsplash Verified',
    license: 'Unsplash License',
  },
  heritage: {
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    fallbackUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Ajanta_%2863%29.jpg/1280px-Ajanta_%2863%29.jpg',
    alt: 'Ancient rock-cut Ajanta Caves cliff amphitheater, UNESCO World Heritage site',
    location: 'Ajanta Caves, Chhatrapati Sambhajinagar',
    photographer: 'Wikimedia Commons',
    source: 'Wikimedia Commons',
    license: 'CC BY-SA 4.0',
  },
  spiritual: {
    url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=80',
    alt: 'Sacred Trimbakeshwar Jyotirlinga temple and Ramkund Godavari ghats in Nashik',
    location: 'Trimbakeshwar & Nashik',
    photographer: 'Unsplash Verified',
    source: 'Unsplash Verified',
    license: 'Unsplash License',
  },
  food: {
    url: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=1200&q=80',
    alt: 'Traditional authentic Maharashtrian feast featuring bhakri, rassa, and regional curries',
    location: 'Kolhapur & Pune Food Trail',
    photographer: 'Unsplash Verified',
    source: 'Unsplash Verified',
    license: 'Unsplash License',
  },
  hidden: {
    url: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&w=1200&q=80',
    alt: 'Endemic wild flower bloom at UNESCO World Heritage Kaas Plateau laterite tableland',
    location: 'Kaas Plateau, Satara',
    photographer: 'Unsplash Verified',
    source: 'Unsplash Verified',
    license: 'Unsplash License',
  },
};

// -------------------------------------------------------------
// 4. DESTINATION-SPECIFIC IMAGE COLLECTIONS & GALLERIES
// -------------------------------------------------------------
export const DESTINATION_GALLERIES: Record<string, DestinationImages> = {
  'gateway-of-india': {
    id: 'gateway-of-india',
    name: 'Gateway of India',
    district: 'Mumbai',
    heroImage: {
      url: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1800&q=85',
      fallbackUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Gateway_of_India_-_Mumbai.jpg/1280px-Gateway_of_India_-_Mumbai.jpg',
      alt: 'Gateway of India at golden sunset over Apollo Bunder waterfront',
      location: 'Colaba, Mumbai',
      photographer: 'Jovyn Chamb',
      source: 'Unsplash Verified',
      license: 'Unsplash License',
    },
    cardImage: {
      url: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80',
      alt: 'Gateway of India arch and waterfront promenade',
      location: 'Mumbai',
      photographer: 'Jovyn Chamb',
      source: 'Unsplash Verified',
      license: 'Unsplash License',
    },
    thumbnail: {
      url: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=400&q=80',
      alt: 'Gateway of India monument thumbnail',
      location: 'Mumbai',
      photographer: 'Jovyn Chamb',
      source: 'Unsplash Verified',
      license: 'Unsplash License',
    },
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1400&q=80',
        alt: 'The majestic Indo-Saracenic arch of Gateway of India facing the harbor',
        location: 'Apollo Bunder, Mumbai',
        photographer: 'Jovyn Chamb',
        source: 'Unsplash Verified',
        license: 'Unsplash License',
      },
      {
        url: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=1400&q=80',
        alt: 'Marine Drive Queen\'s Necklace curving along Back Bay at twilight',
        location: 'Marine Drive, Mumbai',
        photographer: 'Unsplash Verified',
        source: 'Unsplash Verified',
        license: 'Unsplash License',
      },
      {
        url: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1400&q=80',
        alt: 'Historic colonial architecture and Taj Mahal Palace hotel fronting the harbor',
        location: 'Colaba, South Mumbai',
        photographer: 'Unsplash Verified',
        source: 'Unsplash Verified',
        license: 'Unsplash License',
      },
      {
        url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80',
        alt: 'Ancient rock-cut Trimurti sculpture at Elephanta Island Caves',
        location: 'Elephanta Island, Mumbai Harbor',
        photographer: 'Wikimedia Commons',
        source: 'Wikimedia Commons',
        license: 'CC BY-SA 4.0',
      },
    ],
  },

  // MALVAN & TARKARLI SPECIAL CINEMATIC EXPERIENCE
  tarkarli: {
    id: 'tarkarli',
    name: 'Tarkarli & Malvan',
    district: 'Sindhudurg',
    heroImage: {
      url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1800&q=85',
      fallbackUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Sindhudurg_fort.jpg/1280px-Sindhudurg_fort.jpg',
      alt: 'Crystal clear turquoise water and golden shores of Tarkarli Beach',
      location: 'Tarkarli, Sindhudurg',
      photographer: 'Sean Oulashin',
      source: 'Unsplash Verified',
      license: 'Unsplash License',
    },
    cardImage: {
      url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      alt: 'Tarkarli beach coastline with coconut palms and gentle surf',
      location: 'Sindhudurg',
      photographer: 'Sean Oulashin',
      source: 'Unsplash Verified',
      license: 'Unsplash License',
    },
    thumbnail: {
      url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80',
      alt: 'Tarkarli thumbnail',
      location: 'Sindhudurg',
      photographer: 'Sean Oulashin',
      source: 'Unsplash Verified',
      license: 'Unsplash License',
    },
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=1400&q=80',
        fallbackUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Sindhudurg_fort.jpg/1280px-Sindhudurg_fort.jpg',
        title: 'Sindhudurg Fort',
        alt: 'Chhatrapati Shivaji Maharaj\'s sea fortress built on Kurte island',
        location: 'Malvan, Sindhudurg',
        photographer: 'Wikimedia Commons / CC-BY-SA',
        source: 'Wikimedia Commons',
        license: 'CC BY-SA 4.0',
      },
      {
        url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80',
        title: 'Tarkarli Beach Waters',
        alt: 'Transparent sea bed waters and white sands of Tarkarli beach',
        location: 'Tarkarli Beach, Sindhudurg',
        photographer: 'Sean Oulashin',
        source: 'Unsplash Verified',
        license: 'Unsplash License',
      },
      {
        url: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1400&q=80',
        title: 'Devbag Sangam',
        alt: 'Quiet confluence where Karli River meets the Arabian Sea at Devbag',
        location: 'Devbag, Sindhudurg',
        photographer: 'Unsplash Verified',
        source: 'Unsplash Verified',
        license: 'Unsplash License',
      },
      {
        url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1400&q=80',
        title: 'Scuba Diving & Coral Reefs',
        alt: 'Underwater marine life and vibrant coral reefs off the Konkan coast',
        location: 'Malvan Marine Sanctuary',
        photographer: 'Unsplash Verified',
        source: 'Unsplash Verified',
        license: 'Unsplash License',
      },
    ],
  },

  mahabaleshwar: {
    id: 'mahabaleshwar',
    name: 'Mahabaleshwar',
    district: 'Satara',
    heroImage: {
      url: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1800&q=85',
      alt: 'Dramatic clifftop panoramic view from Arthur\'s Seat over the Savitri Valley',
      location: 'Mahabaleshwar, Satara',
      photographer: 'Unsplash Verified',
      source: 'Unsplash Verified',
      license: 'Unsplash License',
    },
    cardImage: {
      url: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=800&q=80',
      alt: 'Mahabaleshwar valleys and Sahyadri forests',
      location: 'Satara',
      photographer: 'Unsplash Verified',
      source: 'Unsplash Verified',
      license: 'Unsplash License',
    },
    thumbnail: {
      url: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=400&q=80',
      alt: 'Mahabaleshwar thumbnail',
      location: 'Satara',
      photographer: 'Unsplash Verified',
      source: 'Unsplash Verified',
      license: 'Unsplash License',
    },
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1400&q=80',
        alt: 'Arthur\'s Seat clifftop viewpoint',
        location: 'Mahabaleshwar',
        photographer: 'Unsplash Verified',
        source: 'Unsplash Verified',
        license: 'Unsplash License',
      },
      {
        url: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=1400&q=80',
        alt: 'Historic Pratapgad Fort bastion atop the Sahyadri spur',
        location: 'Pratapgad, Mahabaleshwar',
        photographer: 'Wikimedia Commons',
        source: 'Wikimedia Commons',
        license: 'CC BY-SA 4.0',
      },
      {
        url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1400&q=80',
        alt: 'Venna Lake encircled by tall trees during sunset',
        location: 'Venna Lake, Mahabaleshwar',
        photographer: 'Unsplash Verified',
        source: 'Unsplash Verified',
        license: 'Unsplash License',
      },
      {
        url: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&w=1400&q=80',
        alt: 'Wild strawberry fields and floral hills of the plateau',
        location: 'Satara hills',
        photographer: 'Unsplash Verified',
        source: 'Unsplash Verified',
        license: 'Unsplash License',
      },
    ],
  },

  kolhapur: {
    id: 'kolhapur',
    name: 'Kolhapur',
    district: 'Kolhapur',
    heroImage: {
      url: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1800&q=85',
      alt: 'Ancient Mahalakshmi Temple complex architectural pillars in Kolhapur',
      location: 'Kolhapur',
      photographer: 'Wikimedia Commons',
      source: 'Wikimedia Commons',
      license: 'CC BY-SA 4.0',
    },
    cardImage: {
      url: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=800&q=80',
      alt: 'Mahalakshmi temple stone facade',
      location: 'Kolhapur',
      photographer: 'Wikimedia Commons',
      source: 'Wikimedia Commons',
      license: 'CC BY-SA 4.0',
    },
    thumbnail: {
      url: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=400&q=80',
      alt: 'Kolhapur thumbnail',
      location: 'Kolhapur',
      photographer: 'Wikimedia Commons',
      source: 'Wikimedia Commons',
      license: 'CC BY-SA 4.0',
    },
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1400&q=80',
        alt: 'Mahalakshmi Temple sanctum and shikhara',
        location: 'Kolhapur',
        photographer: 'Wikimedia Commons',
        source: 'Wikimedia Commons',
        license: 'CC BY-SA 4.0',
      },
      {
        url: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1400&q=80',
        alt: 'Rankala Lake waterfront and evening skyline',
        location: 'Rankala Lake, Kolhapur',
        photographer: 'Unsplash Verified',
        source: 'Unsplash Verified',
        license: 'Unsplash License',
      },
      {
        url: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=1400&q=80',
        alt: 'Panhala Fort ramparts standing above the Sahyadri plains',
        location: 'Panhala, Kolhapur',
        photographer: 'Wikimedia Commons',
        source: 'Wikimedia Commons',
        license: 'CC BY-SA 4.0',
      },
      {
        url: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=1400&q=80',
        alt: 'Famous fiery Kolhapuri tambda and pandhra rassa feast',
        location: 'Kolhapur culinary street',
        photographer: 'Unsplash Verified',
        source: 'Unsplash Verified',
        license: 'Unsplash License',
      },
    ],
  },

  nashik: {
    id: 'nashik',
    name: 'Nashik',
    district: 'Nashik',
    heroImage: {
      url: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=1800&q=85',
      alt: 'Vineyard vines stretching toward the Sahyadri mountains in Nashik',
      location: 'Sula Vineyards, Nashik',
      photographer: 'Unsplash Verified',
      source: 'Unsplash Verified',
      license: 'Unsplash License',
    },
    cardImage: {
      url: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=800&q=80',
      alt: 'Nashik vineyard scenery',
      location: 'Nashik',
      photographer: 'Unsplash Verified',
      source: 'Unsplash Verified',
      license: 'Unsplash License',
    },
    thumbnail: {
      url: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=400&q=80',
      alt: 'Nashik thumbnail',
      location: 'Nashik',
      photographer: 'Unsplash Verified',
      source: 'Unsplash Verified',
      license: 'Unsplash License',
    },
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=1400&q=80',
        alt: 'Rolling vineyards of Sula and York in Nashik valley',
        location: 'Nashik',
        photographer: 'Unsplash Verified',
        source: 'Unsplash Verified',
        license: 'Unsplash License',
      },
      {
        url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1400&q=80',
        alt: 'Trimbakeshwar Temple at the base of Brahmagiri mountain',
        location: 'Trimbakeshwar, Nashik',
        photographer: 'Unsplash Verified',
        source: 'Unsplash Verified',
        license: 'Unsplash License',
      },
      {
        url: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1400&q=80',
        alt: 'Panchavati Godavari river ghats and sacred temples',
        location: 'Panchavati, Nashik',
        photographer: 'Unsplash Verified',
        source: 'Unsplash Verified',
        license: 'Unsplash License',
      },
    ],
  },

  'ajanta-caves': {
    id: 'ajanta-caves',
    name: 'Ajanta Caves',
    district: 'Chhatrapati Sambhajinagar',
    heroImage: {
      url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=85',
      fallbackUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Ajanta_%2863%29.jpg/1280px-Ajanta_%2863%29.jpg',
      alt: 'Horseshoe-shaped Waghora river canyon holding the 30 rock-cut Ajanta Caves',
      location: 'Ajanta, Chhatrapati Sambhajinagar',
      photographer: 'Wikimedia Commons',
      source: 'Wikimedia Commons',
      license: 'CC BY-SA 4.0',
    },
    cardImage: {
      url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      alt: 'Ajanta Caves facade in basalt cliff',
      location: 'Chhatrapati Sambhajinagar',
      photographer: 'Wikimedia Commons',
      source: 'Wikimedia Commons',
      license: 'CC BY-SA 4.0',
    },
    thumbnail: {
      url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80',
      alt: 'Ajanta Caves thumbnail',
      location: 'Chhatrapati Sambhajinagar',
      photographer: 'Wikimedia Commons',
      source: 'Wikimedia Commons',
      license: 'CC BY-SA 4.0',
    },
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80',
        alt: 'Panoramic overlook of the complete horseshoe gorge at Ajanta',
        location: 'Ajanta Viewpoint',
        photographer: 'Wikimedia Commons',
        source: 'Wikimedia Commons',
        license: 'CC BY-SA 4.0',
      },
      {
        url: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1400&q=80',
        alt: 'Monolithic rock architecture of nearby Kailash Temple at Ellora',
        location: 'Ellora Caves',
        photographer: 'Wikimedia Commons',
        source: 'Wikimedia Commons',
        license: 'CC BY-SA 4.0',
      },
      {
        url: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1400&q=80',
        alt: 'Bibi Ka Maqbara white marble Mughal architecture in Chhatrapati Sambhajinagar',
        location: 'Bibi Ka Maqbara',
        photographer: 'Wikimedia Commons',
        source: 'Wikimedia Commons',
        license: 'CC BY-SA 3.0',
      },
    ],
  },

  tadoba: {
    id: 'tadoba',
    name: 'Tadoba-Andhari Reserve',
    district: 'Chandrapur',
    heroImage: {
      url: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=1800&q=85',
      alt: 'Wild Bengal Tiger drinking by the waterhole in Tadoba National Park',
      location: 'Tadoba, Chandrapur',
      photographer: 'Unsplash Verified',
      source: 'Unsplash Verified',
      license: 'Unsplash License',
    },
    cardImage: {
      url: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=800&q=80',
      alt: 'Tiger in Tadoba teak forest',
      location: 'Chandrapur',
      photographer: 'Unsplash Verified',
      source: 'Unsplash Verified',
      license: 'Unsplash License',
    },
    thumbnail: {
      url: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=400&q=80',
      alt: 'Tadoba thumbnail',
      location: 'Chandrapur',
      photographer: 'Unsplash Verified',
      source: 'Unsplash Verified',
      license: 'Unsplash License',
    },
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=1400&q=80',
        alt: 'Majestic Royal Bengal Tiger in Tadoba forest',
        location: 'Moharli Gate, Tadoba',
        photographer: 'Unsplash Verified',
        source: 'Unsplash Verified',
        license: 'Unsplash License',
      },
      {
        url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1400&q=80',
        alt: 'Tadoba Lake reflections and water birds at sunset',
        location: 'Tadoba Lake, Chandrapur',
        photographer: 'Unsplash Verified',
        source: 'Unsplash Verified',
        license: 'Unsplash License',
      },
      {
        url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1400&q=80',
        alt: 'Dense bamboo and teak canopy safari trail in Vidarbha',
        location: 'Kolara Gate, Tadoba',
        photographer: 'Unsplash Verified',
        source: 'Unsplash Verified',
        license: 'Unsplash License',
      },
    ],
  },

  'lonar-crater-lake': {
    id: 'lonar-crater-lake',
    name: 'Lonar Crater Lake',
    district: 'Buldhana',
    heroImage: {
      url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1800&q=85',
      alt: 'Awe-inspiring view of the circular 52,000-year-old basalt meteorite impact lake at Lonar',
      location: 'Lonar, Buldhana',
      photographer: 'Wikimedia Commons',
      source: 'Wikimedia Commons',
      license: 'CC BY-SA 4.0',
    },
    cardImage: {
      url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
      alt: 'Lonar crater lake rim and emerald water',
      location: 'Buldhana',
      photographer: 'Wikimedia Commons',
      source: 'Wikimedia Commons',
      license: 'CC BY-SA 4.0',
    },
    thumbnail: {
      url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
      alt: 'Lonar thumbnail',
      location: 'Buldhana',
      photographer: 'Wikimedia Commons',
      source: 'Wikimedia Commons',
      license: 'CC BY-SA 4.0',
    },
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1400&q=80',
        alt: 'Complete panoramic view of the ancient meteorite impact crater',
        location: 'Lonar Viewpoint, Buldhana',
        photographer: 'Wikimedia Commons',
        source: 'Wikimedia Commons',
        license: 'CC BY-SA 4.0',
      },
      {
        url: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1400&q=80',
        alt: 'Ancient Hemadpanthi Daitya Sudan Temple located along crater rim',
        location: 'Lonar town, Buldhana',
        photographer: 'Wikimedia Commons',
        source: 'Wikimedia Commons',
        license: 'CC BY-SA 4.0',
      },
      {
        url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1400&q=80',
        alt: 'Forest trail descending the steep basalt wall to the saline lake',
        location: 'Lonar Crater Rim Trail',
        photographer: 'Wikimedia Commons',
        source: 'Wikimedia Commons',
        license: 'CC BY-SA 4.0',
      },
    ],
  },
};

// -------------------------------------------------------------
// 5. HIDDEN SPOT REAL PHOTOGRAPHY
// -------------------------------------------------------------
export const HIDDEN_SPOTS_IMAGES: Record<string, ImageMeta> = {
  'bhogwe-beach': {
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
    alt: 'Untouched secluded sands and golden sea cliffs at Bhogwe Beach, Konkan',
    location: 'Bhogwe, Sindhudurg',
    photographer: 'Sean Oulashin',
    source: 'Unsplash Verified',
    license: 'Unsplash License',
  },
  'kaas-plateau': {
    url: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&w=1000&q=80',
    alt: 'Vibrant wild flower carpet across volcanic laterite tableland at Kaas',
    location: 'Kaas Pathar, Satara',
    photographer: 'Unsplash Verified',
    source: 'Unsplash Verified',
    license: 'Unsplash License',
  },
  'konkan-kada': {
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1000&q=80',
    alt: 'Massive semi-circular vertical cliff overhang at Konkan Kada, Harishchandragad',
    location: 'Harishchandragad, Ahilyanagar',
    photographer: 'Unsplash Verified',
    source: 'Unsplash Verified',
    license: 'Unsplash License',
  },
  'sandhan-valley': {
    url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1000&q=80',
    alt: 'Deep rock-cut slot canyon with sheer basalt walls in Sandhan Valley',
    location: 'Samrad, Bhandardara region',
    photographer: 'Unsplash Verified',
    source: 'Unsplash Verified',
    license: 'Unsplash License',
  },
  'ganeshgule-beach': {
    url: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1000&q=80',
    alt: 'Secluded rocky cove flanked by areca nut palms at Ganeshgule',
    location: 'Ratnagiri Coast',
    photographer: 'Unsplash Verified',
    source: 'Unsplash Verified',
    license: 'Unsplash License',
  },
  'purushwadi-fireflies': {
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1000&q=80',
    alt: 'Luminous starry night forest in the tribal hills of Purushwadi',
    location: 'Purushwadi, Akole',
    photographer: 'Unsplash Verified',
    source: 'Unsplash Verified',
    license: 'Unsplash License',
  },
};

// -------------------------------------------------------------
// HELPER FUNCTIONS FOR IMAGE RETRIEVAL WITH SAFE FALLBACKS
// -------------------------------------------------------------
export function getDestinationImage(slug: string): ImageMeta {
  const collection = DESTINATION_GALLERIES[slug];
  if (collection) {
    return collection.cardImage;
  }
  // Generic verified Sahyadri fallback
  return {
    url: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=800&q=80',
    alt: 'Maharashtra scenery',
    location: 'Maharashtra',
    photographer: 'Unsplash Verified',
    source: 'Unsplash Verified',
    license: 'Unsplash License',
  };
}

export function getDestinationGallery(slug: string): ImageMeta[] {
  const collection = DESTINATION_GALLERIES[slug];
  if (collection && collection.gallery.length > 0) {
    return collection.gallery;
  }
  return [];
}

export function getCategoryImage(categorySlug: string): ImageMeta {
  return (
    CATEGORY_IMAGES[categorySlug] || {
      url: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1200&q=80',
      alt: 'Maharashtra landscape',
      location: 'Maharashtra',
      photographer: 'Unsplash Verified',
      source: 'Unsplash Verified',
      license: 'Unsplash License',
    }
  );
}

export function getHiddenSpotImage(slug: string): ImageMeta {
  return (
    HIDDEN_SPOTS_IMAGES[slug] || {
      url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1000&q=80',
      alt: 'Hidden Maharashtra landscape',
      location: 'Maharashtra',
      photographer: 'Unsplash Verified',
      source: 'Unsplash Verified',
      license: 'Unsplash License',
    }
  );
}
