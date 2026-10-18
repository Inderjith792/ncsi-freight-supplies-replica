import type { Metadata } from "next";
import { ImmersiveWorld } from "@/components/ImmersiveWorld";
import { ContentPages } from "@/components/ContentPages";

type RouteParams = { slug?: string[] };

const titles: Record<string, { title: string; description: string }> = {
  "lease-containers": { title: "Container Leasing", description: "Explore 20ft and 40ft container leasing requirements with NCSI Freight Supplies." },
  "freight-services": { title: "Freight Services", description: "Discuss ocean freight, air freight, and freight coordination with NCSI Freight Supplies." },
  "track-shipment": { title: "Track a Shipment", description: "Continue to your connected shipment tracking portal or contact NCSI for assistance." },
  "request-quote": { title: "Request a Quote", description: "Share your container leasing or freight requirements with NCSI Freight Supplies." },
  "industries": { title: "Industries", description: "Explore freight and container solutions for different operating requirements." },
  "about": { title: "About NCSI", description: "Learn about the NCSI Freight Supplies approach to asset integrity and predictable transit." },
  "contact": { title: "Contact NCSI", description: "Contact NCSI Freight Supplies about container leasing, freight, or shipment enquiries." }
};

export async function generateMetadata({ params }: { params: Promise<RouteParams> }): Promise<Metadata> {
  const { slug = [] } = await params;
  const route = slug[0] || "";
  const page = titles[route];
  if (!page) return {
    title: "NCSI Freight Supplies — Inside Global Trade",
    description: "Enter an immersive journey through container leasing and global freight. Asset integrity. Predictable transit."
  };
  return { title: page.title, description: page.description };
}

export function generateStaticParams() {
  return ["lease-containers", "freight-services", "track-shipment", "request-quote", "industries", "about", "contact"].map((slug) => ({ slug: [slug] }));
}

export default async function Page({ params }: { params: Promise<RouteParams> }) {
  const { slug = [] } = await params;
  if (slug.length === 0) return <ImmersiveWorld />;
  return <ContentPages slug={slug[0]} />;
}
