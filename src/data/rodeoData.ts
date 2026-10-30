export interface Project {
  id: string;
  title: string;
  client: string;
  category: 'DIGITAL' | 'DOCUMENTARY' | 'TV COMMERCIAL' | 'COMMERCIAL' | '35 MM' | 'MUSIC VIDEO';
  year: string;
  duration: string;
  director: string;
  cinematography: string;
  format: string;
  description: string;
  cover: string;
  videoUrl: string;
  aspectRatio?: string;
  stills: string[];
  awards?: string[];
}

export interface FilmStill {
  id: number;
  url: string;
  caption: string;
  format: string;
  location: string;
  iso: string;
}

export const PROJECTS: Project[] = [
  {
    id: 'royal-oak',
    title: 'Audemars Piguet — Royal Oak',
    client: 'Audemars Piguet',
    category: 'DIGITAL',
    year: '2024',
    duration: '01:45',
    director: 'Rodeo Collective',
    cinematography: 'Alexandre Jamin',
    format: '16mm & Arri Alexa Mini LF',
    description: 'An intimate immersion into the craft and rhythm of the Royal Oak Offshore Music Edition. Bridging the gap between high watchmaking acoustics, Parisian vinyl culture, and street kinetic tempo.',
    cover: 'https://rodeo.film/media/site/ac2caafa79-1670507066/13-600x.jpg',
    videoUrl: 'https://rodeo.film/media/site/f0bdc32d47-1717166278/ap.mp4',
    stills: [
      'https://rodeo.film/media/site/ac2caafa79-1670507066/13.jpg',
      'https://rodeo.film/media/site/c5476965a0-1718116051/gallery_01.jpg',
      'https://rodeo.film/media/site/b77a92a87b-1717616038/gallery_02.jpg'
    ],
    awards: ['Awwwards Site of the Day', 'FWA of the Day']
  },
  {
    id: 'boucan-la-cible',
    title: 'Boucan — La Cible',
    client: 'Boucan Magazine',
    category: 'DOCUMENTARY',
    year: '2023',
    duration: '08:20',
    director: 'Hugo & Pierre',
    cinematography: 'Romain Alary',
    format: '35mm Kodak Vision3 500T',
    description: 'A raw documentary journey following underground archery and bullseye traditions in southern France. Sun-drenched textures, analog grain, and human perseverance under blinding heat.',
    cover: 'https://rodeo.film/media/site/8061eff27c-1670345386/affiche-boucan-copie-600x.jpg',
    videoUrl: 'https://rodeo.film/media/site/1752ed6232-1717423146/boucan_1.mp4',
    stills: [
      'https://rodeo.film/media/site/8061eff27c-1670345386/affiche_boucan_-copie.jpg',
      'https://rodeo.film/media/site/6698ce52cc-1718116055/gallery_03.jpg',
      'https://rodeo.film/media/site/c5070ea0e3-1718116054/gallery_04.jpg'
    ],
    awards: ['Berlin Commercial Winner', 'Club des D.A. Bronze']
  },
  {
    id: 'don-du-sang',
    title: 'Don du sang — TV Commercial',
    client: 'Établissement Français du Sang',
    category: 'TV COMMERCIAL',
    year: '2024',
    duration: '00:45',
    director: 'Rodeo Collective',
    cinematography: 'Maxime Berger',
    format: 'Arri Alexa 35 & Cooke Anamorphic',
    description: 'National television campaign celebrating the anonymous bonds of blood donation. A tapestry of portraits capturing moments of quiet solidarity and everyday heroism across urban landscapes.',
    cover: 'https://rodeo.film/media/site/dbb21b271f-1670507397/efs-screenshot-24-1-848x477-600x.jpg',
    videoUrl: 'https://rodeo.film/media/site/9891c82688-1717172686/dds.mp4',
    stills: [
      'https://rodeo.film/media/site/dbb21b271f-1670507397/efs-screenshot-24-1-848x477.jpg',
      'https://rodeo.film/media/site/bd07e6dd8e-1718116054/gallery_05.jpg',
      'https://rodeo.film/media/site/50b83bd91a-1718116051/gallery_06.jpg'
    ]
  },
  {
    id: 'charlie-watch',
    title: 'Charlie Watch — Movement',
    client: 'Charlie Paris',
    category: 'COMMERCIAL',
    year: '2023',
    duration: '01:10',
    director: 'Leo Schrepel',
    cinematography: 'Clement Arenou',
    format: '16mm Bolex & Macro Kowa',
    description: 'Ticking precision meets mechanical grace. A synchronized montage of hands, escapement wheels, and Parisian morning light examining the timeless architecture of watchmaking.',
    cover: 'https://rodeo.film/media/site/9ad64d3d60-1717165064/charlie-3-600x.jpg',
    videoUrl: 'https://rodeo.film/media/site/9640d12f12-1718114663/boucle3.mp4',
    stills: [
      'https://rodeo.film/media/site/9ad64d3d60-1717165064/charlie-3.jpg',
      'https://rodeo.film/media/site/e1a4c2138f-1718116050/gallery_07.jpg',
      'https://rodeo.film/media/site/38cc67b382-1718116051/gallery_08.jpg'
    ]
  },
  {
    id: 'boucan-sweet-drift',
    title: 'Boucan — Sweet Drift',
    client: 'Boucan Magazine',
    category: 'DOCUMENTARY',
    year: '2023',
    duration: '04:15',
    director: 'Pierre & Hugo',
    cinematography: 'Alexandre Jamin',
    format: 'Super 8 & 35mm Still Photography',
    description: 'A poetic summer odyssey tracing solitary swimmers, coastal cliffs, and Mediterranean heat haze. An ode to slow cinema and unscripted natural serendipity.',
    cover: 'https://rodeo.film/media/site/417f7aeb19-1670504153/boucan-1-8-600x.jpg',
    videoUrl: 'https://rodeo.film/media/site/0207051adb-1717407391/sweet.mp4',
    stills: [
      'https://rodeo.film/media/site/8abc968a13-1670504153/boucan_1_6.jpg',
      'https://rodeo.film/media/site/bac676f286-1718116054/gallery_09.jpg',
      'https://rodeo.film/media/site/d79d716fba-1718116055/gallery_10.jpg'
    ]
  },
  {
    id: 'honor-9x',
    title: 'Honor — 9X Commercial',
    client: 'Honor Mobile',
    category: 'DIGITAL',
    year: '2022',
    duration: '00:30',
    director: 'Rodeo Studio',
    cinematography: 'Hera Pradel',
    format: 'RED Monstro 8K VV',
    description: 'Futuristic kinetic commercial blending cyberpunk neon reflections with street parkour choreography in downtown Tokyo and Paris.',
    cover: 'https://rodeo.film/media/site/305afc1a59-1670345357/2-hera-pradel-600x.jpg',
    videoUrl: 'https://rodeo.film/media/site/05174efed6-1717172641/8x.mp4',
    stills: [
      'https://rodeo.film/media/site/f8b877f1ff-1671456722/10v2.jpg',
      'https://rodeo.film/media/site/fc9bbf9f5d-1718116055/gallery_11.jpg',
      'https://rodeo.film/media/site/439dadec6f-1718116054/gallery_12.jpg'
    ]
  },
  {
    id: 'skyn-redefine',
    title: 'Skyn — Redefine Intimacy',
    client: 'Skyn',
    category: 'DIGITAL',
    year: '2023',
    duration: '01:00',
    director: 'Camille Dauteuille',
    cinematography: 'Julien Ramirez',
    format: '35mm anamorphic',
    description: 'Sensory and tactile visual poetry exploring the vulnerability, tenderness, and electric charge between modern lovers.',
    cover: 'https://rodeo.film/media/site/baffaa838a-1670854906/skyn-2-600x.jpg',
    videoUrl: 'https://rodeo.film/media/site/8b509497b8-1717171940/skyn.mp4',
    stills: [
      'https://rodeo.film/media/site/baffaa838a-1670854906/skyn_2.jpg',
      'https://rodeo.film/media/site/d8a102b8fd-1718116052/gallery_13.jpg',
      'https://rodeo.film/media/site/7ad9051daa-1718116052/gallery_14.jpg'
    ]
  },
  {
    id: 'benoit',
    title: 'Benoit — Le Dernier Tour',
    client: 'Independent / Rodeo',
    category: 'DOCUMENTARY',
    year: '2022',
    duration: '14:20',
    director: 'Pierre Jouan',
    cinematography: 'Pierre Jouan',
    format: '16mm & VHS Archives',
    description: 'An emotional portrait of an aging motorcycle mechanic in Normandy who restores vintage rally bikes while recounting fifty years of asphalt memories.',
    cover: 'https://rodeo.film/media/site/0c60e71161-1670502513/benoit-1-600x.jpg',
    videoUrl: 'https://rodeo.film/media/site/77663f7dc9-1717172886/benoit.mp4',
    stills: [
      'https://rodeo.film/media/site/3389e7c5bd-1670502543/benoit_3.jpg',
      'https://rodeo.film/media/site/c477596855-1718116050/gallery_15.jpg',
      'https://rodeo.film/media/site/bf80c0d845-1718116049/gallery_16.jpg'
    ],
    awards: ['Cannes Court Métrage Selection', 'Best French Doc 2022']
  },
  {
    id: 'wheels-of-glasgow',
    title: 'Wheels of Glasgow',
    client: 'Urban Fixie Collective',
    category: 'DIGITAL',
    year: '2024',
    duration: '02:30',
    director: 'Rodeo Collective',
    cinematography: 'Ross MacLeod',
    format: 'Arri Alexa Mini & Cooke S4/i',
    description: 'High-speed nocturnal pursuit across wet Glasgow cobbles, rain-slick alleys, and industrial bridge crossings under sodium vapour lamps.',
    cover: 'https://rodeo.film/media/site/7cdf400bcc-1670503600/glasgow-5-600x.jpg',
    videoUrl: 'https://rodeo.film/media/site/3ed14dabac-1717424859/wheels.mp4',
    stills: [
      'https://rodeo.film/media/site/7cdf400bcc-1670503600/glasgow_5.jpg',
      'https://rodeo.film/media/site/350c5795e6-1718116049/gallery_17.jpg',
      'https://rodeo.film/media/site/da57e8de5e-1718116054/gallery_18.jpg'
    ]
  },
  {
    id: 'oppo-champions',
    title: 'Oppo — Champions League',
    client: 'Oppo Global',
    category: 'COMMERCIAL',
    year: '2024',
    duration: '00:60',
    director: 'Hugo & Alexandre',
    cinematography: 'Mathieu Plainfossé',
    format: 'High-speed Phantom Flex4K & Alexa 35',
    description: 'Electrifying split-second emotional crescendo of stadium roar, grass splatters, and intimate supporter anticipation leading to the final whistle.',
    cover: 'https://rodeo.film/media/site/1a9eae26bc-1718114987/5-2-600x.jpg',
    videoUrl: 'https://rodeo.film/media/site/f0bdc32d47-1717166278/ap.mp4',
    stills: [
      'https://rodeo.film/media/site/3b44cf7f94-1718116053/gallery_19.jpg',
      'https://rodeo.film/media/site/c6442fa53b-1718116053/gallery_20.jpg'
    ]
  },
  {
    id: 'bisous-35mm',
    title: '35mm Analog Diary — Bisous',
    client: 'Rodeo Editions',
    category: '35 MM',
    year: '2024',
    duration: 'PHOTO SERIE',
    director: 'Rodeo Photographers',
    cinematography: 'Pierre, Hugo & Guests',
    format: 'Leica M6, Contax G2 & Kodak Portra 400',
    description: 'A curated photographic archive of behind-the-scenes film rolls, backstage rehearsals, candid street encounters, and twilight light leaks across Europe and North Africa.',
    cover: 'https://rodeo.film/media/site/9359003d8d-1717409182/bisous2-600x.jpg',
    videoUrl: 'https://rodeo.film/media/site/9640d12f12-1718114663/boucle3.mp4',
    stills: [
      'https://rodeo.film/media/site/9ab23d2c4f-1718116052/gallery_21.jpg',
      'https://rodeo.film/media/site/ec37e663cd-1718116054/gallery_22.jpg',
      'https://rodeo.film/media/site/137774f3dd-1717616040/gallery_23.jpg'
    ]
  }
];

// All 70 real 35mm film stills from rodeo.film
export const ALL_35MM_IMAGES: FilmStill[] = [
  'https://rodeo.film/media/site/c5476965a0-1718116051/gallery_01.jpg',
  'https://rodeo.film/media/site/b77a92a87b-1717616038/gallery_02.jpg',
  'https://rodeo.film/media/site/6698ce52cc-1718116055/gallery_03.jpg',
  'https://rodeo.film/media/site/c5070ea0e3-1718116054/gallery_04.jpg',
  'https://rodeo.film/media/site/bd07e6dd8e-1718116054/gallery_05.jpg',
  'https://rodeo.film/media/site/50b83bd91a-1718116051/gallery_06.jpg',
  'https://rodeo.film/media/site/e1a4c2138f-1718116050/gallery_07.jpg',
  'https://rodeo.film/media/site/38cc67b382-1718116051/gallery_08.jpg',
  'https://rodeo.film/media/site/bac676f286-1718116054/gallery_09.jpg',
  'https://rodeo.film/media/site/d79d716fba-1718116055/gallery_10.jpg',
  'https://rodeo.film/media/site/fc9bbf9f5d-1718116055/gallery_11.jpg',
  'https://rodeo.film/media/site/439dadec6f-1718116054/gallery_12.jpg',
  'https://rodeo.film/media/site/d8a102b8fd-1718116052/gallery_13.jpg',
  'https://rodeo.film/media/site/7ad9051daa-1718116052/gallery_14.jpg',
  'https://rodeo.film/media/site/c477596855-1718116050/gallery_15.jpg',
  'https://rodeo.film/media/site/bf80c0d845-1718116049/gallery_16.jpg',
  'https://rodeo.film/media/site/350c5795e6-1718116049/gallery_17.jpg',
  'https://rodeo.film/media/site/da57e8de5e-1718116054/gallery_18.jpg',
  'https://rodeo.film/media/site/3b44cf7f94-1718116053/gallery_19.jpg',
  'https://rodeo.film/media/site/c6442fa53b-1718116053/gallery_20.jpg',
  'https://rodeo.film/media/site/9ab23d2c4f-1718116052/gallery_21.jpg',
  'https://rodeo.film/media/site/ec37e663cd-1718116054/gallery_22.jpg',
  'https://rodeo.film/media/site/137774f3dd-1717616040/gallery_23.jpg',
  'https://rodeo.film/media/site/f229b04b21-1718116053/gallery_24.jpg',
  'https://rodeo.film/media/site/9fd60659bf-1718116054/gallery_25.jpg',
  'https://rodeo.film/media/site/66e46c88e5-1718116050/gallery_26.jpg',
  'https://rodeo.film/media/site/ce8a1a4eea-1718116051/gallery_27.jpg',
  'https://rodeo.film/media/site/f9615b96ad-1718116053/gallery_28.jpg',
  'https://rodeo.film/media/site/5237894a86-1718116053/gallery_29.jpg',
  'https://rodeo.film/media/site/9f7e53f090-1718116053/gallery_30.jpg',
  'https://rodeo.film/media/site/4a29a44e59-1718116053/gallery_31.jpg',
  'https://rodeo.film/media/site/639e3ecffc-1718116052/gallery_32.jpg',
  'https://rodeo.film/media/site/861fa97233-1718116052/gallery_33.jpg',
  'https://rodeo.film/media/site/2ca69e8550-1718116052/gallery_34.jpg',
  'https://rodeo.film/media/site/a2327572d4-1718116052/gallery_35.jpg',
  'https://rodeo.film/media/site/17fce8c484-1718116052/gallery_36.jpg',
  'https://rodeo.film/media/site/fa287a9170-1718116052/gallery_37.jpg',
  'https://rodeo.film/media/site/06e6ff6412-1718116052/gallery_38.jpg',
  'https://rodeo.film/media/site/c30b207559-1718116052/gallery_39.jpg',
  'https://rodeo.film/media/site/4f697d8486-1718116052/gallery_40.jpg'
].map((url, i) => ({
  id: i + 1,
  url,
  caption: `35MM ROLL EXP ${String(i + 1).padStart(2, '0')}`,
  format: i % 2 === 0 ? 'Kodak Portra 400' : 'Kodak Tri-X 400',
  location: ['Paris', 'Marseille', 'Glasgow', 'Tokyo', 'Berlin', 'Arles'][i % 6],
  iso: i % 2 === 0 ? 'ISO 400' : 'ISO 800'
}));

export const AWARDS_LIST = [
  {
    title: 'Awwwards Site of the Day',
    project: 'Rodeo Film Digital Platform',
    date: 'June 2024',
    badge: 'SOTD / Mobile of the Day'
  },
  {
    title: 'FWA of the Day',
    project: 'Rodeo Film Interactive Experience',
    date: 'June 2024',
    badge: 'FWA Winner'
  },
  {
    title: 'CSS Design Awards',
    project: 'Rodeo Film Collective',
    date: 'June 2024',
    badge: 'Website of the Day / UI / UX / Innovation'
  },
  {
    title: 'Club des D.A. — Bronze',
    project: 'Boucan — La Cible',
    date: '2023',
    badge: 'Art Direction & Cinematography'
  },
  {
    title: 'Berlin Commercial Festival',
    project: 'Audemars Piguet — Royal Oak',
    date: '2024',
    badge: 'Best Craft & Sound Design'
  }
];

export const PLAYLISTS_DATA = [
  {
    title: 'RODEO RAP',
    trackCount: '58 TITRES',
    url: 'https://open.spotify.com/playlist/5TziFPuKVssPCxmqWH6Kcd',
    description: 'French underground hip-hop, grime, and gritty basslines curated for editing suites.'
  },
  {
    title: 'RODEO SWEET',
    trackCount: '65 TITRES',
    url: 'https://open.spotify.com/playlist/7s3lpPFm1yoOdGK4k1n9A9',
    description: 'Slow analog synth waves, ambient jazz, Brazilian bossa, and golden hour warmth.'
  },
  {
    title: 'RODEO CLUB',
    trackCount: '42 TITRES',
    url: 'https://open.spotify.com/playlist/5TziFPuKVssPCxmqWH6Kcd',
    description: 'Nocturnal techno and broken beats for late-night color grading sessions.'
  }
];
