"use client";

import { useEffect, useRef, useState } from "react";
import { LeadForm } from "@/components/LeadForm";
import type { ColorRepresentation, Material, Mesh, Object3D } from "three";

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
      scene.fog = new THREE.FogExp2("#071d2b", 0.0048);
      const camera = new THREE.PerspectiveCamera(43, 1, 0.1, 900);
      camera.position.set(0, 16, 34);
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: "high-performance" });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, window.innerWidth < 760 ? 1.35 : 1.7));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.16;
      // Procedural studio-sky environment: gives metallic surfaces broad, believable reflections
      // without an external HDR download or a runtime network dependency.
      const environmentCanvas = document.createElement("canvas");
      environmentCanvas.width = 1024; environmentCanvas.height = 512;
      const environmentContext = environmentCanvas.getContext("2d");
      if (environmentContext) {
        const sky = environmentContext.createLinearGradient(0, 0, 0, 512);
        sky.addColorStop(0, "#06111f"); sky.addColorStop(0.34, "#183747");
        sky.addColorStop(0.53, "#d19a70"); sky.addColorStop(0.61, "#607d85");
        sky.addColorStop(1, "#071c2b");
        environmentContext.fillStyle = sky; environmentContext.fillRect(0, 0, 1024, 512);
        const horizon = environmentContext.createRadialGradient(512, 270, 8, 512, 270, 310);
        horizon.addColorStop(0, "rgba(255,220,172,0.9)");
        horizon.addColorStop(0.18, "rgba(255,183,123,0.28)");
        horizon.addColorStop(1, "rgba(255,183,123,0)");
        environmentContext.fillStyle = horizon; environmentContext.fillRect(0, 0, 1024, 512);
        for (let band = 0; band < 18; band++) {
          const y = 165 + band * 12;
          environmentContext.fillStyle = band % 3 === 0 ? "rgba(203,239,238,0.12)" : "rgba(5,20,34,0.09)";
          environmentContext.fillRect(0, y, 1024, band % 4 === 0 ? 2 : 1);
        }
      }
      const environmentTexture = new THREE.CanvasTexture(environmentCanvas);
      environmentTexture.mapping = THREE.EquirectangularReflectionMapping;
      environmentTexture.colorSpace = THREE.SRGBColorSpace;
      environmentTexture.needsUpdate = true;
      scene.environment = environmentTexture;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      scene.add(new THREE.HemisphereLight(0xb7d8eb, 0x14232b, 1.55));
      const sun = new THREE.DirectionalLight(0xffe3bf, 4.2);
      sun.position.set(-18, 32, 12); sun.castShadow = true;
      sun.shadow.mapSize.set(2048, 2048); sun.shadow.camera.left=-70; sun.shadow.camera.right=70; sun.shadow.camera.top=70; sun.shadow.camera.bottom=-70;
      scene.add(sun);
      const rim = new THREE.DirectionalLight(0x73cde0, 2.25); rim.position.set(22, 12, -24); scene.add(rim);
      const fill = new THREE.PointLight(0x2a7897, 95, 150); fill.position.set(0, 12, 8); scene.add(fill);
      const horizonGlow = new THREE.PointLight(0xffa875, 180, 180);
      horizonGlow.position.set(-8, 9, -58); scene.add(horizonGlow);
      const portGlow = new THREE.PointLight(0x45cfc2, 65, 85);
      portGlow.position.set(-15, 8, -12); scene.add(portGlow);

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
        vertexShader: `varying vec3 vWorld; varying vec2 vUv; uniform float uTime; void main(){ vUv=uv; vec3 p=position; float w=sin(p.x*0.035+uTime*0.42)*0.28+cos(p.y*0.047-uTime*0.31)*0.17+sin((p.x+p.y)*0.021+uTime*0.28)*0.22; p.z+=w; vec4 world=modelMatrix*vec4(p,1.0); vWorld=world.xyz; gl_Position=projectionMatrix*viewMatrix*world; }`,
        fragmentShader: `uniform vec3 uDeep; uniform vec3 uShallow; uniform vec3 uSun; uniform float uTime; varying vec3 vWorld; varying vec2 vUv; void main(){ float w1=sin(vWorld.x*0.075+uTime*0.38)*cos(vWorld.z*0.061-uTime*0.29); float w2=sin(vWorld.x*0.021-vWorld.z*0.035+uTime*0.18); float fres=pow(1.0-max(0.0,abs(normalize(cross(dFdx(vWorld),dFdy(vWorld))).y)),2.2); float specA=pow(max(0.0,sin(vWorld.x*0.13+vWorld.z*0.07+uTime*0.5)),22.0); float specB=pow(max(0.0,sin(vWorld.x*0.27-vWorld.z*0.11-uTime*0.72)),38.0); float sunPath=exp(-abs(vWorld.x+vWorld.z*0.32)*0.018); float reflection=(specA*0.09+specB*0.06+sunPath*specA*0.2); vec3 c=mix(uDeep,uShallow,clamp(0.38+w1*0.13+w2*0.11+fres*0.28,0.0,1.0)); c+=vec3(0.28,0.67,0.72)*(reflection+fres*0.11); c+=vec3(0.8,0.48,0.28)*sunPath*specB*0.16; gl_FragColor=vec4(c,1.0); }`,
      });
      const water = new THREE.Mesh(new THREE.PlaneGeometry(420, 420, 220, 220), oceanMat);
      water.rotation.x = -Math.PI / 2; water.position.y = -1.25; water.receiveShadow = true; scene.add(water);
      // Fine parallel wake lines add scale and directional motion to the sea without heavy geometry.
      const wakeMaterial = new THREE.LineBasicMaterial({color:0x4eb9bd,transparent:true,opacity:0.11});
      const wakeLines = new THREE.Group(); scene.add(wakeLines);
      for(let i=0;i<34;i++) {
        const z=-42+i*2.45;
        const points=[new THREE.Vector3(-110, -1.12, z),new THREE.Vector3(-38,-1.12,z+Math.sin(i*0.6)*1.4),new THREE.Vector3(24,-1.12,z+Math.cos(i*0.4)*2.1),new THREE.Vector3(110,-1.12,z+Math.sin(i*0.7)*1.6)];
        const line=new THREE.Line(new THREE.BufferGeometry().setFromPoints(points),wakeMaterial);
        wakeLines.add(line);
      }

      const floor = new THREE.Mesh(new THREE.PlaneGeometry(180, 100), mat("#182d36", 0.35, 0.78));
      floor.rotation.x = -Math.PI / 2; floor.position.set(-30, -1.15, -36); scene.add(floor);

      // A continuous animated route gives the world a connected operational scale.
      const routeMaterial = new THREE.LineBasicMaterial({ color: 0x50d8ca, transparent: true, opacity: 0.46 });
      const routeGlowMaterial = new THREE.LineBasicMaterial({ color: 0x72e6d6, transparent: true, opacity: 0.13 });
      const routePoints = [
        new THREE.Vector3(-54,0.18,-10), new THREE.Vector3(-38,0.22,-4),
        new THREE.Vector3(-20,0.18,8), new THREE.Vector3(-4,0.24,15),
        new THREE.Vector3(16,0.2,8), new THREE.Vector3(31,0.25,-6),
        new THREE.Vector3(48,0.2,-20), new THREE.Vector3(64,0.18,-28)
      ];
      const routeCurve = new THREE.CatmullRomCurve3(routePoints);
      const routeLine = new THREE.Line(new THREE.BufferGeometry().setFromPoints(routeCurve.getPoints(220)),routeMaterial);
      scene.add(routeLine);
      const routeGlow = new THREE.Line(new THREE.BufferGeometry().setFromPoints(routeCurve.getPoints(220)),routeGlowMaterial);
      scene.add(routeGlow);
      const routeMarkers: Mesh[] = [];
      for(let i=0;i<18;i++) {
        const point=routeCurve.getPoint(i/17);
        const marker = new THREE.Mesh(new THREE.SphereGeometry(0.16,10,8),new THREE.MeshBasicMaterial({color: i%3===0 ? 0xf0a46d : 0x68f0dc}));
        marker.position.copy(point); scene.add(marker); routeMarkers.push(marker);
      }
      const routePulse = new THREE.Mesh(new THREE.SphereGeometry(0.28,12,10),new THREE.MeshBasicMaterial({color:0xd5fff5}));
      scene.add(routePulse);
      const beaconLight = new THREE.PointLight(0x4ee5d0,12,28); scene.add(beaconLight);


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
      const laneMaterial = new THREE.MeshStandardMaterial({color:"#a4b5b5",metalness:0.22,roughness:0.76,emissive:"#28494b",emissiveIntensity:0.08});
      for(let lane=0;lane<7;lane++) {
        const line = new THREE.Mesh(new THREE.BoxGeometry(0.09,0.025,28),laneMaterial);
        line.position.set(-31+lane*4.8,-0.56,-14); port.add(line);
      }
      for(let i=0;i<12;i++) {
        const light = new THREE.Mesh(new THREE.BoxGeometry(0.12,0.08,0.12),new THREE.MeshBasicMaterial({color:0x7af5de}));
        light.position.set(-31+(i%6)*5.2,0.05,-4+Math.floor(i/6)*5);
        scene.add(light);
      }
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
        for (const dx of [0.2,1.5,2.7]) {
          const cable = new THREE.Mesh(new THREE.CylinderGeometry(0.025,0.025,15,6),darkSteel);
          cable.position.set(x+dx,9.4,-15); cable.castShadow=true; port.add(cable);
        }
        box(port,[5.5,0.35,2.6],steel,[x+2.2,16.5,-15]);
        for(const side of [-1,1]) {
          const diagonal=new THREE.Mesh(new THREE.CylinderGeometry(0.075,0.075,18,6),steel);
          diagonal.position.set(x+1.1,9.2,-15+side*0.82);
          diagonal.rotation.z=side*Math.atan2(17,3.2); port.add(diagonal);
        }
        box(port,[1.1,0.45,1.1],darkSteel,[x+2.2,16.1,-15]);
        for(let trolley=0;trolley<3;trolley++) {
          const hook = new THREE.Mesh(new THREE.CylinderGeometry(0.045,0.045,4.6,6),darkSteel);
          hook.position.set(x-1.6+trolley*1.6,13.7,-15); port.add(hook);
          box(port,[1.25,0.14,2.1],steel,[x-1.6+trolley*1.6,11.3,-15]);
        }
      }
      // Cargo ship with deep hull, deck, bridge and an individually modelled container manifest.
      const ship = groupAt(2, 0, 18); ship.scale.setScalar(0.78);
      const hullShape = new THREE.Shape(); hullShape.moveTo(-16,-0.1); hullShape.lineTo(13.2,-0.1); hullShape.lineTo(15.8,0.55); hullShape.lineTo(12.8,2.5); hullShape.lineTo(-12.8,2.5); hullShape.lineTo(-15.6,1.25); hullShape.closePath();
      const hullGeo = new THREE.ExtrudeGeometry(hullShape,{depth:4.8,bevelEnabled:true,bevelSegments:3,steps:1,bevelSize:0.22,bevelThickness:0.22});
      const hull = new THREE.Mesh(hullGeo, mat("#172c38",0.82,0.22)); hull.position.set(0,-1.35,-2.4); hull.castShadow=true; hull.receiveShadow=true; ship.add(hull);
      const waterline = new THREE.Mesh(new THREE.BoxGeometry(28.8,0.12,4.86), mat("#d8e0d9",0.65,0.24)); waterline.position.set(-0.2,-0.1,0); ship.add(waterline);
      box(ship,[5.4,0.22,4.3],steel,[12.2,0.52,0]);
      for (let i=0;i<12;i++) { const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.045,0.045,3.6,8),mat("#c8d0c9",0.78,0.3)); pipe.rotation.x=Math.PI/2; pipe.position.set(-12.8+i*2.15,0.76,0); ship.add(pipe); }
      for (let i=0;i<7;i++) { const bollard = new THREE.Mesh(new THREE.CylinderGeometry(0.12,0.15,0.34,10),darkSteel); bollard.position.set(-12+i*4,0.78,2.15); ship.add(bollard); }
      const bridgeWindowMat = new THREE.MeshStandardMaterial({color:"#173b49",metalness:0.45,roughness:0.18,emissive:"#0b303b",emissiveIntensity:0.25});
      box(ship,[3.65,0.78,4.25],bridgeWindowMat,[-11,4.35,0]);
      box(ship,[4.4,0.12,4.7],steel,[-11,5.1,0]);
      const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.045,0.07,2.2,8),white); mast.position.set(-11,6.2,0); ship.add(mast);
      for (const side of [-1,1]) { const rail = box(ship,[25,0.12,0.08],white,[0,0.78,side*2.34]); rail.material = white; }
      box(ship,[29,0.55,4.9],mat("#c9d1d0",0.62,0.32),[0,0.42,0]);
      box(ship,[4,4.8,4.5],white,[-11,3,0]);
      box(ship,[3.2,1.1,3.4],teal,[-11,5.8,0]);
      for(let row=0;row<3;row++) for(let col=0;col<7;col++) {
        const palette=[orange,teal,mat("#d7d9d2",0.4,0.5),mat("#1f4c65",0.4,0.5),mat("#9d5538",0.5,0.4)];
        const container=box(ship,[3.6,1.45,2.05],palette[(row*2+col)%palette.length],[-7.5+col*2.05,1.65+row*1.5, row%2?0.65:-0.65],true);
        for(let rib=-5;rib<=5;rib++) box(container,[0.035,1.3,2.08],mat("#102b36",0.42,0.58),[rib*0.31,0,0]);
        box(container,[0.8,0.08,0.04],white,[-1.1,0.47,1.04]);
      }
      // Visible ship hardware: stern propeller, rudder, lifeboats and deck safety rails.
      const propellerMat=mat("#b7c6c4",0.88,0.22);
      const propellerHub=new THREE.Mesh(new THREE.CylinderGeometry(0.18,0.22,0.36,12),propellerMat);
      propellerHub.rotation.x=Math.PI/2; propellerHub.position.set(-15.5,-0.7,0); ship.add(propellerHub);
      for(let blade=0;blade<5;blade++) {
        const propBlade=box(ship,[0.12,0.82,0.28],propellerMat,[-15.72,-0.7,0]);
        propBlade.rotation.x=blade*Math.PI*2/5;
      }
      box(ship,[0.22,1.25,0.9],darkSteel,[15.15,-0.45,0]);
      for(const side of [-1,1]) {
        const lifeboat=new THREE.Mesh(new THREE.CapsuleGeometry(0.32,2.1,4,8),orange);
        lifeboat.rotation.z=Math.PI/2; lifeboat.position.set(-10.7,3.25,side*2.48); ship.add(lifeboat);
        for(let rail=0;rail<18;rail++) {
          const stanchion=new THREE.Mesh(new THREE.CylinderGeometry(0.018,0.018,0.42,5),white);
          stanchion.position.set(-12+rail*1.4,0.96,side*2.38); ship.add(stanchion);
        }
      }
      for(let mark=0;mark<9;mark++) {
        const deckMark=new THREE.Mesh(new THREE.BoxGeometry(0.75,0.018,0.06),mat("#d5e2dc",0.2,0.7));
        deckMark.position.set(-8+mark*1.9,0.715,2.02); ship.add(deckMark);
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
        const engine=new THREE.Mesh(new THREE.CylinderGeometry(0.55,0.62,2.1,24),darkSteel); engine.rotation.x=Math.PI/2; engine.position.set(x,-0.65,0); engine.castShadow=true; aircraft.add(engine);
        const intake=new THREE.Mesh(new THREE.CircleGeometry(0.45,24),rubber); intake.position.set(x,-0.65,1.07); aircraft.add(intake);
        const innerFan = new THREE.Mesh(new THREE.CircleGeometry(0.32,18),steel); innerFan.position.set(x,-0.65,1.075); aircraft.add(innerFan);
        for(let blade=0;blade<8;blade++) {
          const fin = box(aircraft,[0.035,0.38,0.035],white,[x+Math.cos(blade*Math.PI/4)*0.19,-0.65+Math.sin(blade*Math.PI/4)*0.19,1.09]);
          fin.rotation.z=blade*Math.PI/4;
        }
      }
      const windowMat = new THREE.MeshStandardMaterial({color:"#173b49",metalness:0.32,roughness:0.2,emissive:"#0b2933",emissiveIntensity:0.18});
      for(let i=0;i<13;i++) {
        const window = new THREE.Mesh(new THREE.SphereGeometry(0.095,8,6),windowMat);
        window.scale.set(1,0.55,0.38); window.position.set(-4.8+i*0.78,0.27,0.52); aircraft.add(window);
      }
      const cockpit = new THREE.Mesh(new THREE.SphereGeometry(0.42,12,8),windowMat);
      cockpit.scale.set(1.7,0.7,0.85); cockpit.position.set(8.2,0.24,0); aircraft.add(cockpit);
      box(aircraft,[0.22,1.2,2.4],orange,[-8.2,0.7,0]);
      // Wing control surfaces and navigation lights make the aircraft read as a complete machine.
      box(aircraft,[5.7,0.055,5.6],mat("#d7e2e0",0.55,0.42),[0,-0.005,0]);
      box(aircraft,[1.4,0.08,4.2],mat("#bacbc9",0.55,0.42),[-0.2,-0.025,0]);
      const navRed=new THREE.Mesh(new THREE.SphereGeometry(0.16,10,8),new THREE.MeshBasicMaterial({color:0xff514c}));
      navRed.position.set(-0.4,0,10.4); aircraft.add(navRed);
      const navGreen=new THREE.Mesh(new THREE.SphereGeometry(0.16,10,8),new THREE.MeshBasicMaterial({color:0x57f2b3}));
      navGreen.position.set(-0.4,0,-10.4); aircraft.add(navGreen);
      for(const side of [-1,1]) {
        const gearLeg=new THREE.Mesh(new THREE.CylinderGeometry(0.07,0.09,1.25,8),steel);
        gearLeg.position.set(1.8,-1.05,side*2.4); aircraft.add(gearLeg);
        for(const wheelX of [-0.18,0.18]) {
          const gearWheel=new THREE.Mesh(new THREE.CylinderGeometry(0.24,0.24,0.16,12),rubber);
          gearWheel.rotation.x=Math.PI/2; gearWheel.position.set(1.8+wheelX,-1.63,side*2.4); aircraft.add(gearWheel);
        }
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
      const cameraGoal = new THREE.Vector3();
      const lookGoal = new THREE.Vector3();
      const lookCurrent = new THREE.Vector3(0,4,-10);
      const cursorTrailCount = 260;
      const trailPositions = new Float32Array(cursorTrailCount * 3);
      const trailGeometry = new THREE.BufferGeometry();
      trailGeometry.setAttribute("position", new THREE.BufferAttribute(trailPositions, 3));
      const trailMaterial = new THREE.PointsMaterial({ color: 0x78ead7, size: 0.11, transparent: true, opacity: 0.62, depthWrite: false, blending: THREE.AdditiveBlending });
      const routeParticles = new THREE.Points(trailGeometry, trailMaterial);
      routeParticles.frustumCulled = false;
      scene.add(routeParticles);
      let trailHead = 0;
      const worldPointer = new THREE.Vector3();
      const move=(e:PointerEvent)=>{pointer.tx=(e.clientX/window.innerWidth-.5)*2;pointer.ty=(e.clientY/window.innerHeight-.5)*2;worldPointer.set(pointer.tx*18, (0.5-pointer.ty)*10, -8);document.documentElement.style.setProperty("--cursor-x", `${e.clientX}px`);document.documentElement.style.setProperty("--cursor-y", `${e.clientY}px`);};
      window.addEventListener("pointermove",move,{passive:true});
      const start=performance.now();
      let lastFrame = start;
      const render=(now:number)=>{
        if(disposed)return;
        const t=(now-start)/1000;
        oceanMat.uniforms.uTime.value=t;
        const p=Number(document.documentElement.style.getPropertyValue("--journey-progress"))||0;
        const segment=p*4;
        // Wide, editorial camera staging: keep the freight assets readable instead of cropping them.
        const keyframes=[
          {x:-1,y:19,z:53,tx:-10,ty:5,tz:-13},
          {x:5,y:15,z:52,tx:2,ty:1,tz:14},
          {x:20,y:26,z:52,tx:18,ty:16,tz:-30},
          {x:28,y:17,z:48,tx:18,ty:1,tz:-3},
          {x:0,y:34,z:78,tx:0,ty:4,tz:-14},
        ];
        const a=keyframes[Math.min(3,Math.floor(segment))], b=keyframes[Math.min(4,Math.floor(segment)+1)], f=Math.min(1,segment-Math.floor(segment));
        const lerp=(v:number,w:number)=>v+(w-v)*f;
        cameraGoal.set(lerp(a.x,b.x)+pointer.x*3.8,lerp(a.y,b.y)-pointer.y*2.4,lerp(a.z,b.z));
        lookGoal.set(lerp(a.tx,b.tx)+pointer.x*2.1,lerp(a.ty,b.ty)-pointer.y*1.2,lerp(a.tz,b.tz));
        const frameDelta = Math.min(0.05, Math.max(0.001, (now - lastFrame) / 1000));
        lastFrame = now;
        const cameraEase = 1 - Math.exp(-frameDelta * 4.5);
        camera.position.lerp(cameraGoal, cameraEase);
        lookCurrent.lerp(lookGoal, cameraEase * 0.82);
        camera.lookAt(lookCurrent);
        camera.rotation.z = pointer.x*0.002;
        pointer.x += (pointer.tx-pointer.x)*0.075;
        pointer.y += (pointer.ty-pointer.y)*0.075;
        const posAttr = trailGeometry.getAttribute("position") as import("three").BufferAttribute;
        const pointerSpeed = Math.hypot(pointer.tx-pointer.x,pointer.ty-pointer.y);
        if(pointerSpeed > 0.006) {
          const idx = (trailHead % cursorTrailCount) * 3;
          trailPositions[idx] = worldPointer.x + (Math.random()-0.5)*0.42;
          trailPositions[idx+1] = worldPointer.y + (Math.random()-0.5)*0.32;
          trailPositions[idx+2] = worldPointer.z + (Math.random()-0.5)*0.42;
          trailHead++;
        }
        for (let i=0;i<cursorTrailCount;i++) {
          const j=i*3;
          trailPositions[j] += Math.sin(t*0.7+i*0.12)*0.0007;
          trailPositions[j+1] += 0.0004 + Math.sin(t+i*0.07)*0.0006;
        }
        posAttr.needsUpdate = true;
        trailMaterial.opacity = 0.12 + Math.min(0.58, pointerSpeed*2.4);
        const routePhase = ((t * 0.055) % 1 + 1) % 1;
        // Sample the known route points directly; do not let a curve helper interrupt the render loop.
        const routeSegmentFloat = routePhase * (routePoints.length - 1);
        const routeSegment = Math.min(routePoints.length - 2, Math.floor(routeSegmentFloat));
        const routeMix = routeSegmentFloat - routeSegment;
        const routeStart = routePoints[routeSegment];
        const routeEnd = routePoints[routeSegment + 1];
        routePulse.position.set(
          routeStart.x + (routeEnd.x - routeStart.x) * routeMix,
          routeStart.y + (routeEnd.y - routeStart.y) * routeMix,
          routeStart.z + (routeEnd.z - routeStart.z) * routeMix
        );
        beaconLight.position.set(routePulse.position.x, routePulse.position.y + 1.8, routePulse.position.z);
        routePulse.scale.setScalar(0.78 + Math.sin(t*3.2)*0.18);
        routeMarkers.forEach((marker,i)=>{const pulse=0.82+0.18*Math.sin(t*1.8+i*0.7);marker.scale.setScalar(pulse);});
        ship.position.x=2+Math.sin(t*0.18)*0.35; ship.position.y=Math.sin(t*0.55)*0.08; ship.rotation.z=Math.sin(t*0.16)*0.008;
        aircraft.position.x=18+Math.sin(t*0.12)*4; aircraft.position.y=17+Math.sin(t*0.4)*1.1; aircraft.rotation.z=Math.sin(t*0.15)*0.025;
        rail.position.x=18+Math.sin(t*0.18)*1.5;
        port.rotation.y=Math.sin(t*0.08)*0.008;
        renderer?.render(scene,camera);
        frame=window.requestAnimationFrame(render);
      };
      frame=window.requestAnimationFrame(render);
      cleanup=()=>{window.cancelAnimationFrame(frame);window.removeEventListener("resize",resize);window.removeEventListener("pointermove",move);scene.traverse(o=>{if(o instanceof THREE.Mesh||o instanceof THREE.Points||o instanceof THREE.Line||o instanceof THREE.LineSegments){o.geometry.dispose();const m=o.material;if(Array.isArray(m))m.forEach(x=>x.dispose());else m.dispose();}});environmentTexture.dispose();renderer?.dispose();};
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
