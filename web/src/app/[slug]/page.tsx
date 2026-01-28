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
    const paragraphs = content.split("\n\n");
    return paragraphs.map((paragraph, index) => {
      if (paragraph.startsWith("## ")) {
        return (
          <h2 key={index} className="text-2xl font-bold mt-8 mb-4">
            {paragraph.replace("## ", "")}
          </h2>
        );
      }
      if (paragraph.startsWith("- **")) {
        const items = paragraph.split("\n");
        return (
          <ul key={index} className="list-disc list-inside space-y-2 my-4">
            {items.map((item, i) => {
              const match = item.match(/- \*\*(.+?):\*\* (.+)/);
              if (match) {
                return (
                  <li key={i} className="text-gray-300">
                    <strong className="text-white">{match[1]}:</strong> {match[2]}
                  </li>
                );
              }
              return <li key={i} className="text-gray-300">{item.replace("- ", "")}</li>;
            })}
          </ul>
        );
      }
      if (paragraph.startsWith("- ")) {
        const items = paragraph.split("\n");
        return (
          <ul key={index} className="list-disc list-inside space-y-2 my-4">
            {items.map((item, i) => (
              <li key={i} className="text-gray-300">{item.replace("- ", "")}</li>
            ))}
          </ul>
        );
      }
      return (
        <p key={index} className="text-gray-300 leading-relaxed my-4">
          {paragraph}
        </p>
      );
    });
  };

  return (
    <main className="min-h-screen bg-background">
      <article className="container py-16 max-w-3xl">
        <Link href="/blog" className="text-primary hover:text-primary-light mb-8 inline-block">
          &larr; Back to Blog
        </Link>

        <div className="flex flex-wrap items-center gap-4 mb-6 text-sm">
          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">
            {post.category}
          </span>
          <span className="text-gray-500">{post.date}</span>
          <span className="text-gray-500">{post.readTime}</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold mb-6">{post.title}</h1>
        <p className="text-xl text-gray-400 mb-8">{post.description}</p>

        <div className="border-t border-white/10 pt-8">
          {renderContent(post.content)}
        </div>

        <div className="mt-12 p-6 rounded-xl bg-surface border border-white/5">
          <h3 className="text-xl font-bold mb-2">Ready to Practice?</h3>
          <p className="text-gray-400 mb-4">
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
      </article>
    </main>
  );
}
