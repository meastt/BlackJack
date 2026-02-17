import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs, ArticleSchema } from "@/components/seo";

const BASE_URL = "https://protocol21blackjack.com";

export const metadata: Metadata = {
  title: "Protocol 21 Features - Advanced Card Counting Training Tools",
  description: "Explore Protocol 21's comprehensive features: true count drills, speed counting, deck estimation, casino simulation, progress tracking, and support for 6 counting systems.",
  alternates: {
    canonical: `${BASE_URL}/features`,
  },
  openGraph: {
    title: "Protocol 21 Features - Card Counting Training Tools",
    description: "Master advanced card counting with casino-grade drills, real-time feedback, and scientifically-designed training modules.",
    url: `${BASE_URL}/features`,
    type: "website",
  },
};

export default function FeaturesPage() {
  const features = [
    {
      title: "True Count Conversion Drills",
      description: "Master the critical skill of converting running count to true count. Practice with realistic deck penetration, varying shoe sizes, and rapid-fire card sequences.",
      icon: "🎯",
    },
    {
      title: "Speed Counting Practice",
      description: "Train your counting speed to match real casino dealer pace. Progressive difficulty levels start slow and increase to tournament-speed dealing.",
      icon: "⚡",
    },
    {
      title: "Deck Estimation Training",
      description: "Accurately estimate remaining deck using multiple methodologies. Essential for betting spreads and game selection at casino tables.",
      icon: "📊",
    },
    {
      title: "Casino Noise Simulation",
      description: "Practice counting with realistic casino audio including music, crowd noise, dealer banter, and table distractions. Train like you'll play.",
      icon: "🔊",
    },
    {
      title: "Six Counting Systems",
      description: "Master Hi-Lo, KO, Zen Count, Red 7, Omega II, and Wong Halves. Each system with complete training from basics to advanced application.",
      icon: "🧮",
    },
    {
      title: "Real-Time Analytics",
      description: "Track accuracy percentage, counting speed, true count precision, and improvement trends. Data-driven insights help you identify skill gaps.",
      icon: "📈",
    },
    {
      title: "Progressive Difficulty",
      description: "Start as a beginner and advance through carefully-designed skill levels. Each level builds on previous mastery with incrementally harder challenges.",
      icon: "📚",
    },
    {
      title: "Offline Mode",
      description: "Download and train anywhere without internet. All casino-grade drills are available offline for practicing on the go.",
      icon: "📱",
    },
    {
      title: "Session History",
      description: "Review past training sessions with detailed performance metrics. Identify patterns, track long-term improvement, and pinpoint areas for focused practice.",
      icon: "📋",
    },
    {
      title: "Customizable Drill Settings",
      description: "Adjust deck size, penetration, dealer speed, shoe velocity, and other variables to match specific casino conditions you'll face.",
      icon: "⚙️",
    },
    {
      title: "Cross-Platform Sync",
      description: "Train on iPhone, iPad, or Android. Your progress, statistics, and selected systems sync seamlessly across all devices.",
      icon: "🔄",
    },
    {
      title: "Community & Support",
      description: "Access tutorials, system guides, strategy articles, and connect with other advantage players learning card counting.",
      icon: "👥",
    },
  ];

  return (
    <main className="min-h-screen">
      <ArticleSchema
        title="Protocol 21 Features - Advanced Card Counting Training"
        description="Complete feature overview of Protocol 21's card counting trainer app including drills, analytics, and casino simulation."
        url={`${BASE_URL}/features`}
        datePublished="2024-01-15"
      />

      <section className="hero py-16 md:py-24">
        <div className="container">
          <Breadcrumbs
            items={[
              { name: "Home", url: "/" },
              { name: "Features", url: "/features" },
            ]}
            className="mb-8"
          />

          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-gradient-gold">Protocol 21 Features</span>
            </h1>
            <p className="text-xl text-text-secondary leading-relaxed mb-8">
              Complete professional-grade card counting training platform with casino-realistic drills, advanced analytics, and support for every major counting system.
            </p>

            <Link href="/download" className="btn btn-primary">
              Download Free
            </Link>
          </div>
        </div>
      </section>

      {/* Core Training Features */}
      <section className="section">
        <div className="container max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">Core Training Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="border border-surface-tertiary rounded-lg p-6 hover:border-text-secondary transition">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-bold mb-3">{feature.title}</h3>
                <p className="text-text-secondary leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Drill Types Section */}
      <section className="section bg-surface-secondary">
        <div className="container max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Specialized Drill Types</h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">🎯 True Count Drills</h3>
              <p className="text-text-secondary leading-relaxed mb-4">
                The foundation of professional card counting. Protocol 21 provides intensive true count conversion training with:
              </p>
              <ul className="space-y-2 text-text-secondary ml-4 list-disc">
                <li>Rapid-fire card sequences requiring instant true count calculation</li>
                <li>Realistic deck penetration matching casino conditions</li>
                <li>Variable shoe sizes (single, double, 6-deck, 8-deck)</li>
                <li>Immediate accuracy feedback after each sequence</li>
                <li>Progressive speed increases matching dealer pace</li>
              </ul>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-4">⚡ Speed Counting Drills</h3>
              <p className="text-text-secondary leading-relaxed mb-4">
                Develop casino-ready counting speed with realistic dealer pacing:
              </p>
              <ul className="space-y-2 text-text-secondary ml-4 list-disc">
                <li>Beginner mode: slow practice to build muscle memory</li>
                <li>Intermediate mode: natural table speed</li>
                <li>Advanced mode: tournament-speed dealing</li>
                <li>Speed ramping within single sessions</li>
                <li>Count accuracy maintained at high speeds</li>
              </ul>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-4">📊 Deck Estimation Drills</h3>
              <p className="text-text-secondary leading-relaxed mb-4">
                Master the skill of estimating remaining deck without calculation:
              </p>
              <ul className="space-y-2 text-text-secondary ml-4 list-disc">
                <li>Visual estimation training</li>
                <li>Running count to deck estimation conversion</li>
                <li>Realistic penetration scenarios</li>
                <li>Multiple estimation methodologies</li>
                <li>Accuracy tracking and improvement metrics</li>
              </ul>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-4">🔊 Casino Simulation Mode</h3>
              <p className="text-text-secondary leading-relaxed mb-4">
                Train under realistic casino conditions:
              </p>
              <ul className="space-y-2 text-text-secondary ml-4 list-disc">
                <li>Authentic casino audio background</li>
                <li>Crowd noise and table chatter</li>
                <li>Dealer banter and realistic interactions</li>
                <li>Visual distractions matching floor environment</li>
                <li>Full immersion training experience</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Counting Systems Section */}
      <section className="section">
        <div className="container max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Complete Counting System Support</h2>
          <p className="text-lg text-text-secondary leading-relaxed mb-8">
            Protocol 21 provides comprehensive training for six major card counting systems, from beginner-friendly balanced counts to expert-level fractional systems.
          </p>

          <div className="space-y-6">
            <div className="border-l-4 border-gold-500 pl-6">
              <h3 className="text-xl font-bold mb-2">Hi-Lo System (Beginner)</h3>
              <p className="text-text-secondary">The most popular and easiest balanced counting system. Perfect starting point with simple card values and proven effectiveness.</p>
            </div>

            <div className="border-l-4 border-gold-500 pl-6">
              <h3 className="text-xl font-bold mb-2">KO/Knock-Out System (Beginner)</h3>
              <p className="text-text-secondary">Unbalanced count eliminating true count calculation until end of shoe. Ideal for learning without the complexity of fractional true count conversion.</p>
            </div>

            <div className="border-l-4 border-gold-400 pl-6">
              <h3 className="text-xl font-bold mb-2">Zen Count System (Intermediate)</h3>
              <p className="text-text-secondary">More precise than Hi-Lo with side counts for aces. Offers better betting accuracy with moderate complexity increase.</p>
            </div>

            <div className="border-l-4 border-gold-400 pl-6">
              <h3 className="text-xl font-bold mb-2">Red 7 System (Intermediate)</h3>
              <p className="text-text-secondary">Unbalanced count using red sevens as +1. Eliminates true count conversion complexity while maintaining good accuracy.</p>
            </div>

            <div className="border-l-4 border-gold-300 pl-6">
              <h3 className="text-xl font-bold mb-2">Omega II System (Advanced)</h3>
              <p className="text-text-secondary">Fractional counting system with greater precision. Requires side counts for aces and deuces, highest betting accuracy.</p>
            </div>

            <div className="border-l-4 border-gold-300 pl-6">
              <h3 className="text-xl font-bold mb-2">Wong Halves System (Expert)</h3>
              <p className="text-text-secondary">Most complex and precise fractional system ever created. Maximum betting advantage with multiple side counts and fraction values.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Analytics Section */}
      <section className="section bg-surface-secondary">
        <div className="container max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Advanced Analytics & Tracking</h2>
          <p className="text-lg text-text-secondary leading-relaxed mb-8">
            Protocol 21's comprehensive analytics help you measure progress and identify areas for improvement:
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-bold text-lg">Performance Metrics</h3>
              <ul className="space-y-2 text-text-secondary text-sm">
                <li>✓ Accuracy percentage per session</li>
                <li>✓ Speed (cards per minute)</li>
                <li>✓ True count precision</li>
                <li>✓ Consistency score</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="font-bold text-lg">Progress Tracking</h3>
              <ul className="space-y-2 text-text-secondary text-sm">
                <li>✓ Long-term improvement trends</li>
                <li>✓ System mastery levels</li>
                <li>✓ Milestone achievements</li>
                <li>✓ Personal best records</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="font-bold text-lg">Detailed Reports</h3>
              <ul className="space-y-2 text-text-secondary text-sm">
                <li>✓ Session history with full metrics</li>
                <li>✓ Error analysis by card value</li>
                <li>✓ Performance by drill type</li>
                <li>✓ Comparison to previous sessions</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="font-bold text-lg">Readiness Assessment</h3>
              <ul className="space-y-2 text-text-secondary text-sm">
                <li>✓ Casino readiness score</li>
                <li>✓ System mastery verification</li>
                <li>✓ Skill gap identification</li>
                <li>✓ Improvement suggestions</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section">
        <div className="container max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Master Card Counting?</h2>
          <p className="text-lg text-text-secondary leading-relaxed mb-8 max-w-2xl mx-auto">
            Protocol 21 combines professional-grade training tools with proven card counting systems. Download free today and start your path to advantage play.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/download" className="btn btn-primary">
              Download Protocol 21
            </Link>
            <Link href="/systems" className="btn btn-outline">
              Learn Systems
            </Link>
            <Link href="/blog" className="btn btn-outline">
              Read Guides
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
