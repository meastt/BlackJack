import { notFound } from "next/navigation";
import systems from "@/data/systems.json";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { ArticleSchema, Breadcrumbs, HowToSchema } from "@/components/seo";

const BASE_URL = "https://protocol21blackjack.com";

interface SystemPageProps {
    params: Promise<{ slug: string }>;
}

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

export default async function SystemPage({ params }: SystemPageProps) {
    const { slug } = await params;
    const system = systems.find((s) => s.slug === slug);

    if (!system) {
        notFound();
    }

    const imageUrl = systemImages[slug] || "/images/protocol-21-hero1.webp";

    // Find related systems (same difficulty or count type)
    const relatedSystems = systems.filter(
        (s) => s.slug !== slug && (s.difficulty_level === system.difficulty_level || s.count_type === system.count_type)
    ).slice(0, 3);

    return (
        <main className="min-h-screen">
            <ArticleSchema
                title={system.seo_title}
                description={system.seo_desc}
                url={`${BASE_URL}/systems/${slug}`}
                image={imageUrl}
            />
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
                                <span className={`badge ${
                                    system.difficulty_level === 'Beginner' ? 'badge-beginner' :
                                    system.difficulty_level === 'Intermediate' ? 'badge-intermediate' : 'badge-advanced'
                                }`}>
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
                                <Link href="/download" className="btn btn-primary">
                                    Start Training Now
                                </Link>
                                <Link href="/systems" className="btn btn-outline">
                                    Compare Systems
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

            {/* System Details */}
            <section className="section">
                <div className="container">
                    <div className="max-w-4xl mx-auto">
                        <article className="prose prose-invert max-w-none">
                            <h2 className="text-3xl font-bold mb-6 text-gradient">
                                Why Learn the {system.system_name}?
                            </h2>
                            <p className="text-text-secondary text-lg leading-relaxed mb-8">
                                Many players struggle with <strong className="text-white">{system.pain_point}</strong>. The {system.system_name} is specifically designed to address this by providing a structured approach to gaining an edge over the house.
                            </p>

                            {/* Features Card */}
                            <div className="card p-8 mb-12">
                                <h3 className="text-2xl font-bold mb-6">How Protocol 21 Helps You Master It</h3>
                                <p className="text-text-secondary mb-6">
                                    Unlike generic drill apps, Protocol 21 has a dedicated algorithm for {system.system_name}.
                                    We don&apos;t just flash cards; we simulate the exact counting conditions you&apos;ll face in a casino.
                                </p>
                                <ul className="space-y-4 mb-8">
                                    {system.tags.map((tag, i) => (
                                        <li key={i} className="flex items-center">
                                            <span className="w-2 h-2 bg-primary rounded-full mr-3" />
                                            <span className="text-text-secondary">{tag} Support</span>
                                        </li>
                                    ))}
                                </ul>
                                <Link href="/download" className="btn btn-primary">
                                    Download & Practice {system.system_name}
                                </Link>
                            </div>

                            <h2 className="text-3xl font-bold mb-6 text-gradient">Practice Routine</h2>
                            <p className="text-text-secondary text-lg leading-relaxed mb-6">
                                To master the {system.system_name}, we recommend the following 3-step Protocol 21 training regimen:
                            </p>
                            <ol className="space-y-6 mb-12">
                                <li className="flex gap-4">
                                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center">1</span>
                                    <div>
                                        <strong className="text-white block mb-1">Value Recognition</strong>
                                        <span className="text-text-secondary">Use the specific {system.system_name} flashcard mode to memorize card values instantly.</span>
                                    </div>
                                </li>
                                <li className="flex gap-4">
                                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center">2</span>
                                    <div>
                                        <strong className="text-white block mb-1">Slow Deal</strong>
                                        <span className="text-text-secondary">Practice keeping the running count at 50% speed until you achieve 100% accuracy.</span>
                                    </div>
                                </li>
                                <li className="flex gap-4">
                                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center">3</span>
                                    <div>
                                        <strong className="text-white block mb-1">Casino Simulation</strong>
                                        <span className="text-text-secondary">Turn on the noise, distraction, and full speed dealing to test your skills under pressure.</span>
                                    </div>
                                </li>
                            </ol>
                        </article>
                    </div>
                </div>
            </section>

            {/* Related Systems */}
            {relatedSystems.length > 0 && (
                <section className="section bg-surface">
                    <div className="container">
                        <h2 className="text-2xl font-bold mb-8 text-center">Related Systems</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {relatedSystems.map((related) => (
                                <Link
                                    href={`/systems/${related.slug}`}
                                    key={related.id}
                                    className="card group"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <span className={`badge ${
                                            related.difficulty_level === 'Beginner' ? 'badge-beginner' :
                                            related.difficulty_level === 'Intermediate' ? 'badge-intermediate' : 'badge-advanced'
                                        }`}>
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

            {/* CTA Section */}
            <section className="section">
                <div className="container">
                    <div className="card text-center py-12 md:py-16 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">
                                Ready to Master {system.system_name}?
                            </h2>
                            <p className="text-text-secondary max-w-lg mx-auto mb-8 leading-relaxed">
                                Download Protocol 21 and start practicing with casino-grade drills.
                                Available free for iOS and Android.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link href="/download" className="btn btn-primary px-8">
                                    Download Protocol 21
                                </Link>
                                <Link href="/drills" className="btn btn-outline px-8">
                                    View Practice Drills
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
