"use client";

import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";
import { LeadForm } from "@/components/LeadForm";
import { TrackingForm } from "@/components/TrackingForm";

type PageKey = "lease-containers" | "freight-services" | "track-shipment" | "request-quote" | "industries" | "about" | "contact";

const pageMeta: Record<PageKey, { eyebrow: string; title: string; accent: string; intro: string; note: string }> = {
  "lease-containers": {
    eyebrow: "EQUIPMENT SOLUTIONS / CONTAINER LEASING",
    title: "The right container.\nReady for your operation.",
    accent: "Container leasing",
    intro: "Practical container solutions for businesses that need dependable equipment, flexible terms, and clear coordination.",
    note: "Tell us your size, quantity, location, and intended lease period so our team can help shape the right option."
  },
  "freight-services": {
    eyebrow: "GLOBAL LOGISTICS / FREIGHT SERVICES",
    title: "Move cargo forward.\nWith clarity at every mile.",
    accent: "Freight services",
    intro: "Coordinate international cargo movement with a service approach built around route planning, responsive communication, and predictable handoffs.",
    note: "Share your origin, destination, cargo details, and preferred timeline to start a conversation with our team."
  },
  "track-shipment": {
    eyebrow: "SHIPMENT VISIBILITY / TRACKING",
    title: "Know your reference.\nKnow your next step.",
    accent: "Shipment tracking",
    intro: "Use your shipment or booking reference to continue to your connected tracking portal, or contact our team for assistance.",
    note: "Live tracking must be connected to the relevant carrier or shipment platform before real-time events can be displayed here."
  },
  "request-quote": {
    eyebrow: "START A CONVERSATION / REQUEST A QUOTE",
    title: "Every shipment starts\nwith the right details.",
    accent: "Request a quote",
    intro: "Tell us what you need to lease or move. Clear details help us understand your requirement and follow up with the right questions.",
    note: "Include container size and quantity, cargo type, origin, destination, and target dates where available."
  },
  industries: {
    eyebrow: "INDUSTRIES / CARGO IN MOTION",
    title: "Built around the way\nyour business moves.",
    accent: "Industries",
    intro: "Different industries have different cargo, equipment, timing, and coordination needs. Start with the operation you run and the challenge you need to solve.",
    note: "Service availability depends on the route, equipment, cargo, and operational requirements."
  },
  about: {
    eyebrow: "ABOUT NCSI / OUR APPROACH",
    title: "Asset integrity.\nPredictable transit.",
    accent: "About NCSI",
    intro: "NCSI Freight Supplies supports container leasing and freight coordination with a focus on practical communication, asset care, and dependable movement.",
    note: "We aim to make the next step clear: understand the requirement, coordinate the details, and keep communication moving."
  },
  contact: {
    eyebrow: "CONTACT / TALK TO OUR TEAM",
    title: "Let’s get your next\nmove underway.",
    accent: "Contact NCSI",
    intro: "Have a leasing requirement, a freight question, or need help with a shipment reference? Send our team the details and we’ll point you in the right direction.",
    note: "For the fastest useful response, include a reference number or the origin, destination, cargo, and timeline."
  }
};

const serviceCards = [
  { icon: "01", title: "Container leasing", copy: "Discuss 20ft and 40ft container requirements, quantities, locations, lease periods, and equipment availability.", href: "/lease-containers", link: "Explore leasing" },
  { icon: "02", title: "Ocean freight", copy: "Coordinate port-to-port movement and shipment handoffs around your origin, destination, cargo, and timing.", href: "/freight-services", link: "Explore freight" },
  { icon: "03", title: "Air freight", copy: "Explore options for time-sensitive cargo and discuss priority, handling, and routing requirements.", href: "/freight-services", link: "Discuss air cargo" },
  { icon: "04", title: "Coordination support", copy: "Bring the relevant shipment details together so next steps, documentation, and handoffs are easier to follow.", href: "/contact", link: "Talk to our team" }
];

const industries = [
  ["Manufacturing & industrial", "Equipment, components, production materials, and planned replenishment."],
  ["Retail & consumer goods", "Inventory movement, seasonal demand, and delivery-window coordination."],
  ["Automotive & machinery", "Parts, machinery, and equipment requirements that need careful handling and planning."],
  ["Importers & exporters", "Cross-border cargo requirements where origin, destination, timelines, and documentation matter."],
  ["Wholesale & distribution", "Repeat movements and stock replenishment across connected suppliers and markets."],
  ["Project cargo enquiries", "Discuss dimensions, weight, handling requirements, and route constraints before planning."]
];

const processSteps = [
  ["01", "Share the requirement", "Tell us what you need to lease or move, including locations, quantity, cargo, and target dates."],
  ["02", "Clarify the details", "We review the information and identify the details needed to discuss suitable options."],
  ["03", "Coordinate the next step", "The team follows up on the requirement, routing or equipment details, and the next actions."]
];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <div className="eyebrow"><span />{children}</div>;
}

function PageHero({ page }: { page: typeof pageMeta[PageKey] }) {
  return <section className="content-hero"><div className="container content-hero-grid">
    <div className="content-hero-copy">
      <Eyebrow>{page.eyebrow}</Eyebrow>
      <h1>{page.title.split("\n").map((line, i) => <span key={line + i}>{i === 1 ? <em>{line}</em> : line}{i === 0 ? <br /> : null}</span>)}</h1>
      <p>{page.intro}</p>
      <div className="hero-actions"><Link className="button button-primary" href="/request-quote">Request a quote <span>↗</span></Link><Link className="button button-secondary" href="/contact">Talk to our team</Link></div>
      <div className="content-hero-proof"><span><b>20 / 40 FT</b> Container options</span><span><b>OCEAN / AIR</b> Freight coordination</span><span><b>ONE TEAM</b> Clear communication</span></div>
    </div>
    <div className="content-hero-art" aria-label="Abstract freight route illustration" role="img">
      <div className="art-orbit orbit-one" /><div className="art-orbit orbit-two" /><div className="art-coordinate coord-top">NCSI / GLOBAL MOVEMENT</div>
      <svg className="art-route" viewBox="0 0 520 430" aria-hidden="true"><defs><linearGradient id="ncsiRoute" x1="0" x2="1"><stop stopColor="#5bd1c2"/><stop offset="1" stopColor="#b7e8e1"/></linearGradient></defs><path d="M52 315 C105 80 195 80 253 205 S383 350 468 102" fill="none" stroke="url(#ncsiRoute)" strokeWidth="2" strokeDasharray="5 8"/><path d="M52 315 C105 80 195 80 253 205 S383 350 468 102" fill="none" stroke="#9ce5db" strokeWidth="15" opacity=".09"/><circle cx="52" cy="315" r="9" fill="#6dd6c8"/><circle cx="253" cy="205" r="9" fill="#d9f5ef"/><circle cx="468" cy="102" r="9" fill="#6dd6c8"/><circle cx="52" cy="315" r="18" fill="none" stroke="#6dd6c8" opacity=".4"/><circle cx="253" cy="205" r="18" fill="none" stroke="#d9f5ef" opacity=".4"/><circle cx="468" cy="102" r="18" fill="none" stroke="#6dd6c8" opacity=".4"/></svg>
      <div className="art-cargo"><div className="cargo-crane"><i/><i/><i/></div><div className="cargo-boxes"><i/><i/><i/><i/><i/><i/></div><div className="cargo-hull"/></div>
      <div className="art-coordinate coord-left">ORIGIN<br/><b>01</b></div><div className="art-coordinate coord-right">DESTINATION<br/><b>02</b></div>
      <div className="art-caption"><span className="art-live-dot" /> ROUTE COORDINATION <b>IN MOTION</b></div>
    </div>
  </div></section>;
}

function CTA() {
  return <section className="cta-band"><div className="container cta-inner"><div><Eyebrow>YOUR NEXT MOVE</Eyebrow><h2>Have a shipment or equipment requirement?</h2><p>Start with the details you have. We’ll help clarify what’s needed next.</p></div><Link className="button button-light" href="/request-quote">Start an enquiry <span>↗</span></Link></div></section>;
}

function ServicesGrid() {
  return <div className="feature-grid">{serviceCards.map(card => <article className="feature-card content-feature" key={card.title}><span className="feature-icon">{card.icon}</span><h3>{card.title}</h3><p>{card.copy}</p><Link className="text-link" href={card.href}>{card.link} ↗</Link></article>)}</div>;
}

function Process() {
  return <div className="steps-grid">{processSteps.map(step => <article key={step[0]}><b>{step[0]}</b><h3>{step[1]}</h3><p>{step[2]}</p></article>)}</div>;
}

function QuoteForm({ contact = false }: { contact?: boolean }) {
  return <div className="form-card"><div className="form-card-heading"><span>{contact ? "CONTACT NCSI" : "TELL US WHAT YOU NEED"}</span><h2>{contact ? "How can we help?" : "Build your enquiry"}</h2><p>{contact ? "Share your question or requirement and include any useful shipment details." : "A few practical details help us understand the scope of your request."}</p></div><LeadForm kind={contact ? "contact" : "quote"} buttonLabel={contact ? "Send message" : "Submit quote request"} /></div>;
}

export function ContentPages({ slug }: { slug: string }) {
  const key = (slug || "home") as PageKey;
  if (!(key in pageMeta)) return <SiteShell><section className="simple-hero"><div className="container"><Eyebrow>NCSI FREIGHT SUPPLIES</Eyebrow><h1>We couldn’t find that page.</h1><p>Use the links below to explore our container leasing and freight services.</p><div className="hero-actions"><Link className="button button-primary" href="/">Back to home ↗</Link><Link className="button button-secondary" href="/contact">Contact NCSI</Link></div></div></section><section className="section"><div className="container"><ServicesGrid /></div></section></SiteShell>;

  const page = pageMeta[key];
  return <SiteShell>
    <PageHero page={page} />
    {key === "lease-containers" && <>
      <section className="section section-white"><div className="container"><div className="section-heading"><Eyebrow>CONTAINER OPTIONS</Eyebrow><h2>Equipment for the way <em>you operate.</em></h2><p>Start with your intended use and location. We’ll clarify specifications and availability as part of the enquiry.</p></div><div className="feature-grid"><article className="feature-card"><span className="feature-icon">20</span><h3>20ft containers</h3><p>Discuss compact capacity requirements, equipment condition, quantity, location, and lease term.</p></article><article className="feature-card"><span className="feature-icon">40</span><h3>40ft containers</h3><p>Discuss larger-volume requirements, placement, planned duration, and operational needs.</p></article><article className="feature-card"><span className="feature-icon">↗</span><h3>Requirement-led options</h3><p>Share your intended use, destination, timing, and any handling or delivery constraints.</p></article></div></div></section>
      <section className="section section-tint"><div className="container split-section"><div><div className="section-heading"><Eyebrow>HOW LEASING STARTS</Eyebrow><h2>Clear details. <em>Better decisions.</em></h2><p>Container requirements can vary by location and use. We start by understanding the need instead of assuming one option fits every operation.</p></div><ul className="content-checklist"><li>Container size and quantity</li><li>Required location and intended use</li><li>Lease period and target start date</li><li>Delivery, collection, or handling considerations</li></ul><Link className="button button-primary" href="/request-quote">Discuss container leasing ↗</Link></div><div className="content-note-panel"><span>LEASING BRIEF / 01</span><strong>20ft / 40ft</strong><p>Equipment options discussed around your location, quantity, and intended operating period.</p><div className="panel-line" /><small>Availability and terms are confirmed during enquiry.</small></div></div></section>
    </>}
    {key === "freight-services" && <>
      <section className="section section-white"><div className="container"><div className="section-heading"><Eyebrow>FREIGHT MODES</Eyebrow><h2>Choose the movement that <em>fits the cargo.</em></h2><p>Every shipment has different priorities. Discuss route, timing, cargo characteristics, and handoffs with the team.</p></div><ServicesGrid /></div></section>
      <section className="section section-tint"><div className="container"><div className="section-heading"><Eyebrow>FROM ORIGIN TO DESTINATION</Eyebrow><h2>A coordinated process, <em>not guesswork.</em></h2></div><Process /><p className="muted content-disclaimer">Service scope, routing, transit expectations, and documentation requirements are confirmed against the specific shipment.</p></div></section>
    </>}
    {key === "track-shipment" && <>
      <section className="section section-white"><div className="container tracking-layout"><div><div className="section-heading"><Eyebrow>LOOK UP A SHIPMENT</Eyebrow><h2>Enter your booking or shipment reference.</h2><p>Use the reference issued by your carrier or NCSI contact. If a tracking portal is configured, you’ll be sent there with your reference.</p></div><div className="tracking-card"><TrackingForm /></div><p className="muted">Need help? Email <a href="mailto:info@ncsifreightsupplies.com">info@ncsifreightsupplies.com</a> or call <a href="tel:+918248084706">+91 8248084706</a>.</p></div><aside className="content-note-panel"><span>TRACKING STATUS</span><strong>Portal connection required</strong><p>This website does not invent shipment milestones. Live status appears only after a real carrier or tracking system is connected.</p><div className="panel-line" /><small>Have your booking number, bill of lading, or airway bill reference ready.</small></aside></div></section>
      <section className="trust-strip"><div className="container trust-grid"><div><b>01</b> Enter your reference</div><div><b>02</b> Open connected portal</div><div><b>03</b> Contact us if you need help</div><div><b>✓</b> No fabricated live statuses</div></div></section>
    </>}
    {key === "request-quote" && <section className="section section-white"><div className="container quote-layout"><div><div className="section-heading"><Eyebrow>QUOTE REQUEST CHECKLIST</Eyebrow><h2>Give us the details you <em>already have.</em></h2><p>You don’t need every answer to begin. Include what you know and our team can follow up on missing details.</p></div><ul className="content-checklist"><li>Origin and destination</li><li>Cargo type, weight, dimensions, or volume</li><li>Container size and quantity, if applicable</li><li>Preferred dates and timing flexibility</li><li>Special handling or documentation needs</li></ul><div className="quote-contact-note"><b>Prefer email?</b><p><a href="mailto:info@ncsifreightsupplies.com">info@ncsifreightsupplies.com</a><br/><a href="tel:+918248084706">+91 8248084706</a></p></div></div><QuoteForm /></div></section>}
    {key === "industries" && <>
      <section className="section section-white"><div className="container"><div className="section-heading"><Eyebrow>WHO WE SUPPORT</Eyebrow><h2>Logistics shaped around <em>real operations.</em></h2><p>Use these starting points to describe the cargo and operating context. Requirements are assessed individually.</p></div><div className="industry-grid">{industries.map((item,i)=><article key={item[0]}><span>0{i+1}</span><h3>{item[0]}</h3><p>{item[1]}</p></article>)}</div></div></section>
      <section className="section section-tint"><div className="container split-section"><div><div className="section-heading"><Eyebrow>START WITH THE REQUIREMENT</Eyebrow><h2>Tell us what your operation <em>needs to move.</em></h2><p>Share the cargo, route, timing, and any constraints. We can then discuss the most relevant service conversation.</p></div><Link className="button button-primary" href="/request-quote">Share your requirement ↗</Link></div><div className="content-note-panel"><span>WHAT HELPS US PLAN</span><strong>Cargo + Route + Timing</strong><p>Useful information up front helps clarify the scope and the questions that need answering next.</p></div></div></section>
    </>}
    {key === "about" && <>
      <section className="section section-white"><div className="container split-section"><div><div className="section-heading"><Eyebrow>OUR WORKING PRINCIPLES</Eyebrow><h2>Practical logistics. <em>Clear communication.</em></h2><p>NCSI Freight Supplies brings container leasing and freight coordination together around the details that matter to each enquiry: asset requirements, route, timing, and handoffs.</p></div><p className="body-copy">Our approach is to start with the real operating requirement, clarify constraints early, and keep the next step visible. Specific services, availability, transit estimates, and commercial terms are confirmed for each enquiry rather than assumed.</p></div><div className="about-principles"><article><b>01</b><div><h3>Asset integrity</h3><p>Discuss equipment needs and condition requirements before committing to a solution.</p></div></article><article><b>02</b><div><h3>Predictable coordination</h3><p>Make origins, destinations, timing, and handoffs part of the conversation from the start.</p></div></article><article><b>03</b><div><h3>Responsive communication</h3><p>Keep information and next actions clear as the requirement develops.</p></div></article></div></div></section>
      <section className="trust-strip"><div className="container trust-grid"><div><b>01</b> Understand the need</div><div><b>02</b> Clarify the details</div><div><b>03</b> Coordinate next steps</div><div><b>↗</b> Stay in contact</div></div></section>
    </>}
    {key === "contact" && <section className="section section-white"><div className="container"><div className="section-heading"><Eyebrow>CONTACT DETAILS</Eyebrow><h2>Choose the best way to <em>reach us.</em></h2><p>Send a message using the form or contact the team directly. For shipment enquiries, include your reference number.</p></div><div className="contact-layout"><div className="contact-details"><article><span>EMAIL</span><h3>Email the team</h3><p><a href="mailto:info@ncsifreightsupplies.com">info@ncsifreightsupplies.com</a></p></article><article><span>PHONE</span><h3>Call NCSI</h3><p><a href="tel:+918248084706">+91 8248084706</a></p></article><article><span>ENQUIRY</span><h3>Container leasing & freight</h3><p>Share your route, equipment needs, cargo, and preferred timeline.</p></article><article><span>SHIPMENT SUPPORT</span><h3>Have a reference ready</h3><p>Include your booking or shipment reference so we can understand the context.</p></article></div><QuoteForm contact /></div></div></section>}
    {key !== "contact" && key !== "request-quote" && key !== "track-shipment" && <section className="section section-white"><div className="container"><div className="section-heading"><Eyebrow>THE NEXT STEP</Eyebrow><h2>Let’s talk through <em>your requirement.</em></h2><p>{page.note}</p></div><Process /></div></section>}
    <CTA />
  </SiteShell>;
}
