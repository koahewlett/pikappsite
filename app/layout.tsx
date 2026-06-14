import './globals.css';
import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Rush Pi Kapp | ASU', description: 'Premium recruitment portal for Pi Kappa Phi at Arizona State University.' };
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="en"><body className="font-sans antialiased">{children}</body></html>; }
