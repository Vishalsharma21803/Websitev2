import fs from 'node:fs';
import path from 'node:path';

export type Post = { slug: string; title: string; description: string; date: string; category: string; minutes: number; body: string };

const dir = path.join(process.cwd(), 'content/blog');

function parse(file: string): Post {
  const raw = fs.readFileSync(path.join(dir, file), 'utf8');
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  const meta: Record<string, string> = {};
  (m?.[1] ?? '').split('\n').forEach((line) => {
    const i = line.indexOf(':');
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^"|"$/g, '').replace(/\\"/g, '"');
  });
  return {
    slug: file.replace(/\.md$/, ''),
    title: meta.title,
    description: meta.description,
    date: meta.date,
    category: meta.category,
    minutes: Number(meta.minutes || 3),
    body: (m?.[2] ?? '').trim(),
  };
}

export function getPosts(): Post[] {
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map(parse)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
