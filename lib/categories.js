export const CATEGORIES = [
  {
    slug: 'wild-animals',
    key: 'animals',
    name: 'Wild Animals & Predators',
    shortName: 'Wild Animals',
    pill: '🦁 WILD ANIMALS',
    icon: '🦁',
    description: 'Apex predators, big cat tracking, migration corridors, and behavioral field studies.',
    tagline: 'Track apex predators, territorial carnivores, and nocturnal hunters across untamed sanctuaries.',
    heroImage: 'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=1600&q=80',
    count: 3
  },
  {
    slug: 'deep-nature',
    key: 'nature',
    name: 'Deep Nature & Old-Growth Forests',
    shortName: 'Deep Nature',
    pill: '🌿 DEEP NATURE',
    icon: '🌿',
    description: 'Ancient redwood canopies, cloud forest epiphytes, and subterranean fungal networks.',
    tagline: 'Step beneath ancient emerald crowns, moss-draped canopies, and living botanical kingdoms.',
    heroImage: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=1600&q=80',
    count: 3
  },
  {
    slug: 'ocean-depths',
    key: 'ocean',
    name: 'Ocean Depths & Coral Reefs',
    shortName: 'Ocean Depths',
    pill: '🌊 OCEAN DEPTHS',
    icon: '🌊',
    description: 'Bioluminescent night reefs, pelagic manta rays, cetacean bioacoustics, and abyssal canyons.',
    tagline: 'Explore twilight depths, fluorescent coral cities, and the migration pathways of marine giants.',
    heroImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1600&q=80',
    count: 3
  },
  {
    slug: 'mountain-aviary',
    key: 'mountains',
    name: 'Mountain Aviary & Alpine Extremes',
    shortName: 'Mountain Aviary',
    pill: '🦅 MOUNTAIN AVIARY',
    icon: '🦅',
    description: 'High-altitude snow leopard tracking, golden eagle thermals, and Andean condor flight dynamics.',
    tagline: 'Ascend sub-zero granite crags, glacier cirques, and alpine thermal updrafts with apex raptors.',
    heroImage: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1600&q=80',
    count: 3
  }
];

export function getCategoryBySlug(slug) {
  return CATEGORIES.find(c => c.slug === slug || c.key === slug);
}

export function getCategoryByKey(key) {
  return CATEGORIES.find(c => c.key === key);
}
