'use client';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState, type ReactNode } from 'react';

export type SheetKind = 'assembly' | 'layers' | 'office' | 'route' | 'team';

const ease = [0.65, 0, 0.35, 1] as const;

/** One stroke that draws itself once the sheet is in view. */
function D({ d, i = 0, live = false }: { d: string; i?: number; live?: boolean }) {
  return (
    <motion.path
      d={d}
      className={live ? 'ds-live' : undefined}
      variants={{ hidden: { pathLength: 0, opacity: 0 }, show: { pathLength: 1, opacity: 1 } }}
      transition={{ pathLength: { duration: 1.1, delay: 0.1 + i * 0.07, ease }, opacity: { duration: 0.2, delay: 0.1 + i * 0.07 } }}
    />
  );
}

/** A dashed guide line: fades in (pathLength animation would erase its dashes). */
function Dash({ d, i = 0 }: { d: string; i?: number }) {
  return (
    <motion.path
      d={d}
      className="ds-dash"
      strokeDasharray="4 8"
      variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
      transition={{ duration: 0.8, delay: 0.3 + i * 0.07 }}
    />
  );
}

function T({ x, y, children, i = 0, anchor = 'start', live = false, size }: { x: number; y: number; children: ReactNode; i?: number; anchor?: 'start' | 'middle' | 'end'; live?: boolean; size?: number }) {
  return (
    <motion.text
      x={x}
      y={y}
      textAnchor={anchor}
      className={`ds-t ${live ? 'ds-t--live' : ''}`}
      style={size ? { fontSize: size } : undefined}
      variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
      transition={{ duration: 0.6, delay: 0.7 + i * 0.07 }}
    >
      {children}
    </motion.text>
  );
}

/** A packet travelling a path; mounted only after the drawing has finished, so it never sits idle at the origin. */
function Packet({ path, dur = 4, delay = 0 }: { path: string; dur?: number; delay?: number }) {
  // SMIL begin times are relative to page load, so start explicitly on mount to stay in step with CSS.
  const motionRef = useRef<SVGAnimateMotionElement>(null);
  const showRef = useRef<SVGSetElement>(null);
  useEffect(() => {
    const id = setTimeout(() => {
      motionRef.current?.beginElement();
      showRef.current?.beginElement();
    }, delay * 1000);
    return () => clearTimeout(id);
  }, [delay]);
  return (
    <circle r="5" className="ds-packet" opacity="0">
      <animateMotion ref={motionRef} dur={`${dur}s`} begin="indefinite" repeatCount="indefinite" path={path} />
      <set ref={showRef} attributeName="opacity" to="1" begin="indefinite" />
    </circle>
  );
}

/* --------------------------------------------------------------------------- */

const ROUTE_PATH = 'M248 170h84c34 0 34-62 68-62h40M640 108h40c34 0 34 62 68 62h52M1000 170h44';
const ROUTE_STOPS = [
  { x: 48, title: 'Your brief', sub: 'What has to work' },
  { x: 440, title: 'NDA', sub: 'Covers every enquiry' },
  { x: 800, title: 'Questions', sub: 'Users, data, systems' },
];

const PACKET_PATH = 'M248 170h84c34 0 34-62 68-62h240c34 0 34 62 68 62h402';
const STOP_X = [148, 540, 900, 1110];
const ROUTE_DUR = 5.2;

function Route({ moving }: { moving: boolean }) {
  // Measure when the packet reaches each stop, so each one lights exactly as it arrives.
  const probe = useRef<SVGPathElement>(null);
  const [at, setAt] = useState<number[]>([0, 0.3, 0.6, 0.95]);
  useEffect(() => {
    const p = probe.current;
    if (!p) return;
    const L = p.getTotalLength();
    const out = STOP_X.map((x) => {
      if (x <= 248) return 0;
      for (let s = 0; s <= L; s += 4) if (p.getPointAtLength(s).x >= x) return s / L;
      return 1;
    });
    setAt(out);
  }, []);
  const delay = (k: number) => ({ ['--d' as string]: `${(at[k] * ROUTE_DUR).toFixed(2)}s` });
  return (
    <>
      <path ref={probe} d={PACKET_PATH} stroke="none" fill="none" />
      <D d={ROUTE_PATH} i={6} live />
      {moving && <Packet path={PACKET_PATH} dur={ROUTE_DUR} />}
      {ROUTE_STOPS.map((s, i) => {
        const y = i === 1 ? 70 : 132;
        return (
          <g key={s.title} className="rt-stop" style={delay(i)}>
            <D d={`M${s.x + 14} ${y}h172a14 14 0 0 1 14 14v48a14 14 0 0 1-14 14H${s.x + 14}a14 14 0 0 1-14-14v-48a14 14 0 0 1 14-14z`} i={i * 2} />
            <T x={s.x + 22} y={y + 32} i={i} size={19}>
              {`0${i + 1}`}
            </T>
            <T x={s.x + 58} y={y + 32} i={i} size={19}>
              {s.title}
            </T>
            <T x={s.x + 22} y={y + 58} i={i} size={14}>
              {s.sub}
            </T>
          </g>
        );
      })}
      <g className="rt-stop rt-stop--end" style={delay(3)}>
        <D d="M1058 120h110a14 14 0 0 1 14 14v72a14 14 0 0 1-14 14h-110a14 14 0 0 1-14-14v-72a14 14 0 0 1 14-14z" i={7} live />
        <T x={1066} y={160} i={4} size={19} live>
          04 Plan
        </T>
        <T x={1066} y={190} i={4} size={14} live>
          A clear view
        </T>
      </g>
      <Dash d="M48 296h1134" i={8} />
      <T x={48} y={326} i={5} size={14}>
        Typical first reply: questions, then a plan for what it takes to run in production
      </T>
    </>
  );
}

const ART: Record<SheetKind, (moving: boolean) => ReactNode> = {
  assembly: (m) => {
    const flow = 'M800 290h40M880 290h40M960 290h40M1040 290h40';
    return (
      <>
        <D d="M70 70h300v190H70z" i={0} />
        <D d="M70 92h300" i={1} />
        <D d="M90 112h60v130H90zM170 112h180v54H170z" i={2} />
        <D d="M178 232v-30M198 232v-46M218 232v-22M238 232v-58M258 232v-38" i={3} live />
        <D d="M220 260v26M180 286h80" i={4} />
        <D d="M420 90a14 14 0 0 1 14-14h70a14 14 0 0 1 14 14v176a14 14 0 0 1-14 14h-70a14 14 0 0 1-14-14z" i={5} />
        <D d="M454 86h30" i={6} />
        <D d="M438 160h66M438 176h50M438 192h58" i={7} />
        <D d="M438 110h66v38h-66z" i={8} live />
        <D d="M570 70h150v190H570z" i={9} />
        <D d="M586 96h90M586 112h60M598 140h70M598 166h56" i={10} />
        <D d="M610 228h90v18h-90z" i={11} live />
        <D d="M720 110h30M720 165h30M720 220h30" i={12} live />
        <D d="M750 96h34v28h-34zM750 151h34v28h-34zM750 206h34v28h-34z" i={13} />
        <D d="M760 276h40v28h-40zM840 276h40v28h-40zM920 276h40v28h-40zM1000 276h40v28h-40zM1080 276h40v28h-40z" i={14} />
        <D d={flow} i={15} />
        <D d="M1020 276v-40h80" i={16} live />
        <Dash d="M70 330h1050" i={17} />
        <T x={220} y={356} anchor="middle" i={0}>Web platforms</T>
        <T x={469} y={356} anchor="middle" i={1}>Mobile apps</T>
        <T x={660} y={356} anchor="middle" i={2}>AI agents</T>
        <T x={940} y={356} anchor="middle" i={3}>AI automation</T>
        {m && <Packet path="M780 290h340" dur={3.6} />}
        {m && <Packet path="M780 290h340" dur={3.6} delay={1.8} />}
      </>
    );
  },
  layers: (m) => {
    const names = ['Workflow clarity', 'Architecture', 'AI & automation logic', 'Human control points', 'QA & edge cases', 'Deployment & support'];
    return (
      <>
        {names.map((n, i) => {
          const y = 310 - i * 46;
          const x = 260 + i * 18;
          return (
            <g key={n}>
              <D d={`M${x} ${y}l60-26h420l-60 26z`} i={i} live={i === 5} />
              <T x={x + 500} y={y - 8} i={i} live={i === 5}>
                {`0${i + 1}  ${n}`}
              </T>
            </g>
          );
        })}
        <D d="M190 310V56M180 72l10-16 10 16" i={7} live />
        <T x={176} y={190} anchor="end" i={7} live>
          to production
        </T>
        {m && <Packet path="M190 306V62" dur={3.2} />}
      </>
    );
  },
  office: (m) => (
    <>
      <D d="M90 40h1020v270H90z" i={0} />
      <D d="M90 180h220M310 40v90M310 160v20M600 40v270" i={1} />
      <D d="M310 130a30 30 0 0 1 30 30" i={2} />
      {[0, 1, 2, 3].map((r) =>
        [0, 1, 2].map((c) => <D key={`${r}${c}`} d={`M${640 + c * 150} ${70 + r * 58}h110v28h-110z`} i={3 + r} />),
      )}
      <D d="M140 80h120v60H140z" i={4} />
      <D d="M150 220h110v60H150zM370 220h170v60H370z" i={5} />
      <D d="M400 100a50 50 0 1 0 100 0a50 50 0 1 0-100 0" i={6} live />
      <D d="M450 100v-26M450 100l18 12" i={7} live />
      <T x={200} y={66} anchor="middle" i={0}>Meeting room</T>
      <T x={455} y={302} anchor="middle" i={1}>Workshop wall</T>
      <T x={850} y={300} anchor="middle" i={2}>Engineering floor</T>
      <T x={450} y={174} anchor="middle" i={3} live>
        IST
      </T>
      <Dash d="M90 334h1020" i={8} />
      <T x={90} y={358} i={4}>Fourth Floor, Blue Sapphire · Sector 74, Mohali</T>
      {m && <Packet path="M620 112h470" dur={5} />}
    </>
  ),
  route: (m) => <Route moving={m} />,
  team: (m) => (
    <>
      {[260, 600, 940].map((x, i) => (
        <g key={x}>
          <D d={`M${x - 46} 110a46 46 0 1 0 92 0a46 46 0 1 0-92 0`} i={i * 3} />
          <D d={`M${x - 100} 300c0-70 40-110 100-110s100 40 100 110`} i={i * 3 + 1} />
          <D d={`M${x - 30} 100h60v20h-60z`} i={i * 3 + 2} live={i === 1} />
        </g>
      ))}
      <D d="M346 230h168M686 230h168" i={10} live />
      <Dash d="M120 322h960" i={11} />
      {m && <Packet path="M346 230h168" dur={2.4} />}
      {m && <Packet path="M686 230h168" dur={2.4} delay={1.2} />}
    </>
  ),
};

export function DrawSheet({ kind, caption }: { kind: SheetKind; caption: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' });
  const reduced = useReducedMotion();
  const [moving, setMoving] = useState(false);
  useEffect(() => {
    if (!inView || reduced) return;
    const id = setTimeout(() => setMoving(true), 2200);
    return () => clearTimeout(id);
  }, [inView, reduced]);
  return (
    <div ref={ref} className={`drawsheet sheet drawsheet--${kind} ${moving ? 'is-moving' : ''}`}>
      <span className="ticks" aria-hidden="true" />
      <motion.svg viewBox="0 0 1200 370" className="ds-svg" aria-hidden="true" initial={reduced ? 'show' : 'hidden'} animate={inView || reduced ? 'show' : 'hidden'}>
        <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          {ART[kind](moving)}
        </g>
      </motion.svg>
      <p className="mono ds-cap">{caption}</p>
    </div>
  );
}
