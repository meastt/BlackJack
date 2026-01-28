import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import blogPosts from "@/data/blog-posts.json";
import { BlogPostingSchema, Breadcrumbs } from "@/components/seo";

const BASE_URL = "https://protocol21blackjack.com";

// Map slugs to featured images
const postImages: Record<string, string> = {
  "ultimate-blackjack-card-counting-app-guide": "/images/best-guide-to-blackjack-card-couting-apps-FI.webp",
  "best-card-counting-apps-for-practice": "/images/learn-to-count-cards-blackjack-best-app-2026.webp",
  "how-does-card-counting-work-in-blackjack": "/images/Skill-increased-blackjack-counting-cards.webp",
  "hi-lo-card-counting-system-complete-guide": "/images/protocol-21-card-shoe.webp",
  "blackjack-true-count-practice": "/images/protocol-21-true-count.webp",
};

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
      title: "Post Not Found",
    };
  }

  const imageUrl = postImages[slug] || "/images/protocol-21-hero1.webp";

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `${BASE_URL}/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.date,
      authors: [post.author],
      url: `${BASE_URL}/${slug}`,
      images: [
        {
          url: `${BASE_URL}${imageUrl}`,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [`${BASE_URL}${imageUrl}`],
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
      // Check for images
      const imageMatch = paragraph.match(/^!\[(.*?)\]\((.*?)\)$/);
      if (imageMatch) {
        return (
          <div key={index} className="relative w-full aspect-video rounded-xl overflow-hidden my-12 border border-surface-border">
            <Image 
              src={imageMatch[2]} 
              alt={imageMatch[1]} 
              fill 
              className="object-cover"
            />
          </div>
        );
      }

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

  const imageUrl = postImages[slug] || "/images/protocol-21-hero1.webp";

  return (
    <main className="min-h-screen">
      <BlogPostingSchema
        title={post.title}
        description={post.description}
        slug={slug}
        datePublished={post.date}
        author={post.author}
        image={imageUrl}
        readTime={post.readTime}
      />
      <article className="container py-16 md:py-24 prose-container">
        <Breadcrumbs
          items={[
            { name: "Blog", url: "/blog" },
            { name: post.title, url: `/${slug}` },
          ]}
          className="mb-8"
        />

        {/* Featured Image */}
        <div className="relative w-full h-64 md:h-96 rounded-xl overflow-hidden mb-8">
          <Image
            src={imageUrl}
            alt={post.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
          />
        </div>

        <div className="flex flex-wrap items-center gap-4 mb-8 text-sm">
          <span className="badge badge-beginner">
            {post.category}
          </span>
          <time dateTime={post.date} className="text-text-muted">{post.date}</time>
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
