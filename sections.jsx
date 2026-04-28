// -----------------------------------------------------------------------------
// Section components for the personal site
// -----------------------------------------------------------------------------
const { useState, useMemo, useEffect } = React;

// ---- Hero ------------------------------------------------------------------
function Hero() {
  const primary = LINKS.filter(l => l.kind === "primary");
  const scholarly = LINKS.filter(l => l.kind === "scholarly");
  const social = LINKS.filter(l => l.kind === "social");
  return (
    <section id="about" className="hero" data-section>
      <div className="hero-grid">
        <div className="hero-photo">
          <img src={PROFILE.photo} alt={PROFILE.name} />
        </div>
        <div className="hero-text">
          <h1 className="hero-name">{PROFILE.name}</h1>
          <p className="hero-sub">
            {PROFILE.role} at <span className="hero-affil">{PROFILE.affiliation}</span>.
          </p>
          <div className="hero-about">
            {PROFILE.about.map((p, i) => <p key={i}>{p}</p>)}
          </div>

          <p className="hero-email">
            <span className="eyebrow-inline mono">Email</span>
            <a href={`mailto:${PROFILE.email}`} className="email-link">{PROFILE.email}</a>
          </p>

          <div className="hero-links">
            <div className="link-row">
              {primary.map(l => (
                <a key={l.label} href={l.url} className="btn-link primary">{l.label} <span className="arr">↗</span></a>
              ))}
            </div>
            <div className="link-row link-row-secondary">
              {[...scholarly, ...social].map(l => (
                <a key={l.label} href={l.url} className="btn-link">{l.label} <span className="arr">↗</span></a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---- Section header -------------------------------------------------------
function SectionHead({ eyebrow, title, children }) {
  return (
    <header className="sec-head">
      <div className="eyebrow">{eyebrow}</div>
      <h2 className="sec-title">{title}</h2>
      {children && <div className="sec-extra">{children}</div>}
    </header>
  );
}

// ---- BibTeX helpers --------------------------------------------------------
let __BIB_CACHE = null;
async function loadBib() {
  if (__BIB_CACHE) return __BIB_CACHE;
  const res = await fetch("assets/publications.bib");
  __BIB_CACHE = await res.text();
  return __BIB_CACHE;
}
function extractEntry(text, key) {
  const needle = "@";
  let i = 0;
  while (i < text.length) {
    const at = text.indexOf(needle, i);
    if (at < 0) return null;
    const openBrace = text.indexOf("{", at);
    if (openBrace < 0) return null;
    const comma = text.indexOf(",", openBrace);
    const thisKey = text.slice(openBrace + 1, comma).trim();
    let depth = 1, j = openBrace + 1;
    while (j < text.length && depth > 0) {
      const c = text[j];
      if (c === "{") depth++;
      else if (c === "}") depth--;
      j++;
    }
    if (thisKey === key) return text.slice(at, j);
    i = j;
  }
  return null;
}

function BibButton({ bibKey }) {
  const [state, setState] = useState("idle"); // idle | copied | error
  const onClick = async (e) => {
    e.preventDefault();
    try {
      const bib = await loadBib();
      const entry = extractEntry(bib, bibKey);
      if (!entry) throw new Error("not found: " + bibKey);
      await navigator.clipboard.writeText(entry);
      setState("copied");
      setTimeout(() => setState("idle"), 1600);
    } catch (err) {
      console.error(err);
      setState("error");
      setTimeout(() => setState("idle"), 1600);
    }
  };
  const label = state === "copied" ? "Copied ✓" : state === "error" ? "Error" : "BibTeX";
  return (
    <a href={`assets/publications.bib#${bibKey}`} onClick={onClick}
       className="pill ghost" title="Copy BibTeX to clipboard">
      {label}
    </a>
  );
}

// ---- Publications ----------------------------------------------------------
function Publications() {
  const [tab, setTab] = useState("selected");
  const [year, setYear] = useState("all");
  const [topic, setTopic] = useState("all");

  const years = useMemo(() => {
    const set = new Set(PUBLICATIONS.map(p => p.year));
    return ["all", ...Array.from(set).sort((a,b) => b - a)];
  }, []);
  const topics = ["all", ...Object.keys(TOPIC_LABEL)];

  const list = useMemo(() => {
    let arr = tab === "selected"
      ? PUBLICATIONS.filter(p => p.selected)
      : PUBLICATIONS.slice();
    if (tab === "all") {
      if (year !== "all")  arr = arr.filter(p => p.year === year);
      if (topic !== "all") arr = arr.filter(p => p.topic === topic);
    }
    return arr.sort((a, b) => b.year - a.year);
  }, [tab, year, topic]);

  const counts = {
    selected: PUBLICATIONS.filter(p => p.selected).length,
    all: PUBLICATIONS.length,
  };

  return (
    <section id="publications" className="sec" data-section>
      <SectionHead eyebrow="Research · 2022–2025" title="Publications">
        <a className="quiet-link" href={LINKS.find(l => l.label === "Google Scholar").url}>
          Full list on Google Scholar ↗
        </a>
      </SectionHead>

      <div className="pub-controls">
        <div className="tabs" role="tablist">
          <button className={`tab ${tab==="selected"?"on":""}`} onClick={() => setTab("selected")}>
            Selected <span className="tab-count">{counts.selected}</span>
          </button>
          <button className={`tab ${tab==="all"?"on":""}`} onClick={() => setTab("all")}>
            All <span className="tab-count">{counts.all}</span>
          </button>
        </div>
        {tab === "all" && (
          <div className="filters">
            <div className="chips">
              {years.map(y => (
                <button key={y} className={`chip ${year===y?"on":""}`} onClick={() => setYear(y)}>
                  {y === "all" ? "All years" : y}
                </button>
              ))}
            </div>
            <div className="chips">
              {topics.map(tp => (
                <button key={tp} className={`chip ${topic===tp?"on":""}`} onClick={() => setTopic(tp)}>
                  {tp === "all" ? "All topics" : TOPIC_LABEL[tp]}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <ul className="pub-list">
        {list.map(p => (
          <li key={p.id} className="pub-item">
            <Thumb kind={p.thumb} />
            <div className="pub-body">
              <div className="pub-meta-top">
                <span className="mono">{p.year}</span>
                <span className="mono dot">·</span>
                <span className="mono">{TOPIC_LABEL[p.topic]}</span>
                {p.award && <span className="award-chip" title={p.award}>★ {p.award}</span>}
                {p.selected && <span className="sel-chip">Selected</span>}
              </div>
              <h3 className="pub-title">{p.title}</h3>
              <p className="pub-authors">
                {p.authors.map((a, i) => (
                  <span key={i} className={a.startsWith("S. Dolhopolov") ? "me" : ""}>
                    {a}{i < p.authors.length - 1 ? ", " : ""}
                  </span>
                ))}
              </p>
              <p className="pub-venue"><em>{p.venue}</em>. {p.extra}</p>
              <div className="pub-links">
                {p.links.doi && <a href={p.links.doi} className="pill">DOI</a>}
                {p.links.pdf && <a href={p.links.pdf} className="pill">PDF</a>}
                {p.links.code && <a href={p.links.code} className="pill">Code</a>}
                {p.links.data && <a href={p.links.data} className="pill">Data</a>}
                {p.links.bib && <BibButton bibKey={p.links.bib} />}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

// ---- Work experience -------------------------------------------------------
function CompanyLogo({ company }) {
  if (company.logoType === "image") {
    return (
      <div className={`logo-block logo-img ${company.logoDark ? "logo-dark" : ""}`}>
        <img src={company.logo} alt={company.companyShort || company.company} />
      </div>
    );
  }
  return (
    <div className="logo-block" aria-hidden>
      <span>{company.logo}</span>
    </div>
  );
}

function Experience() {
  return (
    <section id="experience" className="sec" data-section>
      <SectionHead eyebrow="Work" title="Experience" />
      <ul className="exp-list">
        {WORK.map((w, i) => (
          <li key={i} className="exp-company">
            <div className="exp-company-head">
              <CompanyLogo company={w} />
              <div>
                <h3 className="exp-company-name">{w.company}</h3>
                <p className="exp-company-dates mono">{w.totalDates}</p>
              </div>
            </div>

            <ul className="exp-roles">
              {w.roles.map((r, j) => {
                const multiRole = w.roles.length > 1;
                const meta = multiRole
                  ? [r.dates, r.where].filter(Boolean).join(" · ")
                  : r.where;
                return (
                  <li key={j} className="exp-role">
                    <span className="exp-role-dot" aria-hidden></span>
                    <div className="exp-role-body">
                      <div className="exp-role-top">
                        {r.icon === "microsoft" && (
                          <span className="role-icon" aria-hidden>
                            <MicrosoftLogo />
                          </span>
                        )}
                        <h4 className="exp-role-title">{r.role}</h4>
                      </div>
                      {meta && <p className="exp-role-meta mono">{meta}</p>}
                      {r.note && <p className="exp-role-note">{r.note}</p>}
                    </div>
                  </li>
                );
              })}
            </ul>
          </li>
        ))}
      </ul>
    </section>
  );
}

// ---- Projects --------------------------------------------------------------
function MicrosoftLogo() {
  return (
    <svg viewBox="0 0 23 23" width="14" height="14" aria-hidden>
      <rect x="1"  y="1"  width="10" height="10" fill="#f25022" />
      <rect x="12" y="1"  width="10" height="10" fill="#7fba00" />
      <rect x="1"  y="12" width="10" height="10" fill="#00a4ef" />
      <rect x="12" y="12" width="10" height="10" fill="#ffb900" />
    </svg>
  );
}

function Projects() {
  return (
    <section id="projects" className="sec" data-section>
      <SectionHead eyebrow="Research projects" title="Projects" />
      <ul className="proj-list">
        {PROJECTS.map(p => (
          <li key={p.id} className="proj-item">
            <div className="proj-thumb-wrap">
              <Thumb kind={p.thumb} />
              <span className={`status-pill ${p.status.toLowerCase()}`}>{p.status}</span>
            </div>
            <div className="proj-body">
              <div className="proj-top">
                <h3 className="proj-title">{p.title}</h3>
                <span className="mono proj-dates">{p.dates}</span>
              </div>
              <p className="proj-sub">{p.subtitle}</p>
              {p.sponsor && (
                <div className="proj-sponsor">
                  <MicrosoftLogo />
                  <span>Supported by {p.sponsor}</span>
                </div>
              )}
              <p className="proj-desc">{p.description}</p>
              <dl className="proj-meta">
                {p.role && <div><dt>Role</dt><dd>{p.role}</dd></div>}
                <div><dt>Members</dt><dd>{p.members.join(", ")}</dd></div>
                <div><dt>Funding</dt><dd>{p.funding}</dd></div>
                {p.registration && <div><dt>Registration</dt><dd className="mono-dd">{p.registration}</dd></div>}
                {p.statusNote && <div><dt>Status</dt><dd>{p.statusNote}</dd></div>}
              </dl>
              <div className="proj-links">
                {p.links.map(l => (
                  <a key={l.label} href={l.url} className="pill">{l.label} <span className="arr">↗</span></a>
                ))}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

// ---- Awards ----------------------------------------------------------------
function Awards() {
  return (
    <section id="awards" className="sec" data-section>
      <SectionHead eyebrow="Recognition" title="Awards & Honors" />
      <ul className="award-list">
        {AWARDS.map((a, i) => (
          <li key={i} className="award-item">
            <span className="mono award-date">{a.date}</span>
            <div className="award-body">
              <div className="award-title">{a.title}</div>
              {a.org && <div className="award-org">{a.org}</div>}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

// ---- News list — scrollable when the archive grows ------------------------
function NewsList() {
  const useScroll = NEWS.length > 4;
  return (
    <div className={useScroll ? "news-wrap news-scroll" : "news-wrap"}
         tabIndex={useScroll ? 0 : -1}>
      <ul className="news-list">
        {NEWS.map((n, i) => (
          <li key={i}>
            <span className="mono news-date">{n.date}</span>
            <span className="news-text">
              {n.text}{" "}
              {n.url && <a href={n.url} className="news-link">Read more ↗</a>}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ---- Secondary sections: Education / News / Teaching / Volunteer -----------
function Secondary() {
  return (
    <section id="more" className="sec sec-secondary" data-section>
      <SectionHead eyebrow="Also" title="Education, news & service" />
      <div className="sec-grid">
        <div className="sec-col">
          <h3 className="col-title">Education</h3>
          <ul className="plain-list">
            {EDUCATION.map((e, i) => (
              <li key={i}>
                <div className="row-top">
                  <span className="row-title">
                    {e.degree}
                    {e.degreeSub && (
                      <span className="row-title-sub">{e.degreeSub}</span>
                    )}
                  </span>
                  <span className="mono row-date">{e.dates}</span>
                </div>
                <p className="row-sub">{e.school}</p>
                {e.notes && e.notes.map((n, j) => (
                  <p key={j} className="row-note">{n}</p>
                ))}
              </li>
            ))}
          </ul>
        </div>

        <div className="sec-col">
          <h3 className="col-title">
            News
            <span className="col-title-count mono">{NEWS.length}</span>
          </h3>
          <NewsList />
        </div>

        <div className="sec-col">
          <h3 className="col-title">Teaching · KNUBA · IT Department</h3>
          <ul className="teach-list">
            {TEACHING.map((t, i) => (
              <li key={i}>
                <span className="teach-course">{t.course}</span>
                <span className="mono teach-date">
                  {t.dates.split(" · ").map((d, j) => (
                    <span key={j} className="teach-date-row">{d}</span>
                  ))}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="sec-col">
          <h3 className="col-title">Service & Volunteering</h3>
          <ul className="plain-list">
            {VOLUNTEER.map((v, i) => (
              <li key={i}>
                <div className="row-top">
                  <span className="row-title">{v.role}</span>
                  <span className="mono row-date">{v.dates}</span>
                </div>
                <p className="row-sub">{v.org}</p>
                {v.note && <p className="row-note">{v.note}</p>}
                {v.url && <a href={v.url} className="row-link">{v.url.replace(/^https?:\/\//,'')} ↗</a>}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

// ---- Side navigation -------------------------------------------------------
const NAV = [
  { id: "about",        label: "About" },
  { id: "publications", label: "Publications" },
  { id: "experience",   label: "Experience" },
  { id: "projects",     label: "Projects" },
  { id: "awards",       label: "Awards" },
  { id: "more",         label: "More" },
];

function SideNav({ active }) {
  return (
    <nav className="side-nav" aria-label="Sections">
      <div className="nav-mono">index</div>
      <ol>
        {NAV.map((n, i) => (
          <li key={n.id} className={active === n.id ? "on" : ""}>
            <a href={`#${n.id}`}>
              <span className="num">0{i + 1}</span>
              <span>{n.label}</span>
            </a>
          </li>
        ))}
      </ol>
      <div className="nav-foot mono">
        <span>© {new Date().getFullYear()}</span>
        <span>{PROFILE.affiliationShort}</span>
      </div>
    </nav>
  );
}

// ---- Footer ----------------------------------------------------------------
function Footer() {
  return (
    <footer className="site-foot">
      <div className="foot-grid">
        <div>
          <div className="eyebrow">Get in touch</div>
          <p className="foot-lead">
            Open to collaborations on applied ML, computer vision and AI tooling for engineering.
          </p>
          <a href={`mailto:${PROFILE.email}`} className="foot-email">{PROFILE.email}</a>
        </div>
        <div className="foot-links">
          {LINKS.map(l => (
            <a key={l.label} href={l.url}>{l.label}</a>
          ))}
        </div>
      </div>
      <div className="foot-base mono">
        <span>{PROFILE.name} · {PROFILE.affiliationShort} · {PROFILE.location}</span>
        <span>Last updated · April 2026</span>
      </div>
    </footer>
  );
}

Object.assign(window, {
  Hero, Publications, Experience, Projects, Awards, Secondary, SideNav, Footer, NAV,
});
