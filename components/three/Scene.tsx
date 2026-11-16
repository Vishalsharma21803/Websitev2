'use client';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, Grid, OrbitControls } from '@react-three/drei';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { scene } from '@/lib/store';
import { useTheme } from '@/lib/store';
import { phase, palette, smooth, type Palette } from './palette';
import { Agent, Flow, MobileApp, WebPlatform } from './Deliverables';

/* Layout of the four deliverables on the drafting table (world units). */
const LAYOUT = [
  { pos: new THREE.Vector3(-2.15, 1.42, -0.8), rotY: 0.34, dist: 5.2, lift: 0.35 },
  { pos: new THREE.Vector3(0.2, 0.98, 0.7), rotY: -0.1, dist: 4.3, lift: 0.2 },
  { pos: new THREE.Vector3(2.45, 0.92, -0.55), rotY: -0.42, dist: 5.9, lift: 0.25, look: 0.95 },
  { pos: new THREE.Vector3(-0.1, 0, 2.6), rotY: 0, dist: 0, lift: 0 },
];

/* Reads scroll + intro time, writes the shared phase values. */
function Director({ reduced }: { reduced: boolean }) {
  const t0 = useRef(0);
  useEffect(() => {
    phase.p = reduced ? 0.4 : scene.progress;
  }, [reduced]);
  useFrame((state, dt) => {
    const d = Math.min(dt, 0.05);
    // Opening sequence runs on wall-clock time so slow devices still finish it on schedule.
    t0.current = state.clock.elapsedTime;
    // Ease toward the scroll position so every phase glides rather than tracks raw input.
    const target = reduced ? 0.4 : scene.progress;
    phase.p += (target - phase.p) * (1 - Math.exp(-d * 7));
    const p = phase.p;
    phase.intro = reduced ? 1 : smooth(0, 2.4, t0.current);
    phase.draw = Math.max(phase.intro, smooth(0, 0.06, p));
    phase.figs = reduced ? 1 : smooth(2.0, 2.9, t0.current);
    phase.annotate = reduced ? 1 : smooth(0.085, 0.17, p);
    // A faint pencil fill appears once drawn, so the opening frame already reads as objects.
    const ghost = 0.16 * smooth(1.6, 2.8, t0.current);
    phase.fill = reduced ? 1 : Math.max(ghost, smooth(0.19, 0.3, p));
    phase.run = reduced ? 1 : smooth(0.31, 0.41, p);
    const seg = (p - 0.44) / 0.56;
    phase.focusMix = reduced ? 0 : smooth(0.435, 0.5, p);
    phase.focus = seg >= -0.02 && !reduced ? Math.min(3, Math.max(0, Math.floor(seg * 4))) : -1;
    if (!reduced) phase.time += d * (0.3 + 0.7 * phase.run);
  }, -1);
  return null;
}

/* Objects rise a little as they are drawn. */
function Rise({ delay, children }: { delay: number; children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(() => {
    if (!ref.current) return;
    const d = Math.min(1, Math.max(0, (phase.draw - delay) / 0.6));
    const e = 1 - Math.pow(1 - d, 3);
    ref.current.position.y = (1 - e) * -0.35;
    const s = 0.94 + 0.06 * e;
    ref.current.scale.setScalar(s);
  });
  return <group ref={ref}>{children}</group>;
}

/* Camera: slow orbit through the chapters, then fly to each deliverable. */
function Rig({ reduced }: { reduced: boolean }) {
  const { camera, size } = useThree();
  const look = useRef(new THREE.Vector3(0, 0.6, 0.4));
  const tmpPos = useMemo(() => new THREE.Vector3(), []);
  const tmpLook = useMemo(() => new THREE.Vector3(), []);
  const focusPos = useMemo(() => new THREE.Vector3(), []);
  const focusLook = useMemo(() => new THREE.Vector3(), []);
  const shift = useRef(0.2);
  const yLift = useRef(0);

  const pointer = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  useEffect(() => {
    const move = (e: PointerEvent) => {
      pointer.current.tx = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.ty = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, []);

  useFrame((_, dt) => {
    const p = phase.p;
    const narrow = size.width / size.height < 0.85;
    const ptr = pointer.current;
    const kp = 1 - Math.exp(-Math.min(dt, 0.05) * 2.5);
    ptr.x += (ptr.tx - ptr.x) * kp;
    ptr.y += (ptr.ty - ptr.y) * kp;
    const open = 1 - phase.intro; // camera dollies in during the opening sequence
    const heroClose = 1 - smooth(0.02, 0.12, p);
    const radius = (narrow ? 23 : 11.2 + heroClose * 4.2) + open * 1.6;
    // Phones hold the compact angle that fits all four objects; wider screens orbit through the chapters.
    const az = (narrow ? -0.05 : 0.42 - Math.min(p, 0.44) * 1.25) + open * 0.22 + (reduced ? 0 : ptr.x * 0.05);
    const height = (narrow ? 5.4 : 4.1) - Math.min(p, 0.44) * 1.2 + open * 0.9 - (reduced ? 0 : ptr.y * 0.25);
    tmpLook.set(0.05, 0.55, 0.45);
    tmpPos.set(Math.sin(az) * radius + tmpLook.x, height, Math.cos(az) * radius + tmpLook.z);

    if (phase.focus >= 0) {
      const L = LAYOUT[phase.focus];
      if (phase.focus === 3) {
        // Aim left of the line so it settles right of the copy card.
        focusLook.copy(L.pos).add(new THREE.Vector3(narrow ? 0 : 0.1, 0.2, 0));
        focusPos.set(L.pos.x + 0.9, L.pos.y + (narrow ? 5.6 : 5.5), L.pos.z + (narrow ? 7.4 : 9.1));
      } else {
        const n = new THREE.Vector3(Math.sin(L.rotY), 0, Math.cos(L.rotY));
        const side = new THREE.Vector3(Math.cos(L.rotY), 0, -Math.sin(L.rotY));
        focusLook.copy(L.pos).addScaledVector(side, (L as { look?: number }).look ?? 0);
        focusPos.copy(L.pos).addScaledVector(n, L.dist * (narrow ? 1.55 : 1)).add(new THREE.Vector3(0, L.lift, 0));
      }
      tmpPos.lerp(focusPos, phase.focusMix);
      tmpLook.lerp(focusLook, phase.focusMix);
    }

    const k = 1 - Math.exp(-Math.min(dt, 0.05) * 2.6);
    camera.position.lerp(tmpPos, k);
    look.current.lerp(tmpLook, k);
    camera.lookAt(look.current);

    // Shift the drawing away from the copy column.
    const target = narrow ? 0 : p < 0.09 ? (size.width / size.height > 1.45 ? 0.19 : 0.22) : phase.focus === 3 ? 0.23 : phase.focus >= 0 ? 0.22 : 0.03;
    shift.current += (target - shift.current) * k;
    const cam = camera as THREE.PerspectiveCamera;
    const chapterLift = p >= 0.09 && phase.focus < 0 ? 0.06 : 0;
    yLift.current += ((narrow ? 0.06 : chapterLift) - yLift.current) * k;
    const yShift = yLift.current;
    cam.setViewOffset(size.width, size.height, -size.width * shift.current, size.height * yShift, size.width, size.height);
  });
  return null;
}

function Shadows({ pal }: { pal: Palette }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(() => {
    const plane = ref.current?.children[0] as THREE.Mesh | undefined;
    const mat = plane?.material as THREE.MeshBasicMaterial | undefined;
    if (mat) mat.opacity = 0.42 * phase.fill;
  });
  return <ContactShadows ref={ref} position={[0, 0.001, 0]} scale={16} blur={2.4} far={3.2} resolution={512} frames={1} color={pal.ink} opacity={0} />;
}

function World({ reduced }: { reduced: boolean }) {
  const theme = useTheme();
  const pal = useMemo(() => palette(theme), [theme]);
  return (
    <>
      <Director reduced={reduced} />
      <Rig reduced={reduced} />
      <ambientLight intensity={theme === 'dark' ? 1.4 : 2.1} />
      <directionalLight position={[4, 7, 5]} intensity={theme === 'dark' ? 1.1 : 1.5} />
      <directionalLight position={[-5, 3, -2]} intensity={0.35} />
      <Grid
        position={[0, 0, 0]}
        args={[40, 40]}
        cellSize={0.25}
        cellThickness={0.6}
        cellColor={pal.grid}
        sectionSize={1}
        sectionThickness={1}
        sectionColor={pal.gridMajor}
        fadeDistance={20}
        fadeStrength={2.2}
        infiniteGrid
      />
      <Shadows pal={pal} />
      {LAYOUT.map((L, i) => {
        const Obj = [WebPlatform, MobileApp, Agent, Flow][i];
        return (
          <group key={i} position={L.pos} rotation={[0, L.rotY, 0]}>
            <Rise delay={i * 0.11}>
              <Obj pal={pal} index={i} delay={i * 0.11} />
            </Rise>
          </group>
        );
      })}
    </>
  );
}

export default function AssemblyCanvas({ active, reduced }: { active: boolean; reduced: boolean }) {
  return (
    <Canvas
      className="assembly-canvas"
      frameloop={active ? 'always' : 'never'}
      dpr={[1, 1.6]}
      camera={{ fov: 30, near: 0.1, far: 80, position: [6, 5.6, 11.5] }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      flat
      aria-hidden="true"
    >
      <World reduced={reduced} />
    </Canvas>
  );
}

/* ---------------------------------------------------------------------------
   Single-object viewer for service pages: draws, fills and runs on its own,
   then hands control to the visitor (drag to rotate).
--------------------------------------------------------------------------- */
function SoloDirector() {
  const t = useRef(0);
  useFrame((_, dt) => {
    t.current += Math.min(dt, 0.05);
    const s = t.current;
    phase.draw = Math.min(1, s / 2.2);
    phase.annotate = smooth(2.0, 2.8, s);
    phase.fill = smooth(2.6, 3.6, s);
    phase.run = smooth(3.6, 4.4, s);
    phase.focus = -1;
    phase.focusMix = 0;
    phase.figs = phase.annotate;
    phase.intro = 1;
    phase.time += Math.min(dt, 0.05) * (0.3 + 0.7 * phase.run);
  }, -1);
  return null;
}

export function SoloCanvas({ which }: { which: 0 | 1 | 2 | 3 }) {
  const theme = useTheme();
  const pal = useMemo(() => palette(theme), [theme]);
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const Obj = [WebPlatform, MobileApp, Agent, Flow][which];
  const cam: [number, number, number] = which === 3 ? [1.3, 3.4, 6.0] : which === 1 ? [1.4, 0.65, 6.6] : [1.7, 0.8, 6.8];
  if (!ready) return null;
  return (
    <Canvas className="solo-canvas" dpr={[1, 1.75]} camera={{ fov: 30, position: cam }} gl={{ antialias: true, alpha: true }} flat aria-hidden="true">
      <SoloDirector />
      <ambientLight intensity={theme === 'dark' ? 1.4 : 2.1} />
      <directionalLight position={[4, 7, 5]} intensity={1.4} />
      <group position={which === 3 ? [0, -0.2, 0] : [0, 0, 0]}>
        <Obj pal={pal} index={0} delay={0} />
      </group>
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.6} minPolarAngle={0.6} maxPolarAngle={1.75} target={[0, which === 3 ? 0 : 0, 0]} />
    </Canvas>
  );
}
