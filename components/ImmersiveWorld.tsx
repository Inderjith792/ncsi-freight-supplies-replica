"use client";

import { useEffect, useState } from "react";
import { LeadForm } from "@/components/LeadForm";

const chapters = [
  { id: "origin", number: "01", label: "ORIGIN / THE PORT", title: "Everything\nstarts somewhere.", copy: "At the edge of the ocean, global trade begins. We connect dependable container capacity with the routes that keep business moving.", metric: "01 / SOURCE", detail: "Factory-direct container leasing" },
  { id: "ocean", number: "02", label: "MOVEMENT / OCEAN", title: "Across oceans.\nWithout losing sight.", copy: "Ocean and air freight, customs coordination, and practical planning—connected into one clear journey from origin to destination.", metric: "02 / MOVE", detail: "Ocean · Air · Customs" },
  { id: "arrival", number: "03", label: "ARRIVAL / THE NETWORK", title: "The world moves.\nWe move with it.", copy: "Every shipment has its own requirements. We help bring the details together, from equipment and route planning to delivery coordination.", metric: "03 / DELIVER", detail: "Coordination built around your cargo" },
];

export function ImmersiveWorld() {
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(0);
  const [menu, setMenu] = useState(false);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      document.documentElement.style.setProperty("--world-scroll", String(p));
      document.documentElement.style.setProperty("--world-scroll-y", String(window.scrollY));
      setProgress(p);
      setActive(p < .25 ? 0 : p < .62 ? 1 : 2);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => { window.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, []);

  function move(e: React.MouseEvent<HTMLElement>) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setPointer({ x: (e.clientX / window.innerWidth - .5) * 36, y: (e.clientY / window.innerHeight - .5) * -28 });
  }

  return <main className="world-experience" onPointerMove={move} style={{ "--world-x": pointer.x + "px", "--world-y": pointer.y + "px", "--scroll-progress": progress } as React.CSSProperties}>
    <div className="world-progress"><span style={{ transform: `scaleX(${progress})` }} /></div>
    <header className="world-nav">
      <a className="world-brand" href="#top" aria-label="NCSI home"><span className="world-brand-mark">N</span><span><b>NCSI</b><small>FREIGHT SUPPLIES</small></span></a>
      <div className="world-nav-status"><i /> GLOBAL TRADE / IN MOTION</div>
      <button className="world-menu-button" onClick={() => setMenu(!menu)} aria-expanded={menu}>{menu ? "CLOSE −" : "EXPLORE +"}</button>
      {menu && <nav className="world-menu">
        <a href="#origin" onClick={() => setMenu(false)}>01 / The Port</a>
        <a href="#ocean" onClick={() => setMenu(false)}>02 / The Journey</a>
        <a href="#capabilities" onClick={() => setMenu(false)}>03 / What We Move</a>
        <a href="#contact-world" onClick={() => setMenu(false)}>04 / Start a Shipment</a>
      </nav>}
    </header>

    <section id="top" className="world-opening">
      <div className="world-opening-art" aria-hidden="true">
        <div className="world-horizon" />
        <div className="world-moon" />
        <div className="world-skyline skyline-back"><i/><i/><i/><i/><i/><i/><i/></div>
        <div className="world-crane crane-a"><i/><b/><em/></div>
        <div className="world-crane crane-b"><i/><b/><em/></div>
        <div className="world-crane crane-c"><i/><b/><em/></div>
        <div className="world-containers container-a"><i/><i/><i/><i/><i/><i/></div>
        <div className="world-containers container-b"><i/><i/><i/><i/></div>
        <div className="world-containers container-c"><i/><i/><i/><i/><i/><i/><i/><i/></div>
        <div className="world-water"><span/><span/><span/><span/><span/><span/></div>
        <div className="world-vessel"><div className="vessel-cargo"><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/></div><div className="vessel-deck"/><div className="vessel-hull"/></div>
        <svg className="world-route-hero" viewBox="0 0 1000 500" preserveAspectRatio="none"><path d="M50 390 C230 130 330 120 500 250 S780 420 950 90"/><path d="M50 390 C230 130 330 120 500 250 S780 420 950 90" className="route-hot"/><circle r="5"><animateMotion dur="9s" repeatCount="indefinite" path="M50 390 C230 130 330 120 500 250 S780 420 950 90"/></circle></svg>
      </div>
      <div className="world-grain" aria-hidden="true"/>
      <div className="world-coord world-coord-left">22° 18&apos; N<br/>88° 22&apos; E<br/><span>PORT SYSTEM / 001</span></div>
      <div className="world-coord world-coord-right">NCSI NETWORK<br/><span>ASSET INTEGRITY<br/>PREDICTABLE TRANSIT</span></div>
      <div className="world-opening-copy">
        <p className="world-overline"><span/> TRUSTED GLOBAL LOGISTICS PARTNER <span className="overline-rule"/></p>
        <h1>THE WORLD<br/>DOESN’T <em>STAND</em><br/><span>STILL.</span></h1>
        <p className="world-lede">Neither should your supply chain.</p>
        <p className="world-description">Container leasing and international freight, connected through one clear, dependable journey.</p>
        <a className="world-cta" href="#origin">ENTER THE NETWORK <span>↓</span></a>
      </div>
      <div className="world-bottom-meta"><span>01 — 03 / A GLOBAL TRADE STORY</span><span>SCROLL TO TRAVEL <b>↓</b></span><span>SCROLL PROGRESS / {String(Math.round(progress * 100)).padStart(2, "0")}%</span></div>
    </section>

    <section id="origin" className="world-chapter chapter-port">
      <div className="chapter-visual port-visual" aria-hidden="true">
        <div className="visual-coordinate">FIELD NOTES / 001<br/>ORIGIN POINT</div><div className="radar-rings"><i/><i/><i/><i/></div>
        <div className="port-crane port-crane-one"><i/><b/><em/></div><div className="port-crane port-crane-two"><i/><b/><em/></div>
        <div className="port-stack stack-left"><i/><i/><i/><i/><i/><i/></div><div className="port-stack stack-right"><i/><i/><i/><i/><i/><i/><i/><i/></div>
        <div className="port-floor"/><div className="visual-readout"><span>LIVE SYSTEM / 01</span><b>ASSETS READY</b><i/></div>
      </div>
      <div className="chapter-copy"><p className="world-overline"><span/> {chapters[0].label}</p><div className="chapter-number">01 <i/> 03</div><h2>Everything<br/><em>starts somewhere.</em></h2><p>{chapters[0].copy}</p><div className="chapter-detail"><span>{chapters[0].metric}</span><b>{chapters[0].detail}</b></div><a className="world-text-link" href="#capabilities">DISCOVER CONTAINER LEASING ↗</a></div>
    </section>

    <section id="ocean" className="world-journey">
      <div className="journey-backdrop" aria-hidden="true"><div className="journey-globe"/><div className="journey-grid"/><svg viewBox="0 0 1200 700" preserveAspectRatio="none"><path d="M-20 500 C220 80 440 80 610 350 S900 680 1220 150"/><path className="route-hot" d="M-20 500 C220 80 440 80 610 350 S900 680 1220 150"/><path className="journey-route-two" d="M-20 620 C250 430 450 560 700 250 S1000 150 1220 360"/></svg></div>
      <div className="journey-topline"><span>02 / MOVEMENT</span><span>ROUTE INTELLIGENCE / OCEAN · AIR · LAND</span></div>
      <div className="journey-copy"><p className="world-overline"><span/> {chapters[1].label}</p><h2>Across oceans.<br/><em>Without losing sight.</em></h2><p>{chapters[1].copy}</p><div className="journey-stops"><div className={active===0?"stop-active":""}><span>01</span><b>ORIGIN</b><small>Equipment & cargo</small></div><i/><div className={active===1?"stop-active":""}><span>02</span><b>IN TRANSIT</b><small>Route coordination</small></div><i/><div className={active===2?"stop-active":""}><span>03</span><b>ARRIVAL</b><small>Delivery handoff</small></div></div><a className="world-cta" href="#capabilities">EXPLORE OUR CAPABILITIES <span>↘</span></a></div>
      <div className="journey-side-label">GLOBAL NETWORK / NOT LIVE TRACKING</div>
    </section>

    <section id="capabilities" className="world-capabilities">
      <div className="capabilities-heading"><p className="world-overline"><span/> 03 / WHAT WE MOVE</p><h2>Complex world.<br/><em>Clear connections.</em></h2><p>Different needs. One connected conversation.</p></div>
      <div className="capability-list">
        <a href="#contact-world" className="capability-row"><span>01</span><div><h3>Container leasing</h3><p>20ft · 40ft · High Cube · Factory-direct sourcing</p></div><b>↗</b><div className="capability-ghost">LEASE</div></a>
        <a href="#contact-world" className="capability-row"><span>02</span><div><h3>Ocean freight</h3><p>Route coordination · International cargo movement</p></div><b>↗</b><div className="capability-ghost">OCEAN</div></a>
        <a href="#contact-world" className="capability-row"><span>03</span><div><h3>Air freight</h3><p>Time-sensitive cargo · Practical transport options</p></div><b>↗</b><div className="capability-ghost">AIR</div></a>
        <a href="#contact-world" className="capability-row"><span>04</span><div><h3>Customs & warehousing</h3><p>Documentation · Clearance coordination · Cargo handling</p></div><b>↗</b><div className="capability-ghost">FLOW</div></a>
      </div>
    </section>

    <section id="arrival" className="world-chapter chapter-arrival">
      <div className="chapter-copy"><p className="world-overline"><span/> {chapters[2].label}</p><div className="chapter-number">03 <i/> 03</div><h2>The world moves.<br/><em>We move with it.</em></h2><p>{chapters[2].copy}</p><div className="chapter-detail"><span>{chapters[2].metric}</span><b>{chapters[2].detail}</b></div><a className="world-text-link" href="#contact-world">START YOUR NEXT SHIPMENT ↗</a></div>
      <div className="chapter-visual arrival-visual" aria-hidden="true"><div className="arrival-sun"/><div className="arrival-city"><i/><i/><i/><i/><i/><i/><i/><i/></div><div className="arrival-portline"/><div className="arrival-vessel"><div/><div/><div/></div><div className="arrival-coordinates">DESTINATION NODE / CONNECTED<br/>HANDOFF COORDINATION / READY</div><div className="arrival-signal"><i/><i/><i/></div></div>
    </section>

    <section id="contact-world" className="world-contact">
      <div className="contact-world-backdrop" aria-hidden="true"><div className="contact-orbit orbit-one"/><div className="contact-orbit orbit-two"/><div className="contact-orbit orbit-three"/><span>NCSI / NETWORK COMPLETE</span></div>
      <div className="contact-world-intro"><p className="world-overline"><span/> YOUR MOVE / START HERE</p><h2>Where do you<br/><em>need to go?</em></h2><p>Tell us what you need to lease or move. We&apos;ll help you work through the next step.</p><div className="contact-direct"><a href="mailto:info@ncsifreightsupplies.com">INFO@NCSIFREIGHTSUPPLIES.COM ↗</a><a href="tel:+918248084706">+91 82480 84706</a></div></div>
      <div className="contact-world-form"><div className="form-world-heading"><span>INQUIRY / 001</span><h3>Start a conversation.</h3><p>Share the details. We’ll take it from here.</p></div><LeadForm kind="quote" buttonLabel="Send inquiry ↗"/></div>
      <footer className="world-footer"><a className="world-brand" href="#top"><span className="world-brand-mark">N</span><span><b>NCSI</b><small>FREIGHT SUPPLIES</small></span></a><span>ASSET INTEGRITY. PREDICTABLE TRANSIT.</span><span>© 2026 NCSI FREIGHT SUPPLIES</span></footer>
    </section>
  </main>;
}
