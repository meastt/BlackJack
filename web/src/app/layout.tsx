import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Protocol 21: Blackjack Card Counting App & Trainer",
  description: "Download Protocol 21, the best blackjack card counting trainer for iOS and Android. Master Hi-Lo, practice true count drills, and beat the dealer with our pro simulator.",
  keywords: ["blackjack", "card counting", "Hi-Lo", "blackjack trainer", "card counting app", "iOS", "Android", "true count", "casino"],
  authors: [{ name: "TechRidgeSEO" }],
  openGraph: {
    title: "Protocol 21: Blackjack Card Counting App & Trainer",
    description: "Download Protocol 21, the best blackjack card counting trainer for iOS and Android. Master Hi-Lo, practice true count drills, and beat the dealer with our pro simulator.",
    url: "https://protocol21blackjack.com",
    siteName: "Protocol 21",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Protocol 21: Blackjack Card Counting App & Trainer",
    description: "Download Protocol 21, the best blackjack card counting trainer for iOS and Android. Master Hi-Lo, practice true count drills, and beat the dealer with our pro simulator.",
  },
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL("https://protocol21blackjack.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
