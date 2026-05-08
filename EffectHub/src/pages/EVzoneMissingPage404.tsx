import React, { useMemo, useState } from "react";

type SearchScope = "All" | "Projects" | "Resource Library";
type ResultType = "Project" | "Resource" | "Studio Tool";

type SearchResult = {
  id: string;
  title: string;
  type: ResultType;
  category: string;
  detail: string;
  status: "Ready" | "Recoverable" | "Open" | "Live Ready";
  action: string;
};

const projectResults: SearchResult[] = [
  {
    id: "p1",
    title: "Emerald Hologram Host Intro",
    type: "Project",
    category: "Face AR / Live Graphics",
    detail: "Last opened today at 12:42 • v12.5 • In Studio",
    status: "Recoverable",
    action: "Recover Project",
  },
  {
    id: "p2",
    title: "Premium Lower Third Collection",
    type: "Project",
    category: "Studio Overlay",
    detail: "Last opened yesterday • Live-ready package",
    status: "Live Ready",
    action: "Open Project",
  },
  {
    id: "p3",
    title: "Quiz Show Interaction Pack",
    type: "Project",
    category: "Interactive Effect",
    detail: "Autosave snapshot available • Needs quality review",
    status: "Recoverable",
    action: "Recover Draft",
  },
  {
    id: "p4",
    title: "Clean Broadcast Beauty Filter",
    type: "Project",
    category: "Beauty / Makeup",
    detail: "Last edited 3 days ago • Quality score 97%",
    status: "Ready",
    action: "Open Project",
  },
];

const resourceResults: SearchResult[] = [
  {
    id: "r1",
    title: "Premium Host Intro Template",
    type: "Resource",
    category: "Free Template",
    detail: "Template • Beginner • EVzone Studio compatible",
    status: "Ready",
    action: "Open Template",
  },
  {
    id: "r2",
    title: "EVzone Confetti Burst",
    type: "Resource",
    category: "Free VFX",
    detail: "Particle preset • Live-safe reward effect",
    status: "Ready",
    action: "Import Resource",
  },
  {
    id: "r3",
    title: "Studio Control Surface Presets",
    type: "Resource",
    category: "Studio Controls",
    detail: "Buttons, toggles, sliders and emergency disable bindings",
    status: "Ready",
    action: "Open Resource",
  },
  {
    id: "r4",
    title: "AI Prompt Preset Pack",
    type: "Resource",
    category: "AI Prompts",
    detail: "Prompt-to-effect, overlay, material and optimization starters",
    status: "Ready",
    action: "Use Prompt Pack",
  },
];

const toolResults: SearchResult[] = [
  {
    id: "t1",
    title: "Effect Creator Home",
    type: "Studio Tool",
    category: "Main Entry",
    detail: "Return to the main Effect Creator landing page",
    status: "Open",
    action: "Go Home",
  },
  {
    id: "t2",
    title: "EVzone Live Studio",
    type: "Studio Tool",
    category: "Studio App",
    detail: "Open the connected EVzone Studio session",
    status: "Open",
    action: "Open Studio",
  },
  {
    id: "t3",
    title: "Recovery & Diagnostics Center",
    type: "Studio Tool",
    category: "Recovery",
    detail: "Recover autosaves, repair missing assets and view logs",
    status: "Open",
    action: "Open Recovery",
  },
  {
    id: "t4",
    title: "Free Resource Library",
    type: "Studio Tool",
    category: "Resources",
    detail: "Browse templates, presets, VFX, LUTs, assets and examples",
    status: "Open",
    action: "Browse Library",
  },
];

const allResults = [...projectResults, ...resourceResults, ...toolResults];

const quickActions = [
  {
    title: "Return to Effect Creator Home",
    detail: "Go back to the premium creator entry point.",
    action: "Go Home",
    tone: "green",
  },
  {
    title: "Search Projects",
    detail: "Find local projects, drafts, live-ready effects and autosaves.",
    action: "Search Projects",
    tone: "orange",
  },
  {
    title: "Search Resource Library",
    detail: "Find free templates, presets, VFX, AI prompts and example projects.",
    action: "Browse Library",
    tone: "green",
  },
  {
    title: "Open EVzone Studio",
    detail: "Return to your existing connected live studio session.",
    action: "Open Studio",
    tone: "orange",
  },
];

const recentRecoveries = [
  {
    name: "Emerald Hologram Host Intro",
    time: "Autosave from 12:54",
    issue: "Recovered draft available",
    score: "94%",
  },
  {
    name: "Quiz Show Interaction Pack",
    time: "Autosave from yesterday",
    issue: "Draft can be restored",
    score: "88%",
  },
  {
    name: "Premium Lower Third Collection",
    time: "Last opened yesterday",
    issue: "Live-ready copy available",
    score: "97%",
  },
];

export default function EVzoneMissingPage404() {
  const [query, setQuery] = useState("");
  const [scope, setScope] = useState<SearchScope>("All");
  const [selectedResult, setSelectedResult] = useState<SearchResult>(allResults[0]);
  const [routeChecked, setRouteChecked] = useState(false);
  const [recoverNotice, setRecoverNotice] = useState("");

  const filteredResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allResults.filter((result) => {
      const scopeMatch =
        scope === "All" ||
        (scope === "Projects" && result.type === "Project") ||
        (scope === "Resource Library" && result.type === "Resource");
      const searchMatch =
        !q ||
        [result.title, result.type, result.category, result.detail, result.status]
          .join(" ")
          .toLowerCase()
          .includes(q);
      return scopeMatch && searchMatch;
    });
  }, [query, scope]);

  const handleAction = (label: string) => {
    if (label.toLowerCase().includes("recover")) {
      setRecoverNotice("Recovery ready: the recent project can be restored from local autosave.");
    } else if (label.toLowerCase().includes("studio")) {
      setRecoverNotice("Opening EVzone Studio from the connected local session.");
    } else if (label.toLowerCase().includes("home")) {
      setRecoverNotice("Returning to Effect Creator Home.");
    } else if (label.toLowerCase().includes("library") || label.toLowerCase().includes("resource")) {
      setRecoverNotice("Opening the Free Resource Library.");
    } else {
      setRecoverNotice("Opening selected destination.");
    }
  };

  return (
    <div className="evz-404-page">
      <style>{styles}</style>

      <header className="topbar">
        <div className="brand-area">
          <div className="brand-mark">EV</div>
          <div>
            <div className="eyebrow">EVzone Effect Creator</div>
            <h1>Missing Page</h1>
            <p>The route you opened does not exist, moved, or is not available in this creator workspace. Your studio session and local projects are safe.</p>
          </div>
        </div>
        <div className="top-actions">
          <span className="studio-chip"><i />EVzone Studio Connected</span>
          <button className="ghost-btn" onClick={() => setRouteChecked(true)}>Check Route</button>
          <button className="ghost-btn" onClick={() => handleAction("Open EVzone Studio")}>Open EVzone Studio</button>
          <button className="primary-btn" onClick={() => handleAction("Return to Effect Creator Home")}>Return Home</button>
        </div>
      </header>

      <main className="not-found-shell">
        <section className="panel hero-panel">
          <div className="hero-visual">
            <div className="stage-grid" />
            <div className="orb-field">
              <span className="orb orb-one" />
              <span className="orb orb-two" />
              <span className="orb orb-three" />
            </div>
            <div className="number-card">
              <span>404</span>
              <strong>Route not found</strong>
              <small>/effect-creator/missing-route</small>
            </div>
            <div className="floating-card card-one">
              <strong>Projects safe</strong>
              <span>Local autosaves protected</span>
            </div>
            <div className="floating-card card-two">
              <strong>Studio connected</strong>
              <span>EVzone bridge available</span>
            </div>
            <div className="floating-card card-three">
              <strong>Library ready</strong>
              <span>Free resources available</span>
            </div>
          </div>

          <div className="hero-copy">
            <div className="eyebrow">Premium missing route page</div>
            <h2>This page is missing, but the creator workspace is ready.</h2>
            <p>
              Use this recovery-friendly 404 page to go home, search projects, search the free resource library,
              open EVzone Studio, or recover a recent project.
            </p>

            <div className="search-control">
              <span>⌕</span>
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search projects, resources, templates, studio tools..." />
            </div>

            <div className="scope-tabs">
              {(["All", "Projects", "Resource Library"] as SearchScope[]).map((item) => (
                <button key={item} className={scope === item ? "active" : ""} onClick={() => setScope(item)}>
                  {item}
                </button>
              ))}
            </div>

            <div className="hero-actions">
              <button className="primary-btn" onClick={() => handleAction("Return to Effect Creator Home")}>Return to Effect Creator Home</button>
              <button className="ghost-btn" onClick={() => { setScope("Projects"); setQuery(""); }}>Search Projects</button>
              <button className="ghost-btn" onClick={() => { setScope("Resource Library"); setQuery(""); }}>Search Resource Library</button>
              <button className="ghost-btn" onClick={() => handleAction("Open EVzone Studio")}>Open EVzone Studio</button>
            </div>

            {routeChecked ? (
              <div className="inline-notice">
                <strong>Route checked</strong>
                <span>No matching page was found. Use the safe actions below to continue without losing your work.</span>
              </div>
            ) : null}

            {recoverNotice ? (
              <div className="toast-inline">
                <strong>{recoverNotice}</strong>
                <button onClick={() => setRecoverNotice("")}>×</button>
              </div>
            ) : null}
          </div>
        </section>

        <section className="panel actions-panel">
          <div className="panel-head">
            <div>
              <div className="eyebrow">Fast recovery actions</div>
              <h2>Where do you want to go?</h2>
            </div>
          </div>
          <div className="quick-grid">
            {quickActions.map((item) => (
              <button key={item.title} className={`quick-card ${item.tone}`} onClick={() => handleAction(item.action)}>
                <span>{item.tone === "green" ? "✓" : "↗"}</span>
                <strong>{item.title}</strong>
                <small>{item.detail}</small>
                <em>{item.action}</em>
              </button>
            ))}
          </div>
        </section>

        <section className="panel search-results-panel">
          <div className="panel-head">
            <div>
              <div className="eyebrow">Search results</div>
              <h2>{filteredResults.length} safe destinations</h2>
            </div>
            <button className="ghost-btn small" onClick={() => { setQuery(""); setScope("All"); }}>Clear Search</button>
          </div>

          <div className="results-layout">
            <div className="results-list">
              {filteredResults.map((result) => (
                <button key={result.id} className={`result-card ${selectedResult.id === result.id ? "active" : ""}`} onClick={() => setSelectedResult(result)}>
                  <span className={`result-type ${result.type.toLowerCase().replace(" ", "-")}`}>{result.type.slice(0, 2).toUpperCase()}</span>
                  <div>
                    <strong>{result.title}</strong>
                    <small>{result.category} • {result.detail}</small>
                  </div>
                  <em>{result.status}</em>
                </button>
              ))}
            </div>

            <aside className="detail-card">
              <div className="detail-art">
                <span>{selectedResult.type}</span>
              </div>
              <div className="detail-content">
                <div className="eyebrow">Selected destination</div>
                <h3>{selectedResult.title}</h3>
                <p>{selectedResult.detail}</p>
                <div className="detail-meta">
                  <span>{selectedResult.category}</span>
                  <span>{selectedResult.status}</span>
                </div>
                <button className="primary-btn full" onClick={() => handleAction(selectedResult.action)}>
                  {selectedResult.action}
                </button>
              </div>
            </aside>
          </div>
        </section>

        <section className="panel recovery-panel">
          <div className="panel-head">
            <div>
              <div className="eyebrow">Recover recent project</div>
              <h2>Recent safe recovery options</h2>
            </div>
          </div>
          <div className="recovery-grid">
            {recentRecoveries.map((item) => (
              <article className="recovery-card" key={item.name}>
                <div className="recovery-art" />
                <div>
                  <strong>{item.name}</strong>
                  <small>{item.time} • {item.issue}</small>
                </div>
                <em>{item.score}</em>
                <button onClick={() => handleAction("Recover project")}>Recover</button>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

const styles = `
:root {
  --evz-green: #03cd8c;
  --evz-orange: #f77f00;
  --evz-medium: #a6a6a6;
  --evz-light: var(--app-evz-light);
  --evz-ink: var(--app-evz-ink);
  --evz-muted: var(--app-evz-muted);
  --evz-line: var(--app-evz-line);
  --evz-soft-line: var(--app-evz-soft-line);
  --white-glass: var(--app-evz-glass);
  --shadow-lg: 0 30px 80px rgba(15,23,42,0.12);
  --shadow-md: 0 18px 46px rgba(15,23,42,0.09);
  --radius-xl: 28px;
}
* { box-sizing: border-box; }
body { margin: 0; }
.evz-404-page {
  min-height: 100vh;
  color: var(--evz-ink);
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  padding: 24px;
  background:
    radial-gradient(circle at 7% 8%, rgba(3,205,140,0.13), transparent 31%),
    radial-gradient(circle at 93% 10%, rgba(247,127,0,0.13), transparent 33%),
    var(--evz-app-bg);
}
.topbar,
.panel {
  border: 1px solid var(--evz-soft-line);
  background: var(--white-glass);
  backdrop-filter: blur(18px);
  box-shadow: var(--shadow-md);
}
.topbar {
  max-width: 100%;
  margin: 0 0 18px;
  border-radius: var(--radius-xl);
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}
.brand-area,
.top-actions,
.panel-head,
.hero-actions,
.scope-tabs,
.detail-meta,
.recovery-card,
.toast-inline {
  display: flex;
  align-items: center;
}
.brand-area { gap: 16px; max-width: 990px; }
.brand-mark {
  width: 58px;
  height: 58px;
  border-radius: 18px;
  display: grid;
  place-items: center;
  color: white;
  font-weight: 900;
  background: var(--evz-green);
  box-shadow: 0 18px 36px rgba(3,205,140,0.28);
}
.eyebrow {
  color: var(--evz-orange);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-weight: 900;
}
h1, h2, h3, p { margin-top: 0; }
h1 {
  margin: 4px 0 6px;
  font-size: clamp(30px, 4vw, 46px);
  line-height: 1;
  letter-spacing: -0.045em;
}
.brand-area p,
.hero-copy p,
.detail-content p,
.inline-notice span {
  margin-bottom: 0;
  color: var(--evz-muted);
  line-height: 1.6;
}
.top-actions { justify-content: flex-end; gap: 10px; flex-wrap: wrap; }
.studio-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border-radius: 999px;
  padding: 10px 14px;
  background: rgba(3,205,140,0.10);
  color: var(--evz-green);
  border: 1px solid rgba(3,205,140,0.18);
  font-weight: 900;
  font-size: 13px;
}
.studio-chip i {
  width: 9px;
  height: 9px;
  border-radius: 999px;
  background: var(--evz-green);
  box-shadow: 0 0 0 6px rgba(3,205,140,0.13);
}
.ghost-btn,
.primary-btn,
.scope-tabs button,
.quick-card,
.result-card,
.recovery-card button,
.search-control,
.detail-card button {
  border: 1px solid var(--evz-line);
  border-radius: 14px;
  background: var(--evz-card-solid);
  color: var(--evz-ink);
  font-weight: 800;
  padding: 11px 13px;
  cursor: pointer;
  transition: 180ms ease;
}
.ghost-btn:hover,
.scope-tabs button:hover,
.quick-card:hover,
.result-card:hover,
.recovery-card:hover,
.recovery-card button:hover {
  transform: translateY(-1px);
  box-shadow: 0 12px 24px rgba(15,23,42,0.08);
}
.primary-btn {
  color: white;
  border-color: transparent;
  background: linear-gradient(135deg, var(--evz-green), #10b981);
  box-shadow: 0 18px 36px rgba(3,205,140,0.25);
}
.small { padding: 8px 11px; font-size: 12px; }
.full { width: 100%; justify-content: center; }
.not-found-shell {
  max-width: 100%;
  margin: 0;
  display: grid;
  gap: 18px;
}
.panel {
  border-radius: var(--radius-xl);
  overflow: hidden;
}
.hero-panel {
  min-height: 720px;
  display: grid;
  grid-template-columns: 1.05fr .95fr;
}
.hero-visual {
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(circle at 30% 20%, rgba(3,205,140,0.24), transparent 34%),
    radial-gradient(circle at 78% 25%, rgba(247,127,0,0.22), transparent 36%),
    var(--evz-card);
}
.stage-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(148,163,184,0.14) 1px, transparent 1px),
    linear-gradient(90deg, rgba(148,163,184,0.14) 1px, transparent 1px);
  background-size: 36px 36px;
}
.orb-field span {
  position: absolute;
  border-radius: 999px;
  filter: blur(1px);
  opacity: .62;
}
.orb-one {
  width: 260px;
  height: 260px;
  left: 8%;
  top: 10%;
  background: radial-gradient(circle, rgba(3,205,140,0.34), transparent 70%);
}
.orb-two {
  width: 230px;
  height: 230px;
  right: 8%;
  top: 20%;
  background: radial-gradient(circle, rgba(247,127,0,0.28), transparent 70%);
}
.orb-three {
  width: 220px;
  height: 220px;
  left: 40%;
  bottom: 8%;
  background: radial-gradient(circle, rgba(166,166,166,0.24), transparent 70%);
}
.number-card {
  position: absolute;
  left: 50%;
  top: 48%;
  transform: translate(-50%, -50%);
  width: min(520px, 78%);
  min-height: 300px;
  border-radius: 34px;
  display: grid;
  place-items: center;
  text-align: center;
  padding: 28px;
  background: var(--evz-card);
  border: 1px solid var(--evz-border);
  box-shadow: var(--shadow-lg);
}
.number-card span {
  font-size: clamp(110px, 15vw, 210px);
  line-height: .82;
  letter-spacing: -0.08em;
  font-weight: 950;
  background: var(--evz-green);
  -webkit-background-clip: text;
  color: transparent;
}
.number-card strong {
  font-size: 22px;
  letter-spacing: -0.03em;
}
.number-card small {
  color: var(--evz-muted);
}
.floating-card {
  position: absolute;
  border-radius: 18px;
  padding: 14px 16px;
  background: var(--evz-card);
  border: 1px solid var(--evz-border);
  box-shadow: 0 16px 34px rgba(15,23,42,0.09);
  display: grid;
  gap: 4px;
}
.floating-card strong { color: var(--evz-green); }
.floating-card span { color: var(--evz-muted); font-size: 12px; }
.card-one { left: 28px; top: 28px; }
.card-two { right: 28px; top: 120px; }
.card-three { left: 48px; bottom: 42px; }
.hero-copy {
  padding: clamp(28px, 4vw, 56px);
  display: grid;
  align-content: center;
  gap: 18px;
}
.hero-copy h2 {
  font-size: clamp(36px, 5vw, 64px);
  line-height: 1;
  letter-spacing: -0.06em;
  margin: 0;
}
.search-control {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  cursor: text;
}
.search-control span {
  color: var(--evz-green);
  font-weight: 900;
}
.search-control input {
  border: 0;
  outline: 0;
  background: transparent;
  flex: 1;
  color: var(--evz-ink);
  font: inherit;
}
.scope-tabs {
  gap: 8px;
  flex-wrap: wrap;
}
.scope-tabs button {
  padding: 9px 11px;
  font-size: 12px;
}
.scope-tabs button.active {
  color: white;
  border-color: transparent;
  background: linear-gradient(135deg, var(--evz-green), #10b981);
}
.hero-actions {
  gap: 10px;
  flex-wrap: wrap;
}
.inline-notice,
.toast-inline {
  border: 1px solid rgba(247,127,0,0.22);
  border-radius: 18px;
  background: var(--evz-warning-surface);
  padding: 14px;
  display: grid;
  gap: 6px;
}
.inline-notice strong {
  color: var(--evz-orange);
}
.toast-inline {
  grid-template-columns: 1fr auto;
  color: var(--evz-green);
  background: rgba(3,205,140,0.08);
  border-color: rgba(3,205,140,0.22);
}
.toast-inline button {
  border: 0;
  border-radius: 11px;
  width: 30px;
  height: 30px;
  background: rgba(3,205,140,0.10);
  color: var(--evz-green);
  cursor: pointer;
}
.actions-panel,
.search-results-panel,
.recovery-panel {
  display: grid;
}
.panel-head {
  justify-content: space-between;
  gap: 16px;
  padding: 18px;
  border-bottom: 1px solid var(--evz-soft-line);
}
.panel-head h2 {
  margin: 4px 0 0;
  letter-spacing: -0.035em;
}
.quick-grid {
  padding: 18px;
  display: grid;
  grid-template-columns: repeat(4, minmax(0,1fr));
  gap: 14px;
}
.quick-card {
  text-align: left;
  display: grid;
  gap: 9px;
  min-height: 170px;
}
.quick-card > span {
  width: 40px;
  height: 40px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  color: white;
  background: var(--evz-green);
  font-weight: 900;
}
.quick-card small {
  color: var(--evz-muted);
  line-height: 1.45;
}
.quick-card em {
  color: var(--evz-green);
  font-size: 12px;
  font-style: normal;
  font-weight: 900;
}
.quick-card.orange em {
  color: var(--evz-orange);
}
.results-layout {
  display: grid;
  grid-template-columns: minmax(520px, 1fr) 390px;
  gap: 18px;
  padding: 18px;
}
.results-list {
  display: grid;
  gap: 10px;
  align-content: start;
}
.result-card {
  display: grid;
  grid-template-columns: 44px 1fr auto;
  gap: 12px;
  align-items: center;
  text-align: left;
}
.result-card.active {
  border-color: rgba(3,205,140,0.38);
  background: rgba(3,205,140,0.07);
}
.result-type {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  color: white;
  font-weight: 900;
  background: var(--evz-green);
  font-size: 12px;
}
.result-card div {
  display: grid;
  gap: 4px;
}
.result-card small,
.detail-content p,
.recovery-card small {
  color: var(--evz-muted);
  line-height: 1.45;
}
.result-card em {
  color: var(--evz-green);
  font-size: 12px;
  font-style: normal;
  font-weight: 900;
}
.detail-card {
  border: 1px solid var(--evz-soft-line);
  border-radius: 24px;
  overflow: hidden;
  background: var(--evz-card-solid);
}
.detail-art {
  min-height: 190px;
  position: relative;
  background:
    radial-gradient(circle at 24% 22%, rgba(3,205,140,0.35), transparent 32%),
    radial-gradient(circle at 76% 30%, rgba(247,127,0,0.28), transparent 34%),
    var(--evz-card);
}
.detail-art span {
  position: absolute;
  left: 16px;
  top: 16px;
  border-radius: 999px;
  padding: 8px 11px;
  color: var(--evz-green);
  background: var(--evz-card);
  font-size: 12px;
  font-weight: 900;
}
.detail-content {
  padding: 16px;
  display: grid;
  gap: 12px;
}
.detail-content h3 {
  margin: 4px 0 0;
  letter-spacing: -0.03em;
}
.detail-meta {
  gap: 8px;
  flex-wrap: wrap;
}
.detail-meta span {
  border-radius: 999px;
  padding: 8px 10px;
  color: var(--evz-green);
  background: rgba(3,205,140,0.09);
  font-size: 12px;
  font-weight: 900;
}
.recovery-grid {
  padding: 18px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0,1fr));
  gap: 14px;
}
.recovery-card {
  border: 1px solid var(--evz-line);
  border-radius: 18px;
  background: var(--evz-card-solid);
  padding: 14px;
  gap: 12px;
  display: grid;
  grid-template-columns: 66px 1fr auto;
}
.recovery-art {
  height: 66px;
  border-radius: 18px;
  background:
    radial-gradient(circle at 26% 28%, rgba(3,205,140,0.40), transparent 28%),
    radial-gradient(circle at 70% 32%, rgba(247,127,0,0.30), transparent 30%),
    var(--evz-card);
}
.recovery-card div:nth-child(2) {
  display: grid;
  gap: 4px;
}
.recovery-card em {
  color: var(--evz-green);
  font-style: normal;
  font-weight: 900;
}
.recovery-card button {
  grid-column: 1 / -1;
  color: var(--evz-muted);
  padding: 9px 10px;
}
@media (max-width: 1300px) {
  .hero-panel,
  .results-layout {
    grid-template-columns: 1fr;
  }
  .hero-visual {
    min-height: 540px;
  }
  .quick-grid,
  .recovery-grid {
    grid-template-columns: repeat(2, minmax(0,1fr));
  }
}
@media (max-width: 850px) {
  .evz-404-page {
    padding: 14px;
  }
  .topbar {
    flex-direction: column;
    align-items: flex-start;
  }
  .top-actions > *,
  .hero-actions > * {
    width: 100%;
    justify-content: center;
  }
  .quick-grid,
  .recovery-grid {
    grid-template-columns: 1fr;
  }
  .result-card,
  .recovery-card {
    grid-template-columns: 1fr;
  }
  .floating-card {
    position: relative;
    left: auto;
    right: auto;
    top: auto;
    bottom: auto;
    margin: 12px;
  }
}
`;
