import './globals.css';
import './premium.css';
import './ui-updates.css';
import './intro-loader.css';
import './mobile-text-fixes.css';
import type { Metadata } from 'next';
import { Syne } from 'next/font/google';
import { IntroLoader } from '@/components/IntroLoader';

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-syne',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://pikapp-asu.com'),

  title: {
    default: 'Pi Kappa Phi ASU | Rush Pi Kapp at Arizona State',
    template: '%s | Pi Kappa Phi ASU',
  },

  description:
    'Rush Pi Kappa Phi at Arizona State University. Pi Kapp ASU, Theta Xi Chapter, is a fraternity at ASU in Tempe focused on brotherhood, leadership, events, and campus involvement.',

  keywords: [
    'pikapp',
    'pikapp asu',
    'rush pikapp',
    'pi kapp asu',
    'pi kappa phi asu',
    'pi kappa phi arizona state',
    'asu rush',
    'arizona state rush',
    'asu fraternity rush',
    'arizona state fraternity',
    'theta xi chapter',
    'pi kapp tempe',
  ],

  alternates: {
    canonical: 'https://pikapp-asu.com',
  },

  openGraph: {
    title: 'Pi Kappa Phi ASU | Rush Pi Kapp at Arizona State',
    description:
      'Rush Pi Kappa Phi at Arizona State University. Learn about Pi Kapp ASU, events, brotherhood, and membership.',
    url: 'https://pikapp-asu.com',
    siteName: 'Pi Kappa Phi ASU',
    type: 'website',
    locale: 'en_US',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Pi Kappa Phi ASU | Rush Pi Kapp at Arizona State',
    description:
      'Rush Pi Kappa Phi at Arizona State University. Learn about Pi Kapp ASU, events, brotherhood, and membership.',
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },

  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Pi Kappa Phi ASU',
    alternateName: [
      'Pi Kapp ASU',
      'Pikapp ASU',
      'Pi Kappa Phi Theta Xi Chapter',
      'Rush Pi Kapp',
    ],
    url: 'https://pikapp-asu.com',
    description:
      'Pi Kappa Phi at Arizona State University, Theta Xi Chapter. Rush Pi Kapp at ASU in Tempe, Arizona.',
    areaServed: {
      '@type': 'Place',
      name: 'Arizona State University, Tempe, Arizona',
    },
    memberOf: {
      '@type': 'Organization',
      name: 'Pi Kappa Phi',
    },
  };

  return (
    <html lang="en">
      <body className={`${syne.variable} font-sans antialiased`}>
        <IntroLoader />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
