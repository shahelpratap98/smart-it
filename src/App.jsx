import { useEffect, useRef, useState } from 'react';
import SceneCanvas from './scene/SceneCanvas.jsx';

/* ---------- brand mark ---------- */
function BrandMark() {
  return (
    <svg className="brand-mark" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <rect width="48" height="48" rx="12" fill="rgba(124,58,237,.15)" stroke="rgba(167,139,250,.5)" />
      <path d="M14 30 L24 12 L34 30 L24 24 Z" fill="#A78BFA" />
      <circle cx="24" cy="33.5" r="3" fill="#22D3EE" />
    </svg>
  );
}

/* ---------- animated counter ---------- */
function Count({ to }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    const noMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      if (noMotion) { el.textContent = to; return; }
      const start = performance.now();
      const dur = 1600;
      const tick = now => {
        const p = Math.min((now - start) / dur, 1);
        el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { rootMargin: '0px 0px -12% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, [to]);
  return <span ref={ref}>0</span>;
}

/* ---------- nav ---------- */
const LINKS = [
  ['#automation', 'AI Automation'],
  ['#webdev', 'Web Development'],
  ['#process', 'Process'],
  ['#results', 'Results'],
];

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);
  return (
    <>
      <header className={`nav${scrolled ? ' scrolled' : ''}`}>
        <div className="nav-inner">
          <a className="brand" href="#top" aria-label="Smart IT home">
            <BrandMark />
            <span className="brand-name">Smart <span>IT</span></span>
          </a>
          <nav aria-label="Primary">
            <ul className="nav-links">
              {LINKS.map(([href, label]) => (
                <li key={href}><a href={href}>{label}</a></li>
              ))}
            </ul>
          </nav>
          <a className="nav-cta" href="#contact">Start a project</a>
          <button
            className="menu-btn"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobileMenu"
            onClick={() => setOpen(o => !o)}
          >
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" aria-hidden="true">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </div>
      </header>
      <div className={`mobile-menu${open ? ' open' : ''}`} id="mobileMenu">
        {LINKS.map(([href, label]) => (
          <a key={href} href={href} onClick={() => setOpen(false)}>{label}</a>
        ))}
        <a className="nav-cta" href="#contact" onClick={() => setOpen(false)}>Start a project</a>
      </div>
    </>
  );
}

/* ---------- scroll progress bar ---------- */
function ProgressBar() {
  const bar = useRef(null);
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        bar.current.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
  }, []);
  return <div className="progress" aria-hidden="true"><i ref={bar} /></div>;
}

/* ---------- icons (Heroicons-style inline strokes) ---------- */
const ICONS = {
  gear: <svg viewBox="0 0 24 24"><path d="M12 3v3m0 12v3M3 12h3m12 0h3M6.3 6.3l2.1 2.1m7.2 7.2 2.1 2.1m0-11.4-2.1 2.1M8.4 15.6l-2.1 2.1" /><circle cx="12" cy="12" r="3.2" /></svg>,
  bot: <svg viewBox="0 0 24 24"><rect x="4" y="7" width="16" height="12" rx="3" /><path d="M12 7V4m-8 9h-1m18 0h-1M9 12.5h.01M15 12.5h.01M9.5 16h5" /></svg>,
  chart: <svg viewBox="0 0 24 24"><path d="M4 19V5m0 14h16" /><path d="M8 15l3.5-4 3 2.5L19 8" /><circle cx="19" cy="8" r="1.4" /></svg>,
  bolt: <svg viewBox="0 0 24 24"><path d="M13 3 5 13.5h5L11 21l8-10.5h-5L13 3Z" /></svg>,
  app: <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="14" rx="2.5" /><path d="M3 9h18M7.5 13.5 9 15l-1.5 1.5M12 15.5h4" /></svg>,
  cart: <svg viewBox="0 0 24 24"><path d="M4 5h2l2.2 11h9.6L20 8H7" /><circle cx="10" cy="19.5" r="1.4" /><circle cx="16.5" cy="19.5" r="1.4" /></svg>,
};

const ARROW = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

/* ---------- content data ---------- */
const AI_CARDS = [
  { icon: 'gear', tag: '01', title: 'Workflow Automation', body: 'Invoices, onboarding, reporting, follow-ups — we wire your tools together so work moves itself from inbox to done, without a human pushing it.' },
  { icon: 'bot', tag: '02', cyan: true, title: 'Custom AI Agents', body: 'Agents that answer customers, qualify leads, draft documents and run research — trained on your business, working around the clock.' },
  { icon: 'chart', tag: '03', title: 'Data & Insights', body: 'Your scattered spreadsheets become live dashboards and forecasts — so decisions get made from signal, not gut feel.' },
];

const WEB_CARDS = [
  { icon: 'bolt', tag: '01', cyan: true, title: 'Marketing Sites', body: 'Landing pages and brand sites that load in a blink, rank on search, and convert visitors into booked calls.' },
  { icon: 'app', tag: '02', title: 'Web Apps & SaaS', body: 'Customer portals, internal tools and full SaaS products — architected to scale from your first user to your hundred-thousandth.' },
  { icon: 'cart', tag: '03', cyan: true, title: 'E-commerce', body: 'Storefronts with automated inventory, smart recommendations and checkout flows tuned until the numbers move.' },
];

const STEPS = [
  ['Discover', 'We map your workflows and find where hours and revenue leak — before writing a line of code.'],
  ['Design', 'Prototypes and system blueprints you can click, question and approve. No surprises later.'],
  ['Build', 'Weekly shipping cadence. You watch the product come alive in staging, sprint by sprint.'],
  ['Scale', 'Launch, measure, automate more. We stay on as your engineering partner as the numbers grow.'],
];

export default function App() {
  // Reveal-on-scroll: one observer for every .reveal element.
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -10% 0px' });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <>
      <a className="skip-link" href="#main">Skip to main content</a>
      <SceneCanvas />
      <ProgressBar />
      <Nav />

      <main id="main">
        {/* ============ HERO ============ */}
        <section className="hero" id="top">
          <div className="wrap">
            <p className="eyebrow hero-anim">AI Automation × Web Development</p>
            <h1 className="hero-anim">We build software<br />that <span className="grad-text">thinks ahead.</span></h1>
            <p className="lead hero-anim">
              Smart IT designs AI automations and high-performance web platforms
              that turn slow, manual businesses into self-driving companies.
              Follow our robot — it knows the way.
            </p>
            <div className="hero-ctas hero-anim">
              <a className="btn btn-primary" href="#contact">Start a project {ARROW}</a>
              <a className="btn btn-ghost" href="#automation">Follow the robot</a>
            </div>
          </div>
          <div className="scroll-hint" aria-hidden="true"><span>Scroll to begin</span><i /></div>
        </section>

        {/* ============ AI AUTOMATION ============ */}
        <section id="automation" aria-labelledby="automation-title">
          <div className="wrap">
            <p className="eyebrow reveal">Chapter 01 — Automate</p>
            <h2 id="automation-title" className="reveal">Your business, <span className="grad-text">on autopilot.</span></h2>
            <p className="lead reveal">We find the hours your team loses to repetitive work — then build AI systems that give them back, every single day.</p>
            <div className="grid-3">
              {AI_CARDS.map(c => (
                <article key={c.tag} className={`card reveal${c.cyan ? ' cyan' : ''}`}>
                  <span className="card-tag">{c.tag}</span>
                  <div className="card-icon" aria-hidden="true">{ICONS[c.icon]}</div>
                  <h3>{c.title}</h3>
                  <p>{c.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ============ WEB DEVELOPMENT ============ */}
        <section id="webdev" aria-labelledby="webdev-title">
          <div className="wrap">
            <p className="eyebrow reveal">Chapter 02 — Build</p>
            <h2 id="webdev-title" className="reveal">Websites that feel <span className="grad-text">engineered.</span></h2>
            <p className="lead reveal">Fast, precise, unmistakably yours. We build the web layer your brand deserves — and the app layer your operations demand.</p>
            <div className="grid-3">
              {WEB_CARDS.map(c => (
                <article key={c.tag} className={`card reveal${c.cyan ? ' cyan' : ''}`}>
                  <span className="card-tag">{c.tag}</span>
                  <div className="card-icon" aria-hidden="true">{ICONS[c.icon]}</div>
                  <h3>{c.title}</h3>
                  <p>{c.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ============ PROCESS ============ */}
        <section id="process" aria-labelledby="process-title">
          <div className="wrap">
            <p className="eyebrow reveal">Chapter 03 — The Method</p>
            <h2 id="process-title" className="reveal">From first call to <span className="grad-text">launch orbit.</span></h2>
            <p className="lead reveal">A tight, transparent process. You always know what's shipping, when, and why it matters.</p>
            <div className="steps">
              {STEPS.map(([title, body], i) => (
                <div key={title} className="step reveal">
                  <span className="step-num">STEP / 0{i + 1}</span>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============ RESULTS ============ */}
        <section id="results" aria-labelledby="results-title">
          <div className="wrap">
            <p className="eyebrow reveal">Chapter 04 — Proof</p>
            <h2 id="results-title" className="reveal">The numbers <span className="grad-text">do the talking.</span></h2>
            <div className="stats">
              <div className="stat reveal"><b><Count to={120} />+</b><span>Projects shipped</span></div>
              <div className="stat reveal"><b><Count to={40} />k+</b><span>Hours automated / year</span></div>
              <div className="stat reveal"><b><Count to={99} />.9%</b><span>Platform uptime</span></div>
              <div className="stat reveal"><b><Count to={12} /></b><span>Industries served</span></div>
            </div>
            <div className="quotes">
              <figure className="quote reveal">
                <blockquote>Smart IT automated our entire intake pipeline. What took my team three days now happens overnight — we grew 40% without hiring.</blockquote>
                <figcaption className="quote-by">
                  <span className="quote-avatar" aria-hidden="true">RK</span>
                  <span><b>Rhea Kapoor</b><span>COO, Meridian Logistics</span></span>
                </figcaption>
              </figure>
              <figure className="quote reveal">
                <blockquote>They rebuilt our platform and it's embarrassingly fast now. Bounce rate halved, demo bookings doubled in the first month.</blockquote>
                <figcaption className="quote-by">
                  <span className="quote-avatar" aria-hidden="true">DM</span>
                  <span><b>Daniel Mercer</b><span>Founder, Northbeam Health</span></span>
                </figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* ============ CTA ============ */}
        <section id="contact" aria-labelledby="contact-title">
          <div className="wrap">
            <div className="cta-panel reveal">
              <p className="eyebrow" style={{ justifyContent: 'center' }}>Final Chapter — Begin</p>
              <h2 id="contact-title">Ready to put your business<br /><span className="grad-text">on autopilot?</span></h2>
              <p className="lead" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                Tell us what eats your team's time. In one free strategy call we'll show you
                exactly what to automate first — and what it's worth.
              </p>
              <a className="btn btn-primary" href="mailto:hello@smartit.dev?subject=Project%20enquiry">
                Book a free strategy call {ARROW}
              </a>
              <p className="cta-note">NO COMMITMENT — 30 MINUTES — REAL ANSWERS</p>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="wrap foot">
          <a className="brand" href="#top" aria-label="Smart IT home">
            <BrandMark />
            <span className="brand-name">Smart <span>IT</span></span>
          </a>
          <ul className="foot-links">
            {LINKS.map(([href, label]) => (
              <li key={href}><a href={href}>{label}</a></li>
            ))}
            <li><a href="#contact">Contact</a></li>
          </ul>
          <p className="foot-mono">© 2026 SMART IT — BUILT WITH INTELLIGENCE</p>
        </div>
      </footer>
    </>
  );
}
