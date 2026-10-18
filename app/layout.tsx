import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "NCSI Freight Supplies — Inside Global Trade", template: "%s | NCSI Freight Supplies" },
  description: "Enter an immersive journey through container leasing and global freight. Asset integrity. Predictable transit.",
  metadataBase: new URL("https://ncsifreightsupplies.com"),
  openGraph: { title: "NCSI Freight Supplies", description: "Asset Integrity. Predictable transit.", type: "website" }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
