import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs, ArticleSchema, HowToSchema } from "@/components/seo";

const BASE_URL = "https://protocol21blackjack.com";

export const metadata: Metadata = {
  title: "How to Count Cards in Blackjack: Complete Step-by-Step Guide",
  description: "Learn how to count cards in blackjack with our comprehensive guide covering Hi-Lo, KO, Omega II, and other systems. Step-by-step instructions, practice drills, and casino strategies.",
  keywords: [
    "how to count cards",
    "card counting blackjack",
    "blackjack counting systems",
    "Hi-Lo card counting",
    "learn to count cards",
    "card counting guide",
    "advantage play blackjack",
  ],
  alternates: {
    canonical: `${BASE_URL}/how-to-count-cards`,
  },
  openGraph: {
    title: "How to Count Cards in Blackjack: Complete Guide",
    description: "Master card counting with detailed instructions for Hi-Lo, KO, Omega II, and more. Learn proven advantage play techniques.",
    url: `${BASE_URL}/how-to-count-cards`,
    type: "article",
    images: [
      {
        url: `${BASE_URL}/images/protocol-21-card-shoe.webp`,
        width: 1200,
        height: 630,
        alt: "Card Counting Guide",
      },
    ],
  },
};

export default function HowToCountCardsPage() {
  return (
    <main className="min-h-screen">
      <ArticleSchema
        title="How to Count Cards in Blackjack: Complete Step-by-Step Guide"
        description="Comprehensive guide to learning card counting systems for blackjack. Learn Hi-Lo, KO, Omega II, and other counting methods with step-by-step instructions."
        url={`${BASE_URL}/how-to-count-cards`}
        datePublished="2024-01-20"
        image={`${BASE_URL}/images/protocol-21-card-shoe.webp`}
      />

      <HowToSchema
        name="How to Count Cards in Blackjack"
        description="Step-by-step guide to learning card counting in blackjack"
        steps={[
          { name: "Understand Card Values", text: "Learn the point values assigned to each card in your chosen counting system" },
          { name: "Practice Running Count", text: "Master keeping a running count of cards as they're dealt" },
          { name: "Learn True Count", text: "Convert running count to true count based on remaining deck estimation" },
          { name: "Develop Speed", text: "Increase counting accuracy and speed to match casino dealer pace" },
          { name: "Master Decision Making", text: "Apply count information to betting and playing decisions" },
        ]}
      />

      <section className="hero py-16 md:py-24">
        <div className="container">
          <Breadcrumbs
            items={[
              { name: "Home", url: "/" },
              { name: "Guides", url: "/blog" },
              { name: "How to Count Cards", url: "/how-to-count-cards" },
            ]}
            className="mb-8"
          />

          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-gradient-gold">How to Count Cards in Blackjack</span>
            </h1>
            <p className="text-xl text-text-secondary leading-relaxed mb-4">
              Complete step-by-step guide to mastering card counting systems and gaining a mathematical edge at the blackjack table.
            </p>
            <p className="text-text-secondary mb-8">
              Published: January 20, 2024 | Reading time: 15 minutes
            </p>
          </div>
        </div>
      </section>

      {/* Table of Contents */}
      <section className="section bg-surface-secondary sticky top-0 z-10">
        <div className="container max-w-4xl">
          <h2 className="text-xl font-bold mb-4">Table of Contents</h2>
          <ul className="space-y-2 text-sm md:text-base">
            <li><a href="#introduction" className="text-gold-500 hover:underline">Introduction to Card Counting</a></li>
            <li><a href="#fundamentals" className="text-gold-500 hover:underline">Card Counting Fundamentals</a></li>
            <li><a href="#hi-lo" className="text-gold-500 hover:underline">Hi-Lo Counting System</a></li>
            <li><a href="#other-systems" className="text-gold-500 hover:underline">Other Counting Systems</a></li>
            <li><a href="#true-count" className="text-gold-500 hover:underline">True Count Conversion</a></li>
            <li><a href="#practice" className="text-gold-500 hover:underline">Practice & Training</a></li>
            <li><a href="#strategy" className="text-gold-500 hover:underline">Betting & Playing Strategy</a></li>
            <li><a href="#conclusion" className="text-gold-500 hover:underline">Getting Started</a></li>
          </ul>
        </div>
      </section>

      {/* Main Content */}
      <article className="section">
        <div className="container max-w-4xl prose prose-invert">
          <section id="introduction" className="mb-12">
            <h2 className="text-3xl font-bold mb-4">Introduction to Card Counting</h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              Card counting is a legal advantage play technique that gives skilled players a mathematical edge over the casino at blackjack. By tracking the ratio of high cards to low cards remaining in the deck, skilled counters can adjust their betting and playing decisions to maximize expected value.
            </p>
            <p className="text-text-secondary leading-relaxed mb-4">
              Unlike the Hollywood myths about complex mathematical formulas or hidden technology, card counting is based on simple probability and mental arithmetic. When the remaining deck is rich in high-value cards (10s, face cards, aces), the player has an advantage. When the deck is depleted of high cards, the casino has the advantage.
            </p>
            <p className="text-text-secondary leading-relaxed">
              This guide covers everything you need to know to start learning card counting, from the fundamental concepts to advanced betting strategies. Whether you're a complete beginner or have some blackjack knowledge, we'll walk you through each step of the process.
            </p>
          </section>

          <section id="fundamentals" className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Card Counting Fundamentals</h2>

            <h3 className="text-2xl font-bold mb-4">Why Card Counting Works</h3>
            <p className="text-text-secondary leading-relaxed mb-4">
              Blackjack is unique among casino games because the odds change as cards are dealt. Unlike roulette where every spin is independent, blackjack results depend on which cards remain in the deck. This creates exploitable situations for informed players.
            </p>
            <div className="bg-surface-secondary rounded-lg p-6 my-6">
              <h4 className="font-bold mb-3">Key Principle</h4>
              <p className="text-text-secondary">
                When the undealt deck contains more high cards (10, J, Q, K, A) than low cards (2, 3, 4, 5, 6), the player has an advantage. When the deck is depleted of high cards, the casino has the advantage. By identifying these situations, counters adjust their play accordingly.
              </p>
            </div>

            <h3 className="text-2xl font-bold mb-4">The Basic Count System</h3>
            <p className="text-text-secondary leading-relaxed mb-4">
              All card counting systems work on the same principle: assign point values to cards, keep a running total as cards are dealt, and use that count to identify favorable situations. The simplest system is called the "Hi-Lo" count, which we'll cover in detail in the next section.
            </p>

            <h3 className="text-2xl font-bold mb-4">Running Count vs True Count</h3>
            <p className="text-text-secondary leading-relaxed mb-4">
              The running count is the raw tally of point values as cards are dealt. In multi-deck games (which is virtually all casino blackjack), you must convert this to a "true count" by dividing by the estimated remaining deck. This adjustment accounts for the size of the remaining shoe.
            </p>
            <div className="bg-surface-secondary rounded-lg p-6 my-6">
              <h4 className="font-bold mb-3">Example</h4>
              <p className="text-text-secondary mb-2">
                Running count: +8
                Estimated remaining decks: 2
                True count: +8 ÷ 2 = +4
              </p>
              <p className="text-text-secondary">
                The true count of +4 tells you the deck is significantly favorable. A running count of +8 in an 8-deck shoe (only 1 deck left) also equals a true count of +8, which is even more favorable.
              </p>
            </div>
          </section>

          <section id="hi-lo" className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Hi-Lo Counting System</h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              Hi-Lo is the most popular card counting system for beginners. It's simple to learn, quick to execute, and effective for gaining a player advantage. This is the system used by most casual counters and is widely documented in blackjack books.
            </p>

            <h3 className="text-2xl font-bold mb-4">Card Values in Hi-Lo</h3>
            <div className="overflow-x-auto my-6">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-surface-tertiary">
                    <th className="p-3 font-bold">Cards</th>
                    <th className="p-3 font-bold">Point Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-surface-tertiary">
                    <td className="p-3">2, 3, 4, 5, 6</td>
                    <td className="p-3">+1 (LOW CARDS)</td>
                  </tr>
                  <tr className="border-b border-surface-tertiary">
                    <td className="p-3">7, 8, 9</td>
                    <td className="p-3">0 (NEUTRAL)</td>
                  </tr>
                  <tr>
                    <td className="p-3">10, J, Q, K, A</td>
                    <td className="p-3">-1 (HIGH CARDS)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-2xl font-bold mb-4">How to Keep the Hi-Lo Count</h3>
            <p className="text-text-secondary leading-relaxed mb-4">
              The Hi-Lo count is simple: you're counting the "rich-ness" of the remaining deck. Cards 2-6 count as +1 (they're low-value cards depleting the deck's strength), cards 7-9 count as 0 (they're neutral), and cards 10-A count as -1 (they're high-value cards that increase the deck's strength).
            </p>
            <div className="bg-surface-secondary rounded-lg p-6 my-6">
              <h4 className="font-bold mb-3">Practice Example</h4>
              <p className="text-text-secondary mb-2">Cards dealt: K, 4, 7, 9, 3, J, 6</p>
              <p className="text-text-secondary mb-4">Count progression:</p>
              <ul className="space-y-1 text-text-secondary text-sm">
                <li>K = -1 (running count: -1)</li>
                <li>4 = +1 (running count: 0)</li>
                <li>7 = 0 (running count: 0)</li>
                <li>9 = 0 (running count: 0)</li>
                <li>3 = +1 (running count: +1)</li>
                <li>J = -1 (running count: 0)</li>
                <li>6 = +1 (running count: +1)</li>
              </ul>
            </div>

            <h3 className="text-2xl font-bold mb-4">The Balanced Count Concept</h3>
            <p className="text-text-secondary leading-relaxed">
              Hi-Lo is a "balanced" count because a complete single deck (52 cards with 4 of each rank) totals exactly zero: 20 cards worth +1, 12 cards worth 0, and 20 cards worth -1. This means at the end of a deck, your running count should return to zero. This natural balance makes Hi-Lo intuitive to learn and easy to verify.
            </p>
          </section>

          <section id="other-systems" className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Other Card Counting Systems</h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              While Hi-Lo is the most popular system, there are other counting methods with different advantages. Here's an overview of the major systems:
            </p>

            <h3 className="text-2xl font-bold mb-4">KO (Knock-Out) Count</h3>
            <p className="text-text-secondary leading-relaxed mb-4">
              The KO count is similar to Hi-Lo but unbalanced, eliminating the need for true count conversion until the final deck. It's excellent for casual players or those just starting. The main difference: 7 counts as +1 instead of 0.
            </p>

            <h3 className="text-2xl font-bold mb-4">Zen Count</h3>
            <p className="text-text-secondary leading-relaxed mb-4">
              A more sophisticated system with values: 2-3 = +1, 4-6 = +2, 7 = 0, 8-9 = -1, 10-A = -2. The doubled values for middle cards provide better betting precision than Hi-Lo.
            </p>

            <h3 className="text-2xl font-bold mb-4">Omega II</h3>
            <p className="text-text-secondary leading-relaxed mb-4">
              An advanced fractional system requiring side counts of aces and deuces. More complex than Hi-Lo but offers better betting accuracy for dedicated advantage players.
            </p>

            <h3 className="text-2xl font-bold mb-4">Wong Halves</h3>
            <p className="text-text-secondary leading-relaxed mb-4">
              The most complex counting system with half-value cards (2,3,4,6 = +0.5 to +1.5). Offers maximum precision but requires significant practice to execute reliably at casino speeds.
            </p>
          </section>

          <section id="true-count" className="mb-12">
            <h2 className="text-3xl font-bold mb-6">True Count Conversion</h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              Converting running count to true count is essential for optimal play in multi-deck games. Here's how it works:
            </p>

            <h3 className="text-2xl font-bold mb-4">Deck Estimation</h3>
            <p className="text-text-secondary leading-relaxed mb-4">
              Look at the undealt cards in the discard tray (cards already played) to estimate remaining deck. Professional counters develop this skill through practice. In general:
            </p>
            <ul className="space-y-2 text-text-secondary ml-6 list-disc mb-6">
              <li>One deck (52 cards) = about 2 inches thick</li>
              <li>A full shoe's worth of cards stacked shows how much has been dealt</li>
              <li>Practice visual estimation to avoid drawing attention</li>
            </ul>

            <h3 className="text-2xl font-bold mb-4">The Conversion Formula</h3>
            <div className="bg-surface-secondary rounded-lg p-6 my-6">
              <p className="font-bold mb-2">True Count = Running Count ÷ Estimated Remaining Decks</p>
              <p className="text-text-secondary text-sm">Example: Running count +6, estimated 1.5 decks remaining = True count +4</p>
            </div>

            <p className="text-text-secondary leading-relaxed">
              A true count above +1 is generally favorable for the player. A true count of +2 to +4 is moderately favorable. A true count of +4 or higher is highly favorable.
            </p>
          </section>

          <section id="practice" className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Practice & Training</h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              Learning to count cards requires dedicated practice. Most serious players spend 50-100 hours practicing before casino play. Here's a progression:
            </p>

            <h3 className="text-2xl font-bold mb-4">Stage 1: Card Recognition (2-4 hours)</h3>
            <p className="text-text-secondary leading-relaxed mb-4">
              Memorize the point values for your chosen system until they're automatic. Practice seeing a card and instantly knowing its value. This should be instant—no hesitation.
            </p>

            <h3 className="text-2xl font-bold mb-4">Stage 2: Running Count Accuracy (10-20 hours)</h3>
            <p className="text-text-secondary leading-relaxed mb-4">
              Practice keeping a running count with a single deck, then multiple decks. Start slow to focus on accuracy over speed. An online trainer like Protocol 21 makes this much easier.
            </p>

            <h3 className="text-2xl font-bold mb-4">Stage 3: Speed Building (15-30 hours)</h3>
            <p className="text-text-secondary leading-relaxed mb-4">
              Once accuracy is solid, increase the dealer speed. Practice counting at casino pace. At this stage, you should rarely make mistakes even with rapid-fire cards.
            </p>

            <h3 className="text-2xl font-bold mb-4">Stage 4: True Count Conversion (10-20 hours)</h3>
            <p className="text-text-secondary leading-relaxed mb-4">
              Master the mental math of dividing running count by remaining decks. Practice deck estimation. Combine running count keeping with true count conversion.
            </p>

            <h3 className="text-2xl font-bold mb-4">Stage 5: Casino Simulation (20-30 hours)</h3>
            <p className="text-text-secondary leading-relaxed mb-4">
              Practice with casino audio, distractions, and realistic conditions. Train with the pressure of casino noise and human interactions.
            </p>
          </section>

          <section id="strategy" className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Betting & Playing Strategy</h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              Keeping an accurate count is only half the battle. You must use that information to make profitable betting and playing decisions.
            </p>

            <h3 className="text-2xl font-bold mb-4">Betting Strategy</h3>
            <p className="text-text-secondary leading-relaxed mb-4">
              When the true count is positive, increase your bet. When it's negative, decrease your bet (or leave the table). A basic betting spread:
            </p>
            <div className="bg-surface-secondary rounded-lg p-6 my-6">
              <p className="text-text-secondary mb-2">True Count: -1 or less → Minimum bet</p>
              <p className="text-text-secondary mb-2">True Count: 0 to +1 → Base bet</p>
              <p className="text-text-secondary mb-2">True Count: +2 to +3 → 2x base bet</p>
              <p className="text-text-secondary mb-2">True Count: +4 to +5 → 4x base bet</p>
              <p className="text-text-secondary">True Count: +6+ → Maximum bet</p>
            </div>

            <h3 className="text-2xl font-bold mb-4">Playing Decisions</h3>
            <p className="text-text-secondary leading-relaxed mb-4">
              The count also influences specific playing decisions like hitting, standing, doubling, and splitting. For example, you're more likely to hit stiff hands (12-16) when the count is positive, as high cards are favorable to you.
            </p>
          </section>

          <section id="conclusion" className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Getting Started with Card Counting</h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              Learning to count cards is an achievable goal for anyone willing to invest the practice time. Here's how to get started:
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex gap-4">
                <span className="text-2xl">1</span>
                <div>
                  <h4 className="font-bold mb-1">Choose a Counting System</h4>
                  <p className="text-text-secondary text-sm">Start with Hi-Lo if you're a beginner. It's the easiest to learn and most widely applicable.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="text-2xl">2</span>
                <div>
                  <h4 className="font-bold mb-1">Practice with Tools</h4>
                  <p className="text-text-secondary text-sm">Use a card counting trainer app like Protocol 21 to accelerate your learning with instant feedback and progressive drills.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="text-2xl">3</span>
                <div>
                  <h4 className="font-bold mb-1">Master Each Stage</h4>
                  <p className="text-text-secondary text-sm">Progress through practice stages systematically. Don't move to the next stage until you've achieved high accuracy in your current level.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="text-2xl">4</span>
                <div>
                  <h4 className="font-bold mb-1">Verify Your Skills</h4>
                  <p className="text-text-secondary text-sm">Use drills that test true count accuracy, speed, and deck estimation under pressure. Track your improvement metrics.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="text-2xl">5</span>
                <div>
                  <h4 className="font-bold mb-1">Practice Casino Conditions</h4>
                  <p className="text-text-secondary text-sm">Before playing in a casino, practice with realistic audio, distractions, and pressure. Build confidence through simulation.</p>
                </div>
              </div>
            </div>

            <div className="bg-surface-secondary rounded-lg p-8 mb-8">
              <h3 className="text-2xl font-bold mb-4">Start Your Training Today</h3>
              <p className="text-text-secondary leading-relaxed mb-6">
                Protocol 21 provides everything you need to master card counting efficiently. Our progressive drills, instant feedback, and casino simulation will prepare you for successful advantage play.
              </p>
              <Link href="/download" className="btn btn-primary">
                Download Protocol 21 Free
              </Link>
            </div>

            <h3 className="text-2xl font-bold mb-4">Key Takeaways</h3>
            <ul className="space-y-2 text-text-secondary ml-6 list-disc">
              <li>Card counting assigns point values to cards and tracks their cumulative total</li>
              <li>Hi-Lo is the best system for beginners: +1 for 2-6, 0 for 7-9, -1 for 10-A</li>
              <li>True count = running count ÷ remaining decks (required for accurate play)</li>
              <li>Expect 50-100 hours of practice before casino-ready play</li>
              <li>Use the count to adjust betting when count is positive, reduce when negative</li>
              <li>Regular practice with tools like Protocol 21 accelerates skill development</li>
            </ul>
          </section>
        </div>
      </article>

      {/* Related Reading */}
      <section className="section bg-surface-secondary">
        <div className="container max-w-4xl">
          <h2 className="text-3xl font-bold mb-8">Related Guides</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Link href="/is-card-counting-illegal" className="border border-surface-tertiary rounded-lg p-6 hover:border-gold-500 transition">
              <h3 className="font-bold mb-2">Is Card Counting Illegal?</h3>
              <p className="text-text-secondary text-sm">Understand the legality of card counting and how to stay safe while playing.</p>
            </Link>
            <Link href="/card-counting-practice" className="border border-surface-tertiary rounded-lg p-6 hover:border-gold-500 transition">
              <h3 className="font-bold mb-2">Card Counting Practice Guide</h3>
              <p className="text-text-secondary text-sm">Master effective practice strategies to improve your counting speed and accuracy.</p>
            </Link>
            <Link href="/systems" className="border border-surface-tertiary rounded-lg p-6 hover:border-gold-500 transition">
              <h3 className="font-bold mb-2">All Card Counting Systems</h3>
              <p className="text-text-secondary text-sm">Compare Hi-Lo, KO, Omega II, Wong Halves, and other advanced systems.</p>
            </Link>
            <Link href="/features" className="border border-surface-tertiary rounded-lg p-6 hover:border-gold-500 transition">
              <h3 className="font-bold mb-2">Protocol 21 Features</h3>
              <p className="text-text-secondary text-sm">Explore our comprehensive training tools and casino-grade drills.</p>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
