import React, { useMemo, useState } from "react";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ScheduleRoundedIcon from "@mui/icons-material/ScheduleRounded";

type LeftTab = "Nodes" | "Variables" | "Subgraphs" | "Presets";
type RightTab = "Builder" | "Inspector" | "Debugger" | "AI Generator";
type BottomTab = "Timeline Events" | "State Machine" | "Active Path";

const nodeTypes = [
  { name: "Studio Control", category: "EVzone", count: 18 },
  { name: "Gesture", category: "Input", count: 12 },
  { name: "Face Expression", category: "Input", count: 14 },
  { name: "Audio Beat", category: "Audio", count: 9 },
  { name: "Timer", category: "Time", count: 11 },
  { name: "Randomizer", category: "Logic", count: 7 },
  { name: "Score / Count", category: "Game", count: 10 },
  { name: "Object Visibility", category: "Scene", count: 8 },
  { name: "Material Change", category: "Material", count: 13 },
  { name: "VFX Spawn", category: "VFX", count: 15 },
  { name: "Scene Switch", category: "Studio", count: 6 },
];

const graphNodes = [
  { id: "n1", title: "On Studio Scene Start", type: "Studio Control", x: 5, y: 14, tone: "green" },
  { id: "n2", title: "Face Smile Detected", type: "Face Expression", x: 28, y: 9, tone: "orange" },
  { id: "n3", title: "Timer 3.0s", type: "Timer", x: 28, y: 34, tone: "gray" },
  { id: "n4", title: "Randomize Intro Variant", type: "Randomizer", x: 50, y: 20, tone: "green" },
  { id: "n5", title: "Spawn Sparkle VFX", type: "VFX Spawn", x: 70, y: 10, tone: "orange" },
  { id: "n6", title: "Show Lower Third", type: "Object Visibility", x: 70, y: 38, tone: "green" },
  { id: "n7", title: "Send EVzone Event", type: "Studio Control", x: 46, y: 62, tone: "orange" },
  { id: "n8", title: "Score +1", type: "Score / Count", x: 70, y: 64, tone: "gray" },
];

const variables = [
  { name: "isLiveSegment", type: "Boolean", value: "true" },
  { name: "introVariant", type: "Number", value: "2" },
  { name: "hostSmileScore", type: "Float", value: "0.87" },
  { name: "currentScene", type: "String", value: "Morning Intro" },
  { name: "sparkleIntensity", type: "Vector", value: "0.62, 0.8" },
  { name: "lowerThirdVisible", type: "Boolean", value: "false" },
];

const subgraphs = [
  { title: "Countdown Reveal", nodes: 12, status: "Reusable" },
  { title: "Studio Scene Switcher", nodes: 9, status: "Live-ready" },
  { title: "Gesture Celebration", nodes: 16, status: "Reusable" },
  { title: "Face Expression Intro", nodes: 14, status: "Active" },
];

const presets = [
  "Reveal lower-third on smile",
  "Confetti when host waves",
  "Random guest spotlight",
  "Audio beat pulse overlay",
  "Countdown then scene switch",
  "Tap to toggle AR prop",
  "Scoreboard increment on gesture",
  "Material glow on music beat",
];

export default function EVzoneVisualLogicLab() {
  const [leftTab, setLeftTab] = useState<LeftTab>("Nodes");
  const [rightTab, setRightTab] = useState<RightTab>("Builder");
  const [bottomTab, setBottomTab] = useState<BottomTab>("Timeline Events");
  const [selectedNode, setSelectedNode] = useState(graphNodes[3]);
  const [activePath, setActivePath] = useState(true);
  const [search, setSearch] = useState("");
  const [aiPrompt, setAiPrompt] = useState("When the host smiles, trigger sparkle VFX, reveal the lower third, and send a studio event.");

  const filteredNodes = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return nodeTypes;
    return nodeTypes.filter((node) =>
      [node.name, node.category].some((item) => item.toLowerCase().includes(query))
    );
  }, [search]);

  const timelineEvents = [
    { label: "Scene Start", left: 4, width: 14, tone: "green" },
    { label: "Smile Gate", left: 23, width: 10, tone: "orange" },
    { label: "Sparkle Burst", left: 38, width: 16, tone: "green" },
    { label: "Lower Third", left: 57, width: 18, tone: "orange" },
    { label: "Studio Event", left: 80, width: 13, tone: "gray" },
  ];

  const stateSteps = ["Idle", "Listening", "Triggered", "Celebrating", "Studio Sent", "Reset"];

  return (
    <div className="evz-logic-page">
      <style>{styles}</style>

      <header className="topbar">
        <div className="brand-area">
          <div className="brand-mark">EV</div>
          <div>
            <div className="eyebrow">EVzone Effect Creator</div>
            <h1>Visual Logic Lab</h1>
            <p>No-code node graph, variables, subgraphs, AI generation, debugging, state machines, and EVzone Studio control nodes.</p>
          </div>
        </div>
        <div className="top-actions">
          <span className="studio-chip"><i />Connected to EVzone Studio</span>
          <button className="ghost-btn" data-evz-autowire="1">Save Subgraph</button>
          <button className="ghost-btn" data-evz-autowire="1">Preview Logic</button>
          <button className="primary-btn" data-evz-autowire="1">Apply to Editor</button>
        </div>
      </header>

      <main className="logic-shell">
        <aside className="panel left-rail">
          <div className="panel-head compact">
            <div>
              <div className="eyebrow">Library</div>
              <h2>Logic Assets</h2>
            </div>
          </div>

          <div className="tab-grid">
            {(["Nodes", "Variables", "Subgraphs", "Presets"] as LeftTab[]).map((tab) => (
              <button key={tab} className={`tab-btn ${leftTab === tab ? "active" : ""}`} onClick={() => setLeftTab(tab)}>
                {tab}
              </button>
            ))}
          </div>

          {leftTab === "Nodes" && (
            <div className="rail-content">
              <input className="search-input" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search nodes, inputs, actions..." />
              <div className="node-library">
                {filteredNodes.map((node) => (
                  <button className="library-node" key={node.name} data-evz-autowire="1">
                    <span className="node-icon">◆</span>
                    <span>
                      <strong>{node.name}</strong>
                      <small>{node.category} • {node.count} nodes</small>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {leftTab === "Variables" && (
            <div className="rail-content">
              <div className="variable-list">
                {variables.map((variable) => (
                  <div className="variable-card" key={variable.name}>
                    <div>
                      <strong>{variable.name}</strong>
                      <small>{variable.type}</small>
                    </div>
                    <span>{variable.value}</span>
                  </div>
                ))}
              </div>
              <button className="primary-btn full" data-evz-autowire="1">Create Variable</button>
            </div>
          )}

          {leftTab === "Subgraphs" && (
            <div className="rail-content">
              {subgraphs.map((subgraph) => (
                <button className="subgraph-card" key={subgraph.title} data-evz-autowire="1">
                  <span className="subgraph-art" />
                  <strong>{subgraph.title}</strong>
                  <small>{subgraph.nodes} nodes • {subgraph.status}</small>
                </button>
              ))}
            </div>
          )}

          {leftTab === "Presets" && (
            <div className="rail-content">
              {presets.map((preset) => (
                <button className="preset-card" key={preset} data-evz-autowire="1">
                  <span>✦</span>
                  <strong>{preset}</strong>
                </button>
              ))}
            </div>
          )}
        </aside>

        <section className="panel graph-panel">
          <div className="graph-toolbar">
            <div className="toolbar-left">
              <button className="ghost-btn small" data-evz-autowire="1">Select</button>
              <button className="ghost-btn small" data-evz-autowire="1">Pan</button>
              <button className="ghost-btn small" data-evz-autowire="1">Connect</button>
              <button className={`ghost-btn small ${activePath ? "is-on" : ""}`} onClick={() => setActivePath(!activePath)}>
                Active Path
              </button>
            </div>
            <div className="toolbar-status">
              <span>Graph: Morning Show Intro Logic</span>
              <strong>0 errors • 1 warning • Live-safe</strong>
            </div>
          </div>

          <div className="graph-canvas">
            <svg className="connections" viewBox="0 0 1000 620" preserveAspectRatio="none">
              <path className={activePath ? "active-line" : ""} d="M100 150 C220 90 260 100 350 140" />
              <path className={activePath ? "active-line" : ""} d="M380 150 C450 130 500 145 560 185" />
              <path className={activePath ? "active-line" : ""} d="M590 200 C680 160 720 140 795 140" />
              <path d="M120 165 C260 250 280 285 350 310" />
              <path d="M430 325 C520 305 530 270 565 230" />
              <path className={activePath ? "active-line orange" : ""} d="M590 230 C650 300 720 320 800 350" />
              <path d="M520 430 C585 440 670 475 785 490" />
            </svg>

            <div className="canvas-grid" />

            {graphNodes.map((node) => (
              <button
                key={node.id}
                className={`graph-node ${node.tone} ${selectedNode.id === node.id ? "selected" : ""}`}
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
                onClick={() => setSelectedNode(node)}
              >
                <span className="node-type">{node.type}</span>
                <strong>{node.title}</strong>
                <small>{node.id === "n4" ? "Active value: Variant 2" : "Ready"}</small>
                <i />
              </button>
            ))}

            <div className="minimap">
              <div className="minimap-title">Minimap</div>
              {graphNodes.map((node) => (
                <span key={node.id} style={{ left: `${node.x + 4}%`, top: `${node.y + 8}%` }} />
              ))}
              <div className="minimap-window" />
            </div>

            <div className="canvas-float top-left">
              <strong>Active Path Highlighting</strong>
              <span>Studio Scene Start → Smile → Randomizer → VFX + Lower Third</span>
            </div>

            <div className="canvas-float bottom-right">
              <strong>Runtime</strong>
              <span>59 FPS • 8 nodes running • 12 ms latency</span>
            </div>
          </div>
        </section>

        <aside className="panel right-rail">
          <div className="right-tabs">
            {(["Builder", "Inspector", "Debugger", "AI Generator"] as RightTab[]).map((tab) => (
              <button key={tab} className={`tab-btn ${rightTab === tab ? "active" : ""}`} onClick={() => setRightTab(tab)}>
                {tab}
              </button>
            ))}
          </div>

          {rightTab === "Builder" && (
            <div className="right-content">
              <SectionTitle eyebrow="No-code builder" title="Trigger → Condition → Action" />
              <BuilderBlock title="Trigger Builder" active="Face Smile Detected" options={["Studio scene start", "Gesture wave", "Face smile", "Audio beat", "Timer complete"]} />
              <BuilderBlock title="Condition Builder" active="isLiveSegment is true" options={["If/else branch", "Score greater than", "Random chance", "Timer window", "Object visible"]} />
              <BuilderBlock title="Action Builder" active="Spawn VFX + show lower third" options={["Show/hide object", "Change material", "Spawn VFX", "Switch scene", "Send studio event"]} />
            </div>
          )}

          {rightTab === "Inspector" && (
            <div className="right-content">
              <SectionTitle eyebrow="Value inspector" title={selectedNode.title} />
              <div className="inspector-grid">
                <InfoRow label="Node type" value={selectedNode.type} />
                <InfoRow label="Status" value="Active" />
                <InfoRow label="Last fired" value="2.8s ago" />
                <InfoRow label="Average latency" value="3.2 ms" />
                <InfoRow label="Output value" value={selectedNode.id === "n4" ? "Variant 2" : "True"} />
                <InfoRow label="Studio binding" value="Host Camera / Intro Scene" />
              </div>
              <button className="ghost-btn full" data-evz-autowire="1">Open Node Settings</button>
              <button className="primary-btn full" data-evz-autowire="1">Create Reusable Subgraph</button>
            </div>
          )}

          {rightTab === "Debugger" && (
            <div className="right-content">
              <SectionTitle eyebrow="Debugger" title="Live Execution Monitor" />
              <div className="debug-list">
                {[
                  ["On Studio Scene Start", "Fired", "0 ms"],
                  ["Face Smile Detected", "Fired", "2 ms"],
                  ["Timer 3.0s", "Waiting", "3,000 ms"],
                  ["Randomize Intro Variant", "Value: 2", "1 ms"],
                  ["Spawn Sparkle VFX", "Fired", "4 ms"],
                  ["Show Lower Third", "Fired", "5 ms"],
                  ["Send EVzone Event", "Queued", "12 ms"],
                ].map(([name, status, time]) => (
                  <div className="debug-row" key={name}>
                    <span className="debug-dot" />
                    <div>
                      <strong>{name}</strong>
                      <small>{status}</small>
                    </div>
                    <em>{time}</em>
                  </div>
                ))}
              </div>
            </div>
          )}

          {rightTab === "AI Generator" && (
            <div className="right-content">
              <SectionTitle eyebrow="AI node graph generator" title="Generate Logic From Prompt" />
              <textarea className="ai-prompt" value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} />
              <div className="ai-suggestions">
                <button data-evz-autowire="1">Generate node graph</button>
                <button data-evz-autowire="1">Improve current graph</button>
                <button data-evz-autowire="1">Explain logic</button>
                <button data-evz-autowire="1">Fix warning</button>
              </div>
              <div className="ai-result-card">
                <strong>Suggested graph</strong>
                <p>Creates a studio scene trigger, smile detector, randomizer, VFX spawn node, lower-third visibility node, and EVzone event node.</p>
              </div>
            </div>
          )}
        </aside>
      </main>

      <section className="bottom-panel panel">
        <div className="bottom-head">
          <div className="bottom-tabs">
            {(["Timeline Events", "State Machine", "Active Path"] as BottomTab[]).map((tab) => (
              <button key={tab} className={`tab-btn ${bottomTab === tab ? "active" : ""}`} onClick={() => setBottomTab(tab)}>
                {tab}
              </button>
            ))}
          </div>
          <div className="bottom-actions">
            <button className="ghost-btn small" data-evz-autowire="1">Add Event</button>
            <button className="ghost-btn small" data-evz-autowire="1">Export Subgraph</button>
            <button className="primary-btn small" data-evz-autowire="1">Save Logic Snapshot</button>
          </div>
        </div>

        {bottomTab === "Timeline Events" && (
          <div className="timeline-track">
            <div className="ruler">
              {Array.from({ length: 10 }).map((_, index) => <span key={index}>{index * 5}s</span>)}
            </div>
            <div className="event-lane">
              {timelineEvents.map((event) => (
                <div key={event.label} className={`timeline-event ${event.tone}`} style={{ left: `${event.left}%`, width: `${event.width}%` }}>
                  {event.label}
                </div>
              ))}
            </div>
          </div>
        )}

        {bottomTab === "State Machine" && (
          <div className="state-machine">
            {stateSteps.map((step, index) => (
              <React.Fragment key={step}>
                <div className={`state-card ${index === 2 || index === 3 ? "active" : ""}`}>
                  <strong>{step}</strong>
                  <span>{index === 2 ? "Current path" : "Transition ready"}</span>
                </div>
                {index < stateSteps.length - 1 && <div className="state-arrow">→</div>}
              </React.Fragment>
            ))}
          </div>
        )}

        {bottomTab === "Active Path" && (
          <div className="active-path-list">
            {["Studio scene start", "Face expression node", "Randomizer node", "VFX spawn node", "Object visibility node", "Studio event node"].map((item, index) => (
              <div key={item} className="path-step">
                <span aria-hidden="true">{index < 5 ? <CheckCircleRoundedIcon fontSize="small" /> : <ScheduleRoundedIcon fontSize="small" />}</span>
                <strong>{item}</strong>
                <small>{index < 5 ? "Passed" : "Queued"}</small>
              </div>
            ))}
          </div>
        )}
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

function BuilderBlock({ title, active, options }: { title: string; active: string; options: string[] }) {
  return (
    <div className="builder-block">
      <div className="builder-main">
        <strong>{title}</strong>
        <span>{active}</span>
      </div>
      <div className="option-chips">
        {options.map((option) => <button key={option} data-evz-autowire="1">{option}</button>)}
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="info-row">
      <span>{label}</span>
      <strong>{value}</strong>
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
  --radius-lg: 20px;
  --radius-md: 15px;
}
* { box-sizing: border-box; }
body { margin: 0; }
.evz-logic-page {
  min-height: 100vh;
  color: var(--evz-ink);
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  padding: 24px;
  background:
    radial-gradient(circle at 7% 8%, rgba(3,205,140,0.13), transparent 30%),
    radial-gradient(circle at 92% 12%, rgba(247,127,0,0.13), transparent 32%),
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
.engine-top,
.toolbar-left,
.toolbar-status,
.right-tabs,
.bottom-head,
.bottom-tabs,
.bottom-actions,
.event-lane,
.state-machine,
.active-path-list {
  display: flex;
  align-items: center;
}
.brand-area { gap: 16px; max-width: 900px; }
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
.brand-area p {
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
.tab-btn,
.search-input,
.library-node,
.preset-card,
.subgraph-card,
.graph-node,
.option-chips button,
.ai-suggestions button {
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
.tab-btn:hover,
.library-node:hover,
.preset-card:hover,
.subgraph-card:hover,
.graph-node:hover,
.option-chips button:hover,
.ai-suggestions button:hover {
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
.is-on {
  color: var(--evz-green);
  background: rgba(3,205,140,0.10);
  border-color: rgba(3,205,140,0.22);
}
.logic-shell {
  max-width: 100%;
  margin: 0;
  display: grid;
  grid-template-columns: 315px minmax(620px, 1fr) 395px;
  gap: 18px;
}
.panel {
  border-radius: var(--radius-xl);
  overflow: hidden;
}
.left-rail,
.right-rail {
  min-height: 780px;
}
.panel-head.compact {
  justify-content: space-between;
  padding: 18px 18px 10px;
}
.panel-head h2 {
  margin: 4px 0 0;
  letter-spacing: -0.03em;
}
.tab-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  padding: 10px 18px 14px;
  border-bottom: 1px solid var(--evz-soft-line);
}
.tab-btn.active {
  color: white;
  border-color: transparent;
  background: linear-gradient(135deg, var(--evz-green), #10b981);
  box-shadow: 0 14px 26px rgba(3,205,140,0.19);
}
.rail-content,
.right-content {
  padding: 16px 18px 18px;
  display: grid;
  gap: 14px;
}
.search-input {
  width: 100%;
  outline: none;
  color: var(--evz-muted);
}
.node-library,
.variable-list {
  display: grid;
  gap: 10px;
}
.library-node {
  width: 100%;
  display: grid;
  grid-template-columns: 38px 1fr;
  gap: 10px;
  text-align: left;
  align-items: center;
}
.node-icon {
  width: 36px;
  height: 36px;
  border-radius: 13px;
  display: grid;
  place-items: center;
  color: var(--evz-green);
  background: rgba(3,205,140,0.10);
}
.library-node span:last-child,
.variable-card div,
.debug-row div {
  display: grid;
  gap: 4px;
}
small {
  color: var(--evz-muted);
  font-size: 12px;
  line-height: 1.45;
}
.variable-card,
.subgraph-card,
.preset-card,
.builder-block,
.info-row,
.debug-row,
.ai-result-card {
  border: 1px solid var(--evz-soft-line);
  border-radius: 18px;
  background: var(--evz-card-solid);
  padding: 13px;
}
.variable-card,
.info-row,
.debug-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.variable-card span {
  color: var(--evz-green);
  font-weight: 900;
}
.subgraph-card,
.preset-card {
  width: 100%;
  text-align: left;
  display: grid;
  gap: 8px;
}
.subgraph-art {
  height: 62px;
  border-radius: 14px;
  background:
    radial-gradient(circle at 22% 28%, rgba(3,205,140,0.34), transparent 28%),
    radial-gradient(circle at 70% 30%, rgba(247,127,0,0.28), transparent 30%),
    var(--evz-card);
}
.preset-card {
  grid-template-columns: 34px 1fr;
  align-items: center;
}
.preset-card span {
  width: 34px;
  height: 34px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  color: var(--evz-orange);
  background: rgba(247,127,0,0.10);
}
.graph-panel {
  min-height: 780px;
  display: flex;
  flex-direction: column;
}
.graph-toolbar {
  padding: 14px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  border-bottom: 1px solid var(--evz-soft-line);
  background: var(--evz-card);
}
.toolbar-left { gap: 8px; flex-wrap: wrap; }
.toolbar-status {
  gap: 12px;
  flex-wrap: wrap;
  justify-content: flex-end;
  color: var(--evz-muted);
  font-size: 13px;
}
.toolbar-status strong { color: var(--evz-green); }
.graph-canvas {
  position: relative;
  flex: 1;
  min-height: 720px;
  overflow: hidden;
  background:
    radial-gradient(circle at 30% 15%, rgba(3,205,140,0.16), transparent 28%),
    radial-gradient(circle at 82% 16%, rgba(247,127,0,0.16), transparent 28%),
    var(--evz-card);
}
.canvas-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(148,163,184,0.14) 1px, transparent 1px),
    linear-gradient(90deg, rgba(148,163,184,0.14) 1px, transparent 1px);
  background-size: 34px 34px;
}
.connections {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  pointer-events: none;
}
.connections path {
  fill: none;
  stroke: rgba(100,116,139,0.42);
  stroke-width: 3;
  stroke-linecap: round;
  filter: drop-shadow(0 5px 8px rgba(15,23,42,0.08));
}
.connections path.active-line {
  stroke: var(--evz-green);
  stroke-width: 4;
  stroke-dasharray: 10 8;
  animation: dash 1.8s linear infinite;
}
.connections path.orange {
  stroke: var(--evz-orange);
}
@keyframes dash {
  to { stroke-dashoffset: -36; }
}
.graph-node {
  position: absolute;
  z-index: 4;
  width: 185px;
  min-height: 112px;
  text-align: left;
  display: grid;
  gap: 8px;
  box-shadow: 0 18px 36px rgba(15,23,42,0.10);
}
.graph-node.selected {
  outline: 4px solid rgba(3,205,140,0.18);
  border-color: rgba(3,205,140,0.55);
}
.graph-node.green { border-top: 5px solid var(--evz-green); }
.graph-node.orange { border-top: 5px solid var(--evz-orange); }
.graph-node.gray { border-top: 5px solid var(--evz-medium); }
.graph-node .node-type {
  width: fit-content;
  border-radius: 999px;
  padding: 6px 8px;
  color: var(--evz-muted);
  background: rgba(148,163,184,0.11);
  font-size: 11px;
  font-weight: 900;
}
.graph-node i {
  position: absolute;
  right: -8px;
  top: 50%;
  width: 16px;
  height: 16px;
  border-radius: 999px;
  background: var(--evz-green);
  box-shadow: 0 0 0 6px rgba(3,205,140,0.13);
}
.minimap {
  position: absolute;
  right: 18px;
  bottom: 18px;
  width: 190px;
  height: 132px;
  border-radius: 18px;
  background: var(--evz-card);
  border: 1px solid var(--evz-border);
  backdrop-filter: blur(14px);
  box-shadow: 0 18px 34px rgba(15,23,42,0.10);
  overflow: hidden;
  z-index: 5;
}
.minimap-title {
  position: absolute;
  left: 12px;
  top: 10px;
  color: var(--evz-muted);
  font-size: 11px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.12em;
}
.minimap span {
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: var(--evz-green);
}
.minimap-window {
  position: absolute;
  right: 20px;
  top: 38px;
  width: 90px;
  height: 55px;
  border: 2px solid var(--evz-orange);
  border-radius: 10px;
}
.canvas-float {
  position: absolute;
  z-index: 5;
  border-radius: 18px;
  padding: 13px 15px;
  background: var(--evz-card);
  border: 1px solid var(--evz-border);
  backdrop-filter: blur(14px);
  box-shadow: 0 12px 24px rgba(15,23,42,0.08);
  display: grid;
  gap: 4px;
}
.canvas-float span {
  color: var(--evz-muted);
  font-size: 12px;
}
.canvas-float.top-left { left: 18px; top: 18px; }
.canvas-float.bottom-right { right: 225px; bottom: 28px; }
.right-tabs {
  gap: 8px;
  flex-wrap: wrap;
  padding: 16px;
  border-bottom: 1px solid var(--evz-soft-line);
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
.builder-block {
  display: grid;
  gap: 12px;
}
.builder-main {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}
.builder-main span {
  color: var(--evz-green);
  font-weight: 900;
  text-align: right;
}
.option-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.option-chips button {
  padding: 8px 10px;
  font-size: 12px;
  color: var(--evz-muted);
}
.inspector-grid,
.debug-list,
.ai-suggestions {
  display: grid;
  gap: 10px;
}
.info-row span {
  color: var(--evz-muted);
}
.debug-row {
  display: grid;
  grid-template-columns: 12px 1fr auto;
}
.debug-dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: var(--evz-green);
  box-shadow: 0 0 0 6px rgba(3,205,140,0.12);
}
.debug-row em {
  color: var(--evz-orange);
  font-style: normal;
  font-weight: 900;
  font-size: 12px;
}
.ai-prompt {
  width: 100%;
  min-height: 140px;
  border: 1px solid var(--evz-line);
  border-radius: 18px;
  padding: 14px;
  outline: none;
  resize: vertical;
  color: var(--evz-ink);
  font: inherit;
  line-height: 1.55;
  background: var(--evz-card-solid);
}
.ai-suggestions {
  grid-template-columns: 1fr 1fr;
}
.ai-suggestions button {
  color: var(--evz-muted);
}
.ai-result-card p {
  color: var(--evz-muted);
  line-height: 1.55;
  margin: 8px 0 0;
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
.timeline-track {
  padding: 18px;
}
.ruler {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  color: var(--evz-muted);
  font-size: 12px;
  margin-bottom: 12px;
}
.event-lane {
  position: relative;
  height: 76px;
  border-radius: 20px;
  background: rgba(148,163,184,0.10);
  border: 1px solid var(--evz-soft-line);
}
.timeline-event {
  position: absolute;
  top: 18px;
  height: 40px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;
  font-weight: 900;
  box-shadow: 0 12px 24px rgba(15,23,42,0.10);
}
.timeline-event.green { background: linear-gradient(135deg, var(--evz-green), #10b981); }
.timeline-event.orange { background: linear-gradient(135deg, var(--evz-orange), #fb923c); }
.timeline-event.gray { background: linear-gradient(135deg, #64748b, #94a3b8); }
.state-machine,
.active-path-list {
  gap: 10px;
  padding: 18px;
  overflow-x: auto;
}
.state-card,
.path-step {
  min-width: 150px;
  border-radius: 18px;
  padding: 14px;
  background: var(--evz-card-solid);
  border: 1px solid var(--evz-soft-line);
  display: grid;
  gap: 6px;
}
.state-card.active,
.path-step {
  border-color: rgba(3,205,140,0.26);
  background: rgba(3,205,140,0.07);
}
.state-arrow {
  color: var(--evz-orange);
  font-weight: 900;
  font-size: 22px;
}
.path-step span {
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  color: white;
  border-radius: 12px;
  background: var(--evz-green);
  font-weight: 900;
}
.path-step span svg {
  font-size: 20px;
}
@media (max-width: 1400px) {
  .logic-shell { grid-template-columns: 300px 1fr; }
  .right-rail { grid-column: span 2; min-height: auto; }
}
@media (max-width: 980px) {
  .topbar { flex-direction: column; align-items: flex-start; }
  .logic-shell { grid-template-columns: 1fr; }
  .right-rail { grid-column: auto; }
  .graph-canvas { min-height: 680px; }
  .graph-node { width: 160px; }
  .canvas-float.bottom-right { display: none; }
}
@media (max-width: 700px) {
  .evz-logic-page { padding: 14px; }
  .top-actions > * { width: 100%; justify-content: center; }
  .graph-node { width: 145px; padding: 9px; }
  .minimap { display: none; }
  .bottom-head { align-items: flex-start; flex-direction: column; }
  .ai-suggestions { grid-template-columns: 1fr; }
}
`;
