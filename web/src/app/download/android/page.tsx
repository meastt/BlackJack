import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Breadcrumbs, SoftwareApplicationSchema } from "@/components/seo";

const BASE_URL = "https://protocol21blackjack.com";

export const metadata: Metadata = {
  title: "Download Protocol 21 for Android - Card Counting App",
  description: "Download Protocol 21 free on Android. The #1 blackjack card counting trainer for smartphones and tablets with Hi-Lo, KO, Omega II systems, true count drills, and casino simulation.",
  alternates: {
    canonical: `${BASE_URL}/download/android`,
  },
  openGraph: {
    title: "Protocol 21 for Android - Blackjack Card Counting Trainer",
    description: "Master card counting on Android with professional-grade training drills and proven counting systems. Free download for phones and tablets.",
    url: `${BASE_URL}/download/android`,
    type: "website",
    images: [
      {
        url: `${BASE_URL}/images/protocol-21-hero1.webp`,
        width: 1200,
        height: 630,
        alt: "Protocol 21 Android App",
      },
    ],
  },
};

export default function AndroidDownloadPage() {
  return (
    <main className="min-h-screen">
      <SoftwareApplicationSchema
        platform="Android"
        downloadUrl="https://play.google.com/store/apps/details?id=com.protocol21.app"
      />

      <section className="hero py-16 md:py-24">
        <div className="container">
          <Breadcrumbs
            items={[
              { name: "Home", url: "/" },
              { name: "Download", url: "/download" },
              { name: "Android", url: "/download/android" },
            ]}
            className="mb-8"
          />

          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-gradient-gold">Protocol 21 for Android</span>
            </h1>
            <p className="text-xl text-text-secondary leading-relaxed mb-8">
              Download the #1 blackjack card counting trainer for Android. Master Hi-Lo, KO, Omega II, and other counting systems with casino-grade training drills. Free for all Android devices.
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              <a
                href="https://play.google.com/store/apps/details?id=com.protocol21.app"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                Download on Google Play
              </a>
              <Link href="/download/ios" className="btn btn-outline">
                iOS Version
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

      {/* Android Features */}
      <section className="section bg-surface-secondary">
        <div className="container max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Android-Optimized Features</h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <span className="text-3xl">📱</span>
              <div>
                <h3 className="text-lg font-bold mb-2">Universal Device Support</h3>
                <p className="text-text-secondary">Works seamlessly on all Android phones and tablets. Optimized for devices from budget-friendly to premium flagship models.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <span className="text-3xl">🎮</span>
              <div>
                <h3 className="text-lg font-bold mb-2">Native Android Controls</h3>
                <p className="text-text-secondary">Full support for Android touch gestures, back buttons, and system navigation. Familiar Android interaction patterns throughout the app.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <span className="text-3xl">🔋</span>
              <div>
                <h3 className="text-lg font-bold mb-2">Battery Optimization</h3>
                <p className="text-text-secondary">Efficient battery usage with smart power management. Train for hours without excessive battery drain.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <span className="text-3xl">🌙</span>
              <div>
                <h3 className="text-lg font-bold mb-2">Dark Theme Support</h3>
                <p className="text-text-secondary">Full Material You dark theme support on Android 12+. Custom theme colors match your system preferences.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <span className="text-3xl">♿</span>
              <div>
                <h3 className="text-lg font-bold mb-2">Accessibility Features</h3>
                <p className="text-text-secondary">TalkBack support, adjustable text sizes, color contrast options, and full accessibility compliance for all users.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <span className="text-3xl">🔐</span>
              <div>
                <h3 className="text-lg font-bold mb-2">Android Security</h3>
                <p className="text-text-secondary">Uses Android's latest security features. Google Play Protect verified and regularly scanned for security.</p>
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
                <span className="font-semibold">Android Version</span>
                <span className="text-text-secondary">Android 8.0 or later</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-surface-tertiary">
                <span className="font-semibold">Devices</span>
                <span className="text-text-secondary">All Android phones & tablets</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-surface-tertiary">
                <span className="font-semibold">Storage</span>
                <span className="text-text-secondary">180 MB</span>
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
                <h3 className="text-lg font-bold mb-2">Open Google Play Store</h3>
                <p className="text-text-secondary">Launch the Google Play Store app on your Android device.</p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gold-500 flex items-center justify-center text-white font-bold text-xl">2</div>
              <div>
                <h3 className="text-lg font-bold mb-2">Search for Protocol 21</h3>
                <p className="text-text-secondary">Use the search feature to find "Protocol 21 Blackjack Counter".</p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gold-500 flex items-center justify-center text-white font-bold text-xl">3</div>
              <div>
                <h3 className="text-lg font-bold mb-2">Tap Install</h3>
                <p className="text-text-secondary">Tap the "Install" button to begin downloading the app.</p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gold-500 flex items-center justify-center text-white font-bold text-xl">4</div>
              <div>
                <h3 className="text-lg font-bold mb-2">Accept Permissions</h3>
                <p className="text-text-secondary">Review and accept app permissions. Protocol 21 only requests necessary permissions for functionality.</p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gold-500 flex items-center justify-center text-white font-bold text-xl">5</div>
              <div>
                <h3 className="text-lg font-bold mb-2">Launch & Begin Training</h3>
                <p className="text-text-secondary">Once installation completes, tap "Open" to start Protocol 21 and begin card counting training.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Device Compatibility */}
      <section className="section">
        <div className="container max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Device Compatibility</h2>
          <p className="text-lg text-text-secondary leading-relaxed mb-8">
            Protocol 21 works on a wide range of Android devices, from budget smartphones to high-end tablets.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-surface-secondary rounded-lg p-6">
              <h3 className="text-lg font-bold mb-4">Works Great On:</h3>
              <ul className="space-y-2 text-text-secondary text-sm">
                <li>✓ Samsung Galaxy phones & tablets</li>
                <li>✓ Google Pixel phones</li>
                <li>✓ OnePlus devices</li>
                <li>✓ Motorola Android phones</li>
                <li>✓ LG Android devices</li>
                <li>✓ All other Android devices</li>
              </ul>
            </div>

            <div className="bg-surface-secondary rounded-lg p-6">
              <h3 className="text-lg font-bold mb-4">Features Optimized For:</h3>
              <ul className="space-y-2 text-text-secondary text-sm">
                <li>✓ Small phone screens (4-5 inches)</li>
                <li>✓ Standard phones (6-6.5 inches)</li>
                <li>✓ Large phones (6.5+ inches)</li>
                <li>✓ Tablets (7-13 inches)</li>
                <li>✓ Foldable devices</li>
                <li>✓ All screen densities & ratios</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Recap */}
      <section className="section bg-surface-secondary">
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
      <section className="section">
        <div className="container max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Training?</h2>
          <p className="text-lg text-text-secondary leading-relaxed mb-8 max-w-2xl mx-auto">
            Download Protocol 21 free on Android today. Master blackjack card counting with the #1 trainer app for smartphones and tablets.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://play.google.com/store/apps/details?id=com.protocol21.app"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              Download on Google Play
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
