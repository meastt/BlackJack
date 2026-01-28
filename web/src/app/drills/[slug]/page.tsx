import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import drills from "@/data/drills.json";
import blogPosts from "@/data/blog-posts.json";
import { Breadcrumbs, ArticleSchema } from "@/components/seo";

const BASE_URL = "https://protocol21blackjack.com";

interface DrillPageProps {
  params: Promise<{ slug: string }>;
}

const drillImages: Record<string, string> = {
  "blackjack-true-count-practice": "/images/protocol-21-true-count.webp",
  "deck-estimation-drills": "/images/protocol-21-card-shoe.webp",
  "card-counting-speed-drills": "/images/speed-counting-drills-to-practice-ap-blackjack-count-1.webp",
};

const drillContent: Record<string, { intro: string; why: string; howTo: string[]; tips: string[] }> = {
  "blackjack-true-count-practice": {
    intro: "The true count is the key to profitable betting. A running count of +6 means very different things in a 6-deck shoe versus a 2-deck game. The true count normalizes your running count by accounting for the number of decks remaining, giving you the actual edge.",
    why: "Without accurate true count conversion, you'll over-bet when you shouldn't and under-bet when you have the edge. This single skill is responsible for more lost EV than any other mistake in card counting.",
    howTo: [
      "Start with easy divisions: Running Count ÷ Decks Remaining = True Count",
      "Practice estimating remaining decks by looking at the discard tray",
      "Round down for safety (a TC of 2.7 becomes +2)",
      "Use Protocol 21's dedicated True Count drill mode to get instant feedback",
    ],
    tips: [
      "Memorize common divisions: +4/2=+2, +6/3=+2, +8/4=+2",
      "Practice with different deck counts (2, 6, 8 deck shoes)",
      "Time yourself - aim for under 2 seconds per calculation",
    ],
  },
  "deck-estimation-drills": {
    intro: "True count accuracy depends entirely on knowing how many decks remain in the shoe. If you estimate 3 decks remaining when there are actually 4, your betting decisions will be off by 25%. Protocol 21 trains your visual estimation skills with realistic discard tray graphics.",
    why: "Casinos know that deck estimation is a weakness for most counters. They use deep penetration as a weapon, making accurate estimation even more critical. A counter who can't estimate decks is gambling, not playing with an edge.",
    howTo: [
      "Learn what one deck looks like in a discard tray",
      "Practice in half-deck increments (0.5, 1.0, 1.5, 2.0...)",
      "Account for card spread - loosely stacked cards look like more decks",
      "Use Protocol 21's Deck Estimation drill for calibration",
    ],
    tips: [
      "Watch the dealer's movements to track cards played",
      "Count rounds played as a backup estimation method",
      "Practice at home with a real discard tray setup",
    ],
  },
  "card-counting-speed-drills": {
    intro: "Casino dealers don't wait for you to count. In a busy pit, cards fly at 1-1.5 seconds each, with multiple hands on the table. If you can't keep up, you'll lose the count and your edge. Speed counting drills push your brain past its comfort zone.",
    why: "Speed is the difference between counting at home and counting in a casino. Most counters can count accurately at slow speeds, but accuracy drops dramatically under time pressure. Over-training at faster speeds makes real casino speeds feel easy.",
    howTo: [
      "Start at 50% speed until you hit 100% accuracy",
      "Gradually increase speed as accuracy improves",
      "Practice with pairs - learn to cancel cards instantly (K+5 = 0)",
      "Use Protocol 21's Speed Drill at 'Dealer' and 'Speed Demon' settings",
    ],
    tips: [
      "Don't vocalize the count - train visual recognition only",
      "Practice cancellation (opposite values cancel to zero)",
      "Train with casino background noise enabled",
    ],
  },
};

export async function generateStaticParams() {
  return drills.map((drill) => ({
    slug: drill.slug,
  }));
}

export async function generateMetadata({ params }: DrillPageProps): Promise<Metadata> {
  const { slug } = await params;
  const drill = drills.find((d) => d.slug === slug);

  if (!drill) {
    return { title: "Drill Not Found" };
  }

  const imageUrl = drillImages[slug] || "/images/protocol-21-hero1.webp";

  return {
    title: `${drill.seo_title} | Free Practice`,
    description: `Master ${drill.target_skill.toLowerCase()} with Protocol 21's ${drill.drill_name} drill. Overcome the challenge of ${drill.pain_point}. Free for iOS and Android.`,
    alternates: {
      canonical: `${BASE_URL}/drills/${slug}`,
    },
    openGraph: {
      title: drill.seo_title,
      description: `Master ${drill.target_skill.toLowerCase()} with Protocol 21. Overcome: ${drill.pain_point}.`,
      url: `${BASE_URL}/drills/${slug}`,
      type: "article",
      images: [
        {
          url: `${BASE_URL}${imageUrl}`,
          width: 1200,
          height: 630,
          alt: drill.drill_name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: drill.seo_title,
      description: `Master ${drill.target_skill.toLowerCase()} with Protocol 21.`,
      images: [`${BASE_URL}${imageUrl}`],
    },
  };
}

export default async function DrillPage({ params }: DrillPageProps) {
  const { slug } = await params;
  const drill = drills.find((d) => d.slug === slug);

  if (!drill) {
    notFound();
  }

  const imageUrl = drillImages[slug] || "/images/protocol-21-hero1.webp";
  const content = drillContent[slug];

  // Find related blog post
  const relatedPost = blogPosts.find((p) => p.slug === slug);

  return (
    <main className="min-h-screen">
      <ArticleSchema
        title={drill.seo_title}
        description={`Master ${drill.target_skill.toLowerCase()} with Protocol 21's ${drill.drill_name} drill.`}
        url={`${BASE_URL}/drills/${slug}`}
        image={imageUrl}
      />

      <section className="hero py-16 md:py-24">
        <div className="container">
          <Breadcrumbs
            items={[
              { name: "Practice Drills", url: "/drills" },
              { name: drill.drill_name, url: `/drills/${slug}` },
            ]}
            className="mb-8"
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="badge badge-beginner">
                  {drill.target_skill}
                </span>
                <span className="text-text-muted text-sm">Practice Drill</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="text-gradient-gold">{drill.drill_name}</span>
              </h1>

              <p className="text-xl text-text-secondary leading-relaxed mb-4">
                {drill.seo_title}
              </p>

              <p className="text-text-muted italic mb-8">
                The pain point: &ldquo;{drill.pain_point}&rdquo;
              </p>

              <div className="flex flex-wrap gap-4">
                <Link href="/download" className="btn btn-primary">
                  Start This Drill
                </Link>
                <Link href="/drills" className="btn btn-outline">
                  All Drills
                </Link>
              </div>
            </div>

            <div className="relative w-full h-64 md:h-96 rounded-xl overflow-hidden">
              <Image
                src={imageUrl}
                alt={drill.drill_name}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 600px"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      {content && (
        <section className="section">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div className="prose prose-invert">
                <h2 className="text-3xl font-bold mb-6 text-gradient">
                  What is {drill.drill_name}?
                </h2>
                <p className="text-text-secondary text-lg leading-relaxed mb-12">
                  {content.intro}
                </p>

                <h2 className="text-3xl font-bold mb-6 text-gradient">
                  Why This Drill Matters
                </h2>
                <p className="text-text-secondary text-lg leading-relaxed mb-12">
                  {content.why}
                </p>

                <h2 className="text-3xl font-bold mb-6 text-gradient">
                  How to Practice
                </h2>
                <ol className="space-y-4 mb-12">
                  {content.howTo.map((step, index) => (
                    <li key={index} className="flex gap-4 text-text-secondary">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center">
                        {index + 1}
                      </span>
                      <span className="pt-1">{step}</span>
                    </li>
                  ))}
                </ol>

                <h2 className="text-3xl font-bold mb-6 text-gradient">
                  Pro Tips
                </h2>
                <ul className="space-y-3 mb-12">
                  {content.tips.map((tip, index) => (
                    <li key={index} className="flex gap-3 text-text-secondary">
                      <svg className="w-5 h-5 text-accent flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Related Blog Post */}
      {relatedPost && (
        <section className="section bg-surface">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-6">Related Article</h2>
              <Link href={`/${relatedPost.slug}`} className="card group block">
                <div className="flex items-center gap-3 mb-4">
                  <span className="badge badge-beginner">{relatedPost.category}</span>
                  <span className="text-text-muted text-sm">{relatedPost.readTime}</span>
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                  {relatedPost.title}
                </h3>
                <p className="text-text-secondary">{relatedPost.description}</p>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="section">
        <div className="container">
          <div className="card text-center py-12 md:py-16 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Master {drill.drill_name}?
              </h2>
              <p className="text-text-secondary max-w-lg mx-auto mb-8 leading-relaxed">
                Download Protocol 21 and start practicing {drill.target_skill.toLowerCase()} with instant feedback.
                Free for iOS and Android.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/download" className="btn btn-primary px-8">
                  Download Protocol 21
                </Link>
                <Link href="/drills" className="btn btn-outline px-8">
                  View All Drills
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
