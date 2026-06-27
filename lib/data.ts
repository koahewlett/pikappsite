export const adobeFontsKitUrl = 'https://use.typekit.net/ctq1uoo.css';

export const nav = [
  'Why Pi Kapp',
  'Rush Events',
  'Brotherhood',
  'Gallery',
  'FAQ'
];

export const stats = [
  ['#1', 'Largest Fraternity in Arizona'],
  ['150+', 'Active Members'],
  ['1904', 'Nationally Founded'],
  ['20+', 'Majors Represented']
];

export const heroDisplay = [
  { text: 'RUSH', tone: 'white' },
  { text: 'PIKAPP', tone: 'gold', italic: true, shadow: true }
] as const;

export const whyDisplay = [
  { text: 'BUILT FOR', tone: 'white' },
  { text: 'GUYS WHO', tone: 'white' },
  { text: 'WANT MORE', tone: 'blue', italic: true, shadow: true },
  { text: 'OUT OF ASU.', tone: 'white' }
] as const;

export const rsvpPunchStatement = {
  kicker: 'Rush Standard',
  ariaLabel: 'Show up. Get seen. Get connected.',
  lines: [
    { text: 'SHOW UP.', tone: 'white' },
    { text: 'GET SEEN.', tone: 'blue', italic: true, shadow: true },
    { text: 'GET CONNECTED.', tone: 'white' }
  ]
} as const;

export const applyDisplay = [
  { text: 'START THE', tone: 'white' },
  { text: 'CONVERSATION.', tone: 'blue', italic: true, shadow: true }
] as const;

export const chairmenDisplay = [
  { text: 'MEET OUR', tone: 'white' },
  { text: 'RUSH CHAIRMEN', tone: 'gold', shadow: true }
] as const;

export const rushChairmen = [
  {
    id: 'bode-estabrook',
    name: 'Bode Estabrook',
    title: 'Rush Chairman',
    image: '/images/rush-chairman-1.jpg',
    initials: 'BE',
    bio: 'Short contact and bio placeholder for the rush chairman.',
    contact: '@instagram_handle / phone placeholder'
  },
  {
    id: 'tanner-smith',
    name: 'Tanner Smith',
    title: 'Vice Rush Chairman',
    image: '/images/rush-chairman-2.jpg',
    initials: 'TS',
    bio: 'Short contact and bio placeholder for the vice rush chairman.',
    contact: '@instagram_handle / phone placeholder'
  }
] as const;
// Put headshots at:
// public/images/rush-chairman-1.jpg
// public/images/rush-chairman-2.jpg

export const executiveBoardMembers = [
  {
    id: 'archon-president',
    name: 'Name Placeholder',
    role: 'Archon / President',
    initials: 'AP',
    image: '',
    instagram: '@instagram_handle',
    phone: 'phone placeholder'
  },
  {
    id: 'vice-archon-vice-president',
    name: 'Name Placeholder',
    role: 'Vice Archon / Vice President',
    initials: 'VP',
    image: '',
    instagram: '@instagram_handle',
    phone: 'phone placeholder'
  },
  {
    id: 'treasurer',
    name: 'Name Placeholder',
    role: 'Treasurer',
    initials: 'TR',
    image: '',
    instagram: '@instagram_handle',
    phone: 'phone placeholder'
  },
  {
    id: 'secretary',
    name: 'Name Placeholder',
    role: 'Secretary',
    initials: 'SC',
    image: '',
    instagram: '@instagram_handle',
    phone: 'phone placeholder'
  },
  {
    id: 'warden',
    name: 'Name Placeholder',
    role: 'Warden',
    initials: 'WD',
    image: '',
    instagram: '@instagram_handle',
    phone: 'phone placeholder'
  },
  {
    id: 'standards-chair',
    name: 'Name Placeholder',
    role: 'Standards Chair',
    initials: 'ST',
    image: '',
    instagram: '@instagram_handle',
    phone: 'phone placeholder'
  },
  {
    id: 'risk-manager',
    name: 'Name Placeholder',
    role: 'Risk Manager',
    initials: 'RM',
    image: '',
    instagram: '@instagram_handle',
    phone: 'phone placeholder'
  },
  {
    id: 'rush-chairman',
    name: 'Name Placeholder',
    role: 'Rush Chairman',
    initials: 'RC',
    image: '',
    instagram: '@instagram_handle',
    phone: 'phone placeholder'
  },
  {
    id: 'vice-rush-chairman',
    name: 'Name Placeholder',
    role: 'Vice Rush Chairman',
    initials: 'VR',
    image: '',
    instagram: '@instagram_handle',
    phone: 'phone placeholder'
  },
  {
    id: 'ability-experience-philanthropy-chair',
    name: 'Name Placeholder',
    role: 'Ability Experience / Philanthropy Chair',
    initials: 'AE',
    image: '',
    instagram: '@instagram_handle',
    phone: 'phone placeholder'
  },
  {
    id: 'social-chair',
    name: 'Name Placeholder',
    role: 'Social Chair',
    initials: 'SO',
    image: '',
    instagram: '@instagram_handle',
    phone: 'phone placeholder'
  },
  {
    id: 'brotherhood-chair',
    name: 'Name Placeholder',
    role: 'Brotherhood Chair',
    initials: 'BH',
    image: '',
    instagram: '@instagram_handle',
    phone: 'phone placeholder'
  },
  {
    id: 'scholarship-chair',
    name: 'Name Placeholder',
    role: 'Scholarship Chair',
    initials: 'SH',
    image: '',
    instagram: '@instagram_handle',
    phone: 'phone placeholder'
  },
  {
    id: 'historian',
    name: 'Name Placeholder',
    role: 'Historian',
    initials: 'HS',
    image: '',
    instagram: '@instagram_handle',
    phone: 'phone placeholder'
  },
  {
    id: 'chaplain',
    name: 'Name Placeholder',
    role: 'Chaplain',
    initials: 'CH',
    image: '',
    instagram: '@instagram_handle',
    phone: 'phone placeholder'
  }
] as const;
// Add executive board photos later by setting each image value to a file in public/images/.

export const abilityExperienceContent = {
  externalHref: 'https://www.abilityexperience.org',
  chairRoleId: 'ability-experience-philanthropy-chair',
  intro:
    'The Ability Experience is Pi Kappa Phi’s national philanthropy, creating shared experiences that support people with disabilities and build servant leaders inside the fraternity.',
  highlights: [
    'Fundraising and awareness events that connect the chapter to a national mission.',
    'Hands-on service opportunities through Pi Kappa Phi’s lifelong commitment to disability support.',
    'A way for members to lead with impact beyond campus and Greek life.'
  ],
  photos: [
    { id: 'ability-photo-1', label: 'Ability Experience photo placeholder', image: '' },
    { id: 'ability-photo-2', label: 'Service event photo placeholder', image: '' },
    { id: 'ability-photo-3', label: 'Brotherhood philanthropy photo placeholder', image: '' }
  ]
} as const;

export const chapterContact = {
  instagram: 'https://www.instagram.com/asupikappaphi/',
  rushHref: '#apply',
  rsvpHref: '/events',
  email: 'email placeholder',
  phone: 'phone placeholder'
} as const;

export const footerLinkGroups = [
  {
    title: 'Official Links',
    links: [
      { label: 'Pi Kappa Phi National Website', href: 'https://www.pikapp.org', external: true },
      { label: 'Chapter Instagram', href: chapterContact.instagram, external: true },
      { label: 'The Ability Experience', href: 'https://www.abilityexperience.org', external: true },
      { label: 'Arizona State University', href: 'https://www.asu.edu', external: true }
    ]
  },
  {
    title: 'Site',
    links: [
      { label: 'Executive Board', href: '/executive-board', external: false },
      { label: 'Ability Experience', href: '/ability-experience', external: false },
      { label: 'Rush Events', href: chapterContact.rsvpHref, external: false },
      { label: 'Rush Form', href: chapterContact.rushHref, external: false }
    ]
  }
] as const;

export const why = [
  [
    'Real Brotherhood',
    'A tight-knit chapter where guys know each other, show up for each other, and build real relationships through college and beyond.'
  ],
  [
    'Bigger Opportunities',
    'Leadership, philanthropy, social life, alumni connections, and campus presence give members more ways to grow and make the most of ASU.'
  ],
  [
    'Built Different',
    'Pi Kapp is for guys who bring something tangible to the table and want to help set the standard for the chapter.'
  ]
];

export const events = [
  'Rush Week',
  'Brotherhood Nights',
  'Ability Experience Events',
  'Intramurals',
  'Tailgates',
  'Formals',
  'Date Parties',
  'Chapter Retreats'
];

export const gallery = [
  'Rush',
  'Tailgates',
  'Tempe Nights',
  'Brotherhood',
  'Philanthropy',
  'Chapter Life'
];

export const faqs = [
  [
    'What is rush?',
    'Rush is just the process of meeting the brothers, coming to events, and seeing if Pi Kapp is a good fit for you.'
  ],
  [
    'What kind of guys are we looking for?',
    'Guys who are social, driven, respectful, and willing to contribute. You do not need to know anyone already — you just need to be someone the chapter would want around.'
  ],
  [
    'Do I need to fit a certain mold?',
    'No. Our chapter has athletes, business guys, engineers, gym rats, DJs, bookworms, and everything in between. The main thing is whether you fit with the brotherhood.'
  ],
  [
    'How much does it cost?',
    'Dues depend on the semester and what is planned. If you rush, we will walk you through the current cost clearly before you make any decision.'
  ],
  [
    'What is the time commitment?',
    'During rush, it is mostly showing up to events and meeting the guys. Once you join, expect chapter, brotherhood events, philanthropy, and whatever else you choose to get involved in.'
  ],
  [
    'What makes Pi Kapp different?',
    'Pi Kapp at ASU is not trying to be like every other chapter on campus. We’re building the standard. The guys, the events, the philanthropy, the campus presence, and the way we carry ourselves all speak for themselves. Nationally, Pi Kapp already has the tradition. At ASU, we’re making it clear why this chapter is one of the strongest in the country.'
  ]
];