import React, { useMemo, useState } from "react";

type MainTab = "Usage" | "Quality" | "Reliability" | "Reports";
type BottomTab = "Version Comparison" | "Optimization Improvements" | "Export Reports" | "Internal Notes";

type ProjectProfile = {
  id: string;
  name: string;
  category: string;
  version: string;
  status: "Live Ready" | "In Studio" | "Needs Review";
  timesUsed: number;
  lastUsed: string;
  qualityScore: number;
  avgRuntime: string;
  totalRuntime: string;
};

const projects: ProjectProfile[] = [
  {
    id: "hologram-intro",
    name: "Emerald Hologram Host Intro",
    category: "Face AR / Live Graphics",
    version: "v12.5",
    status: "In Studio",
    timesUsed: 148,
    lastUsed: "Today, 12:42",
    qualityScore: 94,
    avgRuntime: "06:24",
    totalRuntime: "15h 46m",
  },
  {
    id: "lower-third-pack",
    name: "Premium Lower Third Collection",
    category: "Studio Overlay",
    version: "v4.8",
    status: "Live Ready",
    timesUsed: 263,
    lastUsed: "Yesterday, 18:11",
    qualityScore: 97,
    avgRuntime: "11:18",
    totalRuntime: "49h 32m",
  },
  {
    id: "quiz-show",
    name: "Quiz Show Interaction Pack",
    category: "Interactive Game",
    version: "v7.2",
    status: "Needs Review",
    timesUsed: 83,
    lastUsed: "2 days ago",
    qualityScore: 88,
    avgRuntime: "08:52",
    totalRuntime: "12h 18m",
  },
];

const scenesUsingEffect = [
  { name: "Morning Show", uses: 64, runtime: "06:18", quality: 95 },
  { name: "Interview Desk", uses: 38, runtime: "07:04", quality: 93 },
  { name: "Guest Split", uses: 22, runtime: "05:52", quality: 90 },
  { name: "Countdown Scene", uses: 15, runtime: "03:41", quality: 96 },
  { name: "Finale", uses: 9, runtime: "04:38", quality: 94 },
];

const camerasUsingEffect = [
  { name: "Host Camera", uses: 96, fps: 59.4, status: "Stable" },
  { name: "Guest Camera", uses: 32, fps: 58.6, status: "Stable" },
  { name: "Virtual Camera", uses: 20, fps: 56.9, status: "Watch" },
];

const triggerFrequency = [
  { name: "Studio Button", count: 142, percent: 88 },
  { name: "Scene Change", count: 94, percent: 64 },
  { name: "Smile Trigger", count: 74, percent: 52 },
  { name: "Countdown", count: 58, percent: 41 },
  { name: "Audio Beat", count: 43, percent: 32 },
  { name: "Timer", count: 26, percent: 22 },
];

const operatorControls = [
  { name: "Start Effect", count: 118, role: "Button", status: "High use" },
  { name: "Show Overlay", count: 86, role: "Toggle", status: "Stable" },
  { name: "VFX Intensity", count: 41, role: "Slider", status: "Adjusted" },
  { name: "Emergency Disable", count: 2, role: "Protected", status: "Tested" },
  { name: "Scene Variant", count: 19, role: "Dropdown", status: "Stable" },
];

const fpsHistory = [58.9, 59.2, 58.7, 59.6, 59.4, 58.8, 59.7, 59.3, 59.4, 59.1, 59.6, 59.4];
const qualityTrend = [88, 89, 90, 91, 90, 92, 93, 94, 93, 94, 95, 94];
const runtimeTrend = [6.8, 6.5, 6.2, 6.4, 6.1, 5.9, 6.0, 6.2, 6.1, 5.8, 5.7, 5.6];

const crashHistory = [
  { time: "Today 12:42", title: "No crash", detail: "Studio run completed cleanly.", severity: "Info" },
  { time: "Yesterday 18:11", title: "Preview reload", detail: "Preview refreshed after asset sync.", severity: "Info" },
  { time: "3 days ago", title: "GPU warning", detail: "Glow + background blur reached watch threshold.", severity: "Warning" },
  { time: "Last week", title: "Bridge disconnect", detail: "Operator reconnected Studio Bridge successfully.", severity: "Warning" },
];

const failedHistory = [
  { title: "Export package check", count: 0, status: "Clean" },
  { title: "Missing asset failures", count: 0, status: "Clean" },
  { title: "Preview failed reloads", count: 1, status: "Resolved" },
  { title: "Script validation failures", count: 0, status: "Clean" },
];

const optimizationImprovements = [
  { title: "Texture compression", before: "42 MB", after: "23 MB", gain: "45% smaller" },
  { title: "Particle density tuning", before: "1,840", after: "1,240", gain: "33% lighter" },
  { title: "Script timing", before: "9.4 ms", after: "6.2 ms", gain: "34% faster" },
  { title: "Draw calls", before: "91", after: "64", gain: "30% lower" },
  { title: "Fallback mode", before: "Not configured", after: "Ready", gain: "Live-safe" },
];

const versionComparisons = [
  { label: "Quality score", current: "94%", previous: "89%", delta: "+5" },
  { label: "Average FPS", current: "59.4", previous: "57.2", delta: "+2.2" },
  { label: "Package size", current: "4.8 MB", previous: "7.6 MB", delta: "-2.8 MB" },
  { label: "Script timing", current: "6.2 ms", previous: "8.9 ms", delta: "-2.7 ms" },
  { label: "Crash count", current: "0", previous: "2", delta: "-2" },
];

const exportReports = [
  { title: "Internal Quality Report", type: "PDF", date: "Today", status: "Ready" },
  { title: "Usage Analytics Snapshot", type: "CSV", date: "Today", status: "Ready" },
  { title: "Version Comparison Report", type: "PDF", date: "Yesterday", status: "Ready" },
  { title: "Performance Profiler Export", type: "CSV", date: "2 days ago", status: "Ready" },
];

const internalNotes = [
  { author: "Producer", note: "Effect is reliable for host intro segments. Keep Balanced quality mode for regular shows." },
  { author: "Technical Director", note: "GPU warning only appears when background blur is enabled together with hologram glow." },
  { author: "Operator", note: "Studio button and fallback behavior are easy to operate during live segments." },
];

export default function EVzoneProjectInsights() {
  const [activeProject, setActiveProject] = useState(projects[0]);
  const [mainTab, setMainTab] = useState<MainTab>("Usage");
  const [bottomTab, setBottomTab] = useState<BottomTab>("Version Comparison");
  const [dateRange, setDateRange] = useState("Last 30 days");
  const [selectedVersion, setSelectedVersion] = useState("v12.5 vs v12.4");

  const totalTriggerCount = triggerFrequency.reduce((sum, item) => sum + item.count, 0);
  const reliabilityScore = useMemo(() => activeProject.status === "Needs Review" ? 86 : 96, [activeProject.status]);

  const primaryStats = [
    { label: "Times used in EVzone Studio", value: activeProject.timesUsed.toLocaleString(), tone: "green" },
    { label: "Last used", value: activeProject.lastUsed, tone: "orange" },
    { label: "Average runtime", value: activeProject.avgRuntime, tone: "green" },
    { label: "Quality score", value: `${activeProject.qualityScore}%`, tone: "green" },
  ];

  const renderMainContent = () => {
    if (mainTab === "Quality") {
      return (
        <div className="panel-scroll">
          <SectionTitle eyebrow="Quality analytics" title="Quality Score Trend & Runtime Polish" />
          <div className="chart-grid">
            <ChartCard title="Quality score trend" value={`${activeProject.qualityScore}%`} values={qualityTrend} tone="green" />
            <ChartCard title="FPS history" value="59.4 FPS" values={fpsHistory} tone="green" decimal />
            <ChartCard title="Average runtime trend" value={activeProject.avgRuntime} values={runtimeTrend} tone="orange" decimal />
          </div>
          <div className="quality-grid">
            {[
              ["Visual polish", 94],
              ["Tracking stability", 96],
              ["Studio readiness", 97],
              ["Accessibility", 88],
              ["Runtime budget", 91],
              ["Operator experience", 95],
            ].map(([label, score]) => (
              <div className="quality-card" key={label}>
                <div>
                  <strong>{label}</strong>
                  <span>{score}%</span>
                </div>
                <div className="range"><b style={{ width: `${score}%` }} /></div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (mainTab === "Reliability") {
      return (
        <div className="panel-scroll">
          <SectionTitle eyebrow="Reliability analytics" title="Crash History & Failed Preview / Export History" />
          <div className="reliability-hero">
            <div className="score-orb">
              <span>{reliabilityScore}</span>
              <small>Reliability</small>
            </div>
            <div>
              <h3>{reliabilityScore >= 90 ? "Stable for live studio use" : "Needs a review pass before heavy live use"}</h3>
              <p>
                Crash history, failed preview checks, export failures, bridge reloads and script validation events are tracked for internal quality analytics only.
              </p>
            </div>
          </div>
          <div className="dual-grid">
            <div className="sub-panel">
              <SectionTitle eyebrow="Crash history" title="Runtime Events" />
              {crashHistory.map((item) => (
                <div className={`event-row ${item.severity.toLowerCase()}`} key={`${item.time}-${item.title}`}>
                  <span>{item.time}</span>
                  <div>
                    <strong>{item.title}</strong>
                    <small>{item.detail}</small>
                  </div>
                  <em>{item.severity}</em>
                </div>
              ))}
            </div>
            <div className="sub-panel">
              <SectionTitle eyebrow="Failed preview/export history" title="Failure Summary" />
              {failedHistory.map((item) => (
                <div className="failure-row" key={item.title}>
                  <div>
                    <strong>{item.title}</strong>
                    <small>{item.status}</small>
                  </div>
                  <span>{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (mainTab === "Reports") {
      return (
        <div className="panel-scroll">
          <SectionTitle eyebrow="Internal reporting" title="CSV / PDF Internal Reports" />
          <div className="report-hero">
            <div>
              <div className="eyebrow">Internal only</div>
              <h3>Usage and quality analytics, not monetization.</h3>
              <p>No earnings, no sales, no payout, no marketplace analytics. Reports are for EVzone production quality and operations only.</p>
            </div>
            <div className="report-actions">
              <button className="primary-btn" data-evz-autowire="1">Export CSV</button>
              <button className="ghost-btn" data-evz-autowire="1">Export PDF</button>
            </div>
          </div>
          <div className="report-grid">
            {exportReports.map((report) => (
              <div className="report-card" key={report.title}>
                <span className="report-type">{report.type}</span>
                <strong>{report.title}</strong>
                <small>{report.date}</small>
                <em>{report.status}</em>
              </div>
            ))}
          </div>
          <div className="no-monetization-card">
            <strong>Excluded analytics</strong>
            <span>Earnings, sales, payout, marketplace rankings, paid conversion, paid inventory, creator revenue and monetized audience analytics are not included.</span>
          </div>
        </div>
      );
    }

    return (
      <div className="panel-scroll">
        <SectionTitle eyebrow="Usage analytics" title="Studio Usage, Scenes, Cameras & Trigger Frequency" />
        <div className="stat-grid">
          {primaryStats.map((stat) => (
            <div className={`metric-card ${stat.tone}`} key={stat.label}>
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
            </div>
          ))}
        </div>

        <div className="dual-grid">
          <div className="sub-panel">
            <SectionTitle eyebrow="Scenes using the effect" title="Scene Distribution" />
            {scenesUsingEffect.map((scene) => (
              <div className="scene-row" key={scene.name}>
                <div>
                  <strong>{scene.name}</strong>
                  <small>{scene.uses} uses • avg runtime {scene.runtime}</small>
                </div>
                <span>{scene.quality}%</span>
              </div>
            ))}
          </div>

          <div className="sub-panel">
            <SectionTitle eyebrow="Cameras using the effect" title="Camera Distribution" />
            {camerasUsingEffect.map((camera) => (
              <div className={`camera-row ${camera.status.toLowerCase()}`} key={camera.name}>
                <div>
                  <strong>{camera.name}</strong>
                  <small>{camera.uses} uses • {camera.fps} FPS avg</small>
                </div>
                <em>{camera.status}</em>
              </div>
            ))}
          </div>
        </div>

        <div className="dual-grid">
          <div className="sub-panel">
            <SectionTitle eyebrow="Trigger frequency" title={`${totalTriggerCount} total triggers`} />
            {triggerFrequency.map((trigger) => (
              <div className="bar-row" key={trigger.name}>
                <div>
                  <strong>{trigger.name}</strong>
                  <span>{trigger.count}</span>
                </div>
                <div className="range"><b style={{ width: `${trigger.percent}%` }} /></div>
              </div>
            ))}
          </div>

          <div className="sub-panel">
            <SectionTitle eyebrow="Operator control usage" title="Control Surface Analytics" />
            {operatorControls.map((control) => (
              <div className="control-row" key={control.name}>
                <span className="control-icon">{control.role.slice(0, 2).toUpperCase()}</span>
                <div>
                  <strong>{control.name}</strong>
                  <small>{control.role} • {control.count} uses</small>
                </div>
                <em>{control.status}</em>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderBottomContent = () => {
    if (bottomTab === "Optimization Improvements") {
      return (
        <div className="optimization-grid">
          {optimizationImprovements.map((item) => (
            <div className="optimization-card" key={item.title}>
              <strong>{item.title}</strong>
              <div className="before-after">
                <span>Before: {item.before}</span>
                <span>After: {item.after}</span>
              </div>
              <em>{item.gain}</em>
            </div>
          ))}
        </div>
      );
    }

    if (bottomTab === "Export Reports") {
      return (
        <div className="bottom-report-grid">
          {exportReports.map((report) => (
            <div className="bottom-report-card" key={report.title}>
              <span>{report.type}</span>
              <strong>{report.title}</strong>
              <small>{report.date}</small>
              <button data-evz-autowire="1">{report.type === "CSV" ? "Download CSV" : "Download PDF"}</button>
            </div>
          ))}
        </div>
      );
    }

    if (bottomTab === "Internal Notes") {
      return (
        <div className="notes-grid">
          {internalNotes.map((note) => (
            <div className="note-card" key={note.author}>
              <strong>{note.author}</strong>
              <span>{note.note}</span>
            </div>
          ))}
          <div className="note-entry">
            <textarea placeholder="Add internal usage, quality, or operator note..." />
            <button className="primary-btn" data-evz-autowire="1">Save Note</button>
          </div>
        </div>
      );
    }

    return (
      <div className="version-grid">
        <div className="version-header">
          <div>
            <div className="eyebrow">Version comparison</div>
            <h3>{selectedVersion}</h3>
          </div>
          <select value={selectedVersion} onChange={(event) => setSelectedVersion(event.target.value)}>
            <option>v12.5 vs v12.4</option>
            <option>v12.5 vs v12.3</option>
            <option>v12.4 vs v12.2</option>
          </select>
        </div>
        <div className="version-rows">
          {versionComparisons.map((item) => (
            <div className="version-row" key={item.label}>
              <strong>{item.label}</strong>
              <span>{item.previous}</span>
              <span>{item.current}</span>
              <em>{item.delta}</em>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="evz-insights-page">
      <style>{styles}</style>

      <header className="topbar">
        <div className="brand-area">
          <div className="brand-mark">EV</div>
          <div>
            <div className="eyebrow">EVzone Effect Creator</div>
            <h1>Project Insights</h1>
            <p>Usage and quality analytics for EVzone Studio effects. Internal performance, reliability and version insights only — no monetization analytics.</p>
          </div>
        </div>
        <div className="top-actions">
          <span className="studio-chip"><i />Connected to EVzone Studio</span>
          <button className="ghost-btn" data-evz-autowire="1">Refresh Insights</button>
          <button className="ghost-btn" data-evz-autowire="1">Export CSV</button>
          <button className="primary-btn" data-evz-autowire="1">Export PDF Report</button>
        </div>
      </header>

      <section className="insights-hero">
        <div className="hero-card main">
          <div className="score-orb">
            <span>{activeProject.qualityScore}</span>
            <small>Quality</small>
          </div>
          <div>
            <div className="eyebrow">Active project analytics</div>
            <h2>{activeProject.name}</h2>
            <p>{activeProject.category} • {activeProject.version} • {activeProject.status} • {dateRange}</p>
          </div>
        </div>
        <div className="hero-card mini">
          <span>Times used</span>
          <strong className="green">{activeProject.timesUsed}</strong>
        </div>
        <div className="hero-card mini">
          <span>Total runtime</span>
          <strong className="green">{activeProject.totalRuntime}</strong>
        </div>
        <div className="hero-card mini">
          <span>Crash count</span>
          <strong className="orange">{activeProject.status === "Needs Review" ? 2 : 0}</strong>
        </div>
        <div className="hero-card mini">
          <span>Monetization</span>
          <strong className="orange">None</strong>
        </div>
      </section>

      <main className="insights-shell">
        <aside className="panel left-panel">
          <div className="panel-head">
            <div>
              <div className="eyebrow">Projects</div>
              <h2>Tracked Effects</h2>
            </div>
          </div>
          <div className="project-list">
            {projects.map((project) => (
              <button key={project.id} className={activeProject.id === project.id ? "active" : ""} onClick={() => setActiveProject(project)}>
                <span className="project-art" />
                <div>
                  <strong>{project.name}</strong>
                  <small>{project.category} • {project.version}</small>
                  <em>{project.status}</em>
                </div>
              </button>
            ))}
          </div>

          <div className="filter-card">
            <div className="eyebrow">Filters</div>
            <label>
              <span>Date range</span>
              <select value={dateRange} onChange={(event) => setDateRange(event.target.value)}>
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
                <option>Studio season</option>
              </select>
            </label>
            <label>
              <span>Studio target</span>
              <select>
                <option>All scenes and cameras</option>
                <option>Host camera only</option>
                <option>Guest camera only</option>
                <option>Overlay layers only</option>
              </select>
            </label>
          </div>

          <div className="no-money-card">
            <strong>No monetization data</strong>
            <span>No earnings, sales, payout or marketplace analytics are shown anywhere in Project Insights.</span>
          </div>
        </aside>

        <section className="panel main-panel">
          <div className="main-top">
            <div>
              <div className="eyebrow">Insight view</div>
              <h2>{mainTab} Analytics</h2>
              <p>{activeProject.name} • {dateRange}</p>
            </div>
            <div className="main-tabs">
              {(["Usage", "Quality", "Reliability", "Reports"] as MainTab[]).map((tab) => (
                <button key={tab} className={mainTab === tab ? "active" : ""} onClick={() => setMainTab(tab)}>
                  {tab}
                </button>
              ))}
            </div>
          </div>
          {renderMainContent()}
        </section>

        <aside className="panel right-panel">
          <div className="panel-head">
            <div>
              <div className="eyebrow">Snapshot</div>
              <h2>Current Health</h2>
            </div>
          </div>
          <div className="health-panel">
            <div className="health-orb">
              <span>{reliabilityScore}</span>
              <small>Reliability</small>
            </div>
            <div className="health-list">
              <SummaryRow label="Last used" value={activeProject.lastUsed} tone="orange" />
              <SummaryRow label="Scenes using effect" value={String(scenesUsingEffect.length)} tone="green" />
              <SummaryRow label="Cameras using effect" value={String(camerasUsingEffect.length)} tone="green" />
              <SummaryRow label="Trigger frequency" value={String(totalTriggerCount)} tone="green" />
              <SummaryRow label="Average runtime" value={activeProject.avgRuntime} tone="green" />
              <SummaryRow label="Failed exports" value="0" tone="green" />
            </div>
          </div>

          <div className="report-panel">
            <SectionTitle eyebrow="Internal report" title="CSV / PDF" />
            <p>Generate internal production reports for quality review, not marketplace or revenue analysis.</p>
            <div className="report-buttons">
              <button data-evz-autowire="1">CSV Usage</button>
              <button data-evz-autowire="1">PDF Quality</button>
              <button data-evz-autowire="1">CSV Runtime</button>
              <button data-evz-autowire="1">PDF Version</button>
            </div>
          </div>

          <div className="excluded-panel">
            <strong>Excluded by design</strong>
            <span>Earnings</span>
            <span>Sales</span>
            <span>Payouts</span>
            <span>Marketplace analytics</span>
          </div>
        </aside>
      </main>

      <section className="panel bottom-panel">
        <div className="bottom-head">
          <div className="bottom-tabs">
            {(["Version Comparison", "Optimization Improvements", "Export Reports", "Internal Notes"] as BottomTab[]).map((tab) => (
              <button key={tab} className={bottomTab === tab ? "active" : ""} onClick={() => setBottomTab(tab)}>
                {tab}
              </button>
            ))}
          </div>
          <div className="bottom-actions">
            <button className="ghost-btn small" data-evz-autowire="1">Save Insight Snapshot</button>
            <button className="ghost-btn small" data-evz-autowire="1">Download CSV</button>
            <button className="primary-btn small" data-evz-autowire="1">Create PDF Report</button>
          </div>
        </div>
        <div className="bottom-content">
          {renderBottomContent()}
        </div>
      </section>
    </div>
  );
}

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="section-title">
      <span>{eyebrow}</span>
      <h3>{title}</h3>
    </div>
  );
}

function ChartCard({
  title,
  value,
  values,
  tone,
  decimal,
}: {
  title: string;
  value: string;
  values: number[];
  tone: "green" | "orange";
  decimal?: boolean;
}) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const points = values
    .map((point, index) => {
      const x = (index / Math.max(values.length - 1, 1)) * 100;
      const y = 84 - ((point - min) / Math.max(max - min, 1)) * 68;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className={`chart-card ${tone}`}>
      <div className="chart-head">
        <div>
          <strong>{title}</strong>
          <small>{decimal ? values[values.length - 1].toFixed(1) : values[values.length - 1]} latest value</small>
        </div>
        <span>{value}</span>
      </div>
      <svg className="sparkline" viewBox="0 0 100 90" preserveAspectRatio="none">
        <polyline points={points} />
      </svg>
    </div>
  );
}

function SummaryRow({ label, value, tone }: { label: string; value: string; tone: "green" | "orange" }) {
  return (
    <div className="summary-row">
      <span>{label}</span>
      <strong className={tone}>{value}</strong>
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
.evz-insights-page {
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
.panel,
.insights-hero {
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
.insights-hero,
.hero-card,
.main-top,
.main-tabs,
.bottom-head,
.bottom-tabs,
.bottom-actions,
.summary-row,
.chart-head,
.event-row,
.failure-row,
.scene-row,
.camera-row,
.control-row,
.version-header,
.version-row,
.report-actions {
  display: flex;
  align-items: center;
}
.brand-area { gap: 16px; max-width: 1010px; }
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
.hero-card p,
.main-top p,
.reliability-hero p,
.report-hero p,
.report-panel p,
.no-monetization-card span,
.no-money-card span,
.note-card span {
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
.project-list button,
.filter-card select,
.main-tabs button,
.bottom-tabs button,
.report-buttons button,
.bottom-report-card button,
.optimization-card,
.version-row,
.summary-row,
.metric-card,
.quality-card,
.report-card,
.event-row,
.failure-row,
.scene-row,
.camera-row,
.control-row {
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
.project-list button:hover,
.main-tabs button:hover,
.bottom-tabs button:hover,
.report-buttons button:hover,
.bottom-report-card button:hover,
.optimization-card:hover,
.version-row:hover,
.report-card:hover,
.event-row:hover,
.scene-row:hover,
.camera-row:hover,
.control-row:hover {
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
.green { color: var(--evz-green); }
.orange { color: var(--evz-orange); }
.insights-hero {
  max-width: 100%;
  margin: 0 0 18px;
  border-radius: var(--radius-xl);
  padding: 18px;
  display: grid;
  grid-template-columns: 1.45fr repeat(4, minmax(135px, .28fr));
  gap: 12px;
}
.hero-card {
  gap: 14px;
  border: 1px solid var(--evz-soft-line);
  background: var(--evz-card-solid);
  border-radius: 22px;
  padding: 16px;
}
.hero-card.main h2 {
  margin: 4px 0 8px;
  letter-spacing: -0.035em;
}
.hero-card.mini {
  display: grid;
  gap: 6px;
  align-content: center;
}
.hero-card.mini span {
  color: var(--evz-muted);
  font-size: 12px;
  font-weight: 800;
}
.hero-card.mini strong {
  font-size: 24px;
}
.score-orb,
.health-orb {
  width: 104px;
  height: 104px;
  flex: 0 0 104px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  border: 10px solid rgba(3,205,140,0.16);
  background: var(--evz-card-solid);
}
.score-orb span,
.health-orb span {
  color: var(--evz-green);
  font-size: 32px;
  font-weight: 900;
  line-height: 1;
}
.score-orb small,
.health-orb small {
  margin-top: -20px;
  color: var(--evz-muted);
}
.insights-shell {
  max-width: 100%;
  margin: 0;
  display: grid;
  grid-template-columns: 320px minmax(720px, 1fr) 390px;
  gap: 18px;
}
.panel {
  border-radius: var(--radius-xl);
  overflow: hidden;
}
.left-panel,
.main-panel,
.right-panel {
  min-height: 980px;
}
.panel-head {
  justify-content: space-between;
  padding: 18px 18px 12px;
  border-bottom: 1px solid var(--evz-soft-line);
}
.panel-head h2 {
  margin: 4px 0 0;
  letter-spacing: -0.03em;
}
.project-list {
  padding: 16px 18px;
  display: grid;
  gap: 10px;
}
.project-list button {
  width: 100%;
  display: grid;
  grid-template-columns: 58px 1fr;
  gap: 12px;
  text-align: left;
  align-items: center;
}
.project-list button.active {
  border-color: rgba(3,205,140,0.34);
  background: rgba(3,205,140,0.07);
}
.project-art {
  height: 54px;
  border-radius: 16px;
  background:
    radial-gradient(circle at 26% 28%, rgba(3,205,140,0.40), transparent 28%),
    radial-gradient(circle at 70% 32%, rgba(247,127,0,0.30), transparent 30%),
    var(--evz-card);
}
.project-list button div {
  display: grid;
  gap: 4px;
}
small {
  color: var(--evz-muted);
  font-size: 12px;
  line-height: 1.45;
}
.project-list em {
  color: var(--evz-green);
  font-size: 11px;
  font-style: normal;
  font-weight: 900;
}
.filter-card,
.no-money-card,
.report-panel,
.excluded-panel,
.health-panel {
  margin: 0 18px 18px;
  border: 1px solid var(--evz-soft-line);
  border-radius: 22px;
  background: var(--evz-card-solid);
  padding: 14px;
  display: grid;
  gap: 12px;
}
.filter-card label {
  display: grid;
  gap: 7px;
}
.filter-card span {
  color: var(--evz-muted);
  font-size: 12px;
  font-weight: 900;
}
.filter-card select {
  width: 100%;
  color: var(--evz-ink);
  cursor: pointer;
}
.no-money-card {
  border-color: rgba(247,127,0,0.20);
  background: var(--evz-warning-surface);
}
.no-money-card strong,
.no-monetization-card strong {
  color: var(--evz-orange);
}
.main-panel {
  display: grid;
  grid-template-rows: auto 1fr;
}
.main-top {
  justify-content: space-between;
  gap: 18px;
  padding: 18px;
  border-bottom: 1px solid var(--evz-soft-line);
  background: var(--evz-card);
}
.main-top h2 {
  margin: 4px 0 6px;
  letter-spacing: -0.035em;
}
.main-tabs {
  gap: 8px;
  flex-wrap: wrap;
  justify-content: flex-end;
}
.main-tabs button,
.bottom-tabs button {
  padding: 9px 11px;
  font-size: 12px;
}
.main-tabs button.active,
.bottom-tabs button.active {
  color: white;
  border-color: transparent;
  background: linear-gradient(135deg, var(--evz-green), #10b981);
  box-shadow: 0 14px 26px rgba(3,205,140,0.19);
}
.panel-scroll {
  padding: 18px;
  display: grid;
  gap: 16px;
}
.section-title span {
  color: var(--evz-orange);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-weight: 900;
}
.section-title h3 {
  margin: 5px 0 0;
  letter-spacing: -0.03em;
}
.stat-grid,
.chart-grid,
.quality-grid,
.report-grid,
.optimization-grid,
.bottom-report-grid,
.notes-grid {
  display: grid;
  gap: 12px;
}
.stat-grid {
  grid-template-columns: repeat(4, minmax(0,1fr));
}
.metric-card {
  display: grid;
  gap: 8px;
  cursor: default;
}
.metric-card span {
  color: var(--evz-muted);
  font-size: 12px;
  font-weight: 800;
}
.metric-card strong {
  font-size: 24px;
  letter-spacing: -0.03em;
}
.metric-card.green strong { color: var(--evz-green); }
.metric-card.orange strong { color: var(--evz-orange); }
.dual-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}
.sub-panel {
  border: 1px solid var(--evz-soft-line);
  border-radius: 24px;
  background: var(--evz-card);
  padding: 14px;
  display: grid;
  gap: 10px;
}
.scene-row,
.camera-row,
.control-row,
.event-row,
.failure-row {
  justify-content: space-between;
  gap: 12px;
}
.scene-row div,
.camera-row div,
.control-row div,
.event-row div,
.failure-row div {
  display: grid;
  gap: 4px;
}
.scene-row span,
.camera-row em,
.control-row em,
.event-row em,
.failure-row span {
  color: var(--evz-green);
  font-size: 12px;
  font-style: normal;
  font-weight: 900;
}
.camera-row.watch em,
.event-row.warning em {
  color: var(--evz-orange);
}
.bar-row {
  display: grid;
  gap: 8px;
  padding: 10px 0;
  border-bottom: 1px solid var(--evz-soft-line);
}
.bar-row:last-child { border-bottom: 0; }
.bar-row div:first-child {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.bar-row span {
  color: var(--evz-green);
  font-weight: 900;
  font-size: 12px;
}
.range {
  width: 100%;
  height: 8px;
  border-radius: 999px;
  background: rgba(148,163,184,0.17);
  overflow: hidden;
}
.range b {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--evz-green), var(--evz-orange));
}
.control-row {
  display: grid;
  grid-template-columns: 42px 1fr auto;
}
.control-icon {
  width: 38px;
  height: 38px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  color: white;
  background: var(--evz-green);
  font-weight: 900;
  font-size: 12px;
}
.chart-grid {
  grid-template-columns: repeat(3, minmax(0,1fr));
}
.chart-card {
  border: 1px solid var(--evz-soft-line);
  border-radius: 24px;
  background: var(--evz-card-solid);
  padding: 14px;
  display: grid;
  gap: 10px;
}
.chart-head {
  justify-content: space-between;
  gap: 12px;
}
.chart-head div {
  display: grid;
  gap: 4px;
}
.chart-head span {
  color: var(--evz-green);
  font-weight: 900;
}
.chart-card.orange .chart-head span {
  color: var(--evz-orange);
}
.sparkline {
  width: 100%;
  height: 150px;
  border-radius: 18px;
  background:
    linear-gradient(rgba(148,163,184,0.10) 1px, transparent 1px),
    linear-gradient(90deg, rgba(148,163,184,0.10) 1px, transparent 1px);
  background-size: 30px 30px;
}
.sparkline polyline {
  fill: none;
  stroke: var(--evz-green);
  stroke-width: 4;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.chart-card.orange .sparkline polyline {
  stroke: var(--evz-orange);
}
.quality-grid {
  grid-template-columns: repeat(3, minmax(0,1fr));
}
.quality-card {
  display: grid;
  gap: 10px;
  cursor: default;
}
.quality-card div:first-child {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}
.quality-card span {
  color: var(--evz-green);
  font-weight: 900;
}
.reliability-hero,
.report-hero {
  border: 1px solid var(--evz-soft-line);
  border-radius: 24px;
  background:
    radial-gradient(circle at 20% 20%, rgba(3,205,140,0.14), transparent 34%),
    var(--evz-card);
  padding: 18px;
  display: grid;
  grid-template-columns: 130px 1fr;
  gap: 18px;
  align-items: center;
}
.reliability-hero .score-orb {
  width: 118px;
  height: 118px;
  border-width: 10px;
}
.reliability-hero h3,
.report-hero h3 {
  font-size: 26px;
  letter-spacing: -0.035em;
  margin-bottom: 8px;
}
.failure-row span {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  color: white;
  background: var(--evz-green);
}
.event-row {
  display: grid;
  grid-template-columns: 82px 1fr auto;
}
.event-row > span {
  color: var(--evz-muted);
  font-size: 12px;
}
.report-hero {
  grid-template-columns: 1fr auto;
}
.report-actions {
  gap: 8px;
  flex-wrap: wrap;
}
.report-grid {
  grid-template-columns: repeat(4, minmax(0,1fr));
}
.report-card {
  display: grid;
  gap: 8px;
  cursor: default;
}
.report-type {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  color: white;
  background: var(--evz-green);
  font-size: 12px;
  font-weight: 900;
}
.report-card em {
  color: var(--evz-green);
  font-size: 12px;
  font-style: normal;
  font-weight: 900;
}
.no-monetization-card {
  border: 1px solid rgba(247,127,0,0.20);
  border-radius: 22px;
  padding: 14px;
  background: var(--evz-warning-surface);
  display: grid;
  gap: 6px;
}
.health-panel {
  align-items: center;
}
.health-orb {
  margin: 0 0 10px;
  width: 150px;
  height: 150px;
}
.health-orb span {
  font-size: 44px;
}
.health-list,
.summary-list {
  display: grid;
  gap: 10px;
}
.summary-row {
  justify-content: space-between;
  gap: 12px;
  cursor: default;
}
.summary-row span {
  color: var(--evz-muted);
  font-size: 12px;
}
.report-panel p {
  font-size: 13px;
}
.report-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}
.report-buttons button {
  color: var(--evz-muted);
  padding: 10px;
}
.excluded-panel {
  border-color: rgba(247,127,0,0.20);
  background: var(--evz-warning-surface);
}
.excluded-panel strong {
  color: var(--evz-orange);
}
.excluded-panel span {
  border-radius: 999px;
  padding: 8px 10px;
  background: var(--evz-card-solid);
  color: var(--evz-muted);
  font-size: 12px;
  font-weight: 900;
}
.bottom-panel {
  max-width: 100%;
  margin: 18px auto 0;
}
.bottom-head {
  justify-content: space-between;
  gap: 16px;
  padding: 16px;
  border-bottom: 1px solid var(--evz-soft-line);
}
.bottom-tabs,
.bottom-actions {
  gap: 8px;
  flex-wrap: wrap;
}
.bottom-content {
  padding: 18px;
}
.version-grid {
  display: grid;
  gap: 12px;
}
.version-header {
  justify-content: space-between;
  gap: 16px;
  border: 1px solid var(--evz-soft-line);
  border-radius: 22px;
  padding: 14px;
  background: var(--evz-card-solid);
}
.version-header h3 {
  margin: 4px 0 0;
}
.version-header select {
  border: 1px solid var(--evz-line);
  border-radius: 14px;
  padding: 10px;
  color: var(--evz-ink);
  background: var(--evz-card-solid);
  font-weight: 800;
}
.version-rows {
  display: grid;
  gap: 10px;
}
.version-row {
  display: grid;
  grid-template-columns: 1fr 120px 120px 80px;
  gap: 12px;
  cursor: default;
}
.version-row span {
  color: var(--evz-muted);
}
.version-row em {
  color: var(--evz-green);
  font-style: normal;
  font-weight: 900;
}
.optimization-grid {
  grid-template-columns: repeat(5, minmax(0,1fr));
}
.optimization-card {
  display: grid;
  gap: 10px;
  cursor: default;
}
.before-after {
  display: grid;
  gap: 5px;
}
.before-after span {
  color: var(--evz-muted);
  font-size: 12px;
}
.optimization-card em {
  color: var(--evz-green);
  font-style: normal;
  font-weight: 900;
}
.bottom-report-grid {
  grid-template-columns: repeat(4, minmax(0,1fr));
}
.bottom-report-card {
  border: 1px solid var(--evz-soft-line);
  border-radius: 18px;
  background: var(--evz-card-solid);
  padding: 14px;
  display: grid;
  gap: 8px;
}
.bottom-report-card > span {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  color: white;
  background: var(--evz-green);
  font-size: 12px;
  font-weight: 900;
}
.bottom-report-card button {
  color: var(--evz-muted);
  padding: 9px 10px;
}
.notes-grid {
  grid-template-columns: repeat(3, minmax(0,1fr)) 1.2fr;
}
.note-card,
.note-entry {
  border: 1px solid var(--evz-soft-line);
  border-radius: 18px;
  background: var(--evz-card-solid);
  padding: 14px;
  display: grid;
  gap: 8px;
}
.note-card strong {
  color: var(--evz-green);
}
.note-entry textarea {
  min-height: 110px;
  border: 1px solid var(--evz-line);
  border-radius: 14px;
  padding: 12px;
  font: inherit;
  resize: vertical;
}
@media (max-width: 1500px) {
  .insights-hero,
  .insights-shell {
    grid-template-columns: 310px 1fr;
  }
  .hero-card.main {
    grid-column: span 2;
  }
  .right-panel {
    grid-column: span 2;
    min-height: auto;
  }
  .stat-grid,
  .chart-grid,
  .report-grid,
  .optimization-grid,
  .bottom-report-grid {
    grid-template-columns: repeat(2, minmax(0,1fr));
  }
}
@media (max-width: 1050px) {
  .topbar {
    flex-direction: column;
    align-items: flex-start;
  }
  .insights-hero,
  .insights-shell {
    grid-template-columns: 1fr;
  }
  .hero-card.main,
  .right-panel {
    grid-column: auto;
  }
  .dual-grid,
  .reliability-hero,
  .report-hero,
  .notes-grid {
    grid-template-columns: 1fr;
  }
  .quality-grid,
  .stat-grid,
  .chart-grid,
  .report-grid,
  .optimization-grid,
  .bottom-report-grid {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 700px) {
  .evz-insights-page {
    padding: 14px;
  }
  .top-actions > * {
    width: 100%;
    justify-content: center;
  }
  .hero-card,
  .main-top,
  .bottom-head,
  .version-header,
  .report-hero {
    flex-direction: column;
    align-items: flex-start;
  }
  .version-row,
  .event-row {
    grid-template-columns: 1fr;
  }
  .preview-card.bottom-left {
    grid-template-columns: 1fr 1fr;
  }
}
`;
