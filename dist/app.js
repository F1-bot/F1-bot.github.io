(function () {
// Main app shell with theme + scroll spy
const {
  useEffect,
  useRef,
  useState
} = React;
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
    window.addEventListener("scroll", onScroll, {
      passive: true
    });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [ids.join(",")]);
  return active;
}
function ThemeToggle({
  theme,
  setTheme
}) {
  return /*#__PURE__*/React.createElement("button", {
    className: "theme-toggle",
    onClick: () => setTheme(theme === "light" ? "dark" : "light"),
    "aria-label": "Toggle theme"
  }, /*#__PURE__*/React.createElement("span", {
    className: `toggle-dot ${theme}`
  }), /*#__PURE__*/React.createElement("span", {
    className: "mono toggle-label"
  }, theme === "light" ? "light" : "dark"));
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
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Close menu on Esc
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = e => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);
  const closeMenu = () => setMenuOpen(false);
  return /*#__PURE__*/React.createElement("div", {
    className: "page"
  }, /*#__PURE__*/React.createElement("header", {
    className: "top-bar"
  }, /*#__PURE__*/React.createElement("a", {
    href: "#about",
    className: "brand mono",
    onClick: closeMenu
  }, /*#__PURE__*/React.createElement("span", null, "serhii.dolhopolov")), /*#__PURE__*/React.createElement("nav", {
    className: "top-nav"
  }, NAV.map(n => /*#__PURE__*/React.createElement("a", {
    key: n.id,
    href: `#${n.id}`,
    className: active === n.id ? "on" : ""
  }, n.label))), /*#__PURE__*/React.createElement("div", {
    className: "top-actions"
  }, /*#__PURE__*/React.createElement(ThemeToggle, {
    theme: theme,
    setTheme: setTheme
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: `hamburger ${menuOpen ? "open" : ""}`,
    "aria-label": menuOpen ? "Close menu" : "Open menu",
    "aria-expanded": menuOpen,
    "aria-controls": "mobile-nav",
    onClick: () => setMenuOpen(o => !o)
  }, /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("span", null)))), /*#__PURE__*/React.createElement("div", {
    id: "mobile-nav",
    className: `mobile-nav ${menuOpen ? "open" : ""}`,
    onClick: closeMenu
  }, /*#__PURE__*/React.createElement("nav", {
    className: "mobile-nav-inner",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("ol", null, NAV.map((n, i) => /*#__PURE__*/React.createElement("li", {
    key: n.id,
    className: active === n.id ? "on" : ""
  }, /*#__PURE__*/React.createElement("a", {
    href: `#${n.id}`,
    onClick: closeMenu
  }, /*#__PURE__*/React.createElement("span", {
    className: "num mono"
  }, "0", i + 1), /*#__PURE__*/React.createElement("span", null, n.label))))))), /*#__PURE__*/React.createElement("div", {
    className: "shell"
  }, /*#__PURE__*/React.createElement("aside", {
    className: "rail"
  }, /*#__PURE__*/React.createElement(SideNav, {
    active: active
  })), /*#__PURE__*/React.createElement("main", {
    className: "main"
  }, /*#__PURE__*/React.createElement(Hero, null), /*#__PURE__*/React.createElement(Publications, null), /*#__PURE__*/React.createElement(Experience, null), /*#__PURE__*/React.createElement(Projects, null), /*#__PURE__*/React.createElement(Awards, null), /*#__PURE__*/React.createElement(Secondary, null), /*#__PURE__*/React.createElement(Footer, null))));
}
window.App = App;
})();
