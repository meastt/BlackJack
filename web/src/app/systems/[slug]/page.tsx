import { notFound } from "next/navigation";
import systems from "@/data/systems.json";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { ArticleSchema, Breadcrumbs, FAQSoftwareSchema, HowToSchema } from "@/components/seo";

const BASE_URL = "https://protocol21blackjack.com";

interface SystemPageProps {
    params: Promise<{ slug: string }>;
}

type SystemData = typeof systems[number];

// Map systems to images
const systemImages: Record<string, string> = {
    "hi-lo-card-counting-app": "/images/protocol-21-card-shoe.webp",
    "ko-card-counting-app": "/images/protocol-21-hero1.webp",
    "omega-ii-card-counting-app": "/images/Skill-increased-blackjack-counting-cards.webp",
    "zen-count-blackjack-app": "/images/protocol-21-true-count.webp",
    "red-7-card-counting-app": "/images/protocol-21-card-shoe.webp",
    "wong-halves-counting-app": "/images/best-guide-to-blackjack-card-couting-apps-FI.webp",
};

export async function generateStaticParams() {
    return systems.map((system) => ({
        slug: system.slug,
    }));
}

export async function generateMetadata({ params }: SystemPageProps): Promise<Metadata> {
    const { slug } = await params;
    const system = systems.find((s) => s.slug === slug);
    if (!system) return { title: "System Not Found" };

    const imageUrl = systemImages[slug] || "/images/protocol-21-hero1.webp";

    return {
        title: system.seo_title,
        description: system.seo_desc,
        alternates: {
            canonical: `${BASE_URL}/systems/${slug}`,
        },
        openGraph: {
            title: system.seo_title,
            description: system.seo_desc,
            url: `${BASE_URL}/systems/${slug}`,
            type: "article",
            images: [
                {
                    url: `${BASE_URL}${imageUrl}`,
                    width: 1200,
                    height: 630,
                    alt: `${system.system_name} Card Counting System`,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: system.seo_title,
            description: system.seo_desc,
            images: [`${BASE_URL}${imageUrl}`],
        },
    };
}

function getDifficultyBadge(level: string) {
    if (level === 'Beginner') return 'badge-beginner';
    if (level === 'Intermediate') return 'badge-intermediate';
    return 'badge-advanced';
}

export default async function SystemPage({ params }: SystemPageProps) {
    const { slug } = await params;
    const system = systems.find((s) => s.slug === slug) as SystemData | undefined;

    if (!system) {
        notFound();
    }

    const imageUrl = systemImages[slug] || "/images/protocol-21-hero1.webp";

    // Find related systems (same difficulty or count type)
    const relatedSystems = systems.filter(
        (s) => s.slug !== slug && (s.difficulty_level === system.difficulty_level || s.count_type === system.count_type)
    ).slice(0, 3);

    const faqs = [
        {
            question: system.aeo_question,
            answer: system.aeo_answer,
        },
        {
            question: `Is the ${system.system_name} system hard to learn?`,
            answer: `The ${system.system_name} is rated ${system.difficulty_level} difficulty. ${system.pain_point.charAt(0).toUpperCase() + system.pain_point.slice(1)} is the most challenging part for most players, but this can be overcome with targeted drills in Protocol 21.`,
        },
        {
            question: `What is the best app to learn the ${system.system_name} counting system?`,
            answer: `Protocol 21 is specifically built to train the ${system.system_name} system with casino-grade drills, including speed training, noise simulation, and true count conversion practice. It is available free for iOS and Android.`,
        },
    ];

    return (
        <main className="min-h-screen">
            <ArticleSchema
                title={system.seo_title}
                description={system.seo_desc}
                url={`${BASE_URL}/systems/${slug}`}
                image={imageUrl}
            />
            <FAQSoftwareSchema platform="Web" faqs={faqs} />
            <HowToSchema
                name={`How to Master the ${system.system_name} Card Counting System`}
                description={`Learn the ${system.system_name} system with Protocol 21's proven 3-step training method.`}
                steps={[
                    {
                        name: "Value Recognition",
                        text: `Use the specific ${system.system_name} flashcard mode to memorize card values instantly. Practice until recognition is automatic.`,
                    },
                    {
                        name: "Slow Deal Practice",
                        text: "Practice keeping the running count at 50% speed until you achieve 100% accuracy over multiple shoes.",
                    },
                    {
                        name: "Casino Simulation",
                        text: "Turn on the noise, distraction, and full speed dealing to test your skills under real casino pressure.",
                    },
                ]}
                totalTime="PT720H"
            />

            <section className="hero py-16 md:py-24">
                <div className="container">
                    <Breadcrumbs
                        items={[
                            { name: "Card Counting Systems", url: "/systems" },
                            { name: system.system_name, url: `/systems/${slug}` },
                        ]}
                        className="mb-8"
                    />

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="flex flex-wrap gap-3 mb-6">
                                <span className={`badge ${getDifficultyBadge(system.difficulty_level)}`}>
                                    {system.difficulty_level}
                                </span>
                                <span className="px-3 py-1 bg-surface border border-surface-border rounded-full text-sm text-text-secondary">
                                    {system.count_type} Count
                                </span>
                            </div>

                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                                <span className="text-gradient-gold">{system.system_name}</span>
                            </h1>

                            <p className="text-xl text-text-secondary leading-relaxed mb-8">
                                {system.seo_desc}
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
                                alt={`${system.system_name} card counting system training`}
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
                    <h2 className="text-3xl font-bold mb-4">{system.aeo_question}</h2>
                    <p className="text-text-secondary leading-relaxed mb-8 text-lg border-l-4 border-primary pl-4">
                        <strong>{system.aeo_answer}</strong>
                    </p>

                    {/* Card Values Table */}
                    <h3 className="text-2xl font-bold mb-4">Card Values at a Glance</h3>
                    <div className="overflow-x-auto my-6">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-surface-tertiary">
                                    <th className="p-3 font-bold text-primary">Cards</th>
                                    <th className="p-3 font-bold text-white">Count Value</th>
                                    <th className="p-3 font-bold text-text-secondary">Category</th>
                                </tr>
                            </thead>
                            <tbody>
                                {system.card_values.map((row, i) => (
                                    <tr key={i} className="border-b border-surface-tertiary hover:bg-white/5 transition-colors">
                                        <td className="p-3 font-mono font-bold">{row.cards}</td>
                                        <td className={`p-3 font-bold text-lg ${row.value.startsWith('+') ? 'text-green-400' : row.value === '0' || row.value.startsWith('0') ? 'text-white' : 'text-red-400'}`}>{row.value}</td>
                                        <td className="p-3 text-sm text-text-secondary">{row.label}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Performance Stats Table */}
                    <h3 className="text-2xl font-bold mb-4">System Performance Metrics</h3>
                    <p className="text-text-secondary leading-relaxed mb-4">
                        These statistics define the mathematical capabilities of the {system.system_name} system. Higher is better for all three correlation metrics.
                    </p>
                    <div className="overflow-x-auto my-6">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-surface-tertiary">
                                    <th className="p-3 font-bold text-primary">Metric</th>
                                    <th className="p-3 font-bold text-white">Score</th>
                                </tr>
                            </thead>
                            <tbody>
                                {system.stats.map((stat, i) => (
                                    <tr key={i} className="border-b border-surface-tertiary hover:bg-white/5 transition-colors">
                                        <td className="p-3 text-text-secondary">{stat.label}</td>
                                        <td className="p-3 font-bold font-mono text-white">{stat.value}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* History */}
                    <h3 className="text-2xl font-bold mb-4">History & Origins</h3>
                    <p className="text-text-secondary leading-relaxed mb-8">
                        {system.history}
                    </p>

                    {/* vs Other Systems */}
                    <h3 className="text-2xl font-bold mb-4">{system.system_name} vs. Other Systems</h3>
                    <p className="text-text-secondary leading-relaxed mb-8">
                        {system.vs_other}
                    </p>

                    {/* Practice CTA */}
                    <div className="bg-primary/10 border border-primary/20 rounded-lg p-8 text-center shadow-lg mb-8">
                        <h3 className="text-2xl font-bold mb-4">Train {system.system_name} with Protocol 21</h3>
                        <p className="text-text-secondary leading-relaxed mb-6">
                            Protocol 21 features dedicated {system.system_name} drill modes, speed training, casino noise simulation, and offline play with no scammy in-app coins. It is the only app that supports all 6 major counting systems.
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

            {/* Related Systems */}
            {relatedSystems.length > 0 && (
                <section className="section bg-surface">
                    <div className="container">
                        <h2 className="text-2xl font-bold mb-8 text-center">Compare Other Systems</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {relatedSystems.map((related) => (
                                <Link
                                    href={`/systems/${related.slug}`}
                                    key={related.id}
                                    className="card group"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <span className={`badge ${getDifficultyBadge(related.difficulty_level)}`}>
                                            {related.difficulty_level}
                                        </span>
                                        <span className="text-xs text-text-muted font-mono">{related.count_type}</span>
                                    </div>
                                    <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                                        {related.system_name}
                                    </h3>
                                    <p className="text-text-secondary text-sm">{related.seo_desc}</p>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Related Links */}
            <section className="section">
                <div className="container max-w-4xl">
                    <h2 className="text-2xl font-bold mb-6">Further Reading</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        {system.related_links.map((link) => (
                            <Link key={link.href} href={link.href} className="border border-surface-tertiary rounded-lg p-5 hover:border-primary transition group">
                                <span className="font-bold group-hover:text-primary transition-colors">{link.label} →</span>
                            </Link>
                        ))}
                        <Link href="/systems" className="border border-surface-tertiary rounded-lg p-5 hover:border-primary transition group">
                            <span className="font-bold group-hover:text-primary transition-colors">Compare All 6 Systems →</span>
                        </Link>
                        <Link href="/true-count-calculator" className="border border-surface-tertiary rounded-lg p-5 hover:border-primary transition group">
                            <span className="font-bold group-hover:text-primary transition-colors">True Count Calculator Tool →</span>
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
