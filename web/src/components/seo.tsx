import Script from "next/script";

const BASE_URL = "https://protocol21blackjack.com";

export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Protocol 21",
    url: BASE_URL,
    logo: `${BASE_URL}/protocol-21-hero1.webp`,
    sameAs: [
      "https://twitter.com/protocol21app",
      "https://instagram.com/protocol21app",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      email: "support@protocol21blackjack.com",
      contactType: "customer support",
    },
  };

  return (
    <Script id="organization-schema" type="application/ld+json" strategy="afterInteractive">
      {JSON.stringify(schema)}
    </Script>
  );
}

export function WebSiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Protocol 21: Blackjack Card Counting App",
    url: BASE_URL,
    description: "The ultimate blackjack card counting trainer app for iOS and Android.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${BASE_URL}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <Script id="website-schema" type="application/ld+json" strategy="afterInteractive">
      {JSON.stringify(schema)}
    </Script>
  );
}
