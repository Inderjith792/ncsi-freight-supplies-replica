"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const nav = [
  ["/lease-containers","Lease Containers"],["/freight-services","Freight Services"],["/track-shipment","Track Shipment"],["/industries","Industries"],["/about","About Us"],["/contact","Contact"]
];
export function SiteShell({children}:{children:React.ReactNode}) {
  const pathname = usePathname();
  const [open,setOpen] = useState(false);
  return <>
    <header className="site-header"><div className="header-inner">
      <Link className="brand" href="/" aria-label="NCSI Freight Supplies home"><span className="brand-mark">N</span><span><b>NCSI</b><small>FREIGHT SUPPLIES</small></span></Link>
      <button className="menu-toggle" onClick={()=>setOpen(!open)} aria-expanded={open} aria-label="Toggle navigation">{open?"✕":"☰"}</button>
      <nav className={open?"main-nav nav-open":"main-nav"} aria-label="Main navigation">
        {nav.map(([href,label])=><Link key={href} href={href} className={pathname===href?"active":""} onClick={()=>setOpen(false)}>{label}</Link>)}
        <Link className="nav-quote" href="/request-quote" onClick={()=>setOpen(false)}>Request a Quote <span>↗</span></Link>
      </nav>
    </div></header>
    <main>{children}</main>
    <footer className="site-footer"><div className="container footer-grid">
      <div><Link className="brand footer-brand" href="/"><span className="brand-mark">N</span><span><b>NCSI</b><small>FREIGHT SUPPLIES</small></span></Link><p>Asset integrity. Predictable transit.</p></div>
      <div><b>Explore</b><Link href="/lease-containers">Container Leasing</Link><Link href="/freight-services">Freight Services</Link><Link href="/track-shipment">Track Shipment</Link></div>
      <div><b>Company</b><Link href="/industries">Industries</Link><Link href="/about">About Us</Link><Link href="/contact">Contact</Link></div>
      <div><b>Talk to our team</b><a href="mailto:info@ncsifreightsupplies.com">info@ncsifreightsupplies.com</a><a href="tel:+918248084706">+91 8248084706</a><Link href="/request-quote">Request a quote ↗</Link></div>
    </div><div className="footer-bottom"><span>© 2026 NCSI Freight Supplies</span><span>Global Container Leasing & Freight Solutions</span></div></footer>
  </>;
}
