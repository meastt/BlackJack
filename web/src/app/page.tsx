import Link from "next/link";
import systems from "@/data/systems.json";
import drills from "@/data/drills.json";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-background to-surface pt-20 pb-32 border-b border-white/10">
        <div className="container text-center">
          <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-primary/10 border border-primary/20">
            <span className="text-primary text-sm font-semibold tracking-wider uppercase">Protocol 21 - Early Access</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-primary tracking-tight">
            The Pro Blackjack <br /> Trainer App
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Master card counting with casino-grade drills. Whether you use Hi-Lo, KO, or Omega II,
            Protocol 21 is the only trainer built for serious advantage players.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link href="/download/ios" className="btn btn-primary text-lg px-8">
              Download on iOS
            </Link>
            <Link href="/download/android" className="btn btn-outline text-lg px-8">
              Get for Android
            </Link>
          </div>
        </div>
      </section>

      {/* Trust / Stats Stripe */}
      <div className="border-b border-white/5 bg-surface py-8">
        <div className="container flex flex-wrap justify-center gap-12 text-center">
          <div>
            <div className="text-3xl font-bold text-white">99.5%</div>
            <div className="text-sm text-gray-400 uppercase tracking-widest mt-1">Accuracy Goal</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white">6+</div>
            <div className="text-sm text-gray-400 uppercase tracking-widest mt-1">Counting Systems</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white">PRO</div>
            <div className="text-sm text-gray-400 uppercase tracking-widest mt-1">Casino Simulator</div>
          </div>
        </div>
      </div>

      {/* Systems Grid (pSEO Clusters) */}
      <section className="py-24 container">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">Supported Systems</h2>
        <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">
          Don&apos;t just learn to count. Master the specific nuances of your chosen system with dedicated algorithms.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {systems.map((system) => (
            <Link href={`/systems/${system.slug}`} key={system.id} className="group overflow-hidden rounded-xl bg-surface border border-white/5 hover:border-primary transition-colors p-8">
              <div className="flex justify-between items-start mb-4">
                <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${system.difficulty_level === 'Beginner' ? 'bg-green-900/30 text-green-400' :
                    system.difficulty_level === 'Intermediate' ? 'bg-yellow-900/30 text-yellow-400' :
                      'bg-red-900/30 text-red-400'
                  }`}>
                  {system.difficulty_level}
                </span>
                <span className="text-xs text-gray-400">{system.count_type}</span>
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{system.system_name}</h3>
              <p className="text-gray-400 text-sm mb-4">
                {system.seo_desc}
              </p>
              <div className="text-primary text-sm font-semibold flex items-center">
                Start Training <span className="ml-2 group-hover:translate-x-1 transition-transform">&rarr;</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Drills Section */}
      <section className="py-24 bg-surface border-y border-white/5">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center">Advanced Drills</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {drills.map((drill) => (
              <div key={drill.slug} className="p-6 rounded-xl bg-background border border-white/5">
                <h3 className="text-lg font-bold mb-2">{drill.drill_name}</h3>
                <p className="text-gray-400 text-sm mb-4">Targeting: <span className="text-primary">{drill.target_skill}</span></p>
                <p className="text-sm text-gray-500">
                  Solves: &quot;{drill.pain_point}&quot;
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10 text-center text-gray-400 text-sm">
        <div className="container">
          <p className="mb-2">&copy; {new Date().getFullYear()} Protocol 21. All rights reserved.</p>
          <p className="mb-4">
            Built by fellow degens in the desert at{" "}
            <a
              href="https://techridgeseo.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary-light transition-colors"
            >
              TechRidgeSEO
            </a>
          </p>
          <div className="space-x-6">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
