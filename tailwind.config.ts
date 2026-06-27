import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        charcoal: '#1A1A1A',
        graphite: '#252525',
        ink: '#0F0F0F',
        gold: '#E7A614',
        royal: '#005596',
      },
      boxShadow: {
        glow: '0 0 60px rgba(231,166,20,.18)',
      },
      backgroundImage: {
        'rose-grid':
          'radial-gradient(circle at 20% 20%, rgba(231,166,20,.12), transparent 24%), radial-gradient(circle at 80% 0%, rgba(0,85,150,.14), transparent 28%)',
      },
    },
  },
  plugins: [],
};

export default config;
