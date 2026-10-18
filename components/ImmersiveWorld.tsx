"use client";

import { useEffect, useRef, useState } from "react";
import { LeadForm } from "@/components/LeadForm";

const stages = [
  { id: "origin", no: "01", eyebrow: "NCSI / CONTAINER LEASING", title: <>Space to<br /><em>move forward.</em></>, copy: "Reliable container solutions for cargo that connects businesses and markets.", stat: "20 / 40 FT", label: "CONTAINER LEASING" },
  { id: "ocean", no: "02", eyebrow: "NCSI / OCEAN FREIGHT", title: <>Across the blue.<br /><em>Beyond borders.</em></>, copy: "Ocean freight coordination that turns distance into a clear, dependable route.", stat: "OCEAN FREIGHT", label: "PORT TO PORT" },
  { id: "air", no: "03", eyebrow: "NCSI / AIR FREIGHT", title: <>When time flies,<br /><em>cargo follows.</em></>, copy: "Air freight solutions for time-sensitive shipments and changing priorities.", stat: "AIR FREIGHT", label: "TIME-SENSITIVE CARGO" },
  { id: "rail", no: "04", eyebrow: "NCSI / MULTIMODAL", title: <>Every route<br /><em>connects.</em></>, copy: "A connected approach to freight across road, rail, sea and air.", stat: "MULTIMODAL", label: "CONNECTED MOVEMENT" },
  { id: "arrival", no: "05", eyebrow: "NCSI / YOUR NEXT MOVE", title: <>Different routes.<br /><em>One clear arrival.</em></>, copy: "Bring equipment sourcing and freight coordination together around your shipment.", stat: "NCSI NETWORK", label: "ASSET INTEGRITY. PREDICTABLE TRANSIT." },
];

export function ImmersiveWorld() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(0);
  const [menu, setMenu] = useState(false);
  const [inquiry, setInquiry] = useState(false);
  const pointerRef = useRef({ x: -100, y: -100, angle: 0 });
  const cursorRef = useRef<HTMLDivElement>(null);
  const traceRef = useRef<HTMLDivElement>(null);
  const tracePointsRef = useRef<Array<{ x: number; y: number; time: number }>>([]);

  useEffect(() => {
    const move = (event: PointerEvent | MouseEvent) => {
      const cursor = cursorRef.current;
      if (!cursor) return;
      const p = pointerRef.current;
      const dx = event.clientX - p.x;
      const dy = event.clientY - p.y;
      if (Math.abs(dx) + Math.abs(dy) > 1) p.angle = Math.atan2(dy, dx) * (180 / Math.PI);
      p.x = event.clientX;
      p.y = event.clientY;
      cursor.style.setProperty("left", event.clientX + "px", "important");
      cursor.style.setProperty("top", event.clientY + "px", "important");
      cursor.style.setProperty("--cursor-angle", p.angle + "deg");
      const traces = traceRef.current;
      if (traces) {
        const points = tracePointsRef.current;
        points.push({ x: event.clientX, y: event.clientY, time: performance.now() });
        while (points.length > 32 || (points.length && performance.now() - points[0].time > 720)) points.shift();
        let svg = traces.querySelector("svg");
        if (!svg) {
          svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
          svg.setAttribute("aria-hidden", "true");
          svg.setAttribute("preserveAspectRatio", "none");
          const glow = document.createElementNS("http://www.w3.org/2000/svg", "path");
          glow.setAttribute("class", "wake-glow");
          const core = document.createElementNS("http://www.w3.org/2000/svg", "path");
          core.setAttribute("class", "wake-core");
          const highlight = document.createElementNS("http://www.w3.org/2000/svg", "path");
          highlight.setAttribute("class", "wake-highlight");
          svg.append(glow, core, highlight);
          traces.replaceChildren(svg);
        }
        svg.setAttribute("viewBox", "0 0 " + window.innerWidth + " " + window.innerHeight);
        const path = points.reduce((d, point, index) => {
          if (index === 0) return "M " + point.x + " " + point.y;
          const previous = points[index - 1];
          const mx = (previous.x + point.x) / 2;
          const my = (previous.y + point.y) / 2;
          return d + " Q " + previous.x + " " + previous.y + " " + mx + " " + my;
        }, "") + (points.length ? " L " + points[points.length - 1].x + " " + points[points.length - 1].y : "");
        svg.querySelectorAll("path").forEach((line) => line.setAttribute("d", path));
        svg.style.animation = "none";
        void svg.getBoundingClientRect();
        svg.style.animation = "ncsi-wake-fade 760ms ease-out forwards";
      }
    };
    window.addEventListener("pointermove", move, true);
    window.addEventListener("mousemove", move, true);
    return () => {
      window.removeEventListener("pointermove", move, true);
      window.removeEventListener("mousemove", move, true);
    };
  }, []);

  useEffect(() => {
    let disposed = false;
    let frame = 0;
    let renderer: import("three").WebGLRenderer | undefined;
    let cleanup: (() => void) | undefined;
    const canvas = canvasRef.current;
    if (!canvas) return;

    void import("three").then(async (THREE) => {
      if (disposed) return;
      const scene = new THREE.Scene();
      scene.background = new THREE.Color("#071a22");
      const camera = new THREE.PerspectiveCamera(52, 1, 0.1, 2000);
      camera.position.set(0, 0, 18);
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: "high-performance" });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, window.innerWidth < 760 ? 1.25 : 1.6));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.1;

      scene.add(new THREE.AmbientLight(0xb8e5dc, 1.15));
      const key = new THREE.PointLight(0x64d5c4, 48, 220);
      key.position.set(8, 5, 12);
      scene.add(key);

      const world = new THREE.Group();
      scene.add(world);
      const loader = await import("three/examples/jsm/loaders/GLTFLoader.js");
      const gltfLoader = new loader.GLTFLoader();
      gltfLoader.load(
        "/models/alien_space_nebula_1_skybox.glb",
        (gltf) => {
          if (disposed) {
            gltf.scene.traverse((o) => {
              const object = o as import("three").Object3D & { geometry?: import("three").BufferGeometry; material?: import("three").Material | import("three").Material[] };
              object.geometry?.dispose();
            });
            return;
          }
          const model = gltf.scene;
          // Oceanic colour grade: shift the nebula's existing colours toward deep-sea blue,
          // cyan and teal while preserving its texture maps and overall luminosity.
          const oceanTint = new THREE.Color("#4d8b94");
          const deepOcean = new THREE.Color("#0c5964");
          model.traverse((object) => {
            const mesh = object as import("three").Mesh;
            if (!mesh.isMesh) return;
            mesh.frustumCulled = false;
            const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
            materials.forEach((material) => {
              const m = material as import("three").Material & {
                side?: import("three").Side;
                depthWrite?: boolean;
                color?: import("three").Color;
                emissive?: import("three").Color;
                emissiveIntensity?: number;
              };
              m.side = THREE.DoubleSide;
              m.depthWrite = false;
              // The source texture is strongly purple/white, so a subtle tint was nearly invisible.
              // Apply a decisive ocean-blue multiply to the texture while retaining its detail.
              if (m.color) m.color.lerp(oceanTint, 0.28);
              if (m.emissive) {
                m.emissive.lerp(deepOcean, 0.18);
                m.emissiveIntensity = Math.max(m.emissiveIntensity ?? 0, 0.12);
              }
              m.needsUpdate = true;
            });
          });
          const bounds = new THREE.Box3().setFromObject(model);
          const center = bounds.getCenter(new THREE.Vector3());
          const size = bounds.getSize(new THREE.Vector3());
          const largest = Math.max(size.x, size.y, size.z);
          model.position.sub(center);
          if (largest > 0) model.scale.setScalar(260 / largest);
          // Ocean scenes are commonly authored as horizontal planes; tilt the camera down
          // from a useful distance so the water surface and scene details fill the frame.
          model.rotation.x = 0;
          world.add(model);
          console.info("NCSI nebula environment loaded.");
        },
        undefined,
        (error) => console.error("Could not load /models/alien_space_nebula_1_skybox.glb", error)
      );

      // Fine stars provide depth while the supplied nebula model rotates behind the content.
      const count = 1200;
      const points = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        const radius = 150 + Math.random() * 550;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        points[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        points[i * 3 + 1] = radius * Math.cos(phi);
        points[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
      }
      const starGeometry = new THREE.BufferGeometry();
      starGeometry.setAttribute("position", new THREE.BufferAttribute(points, 3));
      const stars = new THREE.Points(starGeometry, new THREE.PointsMaterial({ color: 0x9be4d4, size: 0.65, transparent: true, opacity: 0.38, depthWrite: false }));
      scene.add(stars);

      const resize = () => {
        if (disposed || !renderer) return;
        const width = canvas.clientWidth || window.innerWidth;
        const height = canvas.clientHeight || window.innerHeight;
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.fov = width < 760 ? 62 : 52;
        camera.updateProjectionMatrix();
      };
      resize();
      window.addEventListener("resize", resize);
      const start = performance.now();
      const animate = (now: number) => {
        if (disposed) return;
        const t = (now - start) / 1000;
        // Slow yaw and gentle roll reveal different regions of the nebula, graded toward NCSI teal.
        const scrollProgress = Number(document.documentElement.style.getPropertyValue("--journey-progress")) || 0;
        world.rotation.y = t * 0.035 + scrollProgress * Math.PI * 0.32;
        world.rotation.x = Math.sin(t * 0.11) * 0.035;
        world.rotation.z = Math.sin(t * 0.07) * 0.018;
        stars.rotation.y = -t * 0.003;
        camera.position.x += ((window.innerWidth < 760 ? 0 : 1.2) - camera.position.x) * 0.012;
        camera.position.y += (0 - camera.position.y) * 0.012;
        camera.lookAt(0, 0, 0);
        renderer?.render(scene, camera);
        frame = window.requestAnimationFrame(animate);
      };
      frame = window.requestAnimationFrame(animate);
      cleanup = () => {
        window.removeEventListener("resize", resize);
        window.cancelAnimationFrame(frame);
        scene.traverse((object) => {
          const item = object as import("three").Object3D & { geometry?: import("three").BufferGeometry; material?: import("three").Material | import("three").Material[] };
          item.geometry?.dispose();
          if (item.material) (Array.isArray(item.material) ? item.material : [item.material]).forEach((material) => material.dispose());
        });
        renderer?.dispose();
      };
    }).catch((error) => console.error("Unable to initialize NCSI nebula scene:", error));

    return () => { disposed = true; if (frame) window.cancelAnimationFrame(frame); cleanup?.(); renderer?.dispose(); };
  }, []);

  useEffect(() => {
    const move = (event: PointerEvent) => handlePointerMoveRef.current(event);
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("mousemove", move, { passive: true });
    let raf = 0;
    const update = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        const runway = document.querySelector<HTMLElement>(".journey-runway");
        const runwayTop = runway ? runway.getBoundingClientRect().top + window.scrollY : 0;
        const distance = Math.max(1, (runway?.offsetHeight ?? window.innerHeight * stages.length) - window.innerHeight);
        const p = Math.min(1, Math.max(0, (window.scrollY - runwayTop) / distance));
        setProgress(p);
        setActive(Math.min(stages.length - 1, Math.floor(p * stages.length)));
        document.documentElement.style.setProperty("--journey-progress", String(p));
        raf = 0;
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => { if (raf) window.cancelAnimationFrame(raf); window.removeEventListener("scroll", update); window.removeEventListener("resize", update); window.removeEventListener("pointermove", move); window.removeEventListener("mousemove", move); };
  }, []);

  useEffect(() => {
    if (!menu && !inquiry) return;
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") { setMenu(false); setInquiry(false); } };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menu, inquiry]);

  function scrollToStage(index: number) {
    const runway = document.querySelector<HTMLElement>(".journey-runway");
    const top = runway ? runway.getBoundingClientRect().top + window.scrollY : 0;
    window.scrollTo({ top: top + Math.min(stages.length - 1, Math.max(0, index)) * window.innerHeight, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }

  const stage = stages[active];
  return (
    <main className="ncsi-journey" style={{ "--progress": progress, "--phase": active } as React.CSSProperties}>
      <canvas ref={canvasRef} className="journey-webgl" aria-label="Rotating nebula tinted with NCSI teal palette" />
      <div className="journey-runway" aria-hidden="true">{stages.map((item) => <div key={item.id} id={"runway-" + item.id} />)}</div>
      <div className={"journey-stage mode-" + stage.id}>
        <div className="journey-vignette" />
        <header className="journey-nav">
          <a className="journey-logo" href="#journey-start" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}><b>N</b><span>NCSI<small>FREIGHT SUPPLIES</small></span></a>
          <div className="journey-live"><i /> ASSET INTEGRITY. PREDICTABLE TRANSIT.</div>
          <button className="journey-menu-trigger" onClick={() => setMenu(!menu)}>{menu ? "CLOSE −" : "EXPLORE +"}</button>
        </header>
        {menu && <nav className="journey-menu">{stages.map((item, index) => <button key={item.id} onClick={() => { scrollToStage(index); setMenu(false); }}><span>{item.no}</span>{item.label}</button>)}<button onClick={() => { setInquiry(true); setMenu(false); }}><span>↗</span>START A SHIPMENT</button></nav>}
        <div className="journey-copy" key={stage.id}>
          <div className="journey-eyebrow"><i />{stage.eyebrow}</div>
          <div className="journey-counter">{stage.no}<span>/</span>0{stages.length}</div>
          <h1>{stage.title}</h1>
          <p>{stage.copy}</p>
          <div className="journey-stat"><b>{stage.stat}</b><span>{stage.label}</span></div>
          <button className="journey-cta" onClick={() => { if (active < stages.length - 1) scrollToStage(active + 1); else setInquiry(true); }}>{active === stages.length - 1 ? "START YOUR SHIPMENT" : "EXPLORE NEXT"} <span>↘</span></button>
        </div>
        <div className="journey-rail">{stages.map((item, index) => <button key={item.id} aria-label={"Go to " + item.label} className={index === active ? "is-active" : ""} onClick={() => scrollToStage(index)}><span>{item.no}</span><i /></button>)}</div>
        <div className="journey-footer"><span>SCROLL TO ROTATE THE WORLD <b>↓</b></span><div className="journey-progress"><i style={{ transform: "scaleX(" + progress + ")" }} /></div><b>{String(Math.round(progress * 100)).padStart(2, "0")}%</b></div>
        <div ref={traceRef} className={"journey-air-traces " + (stage.id === "air" ? "is-active is-air" : stage.id === "ocean" ? "is-active is-ocean" : "")} aria-hidden="true" />
        <div ref={cursorRef} className={"journey-cursor " + (stage.id === "ocean" ? "cursor-ship" : stage.id === "air" ? "cursor-flight" : "cursor-default")} aria-hidden="true"><span className="cursor-vehicle">{stage.id === "ocean" ? "🚢" : stage.id === "air" ? "✈" : "·"}</span><i /></div>
        {inquiry && <div className="journey-inquiry-backdrop" role="dialog" aria-modal="true" aria-label="Start a shipment inquiry"><div className="journey-inquiry"><button className="inquiry-close" onClick={() => setInquiry(false)} aria-label="Close inquiry">×</button><div className="journey-eyebrow"><i /> YOUR NEXT MOVE</div><h2>Let&apos;s move<br /><em>something forward.</em></h2><p>Tell us what you need to lease or move.</p><LeadForm kind="quote" buttonLabel="Send inquiry ↗" /></div></div>}
      </div>
      <div className="journey-end" aria-hidden="true"><span>YOU ARE HERE.</span><b>NCSI FREIGHT SUPPLIES</b><span>THE WORLD KEEPS MOVING.</span></div>
    </main>
  );
}
