import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs, ArticleSchema } from "@/components/seo";

const BASE_URL = "https://protocol21blackjack.com";

export const metadata: Metadata = {
  title: "Is Card Counting Illegal? Legal Guide to Blackjack Advantage Play",
  description: "Is card counting illegal? Legal analysis of card counting in casinos, your rights, casino responses, and how to stay safe while playing. Expert guide to advantage play legality.",
  keywords: [
    "is card counting illegal",
    "card counting legality",
    "blackjack law",
    "advantage play legal",
    "casino card counting",
    "blackjack counting legal",
  ],
  alternates: {
    canonical: `${BASE_URL}/is-card-counting-illegal`,
  },
  openGraph: {
    title: "Is Card Counting Illegal? Legal Analysis & Guide",
    description: "Complete guide to the legality of card counting in casinos. Understand your rights and casino policies.",
    url: `${BASE_URL}/is-card-counting-illegal`,
    type: "article",
  },
};

export default function IsCardCountingIllegalPage() {
  return (
    <main className="min-h-screen">
      <ArticleSchema
        title="Is Card Counting Illegal? Complete Legal Guide"
        description="Comprehensive guide explaining the legality of card counting in casinos, your rights, and how to avoid detection."
        url={`${BASE_URL}/is-card-counting-illegal`}
        datePublished="2024-01-22"
      />

      <section className="hero py-16 md:py-24">
        <div className="container">
          <Breadcrumbs
            items={[
              { name: "Home", url: "/" },
              { name: "Guides", url: "/blog" },
              { name: "Is Card Counting Illegal?", url: "/is-card-counting-illegal" },
            ]}
            className="mb-8"
          />

          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-gradient-gold">Is Card Counting Illegal?</span>
            </h1>
            <p className="text-xl text-text-secondary leading-relaxed mb-4">
              The definitive legal guide to card counting in casinos, your rights as a player, and how to stay safe while employing card counting strategies.
            </p>
            <p className="text-text-secondary mb-8">
              Published: January 22, 2024 | Updated: February 17, 2026 | Reading time: 12 minutes
            </p>

            <div className="bg-surface-secondary rounded-lg p-6 border-l-4 border-gold-500">
              <p className="font-bold text-lg mb-2">Quick Answer:</p>
              <p className="text-text-secondary">
                Card counting is <strong>not illegal</strong> in most jurisdictions. You cannot be prosecuted under law for card counting. However, casinos are private businesses and can refuse service to card counters.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Table of Contents */}
      <section className="section bg-surface-secondary">
        <div className="container max-w-4xl">
          <h2 className="text-xl font-bold mb-4">Table of Contents</h2>
          <ul className="space-y-2 text-sm md:text-base">
            <li><a href="#legal-status" className="text-gold-500 hover:underline">Legal Status of Card Counting</a></li>
            <li><a href="#usa-law" className="text-gold-500 hover:underline">Card Counting in the United States</a></li>
            <li><a href="#casino-rights" className="text-gold-500 hover:underline">Casino Rights & Responses</a></li>
            <li><a href="#detection" className="text-gold-500 hover:underline">Detection Methods</a></li>
            <li><a href="#staying-safe" className="text-gold-500 hover:underline">How to Stay Safe</a></li>
            <li><a href="#international" className="text-gold-500 hover:underline">International Variations</a></li>
            <li><a href="#conclusion" className="text-gold-500 hover:underline">Conclusion</a></li>
          </ul>
        </div>
      </section>

      {/* Main Content */}
      <article className="section">
        <div className="container max-w-4xl prose prose-invert">
          <section id="legal-status" className="mb-12">
            <h2 className="text-3xl font-bold mb-4">Legal Status of Card Counting</h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              <strong>Card counting is not illegal</strong> in the United States or most countries worldwide. This is a crucial distinction that many people misunderstand due to Hollywood portrayals and casino myths.
            </p>
            <p className="text-text-secondary leading-relaxed mb-4">
              Using your brain to track cards and make mathematically superior decisions is not a crime. You cannot be arrested, fined, or prosecuted by government authorities for card counting. The act of counting is perfectly legal—it's just mental arithmetic.
            </p>
            <p className="text-text-secondary leading-relaxed">
              What IS within casino control: Private businesses have the right to refuse service to anyone they believe is a card counter. This distinction between legal and casino policy is essential to understand.
            </p>
          </section>

          <section id="usa-law" className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Card Counting in the United States</h2>

            <h3 className="text-2xl font-bold mb-4">Federal Law</h3>
            <p className="text-text-secondary leading-relaxed mb-4">
              There is no federal law prohibiting card counting. The act of using your memory and mental math at a blackjack table has never been criminalized at the federal level.
            </p>

            <h3 className="text-2xl font-bold mb-4">State Laws</h3>
            <p className="text-text-secondary leading-relaxed mb-4">
              No U.S. state has criminalized card counting. Some states have "anti-device" laws that prohibit using technology (like hidden computers or electronic devices) to count, but this applies to external devices, not your brain.
            </p>

            <h3 className="text-2xl font-bold mb-4">Famous Legal Cases</h3>
            <p className="text-text-secondary leading-relaxed mb-4">
              The most famous card counting case in American legal history is <strong>State v. Uston (1981)</strong>, which established important precedent:
            </p>
            <div className="bg-surface-secondary rounded-lg p-6 my-6">
              <h4 className="font-bold mb-3">Uston v. Resorts International Hotel</h4>
              <p className="text-text-secondary mb-3">
                Atlantic City card counter Ken Uston was banned from casinos based on his card counting ability. He sued, arguing the ban violated New Jersey law. The New Jersey Supreme Court ruled that:
              </p>
              <ul className="space-y-2 text-text-secondary text-sm ml-4 list-disc">
                <li>Card counting using only the mind is legal</li>
                <li>Casinos can ban counters, but cannot prosecute them legally</li>
                <li>Casinos could use countermeasures (shoe shuffling, rule changes) but cannot make counting itself illegal</li>
              </ul>
            </div>

            <p className="text-text-secondary leading-relaxed mb-4">
              This ruling established that card counting, while subject to casino countermeasures, cannot result in legal prosecution.
            </p>

            <h3 className="text-2xl font-bold mb-4">Criminal Devices Exception</h3>
            <p className="text-text-secondary leading-relaxed mb-4">
              The one area where the law draws a line is "mechanical or electronic devices." Using any external device (hidden camera, computer, app, wireless receiver, etc.) to aid counting is illegal in most jurisdictions. This includes:
            </p>
            <ul className="space-y-2 text-text-secondary ml-6 list-disc mb-4">
              <li>Hidden computers or calculators</li>
              <li>Wireless signals/phones passing count information</li>
              <li>Hidden cameras</li>
              <li>Any electronic assistance</li>
            </ul>

            <p className="text-text-secondary leading-relaxed">
              Using only your memory and mental arithmetic is completely legal. This is what makes card counting unique—it's the one casino "exploit" that cannot be prosecuted.
            </p>
          </section>

          <section id="casino-rights" className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Casino Rights & Responses</h2>

            <h3 className="text-2xl font-bold mb-4">Right to Refuse Service</h3>
            <p className="text-text-secondary leading-relaxed mb-4">
              While card counting is legal, casinos are private establishments with the right to refuse service to anyone they believe is counting cards. A casino can:
            </p>
            <ul className="space-y-2 text-text-secondary ml-6 list-disc mb-6">
              <li>Ask you to leave the blackjack table</li>
              <li>Ban you from the casino entirely</li>
              <li>Add your name to their counter database</li>
              <li>Share your information with other casinos</li>
              <li>Refuse future entry to the property</li>
            </ul>

            <h3 className="text-2xl font-bold mb-4">Common Casino Countermeasures</h3>
            <p className="text-text-secondary leading-relaxed mb-4">
              Rather than banning counters one at a time, casinos have implemented game changes to reduce counter advantage:
            </p>
            <div className="space-y-4">
              <div className="border-l-4 border-gold-500 pl-6">
                <h4 className="font-bold mb-2">More Decks</h4>
                <p className="text-text-secondary text-sm">Most casinos now deal 6-8 deck shoes instead of single-deck blackjack, reducing counting effectiveness.</p>
              </div>

              <div className="border-l-4 border-gold-500 pl-6">
                <h4 className="font-bold mb-2">Deeper Cuts</h4>
                <p className="text-text-secondary text-sm">Casinos cut off 25% or more of the shoe before dealing, limiting counting advantage.</p>
              </div>

              <div className="border-l-4 border-gold-500 pl-6">
                <h4 className="font-bold mb-2">Frequent Shuffling</h4>
                <p className="text-text-secondary text-sm">Shuffling after favorable counts emerge prevents counters from capitalizing on advantages.</p>
              </div>

              <div className="border-l-4 border-gold-500 pl-6">
                <h4 className="font-bold mb-2">Continuous Shuffle Machines</h4>
                <p className="text-text-secondary text-sm">These devices shuffle dealt cards back into the shoe, making counting impossible.</p>
              </div>

              <div className="border-l-4 border-gold-500 pl-6">
                <h4 className="font-bold mb-2">Table Moves</h4>
                <p className="text-text-secondary text-sm">Pit bosses can move you from a favorable table to a disadvantageous one.</p>
              </div>
            </div>
          </section>

          <section id="detection" className="mb-12">
            <h2 className="text-3xl font-bold mb-6">How Casinos Detect Card Counters</h2>

            <h3 className="text-2xl font-bold mb-4">Behavioral Red Flags</h3>
            <p className="text-text-secondary leading-relaxed mb-4">
              Casino surveillance and pit bosses watch for patterns that suggest card counting:
            </p>
            <ul className="space-y-2 text-text-secondary ml-6 list-disc mb-6">
              <li><strong>Betting patterns:</strong> Large swings between minimum and maximum bets</li>
              <li><strong>Skill variations:</strong> Never splitting 10s or hitting 12, showing deep blackjack knowledge</li>
              <li><strong>Decision timing:</strong> Pauses before decisions suggesting internal calculations</li>
              <li><strong>Penetration sensitivity:</strong> Leaving when deck gets unfavorable</li>
              <li><strong>Table selection:</strong> Always choosing certain shoes or tables</li>
              <li><strong>Consistent play:</strong> Playing identical hands the same way</li>
            </ul>

            <h3 className="text-2xl font-bold mb-4">Surveillance Technology</h3>
            <p className="text-text-secondary leading-relaxed mb-4">
              Modern casinos use:
            </p>
            <ul className="space-y-2 text-text-secondary ml-6 list-disc mb-4">
              <li>High-definition surveillance cameras with zoom capability</li>
              <li>Facial recognition technology</li>
              <li>Bet-tracking systems</li>
              <li>Card comparison systems (tracking actual cards dealt vs. your bets)</li>
            </ul>

            <h3 className="text-2xl font-bold mb-4">Counter Databases</h3>
            <p className="text-text-secondary leading-relaxed mb-4">
              Casinos maintain databases of known or suspected counters, shared within casino networks. If banned at one casino, you may find it harder to play at others in the same group.
            </p>
          </section>

          <section id="staying-safe" className="mb-12">
            <h2 className="text-3xl font-bold mb-6">How to Stay Safe While Counting</h2>

            <h3 className="text-2xl font-bold mb-4">1. Vary Your Betting Spread</h3>
            <p className="text-text-secondary leading-relaxed mb-4">
              Sudden large jumps in bets attract attention. Use reasonable spreads (betting 4-8x your base bet at high counts) rather than extreme variations. Some successful counters use a spread of only 1-4x.
            </p>

            <h3 className="text-2xl font-bold mb-4">2. Avoid Perfect Play</h3>
            <p className="text-text-secondary leading-relaxed mb-4">
              Making statistically optimal decisions (following an index chart perfectly) signals counting ability. Make occasional "mistakes" like hitting stiff hands. Look like an ordinary blackjack player.
            </p>

            <h3 className="text-2xl font-bold mb-4">3. Limit Session Length</h3>
            <p className="text-text-secondary leading-relaxed mb-4">
              Longer sessions increase detection risk. Some successful counters limit sessions to 1-2 hours. Play at different times and different casinos.
            </p>

            <h3 className="text-2xl font-bold mb-4">4. Table Selection</h3>
            <p className="text-text-secondary leading-relaxed mb-4">
              Don't always play the best games. Mix in table selection that doesn't make sense for pure advantage, making you look like an ordinary player just "hunting."
            </p>

            <h3 className="text-2xl font-bold mb-4">5. Bankroll Management</h3>
            <p className="text-text-secondary leading-relaxed mb-4">
              Large wins make you memorable to casinos. Build wins gradually across sessions and casinos. Don't win $5,000 at one table—distribute your play.
            </p>

            <h3 className="text-2xl font-bold mb-4">6. Professional Disguise</h3>
            <p className="text-text-secondary leading-relaxed mb-4">
              Dress like a tourist. Appear to be gambling for entertainment. Order drinks (non-alcoholic for clear thinking). Have casual conversations. Act like you're not a serious player.
            </p>

            <h3 className="text-2xl font-bold mb-4">7. Casino Selection</h3>
            <p className="text-text-secondary leading-relaxed mb-4">
              Some casinos are more counter-focused than others. Las Vegas casinos watch for counters far more carefully than regional casinos in less competitive markets. Consider where you play strategically.
            </p>

            <h3 className="text-2xl font-bold mb-4">8. Team Play</h3>
            <p className="text-text-secondary leading-relaxed mb-4">
              Professional counting teams use spotters (making small bets while counting) and big players (betting large only on favorable counts). This reduces any single person's betting variance, which is less suspicious.
            </p>
          </section>

          <section id="international" className="mb-12">
            <h2 className="text-3xl font-bold mb-6">International Variations</h2>

            <h3 className="text-2xl font-bold mb-4">United Kingdom & Europe</h3>
            <p className="text-text-secondary leading-relaxed mb-4">
              Like the United States, card counting is not illegal in the UK or most European countries. Casinos can ban you but cannot prosecute. EU law generally provides stronger consumer protections than US law regarding casino policies.
            </p>

            <h3 className="text-2xl font-bold mb-4">Canada</h3>
            <p className="text-text-secondary leading-relaxed mb-4">
              Card counting is legal in Canada. Casinos can refuse service. Some casinos have been aggressive in counter detection, while others are relatively more tolerant.
            </p>

            <h3 className="text-2xl font-bold mb-4">Australia</h3>
            <p className="text-text-secondary leading-relaxed mb-4">
              Card counting is not explicitly illegal, though casinos can ban players. Australian regulations are generally less counter-focused than Las Vegas.
            </p>

            <h3 className="text-2xl font-bold mb-4">Asia</h3>
            <p className="text-text-secondary leading-relaxed mb-4">
              Laws vary significantly. Some Asian casinos are more counter-aware than others. Always research local regulations before attempting to count in a new jurisdiction.
            </p>
          </section>

          <section id="conclusion" className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Conclusion: Your Rights</h2>
            <div className="bg-surface-secondary rounded-lg p-8 mb-8">
              <h3 className="text-2xl font-bold mb-4">Key Points</h3>
              <ul className="space-y-3 text-text-secondary">
                <li>✓ <strong>Card counting is not illegal</strong> under U.S. federal or state law</li>
                <li>✓ <strong>You cannot be prosecuted</strong> for using your brain to count cards</li>
                <li>✓ <strong>Casinos can ban you</strong> for counting, but this is a business decision, not a legal matter</li>
                <li>✓ <strong>Only external devices are illegal</strong> (computers, phones, hidden technology)</li>
                <li>✓ <strong>Detection is possible but avoidable</strong> with proper discipline and disguise</li>
                <li>✓ <strong>Modern game rules reduce advantage</strong> through more decks and deeper cuts</li>
              </ul>
            </div>

            <p className="text-text-secondary leading-relaxed mb-4">
              The bottom line: Card counting using only your mind is completely legal. However, casinos have both the legal right and the technology to detect and ban you. Success in advantage play requires not just counting ability, but also the discipline to avoid detection.
            </p>

            <p className="text-text-secondary leading-relaxed mb-8">
              If you're interested in developing card counting skills, focus on mastery through proper training. Protocol 21 helps you develop the skills you need to become a successful counter.
            </p>

            <Link href="/download" className="btn btn-primary">
              Start Training with Protocol 21
            </Link>
          </section>
        </div>
      </article>

      {/* Related Articles */}
      <section className="section bg-surface-secondary">
        <div className="container max-w-4xl">
          <h2 className="text-3xl font-bold mb-8">Related Guides</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Link href="/how-to-count-cards" className="border border-surface-tertiary rounded-lg p-6 hover:border-gold-500 transition">
              <h3 className="font-bold mb-2">How to Count Cards</h3>
              <p className="text-text-secondary text-sm">Complete step-by-step guide to learning card counting systems.</p>
            </Link>
            <Link href="/card-counting-practice" className="border border-surface-tertiary rounded-lg p-6 hover:border-gold-500 transition">
              <h3 className="font-bold mb-2">Card Counting Practice</h3>
              <p className="text-text-secondary text-sm">Master effective practice strategies and drills.</p>
            </Link>
            <Link href="/systems" className="border border-surface-tertiary rounded-lg p-6 hover:border-gold-500 transition">
              <h3 className="font-bold mb-2">All Counting Systems</h3>
              <p className="text-text-secondary text-sm">Compare different card counting methodologies.</p>
            </Link>
            <Link href="/about" className="border border-surface-tertiary rounded-lg p-6 hover:border-gold-500 transition">
              <h3 className="font-bold mb-2">About Protocol 21</h3>
              <p className="text-text-secondary text-sm">Learn about our mission and expertise.</p>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
