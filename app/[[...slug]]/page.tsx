import type { Metadata } from "next";
import { ImmersiveWorld } from "@/components/ImmersiveWorld";

export const metadata: Metadata = {
  title: "NCSI Freight Supplies — Inside Global Trade",
  description: "Enter an immersive journey through container leasing and global freight. Asset integrity. Predictable transit."
};

export function generateStaticParams() {
  return ["lease-containers", "freight-services", "track-shipment", "request-quote", "industries", "about", "contact", "about-us", "request-a-quote"].map((slug) => ({ slug: [slug] }));
}

export default function Page() {
  return <ImmersiveWorld />;
}
