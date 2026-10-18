import type { Metadata } from "next";
import "./globals.css";
import { SiteShell } from "@/components/SiteShell";

export const metadata: Metadata = {
  title: { default: "NCSI Freight Supplies | Container Leasing & Global Freight", template: "%s | NCSI Freight Supplies" },
  description: "Factory-direct container leasing and international freight solutions with transparent pricing, reliable delivery, and worldwide coverage.",
  metadataBase: new URL("https://ncsifreightsupplies.com"),
  openGraph: { title: "NCSI Freight Supplies", description: "Asset Integrity. Predictable Transit.", type: "website" }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><SiteShell>{children}</SiteShell></body></html>;
}
