# NCSI Freight Supplies — Global Freight Pulse

Responsive Next.js website concept for NCSI Freight Supplies, with an immersive Three.js homepage and dedicated content for each key route.

## Routes
- `/` — Immersive homepage / Global Freight Pulse journey
- `/lease-containers` — Container leasing options and enquiry checklist
- `/freight-services` — Ocean freight, air freight, and coordination overview
- `/track-shipment` — Tracking portal handoff (requires a real portal URL)
- `/request-quote` — Quote request form and preparation checklist
- `/industries` — Industry-specific logistics requirements
- `/about` — NCSI approach and working principles
- `/contact` — Contact details and enquiry form

Legacy aliases `/about-us` and `/request-a-quote` redirect to the canonical routes.

## Run locally
Requires Node.js 20.9+.

```bash
npm install
npm run dev
```

Before deployment, run `npm run build` and check the site at desktop and mobile widths.

## Integrations and accuracy
The Global Freight Pulse / immersive homepage is an illustrative interactive experience, not a live shipment tracking system. Shipment tracking requires `NEXT_PUBLIC_TRACKING_URL` to point to a real carrier or shipment portal. Forms can use `NEXT_PUBLIC_FORM_ENDPOINT`; without it, the form opens a prefilled email to `info@ncsifreightsupplies.com`. Do not present illustrative routes or artwork as real-time logistics data.

Deploy to Vercel by importing this repository and using the default Next.js build settings. Review the production deployment before changing domain DNS.
