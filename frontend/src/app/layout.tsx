import type { Metadata } from "next";
import { Providers } from "@/lib/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "ArcPredict — Financial Prediction Markets on Arc",
  description:
    "Predict economic events — ECB rates, FX, crypto — and earn USDC on the Arc blockchain testnet.",
  openGraph: {
    title: "ArcPredict",
    description: "Prediction markets for financial events on Arc testnet",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&family=DM+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-arc-bg text-arc-text font-body antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
