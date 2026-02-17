# Protocol 21: SEO Audit & Domination Action Plan

> **Date:** February 17, 2026
> **Domain:** protocol21blackjack.com
> **Niche:** Blackjack Card Counting Trainer App (iOS & Android)
> **Scope:** Full technical + content audit, pSEO expansion, GEO/AEO strategy for AI-era search

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Current State Audit](#2-current-state-audit)
   - 2.1 Technical SEO
   - 2.2 Content Inventory
   - 2.3 Schema & Structured Data
   - 2.4 Site Architecture
   - 2.5 Performance & Core Web Vitals
3. [GSC Data Analysis](#3-gsc-data-analysis)
4. [Competitive Landscape](#4-competitive-landscape)
5. [Gap Analysis & Critical Issues](#5-gap-analysis--critical-issues)
6. [Action Plan: Traditional SEO](#6-action-plan-traditional-seo)
7. [Action Plan: pSEO (Programmatic SEO)](#7-action-plan-pseo-programmatic-seo)
8. [Action Plan: GEO (Generative Engine Optimization)](#8-action-plan-geo-generative-engine-optimization)
9. [Action Plan: AEO (Answer Engine Optimization)](#9-action-plan-aeo-answer-engine-optimization)
10. [Content Calendar & Priority Matrix](#10-content-calendar--priority-matrix)
11. [KPIs & Measurement](#11-kpis--measurement)
12. [Technical Implementation Checklist](#12-technical-implementation-checklist)

---

## 1. Executive Summary

Protocol 21 is a new Next.js 16 marketing site launched January 2026 for a blackjack card counting trainer app. The site has a strong technical foundation with comprehensive JSON-LD schema (8 types), a dynamic sitemap, proper robots.txt with AI bot allowlisting, and 34 total indexed pages. However, it is severely underweight on content depth, missing several high-volume keyword targets, and has zero pSEO or competitor comparison pages despite the original plan calling for them.

**The opportunity is massive.** The "blackjack card counting app" micro-niche has low domain authority competition, high-intent commercial queries, and a long tail of educational queries (e.g., "how to count cards" at 22K monthly volume) that no single app is dominating with quality content. Additionally, the AI search landscape (ChatGPT Search, Google AI Overviews, Perplexity) is creating a new surface where well-structured, authoritative, citation-worthy content gets pulled directly into answers.

**Bottom line:** The site needs to go from 34 pages to 120+ pages, fix several critical technical gaps, and structure all content for triple-surface visibility: traditional SERPs, AI Overviews, and conversational AI search.

---

## 2. Current State Audit

### 2.1 Technical SEO

| Element | Status | Grade | Notes |
|---|---|---|---|
| **Framework** | Next.js 16 (App Router, SSR/SSG) | A | Excellent for SEO. Server-rendered HTML. |
| **Sitemap** | Dynamic, auto-generated from data files | A | All 34 pages included with priorities. |
| **robots.txt** | Configured, AI bots explicitly allowed | A | GPTBot, Google-Extended, CCBot, anthropic-ai all allowed. |
| **Canonical URLs** | Set on all key pages | A | Properly configured per-page. |
| **Meta Titles** | Unique per page, template pattern `%s \| Protocol 21` | B+ | Some system pages could use more keyword variation. |
| **Meta Descriptions** | Unique per page | B+ | Good, but some are under 120 chars. |
| **Open Graph Tags** | Full OG set on all pages | A | Images, titles, descriptions all configured. |
| **Twitter Cards** | `summary_large_image` on all pages | A | Properly configured. |
| **Schema Markup (JSON-LD)** | 8 schema types implemented | A | Organization, WebSite, SoftwareApplication, BlogPosting, Article, Breadcrumb, FAQ, HowTo, Course. |
| **Breadcrumbs** | Visual + schema on inner pages | A | Good UX and crawl signal. |
| **Google Analytics** | GA4 (G-5P3CB205H1) | B | Loaded with `beforeInteractive` -- see issue below. |
| **Apple Smart Banner** | `app-id=XXXXXXXXX` (PLACEHOLDER) | F | **CRITICAL: Placeholder not replaced with real App Store ID.** |
| **Google Play App ID** | `com.protocol21.app` | B | Verify this matches actual Play Store listing. |
| **Hreflang** | Not set | N/A | Single-language site, not needed. |
| **Image Optimization** | WebP format, Next.js Image component | A- | Some images missing descriptive filenames. |
| **404 Page** | Custom not-found.tsx | A | Exists. |
| **HTTPS** | Yes | A | Domain is HTTPS. |
| **next.config.ts** | Minimal config | C | Missing security headers, redirects, image domains config. |

#### Critical Technical Issues

1. **Apple iTunes App Meta Tag is a Placeholder**
   - File: `web/src/app/layout.tsx:102`
   - Current: `"apple-itunes-app": "app-id=XXXXXXXXX"`
   - Impact: Smart App Banners do not work. Zero iOS deep-link traffic from Safari.
   - Fix: Replace with actual Apple App Store ID.

2. **GA4 Loaded with `beforeInteractive`**
   - File: `web/src/app/layout.tsx:117-130`
   - `beforeInteractive` injects the script before Next.js hydration, which can block First Contentful Paint and hurt Core Web Vitals (LCP, FID).
   - Fix: Change to `afterInteractive` (default) or `lazyOnload` for better page speed scores.

3. **No Security/Performance Headers in next.config.ts**
   - File: `web/next.config.ts`
   - Missing: `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Content-Security-Policy`, `Strict-Transport-Security`.
   - Missing: Cache-control headers for static assets.
   - Missing: Image remote patterns configuration.

4. **No Separate /download/ios and /download/android Pages**
   - The original content plan specified separate OS landing pages targeting "card counter app iphone" (800 vol) and "card counting app android" (400 vol).
   - Currently only `/download` exists.
   - Impact: Missing two high-intent, platform-specific keyword targets.

5. **No /features Page**
   - Listed in original plan as a core static page targeting "blackjack trainer features."
   - Does not exist.

### 2.2 Content Inventory

| Content Type | Count | Route Pattern | Avg. Word Count | Quality |
|---|---|---|---|---|
| **Homepage** | 1 | `/` | ~400 (visible text) | B+ -- strong hero, FAQ section, but thin body copy |
| **Blog Posts** | 17 | `/[slug]` | ~300-2500 | Mixed -- 1 cornerstone (2500w), rest are thin (300-500w) |
| **System Pages** | 6 | `/systems/[slug]` | ~250 | C -- Template-generated, thin content |
| **Drill Pages** | 3 | `/drills/[slug]` | ~150 | C- -- Very thin, need expansion |
| **Systems Hub** | 1 | `/systems` | ~200 | B -- Good comparison table |
| **Drills Hub** | 1 | `/drills` | ~100 | C -- Listing only |
| **Blog Hub** | 1 | `/blog` | ~100 | B -- Featured/all split |
| **Download** | 1 | `/download` | ~300 | B+ -- Good CTA structure, FAQ |
| **Simulator** | 1 | `/simulator` | Unknown | Not audited |
| **Privacy** | 1 | `/privacy` | Legal boilerplate | N/A |
| **Terms** | 1 | `/terms` | Legal boilerplate | N/A |
| **TOTAL** | **34 pages** | | | |

#### Content Strengths
- One genuinely excellent cornerstone article: "The Ultimate Guide to Blackjack Card Counting Apps (2026 Edition)" at ~2,500 words with images, sections, and strong internal linking.
- FAQ sections on homepage and download page with schema markup.
- System pages include HowTo schema for practice routines.
- All blog content has proper date metadata and author attribution.

#### Content Weaknesses
1. **15 of 17 blog posts are thin** (under 500 words). Google considers <1,000 words thin content for informational queries. These risk being classified as "unhelpful content" under the Helpful Content System.
2. **No standalone content for highest-volume keywords:**
   - "how to count cards" (22,000 vol) -- no dedicated page
   - "blackjack card counting" (12,000 vol) -- no hub page
   - "is card counting illegal" (3,500 vol) -- no dedicated page
3. **All posts dated January 2026** -- no freshness signals, no publication cadence.
4. **Zero internal links between blog posts.** Each post is an island. Google cannot establish topical authority without a connected content web.
5. **No competitor comparison content** (`/vs/` pages) despite being in the original plan.
6. **No author bio pages or E-E-A-T signals.** No "About Us" page. No credentials displayed. Google's quality raters look for author expertise, especially in YMYL-adjacent niches (gambling involves money).
7. **Blog content stored as flat strings in JSON.** This limits formatting to basic markdown (## headings, bold, links). No H3s, no tables, no embedded media, no code blocks.

### 2.3 Schema & Structured Data (Detailed)

| Schema Type | Where Used | Quality | Issues |
|---|---|---|---|
| **Organization** | Global (layout.tsx) | B | Missing `sameAs` URLs (social profiles). No `foundingDate`, `address`, or `description`. |
| **WebSite** | Global (layout.tsx) | B+ | SearchAction configured (good for sitelinks searchbox). |
| **SoftwareApplication** | Homepage, Download page | B+ | `aggregateRating` present (4.8/5, 1250 reviews). Verify these match real store ratings. |
| **BlogPosting** | Each blog post | A- | Full article metadata. Missing `wordCount`, `articleSection`. |
| **Article** | System pages | B | Generic. Should be more specific (`TechArticle` or `LearningResource`). |
| **BreadcrumbList** | All inner pages | A | Correct implementation. |
| **FAQPage** | Homepage, Download | A | Proper Q&A format. |
| **HowTo** | System pages | A- | Steps present. Missing `estimatedCost`, `tool` (the app itself). |
| **Course** | Systems hub | B | Basic implementation. Missing `coursePrerequisites`, `educationalLevel`. |
| **Missing: VideoObject** | N/A | F | If any video content exists or is planned, this is critical. |
| **Missing: Review/Rating** | N/A | C | No individual review snippets beyond aggregate rating. |

### 2.4 Site Architecture

```
protocol21blackjack.com/
|
|-- /                              [Homepage - "blackjack card counting app"]
|-- /blog                          [Blog Hub - "card counting blog"]
|   |-- /[slug]                    [17 Blog Posts]
|
|-- /systems                       [Systems Hub - "card counting systems"]
|   |-- /systems/[slug]            [6 System Pages]
|
|-- /drills                        [Drills Hub - "card counting drills"]
|   |-- /drills/[slug]             [3 Drill Pages]
|
|-- /download                      [Download Page - "card counting app download"]
|-- /simulator                     [Web Simulator]
|-- /privacy                       [Privacy Policy]
|-- /terms                         [Terms of Service]
|
|-- MISSING: /features             [Features Page]
|-- MISSING: /download/ios         [iOS Landing Page]
|-- MISSING: /download/android     [Android Landing Page]
|-- MISSING: /vs/[competitor]      [Competitor Comparisons]
|-- MISSING: /about                [About / E-E-A-T Page]
|-- MISSING: /glossary             [Terminology/Glossary]
```

**Architecture Issues:**
- Blog posts live at root level (`/[slug]`) instead of `/blog/[slug]`. This is fine for SEO but creates URL ambiguity with potential future root-level pages.
- No topical hub-and-spoke structure. Blog posts don't link to each other or to system/drill pages.
- No breadcrumb trail connects blog posts back to their category clusters.

### 2.5 Performance & Core Web Vitals (Estimated)

| Metric | Expected Status | Risk Factor |
|---|---|---|
| **LCP** | At Risk | Hero images are large WebP files. `beforeInteractive` GA4 script blocks render. |
| **FID/INP** | Good | Minimal JavaScript interactivity. SSR/SSG helps. |
| **CLS** | Good | Next.js Image component handles dimensions. |
| **TTFB** | Good | Static generation via `generateStaticParams`. |
| **Page Size** | Watch | Multiple large WebP images per page. No lazy loading on below-fold images. |

---

## 3. GSC Data Analysis

**Status: No Google Search Console export data was found in the repository.**

This is expected for a site launched in January 2026 (roughly 3 weeks old at time of audit). The site is likely still in the Google indexing sandbox.

### What to Expect (Week 1-8 Trajectory for New Sites)

| Timeframe | Expected GSC Status |
|---|---|
| Weeks 1-2 | Sitemap submitted, pages crawled but few indexed. Impressions near zero. |
| Weeks 3-4 | Core pages begin indexing. Impressions trickle in (10-50/day) for branded and long-tail queries. |
| Weeks 5-8 | Blog content starts ranking page 3-5 for educational keywords. Download page may appear for "protocol 21" branded queries. |
| Months 3-6 | First page rankings possible for low-competition long-tails. pSEO pages begin accumulating impressions. |

### Immediate GSC Actions Required

- [ ] Verify domain ownership in Google Search Console
- [ ] Submit sitemap: `https://protocol21blackjack.com/sitemap.xml`
- [ ] Request indexing for top 10 priority pages manually
- [ ] Set up GSC export to BigQuery or CSV for monthly reporting
- [ ] Connect GSC to GA4 for search query attribution
- [ ] Monitor Index Coverage report for crawl errors
- [ ] Set up Bing Webmaster Tools (Bing powers ChatGPT search results)
- [ ] Submit to Yandex Webmaster (if targeting international)

---

## 4. Competitive Landscape

### Direct Competitors (Card Counting Apps)

| Competitor | Domain Authority (Est.) | Pages Indexed | Key Strength |
|---|---|---|---|
| **Card Counter Lite** (various) | Low (10-20) | 5-15 | App Store presence, not web SEO |
| **Blackjack Apprenticeship** | High (40-50) | 200+ | Massive content library, YouTube presence, courses |
| **BJSTRAT.net** | Medium (30-40) | 100+ | Comprehensive strategy charts, reference authority |
| **Wizard of Odds** | Very High (60+) | 1000+ | Encyclopedia-level content, decades of authority |
| **Casino.org / Gambling sites** | Very High (70+) | 10000+ | Pure domain authority, thin blackjack content |

### Key Insight

**Blackjack Apprenticeship is the real competitor.** They own the "blackjack card counting" educational space with video content, courses, and a mature blog. However, they are a course-first business, not an app-first business. Protocol 21's advantage is being a *tool* with supporting content, not a content site trying to sell a course.

**The gap to exploit:** No one is dominating the "blackjack card counting *app*" keyword cluster with deep, authoritative content specifically about training software. The app-specific queries are underserved.

---

## 5. Gap Analysis & Critical Issues

### Priority 1: Fix Now (Technical Blockers)

| # | Issue | Impact | Effort |
|---|---|---|---|
| 1 | Replace Apple iTunes app-id placeholder | Zero iOS Smart Banner traffic | 5 min |
| 2 | Change GA4 from `beforeInteractive` to `afterInteractive` | CWV (LCP) penalty | 5 min |
| 3 | Add security headers to next.config.ts | Security + minor ranking signal | 30 min |
| 4 | Verify GSC ownership and submit sitemap | Cannot monitor indexing | 15 min |
| 5 | Set up Bing Webmaster Tools | Missing ChatGPT Search surface | 15 min |

### Priority 2: Build Soon (Content Gaps)

| # | Gap | Target Keyword | Volume | Difficulty |
|---|---|---|---|---|
| 1 | Dedicated "How to Count Cards" mega-guide | how to count cards | 22,000 | High (but beatable with depth) |
| 2 | "Is Card Counting Illegal?" standalone page | is card counting illegal | 3,500 | Low |
| 3 | Separate `/download/ios` page | card counter app iphone | 800 | Low |
| 4 | Separate `/download/android` page | card counting app android | 400 | Low |
| 5 | `/features` page | blackjack trainer features | 300 | Low |
| 6 | `/about` page (E-E-A-T) | N/A | N/A | Critical for trust |
| 7 | Expand all system pages to 1500+ words | [system name] card counting | 200-500 each | Medium |
| 8 | Expand all drill pages to 1000+ words | [drill name] practice | 100-300 each | Medium |
| 9 | Competitor comparison pages (`/vs/`) | [competitor] alternative | 100-500 each | Low |

### Priority 3: Build for Scale (pSEO Opportunities)

| # | Page Template | Example URL | Est. Pages | Keywords Captured |
|---|---|---|---|---|
| 1 | Competitor vs pages | `/vs/blackjack-apprenticeship` | 8-12 | "[competitor] vs protocol 21" |
| 2 | System comparison pages | `/compare/hi-lo-vs-ko` | 15 | "[system] vs [system]" |
| 3 | "Is card counting legal in [state]" | `/legal/card-counting-nevada` | 50 | "card counting legal [state]" |
| 4 | Casino city guides | `/casinos/las-vegas-card-counting` | 20 | "card counting [city]" |
| 5 | Blackjack terminology/glossary | `/glossary/true-count` | 30+ | "[term] blackjack" |
| 6 | Odds/strategy calculators | `/tools/true-count-calculator` | 5 | "[tool] calculator blackjack" |

---

## 6. Action Plan: Traditional SEO

### Phase 1: Technical Fixes (Week 1)

#### 1.1 Fix Apple App Store ID
```
File: web/src/app/layout.tsx:102
Change: "apple-itunes-app": "app-id=XXXXXXXXX"
To:     "apple-itunes-app": "app-id=YOUR_REAL_APP_ID"
```

#### 1.2 Fix GA4 Loading Strategy
```
File: web/src/app/layout.tsx:117
Change: strategy="beforeInteractive"
To:     strategy="afterInteractive"
```

#### 1.3 Add Security & Performance Headers
Add to `next.config.ts`:
```typescript
headers: async () => [
  {
    source: '/(.*)',
    headers: [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'X-XSS-Protection', value: '1; mode=block' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
    ],
  },
  {
    source: '/images/(.*)',
    headers: [
      { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
    ],
  },
],
```

#### 1.4 Submit to Search Engines
- Google Search Console: Verify + submit sitemap
- Bing Webmaster Tools: Verify + submit sitemap (feeds ChatGPT Search)
- Yep.com: Submit (feeds AI search engines)

### Phase 2: Content Foundation (Weeks 2-4)

#### 2.1 Create Missing Core Pages

**Page: `/about` (E-E-A-T Signal)**
- Who built Protocol 21 and why
- Team credentials (advantage play experience, software engineering)
- Mission statement
- Link to from every page footer
- Target: Brand trust, not keywords

**Page: `/features` (Product Keywords)**
- Primary keyword: "blackjack trainer app features"
- Comprehensive feature list with screenshots
- Comparison table vs generic blackjack apps
- System support matrix
- Drill modes breakdown
- 1500+ words

**Page: `/download/ios` (Platform-Specific)**
- Primary keyword: "card counter app iphone"
- Secondary: "blackjack card counting app ios"
- iOS-specific screenshots, requirements, App Store badge
- Schema: SoftwareApplication with `operatingSystem: "iOS"`

**Page: `/download/android` (Platform-Specific)**
- Primary keyword: "card counting app android"
- Secondary: "blackjack card counting apk"
- Android-specific screenshots, requirements, Play Store badge
- Schema: SoftwareApplication with `operatingSystem: "Android"`

#### 2.2 Create High-Volume Keyword Content

**Page: "How to Count Cards in Blackjack: Complete Beginner Guide" (3000+ words)**
- Target: "how to count cards" (22,000 vol)
- URL: `/how-to-count-cards`
- Structure: Step-by-step, HowTo schema, video embed slot, FAQ section
- Sections: What is counting, why it works, Hi-Lo tutorial, practice method, common mistakes, legal status, next steps (link to app)
- This is the single most important content piece. It must be the definitive guide.

**Page: "Is Card Counting Illegal? The Complete Legal Guide" (2000+ words)**
- Target: "is card counting illegal" (3,500 vol)
- URL: `/is-card-counting-illegal`
- Structure: Direct answer in first paragraph (for featured snippet), state-by-state breakdown, casino policies, court cases, FAQ
- Schema: FAQPage
- This addresses the #1 fear/friction point that stops people from downloading a counting app.

**Page: "Card Counting Practice: How to Train Like a Pro" (2000+ words)**
- Target: "card counting practice" (2,500 vol)
- URL: `/card-counting-practice`
- Bridge content between educational and app download

#### 2.3 Expand Existing Thin Content

**All 6 System Pages** -- expand from ~250 words to 1500+ words each:
- Full history of the system and its creator
- Complete card value chart (table format)
- Detailed true count conversion examples (for balanced systems)
- When to use this system vs alternatives
- Bankroll requirements and bet spreads
- FAQ section with 5+ questions
- Internal links to related blog posts and drill pages

**All 3 Drill Pages** -- expand from ~150 words to 1000+ words each:
- Why this specific skill matters (with math/examples)
- Common mistakes and how to avoid them
- Protocol 21 drill walkthrough with screenshots
- Practice schedule recommendation
- FAQ section

**All 15 thin blog posts** -- expand to 1000+ words minimum:
- Add H3 sub-sections for depth
- Add internal links (minimum 3 per post)
- Add FAQ sections
- Add "Related articles" sections

### Phase 3: Internal Linking Architecture (Week 4-5)

#### Hub-and-Spoke Model

```
                    [Homepage]
                   /    |     \
        [Systems Hub] [Blog Hub] [Drills Hub]
        /   |   \      |    |      /   |   \
    [Hi-Lo][KO]...  [Posts]...  [TC][DE][SC]
        \   |   /      |    |      \   |   /
     [How to Count Cards - Pillar Page]
                   |
        [Is Counting Illegal?]
                   |
          [Card Counting Practice]
                   |
             [Download Page]
```

#### Linking Rules
1. Every system page links to its corresponding blog post AND to the "How to Count Cards" pillar
2. Every blog post links to at least 2 other blog posts, 1 system page, and 1 drill page
3. Every drill page links to 2+ system pages and the download page
4. The "How to Count Cards" pillar links to ALL system and drill pages
5. Every page includes a CTA linking to `/download`
6. Footer includes full sitemap-style links to all major sections

### Phase 4: Off-Page SEO (Ongoing)

1. **App Store Optimization (ASO) alignment** -- ensure App Store and Play Store keywords match H1s on landing pages
2. **Backlink acquisition** -- target blackjack forums, Reddit r/blackjack, gambling strategy sites, and advantage play communities
3. **Digital PR** -- press releases for app launches, updates, and milestones
4. **YouTube** -- create a channel with counting tutorials (video content ranks in Google Universal Search and feeds AI training data)
5. **Social signals** -- X/Twitter account (@protocol21app is referenced in meta), Reddit engagement in r/blackjack and r/gambling

---

## 7. Action Plan: pSEO (Programmatic SEO)

Programmatic SEO is the highest-leverage growth strategy for this niche. Generate dozens of pages from structured data with minimal per-page effort.

### 7.1 Competitor Comparison Pages (`/vs/[competitor]`)

**Template structure:**
```
/vs/blackjack-apprenticeship
/vs/card-counter-lite
/vs/blackjack-simulator
/vs/casino-verite
/vs/speed-count-app
/vs/21-card-counter
/vs/blackjack-card-counting-trainer
/vs/counting-edge
```

**Data schema for `competitors.json`:**
```json
{
  "slug": "blackjack-apprenticeship",
  "name": "Blackjack Apprenticeship",
  "type": "Course + App",
  "price": "$199-$499",
  "systems_supported": ["Hi-Lo"],
  "platforms": ["iOS", "Android", "Web"],
  "drill_modes": false,
  "speed_training": false,
  "casino_simulation": false,
  "seo_title": "Protocol 21 vs Blackjack Apprenticeship: Which Is Better in 2026?",
  "seo_desc": "Compare Protocol 21 and Blackjack Apprenticeship. See which card counting trainer offers more systems, better drills, and real value for advantage players.",
  "target_keyword": "blackjack apprenticeship alternative"
}
```

**Page content structure:**
1. Direct comparison headline (H1 includes both names)
2. Feature comparison table (Protocol 21 vs competitor)
3. Pricing comparison
4. System support comparison
5. User experience comparison
6. Verdict with CTA
7. FAQ: "Is [competitor] better than Protocol 21?", "Is [competitor] free?", etc.
8. Schema: `FAQPage` + `Product` comparison

### 7.2 System vs System Comparison Pages (`/compare/[system1]-vs-[system2]`)

**Generate all meaningful pairings (15 total):**
```
/compare/hi-lo-vs-ko
/compare/hi-lo-vs-omega-ii
/compare/hi-lo-vs-zen-count
/compare/hi-lo-vs-red-7
/compare/hi-lo-vs-wong-halves
/compare/ko-vs-red-7
/compare/ko-vs-omega-ii
/compare/ko-vs-zen-count
/compare/omega-ii-vs-zen-count
/compare/omega-ii-vs-wong-halves
/compare/zen-count-vs-wong-halves
... (all 15 combinations)
```

**Page content structure:**
1. H1: "[System A] vs [System B]: Which Card Counting System Should You Learn?"
2. Quick comparison table (difficulty, accuracy, speed, type)
3. When to choose System A
4. When to choose System B
5. Side-by-side card value charts
6. Protocol 21 training recommendation
7. FAQ section
8. Schema: `FAQPage`

### 7.3 State Legality Pages (`/legal/card-counting-[state]`)

**Generate for all 50 US states + key jurisdictions (55+ pages):**
```
/legal/card-counting-nevada
/legal/card-counting-new-jersey
/legal/card-counting-california
/legal/card-counting-florida
/legal/card-counting-atlantic-city
/legal/card-counting-las-vegas
```

**Data schema for `states.json`:**
```json
{
  "slug": "card-counting-nevada",
  "state": "Nevada",
  "legal_status": "Legal (but casinos can ban you)",
  "notable_casinos": ["Bellagio", "MGM Grand", "Wynn"],
  "shoe_size": "6-8 deck",
  "penetration": "75-85%",
  "heat_level": "High",
  "seo_title": "Is Card Counting Legal in Nevada? (2026 Guide)",
  "seo_desc": "Card counting is legal in Nevada. Learn the rules, casino policies, and best games for advantage players in Las Vegas and Reno."
}
```

**Target keywords:** "is card counting legal in [state]", "card counting [state]", "best blackjack games [state]"

### 7.4 Blackjack Glossary Pages (`/glossary/[term]`)

**Generate 30+ term pages:**
```
/glossary/true-count
/glossary/running-count
/glossary/deck-penetration
/glossary/back-counting
/glossary/wong-in
/glossary/heat
/glossary/barring
/glossary/bet-spread
/glossary/insurance-correlation
/glossary/risk-of-ruin
/glossary/expected-value
/glossary/kelly-criterion
/glossary/shoe
/glossary/cut-card
/glossary/first-base
/glossary/third-base
/glossary/pit-boss
/glossary/eye-in-the-sky
/glossary/basic-strategy
/glossary/index-play
/glossary/illustrious-18
/glossary/fab-4
/glossary/ace-side-count
/glossary/balanced-count
/glossary/unbalanced-count
/glossary/level-1-count
/glossary/level-2-count
/glossary/playing-efficiency
/glossary/betting-correlation
/glossary/insurance-efficiency
```

**Page structure:**
1. H1: "[Term] in Blackjack: What It Means & Why It Matters"
2. Quick definition (first 100 words, optimized for featured snippet)
3. Detailed explanation with examples
4. How it applies to card counting
5. Related terms (internal links to other glossary pages)
6. How Protocol 21 helps you master this concept
7. Schema: `DefinedTerm` (schema.org)

### 7.5 Casino City Guides (`/casinos/[city]`)

**Generate for 15-20 major gambling cities:**
```
/casinos/las-vegas-card-counting
/casinos/atlantic-city-card-counting
/casinos/reno-card-counting
/casinos/biloxi-card-counting
/casinos/macau-card-counting
/casinos/london-card-counting
```

**Target keywords:** "card counting in [city]", "best blackjack tables [city]", "blackjack rules [city]"

### pSEO Total Page Count Projection

| Template | Pages | Priority |
|---|---|---|
| Competitor vs | 8-12 | High |
| System vs System | 15 | High |
| State Legality | 50-55 | Medium |
| Glossary | 30+ | Medium |
| Casino Guides | 15-20 | Low |
| **Total New pSEO Pages** | **118-132** | |

---

## 8. Action Plan: GEO (Generative Engine Optimization)

GEO targets AI-generated answers in Google AI Overviews, ChatGPT Search, Perplexity, and Claude. The goal is to be the source AI models cite when users ask about card counting apps.

### 8.1 Content Structure for AI Extraction

AI models extract answers from content that is:
1. **Directly answering a question** in the first 1-2 sentences
2. **Structured with clear headings** that match common queries
3. **Containing authoritative data points** (statistics, comparisons, definitive statements)
4. **Using natural Q&A format** (matches conversational search patterns)

#### Format Rules for All New Content

- **Every H2 should be phrased as a question or clear topic statement**
  - Bad: "Our Features"
  - Good: "What Features Should a Card Counting App Have?"

- **Every section should begin with a direct, citation-worthy answer**
  - Bad: "There are many things to consider when choosing..."
  - Good: "The best card counting app in 2026 should support at least 3 counting systems (Hi-Lo, KO, and one Level 2 system), offer speed drills up to 0.5 seconds per card, and simulate real casino conditions including ambient noise."

- **Include definitive statements AI models love to cite:**
  - "Protocol 21 supports 6 counting systems including Hi-Lo, KO, Omega II, Zen Count, Red 7, and Wong Halves."
  - "The Hi-Lo system assigns +1 to cards 2-6, 0 to cards 7-9, and -1 to cards 10-A."
  - "Card counting is legal in all 50 US states."

### 8.2 "Definitive Answer" Blocks

Add these structured answer blocks to key pages:

**Homepage (add to FAQ or dedicated section):**
```
Q: What is the best card counting app?
A: Protocol 21 is the most comprehensive card counting trainer available
for iOS and Android as of 2026. It supports 6 counting systems (Hi-Lo,
KO, Omega II, Zen Count, Red 7, Wong Halves), offers casino-grade speed
drills, true count conversion practice, deck estimation training, and
ambient noise simulation. It's free to download with optional Pro features.
```

**System pages (add structured summary):**
```
Q: What is the Hi-Lo card counting system?
A: Hi-Lo (High-Low) is a Level 1 balanced card counting system where
cards 2-6 are counted as +1, cards 7-9 as 0, and cards 10-A as -1.
It was developed by Harvey Dubner in 1963 and refined by Stanford Wong.
It's the most widely used counting system due to its simplicity and
0.97 betting correlation.
```

### 8.3 AI Bot Indexing (Already Configured -- Verify)

The `robots.txt` already allows:
- `GPTBot` (ChatGPT/OpenAI)
- `Google-Extended` (Google AI/Gemini)
- `CCBot` (Common Crawl, used by many AI systems)
- `anthropic-ai` (Claude)

**Additional AI bots to explicitly allow:**
- `PerplexityBot`
- `Bytespider` (TikTok/ByteDance AI)
- `ClaudeBot` (Anthropic's web crawler, different from anthropic-ai)
- `YouBot` (You.com)

### 8.4 Structured Data for AI Consumption

Enhance existing schemas with additional properties that AI models can parse:

**SoftwareApplication schema enhancements:**
- Add `releaseNotes` URL
- Add `softwareVersion`
- Add `datePublished` and `dateModified`
- Add `award` (if any App Store features)
- Add `review` array with individual reviews

**Add `DefinedTerm` schema to glossary pages:**
```json
{
  "@type": "DefinedTerm",
  "name": "True Count",
  "description": "In blackjack card counting, the true count is calculated by dividing the running count by the estimated number of decks remaining in the shoe.",
  "inDefinedTermSet": {
    "@type": "DefinedTermSet",
    "name": "Blackjack Card Counting Glossary"
  }
}
```

### 8.5 LLM.txt / AI Discoverability (Emerging Standard)

Create a `/llms.txt` file at the site root (similar concept to robots.txt for AI):
```
# Protocol 21 - Blackjack Card Counting Trainer App
# https://protocol21blackjack.com

## About
Protocol 21 is a mobile app (iOS and Android) for practicing blackjack
card counting. It supports 6 systems: Hi-Lo, KO, Omega II, Zen Count,
Red 7, and Wong Halves.

## Key Pages
- Homepage: https://protocol21blackjack.com/
- Systems: https://protocol21blackjack.com/systems
- Download: https://protocol21blackjack.com/download
- Blog: https://protocol21blackjack.com/blog

## Contact
support@protocol21blackjack.com
```

---

## 9. Action Plan: AEO (Answer Engine Optimization)

AEO targets featured snippets, People Also Ask (PAA) boxes, Knowledge Panels, and direct answers in Google SERPs.

### 9.1 Featured Snippet Targets

| Target Query | Current Ranking | Snippet Format | Page to Optimize |
|---|---|---|---|
| "what is card counting" | Not ranking | Paragraph | /how-to-count-cards |
| "how to count cards in blackjack" | Not ranking | List (ordered) | /how-to-count-cards |
| "is card counting illegal" | Not ranking | Paragraph | /is-card-counting-illegal |
| "hi-lo card counting system" | Not ranking | Table | /systems/hi-lo-card-counting-app |
| "best card counting app" | Not ranking | List | / (homepage) |
| "true count vs running count" | Not ranking | Paragraph | /glossary/true-count |
| "how to calculate true count" | Not ranking | List (ordered) | /drills/blackjack-true-count-practice |

### 9.2 Snippet-Optimized Content Format

For **paragraph snippets** (definitions):
```html
<p>Card counting is a legal blackjack strategy where players track the
ratio of high cards (10s, face cards, Aces) to low cards (2-6) remaining
in the deck. When more high cards remain, the player has a mathematical
advantage and increases their bets accordingly.</p>
```
- Place this directly after the H2 that matches the query
- Keep it under 300 characters
- Make it a complete, self-contained answer

For **list snippets** (how-to):
```html
<h2>How to Count Cards in Blackjack (Step by Step)</h2>
<ol>
  <li><strong>Learn card values:</strong> Assign +1 to cards 2-6, 0 to 7-9, and -1 to 10-A</li>
  <li><strong>Keep a running count:</strong> Add or subtract as each card is dealt</li>
  <li><strong>Convert to true count:</strong> Divide running count by decks remaining</li>
  <li><strong>Adjust your bets:</strong> Bet more when true count is +2 or higher</li>
  <li><strong>Practice at speed:</strong> Train with Protocol 21 until counting is automatic</li>
</ol>
```

For **table snippets** (comparisons):
```html
<h2>Card Counting Systems Comparison</h2>
<table>
  <tr><th>System</th><th>Level</th><th>Type</th><th>Difficulty</th><th>Best For</th></tr>
  <tr><td>Hi-Lo</td><td>1</td><td>Balanced</td><td>Beginner</td><td>Most players</td></tr>
  <tr><td>KO</td><td>1</td><td>Unbalanced</td><td>Beginner</td><td>No true count math</td></tr>
  ...
</table>
```

### 9.3 People Also Ask (PAA) Targeting

Research and target the full PAA chain for core queries. Each PAA answer should be a section on the relevant page:

**PAA Chain: "how to count cards"**
- How to count cards for beginners?
- Is counting cards illegal?
- Can you actually make money counting cards?
- How long does it take to learn card counting?
- What is the easiest card counting system?
- Do casinos kick you out for counting cards?
- Can you count cards with 6 decks?
- Is there an app to help you count cards?

**PAA Chain: "best card counting app"**
- What is the best app to learn card counting?
- Is there a free card counting app?
- Can you use a card counting app in a casino?
- What is the best card counting system?
- How accurate are card counting apps?
- Is Protocol 21 free? *(goal: appear here)*

Each of these should be an H2 or H3 on the relevant page with a direct answer in the first sentence.

### 9.4 FAQ Expansion

Current FAQ coverage is decent (homepage + download page). Expand to:

1. **Every system page gets 5+ FAQs** specific to that system
2. **Every drill page gets 3+ FAQs** about that skill
3. **Every blog post gets 3+ FAQs** related to the topic
4. **Create a dedicated `/faq` page** that aggregates all FAQs (massive PAA surface area)
5. **All FAQ sections must use `FAQPage` schema markup**

---

## 10. Content Calendar & Priority Matrix

### Month 1 (Weeks 1-4): Foundation

| Week | Task | Pages Created | Priority |
|---|---|---|---|
| 1 | Technical fixes (Sec. 6, Phase 1) | 0 | P0 |
| 1 | Create `/about` page | 1 | P1 |
| 1 | Create `/features` page | 1 | P1 |
| 2 | Create `/download/ios` and `/download/android` | 2 | P1 |
| 2 | Write "How to Count Cards" mega-guide (3000+ words) | 1 | P0 |
| 3 | Write "Is Card Counting Illegal" guide (2000+ words) | 1 | P1 |
| 3 | Write "Card Counting Practice" guide (2000+ words) | 1 | P1 |
| 4 | Expand all 6 system pages to 1500+ words | 0 (rewrites) | P1 |
| 4 | Expand all 3 drill pages to 1000+ words | 0 (rewrites) | P1 |
| **Total** | | **7 new pages** | |

### Month 2 (Weeks 5-8): pSEO Launch

| Week | Task | Pages Created | Priority |
|---|---|---|---|
| 5 | Build competitor comparison template + 4 pages | 4 | P1 |
| 5 | Build system comparison template + 5 pages | 5 | P1 |
| 6 | Complete remaining competitor comparison pages | 4-8 | P2 |
| 6 | Complete remaining system comparison pages | 10 | P2 |
| 7 | Build state legality template + first 10 states | 10 | P2 |
| 7 | Expand 5 thin blog posts to 1000+ words | 0 (rewrites) | P2 |
| 8 | Build glossary template + first 15 terms | 15 | P2 |
| 8 | Expand remaining 10 thin blog posts | 0 (rewrites) | P2 |
| **Total** | | **48-52 new pages** | |

### Month 3 (Weeks 9-12): Scale & Optimize

| Week | Task | Pages Created | Priority |
|---|---|---|---|
| 9-10 | Complete remaining state legality pages (40+) | 40 | P3 |
| 10-11 | Complete remaining glossary pages (15+) | 15 | P3 |
| 11-12 | Build casino city guide template + first 10 cities | 10 | P3 |
| 12 | Internal linking audit and implementation | 0 | P1 |
| 12 | Create dedicated `/faq` aggregation page | 1 | P2 |
| **Total** | | **66 new pages** | |

### Cumulative Page Count

| Milestone | Total Pages | Timeline |
|---|---|---|
| Current | 34 | Now |
| End of Month 1 | 41 | Week 4 |
| End of Month 2 | 89-93 | Week 8 |
| End of Month 3 | 155-159 | Week 12 |
| End of Month 6 (maintenance) | 175+ | Week 24 |

---

## 11. KPIs & Measurement

### Search Visibility KPIs

| KPI | Baseline (Feb 2026) | Month 3 Target | Month 6 Target |
|---|---|---|---|
| Total indexed pages | ~34 | 100+ | 160+ |
| GSC total impressions/day | ~0-50 | 500+ | 2,000+ |
| GSC total clicks/day | ~0-5 | 50+ | 200+ |
| Rankings (top 10) keywords | 0 | 5-10 | 25-40 |
| Rankings (top 3) keywords | 0 | 1-3 | 8-15 |
| Featured snippets owned | 0 | 1-2 | 5-10 |
| Referring domains | 0-5 | 15+ | 40+ |

### App Download KPIs (SEO-Attributed)

| KPI | Baseline | Month 3 Target | Month 6 Target |
|---|---|---|---|
| Organic download page visits/day | ~0 | 30+ | 100+ |
| App Store clicks from website/day | ~0 | 10+ | 40+ |
| Blog-to-download conversion rate | N/A | 2-5% | 5-8% |

### AI Search KPIs

| KPI | Baseline | Month 3 Target | Month 6 Target |
|---|---|---|---|
| ChatGPT mentions when asked "best card counting app" | 0 | Appear in results | Top 3 cited |
| Google AI Overview citations | 0 | 1-3 queries | 10+ queries |
| Perplexity citations | 0 | Appear | Consistent |

### Measurement Tools
- **Google Search Console** -- primary ranking/impression tracking
- **Google Analytics 4** -- traffic, conversion, behavior
- **Bing Webmaster Tools** -- Bing rankings (powers ChatGPT)
- **Ahrefs/Semrush** -- competitive analysis, backlink monitoring
- **Manual AI search testing** -- weekly queries in ChatGPT, Perplexity, Gemini to check citations

---

## 12. Technical Implementation Checklist

### Immediate (This Week)
- [ ] Replace Apple iTunes app-id placeholder (`layout.tsx:102`)
- [ ] Change GA4 to `afterInteractive` (`layout.tsx:117`)
- [ ] Add security headers to `next.config.ts`
- [ ] Verify GSC ownership + submit sitemap
- [ ] Set up Bing Webmaster Tools
- [ ] Add `PerplexityBot` and `ClaudeBot` to robots.txt allow list
- [ ] Verify `SoftwareApplication` schema `aggregateRating` matches real store data

### Content Infrastructure (Week 2)
- [ ] Create `competitors.json` data file for /vs/ pages
- [ ] Create `comparisons.json` data file for system comparison pages
- [ ] Create `states.json` data file for legal pages
- [ ] Create `glossary.json` data file for term pages
- [ ] Build dynamic route templates: `/vs/[slug]`, `/compare/[slug]`, `/legal/[slug]`, `/glossary/[slug]`
- [ ] Add new routes to `sitemap.ts`
- [ ] Create `/about/page.tsx`, `/features/page.tsx`, `/download/ios/page.tsx`, `/download/android/page.tsx`

### Content Quality (Ongoing)
- [ ] Migrate blog content from flat JSON strings to MDX or structured sections for richer formatting
- [ ] Add `wordCount` field to BlogPosting schema
- [ ] Add `articleSection` field to BlogPosting schema
- [ ] Add author bio component to blog posts
- [ ] Add "Related Articles" component to blog posts
- [ ] Add "Table of Contents" component for long-form articles
- [ ] Implement reading progress bar for long-form content

### Schema Enhancements (Week 3)
- [ ] Add `sameAs` to Organization schema (social profile URLs)
- [ ] Add `DefinedTerm` schema for glossary pages
- [ ] Add `Product` schema for competitor comparison pages
- [ ] Upgrade system page schema from `Article` to `LearningResource`
- [ ] Add `Review` schema capability for user testimonials
- [ ] Add `ItemList` schema for systems hub and drills hub pages
- [ ] Add `HowTo` schema to drill pages (currently only on system pages)

### Monitoring (Ongoing)
- [ ] Set up GSC weekly export
- [ ] Set up weekly AI search citation testing (ChatGPT, Perplexity, Google AI Overview)
- [ ] Set up monthly content freshness updates (update dates on key pages)
- [ ] Set up quarterly thin content audits
- [ ] Monitor Core Web Vitals in GSC after GA4 fix

---

## Appendix A: Keyword Master List (Expanded)

### Tier 1: Primary Targets (High Volume, High Intent)

| Keyword | Volume | Current Page | Status |
|---|---|---|---|
| how to count cards | 22,000 | NONE | **NEEDS NEW PAGE** |
| blackjack card counting | 12,000 | /blog (partial) | Needs dedicated hub |
| blackjack card counting app | 5,000 | / (homepage) | Targeting correctly |
| card counting app | 4,000 | / (homepage) | Targeting correctly |
| is card counting illegal | 3,500 | NONE | **NEEDS NEW PAGE** |
| card counting practice | 2,500 | NONE | **NEEDS NEW PAGE** |
| blackjack trainer app | 2,500 | / (homepage) | Targeting correctly |
| card counting trainer | 2,000 | / (homepage) | Targeting correctly |
| blackjack practice app | 1,800 | / (homepage) | Targeting correctly |
| best card counting app | 1,500 | Ultimate Guide post | Targeting correctly |

### Tier 2: Long-Tail / Platform (Medium Volume)

| Keyword | Volume | Current Page | Status |
|---|---|---|---|
| blackjack card counting apk | 1,000 | NONE | Needs /download/android |
| mobile blackjack counting app | 1,000 | NONE | Covered by homepage |
| free card counting app | 900 | Ultimate Guide post | Needs stronger targeting |
| card counter app iphone | 800 | NONE | Needs /download/ios |
| card counting simulator | 700 | /simulator | Verify targeting |
| blackjack true count app | 500 | /drills/blackjack-true-count-practice | Targeting correctly |
| deck penetration blackjack | 500 | /drills/deck-estimation-drills | Needs expansion |
| card counting app android | 400 | NONE | Needs /download/android |
| hi lo card counting app | 400 | /systems/hi-lo-card-counting-app | Targeting correctly |
| best blackjack trainer app 2026 | 300 | / (homepage) | Update H1 for freshness |

### Tier 3: pSEO Long-Tail (Low Volume, High Aggregate)

| Keyword Pattern | Est. Volume Each | Pages Needed |
|---|---|---|
| "[system] vs [system]" | 50-200 | 15 |
| "[competitor] alternative" | 50-300 | 8-12 |
| "is card counting legal in [state]" | 20-200 | 50 |
| "[blackjack term] meaning" | 10-100 | 30+ |
| "card counting in [city]" | 50-500 | 15-20 |

---

## Appendix B: Content Templates

### Blog Post Template (For Expanding Thin Content)

```markdown
# [Title - Include Primary Keyword]

[Opening paragraph: Directly answer the implied question in 2-3 sentences.
Include the primary keyword in the first 100 words. Make this paragraph
citation-worthy for AI extraction.]

## Table of Contents
- [Section 1]
- [Section 2]
- ...

## [H2: Question or Clear Topic - matches PAA/search intent]

[Direct answer paragraph]

[Supporting detail paragraphs with examples, data, comparisons]

### [H3: Sub-topic]

[Detail]

## [H2: Next major section]

...

## How to Practice [Topic] with Protocol 21

[Bridge to app with specific feature callout]

[CTA: Download link]

## Frequently Asked Questions

### [FAQ 1 - matches PAA query]
[Direct answer]

### [FAQ 2]
[Direct answer]

### [FAQ 3]
[Direct answer]

## Related Articles
- [Internal link 1]
- [Internal link 2]
- [Internal link 3]
```

### pSEO Comparison Page Template

```markdown
# [System A] vs [System B]: Which Counting System Is Right for You?

[Direct comparison summary in 2-3 sentences]

## Quick Comparison

| Feature | [System A] | [System B] |
|---|---|---|
| Difficulty | ... | ... |
| Count Type | ... | ... |
| Level | ... | ... |
| Best For | ... | ... |
| True Count Required | ... | ... |

## [System A]: Overview
...

## [System B]: Overview
...

## When to Choose [System A]
...

## When to Choose [System B]
...

## Practice Both in Protocol 21
[CTA]

## FAQ
...
```

---

## Appendix C: robots.txt Update

Update `web/src/app/robots.ts` to include additional AI bots:

```typescript
{
  userAgent: 'PerplexityBot',
  allow: '/',
},
{
  userAgent: 'ClaudeBot',
  allow: '/',
},
{
  userAgent: 'YouBot',
  allow: '/',
},
{
  userAgent: 'Bytespider',
  allow: '/',
},
```

---

*This document is the living master plan. Update it monthly with GSC data, ranking progress, and content completion status.*
