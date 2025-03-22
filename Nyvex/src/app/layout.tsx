import { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import { ThirdwebProvider } from "thirdweb/react";
import { Navbar } from "@/components/component/Navbar";
import { cn } from "@/lib/utils";
import { StateContextProvider } from "@/context";
import Head from "next/head";

const fontHeading = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-heading",
});

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat',
  weight: ['300', '400', '500', '600', '700', '800'],
});


const fontBody = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "NYVEX",
  description:
    "Invest into your favourite startups with cryptocurrency. Get started with NYVEX today.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${montserrat.variable}`}>
      <Head>
        <link rel="icon" href="/favicon3.ico" />
      </Head>
      <body
        className={cn("antialiased", fontHeading.variable, fontBody.variable, montserrat.variable)}
        style={{ fontFamily: 'var(--font-montserrat)' }}
      >
        <ThirdwebProvider>
          <StateContextProvider>
            <Navbar />
            {children}
          </StateContextProvider>
        </ThirdwebProvider>
      </body>
    </html>
  );
}
