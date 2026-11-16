import type { Theme } from '@/lib/store';

export type Palette = {
  ink: string;
  ink2: string;
  paper: string;
  paper2: string;
  screen: string;
  blue: string;
  blueSoft: string;
  grid: string;
  gridMajor: string;
};

export function palette(theme: Theme): Palette {
  return theme === 'dark'
    ? {
        ink: '#dfe3ea',
        ink2: '#8b93a1',
        paper: '#1a1f27',
        paper2: '#222833',
        screen: '#11151b',
        blue: '#6e8dff',
        blueSoft: '#1c2648',
        grid: '#0c0e12',
        gridMajor: '#1a1f27',
      }
    : {
        ink: '#14171d',
        ink2: '#6a7180',
        paper: '#fdfdfe',
        paper2: '#eef0f4',
        screen: '#f7f8fa',
        blue: '#2d5bff',
        blueSoft: '#e1e8ff',
        grid: '#f4f5f7',
        gridMajor: '#dde0e6',
      };
}

/** Phase values shared per frame by every object in the assembly. */
export const phase = {
  draw: 0,
  annotate: 0,
  fill: 0,
  run: 0,
  focus: -1, // index of focused deliverable, -1 = overview
  focusMix: 0, // 0..1 blend into focus framing
  time: 0,
  p: 0, // eased scroll progress (follows scene.progress)
  intro: 0, // 0..1 opening sequence
  figs: 0, // figure labels (shown from the hero onward)
};

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
export const smooth = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
