import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import InlineEditor from "../components/InlineEditor";
import SmoothScroll from "../components/SmoothScroll";
import VersionToggle, { VersionProvider } from "../components/VersionToggle";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Unimod Motors — One Engine, Two Solutions",
  description: "A complete rethink of internal combustion — delivering both vehicle propulsion and building energy from a single, multi-fuel opposed-piston platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <VersionProvider>
          {children}
          <VersionToggle />
          <InlineEditor />
          <SmoothScroll />
        </VersionProvider>
      </body>
    </html>
  );
}
