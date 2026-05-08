import React, { useMemo, useState } from "react";

type SectionKey =
  | "Recovery Overview"
  | "Autosave Recovery"
  | "Connection & Offline"
  | "Import / Upload"
  | "Preview / Export"
  | "AI / Script / Tracking"
  | "Studio Bridge"
  | "Diagnostic Logs"
  | "Support Package";

type BottomTab = "Diagnostic Logs" | "Version Compare" | "Dependency Repair" | "Retry Queue";

type Severity = "Critical" | "Warning" | "Recoverable" | "Resolved" | "Info";

type Issue = {
  id: string;
  title: string;
  area: string;
  severity: Severity;
  detail: string;
  suggestion: string;
  action: string;
  time: string;
};

const sections: { key: SectionKey; caption: string; icon: string }[] = [
  { key: "Recovery Overview", caption: "All errors and recovery status in one place", icon: "RO" },
  { key: "Autosave Recovery", caption: "Restore drafts and compare recovered versions", icon: "AR" },
  { key: "Connection & Offline", caption: "Offline, connection lost and bridge state", icon: "CO" },
  { key: "Import / Upload", caption: "Upload errors, formats and dependency repair", icon: "UP" },
  { key: "Preview / Export", caption: "Preview failures, export failures and retries", icon: "PE" },
  { key: "AI / Script / Tracking", caption: "AI generation, script and tracking errors", icon: "AI" },
  { key: "Studio Bridge", caption: "Studio bridge error and reconnect tools", icon: "SB" },
  { key: "Diagnostic Logs", caption: "Logs, filters and diagnostic timeline", icon: "DL" },
  { key: "Support Package", caption: "Send internal package to EVzone support", icon: "SP" },
];

const issues: Issue[] = [
  {
    id: "autosave",
    title: "Autosave recovery available",
    area: "Autosave Recovery",
    severity: "Recoverable",
    detail: "A newer local draft was found from 12:54 with unsent editor changes.",
    suggestion: "Compare recovered version with current version, then restore or keep current.",
    action: "Compare versions",
    time: "12:54",
  },
  {
    id: "offline",
    title: "Offline warning",
    area: "Connection & Offline",
    severity: "Warning",
    detail: "Network is unstable. Local editing is available, but support package upload may wait.",
    suggestion: "Keep working locally. Reconnect before sending a diagnostic package.",
    action: "Retry connection",
    time: "12:51",
  },
  {
    id: "upload",
    title: "Upload / import error",
    area: "Import / Upload",
    severity: "Warning",
    detail: "Imported asset 'chrome_reflection.hdr' exceeds recommended runtime size.",
    suggestion: "Compress, replace, or import as a lower-cost EVzone texture variant.",
    action: "Repair asset",
    time: "12:47",
  },
  {
    id: "dependency",
    title: "Missing dependency detected",
    area: "Import / Upload",
    severity: "Recoverable",
    detail: "Material 'Emerald Hologram' references missing texture 'scanline_mask.png'.",
    suggestion: "Use dependency repair to relink, search local cache, or replace with fallback texture.",
    action: "Repair dependency",
    time: "12:44",
  },
  {
    id: "format",
    title: "Unsupported format warning",
    area: "Import / Upload",
    severity: "Warning",
    detail: "A .psb file was dropped into the asset panel. EVzone supports PNG, JPG, KTX2, GLB, WAV, JSON and EVZ packages.",
    suggestion: "Convert the file to a supported texture or packaged asset format.",
    action: "Show supported formats",
    time: "12:39",
  },
  {
    id: "export",
    title: "Export failed",
    area: "Preview / Export",
    severity: "Critical",
    detail: "Package export failed because one dependency is missing and one texture exceeds the size limit.",
    suggestion: "Run dependency repair, compress the texture, then retry export.",
    action: "Fix and retry export",
    time: "12:36",
  },
  {
    id: "preview",
    title: "Preview failed",
    area: "Preview / Export",
    severity: "Recoverable",
    detail: "Preview runtime failed after switching from mobile frame to studio overlay frame.",
    suggestion: "Reload preview runtime and rebuild shader cache.",
    action: "Reload preview",
    time: "12:34",
  },
  {
    id: "ai",
    title: "AI generation failed",
    area: "AI / Script / Tracking",
    severity: "Recoverable",
    detail: "Prompt-to-node-graph generation timed out while waiting for safety validation.",
    suggestion: "Retry generation with a shorter prompt or open AI safety queue details.",
    action: "Retry AI generation",
    time: "12:31",
  },
  {
    id: "script",
    title: "Script error",
    area: "AI / Script / Tracking",
    severity: "Warning",
    detail: "Script 'studioBridgeEvents.ts' is missing payload.eventId in one handler.",
    suggestion: "Apply AI error fixer patch or open the Code & Developer Lab.",
    action: "Open fix patch",
    time: "12:28",
  },
  {
    id: "tracking",
    title: "Tracking error",
    area: "AI / Script / Tracking",
    severity: "Warning",
    detail: "Hand gesture detection dropped below stability threshold in low light preview.",
    suggestion: "Recalibrate tracking, increase preview brightness, or enable studio button fallback.",
    action: "Recalibrate tracking",
    time: "12:24",
  },
  {
    id: "bridge",
    title: "Studio bridge error",
    area: "Studio Bridge",
    severity: "Recoverable",
    detail: "Bridge heartbeat paused for 4 seconds while EVzone Studio reloaded scene targets.",
    suggestion: "Reconnect bridge or reload scene and camera bindings.",
    action: "Reconnect bridge",
    time: "12:20",
  },
];

const recoveredChanges = [
  { label: "Effect Stack", current: "Beauty + Lower Third", recovered: "Beauty + Hologram + Lower Third + Confetti", status: "Changed" },
  { label: "Studio Binding", current: "Interview Desk / Host Camera", recovered: "Morning Show / Host Camera", status: "Changed" },
  { label: "VFX Intensity", current: "52%", recovered: "68%", status: "Changed" },
  { label: "AI Node Graph", current: "Draft v8", recovered: "Draft v9 with smile trigger", status: "Newer" },
  { label: "Missing Asset", current: "scanline_mask.png missing", recovered: "Still missing", status: "Needs repair" },
];

const dependencyRows = [
  { name: "scanline_mask.png", owner: "Emerald Hologram Material", issue: "Missing file", status: "Needs relink" },
  { name: "chrome_reflection.hdr", owner: "Studio Glass Shader", issue: "Too large", status: "Compress" },
  { name: "soft_hit_stinger.wav", owner: "Audio Trigger", issue: "Volume review", status: "Review" },
  { name: "gesture_map.json", owner: "Hand Gesture Pack", issue: "Version mismatch", status: "Update" },
];

const retryQueue = [
  { task: "Retry export package", dependency: "Dependency repair required", status: "Waiting" },
  { task: "Reload preview runtime", dependency: "Ready", status: "Ready" },
  { task: "Retry AI node graph", dependency: "Safety queue ready", status: "Ready" },
  { task: "Reconnect Studio Bridge", dependency: "EVzone Studio online", status: "Ready" },
  { task: "Upload diagnostic package", dependency: "Network check", status: "Waiting" },
];

const logs = [
  { time: "12:54:08", source: "Autosave", level: "Recoverable", message: "Recovered draft snapshot found with newer local changes." },
  { time: "12:51:44", source: "Network", level: "Warning", message: "Offline warning raised; local mode is still available." },
  { time: "12:47:18", source: "Import", level: "Warning", message: "chrome_reflection.hdr exceeds recommended texture budget." },
  { time: "12:44:35", source: "Dependency", level: "Recoverable", message: "Missing texture scanline_mask.png referenced by Emerald Hologram Material." },
  { time: "12:36:52", source: "Export", level: "Critical", message: "Export failed because one dependency is missing and one texture exceeds size limit." },
  { time: "12:34:21", source: "Preview", level: "Recoverable", message: "Preview runtime failed when switching device frame." },
  { time: "12:31:08", source: "AI", level: "Recoverable", message: "AI generation timed out while waiting for safety validation." },
  { time: "12:28:47", source: "Script", level: "Warning", message: "studioBridgeEvents.ts missing payload.eventId." },
  { time: "12:24:15", source: "Tracking", level: "Warning", message: "Hand gesture detection dropped below stability threshold." },
  { time: "12:20:02", source: "Studio Bridge", level: "Recoverable", message: "Bridge heartbeat paused while scene targets reloaded." },
];

const supportPackageItems = [
  { label: "Diagnostic logs", status: "Ready", size: "240 KB" },
  { label: "Crash / error report", status: "Ready", size: "96 KB" },
  { label: "Project metadata", status: "Ready", size: "42 KB" },
  { label: "Runtime profile", status: "Ready", size: "118 KB" },
  { label: "Bridge diagnostics", status: "Ready", size: "84 KB" },
  { label: "Recovery snapshot summary", status: "Ready", size: "62 KB" },
];

export default function EVzoneRecoveryDiagnosticsCenter() {
  const [activeSection, setActiveSection] = useState<SectionKey>("Recovery Overview");
  const [bottomTab, setBottomTab] = useState<BottomTab>("Diagnostic Logs");
  const [selectedIssue, setSelectedIssue] = useState<Issue>(issues[0]);
  const [online, setOnline] = useState(false);
  const [bridgeConnected, setBridgeConnected] = useState(false);
  const [draftRestored, setDraftRestored] = useState(false);
  const [dependencyRepaired, setDependencyRepaired] = useState(false);
  const [previewReloaded, setPreviewReloaded] = useState(false);
  const [supportSent, setSupportSent] = useState(false);
  const [logFilter, setLogFilter] = useState("All levels");

  const criticalCount = issues.filter((issue) => issue.severity === "Critical").length;
  const warningCount = issues.filter((issue) => issue.severity === "Warning").length;
  const recoverableCount = issues.filter((issue) => issue.severity === "Recoverable").length;
  const readinessScore = useMemo(() => {
    let score = 72;
    if (online) score += 8;
    if (bridgeConnected) score += 8;
    if (draftRestored) score += 5;
    if (dependencyRepaired) score += 5;
    if (previewReloaded) score += 4;
    return Math.min(score, 98);
  }, [online, bridgeConnected, draftRestored, dependencyRepaired, previewReloaded]);

  const filteredLogs = useMemo(() => {
    if (logFilter === "All levels") return logs;
    return logs.filter((log) => log.level === logFilter);
  }, [logFilter]);

  const primaryStats = [
    { label: "Critical issues", value: String(criticalCount), tone: "orange" },
    { label: "Warnings", value: String(warningCount), tone: "orange" },
    { label: "Recoverable", value: String(recoverableCount), tone: "green" },
    { label: "Readiness", value: `${readinessScore}%`, tone: "green" },
  ];

  const runIssueAction = (issue: Issue) => {
    if (issue.id === "autosave") setDraftRestored(true);
    if (issue.id === "dependency" || issue.id === "upload" || issue.id === "export") setDependencyRepaired(true);
    if (issue.id === "preview") setPreviewReloaded(true);
    if (issue.id === "bridge") setBridgeConnected(true);
    if (issue.id === "offline") setOnline(true);
    if (issue.id === "ai") setSelectedIssue({ ...issue, severity: "Resolved", detail: "AI generation retry queued successfully.", suggestion: "Open AI Creator Hub to continue from the recovered generation state.", action: "Open AI Creator Hub" });
  };

  const renderMainPanel = () => {
    if (activeSection === "Autosave Recovery") {
      return (
        <RecoveryPanel eyebrow="Autosave recovery" title="Compare Recovered Version with Current Version">
          <div className="restore-hero">
            <div className="restore-orb">
              <span>{draftRestored ? "✓" : "!"}</span>
              <small>{draftRestored ? "Restored" : "Draft found"}</small>
            </div>
            <div>
              <h3>{draftRestored ? "Recovered draft restored" : "Newer autosave draft available"}</h3>
              <p>A local autosave from 12:54 contains newer changes than the current open project. Compare the differences before restoring.</p>
              <div className="hero-actions">
                <button className="primary-btn" onClick={() => setDraftRestored(true)}>Restore Draft</button>
                <button className="ghost-btn" data-evz-autowire="1">Keep Current Version</button>
              </div>
            </div>
          </div>

          <div className="compare-table">
            <div className="compare-head">
              <strong>Area</strong>
              <strong>Current Version</strong>
              <strong>Recovered Version</strong>
              <strong>Status</strong>
            </div>
            {recoveredChanges.map((row) => (
              <div className={`compare-row ${row.status.toLowerCase().replace(" ", "-")}`} key={row.label}>
                <span>{row.label}</span>
                <small>{row.current}</small>
                <small>{row.recovered}</small>
                <em>{row.status}</em>
              </div>
            ))}
          </div>
        </RecoveryPanel>
      );
    }

    if (activeSection === "Connection & Offline") {
      return (
        <RecoveryPanel eyebrow="Connection recovery" title="Offline and Connection Lost Recovery">
          <div className="connection-grid">
            <StatusCard title="Network status" value={online ? "Online" : "Offline warning"} tone={online ? "green" : "orange"} detail={online ? "Network connection restored." : "Local mode is active. Support package upload may wait."} />
            <StatusCard title="Studio bridge" value={bridgeConnected ? "Connected" : "Connection lost"} tone={bridgeConnected ? "green" : "orange"} detail={bridgeConnected ? "Bridge heartbeat recovered." : "Studio Bridge heartbeat paused while scene targets reloaded."} />
            <StatusCard title="Local editing" value="Available" tone="green" detail="Autosave, preview cache and local diagnostics continue to work." />
            <StatusCard title="Retry status" value="Ready" tone="green" detail="Reconnect tools and retry actions are available." />
          </div>
          <div className="action-grid">
            <button className="primary-btn" onClick={() => setOnline(true)}>Retry Connection</button>
            <button className="ghost-btn" onClick={() => setBridgeConnected(true)}>Reconnect Studio Bridge</button>
            <button className="ghost-btn" data-evz-autowire="1">Reload Scene Targets</button>
            <button className="ghost-btn" data-evz-autowire="1">Continue Offline</button>
          </div>
          <div className="inline-notice">
            <strong>Offline-safe workflow</strong>
            <span>EVzone can keep editing, autosaving and collecting logs locally while network or bridge services recover.</span>
          </div>
        </RecoveryPanel>
      );
    }

    if (activeSection === "Import / Upload") {
      return (
        <RecoveryPanel eyebrow="Import and dependency recovery" title="Upload Errors, Missing Dependencies and Unsupported Formats">
          <div className="dependency-grid">
            {dependencyRows.map((item) => (
              <div className={`dependency-card ${dependencyRepaired ? "repaired" : ""}`} key={item.name}>
                <span className="dependency-icon">AS</span>
                <div>
                  <strong>{item.name}</strong>
                  <small>{item.owner} • {item.issue}</small>
                </div>
                <em>{dependencyRepaired ? "Repaired" : item.status}</em>
              </div>
            ))}
          </div>
          <div className="supported-formats">
            {["PNG", "JPG", "KTX2", "GLB", "WAV", "JSON", "EVZ", "EVZ Graph", "CUBE LUT", "Lottie"].map((format) => (
              <span key={format}>{format}</span>
            ))}
          </div>
          <div className="action-grid">
            <button className="primary-btn" onClick={() => setDependencyRepaired(true)}>Repair Missing Dependencies</button>
            <button className="ghost-btn" data-evz-autowire="1">Replace Unsupported File</button>
            <button className="ghost-btn" data-evz-autowire="1">Compress Large Texture</button>
            <button className="ghost-btn" data-evz-autowire="1">Retry Import</button>
          </div>
        </RecoveryPanel>
      );
    }

    if (activeSection === "Preview / Export") {
      return (
        <RecoveryPanel eyebrow="Preview and export recovery" title="Preview Failed, Export Failed and Retry Actions">
          <div className="pipeline-card">
            <div className={`pipeline-step ${previewReloaded ? "complete" : "warning"}`}>
              <span>1</span>
              <strong>Reload Preview</strong>
              <small>{previewReloaded ? "Preview runtime reloaded." : "Preview runtime failed after frame switch."}</small>
            </div>
            <div className={`pipeline-step ${dependencyRepaired ? "complete" : "warning"}`}>
              <span>2</span>
              <strong>Repair Assets</strong>
              <small>{dependencyRepaired ? "Dependency repair complete." : "Missing asset and oversized texture found."}</small>
            </div>
            <div className="pipeline-step ready">
              <span>3</span>
              <strong>Retry Export</strong>
              <small>Export package can be retried after repairs.</small>
            </div>
          </div>
          <div className="retry-list">
            {retryQueue.slice(0, 3).map((task) => (
              <div className={`retry-row ${task.status.toLowerCase()}`} key={task.task}>
                <div>
                  <strong>{task.task}</strong>
                  <small>{task.dependency}</small>
                </div>
                <em>{task.status}</em>
                <button data-evz-autowire="1">{task.status === "Ready" ? "Run" : "Fix first"}</button>
              </div>
            ))}
          </div>
          <div className="action-grid">
            <button className="primary-btn" onClick={() => { setPreviewReloaded(true); setDependencyRepaired(true); }}>Fix and Retry Export</button>
            <button className="ghost-btn" onClick={() => setPreviewReloaded(true)}>Reload Preview</button>
            <button className="ghost-btn" data-evz-autowire="1">Rebuild Shader Cache</button>
            <button className="ghost-btn" data-evz-autowire="1">Open Quality Center</button>
          </div>
        </RecoveryPanel>
      );
    }

    if (activeSection === "AI / Script / Tracking") {
      return (
        <RecoveryPanel eyebrow="AI, script and tracking recovery" title="AI Generation Failed, Script Error and Tracking Error">
          <div className="dual-grid">
            <div className="sub-panel">
              <SectionTitle eyebrow="AI generation failed" title="Generation Recovery" />
              <IssueMiniCard issue={issues.find((issue) => issue.id === "ai")!} onRun={() => runIssueAction(issues.find((issue) => issue.id === "ai")!)} />
              <div className="fix-list">
                <span>Shorten prompt and retry</span>
                <span>Open AI safety details</span>
                <span>Restore previous AI result</span>
              </div>
            </div>
            <div className="sub-panel">
              <SectionTitle eyebrow="Script error" title="Code Recovery" />
              <IssueMiniCard issue={issues.find((issue) => issue.id === "script")!} onRun={() => setSelectedIssue(issues.find((issue) => issue.id === "script")!)} />
              <div className="code-preview">
                <code>if (!payload.eventId) return fallback();</code>
                <small>Suggested patch from AI Error Fixer</small>
              </div>
            </div>
          </div>
          <div className="tracking-panel">
            <SectionTitle eyebrow="Tracking error" title="Tracking Stability Recovery" />
            <div className="tracking-grid">
              <StatusCard title="Face tracking" value="Stable" tone="green" detail="No face tracking error detected." />
              <StatusCard title="Hand tracking" value="Warning" tone="orange" detail="Low light reduced gesture confidence." />
              <StatusCard title="Fallback button" value="Ready" tone="green" detail="Studio button fallback is available." />
              <StatusCard title="Calibration" value="Recommended" tone="orange" detail="Run calibration before live use." />
            </div>
            <button className="primary-btn" data-evz-autowire="1">Recalibrate Tracking</button>
          </div>
        </RecoveryPanel>
      );
    }

    if (activeSection === "Studio Bridge") {
      return (
        <RecoveryPanel eyebrow="Studio bridge recovery" title="Bridge Error, Reconnect Tools and Diagnostics">
          <div className="bridge-hero">
            <div className="bridge-orb">
              <span>{bridgeConnected ? "✓" : "!"}</span>
              <small>{bridgeConnected ? "Connected" : "Paused"}</small>
            </div>
            <div>
              <h3>{bridgeConnected ? "Studio Bridge reconnected" : "Studio Bridge heartbeat paused"}</h3>
              <p>Bridge heartbeat paused while scene targets reloaded. Reconnect, reload runtime limits, or collect bridge diagnostics.</p>
              <div className="hero-actions">
                <button className="primary-btn" onClick={() => setBridgeConnected(true)}>Reconnect Bridge</button>
                <button className="ghost-btn" data-evz-autowire="1">Reload Runtime Limits</button>
              </div>
            </div>
          </div>
          <div className="bridge-grid">
            <StatusCard title="Bridge schema" value="v3.8" tone="green" detail="Compatible with EVzone Studio." />
            <StatusCard title="Runtime limits" value={bridgeConnected ? "Loaded" : "Waiting"} tone={bridgeConnected ? "green" : "orange"} detail="FPS, file size, texture and script limits." />
            <StatusCard title="Scene targets" value={bridgeConnected ? "Loaded" : "Reload needed"} tone={bridgeConnected ? "green" : "orange"} detail="Scenes, cameras and overlays." />
            <StatusCard title="Control surface" value="Ready" tone="green" detail="Buttons, toggles and emergency disable." />
          </div>
        </RecoveryPanel>
      );
    }

    if (activeSection === "Diagnostic Logs") {
      return (
        <RecoveryPanel eyebrow="Diagnostic logs" title="Logs, Filters and Error Timeline">
          <div className="log-toolbar">
            <label className="setting-field compact">
              <span>Log level</span>
              <select value={logFilter} onChange={(event) => setLogFilter(event.target.value)}>
                <option>All levels</option>
                <option>Critical</option>
                <option>Warning</option>
                <option>Recoverable</option>
                <option>Info</option>
              </select>
            </label>
            <div className="log-actions">
              <button className="ghost-btn" data-evz-autowire="1">Copy Logs</button>
              <button className="ghost-btn" data-evz-autowire="1">Export Logs</button>
              <button className="primary-btn" data-evz-autowire="1">Refresh Logs</button>
            </div>
          </div>
          <LogList logs={filteredLogs} />
        </RecoveryPanel>
      );
    }

    if (activeSection === "Support Package") {
      return (
        <RecoveryPanel eyebrow="Internal EVzone support" title="Send Diagnostic Package to Internal EVzone Support">
          <div className="support-hero">
            <div className="support-icon">EV</div>
            <div>
              <h3>{supportSent ? "Diagnostic package sent" : "Diagnostic package ready"}</h3>
              <p>Package includes logs, recovery metadata, runtime profile, bridge diagnostics and error timeline. It does not include billing, profile, password or authentication data.</p>
              <div className="hero-actions">
                <button className="primary-btn" onClick={() => setSupportSent(true)}>{supportSent ? "Sent" : "Send to Internal Support"}</button>
                <button className="ghost-btn" data-evz-autowire="1">Preview Package</button>
              </div>
            </div>
          </div>
          <div className="support-package-grid">
            {supportPackageItems.map((item) => (
              <div className="support-package-card" key={item.label}>
                <span>PK</span>
                <div>
                  <strong>{item.label}</strong>
                  <small>{item.size}</small>
                </div>
                <em>{item.status}</em>
              </div>
            ))}
          </div>
        </RecoveryPanel>
      );
    }

    return (
      <RecoveryPanel eyebrow="Recovery overview" title="All Errors and Recovery Actions">
        <div className="overview-grid">
          {primaryStats.map((stat) => (
            <div className={`metric-card ${stat.tone}`} key={stat.label}>
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
            </div>
          ))}
        </div>

        <div className="issue-grid">
          {issues.map((issue) => (
            <button
              key={issue.id}
              className={`issue-card ${issue.severity.toLowerCase()} ${selectedIssue.id === issue.id ? "selected" : ""}`}
              onClick={() => {
                setSelectedIssue(issue);
                setActiveSection(issue.area as SectionKey);
              }}
            >
              <span className="issue-time">{issue.time}</span>
              <strong>{issue.title}</strong>
              <small>{issue.detail}</small>
              <em>{issue.severity}</em>
            </button>
          ))}
        </div>
      </RecoveryPanel>
    );
  };

  const renderBottomContent = () => {
    if (bottomTab === "Version Compare") {
      return (
        <div className="bottom-compare">
          <div className="compare-table compact">
            <div className="compare-head">
              <strong>Area</strong>
              <strong>Current</strong>
              <strong>Recovered</strong>
              <strong>Status</strong>
            </div>
            {recoveredChanges.map((row) => (
              <div className={`compare-row ${row.status.toLowerCase().replace(" ", "-")}`} key={row.label}>
                <span>{row.label}</span>
                <small>{row.current}</small>
                <small>{row.recovered}</small>
                <em>{row.status}</em>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (bottomTab === "Dependency Repair") {
      return (
        <div className="bottom-dependencies">
          {dependencyRows.map((item) => (
            <div className={`dependency-card ${dependencyRepaired ? "repaired" : ""}`} key={item.name}>
              <span className="dependency-icon">AS</span>
              <div>
                <strong>{item.name}</strong>
                <small>{item.owner} • {item.issue}</small>
              </div>
              <em>{dependencyRepaired ? "Repaired" : item.status}</em>
            </div>
          ))}
          <button className="primary-btn" onClick={() => setDependencyRepaired(true)}>Repair All Dependencies</button>
        </div>
      );
    }

    if (bottomTab === "Retry Queue") {
      return (
        <div className="retry-grid">
          {retryQueue.map((task) => (
            <div className={`retry-card ${task.status.toLowerCase()}`} key={task.task}>
              <strong>{task.task}</strong>
              <small>{task.dependency}</small>
              <em>{task.status}</em>
              <button data-evz-autowire="1">{task.status === "Ready" ? "Run Retry" : "Fix First"}</button>
            </div>
          ))}
        </div>
      );
    }

    return <LogList logs={filteredLogs.slice(0, 6)} compact />;
  };

  return (
    <div className="evz-recovery-page">
      <style>{styles}</style>

      <header className="topbar">
        <div className="brand-area">
          <div className="brand-mark">EV</div>
          <div>
            <div className="eyebrow">EVzone Effect Creator</div>
            <h1>Recovery & Diagnostics Center</h1>
            <p>One premium system recovery page for autosave recovery, connection issues, import errors, failed previews, AI errors, bridge recovery and diagnostic support.</p>
          </div>
        </div>
        <div className="top-actions">
          <span className="studio-chip"><i />Local Recovery Mode</span>
          <button className="ghost-btn" onClick={() => setOnline(true)}>Retry Connection</button>
          <button className="ghost-btn" onClick={() => setBridgeConnected(true)}>Reconnect Bridge</button>
          <button className="primary-btn" onClick={() => setSupportSent(true)}>Send Diagnostic Package</button>
        </div>
      </header>

      <section className="recovery-hero">
        <div className="hero-card main">
          <div className="score-orb">
            <span>{readinessScore}</span>
            <small>Ready</small>
          </div>
          <div>
            <div className="eyebrow">System recovery status</div>
            <h2>{activeSection}</h2>
            <p>Autosave, offline editing, retry tools, dependency repair and internal support packaging are available from one center.</p>
          </div>
        </div>
        <div className="hero-card mini">
          <span>Autosave</span>
          <strong className={draftRestored ? "green" : "orange"}>{draftRestored ? "Restored" : "Draft found"}</strong>
        </div>
        <div className="hero-card mini">
          <span>Connection</span>
          <strong className={online ? "green" : "orange"}>{online ? "Online" : "Offline"}</strong>
        </div>
        <div className="hero-card mini">
          <span>Bridge</span>
          <strong className={bridgeConnected ? "green" : "orange"}>{bridgeConnected ? "Connected" : "Paused"}</strong>
        </div>
        <div className="hero-card mini">
          <span>Support Package</span>
          <strong className={supportSent ? "green" : "orange"}>{supportSent ? "Sent" : "Ready"}</strong>
        </div>
      </section>

      <main className="recovery-shell">
        <aside className="panel nav-panel">
          <div className="panel-head">
            <div>
              <div className="eyebrow">Recovery</div>
              <h2>Diagnostics Areas</h2>
            </div>
          </div>
          <div className="section-list">
            {sections.map((section) => (
              <button key={section.key} className={activeSection === section.key ? "active" : ""} onClick={() => setActiveSection(section.key)}>
                <span>{section.icon}</span>
                <div>
                  <strong>{section.key}</strong>
                  <small>{section.caption}</small>
                </div>
              </button>
            ))}
          </div>

          <div className="safe-card">
            <strong>Recovery-first workflow</strong>
            <span>No separate error pages. Every error can be reviewed, repaired, retried or packaged here.</span>
          </div>
        </aside>

        <section className="panel main-panel">
          <div className="main-top">
            <div>
              <div className="eyebrow">Active diagnostics</div>
              <h2>{activeSection}</h2>
              <p>{sections.find((section) => section.key === activeSection)?.caption}</p>
            </div>
            <div className="main-actions">
              <button className="ghost-btn" data-evz-autowire="1">Copy Error ID</button>
              <button className="ghost-btn" data-evz-autowire="1">Export Logs</button>
              <button className="primary-btn" onClick={() => runIssueAction(selectedIssue)}>Run Suggested Fix</button>
            </div>
          </div>
          {renderMainPanel()}
        </section>

        <aside className="panel right-panel">
          <div className="panel-head">
            <div>
              <div className="eyebrow">Fix suggestions</div>
              <h2>Recovery Assistant</h2>
            </div>
          </div>

          <div className={`selected-issue-card ${selectedIssue.severity.toLowerCase()}`}>
            <span>{selectedIssue.time}</span>
            <strong>{selectedIssue.title}</strong>
            <small>{selectedIssue.area}</small>
            <p>{selectedIssue.detail}</p>
            <em>{selectedIssue.severity}</em>
          </div>

          <div className="suggestion-card">
            <strong>Suggested fix</strong>
            <span>{selectedIssue.suggestion}</span>
            <button className="primary-btn full" onClick={() => runIssueAction(selectedIssue)}>{selectedIssue.action}</button>
          </div>

          <div className="quick-actions-panel">
            <button onClick={() => setDraftRestored(true)}>Restore Draft</button>
            <button onClick={() => setDependencyRepaired(true)}>Repair Dependencies</button>
            <button onClick={() => setPreviewReloaded(true)}>Reload Preview</button>
            <button onClick={() => setBridgeConnected(true)}>Reconnect Bridge</button>
            <button onClick={() => setOnline(true)}>Retry Connection</button>
            <button onClick={() => setSupportSent(true)}>Send Support Package</button>
          </div>

          <div className="support-summary">
            <strong>Diagnostic package</strong>
            <span>{supportPackageItems.length} items ready for internal EVzone support.</span>
            <div className="support-mini-list">
              {supportPackageItems.slice(0, 4).map((item) => (
                <small key={item.label}>{item.label} • {item.status}</small>
              ))}
            </div>
          </div>
        </aside>
      </main>

      <section className="panel bottom-panel">
        <div className="bottom-head">
          <div className="bottom-tabs">
            {(["Diagnostic Logs", "Version Compare", "Dependency Repair", "Retry Queue"] as BottomTab[]).map((tab) => (
              <button key={tab} className={bottomTab === tab ? "active" : ""} onClick={() => setBottomTab(tab)}>
                {tab}
              </button>
            ))}
          </div>
          <div className="bottom-actions">
            <button className="ghost-btn small" data-evz-autowire="1">Copy Logs</button>
            <button className="ghost-btn small" data-evz-autowire="1">Export Diagnostic Logs</button>
            <button className="primary-btn small" onClick={() => setSupportSent(true)}>Send to EVzone Support</button>
          </div>
        </div>
        <div className="bottom-content">
          {renderBottomContent()}
        </div>
      </section>
    </div>
  );
}

function RecoveryPanel({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <div className="recovery-panel">
      <SectionTitle eyebrow={eyebrow} title={title} />
      {children}
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

function StatusCard({ title, value, tone, detail }: { title: string; value: string; tone: "green" | "orange"; detail: string }) {
  return (
    <div className={`status-card ${tone}`}>
      <span>{title}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
    </div>
  );
}

function IssueMiniCard({ issue, onRun }: { issue: Issue; onRun: () => void }) {
  return (
    <div className={`mini-issue-card ${issue.severity.toLowerCase()}`}>
      <strong>{issue.title}</strong>
      <small>{issue.detail}</small>
      <button onClick={onRun}>{issue.action}</button>
    </div>
  );
}

function LogList({ logs, compact = false }: { logs: { time: string; source: string; level: string; message: string }[]; compact?: boolean }) {
  return (
    <div className={`log-list ${compact ? "compact" : ""}`}>
      {logs.map((log) => (
        <div className={`log-row ${log.level.toLowerCase()}`} key={`${log.time}-${log.message}`}>
          <span>{log.time}</span>
          <em>{log.level}</em>
          <div>
            <strong>{log.source}</strong>
            <small>{log.message}</small>
          </div>
        </div>
      ))}
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
.evz-recovery-page {
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
.recovery-hero {
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
.recovery-hero,
.hero-card,
.main-top,
.main-actions,
.bottom-head,
.bottom-tabs,
.bottom-actions,
.log-toolbar,
.log-actions,
.compare-head,
.compare-row,
.retry-row {
  display: flex;
  align-items: center;
}
.brand-area { gap: 16px; max-width: 1040px; }
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
.restore-hero p,
.bridge-hero p,
.support-hero p,
.selected-issue-card p,
.support-summary span,
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
.section-list button,
.bottom-tabs button,
.issue-card,
.metric-card,
.status-card,
.dependency-card,
.retry-card,
.log-row,
.retry-row,
.support-package-card,
.pipeline-step,
.mini-issue-card,
.quick-actions-panel button,
.setting-field {
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
.section-list button:hover,
.bottom-tabs button:hover,
.issue-card:hover,
.dependency-card:hover,
.retry-card:hover,
.log-row:hover,
.retry-row:hover,
.support-package-card:hover,
.pipeline-step:hover,
.mini-issue-card:hover,
.quick-actions-panel button:hover {
  transform: translateY(-1px);
  box-shadow: 0 12px 24px rgba(15,23,42,0.08);
}
.primary-btn {
  color: white;
  border-color: transparent;
  background: linear-gradient(135deg, var(--evz-green), #10b981);
  box-shadow: 0 18px 36px rgba(3,205,140,0.25);
}
.full { width: 100%; justify-content: center; }
.small { padding: 8px 11px; font-size: 12px; }
.green { color: var(--evz-green); }
.orange { color: var(--evz-orange); }
.recovery-hero {
  max-width: 100%;
  margin: 0 0 18px;
  border-radius: var(--radius-xl);
  padding: 18px;
  display: grid;
  grid-template-columns: 1.45fr repeat(4, minmax(135px, .3fr));
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
  font-size: 22px;
}
.score-orb,
.restore-orb,
.bridge-orb {
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
.restore-orb span,
.bridge-orb span {
  color: var(--evz-green);
  font-size: 32px;
  font-weight: 900;
  line-height: 1;
}
.score-orb small,
.restore-orb small,
.bridge-orb small {
  margin-top: -20px;
  color: var(--evz-muted);
}
.recovery-shell {
  max-width: 100%;
  margin: 0;
  display: grid;
  grid-template-columns: 330px minmax(720px, 1fr) 390px;
  gap: 18px;
}
.panel {
  border-radius: var(--radius-xl);
  overflow: hidden;
}
.nav-panel,
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
.section-list {
  padding: 16px 18px;
  display: grid;
  gap: 10px;
}
.section-list button {
  width: 100%;
  display: grid;
  grid-template-columns: 42px 1fr;
  gap: 12px;
  text-align: left;
  align-items: center;
}
.section-list button.active {
  border-color: rgba(3,205,140,0.34);
  background: rgba(3,205,140,0.07);
}
.section-list button > span,
.dependency-icon,
.support-icon,
.support-package-card > span {
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
.section-list button div {
  display: grid;
  gap: 4px;
}
small {
  color: var(--evz-muted);
  font-size: 12px;
  line-height: 1.45;
}
.safe-card {
  margin: 0 18px 18px;
  border: 1px solid rgba(247,127,0,0.20);
  border-radius: 22px;
  padding: 14px;
  background: var(--evz-warning-surface);
  display: grid;
  gap: 8px;
}
.safe-card strong { color: var(--evz-orange); }
.safe-card span { color: var(--evz-muted); line-height: 1.5; }
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
.main-actions {
  gap: 8px;
  flex-wrap: wrap;
  justify-content: flex-end;
}
.recovery-panel {
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
.overview-grid,
.connection-grid,
.tracking-grid,
.bridge-grid,
.dependency-grid,
.support-package-grid,
.retry-grid {
  display: grid;
  gap: 12px;
}
.overview-grid {
  grid-template-columns: repeat(4, minmax(0,1fr));
}
.metric-card {
  display: grid;
  gap: 8px;
  cursor: default;
}
.metric-card span,
.status-card span {
  color: var(--evz-muted);
  font-size: 12px;
  font-weight: 800;
}
.metric-card strong {
  font-size: 28px;
}
.metric-card.green strong,
.status-card.green strong {
  color: var(--evz-green);
}
.metric-card.orange strong,
.status-card.orange strong {
  color: var(--evz-orange);
}
.issue-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0,1fr));
  gap: 12px;
}
.issue-card {
  text-align: left;
  display: grid;
  gap: 8px;
  min-height: 170px;
}
.issue-card.selected {
  outline: 4px solid rgba(3,205,140,0.12);
  border-color: rgba(3,205,140,0.38);
}
.issue-time {
  color: var(--evz-orange);
  font-size: 11px;
  font-weight: 900;
}
.issue-card em,
.selected-issue-card em,
.dependency-card em,
.retry-card em,
.retry-row em,
.support-package-card em {
  width: fit-content;
  border-radius: 999px;
  padding: 6px 9px;
  color: var(--evz-green);
  background: rgba(3,205,140,0.09);
  font-size: 11px;
  font-style: normal;
  font-weight: 900;
}
.issue-card.critical em,
.issue-card.warning em,
.selected-issue-card.critical em,
.selected-issue-card.warning em,
.dependency-card em,
.retry-card.waiting em {
  color: var(--evz-orange);
  background: rgba(247,127,0,0.10);
}
.restore-hero,
.bridge-hero,
.support-hero {
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
.support-hero {
  grid-template-columns: 74px 1fr;
}
.support-icon {
  width: 62px;
  height: 62px;
  border-radius: 22px;
}
.restore-hero h3,
.bridge-hero h3,
.support-hero h3 {
  font-size: 26px;
  margin-bottom: 8px;
  letter-spacing: -0.035em;
}
.hero-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 14px;
}
.compare-table {
  border: 1px solid var(--evz-soft-line);
  border-radius: 22px;
  overflow: hidden;
  background: var(--evz-card-solid);
}
.compare-head,
.compare-row {
  display: grid;
  grid-template-columns: 1fr 1.3fr 1.3fr 120px;
  gap: 12px;
  padding: 13px 14px;
  border-bottom: 1px solid var(--evz-soft-line);
}
.compare-head {
  background: rgba(3,205,140,0.07);
}
.compare-row:last-child {
  border-bottom: 0;
}
.compare-row span {
  font-weight: 900;
}
.compare-row em {
  color: var(--evz-green);
  font-style: normal;
  font-size: 12px;
  font-weight: 900;
}
.compare-row.needs-repair em {
  color: var(--evz-orange);
}
.connection-grid,
.tracking-grid,
.bridge-grid {
  grid-template-columns: repeat(4, minmax(0,1fr));
}
.status-card {
  display: grid;
  gap: 7px;
  cursor: default;
}
.action-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0,1fr));
  gap: 10px;
}
.inline-notice {
  border: 1px solid rgba(247,127,0,0.20);
  border-radius: 18px;
  padding: 14px;
  background: var(--evz-warning-surface);
  display: grid;
  gap: 6px;
}
.inline-notice strong {
  color: var(--evz-orange);
}
.dependency-grid {
  grid-template-columns: repeat(2, minmax(0,1fr));
}
.dependency-card,
.support-package-card {
  display: grid;
  grid-template-columns: 42px 1fr auto;
  gap: 10px;
  align-items: center;
}
.dependency-card div,
.support-package-card div {
  display: grid;
  gap: 4px;
}
.dependency-card.repaired em {
  color: var(--evz-green);
  background: rgba(3,205,140,0.10);
}
.supported-formats {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.supported-formats span,
.fix-list span {
  border-radius: 999px;
  padding: 8px 10px;
  color: var(--evz-green);
  background: rgba(3,205,140,0.09);
  font-size: 12px;
  font-weight: 900;
}
.pipeline-card {
  border: 1px solid var(--evz-soft-line);
  border-radius: 24px;
  background: var(--evz-card);
  padding: 14px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0,1fr));
  gap: 12px;
}
.pipeline-step {
  display: grid;
  gap: 8px;
}
.pipeline-step > span {
  width: 34px;
  height: 34px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  color: white;
  background: var(--evz-green);
  font-weight: 900;
}
.retry-list {
  display: grid;
  gap: 10px;
}
.retry-row {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 10px;
}
.retry-row div {
  display: grid;
  gap: 4px;
}
.retry-row button,
.retry-card button,
.mini-issue-card button {
  border: 0;
  border-radius: 12px;
  padding: 8px 10px;
  color: var(--evz-muted);
  background: rgba(148,163,184,0.10);
  font-weight: 900;
  cursor: pointer;
}
.dual-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}
.sub-panel,
.tracking-panel {
  border: 1px solid var(--evz-soft-line);
  border-radius: 24px;
  background: var(--evz-card);
  padding: 14px;
  display: grid;
  gap: 12px;
}
.mini-issue-card {
  display: grid;
  gap: 8px;
  cursor: default;
}
.fix-list {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.code-preview {
  border-radius: 16px;
  background: #0f172a;
  color: white;
  padding: 14px;
  display: grid;
  gap: 8px;
}
.code-preview small {
  color: rgba(255,255,255,0.7);
}
.log-toolbar {
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}
.log-actions {
  gap: 8px;
  flex-wrap: wrap;
}
.setting-field {
  display: grid;
  gap: 8px;
  cursor: default;
}
.setting-field span {
  color: var(--evz-muted);
  font-size: 12px;
  font-weight: 900;
}
.setting-field select {
  border: 1px solid var(--evz-line);
  border-radius: 12px;
  background: var(--evz-card-solid);
  padding: 10px;
  color: var(--evz-ink);
  font-weight: 800;
}
.log-list {
  display: grid;
  gap: 10px;
}
.log-row {
  display: grid;
  grid-template-columns: 80px 100px 1fr;
  gap: 10px;
}
.log-row > span {
  color: var(--evz-muted);
  font-size: 12px;
}
.log-row em {
  color: var(--evz-green);
  font-size: 12px;
  font-style: normal;
  font-weight: 900;
}
.log-row.critical em,
.log-row.warning em {
  color: var(--evz-orange);
}
.selected-issue-card {
  margin: 16px 18px 0;
  border: 1px solid var(--evz-soft-line);
  border-radius: 22px;
  background: var(--evz-card-solid);
  padding: 14px;
  display: grid;
  gap: 8px;
}
.selected-issue-card > span {
  color: var(--evz-orange);
  font-size: 12px;
  font-weight: 900;
}
.suggestion-card,
.support-summary {
  margin: 16px 18px 0;
  border: 1px solid var(--evz-soft-line);
  border-radius: 22px;
  background: var(--evz-card-solid);
  padding: 14px;
  display: grid;
  gap: 10px;
}
.suggestion-card strong,
.support-summary strong {
  color: var(--evz-green);
}
.quick-actions-panel {
  margin: 16px 18px 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}
.quick-actions-panel button {
  padding: 10px;
  color: var(--evz-muted);
}
.support-mini-list {
  display: grid;
  gap: 5px;
}
.support-package-grid {
  grid-template-columns: repeat(2, minmax(0,1fr));
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
.bottom-tabs button {
  padding: 9px 11px;
  font-size: 12px;
}
.bottom-tabs button.active {
  color: white;
  border-color: transparent;
  background: linear-gradient(135deg, var(--evz-green), #10b981);
  box-shadow: 0 14px 26px rgba(3,205,140,0.19);
}
.bottom-content {
  padding: 18px;
}
.bottom-dependencies {
  display: grid;
  grid-template-columns: repeat(4, minmax(0,1fr)) 220px;
  gap: 12px;
}
.retry-grid {
  grid-template-columns: repeat(5, minmax(0,1fr));
}
.retry-card {
  display: grid;
  gap: 8px;
}
@media (max-width: 1500px) {
  .recovery-hero,
  .recovery-shell {
    grid-template-columns: 320px 1fr;
  }
  .hero-card.main {
    grid-column: span 2;
  }
  .right-panel {
    grid-column: span 2;
    min-height: auto;
  }
  .issue-grid,
  .overview-grid,
  .connection-grid,
  .tracking-grid,
  .bridge-grid,
  .pipeline-card,
  .retry-grid,
  .bottom-dependencies {
    grid-template-columns: repeat(2, minmax(0,1fr));
  }
}
@media (max-width: 1050px) {
  .topbar {
    flex-direction: column;
    align-items: flex-start;
  }
  .recovery-hero,
  .recovery-shell {
    grid-template-columns: 1fr;
  }
  .hero-card.main,
  .right-panel {
    grid-column: auto;
  }
  .dual-grid,
  .restore-hero,
  .bridge-hero,
  .support-hero,
  .dependency-grid,
  .support-package-grid {
    grid-template-columns: 1fr;
  }
  .action-grid,
  .issue-grid,
  .overview-grid,
  .connection-grid,
  .tracking-grid,
  .bridge-grid,
  .pipeline-card,
  .retry-grid,
  .bottom-dependencies {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 700px) {
  .evz-recovery-page {
    padding: 14px;
  }
  .top-actions > *,
  .main-actions > *,
  .log-actions > * {
    width: 100%;
    justify-content: center;
  }
  .hero-card,
  .main-top,
  .bottom-head,
  .log-toolbar {
    flex-direction: column;
    align-items: flex-start;
  }
  .compare-head,
  .compare-row,
  .log-row,
  .retry-row,
  .dependency-card,
  .support-package-card {
    grid-template-columns: 1fr;
  }
  .quick-actions-panel {
    grid-template-columns: 1fr;
  }
}
`;
