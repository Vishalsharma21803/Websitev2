'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { budgets, topics, site } from '@/lib/site';
import { Arrow } from './Arrow';

/** Design-view form: validates, then hands the message to the visitor's email app. */
export function ContactForm({ to = site.email.sales, subject = 'Project enquiry', careers = false }: { to?: string; subject?: string; careers?: boolean }) {
  const [topic, setTopic] = useState<string[]>([]);
  const [budget, setBudget] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = String(f.get('name') || '').trim();
    const email = String(f.get('email') || '').trim();
    const msg = String(f.get('message') || '').trim();
    if (!name || !/^\S+@\S+\.\S+$/.test(email) || !msg) {
      setError('Add your name, a valid email and a few lines about the project.');
      const first = e.currentTarget.querySelector<HTMLInputElement>(!name ? '[name=name]' : !/^\S+@\S+\.\S+$/.test(email) ? '[name=email]' : '[name=message]');
      first?.focus();
      return;
    }
    setError('');
    const lines = [...f.entries()].map(([k, v]) => `${k}: ${v}`);
    if (topic.length) lines.push(`topics: ${topic.join(', ')}`);
    if (budget) lines.push(`budget: ${budget}`);
    window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
    setSent(true);
  };

  return (
    <form className="cf" onSubmit={submit} noValidate>
      <div className="cf-row">
        <Field name="name" label="Full name" autoComplete="name" />
        <Field name="email" label="Work email" type="email" autoComplete="email" />
      </div>
      {careers ? (
        <div className="cf-row">
          <Field name="role" label="Role you're interested in" />
          <Field name="portfolio" label="GitHub, LinkedIn or portfolio" type="url" />
        </div>
      ) : (
        <>
          <fieldset className="cf-chips">
            <legend className="mono">What do you need?</legend>
            <div>
              {topics.map((t) => {
                const on = topic.includes(t);
                return (
                  <button key={t} type="button" aria-pressed={on} className={`cf-chip ${on ? 'on' : ''}`} onClick={() => setTopic((x) => (on ? x.filter((y) => y !== t) : [...x, t]))}>
                    {t}
                  </button>
                );
              })}
            </div>
          </fieldset>
          <fieldset className="cf-chips">
            <legend className="mono">Budget</legend>
            <div>
              {budgets.map((b) => (
                <button key={b} type="button" aria-pressed={budget === b} className={`cf-chip num ${budget === b ? 'on' : ''}`} onClick={() => setBudget(budget === b ? '' : b)}>
                  {b}
                </button>
              ))}
            </div>
          </fieldset>
        </>
      )}
      <Field name="message" label={careers ? 'What do you build best?' : 'What has to work?'} textarea />
      <div className="cf-foot">
        <button type="submit" className="btn">
          <Arrow />
          {careers ? 'Send application' : 'Send message'}
        </button>
        <p className="mono cf-note">{careers ? 'Attach your CV when your email app opens.' : 'Every enquiry is covered by an NDA.'}</p>
      </div>
      <AnimatePresence>
        {(error || sent) && (
          <motion.p className={`cf-status ${error ? 'is-error' : ''}`} role="status" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {error || 'Opening your email app with the message filled in.'}
          </motion.p>
        )}
      </AnimatePresence>
    </form>
  );
}

function Field({ name, label, type = 'text', textarea = false, autoComplete }: { name: string; label: string; type?: string; textarea?: boolean; autoComplete?: string }) {
  const id = `f-${name}`;
  return (
    <div className="cf-field">
      {textarea ? <textarea id={id} name={name} rows={4} placeholder=" " /> : <input id={id} name={name} type={type} placeholder=" " autoComplete={autoComplete} />}
      <label htmlFor={id}>{label}</label>
      <span className="cf-line" aria-hidden="true" />
    </div>
  );
}
