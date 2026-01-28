import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import blogPosts from "@/data/blog-posts.json";
import { Breadcrumbs } from "@/components/seo";

const BASE_URL = "https://protocol21blackjack.com";

export const metadata: Metadata = {
  title: "Card Counting Blog - Guides, Tips & Strategies",
  description: "Expert blackjack card counting guides, strategies, and tips. Learn Hi-Lo, KO, true count calculations, speed counting techniques, and advanced advantage play methods.",
  alternates: {
    canonical: `${BASE_URL}/blog`,
  },
  openGraph: {
    title: "Card Counting Blog - Protocol 21",
    description: "Expert blackjack card counting guides and strategies. Learn from the Protocol 21 team.",
    url: `${BASE_URL}/blog`,
    type: "website",
    images: [
      {
        url: `${BASE_URL}/images/best-guide-to-blackjack-card-couting-apps-FI.webp`,
        width: 1200,
        height: 630,
        alt: "Card Counting Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Card Counting Blog - Protocol 21",
    description: "Expert blackjack card counting guides and strategies.",
    images: [`${BASE_URL}/images/best-guide-to-blackjack-card-couting-apps-FI.webp`],
  },
};

// Get unique categories
const categories = [...new Set(blogPosts.map((post) => post.category))];

// Featured posts (long reads)
const featuredPosts = blogPosts.filter((post) => parseInt(post.readTime) >= 10);
const regularPosts = blogPosts.filter((post) => parseInt(post.readTime) < 10);

export default function BlogIndex() {
  return (
    <main className="min-h-screen">
      <section className="hero py-16 md:py-24">
        <div className="container">
          <Breadcrumbs
            items={[{ name: "Blog", url: "/blog" }]}
            className="mb-8"
          />

          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-gradient-gold">Card Counting Blog</span>
            </h1>
            <p className="text-xl text-text-secondary leading-relaxed mb-8">
              Expert guides, strategies, and training tips from the Protocol 21 team.
              Everything you need to master card counting and beat the house.
            </p>

            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <span key={category} className="badge badge-beginner">
                  {category}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="section bg-surface">
          <div className="container">
            <h2 className="text-2xl font-bold mb-8">Featured Guides</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredPosts.slice(0, 2).map((post) => (
                <Link
                  key={post.slug}
                  href={`/${post.slug}`}
                  className="card group relative overflow-hidden"
                >
                  <div className="relative h-48 -mx-6 -mt-6 mb-6">
                    <Image
                      src="/images/best-guide-to-blackjack-card-couting-apps-FI.webp"
                      alt={post.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 600px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent" />
                  </div>

                  <div className="flex flex-wrap items-center gap-3 mb-4 text-sm">
                    <span className="badge badge-beginner">{post.category}</span>
                    <span className="text-accent font-semibold">{post.readTime}</span>
                  </div>

                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>

                  <p className="text-text-secondary text-sm leading-relaxed">
                    {post.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Posts */}
      <section className="section">
        <div className="container">
          <h2 className="text-2xl font-bold mb-8">All Articles</h2>
          <div className="grid gap-6">
            {[...featuredPosts.slice(2), ...regularPosts].map((post) => (
              <Link
                key={post.slug}
                href={`/${post.slug}`}
                className="card group"
              >
                <div className="flex flex-wrap items-center gap-4 mb-4 text-sm">
                  <span className="badge badge-beginner">
                    {post.category}
                  </span>
                  <time dateTime={post.date} className="text-text-muted">{post.date}</time>
                  <span className="text-text-muted">{post.readTime}</span>
                </div>

                <h2 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                  {post.title}
                </h2>

                <p className="text-text-secondary mb-4 leading-relaxed">
                  {post.description}
                </p>

                <span className="text-primary font-semibold inline-flex items-center">
                  Read Article
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-surface">
        <div className="container">
          <div className="card text-center py-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Ready to Practice What You&apos;ve Learned?
              </h2>
              <p className="text-text-secondary max-w-lg mx-auto mb-6">
                Download Protocol 21 and start training with casino-grade drills.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/download" className="btn btn-primary px-8">
                  Download Protocol 21
                </Link>
                <Link href="/systems" className="btn btn-outline px-8">
                  View Counting Systems
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

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
