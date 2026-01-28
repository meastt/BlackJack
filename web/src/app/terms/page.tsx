import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | Protocol 21",
  description: "Terms of Service for Protocol 21, the blackjack card counting trainer app for iOS and Android.",
};

export default function TermsOfService() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container py-16 max-w-3xl">
        <Link href="/" className="text-primary hover:text-primary-light mb-8 inline-block">
          &larr; Back to Home
        </Link>

        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        <p className="text-secondary mb-8">Last updated: January 2026</p>

        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-300 leading-relaxed">
              By downloading, installing, or using Protocol 21 (&quot;the App&quot;), you agree to be bound
              by these Terms of Service. If you do not agree to these terms, please do not use the App.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
            <p className="text-gray-300 leading-relaxed">
              Protocol 21 is an educational application designed to help users learn and practice
              card counting techniques for blackjack. The App provides training drills, simulations,
              and educational content about various card counting systems.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Educational Purpose Only</h2>
            <p className="text-gray-300 leading-relaxed">
              The App is intended solely for educational and entertainment purposes. Card counting
              is a legal activity, but casinos may ask players to leave or ban them from playing
              blackjack. We do not encourage or endorse any illegal gambling activities. Users are
              responsible for understanding and complying with all applicable laws and casino rules
              in their jurisdiction.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Free Service</h2>
            <p className="text-gray-300 leading-relaxed">
              Protocol 21 is currently offered free of charge. We reserve the right to introduce
              premium features or modify the pricing structure in the future, with appropriate notice
              to users.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Intellectual Property</h2>
            <p className="text-gray-300 leading-relaxed">
              All content, features, and functionality of the App (including but not limited to text,
              graphics, logos, and software) are owned by Protocol 21 and are protected by copyright,
              trademark, and other intellectual property laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. No Warranty</h2>
            <p className="text-gray-300 leading-relaxed">
              The App is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind,
              either express or implied. We do not guarantee that the App will be error-free,
              uninterrupted, or that it will meet your specific requirements. We make no guarantees
              about gambling outcomes or financial results from using the techniques taught in the App.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Limitation of Liability</h2>
            <p className="text-gray-300 leading-relaxed">
              To the fullest extent permitted by law, Protocol 21 shall not be liable for any
              indirect, incidental, special, consequential, or punitive damages, including but not
              limited to loss of profits, data, or other intangible losses, resulting from your use
              or inability to use the App, or any gambling activities you may engage in.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. User Responsibilities</h2>
            <p className="text-gray-300 leading-relaxed">
              You agree to use the App only for lawful purposes and in accordance with these Terms.
              You are solely responsible for your gambling decisions and any consequences that may arise.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Changes to Terms</h2>
            <p className="text-gray-300 leading-relaxed">
              We reserve the right to modify these Terms at any time. Changes will be effective
              immediately upon posting. Your continued use of the App after changes are posted
              constitutes your acceptance of the modified Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Contact Information</h2>
            <p className="text-gray-300 leading-relaxed">
              For questions about these Terms of Service, please contact us at:{" "}
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
