import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import { OrganizationSchema, WebSiteSchema } from "@/components/seo";

const BASE_URL = "https://protocol21blackjack.com";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0f",
};

export const metadata: Metadata = {
  title: {
    default: "Protocol 21: Best Blackjack Card Counting App & Trainer (2026)",
    template: "%s | Protocol 21",
  },
  description: "Master card counting with Protocol 21, the #1 blackjack trainer app for iOS & Android. Learn Hi-Lo, KO, Omega II systems. Practice true count drills, speed counting & deck estimation. Free download.",
  keywords: [
    "blackjack card counting app",
    "card counting trainer",
    "Hi-Lo card counting",
    "blackjack trainer app",
    "card counting practice",
    "true count calculator",
    "blackjack strategy app",
    "learn card counting",
    "KO counting system",
    "Omega II blackjack",
    "card counting iOS",
    "card counting Android",
    "blackjack advantage play",
    "casino card counting",
    "best card counting app 2026",
  ],
  authors: [{ name: "Protocol 21 Team", url: BASE_URL }],
  creator: "TechRidgeSEO",
  publisher: "Protocol 21",
  formatDetection: {
    email: false,
    telephone: false,
  },
  openGraph: {
    title: "Protocol 21: Best Blackjack Card Counting App & Trainer",
    description: "Master card counting with Protocol 21. Learn Hi-Lo, KO, Omega II systems. Casino-grade drills for iOS & Android. Free download.",
    url: BASE_URL,
    siteName: "Protocol 21",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: `${BASE_URL}/protocol-21-hero1.webp`,
        width: 1200,
        height: 630,
        alt: "Protocol 21 Blackjack Card Counting App",
        type: "image/webp",
      },
      {
        url: `${BASE_URL}/best-guide-to-blackjack-card-couting-apps-FI.webp`,
        width: 1200,
        height: 630,
        alt: "Best Guide to Blackjack Card Counting Apps",
        type: "image/webp",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Protocol 21: Best Blackjack Card Counting App",
    description: "Master card counting with Protocol 21. Learn Hi-Lo, KO, Omega II. Casino-grade drills for iOS & Android.",
    images: [`${BASE_URL}/protocol-21-hero1.webp`],
    creator: "@protocol21app",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: BASE_URL,
  },
  category: "Games",
  classification: "Card Counting Training Software",
  metadataBase: new URL(BASE_URL),
  other: {
    "apple-itunes-app": "app-id=XXXXXXXXX",
    "google-play-app": "app-id=com.protocol21.app",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <OrganizationSchema />
        <WebSiteSchema />
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-5P3CB205H1"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-5P3CB205H1');
          `}
        </Script>
      </head>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
