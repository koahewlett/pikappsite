import type { Config } from 'tailwindcss';
const config: Config = { content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'], theme: { extend: { colors: { charcoal: '#1A1A1A', graphite: '#252525', ink: '#0F0F0F', gold: '#D4AF37', royal: '#3A5FCD' }, boxShadow: { glow: '0 0 60px rgba(212,175,55,.18)' }, backgroundImage: { 'rose-grid': "radial-gradient(circle at 20% 20%, rgba(212,175,55,.12), transparent 24%), radial-gradient(circle at 80% 0%, rgba(58,95,205,.14), transparent 28%)" } } }, plugins: [] };
export default config;
