/**
 * TERRA NOVA — Nature & Wildlife Expedition Journals
 * High-Performance Application Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  /* ==========================================================================
     1. IN-DEPTH EXPEDITION ARTICLES DATABASE (Illustrated Wildlife Journalism)
     ========================================================================== */
  const ARTICLES_DATABASE = [
    {
      id: 'art-1',
      title: 'Shadows of the Bengal Tiger: Stalking the Monsoon Forest',
      category: 'animals',
      categoryLabel: '🦁 Wild Animals & Predators',
      categoryPill: '🦁 WILD ANIMALS',
      readTime: '7 Min Read',
      date: 'September 12, 2026',
      location: 'Ranthambore National Park, Rajasthan, India',
      author: {
        name: 'Liam Thorne',
        role: 'Field Naturalist & Wildlife Photographer',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80'
      },
      image: 'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=1200&q=80',
      excerpt: 'Deep in the bamboo thickets of Zone 3, fresh pugmarks in monsoon mud revealed the presence of the legendary matriarch tigress Arrowhead and her three vulnerable cubs.',
      fullContent: `
        <p>The monsoon rain had broken just before dawn, leaving the forest canopy of Ranthambore dripping in quiet unison. At 05:40 AM, our open gypsy tracked along the muddy banks of Padam Talao lake. The air was thick with the scent of wet teak and crushed wild jasmine.</p>

        <h3>The Language of the Alarm Calls</h3>
        <p>In tiger territory, you do not look for the predator first; you listen to the prey. A sudden, sharp coughing bark echoed from a solitary male spotted deer (chital) standing near the ancient 10th-century fortress ruins. Moments later, a troop of gray langur monkeys scrambled up into the highest branches of a banyan tree, issuing their guttural, rapid warning chitters. There was no doubt: an apex predator was on the move.</p>

        <div class="pull-quote">
          "A nine-foot wild tiger doesn't merely enter a clearing—it alters the atmospheric pressure of the entire valley. Every breath of wind holds its breath."
        </div>

        <p>Through binoculars, we watched a patch of dense yellow bamboo part. Out stepped Arrowhead, the 140-kilogram dominant tigress of the lake zone. Her burnt-orange coat gleamed with amber radiance against the emerald rain-soaked undergrowth. Behind her, keeping close to her rear flanks, trotted three cubs, barely four months old.</p>

        <h3>Tactics of Survival in Treacherous Terrain</h3>
        <p>The monsoon season is double-edged for big cats. While prey animals are abundant and water is plentiful, dense vegetation drastically reduces visibility. Rogue male tigers constantly roam territorial boundaries, posing a lethal risk to cubs that are not their own. Over the course of four hours, we documented Arrowhead leading her litter away from the main safari tracks into a secluded sandstone ravine.</p>

        <div class="field-gear-box">
          <h4>📷 Field Camera Settings & Optics</h4>
          <div class="gear-grid">
            <div><span>Camera Body:</span><strong>Sony Alpha 1 (50.1 MP)</strong></div>
            <div><span>Telephoto Lens:</span><strong>FE 600mm f/4 GM OSS</strong></div>
            <div><span>Exposure:</span><strong>1/1600s • f/4.0 • ISO 1250</strong></div>
            <div><span>Support:</span><strong>Sachtler Carbon Gimbal Rig</strong></div>
          </div>
        </div>

        <p>By noon, the tigress had safely cached her cubs under a rocky overhang sheltered from the torrential rain before setting out on a solo stalking run against a sounder of wild boar. To witness this level of parental vigilance in one of the most endangered big cat species on Earth was a profound testament to the fragile resilience of Indian wilderness.</p>

        <div class="fact-highlight-box">
          <h4>🌿 Conservation Status & Field Notes</h4>
          <p>Bengal Tigers (<em>Panthera tigris tigris</em>) are currently classified as Endangered on the IUCN Red List. India's Project Tiger currently protects over 3,100 wild individuals, representing 75% of the world's remaining wild tiger population.</p>
        </div>
      `,
      isTrending: true
    },
    {
      id: 'art-2',
      title: 'Kingdom of Canopy: Ancient Redwoods & Bioluminescent Fungi',
      category: 'nature',
      categoryLabel: '🌿 Deep Nature & Forests',
      categoryPill: '🌿 NATURE & FORESTS',
      readTime: '6 Min Read',
      date: 'September 08, 2026',
      location: 'Humboldt Redwoods State Park, California, USA',
      author: {
        name: 'Dr. Elena Vance',
        role: 'Forest Canopy Ecologist',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'
      },
      image: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=1200&q=80',
      excerpt: 'Ascending 280 feet into the ancient old-growth redwood crown reveals an isolated suspended world of fern mats, flying squirrels, and glowing night mycelium.',
      fullContent: `
        <p>Standing at the foot of a 2,200-year-old coastal redwood (<em>Sequoia sempervirens</em>), the human mind struggles with scale. Reaching upward 320 feet into the dense Pacific coastal fog, its crown exists in an atmospheric realm entirely detached from the forest floor below.</p>

        <h3>The Suspended Soil of the Canopy</h3>
        <p>Using arborist ascenders and static climbing ropes, our research team ascended into the lower canopy branches. What we found was astounding: centuries of accumulated needle litter, moss, and decaying bark have created hanging soils up to three feet deep perched directly on massive horizontal boughs. Entire secondary ecosystems—including leather ferns, wandering salamanders, and specialized canopy beetles—spend their entire lifecycles without ever touching the earth.</p>

        <div class="pull-quote">
          "The upper redwood canopy isn't just tree branches—it is a floating archipelago of hanging gardens that has remained undisturbed since the Roman Empire."
        </div>

        <h3>Bioluminescent Night Observations</h3>
        <p>As darkness settled over Humboldt, the true magic unfolded. Switching off our headlamps, we observed green bioluminescent fungal colonies (<em>Panellus stipticus</em>) glowing across rotting trunk hollows. These luminous networks emit a cold, continuous emerald light designed to attract spore-dispersing night arthropods in the canopy mist.</p>

        <div class="field-gear-box">
          <h4>📷 Field Camera Settings & Optics</h4>
          <div class="gear-grid">
            <div><span>Camera Body:</span><strong>Canon EOS R5 C</strong></div>
            <div><span>Macro Lens:</span><strong>RF 100mm f/2.8L Macro IS USM</strong></div>
            <div><span>Exposure:</span><strong>25s • f/3.2 • ISO 3200 (Long Exposure)</strong></div>
            <div><span>Lighting:</span><strong>UV Ultraviolet LED Wand (365nm)</strong></div>
          </div>
        </div>

        <p>Understanding these canopy micro-climates is vital. Coastal redwoods capture up to 40% of their annual moisture directly from maritime fog through their needles, demonstrating nature's ingenious engineering against drought and warming climate patterns.</p>
      `,
      isTrending: true
    },
    {
      id: 'art-3',
      title: 'The Great Migration: Crossing the Mara River with Apex Lions',
      category: 'animals',
      categoryLabel: '🦁 Wild Animals & Predators',
      categoryPill: '🦁 WILD ANIMALS',
      readTime: '8 Min Read',
      date: 'August 28, 2026',
      location: 'Maasai Mara National Reserve, Kenya',
      author: {
        name: 'Kofi Mensah',
        role: 'East African Wildlife Guide & Writer',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80'
      },
      image: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=1200&q=80',
      excerpt: 'Two million wildebeest converge on the churning brown waters of the Mara River where monster Nile crocodiles and a coalition of five black-maned lions wait in ambush.',
      fullContent: `
        <p>The ground beneath our Land Cruiser vibrated with the rhythmic drumming of hundreds of thousands of hooves. For three days, a super-herd of blue wildebeest and plains zebras had been gathering along the rocky bluffs of Crossing Point 4, hesitated by the steep muddy drop and the churning waters below.</p>

        <h3>The Psychology of the Herd Stampede</h3>
        <p>Wildebeest crossings are driven by frantic collective momentum. A single nervous individual made the initial plunge into the water, and instantly, chaos erupted. In seconds, thousands of animals cascaded down the crumbling 40-foot embankment in an avalanche of red dust, grunts, and thrashing water.</p>

        <div class="pull-quote">
          "Nature is at its most raw and unvarnished when survival becomes a matter of pure numbers. The Mara River is the ultimate crucible of the African continent."
        </div>

        <h3>Lions in Strategic Ambush</h3>
        <p>While 16-foot Nile crocodiles attacked from the center currents, a seasoned coalition of male lions—known to local rangers as the 'Ridge Pride'—lay crouched in the croton bushes directly on the southern bank exit. As exhausted wildebeest scrambled onto the muddy shore, the lions executed a textbook cooperative pincer hunt with lethal precision.</p>

        <div class="field-gear-box">
          <h4>📷 Field Camera Settings & Optics</h4>
          <div class="gear-grid">
            <div><span>Camera Body:</span><strong>Nikon Z9 High-Speed Flagship</strong></div>
            <div><span>Telephoto:</span><strong>NIKKOR Z 400mm f/2.8 TC VR S</strong></div>
            <div><span>Exposure:</span><strong>1/3200s • f/4.0 • ISO 800</strong></div>
            <div><span>Dust Protection:</span><strong>Sealed Storm Bellows Wrap</strong></div>
          </div>
        </div>

        <p>Within two hours, the crossing had concluded. More than 40,000 animals made it across safely to the sweet green grasses of the northern Mara, leaving behind an indelible testament to the greatest terrestrial mammal migration surviving on Earth.</p>
      `,
      isTrending: true
    },
    {
      id: 'art-4',
      title: 'Abyssal Twilight: Night Diving the Coral Citadel of Raja Ampat',
      category: 'ocean',
      categoryLabel: '🌊 Ocean Depths & Reefs',
      categoryPill: '🌊 OCEAN DEPTHS',
      readTime: '6 Min Read',
      date: 'August 19, 2026',
      location: 'Misool Archipelago, Raja Ampat, Indonesia',
      author: {
        name: 'Maya Lin',
        role: 'Marine Biologist & Expedition Diver',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80'
      },
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
      excerpt: 'Plunging 45 meters beneath surface currents under ultraviolet light reveals living neon coral polyps, hunting reef sharks, and five-meter oceanic manta rays.',
      fullContent: `
        <p>Rolling backwards into the equatorial black water of the Dampier Strait at 21:00, the surface world vanished into ink. With a dive team equipped with specialized 450nm royal blue lights and yellow barrier filters, the coral reef transformed from its daytime pastels into a pulsing psychedelic metropolis.</p>

        <h3>Fluorescence of the Living Polyps</h3>
        <p>Hard and soft corals contain fluorescent proteins that absorb ultraviolet light and re-emit it in brilliant shades of neon green, electric orange, and incandescent violet. Under UV illumination, tiny microscopic polyp tentacles reached out into the current like miniature glowing flowers, actively feeding on passing zooplankton.</p>

        <div class="pull-quote">
          "The night reef is an entirely different biosphere. Creatures that hide in shadowy crevices by day emerge as dominant nocturnal predators once the sun sets."
        </div>

        <h3>Encounter with the Ocean Manta Giants</h3>
        <p>At 30 meters depth near a submerged pinnacle, our lights illuminated the sweeping white underbelly of a giant oceanic manta ray (<em>Mobula birostris</em>). With a five-meter wingspan, the gentle titan executed slow, barrel-roll feeding maneuvers through clouds of bioluminescent krill, effortless and majestic in the pitch-black abyss.</p>

        <div class="field-gear-box">
          <h4>📷 Field Camera Settings & Optics</h4>
          <div class="gear-grid">
            <div><span>Housing:</span><strong>Nauticam Underwater Aluminum Rig</strong></div>
            <div><span>Optics:</span><strong>16-35mm Ultra-Wide Dome Port</strong></div>
            <div><span>Lighting:</span><strong>Dual 15,000 Lumen Video Strobes</strong></div>
            <div><span>Depth:</span><strong>32.4 Meters Max Recorded</strong></div>
          </div>
        </div>

        <p>Raja Ampat contains more than 75% of all known coral species and 1,500 species of reef fish. Community-driven marine protected areas here have proven that when ocean habitats are strictly defended, marine life recovers with astonishing vitality.</p>
      `,
      isTrending: false
    },
    {
      id: 'art-5',
      title: 'Ghost of the Himalayas: 21 Days Tracking the Snow Leopard',
      category: 'mountains',
      categoryLabel: '🦅 Mountain Aviary & Extremes',
      categoryPill: '🦅 MOUNTAIN AVIARY',
      readTime: '9 Min Read',
      date: 'July 24, 2026',
      location: 'Hemis National Park, Ladakh (4,800m)',
      author: {
        name: 'Tashi Namgyal',
        role: 'Himalayan Wildlife Tracker',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80'
      },
      image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1200&q=80',
      excerpt: 'Surviving -25°C blizzards at 16,000 feet in search of the legendary "Shan". Ultra-telephoto field observations of a mother snow leopard teaching her cub on vertical granite scree.',
      fullContent: `
        <p>In the high altitude desert of Ladakh, the wind bites with the sharpness of glass. At 4,800 meters elevation, each breath delivers half the oxygen of sea level. For three weeks, our small expedition lived in canvas tents pitched against the frozen moraines of the Rumbak Valley, scouting sheer ridges with high-magnification spotting scopes from dawn to dusk.</p>

        <h3>The Master of Invisibility</h3>
        <p>The snow leopard (<em>Panthera uncia</em>) is arguably the most perfectly camouflaged predator on Earth. Its smoky-gray rosette coat blends so completely with broken gneiss and granite that an animal resting only fifty meters away can remain completely invisible until it blinks or turns its head.</p>

        <div class="pull-quote">
          "In Ladakh they say: you do not see the snow leopard; the snow leopard sees you, decides you are unimportant, and allows you to look."
        </div>

        <h3>The Stalk on 70-Degree Scree</h3>
        <p>On our eighteenth day, fresh scrapes on a high ridgeline led our scopes to a spectacular sighting: a female snow leopard and her sub-adult cub stalking a small flock of blue sheep (bharal). With massive paws acting like natural snowshoes and a long, thick tail counterbalancing her every jump, she bounded down a 70-degree rock wall at astonishing speed.</p>

        <div class="field-gear-box">
          <h4>📷 Field Camera Settings & Optics</h4>
          <div class="gear-grid">
            <div><span>Telephoto:</span><strong>800mm f/5.6 FL ED VR with 1.4x Teleconverter</strong></div>
            <div><span>Focal Length:</span><strong>1120mm Effective Reach</strong></div>
            <div><span>Temperature:</span><strong>-24°C / Heated Battery Pouches</strong></div>
            <div><span>Distance:</span><strong>420 Meters Line of Sight</strong></div>
          </div>
        </div>

        <p>The hunt was successful, securing food for her growing cub for the next five days. Through community homestay tourism initiatives, former sheep herders in Ladakh are now leading snow leopard conservation, demonstrating that living predators are vastly more valuable to local economies than retaliatory killings.</p>
      `,
      isTrending: true
    },
    {
      id: 'art-6',
      title: 'The Amazon Flooded Jungle: Anacondas & Pink River Dolphins',
      category: 'nature',
      categoryLabel: '🌿 Deep Nature & Forests',
      categoryPill: '🌿 NATURE & FORESTS',
      readTime: '6 Min Read',
      date: 'July 11, 2026',
      location: 'Pacaya-Samiria National Reserve, Loreto, Peru',
      author: {
        name: 'Carlos Mendoza',
        role: 'Amazonian River Specialist',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80'
      },
      image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80',
      excerpt: 'Navigating narrow dugout canoes deep into submerged blackwater igapó forests during peak flood season, documenting pink river dolphins weaving through tree trunks.',
      fullContent: `
        <p>During the Amazonian flood season, river levels rise by up to thirty feet, transforming hundreds of thousands of square miles of dense jungle into a surreal drowned world known as the <em>igapó</em>. We navigated narrow cedar dugout canoes through the tops of submerged fruiting trees, brushing past bromeliads and orchids suspended just inches above the mirror-black water.</p>

        <h3>Echolocation in the Flooded Forest</h3>
        <p>The Amazon pink river dolphin (<em>Inia geoffrensis</em>), or 'Boto', is uniquely adapted for this flooded labyrinth. Unlike oceanic dolphins, its cervical vertebrae are not fused, allowing it to turn its head 90 degrees in any direction to weave between submerged branches in pursuit of armored catfish.</p>

        <div class="pull-quote">
          "To hear the breath of a pink dolphin break the surface of black water deep inside a forest where monkeys play in the branches above is to glimpse primordial Earth."
        </div>

        <p>We also encountered a 17-foot green anaconda coiled around a submerged capirona tree root system, digesting a juvenile capybara in the warm, stagnant shallows. Protecting these immense flooded reserves is essential for regulating the hydrology and rainfall patterns of the entire South American continent.</p>
      `,
      isTrending: false
    },
    {
      id: 'art-7',
      title: 'Flight of the Golden Eagle: Soaring the Scottish Highlands',
      category: 'mountains',
      categoryLabel: '🦅 Mountain Aviary & Extremes',
      categoryPill: '🦅 MOUNTAIN AVIARY',
      readTime: '5 Min Read',
      date: 'June 30, 2026',
      location: 'Cairngorms National Park, Highlands, Scotland',
      author: {
        name: 'Callum MacLeod',
        role: 'Raptor Ecologist',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80'
      },
      image: 'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?auto=format&fit=crop&w=1200&q=80',
      excerpt: 'Tracking Scotland’s apex raptor with a seven-foot wingspan as it rides high mountain thermal updrafts and dives at 150 mph across heather-clad glens.',
      fullContent: `
        <p>From the granite plateau of Cairn Gorm, looking out over the ancient Caledonian pine remnants of Glen Feshie, the Scottish Highlands appear as an untamed expanse of wind, peat, and heather. High in the gray cirque, a silhouette with broad, fingered wingtips circled effortlessly on an invisible column of rising warm air.</p>

        <h3>Master of Aerodynamic Precision</h3>
        <p>The golden eagle (<em>Aquila chrysaetos</em>) is the undisputed king of northern skies. With a wingspan exceeding two meters and binocular eyesight eight times sharper than a human's, it can detect the twitch of a mountain hare's ear from nearly two miles away.</p>

        <div class="pull-quote">
          "When a golden eagle folds its wings into a hunting stoop, it drops like a guided missile, slicing through gale winds at speeds surpassing 150 miles per hour."
        </div>

        <p>We monitored an eyrie built onto a cliff ledge that had been actively used by successive eagle pairs for over fifty years. The female brought a red grouse to her single chick, teaching it to tear meat with its formidable hooked talon and beak. Continued habitat rewilding across Scotland is steadily restoring territories for these magnificent aerial sovereigns.</p>
      `,
      isTrending: false
    },
    {
      id: 'art-8',
      title: 'Gentle Leviathans: Swimming Beside Blue Whales in Baja',
      category: 'ocean',
      categoryLabel: '🌊 Ocean Depths & Reefs',
      categoryPill: '🌊 OCEAN DEPTHS',
      readTime: '7 Min Read',
      date: 'May 18, 2026',
      location: 'Loreto Bay National Marine Park, Sea of Cortez, Mexico',
      author: {
        name: 'Maya Lin',
        role: 'Marine Biologist & Cetacean Tracker',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80'
      },
      image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1200&q=80',
      excerpt: 'Encounter the largest animal to ever exist on our planet. Intimate underwater hydrophone recordings capture the reverberating songs of a migrating mother and calf.',
      fullContent: `
        <p>The waters of the Sea of Cortez lay as flat as polished glass under the desert sun. Then, without warning, a thirty-foot plume of vapor erupted half a mile off our research skiff's bow, accompanied by a sound like a locomotive discharging steam.</p>

        <h3>Living Grandeur Beyond Human Imagination</h3>
        <p>The blue whale (<em>Balaenoptera musculus</em>) defies human comprehension. Reaching lengths of nearly 100 feet and weighing upwards of 180 tonnes, its heart alone is the size of a golf cart, and its tongue weighs as much as an entire adult African elephant.</p>

        <div class="pull-quote">
          "Looking into the eye of a blue whale underwater is an experience that permanently resets your relationship with Earth. You are gazing upon life at its grandest scale in planetary history."
        </div>

        <p>Dropping hydrophones into the water, our headphones filled with the deep, haunting low-frequency pulses of the mother's vocalizations. Operating between 10 and 40 Hertz, these infra-sound calls can travel hundreds of miles across ocean basins, allowing whales to communicate across entire seas.</p>
      `,
      isTrending: true
    },
    {
      id: 'art-9',
      title: 'Arctic Wolf Pack: Surviving the High Tundra of Ellesmere Island',
      category: 'animals',
      categoryLabel: '🦁 Wild Animals & Predators',
      categoryPill: '🦁 WILD ANIMALS',
      readTime: '8 Min Read',
      date: 'April 14, 2026',
      location: 'Ellesmere Island, Nunavut, Canadian High Arctic',
      author: {
        name: 'Soren Lindqvist',
        role: 'Polar Wildlife Naturalist',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80'
      },
      image: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?auto=format&fit=crop&w=1200&q=80',
      excerpt: 'An intimate 3-week study of an isolated white arctic wolf pack that has never experienced human persecution, revealing complex social hierarchy and cooperation.',
      fullContent: `
        <p>At 80 degrees North latitude, there are no trees, no roads, and for six months of the year, no sunlight. On the glacial plains of Ellesmere Island, white arctic wolves (<em>Canis lupus arctos</em>) inhabit one of the most extreme environments on our planet.</p>

        <h3>Naïve Wolves: The Purity of the Untamed</h3>
        <p>Because humans have never hunted in this remote northern fjord, these wolves exhibited zero fear of our research party. On our fourth morning, three curious yearling wolves walked directly to within twenty feet of our tent, sniffing our snowshoes and camera cases with calm, playful curiosity before howling in harmony toward the icy mountains.</p>

        <div class="pull-quote">
          "In the high Arctic, you realize wolves are not ferocious beasts of folklore, but deeply loyal, cooperative families that survive where almost nothing else can."
        </div>

        <p>We documented the pack working together to test a defensive ring of adult muskoxen. Through tireless patience and coordinated flanking, the alpha female isolated an elderly bull, securing vital nourishment for the pregnant female's upcoming litter.</p>
      `,
      isTrending: true
    },
    {
      id: 'art-10',
      title: 'Emerald Symphony: Hidden Waterfalls of Costa Rica Cloud Forests',
      category: 'nature',
      categoryLabel: '🌿 Deep Nature & Forests',
      categoryPill: '🌿 NATURE & FORESTS',
      readTime: '5 Min Read',
      date: 'March 22, 2026',
      location: 'Monteverde Cloud Forest Reserve, Costa Rica',
      author: {
        name: 'Dr. Elena Vance',
        role: 'Forest Canopy Ecologist',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'
      },
      image: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1200&q=80',
      excerpt: 'A visual expedition through mist-shrouded waterfalls, translucent glass frogs, and endemic orchids thriving on continental divide trade winds.',
      fullContent: `
        <p>Perched high on the crest of Costa Rica's Tilarán mountain range, the Monteverde Cloud Forest is bathed in continuous trade-wind moisture blowing off the Caribbean Sea. Water falls not only as rain, but as dense, clinging mist that blankets thousands of epiphyte species growing directly on tree bark.</p>

        <p>Along the Rio Celeste, volcanic minerals color the waterfalls a startling turquoise-blue. Here, miniature glass frogs (Centrolenidae) with transparent bellies tend to egg clutches attached to the undersides of wet leaves directly overhanging rushing cascades, a brilliant adaptation to deter land predators.</p>
      `,
      isTrending: false
    },
    {
      id: 'art-11',
      title: 'Andean Condor: Master of the Patagonian Gales',
      category: 'mountains',
      categoryLabel: '🦅 Mountain Aviary & Extremes',
      categoryPill: '🦅 MOUNTAIN AVIARY',
      readTime: '6 Min Read',
      date: 'February 17, 2026',
      location: 'Torres del Paine National Park, Chilean Patagonia',
      author: {
        name: 'Carlos Mendoza',
        role: 'Andean Expedition Specialist',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80'
      },
      image: 'https://images.unsplash.com/photo-1527004013197-933c4bb611b3?auto=format&fit=crop&w=1200&q=80',
      excerpt: 'Battling 80mph winds beneath the towering granite horns of Patagonia to document the sacred flight of the Andean condor with its 10.5-foot wingspan.',
      fullContent: `
        <p>In Patagonia, wind is not weather; it is a permanent geological force. At the cliff roosts of the Cuernos del Paine, violent westerly gales shriek across glacial lakes. For an animal with a 3.3-meter wingspan, however, these winds are not obstacles—they are highways.</p>

        <p>The Andean condor (<em>Vultur gryphus</em>) can soar for hours over the steppe without flapping its wings even once, relying on thermal drafts and mountain ridge deflection to travel upwards of 150 miles a day searching for guanaco carcasses.</p>
      `,
      isTrending: false
    },
    {
      id: 'art-12',
      title: 'Predators of the Coral Labyrinth: 700 Grey Reef Sharks at Fakarava',
      category: 'ocean',
      categoryLabel: '🌊 Ocean Depths & Reefs',
      categoryPill: '🌊 OCEAN DEPTHS',
      readTime: '7 Min Read',
      date: 'January 29, 2026',
      location: 'Fakarava Atoll, Tuamotu Archipelago, French Polynesia',
      author: {
        name: 'Maya Lin',
        role: 'Marine Biologist & Underwater Explorer',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80'
      },
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
      excerpt: 'Under the winter full moon, over 700 grey reef sharks gather in a narrow underwater pass to hunt spawning groupers in an adrenaline-charged nocturnal spectacle.',
      fullContent: `
        <p>In the narrow South Pass of Fakarava Atoll, the ocean tide squeezes millions of gallons of water through a 200-meter channel twice a day. Beneath the surface, the largest concentration of sharks on Earth patrols the underwater canyons.</p>

        <p>During the grouper spawning aggregation, over 700 grey reef sharks assemble in the channel. Diving without cages into this nocturnal hunting frenzy debunked longstanding myths: sharks are discriminating, calculating predators that focus exclusively on vulnerable prey, navigating with electro-receptive Lorenzini ampullae in absolute harmony.</p>
      `,
      isTrending: true
    }
  ];

  /* ==========================================================================
     2. MASTERCLASS COURSES DATABASE
     ========================================================================== */
  const COURSES_DATABASE = [
    {
      id: 'course-1',
      title: 'Mastering Wildlife Telephoto Photography & Stalking',
      instructor: 'Liam Thorne • 18 Years BBC Natural History Unit',
      thumbnail: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=800&q=80',
      desc: 'Learn how to read animal behavior, anticipate predator rushes, manage atmospheric heat distortion at 600mm–1200mm, and apply ethical tracking techniques in remote sanctuaries.',
      duration: '8.5 Hours',
      modulesCount: '14 Field Modules',
      level: 'All Experience Levels',
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
      syllabus: [
        'Parabolic Dish Acoustics & Long-Range Avian Calls',
        'Hydrophone Deployment in Coral Reefs & Alpine Streams',
        'Spectrogram Analysis & Digital Audio Cleaning Techniques',
        'Microphone Blimp Wind Jamming in 50-knot Gale Storms'
      ]
    }
  ];

  /* ==========================================================================
     3. DOM ELEMENTS
     ========================================================================== */
  // View Containers & View Switchers
  const homeView = document.getElementById('homeView');
  const coursesView = document.getElementById('coursesView');
  const navHome = document.getElementById('navHome');
  const navCourses = document.getElementById('navCourses');
  const logoLink = document.getElementById('logoLink');
  const coursesBackBtn = document.getElementById('coursesBackBtn');
  const drawerHomeBtn = document.getElementById('drawerHomeBtn');
  const drawerCoursesBtn = document.getElementById('drawerCoursesBtn');
  const drawerArticlesBtn = document.getElementById('drawerArticlesBtn');
  const directWhatsAppGeneralBtn = document.getElementById('directWhatsAppGeneralBtn');

  // Categories & Sub-Bar
  const navCategory = document.getElementById('navCategory');
  const categorySubBar = document.getElementById('categorySubBar');
  const categoryDropdown = document.getElementById('categoryDropdown');
  const closeSubBarBtn = document.getElementById('closeSubBarBtn');
  const heroCategoriesBtn = document.getElementById('heroCategoriesBtn');

  // Grids & Counts
  const articlesGrid = document.getElementById('articlesGrid');
  const coursesGrid = document.getElementById('coursesGrid');
  const filterPills = document.querySelectorAll('.filter-pill');
  const visibleCount = document.getElementById('visibleCount');
  const totalCount = document.getElementById('totalCount');
  const emptyResultsState = document.getElementById('emptyResultsState');
  const resetFiltersBtn = document.getElementById('resetFiltersBtn');

  // Search
  const searchTriggerBtn = document.getElementById('searchTriggerBtn');
  const searchBarDropdown = document.getElementById('searchBarDropdown');
  const liveSearchInput = document.getElementById('liveSearchInput');
  const searchClearBtn = document.getElementById('searchClearBtn');
  const quickTagChips = document.querySelectorAll('.quick-tag-chip');

  // Article Reader Modal
  const articleModal = document.getElementById('articleModal');
  const closeArticleModalBtn = document.getElementById('closeArticleModalBtn');
  const articleReaderContent = document.getElementById('articleReaderContent');

  // Course Modal
  const courseModal = document.getElementById('courseModal');
  const closeCourseModalBtn = document.getElementById('closeCourseModalBtn');
  const courseModalInner = document.getElementById('courseModalInner');

  // Mobile Drawer
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerBackdrop = document.getElementById('drawerBackdrop');
  const closeDrawerBtn = document.getElementById('closeDrawerBtn');

  // Toast
  const toastNotification = document.getElementById('toastNotification');
  const toastMsg = document.getElementById('toastMsg');

  // Newsletter
  const newsletterForm = document.getElementById('newsletterForm');
  const newsletterSuccess = document.getElementById('newsletterSuccess');

  let currentCategoryFilter = 'all';
  let searchQuery = '';
  let likedArticles = JSON.parse(localStorage.getItem('terra_nova_article_likes') || '{}');

  /* ==========================================================================
     4. RENDER ARTICLES
     ========================================================================== */
  function renderArticles() {
    articlesGrid.innerHTML = '';

    const filtered = ARTICLES_DATABASE.filter(art => {
      // Category filter
      const matchesCategory = (currentCategoryFilter === 'all')
        ? true
        : (currentCategoryFilter === 'trending')
          ? art.isTrending
          : art.category === currentCategoryFilter;

      // Search filter
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || (
        art.title.toLowerCase().includes(q) ||
        art.location.toLowerCase().includes(q) ||
        art.excerpt.toLowerCase().includes(q) ||
        art.author.name.toLowerCase().includes(q) ||
        art.categoryLabel.toLowerCase().includes(q)
      );

      return matchesCategory && matchesSearch;
    });

    visibleCount.textContent = filtered.length;
    totalCount.textContent = ARTICLES_DATABASE.length;

    if (filtered.length === 0) {
      emptyResultsState.classList.remove('hidden');
    } else {
      emptyResultsState.classList.add('hidden');
    }

    filtered.forEach(art => {
      const card = document.createElement('div');
      card.className = 'article-card';
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');

      card.innerHTML = `
        <div class="card-img-wrapper">
          <img src="${art.image}" alt="${art.title}" class="card-img" loading="lazy">
          <span class="card-category-badge">${art.categoryPill}</span>
          <span class="card-read-time">⏱ ${art.readTime}</span>
        </div>

        <div class="card-content">
          <div class="card-location-row">
            <span>📍 ${art.location.split(',')[0]}</span>
            <span>${art.date.split(',')[1] || art.date}</span>
          </div>

          <h3 class="card-title">${art.title}</h3>
          <p class="card-excerpt">${art.excerpt}</p>

          <div class="card-footer">
            <div class="card-author-row">
              <img src="${art.author.avatar}" alt="${art.author.name}" class="card-author-avatar">
              <span class="card-author-name">${art.author.name}</span>
            </div>

            <span class="read-btn-pill">Read Story →</span>
          </div>
        </div>
      `;

      card.addEventListener('click', () => openArticleModal(art.id));
      articlesGrid.appendChild(card);
    });
  }

  /* ==========================================================================
     5. RENDER COURSES (Dedicated Wilderness Academy Section)
     ========================================================================== */
  function renderCourses() {
    if (!coursesGrid) return;
    coursesGrid.innerHTML = '';
    COURSES_DATABASE.forEach(course => {
      const card = document.createElement('div');
      card.className = 'course-card';
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');

      card.innerHTML = `
        <div class="course-img-box">
          <img src="${course.thumbnail}" alt="${course.title}" loading="lazy">
          <span class="course-badge-pill">${course.level}</span>
        </div>
        <div class="course-body">
          <span class="course-instructor">${course.instructor}</span>
          <h3 class="course-title">${course.title}</h3>
          <p class="course-desc">${course.desc}</p>
          <div class="course-meta-row">
            <span>⏱ <strong>${course.duration}</strong></span>
            <span>📚 <strong>${course.modulesCount}</strong></span>
            <span>💬 <strong>WhatsApp Direct</strong></span>
          </div>
          <button class="course-btn" type="button" data-course-id="${course.id}">
            <span>💬 View Details & Enroll via WhatsApp →</span>
          </button>
        </div>
      `;

      card.addEventListener('click', () => {
        openCourseModal(course);
      });

      coursesGrid.appendChild(card);
    });
  }

  /* ==========================================================================
     6. CATEGORY NAVIGATION & SUB-CATEGORY BAR (100% RELIABLE)
     ========================================================================== */
  function setCategoryFilter(cat, shouldScroll = true) {
    // If user is currently on Courses view, switch back to Home view first
    if (coursesView && !coursesView.classList.contains('hidden-view')) {
      showHomeView();
    }

    currentCategoryFilter = cat;

    // Filter pills
    filterPills.forEach(pill => {
      if (pill.getAttribute('data-filter') === cat) {
        pill.classList.add('active');
      } else {
        pill.classList.remove('active');
      }
    });

    // Sub-bar buttons
    document.querySelectorAll('.sub-bar-btn').forEach(btn => {
      if (btn.getAttribute('data-category') === cat) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Showcase cards
    document.querySelectorAll('.category-card').forEach(card => {
      if (card.getAttribute('data-category') === cat) {
        card.classList.add('active-cat-card');
      } else {
        card.classList.remove('active-cat-card');
      }
    });

    renderArticles();

    const catLabels = {
      'all': 'Showing all wildlife journals',
      'nature': '🌿 Deep Nature & Ancient Forests',
      'animals': '🦁 Wild Animals & Apex Predators',
      'ocean': '🌊 Ocean Depths & Marine Life',
      'mountains': '🦅 Mountain Aviary & Extremes',
      'trending': '🔥 Editor’s Choice Field Stories'
    };
    showToast(catLabels[cat] || `Category: ${cat}`);

    if (shouldScroll) {
      const artSection = document.getElementById('articleSection');
      if (artSection) {
        artSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }

  // Toggle Category Bar & Dropdown
  function toggleCategoryBar() {
    const isOpen = categorySubBar.classList.contains('open');
    if (isOpen) {
      categorySubBar.classList.remove('open');
      categoryDropdown.classList.remove('show');
      navCategory.classList.remove('open-active');
      navCategory.setAttribute('aria-expanded', 'false');
    } else {
      categorySubBar.classList.add('open');
      categoryDropdown.classList.add('show');
      navCategory.classList.add('open-active');
      navCategory.setAttribute('aria-expanded', 'true');
      showToast('👇 4 Categories Open Below');
    }
  }

  navCategory.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleCategoryBar();
  });

  if (closeSubBarBtn) {
    closeSubBarBtn.addEventListener('click', () => {
      categorySubBar.classList.remove('open');
      categoryDropdown.classList.remove('show');
      navCategory.classList.remove('open-active');
      navCategory.setAttribute('aria-expanded', 'false');
    });
  }

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (!categorySubBar.contains(e.target) && !navCategory.contains(e.target)) {
      categorySubBar.classList.remove('open');
      categoryDropdown.classList.remove('show');
      navCategory.classList.remove('open-active');
      navCategory.setAttribute('aria-expanded', 'false');
    }
  });

  // Category Sub-Bar buttons
  document.querySelectorAll('.sub-bar-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const cat = btn.getAttribute('data-category');
      setCategoryFilter(cat, true);
    });
  });

  // Dropdown Category buttons
  document.querySelectorAll('.dropdown-cat-card').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const cat = btn.getAttribute('data-category');
      setCategoryFilter(cat, true);
      categorySubBar.classList.remove('open');
      categoryDropdown.classList.remove('show');
      navCategory.classList.remove('open-active');
    });
  });

  // Category Showcase Cards
  document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', () => {
      const cat = card.getAttribute('data-category');
      setCategoryFilter(cat, true);
    });
  });

  // Footer Category Buttons
  document.querySelectorAll('.footer-cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.getAttribute('data-category');
      setCategoryFilter(cat, true);
    });
  });

  // Mobile Drawer Category Links
  document.querySelectorAll('.drawer-cat-link').forEach(link => {
    link.addEventListener('click', () => {
      const cat = link.getAttribute('data-category');
      setCategoryFilter(cat, true);
      closeMobileDrawer();
    });
  });

  // Hero Categories Button
  if (heroCategoriesBtn) {
    heroCategoriesBtn.addEventListener('click', () => {
      categorySubBar.classList.add('open');
      navCategory.classList.add('open-active');
      const catSection = document.getElementById('categoriesSection');
      if (catSection) {
        catSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // Filter Pills
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const cat = pill.getAttribute('data-filter');
      setCategoryFilter(cat, false);
    });
  });

  // Reset Filters
  if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener('click', () => {
      searchQuery = '';
      liveSearchInput.value = '';
      setCategoryFilter('all', false);
    });
  }

  /* ==========================================================================
     7. ARTICLE READER MODAL (RICH, FAST, ILLUSTRATED)
     ========================================================================== */
  function openArticleModal(articleId) {
    const art = ARTICLES_DATABASE.find(a => a.id === articleId) || ARTICLES_DATABASE[0];
    const isLiked = !!likedArticles[art.id];

    articleReaderContent.innerHTML = `
      <img src="${art.image}" alt="${art.title}" class="article-hero-cover">

      <div class="article-meta-header">
        <div class="article-tags-row">
          <span class="article-tag">${art.categoryPill}</span>
          <span class="article-read-time">⏱ ${art.readTime}</span>
        </div>

        <h1 class="article-headline">${art.title}</h1>

        <div class="article-author-card">
          <div class="author-left">
            <img src="${art.author.avatar}" alt="${art.author.name}">
            <div>
              <strong>${art.author.name}</strong>
              <span>${art.author.role}</span>
            </div>
          </div>
          <span class="article-location-pill">📍 ${art.location} • ${art.date}</span>
        </div>
      </div>

      <div class="article-body">
        ${art.fullContent}
      </div>

      <div class="article-actions-bar">
        <button class="action-btn ${isLiked ? 'liked' : ''}" id="modalLikeActionBtn" type="button">
          <span>${isLiked ? '❤️ Bookmarked' : '🤍 Add to Reading List'}</span>
        </button>

        <button class="action-btn" id="modalShareActionBtn" type="button">
          <span>🔗 Share Article</span>
        </button>
      </div>
    `;

    // Modal Like
    const likeBtn = document.getElementById('modalLikeActionBtn');
    if (likeBtn) {
      likeBtn.addEventListener('click', () => {
        if (likedArticles[art.id]) {
          delete likedArticles[art.id];
          likeBtn.classList.remove('liked');
          likeBtn.innerHTML = '<span>🤍 Add to Reading List</span>';
          showToast('Removed from reading list');
        } else {
          likedArticles[art.id] = true;
          likeBtn.classList.add('liked');
          likeBtn.innerHTML = '<span>❤️ Bookmarked in Reading List</span>';
          showToast('Saved to your reading list!');
        }
        localStorage.setItem('terra_nova_article_likes', JSON.stringify(likedArticles));
      });
    }

    // Modal Share
    const shareBtn = document.getElementById('modalShareActionBtn');
    if (shareBtn) {
      shareBtn.addEventListener('click', () => {
        if (navigator.clipboard) {
          navigator.clipboard.writeText(window.location.href);
          showToast('🔗 Article link copied to clipboard!');
        }
      });
    }

    articleModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeArticleModal() {
    articleModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  closeArticleModalBtn.addEventListener('click', closeArticleModal);
  articleModal.addEventListener('click', (e) => {
    if (e.target === articleModal) closeArticleModal();
  });

  // Hero Featured Story Click
  const heroFeaturedBtn = document.getElementById('heroFeaturedBtn');
  if (heroFeaturedBtn) {
    heroFeaturedBtn.addEventListener('click', () => openArticleModal('art-1'));
  }

  const featuredHeroCard = document.getElementById('featuredHeroCard');
  if (featuredHeroCard) {
    featuredHeroCard.addEventListener('click', () => openArticleModal('art-1'));
  }

  /* ==========================================================================
     8. COURSE DETAILS & DIRECT WHATSAPP ENROLLMENT MODAL
     ========================================================================== */
  const WHATSAPP_PHONE_NUMBER = '919876543210'; // Placeholder WhatsApp number as requested

  function openCourseModal(course) {
    if (!courseModalInner) return;

    const syllabusItemsHtml = (course.syllabus || []).map((item, idx) => `
      <div class="syllabus-item">
        <span class="syllabus-num">0${idx + 1}</span>
        <span>${item}</span>
      </div>
    `).join('');

    courseModalInner.innerHTML = `
      <img src="${course.thumbnail}" alt="${course.title}" class="course-modal-cover">

      <span class="course-modal-tag">MASTERCLASS • ${course.level.toUpperCase()}</span>
      <h2 class="course-modal-title">${course.title}</h2>
      <p class="course-modal-instructor">${course.instructor}</p>

      <div class="course-details-box">
        <p>${course.desc}</p>
        
        <h4 style="color: #fff; font-size: 0.95rem; margin: 1.2rem 0 0.6rem; font-weight: 700;">Field Curriculum & Masterclass Syllabus:</h4>
        <div class="course-syllabus-list">
          ${syllabusItemsHtml}
        </div>

        <div class="course-meta-row" style="border-bottom: none; padding-bottom: 0; margin-top: 1rem;">
          <span>⏱ Total Duration: <strong>${course.duration}</strong></span>
          <span>📚 Curriculum: <strong>${course.modulesCount}</strong></span>
          <span>🎓 Certification: <strong>Included</strong></span>
        </div>
      </div>

      <!-- WhatsApp Enrollment & Direct Lead Capture Form -->
      <div class="whatsapp-enroll-card">
        <div class="wa-card-header">
          <span class="wa-badge-icon">💬</span>
          <div>
            <h3>Enroll & Connect via WhatsApp</h3>
            <p class="wa-card-desc">Enter your details below to directly connect with our Wildlife Academy Advisor on WhatsApp.</p>
          </div>
        </div>

        <form id="waEnrollForm" class="wa-form" novalidate>
          <div class="wa-form-group">
            <div class="wa-input-row">
              <label for="waInputName">Full Name *</label>
              <input type="text" id="waInputName" placeholder="e.g., Alex Walker" required autocomplete="name">
              <span class="wa-error-msg hidden" id="waNameError">Please enter your full name.</span>
            </div>

            <div class="wa-input-row">
              <label for="waInputPhone">WhatsApp Mobile Number *</label>
              <input type="tel" id="waInputPhone" placeholder="e.g., +91 98765 43210" required autocomplete="tel">
              <span class="wa-error-msg hidden" id="waPhoneError">Please enter your WhatsApp mobile number.</span>
            </div>

            <div class="wa-input-row">
              <label for="waInputEmail">Email Address *</label>
              <input type="email" id="waInputEmail" placeholder="e.g., alex@example.com" required autocomplete="email">
              <span class="wa-error-msg hidden" id="waEmailError">Please enter a valid email address.</span>
            </div>

            <div class="wa-input-row">
              <label for="waInputNote">Specific Question or Note (Optional)</label>
              <input type="text" id="waInputNote" placeholder="e.g., Upcoming batch schedule, field expedition gear...">
            </div>
          </div>

          <button type="submit" class="btn-submit-whatsapp" id="btnSubmitWhatsApp">
            <span>💬 Continue to WhatsApp Chat →</span>
          </button>
          <p style="font-size: 0.74rem; color: #94a3b8; text-align: center; margin-top: 0.8rem;">
            🔒 Pre-formats your inquiry and opens official WhatsApp (+91 98765 43210).
          </p>
        </form>
      </div>
    `;

    // Wire WhatsApp Form Submission
    const waForm = document.getElementById('waEnrollForm');
    const nameInput = document.getElementById('waInputName');
    const phoneInput = document.getElementById('waInputPhone');
    const emailInput = document.getElementById('waInputEmail');
    const noteInput = document.getElementById('waInputNote');
    const nameErr = document.getElementById('waNameError');
    const phoneErr = document.getElementById('waPhoneError');
    const emailErr = document.getElementById('waEmailError');

    waForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let hasError = false;
      const nameVal = nameInput.value.trim();
      const phoneVal = phoneInput.value.trim();
      const emailVal = emailInput.value.trim();
      const noteVal = noteInput.value.trim();

      // Validate Name
      if (!nameVal || nameVal.length < 2) {
        nameInput.classList.add('input-error');
        nameErr.classList.remove('hidden');
        hasError = true;
      } else {
        nameInput.classList.remove('input-error');
        nameErr.classList.add('hidden');
      }

      // Validate Phone
      if (!phoneVal || phoneVal.replace(/\D/g, '').length < 7) {
        phoneInput.classList.add('input-error');
        phoneErr.classList.remove('hidden');
        hasError = true;
      } else {
        phoneInput.classList.remove('input-error');
        phoneErr.classList.add('hidden');
      }

      // Validate Email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailVal || !emailRegex.test(emailVal)) {
        emailInput.classList.add('input-error');
        emailErr.classList.remove('hidden');
        hasError = true;
      } else {
        emailInput.classList.remove('input-error');
        emailErr.classList.add('hidden');
      }

      if (hasError) {
        showToast('⚠️ Please complete all required fields correctly.');
        return;
      }

      // Format WhatsApp Message
      const messageLines = [
        `🌿 *TERRA NOVA WILDLIFE ACADEMY ENROLLMENT*`,
        ``,
        `📚 *Course:* ${course.title}`,
        `🎓 *Instructor:* ${course.instructor}`,
        `⏱ *Duration:* ${course.duration} (${course.modulesCount})`,
        ``,
        `👤 *Name:* ${nameVal}`,
        `📱 *Phone:* ${phoneVal}`,
        `📧 *Email:* ${emailVal}`,
        noteVal ? `💬 *Note:* ${noteVal}` : `💬 *Note:* Requesting syllabus packet & batch enrollment details.`,
        ``,
        `_Sent via Terra Nova Portal_`
      ];

      const fullMessage = messageLines.join('\n');
      const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${encodeURIComponent(fullMessage)}`;

      showToast('💬 Redirecting to WhatsApp Advisor...');
      window.open(whatsappUrl, '_blank');

      setTimeout(() => {
        closeCourseModal();
      }, 1000);
    });

    courseModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeCourseModal() {
    courseModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  closeCourseModalBtn.addEventListener('click', closeCourseModal);
  courseModal.addEventListener('click', (e) => {
    if (e.target === courseModal) closeCourseModal();
  });

  /* ==========================================================================
     9. VIEW NAVIGATION CONTROLLER (Home vs Dedicated Courses View)
     ========================================================================== */
  function showHomeView(targetSection = null) {
    if (coursesView) coursesView.classList.add('hidden-view');
    if (homeView) homeView.classList.remove('hidden-view');
    if (navHome) navHome.classList.add('active');
    if (navCourses) navCourses.classList.remove('active');

    if (targetSection) {
      targetSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function showCoursesView() {
    if (homeView) homeView.classList.add('hidden-view');
    if (coursesView) coursesView.classList.remove('hidden-view');
    if (navCourses) navCourses.classList.add('active');
    if (navHome) navHome.classList.remove('active');

    // Close any open drawers or popups
    if (categorySubBar) categorySubBar.classList.remove('open');
    if (categoryDropdown) categoryDropdown.classList.remove('show');
    if (navCategory) {
      navCategory.classList.remove('open-active');
      navCategory.setAttribute('aria-expanded', 'false');
    }
    closeMobileDrawer();

    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast('🎓 Terra Nova Wildlife Academy Masterclasses');
  }

  // Navigation Click Listeners
  if (navHome) navHome.addEventListener('click', () => showHomeView());
  if (logoLink) {
    logoLink.addEventListener('click', (e) => {
      e.preventDefault();
      showHomeView();
    });
  }
  if (navCourses) navCourses.addEventListener('click', showCoursesView);
  if (coursesBackBtn) coursesBackBtn.addEventListener('click', () => showHomeView());

  // Mobile Drawer Navigation
  if (drawerHomeBtn) {
    drawerHomeBtn.addEventListener('click', () => {
      closeMobileDrawer();
      showHomeView();
    });
  }
  if (drawerCoursesBtn) {
    drawerCoursesBtn.addEventListener('click', () => {
      closeMobileDrawer();
      showCoursesView();
    });
  }
  if (drawerArticlesBtn) {
    drawerArticlesBtn.addEventListener('click', () => {
      closeMobileDrawer();
      const artSection = document.getElementById('articleSection');
      showHomeView(artSection);
    });
  }

  // General WhatsApp Consultation Button
  if (directWhatsAppGeneralBtn) {
    directWhatsAppGeneralBtn.addEventListener('click', () => {
      const msg = `Hello Terra Nova Academy! 🌿\nI would like to consult with an academic advisor regarding your wildlife masterclasses and field photography training.`;
      const url = `https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${encodeURIComponent(msg)}`;
      window.open(url, '_blank');
      showToast('💬 Opening WhatsApp Consultation...');
    });
  }

  // Footer Masterclass Links
  document.querySelectorAll('.footer-course-link').forEach(btn => {
    btn.addEventListener('click', () => {
      showCoursesView();
      const courseId = btn.getAttribute('data-course-id');
      const course = COURSES_DATABASE.find(c => c.id === courseId);
      if (course) {
        setTimeout(() => openCourseModal(course), 350);
      }
    });
  });

  /* ==========================================================================
     10. SEARCH ENGINE
     ========================================================================== */
  searchTriggerBtn.addEventListener('click', () => {
    searchBarDropdown.classList.toggle('active');
    if (searchBarDropdown.classList.contains('active')) {
      liveSearchInput.focus();
    }
  });

  liveSearchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderArticles();
  });

  searchClearBtn.addEventListener('click', () => {
    liveSearchInput.value = '';
    searchQuery = '';
    renderArticles();
    liveSearchInput.focus();
  });

  quickTagChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const tag = chip.getAttribute('data-search');
      liveSearchInput.value = tag;
      searchQuery = tag;
      renderArticles();
      const artSection = document.getElementById('articleSection');
      if (artSection) artSection.scrollIntoView({ behavior: 'smooth' });
    });
  });

  /* ==========================================================================
     11. MOBILE DRAWER NAVIGATION
     ========================================================================== */
  function openMobileDrawer() {
    mobileDrawer.classList.add('open');
    drawerBackdrop.classList.add('open');
  }

  function closeMobileDrawer() {
    mobileDrawer.classList.remove('open');
    drawerBackdrop.classList.remove('open');
  }

  mobileMenuBtn.addEventListener('click', openMobileDrawer);
  closeDrawerBtn.addEventListener('click', closeMobileDrawer);
  drawerBackdrop.addEventListener('click', closeMobileDrawer);

  document.querySelectorAll('[data-close-drawer]').forEach(el => {
    el.addEventListener('click', closeMobileDrawer);
  });

  /* ==========================================================================
     12. TOAST HELPER
     ========================================================================== */
  let toastTimer = null;
  function showToast(message) {
    if (!toastNotification) return;
    toastMsg.textContent = message;
    toastNotification.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastNotification.classList.remove('show');
    }, 2800);
  }

  /* ==========================================================================
     13. NEWSLETTER
     ========================================================================== */
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('newsletterEmail');
      if (email && email.value) {
        newsletterSuccess.classList.remove('hidden');
        email.value = '';
        showToast('🌿 Subscribed to Expedition Field Reports!');
      }
    });
  }

  // Keyboard Escape listener for modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeArticleModal();
      closeCourseModal();
      closeMobileDrawer();
      categorySubBar.classList.remove('open');
      categoryDropdown.classList.remove('show');
      navCategory.classList.remove('open-active');
    }
  });

  /* ==========================================================================
     INITIALIZATION
     ========================================================================== */
  renderArticles();
  renderCourses();
});
