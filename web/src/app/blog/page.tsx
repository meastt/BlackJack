import type { Metadata } from "next";
import Link from "next/link";
import blogPosts from "@/data/blog-posts.json";

export const metadata: Metadata = {
  title: "Blog | Protocol 21 - Blackjack Card Counting Tips & Strategies",
  description: "Expert blackjack card counting tips, strategies, and guides. Learn Hi-Lo, true count calculations, and advanced techniques from the Protocol 21 team.",
};

export default function BlogIndex() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container py-16">
        <Link href="/" className="text-primary hover:text-primary-light mb-8 inline-block">
          &larr; Back to Home
        </Link>

        <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog</h1>
        <p className="text-gray-400 text-lg mb-12 max-w-2xl">
          Card counting strategies, blackjack tips, and training guides from the Protocol 21 team.
        </p>

        <div className="grid gap-8">
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/${post.slug}`}
              className="block p-8 rounded-xl bg-surface border border-white/5 hover:border-primary transition-all group"
            >
              <div className="flex flex-wrap items-center gap-4 mb-4 text-sm">
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">
                  {post.category}
                </span>
                <span className="text-gray-500">{post.date}</span>
                <span className="text-gray-500">{post.readTime}</span>
              </div>
              <h2 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                {post.title}
              </h2>
              <p className="text-gray-400 mb-4">
                {post.description}
              </p>
              <span className="text-primary font-semibold inline-flex items-center">
                Read Article <span className="ml-2 group-hover:translate-x-1 transition-transform">&rarr;</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
