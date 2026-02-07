import type { Metadata } from 'next';
import './globals.css';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://base-ninja-game.vercel.app';

export const metadata: Metadata = {
  title: 'Base Ninja - Slice the Onchain',
  description: 'Crypto fruit ninja game on Base. Slice coins, avoid bombs, unlock unique blades and backgrounds!',
  openGraph: {
    title: 'Base Ninja - Slice the Onchain',
    description: 'Crypto fruit ninja game on Base. Slice coins, avoid bombs, unlock unique blades!',
    images: [`${APP_URL}/images/og-image.png`],
    url: APP_URL,
    type: 'website',
  },
  other: {
    'fc:miniapp': JSON.stringify({
      version: 'next',
      imageUrl: `${APP_URL}/images/og-image.png`,
      button: {
        title: '🎮 Play Now',
        action: {
          type: 'launch_miniapp',
          name: 'Base Ninja',
          url: APP_URL,
          splashImageUrl: `${APP_URL}/images/splash.png`,
          splashBackgroundColor: '#0a0a1a',
        },
      },
    }),
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
