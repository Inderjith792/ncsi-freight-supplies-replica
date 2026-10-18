# NCSI Freight Supplies — Global Freight Pulse

Responsive Next.js recreation of the NCSI Freight Supplies website, including eight pages and the original interactive homepage concept, **The Global Freight Pulse**.

## Routes
- `/` — Home
- `/lease-containers` — Container leasing
- `/freight-services` — Freight services
- `/track-shipment` — Shipment tracking entry
- `/request-quote` — Request a quote
- `/industries` — Industries
- `/about` — About NCSI
- `/contact` — Contact

## Run locally
Requires Node.js 20.9+.

```bash
npm install
npm run dev
```

Production check: `npm run build`.

## Notes
The Global Freight Pulse is an illustrative CSS/SVG experience, not live tracking. Forms can use `NEXT_PUBLIC_FORM_ENDPOINT` or fall back to a prefilled email. Shipment tracking requires a real carrier/portal integration before it can display live status. Original Hostinger-hosted images are referenced where available; verify licensing and availability before production use.

Deploy to Vercel by importing this repository and using the default Next.js build settings. Do not change the live domain DNS until the Vercel deployment is reviewed.