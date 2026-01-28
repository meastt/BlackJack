import type { Metadata } from "next";
import Link from "next/link";
import blogPosts from "@/data/blog-posts.json";

export const metadata: Metadata = {
  title: "Blog | Protocol 21 - Blackjack Card Counting Tips & Strategies",
  description: "Expert blackjack card counting tips, strategies, and guides. Learn Hi-Lo, true count calculations, and advanced techniques from the Protocol 21 team.",
};

export default function BlogIndex() {
  return (
    <main className="min-h-screen">
      <div className="container py-16 md:py-24">
        <Link href="/" className="inline-flex items-center text-primary hover:text-primary-light mb-8 transition-colors">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
          </svg>
          Back to Home
        </Link>

        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">Card Counting Blog</span>
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl">
            Strategies, tips, and training guides from the Protocol 21 team. Master the edge.
          </p>
        </div>

        <div className="grid gap-6">
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/${post.slug}`}
              className="card group"
            >
              <div className="flex flex-wrap items-center gap-4 mb-4 text-sm">
                <span className="badge badge-beginner">
                  {post.category}
                </span>
                <span className="text-text-muted">{post.date}</span>
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
