import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import systems from "@/data/systems.json";
import { Breadcrumbs, CourseSchema } from "@/components/seo";

const BASE_URL = "https://protocol21blackjack.com";

export const metadata: Metadata = {
  title: "Card Counting Systems - Learn Hi-Lo, KO, Omega II & More",
  description: "Master all major blackjack card counting systems with Protocol 21. Learn Hi-Lo, KO (Knock-Out), Omega II, Zen Count, Red 7, and Wong Halves from beginner to expert level.",
  alternates: {
    canonical: `${BASE_URL}/systems`,
  },
  openGraph: {
    title: "Card Counting Systems - Protocol 21 Blackjack Trainer",
    description: "Master all major blackjack card counting systems. From beginner-friendly Hi-Lo to expert Wong Halves.",
    url: `${BASE_URL}/systems`,
    type: "website",
    images: [
      {
        url: `${BASE_URL}/images/protocol-21-card-shoe.webp`,
        width: 1200,
        height: 630,
        alt: "Card Counting Systems",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Card Counting Systems - Protocol 21",
    description: "Master Hi-Lo, KO, Omega II, Zen Count, Red 7, and Wong Halves.",
    images: [`${BASE_URL}/images/protocol-21-card-shoe.webp`],
  },
};

const difficultyOrder = ["Beginner", "Intermediate", "Advanced", "Expert"];

export default function SystemsPage() {
  const sortedSystems = [...systems].sort(
    (a, b) => difficultyOrder.indexOf(a.difficulty_level) - difficultyOrder.indexOf(b.difficulty_level)
  );

  const beginnerSystems = sortedSystems.filter((s) => s.difficulty_level === "Beginner");
  const advancedSystems = sortedSystems.filter((s) => ["Intermediate", "Advanced", "Expert"].includes(s.difficulty_level));

  return (
    <main className="min-h-screen">
      <CourseSchema
        name="Complete Card Counting Mastery"
        description="Learn all major blackjack card counting systems from beginner to expert level with Protocol 21's comprehensive training program."
        url={`${BASE_URL}/systems`}
      />

      <section className="hero py-16 md:py-24">
        <div className="container">
          <Breadcrumbs
            items={[{ name: "Card Counting Systems", url: "/systems" }]}
            className="mb-8"
          />

          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-gradient-gold">Card Counting Systems</span>
            </h1>
            <p className="text-xl text-text-secondary leading-relaxed mb-8">
              From beginner-friendly balanced counts to expert-level fractional systems,
              Protocol 21 supports every major card counting method. Choose your path and start training.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/download" className="btn btn-primary">
                Download Protocol 21
              </Link>
              <Link href="/blog" className="btn btn-outline">
                Read Our Guides
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Image */}
      <div className="container pb-12">
        <div className="relative w-full h-64 md:h-80 rounded-xl overflow-hidden">
          <Image
            src="/images/protocol-21-card-shoe.webp"
            alt="Blackjack card shoe for card counting practice"
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 1200px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        </div>
      </div>

      {/* Beginner Systems */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              <span className="text-gradient">Beginner Systems</span>
            </h2>
            <p className="section-subtitle">
              Start your card counting journey with these proven, easy-to-learn systems.
              Perfect for new advantage players.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {beginnerSystems.map((system) => (
              <Link
                href={`/systems/${system.slug}`}
                key={system.id}
                className="card group"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="badge badge-beginner">
                    {system.difficulty_level}
                  </span>
                  <span className="text-xs text-text-muted font-mono">{system.count_type}</span>
                </div>

                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                  {system.system_name}
                </h3>

                <p className="text-text-secondary text-sm mb-4 leading-relaxed">
                  {system.seo_desc}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {system.tags.map((tag) => (
                    <span key={tag} className="text-xs px-2 py-1 bg-surface-light rounded text-text-muted">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center text-primary text-sm font-semibold mt-auto">
                  Learn {system.system_name}
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Advanced Systems */}
      <section className="section bg-surface">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              <span className="text-gradient">Advanced & Expert Systems</span>
            </h2>
            <p className="section-subtitle">
              Ready for a challenge? These Level 2 and Level 3 systems offer higher accuracy
              at the cost of increased complexity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {advancedSystems.map((system) => (
              <Link
                href={`/systems/${system.slug}`}
                key={system.id}
                className="card group"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className={`badge ${
                    system.difficulty_level === 'Intermediate' ? 'badge-intermediate' : 'badge-advanced'
                  }`}>
                    {system.difficulty_level}
                  </span>
                  <span className="text-xs text-text-muted font-mono">{system.count_type}</span>
                </div>

                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                  {system.system_name}
                </h3>

                <p className="text-text-secondary text-sm mb-4 leading-relaxed">
                  {system.seo_desc}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {system.tags.map((tag) => (
                    <span key={tag} className="text-xs px-2 py-1 bg-surface-light rounded text-text-muted">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center text-primary text-sm font-semibold mt-auto">
                  Master {system.system_name}
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">System Comparison</h2>
            <p className="section-subtitle">
              Not sure which system to learn? Compare the key features of each counting method.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-surface-border">
                  <th className="py-4 px-4 text-text-secondary font-semibold">System</th>
                  <th className="py-4 px-4 text-text-secondary font-semibold">Difficulty</th>
                  <th className="py-4 px-4 text-text-secondary font-semibold">Type</th>
                  <th className="py-4 px-4 text-text-secondary font-semibold">Best For</th>
                </tr>
              </thead>
              <tbody>
                {sortedSystems.map((system) => (
                  <tr key={system.id} className="border-b border-surface-border/50 hover:bg-surface/50 transition-colors">
                    <td className="py-4 px-4">
                      <Link href={`/systems/${system.slug}`} className="font-semibold text-primary hover:underline">
                        {system.system_name}
                      </Link>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`badge ${
                        system.difficulty_level === 'Beginner' ? 'badge-beginner' :
                        system.difficulty_level === 'Intermediate' ? 'badge-intermediate' : 'badge-advanced'
                      }`}>
                        {system.difficulty_level}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-text-secondary">{system.count_type}</td>
                    <td className="py-4 px-4 text-text-secondary text-sm">{system.tags[0]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-surface">
        <div className="container">
          <div className="card text-center py-12 md:py-16 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Start Counting?
              </h2>
              <p className="text-text-secondary max-w-lg mx-auto mb-8 leading-relaxed">
                Download Protocol 21 and practice any counting system with casino-grade drills.
                Available free for iOS and Android.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/download" className="btn btn-primary px-8">
                  Download Now — Free
                </Link>
                <Link href="/blog" className="btn btn-outline px-8">
                  Read the Guides
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
