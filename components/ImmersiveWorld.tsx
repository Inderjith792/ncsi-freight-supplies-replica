"use client";

import { useEffect, useRef, useState } from "react";
import { LeadForm } from "@/components/LeadForm";
import type { ColorRepresentation, Material, Object3D } from "three";

const scenes = [
  { id: "origin", no: "01", eyebrow: "THE ORIGIN / METAL & MACHINERY", title: <>Every journey<br /><em>begins with steel.</em></>, copy: "A container is more than a box. It is the first link in a chain that connects factories, people and markets.", stat: "20 / 40 FT", label: "CONTAINER LEASING", mode: "port" },
  { id: "ocean", no: "02", eyebrow: "THE OCEAN / WEIGHTLESS DISTANCE", title: <>Across the blue.<br /><em>Beyond borders.</em></>, copy: "Watch the cargo leave the harbour. Ocean freight turns distance into a route—and a route into possibility.", stat: "OCEAN FREIGHT", label: "PORT TO PORT", mode: "ocean" },
  { id: "air", no: "03", eyebrow: "THE SKY / SPEED & PRECISION", title: <>When time flies,<br /><em>cargo follows.</em></>, copy: "For urgent shipments, air freight moves above the weather, across time zones and into the next opportunity.", stat: "AIR FREIGHT", label: "TIME-SENSITIVE CARGO", mode: "air" },
  { id: "rail", no: "04", eyebrow: "THE LAND / LINES OF CONNECTION", title: <>Steel on steel.<br /><em>Momentum on rails.</em></>, copy: "Rail and road connect the places that ports cannot reach alone. Every handoff matters. Every mile has a purpose.", stat: "MULTIMODAL", label: "CONNECTED MOVEMENT", mode: "rail" },
  { id: "arrival", no: "05", eyebrow: "THE ARRIVAL / ONE CONNECTED WORLD", title: <>Different routes.<br /><em>One clear arrival.</em></>, copy: "From equipment sourcing to freight coordination, we bring the moving pieces together around your shipment.", stat: "NCSI NETWORK", label: "ASSET INTEGRITY. PREDICTABLE TRANSIT.", mode: "arrival" },
];

export function ImmersiveWorld() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(0);
  const [menu, setMenu] = useState(false);
  const [inquiry, setInquiry] = useState(false);

  useEffect(() => {
    let disposed = false;
    let frame = 0;
    let renderer: import("three").WebGLRenderer | undefined;
    let cleanup: (() => void) | undefined;
    const canvas = canvasRef.current;
    if (!canvas) return;

    void import("three").then((THREE) => {
      if (disposed) return;
      const scene = new THREE.Scene();
      scene.background = new THREE.Color("#061824");
      scene.fog = new THREE.FogExp2("#071d2b", 0.009);
      const camera = new THREE.PerspectiveCamera(43, 1, 0.1, 900);
      camera.position.set(0, 16, 34);
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: "high-performance" });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.16;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      scene.add(new THREE.HemisphereLight(0x9ac9e6, 0x10212a, 2.1));
      const sun = new THREE.DirectionalLight(0xffd9a1, 3.5);
      sun.position.set(-18, 32, 12); sun.castShadow = true;
      sun.shadow.mapSize.set(1024, 1024);
      scene.add(sun);
      const rim = new THREE.DirectionalLight(0x4ac9de, 2.6); rim.position.set(22, 12, -24); scene.add(rim);
      const fill = new THREE.PointLight(0x2a7897, 80, 120); fill.position.set(0, 12, 8); scene.add(fill);

      const mat = (color: ColorRepresentation, metalness = 0.1, roughness = 0.58) =>
        new THREE.MeshStandardMaterial({ color, metalness, roughness });
      const steel = mat("#738b99", 0.78, 0.32);
      const darkSteel = mat("#253c4b", 0.72, 0.36);
      const orange = mat("#e4773d", 0.35, 0.42);
      const teal = mat("#35c9b6", 0.45, 0.32);
      const white = mat("#e5edf0", 0.38, 0.3);
      const rubber = mat("#101a20", 0.1, 0.82);
      const oceanMat = new THREE.ShaderMaterial({
        uniforms: { uTime: { value: 0 }, uDeep: { value: new THREE.Color("#06324a") }, uShallow: { value: new THREE.Color("#19778a") }, uSun: { value: new THREE.Vector3(-0.35, 0.85, 0.4) } },
        vertexShader: `varying vec3 vWorld; varying vec2 vUv; uniform float uTime; void main(){ vUv=uv; vec3 p=position; float w=sin(p.x*0.18+uTime*0.7)*0.22+cos(p.y*0.22-uTime*0.55)*0.13+sin((p.x+p.y)*0.08+uTime)*0.18; p.z+=w; vec4 world=modelMatrix*vec4(p,1.0); vWorld=world.xyz; gl_Position=projectionMatrix*viewMatrix*world; }`,
        fragmentShader: `uniform vec3 uDeep; uniform vec3 uShallow; uniform vec3 uSun; uniform float uTime; varying vec3 vWorld; varying vec2 vUv; void main(){ float waves=sin(vWorld.x*0.55+uTime)*cos(vWorld.z*0.42-uTime*0.8); float glint=pow(max(0.0,sin(vWorld.x*0.9+vWorld.z*0.7+uTime*1.7)),18.0)*0.32; float fres=pow(1.0-max(0.0,abs(normalize(cross(dFdx(vWorld),dFdy(vWorld))).y)),2.0); vec3 c=mix(uDeep,uShallow,clamp(0.36+waves*0.2+fres*0.28,0.0,1.0)); c+=vec3(0.35,0.65,0.72)*(glint+fres*0.16); gl_FragColor=vec4(c,0.98); }`,
      });
      const water = new THREE.Mesh(new THREE.PlaneGeometry(420, 420, 180, 180), oceanMat);
      water.rotation.x = -Math.PI / 2; water.position.y = -1.25; water.receiveShadow = true; scene.add(water);

      const floor = new THREE.Mesh(new THREE.PlaneGeometry(180, 100), mat("#182d36", 0.35, 0.78));
      floor.rotation.x = -Math.PI / 2; floor.position.set(-30, -1.15, -36); scene.add(floor);

      function box(parent: Object3D, size: [number, number, number], material: Material, pos: [number, number, number], bevel = false) {
        const geometry = new THREE.BoxGeometry(...size);
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(...pos); mesh.castShadow = true; mesh.receiveShadow = true; parent.add(mesh);
        if (bevel) {
          const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geometry), new THREE.LineBasicMaterial({ color: 0xb7c8ce, transparent: true, opacity: 0.36 }));
          mesh.add(edges);
        }
        return mesh;
      }
      function groupAt(x: number, y: number, z: number) { const g = new THREE.Group(); g.position.set(x,y,z); scene.add(g); return g; }

      // Port: quay, container stacks, gantry cranes and mooring pylons.
      const port = groupAt(-12, 0, -7);
      box(port, [44, 1.1, 20], darkSteel, [0, -0.45, -16]);
      for (let row=0; row<3; row++) for (let col=0; col<8; col++) {
        const colors = [orange, teal, steel, mat("#a8b9c0",0.5,0.48), mat("#315b71",0.5,0.44)];
        const c = box(port, [4.7, 2.2, 2.7], colors[(row*3+col)%colors.length], [-18+col*5.2, 1.1+row*2.25, -22+row*3.1], true);
        for (let k=-2; k<=2; k++) box(c, [0.045, 2.02, 2.72], mat("#0b2938",0.35,0.7), [k*0.82,0,0]);
      }
      for (const x of [-25, 1]) {
        box(port,[1.1,19,1.1],orange,[x,8.8,-15]);
        box(port,[1.1,1.1,24],orange,[x,18,-15]);
        box(port,[1.1,0.5,25],steel,[x,17.35,-15]);
        box(port,[0.4,9,0.4],steel,[x+3,12,-15]);
        box(port,[0.18,7,0.18],darkSteel,[x+3.1,10,-15]);
      }
      // Cargo ship with deep hull, deck, bridge and an individually modelled container manifest.
      const ship = groupAt(2, 0, 10);
      const hull = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.8, 31, 8, 1, false), mat("#152e3b",0.75,0.3));
      hull.rotation.z = Math.PI/2; hull.scale.set(1,0.55,1.05); hull.position.y = 0; hull.castShadow=true; ship.add(hull);
      box(ship,[30,1.4,5.2],mat("#e4e8e5",0.65,0.35),[0,0.45,0]);
      box(ship,[4,4.8,4.5],white,[-11,3,0]);
      box(ship,[3.2,1.1,3.4],teal,[-11,5.8,0]);
      for(let row=0;row<3;row++) for(let col=0;col<7;col++) {
        const palette=[orange,teal,mat("#d7d9d2",0.4,0.5),mat("#1f4c65",0.4,0.5),mat("#9d5538",0.5,0.4)];
        box(ship,[3.6,1.45,2.05],palette[(row*2+col)%palette.length],[-7.5+col*2.05,1.65+row*1.5, row%2?0.65:-0.65],true);
      }
      // Aircraft: fuselage, tapered nose, swept wings, tailplanes, engine nacelles.
      const aircraft = groupAt(18, 17, -30);
      const fuselage = new THREE.Mesh(new THREE.CylinderGeometry(0.45,0.65,18,16), white);
      fuselage.rotation.z=Math.PI/2; fuselage.castShadow=true; aircraft.add(fuselage);
      const nose = new THREE.Mesh(new THREE.ConeGeometry(0.46,3.8,16), white); nose.rotation.z=-Math.PI/2; nose.position.x=10.3; aircraft.add(nose);
      box(aircraft,[6.2,0.16,21],white,[0,-0.1,0]);
      box(aircraft,[2.5,0.15,5.2],white,[-7.6,0.05,0]);
      box(aircraft,[0.18,1.6,2.5],teal,[-8.3,0.7,0]);
      for(const x of [-3.2,3.2]) {
        const engine=new THREE.Mesh(new THREE.CylinderGeometry(0.55,0.62,2.1,16),darkSteel); engine.rotation.x=Math.PI/2; engine.position.set(x,-0.65,0); aircraft.add(engine);
        const intake=new THREE.Mesh(new THREE.CircleGeometry(0.45,20),rubber); intake.position.set(x,-0.65,1.07); aircraft.add(intake);
      }
      // Rail: ballast, sleepers, paired rails, engine and five intermodal wagons.
      const rail = groupAt(18,0,-2);
      box(rail,[64,0.35,11],mat("#29343a",0.2,0.9),[0,-0.72,0]);
      for(let i=0;i<52;i++) box(rail,[0.24,0.18,8],mat("#574b3f",0.15,0.85),[-30+i*1.2,-0.48,0]);
      for(const z of [-2.8,2.8]) box(rail,[64,0.28,0.22],steel,[0,-0.32,z]);
      box(rail,[8,2.8,5],teal,[-20,1.2,0]); box(rail,[4,1.4,4.7],white,[-22,3,0]);
      for(let i=0;i<5;i++){ box(rail,[7,2.5,4.7],i%2?orange:mat("#406a7d",0.45,0.4),[-10+i*8,1.1,0],true); for(const x of [-2,2]){const wheel=new THREE.Mesh(new THREE.CylinderGeometry(0.55,0.55,0.35,16),rubber);wheel.rotation.z=Math.PI/2;wheel.position.set(-10+i*8+x,0.05,2.45);rail.add(wheel);}}
      // Tiny distant lights make the network read as a living industrial world.
      const beaconMat = new THREE.MeshBasicMaterial({color:"#57ead7"});
      for(let i=0;i<32;i++){const b=new THREE.Mesh(new THREE.SphereGeometry(0.12,8,8),beaconMat);b.position.set(-48+(i*17)%96,0.2+(i%5)*0.4,-48+(i*23)%85);scene.add(b);}
      const stars = new THREE.Points(new THREE.BufferGeometry(), new THREE.PointsMaterial({color:0x8acbde,size:0.18,transparent:true,opacity:0.72}));
      const starPositions = new Float32Array(240*3);
      for(let i=0;i<240;i++){starPositions[i*3]=(Math.random()-0.5)*240;starPositions[i*3+1]=18+Math.random()*90;starPositions[i*3+2]=-100+Math.random()*150;}
      stars.geometry.setAttribute("position",new THREE.BufferAttribute(starPositions,3));scene.add(stars);

      const resize=()=>{if(!canvas || disposed)return; const w=canvas.clientWidth||window.innerWidth;const h=canvas.clientHeight||window.innerHeight;renderer?.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();};
      resize(); window.addEventListener("resize",resize);
      const pointer={x:0,y:0,tx:0,ty:0};
      const move=(e:PointerEvent)=>{pointer.tx=(e.clientX/window.innerWidth-.5)*2;pointer.ty=(e.clientY/window.innerHeight-.5)*2;};
      window.addEventListener("pointermove",move,{passive:true});
      const start=performance.now();
      const render=(now:number)=>{
        if(disposed)return;
        const t=(now-start)/1000;
        oceanMat.uniforms.uTime.value=t;
        const p=Number(document.documentElement.style.getPropertyValue("--journey-progress"))||0;
        const segment=p*4;
        const keyframes=[
          {x:-4,y:12,z:34,tx:-12,ty:1,tz:-8},
          {x:4,y:8,z:26,tx:0,ty:0,tz:6},
          {x:19,y:20,z:23,tx:18,ty:13,tz:-30},
          {x:22,y:9,z:24,tx:18,ty:1,tz:-3},
          {x:0,y:25,z:58,tx:0,ty:3,tz:-14},
        ];
        const a=keyframes[Math.min(3,Math.floor(segment))], b=keyframes[Math.min(4,Math.floor(segment)+1)], f=Math.min(1,segment-Math.floor(segment));
        const lerp=(v:number,w:number)=>v+(w-v)*f;
        camera.position.set(lerp(a.x,b.x)+pointer.x*1.8,lerp(a.y,b.y)-pointer.y*1.1,lerp(a.z,b.z));
        camera.lookAt(lerp(a.tx,b.tx),lerp(a.ty,b.ty),lerp(a.tz,b.tz));
        camera.rotation.z=pointer.x*0.006;
        ship.position.x=2+Math.sin(t*0.35)*0.7; ship.position.y=Math.sin(t*0.8)*0.12;
        aircraft.position.x=18+Math.sin(t*0.12)*4; aircraft.position.y=17+Math.sin(t*0.4)*1.1; aircraft.rotation.z=Math.sin(t*0.15)*0.025;
        rail.position.x=18+Math.sin(t*0.18)*1.5;
        port.rotation.y=Math.sin(t*0.08)*0.008;
        renderer?.render(scene,camera);
        frame=window.requestAnimationFrame(render);
      };
      frame=window.requestAnimationFrame(render);
      cleanup=()=>{window.cancelAnimationFrame(frame);window.removeEventListener("resize",resize);window.removeEventListener("pointermove",move);scene.traverse(o=>{if(o instanceof THREE.Mesh||o instanceof THREE.Points){o.geometry.dispose();const m=o.material;if(Array.isArray(m))m.forEach(x=>x.dispose());else m.dispose();}});renderer?.dispose();};
    }).catch((error) => console.error("Unable to initialize NCSI 3D world:", error));

    return () => { disposed = true; if(frame)window.cancelAnimationFrame(frame);cleanup?.();renderer?.dispose(); };
  }, []);

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
    update(); window.addEventListener("scroll", update, { passive: true }); window.addEventListener("resize", update);
    return () => { if (raf) window.cancelAnimationFrame(raf); window.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, []);

  useEffect(() => {
    if (!menu && !inquiry) return;
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") { setMenu(false); setInquiry(false); } };
    window.addEventListener("keydown", onKeyDown); return () => window.removeEventListener("keydown", onKeyDown);
  }, [menu, inquiry]);

  function scrollToStage(index: number) {
    const runway = document.querySelector<HTMLElement>(".journey-runway");
    const runwayTop = runway ? runway.getBoundingClientRect().top + window.scrollY : 0;
    const target = runwayTop + Math.min(scenes.length - 1, Math.max(0, index)) * window.innerHeight;
    window.scrollTo({ top: target, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }
  const scene = scenes[active];

  return <main className="ncsi-journey" style={{ "--progress": progress, "--phase": active } as React.CSSProperties}>
    <canvas ref={canvasRef} className="journey-webgl" aria-label="Interactive 3D freight world with cargo ship, aircraft, port and train" />
    <div className="journey-runway" aria-hidden="true">{scenes.map((s) => <div key={s.id} id={"runway-" + s.id} />)}</div>
    <div className={"journey-stage mode-" + scene.mode}>
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
        <h1>{scene.title}</h1><p>{scene.copy}</p>
        <div className="journey-stat"><b>{scene.stat}</b><span>{scene.label}</span></div>
        <button className="journey-cta" onClick={()=>{if(active<scenes.length-1)scrollToStage(active+1);else setInquiry(true)}}>{active===scenes.length-1?"START YOUR SHIPMENT":"TRAVEL FURTHER"} <span>↘</span></button>
      </div>
      <div className="journey-rail">{scenes.map((s,i)=><button key={s.id} aria-label={"Go to " + s.label} className={i===active?"is-active":""} onClick={()=>scrollToStage(i)}><span>{s.no}</span><i/></button>)}</div>
      <div className="journey-footer"><span>SCROLL TO MOVE THROUGH THE WORLD <b>↓</b></span><div className="journey-progress"><i style={{transform:"scaleX("+progress+")"}}/></div><b>{String(Math.round(progress*100)).padStart(2,"0")}%</b></div>
      <div className="journey-cursor" aria-hidden="true"><i/></div>
      {inquiry && <div className="journey-inquiry-backdrop" role="dialog" aria-modal="true" aria-label="Start a shipment inquiry"><div className="journey-inquiry"><button className="inquiry-close" onClick={()=>setInquiry(false)} aria-label="Close inquiry">×</button><div className="journey-eyebrow"><i/> YOUR NEXT MOVE</div><h2>Let&apos;s move<br/><em>something forward.</em></h2><p>Tell us what you need to lease or move.</p><LeadForm kind="quote" buttonLabel="Send inquiry ↗"/></div></div>}
    </div>
    <div className="journey-end" aria-hidden="true"><span>YOU ARE HERE.</span><b>NCSI FREIGHT SUPPLIES</b><span>THE WORLD KEEPS MOVING.</span></div>
  </main>;
}
