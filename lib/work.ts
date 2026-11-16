export type Case = {
  slug: string;
  client: string;
  title: string;
  label: string;
  shift: [string, string];
  summary: string;
  problem: string;
  built: string;
  complexity: string;
  tint: 'slate' | 'mauve' | 'sage';
  facts: { label: string; value: string }[];
  metrics: { value: string; label: string }[];
  challengeTitle: string;
  challenge: string[];
  solutionTitle: string;
  solution: string;
  features: { title: string; body: string }[];
  steps?: string[];
  stack?: string[];
  outcomeTitle: string;
  outcome: string[];
  quote?: { text: string; name: string; role: string };
};

/** Field values verbatim from sifars.com case pages where available; long passages condensed. */
export const cases: Case[] = [
  {
    slug: 'invoiceautomate',
    client: 'InvoiceAutomate',
    title: 'AI Invoice Management',
    label: 'AI automation',
    shift: ['Days', 'minutes'],
    summary: 'One automated system replacing manual invoice processing.',
    problem: 'Invoices scattered across email, spreadsheets, and PropertyWare.',
    built: 'An AI workflow for extraction, approvals, markups, and syncing.',
    complexity: 'OCR, GPT parsing, role routing, audit trails, and PropertyWare integration.',
    tint: 'slate',
    facts: [
      { label: 'Client', value: 'Property management firm' },
      { label: 'Region', value: 'Southeast US' },
      { label: 'Area', value: 'Accounts payable' },
      { label: 'Practice', value: 'AI & automation' },
    ],
    metrics: [
      { value: '85%', label: 'reduction in manual data entry' },
      { value: '99%+', label: 'extraction accuracy' },
      { value: '10×', label: 'faster invoice cycle' },
    ],
    challengeTitle: 'Manual entry, no audit trail, approvals by email.',
    challenge: [
      'Manual invoice data entry',
      'Disconnected systems and data silos',
      'No audit trail or accountability',
      'Complex multi-level approval requirements',
      'Inadequate role-based access control',
      'Lost invoices from processing failures',
      'Manual markup invoice generation',
      'Email invoice chaos',
      'No vendor-specific configuration',
      'Uncontrolled location assignments',
      'No GL account to role routing',
    ],
    solutionTitle: 'One pipeline from inbox to PropertyWare.',
    solution:
      'Using GPT-4o and AWS Textract, the system extracts data from PDFs, images, and Word documents, then routes each invoice through approvals by amount, GL account and role before syncing it to PropertyWare.',
    features: [
      { title: 'AI-powered invoice parsing', body: 'Structured data from PDFs, images and Word files, with confidence checks.' },
      { title: 'Deep PropertyWare integration', body: 'Vendors, properties and GL accounts kept in sync both ways.' },
      { title: 'Multi-tier approval workflow', body: 'Invoices under $1,500 need a single approval; larger ones go to a Property Manager, then an Accounting Supervisor.' },
      { title: 'Comprehensive audit trail', body: 'Every extraction, edit and approval recorded for compliance.' },
      { title: 'Failed invoice recovery', body: 'Nothing silently disappears when a document or integration fails.' },
      { title: 'Automated email ingestion', body: 'Invoices pulled straight from shared inboxes.' },
    ],
    steps: ['Ingest', 'Extract', 'Sync', 'Route', 'Approve'],
    stack: ['GPT-4o', 'AWS Textract', 'AWS S3', 'MySQL', 'Node.js', 'React 18', 'Python', 'FastAPI', 'TypeScript', 'Docker', 'Puppeteer', 'JWT'],
    outcomeTitle: 'From days to minutes per invoice.',
    outcome: [
      'Manual data entry reduced by 85%, with 99%+ accuracy.',
      'The entire cycle accelerated 10×.',
      'Complete traceability for compliance.',
      'Approval rules enforced by the system, not by memory.',
    ],
    quote: {
      text: 'InvoiceAutomate has completely transformed our accounts payable operations.',
      name: 'Property Management Leadership',
      role: 'Client team',
    },
  },
  {
    slug: 'saleschat',
    client: 'SalesChat',
    title: 'AI Sales Agent',
    label: 'Voice / AI',
    shift: ['Manual sales', 'autonomous'],
    summary: 'One conversational agent for calls, demos, outreach, and lead qualification.',
    problem: 'Sales demos, outreach, and qualification depended on manual team bandwidth.',
    built: 'An autonomous AI agent for inbound calls, outbound campaigns, demos, and CRM workflows.',
    complexity: 'Voice AI, GHL automation, CRM logic, personalization, compliance, and 24/7 reliability.',
    tint: 'mauve',
    facts: [
      { label: 'Product', value: 'SalesChat' },
      { label: 'Industry', value: 'Sales technology' },
      { label: 'Channels', value: 'Voice and chat' },
      { label: 'Practice', value: 'AI & automation' },
    ],
    metrics: [
      { value: '70%', label: 'less human involvement in demos and qualification' },
      { value: '3×', label: 'faster outreach' },
      { value: '24/7', label: 'sales operations' },
    ],
    challengeTitle: 'An AI product that had to sell itself.',
    challenge: [
      'Manual demos and lead qualification',
      'Difficulty maintaining personalization while scaling',
      'Inconsistent messaging across sales interactions',
      'CRM and GoHighLevel limitations',
    ],
    solutionTitle: 'An agent that pitches, demos and qualifies.',
    solution:
      'Sifars built SalesChat, an autonomous conversational AI sales agent capable of managing the full sales lifecycle. We engineered custom logic and styling despite limited documentation and platform constraints.',
    features: [
      { title: 'Autonomous conversational agent', body: 'Handles inbound calls, outbound campaigns and live demos.' },
      { title: 'Intelligent voice AI', body: 'Natural voice conversations that keep context across a call.' },
      { title: 'Consistent product messaging', body: 'Every prospect hears the same accurate pitch.' },
      { title: 'Custom logic on GoHighLevel', body: 'CRM workflows extended past what the platform offers out of the box.' },
      { title: 'Scalable outreach automation', body: 'Campaign volume no longer tied to team headcount.' },
      { title: 'Reliability at scale', body: 'Built to run around the clock without drifting off-script.' },
    ],
    stack: ['Voice AI', 'LLM agents', 'GoHighLevel (GHL)', 'CRM automation'],
    outcomeTitle: 'Sales activity that never clocks out.',
    outcome: [
      'Human involvement for demos and lead qualification reduced by 70%.',
      '3× faster outreach.',
      '100% consistency in messaging.',
      '24/7 sales activity and rapid time to value.',
    ],
  },
  {
    slug: 'wellness-app',
    client: 'MyCares',
    title: 'AI Health Management App',
    label: 'Mobile / AI',
    shift: ['Ten tools', 'one'],
    summary: 'One daily view for health tracking, family care, reminders, and AI coaching.',
    problem: 'Health, reminders, records, and family care were split across disconnected apps.',
    built: 'A mobile platform for wellness tracking, medication reminders, family care, and AI coaching.',
    complexity: 'Cross-platform launch, persistent alerts, remote care profiles, chat, and AI daily suggestions.',
    tint: 'sage',
    facts: [
      { label: 'Client', value: 'MyCares' },
      { label: 'Location', value: 'New York City, US' },
      { label: 'Industry', value: 'HealthTech / Consumer wellness' },
      { label: 'Model', value: 'B2C' },
    ],
    metrics: [
      { value: '40+', label: 'active users at launch' },
      { value: '~12 mo', label: 'kickoff to live' },
      { value: '2–3', label: 'Sifars engineers' },
    ],
    challengeTitle: 'Ten apps for one life. None of them talking to each other.',
    challenge: [
      'Medication reminders, appointments and health notes in separate apps',
      '$40–$80 a month across wellness, fitness and reminder subscriptions',
      'Family care for aging parents handled in yet another place',
      'Everything existed. Nothing was ready.',
    ],
    solutionTitle: 'Not another app. The one place where everything connects.',
    solution:
      'The team built MyCares end-to-end: mobile app, AI coaching service, UI designs, and landing page, without the client managing separate vendors.',
    features: [
      { title: 'AI wellness coach', body: 'Reviews everything logged and suggests one concrete action a day, gently, not as an order.' },
      { title: 'Family care management', body: 'Manage a loved one’s medication, reminders and appointments from your own account.' },
      { title: 'Medicine and appointments', body: 'Medications, dosage schedules and doctor appointments in one place.' },
      { title: 'Activity, diet and fasting', body: 'Workouts, meals, fasting windows and hydration.' },
      { title: 'Groups, chat and events', body: 'Built-in chat and event management for families.' },
      { title: 'Persistent notifications', body: 'Critical reminders appear as full-screen alerts on Android and as status bar notifications on iPhone.' },
    ],
    outcomeTitle: 'Ten tools replaced. One daily view.',
    outcome: [
      'One platform replaced ten separate tools.',
      'Launched simultaneously on the App Store and Google Play.',
      'Critical reminders appear even when the phone is locked.',
      'ISO 42001 and SOC2 certification in progress.',
    ],
    quote: {
      text: 'Now I start and end the day with one place that gives me a complete view of what matters.',
      name: 'Anil',
      role: 'Founder, MyCares',
    },
  },
];

export const caseBySlug = (slug: string) => cases.find((c) => c.slug === slug);
