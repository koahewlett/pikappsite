import './globals.css';
import type { Metadata } from 'next';
import { Inter, Oswald } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const oswald = Oswald({
  subsets: ['latin'],
  variable: '--font-oswald',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://pikapp-asu.com'),
  title: {
    default: 'Pi Kappa Phi ASU | Pi Kapp Theta Xi Chapter',
    template: '%s | Pi Kappa Phi ASU',
  },
  description:
    'Rush Pi Kappa Phi at Arizona State University. Learn about Pi Kapp Theta Xi Chapter, ASU fraternity rush, events, brotherhood, and membership.',
  keywords: [
    'Pi Kappa Phi ASU',
    'Pi Kapp ASU',
    'Pikapp ASU',
    'PiKapp ASU',
    'Pi Kappa Phi Arizona State',
    'Theta Xi Chapter',
    'ASU fraternity rush',
    'Arizona State fraternity',
    'Pi Kapp rush',
  ],
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'Pi Kappa Phi ASU | Pi Kapp Theta Xi Chapter',
    description:
      'Rush Pi Kappa Phi at Arizona State University. Learn about events, brotherhood, and membership.',
    url: 'https://pikapp-asu.com',
    siteName: 'Pi Kappa Phi ASU',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${oswald.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}