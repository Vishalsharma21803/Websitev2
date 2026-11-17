'use client';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, Edges, Html, Line } from '@react-three/drei';
import { useEffect, useMemo, useRef, type ReactNode } from 'react';
import * as THREE from 'three';
import { useTheme } from '@/lib/store';
import { palette, type Palette } from './palette';

/**
 * "The steps to production": six platforms climbing toward production, each carrying a small working
 * model of its part of the Sifars Production Layer. A packet climbs the track; the step it is on lights up.
 */

const N = 6;
const SW = 1.2; // step width (x)
const SD = 1.75; // step depth (z)
const ST = 0.22; // slab thickness
const STEP_X = 1.34;
const STEP_Y = 0.36;
const STEP_Z = -0.26;
const DWELL = 1.5;
const TRAVEL = 0.95;
const TAIL = 0.9;
const LOOP = N * DWELL + (N - 1) * TRAVEL + TAIL;

const stepPos = (k: number) => new THREE.Vector3(-((N - 1) * STEP_X) / 2 + k * STEP_X, 0.3 + k * STEP_Y, 0.55 + k * STEP_Z);
const STEPS = Array.from({ length: N }, (_, k) => stepPos(k));
const LANE = SD / 2 - 0.28; // packet lane, just behind the front edge of each step
const RIDE = ST / 2 + 0.09; // packet centre above a step's top face
const GATE = 3; // step 04: the packet waits at the barrier until it lifts
const GATE_STOP = 0.3; // fraction of the step's run where the packet stops before the barrier
const GATE_WAIT: [number, number] = [0.32, 0.58]; // dwell span spent waiting; the barrier lifts at the start
/** At a hold the clock rests here in a step's dwell (after the wait, so 04 shows its barrier lifted). */
const HOLD_AT = 0.7;

const ease = (u: number) => (u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2);

/** How far along its step the packet is during a dwell. On the gate step it stops before the barrier and waits. */
function runAlong(k: number, u: number) {
  if (k !== GATE) return u;
  const [w0, w1] = GATE_WAIT;
  if (u < w0) return GATE_STOP * (1 - Math.pow(1 - u / w0, 2));
  if (u < w1) return GATE_STOP;
  return GATE_STOP + (1 - GATE_STOP) * Math.pow((u - w1) / (1 - w1), 2);
}

const _a = new THREE.Vector3();
const _b = new THREE.Vector3();
const frame = { pos: new THREE.Vector3(), active: 0, dwell: 0, fade: 0 };

/** Where the packet is at time t, and which step is active. Writes into one shared object: no per-frame allocation. */
function timeline(t: number) {
  let acc = 0;
  for (let k = 0; k < N; k++) {
    const c = STEPS[k];
    const top = c.y + RIDE;
    if (t < acc + DWELL) {
      const u = (t - acc) / DWELL;
      frame.pos.set(c.x - SW * 0.3 + runAlong(k, u) * SW * 0.6, top, c.z + LANE);
      frame.active = k;
      frame.dwell = u;
      frame.fade = k === 0 ? Math.min(1, u * 4) : 1;
      return frame;
    }
    acc += DWELL;
    if (k === N - 1) {
      frame.pos.set(c.x + SW * 0.3, top, c.z + LANE);
      frame.active = k;
      frame.dwell = 1;
      frame.fade = 1 - Math.min(1, (t - acc) / TAIL);
      return frame;
    }
    if (t < acc + TRAVEL) {
      const e = ease((t - acc) / TRAVEL);
      const n = STEPS[k + 1];
      const dz = (n.z - c.z) * 0.4;
      // Three legs: to the step's edge, up to the next step's edge, then onto the next step.
      if (e < 0.33) {
        _a.set(c.x + SW * 0.3, top, c.z + LANE);
        _b.set(c.x + SW / 2, top, c.z + LANE + dz);
        frame.pos.lerpVectors(_a, _b, e / 0.33);
      } else if (e < 0.66) {
        _a.set(c.x + SW / 2, top, c.z + LANE + dz);
        _b.set(n.x - SW / 2, n.y + RIDE, n.z + LANE - dz);
        frame.pos.lerpVectors(_a, _b, (e - 0.33) / 0.33);
      } else {
        _a.set(n.x - SW / 2, n.y + RIDE, n.z + LANE - dz);
        _b.set(n.x - SW * 0.3, n.y + RIDE, n.z + LANE);
        frame.pos.lerpVectors(_a, _b, (e - 0.66) / 0.34);
      }
      frame.active = k;
      frame.dwell = 1;
      frame.fade = 1;
      return frame;
    }
    acc += TRAVEL;
  }
  frame.pos.copy(STEPS[0]);
  frame.active = 0;
  frame.dwell = 0;
  frame.fade = 0;
  return frame;
}

/* ---------------------------------------------------------------- materials */
/** Paper for quiet parts, a blue-tinted paper for the live step. Shared by every step; freed when the theme changes. */
function useMats(pal: Palette) {
  const mats = useMemo(() => {
    const base = { roughness: 0.9, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 };
    return {
      paper: new THREE.MeshStandardMaterial({ color: pal.paper, ...base }),
      tint: new THREE.MeshStandardMaterial({ color: pal.blueSoft, ...base }),
    };
  }, [pal]);
  useEffect(
    () => () => {
      mats.paper.dispose();
      mats.tint.dispose();
    },
    [mats],
  );
  return mats;
}
type Mats = ReturnType<typeof useMats>;

/** One part of a model: filled, with edges. Quiet steps use soft grey edges; the live step is drawn in blue. */
function Part({
  geo,
  position,
  rotation,
  live,
  pal,
  mats,
  children,
}: {
  geo: ReactNode;
  position?: [number, number, number];
  rotation?: [number, number, number];
  live: boolean;
  pal: Palette;
  mats: Mats;
  children?: ReactNode;
}) {
  return (
    <mesh position={position} rotation={rotation} material={live ? mats.tint : mats.paper}>
      {geo}
      <Edges color={live ? pal.blue : pal.ink2} lineWidth={live ? 2 : 1.3} threshold={20} />
      {children}
    </mesh>
  );
}
const box = (w: number, h: number, d: number) => <boxGeometry args={[w, h, d]} />;

/* ---------------------------------------------------------------- motifs */
/* Each model is one clear shape, about two-thirds of the platform, centred on it. */
type MotifProps = { live: boolean; pal: Palette; mats: Mats; clock: { t: number; dwell: number }; still: boolean };

/** 01 Workflow clarity: three blocks joined in a row, lighting up in sequence. */
function Flow({ live, pal, mats, still }: MotifProps) {
  const refs = useRef<THREE.Group[]>([]);
  useFrame((s) => {
    refs.current.forEach((g, i) => {
      if (!g) return;
      const pulse = live && !still ? Math.max(0, Math.sin(s.clock.elapsedTime * 3.2 - i * 1.2)) : 0;
      g.position.y = 0.14 + pulse * 0.1;
    });
  });
  const xs = [-0.34, 0, 0.34];
  return (
    <group>
      {xs.map((x, i) => (
        <group key={x} ref={(g) => void (g && (refs.current[i] = g))} position={[x, 0.14, 0]}>
          <Part geo={box(0.22, 0.28, 0.22)} live={live} pal={pal} mats={mats} />
        </group>
      ))}
      <Part geo={box(0.12, 0.06, 0.06)} position={[-0.17, 0.12, 0]} live={live} pal={pal} mats={mats} />
      <Part geo={box(0.12, 0.06, 0.06)} position={[0.17, 0.12, 0]} live={live} pal={pal} mats={mats} />
    </group>
  );
}

/** 02 Architecture: three layered tiers (interface, services, data) that rise into place. */
function Architecture({ live, pal, mats, still }: MotifProps) {
  const tiers = useRef<THREE.Group[]>([]);
  useFrame((_, dt) => {
    tiers.current.forEach((g, i) => {
      if (!g) return;
      const target = (live ? 0.2 : 0.13) * i + 0.06;
      g.position.y = still ? target : g.position.y + (target - g.position.y) * Math.min(1, dt * 5);
    });
  });
  const sizes: [number, number][] = [
    [0.78, 0.66],
    [0.6, 0.5],
    [0.42, 0.34],
  ];
  return (
    <group>
      {sizes.map(([w, d], i) => (
        <group key={i} ref={(g) => void (g && (tiers.current[i] = g))} position={[0, 0.06 + i * 0.13, 0]}>
          <Part geo={box(w, 0.1, d)} live={live} pal={pal} mats={mats} />
        </group>
      ))}
    </group>
  );
}

/** 03 AI & automation logic: a decision diamond on a short pedestal, turning faster while live. */
function Decision({ live, pal, mats, still }: MotifProps) {
  const d = useRef<THREE.Group>(null);
  useFrame((s, dt) => {
    if (!d.current || still) return;
    d.current.rotation.y += dt * (live ? 1.4 : 0.3);
    d.current.position.y = 0.5 + Math.sin(s.clock.elapsedTime * 1.5) * (live ? 0.05 : 0.02);
  });
  return (
    <group>
      <Part geo={<cylinderGeometry args={[0.2, 0.26, 0.12, 6]} />} position={[0, 0.06, 0]} live={live} pal={pal} mats={mats} />
      <group ref={d} position={[0, 0.5, 0]}>
        <Part geo={<octahedronGeometry args={[0.24, 0]} />} live={live} pal={pal} mats={mats} />
      </group>
    </group>
  );
}

/** 04 Human control points: a barrier across the packet's lane. The packet stops at it; the barrier lifts; it moves on. */
function Gate({ live, pal, mats, clock, still }: MotifProps) {
  const bar = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (!bar.current) return;
    // The bar runs along +z from its hinge, so a negative x rotation raises its free end.
    const open = live && clock.dwell >= GATE_WAIT[0] ? -1.25 : 0;
    bar.current.rotation.x = still ? open : bar.current.rotation.x + (open - bar.current.rotation.x) * Math.min(1, dt * 7);
  });
  // The motif group sits 0.18 behind the step centre, so this places the barrier on the packet lane.
  return (
    <group position={[0, 0, LANE + 0.18]}>
      {/* hinge post behind the lane, rest post in front of it */}
      <Part geo={box(0.1, 0.36, 0.1)} position={[0, 0.18, -0.26]} live={live} pal={pal} mats={mats} />
      <Part geo={box(0.08, 0.1, 0.08)} position={[0, 0.05, 0.22]} live={live} pal={pal} mats={mats} />
      <group ref={bar} position={[0, 0.13, -0.26]}>
        <Part geo={box(0.06, 0.06, 0.54)} position={[0, 0, 0.25]} live={live} pal={pal} mats={mats} />
      </group>
    </group>
  );
}

/** 05 QA & edge cases: a test bed swept by a scanning beam. */
function Quality({ live, pal, mats, still }: MotifProps) {
  const scan = useRef<THREE.Mesh>(null);
  useFrame((s) => {
    if (!scan.current) return;
    scan.current.position.z = still ? 0 : Math.sin(s.clock.elapsedTime * (live ? 2 : 0.5)) * 0.32;
    (scan.current.material as THREE.MeshBasicMaterial).opacity = live ? 0.4 : 0.1;
  });
  return (
    <group>
      <Part geo={box(0.8, 0.08, 0.8)} position={[0, 0.04, 0]} live={live} pal={pal} mats={mats} />
      <Part geo={box(0.1, 0.36, 0.1)} position={[-0.3, 0.26, -0.3]} live={live} pal={pal} mats={mats} />
      <Part geo={box(0.1, 0.36, 0.1)} position={[0.3, 0.26, -0.3]} live={live} pal={pal} mats={mats} />
      <Part geo={box(0.7, 0.06, 0.06)} position={[0, 0.47, -0.3]} live={live} pal={pal} mats={mats} />
      <mesh ref={scan} position={[0, 0.25, 0]}>
        <boxGeometry args={[0.62, 0.32, 0.015]} />
        <meshBasicMaterial color={pal.blue} transparent opacity={0.1} toneMapped={false} depthWrite={false} />
      </mesh>
    </group>
  );
}

/** 06 Deployment & support: a server with a single pulse ring for monitoring. */
function Deploy({ live, pal, mats, still }: MotifProps) {
  const ring = useRef<THREE.Mesh>(null);
  useFrame((s) => {
    if (!ring.current) return;
    const t = still ? 0.3 : (s.clock.elapsedTime * (live ? 0.8 : 0.3)) % 1;
    ring.current.scale.setScalar(0.7 + t * 1.1);
    (ring.current.material as THREE.MeshBasicMaterial).opacity = (1 - t) * (live ? 0.9 : 0.3);
  });
  return (
    <group>
      <Part geo={box(0.46, 0.66, 0.46)} position={[0, 0.33, 0]} live={live} pal={pal} mats={mats} />
      <Part geo={box(0.36, 0.05, 0.02)} position={[0, 0.48, 0.235]} live={live} pal={pal} mats={mats} />
      <Part geo={box(0.36, 0.05, 0.02)} position={[0, 0.32, 0.235]} live={live} pal={pal} mats={mats} />
      <mesh ref={ring} position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.36, 0.012, 6, 64]} />
        <meshBasicMaterial color={pal.blue} transparent toneMapped={false} />
      </mesh>
    </group>
  );
}

const MOTIFS = [Flow, Architecture, Decision, Gate, Quality, Deploy];

/* ---------------------------------------------------------------- steps */
function Step({
  k,
  live,
  pal,
  mats,
  title,
  onSelect,
  clock,
  still,
}: {
  k: number;
  live: boolean;
  pal: Palette;
  mats: Mats;
  title: string;
  onSelect: (i: number) => void;
  clock: { t: number; dwell: number };
  still: boolean;
}) {
  const c = STEPS[k];
  const Motif = MOTIFS[k];
  const riser = c.y - ST / 2;
  return (
    <group>
      {/* riser block down to the floor, kept quiet */}
      <mesh position={[c.x, riser / 2, c.z - 0.05]} material={mats.paper}>
        <boxGeometry args={[SW * 0.78, riser, SD * 0.7]} />
        <Edges color={pal.ink2} lineWidth={0.8} threshold={15} />
      </mesh>
      <Html position={[c.x - SW * 0.32, riser * 0.55, c.z - 0.05 + SD * 0.35]} zIndexRange={[10, 0]} style={{ pointerEvents: 'none' }}>
        <span className={`stk-n ${live ? 'is-on' : ''}`}>{String(k + 1).padStart(2, '0')}</span>
      </Html>
      <group position={[c.x, c.y, c.z]}>
        <mesh
          material={live ? mats.tint : mats.paper}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(k);
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={() => (document.body.style.cursor = '')}
        >
          <boxGeometry args={[SW, ST, SD]} />
          <Edges color={live ? pal.blue : pal.ink} lineWidth={live ? 2 : 1.3} threshold={15} />
        </mesh>
        <group position={[0, ST / 2, -0.18]}>
          <Motif live={live} pal={pal} mats={mats} clock={clock} still={still} />
        </group>
        {live && (
          <Html position={[0, 1.2, -0.18]} center zIndexRange={[10, 0]} style={{ pointerEvents: 'none' }}>
            <span className="stk-tag">{title}</span>
          </Html>
        )}
      </group>
    </group>
  );
}

/* ---------------------------------------------------------------- packet + track */
function Track({ pal }: { pal: Palette }) {
  const pts = useMemo(() => {
    const out: [number, number, number][] = [];
    for (let k = 0; k < N; k++) {
      const c = STEPS[k];
      const top = c.y + RIDE;
      out.push([c.x - SW * 0.45, top, c.z + LANE], [c.x + SW / 2, top, c.z + LANE]);
      if (k < N - 1) {
        const n = STEPS[k + 1];
        out.push([n.x - SW / 2, n.y + RIDE, n.z + LANE]);
      }
    }
    return out;
  }, []);
  return <Line points={pts} color={pal.blue} lineWidth={1.2} transparent opacity={0.3} />;
}

function Director({
  hold,
  onActive,
  clock,
  pal,
  still,
}: {
  hold: number | null;
  onActive: (k: number) => void;
  clock: { t: number; dwell: number };
  pal: Palette;
  still: boolean;
}) {
  const packet = useRef<THREE.Mesh>(null);
  const halo = useRef<THREE.Mesh>(null);
  const last = useRef(-1);
  useFrame((s, dt) => {
    if (hold !== null) {
      // Glide the clock to the held step's dwell and keep it there (jump straight there under reduced motion).
      const target = hold * (DWELL + TRAVEL) + DWELL * HOLD_AT;
      clock.t = still ? target : clock.t + (target - clock.t) * Math.min(1, dt * 5);
    } else {
      clock.t = (clock.t + Math.min(dt, 0.05)) % LOOP;
    }
    const f = timeline(clock.t);
    clock.dwell = hold !== null ? HOLD_AT : f.dwell;
    if (packet.current) {
      packet.current.position.copy(f.pos);
      (packet.current.material as THREE.MeshBasicMaterial).opacity = f.fade;
    }
    if (halo.current) {
      halo.current.position.copy(f.pos);
      const p = still ? 0 : (s.clock.elapsedTime * 2) % 1;
      halo.current.scale.setScalar(1 + p * 1.6);
      (halo.current.material as THREE.MeshBasicMaterial).opacity = still ? 0 : (1 - p) * 0.5 * f.fade;
    }
    // While held, the held step is the active one: the packet gliding past other steps does not light them.
    const shown = hold ?? f.active;
    if (shown !== last.current) {
      last.current = shown;
      onActive(shown);
    }
  });
  return (
    <>
      <mesh ref={packet}>
        <sphereGeometry args={[0.075, 20, 16]} />
        <meshBasicMaterial color={pal.blue} transparent toneMapped={false} />
      </mesh>
      <mesh ref={halo}>
        <sphereGeometry args={[0.075, 16, 12]} />
        <meshBasicMaterial color={pal.blue} transparent toneMapped={false} depthWrite={false} />
      </mesh>
    </>
  );
}

function Rig({ still }: { still: boolean }) {
  const { camera, size } = useThree();
  const look = useMemo(() => new THREE.Vector3(0.2, 1.55, 0.1), []);
  const ptr = useRef({ x: 0, y: 0 });
  useFrame((s, dt) => {
    const aspect = size.width / size.height;
    // 0 on wide panels, 1 on narrow ones, blended across 0.95–1.25 so a resize never makes the camera jump.
    const n = THREE.MathUtils.smoothstep(aspect, 0.95, 1.25);
    const narrow = 1 - n;
    if (!still) {
      ptr.current.x += (s.pointer.x - ptr.current.x) * Math.min(1, dt * 2);
      ptr.current.y += (s.pointer.y - ptr.current.y) * Math.min(1, dt * 2);
    }
    const sway = still ? 0 : Math.sin(s.clock.elapsedTime * 0.12) * 0.04;
    // Distance follows the panel's shape so the six steps always fit with a margin.
    // On narrow panels the camera swings round so the steps recede in depth instead of stretching sideways.
    const r = THREE.MathUtils.lerp(Math.max(15.2, 20.5 / aspect), 21, narrow);
    const az = THREE.MathUtils.lerp(0.36, 0.5, narrow) + ptr.current.x * 0.1 + sway;
    camera.position.set(Math.sin(az) * r, THREE.MathUtils.lerp(6.2, 6.8, narrow) + ptr.current.y * 0.5, Math.cos(az) * r);
    camera.lookAt(look);
  });
  return null;
}

type SceneProps = {
  titles: string[];
  active: number;
  hold: number | null;
  onActive: (k: number) => void;
  onSelect: (k: number) => void;
  /** Reduced motion: no idle loops, camera sway or parallax. */
  still: boolean;
};

function Scene({ titles, active, hold, onActive, onSelect, still }: SceneProps) {
  const theme = useTheme();
  const pal = useMemo(() => palette(theme), [theme]);
  const mats = useMats(pal);
  const clock = useRef({ t: 0, dwell: 0 }).current;
  return (
    <>
      <Rig still={still} />
      <ambientLight intensity={theme === 'dark' ? 1.5 : 2.3} />
      <directionalLight position={[-4, 8, 6]} intensity={theme === 'dark' ? 0.9 : 1.1} />
      <directionalLight position={[6, 3, -2]} intensity={0.35} />
      {titles.map((t, k) => (
        <Step key={t} k={k} live={k === active} pal={pal} mats={mats} title={t} onSelect={onSelect} clock={clock} still={still} />
      ))}
      <Track pal={pal} />
      <Director hold={hold} onActive={onActive} clock={clock} pal={pal} still={still} />
      <ContactShadows position={[0, 0.001, 0]} scale={14} blur={2.4} far={4} opacity={theme === 'dark' ? 0.55 : 0.32} frames={1} />
    </>
  );
}

export default function StackCanvas({ live, ...scene }: SceneProps & { live: boolean }) {
  return (
    <Canvas className="stk-canvas" frameloop={live ? 'always' : 'never'} dpr={[1, 2]} camera={{ fov: 26, position: [4, 5, 12] }} gl={{ antialias: true, alpha: true }} flat aria-hidden="true">
      <Scene {...scene} />
    </Canvas>
  );
}
