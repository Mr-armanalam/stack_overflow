import React from "react";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import '../styles/prism.css';
/* eslint-disable camelcase */
import { Inter, Space_Grotesk } from "next/font/google";
import type { Metadata } from "next";
import { ThemeProvider } from "@/context/ThemeProvider";
/* eslint-enable camelcase */

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-spaceGrotesk",
});

export const metadata: Metadata = {
  title: "DevFlow",
  description:
    "A community-driven platform for asking and answering programming questions. Get help, share knowledge, and collaorate with developers from around the world.Explore topics in web development and more",
  icons: {
    icon: "/assets/images/site-logo.svg",
  },
  creator: "Arman Alam",
  authors: [{ name: "Arman Alam", url: "https://armanalam.vercel.app/" }],
  applicationName: "DevFlow",
  openGraph: {
    type: "website",
    url: "https://stack-overflow-gray.vercel.app/",
    images: "/home_page.png",
    countryName: "India",
    emails: 'armanalam78578@gmail.com'
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${spaceGrotesk.variable}`}>
        <ClerkProvider dynamic
          appearance={{
            elements: {
              formButtonPrimary: "primary-gradient",
              footerActionLink: "primary-text-gradient hover:text-primary-500",
            },
          }}
        >
          <ThemeProvider>{children}</ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
