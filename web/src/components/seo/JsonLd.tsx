// JSON-LD Schema Components for SEO
// These components inject structured data into pages for rich snippets

const BASE_URL = 'https://protocol21blackjack.com'

interface OrganizationSchemaProps {
  name?: string
  url?: string
  logo?: string
  sameAs?: string[]
}

export function OrganizationSchema({
  name = 'Protocol 21',
  url = BASE_URL,
  logo = `${BASE_URL}/images/protocol-21-logo.webp`,
  sameAs = [
    'https://twitter.com/protocol21app',
    'https://www.instagram.com/protocol21app',
    'https://www.youtube.com/@protocol21app',
  ],
}: OrganizationSchemaProps = {}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url,
    logo,
    description: 'The leading blackjack card counting trainer app for iOS and Android. Master card counting systems with casino-grade drills.',
    foundingDate: '2024',
    sameAs,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      url: `${BASE_URL}/contact`,
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function WebSiteSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Protocol 21',
    alternateName: 'Protocol 21 Blackjack Card Counting App',
    url: BASE_URL,
    description: 'The best blackjack card counting trainer app for iOS and Android. Master Hi-Lo, KO, Omega II, and more counting systems.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/blog?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Protocol 21',
      url: BASE_URL,
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface SoftwareApplicationSchemaProps {
  platform: 'iOS' | 'Android' | 'Web'
  downloadUrl?: string
}

export function SoftwareApplicationSchema({ platform, downloadUrl }: SoftwareApplicationSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Protocol 21',
    applicationCategory: 'GameApplication',
    applicationSubCategory: 'Card Counting Trainer',
    operatingSystem: platform,
    downloadUrl: downloadUrl || (platform === 'iOS'
      ? 'https://apps.apple.com/app/protocol-21'
      : 'https://play.google.com/store/apps/details?id=com.protocol21'),
    version: '1.0.0',
    releaseNotes: 'Full-featured blackjack card counting trainer with advanced counting systems and casino-grade drills.',
    datePublished: '2024-01-01',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '1250',
      bestRating: '5',
      worstRating: '1',
    },
    description: 'Master blackjack card counting with Protocol 21. Casino-grade drills, multiple counting systems, and true count practice.',
    screenshot: `${BASE_URL}/images/protocol-21-hero1.webp`,
    featureList: [
      'Hi-Lo Card Counting System',
      'KO (Knock-Out) System',
      'Omega II Advanced System',
      'Zen Count System',
      'Red 7 Unbalanced System',
      'Wong Halves Expert System',
      'True Count Conversion Drills',
      'Speed Counting Practice',
      'Deck Estimation Training',
      'Casino Noise Simulation',
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface BlogPostingSchemaProps {
  title: string
  description: string
  slug: string
  datePublished: string
  dateModified?: string
  author?: string
  image?: string
  readTime?: string
}

export function BlogPostingSchema({
  title,
  description,
  slug,
  datePublished,
  dateModified,
  author = 'Protocol 21 Team',
  image,
  readTime,
}: BlogPostingSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    url: `${BASE_URL}/${slug}`,
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      '@type': 'Person',
      name: author,
      url: BASE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Protocol 21',
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/images/protocol-21-logo.webp`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${BASE_URL}/${slug}`,
    },
    ...(image && {
      image: {
        '@type': 'ImageObject',
        url: image.startsWith('http') ? image : `${BASE_URL}${image}`,
      },
    }),
    ...(readTime && {
      timeRequired: `PT${parseInt(readTime)}M`,
    }),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface ArticleSchemaProps {
  title: string
  description: string
  url: string
  datePublished?: string
  dateModified?: string
  image?: string
}

export function ArticleSchema({
  title,
  description,
  url,
  datePublished = new Date().toISOString(),
  dateModified,
  image,
}: ArticleSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url,
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      '@type': 'Organization',
      name: 'Protocol 21',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Protocol 21',
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/images/protocol-21-logo.webp`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    ...(image && {
      image: {
        '@type': 'ImageObject',
        url: image.startsWith('http') ? image : `${BASE_URL}${image}`,
      },
    }),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface BreadcrumbItem {
  name: string
  url: string
}

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[]
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${BASE_URL}${item.url}`,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface FAQItem {
  question: string
  answer: string
}

interface FAQSchemaProps {
  items: FAQItem[]
}

export function FAQSchema({ items }: FAQSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface HowToStep {
  name: string
  text: string
  image?: string
}

interface HowToSchemaProps {
  name: string
  description: string
  steps: HowToStep[]
  totalTime?: string
}

export function HowToSchema({ name, description, steps, totalTime }: HowToSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    ...(totalTime && { totalTime }),
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
      ...(step.image && {
        image: {
          '@type': 'ImageObject',
          url: step.image.startsWith('http') ? step.image : `${BASE_URL}${step.image}`,
        },
      }),
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface CourseSchemaProps {
  name: string
  description: string
  provider?: string
  url: string
}

export function CourseSchema({
  name,
  description,
  provider = 'Protocol 21',
  url,
}: CourseSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name,
    description,
    provider: {
      '@type': 'Organization',
      name: provider,
      url: BASE_URL,
    },
    url,
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'online',
      courseWorkload: 'PT30H',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface DefinedTermSchemaProps {
  term: string
  definition: string
  url?: string
  sameAs?: string[]
}

export function DefinedTermSchema({
  term,
  definition,
  url,
  sameAs,
}: DefinedTermSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: term,
    description: definition,
    ...(url && { url }),
    ...(sameAs && { sameAs }),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
