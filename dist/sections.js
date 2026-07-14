(function () {
// -----------------------------------------------------------------------------
// Section components for the personal site
// -----------------------------------------------------------------------------
const {
  useState,
  useMemo,
  useEffect
} = React;

// ---- Hero ------------------------------------------------------------------
function Hero() {
  const primary = LINKS.filter(l => l.kind === "primary");
  const scholarly = LINKS.filter(l => l.kind === "scholarly");
  const social = LINKS.filter(l => l.kind === "social");
  return /*#__PURE__*/React.createElement("section", {
    id: "about",
    className: "hero",
    "data-section": true
  }, /*#__PURE__*/React.createElement("div", {
    className: "hero-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hero-photo"
  }, /*#__PURE__*/React.createElement("img", {
    src: PROFILE.photo,
    alt: PROFILE.name
  })), /*#__PURE__*/React.createElement("div", {
    className: "hero-text"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "hero-name"
  }, PROFILE.name), /*#__PURE__*/React.createElement("p", {
    className: "hero-sub"
  }, PROFILE.role, " at ", /*#__PURE__*/React.createElement("span", {
    className: "hero-affil"
  }, PROFILE.affiliation), "."), /*#__PURE__*/React.createElement("div", {
    className: "hero-about"
  }, PROFILE.about.map((p, i) => /*#__PURE__*/React.createElement("p", {
    key: i
  }, p))), /*#__PURE__*/React.createElement("p", {
    className: "hero-email"
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow-inline mono"
  }, "Email"), /*#__PURE__*/React.createElement("a", {
    href: `mailto:${PROFILE.email}`,
    className: "email-link"
  }, PROFILE.email)), /*#__PURE__*/React.createElement("div", {
    className: "hero-links"
  }, /*#__PURE__*/React.createElement("div", {
    className: "link-row"
  }, primary.map(l => /*#__PURE__*/React.createElement("a", {
    key: l.label,
    href: l.url,
    className: "btn-link primary"
  }, l.label, " ", /*#__PURE__*/React.createElement("span", {
    className: "arr"
  }, "\u2197")))), /*#__PURE__*/React.createElement("div", {
    className: "link-row link-row-secondary"
  }, [...scholarly, ...social].map(l => /*#__PURE__*/React.createElement("a", {
    key: l.label,
    href: l.url,
    className: "btn-link"
  }, l.label, " ", /*#__PURE__*/React.createElement("span", {
    className: "arr"
  }, "\u2197"))))))));
}

// ---- Section header -------------------------------------------------------
function SectionHead({
  eyebrow,
  title,
  children
}) {
  return /*#__PURE__*/React.createElement("header", {
    className: "sec-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow"
  }, eyebrow), /*#__PURE__*/React.createElement("h2", {
    className: "sec-title"
  }, title), children && /*#__PURE__*/React.createElement("div", {
    className: "sec-extra"
  }, children));
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
    let depth = 1,
      j = openBrace + 1;
    while (j < text.length && depth > 0) {
      const c = text[j];
      if (c === "{") depth++;else if (c === "}") depth--;
      j++;
    }
    if (thisKey === key) return text.slice(at, j);
    i = j;
  }
  return null;
}
function BibButton({
  bibKey
}) {
  const [state, setState] = useState("idle"); // idle | copied | error
  const onClick = async e => {
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
  return /*#__PURE__*/React.createElement("a", {
    href: `assets/publications.bib#${bibKey}`,
    onClick: onClick,
    className: "pill ghost",
    title: "Copy BibTeX to clipboard"
  }, label);
}

// ---- Publications ----------------------------------------------------------
function Publications() {
  const [tab, setTab] = useState("selected");
  const [year, setYear] = useState("all");
  const [topic, setTopic] = useState("all");
  const years = useMemo(() => {
    const set = new Set(PUBLICATIONS.map(p => p.year));
    return ["all", ...Array.from(set).sort((a, b) => b - a)];
  }, []);
  const topics = ["all", ...Object.keys(TOPIC_LABEL)];
  const list = useMemo(() => {
    let arr = tab === "selected" ? PUBLICATIONS.filter(p => p.selected) : PUBLICATIONS.slice();
    if (tab === "all") {
      if (year !== "all") arr = arr.filter(p => p.year === year);
      if (topic !== "all") arr = arr.filter(p => p.topic === topic);
    }
    return arr.sort((a, b) => b.year - a.year);
  }, [tab, year, topic]);
  const counts = {
    selected: PUBLICATIONS.filter(p => p.selected).length,
    all: PUBLICATIONS.length
  };
  return /*#__PURE__*/React.createElement("section", {
    id: "publications",
    className: "sec",
    "data-section": true
  }, /*#__PURE__*/React.createElement(SectionHead, {
    eyebrow: `Research · ${years[years.length - 1]}–${years[1]}`,
    title: "Publications"
  }, /*#__PURE__*/React.createElement("a", {
    className: "quiet-link",
    href: LINKS.find(l => l.label === "Google Scholar").url
  }, "Full list on Google Scholar \u2197")), /*#__PURE__*/React.createElement("div", {
    className: "pub-controls"
  }, /*#__PURE__*/React.createElement("div", {
    className: "tabs",
    role: "tablist",
    "aria-label": "Publication filters"
  }, /*#__PURE__*/React.createElement("button", {
    role: "tab",
    "aria-selected": tab === "selected",
    className: `tab ${tab === "selected" ? "on" : ""}`,
    onClick: () => setTab("selected")
  }, "Selected ", /*#__PURE__*/React.createElement("span", {
    className: "tab-count"
  }, counts.selected)), /*#__PURE__*/React.createElement("button", {
    role: "tab",
    "aria-selected": tab === "all",
    className: `tab ${tab === "all" ? "on" : ""}`,
    onClick: () => setTab("all")
  }, "All ", /*#__PURE__*/React.createElement("span", {
    className: "tab-count"
  }, counts.all))), tab === "all" && /*#__PURE__*/React.createElement("div", {
    className: "filters"
  }, /*#__PURE__*/React.createElement("div", {
    className: "chips"
  }, years.map(y => /*#__PURE__*/React.createElement("button", {
    key: y,
    className: `chip ${year === y ? "on" : ""}`,
    onClick: () => setYear(y)
  }, y === "all" ? "All years" : y))), /*#__PURE__*/React.createElement("div", {
    className: "chips"
  }, topics.map(tp => /*#__PURE__*/React.createElement("button", {
    key: tp,
    className: `chip ${topic === tp ? "on" : ""}`,
    onClick: () => setTopic(tp)
  }, tp === "all" ? "All topics" : TOPIC_LABEL[tp]))))), /*#__PURE__*/React.createElement("ul", {
    className: "pub-list"
  }, list.map(p => /*#__PURE__*/React.createElement("li", {
    key: p.id,
    className: "pub-item"
  }, /*#__PURE__*/React.createElement(Thumb, {
    kind: p.thumb
  }), /*#__PURE__*/React.createElement("div", {
    className: "pub-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pub-meta-top"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mono"
  }, p.year), /*#__PURE__*/React.createElement("span", {
    className: "mono dot"
  }, "\xB7"), /*#__PURE__*/React.createElement("span", {
    className: "mono"
  }, TOPIC_LABEL[p.topic]), p.award && /*#__PURE__*/React.createElement("span", {
    className: "award-chip",
    title: p.award
  }, "\u2605 ", p.award), p.selected && /*#__PURE__*/React.createElement("span", {
    className: "sel-chip"
  }, "Selected")), /*#__PURE__*/React.createElement("h3", {
    className: "pub-title"
  }, p.title), /*#__PURE__*/React.createElement("p", {
    className: "pub-authors"
  }, p.authors.map((a, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    className: a.startsWith("S. Dolhopolov") ? "me" : ""
  }, a, i < p.authors.length - 1 ? ", " : ""))), /*#__PURE__*/React.createElement("p", {
    className: "pub-venue"
  }, /*#__PURE__*/React.createElement("em", null, p.venue), ". ", p.extra), /*#__PURE__*/React.createElement("div", {
    className: "pub-links"
  }, p.links.doi && /*#__PURE__*/React.createElement("a", {
    href: p.links.doi,
    className: "pill"
  }, "DOI"), p.links.pdf && /*#__PURE__*/React.createElement("a", {
    href: p.links.pdf,
    className: "pill"
  }, "PDF"), p.links.code && /*#__PURE__*/React.createElement("a", {
    href: p.links.code,
    className: "pill"
  }, "Code"), p.links.data && /*#__PURE__*/React.createElement("a", {
    href: p.links.data,
    className: "pill"
  }, "Data"), p.links.bib && /*#__PURE__*/React.createElement(BibButton, {
    bibKey: p.links.bib
  })))))));
}

// ---- Work experience -------------------------------------------------------
function CompanyLogo({
  company
}) {
  if (company.logoType === "image") {
    return /*#__PURE__*/React.createElement("div", {
      className: `logo-block logo-img ${company.logoDark ? "logo-dark" : ""}`
    }, /*#__PURE__*/React.createElement("img", {
      src: company.logo,
      alt: company.companyShort || company.company
    }));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "logo-block",
    "aria-hidden": true
  }, /*#__PURE__*/React.createElement("span", null, company.logo));
}
function Experience() {
  return /*#__PURE__*/React.createElement("section", {
    id: "experience",
    className: "sec",
    "data-section": true
  }, /*#__PURE__*/React.createElement(SectionHead, {
    eyebrow: "Work",
    title: "Experience"
  }), /*#__PURE__*/React.createElement("ul", {
    className: "exp-list"
  }, WORK.map((w, i) => /*#__PURE__*/React.createElement("li", {
    key: i,
    className: "exp-company"
  }, /*#__PURE__*/React.createElement("div", {
    className: "exp-company-head"
  }, /*#__PURE__*/React.createElement(CompanyLogo, {
    company: w
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: "exp-company-name"
  }, w.company), /*#__PURE__*/React.createElement("p", {
    className: "exp-company-dates mono"
  }, w.totalDates))), /*#__PURE__*/React.createElement("ul", {
    className: "exp-roles"
  }, w.roles.map((r, j) => {
    const multiRole = w.roles.length > 1;
    const meta = multiRole ? [r.dates, r.where].filter(Boolean).join(" · ") : r.where;
    return /*#__PURE__*/React.createElement("li", {
      key: j,
      className: "exp-role"
    }, /*#__PURE__*/React.createElement("span", {
      className: "exp-role-dot",
      "aria-hidden": true
    }), /*#__PURE__*/React.createElement("div", {
      className: "exp-role-body"
    }, /*#__PURE__*/React.createElement("div", {
      className: "exp-role-top"
    }, r.icon === "microsoft" && /*#__PURE__*/React.createElement("span", {
      className: "role-icon",
      "aria-hidden": true
    }, /*#__PURE__*/React.createElement(MicrosoftLogo, null)), /*#__PURE__*/React.createElement("h4", {
      className: "exp-role-title"
    }, r.role)), meta && /*#__PURE__*/React.createElement("p", {
      className: "exp-role-meta mono"
    }, meta), r.note && /*#__PURE__*/React.createElement("p", {
      className: "exp-role-note"
    }, r.note)));
  }))))));
}

// ---- Projects --------------------------------------------------------------
function MicrosoftLogo() {
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 23 23",
    width: "14",
    height: "14",
    "aria-hidden": true
  }, /*#__PURE__*/React.createElement("rect", {
    x: "1",
    y: "1",
    width: "10",
    height: "10",
    fill: "#f25022"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "12",
    y: "1",
    width: "10",
    height: "10",
    fill: "#7fba00"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "1",
    y: "12",
    width: "10",
    height: "10",
    fill: "#00a4ef"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "12",
    y: "12",
    width: "10",
    height: "10",
    fill: "#ffb900"
  }));
}
function Projects() {
  return /*#__PURE__*/React.createElement("section", {
    id: "projects",
    className: "sec",
    "data-section": true
  }, /*#__PURE__*/React.createElement(SectionHead, {
    eyebrow: "Research projects",
    title: "Projects"
  }), /*#__PURE__*/React.createElement("ul", {
    className: "proj-list"
  }, PROJECTS.map(p => /*#__PURE__*/React.createElement("li", {
    key: p.id,
    className: "proj-item"
  }, /*#__PURE__*/React.createElement("div", {
    className: "proj-thumb-wrap"
  }, /*#__PURE__*/React.createElement(Thumb, {
    kind: p.thumb
  }), /*#__PURE__*/React.createElement("span", {
    className: `status-pill ${p.status.toLowerCase()}`
  }, p.status)), /*#__PURE__*/React.createElement("div", {
    className: "proj-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "proj-top"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "proj-title"
  }, p.title), /*#__PURE__*/React.createElement("span", {
    className: "mono proj-dates"
  }, p.dates)), /*#__PURE__*/React.createElement("p", {
    className: "proj-sub"
  }, p.subtitle), p.sponsor && /*#__PURE__*/React.createElement("div", {
    className: "proj-sponsor"
  }, /*#__PURE__*/React.createElement(MicrosoftLogo, null), /*#__PURE__*/React.createElement("span", null, "Supported by ", p.sponsor)), /*#__PURE__*/React.createElement("p", {
    className: "proj-desc"
  }, p.description), /*#__PURE__*/React.createElement("dl", {
    className: "proj-meta"
  }, p.role && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("dt", null, "Role"), /*#__PURE__*/React.createElement("dd", null, p.role)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("dt", null, "Members"), /*#__PURE__*/React.createElement("dd", null, p.members.join(", "))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("dt", null, "Funding"), /*#__PURE__*/React.createElement("dd", null, p.funding)), p.registration && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("dt", null, "Registration"), /*#__PURE__*/React.createElement("dd", {
    className: "mono-dd"
  }, p.registration)), p.statusNote && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("dt", null, "Status"), /*#__PURE__*/React.createElement("dd", null, p.statusNote))), /*#__PURE__*/React.createElement("div", {
    className: "proj-links"
  }, p.links.map(l => /*#__PURE__*/React.createElement("a", {
    key: l.label,
    href: l.url,
    className: "pill"
  }, l.label, " ", /*#__PURE__*/React.createElement("span", {
    className: "arr"
  }, "\u2197")))))))));
}

// ---- Awards ----------------------------------------------------------------
function Awards() {
  return /*#__PURE__*/React.createElement("section", {
    id: "awards",
    className: "sec",
    "data-section": true
  }, /*#__PURE__*/React.createElement(SectionHead, {
    eyebrow: "Recognition",
    title: "Awards & Honors"
  }), /*#__PURE__*/React.createElement("ul", {
    className: "award-list"
  }, AWARDS.map((a, i) => /*#__PURE__*/React.createElement("li", {
    key: i,
    className: "award-item"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mono award-date"
  }, a.date), /*#__PURE__*/React.createElement("div", {
    className: "award-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "award-title"
  }, a.title), a.org && /*#__PURE__*/React.createElement("div", {
    className: "award-org"
  }, a.org))))));
}

// ---- News list - scrollable when the archive grows ------------------------
function NewsList() {
  const useScroll = NEWS.length > 4;
  return /*#__PURE__*/React.createElement("div", {
    className: useScroll ? "news-wrap news-scroll" : "news-wrap",
    tabIndex: useScroll ? 0 : -1
  }, /*#__PURE__*/React.createElement("ul", {
    className: "news-list"
  }, NEWS.map((n, i) => /*#__PURE__*/React.createElement("li", {
    key: i
  }, /*#__PURE__*/React.createElement("span", {
    className: "mono news-date"
  }, n.date), /*#__PURE__*/React.createElement("span", {
    className: "news-text"
  }, n.text, " ", n.url && /*#__PURE__*/React.createElement("a", {
    href: n.url,
    className: "news-link"
  }, "Read more \u2197"))))));
}

// ---- Secondary sections: Education / News / Teaching / Volunteer -----------
function Secondary() {
  return /*#__PURE__*/React.createElement("section", {
    id: "more",
    className: "sec sec-secondary",
    "data-section": true
  }, /*#__PURE__*/React.createElement(SectionHead, {
    eyebrow: "Also",
    title: "Education, news & service"
  }), /*#__PURE__*/React.createElement("div", {
    className: "sec-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sec-col"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "col-title"
  }, "Education"), /*#__PURE__*/React.createElement("ul", {
    className: "plain-list"
  }, EDUCATION.map((e, i) => /*#__PURE__*/React.createElement("li", {
    key: i
  }, /*#__PURE__*/React.createElement("div", {
    className: "row-top"
  }, /*#__PURE__*/React.createElement("span", {
    className: "row-title"
  }, e.degree, e.degreeSub && /*#__PURE__*/React.createElement("span", {
    className: "row-title-sub"
  }, e.degreeSub)), /*#__PURE__*/React.createElement("span", {
    className: "mono row-date"
  }, e.dates)), /*#__PURE__*/React.createElement("p", {
    className: "row-sub"
  }, e.school), e.notes && e.notes.map((n, j) => /*#__PURE__*/React.createElement("p", {
    key: j,
    className: "row-note"
  }, n)))))), /*#__PURE__*/React.createElement("div", {
    className: "sec-col"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "col-title"
  }, "News", /*#__PURE__*/React.createElement("span", {
    className: "col-title-count mono"
  }, NEWS.length)), /*#__PURE__*/React.createElement(NewsList, null)), /*#__PURE__*/React.createElement("div", {
    className: "sec-col"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "col-title"
  }, "Teaching \xB7 KNUBA \xB7 IT Department"), /*#__PURE__*/React.createElement("ul", {
    className: "teach-list"
  }, TEACHING.map((t, i) => /*#__PURE__*/React.createElement("li", {
    key: i
  }, /*#__PURE__*/React.createElement("span", {
    className: "teach-course"
  }, t.course), /*#__PURE__*/React.createElement("span", {
    className: "mono teach-date"
  }, t.dates.split(" · ").map((d, j) => /*#__PURE__*/React.createElement("span", {
    key: j,
    className: "teach-date-row"
  }, d))))))), /*#__PURE__*/React.createElement("div", {
    className: "sec-col"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "col-title"
  }, "Service & Volunteering"), /*#__PURE__*/React.createElement("ul", {
    className: "plain-list"
  }, VOLUNTEER.map((v, i) => /*#__PURE__*/React.createElement("li", {
    key: i
  }, /*#__PURE__*/React.createElement("div", {
    className: "row-top"
  }, /*#__PURE__*/React.createElement("span", {
    className: "row-title"
  }, v.role), /*#__PURE__*/React.createElement("span", {
    className: "mono row-date"
  }, v.dates)), /*#__PURE__*/React.createElement("p", {
    className: "row-sub"
  }, v.org), v.note && /*#__PURE__*/React.createElement("p", {
    className: "row-note"
  }, v.note), v.url && /*#__PURE__*/React.createElement("a", {
    href: v.url,
    className: "row-link"
  }, v.url.replace(/^https?:\/\//, ''), " \u2197")))))));
}

// ---- Side navigation -------------------------------------------------------
const NAV = [{
  id: "about",
  label: "About"
}, {
  id: "publications",
  label: "Publications"
}, {
  id: "experience",
  label: "Experience"
}, {
  id: "projects",
  label: "Projects"
}, {
  id: "awards",
  label: "Awards"
}, {
  id: "more",
  label: "More"
}];
function SideNav({
  active
}) {
  return /*#__PURE__*/React.createElement("nav", {
    className: "side-nav",
    "aria-label": "Sections"
  }, /*#__PURE__*/React.createElement("div", {
    className: "nav-mono"
  }, "index"), /*#__PURE__*/React.createElement("ol", null, NAV.map((n, i) => /*#__PURE__*/React.createElement("li", {
    key: n.id,
    className: active === n.id ? "on" : ""
  }, /*#__PURE__*/React.createElement("a", {
    href: `#${n.id}`
  }, /*#__PURE__*/React.createElement("span", {
    className: "num"
  }, "0", i + 1), /*#__PURE__*/React.createElement("span", null, n.label))))), /*#__PURE__*/React.createElement("div", {
    className: "nav-foot mono"
  }, /*#__PURE__*/React.createElement("span", null, "\xA9 ", new Date().getFullYear()), /*#__PURE__*/React.createElement("span", null, PROFILE.affiliationShort)));
}

// ---- Footer ----------------------------------------------------------------
function Footer() {
  return /*#__PURE__*/React.createElement("footer", {
    className: "site-foot"
  }, /*#__PURE__*/React.createElement("div", {
    className: "foot-grid"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow"
  }, "Get in touch"), /*#__PURE__*/React.createElement("p", {
    className: "foot-lead"
  }, "Open to collaborations on applied ML, computer vision and AI tooling for engineering."), /*#__PURE__*/React.createElement("a", {
    href: `mailto:${PROFILE.email}`,
    className: "foot-email"
  }, PROFILE.email)), /*#__PURE__*/React.createElement("div", {
    className: "foot-links"
  }, LINKS.map(l => /*#__PURE__*/React.createElement("a", {
    key: l.label,
    href: l.url
  }, l.label)))), /*#__PURE__*/React.createElement("div", {
    className: "foot-base mono"
  }, /*#__PURE__*/React.createElement("span", null, PROFILE.name, " \xB7 ", PROFILE.affiliationShort, " \xB7 ", PROFILE.location), /*#__PURE__*/React.createElement("span", null, "Last updated \xB7 April 2026")));
}
Object.assign(window, {
  Hero,
  Publications,
  Experience,
  Projects,
  Awards,
  Secondary,
  SideNav,
  Footer,
  NAV
});
})();
