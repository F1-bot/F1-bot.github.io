// Main app shell with theme + scroll spy
const { useEffect, useRef, useState } = React;

function useScrollSpy(ids) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const onScroll = () => {
      let found = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= 180) found = id;
      }
      setActive(found);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [ids.join(",")]);
  return active;
}

function ThemeToggle({ theme, setTheme }) {
  return (
    <button
      className="theme-toggle"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      aria-label="Toggle theme"
    >
      <span className={`toggle-dot ${theme}`} />
      <span className="mono toggle-label">{theme === "light" ? "light" : "dark"}</span>
    </button>
  );
}

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  const [menuOpen, setMenuOpen] = useState(false);
  const active = useScrollSpy(NAV.map(n => n.id));

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  // Close menu on Esc
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => { if (e.key === "Escape") setMenuOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="page">
      <header className="top-bar">
        <a href="#about" className="brand mono" onClick={closeMenu}>
          <span>serhii.dolhopolov</span>
        </a>
        <nav className="top-nav">
          {NAV.map(n => (
            <a key={n.id} href={`#${n.id}`} className={active === n.id ? "on" : ""}>{n.label}</a>
          ))}
        </nav>
        <div className="top-actions">
          <ThemeToggle theme={theme} setTheme={setTheme} />
          <button
            type="button"
            className={`hamburger ${menuOpen ? "open" : ""}`}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            onClick={() => setMenuOpen(o => !o)}
          >
            <span /><span /><span />
          </button>
        </div>
      </header>

      {/* Mobile nav drawer (visible only on small screens via CSS) */}
      <div
        id="mobile-nav"
        className={`mobile-nav ${menuOpen ? "open" : ""}`}
        onClick={closeMenu}
      >
        <nav className="mobile-nav-inner" onClick={(e) => e.stopPropagation()}>
          <ol>
            {NAV.map((n, i) => (
              <li key={n.id} className={active === n.id ? "on" : ""}>
                <a href={`#${n.id}`} onClick={closeMenu}>
                  <span className="num mono">0{i + 1}</span>
                  <span>{n.label}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </div>

      <div className="shell">
        <aside className="rail">
          <SideNav active={active} />
        </aside>
        <main className="main">
          <Hero />
          <Publications />
          <Experience />
          <Projects />
          <Awards />
          <Secondary />
          <Footer />
        </main>
      </div>
    </div>
  );
}

window.App = App;
