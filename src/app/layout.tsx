import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PitchCraft",
  description:
    "Stop sending generic applications. PitchCraft uses AI to help you write hyper-personalized cold emails that get replies from founders and land you interviews at your dream startups.",
  // You can add more specific keywords for better SEO
  keywords: [
    "AI cold email",
    "job hunt",
    "internship",
    "startup jobs",
    "personalized outreach",
    "career",
    "job application",
  ],

  // Open Graph metadata for social sharing (e.g., Facebook, LinkedIn)
  openGraph: {
    title: "PitchCraft | AI-Powered Outreach to Land Your Dream Job",
    description:
      "Go from cold email to first interview. PitchCraft helps you connect directly with founders and land your dream role.",
    url: "https://pitch-craft-sage.vercel.app", // Use your actual production URL here
    siteName: "PitchCraft",
    // It's highly recommended to add an image for social media previews
    // images: [
    //   {
    //     url: 'https://pitch-craft-sage.vercel.app/og-image.png', // Your OG image URL
    //     width: 1200,
    //     height: 630,
    //     alt: 'PitchCraft - Land your dream job with AI-powered outreach',
    //   },
    // ],
    locale: "en_US",
    type: "website",
  },

  // Twitter card metadata
  twitter: {
    card: "summary_large_image",
    title: "PitchCraft | AI-Powered Outreach to Land Your Dream Job",
    description:
      "Stop sending generic applications. PitchCraft uses AI to help you write hyper-personalized cold emails that get replies from founders.",
    // creator: '@yourTwitterHandle', // Optional: Your Twitter handle
    // images: ['https://pitch-craft-sage.vercel.app/og-image.png'], // Your Twitter card image URL
  },

  // Optional: Add icons for the browser tab
  icons: 'favicon.ico', // Path to your favicon file
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/folder.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
