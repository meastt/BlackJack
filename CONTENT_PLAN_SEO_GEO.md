# Protocol 21: App Launch Content Strategy (2026)

> **Context:** This document serves as the master blueprint for the "Protocol 21" website. It contains the keyword strategy, site architecture, data schemas, and prompt instructions for AI agents to generate high-ranking content.
> **App Niche:** Mobile Blackjack Card Counting Trainer (iOS & Android).
> **Launch Date:** January 2026.

---

## 1. Master Keyword Database
*Use these keywords to optimize Titles, H1s, and Meta Data.*

### Cluster A: High-Intent App Downloads (Transactional)
*Target: Homepage, Store Landing Pages*

| Keyword | Vol (Est) | Intent | Context |
| :--- | :--- | :--- | :--- |
| **blackjack card counting app** | 5,000 | Primary | The "Holy Grail" keyword. |
| **card counting app** | 4,000 | Primary | Broad intent. |
| **blackjack trainer app** | 2,500 | Primary | Focus on "training" features. |
| **card counting trainer** | 2,000 | Tool | Software specific. |
| **best card counting app** | 1,500 | Comparison | Needs social proof/reviews. |
| **blackjack practice app** | 1,800 | Practice | Broader (strategy + counting). |
| **free card counting app** | 900 | Price | Capture with "Free Trial" messaging. |
| **card counting simulator** | 700 | Game | Implies playable interface. |

### Cluster B: Platform & Features (Long-Tail)
*Target: OS Pages, Feature Highlights*

| Keyword | Vol (Est) | Intent | Context |
| :--- | :--- | :--- | :--- |
| **card counter app iphone** | 800 | iOS | "Download on App Store" CTA. |
| **card counting app android** | 400 | Android | "Get it on Google Play" CTA. |
| **blackjack card counting apk** | 1,000 | Sideload | Technical Android audience. |
| **hi lo card counting app** | 400 | System | Specific to Hi-Lo system users. |
| **blackjack true count app** | 500 | Feature | Wants math help/conversion tools. |
| **mobile blackjack counting app**| 1,000 | Device | Generic mobile intent. |
| **best blackjack trainer app 2026**| 300 | Freshness | Current year intent. |

### Cluster C: Educational (Informational Funnel)
*Target: Blog / Academy*

| Keyword | Vol (Est) | Intent | Context |
| :--- | :--- | :--- | :--- |
| **how to count cards** | 22,000 | Beginner | Top of funnel entry point. |
| **blackjack card counting** | 12,000 | Niche | Core educational term. |
| **is card counting illegal** | 3,500 | Risk | Address fear to remove friction. |
| **card counting practice** | 2,500 | Action | Bridge to app (Interactive Drills). |
| **deck penetration blackjack** | 500 | Advanced | Game selection strategy. |

---

## 2. Site Architecture & Content Types

### A. Static Core Pages (Manual High-Value)
| URL Path | Page Type | Primary Keyword | H1 Strategy |
| :--- | :--- | :--- | :--- |
| `/` | Homepage | "Blackjack Card Counting App" | Protocol 21: The Pro Blackjack Trainer App |
| `/features` | Product | "Blackjack Trainer Features" | Features: Drills, Systems & Stats |
| `/download/ios` | Landing | "Card Counter App iPhone" | Download Protocol 21 for iOS |
| `/download/android` | Landing | "Card Counting App Android" | Download Protocol 21 for Android |

### B. Programmatic Collections (pSEO)
*These pages are generated dynamically using the datasets below.*

1.  **Systems Collection:** `/systems/[slug]` (Target: "How to learn [System Name]")
2.  **Drills Collection:** `/drills/[slug]` (Target: "[Skill] practice drills")
3.  **Comparisons:** `/vs/[competitor]` (Target: "[Competitor] alternative")

---

## 3. Data Schemas (The "Brain" for the AI)

### Dataset: Systems (`systems.json`)
*Use this data to generate specific pages for different counting methods.*

```json
[
  {
    "id": "hilo",
    "system_name": "Hi-Lo",
    "slug": "hi-lo-card-counting-app",
    "difficulty_level": "Beginner",
    "count_type": "Balanced",
    "tags": ["Level 1", "Most Popular", "Standard"],
    "seo_title": "Hi-Lo Card Counting App | Protocol 21 Blackjack Trainer",
    "seo_desc": "Master the famous Hi-Lo card counting system. Protocol 21 provides the specific +1/-1 drills you need to learn Hi-Lo for iOS and Android.",
    "pain_point": "keeping the running count during fast deals"
  },
  {
    "id": "ko",
    "system_name": "KO (Knock-Out)",
    "slug": "ko-card-counting-app",
    "difficulty_level": "Beginner",
    "count_type": "Unbalanced",
    "tags": ["Level 1", "No True Count", "Easiest"],
    "seo_title": "KO (Knock-Out) Blackjack System App & Trainer",
    "seo_desc": "Learn the Knock-Out (KO) system without the math. Protocol 21 is the best app for unbalanced counting systems on mobile.",
    "pain_point": "converting to true count (which KO eliminates)"
  },
  {
    "id": "omega2",
    "system_name": "Omega II",
    "slug": "omega-ii-card-counting-app",
    "difficulty_level": "Advanced",
    "count_type": "Balanced",
    "tags": ["Level 2", "High Efficiency", "Ace Side Count"],
    "seo_title": "Omega II Card Counting Trainer | Advanced Blackjack App",
    "seo_desc": "Practice the complex Omega II system with Protocol 21. Our advanced mode supports Level 2 values and Ace side-counts.",
    "pain_point": "memorizing the complex Level 2 card values"
  },
  {
    "id": "zen",
    "system_name": "Zen Count",
    "slug": "zen-count-blackjack-app",
    "difficulty_level": "Intermediate",
    "count_type": "Balanced",
    "tags": ["Level 2", "Old School", "Powerful"],
    "seo_title": "Zen Count Blackjack Trainer App",
    "seo_desc": "The Zen Count requires precision. Use Protocol 21's custom drills to master this powerful Level 2 balanced system.",
    "pain_point": "maintaining speed with multi-value cards"
  },
  {
    "id": "red7",
    "system_name": "Red 7",
    "slug": "red-7-card-counting-app",
    "difficulty_level": "Beginner",
    "count_type": "Unbalanced",
    "tags": ["Level 1", "Arnold Snyder", "Simple"],
    "seo_title": "Red 7 Card Counting App | Learn Unbalanced Counting",
    "seo_desc": "Learn Arnold Snyder's Red 7 system. Protocol 21 helps you practice the color-dependent starting counts unique to this system.",
    "pain_point": "remembering the pivot points"
  },
  {
    "id": "halves",
    "system_name": "Wong Halves",
    "slug": "wong-halves-counting-app",
    "difficulty_level": "Expert",
    "count_type": "Balanced",
    "tags": ["Level 3", "Fractional", "Hardest"],
    "seo_title": "Wong Halves Blackjack Trainer | Expert Counting App",
    "seo_desc": "Wong Halves is the hardest system to master. Protocol 21 is the only app that supports fractional values for expert drills.",
    "pain_point": "calculating fractional values (.5) on the fly"
  }
]

Dataset: Drills (drills.json)
Use this data to generate pages about specific training exercises.

[
  {
    "drill_name": "True Count Conversion",
    "slug": "blackjack-true-count-practice",
    "target_skill": "Mental Math",
    "seo_title": "Blackjack True Count Trainer App",
    "pain_point": "dividing the running count by decks remaining instantly"
  },
  {
    "drill_name": "Deck Estimation",
    "slug": "deck-estimation-drills",
    "target_skill": "Visual Accuracy",
    "seo_title": "Deck Penetration & Estimation Drills",
    "pain_point": "guessing how many decks are in the discard tray"
  },
  {
    "drill_name": "Speed Count",
    "slug": "card-counting-speed-drills",
    "target_skill": "Reaction Time",
    "seo_title": "Card Counting Speed Simulator",
    "pain_point": "losing the count when the dealer speeds up"
  }
]


4. AI Content Generation Prompts
Copy these instructions into your AI Agent (Cursor/Windsurf) to generate the actual page content.

Prompt 1: Generating System Pages
"Act as a specialist in Blackjack SEO and App Marketing. I will provide you with a JSON object representing a specific Card Counting System (e.g., Hi-Lo, KO).
Your Goal: Write a full Markdown page content for this system.
Structure:

Hook: Acknowledge the user wants to learn {system_name} but highlight the specific {pain_point} associated with it.

The Solution: Introduce 'Protocol 21' as the only app that has a dedicated preset for {system_name}. Mention it handles the {count_type} logic automatically.

How to Practice: Describe a 3-step routine using the app to master {system_name} (Step 1: Learn Values, Step 2: Slow Drills, Step 3: Casino Speed).

CTA: 'Download Protocol 21 to master {system_name} today.'

Tone: Professional, encouraging, authoritative. No fluff."

Prompt 2: Generating Drill Pages
"Act as a Blackjack Coach. I will provide a JSON object for a specific Drill (e.g., True Count, Speed).
Your Goal: Write a landing page convincing the user that manual practice (flashcards) is obsolete.
Structure:

Problem: Explain why {pain_point} causes people to lose money in casinos.

Fix: Explain how the Protocol 21 app isolates this specific skill in the {drill_name} module.

SEO: Ensure the keyword {drill_name} appears in the first 100 words.

Technical: Mention that the app simulates real casino conditions for {target_skill}."

5. Technical SEO Checklist (Post-Generation)
 Cross-Linking: Ensure every /systems/ page links back to the Home Page with anchor text "Blackjack Card Counting App".
 Schema Markup: Inject SoftwareApplication JSON-LD schema into the <head> of the Homepage.
 ASO Alignment: Ensure the H1s of the landing pages match the exact keywords used in the Apple App Store "Keywords" field.
 Smart Banners: Add <meta name="apple-itunes-app" content="app-id=YOUR_ID"> to all mobile views.

