
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Playfair_Display, Inter } from 'next/font/google';
import { FirebaseClientProvider } from '@/firebase';
import { Toaster } from '@/components/ui/toaster';

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
});

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

// FORCE DESKTOP MODE ON MOBILE BY SETTING A FIXED VIEWPORT WIDTH
export const viewport: Viewport = {
  width: 1200,
  initialScale: 0.3, // Automatically zoom out on mobile to fit 1200px layout
  minimumScale: 0.1,
  userScalable: true,
};

export const metadata: Metadata = {
  title: 'SS SMART HAAT | Premium Marketplace',
  description: 'Uniquely curated fashion and essentials for the modern elite.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="font-body bg-background text-foreground antialiased selection:bg-primary/30">
        <FirebaseClientProvider>
          {children}
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
