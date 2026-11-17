'use client';
import dynamic from 'next/dynamic';
import { useInView, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { productionLayer } from '@/lib/approach';
import { Reveal } from '../Reveal';
import { SplitHeading } from '../SplitHeading';

const StackCanvas = dynamic(() => import('../three/StackScene'), { ssr: false, loading: () => <div className="stk-loading" /> });

const N = productionLayer.length;

/**
 * The Sifars Production Layer as "the steps to production": six platforms, each with a working model of its part.
 * A packet climbs the steps on its own; the step it is on lights up and the list follows.
 * Hovering or focusing a part holds it while the pointer or focus stays there; clicking pins it until clicked again.
 */
export function Schematic() {
  const ref = useRef<HTMLElement>(null);
  const visible = useInView(ref, { margin: '200px 0px 200px 0px' });
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const [hover, setHover] = useState<number | null>(null);
  const [focused, setFocused] = useState<number | null>(null);
  const [pinned, setPinned] = useState<number | null>(null);
  const [webgl, setWebgl] = useState(true);

  useEffect(() => {
    try {
      const c = document.createElement('canvas');
      const gl = c.getContext('webgl2') || c.getContext('webgl');
      setWebgl(!!gl);
      // Release the probe context straight away so it does not count against the browser's limit.
      gl?.getExtension('WEBGL_lose_context')?.loseContext();
    } catch {
      setWebgl(false);
    }
  }, []);

  // The pointer wins over keyboard focus, and both win over a pinned step.
  const hold = hover ?? focused ?? pinned;
  // Reduced motion: no travelling packet, the visitor steps through by hovering or tapping.
  const held = reduced ? (hold ?? active) : hold;
  const titles = productionLayer.map((l) => l.title);
  const show = (i: number) => setActive(i);
  const togglePin = (i: number) => {
    const unpin = pinned === i;
    setPinned(unpin ? null : i);
    // Unpinning lets the packet go straight away, even while the pointer (or a tap's emulated hover) is still on the item.
    if (unpin) setHover(null);
    show(i);
  };

  return (
    <section ref={ref} className="stk section" aria-labelledby="schem-h">
      <div className="wrap">
        <div className="sec-head">
          <SplitHeading id="schem-h" parts={['Production-ready means more than', { live: '“it works in a demo.”' }]} />
          <Reveal delay={0.1}>
            <p className="lead">The Sifars Production Layer covers the six parts that usually break later, mapped before the build starts.</p>
          </Reveal>
        </div>
        <div className="stk-grid">
          <ol className="stk-list" aria-label="The six parts of the Production Layer" onMouseLeave={() => setHover(null)}>
            {productionLayer.map((l, i) => {
              const on = i === active;
              return (
                <li key={l.title}>
                  <button
                    type="button"
                    aria-current={on ? 'step' : undefined}
                    aria-pressed={pinned === i}
                    className={`stk-item ${on ? 'is-on' : ''} ${i < active ? 'is-done' : ''}`}
                    onMouseEnter={() => {
                      setHover(i);
                      show(i);
                    }}
                    onFocus={(e) => {
                      // Only keyboard focus holds a step; a mouse click also focuses the button, but clicks pin instead.
                      if (!e.currentTarget.matches(':focus-visible')) return;
                      setFocused(i);
                      show(i);
                    }}
                    onBlur={() => setFocused(null)}
                    onClick={() => togglePin(i)}
                  >
                    <span className="stk-num mono num">{String(i + 1).padStart(2, '0')}</span>
                    <span className="stk-txt">
                      <span className="stk-title">{l.title}</span>
                      <span className="stk-body">
                        <span>{l.body}</span>
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
          <div className="stk-stage sheet">
            <span className="ticks" aria-hidden="true" />
            {webgl ? (
              <StackCanvas titles={titles} active={active} hold={held} onActive={show} onSelect={togglePin} live={visible} still={!!reduced} />
            ) : (
              <div className="stk-fallback" aria-hidden="true">
                {titles.map((t, i) => (
                  <span key={t} className={i === active ? 'is-on' : ''} />
                ))}
              </div>
            )}
            <p className="mono stk-cap">
              {String(active + 1).padStart(2, '0')} / {String(N).padStart(2, '0')} · the steps to production
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
