import React, { useMemo, useState } from "react";

type BindingTab = "Bindings" | "Triggers" | "Control Surface" | "Runtime";
type BottomTab = "Asset Sync" | "Import History" | "Update Sync" | "Live-Safe Warnings";
type QualityMode = "Ultra" | "Balanced" | "Low-Latency" | "Fallback";
type Scene = "Morning Show" | "Interview Desk" | "Guest Split" | "Countdown Scene" | "Finale";
type Camera = "Host Camera" | "Guest Camera" | "Virtual Camera" | "Program Output";
type OverlayLayer = "Lower Third" | "Alert Layer" | "Scoreboard" | "Countdown" | "Transparent Overlay";

const scenes: Scene[] = ["Morning Show", "Interview Desk", "Guest Split", "Countdown Scene", "Finale"];
const cameras: Camera[] = ["Host Camera", "Guest Camera", "Virtual Camera", "Program Output"];
const overlayLayers: OverlayLayer[] = ["Lower Third", "Alert Layer", "Scoreboard", "Countdown", "Transparent Overlay"];

const triggerMappings = [
  { name: "Scene Change", source: "Morning Show → Interview Desk", action: "Play Hologram Intro", status: "Ready" },
  { name: "Timer Trigger", source: "00:30 Round Timer", action: "Reveal Countdown Overlay", status: "Ready" },
  { name: "Countdown Trigger", source: "3…2…1", action: "Spawn Confetti Burst", status: "Ready" },
  { name: "Audio Trigger", source: "Beat / Voice Peak", action: "Pulse Lower Third Glow", status: "Live" },
  { name: "Live Segment Trigger", source: "Segment: Game Active", action: "Enable Scoreboard Logic", status: "Ready" },
];

const hotkeys = [
  { key: "F5", action: "Trigger sparkle intro", scene: "Morning Show", status: "Bound" },
  { key: "F6", action: "Reset interactive round", scene: "Interview Desk", status: "Bound" },
  { key: "Shift + 1", action: "Toggle lower third", scene: "All Scenes", status: "Bound" },
  { key: "Shift + 2", action: "Emergency disable", scene: "All Scenes", status: "Protected" },
];

const studioButtons = [
  { label: "Start Effect", type: "Button", binding: "Control Surface A1", color: "green" },
  { label: "Show Overlay", type: "Toggle", binding: "Control Surface A2", color: "green" },
  { label: "VFX Intensity", type: "Slider", binding: "Control Surface S1", color: "orange" },
  { label: "Scene Variant", type: "Dropdown", binding: "Control Surface D1", color: "gray" },
  { label: "Accent Color", type: "Color Picker", binding: "Control Surface C1", color: "orange" },
];

const assetSyncRows = [
  { name: "hologram_intro.effect", type: "Effect Package", size: "3.8 MB", status: "Synced" },
  { name: "premium_lowerthird_pack.json", type: "Overlay Set", size: "780 KB", status: "Synced" },
  { name: "smile_confetti_graph.evzgraph", type: "Visual Logic", size: "340 KB", status: "Synced" },
  { name: "emerald_hologram_material.evzmat", type: "Material", size: "1.3 MB", status: "Pending" },
  { name: "soft_hit_stinger.wav", type: "Audio", size: "420 KB", status: "Needs review" },
];

const importHistory = [
  { time: "12:54:22", name: "Premium Host Intro Template", result: "Imported to Morning Show scene" },
  { time: "12:47:03", name: "Clean Broadcast Beauty Preset", result: "Bound to Host Camera" },
  { time: "12:39:18", name: "Lower Third Collection", result: "Synced to Overlay Layer" },
  { time: "12:28:44", name: "Gesture Trigger Pack", result: "Mapped to Control Surface A3" },
];

const liveSafeWarnings = [
  { title: "GPU cost watch", detail: "Hologram glow and background blur together may exceed low-power device budget.", severity: "Warning" },
  { title: "Emergency disable ready", detail: "Operator kill-switch is bound to Shift + 2 and Studio Button Hold.", severity: "Ready" },
  { title: "Overlay safe area", detail: "Lower-third remains inside EVzone Studio broadcast safe zones.", severity: "Ready" },
  { title: "Audio trigger fallback", detail: "If audio input is unavailable, trigger falls back to studio button.", severity: "Ready" },
];

const updateSyncRows = [
  { label: "Studio bridge schema", version: "v3.8", status: "Current" },
  { label: "Runtime limits", version: "Loaded from Studio", status: "Current" },
  { label: "Control surface layout", version: "Saved 2m ago", status: "Synced" },
  { label: "Scene bindings", version: "5 scenes", status: "Synced" },
  { label: "Effect package", version: "v12.4", status: "Ready to send" },
];

const operatorNotes = [
  { author: "Producer", note: "Use Start Effect after the host camera is live. Keep lower-third reveal under one second." },
  { author: "Technical Director", note: "Emergency disable is protected and available from hotkey and control surface hold." },
  { author: "Operator", note: "Guest Split scene should use Balanced mode to avoid extra glow on both feeds." },
];

export default function EVzoneStudioIntegrationCenter() {
  const [bindingTab, setBindingTab] = useState<BindingTab>("Bindings");
  const [bottomTab, setBottomTab] = useState<BottomTab>("Asset Sync");
  const [scene, setScene] = useState<Scene>("Morning Show");
  const [camera, setCamera] = useState<Camera>("Host Camera");
  const [overlayLayer, setOverlayLayer] = useState<OverlayLayer>("Lower Third");
  const [qualityMode, setQualityMode] = useState<QualityMode>("Balanced");
  const [emergencyDisabled, setEmergencyDisabled] = useState(false);
  const [accentColor, setAccentColor] = useState("#03cd8c");
  const [vfxIntensity, setVfxIntensity] = useState(68);
  const [fallbackEnabled, setFallbackEnabled] = useState(true);
  const [autoSync, setAutoSync] = useState(true);

  const readiness = useMemo(() => {
    let score = 94;
    if (qualityMode === "Ultra") score -= 5;
    if (emergencyDisabled) score -= 18;
    if (!fallbackEnabled) score -= 8;
    if (!autoSync) score -= 4;
    return Math.max(score, 40);
  }, [qualityMode, emergencyDisabled, fallbackEnabled, autoSync]);

  const bindingSummary = [
    { label: "Scene Binding", value: scene, tone: "green" },
    { label: "Camera Binding", value: camera, tone: "green" },
    { label: "Overlay Layer", value: overlayLayer, tone: "green" },
    { label: "Quality Mode", value: qualityMode, tone: qualityMode === "Ultra" ? "orange" : "green" },
  ];

  const renderMainPanel = () => {
    if (bindingTab === "Triggers") {
      return (
        <div className="panel-scroll">
          <SectionTitle eyebrow="Trigger mapping" title="Scene, Timer, Countdown, Audio & Live Segment Triggers" />
          <div className="mapping-list">
            {triggerMappings.map((trigger) => (
              <div className={`mapping-card ${trigger.status.toLowerCase()}`} key={trigger.name}>
                <span className="mapping-icon">↯</span>
                <div>
                  <strong>{trigger.name}</strong>
                  <small>{trigger.source}</small>
                </div>
                <em>{trigger.action}</em>
                <b>{trigger.status}</b>
              </div>
            ))}
          </div>
          <div className="dual-grid">
            <div className="sub-panel">
              <SectionTitle eyebrow="Hotkey mapping" title="Operator Hotkeys" />
              {hotkeys.map((hotkey) => (
                <div className="hotkey-row" key={hotkey.key}>
                  <kbd>{hotkey.key}</kbd>
                  <div>
                    <strong>{hotkey.action}</strong>
                    <small>{hotkey.scene}</small>
                  </div>
                  <span>{hotkey.status}</span>
                </div>
              ))}
            </div>
            <div className="sub-panel">
              <SectionTitle eyebrow="Studio button mapping" title="Control Surface Buttons" />
              {studioButtons.slice(0, 4).map((button) => (
                <div className="button-map-row" key={button.label}>
                  <span className={`surface-dot ${button.color}`} />
                  <div>
                    <strong>{button.label}</strong>
                    <small>{button.type} • {button.binding}</small>
                  </div>
                  <em>Mapped</em>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (bindingTab === "Control Surface") {
      return (
        <div className="panel-scroll">
          <SectionTitle eyebrow="Studio control surface builder" title="Buttons, Toggles, Sliders, Dropdowns & Color Pickers" />
          <div className="surface-preview">
            <div className="surface-top">
              <strong>EVzone Operator Surface</strong>
              <span>{scene} • {camera}</span>
            </div>
            <div className="surface-grid">
              <button className="surface-button primary" data-evz-autowire="1">Start Effect</button>
              <button className={`surface-button ${emergencyDisabled ? "danger" : "safe"}`} onClick={() => setEmergencyDisabled(!emergencyDisabled)}>
                {emergencyDisabled ? "Disabled" : "Emergency Ready"}
              </button>
              <label className="surface-toggle">
                <span>Show Overlay</span>
                <input type="checkbox" defaultChecked />
              </label>
              <label className="surface-slider">
                <span>VFX Intensity {vfxIntensity}%</span>
                <input type="range" min="0" max="100" value={vfxIntensity} onChange={(event) => setVfxIntensity(Number(event.target.value))} />
              </label>
              <label className="surface-dropdown">
                <span>Scene Variant</span>
                <select>
                  <option>Emerald Intro</option>
                  <option>Clean Broadcast</option>
                  <option>Game Mode</option>
                </select>
              </label>
              <label className="surface-color">
                <span>Accent Color</span>
                <input type="color" value={accentColor} onChange={(event) => setAccentColor(event.target.value)} />
              </label>
            </div>
          </div>
          <div className="control-builder-list">
            {studioButtons.map((button) => (
              <div className="control-builder-card" key={button.label}>
                <span className={`control-kind ${button.color}`}>{button.type.slice(0, 2).toUpperCase()}</span>
                <div>
                  <strong>{button.label}</strong>
                  <small>{button.binding}</small>
                </div>
                <button data-evz-autowire="1">Edit</button>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (bindingTab === "Runtime") {
      return (
        <div className="panel-scroll">
          <SectionTitle eyebrow="Runtime settings" title="Quality, Fallback & Emergency Behavior" />
          <div className="runtime-grid">
            {(["Ultra", "Balanced", "Low-Latency", "Fallback"] as QualityMode[]).map((mode) => (
              <button key={mode} className={qualityMode === mode ? "active" : ""} onClick={() => setQualityMode(mode)}>
                <span>{mode}</span>
                <small>
                  {mode === "Ultra" && "Maximum polish"}
                  {mode === "Balanced" && "Recommended live mode"}
                  {mode === "Low-Latency" && "Fastest response"}
                  {mode === "Fallback" && "Low-cost safe mode"}
                </small>
              </button>
            ))}
          </div>

          <div className="runtime-switches">
            <ToggleRow title="Fallback behavior" detail="Auto-disable heavy VFX while preserving controls and overlays." checked={fallbackEnabled} onChange={setFallbackEnabled} />
            <ToggleRow title="Auto update sync" detail="Keep scene bindings and runtime limits synced with EVzone Studio." checked={autoSync} onChange={setAutoSync} />
            <ToggleRow title="Emergency disable armed" detail="Operator can disable all live effects instantly." checked={!emergencyDisabled} onChange={(checked) => setEmergencyDisabled(!checked)} />
          </div>

          <div className={`emergency-card ${emergencyDisabled ? "disabled" : "armed"}`}>
            <div>
              <strong>{emergencyDisabled ? "Emergency disable is active" : "Emergency disable is armed"}</strong>
              <span>{emergencyDisabled ? "All live effect output is blocked until re-enabled." : "Protected kill-switch is ready from hotkey and control surface."}</span>
            </div>
            <button onClick={() => setEmergencyDisabled(!emergencyDisabled)}>
              {emergencyDisabled ? "Re-enable effects" : "Disable now"}
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="panel-scroll">
        <SectionTitle eyebrow="Studio binding" title="Scene, Camera & Overlay Routing" />
        <div className="binding-grid">
          <BindingSelect title="Scene binding" value={scene} options={scenes} onChange={(value) => setScene(value as Scene)} />
          <BindingSelect title="Camera binding" value={camera} options={cameras} onChange={(value) => setCamera(value as Camera)} />
          <BindingSelect title="Overlay layer binding" value={overlayLayer} options={overlayLayers} onChange={(value) => setOverlayLayer(value as OverlayLayer)} />
        </div>

        <div className="route-map">
          <div className="route-node source">
            <span>Effect Creator</span>
            <strong>Emerald Hologram Intro</strong>
          </div>
          <div className="route-line" />
          <div className="route-node middle">
            <span>EVzone Bridge</span>
            <strong>Connected</strong>
          </div>
          <div className="route-line" />
          <div className="route-node output">
            <span>{scene}</span>
            <strong>{camera}</strong>
            <small>{overlayLayer}</small>
          </div>
        </div>

        <div className="binding-summary-grid">
          {bindingSummary.map((item) => (
            <div className={`summary-card ${item.tone}`} key={item.label}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderBottomPanel = () => {
    if (bottomTab === "Import History") {
      return (
        <div className="history-grid">
          {importHistory.map((item) => (
            <div className="history-card" key={`${item.time}-${item.name}`}>
              <span>{item.time}</span>
              <strong>{item.name}</strong>
              <small>{item.result}</small>
            </div>
          ))}
        </div>
      );
    }

    if (bottomTab === "Update Sync") {
      return (
        <div className="sync-grid">
          {updateSyncRows.map((item) => (
            <div className="sync-card" key={item.label}>
              <div>
                <strong>{item.label}</strong>
                <small>{item.version}</small>
              </div>
              <em>{item.status}</em>
            </div>
          ))}
        </div>
      );
    }

    if (bottomTab === "Live-Safe Warnings") {
      return (
        <div className="warning-grid">
          {liveSafeWarnings.map((warning) => (
            <div className={`warning-row ${warning.severity.toLowerCase()}`} key={warning.title}>
              <span className="warning-dot" />
              <div>
                <strong>{warning.title}</strong>
                <small>{warning.detail}</small>
              </div>
              <em>{warning.severity}</em>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="asset-grid">
        {assetSyncRows.map((asset) => (
          <div className={`asset-card ${asset.status.toLowerCase().replace(" ", "-")}`} key={asset.name}>
            <span className="asset-icon">EV</span>
            <div>
              <strong>{asset.name}</strong>
              <small>{asset.type} • {asset.size}</small>
            </div>
            <em>{asset.status}</em>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="evz-integration-page">
      <style>{styles}</style>

      <header className="topbar">
        <div className="brand-area">
          <div className="brand-mark">EV</div>
          <div>
            <div className="eyebrow">EVzone Effect Creator</div>
            <h1>Studio Integration Center</h1>
            <p>Connect effects to EVzone Live Studio with scene, camera, overlay, trigger, runtime, sync, control-surface, and safety bindings.</p>
          </div>
        </div>
        <div className="top-actions">
          <span className="studio-chip"><i />Connected to EVzone Live Studio</span>
          <button className="ghost-btn" data-evz-autowire="1">Reconnect Bridge</button>
          <button className="ghost-btn" data-evz-autowire="1">Preview in Studio</button>
          <button className="primary-btn" data-evz-autowire="1">Send Update to Studio</button>
        </div>
      </header>

      <section className="status-hero">
        <div className="status-card main">
          <div className="connection-orb">
            <span>{readiness}</span>
            <small>Readiness</small>
          </div>
          <div>
            <div className="eyebrow">Connected studio status</div>
            <h2>{emergencyDisabled ? "Effects disabled by operator" : "Bridge connected and live-ready"}</h2>
            <p>
              Active session: EVzone Live Studio A • Scene: {scene} • Camera: {camera} • Overlay: {overlayLayer}
            </p>
          </div>
        </div>
        <div className="status-card mini">
          <span>Bridge</span>
          <strong className="green">Online</strong>
          <small>Latency 8 ms</small>
        </div>
        <div className="status-card mini">
          <span>Update Sync</span>
          <strong className={autoSync ? "green" : "orange"}>{autoSync ? "Auto" : "Manual"}</strong>
          <small>Last sync 2m ago</small>
        </div>
        <div className="status-card mini">
          <span>Fallback</span>
          <strong className={fallbackEnabled ? "green" : "orange"}>{fallbackEnabled ? "Ready" : "Off"}</strong>
          <small>Low-cost mode available</small>
        </div>
      </section>

      <main className="integration-shell">
        <aside className="panel left-panel">
          <div className="panel-head">
            <div>
              <div className="eyebrow">Integration</div>
              <h2>Routing Tools</h2>
            </div>
          </div>
          <div className="mode-tabs">
            {(["Bindings", "Triggers", "Control Surface", "Runtime"] as BindingTab[]).map((tab) => (
              <button key={tab} className={bindingTab === tab ? "active" : ""} onClick={() => setBindingTab(tab)}>
                {tab}
              </button>
            ))}
          </div>

          <div className="connection-card">
            <div className="connection-head">
              <span className="live-dot" />
              <div>
                <strong>EVzone Studio Bridge</strong>
                <small>Connected to production session</small>
              </div>
            </div>
            <div className="connection-grid">
              <div><span>Studio version</span><strong>v4.8.2</strong></div>
              <div><span>Runtime limits</span><strong>Loaded</strong></div>
              <div><span>Heartbeat</span><strong>8 ms</strong></div>
              <div><span>Session</span><strong>LIVE-A</strong></div>
            </div>
          </div>

          <div className="quick-actions">
            <button data-evz-autowire="1">Reload scenes</button>
            <button data-evz-autowire="1">Sync assets</button>
            <button data-evz-autowire="1">Test triggers</button>
            <button data-evz-autowire="1">Run warnings</button>
          </div>
        </aside>

        <section className="panel center-panel">
          <div className="center-top">
            <div>
              <div className="eyebrow">Studio live preview</div>
              <h2>{scene} / {camera}</h2>
              <p>Live studio preview with active scene binding, overlay routing, trigger mapping, runtime quality mode, and operator controls.</p>
            </div>
            <div className="center-actions">
              <button className={emergencyDisabled ? "danger" : ""} onClick={() => setEmergencyDisabled(!emergencyDisabled)}>
                {emergencyDisabled ? "Emergency Disabled" : "Emergency Ready"}
              </button>
              <button data-evz-autowire="1">Run Test Event</button>
            </div>
          </div>

          <div className={`studio-preview ${emergencyDisabled ? "disabled" : ""}`}>
            <div className="stage-grid" />
            <div className="program-frame">
              <div className="program-label">Program Output</div>
              <div className="camera-feed">
                <div className="host-avatar">
                  <span className="head" />
                  <span className="body" />
                  <span className="glow" />
                </div>
                <div className="camera-tag">{camera}</div>
              </div>
              <div className="overlay-layer">
                <strong>EVzone Live</strong>
                <span>{overlayLayer} bound to {scene}</span>
              </div>
              <div className="alert-layer">Scene trigger ready</div>
              <div className="countdown-chip">00:30</div>
              <div className="particle-field">
                {Array.from({ length: 24 }).map((_, index) => (
                  <span
                    key={index}
                    className={`particle p${index % 5}`}
                    style={{
                      left: `${8 + ((index * 23) % 84)}%`,
                      top: `${10 + ((index * 29) % 76)}%`,
                      animationDelay: `${index * 0.12}s`,
                    }}
                  />
                ))}
              </div>
              {emergencyDisabled ? <div className="disable-mask">Emergency Disable Active</div> : null}
            </div>

            <div className="preview-card top-left">
              <strong>Live Studio Preview</strong>
              <span>{qualityMode} mode • Runtime limits loaded</span>
            </div>
            <div className="preview-card bottom-left">
              {bindingSummary.map((item) => (
                <div key={item.label}>
                  <span>{item.label}</span>
                  <strong className={item.tone}>{item.value}</strong>
                </div>
              ))}
            </div>
          </div>

          <div className="main-workspace">
            <div className="workspace-tabs">
              {(["Bindings", "Triggers", "Control Surface", "Runtime"] as BindingTab[]).map((tab) => (
                <button key={tab} className={bindingTab === tab ? "active" : ""} onClick={() => setBindingTab(tab)}>
                  {tab}
                </button>
              ))}
            </div>
            {renderMainPanel()}
          </div>
        </section>

        <aside className="panel right-panel">
          <div className="panel-head">
            <div>
              <div className="eyebrow">Operator</div>
              <h2>Live Controls</h2>
            </div>
          </div>

          <div className="operator-controls">
            <button className="operator-primary" data-evz-autowire="1">Start Effect</button>
            <button data-evz-autowire="1">Reveal Overlay</button>
            <button data-evz-autowire="1">Trigger Countdown</button>
            <button data-evz-autowire="1">Run Audio Pulse</button>
            <button className={emergencyDisabled ? "danger" : "warning"} onClick={() => setEmergencyDisabled(!emergencyDisabled)}>
              {emergencyDisabled ? "Re-enable Effects" : "Emergency Disable"}
            </button>
          </div>

          <div className="operator-panel">
            <SectionTitle eyebrow="Runtime settings" title="Studio Runtime" />
            <div className="runtime-row">
              <span>Quality mode</span>
              <select value={qualityMode} onChange={(event) => setQualityMode(event.target.value as QualityMode)}>
                <option>Ultra</option>
                <option>Balanced</option>
                <option>Low-Latency</option>
                <option>Fallback</option>
              </select>
            </div>
            <div className="runtime-row">
              <span>VFX intensity</span>
              <input type="range" min="0" max="100" value={vfxIntensity} onChange={(event) => setVfxIntensity(Number(event.target.value))} />
            </div>
            <div className="runtime-row">
              <span>Accent color</span>
              <input type="color" value={accentColor} onChange={(event) => setAccentColor(event.target.value)} />
            </div>
          </div>

          <div className="notes-panel">
            <SectionTitle eyebrow="Operator notes" title="Live Production Notes" />
            {operatorNotes.map((note) => (
              <div className="note-card" key={note.author}>
                <strong>{note.author}</strong>
                <span>{note.note}</span>
              </div>
            ))}
            <textarea placeholder="Add operator note for this studio session..." />
            <button className="primary-btn full" data-evz-autowire="1">Save Note</button>
          </div>
        </aside>
      </main>

      <section className="panel bottom-panel">
        <div className="bottom-head">
          <div className="bottom-tabs">
            {(["Asset Sync", "Import History", "Update Sync", "Live-Safe Warnings"] as BottomTab[]).map((tab) => (
              <button key={tab} className={bottomTab === tab ? "active" : ""} onClick={() => setBottomTab(tab)}>
                {tab}
              </button>
            ))}
          </div>
          <div className="bottom-actions">
            <button className="ghost-btn small" data-evz-autowire="1">Export Integration Report</button>
            <button className="ghost-btn small" data-evz-autowire="1">Save Control Surface</button>
            <button className="primary-btn small" data-evz-autowire="1">Sync to Studio</button>
          </div>
        </div>
        <div className="bottom-content">
          {renderBottomPanel()}
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

function BindingSelect({
  title,
  value,
  options,
  onChange,
}: {
  title: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="binding-select">
      <span>{title}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
    </label>
  );
}

function ToggleRow({
  title,
  detail,
  checked,
  onChange,
}: {
  title: string;
  detail: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="toggle-row">
      <div>
        <strong>{title}</strong>
        <small>{detail}</small>
      </div>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      <span className="toggle-visual" />
    </label>
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
.evz-integration-page {
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
.status-hero {
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
.status-hero,
.status-card,
.connection-head,
.center-top,
.center-actions,
.preview-card,
.workspace-tabs,
.mode-tabs,
.bottom-head,
.bottom-tabs,
.bottom-actions,
.stack-head,
.mapping-card,
.runtime-row,
.drawer-actions,
.surface-top,
.asset-card,
.sync-card,
.warning-row {
  display: flex;
  align-items: center;
}
.brand-area { gap: 16px; max-width: 1000px; }
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
.status-card p,
.center-top p,
.note-card span,
.warning-card span,
.emergency-card span {
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
.studio-chip i,
.live-dot,
.warning-dot {
  width: 9px;
  height: 9px;
  border-radius: 999px;
  background: var(--evz-green);
  box-shadow: 0 0 0 6px rgba(3,205,140,0.13);
}
.ghost-btn,
.primary-btn,
.mode-tabs button,
.workspace-tabs button,
.center-actions button,
.operator-controls button,
.quick-actions button,
.binding-select select,
.runtime-row select,
.runtime-grid button,
.surface-button,
.surface-grid select,
.control-builder-card button,
.bottom-tabs button,
.mapping-card,
.hotkey-row,
.button-map-row,
.asset-card,
.sync-card,
.warning-row {
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
.mode-tabs button:hover,
.workspace-tabs button:hover,
.center-actions button:hover,
.operator-controls button:hover,
.quick-actions button:hover,
.runtime-grid button:hover,
.surface-button:hover,
.control-builder-card button:hover,
.bottom-tabs button:hover,
.mapping-card:hover,
.asset-card:hover,
.sync-card:hover {
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
.green { color: var(--evz-green); }
.orange { color: var(--evz-orange); }
.status-hero {
  max-width: 100%;
  margin: 0 0 18px;
  border-radius: var(--radius-xl);
  padding: 18px;
  display: grid;
  grid-template-columns: 1.5fr repeat(3, minmax(160px, .35fr));
  gap: 12px;
}
.status-card {
  gap: 14px;
  border: 1px solid var(--evz-soft-line);
  background: var(--evz-card-solid);
  border-radius: 22px;
  padding: 16px;
}
.status-card.main h2 {
  margin: 4px 0 8px;
  letter-spacing: -0.035em;
}
.status-card.mini {
  display: grid;
  gap: 6px;
  align-content: center;
}
.status-card.mini span {
  color: var(--evz-muted);
  font-size: 12px;
  font-weight: 800;
}
.status-card.mini strong {
  font-size: 24px;
}
.connection-orb {
  width: 104px;
  height: 104px;
  flex: 0 0 104px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  border: 10px solid rgba(3,205,140,0.16);
  background: var(--evz-card-solid);
}
.connection-orb span {
  color: var(--evz-green);
  font-size: 32px;
  font-weight: 900;
  line-height: 1;
}
.connection-orb small {
  margin-top: -20px;
  color: var(--evz-muted);
}
.integration-shell {
  max-width: 100%;
  margin: 0;
  display: grid;
  grid-template-columns: 310px minmax(700px, 1fr) 390px;
  gap: 18px;
}
.panel {
  border-radius: var(--radius-xl);
  overflow: hidden;
}
.left-panel,
.center-panel,
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
.mode-tabs,
.workspace-tabs,
.right-tabs,
.bottom-tabs {
  gap: 8px;
  flex-wrap: wrap;
  padding: 14px 16px;
  border-bottom: 1px solid var(--evz-soft-line);
}
.mode-tabs button,
.workspace-tabs button,
.bottom-tabs button {
  padding: 9px 11px;
  font-size: 12px;
}
.mode-tabs button.active,
.workspace-tabs button.active,
.bottom-tabs button.active,
.runtime-grid button.active {
  color: white;
  border-color: transparent;
  background: linear-gradient(135deg, var(--evz-green), #10b981);
  box-shadow: 0 14px 26px rgba(3,205,140,0.19);
}
.connection-card,
.operator-panel,
.notes-panel {
  margin: 16px 18px;
  border: 1px solid var(--evz-soft-line);
  border-radius: 22px;
  background: var(--evz-card-solid);
  padding: 14px;
  display: grid;
  gap: 12px;
}
.connection-head {
  gap: 12px;
}
.connection-head div {
  display: grid;
  gap: 4px;
}
small {
  color: var(--evz-muted);
  font-size: 12px;
  line-height: 1.45;
}
.connection-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
.connection-grid div {
  border-radius: 14px;
  padding: 10px;
  background: rgba(148,163,184,0.08);
  display: grid;
  gap: 4px;
}
.connection-grid span {
  color: var(--evz-muted);
  font-size: 11px;
}
.connection-grid strong {
  color: var(--evz-green);
}
.quick-actions {
  margin: 0 18px 18px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}
.quick-actions button {
  padding: 10px;
  color: var(--evz-muted);
}
.center-panel {
  display: grid;
  grid-template-rows: auto 520px auto;
}
.center-top {
  justify-content: space-between;
  gap: 18px;
  padding: 18px;
  border-bottom: 1px solid var(--evz-soft-line);
  background: var(--evz-card);
}
.center-top h2 {
  margin: 4px 0 6px;
  letter-spacing: -0.035em;
}
.center-actions {
  gap: 8px;
  flex-wrap: wrap;
  justify-content: flex-end;
}
.center-actions .danger,
.operator-controls .danger,
.surface-button.danger {
  color: white;
  border-color: transparent;
  background: linear-gradient(135deg, #ef4444, var(--evz-orange));
}
.studio-preview {
  position: relative;
  margin: 16px;
  border-radius: 28px;
  overflow: hidden;
  border: 1px solid rgba(3,205,140,0.16);
  background:
    radial-gradient(circle at 28% 18%, rgba(3,205,140,0.20), transparent 30%),
    radial-gradient(circle at 78% 20%, rgba(247,127,0,0.18), transparent 30%),
    var(--evz-card);
}
.stage-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(148,163,184,0.13) 1px, transparent 1px),
    linear-gradient(90deg, rgba(148,163,184,0.13) 1px, transparent 1px);
  background-size: 34px 34px;
}
.program-frame {
  position: absolute;
  inset: 72px 70px 84px;
  border-radius: 30px;
  overflow: hidden;
  border: 1px solid var(--evz-border);
  background:
    radial-gradient(circle at 50% 24%, rgba(3,205,140,0.14), transparent 30%),
    linear-gradient(180deg, var(--evz-frost-strong), var(--evz-frost-soft));
  box-shadow: inset 0 0 60px var(--evz-frost-soft), 0 30px 70px rgba(15,23,42,0.12);
}
.program-label,
.camera-tag,
.alert-layer,
.countdown-chip {
  position: absolute;
  z-index: 6;
  border-radius: 999px;
  padding: 8px 11px;
  background: var(--evz-card);
  font-size: 12px;
  font-weight: 900;
}
.program-label {
  left: 18px;
  top: 18px;
  color: var(--evz-green);
}
.camera-feed {
  position: absolute;
  inset: 38px 46px 84px;
  border-radius: 24px;
  background: var(--evz-card);
  display: grid;
  place-items: center;
}
.host-avatar {
  position: relative;
  width: 160px;
  height: 230px;
}
.host-avatar .head {
  position: absolute;
  left: 50%;
  top: 10px;
  width: 88px;
  height: 88px;
  transform: translateX(-50%);
  border-radius: 999px;
  background: linear-gradient(135deg, rgba(247,127,0,0.24), rgba(3,205,140,0.22));
}
.host-avatar .body {
  position: absolute;
  left: 22px;
  bottom: 0;
  width: 116px;
  height: 132px;
  border-radius: 70px 70px 22px 22px;
  background: linear-gradient(135deg, rgba(3,205,140,0.22), rgba(247,127,0,0.14));
}
.host-avatar .glow {
  position: absolute;
  left: 50%;
  top: 34px;
  width: 180px;
  height: 180px;
  transform: translateX(-50%);
  border-radius: 999px;
  background: radial-gradient(circle, rgba(3,205,140,0.24), transparent 62%);
  animation: pulseGlow 3s ease-in-out infinite;
}
@keyframes pulseGlow {
  0%,100% { opacity: .55; }
  50% { opacity: 1; }
}
.camera-tag {
  right: 20px;
  top: 20px;
  color: var(--evz-orange);
}
.overlay-layer {
  position: absolute;
  left: 10%;
  right: 10%;
  bottom: 30px;
  z-index: 7;
  border-radius: 18px;
  padding: 12px 16px;
  background: var(--evz-card);
  box-shadow: 0 18px 36px rgba(15,23,42,0.10);
  display: grid;
  gap: 2px;
}
.overlay-layer strong { color: var(--evz-green); }
.overlay-layer span { color: var(--evz-muted); font-size: 12px; }
.alert-layer {
  top: 70px;
  right: 24px;
  color: white;
  background: linear-gradient(135deg, var(--evz-orange), #fb923c);
}
.countdown-chip {
  bottom: 94px;
  right: 24px;
  color: var(--evz-green);
}
.particle-field {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.particle {
  position: absolute;
  width: 11px;
  height: 11px;
  border-radius: 4px;
  background: var(--evz-green);
  animation: floatParticle 3s ease-in-out infinite;
}
.particle.p1 { background: var(--evz-orange); border-radius: 999px; }
.particle.p2 { width: 8px; height: 18px; background: rgba(3,205,140,0.70); }
.particle.p3 { width: 16px; height: 7px; background: rgba(247,127,0,0.76); }
.particle.p4 { background: var(--evz-card); box-shadow: 0 0 18px rgba(3,205,140,0.42); }
@keyframes floatParticle {
  0%,100% { transform: translateY(0) rotate(0deg); opacity: .35; }
  50% { transform: translateY(-28px) rotate(80deg); opacity: 1; }
}
.disable-mask {
  position: absolute;
  inset: 0;
  z-index: 20;
  display: grid;
  place-items: center;
  color: white;
  font-size: 22px;
  font-weight: 900;
  background: rgba(15,23,42,0.62);
}
.preview-card {
  position: absolute;
  border-radius: 18px;
  padding: 13px 15px;
  background: var(--evz-card);
  border: 1px solid var(--evz-border);
  backdrop-filter: blur(16px);
  box-shadow: 0 14px 26px rgba(15,23,42,0.09);
}
.preview-card.top-left {
  left: 22px;
  top: 22px;
  display: grid;
  align-items: start;
  gap: 5px;
}
.preview-card.top-left span {
  color: var(--evz-muted);
  font-size: 12px;
}
.preview-card.bottom-left {
  left: 22px;
  bottom: 22px;
  display: grid;
  grid-template-columns: repeat(4, minmax(76px, 1fr));
  gap: 12px;
}
.preview-card.bottom-left div { display: grid; gap: 4px; }
.preview-card.bottom-left span {
  color: var(--evz-muted);
  font-size: 11px;
}
.main-workspace {
  margin: 0 16px 16px;
  border: 1px solid var(--evz-soft-line);
  border-radius: 24px;
  background: var(--evz-card-solid);
  overflow: hidden;
}
.panel-scroll {
  padding: 16px;
  display: grid;
  gap: 14px;
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
.binding-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0,1fr));
  gap: 12px;
}
.binding-select,
.surface-toggle,
.surface-slider,
.surface-dropdown,
.surface-color {
  border: 1px solid var(--evz-soft-line);
  border-radius: 18px;
  background: var(--evz-card);
  padding: 14px;
  display: grid;
  gap: 9px;
}
.binding-select span,
.surface-grid span,
.runtime-row span {
  color: var(--evz-muted);
  font-size: 12px;
  font-weight: 900;
}
.binding-select select,
.surface-grid select {
  width: 100%;
  border: 1px solid var(--evz-line);
  border-radius: 12px;
  background: var(--evz-card-solid);
  padding: 10px;
  color: var(--evz-ink);
  font-weight: 800;
}
.route-map {
  min-height: 170px;
  border-radius: 22px;
  background:
    radial-gradient(circle at 20% 20%, rgba(3,205,140,0.14), transparent 34%),
    var(--evz-card);
  border: 1px solid var(--evz-soft-line);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}
.route-node {
  min-width: 170px;
  border: 1px solid var(--evz-soft-line);
  border-radius: 18px;
  background: var(--evz-card-solid);
  padding: 14px;
  display: grid;
  gap: 5px;
  text-align: center;
}
.route-node span {
  color: var(--evz-orange);
  font-size: 11px;
  font-weight: 900;
  text-transform: uppercase;
}
.route-node strong {
  color: var(--evz-ink);
}
.route-node small {
  color: var(--evz-muted);
}
.route-line {
  width: 70px;
  height: 4px;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--evz-green), var(--evz-orange));
}
.binding-summary-grid,
.runtime-grid,
.dual-grid,
.surface-grid,
.control-builder-list,
.asset-grid,
.sync-grid,
.warning-grid,
.history-grid {
  display: grid;
  gap: 12px;
}
.binding-summary-grid {
  grid-template-columns: repeat(4, minmax(0,1fr));
}
.summary-card {
  border: 1px solid var(--evz-soft-line);
  border-radius: 18px;
  background: var(--evz-card-solid);
  padding: 14px;
  display: grid;
  gap: 5px;
}
.summary-card span {
  color: var(--evz-muted);
  font-size: 12px;
}
.summary-card.green strong { color: var(--evz-green); }
.summary-card.orange strong { color: var(--evz-orange); }
.mapping-list {
  display: grid;
  gap: 10px;
}
.mapping-card {
  display: grid;
  grid-template-columns: 42px 1fr 1.1fr auto;
  gap: 12px;
  align-items: center;
}
.mapping-icon {
  width: 40px;
  height: 40px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  color: var(--evz-orange);
  background: rgba(247,127,0,0.10);
  font-size: 18px;
}
.mapping-card div {
  display: grid;
  gap: 4px;
}
.mapping-card em {
  color: var(--evz-muted);
  font-style: normal;
  font-size: 12px;
}
.mapping-card b {
  color: var(--evz-green);
  font-size: 12px;
}
.dual-grid {
  grid-template-columns: 1fr 1fr;
}
.sub-panel {
  border: 1px solid var(--evz-soft-line);
  border-radius: 22px;
  background: var(--evz-card);
  padding: 14px;
  display: grid;
  gap: 10px;
}
.hotkey-row,
.button-map-row {
  display: grid;
  grid-template-columns: 80px 1fr auto;
  gap: 10px;
  align-items: center;
  padding: 10px;
}
.hotkey-row kbd {
  border-radius: 12px;
  padding: 8px;
  text-align: center;
  background: rgba(148,163,184,0.12);
}
.hotkey-row span,
.button-map-row em {
  color: var(--evz-green);
  font-style: normal;
  font-size: 12px;
  font-weight: 900;
}
.surface-dot,
.control-kind,
.asset-icon {
  width: 38px;
  height: 38px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  color: white;
  font-weight: 900;
}
.surface-dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
}
.surface-dot.green,
.control-kind.green,
.asset-icon { background: var(--evz-green); }
.surface-dot.orange,
.control-kind.orange { background: var(--evz-orange); }
.surface-dot.gray,
.control-kind.gray { background: var(--evz-medium); }
.surface-preview {
  border-radius: 24px;
  padding: 16px;
  border: 1px solid var(--evz-soft-line);
  background:
    radial-gradient(circle at 20% 20%, rgba(3,205,140,0.12), transparent 34%),
    var(--evz-card);
}
.surface-top {
  justify-content: space-between;
  margin-bottom: 14px;
}
.surface-top span {
  color: var(--evz-muted);
  font-size: 12px;
}
.surface-grid {
  grid-template-columns: repeat(3, minmax(0,1fr));
}
.surface-button.primary,
.operator-primary {
  color: white;
  border-color: transparent;
  background: linear-gradient(135deg, var(--evz-green), #10b981);
}
.surface-button.safe {
  color: var(--evz-green);
  background: rgba(3,205,140,0.10);
}
.surface-grid input[type="range"] {
  width: 100%;
  accent-color: var(--evz-green);
}
.surface-grid input[type="color"] {
  width: 100%;
  height: 38px;
  border: 1px solid var(--evz-line);
  border-radius: 12px;
}
.control-builder-list {
  grid-template-columns: repeat(5, minmax(0,1fr));
}
.control-builder-card {
  border: 1px solid var(--evz-soft-line);
  border-radius: 18px;
  background: var(--evz-card-solid);
  padding: 12px;
  display: grid;
  gap: 8px;
}
.control-builder-card div {
  display: grid;
  gap: 4px;
}
.control-builder-card button {
  padding: 8px 10px;
  font-size: 12px;
}
.runtime-grid {
  grid-template-columns: repeat(4, minmax(0,1fr));
}
.runtime-grid button {
  text-align: left;
  display: grid;
  gap: 6px;
}
.runtime-switches {
  display: grid;
  gap: 10px;
}
.toggle-row {
  position: relative;
  border: 1px solid var(--evz-soft-line);
  border-radius: 18px;
  background: var(--evz-card-solid);
  padding: 14px 64px 14px 14px;
  display: grid;
  gap: 4px;
}
.toggle-row input {
  position: absolute;
  right: 18px;
  top: 20px;
  opacity: 0;
}
.toggle-visual {
  position: absolute;
  right: 14px;
  top: 18px;
  width: 44px;
  height: 25px;
  border-radius: 999px;
  background: rgba(148,163,184,0.22);
}
.toggle-visual::after {
  content: "";
  position: absolute;
  left: 3px;
  top: 3px;
  width: 19px;
  height: 19px;
  border-radius: 999px;
  background: var(--evz-card-solid);
  box-shadow: 0 4px 9px rgba(15,23,42,0.14);
  transition: 180ms ease;
}
.toggle-row input:checked + .toggle-visual {
  background: rgba(3,205,140,0.62);
}
.toggle-row input:checked + .toggle-visual::after {
  transform: translateX(19px);
}
.emergency-card {
  border-radius: 22px;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: center;
  border: 1px solid var(--evz-soft-line);
}
.emergency-card.armed {
  background: rgba(3,205,140,0.08);
  border-color: rgba(3,205,140,0.20);
}
.emergency-card.disabled {
  background: var(--evz-warning-surface);
  border-color: rgba(247,127,0,0.24);
}
.emergency-card button {
  border: 0;
  border-radius: 14px;
  padding: 11px 13px;
  color: white;
  font-weight: 900;
  background: linear-gradient(135deg, var(--evz-orange), #ef4444);
  cursor: pointer;
}
.operator-controls {
  padding: 16px 18px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 9px;
}
.operator-controls .warning {
  color: var(--evz-orange);
  background: rgba(247,127,0,0.10);
}
.operator-panel,
.notes-panel {
  margin-top: 0;
}
.runtime-row {
  justify-content: space-between;
  gap: 12px;
  border: 1px solid var(--evz-soft-line);
  border-radius: 14px;
  padding: 10px;
  background: var(--evz-card);
}
.runtime-row select,
.runtime-row input[type="range"],
.runtime-row input[type="color"] {
  max-width: 150px;
  width: 100%;
  accent-color: var(--evz-green);
}
.runtime-row input[type="color"] {
  height: 34px;
  border: 1px solid var(--evz-line);
  border-radius: 10px;
}
.note-card {
  border: 1px solid var(--evz-soft-line);
  border-radius: 16px;
  background: var(--evz-card-solid);
  padding: 12px;
  display: grid;
  gap: 6px;
}
.note-card strong { color: var(--evz-green); }
.notes-panel textarea {
  border: 1px solid var(--evz-line);
  border-radius: 14px;
  min-height: 90px;
  padding: 12px;
  font: inherit;
  resize: vertical;
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
.bottom-content { padding: 18px; }
.asset-grid,
.sync-grid,
.warning-grid,
.history-grid {
  grid-template-columns: repeat(5, minmax(0,1fr));
}
.asset-card,
.sync-card,
.warning-row,
.history-card {
  display: grid;
  gap: 8px;
  background: var(--evz-card-solid);
  border: 1px solid var(--evz-soft-line);
  border-radius: 18px;
  padding: 14px;
}
.asset-card {
  grid-template-columns: 42px 1fr;
  align-items: center;
}
.asset-card em {
  grid-column: 2;
}
.asset-card div,
.sync-card div {
  display: grid;
  gap: 4px;
}
.asset-card em,
.sync-card em,
.warning-row em {
  color: var(--evz-green);
  font-style: normal;
  font-size: 12px;
  font-weight: 900;
}
.asset-card.pending em,
.asset-card.needs-review em,
.warning-row.warning em {
  color: var(--evz-orange);
}
.sync-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.warning-row {
  grid-template-columns: 12px 1fr auto;
  align-items: start;
}
.warning-row.warning .warning-dot {
  background: var(--evz-orange);
  box-shadow: 0 0 0 6px rgba(247,127,0,0.13);
}
.warning-row small {
  color: var(--evz-muted);
}
.history-card span {
  color: var(--evz-orange);
  font-weight: 900;
  font-size: 12px;
}
.history-card small {
  color: var(--evz-muted);
}
@media (max-width: 1500px) {
  .status-hero,
  .integration-shell {
    grid-template-columns: 300px 1fr;
  }
  .status-card.main {
    grid-column: span 2;
  }
  .right-panel {
    grid-column: span 2;
    min-height: auto;
  }
  .asset-grid,
  .sync-grid,
  .warning-grid,
  .history-grid {
    grid-template-columns: repeat(3, minmax(0,1fr));
  }
}
@media (max-width: 1050px) {
  .topbar {
    flex-direction: column;
    align-items: flex-start;
  }
  .status-hero,
  .integration-shell {
    grid-template-columns: 1fr;
  }
  .status-card.main,
  .right-panel {
    grid-column: auto;
  }
  .center-panel {
    grid-template-rows: auto 480px auto;
  }
  .program-frame {
    inset: 72px 28px 94px;
  }
  .binding-grid,
  .binding-summary-grid,
  .dual-grid,
  .surface-grid,
  .control-builder-list,
  .runtime-grid {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 700px) {
  .evz-integration-page {
    padding: 14px;
  }
  .top-actions > *,
  .center-actions > * {
    width: 100%;
    justify-content: center;
  }
  .status-card,
  .center-top,
  .bottom-head,
  .emergency-card,
  .sync-card {
    flex-direction: column;
    align-items: flex-start;
  }
  .program-frame {
    inset: 92px 18px 118px;
  }
  .preview-card.bottom-left {
    grid-template-columns: 1fr 1fr;
    right: 16px;
  }
  .asset-grid,
  .sync-grid,
  .warning-grid,
  .history-grid {
    grid-template-columns: 1fr;
  }
}
`;
