'use client';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { Anno, Drawn, Screen, box, useObjMats, useObjPhase } from './kit';
import { drawAgent, drawLabel, drawPhone, drawWeb } from './screens';
import { phase, type Palette } from './palette';
import { deliverables } from '@/lib/services';

type ObjProps = { pal: Palette; index: number; delay: number; annotate?: boolean };

const specs = (i: number) => deliverables[i].specs;

/* ----------------------------- Web platform ----------------------------- */
export function WebPlatform({ pal, index, delay, annotate = true }: ObjProps) {
  const mats = useObjMats(pal);
  useObjPhase(mats, index, delay);
  const g = useMemo(
    () => ({
      frame: box(2.6, 1.66, 0.07),
      bar: box(2.6, 0.16, 0.085),
      stand: box(0.08, 0.5, 0.08),
      foot: box(0.9, 0.05, 0.42),
      server: box(0.46, 0.74, 0.46),
      slot: box(0.34, 0.04, 0.47),
    }),
    [],
  );
  const s = specs(0);
  return (
    <group>
      <Drawn geometry={g.frame} mats={mats} />
      <Drawn geometry={g.bar} mats={mats} position={[0, 0.75, 0]} />
      <Drawn geometry={g.stand} mats={mats} position={[0, -1.08, -0.06]} />
      <Drawn geometry={g.foot} mats={mats} position={[0, -1.33, -0.06]} />
      <Drawn geometry={g.server} mats={mats} position={[1.72, -0.98, -0.55]} />
      <Drawn geometry={g.slot} mats={mats} position={[1.72, -0.82, -0.55]} />
      <Drawn geometry={g.slot} mats={mats} position={[1.72, -0.98, -0.55]} />
      <Screen width={2.48} height={1.44} px={[1024, 594]} mats={mats} pal={pal} paint={drawWeb} position={[0, -0.07, 0.037]} />
      {annotate && (
        <>
          <Anno index={index} pal={pal} from={[-1.3, 0.83, 0]} to={[-1.85, 1.35, 0]} text={s[0]} align="right" />
          <Anno index={index} pal={pal} from={[1.3, 0.4, 0]} to={[1.95, 0.95, 0]} text={s[1]} />
          <Anno index={index} pal={pal} from={[-1.3, -0.6, 0]} to={[-1.95, -0.95, 0]} text={s[2]} detail align="right" />
          <Anno index={index} pal={pal} from={[1.72, -0.6, -0.55]} to={[2.35, -0.25, -0.55]} text={s[3]} detail />
          <Anno index={index} pal={pal} from={[0, 0.83, 0]} to={[0, 1.45, 0]} text="Fig. 1 · Web platform" strong />
        </>
      )}
    </group>
  );
}

/* ------------------------------ Mobile app ------------------------------ */
export function MobileApp({ pal, index, delay, annotate = true }: ObjProps) {
  const mats = useObjMats(pal);
  useObjPhase(mats, index, delay);
  const g = useMemo(
    () => ({
      body: box(0.84, 1.72, 0.085),
      island: box(0.24, 0.055, 0.012),
      btn: box(0.012, 0.2, 0.04),
      btn2: box(0.012, 0.12, 0.04),
    }),
    [],
  );
  const grp = useRef<THREE.Group>(null);
  useFrame(() => {
    if (!grp.current) return;
    grp.current.position.y = Math.sin(phase.time * 1.1) * 0.035 * phase.run;
  });
  const s = specs(1);
  return (
    <group ref={grp}>
      <Drawn geometry={g.body} mats={mats} />
      <Drawn geometry={g.island} mats={mats} position={[0, 0.79, 0.048]} />
      <Drawn geometry={g.btn} mats={mats} position={[0.426, 0.35, 0]} />
      <Drawn geometry={g.btn2} mats={mats} position={[-0.426, 0.45, 0]} />
      <Drawn geometry={g.btn2} mats={mats} position={[-0.426, 0.28, 0]} />
      <Screen width={0.76} height={1.62} px={[512, 1090]} mats={mats} pal={pal} paint={drawPhone} position={[0, 0, 0.044]} />
      {annotate && (
        <>
          <Anno index={index} pal={pal} from={[-0.42, 0.7, 0]} to={[-0.95, 1.05, 0]} text={s[0]} align="right" />
          <Anno index={index} pal={pal} from={[0.42, 0.5, 0]} to={[0.95, 0.85, 0]} text={s[1]} />
          <Anno index={index} pal={pal} from={[0.3, -0.1, 0.05]} to={[0.98, -0.25, 0]} text={s[2]} detail />
          <Anno index={index} pal={pal} from={[-0.42, -0.7, 0]} to={[-0.95, -1.0, 0]} text={s[3]} detail align="right" />
          <Anno index={index} pal={pal} from={[0, -0.86, 0]} to={[0, -1.25, 0]} text="Fig. 2 · Mobile app" strong />
        </>
      )}
    </group>
  );
}

/* -------------------------------- AI agent ------------------------------ */
const TOOLS = ['CRM', 'Calendar', 'Email'];

export function Agent({ pal, index, delay, annotate = true }: ObjProps) {
  const mats = useObjMats(pal);
  useObjPhase(mats, index, delay);
  const g = useMemo(
    () => ({
      panel: box(1.3, 1.62, 0.07),
      tool: box(0.36, 0.36, 0.36),
      link: box(0.26, 0.025, 0.025),
      base: box(1.3, 0.05, 0.36),
    }),
    [],
  );
  const packets = useRef<THREE.Mesh[]>([]);
  const ys = [0.5, 0, -0.5];
  useFrame(() => {
    packets.current.forEach((m, i) => {
      if (!m) return;
      const t = (phase.time * 0.9 + i * 0.33) % 1;
      const back = Math.floor(phase.time * 0.9 + i * 0.33) % 2 === 1;
      const x = back ? 1.0 - t * 0.33 : 0.67 + t * 0.33;
      m.position.set(x, ys[i], 0.0);
      m.visible = phase.run > 0.3;
      (m.material as THREE.MeshBasicMaterial).opacity = phase.run;
    });
  });
  const s = specs(2);
  return (
    <group>
      <Drawn geometry={g.panel} mats={mats} />
      <Drawn geometry={g.base} mats={mats} position={[0, -0.86, 0.1]} />
      {ys.map((y, i) => (
        <group key={y}>
          <Drawn geometry={g.tool} mats={mats} position={[1.2, y, 0]} />
          <Drawn geometry={g.link} mats={mats} position={[0.83, y, 0]} />
          <ToolLabel pal={pal} mats={mats} text={TOOLS[i]} position={[1.2, y, 0.182]} hotIndex={i} />
          <mesh ref={(m) => void (m && (packets.current[i] = m))}>
            <boxGeometry args={[0.07, 0.07, 0.07]} />
            <meshBasicMaterial color={pal.blue} transparent opacity={0} toneMapped={false} />
          </mesh>
        </group>
      ))}
      <Screen width={1.2} height={1.52} px={[640, 812]} mats={mats} pal={pal} paint={drawAgent} position={[0, 0, 0.037]} />
      {annotate && (
        <>
          <Anno index={index} pal={pal} from={[-0.65, 0.6, 0]} to={[-1.2, 1.0, 0]} text={s[0]} align="right" />
          <Anno index={index} pal={pal} from={[1.38, 0.5, 0]} to={[1.9, 0.9, 0]} text={s[1]} />
          <Anno index={index} pal={pal} from={[1.38, -0.5, 0]} to={[1.9, -0.85, 0]} text={s[2]} detail />
          <Anno index={index} pal={pal} from={[-0.65, -0.62, 0]} to={[-1.2, -0.95, 0]} text={s[3]} detail align="right" />
          <Anno index={index} pal={pal} from={[0.2, 0.81, 0]} to={[0.2, 1.38, 0]} text="Fig. 3 · AI agent" strong />
        </>
      )}
    </group>
  );
}

function ToolLabel({
  pal,
  mats,
  text,
  position,
  hotIndex,
}: {
  pal: Palette;
  mats: ReturnType<typeof useObjMats>;
  text: string;
  position: [number, number, number];
  hotIndex: number;
}) {
  const paint = useMemo(
    () => (ctx: CanvasRenderingContext2D, W: number, H: number, p: Palette, run: number, t: number) =>
      drawLabel(ctx, W, H, p, text, run > 0.5 && Math.floor(t * 0.9 + hotIndex * 0.33) % 3 === hotIndex),
    [text, hotIndex],
  );
  return <Screen width={0.32} height={0.12} px={[256, 96]} mats={mats} pal={pal} paint={paint} position={position} />;
}

/* --------------------------- Automation line ---------------------------- */
const STEPS = ['Ingest', 'Extract', 'Route', 'Approve', 'Sync'];

export function Flow({ pal, index, delay, annotate = true }: ObjProps) {
  const mats = useObjMats(pal);
  useObjPhase(mats, index, delay);
  const g = useMemo(() => ({ node: box(0.56, 0.36, 0.56), pipe: box(0.32, 0.06, 0.06), bed: box(4.6, 0.04, 0.9) }), []);
  const xs = STEPS.map((_, i) => -1.8 + i * 0.9);
  const packets = useRef<THREE.Mesh[]>([]);
  useFrame(() => {
    packets.current.forEach((m, i) => {
      if (!m) return;
      const t = (phase.time * 0.16 + i / 4) % 1;
      // hold briefly at Approve (the human step)
      const span = 3.6;
      let x = -1.8 + t * span;
      const approveX = xs[3];
      if (x > approveX - 0.05 && x < approveX + 0.25) x = approveX + Math.max(0, x - approveX - 0.2) * 5;
      m.position.set(x, 0.24, 0);
      m.visible = phase.run > 0.3;
      (m.material as THREE.MeshBasicMaterial).opacity = phase.run;
    });
  });
  const s = specs(3);
  return (
    <group>
      <Drawn geometry={g.bed} mats={mats} position={[0, -0.02, 0]} />
      {xs.map((x, i) => (
        <group key={x}>
          <Drawn geometry={g.node} mats={mats} position={[x, 0.2, 0]} />
          {i < xs.length - 1 && <Drawn geometry={g.pipe} mats={mats} position={[x + 0.45, 0.2, 0]} />}
          <FlowLabel pal={pal} mats={mats} text={STEPS[i]} position={[x, 0.2, 0.282]} human={i === 3} />
        </group>
      ))}
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} ref={(m) => void (m && (packets.current[i] = m))}>
          <boxGeometry args={[0.12, 0.12, 0.12]} />
          <meshBasicMaterial color={pal.blue} transparent opacity={0} toneMapped={false} />
        </mesh>
      ))}
      {annotate && (
        <>
          <Anno index={index} pal={pal} from={[xs[0], 0.38, 0]} to={[xs[0] - 0.3, 0.95, 0]} text={s[0]} align="right" />
          <Anno index={index} pal={pal} from={[xs[1], 0.38, 0]} to={[xs[1] + 0.1, 1.05, 0]} text={s[1]} />
          <Anno index={index} pal={pal} from={[xs[3], 0.38, 0]} to={[xs[3] - 0.1, 1.05, 0]} text={s[2]} detail align="right" />
          <Anno index={index} pal={pal} from={[xs[4], 0.38, 0]} to={[xs[4] + 0.3, 0.95, 0]} text={s[3]} detail />
          <Anno index={index} pal={pal} from={[0, -0.02, 0.45]} to={[0, -0.02, 0.95]} text="Fig. 4 · AI automation" strong />
        </>
      )}
    </group>
  );
}

function FlowLabel({
  pal,
  mats,
  text,
  position,
  human,
}: {
  pal: Palette;
  mats: ReturnType<typeof useObjMats>;
  text: string;
  position: [number, number, number];
  human: boolean;
}) {
  const paint = useMemo(
    () => (ctx: CanvasRenderingContext2D, W: number, H: number, p: Palette, run: number) => drawLabel(ctx, W, H, p, text, human && run > 0.5),
    [text, human],
  );
  return <Screen width={0.5} height={0.17} px={[320, 110]} mats={mats} pal={pal} paint={paint} position={position} />;
}
