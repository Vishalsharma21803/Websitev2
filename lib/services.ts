export type DeliverableKey = 'web' | 'mobile' | 'agent' | 'flow';

export type Practice = {
  slug: string;
  name: string;
  deliverable: DeliverableKey | null;
  /** One line for business buyers. */
  outcome: string;
  /** One line for engineers. */
  under: string;
  summary: string;
  offerings: { title: string; body: string }[];
  stack: string[];
  cases: string[];
};

/** Offering titles come from the live sifars.com service pages; descriptions condensed in one voice. */
export const practices: Practice[] = [
  {
    slug: 'web',
    name: 'Web platforms',
    deliverable: 'web',
    outcome: 'Customer portals, SaaS products and internal tools that hold up when real users arrive.',
    under: 'React, Vue, Angular, Node.js, Python, Laravel. APIs, cloud and CI/CD included.',
    summary:
      'From MVPs to enterprise platforms and legacy modernization: product design, front end, back end, integrations and the cloud they run on.',
    offerings: [
      { title: 'Custom web applications', body: 'SaaS products, portals and internal tools with the edge cases handled.' },
      { title: 'Enterprise software', body: 'Multi-role systems with permissions, audit trails and integrations to what you already run.' },
      { title: 'UI/UX and product design', body: 'Product discovery, design sprints, UX review and interface design.' },
      { title: 'APIs and integrations', body: 'Clean contracts between your systems, third-party platforms and data stores.' },
      { title: 'Cloud and DevOps', body: 'Infrastructure, CI/CD and observability so releases are routine.' },
      { title: 'Legacy modernization', body: 'Moving old systems forward without stopping the business that depends on them.' },
    ],
    stack: ['React', 'Vue.js', 'Angular', 'Node.js', 'Python', 'Laravel', 'TypeScript', 'Docker', 'AWS'],
    cases: ['invoiceautomate'],
  },
  {
    slug: 'mobile',
    name: 'Mobile apps',
    deliverable: 'mobile',
    outcome: 'Apps people open every day, launched on the App Store and Google Play at once.',
    under: 'Native iOS and Android, React Native and Ionic. Persistent alerts, offline states, multi-profile accounts.',
    summary:
      'Native and cross-platform apps with the hard parts done properly: persistent notifications, offline states, family and multi-profile accounts, and AI features users trust.',
    offerings: [
      { title: 'iPhone and iPad apps', body: 'Native iOS apps shaped around the business model and the people using them.' },
      { title: 'Android apps', body: 'Full-stack Android apps, including system-level behaviour like full-screen alerts.' },
      { title: 'Cross-platform apps', body: 'React Native and Ionic apps that launch on both stores at once.' },
      { title: 'Mobile app design', body: 'UX strategy and interface design for small screens and short sessions.' },
    ],
    stack: ['iOS', 'Android', 'React Native', 'Ionic', 'Node.js'],
    cases: ['wellness-app'],
  },
  {
    slug: 'ai-agents',
    name: 'AI agents',
    deliverable: 'agent',
    outcome: 'Agents that answer, qualify and act inside your business, with a person signing off where it matters.',
    under: 'GPT-4o, LangChain, LlamaIndex, RAG, fine-tuning, evaluation. Guardrails, access limits and monitoring by design.',
    summary:
      'We have shipped machine learning, automation and data systems for over a decade. Today that means LLM products and agents with access limits, validation, human review and monitoring designed in from the start.',
    offerings: [
      { title: 'Generative AI and custom development', body: 'Products built around language and vision models, from first prototype to production service.' },
      { title: 'Conversational agents and chatbots', body: 'Voice and chat agents that qualify, answer and act, with handoff to a person when it matters.' },
      { title: 'LLM integration and optimization', body: 'RAG pipelines, vector search, prompt and cost tuning inside your existing systems.' },
      { title: 'Model fine-tuning', body: 'Adapting open and hosted models to your domain, data and tone, with evaluation you can rerun.' },
      { title: 'End-to-end model development', body: 'Data pipelines, training, serving and monitoring for models you own.' },
      { title: 'AI technology consulting', body: 'Opportunity assessment and feasibility review before any money goes into a build.' },
    ],
    stack: ['OpenAI / GPT-4o', 'LangChain', 'LlamaIndex', 'Llama', 'RAG', 'Vector databases', 'Python', 'FastAPI'],
    cases: ['saleschat', 'invoiceautomate', 'wellness-app'],
  },
  {
    slug: 'automation',
    name: 'AI automation',
    deliverable: 'flow',
    outcome: 'The manual handoffs between inboxes, spreadsheets and systems, taken out of the workflow.',
    under: 'OCR and GPT parsing, n8n, Make.com, Zapier, GoHighLevel, Python services. Approvals, audit trails, failure recovery.',
    summary:
      'We map how work actually moves between people and systems, then automate the repeatable parts with clear approval points, audit trails and recovery when an integration fails.',
    offerings: [
      { title: 'Workflow automation', body: 'Multi-step flows across email, CRMs, ERPs and internal tools, with routing and approvals.' },
      { title: 'Document and data processing', body: 'Invoices, forms, orders and transaction data extracted, checked and synced.' },
      { title: 'Bot development', body: 'Custom chatbots plus Slack, Telegram and Facebook bots for support, lead capture and internal help desks.' },
      { title: 'No-code to production', body: 'Taking n8n, Make.com, Zapier and GoHighLevel flows further when they hit their limits.' },
    ],
    stack: ['n8n', 'Make.com', 'Zapier', 'GoHighLevel', 'AWS Textract', 'Python', 'Node.js', 'PropertyWare'],
    cases: ['invoiceautomate', 'saleschat'],
  },
  {
    slug: 'security',
    name: 'Security',
    deliverable: null,
    outcome: 'Sensitive data protected by design, then tested the way an attacker would.',
    under: 'Architecture review, application, thick-client and embedded testing, secure coding, role-based access.',
    summary:
      'We protect sensitive data by fixing flaws at the architecture level, testing applications the way attackers would, and keeping access, authentication and integrity under control after launch.',
    offerings: [
      { title: 'Architecture and design review', body: 'Finding structural flaws before they become incidents.' },
      { title: 'Application security testing', body: 'Web, API, thick-client and embedded software testing.' },
      { title: 'Secure coding practice', body: 'Guidelines and reviews that keep vulnerabilities out of new code.' },
      { title: 'Insider threat exposure', body: 'Access control, authentication and confidentiality across your information resources.' },
    ],
    stack: ['Application security testing', 'Thick-client testing', 'Embedded software testing', 'Secure coding guidelines', 'Role-based access'],
    cases: ['invoiceautomate'],
  },
];

export const practiceBySlug = (slug: string) => practices.find((p) => p.slug === slug);

/** The four deliverables the home assembly draws, in camera order. */
export const deliverables: { key: DeliverableKey; slug: string; title: string; caption: string; specs: string[] }[] = [
  {
    key: 'web',
    slug: 'web',
    title: 'Websites & web platforms',
    caption: 'Portals, SaaS products and internal tools, engineered for real traffic.',
    specs: ['React · Vue · Angular', 'Node.js · Python', 'APIs · integrations', 'Docker · AWS'],
  },
  {
    key: 'mobile',
    slug: 'mobile',
    title: 'Mobile apps',
    caption: 'iOS and Android apps that launch on both stores at once.',
    specs: ['iOS · Android', 'React Native · Ionic', 'Persistent alerts', 'App Store · Play'],
  },
  {
    key: 'agent',
    slug: 'ai-agents',
    title: 'AI agents',
    caption: 'Agents that answer, qualify and act, with human sign-off built in.',
    specs: ['GPT-4o · RAG', 'Tool calls', 'Guardrails', 'Human review'],
  },
  {
    key: 'flow',
    slug: 'automation',
    title: 'AI automation',
    caption: 'From inbox to system of record, without the copy-paste in between.',
    specs: ['Ingest · OCR', 'GPT parsing', 'Route · approve', 'Sync · audit'],
  },
];

export const phases = [
  {
    name: 'Plan and validate',
    tagline: 'Decide before you build.',
    items: ['AI opportunity assessment', 'Product discovery', 'MVP scoping', 'Technical feasibility review', 'Architecture planning', 'PoC roadmap', 'Automation workflow mapping'],
  },
  {
    name: 'Design and build',
    tagline: 'Senior engineering depth.',
    items: ['AI software development', 'AI agent development', 'Custom automation platforms', 'Web app development', 'Mobile app development', 'MVP development', 'Software product design', 'Legacy system modernization', 'API and system integrations', 'DevOps and cloud setup'],
  },
  {
    name: 'Scale and improve',
    tagline: 'Reliable under real pressure.',
    items: ['AI integration', 'Workflow automation', 'Continuous product development', 'Performance optimization', 'Data pipeline development', 'Cloud infrastructure scaling', 'Product analytics and improvement', 'Support and maintenance'],
  },
];

export const engagementModels = [
  {
    name: 'Extended team',
    who: 'You own delivery',
    body: 'A specialist or a full team with the expertise you need. You keep full control of the development life cycle; we stay responsible for the people we put in it.',
  },
  {
    name: 'Managed product',
    who: 'Shared ownership',
    body: 'We design and co-create the product with you, managing the whole life cycle from planning to implementation, support and maintenance.',
  },
  {
    name: 'Managed service',
    who: 'We own delivery',
    body: 'One service, such as design, development, QA or DevOps, delivered by a specialist team. Work processes and delivery are fully managed by us.',
  },
];
