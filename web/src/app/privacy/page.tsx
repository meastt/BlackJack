import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Protocol 21",
  description: "Privacy Policy for Protocol 21, the blackjack card counting trainer app. We respect your privacy and do not collect personal data.",
};

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen">
      <div className="container py-16 md:py-24 max-w-3xl">
        <Link href="/" className="inline-flex items-center text-primary hover:text-primary-light mb-8 transition-colors">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
          </svg>
          Back to Home
        </Link>

        <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-text-secondary mb-12">Last updated: January 2026</p>

        <div className="space-y-10">
          <section className="card">
            <h2 className="text-xl font-semibold mb-3 text-primary">The Short Version</h2>
            <p className="text-text-secondary leading-relaxed text-lg">
              Protocol 21 does not collect, store, or share any personal data. Period.
              Your practice sessions, scores, and progress stay on your device.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
            <p className="text-gray-300 leading-relaxed">
              <strong className="text-white">We don&apos;t collect any personal information.</strong> Protocol 21
              is designed to work entirely offline. All your training data, progress, and settings
              are stored locally on your device and never transmitted to our servers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Data Storage</h2>
            <p className="text-gray-300 leading-relaxed">
              All app data is stored locally on your device using standard iOS/Android storage
              mechanisms. This includes your practice history, preferred counting systems, and
              app settings. If you delete the app, all data is permanently removed.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Third-Party Services</h2>
            <p className="text-gray-300 leading-relaxed">
              Protocol 21 does not integrate with any third-party analytics, advertising, or
              tracking services. We don&apos;t use cookies, pixels, or any form of user tracking
              on our app or website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. App Store Data</h2>
            <p className="text-gray-300 leading-relaxed">
              When you download Protocol 21 from the Apple App Store or Google Play Store,
              those platforms may collect their own data according to their respective privacy
              policies. We do not have access to this information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Children&apos;s Privacy</h2>
            <p className="text-gray-300 leading-relaxed">
              Protocol 21 is intended for users 18 years of age or older. We do not knowingly
              collect information from children. The app is designed for adult educational purposes
              related to card counting and gambling strategy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Changes to This Policy</h2>
            <p className="text-gray-300 leading-relaxed">
              If we ever change our privacy practices (which would only be to collect less data,
              not more), we will update this page and notify users through an app update.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Contact Us</h2>
            <p className="text-gray-300 leading-relaxed">
              Questions about this Privacy Policy? Reach out to us at:{" "}
              <a href="mailto:mike@protocol21blackjack.com" className="text-primary hover:text-primary-light transition-colors">
                mike@protocol21blackjack.com
              </a>
            </p>
          </section>
        </div>
      </div>

      <footer className="footer">
        <div className="container">
          <p className="footer-brand mb-2">
            &copy; {new Date().getFullYear()} Protocol 21. All rights reserved.
          </p>
          <p className="footer-brand">
            Built by fellow degens in the desert at{" "}
            <a href="https://techridgeseo.com" target="_blank" rel="noopener noreferrer">
              TechRidgeSEO
            </a>
          </p>
          <div className="footer-links">
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
            <Link href="/blog">Blog</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
