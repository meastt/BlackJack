import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Protocol 21",
  description: "Privacy Policy for Protocol 21, the blackjack card counting trainer app for iOS and Android.",
};

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container py-16 max-w-3xl">
        <Link href="/" className="text-primary hover:text-primary-light mb-8 inline-block">
          &larr; Back to Home
        </Link>

        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        <p className="text-secondary mb-8">Last updated: January 2026</p>

        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Overview</h2>
            <p className="text-gray-300 leading-relaxed">
              Protocol 21 (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy.
              This Privacy Policy explains how we handle information when you use our mobile application
              and website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
            <p className="text-gray-300 leading-relaxed">
              <strong className="text-white">We do not collect, store, or share any personal data.</strong>
            </p>
            <p className="text-gray-300 leading-relaxed mt-4">
              Protocol 21 is designed to work entirely offline. All your training data, progress,
              and settings are stored locally on your device and are never transmitted to our servers
              or any third parties.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Data Storage</h2>
            <p className="text-gray-300 leading-relaxed">
              Any data generated while using the app (such as drill scores, practice history, or
              preferences) remains on your device. If you delete the app, this data will be removed
              from your device.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Third-Party Services</h2>
            <p className="text-gray-300 leading-relaxed">
              Protocol 21 does not integrate with any third-party analytics, advertising, or tracking services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Children&apos;s Privacy</h2>
            <p className="text-gray-300 leading-relaxed">
              Our app is not directed at children under 18. Protocol 21 is an educational tool for
              adults interested in learning card counting strategies. Since we do not collect any
              personal information, there is no data collected from any users, including children.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Changes to This Policy</h2>
            <p className="text-gray-300 leading-relaxed">
              We may update this Privacy Policy from time to time. Any changes will be posted on this
              page with an updated revision date. We encourage you to review this policy periodically.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p className="text-gray-300 leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at:{" "}
              <a href="mailto:mike@protocol21blackjack.com" className="text-primary hover:text-primary-light">
                mike@protocol21blackjack.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
