import { notFound } from "next/navigation";
import systems from "@/data/systems.json";
import Link from "next/link";
import { Metadata } from "next";

export async function generateStaticParams() {
    return systems.map((system) => ({
        slug: system.slug,
    }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const system = systems.find((s) => s.slug === params.slug);
    if (!system) return {};

    return {
        title: system.seo_title,
        description: system.seo_desc,
    };
}

export default function SystemPage({ params }: { params: { slug: string } }) {
    const system = systems.find((s) => s.slug === params.slug);

    if (!system) {
        notFound();
    }

    return (
        <main className="min-h-screen pt-24 pb-16">
            <div className="container">
                <Link href="/" className="text-secondary hover:text-white mb-8 inline-block">
                    ← Back to all systems
                </Link>

                <div className="max-w-4xl mx-auto">
                    <header className="mb-12 border-b border-[rgba(255,255,255,0.1)] pb-8">
                        <div className="flex gap-4 mb-4">
                            <span className="px-3 py-1 bg-[rgba(99,102,241,0.1)] text-primary border border-[rgba(99,102,241,0.2)] rounded-full text-sm font-semibold">
                                {system.count_type} Count
                            </span>
                            <span className="px-3 py-1 bg-[rgba(255,255,255,0.05)] text-secondary border border-[rgba(255,255,255,0.1)] rounded-full text-sm">
                                Difficulty: {system.difficulty_level}
                            </span>
                        </div>
                        <h1 className="text-5xl font-bold mb-6">{system.system_name}</h1>
                        <p className="text-xl text-secondary leading-relaxed">
                            {system.seo_desc}
                        </p>
                    </header>

                    <article className="prose prose-invert max-w-none">
                        {/* AI Generated Content Placeholder - In a real pSEO setup, this would be pre-generated or fetched */}
                        <h2 className="text-3xl font-bold mb-4 text-white">Why Learn the {system.system_name}?</h2>
                        <p className="text-secondary mb-8">
                            Many players struggle with <strong>{system.pain_point}</strong>. The {system.system_name} is specifically designed to address this by providing a structured approach to gaining an edge over the house.
                        </p>

                        <div className="bg-surface p-8 rounded-xl border border-[rgba(255,255,255,0.05)] mb-12">
                            <h3 className="text-2xl font-bold mb-4 text-white">How Protocol 21 Helps You Master It</h3>
                            <p className="mb-6 text-secondary">
                                Unlike generic drill apps, Protocol 21 has a dedicated algorithm for {system.system_name}.
                                We don't just flash cards; we simulate the exact counting conditions you'll face in a casino.
                            </p>
                            <ul className="space-y-4 mb-8">
                                {system.tags.map((tag, i) => (
                                    <li key={i} className="flex items-center text-white">
                                        <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                                        {tag} Support
                                    </li>
                                ))}
                            </ul>
                            <div className="flex gap-4">
                                <Link href="/download/ios" className="btn btn-primary">
                                    Download & Practice {system.system_name}
                                </Link>
                            </div>
                        </div>

                        <h2 className="text-3xl font-bold mb-4 text-white">Practice Routine</h2>
                        <p className="text-secondary mb-4">
                            To master the {system.system_name}, we recommend the following 3-step Protocol 21 training regimen:
                        </p>
                        <ol className="list-decimal pl-5 space-y-4 text-secondary mb-8">
                            <li><strong>Value Recognition:</strong> Use the specific {system.system_name} flashcard mode to memorize card values instantly.</li>
                            <li><strong>Slow Deal:</strong> Practice keeping the running count at 50% speed until you achieve 100% accuracy.</li>
                            <li><strong>Casino Simulation:</strong> Turn on the noise, distraction, and full speed dealing to test your skills under pressure.</li>
                        </ol>
                    </article>
                </div>
            </div>
        </main>
    );
}
