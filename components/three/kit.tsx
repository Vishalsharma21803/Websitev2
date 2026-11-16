'use client';
import { useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { LineSegments2 } from 'three/examples/jsm/lines/LineSegments2.js';
import { LineSegmentsGeometry } from 'three/examples/jsm/lines/LineSegmentsGeometry.js';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import { clamp01, phase, type Palette } from './palette';

/* ---------------------------------------------------------------------------
   Materials for one drawn object: fat dashed edge lines that "draw" in,
   a paper fill that fades up, and a tint toward blue while running.
--------------------------------------------------------------------------- */
export type ObjMats = {
  line: LineMaterial;
  fill: THREE.MeshStandardMaterial;
  screen: THREE.MeshBasicMaterial[];
  ink: THREE.Color;
  blue: THREE.Color;
};

export function useObjMats(pal: Palette): ObjMats {
  const mats = useMemo<ObjMats>(() => {
    const line = new LineMaterial({
      color: pal.ink,
      linewidth: 1.35,
      dashed: true,
      dashSize: 0,
      gapSize: 1000,
      dashScale: 1,
      transparent: true,
      worldUnits: false,
    });
    const fill = new THREE.MeshStandardMaterial({
      color: pal.paper,
      roughness: 0.92,
      metalness: 0,
      transparent: true,
      opacity: 0,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1,
    });
    return { line, fill, screen: [], ink: new THREE.Color(pal.ink), blue: new THREE.Color(pal.blue) };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    mats.ink.set(pal.ink);
    mats.blue.set(pal.blue);
    mats.fill.color.set(pal.paper);
  }, [pal, mats]);

  const size = useThree((s) => s.size);
  useEffect(() => {
    mats.line.resolution.set(size.width, size.height);
  }, [size, mats]);

  useEffect(
    () => () => {
      mats.line.dispose();
      mats.fill.dispose();
    },
    [mats],
  );
  return mats;
}

/** Drive one object's materials from the shared phase. */
export function useObjPhase(mats: ObjMats, index: number, delay: number) {
  const tmp = useMemo(() => new THREE.Color(), []);
  useFrame(() => {
    const d = clamp01((phase.draw - delay) / 0.55);
    const eased = d < 0.5 ? 4 * d * d * d : 1 - Math.pow(-2 * d + 2, 3) / 2;
    const dim = phase.focus >= 0 && phase.focus !== index ? phase.focusMix : 0;
    const vis = 1 - 0.78 * dim;
    mats.line.dashSize = eased * 1.001;
    tmp.copy(mats.ink).lerp(mats.blue, phase.run * 0.9);
    mats.line.color.copy(tmp);
    // Lines fade up as they grow, so the first frames read as faint construction lines, not specks.
    mats.line.opacity = (1 - phase.fill * 0.25) * vis * Math.min(1, eased * 1.6);
    mats.fill.opacity = phase.fill * 0.97 * vis;
    mats.screen.forEach((s) => (s.opacity = phase.fill * vis));
  });
}

/* ---------------------------------------------------------------------------
   A box (or any geometry) drawn as filled mesh + fat edge lines.
--------------------------------------------------------------------------- */
export function Drawn({
  geometry,
  mats,
  position,
  rotation,
}: {
  geometry: THREE.BufferGeometry;
  mats: ObjMats;
  position?: [number, number, number];
  rotation?: [number, number, number];
}) {
  const lines = useMemo(() => {
    const edges = new THREE.EdgesGeometry(geometry, 20);
    const g = new LineSegmentsGeometry().fromEdgesGeometry(edges);
    const l = new LineSegments2(g, mats.line);
    l.computeLineDistances();
    normaliseDistances(g);
    edges.dispose();
    return l;
  }, [geometry, mats.line]);
  useEffect(() => () => lines.geometry.dispose(), [lines]);
  return (
    <group position={position} rotation={rotation}>
      <mesh geometry={geometry} material={mats.fill} />
      <primitive object={lines} />
    </group>
  );
}

export const box = (w: number, h: number, d: number) => new THREE.BoxGeometry(w, h, d);

/** Give every edge its own 0..1 distance so all edges of a part grow together as dashSize rises. */
function normaliseDistances(g: LineSegmentsGeometry) {
  const attr = g.attributes.instanceDistanceStart as THREE.InterleavedBufferAttribute | undefined;
  if (!attr) return;
  const arr = attr.data.array as Float32Array;
  for (let i = 0; i < arr.length; i++) arr[i] = i % 2 === 0 ? 0 : 1;
  attr.data.needsUpdate = true;
}

/* ---------------------------------------------------------------------------
   Canvas-texture screen. Redraws while running at ~20fps, otherwise on change.
--------------------------------------------------------------------------- */
export function Screen({
  width,
  height,
  px,
  mats,
  paint,
  position,
  pal,
}: {
  width: number;
  height: number;
  px: [number, number];
  mats: ObjMats;
  paint: (ctx: CanvasRenderingContext2D, W: number, H: number, pal: Palette, run: number, t: number) => void;
  position?: [number, number, number];
  pal: Palette;
}) {
  const { canvas, tex, mat } = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = px[0];
    canvas.height = px[1];
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: 0, toneMapped: false });
    return { canvas, tex, mat };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    mats.screen.push(mat);
    return () => {
      mats.screen.splice(mats.screen.indexOf(mat), 1);
      mat.dispose();
      tex.dispose();
    };
  }, [mats, mat, tex]);

  const state = useRef({ last: -1, run: -1, pal: '' });
  const repaint = () => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    paint(ctx, canvas.width, canvas.height, pal, phase.run, phase.time);
    tex.needsUpdate = true;
  };

  useEffect(() => {
    repaint();
    document.fonts?.ready.then(repaint);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pal]);

  useFrame(() => {
    const s = state.current;
    const runStep = Math.round(phase.run * 10);
    const tick = phase.run > 0.5 && Math.abs(phase.time - s.last) > 0.033;
    if (tick || runStep !== s.run) {
      s.last = phase.time;
      s.run = runStep;
      repaint();
    }
  });

  return (
    <mesh position={position} material={mat}>
      <planeGeometry args={[width, height]} />
    </mesh>
  );
}

/* ---------------------------------------------------------------------------
   Annotation: a leader line from the part to an HTML label.
--------------------------------------------------------------------------- */
export function Anno({
  from,
  to,
  text,
  index,
  pal,
  align = 'left',
  strong = false,
  detail = false,
}: {
  from: [number, number, number];
  to: [number, number, number];
  text: string;
  index: number;
  pal: Palette;
  align?: 'left' | 'right';
  strong?: boolean;
  /** Secondary label: hidden in the overview, shown when its object is in focus. */
  detail?: boolean;
}) {
  const label = useRef<HTMLDivElement>(null);
  const line = useMemo(() => {
    const g = new LineSegmentsGeometry().setPositions([...from, ...to]);
    const m = new LineMaterial({ color: pal.ink2, linewidth: 1, transparent: true, opacity: 0, dashed: true, dashSize: 0.06, gapSize: 0.05 });
    const l = new LineSegments2(g, m);
    l.computeLineDistances();
    return l;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const size = useThree((s) => s.size);
  const camera = useThree((s) => s.camera);
  const proj = useMemo(() => new THREE.Vector3(), []);
  useEffect(() => {
    (line.material as LineMaterial).resolution.set(size.width, size.height);
  }, [size, line]);
  useEffect(() => {
    (line.material as LineMaterial).color.set(pal.ink2);
  }, [pal, line]);
  useEffect(
    () => () => {
      line.geometry.dispose();
      (line.material as LineMaterial).dispose();
    },
    [line],
  );

  useFrame(() => {
    const inFocus = phase.focus === index ? phase.focusMix : 0;
    const focusVis = detail ? inFocus : phase.focus < 0 ? 1 : phase.focus === index ? 1 : 1 - phase.focusMix;
    let o = (strong ? Math.max(phase.figs, phase.annotate) : phase.annotate) * focusVis;
    // Keep labels out of the header band and inside the viewport; small screens show figure labels only.
    if (!strong && size.width < 760) o = 0;
    if (o > 0 && label.current) {
      proj.set(...to);
      line.localToWorld(proj);
      proj.project(camera);
      const sx = (proj.x * 0.5 + 0.5) * size.width;
      const sy = (-proj.y * 0.5 + 0.5) * size.height;
      // Measure the whole label, not just its anchor, against the safe area.
      const w = label.current.offsetWidth || 120;
      const left = align === 'right' ? sx - w : strong ? sx - w / 2 : sx;
      const edge = Math.min(left - 8, size.width - (left + w) - 8, sy - 84, size.height - sy - 8);
      if (edge < 0) o = 0;
      else if (edge < 40) o *= edge / 40;
    }
    (line.material as LineMaterial).opacity = o * 0.9;
    if (label.current) {
      label.current.style.opacity = String(o);
      label.current.style.transform = `translateY(${(1 - o) * 6}px)`;
    }
  });

  return (
    <>
      <primitive object={line} />
      <Html position={to} zIndexRange={[20, 0]} style={{ pointerEvents: 'none' }}>
        <div ref={label} className={`anno anno--${align} ${strong ? 'anno--strong' : ''}`} style={{ opacity: 0 }}>
          <i />
          <span>{text}</span>
        </div>
      </Html>
    </>
  );
}
