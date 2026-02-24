import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs, ArticleSchema, FAQSchema, SoftwareApplicationSchema } from "@/components/seo";
import { TrueCountConverter } from "@/components/TrueCountConverter";

const BASE_URL = "https://protocol21blackjack.com";

export const metadata: Metadata = {
    title: "True Count Calculator | Convert Running Count for Blackjack",
    description: "Interactive true count calculator for blackjack. Learn the formula to convert your running count to true count based on decks remaining and gain an advantage over the casino.",
    keywords: [
        "true count calculator",
        "true count conversion",
        "card counting math",
        "blackjack true count",
        "how to calculate true count",
        "running count to true count",
    ],
    alternates: {
        canonical: `${BASE_URL}/true-count-calculator`,
    },
    openGraph: {
        title: "True Count Calculator | Convert Running Count for Blackjack",
        description: "Interactive true count calculator for blackjack. Learn the formula and practice converting your running count to gain an advantage.",
        url: `${BASE_URL}/true-count-calculator`,
        type: "article",
    },
};

const faqs = [
    {
        question: "How do you calculate the true count in blackjack?",
        answer: "To calculate the true count, you divide your current running count by the estimated number of decks remaining in the shoe. For example, if your running count is +6 and there are 2 decks left, the true count is +3."
    },
    {
        question: "Why do we need a true count instead of just a running count?",
        answer: "The running count alone doesn't tell you the density of high cards. A running count of +6 with one deck remaining means you have a massive advantage. But a +6 with six decks remaining dilutes that advantage significantly. True count standardizes the advantage per deck."
    },
    {
        question: "Does the true count affect how I play my hands?",
        answer: "Yes. Basic strategy assumes a neutral true count (0). As the true count rises, you deviate from basic strategy—for example, taking insurance, standing on stiff hands earlier, or doubling down more aggressively, because the deck is saturated with 10s and Aces."
    }
];

export default function TrueCountCalculatorPage() {
    return (
        <main className="min-h-screen">
            <ArticleSchema
                title="True Count Calculator | Convert Running Count for Blackjack"
                description="Interactive true count calculator for blackjack to convert running count to true count based on decks remaining."
                url={`${BASE_URL}/true-count-calculator`}
                datePublished="2024-02-24"
            />

            <FAQSchema items={faqs} />
            <SoftwareApplicationSchema platform="iOS" />
            <SoftwareApplicationSchema platform="Android" />

            <section className="hero py-16 md:py-24">
                <div className="container">
                    <Breadcrumbs
                        items={[
                            { name: "Home", url: "/" },
                            { name: "Tools", url: "/true-count-calculator" },
                        ]}
                        className="mb-8"
                    />

                    <div className="max-w-4xl">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                            <span className="text-gradient-gold">True Count Calculator</span>
                        </h1>
                        <p className="text-xl text-text-secondary leading-relaxed mb-4">
                            Master the exact mathematical formula professional card counters use to size their bets and beat the house edge.
                        </p>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <article className="section">
                <div className="container max-w-4xl prose prose-invert">
                    <section className="mb-12">
                        {/* GEO Optimization: H2 Question followed by 40-word bolded definition */}
                        <h2 className="text-3xl font-bold mb-4">What is the true count conversion formula in blackjack?</h2>

                        <p className="text-text-secondary leading-relaxed mb-8 text-lg border-l-4 border-primary pl-4">
                            <strong>The true count conversion is a mathematical formula that divides the running count by the estimated number of decks remaining in the shoe.</strong> This normalization tells a card counter the exact density of high-value cards remaining, dictating their optimal betting size.
                        </p>

                        <div className="bg-surface-secondary rounded-lg p-6 mb-8 text-center border-y border-white/10 shadow-lg">
                            <h3 className="text-xl font-bold mb-4 text-primary">The True Count Formula</h3>
                            <p className="font-mono text-2xl font-bold tracking-wider text-white">
                                TRUE COUNT = RUNNING COUNT ÷ DECKS REMAINING
                            </p>
                        </div>

                        <p className="text-text-secondary leading-relaxed mb-8">
                            Calculating the true count is arguably the most difficult part of card counting because it requires doing division in your head under the pressure of a live casino environment. If you miscalculate the true count, you will over-bet or under-bet your advantage, mathematically destroying your edge. Use the interactive <strong>True Count Calculator Widget</strong> below to visualize exactly how dramatic deck penetration affects the true count.
                        </p>

                        {/* Embed the Interactive Target Widget */}
                        <TrueCountConverter />

                    </section>

                    <section className="mb-12">
                        <h3 className="text-2xl font-bold mb-4">How Deck Penetration Affects Your Edge</h3>
                        <p className="text-text-secondary leading-relaxed mb-4">
                            When counting cards, the absolute value of the running count is meaningless without context. To understand why, look at the following data table representing identical running counts at different stages of shoe penetration.
                        </p>

                        <div className="overflow-x-auto my-6">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-surface-tertiary">
                                        <th className="p-3 font-bold text-primary">Running Count</th>
                                        <th className="p-3 font-bold text-primary">Decks Remaining</th>
                                        <th className="p-3 font-bold text-white">Resulting True Count</th>
                                        <th className="p-3 font-bold text-text-secondary">Player Edge</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b border-surface-tertiary hover:bg-white/5 transition-colors">
                                        <td className="p-3 font-mono font-bold">+10</td>
                                        <td className="p-3">5 Decks</td>
                                        <td className="p-3 font-bold text-white">+2</td>
                                        <td className="p-3 text-sm text-text-secondary">Slight Advantage (~1%)</td>
                                    </tr>
                                    <tr className="border-b border-surface-tertiary hover:bg-white/5 transition-colors">
                                        <td className="p-3 font-mono font-bold">+10</td>
                                        <td className="p-3">2 Decks</td>
                                        <td className="p-3 font-bold text-white">+5</td>
                                        <td className="p-3 text-sm text-text-secondary">Massive Advantage (~2.5%)</td>
                                    </tr>
                                    <tr className="hover:bg-white/5 transition-colors">
                                        <td className="p-3 font-mono font-bold">+10</td>
                                        <td className="p-3">1 Deck (Heavily Penetrated)</td>
                                        <td className="p-3 font-bold text-white">+10</td>
                                        <td className="p-3 text-sm text-text-secondary">Maximum Bet (~5%+)</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <p className="text-text-secondary leading-relaxed mt-4">
                            As you can see, a running count of +10 early in the shoe is merely a signal to increase your bet slightly. However, if you maintain that +10 deep into the shoe, your advantage skyrockets.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h3 className="text-2xl font-bold mb-4">Standard Rules for Division</h3>
                        <ul className="space-y-4 text-text-secondary ml-6 list-disc mb-8">
                            <li><strong>Always Round the Result:</strong> In a casino, you don't have time for decimal precision. If your running count is +7 with 2 decks remaining, the math is 3.5. Most professional blackjack players round to the nearest whole number (meaning slightly over +3 counts as +4) or simply floor the number depending on how aggressively they want to manage risk.</li>
                            <li><strong>Half-Deck Granularity:</strong> For the highest level of betting accuracy, advanced counters estimate the remaining shoe down to the half-deck rather than the full deck. Dividing a running count of +3 by 1.5 decks remaining yields a true count of exactly +2.</li>
                            <li><strong>Negative Counts:</strong> The formula still applies exactly the same to negative running counts. A running count of -6 with 2 decks remaining means the true count is -3. You should be betting the absolute table minimum or actively leaving the table (Wonging out).</li>
                        </ul>

                        <div className="bg-primary/10 border border-primary/20 rounded-lg p-8 text-center shadow-lg mt-12 mb-8">
                            <h3 className="text-2xl font-bold mb-4">Ready to train this skill in real-time?</h3>
                            <p className="text-text-secondary leading-relaxed mb-6">
                                Reading about true counts is easy. Doing the mental division while a dealer is throwing cards at you at 60 MPH is entirely different. Protocol 21 is the ultimate tool to practice this exact concept. Our dedicated <strong>True Count Drills</strong> and <strong>Deck Estimation</strong> mini-games force you to learn half-deck granularity visually, letting you drill offline with no scammy in-app coins.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link href="/download/ios" className="btn btn-primary px-8 py-3 text-sm font-bold uppercase tracking-wide">
                                    Train with Protocol 21 (iOS)
                                </Link>
                                <Link href="/download/android" className="btn btn-outline px-8 py-3 text-sm font-bold uppercase tracking-wide">
                                    Train with Protocol 21 (Android)
                                </Link>
                            </div>
                        </div>
                    </section>
                </div>
            </article>

            {/* Related Reading */}
            <section className="section bg-surface-secondary">
                <div className="container max-w-4xl">
                    <h2 className="text-3xl font-bold mb-8">Related Strategy Guides</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <Link href="/how-to-count-cards" className="border border-surface-tertiary rounded-lg p-6 hover:border-primary transition">
                            <h3 className="font-bold mb-2 text-white">How to Count Cards</h3>
                            <p className="text-text-secondary text-sm">Return to the basic fundamentals of maintaining a running count using the Hi-Lo system.</p>
                        </Link>
                        <Link href="/card-counting-practice" className="border border-surface-tertiary rounded-lg p-6 hover:border-primary transition">
                            <h3 className="font-bold mb-2 text-white">Card Counting Drills</h3>
                            <p className="text-text-secondary text-sm">Discover the best daily practice routines to master deck estimation entirely.</p>
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
