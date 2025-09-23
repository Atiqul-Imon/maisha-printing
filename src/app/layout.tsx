import type { Metadata } from "next";
import { Inter, Roboto } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppWidget from "@/components/WhatsAppWidget";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: "Maisha Printing - Professional Printing Services in Bangladesh",
  description: "Professional printing services in Bangladesh. We print t-shirts, glass, calendars, ID cards, ribbons, stickers, visiting cards, flyers, brochures and more for businesses.",
  keywords: "printing, Bangladesh, t-shirt printing, calendar printing, ID card printing, visiting card, flyer, brochure, business printing",
  authors: [{ name: "Maisha Printing" }],
  creator: "Maisha Printing",
  publisher: "Maisha Printing",
  robots: "index, follow",
  openGraph: {
    title: "Maisha Printing - Professional Printing Services in Bangladesh",
    description: "Professional printing services in Bangladesh. We print t-shirts, glass, calendars, ID cards, ribbons, stickers, visiting cards, flyers, brochures and more for businesses.",
    url: "https://maishaprinting.com",
    siteName: "Maisha Printing",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Maisha Printing - Professional Printing Services in Bangladesh",
    description: "Professional printing services in Bangladesh. We print t-shirts, glass, calendars, ID cards, ribbons, stickers, visiting cards, flyers, brochures and more for businesses.",
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${roboto.variable} antialiased`}
      >
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <WhatsAppWidget />
      </body>
    </html>
  );
}
