import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

type LeftTab = "Files" | "Snippets" | "Templates" | "Modules";
type RightTab = "API Reference" | "Packages" | "Plugins" | "Webhooks";
type BottomTab = "Console" | "Runtime Events" | "Network Test" | "SDK Export";

const scriptFiles = [
  { name: "main.effect.ts", type: "Entry Script", status: "Active", size: "18.4 KB" },
  { name: "studioBridge.ts", type: "EVzone Bridge", status: "Synced", size: "12.1 KB" },
  { name: "faceTriggers.ts", type: "Tracking", status: "Ready", size: "9.7 KB" },
  { name: "vfxController.ts", type: "VFX", status: "Ready", size: "7.6 KB" },
  { name: "lowerThird.ts", type: "Overlay", status: "Warning", size: "6.9 KB" },
  { name: "types.d.ts", type: "Definitions", status: "Ready", size: "5.3 KB" },
];

const snippets = [
  "On Studio Scene Change",
  "Trigger VFX From Smile",
  "Send Bridge Event",
  "Read Runtime Variable",
  "Change Material Color",
  "Spawn Overlay Timer",
  "Listen To Audio Beat",
  "Safe Fallback Handler",
];

const templates = [
  { title: "Studio Control Script", caption: "Buttons, hotkeys, scene triggers, and operator actions." },
  { title: "Tracking Event Script", caption: "Face, hand, body, and segmentation callbacks." },
  { title: "Interactive Game Script", caption: "Score, timers, lives, randomizers, and win states." },
  { title: "Overlay Automation", caption: "Lower thirds, captions, countdowns, and show graphics." },
];

const modules = [
  { name: "@evzone/studio-bridge", version: "1.8.4", status: "Installed" },
  { name: "@evzone/effect-runtime", version: "2.2.0", status: "Installed" },
  { name: "@evzone/tracking-kit", version: "1.6.1", status: "Installed" },
  { name: "@evzone/vfx-tools", version: "1.1.9", status: "Update" },
  { name: "three", version: "0.166.x", status: "Approved" },
  { name: "mediapipe-tasks", version: "0.10.x", status: "Approved" },
];

const apiGroups = [
  { title: "Components API", methods: ["addComponent()", "getComponent()", "setProperty()", "bindToObject()"] },
  { title: "Tracking API", methods: ["onFaceExpression()", "onGesture()", "getLandmarks()", "getSegmentationMask()"] },
  { title: "Events API", methods: ["on()", "emit()", "once()", "removeListener()"] },
  { title: "Studio Bridge API", methods: ["sendStudioEvent()", "bindHotkey()", "setOverlayVisible()", "switchScene()"] },
];

const packages = [
  { name: "Studio Runtime Tools", category: "Core", health: 98, installed: true },
  { name: "Face AR Extensions", category: "Tracking", health: 94, installed: true },
  { name: "Broadcast Overlay Kit", category: "Graphics", health: 91, installed: true },
  { name: "Realtime Data Pack", category: "Data", health: 86, installed: false },
  { name: "Safe Motion Presets", category: "Accessibility", health: 96, installed: false },
];

const plugins = [
  { name: "AI Script Assistant", description: "Generate, explain, and refactor EVzone scripts.", enabled: true },
  { name: "Bridge Inspector", description: "Inspect live events moving between Effect Creator and Studio.", enabled: true },
  { name: "Asset Importer Pro", description: "Validate GLB, textures, audio, and overlay packages.", enabled: true },
  { name: "Performance Watchdog", description: "Auto-warns on runtime-heavy code paths.", enabled: false },
  { name: "Webhook Tester", description: "Test live data payloads from approved endpoints.", enabled: true },
];

const webhooks = [
  { name: "Live Poll Results", method: "POST", status: "Connected", latency: "42 ms" },
  { name: "Scoreboard Feed", method: "GET", status: "Ready", latency: "18 ms" },
  { name: "Event Countdown", method: "GET", status: "Ready", latency: "22 ms" },
  { name: "Lower Third Data", method: "POST", status: "Needs token", latency: "—" },
];

const codeLines = [
  `import { StudioBridge, EffectRuntime, Tracking } from "@evzone/effect-runtime";`,
  ``,
  `const bridge = new StudioBridge({ channel: "morning-show-intro" });`,
  `const runtime = new EffectRuntime({ liveSafe: true, fallback: "disable-vfx" });`,
  ``,
  `runtime.onReady(() => {`,
  `  bridge.bindHotkey("F5", () => runtime.emit("sparkle:burst"));`,
  `  bridge.bindStudioButton("Reveal Lower Third", () => showLowerThird());`,
  `});`,
  ``,
  `Tracking.onFaceExpression("smile", ({ confidence }) => {`,
  `  if (confidence > 0.74 && runtime.state.isLiveSegment) {`,
  `    runtime.vfx.spawn("gold-sparkle-burst", { intensity: 0.68 });`,
  `    showLowerThird();`,
  `    bridge.sendStudioEvent("host-smile-celebration", { confidence });`,
  `  }`,
  `});`,
  ``,
  `function showLowerThird() {`,
  `  runtime.objects.get("host-lower-third").visible = true;`,
  `  runtime.timeline.play("lower-third-intro");`,
  `}`,
  ``,
  `runtime.onError((error) => {`,
  `  bridge.log("Effect runtime warning", error.message);`,
  `  runtime.fallback.activate("safe-overlay-only");`,
  `});`,
];

export default function EVzoneCodeDeveloperLab() {
  const navigate = useNavigate();
  const [leftTab, setLeftTab] = useState<LeftTab>("Files");
  const [rightTab, setRightTab] = useState<RightTab>("API Reference");
  const [bottomTab, setBottomTab] = useState<BottomTab>("Console");
  const [activeFile, setActiveFile] = useState(scriptFiles[0]);
  const [selectedApi, setSelectedApi] = useState(apiGroups[3]);
  const [autocompleteOpen, setAutocompleteOpen] = useState(true);
  const [formatState, setFormatState] = useState("Formatted 2m ago");
  const [logs, setLogs] = useState<string[]>([
    "[12:44:08] Studio Bridge connected to EVzone Live Studio",
    "[12:44:10] main.effect.ts compiled in 84 ms",
    "[12:44:12] Warning: lowerThird.ts uses fallback font",
    "[12:44:14] Hotkey F5 bound to sparkle:burst",
    "[12:44:18] Runtime event: host-smile-celebration queued",
    "[12:44:20] SDK package export check passed",
  ]);

  const editorStats = useMemo(
    () => [
      { label: "TypeScript", value: "Strict", tone: "green" },
      { label: "Errors", value: "1", tone: "orange" },
      { label: "Warnings", value: "3", tone: "orange" },
      { label: "Runtime", value: "Live-safe", tone: "green" },
    ],
    []
  );

  const pushLog = (message: string) => {
    const time = new Date().toLocaleTimeString("en-US", { hour12: false });
    setLogs((prev) => [`[${time}] ${message}`, ...prev].slice(0, 120));
  };

  const clearLogs = () => setLogs([]);

  const downloadLogs = () => {
    const blob = new Blob([logs.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "evzone-developer-logs.txt";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    pushLog("Console logs exported to evzone-developer-logs.txt");
  };

  const runtimeEvents = [
    { event: "runtime.ready", source: "Effect Runtime", status: "Fired", time: "0 ms" },
    { event: "studio.hotkey.F5", source: "Studio Bridge", status: "Bound", time: "2 ms" },
    { event: "tracking.face.smile", source: "Tracking API", status: "Listening", time: "Live" },
    { event: "vfx.spawn", source: "VFX Controller", status: "Ready", time: "4 ms" },
    { event: "studio.event.sent", source: "Bridge API", status: "Queued", time: "12 ms" },
  ];

  const networkTests = [
    { name: "Bridge health", endpoint: "evzone://studio/health", status: "200 OK", latency: "8 ms" },
    { name: "Live poll", endpoint: "/data/live-poll", status: "200 OK", latency: "42 ms" },
    { name: "Scoreboard", endpoint: "/data/scoreboard", status: "200 OK", latency: "18 ms" },
    { name: "Lower third", endpoint: "/data/lower-third", status: "401 Token", latency: "—" },
  ];

  const exportChecks = [
    ["Bundle size", "3.8 MB", 86],
    ["Script validation", "Passed", 100],
    ["Bridge bindings", "Ready", 94],
    ["Runtime budget", "Healthy", 91],
    ["Fallback rules", "Configured", 98],
  ];

  const renderLeftPanel = () => {
    if (leftTab === "Files") {
      return (
        <div className="panel-scroll">
          {scriptFiles.map((file) => (
            <button
              key={file.name}
              className={`file-card ${activeFile.name === file.name ? "active" : ""} ${file.status === "Warning" ? "warning" : ""}`}
              onClick={() => setActiveFile(file)}
            >
              <span className="file-icon">TS</span>
              <span className="file-copy">
                <strong>{file.name}</strong>
                <small>{file.type} • {file.size}</small>
              </span>
              <em>{file.status}</em>
            </button>
          ))}
          <div className="button-row">
            <button className="ghost-btn full" data-evz-autowire="1">New Script</button>
            <button className="primary-btn full" data-evz-autowire="1">Import File</button>
          </div>
        </div>
      );
    }

    if (leftTab === "Snippets") {
      return (
        <div className="panel-scroll">
          {snippets.map((snippet) => (
            <button className="snippet-card" key={snippet} data-evz-autowire="1">
              <span>⌘</span>
              <strong>{snippet}</strong>
              <small>Insert reusable code block</small>
            </button>
          ))}
        </div>
      );
    }

    if (leftTab === "Templates") {
      return (
        <div className="panel-scroll">
          {templates.map((template) => (
            <button className="template-card" key={template.title} data-evz-autowire="1">
              <span className="template-art" />
              <strong>{template.title}</strong>
              <small>{template.caption}</small>
            </button>
          ))}
        </div>
      );
    }

    return (
      <div className="panel-scroll">
        {modules.map((module) => (
          <div className="module-card" key={module.name}>
            <div>
              <strong>{module.name}</strong>
              <small>{module.version}</small>
            </div>
            <span className={module.status === "Update" ? "status-pill orange" : "status-pill green"}>
              {module.status}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const renderRightPanel = () => {
    if (rightTab === "API Reference") {
      return (
        <div className="panel-scroll">
          <div className="api-tabs">
            {apiGroups.map((group) => (
              <button
                key={group.title}
                className={selectedApi.title === group.title ? "active" : ""}
                onClick={() => setSelectedApi(group)}
              >
                {group.title.replace(" API", "")}
              </button>
            ))}
          </div>
          <div className="api-card">
            <div className="section-title">
              <span>Local API reference</span>
              <h3>{selectedApi.title}</h3>
            </div>
            <p>
              Studio-native methods for building effects that respond to tracking, events, components, overlays, and EVzone Live Studio controls.
            </p>
            <div className="method-list">
              {selectedApi.methods.map((method) => (
                <button key={method} data-evz-autowire="1">{method}</button>
              ))}
            </div>
          </div>
          <div className="signature-card">
            <strong>Selected signature</strong>
            <code>bridge.sendStudioEvent(name: string, payload?: object): Promise&lt;Ack&gt;</code>
          </div>
        </div>
      );
    }

    if (rightTab === "Packages") {
      return (
        <div className="panel-scroll">
          {packages.map((pkg) => (
            <div className="package-card" key={pkg.name}>
              <div className="package-top">
                <div>
                  <strong>{pkg.name}</strong>
                  <small>{pkg.category}</small>
                </div>
                <span className={pkg.installed ? "status-pill green" : "status-pill gray"}>
                  {pkg.installed ? "Installed" : "Available"}
                </span>
              </div>
              <div className="meter-row">
                <span>Health</span>
                <strong>{pkg.health}%</strong>
              </div>
              <div className="range"><span style={{ width: `${pkg.health}%` }} /></div>
            </div>
          ))}
        </div>
      );
    }

    if (rightTab === "Plugins") {
      return (
        <div className="panel-scroll">
          {plugins.map((plugin) => (
            <div className="plugin-card" key={plugin.name}>
              <div>
                <strong>{plugin.name}</strong>
                <small>{plugin.description}</small>
              </div>
              <label className="switch">
                <input type="checkbox" defaultChecked={plugin.enabled} />
                <span />
              </label>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="panel-scroll">
        <div className="connector-card">
          <div className="section-title">
            <span>Webhook / data connector</span>
            <h3>Live Data Inputs</h3>
          </div>
          <p>Use approved endpoints for polls, scores, countdowns, event data, captions, and studio graphics.</p>
          <div className="input-grid">
            <input value="https://api.evzone.local/live/poll" readOnly />
            <button className="primary-btn" data-evz-autowire="1">Test</button>
          </div>
        </div>
        {webhooks.map((hook) => (
          <div className="webhook-row" key={hook.name}>
            <div>
              <strong>{hook.name}</strong>
              <small>{hook.method} • {hook.latency}</small>
            </div>
            <span className={hook.status.includes("Needs") ? "status-pill orange" : "status-pill green"}>
              {hook.status}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const renderBottomPanel = () => {
    if (bottomTab === "Runtime Events") {
      return (
        <div className="event-grid">
          {runtimeEvents.map((item) => (
            <div className="event-card" key={item.event}>
              <span className="event-dot" />
              <div>
                <strong>{item.event}</strong>
                <small>{item.source}</small>
              </div>
              <em>{item.status}</em>
              <b>{item.time}</b>
            </div>
          ))}
        </div>
      );
    }

    if (bottomTab === "Network Test") {
      return (
        <div className="network-grid">
          {networkTests.map((test) => (
            <div className="network-card" key={test.name}>
              <div>
                <strong>{test.name}</strong>
                <small>{test.endpoint}</small>
              </div>
              <span className={test.status.startsWith("200") ? "status-pill green" : "status-pill orange"}>
                {test.status}
              </span>
              <em>{test.latency}</em>
            </div>
          ))}
        </div>
      );
    }

    if (bottomTab === "SDK Export") {
      return (
        <div className="sdk-grid">
          <div className="sdk-hero">
            <div>
              <div className="eyebrow">SDK / package export</div>
              <h3>Export studio-ready effect package</h3>
              <p>Generate a signed EVzone package with scripts, assets, bindings, fallback rules, and runtime metadata.</p>
            </div>
            <button className="primary-btn" data-evz-autowire="1">Generate Package</button>
          </div>
          <div className="export-checks">
            {exportChecks.map(([label, value, score]) => (
              <div className="export-row" key={label}>
                <div>
                  <strong>{label}</strong>
                  <small>{value}</small>
                </div>
                <div className="range"><span style={{ width: `${score}%` }} /></div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="console-lines">
        {logs.map((line) => (
          <div className="console-line" key={line}>{line}</div>
        ))}
      </div>
    );
  };

  return (
    <div className="evz-dev-page">
      <style>{styles}</style>

      <header className="topbar">
        <div className="brand-area">
          <div className="brand-mark">EV</div>
          <div>
            <div className="eyebrow">EVzone Effect Creator</div>
            <h1>Code & Developer Lab</h1>
            <p>Advanced scripting, local APIs, module management, Studio Bridge development, live data connectors, diagnostics, and SDK export tools.</p>
          </div>
        </div>
        <div className="top-actions">
          <span className="studio-chip"><i />Connected to EVzone Studio</span>
          <button className="ghost-btn" onClick={() => { setFormatState("Formatted just now"); pushLog("Formatter completed successfully."); }}>Format</button>
          <button className="ghost-btn" onClick={() => pushLog("Runtime script execution started.")}>Run Script</button>
          <button className="primary-btn" onClick={() => { setBottomTab("SDK Export"); pushLog("SDK export workflow opened."); }}>Export SDK Package</button>
        </div>
      </header>

      <main className="dev-shell">
        <aside className="panel left-panel">
          <div className="panel-head">
            <div>
              <div className="eyebrow">Project code</div>
              <h2>Script Workspace</h2>
            </div>
          </div>

          <div className="tab-grid">
            {(["Files", "Snippets", "Templates", "Modules"] as LeftTab[]).map((tab) => (
              <button key={tab} className={`tab-btn ${leftTab === tab ? "active" : ""}`} onClick={() => setLeftTab(tab)}>
                {tab}
              </button>
            ))}
          </div>

          {renderLeftPanel()}
        </aside>

        <section className="panel editor-panel">
          <div className="editor-top">
            <div className="file-title">
              <span className="file-pill">TypeScript</span>
              <div>
                <strong>{activeFile.name}</strong>
                <small>{activeFile.type} • {formatState}</small>
              </div>
            </div>
            <div className="editor-stats">
              {editorStats.map((stat) => (
                <span key={stat.label} className={`stat-chip ${stat.tone}`}>
                  {stat.label}: <b>{stat.value}</b>
                </span>
              ))}
            </div>
          </div>

          <div className="code-editor">
            <div className="gutter">
              {codeLines.map((_, index) => <span key={index}>{index + 1}</span>)}
            </div>
            <pre className="code-body">
              {codeLines.map((line, index) => (
                <code key={index} className={index === 14 ? "error-line" : index === 22 ? "warning-line" : ""}>
                  {line || " "}
                </code>
              ))}
            </pre>

            {autocompleteOpen && (
              <div className="autocomplete">
                <div className="autocomplete-head">
                  <strong>Autocomplete</strong>
                  <button onClick={() => setAutocompleteOpen(false)}>×</button>
                </div>
                <button data-evz-autowire="1"><span>sendStudioEvent</span><small>Studio Bridge API</small></button>
                <button data-evz-autowire="1"><span>spawn</span><small>VFX Runtime</small></button>
                <button data-evz-autowire="1"><span>onFaceExpression</span><small>Tracking API</small></button>
                <button data-evz-autowire="1"><span>setOverlayVisible</span><small>Components API</small></button>
              </div>
            )}

            <div className="error-popover">
              <strong>Error highlight</strong>
              <span>Line 15: confidence payload should include sourceCamera for studio diagnostics.</span>
            </div>
          </div>

          <div className="editor-footer">
            <div className="status-message">
              <span className="green-dot" />
              Autocomplete, formatting, strict typing, error highlighting, and EVzone API validation are active.
            </div>
            <div className="button-row">
              <button className="ghost-btn small" onClick={() => pushLog("Snapshot created from current script state.")}>Create Snapshot</button>
              <button className="ghost-btn small" onClick={() => { setRightTab("Plugins"); pushLog("AI fix suggestions prepared in Plugins tab."); }}>Fix with AI</button>
              <button className="primary-btn small" onClick={() => pushLog(`${activeFile.name} compiled successfully.`)}>Compile</button>
            </div>
          </div>
        </section>

        <aside className="panel right-panel">
          <div className="right-tabs">
            {(["API Reference", "Packages", "Plugins", "Webhooks"] as RightTab[]).map((tab) => (
              <button key={tab} className={`tab-btn ${rightTab === tab ? "active" : ""}`} onClick={() => setRightTab(tab)}>
                {tab}
              </button>
            ))}
          </div>
          {renderRightPanel()}
        </aside>
      </main>

      <section className="panel bottom-panel">
        <div className="bottom-head">
          <div className="bottom-tabs">
            {(["Console", "Runtime Events", "Network Test", "SDK Export"] as BottomTab[]).map((tab) => (
              <button key={tab} className={`tab-btn ${bottomTab === tab ? "active" : ""}`} onClick={() => setBottomTab(tab)}>
                {tab}
              </button>
            ))}
          </div>
          <div className="bottom-actions">
            <button className="ghost-btn small" onClick={clearLogs}>Clear</button>
            <button className="ghost-btn small" onClick={downloadLogs}>Download Logs</button>
            <button className="primary-btn small" onClick={() => navigate("/recovery-diagnostics")}>Open Diagnostics</button>
          </div>
        </div>
        <div className="bottom-content">
          {renderBottomPanel()}
        </div>
      </section>
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
.evz-dev-page {
  min-height: 100vh;
  color: var(--evz-ink);
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  padding: 24px;
  background:
    radial-gradient(circle at 7% 7%, rgba(3,205,140,0.13), transparent 30%),
    radial-gradient(circle at 93% 10%, rgba(247,127,0,0.13), transparent 32%),
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
.file-title,
.editor-top,
.editor-stats,
.editor-footer,
.button-row,
.right-tabs,
.bottom-head,
.bottom-tabs,
.bottom-actions,
.event-card,
.network-card,
.sdk-hero,
.package-top,
.meter-row {
  display: flex;
  align-items: center;
}
.brand-area { gap: 16px; max-width: 930px; }
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
.file-card,
.snippet-card,
.template-card,
.library-btn,
.api-tabs button,
.method-list button,
.option-btn {
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
.file-card:hover,
.snippet-card:hover,
.template-card:hover,
.api-tabs button:hover,
.method-list button:hover {
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
.dev-shell {
  max-width: 100%;
  margin: 0;
  display: grid;
  grid-template-columns: 320px minmax(640px, 1fr) 390px;
  gap: 18px;
}
.panel {
  border-radius: var(--radius-xl);
  overflow: hidden;
}
.left-panel,
.right-panel,
.editor-panel {
  min-height: 780px;
}
.panel-head {
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
.tab-btn.active,
.api-tabs button.active {
  color: white;
  border-color: transparent;
  background: linear-gradient(135deg, var(--evz-green), #10b981);
  box-shadow: 0 14px 26px rgba(3,205,140,0.19);
}
.panel-scroll {
  padding: 16px 18px 18px;
  display: grid;
  gap: 12px;
}
.file-card {
  width: 100%;
  display: grid;
  grid-template-columns: 42px 1fr auto;
  gap: 10px;
  align-items: center;
  text-align: left;
}
.file-card.active {
  border-color: rgba(3,205,140,0.35);
  background: rgba(3,205,140,0.07);
}
.file-card.warning {
  border-color: rgba(247,127,0,0.28);
}
.file-icon {
  width: 40px;
  height: 40px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  color: var(--evz-green);
  background: rgba(3,205,140,0.10);
  font-size: 12px;
  font-weight: 900;
}
.file-copy {
  display: grid;
  gap: 4px;
}
small {
  color: var(--evz-muted);
  font-size: 12px;
  line-height: 1.45;
}
.file-card em {
  color: var(--evz-green);
  font-size: 11px;
  font-style: normal;
  font-weight: 900;
}
.file-card.warning em { color: var(--evz-orange); }
.button-row { gap: 8px; }
.snippet-card,
.template-card {
  width: 100%;
  text-align: left;
  display: grid;
  gap: 8px;
}
.snippet-card {
  grid-template-columns: 36px 1fr;
  align-items: center;
}
.snippet-card span {
  width: 36px;
  height: 36px;
  border-radius: 13px;
  display: grid;
  place-items: center;
  color: var(--evz-orange);
  background: rgba(247,127,0,0.10);
}
.template-art {
  height: 70px;
  border-radius: 16px;
  background:
    radial-gradient(circle at 25% 30%, rgba(3,205,140,0.34), transparent 28%),
    radial-gradient(circle at 72% 34%, rgba(247,127,0,0.28), transparent 30%),
    var(--evz-card);
}
.module-card,
.package-card,
.plugin-card,
.webhook-row,
.api-card,
.signature-card,
.connector-card,
.event-card,
.network-card,
.export-row,
.ai-card {
  border: 1px solid var(--evz-soft-line);
  border-radius: 18px;
  background: var(--evz-card-solid);
  padding: 14px;
}
.module-card,
.plugin-card,
.webhook-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.module-card div,
.package-top div,
.webhook-row div,
.network-card div,
.event-card div,
.export-row div {
  display: grid;
  gap: 4px;
}
.status-pill {
  border-radius: 999px;
  padding: 7px 10px;
  font-size: 11px;
  font-weight: 900;
}
.status-pill.green {
  color: var(--evz-green);
  background: rgba(3,205,140,0.10);
}
.status-pill.orange {
  color: var(--evz-orange);
  background: rgba(247,127,0,0.10);
}
.status-pill.gray {
  color: var(--evz-muted);
  background: rgba(148,163,184,0.12);
}
.editor-panel {
  display: flex;
  flex-direction: column;
}
.editor-top {
  justify-content: space-between;
  gap: 14px;
  padding: 15px 16px;
  border-bottom: 1px solid var(--evz-soft-line);
  background: var(--evz-card);
}
.file-title { gap: 12px; }
.file-title > div { display: grid; gap: 4px; }
.file-pill {
  border-radius: 999px;
  padding: 8px 10px;
  color: white;
  background: var(--evz-green);
  font-size: 11px;
  font-weight: 900;
}
.editor-stats { gap: 8px; flex-wrap: wrap; justify-content: flex-end; }
.stat-chip {
  border-radius: 999px;
  padding: 8px 10px;
  font-size: 12px;
  font-weight: 800;
  background: rgba(148,163,184,0.10);
  color: var(--evz-muted);
}
.stat-chip.green { color: var(--evz-green); background: rgba(3,205,140,0.10); }
.stat-chip.orange { color: var(--evz-orange); background: rgba(247,127,0,0.10); }
.code-editor {
  position: relative;
  flex: 1;
  min-height: 640px;
  display: grid;
  grid-template-columns: 58px 1fr;
  overflow: hidden;
  background:
    radial-gradient(circle at 22% 16%, rgba(3,205,140,0.10), transparent 28%),
    var(--evz-card);
}
.gutter {
  padding: 18px 0;
  display: grid;
  grid-auto-rows: 24px;
  justify-items: center;
  color: #94a3b8;
  background: rgba(15,23,42,0.04);
  border-right: 1px solid var(--evz-soft-line);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 12px;
}
.code-body {
  margin: 0;
  padding: 18px 22px 160px;
  overflow: auto;
  display: grid;
  grid-auto-rows: 24px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 13px;
  line-height: 24px;
  color: var(--evz-ink);
}
.code-body code {
  white-space: pre;
  border-radius: 8px;
  padding: 0 8px;
}
.code-body .error-line {
  background: rgba(247,127,0,0.14);
  box-shadow: inset 3px 0 0 var(--evz-orange);
}
.code-body .warning-line {
  background: rgba(3,205,140,0.10);
  box-shadow: inset 3px 0 0 var(--evz-green);
}
.autocomplete {
  position: absolute;
  right: 28px;
  top: 104px;
  width: 280px;
  border-radius: 20px;
  padding: 10px;
  background: var(--evz-card);
  border: 1px solid var(--evz-border);
  box-shadow: var(--shadow-lg);
  backdrop-filter: blur(16px);
  display: grid;
  gap: 7px;
}
.autocomplete-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 8px;
}
.autocomplete-head button {
  border: 0;
  background: rgba(148,163,184,0.14);
  border-radius: 999px;
  width: 25px;
  height: 25px;
  cursor: pointer;
}
.autocomplete > button {
  border: 1px solid var(--evz-soft-line);
  border-radius: 14px;
  background: var(--evz-card-solid);
  padding: 10px;
  display: grid;
  gap: 4px;
  text-align: left;
  cursor: pointer;
}
.autocomplete > button span {
  color: var(--evz-green);
  font-weight: 900;
}
.error-popover {
  position: absolute;
  left: 96px;
  bottom: 88px;
  max-width: 390px;
  border-radius: 18px;
  padding: 13px 15px;
  background: var(--evz-card);
  border: 1px solid rgba(247,127,0,0.22);
  box-shadow: var(--shadow-md);
  display: grid;
  gap: 5px;
}
.error-popover strong { color: var(--evz-orange); }
.error-popover span {
  color: var(--evz-muted);
  font-size: 13px;
  line-height: 1.45;
}
.editor-footer {
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px;
  border-top: 1px solid var(--evz-soft-line);
  background: var(--evz-card);
}
.status-message {
  display: flex;
  align-items: center;
  gap: 9px;
  color: var(--evz-muted);
  font-size: 13px;
}
.green-dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: var(--evz-green);
  box-shadow: 0 0 0 6px rgba(3,205,140,0.12);
}
.right-tabs {
  gap: 8px;
  flex-wrap: wrap;
  padding: 16px;
  border-bottom: 1px solid var(--evz-soft-line);
}
.api-tabs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}
.api-tabs button {
  font-size: 12px;
  padding: 9px;
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
.api-card p,
.connector-card p {
  color: var(--evz-muted);
  line-height: 1.55;
}
.method-list {
  display: grid;
  gap: 8px;
}
.method-list button {
  text-align: left;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  color: var(--evz-green);
}
.signature-card {
  display: grid;
  gap: 8px;
}
.signature-card code {
  display: block;
  color: var(--evz-muted);
  line-height: 1.5;
  word-break: break-word;
}
.package-card {
  display: grid;
  gap: 11px;
}
.package-top,
.meter-row {
  justify-content: space-between;
  gap: 10px;
}
.range {
  width: 100%;
  height: 8px;
  border-radius: 999px;
  background: rgba(148,163,184,0.17);
  overflow: hidden;
}
.range span {
  height: 100%;
  display: block;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--evz-green), var(--evz-orange));
}
.switch {
  position: relative;
  width: 44px;
  height: 25px;
  flex: 0 0 44px;
}
.switch input { display: none; }
.switch span {
  position: absolute;
  inset: 0;
  border-radius: 999px;
  background: rgba(148,163,184,0.25);
}
.switch span::after {
  content: "";
  position: absolute;
  width: 19px;
  height: 19px;
  left: 3px;
  top: 3px;
  border-radius: 999px;
  background: var(--evz-card-solid);
  box-shadow: 0 4px 10px rgba(15,23,42,0.14);
  transition: 180ms ease;
}
.switch input:checked + span {
  background: rgba(3,205,140,0.62);
}
.switch input:checked + span::after {
  transform: translateX(19px);
}
.input-grid {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 10px;
}
.input-grid input {
  border: 1px solid var(--evz-line);
  border-radius: 14px;
  padding: 11px 13px;
  color: var(--evz-muted);
  background: var(--evz-card-solid);
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
.console-lines {
  display: grid;
  gap: 8px;
}
.console-line {
  padding: 11px 13px;
  border-radius: 13px;
  background: var(--evz-card-solid);
  border: 1px solid var(--evz-soft-line);
  color: var(--evz-ink-2);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 13px;
}

[data-evz-theme='dark'] .evz-dev-page .console-line {
  color: var(--evz-ink);
  background: color-mix(in srgb, var(--evz-card-solid) 96%, transparent);
  border-color: var(--evz-border-strong);
}
.event-grid,
.network-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 12px;
}
.event-card {
  display: grid;
  grid-template-columns: 12px 1fr;
  gap: 10px;
  align-items: start;
}
.event-card em,
.event-card b,
.network-card em {
  font-style: normal;
  color: var(--evz-orange);
  font-weight: 900;
  font-size: 12px;
}
.event-dot {
  width: 10px;
  height: 10px;
  margin-top: 4px;
  border-radius: 999px;
  background: var(--evz-green);
  box-shadow: 0 0 0 6px rgba(3,205,140,0.12);
}
.network-card {
  display: grid;
  gap: 10px;
}
.sdk-grid {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 16px;
}
.sdk-hero {
  justify-content: space-between;
  gap: 20px;
  border-radius: 20px;
  padding: 18px;
  background:
    radial-gradient(circle at 16% 18%, rgba(3,205,140,0.20), transparent 34%),
    var(--evz-card);
  border: 1px solid rgba(3,205,140,0.16);
}
.sdk-hero h3 {
  margin: 4px 0 8px;
  font-size: 24px;
}
.sdk-hero p {
  color: var(--evz-muted);
  line-height: 1.55;
  margin: 0;
}
.export-checks {
  display: grid;
  gap: 10px;
}
.export-row {
  display: grid;
  grid-template-columns: 170px 1fr;
  gap: 12px;
  align-items: center;
}
@media (max-width: 1450px) {
  .dev-shell { grid-template-columns: 300px 1fr; }
  .right-panel { grid-column: span 2; min-height: auto; }
}
@media (max-width: 1000px) {
  .topbar { flex-direction: column; align-items: flex-start; }
  .dev-shell { grid-template-columns: 1fr; }
  .right-panel { grid-column: auto; }
  .event-grid,
  .network-grid,
  .sdk-grid { grid-template-columns: 1fr; }
  .autocomplete { display: none; }
}
@media (max-width: 680px) {
  .evz-dev-page { padding: 14px; }
  .top-actions > * { width: 100%; justify-content: center; }
  .editor-top,
  .editor-footer,
  .bottom-head,
  .sdk-hero { flex-direction: column; align-items: flex-start; }
  .code-editor { grid-template-columns: 42px 1fr; }
  .code-body { font-size: 12px; padding-left: 12px; }
  .error-popover { position: static; margin: 12px; grid-column: 1 / -1; }
  .api-tabs,
  .tab-grid { grid-template-columns: 1fr; }
}
`;
