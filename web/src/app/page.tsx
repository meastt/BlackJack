import Link from "next/link";
import Image from "next/image";
import systems from "@/data/systems.json";
import drills from "@/data/drills.json";

export default function Home() {
  return (
    <main className="min-h-screen">
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

          <div className="relative w-full max-w-4xl mx-auto aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/10">
             <Image
              src="/protocol-21-hero1.webp"
              alt="Protocol 21 App Interface"
              fill
              className="object-cover"
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
            <div className="relative w-full max-w-2xl mx-auto h-64 mb-8 rounded-xl overflow-hidden">
               <Image
                src="/protocol-21-card-shoe.webp"
                alt="Blackjack Card Shoe"
                fill
                className="object-contain"
              />
            </div>
            <p className="section-subtitle">
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
            <div className="relative w-full max-w-md mx-auto h-48 mb-6 rounded-xl overflow-hidden">
               <Image
                src="/protocol-21-true-count.webp"
                alt="True Count Training"
                fill
                className="object-contain"
              />
            </div>
            <h2 className="section-title">Advanced Drills</h2>
            <p className="section-subtitle">
              Purpose-built exercises that target your weakest skills and transform them into strengths.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {drills.map((drill) => (
              <div key={drill.slug} className="card">
                <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>

                <h3 className="text-lg font-bold mb-2">{drill.drill_name}</h3>

                <p className="text-text-secondary text-sm mb-4">
                  Target: <span className="text-accent font-medium">{drill.target_skill}</span>
                </p>

                <p className="text-sm text-text-muted italic">
                  &ldquo;{drill.pain_point}&rdquo;
                </p>
              </div>
            ))}
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
              <div className="relative w-full max-w-sm mx-auto h-64 mb-8 rounded-xl overflow-hidden shadow-lg border border-white/5">
                 <Image
                  src="/Skill-increased-blackjack-counting-cards.webp"
                  alt="Increase Your Blackjack Skills"
                  fill
                  className="object-cover"
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
                <Link href="/download/ios" className="btn btn-primary px-8">
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
