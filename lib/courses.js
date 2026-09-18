export const COURSES = [
  {
    id: 'course-1',
    title: 'Mastering Wildlife Telephoto Photography & Stalking',
    instructor: 'Liam Thorne • 18 Years BBC Natural History Unit',
    thumbnail: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=800&q=80',
    desc: 'Learn how to read animal behavior, anticipate predator rushes, manage atmospheric heat distortion at 600mm–1200mm, and apply ethical tracking techniques in remote sanctuaries.',
    duration: '8.5 Hours',
    modulesCount: '14 Field Modules',
    level: 'All Experience Levels',
    tag: 'Wildlife Photography',
    syllabus: [
      'Predicting Predator Motion & Animal Alarm Signals',
      'Long Glass Optics (600mm & 800mm Prime Lens Handling)',
      'Low-Light Focus Tracking in Dense Teak and Rain',
      'Ethical Stalking Protocols in Fragile Habitats'
    ]
  },
  {
    id: 'course-2',
    title: 'Macro Forest Ecology & 8K Time-Lapse Techniques',
    instructor: 'Dr. Elena Vance • National Geographic Contributor',
    thumbnail: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=800&q=80',
    desc: 'Unlock the unseen micro-world. Master rigging motorized sliders in ancient rainforest canopies, 5:1 macro optics, and continuous day-to-night exposure ramping.',
    duration: '6.0 Hours',
    modulesCount: '10 Field Modules',
    level: 'Intermediate to Advanced',
    tag: 'Forest Ecology',
    syllabus: [
      '2:1 to 5:1 Ultra-Macro Lens Rigs & Depth Focus Stacking',
      'Motorized 3-Axis Slider Rigging in 100% Humidity',
      'Bioluminescent Fungi & Night Ultraviolet Lighting',
      'Canopy Rope Ascents with Fragile Optical Equipment'
    ]
  },
  {
    id: 'course-3',
    title: 'High-Altitude Wildlife Drone Pilotry in Mountain Winds',
    instructor: 'Callum MacLeod • High-Altitude Explorer',
    thumbnail: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
    desc: 'Fly safely in sub-zero alpine conditions. Cold battery chemistry management, propeller de-icing, and non-invasive aerial animal tracking ethics 4,000 meters above sea level.',
    duration: '5.5 Hours',
    modulesCount: '9 Field Modules',
    level: 'Advanced Aviators',
    tag: 'Aerial Tracking',
    syllabus: [
      'Rotor Dynamics, Mountain Lee Waves & Down-Draft Recovery',
      'Sub-Zero Battery Chemistry & Critical Voltage Sag',
      'Non-Disturbance Safe Altitude Guidelines for Raptors',
      'Autonomous Waypoint Mapping for Glacier Topography'
    ]
  },
  {
    id: 'course-4',
    title: 'Field Bioacoustics: Recording the Symphony of Earth',
    instructor: 'Kofi Mensah • Acclaimed Natural Sound Recordist',
    thumbnail: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    desc: 'Capture pristine natural soundscapes with parabolic reflectors, binaural 3D microphones, and hydrophones in turbulent rivers and ocean reefs.',
    duration: '4.5 Hours',
    modulesCount: '8 Field Modules',
    level: 'Beginner to Pro',
    tag: 'Bioacoustics',
    syllabus: [
      'Parabolic Dish Acoustics & Long-Range Avian Calls',
      'Hydrophone Deployment in Coral Reefs & Alpine Streams',
      'Spectrogram Analysis & Digital Audio Cleaning Techniques',
      'Microphone Blimp Wind Jamming in 50-knot Gale Storms'
    ]
  }
];

export function getCourseById(id) {
  return COURSES.find(c => c.id === id);
}
