import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Breadcrumbs, ArticleSchema } from "@/components/seo";

const BASE_URL = "https://protocol21blackjack.com";

export const metadata: Metadata = {
  title: "About Protocol 21 - Expert Blackjack Card Counting Training",
  description: "Learn about Protocol 21's mission to provide the most advanced blackjack card counting trainer app. Expert-designed systems, verified research, trusted by serious advantage players.",
  alternates: {
    canonical: `${BASE_URL}/about`,
  },
  openGraph: {
    title: "About Protocol 21 - Blackjack Card Counting Experts",
    description: "Discover how Protocol 21 is revolutionizing card counting training with advanced systems and casino-grade drills.",
    url: `${BASE_URL}/about`,
    type: "website",
    images: [
      {
        url: `${BASE_URL}/images/protocol-21-hero1.webp`,
        width: 1200,
        height: 630,
        alt: "Protocol 21 Blackjack Card Counting App",
      },
    ],
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <ArticleSchema
        title="About Protocol 21 - Expert Blackjack Card Counting Training"
        description="Protocol 21 is the leading blackjack card counting trainer app, designed by advantage play experts with casino-grade training systems."
        url={`${BASE_URL}/about`}
        datePublished="2024-01-15"
        image={`${BASE_URL}/images/protocol-21-hero1.webp`}
      />

      <section className="hero py-16 md:py-24">
        <div className="container">
          <Breadcrumbs
            items={[
              { name: "Home", url: "/" },
              { name: "About", url: "/about" },
            ]}
            className="mb-8"
          />

          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-gradient-gold">About Protocol 21</span>
            </h1>
            <p className="text-xl text-text-secondary leading-relaxed mb-8">
              Protocol 21 is the world's leading blackjack card counting trainer app, designed by advantage play experts for serious players who want to master proven card counting systems and beat the house mathematically.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="section">
        <div className="container max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Mission</h2>
          <p className="text-lg text-text-secondary leading-relaxed mb-6">
            To democratize advantage play by providing casino-grade card counting training tools to players worldwide. We believe that understanding probability, bankroll management, and counting systems should be accessible to everyone interested in legitimate edge play.
          </p>
          <p className="text-lg text-text-secondary leading-relaxed mb-6">
            Protocol 21 combines cutting-edge app technology with proven card counting methodologies used by professional advantage players. Our platform removes the guesswork from learning—providing real-time feedback, progress tracking, and scientifically-designed drills that simulate actual casino conditions.
          </p>
        </div>
      </section>

      {/* Expertise Section */}
      <section className="section bg-surface-secondary">
        <div className="container max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Expertise</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">🎓 Research-Backed</h3>
              <p className="text-text-secondary leading-relaxed">
                Protocol 21 is built on established advantage play research spanning decades. Every counting system, drill, and training methodology is verified against mathematical models and real-world application data.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">🏆 Expert-Designed</h3>
              <p className="text-text-secondary leading-relaxed">
                Our development team includes experienced advantage players and blackjack trainers who understand the exact skills needed to succeed in casino environments.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">⚙️ Casino-Grade Simulation</h3>
              <p className="text-text-secondary leading-relaxed">
                Practice drills simulate real casino noise, dealer speed, penetration, and distractions. Your training environment matches actual gameplay conditions.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">📊 Data-Driven Progress</h3>
              <p className="text-text-secondary leading-relaxed">
                Track your improving true count accuracy, speed counting metrics, deck estimation precision, and overall readiness through detailed analytics and performance benchmarks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Supported Systems Section */}
      <section className="section">
        <div className="container max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">6-Phase Guided Hi-Lo Training</h2>
          <p className="text-lg text-text-secondary leading-relaxed mb-8">
            Protocol 21 is structured around a rigorous 6-Phase course on the Hi-Lo system—the universal industry standard. From Basic Strategy to Illustrious 18 Deviations, you get an end-to-end masterclass. We also supply rich reference materials on alternative systems:
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border border-surface-tertiary rounded-lg p-6">
              <h3 className="text-lg font-bold mb-3">Balanced Counts</h3>
              <ul className="space-y-2 text-text-secondary">
                <li>✓ Hi-Lo (Beginner)</li>
                <li>✓ KO/Knock-Out (Beginner)</li>
                <li>✓ Zen Count (Intermediate)</li>
              </ul>
            </div>
            <div className="border border-surface-tertiary rounded-lg p-6">
              <h3 className="text-lg font-bold mb-3">Unbalanced Counts</h3>
              <ul className="space-y-2 text-text-secondary">
                <li>✓ Red 7 (Intermediate)</li>
                <li>✓ Omega II (Advanced)</li>
                <li>✓ Wong Halves (Expert)</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="section bg-surface-secondary">
        <div className="container max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Choose Protocol 21?</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <span className="text-2xl">✓</span>
              <div>
                <h3 className="font-bold mb-2">Comprehensive Training Drills</h3>
                <p className="text-text-secondary">True count conversion, speed counting, deck estimation, and casino noise simulation all in one app.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="text-2xl">✓</span>
              <div>
                <h3 className="font-bold mb-2">Real-Time Feedback</h3>
                <p className="text-text-secondary">Instant accuracy metrics and detailed performance analysis help you identify weaknesses and track improvement.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="text-2xl">✓</span>
              <div>
                <h3 className="font-bold mb-2">Proven Methodologies</h3>
                <p className="text-text-secondary">Every system and drill is tested and verified by professional advantage players with real-world casino experience.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="text-2xl">✓</span>
              <div>
                <h3 className="font-bold mb-2">Progressive Learning Path</h3>
                <p className="text-text-secondary">Start as a beginner in Phase 0 (Basic Strategy) and unlock subsequent phases leading all the way up to Phase 5 (Deviations), at your own pace.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="text-2xl">✓</span>
              <div>
                <h3 className="font-bold mb-2">Offline Training</h3>
                <p className="text-text-secondary">Download the app and train anywhere—casino practice drills don't require internet access.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="text-2xl">✓</span>
              <div>
                <h3 className="font-bold mb-2">Cross-Platform Access</h3>
                <p className="text-text-secondary">Seamlessly train on iOS and Android devices with synchronized progress tracking.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Commitment Section */}
      <section className="section">
        <div className="container max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Commitment to Excellence</h2>
          <p className="text-lg text-text-secondary leading-relaxed mb-6">
            Protocol 21 is committed to providing the most accurate, scientifically-grounded card counting training platform available. We continuously update our systems based on the latest advantage play research and player feedback.
          </p>
          <p className="text-lg text-text-secondary leading-relaxed mb-8">
            Whether you're learning your first counting system or mastering expert fractional counts, Protocol 21 provides the tools, guidance, and support you need to develop casino-ready card counting skills.
          </p>

          <div className="bg-surface-secondary rounded-lg p-8 mb-8">
            <h3 className="text-xl font-bold mb-4">Get Started Today</h3>
            <p className="text-text-secondary mb-6">
              Download Protocol 21 for free and begin your journey to mastering blackjack advantage play.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/download" className="btn btn-primary">
                Download Protocol 21
              </Link>
              <Link href="/systems" className="btn btn-outline">
                Learn All Systems
              </Link>
              <Link href="/blog" className="btn btn-outline">
                Read Guides
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
