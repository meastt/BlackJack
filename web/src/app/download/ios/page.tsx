import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Breadcrumbs, SoftwareApplicationSchema } from "@/components/seo";

const BASE_URL = "https://protocol21blackjack.com";

export const metadata: Metadata = {
  title: "Download Protocol 21 for iPhone & iPad - iOS App",
  description: "Download Protocol 21 free on iPhone and iPad. The #1 blackjack card counting trainer for iOS with Hi-Lo, KO, Omega II systems, true count drills, and real-time analytics.",
  alternates: {
    canonical: `${BASE_URL}/download/ios`,
  },
  openGraph: {
    title: "Protocol 21 for iPhone & iPad - iOS Card Counting App",
    description: "Master card counting on iOS with casino-grade training drills and proven counting systems. Free download for iPhone and iPad.",
    url: `${BASE_URL}/download/ios`,
    type: "website",
    images: [
      {
        url: `${BASE_URL}/images/protocol-21-hero1.webp`,
        width: 1200,
        height: 630,
        alt: "Protocol 21 iOS App",
      },
    ],
  },
};

export default function iOSDownloadPage() {
  return (
    <main className="min-h-screen">
      <SoftwareApplicationSchema
        platform="iOS"
        downloadUrl="https://apps.apple.com/app/protocol-21"
      />

      <section className="hero py-16 md:py-24">
        <div className="container">
          <Breadcrumbs
            items={[
              { name: "Home", url: "/" },
              { name: "Download", url: "/download" },
              { name: "iOS", url: "/download/ios" },
            ]}
            className="mb-8"
          />

          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-gradient-gold">Protocol 21 for iPhone & iPad</span>
            </h1>
            <p className="text-xl text-text-secondary leading-relaxed mb-8">
              Download the #1 blackjack card counting trainer for iOS. Master Hi-Lo, KO, Omega II, and other counting systems with casino-grade training drills. Free for iPhone and iPad.
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              <a
                href="https://apps.apple.com/app/protocol-21"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                Download on App Store
              </a>
              <Link href="/download/android" className="btn btn-outline">
                Android Version
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="bg-surface-secondary rounded-lg p-6">
                <div className="text-4xl mb-2">★★★★★</div>
                <p className="text-sm text-text-secondary">4.8/5 Rating</p>
              </div>
              <div className="bg-surface-secondary rounded-lg p-6">
                <div className="text-4xl mb-2">1250+</div>
                <p className="text-sm text-text-secondary">User Reviews</p>
              </div>
              <div className="bg-surface-secondary rounded-lg p-6">
                <div className="text-4xl mb-2">Free</div>
                <p className="text-sm text-text-secondary">Full Access</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* iOS Features */}
      <section className="section bg-surface-secondary">
        <div className="container max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">iOS-Optimized Features</h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <span className="text-3xl">📱</span>
              <div>
                <h3 className="text-lg font-bold mb-2">Retina Display Support</h3>
                <p className="text-text-secondary">Stunning graphics optimized for iPhone and iPad Retina displays. Sharp card graphics and clear readability on all screen sizes.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <span className="text-3xl">🎮</span>
              <div>
                <h3 className="text-lg font-bold mb-2">Touch Gesture Controls</h3>
                <p className="text-text-secondary">Intuitive swipe and tap controls designed specifically for touch screens. Responsive drills with natural iOS interaction patterns.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <span className="text-3xl">🔋</span>
              <div>
                <h3 className="text-lg font-bold mb-2">Optimized Battery Usage</h3>
                <p className="text-text-secondary">Efficient code and smart background processing mean longer training sessions without draining your battery.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <span className="text-3xl">🌙</span>
              <div>
                <h3 className="text-lg font-bold mb-2">Dark Mode Support</h3>
                <p className="text-text-secondary">Seamless Dark Mode integration protects your eyes during late-night training sessions on iOS devices.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <span className="text-3xl">♿</span>
              <div>
                <h3 className="text-lg font-bold mb-2">Accessibility Features</h3>
                <p className="text-text-secondary">Full VoiceOver support, adjustable text sizes, and accessibility options ensure Protocol 21 works for everyone.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <span className="text-3xl">📲</span>
              <div>
                <h3 className="text-lg font-bold mb-2">Universal App</h3>
                <p className="text-text-secondary">One app download works seamlessly on iPhone and iPad with optimized layouts for each screen size.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section className="section">
        <div className="container max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">System Requirements</h2>
          <div className="bg-surface-secondary rounded-lg p-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-surface-tertiary">
                <span className="font-semibold">iOS Version</span>
                <span className="text-text-secondary">iOS 13.0 or later</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-surface-tertiary">
                <span className="font-semibold">Devices</span>
                <span className="text-text-secondary">iPhone & iPad</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-surface-tertiary">
                <span className="font-semibold">Storage</span>
                <span className="text-text-secondary">150 MB</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold">Cost</span>
                <span className="text-text-secondary">Free</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Step-by-Step Guide */}
      <section className="section bg-surface-secondary">
        <div className="container max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">How to Download & Install</h2>
          <div className="space-y-6">
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gold-500 flex items-center justify-center text-white font-bold text-xl">1</div>
              <div>
                <h3 className="text-lg font-bold mb-2">Open App Store</h3>
                <p className="text-text-secondary">Launch the App Store app on your iPhone or iPad.</p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gold-500 flex items-center justify-center text-white font-bold text-xl">2</div>
              <div>
                <h3 className="text-lg font-bold mb-2">Search for Protocol 21</h3>
                <p className="text-text-secondary">Use the search tab to find "Protocol 21 Blackjack Counter".</p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gold-500 flex items-center justify-center text-white font-bold text-xl">3</div>
              <div>
                <h3 className="text-lg font-bold mb-2">Tap Get</h3>
                <p className="text-text-secondary">Tap the "Get" button, then authenticate with Face ID, Touch ID, or your Apple password.</p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gold-500 flex items-center justify-center text-white font-bold text-xl">4</div>
              <div>
                <h3 className="text-lg font-bold mb-2">Wait for Installation</h3>
                <p className="text-text-secondary">The app will download and install automatically. Wait for "Open" to appear.</p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gold-500 flex items-center justify-center text-white font-bold text-xl">5</div>
              <div>
                <h3 className="text-lg font-bold mb-2">Launch & Start Training</h3>
                <p className="text-text-secondary">Tap "Open" to launch Protocol 21 and begin your card counting training.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Recap */}
      <section className="section">
        <div className="container max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">What You Get</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="text-lg font-bold mb-4">Guided Learning</h3>
              <ul className="space-y-2 text-text-secondary">
                <li>✓ Phase 0: Basic Strategy</li>
                <li>✓ Phase 1: Card Values</li>
                <li>✓ Phase 2: Running Count</li>
                <li>✓ Phase 3: True Count</li>
                <li>✓ Phase 4: Bet Sizing</li>
                <li>✓ Phase 5: Deviations</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-bold mb-4">Training Drills</h3>
              <ul className="space-y-2 text-text-secondary">
                <li>✓ True Count Conversion</li>
                <li>✓ Speed Counting</li>
                <li>✓ Deck Estimation</li>
                <li>✓ Casino Simulation</li>
                <li>✓ Progressive Difficulty</li>
                <li>✓ Detailed Analytics</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-surface-secondary">
        <div className="container max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Training?</h2>
          <p className="text-lg text-text-secondary leading-relaxed mb-8 max-w-2xl mx-auto">
            Download Protocol 21 free on iOS today. Master blackjack card counting with the #1 trainer app for iPhone and iPad.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://apps.apple.com/app/protocol-21"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              Download on App Store
            </a>
            <Link href="/blog" className="btn btn-outline">
              Read Guides
            </Link>
            <Link href="/systems" className="btn btn-outline">
              Learn Systems
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
