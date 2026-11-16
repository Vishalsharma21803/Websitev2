import type { Palette } from './palette';

/** Canvas painters for the screens inside the assembly. All data is illustrative. */

const F = (w: number, size: number, family = "'Archivo Variable', 'Archivo', sans-serif") => `${w} ${size}px ${family}`;
const MONO = "'JetBrains Mono Variable', 'JetBrains Mono', monospace";

function rr(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

export function drawWeb(ctx: CanvasRenderingContext2D, W: number, H: number, c: Palette, run: number, t: number) {
  ctx.fillStyle = c.screen;
  ctx.fillRect(0, 0, W, H);
  // sidebar
  ctx.fillStyle = c.paper2;
  ctx.fillRect(0, 0, 190, H);
  ctx.fillStyle = c.ink;
  rr(ctx, 28, 30, 30, 30, 8);
  ctx.fill();
  ctx.font = F(600, 22);
  ctx.fillText('Ops', 70, 53);
  const items = ['Overview', 'Invoices', 'Approvals', 'Vendors', 'Audit log'];
  items.forEach((it, i) => {
    const y = 110 + i * 46;
    if (i === 1) {
      ctx.fillStyle = run > 0.5 ? c.blueSoft : c.screen;
      rr(ctx, 16, y - 26, 158, 38, 9);
      ctx.fill();
    }
    ctx.fillStyle = i === 1 ? (run > 0.5 ? c.blue : c.ink) : c.ink2;
    ctx.font = F(i === 1 ? 600 : 450, 19);
    ctx.fillText(it, 32, y);
  });
  // header
  ctx.fillStyle = c.ink;
  ctx.font = F(620, 38);
  ctx.fillText('Invoices', 228, 72);
  ctx.fillStyle = c.ink2;
  ctx.font = F(450, 18);
  ctx.fillText('This week · sample data', 230, 102);
  // live pill
  const live = run > 0.5;
  ctx.fillStyle = live ? c.blue : c.paper2;
  rr(ctx, W - 150, 44, 116, 38, 19);
  ctx.fill();
  ctx.fillStyle = live ? '#ffffff' : c.ink2;
  ctx.font = F(600, 17);
  ctx.fillText(live ? '●  Live' : 'Draft', W - 128, 69);
  // KPI cards
  const kpis = [
    ['Processed', String(1180 + Math.floor(run * ((t * 9) % 104)))],
    ['Auto-approved', `${(96 + run * 2.6).toFixed(1)}%`],
    ['Avg. cycle', run > 0.5 ? '4m 12s' : '—'],
  ];
  kpis.forEach(([k, v], i) => {
    const x = 228 + i * 258;
    ctx.fillStyle = c.paper;
    rr(ctx, x, 128, 240, 112, 14);
    ctx.fill();
    ctx.strokeStyle = c.paper2;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = c.ink2;
    ctx.font = F(450, 17);
    ctx.fillText(k, x + 20, 162);
    ctx.fillStyle = c.ink;
    ctx.font = F(620, 36);
    ctx.fillText(v, x + 20, 214);
  });
  // chart
  const cx = 228;
  const cy = 270;
  ctx.fillStyle = c.paper;
  rr(ctx, cx, cy, 500, 290, 14);
  ctx.fill();
  const bars = 14;
  for (let i = 0; i < bars; i++) {
    const base = 0.35 + 0.5 * Math.abs(Math.sin(i * 1.7 + 0.4));
    const wobble = run * 0.12 * Math.sin(t * 2.2 + i);
    const h = (base + wobble) * 210 * (0.25 + 0.75 * Math.max(run, 0.25));
    const x = cx + 24 + i * 33;
    const hot = run > 0.5 && i === Math.floor((t * 2) % bars);
    ctx.fillStyle = hot ? c.blue : c.ink2;
    ctx.globalAlpha = hot ? 1 : 0.35;
    rr(ctx, x, cy + 260 - h, 20, h, 5);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  // table
  const tx = 748;
  ctx.fillStyle = c.paper;
  rr(ctx, tx, cy, W - tx - 24, 290, 14);
  ctx.fill();
  const rows = ['Northside HVAC', 'Palmetto Roof', 'Coastal Plumb', 'Oak St Electric'];
  rows.forEach((r, i) => {
    const y = cy + 48 + i * 62;
    ctx.fillStyle = c.ink;
    ctx.font = F(500, 17);
    ctx.fillText(r, tx + 18, y);
    const done = run > 0.5 && (Math.floor(t * 1.4) + i) % 4 !== 0;
    ctx.fillStyle = done ? c.blueSoft : c.paper2;
    rr(ctx, tx + 18, y + 12, 96, 26, 13);
    ctx.fill();
    ctx.fillStyle = done ? c.blue : c.ink2;
    ctx.font = F(600, 14);
    ctx.fillText(done ? 'Approved' : 'Queued', tx + 30, y + 30);
  });
}

export function drawPhone(ctx: CanvasRenderingContext2D, W: number, H: number, c: Palette, run: number, t: number) {
  ctx.fillStyle = c.screen;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = c.ink;
  ctx.font = F(600, 26);
  ctx.fillText('9:41', 48, 70);
  ctx.fillStyle = c.ink2;
  ctx.font = F(500, 22);
  ctx.fillText('TODAY', 44, 160);
  ctx.fillStyle = c.ink;
  ctx.font = F(620, 52);
  ctx.fillText('Good morning', 42, 222);
  // coach card
  ctx.fillStyle = run > 0.5 ? c.blue : c.ink;
  rr(ctx, 36, 260, W - 72, 210, 30);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.font = F(600, 20);
  ctx.fillText('AI COACH', 66, 304);
  ctx.fillStyle = '#ffffff';
  ctx.font = F(500, 30);
  ['A 15-minute walk after', 'lunch would round out', 'your week.'].forEach((l, i) => ctx.fillText(l, 66, 352 + i * 38));
  // cards
  const cards: [string, string, boolean][] = [
    ['MEDICATION', 'Metformin · 8:00', true],
    ['FAMILY', 'Check-up · Thu 11:30', false],
  ];
  cards.forEach(([k, v, pill], i) => {
    const y = 500 + i * 150;
    ctx.fillStyle = c.paper2;
    rr(ctx, 36, y, W - 72, 128, 26);
    ctx.fill();
    ctx.fillStyle = c.ink2;
    ctx.font = F(600, 18);
    ctx.fillText(k, 66, y + 44);
    ctx.fillStyle = c.ink;
    ctx.font = F(500, 28);
    ctx.fillText(v, 66, y + 88);
    if (pill) {
      ctx.fillStyle = run > 0.5 ? c.blueSoft : c.screen;
      rr(ctx, W - 180, y + 34, 108, 38, 19);
      ctx.fill();
      ctx.fillStyle = run > 0.5 ? c.blue : c.ink2;
      ctx.font = F(600, 18);
      ctx.fillText('Taken', W - 156, y + 60);
    }
  });
  // water meter
  const y = 820;
  ctx.fillStyle = c.paper2;
  rr(ctx, 36, y, W - 72, 110, 26);
  ctx.fill();
  ctx.fillStyle = c.ink2;
  ctx.font = F(600, 18);
  ctx.fillText('WATER', 66, y + 42);
  ctx.fillStyle = c.screen;
  rr(ctx, 66, y + 64, W - 132, 16, 8);
  ctx.fill();
  const fill = 0.3 + 0.35 * Math.max(run, 0.2) + run * 0.08 * Math.sin(t);
  ctx.fillStyle = run > 0.5 ? c.blue : c.ink;
  rr(ctx, 66, y + 64, (W - 132) * fill, 16, 8);
  ctx.fill();
  // tab bar
  ctx.fillStyle = c.ink2;
  ctx.globalAlpha = 0.5;
  for (let i = 0; i < 4; i++) {
    rr(ctx, 76 + i * ((W - 152) / 3) - 18, H - 92, 36, 36, 10);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

export function drawAgent(ctx: CanvasRenderingContext2D, W: number, H: number, c: Palette, run: number, t: number) {
  ctx.fillStyle = c.screen;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = c.paper2;
  ctx.fillRect(0, 0, W, 86);
  ctx.fillStyle = run > 0.5 ? c.blue : c.ink2;
  ctx.beginPath();
  ctx.arc(44, 43, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = c.ink;
  ctx.font = F(600, 24);
  ctx.fillText('Sales agent', 66, 51);
  ctx.fillStyle = c.ink2;
  ctx.font = F(450, 18);
  ctx.fillText('inbound · sample', W - 168, 51);

  // user bubble
  ctx.fillStyle = c.paper2;
  rr(ctx, 28, 116, W - 150, 92, 22);
  ctx.fill();
  ctx.fillStyle = c.ink;
  ctx.font = F(500, 22);
  ctx.fillText('Hi, does this work with', 50, 154);
  ctx.fillText('our CRM? We have 40 reps.', 50, 186);

  const steps: [string, string][] = [
    ['crm.lookup(acme.io)', 'Trial account · 40 seats'],
    ['score_lead()', 'Qualified · 82 / 100'],
    ['calendar.book()', 'Demo held for approval'],
  ];
  const shown = run > 0.5 ? Math.min(steps.length, Math.floor(((t * 0.55) % 4.2) + 0.2)) : steps.length;
  steps.forEach(([call, out], i) => {
    const y = 250 + i * 118;
    const on = i < shown;
    ctx.globalAlpha = on ? 1 : 0.25;
    ctx.strokeStyle = c.paper2;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(52, y - 10);
    ctx.lineTo(52, y + 92);
    ctx.stroke();
    ctx.fillStyle = on && run > 0.5 ? c.blue : c.ink;
    ctx.beginPath();
    ctx.arc(52, y + 10, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = c.ink2;
    ctx.font = `500 19px ${MONO}`;
    ctx.fillText(call, 80, y + 17);
    ctx.fillStyle = c.ink;
    ctx.font = F(550, 24);
    ctx.fillText(out, 80, y + 56);
    ctx.globalAlpha = 1;
  });
  // approval bar
  const y = H - 116;
  ctx.fillStyle = c.paper2;
  rr(ctx, 28, y, W - 56, 86, 20);
  ctx.fill();
  ctx.fillStyle = c.ink;
  ctx.font = F(550, 21);
  ctx.fillText('Human review', 52, y + 52);
  ctx.fillStyle = run > 0.5 ? c.blue : c.ink;
  rr(ctx, W - 210, y + 18, 158, 50, 25);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = F(600, 20);
  ctx.fillText('Approve', W - 172, y + 50);
}

export function drawLabel(ctx: CanvasRenderingContext2D, W: number, H: number, c: Palette, text: string, hot: boolean) {
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = hot ? c.blue : c.ink;
  ctx.font = `600 ${Math.round(H * 0.42)}px ${MONO}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, W / 2, H / 2 + 2);
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
}
