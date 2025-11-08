import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./(public)/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jet Flow Orchestrator",
  description: "Build, manage, and orchestrate your workflows seamlessly",
  icons: {
    icon: "/favicon.ico",
  },

};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div id="root-layout-container">
          {children}
        </div>
      </body>
    </html>
  );
}
