import Link from "next/link";
import Image from "next/image";
import systems from "@/data/systems.json";
import drills from "@/data/drills.json";
import { FAQSchema, SoftwareApplicationSchema } from "@/components/seo";

const faqs = [
  {
    question: "What is card counting and is it legal?",
    answer: "Card counting is a legal blackjack strategy that involves tracking the ratio of high to low cards remaining in the deck. It's not cheating—it's using your brain to gain a mathematical edge. While legal, casinos may ask skilled counters to leave as they're private businesses.",
  },
  {
    question: "Which card counting system should I learn first?",
    answer: "We recommend starting with the Hi-Lo system. It's the most widely used, well-documented, and offers an excellent balance of simplicity and effectiveness. Once you've mastered Hi-Lo, you can explore more advanced systems like Omega II or Wong Halves.",
  },
  {
    question: "How long does it take to learn card counting?",
    answer: "With consistent daily practice using Protocol 21, most users develop basic Hi-Lo proficiency in 2-4 weeks. Achieving casino-ready speed and accuracy (counting at 1+ cards per second with 99% accuracy) typically takes 2-3 months.",
  },
  {
    question: "Is Protocol 21 really free?",
    answer: "Yes! Protocol 21 is free to download with core features including Hi-Lo training, basic drills, and shoe simulation. Pro features like advanced systems and detailed analytics are available with an optional subscription.",
  },
  {
    question: "What's the difference between running count and true count?",
    answer: "Running count is your cumulative total of high/low cards seen. True count normalizes this by dividing by decks remaining (Running Count ÷ Decks Remaining). True count is essential for accurate betting in multi-deck games.",
  },
  {
    question: "Can I practice card counting on my phone?",
    answer: "Absolutely! Protocol 21 is available for both iOS and Android. Mobile practice lets you train during commutes, breaks, or whenever you have a few minutes. Consistent daily practice is key to building automatic counting skills.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen">
      <FAQSchema items={faqs} />
      <SoftwareApplicationSchema platform="iOS" />
      <SoftwareApplicationSchema platform="Android" />

      {/* Hero Section */}
      <section className="hero">
        <div className="container text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-primary text-sm font-semibold tracking-wide">Early Access Now Available</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight" style={{ marginBottom: '2.5rem' }}>
            <span className="text-gradient-gold">Master the Count.</span>
            <br />
            <span className="text-white/90">Beat the House.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-text-secondary max-w-2xl leading-relaxed text-center" style={{ margin: '0 auto 3rem auto' }}>
            Protocol 21 is the only card counting trainer built for serious advantage players.
            Casino-grade drills. Six proven systems. Your edge starts here.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/download/ios" className="btn btn-primary text-lg px-8 py-4">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              Download for iOS
            </Link>
            <Link href="/download/android" className="btn btn-outline text-lg px-8 py-4">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.523 2.047a.5.5 0 0 0-.78.203l-1.617 4.366a12.5 12.5 0 0 0-6.252 0L7.257 2.25a.5.5 0 0 0-.78-.203C4.602 3.793 3.262 6.16 3.009 8.88A12.5 12.5 0 0 0 2 13.5v.5c0 4.418 4.477 8 10 8s10-3.582 10-8v-.5a12.5 12.5 0 0 0-1.009-4.62c-.253-2.72-1.593-5.087-3.468-6.833zM8 15a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm8 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>
              </svg>
              Get for Android
            </Link>
          </div>

          <div className="flex justify-center w-full max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl border border-white/10 mt-12">
            <Image
              src="/protocol-21-hero1.webp"
              alt="Protocol 21 App Interface"
              width={896}
              height={504}
              className="w-full h-auto"
              priority
            />
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <div className="stats-strip">
        <div className="container">
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            <div className="stat-item">
              <div className="stat-value">99.5%</div>
              <div className="stat-label">Accuracy Goal</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">6+</div>
              <div className="stat-label">Counting Systems</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">PRO</div>
              <div className="stat-label">Casino Simulator</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">FREE</div>
              <div className="stat-label">To Download</div>
            </div>
          </div>
        </div>
      </div>

      {/* Systems Grid */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              <span className="text-gradient">Supported Systems</span>
            </h2>
            <div className="flex justify-center w-full max-w-4xl mx-auto mb-12 rounded-xl overflow-hidden">
              <Image
                src="/protocol-21-card-shoe.webp"
                alt="Blackjack Card Shoe"
                width={896}
                height={384}
                className="w-full h-auto max-h-96 object-contain"
              />
            </div>
            <p className="section-subtitle mt-8">
              Don&apos;t just learn to count. Master the specific nuances of your chosen system with dedicated algorithms and real-time feedback.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {systems.map((system) => (
              <Link
                href={`/systems/${system.slug}`}
                key={system.id}
                className="card group"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className={`badge ${
                    system.difficulty_level === 'Beginner' ? 'badge-beginner' :
                    system.difficulty_level === 'Intermediate' ? 'badge-intermediate' :
                    'badge-advanced'
                  }`}>
                    {system.difficulty_level}
                  </span>
                  <span className="text-xs text-text-muted font-mono">{system.count_type}</span>
                </div>

                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                  {system.system_name}
                </h3>

                <p className="text-text-secondary text-sm mb-6 leading-relaxed">
                  {system.seo_desc}
                </p>

                <div className="flex items-center text-primary text-sm font-semibold">
                  Start Training
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Drills Section */}
      <section className="section bg-surface">
        <div className="container">
          <div className="section-header">
            <div className="flex justify-center w-full max-w-4xl mx-auto mb-12 rounded-xl overflow-hidden">
              <Image
                src="/protocol-21-true-count.webp"
                alt="True Count Training"
                width={896}
                height={384}
                className="w-full h-auto max-h-96 object-contain"
              />
            </div>
            <h2 className="section-title">Advanced Drills</h2>
            <p className="section-subtitle">
              Purpose-built exercises that target your weakest skills and transform them into strengths.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {drills.map((drill) => (
              <Link href={`/drills/${drill.slug}`} key={drill.slug} className="card group">
                <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>

                <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">{drill.drill_name}</h3>

                <p className="text-text-secondary text-sm mb-4">
                  Target: <span className="text-accent font-medium">{drill.target_skill}</span>
                </p>

                <p className="text-sm text-text-muted italic mb-4">
                  &ldquo;{drill.pain_point}&rdquo;
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

          <div className="text-center mt-8">
            <Link href="/drills" className="btn btn-outline">
              View All Practice Drills
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section">
        <div className="container">
          <div className="card text-center py-12 md:py-16 relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />

            <div className="relative z-10">
              <div className="flex justify-center w-full max-w-2xl mx-auto mb-12 rounded-xl overflow-hidden shadow-lg border border-white/5">
                <Image
                  src="/Skill-increased-blackjack-counting-cards.webp"
                  alt="Increase Your Blackjack Skills"
                  width={672}
                  height={384}
                  className="w-full h-auto max-h-96 object-cover"
                />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold" style={{ marginBottom: '1.5rem' }}>
                Ready to Get Your Edge?
              </h2>
              <p className="text-text-secondary max-w-lg leading-relaxed text-center" style={{ margin: '0 auto 2.5rem auto' }}>
                Join thousands of advantage players who trust Protocol 21 for their training.
                Start your journey to consistent profits today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/download" className="btn btn-primary px-8">
                  Download Now — It&apos;s Free
                </Link>
                <Link href="/blog" className="btn btn-outline px-8">
                  Read Our Guides
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Built for Serious Players Section */}
      <section className="section bg-surface">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              <span className="text-gradient-gold">Built for Serious Players</span>
            </h2>
            <p className="section-subtitle">
              Protocol 21 isn&apos;t another blackjack game. It&apos;s a professional-grade training system
              designed by advantage players, for advantage players.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <ul className="space-y-4 mb-8">
              <li className="flex items-center justify-center gap-3">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-text-secondary">Casino-accurate dealing speeds</span>
              </li>
              <li className="flex items-center justify-center gap-3">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-text-secondary">Background noise simulation</span>
              </li>
              <li className="flex items-center justify-center gap-3">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-text-secondary">Detailed accuracy analytics</span>
              </li>
            </ul>
            <div className="text-center">
              <Link href="/download" className="btn btn-primary">
                Get Protocol 21 Free
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              <span className="text-gradient">Frequently Asked Questions</span>
            </h2>
            <p className="section-subtitle">
              Common questions about card counting and Protocol 21.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <details key={index} className="card group">
                  <summary className="flex justify-between items-center cursor-pointer list-none">
                    <h3 className="text-lg font-semibold pr-4">{faq.question}</h3>
                    <svg className="w-5 h-5 text-text-muted group-open:rotate-180 transition-transform flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <p className="text-text-secondary mt-4 leading-relaxed">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>

            <div className="text-center mt-8">
              <p className="text-text-muted mb-4">Have more questions?</p>
              <Link href="/blog" className="text-primary hover:underline">
                Read our comprehensive guides
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-left">
            <div>
              <h4 className="font-bold mb-4 text-white">Protocol 21</h4>
              <p className="text-text-muted text-sm">
                The best blackjack card counting trainer for iOS and Android.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-white">Card Counting Systems</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/systems/hi-lo-card-counting-app" className="text-text-muted hover:text-primary">Hi-Lo System</Link></li>
                <li><Link href="/systems/ko-card-counting-app" className="text-text-muted hover:text-primary">KO System</Link></li>
                <li><Link href="/systems/omega-ii-card-counting-app" className="text-text-muted hover:text-primary">Omega II</Link></li>
                <li><Link href="/systems" className="text-primary hover:underline">View All Systems</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-white">Practice Drills</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/drills/blackjack-true-count-practice" className="text-text-muted hover:text-primary">True Count</Link></li>
                <li><Link href="/drills/deck-estimation-drills" className="text-text-muted hover:text-primary">Deck Estimation</Link></li>
                <li><Link href="/drills/card-counting-speed-drills" className="text-text-muted hover:text-primary">Speed Counting</Link></li>
                <li><Link href="/drills" className="text-primary hover:underline">View All Drills</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-white">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/blog" className="text-text-muted hover:text-primary">Blog</Link></li>
                <li><Link href="/download" className="text-text-muted hover:text-primary">Download App</Link></li>
                <li><Link href="/privacy" className="text-text-muted hover:text-primary">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-text-muted hover:text-primary">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-surface-border pt-8 text-center">
            <p className="footer-brand mb-2">
              &copy; {new Date().getFullYear()} Protocol 21. All rights reserved.
            </p>
            <p className="footer-brand">
              Built by fellow degens in the desert at{" "}
              <a href="https://techridgeseo.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                TechRidgeSEO
              </a>
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
