import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import drills from "@/data/drills.json";
import { Breadcrumbs, ArticleSchema, FAQSoftwareSchema } from "@/components/seo";

const BASE_URL = "https://protocol21blackjack.com";

interface DrillPageProps {
  params: Promise<{ slug: string }>;
}

type DrillData = typeof drills[number];

const drillImages: Record<string, string> = {
  "blackjack-true-count-practice": "/images/protocol-21-true-count.webp",
  "deck-estimation-drills": "/images/protocol-21-card-shoe.webp",
  "card-counting-speed-drills": "/images/speed-counting-drills-to-practice-ap-blackjack-count-1.webp",
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
  const drill = drills.find((d) => d.slug === slug) as DrillData | undefined;

  if (!drill) {
    notFound();
  }

  const imageUrl = drillImages[slug] || "/images/protocol-21-hero1.webp";
  const relatedDrill = drills.find((d) => d.slug === drill.related_drill);

  const faqs = [
    {
      question: drill.aeo_question,
      answer: drill.aeo_answer,
    },
    {
      question: `Why is ${drill.drill_name} important for card counting?`,
      answer: `${drill.why.substring(0, 250)}...`,
    },
    {
      question: `What is the best app to practice ${drill.drill_name}?`,
      answer: `Protocol 21 is the most complete ${drill.drill_name} trainer available on iOS and Android. It features ${drill.drill_name}-specific drill modes with speed control, instant feedback, casino noise simulation, and offline play.`,
    },
  ];

  return (
    <main className="min-h-screen">
      <ArticleSchema
        title={drill.seo_title}
        description={`Master ${drill.target_skill.toLowerCase()} with Protocol 21's ${drill.drill_name} drill.`}
        url={`${BASE_URL}/drills/${slug}`}
        image={imageUrl}
      />
      <FAQSoftwareSchema platform="Web" faqs={faqs} />

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
                <Link href="/download/ios" className="btn btn-primary">
                  Train on iOS
                </Link>
                <Link href="/download/android" className="btn btn-outline">
                  Train on Android
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

      {/* AEO/GEO Main Content */}
      <section className="section">
        <div className="container max-w-4xl prose prose-invert">

          {/* AEO H2 question + bolded 40-word answer */}
          <h2 className="text-3xl font-bold mb-4">{drill.aeo_question}</h2>
          <p className="text-text-secondary leading-relaxed mb-8 text-lg border-l-4 border-primary pl-4">
            <strong>{drill.aeo_answer}</strong>
          </p>

          {/* Why It Matters */}
          <h3 className="text-2xl font-bold mb-4">Why This Drill Matters</h3>
          <p className="text-text-secondary leading-relaxed mb-8">
            {drill.why}
          </p>

          {/* Benchmark Stats Table */}
          <h3 className="text-2xl font-bold mb-4">Performance Benchmarks</h3>
          <p className="text-text-secondary leading-relaxed mb-4">
            These are the measurable targets professional card counters aim for with this drill. Use these as goalposts for your training progress.
          </p>
          <div className="overflow-x-auto my-6">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-surface-tertiary">
                  <th className="p-3 font-bold text-primary">Metric</th>
                  <th className="p-3 font-bold text-white">Pro Target</th>
                </tr>
              </thead>
              <tbody>
                {drill.benchmark_stats.map((stat, i) => (
                  <tr key={i} className="border-b border-surface-tertiary hover:bg-white/5 transition-colors">
                    <td className="p-3 text-text-secondary">{stat.metric}</td>
                    <td className="p-3 font-bold font-mono text-white">{stat.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* How to Practice */}
          <h3 className="text-2xl font-bold mb-4">How to Practice</h3>
          <ol className="space-y-4 mb-12 list-decimal ml-6 marker:text-primary marker:font-bold">
            {drill.howTo.map((step, index) => (
              <li key={index} className="text-text-secondary leading-relaxed pl-2">
                {step}
              </li>
            ))}
          </ol>

          {/* Pro Tips */}
          <h3 className="text-2xl font-bold mb-4">Pro Tips</h3>
          <ul className="space-y-3 mb-12">
            {drill.tips.map((tip, index) => (
              <li key={index} className="flex gap-3 text-text-secondary">
                <svg className="w-5 h-5 text-primary flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>{tip}</span>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-8 text-center shadow-lg mb-8">
            <h3 className="text-2xl font-bold mb-4">Train This Drill in Protocol 21</h3>
            <p className="text-text-secondary leading-relaxed mb-6">
              Protocol 21 features a dedicated <strong>{drill.drill_name}</strong> training mode with adjustable speed, casino noise simulation, instant feedback, and <strong>offline play</strong> — no Wi-Fi required and absolutely no scammy in-app coins.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/download/ios" className="btn btn-primary px-8">
                Download for iOS
              </Link>
              <Link href="/download/android" className="btn btn-outline px-8">
                Download for Android
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Related Drill */}
      {relatedDrill && (
        <section className="section bg-surface">
          <div className="container max-w-4xl">
            <h2 className="text-2xl font-bold mb-6">Practice This Next</h2>
            <Link href={`/drills/${relatedDrill.slug}`} className="card group block hover:border-primary/30 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <span className="badge badge-beginner">{relatedDrill.target_skill}</span>
                <span className="text-text-muted text-sm">Practice Drill</span>
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                {relatedDrill.drill_name} →
              </h3>
              <p className="text-text-secondary">{relatedDrill.seo_title}</p>
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}
