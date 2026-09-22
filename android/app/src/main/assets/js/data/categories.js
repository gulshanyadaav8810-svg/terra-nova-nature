/* ==========================================================
   NATURE MOMENTS — CATEGORIES SERVICE & DATA
   20+ Curated Nature Categories with Dynamic Admin Extension
   ========================================================== */

export const INITIAL_CATEGORIES = [
  { id: 'trending', name: 'Trending', icon: '🔥', image_url: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=200&q=80', description: 'Most watched and peaceful nature moments trending today' },
  { id: 'forest', name: 'Forest', icon: '🌲', image_url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=200&q=80', description: 'Deep pine canopies, ancient redwoods, and whispering moss sanctuaries' },
  { id: 'mountain', name: 'Mountain', icon: '⛰️', image_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=200&q=80', description: 'Majestic alpine summits, misty crags, and high-altitude vistas' },
  { id: 'waterfall', name: 'Waterfall', icon: '💦', image_url: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=200&q=80', description: 'Cascading emerald drops, roaring gorges, and hidden glacial streams' },
  { id: 'rain', name: 'Rain', icon: '🌧️', image_url: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=200&q=80', description: 'Gentle drops falling on leaves, soothing storms, and ambient rainfall' },
  { id: 'ocean', name: 'Ocean', icon: '🐋', image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=200&q=80', description: 'Rhythmic ocean waves, turquoise shallows, and coastal tides' },
  { id: 'sunset', name: 'Sunset', icon: '🌇', image_url: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?auto=format&fit=crop&w=200&q=80', description: 'Golden twilight, fiery orange horizons, and dusk over mountains' },
  { id: 'sunrise', name: 'Sunrise', icon: '🌅', image_url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=200&q=80', description: 'First light breaking over misty valleys and serene dawn horizons' },
  { id: 'flowers', name: 'Flowers', icon: '🌸', image_url: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=200&q=80', description: 'Blooming wild blossoms, spring meadows, and petal-draped valleys' },
  { id: 'wildlife', name: 'Wildlife', icon: '🦌', image_url: 'https://images.unsplash.com/photo-1484406566174-9da000fda645?auto=format&fit=crop&w=200&q=80', description: 'Graceful deer, playful river otters, and wild creatures in their habitats' },
  { id: 'river', name: 'River', icon: '🌊', image_url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=200&q=80', description: 'Crystal mountain brooks, flowing gravel shallows, and winding streams' },
  { id: 'beach', name: 'Beach', icon: '🏖️', image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=200&q=80', description: 'Golden sandy shores, gentle lap of sea waves, and tropical dunes' },
  { id: 'clouds', name: 'Clouds', icon: '☁️', image_url: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=200&q=80', description: 'Rolling cloud inversions, cotton vapor blankets, and sky drift' },
  { id: 'snow', name: 'Snow', icon: '❄️', image_url: 'https://images.unsplash.com/photo-1491002052546-bf38f186af56?auto=format&fit=crop&w=200&q=80', description: 'Quiet snowfall in pine woods, powdered peaks, and winter calm' },
  { id: 'greenery', name: 'Greenery', icon: '🍃', image_url: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=200&q=80', description: 'Lush rolling green hills, clover pastures, and vibrant emerald lawns' },
  { id: 'lake', name: 'Lake', icon: '🛶', image_url: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=200&q=80', description: 'Mirror-calm mountain waters, tranquil shorelines, and misty reflections' },
  { id: 'jungle', name: 'Jungle', icon: '🌴', image_url: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=200&q=80', description: 'Tropical rainforests, exotic flora, and lively canopy sounds' },
  { id: 'night-sky', name: 'Night Sky', icon: '✨', image_url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=200&q=80', description: 'Starlit celestial expanses, constellations, and quiet midnight skies' },
  { id: 'birds', name: 'Birds', icon: '🕊️', image_url: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?auto=format&fit=crop&w=200&q=80', description: 'Melodic dawn chorus, migratory flocks, and avian woodland songs' },
  { id: 'nature', name: 'Nature', icon: '🌿', image_url: 'https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?auto=format&fit=crop&w=200&q=80', description: 'Pure unadorned earth moments, organic beauty, and deep serenity' }
];

export let CATEGORIES = [...INITIAL_CATEGORIES];

export const CATEGORY_THEMES = {
  trending: { color: '#EF4444', border: 'rgba(239, 68, 68, 0.5)', glow: 'rgba(239, 68, 68, 0.45)' },
  forest: { color: '#10B981', border: 'rgba(16, 185, 129, 0.5)', glow: 'rgba(16, 185, 129, 0.45)' },
  mountain: { color: '#38BDF8', border: 'rgba(56, 189, 248, 0.5)', glow: 'rgba(56, 189, 248, 0.45)' },
  waterfall: { color: '#06B6D4', border: 'rgba(6, 182, 212, 0.5)', glow: 'rgba(6, 182, 212, 0.45)' },
  rain: { color: '#60A5FA', border: 'rgba(96, 165, 250, 0.5)', glow: 'rgba(96, 165, 250, 0.45)' },
  ocean: { color: '#0284C7', border: 'rgba(2, 132, 199, 0.5)', glow: 'rgba(2, 132, 199, 0.45)' },
  sunset: { color: '#F59E0B', border: 'rgba(245, 158, 11, 0.5)', glow: 'rgba(245, 158, 11, 0.45)' },
  sunrise: { color: '#FB923C', border: 'rgba(251, 146, 60, 0.5)', glow: 'rgba(251, 146, 60, 0.45)' },
  flowers: { color: '#EC4899', border: 'rgba(236, 72, 153, 0.5)', glow: 'rgba(236, 72, 153, 0.45)' },
  wildlife: { color: '#D97706', border: 'rgba(217, 119, 6, 0.5)', glow: 'rgba(217, 119, 6, 0.45)' },
  river: { color: '#14B8A6', border: 'rgba(20, 184, 166, 0.5)', glow: 'rgba(20, 184, 166, 0.45)' },
  beach: { color: '#FBBF24', border: 'rgba(251, 191, 36, 0.5)', glow: 'rgba(251, 191, 36, 0.45)' },
  clouds: { color: '#94A3B8', border: 'rgba(148, 163, 184, 0.5)', glow: 'rgba(148, 163, 184, 0.45)' },
  snow: { color: '#BAE6FD', border: 'rgba(186, 230, 253, 0.55)', glow: 'rgba(186, 230, 253, 0.45)' },
  greenery: { color: '#22C55E', border: 'rgba(34, 197, 94, 0.5)', glow: 'rgba(34, 197, 94, 0.45)' },
  lake: { color: '#6366F1', border: 'rgba(99, 102, 241, 0.5)', glow: 'rgba(99, 102, 241, 0.45)' },
  jungle: { color: '#84CC16', border: 'rgba(132, 204, 22, 0.5)', glow: 'rgba(132, 204, 22, 0.45)' },
  'night-sky': { color: '#818CF8', border: 'rgba(129, 140, 248, 0.5)', glow: 'rgba(129, 140, 248, 0.45)' },
  birds: { color: '#2DD4BF', border: 'rgba(45, 212, 191, 0.5)', glow: 'rgba(45, 212, 191, 0.45)' },
  nature: { color: '#10B981', border: 'rgba(16, 185, 129, 0.5)', glow: 'rgba(16, 185, 129, 0.45)' }
};

export function getCategoryTheme(id) {
  return CATEGORY_THEMES[id] || { color: '#10B981', border: 'rgba(16, 185, 129, 0.5)', glow: 'rgba(16, 185, 129, 0.45)' };
}

function loadDynamicCategories() {
  try {
    const custom = localStorage.getItem('nature_custom_categories');
    if (custom) {
      const parsed = JSON.parse(custom);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const existingIds = new Set(INITIAL_CATEGORIES.map(c => c.id));
        const newCats = parsed.filter(c => !existingIds.has(c.id));
        CATEGORIES = [...INITIAL_CATEGORIES, ...newCats];
      }
    }
  } catch (e) {
    console.warn('Error loading custom categories:', e);
  }
}

// Initial load
loadDynamicCategories();

export function getAllCategories() {
  loadDynamicCategories();
  return CATEGORIES;
}

export function getCategoryById(id) {
  loadDynamicCategories();
  return CATEGORIES.find(c => c.id === id) || CATEGORIES[0];
}

export function addCustomCategory(cat) {
  try {
    const custom = JSON.parse(localStorage.getItem('nature_custom_categories') || '[]');
    const filtered = custom.filter(c => c.id !== cat.id);
    filtered.push(cat);
    localStorage.setItem('nature_custom_categories', JSON.stringify(filtered));
    loadDynamicCategories();
    return true;
  } catch (e) {
    console.error('Error saving custom category:', e);
    return false;
  }
}
