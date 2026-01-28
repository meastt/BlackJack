import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import blogPosts from "@/data/blog-posts.json";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return {
      title: "Post Not Found | Protocol 21",
    };
  }

  return {
    title: `${post.title} | Protocol 21`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  // Convert markdown-style content to JSX
  const renderContent = (content: string) => {
    const renderTextWithFormatting = (text: string) => {
      // Split by links first
      const parts = text.split(/(\[.*?\]\(.*?\))/g);
      return parts.map((part, i) => {
        const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
        if (linkMatch) {
          return (
            <Link key={i} href={linkMatch[2]} className="text-primary hover:underline">
              {linkMatch[1]}
            </Link>
          );
        }
        
        // Then handle bold
        const boldParts = part.split(/(\*\*.*?\*\*)/g);
        return boldParts.map((boldPart, j) => {
          const boldMatch = boldPart.match(/^\*\*(.*?)\*\*$/);
          if (boldMatch) {
            return <strong key={`${i}-${j}`} className="text-white">{boldMatch[1]}</strong>;
          }
          return boldPart;
        });
      });
    };

    const paragraphs = content.split("\n\n");
    return paragraphs.map((paragraph, index) => {
      if (paragraph.startsWith("## ")) {
        return (
          <h2 key={index} className="text-2xl font-bold mt-16 mb-6 text-gradient-gold">
            {paragraph.replace("## ", "")}
          </h2>
        );
      }
      if (paragraph.startsWith("- ")) {
        const items = paragraph.split("\n");
        return (
          <ul key={index} className="space-y-4 my-8 ml-6 list-disc marker:text-primary">
            {items.map((item, i) => {
              const cleanItem = item.replace(/^- /, "");
              return (
                <li key={i} className="text-body pl-2">
                  <span>{renderTextWithFormatting(cleanItem)}</span>
                </li>
              );
            })}
          </ul>
        );
      }
      return (
        <p key={index} className="text-body leading-loose my-6">
          {renderTextWithFormatting(paragraph)}
        </p>
      );
    });
  };

  return (
    <main className="min-h-screen">
      <article className="container py-16 md:py-24 prose-container">
        <Link href="/blog" className="inline-flex items-center text-primary hover:text-primary-light mb-12 transition-colors">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
          </svg>
          Back to Blog
        </Link>

        <div className="flex flex-wrap items-center gap-4 mb-8 text-sm">
          <span className="badge badge-beginner">
            {post.category}
          </span>
          <span className="text-text-muted">{post.date}</span>
          <span className="text-text-muted">{post.readTime}</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold mb-8">{post.title}</h1>
        <p className="text-xl text-text-secondary mb-12 leading-relaxed">{post.description}</p>

        <div className="border-t border-surface-border pt-12 space-y-relaxed">
          {renderContent(post.content)}
        </div>

        {/* CTA Card */}
        <div className="card mt-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-2">Ready to Practice?</h3>
            <p className="text-text-secondary mb-6">
              Download Protocol 21 and start mastering card counting with our casino-grade training drills.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/download/ios" className="btn btn-primary">
                Download on iOS
              </Link>
              <Link href="/download/android" className="btn btn-outline">
                Get for Android
              </Link>
            </div>
          </div>
        </div>
      </article>

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
