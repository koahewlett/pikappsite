export const adobeFontsKitUrl = '';
// Paste the Official PiKapp Site Adobe Fonts kit URL above when available.
// It should look like: https://use.typekit.net/xxxxxxx.css

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

export const punchStatements = [
  {
    kicker: 'Why Pi Kapp',
    ariaLabel: 'Built for guys who want more out of ASU.',
    lines: [
      { text: 'BUILT FOR', tone: 'white' },
      { text: 'GUYS WHO', tone: 'white' },
      { text: 'WANT MORE', tone: 'muted', italic: true, shadow: true },
      { text: 'OUT OF ASU.', tone: 'white' }
    ]
  },
  {
    kicker: 'Rush Standard',
    ariaLabel: 'Show up. Get seen. Get connected.',
    lines: [
      { text: 'SHOW UP.', tone: 'white' },
      { text: 'GET SEEN.', tone: 'blue', italic: true, shadow: true },
      { text: 'GET CONNECTED.', tone: 'white' }
    ]
  }
] as const;

export const applyDisplay = [
  { text: 'START THE', tone: 'white' },
  { text: 'CONVERSATION.', tone: 'gold', italic: true, shadow: true }
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
      { label: 'The Ability Experience', href: 'https://www.abilityexperience.org', external: true },
      { label: 'Arizona State University', href: 'https://www.asu.edu', external: true }
    ]
  },
  {
    title: 'Social / Contact',
    links: [
      { label: 'Pi Kappa Phi National Instagram', href: 'https://www.instagram.com/pikappaphi/', external: true },
      { label: 'The Ability Experience Instagram', href: 'https://www.instagram.com/abilityexp/', external: true },
      { label: 'Chapter Instagram', href: chapterContact.instagram, external: true },
      { label: 'Rush Form', href: chapterContact.rushHref, external: false },
      { label: 'RSVP', href: chapterContact.rsvpHref, external: false }
    ]
  }
] as const;

export const why = [
  [
    'Real Brotherhood',
    'Pi Kapp is built on the strong relationships between brothers. We are a tight-knit group that supports each other through college and beyond.'
  ],
  [
    'Campus Presence',
    'From social events to intramurals, philanthropy, tailgates, and nights out in Tempe, our chapter is active year-round.'
  ],
  [
    'The Ability Experience',
    'Pi Kappa Phi is behind The Ability Experience, our national philanthropy supporting people with disabilities.'
  ],
  [
    'A Chapter You Can Build',
    'We want guys who bring something tangible to the table — socially, academically, athletically, creatively, or through leadership.'
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