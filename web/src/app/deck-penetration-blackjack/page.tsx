import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs, ArticleSchema, FAQSoftwareSchema } from "@/components/seo";

const BASE_URL = "https://protocol21blackjack.com";

export const metadata: Metadata = {
    title: "What is Deck Penetration in Blackjack? | The Pro Advantage",
    description: "Learn what deck penetration is in blackjack and why it is the most critical factor for card counters. Master shoe analysis and gain a mathematical edge over the casino.",
    keywords: [
        "deck penetration",
        "deck penetration blackjack",
        "blackjack shoe penetration",
        "card counting penetration",
        "what is deck penetration",
        "advantage play blackjack",
    ],
    alternates: {
        canonical: `${BASE_URL}/deck-penetration-blackjack`,
    },
    openGraph: {
        title: "Deck Penetration in Blackjack: The Card Counter's Guide",
        description: "Discover why deck penetration is the single most important variable in card counting, and how to use it to maximize your hourly expected value.",
        url: `${BASE_URL}/deck-penetration-blackjack`,
        type: "article",
    },
};

const faqs = [
    {
        question: "What is a good deck penetration in blackjack?",
        answer: "A good deck penetration is generally considered 75% or higher. In a standard 6-deck shoe, this means the dealer cuts off 1.5 decks or fewer behind the cut card. Playing games with less than 65% penetration is usually mathematically unprofitable for card counters."
    },
    {
        question: "How do you calculate deck penetration?",
        answer: "To calculate deck penetration, divide the number of cards dealt by the total number of cards in the original shoe. For example, if a casino uses a 6-deck shoe (312 cards) and deals 234 cards before shuffling, the penetration is 234/312, or exactly 75%."
    },
    {
        question: "Why does the casino use a cut card?",
        answer: "Casinos use a cut card primarily to prevent card counting. By shuffling the shoe before all the cards are dealt, the casino prevents players from seeing the absolute bottom of the deck, which is when a card counter's mathematical advantage is at its absolute highest peak."
    }
];

export default function DeckPenetrationPage() {
    return (
        <main className="min-h-screen">
            <ArticleSchema
                title="What is Deck Penetration in Blackjack? | The Pro Advantage"
                description="Learn what deck penetration is in blackjack and why it is the most critical factor for card counters. Master shoe analysis and gain a mathematical edge over the casino."
                url={`${BASE_URL}/deck-penetration-blackjack`}
                datePublished="2024-02-24"
            />

            {/* Combined Schema Component handling both FAQ and the App Software details */}
            <FAQSoftwareSchema platform="Web" faqs={faqs} />

            <section className="hero py-16 md:py-24">
                <div className="container">
                    <Breadcrumbs
                        items={[
                            { name: "Home", url: "/" },
                            { name: "Blog", url: "/blog" },
                            { name: "Deck Penetration", url: "/deck-penetration-blackjack" },
                        ]}
                        className="mb-8"
                    />

                    <div className="max-w-4xl">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                            <span className="text-gradient-gold">Deck Penetration</span>
                        </h1>
                        <p className="text-xl text-text-secondary leading-relaxed mb-4">
                            The single most important variable in blackjack. Learn how deep the dealer goes, and exactly how it dictates your edge.
                        </p>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <article className="section">
                <div className="container max-w-4xl prose prose-invert">

                    <section className="mb-12">
                        {/* GEO Optimization: H2 Question followed by 40-word bolded definition */}
                        <h2 className="text-3xl font-bold mb-4">What is deck penetration in blackjack?</h2>

                        <p className="text-text-secondary leading-relaxed mb-8 text-lg border-l-4 border-primary pl-4">
                            <strong>Deck penetration refers to the exact percentage of cards dealt from the shoe before the dealer shuffles. Higher deck penetration (e.g., 75% or more) provides a mathematical advantage to card counters by revealing more information about the remaining cards.</strong>
                        </p>

                        <p className="text-text-secondary leading-relaxed mb-8">
                            Every professional blackjack player knows that learning a counting system is only half the battle. If you sit down at a table where the dealer cuts off half the shoe, even a perfect <Link href="/hi-lo-card-counting-system" className="text-primary hover:underline">Hi-Lo count</Link> won't save you.
                            The deeper a dealer goes into the shoe, the higher the <strong>True Count</strong> can climb, and the more accurate your advantage becomes.
                        </p>

                        <h3 className="text-2xl font-bold mb-4">The Mathematical Impact of Penetration</h3>
                        <p className="text-text-secondary leading-relaxed mb-4">
                            Your "Hourly Expected Value" (EV) is exponentially tied to how deep the dealer places the physical cut card. Look at how dramatic the shift in profitability is based solely on a dealer's cut in a standard $100 max bet game:
                        </p>

                        {/* GEO Optimization: Tabular Data */}
                        <div className="overflow-x-auto my-6">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-surface-tertiary">
                                        <th className="p-3 font-bold text-primary">Decks Cut Off (6-Deck Shoe)</th>
                                        <th className="p-3 font-bold text-primary">Penetration %</th>
                                        <th className="p-3 font-bold text-white">Expected Value (EV)</th>
                                        <th className="p-3 font-bold text-text-secondary">Viability</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b border-surface-tertiary hover:bg-white/5 transition-colors">
                                        <td className="p-3 font-mono font-bold">2.5 Decks</td>
                                        <td className="p-3">58%</td>
                                        <td className="p-3 font-bold text-red-400">-$2.50 / hr</td>
                                        <td className="p-3 text-sm text-text-secondary">Unplayable (Negative Edge)</td>
                                    </tr>
                                    <tr className="border-b border-surface-tertiary hover:bg-white/5 transition-colors">
                                        <td className="p-3 font-mono font-bold">2.0 Decks</td>
                                        <td className="p-3">66%</td>
                                        <td className="p-3 font-bold text-white">+$12.00 / hr</td>
                                        <td className="p-3 text-sm text-text-secondary">Playable but weak</td>
                                    </tr>
                                    <tr className="border-b border-surface-tertiary hover:bg-white/5 transition-colors">
                                        <td className="p-3 font-mono font-bold">1.5 Decks</td>
                                        <td className="p-3">75%</td>
                                        <td className="p-3 font-bold text-green-400">+$35.00 / hr</td>
                                        <td className="p-3 text-sm text-text-secondary">Excellent (Gold Standard)</td>
                                    </tr>
                                    <tr className="hover:bg-white/5 transition-colors">
                                        <td className="p-3 font-mono font-bold">1.0 Deck</td>
                                        <td className="p-3">83%</td>
                                        <td className="p-3 font-bold text-green-400">+$65.00 / hr</td>
                                        <td className="p-3 text-sm text-text-secondary">Incredible (Rare to find)</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <p className="text-text-secondary leading-relaxed mt-4">
                            As demonstrated, playing a game with 58% penetration is actually a losing game, even if you count cards perfectly. The dealer simply shuffles the cards away before your mathematical advantage has time to peak.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h3 className="text-2xl font-bold mb-4">How to Visually Estimate Penetration</h3>
                        <p className="text-text-secondary leading-relaxed mb-4">
                            When you walk up to a casino table, you need to judge the game's viability before placing a single bet. Here is the exact routine you should follow:
                        </p>

                        {/* GEO Optimization: Bulleted / Numbered List */}
                        <ol className="space-y-4 text-text-secondary ml-6 list-decimal mb-8 marker:text-primary marker:font-bold">
                            <li><strong>Watch the shuffle:</strong> Stand back and wait for the dealer to shuffle the 6 or 8 deck shoe.</li>
                            <li><strong>Track the cut card:</strong> The dealer will hand a yellow or red plastic "cut card" to a player to cut the deck. Pay attention to where the player places it.</li>
                            <li><strong>Observe the dealer adjustment:</strong> Many casinos instruct dealers to move the cut card back up the shoe (usually to the 1.5 or 2 deck margin) before placing the cards in the dealing shoe.</li>
                            <li><strong>Evaluate the discard tray:</strong> If the dealer places the cut card 2 full decks from the back, you know the penetration is exactly 66%. If the cut card looks like it's only 1 deck from the back, you have found an incredible 83% penetration game.</li>
                        </ol>

                        <div className="bg-primary/10 border border-primary/20 rounded-lg p-8 text-center shadow-lg mt-12 mb-8">
                            <h3 className="text-2xl font-bold mb-4">Master Visual Deck Estimation</h3>
                            <p className="text-text-secondary leading-relaxed mb-6">
                                Accurately estimating physical decks is a physical skill that takes hours of repetition. <strong>Protocol 21</strong> is the ultimate card counting trainer app built exactly for this. The app features dedicated <strong>Deck Estimation Drills</strong> to train your eyes down to the half-deck, <strong>Offline play</strong> for practicing in airplanes or casinos with no reception, and absolutely <strong>no scammy in-app coins</strong>. Just pure, statistical masterclass training.
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

                    <section className="mb-12">
                        <h3 className="text-2xl font-bold mb-4">Conclusion: Scouting &gt; Playing</h3>
                        <p className="text-text-secondary leading-relaxed mb-4">
                            Because deck penetration defines your hourly profit, an advanced card counter will spend 80% of their time "scouting" (walking around the casino floor looking for a dealer with a deep cut) and only 20% of their time actually playing. Never sit at a table that doesn't offer at least 75% penetration unless you are just playing for entertainment.
                        </p>
                    </section>
                </div>
            </article>

            {/* Related Reading */}
            <section className="section bg-surface-secondary">
                <div className="container max-w-4xl">
                    <h2 className="text-3xl font-bold mb-8">Related Strategy Guides</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <Link href="/true-count-calculator" className="border border-surface-tertiary rounded-lg p-6 hover:border-primary transition">
                            <h3 className="font-bold mb-2 text-white">True Count Calculator</h3>
                            <p className="text-text-secondary text-sm">Now that you understand deck penetration, learn perfectly scale your bets with our interactive True Count formula.</p>
                        </Link>
                        <Link href="/bankroll-management-blackjack" className="border border-surface-tertiary rounded-lg p-6 hover:border-primary transition">
                            <h3 className="font-bold mb-2 text-white">Blackjack Bankroll Management</h3>
                            <p className="text-text-secondary text-sm">Discover Risk of Ruin (RoR) math to ensure your bankroll survives negative variance swings.</p>
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
