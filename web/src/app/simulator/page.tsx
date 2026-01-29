import { Metadata } from 'next';
import SimulatorContainer from '@/components/simulator/SimulatorContainer';

export const metadata: Metadata = {
  title: 'Free Blackjack Simulator - Practice Card Counting Online | Protocol 21',
  description: 'Play blackjack online with our free simulator. Practice card counting with $10K bankroll, adjustable training wheels, and real-time count feedback. Choose your difficulty.',
  keywords: [
    'blackjack simulator',
    'card counting practice',
    'free blackjack game',
    'card counting trainer',
    'blackjack training',
    'online blackjack practice',
    'counting simulator',
  ],
  openGraph: {
    title: 'Free Blackjack Simulator - Protocol 21',
    description: 'Practice blackjack and card counting with adjustable training wheels. Start with $10K and customize your experience.',
    type: 'website',
  },
};

export default function SimulatorPage() {
  return (
    <main className="min-h-screen bg-background py-12">
      <SimulatorContainer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'Protocol 21 Card Counting Simulator',
            applicationCategory: 'GameApplication',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
            description: 'Free online card counting simulator for blackjack practice',
          }),
        }}
      />
    </main>
  );
}
