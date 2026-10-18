"use client";

import { useEffect, useState } from "react";
import { LeadForm } from "@/components/LeadForm";

const scenes = [
  { id: "origin", no: "01", eyebrow: "THE ORIGIN / METAL & MACHINERY", title: <>Every journey<br /><em>begins with steel.</em></>, copy: "A container is more than a box. It is the first link in a chain that connects factories, people and markets.", stat: "20 / 40 FT", label: "CONTAINER LEASING", mode: "port" },
  { id: "ocean", no: "02", eyebrow: "THE OCEAN / WEIGHTLESS DISTANCE", title: <>Across the blue.<br /><em>Beyond borders.</em></>, copy: "Watch the cargo leave the harbour. Ocean freight turns distance into a route—and a route into possibility.", stat: "OCEAN FREIGHT", label: "PORT TO PORT", mode: "ocean" },
  { id: "air", no: "03", eyebrow: "THE SKY / SPEED & PRECISION", title: <>When time flies,<br /><em>cargo follows.</em></>, copy: "For urgent shipments, air freight moves above the weather, across time zones and into the next opportunity.", stat: "AIR FREIGHT", label: "TIME-SENSITIVE CARGO", mode: "air" },
  { id: "rail", no: "04", eyebrow: "THE LAND / LINES OF CONNECTION", title: <>Steel on steel.<br /><em>Momentum on rails.</em></>, copy: "Rail and road connect the places that ports cannot reach alone. Every handoff matters. Every mile has a purpose.", stat: "MULTIMODAL", label: "CONNECTED MOVEMENT", mode: "rail" },
  { id: "arrival", no: "05", eyebrow: "THE ARRIVAL / ONE CONNECTED WORLD", title: <>Different routes.<br /><em>One clear arrival.</em></>, copy: "From equipment sourcing to freight coordination, we bring the moving pieces together around your shipment.", stat: "NCSI NETWORK", label: "ASSET INTEGRITY. PREDICTABLE TRANSIT.", mode: "arrival" },
];

export function ImmersiveWorld() {
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(0);
  const [pointer, setPointer] = useState({ x: 0, y: 0, mx: 0, my: 0 });
  const [menu, setMenu] = useState(false);
  const [inquiry, setInquiry] = useState(false);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        const runway = document.querySelector<HTMLElement>(".journey-runway");
        const runwayTop = runway ? runway.getBoundingClientRect().top + window.scrollY : 0;
        const runwayDistance = Math.max(1, (runway?.offsetHeight ?? window.innerHeight * scenes.length) - window.innerHeight);
        const p = Math.min(1, Math.max(0, (window.scrollY - runwayTop) / runwayDistance));
        setProgress(p);
        setActive(Math.min(scenes.length - 1, Math.floor(p * scenes.length)));
        document.documentElement.style.setProperty("--journey-progress", String(p));
        raf = 0;
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  function onPointer(e: React.PointerEvent<HTMLElement>) {
    if (e.pointerType === "touch" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const x = e.clientX - window.innerWidth / 2;
    const y = e.clientY - window.innerHeight / 2;
    setPointer({ x, y, mx: Math.max(-18, Math.min(18, x * 0.025)), my: Math.max(-12, Math.min(12, y * 0.025)) });
  }

  useEffect(() => {
    if (!menu && !inquiry) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenu(false);
        setInquiry(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menu, inquiry]);

  function scrollToStage(index: number) {
    const runway = document.querySelector<HTMLElement>(".journey-runway");
    const runwayTop = runway ? runway.getBoundingClientRect().top + window.scrollY : 0;
    const target = runwayTop + Math.min(scenes.length - 1, Math.max(0, index)) * window.innerHeight;
    window.scrollTo({ top: target, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }

  const scene = scenes[active];

  return <main className="ncsi-journey" onPointerMove={onPointer} style={{ "--px": pointer.x + "px", "--py": pointer.y + "px", "--mx": pointer.mx + "px", "--my": pointer.my + "px", "--progress": progress, "--phase": active } as React.CSSProperties}>
    <div className="journey-runway" aria-hidden="true">{scenes.map((s) => <div key={s.id} id={"runway-" + s.id} />)}</div>
    <div className={"journey-stage mode-" + scene.mode}>
      <div className="journey-sky"><div className="sky-glow"/><div className="sky-sun"/><div className="sky-cloud cloud-one"/><div className="sky-cloud cloud-two"/></div>
      <div className="journey-world" aria-hidden="true">
        <div className="world-stars"/><div className="world-moon"/>
        <div className="world-distant-coast"><i/><i/><i/><i/><i/><i/><i/><i/></div>
        <div className="world-crane crane-left"><i/><b/><em/></div><div className="world-crane crane-right"><i/><b/><em/></div>
        <div className="world-container-wall"><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/></div>
        <div className="world-water"><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/></div>
        <div className="world-waves"><i/><i/><i/><i/><i/></div>
        <div className="world-ship"><div className="ship-cargo">{Array.from({length:18},(_,i)=><i key={i}/>)}</div><div className="ship-bridge"/><div className="ship-hull"/><div className="ship-wake"/></div>
        <div className="world-plane"><div className="plane-body"/><div className="plane-wing"/><div className="plane-tail"/></div>
        <div className="world-train"><div className="train-engine"/><div className="train-cars"><i/><i/><i/><i/><i/></div><div className="train-track"/></div>
        <div className="world-route route-a"/><div className="world-route route-b"/><div className="world-route route-c"/>
        <div className="world-route-node node-one"/><div className="world-route-node node-two"/><div className="world-route-node node-three"/>
        <div className="world-coordinate coord-top">NCSI / GLOBAL MOVEMENT SYSTEM</div><div className="world-coordinate coord-bottom">ASSET INTEGRITY <span>·</span> PREDICTABLE TRANSIT</div>
      </div>
      <div className="journey-vignette"/>
      <header className="journey-nav">
        <a className="journey-logo" href="#journey-start" onClick={() => window.scrollTo({top:0,behavior:"smooth"})}><b>N</b><span>NCSI<small>FREIGHT SUPPLIES</small></span></a>
        <div className="journey-live"><i/> FREIGHT IS NEVER STILL</div>
        <button className="journey-menu-trigger" onClick={() => setMenu(!menu)}>{menu ? "CLOSE −" : "EXPLORE +"}</button>
      </header>
      {menu && <nav className="journey-menu">{scenes.map((s,i)=><button key={s.id} onClick={()=>{scrollToStage(i);setMenu(false)}}><span>{s.no}</span>{s.label}</button>)}<button onClick={()=>{setInquiry(true);setMenu(false)}}><span>↗</span>START A SHIPMENT</button></nav>}
      <div className="journey-copy" key={scene.id}>
        <div className="journey-eyebrow"><i/>{scene.eyebrow}</div>
        <div className="journey-counter">{scene.no}<span>/</span>0{scenes.length}</div>
        <h1>{scene.title}</h1>
        <p>{scene.copy}</p>
        <div className="journey-stat"><b>{scene.stat}</b><span>{scene.label}</span></div>
        <button className="journey-cta" onClick={()=>{if(active<scenes.length-1)scrollToStage(active + 1);else setInquiry(true)}}>{active===scenes.length-1?"START YOUR SHIPMENT":"TRAVEL FURTHER"} <span>↘</span></button>
      </div>
      <div className="journey-rail">{scenes.map((s,i)=><button key={s.id} aria-label={"Go to " + s.label} className={i===active?"is-active":""} onClick={()=>scrollToStage(i)}><span>{s.no}</span><i/></button>)}</div>
      <div className="journey-footer"><span>SCROLL TO MOVE THROUGH THE WORLD <b>↓</b></span><div className="journey-progress"><i style={{transform:"scaleX("+progress+")"}}/></div><b>{String(Math.round(progress*100)).padStart(2,"0")}%</b></div>
      <div className="journey-cursor" aria-hidden="true"><i/></div>
      {inquiry && <div className="journey-inquiry-backdrop" role="dialog" aria-modal="true" aria-label="Start a shipment inquiry"><div className="journey-inquiry"><button className="inquiry-close" onClick={()=>setInquiry(false)} aria-label="Close inquiry">×</button><div className="journey-eyebrow"><i/> YOUR NEXT MOVE</div><h2>Let&apos;s move<br/><em>something forward.</em></h2><p>Tell us what you need to lease or move.</p><LeadForm kind="quote" buttonLabel="Send inquiry ↗"/></div></div>}
    </div>
    <div className="journey-end" aria-hidden="true"><span>YOU ARE HERE.</span><b>NCSI FREIGHT SUPPLIES</b><span>THE WORLD KEEPS MOVING.</span></div>
  </main>;
}
