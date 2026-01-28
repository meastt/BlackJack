import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you're looking for doesn't exist. Explore Protocol 21's card counting guides, systems, and drills.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="container text-center py-16">
        <div className="max-w-2xl mx-auto">
          {/* 404 Graphic */}
          <div className="mb-8">
            <span className="text-8xl md:text-9xl font-bold text-gradient-gold">404</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Looks Like You Busted
          </h1>

          <p className="text-text-secondary text-lg mb-8 leading-relaxed">
            The page you&apos;re looking for doesn&apos;t exist. But don&apos;t worry—unlike a bad hand,
            you can always get back in the game.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/" className="btn btn-primary px-8">
              Back to Home
            </Link>
            <Link href="/systems" className="btn btn-outline px-8">
              Browse Systems
            </Link>
          </div>

          {/* Helpful Links */}
          <div className="border-t border-surface-border pt-8">
            <h2 className="text-lg font-semibold mb-4">Looking for something specific?</h2>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/blog" className="text-primary hover:underline">
                Card Counting Blog
              </Link>
              <span className="text-text-muted">•</span>
              <Link href="/systems" className="text-primary hover:underline">
                Counting Systems
              </Link>
              <span className="text-text-muted">•</span>
              <Link href="/drills" className="text-primary hover:underline">
                Practice Drills
              </Link>
              <span className="text-text-muted">•</span>
              <Link href="/download" className="text-primary hover:underline">
                Download App
              </Link>
            </div>
          </div>

          {/* Popular Posts */}
          <div className="mt-12">
            <h2 className="text-lg font-semibold mb-6">Popular Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <Link href="/how-does-card-counting-work-in-blackjack" className="card group">
                <h3 className="font-semibold group-hover:text-primary transition-colors">
                  How Does Card Counting Work?
                </h3>
                <p className="text-text-muted text-sm mt-1">Learn the fundamentals</p>
              </Link>
              <Link href="/hi-lo-card-counting-system-complete-guide" className="card group">
                <h3 className="font-semibold group-hover:text-primary transition-colors">
                  Hi-Lo Complete Guide
                </h3>
                <p className="text-text-muted text-sm mt-1">Master the most popular system</p>
              </Link>
              <Link href="/best-card-counting-apps-for-practice" className="card group">
                <h3 className="font-semibold group-hover:text-primary transition-colors">
                  Best Card Counting Apps
                </h3>
                <p className="text-text-muted text-sm mt-1">Compare top trainers</p>
              </Link>
              <Link href="/ultimate-blackjack-card-counting-app-guide" className="card group">
                <h3 className="font-semibold group-hover:text-primary transition-colors">
                  Ultimate App Guide (2026)
                </h3>
                <p className="text-text-muted text-sm mt-1">25 min comprehensive guide</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
