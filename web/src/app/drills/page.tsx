import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import drills from "@/data/drills.json";
import { Breadcrumbs, HowToSchema } from "@/components/seo";

const BASE_URL = "https://protocol21blackjack.com";

export const metadata: Metadata = {
  title: "Card Counting Drills - True Count, Speed & Deck Estimation Training",
  description: "Practice card counting with specialized drills. Master true count conversion, speed counting, and deck estimation with Protocol 21's casino-grade training exercises.",
  alternates: {
    canonical: `${BASE_URL}/drills`,
  },
  openGraph: {
    title: "Card Counting Drills - Protocol 21 Training",
    description: "Practice true count conversion, speed counting, and deck estimation with specialized drills.",
    url: `${BASE_URL}/drills`,
    type: "website",
    images: [
      {
        url: `${BASE_URL}/images/protocol-21-true-count.webp`,
        width: 1200,
        height: 630,
        alt: "Card Counting Practice Drills",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Card Counting Drills - Protocol 21",
    description: "Master true count, speed counting, and deck estimation.",
    images: [`${BASE_URL}/images/protocol-21-true-count.webp`],
  },
};

const drillIcons: Record<string, React.ReactNode> = {
  "blackjack-true-count-practice": (
    <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  ),
  "deck-estimation-drills": (
    <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ),
  "card-counting-speed-drills": (
    <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
};

export default function DrillsPage() {
  return (
    <main className="min-h-screen">
      <HowToSchema
        name="How to Practice Card Counting"
        description="Learn the three essential drills every card counter needs to master: True Count Conversion, Deck Estimation, and Speed Counting."
        totalTime="PT30M"
        steps={[
          {
            name: "Master True Count Conversion",
            text: "Practice dividing your running count by the number of decks remaining. This mental math is critical for accurate betting decisions in multi-deck games.",
          },
          {
            name: "Train Deck Estimation",
            text: "Learn to visually estimate how many decks remain in the shoe by looking at the discard tray. Accuracy to within 0.5 decks is the goal.",
          },
          {
            name: "Build Counting Speed",
            text: "Increase your card recognition and counting speed until you can maintain accuracy at casino dealing speeds (1-1.5 seconds per card).",
          },
        ]}
      />

      <section className="hero py-16 md:py-24">
        <div className="container">
          <Breadcrumbs
            items={[{ name: "Practice Drills", url: "/drills" }]}
            className="mb-8"
          />

          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-gradient-gold">Practice Drills</span>
            </h1>
            <p className="text-xl text-text-secondary leading-relaxed mb-8">
              Knowing the card values is just the beginning. These targeted drills build the
              specific skills that separate weekend hobbyists from profitable advantage players.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/download" className="btn btn-primary">
                Start Training Now
              </Link>
              <Link href="/systems" className="btn btn-outline">
                Choose Your System
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Image */}
      <div className="container pb-12">
        <div className="relative w-full h-64 md:h-80 rounded-xl overflow-hidden">
          <Image
            src="/images/protocol-21-true-count.webp"
            alt="True count practice drill in Protocol 21 app"
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 1200px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        </div>
      </div>

      {/* Drills Grid */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              <span className="text-gradient">Essential Drills</span>
            </h2>
            <p className="section-subtitle">
              Each drill targets a specific weakness that causes counters to lose their edge.
              Master all three to become casino-ready.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {drills.map((drill) => (
              <Link
                href={`/drills/${drill.slug}`}
                key={drill.slug}
                className="card group hover:border-primary/30 transition-all"
              >
                <div className="w-16 h-16 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-6">
                  {drillIcons[drill.slug]}
                </div>

                <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                  {drill.drill_name}
                </h3>

                <p className="text-text-secondary mb-4">
                  Target Skill: <span className="text-accent font-semibold">{drill.target_skill}</span>
                </p>

                <p className="text-sm text-text-muted italic mb-6">
                  Common pain point: &ldquo;{drill.pain_point}&rdquo;
                </p>

                <div className="flex items-center text-primary text-sm font-semibold mt-auto">
                  Start Drill
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Drills Matter */}
      <section className="section bg-surface">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
              Why Isolated Drills Matter
            </h2>

            <div className="prose prose-invert mx-auto">
              <p className="text-text-secondary text-lg leading-relaxed mb-6">
                Most card counting apps just let you play blackjack and track your count. That&apos;s like
                learning to fly by jumping in a cockpit. You need to isolate and drill individual skills
                before integrating them into live play.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">0.5s</div>
                  <div className="text-text-secondary">Target recognition time per card</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">±0.5</div>
                  <div className="text-text-secondary">Deck estimation accuracy</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">100%</div>
                  <div className="text-text-secondary">True count accuracy goal</div>
                </div>
              </div>

              <p className="text-text-secondary text-lg leading-relaxed">
                Protocol 21&apos;s drill modes force you to practice each skill in isolation until it becomes
                automatic. Only then should you move to full shoe simulation. This is the difference
                between hoping you&apos;re ready and knowing you&apos;re ready.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Web Simulator CTA */}
      <section className="section">
        <div className="container">
          <div className="card text-center py-12 md:py-16 relative overflow-hidden border-2 border-primary/30 shadow-[0_0_30px_rgba(255,45,124,0.2)]">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent-cyan/10" />
            <div className="relative z-10">
              <div className="text-5xl mb-4">🎯</div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Try Our Web Simulator
              </h2>
              <p className="text-text-secondary max-w-lg mx-auto mb-8 leading-relaxed">
                Practice card counting right in your browser. Master speed counting with instant feedback.
                No download required.
              </p>
              <Link href="/simulator" className="btn btn-primary px-8 text-lg">
                Launch Simulator
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section">
        <div className="container">
          <div className="card text-center py-12 md:py-16 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Train Like a Pro?
              </h2>
              <p className="text-text-secondary max-w-lg mx-auto mb-8 leading-relaxed">
                Download Protocol 21 and access all three essential drills plus full casino simulation.
                Free for iOS and Android.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/download" className="btn btn-primary px-8">
                  Download Protocol 21
                </Link>
                <Link href="/systems" className="btn btn-outline px-8">
                  Choose Your System
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
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
