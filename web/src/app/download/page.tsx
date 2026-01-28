import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { SoftwareApplicationSchema, Breadcrumbs, FAQSchema } from "@/components/seo";

const BASE_URL = "https://protocol21blackjack.com";

export const metadata: Metadata = {
  title: "Download Protocol 21 - Free Card Counting App for iOS & Android",
  description: "Download Protocol 21 free for iOS and Android. The #1 blackjack card counting trainer with Hi-Lo, KO, Omega II systems, true count drills, and casino simulation.",
  alternates: {
    canonical: `${BASE_URL}/download`,
  },
  openGraph: {
    title: "Download Protocol 21 - Free Card Counting App",
    description: "The #1 blackjack card counting trainer. Free for iOS and Android.",
    url: `${BASE_URL}/download`,
    type: "website",
    images: [
      {
        url: `${BASE_URL}/images/protocol-21-hero1.webp`,
        width: 1200,
        height: 630,
        alt: "Download Protocol 21 App",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Download Protocol 21 - Free Card Counting App",
    description: "The #1 blackjack card counting trainer for iOS & Android.",
    images: [`${BASE_URL}/images/protocol-21-hero1.webp`],
  },
};

const features = [
  {
    title: "6 Counting Systems",
    description: "Hi-Lo, KO, Omega II, Zen Count, Red 7, and Wong Halves",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
  },
  {
    title: "True Count Drills",
    description: "Master the mental math with instant feedback",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: "Speed Training",
    description: "Practice at casino speeds and beyond",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    title: "Deck Estimation",
    description: "Train visual accuracy for true count conversion",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
  },
  {
    title: "Casino Simulation",
    description: "Background noise, distractions, and pressure",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.414a5 5 0 001.414 1.414m2.828-9.9a9 9 0 0112.728 0" />
      </svg>
    ),
  },
  {
    title: "Progress Tracking",
    description: "Track accuracy and speed over time",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
];

const faqs = [
  {
    question: "Is Protocol 21 really free?",
    answer: "Yes! Protocol 21 is free to download with core features including Hi-Lo training, basic drills, and shoe simulation. Pro features like advanced systems (Omega II, Wong Halves) and detailed analytics require a subscription.",
  },
  {
    question: "Which platforms does Protocol 21 support?",
    answer: "Protocol 21 is available for iOS (iPhone and iPad) and Android devices. We're also working on a web version for desktop practice.",
  },
  {
    question: "Can I learn card counting from scratch with this app?",
    answer: "Absolutely. Protocol 21 includes tutorials for beginners starting with Hi-Lo, the most popular and accessible counting system. Our progressive drill system takes you from basics to casino-ready.",
  },
  {
    question: "Is card counting legal?",
    answer: "Yes, card counting is completely legal. It's a mental skill that uses probability and memory. However, casinos are private businesses and may ask skilled counters to leave. Protocol 21 is a training tool for educational purposes.",
  },
  {
    question: "How long does it take to learn card counting?",
    answer: "With consistent practice using Protocol 21, most users develop basic Hi-Lo proficiency in 2-4 weeks. Casino-ready speed and accuracy typically takes 2-3 months of daily practice.",
  },
];

export default function DownloadPage() {
  return (
    <main className="min-h-screen">
      <SoftwareApplicationSchema platform="iOS" />
      <SoftwareApplicationSchema platform="Android" />
      <FAQSchema items={faqs} />

      <section className="hero py-16 md:py-24">
        <div className="container">
          <Breadcrumbs
            items={[{ name: "Download", url: "/download" }]}
            className="mb-8"
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-primary text-sm font-semibold tracking-wide">Free Download</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                <span className="text-gradient-gold">Download Protocol 21</span>
              </h1>

              <p className="text-xl text-text-secondary leading-relaxed mb-8">
                The most advanced blackjack card counting trainer for iOS and Android.
                Train like a pro. Play with an edge.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <a
                  href="https://apps.apple.com/app/protocol-21"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary text-lg px-8 py-4 inline-flex items-center justify-center"
                >
                  <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  Download for iOS
                </a>
                <a
                  href="https://play.google.com/store/apps/details?id=com.protocol21"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline text-lg px-8 py-4 inline-flex items-center justify-center"
                >
                  <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.523 2.047a.5.5 0 0 0-.78.203l-1.617 4.366a12.5 12.5 0 0 0-6.252 0L7.257 2.25a.5.5 0 0 0-.78-.203C4.602 3.793 3.262 6.16 3.009 8.88A12.5 12.5 0 0 0 2 13.5v.5c0 4.418 4.477 8 10 8s10-3.582 10-8v-.5a12.5 12.5 0 0 0-1.009-4.62c-.253-2.72-1.593-5.087-3.468-6.833zM8 15a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm8 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>
                  </svg>
                  Get for Android
                </a>
              </div>

              <p className="text-text-muted text-sm">
                Requires iOS 15+ or Android 10+. Free with optional Pro upgrade.
              </p>
            </div>

            <div className="relative w-full h-80 md:h-[500px] rounded-xl overflow-hidden">
              <Image
                src="/images/protocol-21-hero1.webp"
                alt="Protocol 21 blackjack card counting app"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 600px"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="section bg-surface">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              <span className="text-gradient">Everything You Need to Win</span>
            </h2>
            <p className="section-subtitle">
              Protocol 21 isn&apos;t just another blackjack game. It&apos;s a complete training system
              designed to build the skills you need for real advantage play.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="card">
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 text-primary">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-text-secondary text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* App Screenshots */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">See It In Action</h2>
            <p className="section-subtitle">
              Casino-grade training with professional-level feedback and analytics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative h-64 md:h-80 rounded-xl overflow-hidden">
              <Image
                src="/images/protocol-21-card-shoe.webp"
                alt="Protocol 21 card shoe simulation"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 400px"
              />
            </div>
            <div className="relative h-64 md:h-80 rounded-xl overflow-hidden">
              <Image
                src="/images/protocol-21-true-count.webp"
                alt="True count training in Protocol 21"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 400px"
              />
            </div>
            <div className="relative h-64 md:h-80 rounded-xl overflow-hidden">
              <Image
                src="/images/Skill-increased-blackjack-counting-cards.webp"
                alt="Skill progression in Protocol 21"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 400px"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section bg-surface">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="section-subtitle">
              Common questions about Protocol 21 and card counting.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <details key={index} className="card group">
                  <summary className="flex justify-between items-center cursor-pointer list-none">
                    <h3 className="text-lg font-semibold pr-4">{faq.question}</h3>
                    <svg className="w-5 h-5 text-text-muted group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <p className="text-text-secondary mt-4 leading-relaxed">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section">
        <div className="container">
          <div className="card text-center py-12 md:py-16 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Your Edge Starts Now
              </h2>
              <p className="text-text-secondary max-w-lg mx-auto mb-8 leading-relaxed">
                Stop gambling. Start playing with a mathematical advantage.
                Download Protocol 21 free today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://apps.apple.com/app/protocol-21"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary px-8"
                >
                  Download for iOS
                </a>
                <a
                  href="https://play.google.com/store/apps/details?id=com.protocol21"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline px-8"
                >
                  Get for Android
                </a>
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
