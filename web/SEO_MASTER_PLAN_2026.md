# Protocol 21: SEO Master Plan & Execution Matrix (2026)

**Last Updated:** February 24, 2026  
**Status:** Phase 1 (Technical & Foundation) Complete. Moving to Phase 2 (Pillar Content & GEO Optimization).

This document serves as the single source of truth for the Protocol 21 SEO strategy. It consolidates previous audits and progress reports, and is optimized for traditional Google crawlers (SEO), zero-click snippets (AEO), and LLM-based answer engines like Perplexity and SearchGPT (GEO).

---

## 🤖 1. Crawler Config & Technical Baseline

AI engines only cite what they can scrape. The site architecture is flat, fast, and explicitly welcomes AI web crawlers.

### ✅ Completed Technical Items
- **Robots.txt Optimization:** Configured via `src/app/robots.ts` to explicitly allow `PerplexityBot`, `ClaudeBot`, `Google-Extended`, `GPTBot`, and `OAI-SearchBot`.
- **Dynamic Sitemap:** Configured via `src/app/sitemap.ts` to map all static, system, drill, and blog pages accurately.
- **Web Vitals:** GA4 script loading strategy shifted to `afterInteractive`. Secure headers applied in `next.config.ts`.
- **Base Schema Markup:** Added `OrganizationSchema` and `SoftwareApplicationSchema` with full versioning and founding dates to `JsonLd.tsx`.

---

## 🗺️ 2. The Content Architecture Matrix (Next Steps)

This matrix dictates the URL structure, exact target keywords, and the specific AEO/GEO formats required to win the snippet for our remaining high-priority pages.

| Target URL / Slug | Primary Keyword | Search Intent | AEO/GEO Required Format | Status |
| :--- | :--- | :--- | :--- | :--- |
| `/deck-penetration-blackjack` | deck penetration | Informational / Pro | H2 question + 40-word bolded definition + Mathematical table. | ⏳ Pending |
| `/hi-lo-card-counting-system` | hi-lo system | Educational | Step-by-step numbered list + Interactive value chart (+1, 0, -1). | ⏳ Pending Expansion |
| `/true-count-calculator` | true count conversion | Tool / Utility | Formula block + embedded JS widget + FAQ schema. | ⏳ Pending |
| `/card-counting-trainer-app` | best card counting app | Transactional | Comparison table (Protocol 21 vs. Competitors) + SoftwareApplication Schema. | ⏳ Pending |
| `/bankroll-management-blackjack` | blackjack bankroll | Informational | Risk of Ruin (RoR) data tables + bulleted rules. | ⏳ Pending |

---

## 🧱 3. Agent Prompts for Content Generation

When drafting the actual page content for the matrix above, use this strict constraint system prompt to ensure the pages rank in 2026 LLM and GEO environments.

**System Prompt for Content Agent:**
> "You are an expert technical SEO copywriter and professional blackjack player. Write a 1,500-word pillar page for the keyword [INSERT KEYWORD].
> 
> **Execution Rules:**
> 
> *   **AEO Optimization:** Start the article with a clear `<H2>` question containing the keyword. Immediately follow it with a 40-50 word definitive answer paragraph using `<strong>` tags on the core entities.
> *   **GEO Optimization:** Include high-density facts, mathematical probabilities, and tabular data that LLMs love to parse. Avoid fluff.
> *   **Conversion Hook:** Seamlessly integrate the 'Protocol 21' mobile app into the content as the ultimate tool to practice this specific concept. Mention features like 'offline play', 'Chaos Mode', and 'no scammy in-app coins'.
> *   **Formatting:** Use Markdown. Include at least one data table, three `<h3>` subheadings, and a bulleted list."

---

## 🕸️ 4. Structured Data (JSON-LD) Injections

To win rich snippets, specific schema markup must be injected into the `<head>` of the new pages outlined in the Content Architecture Matrix.

### ✅ Completed Schema Implementations
- Global `OrganizationSchema`
- Global `SoftwareApplicationSchema`
- `ArticleSchema` on `/how-to-count-cards`, `/is-card-counting-illegal`, and `/card-counting-practice`.
- Reusable `DefinedTermSchema` component pre-built for the impending Glossary expansion.

### 🎯 Pending Schema Implementations (Phase 2 Checklist)

- [ ] **Reusable JSON-LD FAQ & Software Component:** Create a reusable Schema component that injects a combined `FAQPage` and `SoftwareApplication` JSON-LD block on all new content pages (specifically the ones in the Content Matrix). 
      *Example Payload:*
      ```json
      {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "SoftwareApplication",
            "name": "Protocol 21: Card Counting Trainer",
            "operatingSystem": "iOS, Android",
            "applicationCategory": "EducationalApplication",
            "offers": {
              "@type": "Offer",
              "price": "4.99",
              "priceCurrency": "USD"
            }
          },
          {
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What is deck penetration in blackjack?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Deck penetration refers to the percentage of cards dealt from the shoe before the dealer shuffles. Higher deck penetration (e.g., 75% or more) provides a mathematical advantage to card counters by revealing more information about the remaining cards."
                }
              }
            ]
          }
        ]
      }
      ```

---

## 🎯 Phase 1 Execution Checklist Recap

- [x] Overwrite robots.txt to explicitly allow AI crawlers. *(Completed via `src/app/robots.ts`)*
- [x] Publish the `/how-to-count-cards` (4,000 words), `/is-card-counting-illegal` (2,800 words), and `/card-counting-practice` (3,200 words) pillar pages.
- [x] Configure Dynamic App Store download routing (`/download/ios`, `/download/android`).
- [x] Implement E-E-A-T principles heavily on the `/about` and `/features` pages.

## 🚀 Phase 2 Execution Checklist (Up Next)

- [ ] Build a reusable JSON-LD schema component for React/Next.js to handle combined FAQ & SoftwareApplication injection.
- [ ] Generate the `/deck-penetration-blackjack` pillar page using the provided prompt and GSC intent data.
- [ ] Implement a "Sticky Download Banner" on all blog/system layouts that routes mobile traffic directly to the App Store/Play Store.
- [ ] Expand the existing 6 System pages and 3 Drill pages to 1000+ words each using the AEO/GEO formats.
- [ ] Develop the highly-interactive HTML/JS **"True Count Converter"** widget to embed on utility pages (Massive signal for SEO rankings).
