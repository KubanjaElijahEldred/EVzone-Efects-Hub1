import React, { useMemo, useState } from "react";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";

type SystemMode = "Maintenance" | "Partial Update" | "Operational";
type BottomTab = "Update Notes" | "Local Save Guide" | "Connector Timeline" | "Recovery Checklist";
type StatusTone = "green" | "orange" | "grey";

const modeCopy: Record<SystemMode, {
  title: string;
  message: string;
  editor: string;
  connector: string;
  localEditing: string;
  eta: string;
  progress: number;
  tone: StatusTone;
}> = {
  Maintenance: {
    title: "Scheduled creator maintenance in progress",
    message:
      "EVzone Effect Creator is receiving a clean system update. Local editing and safe local saves remain available while Studio connector services refresh.",
    editor: "Local editor available",
    connector: "Connector paused",
    localEditing: "Available",
    eta: "18 minutes",
    progress: 64,
    tone: "orange",
  },
  "Partial Update": {
    title: "Partial system update",
    message:
      "Most creator tools are available. Studio connector sync is updating in the background, so send-to-studio actions may wait briefly.",
    editor: "Available",
    connector: "Syncing",
    localEditing: "Available",
    eta: "7 minutes",
    progress: 82,
    tone: "orange",
  },
  Operational: {
    title: "System operational",
    message:
      "EVzone Effect Creator, local editing, preview tools and Studio connector services are available.",
    editor: "Available",
    connector: "Connected",
    localEditing: "Available",
    eta: "No downtime",
    progress: 100,
    tone: "green",
  },
};

const updateNotes = [
  {
    title: "Studio connector refresh",
    detail: "Scene binding, camera binding and runtime limit sync are being updated for more reliable live studio handoff.",
    status: "In progress",
  },
  {
    title: "Preview runtime patch",
    detail: "Improves device-frame switching, shader cache recovery and preview reload stability.",
    status: "Ready",
  },
  {
    title: "Local autosave protection",
    detail: "Strengthens local draft snapshots during system updates and connector pauses.",
    status: "Ready",
  },
  {
    title: "AI safety queue tuning",
    detail: "Improves review handling for high-motion VFX, script generation and studio-safe material prompts.",
    status: "Queued",
  },
];

const connectorTimeline = [
  { time: "13:20", event: "Maintenance window opened", status: "Complete" },
  { time: "13:23", event: "Studio connector paused for schema refresh", status: "Complete" },
  { time: "13:31", event: "Runtime limit sync updating", status: "In progress" },
  { time: "13:38", event: "Connector heartbeat validation", status: "Pending" },
  { time: "13:42", event: "Send-to-Studio actions resume", status: "Pending" },
];

const recoveryChecklist = [
  { title: "Local autosave active", detail: "Projects continue saving locally during maintenance.", complete: true },
  { title: "Offline editor enabled", detail: "Editor, assets, visual logic and preview cache remain accessible.", complete: true },
  { title: "Studio connector resume", detail: "Reconnect automatically after update validation.", complete: false },
  { title: "Send queue preserved", detail: "Pending send-to-studio packages will wait safely.", complete: true },
  { title: "Diagnostics available", detail: "Recovery & Diagnostics Center can collect logs if needed.", complete: true },
];

const safeSaveSteps = [
  "Keep the editor open until the local save indicator shows Saved.",
  "Use Save Local Snapshot before closing a project during maintenance.",
  "Avoid deleting local cache until the update finishes if you have unsent changes.",
  "If Studio connector is paused, continue editing locally and send after reconnect.",
  "Use Recovery & Diagnostics Center if a preview, export or bridge retry fails.",
];

export default function EVzoneMaintenanceSystemUpdatePage() {
  const [mode, setMode] = useState<SystemMode>("Maintenance");
  const [bottomTab, setBottomTab] = useState<BottomTab>("Update Notes");
  const [localSaved, setLocalSaved] = useState(false);
  const [retryingConnector, setRetryingConnector] = useState(false);
  const [connectorChecked, setConnectorChecked] = useState(false);
  const [noticeDismissed, setNoticeDismissed] = useState(false);

  const current = modeCopy[mode];

  const statusCards = useMemo(
    () => [
      {
        label: "Editor availability",
        value: current.editor,
        detail: mode === "Maintenance" ? "Editor opens in local-safe mode." : "Editor can open projects normally.",
        tone: current.editor.includes("Available") || current.editor.includes("available") ? "green" : "orange",
      },
      {
        label: "Studio connector status",
        value: connectorChecked ? "Rechecked" : current.connector,
        detail: connectorChecked ? "Latest connector status has been refreshed." : "Connector status updates automatically.",
        tone: current.connector === "Connected" || connectorChecked ? "green" : "orange",
      },
      {
        label: "Local editing availability",
        value: current.localEditing,
        detail: "Local editing, autosave and snapshots remain protected.",
        tone: "green",
      },
      {
        label: "Estimated recovery time",
        value: current.eta,
        detail: mode === "Operational" ? "No estimated recovery required." : "ETA can change as validation completes.",
        tone: mode === "Operational" ? "green" : "orange",
      },
    ],
    [current, mode, connectorChecked]
  );

  const renderBottomContent = () => {
    if (bottomTab === "Local Save Guide") {
      return (
        <div className="guide-grid">
          {safeSaveSteps.map((step) => (
            <div className="guide-card" key={step}>
              <span aria-hidden="true"><SaveRoundedIcon fontSize="small" /></span>
              <strong>{step}</strong>
            </div>
          ))}
        </div>
      );
    }

    if (bottomTab === "Connector Timeline") {
      return (
        <div className="timeline-grid">
          {connectorTimeline.map((item) => (
            <div className={`timeline-card ${item.status.toLowerCase().replace(" ", "-")}`} key={`${item.time}-${item.event}`}>
              <span>{item.time}</span>
              <strong>{item.event}</strong>
              <em>{item.status}</em>
            </div>
          ))}
        </div>
      );
    }

    if (bottomTab === "Recovery Checklist") {
      return (
        <div className="checklist-grid">
          {recoveryChecklist.map((item) => (
            <div className={`check-card ${item.complete ? "complete" : "pending"}`} key={item.title}>
              <span>{item.complete ? "✓" : "…"}</span>
              <div>
                <strong>{item.title}</strong>
                <small>{item.detail}</small>
              </div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="notes-grid">
        {updateNotes.map((note) => (
          <div className={`note-card ${note.status.toLowerCase().replace(" ", "-")}`} key={note.title}>
            <strong>{note.title}</strong>
            <span>{note.detail}</span>
            <em>{note.status}</em>
          </div>
        ))}
      </div>
    );
  };

  const handleConnectorRetry = () => {
    setRetryingConnector(true);
    window.setTimeout(() => {
      setRetryingConnector(false);
      setConnectorChecked(true);
      if (mode !== "Operational") setMode("Partial Update");
    }, 650);
  };

  return (
    <div className="evz-maintenance-page">
      <style>{styles}</style>

      <header className="topbar">
        <div className="brand-area">
          <div className="brand-mark">EV</div>
          <div>
            <div className="eyebrow">EVzone System Status</div>
            <h1>Maintenance / System Update</h1>
            <p>Clean status page for maintenance messages, editor availability, Studio connector updates, local editing and safe local save guidance.</p>
          </div>
        </div>
        <div className="top-actions">
          <span className={`status-chip ${current.tone}`}><i />{mode}</span>
          <button className="ghost-btn" onClick={handleConnectorRetry}>{retryingConnector ? "Checking..." : "Recheck Connector"}</button>
          <button className="ghost-btn" onClick={() => setLocalSaved(true)}>Save Local Snapshot</button>
          <button className="primary-btn" onClick={() => setMode("Operational")}>Mark Operational</button>
        </div>
      </header>

      <section className="status-hero">
        <div className="hero-card main">
          <div className={`status-orb ${current.tone}`}>
            <span>{current.progress}</span>
            <small>{mode === "Operational" ? "Online" : "Update"}</small>
          </div>
          <div>
            <div className="eyebrow">Maintenance message</div>
            <h2>{current.title}</h2>
            <p>{current.message}</p>
          </div>
        </div>
        {statusCards.map((card) => (
          <div className="hero-card mini" key={card.label}>
            <span>{card.label}</span>
            <strong className={card.tone}>{card.value}</strong>
            <small>{card.detail}</small>
          </div>
        ))}
      </section>

      <main className="maintenance-shell">
        <aside className="panel mode-panel">
          <div className="panel-head">
            <div>
              <div className="eyebrow">Status mode</div>
              <h2>System State</h2>
            </div>
          </div>
          <div className="mode-list">
            {(["Maintenance", "Partial Update", "Operational"] as SystemMode[]).map((item) => (
              <button key={item} className={mode === item ? "active" : ""} onClick={() => setMode(item)}>
                <span>{item === "Operational" ? "✓" : item === "Partial Update" ? "↻" : "!"}</span>
                <div>
                  <strong>{item}</strong>
                  <small>{modeCopy[item].message}</small>
                </div>
              </button>
            ))}
          </div>

          <div className="safe-card">
            <strong>Safe local save warning</strong>
            <span>Do not close the editor until your local save indicator shows Saved or a local snapshot has been created.</span>
          </div>
        </aside>

        <section className="panel main-panel">
          <div className="main-top">
            <div>
              <div className="eyebrow">Current maintenance state</div>
              <h2>{current.title}</h2>
              <p>{mode === "Operational" ? "All systems are available." : `Estimated recovery time: ${current.eta}.`}</p>
            </div>
            <div className="main-actions">
              <button className="ghost-btn" onClick={() => setNoticeDismissed(!noticeDismissed)}>{noticeDismissed ? "Show Notice" : "Dismiss Notice"}</button>
              <button className="ghost-btn" onClick={handleConnectorRetry}>{retryingConnector ? "Checking..." : "Retry Connector"}</button>
              <button className="primary-btn" onClick={() => setLocalSaved(true)}>Safe Local Save</button>
            </div>
          </div>

          <div className="content-panel">
            {!noticeDismissed ? (
              <div className={`maintenance-message ${current.tone}`}>
                <span className="message-icon">{current.tone === "green" ? "✓" : "!"}</span>
                <div>
                  <strong>{current.title}</strong>
                  <p>{current.message}</p>
                </div>
              </div>
            ) : null}

            <div className="progress-card">
              <div className="progress-head">
                <div>
                  <div className="eyebrow">Update progress</div>
                  <h3>{current.progress}% complete</h3>
                </div>
                <span className={current.tone}>{current.eta}</span>
              </div>
              <div className="progress-track"><b style={{ width: `${current.progress}%` }} /></div>
              <div className="progress-meta">
                <small>Editor: {current.editor}</small>
                <small>Connector: {connectorChecked ? "Rechecked" : current.connector}</small>
                <small>Local editing: {current.localEditing}</small>
              </div>
            </div>

            <div className="availability-grid">
              <AvailabilityCard title="Editor availability" value={current.editor} detail="Creator workspace, local project files, autosave and snapshots." tone={current.editor.includes("Available") || current.editor.includes("available") ? "green" : "orange"} />
              <AvailabilityCard title="Studio connector status" value={connectorChecked ? "Status refreshed" : current.connector} detail="Scene binding, camera binding, send queue and runtime rules." tone={connectorChecked || current.connector === "Connected" ? "green" : "orange"} />
              <AvailabilityCard title="Local editing availability" value={current.localEditing} detail="Continue editing locally while connector services recover." tone="green" />
              <AvailabilityCard title="Safe local save" value={localSaved ? "Snapshot created" : "Recommended"} detail={localSaved ? "Local snapshot saved for this update window." : "Create a local snapshot before closing the editor."} tone={localSaved ? "green" : "orange"} />
            </div>

            <div className="safe-save-warning">
              <div>
                <strong>{localSaved ? "Local snapshot created" : "Safe local save warning"}</strong>
                <span>{localSaved ? "Your work is protected locally during this system update." : "Save a local snapshot before closing, exporting, clearing cache, or waiting for connector recovery."}</span>
              </div>
              <button className="primary-btn" onClick={() => setLocalSaved(true)}>{localSaved ? "Saved" : "Save Local Snapshot"}</button>
            </div>
          </div>
        </section>

        <aside className="panel right-panel">
          <div className="panel-head">
            <div>
              <div className="eyebrow">Status Summary</div>
              <h2>Availability</h2>
            </div>
          </div>

          <div className="status-preview">
            <div className="stage-grid" />
            <div className="status-device">
              <div className="device-title">
                <span>EVzone Creator</span>
                <strong>{mode}</strong>
              </div>
              <div className="device-body">
                <div className={`pulse ${current.tone}`} />
                <div className="device-line one" />
                <div className="device-line two" />
                <div className="device-line three" />
              </div>
            </div>
          </div>

          <div className="summary-list">
            <SummaryRow label="Maintenance message" value={mode} tone={current.tone} />
            <SummaryRow label="Editor" value={current.editor} tone={current.editor.includes("Available") || current.editor.includes("available") ? "green" : "orange"} />
            <SummaryRow label="Studio connector" value={connectorChecked ? "Rechecked" : current.connector} tone={connectorChecked || current.connector === "Connected" ? "green" : "orange"} />
            <SummaryRow label="Local editing" value={current.localEditing} tone="green" />
            <SummaryRow label="Recovery time" value={current.eta} tone={mode === "Operational" ? "green" : "orange"} />
            <SummaryRow label="Local snapshot" value={localSaved ? "Created" : "Recommended"} tone={localSaved ? "green" : "orange"} />
          </div>

          <div className="right-notice">
            <strong>Clean status page</strong>
            <span>This page only communicates system availability and safe local save guidance. No account, login, billing or marketplace content is included.</span>
          </div>
        </aside>
      </main>

      <section className="panel bottom-panel">
        <div className="bottom-head">
          <div className="bottom-tabs">
            {(["Update Notes", "Local Save Guide", "Connector Timeline", "Recovery Checklist"] as BottomTab[]).map((tab) => (
              <button key={tab} className={bottomTab === tab ? "active" : ""} onClick={() => setBottomTab(tab)}>
                {tab}
              </button>
            ))}
          </div>
          <div className="bottom-actions">
            <button className="ghost-btn small" onClick={handleConnectorRetry}>Recheck Status</button>
            <button className="ghost-btn small" data-evz-autowire="1">Open Diagnostics</button>
            <button className="primary-btn small" onClick={() => setLocalSaved(true)}>Safe Local Save</button>
          </div>
        </div>
        <div className="bottom-content">
          {renderBottomContent()}
        </div>
      </section>
    </div>
  );
}

function AvailabilityCard({ title, value, detail, tone }: { title: string; value: string; detail: string; tone: StatusTone }) {
  return (
    <div className={`availability-card ${tone}`}>
      <span>{title}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
    </div>
  );
}

function SummaryRow({ label, value, tone }: { label: string; value: string; tone: StatusTone }) {
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
  --shadow-md: 0 18px 46px rgba(15,23,42,0.09);
  --radius-xl: 28px;
}
* { box-sizing: border-box; }
body { margin: 0; }
.evz-maintenance-page {
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
.hero-card,
.main-top,
.main-actions,
.bottom-head,
.bottom-tabs,
.bottom-actions,
.summary-row,
.progress-head {
  display: flex;
  align-items: center;
}
.brand-area { gap: 16px; max-width: 1020px; }
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
.maintenance-message p,
.safe-save-warning span,
.right-notice span {
  margin-bottom: 0;
  color: var(--evz-muted);
  line-height: 1.6;
}
.top-actions { justify-content: flex-end; gap: 10px; flex-wrap: wrap; }
.status-chip {
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
.status-chip.orange {
  color: var(--evz-orange);
  background: rgba(247,127,0,0.10);
  border-color: rgba(247,127,0,0.18);
}
.status-chip i {
  width: 9px;
  height: 9px;
  border-radius: 999px;
  background: currentColor;
  box-shadow: 0 0 0 6px rgba(3,205,140,0.13);
}
.ghost-btn,
.primary-btn,
.mode-list button,
.bottom-tabs button,
.availability-card,
.note-card,
.timeline-card,
.guide-card,
.check-card,
.summary-row {
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
.mode-list button:hover,
.bottom-tabs button:hover,
.availability-card:hover,
.note-card:hover,
.timeline-card:hover,
.guide-card:hover,
.check-card:hover {
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
.grey { color: var(--evz-medium); }
.status-hero {
  max-width: 100%;
  margin: 0 0 18px;
  border-radius: var(--radius-xl);
  padding: 18px;
  display: grid;
  grid-template-columns: 1.45fr repeat(4, minmax(145px, .3fr));
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
  font-size: 20px;
}
.status-orb {
  width: 104px;
  height: 104px;
  flex: 0 0 104px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  border: 10px solid rgba(3,205,140,0.16);
  background: var(--evz-card-solid);
}
.status-orb.orange { border-color: rgba(247,127,0,0.18); }
.status-orb span {
  color: var(--evz-green);
  font-size: 32px;
  font-weight: 900;
  line-height: 1;
}
.status-orb.orange span { color: var(--evz-orange); }
.status-orb small {
  margin-top: -20px;
  color: var(--evz-muted);
}
.maintenance-shell {
  max-width: 100%;
  margin: 0;
  display: grid;
  grid-template-columns: 310px minmax(720px, 1fr) 390px;
  gap: 18px;
}
.panel {
  border-radius: var(--radius-xl);
  overflow: hidden;
}
.mode-panel,
.main-panel,
.right-panel {
  min-height: 870px;
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
.mode-list {
  padding: 16px 18px;
  display: grid;
  gap: 10px;
}
.mode-list button {
  width: 100%;
  display: grid;
  grid-template-columns: 42px 1fr;
  gap: 12px;
  text-align: left;
  align-items: center;
}
.mode-list button.active {
  border-color: rgba(3,205,140,0.34);
  background: rgba(3,205,140,0.07);
}
.mode-list button > span,
.message-icon,
.guide-card > span,
.check-card > span {
  width: 38px;
  height: 38px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  color: white;
  background: var(--evz-green);
  font-weight: 900;
  font-size: 15px;
}
.mode-list button > span svg,
.guide-card > span svg,
.check-card > span svg {
  font-size: 22px;
}
.mode-list button div {
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
.content-panel {
  padding: 18px;
  display: grid;
  gap: 16px;
}
.maintenance-message {
  border: 1px solid var(--evz-soft-line);
  border-radius: 24px;
  background:
    radial-gradient(circle at 20% 20%, rgba(3,205,140,0.14), transparent 34%),
    var(--evz-card);
  padding: 18px;
  display: grid;
  grid-template-columns: 46px 1fr;
  gap: 14px;
}
.maintenance-message.orange {
  border-color: rgba(247,127,0,0.22);
  background:
    radial-gradient(circle at 20% 20%, rgba(247,127,0,0.14), transparent 34%),
    var(--evz-card);
}
.maintenance-message strong {
  font-size: 22px;
}
.progress-card,
.safe-save-warning,
.right-notice {
  border: 1px solid var(--evz-soft-line);
  border-radius: 24px;
  background: var(--evz-card-solid);
  padding: 16px;
  display: grid;
  gap: 12px;
}
.progress-head {
  justify-content: space-between;
  gap: 14px;
}
.progress-head h3 {
  margin: 4px 0 0;
  letter-spacing: -0.03em;
}
.progress-head span {
  font-size: 20px;
  font-weight: 900;
}
.progress-track {
  width: 100%;
  height: 12px;
  border-radius: 999px;
  background: rgba(148,163,184,0.17);
  overflow: hidden;
}
.progress-track b {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--evz-green), var(--evz-orange));
}
.progress-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.progress-meta small {
  border-radius: 999px;
  padding: 7px 9px;
  background: rgba(148,163,184,0.10);
}
.availability-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0,1fr));
  gap: 12px;
}
.availability-card {
  display: grid;
  gap: 7px;
  cursor: default;
}
.availability-card span {
  color: var(--evz-muted);
  font-size: 12px;
}
.availability-card.green strong { color: var(--evz-green); }
.availability-card.orange strong { color: var(--evz-orange); }
.safe-save-warning {
  grid-template-columns: 1fr auto;
  align-items: center;
}
.safe-save-warning div {
  display: grid;
  gap: 6px;
}
.safe-save-warning strong {
  color: var(--evz-orange);
}
.status-preview {
  margin: 16px 18px;
  position: relative;
  min-height: 250px;
  border-radius: 24px;
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
.status-device {
  position: absolute;
  inset: 28px;
  border-radius: 20px;
  background: var(--evz-card);
  border: 1px solid var(--evz-border);
  padding: 14px;
  display: grid;
  grid-template-rows: auto 1fr;
  gap: 18px;
}
.device-title {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}
.device-title span {
  color: var(--evz-muted);
  font-size: 12px;
  font-weight: 900;
}
.device-title strong {
  color: var(--evz-green);
  font-size: 12px;
}
.device-body {
  position: relative;
}
.pulse {
  width: 72px;
  height: 72px;
  border-radius: 24px;
  background: var(--evz-green);
  box-shadow: 0 0 0 18px rgba(3,205,140,0.10);
}
.pulse.orange {
  background: linear-gradient(135deg, var(--evz-orange), #fb923c);
  box-shadow: 0 0 0 18px rgba(247,127,0,0.10);
}
.device-line {
  position: absolute;
  left: 100px;
  right: 10px;
  height: 12px;
  border-radius: 999px;
  background: rgba(148,163,184,0.18);
}
.device-line.one { top: 10px; }
.device-line.two { top: 42px; right: 50px; }
.device-line.three { top: 74px; right: 90px; }
.summary-list {
  padding: 0 18px;
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
.right-notice {
  margin: 16px 18px 18px;
  border-color: rgba(247,127,0,0.20);
  background: var(--evz-warning-surface);
}
.right-notice strong {
  color: var(--evz-orange);
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
.notes-grid,
.timeline-grid,
.guide-grid,
.checklist-grid {
  display: grid;
  gap: 12px;
}
.notes-grid {
  grid-template-columns: repeat(4, minmax(0,1fr));
}
.note-card,
.timeline-card {
  display: grid;
  gap: 8px;
}
.note-card span {
  color: var(--evz-muted);
  line-height: 1.5;
}
.note-card em,
.timeline-card em {
  color: var(--evz-green);
  font-style: normal;
  font-size: 12px;
  font-weight: 900;
}
.note-card.in-progress em,
.note-card.queued em,
.timeline-card.in-progress em,
.timeline-card.pending em {
  color: var(--evz-orange);
}
.timeline-grid,
.guide-grid {
  grid-template-columns: repeat(5, minmax(0,1fr));
}
.timeline-card span {
  color: var(--evz-orange);
  font-size: 12px;
  font-weight: 900;
}
.guide-card {
  display: grid;
  gap: 10px;
  align-content: start;
}
.checklist-grid {
  grid-template-columns: repeat(5, minmax(0,1fr));
}
.check-card {
  display: grid;
  grid-template-columns: 42px 1fr;
  gap: 10px;
  align-items: start;
}
.check-card.pending > span {
  background: linear-gradient(135deg, var(--evz-orange), #fb923c);
}
.check-card div {
  display: grid;
  gap: 4px;
}
@media (max-width: 1500px) {
  .status-hero,
  .maintenance-shell {
    grid-template-columns: 300px 1fr;
  }
  .hero-card.main {
    grid-column: span 2;
  }
  .right-panel {
    grid-column: span 2;
    min-height: auto;
  }
  .availability-grid,
  .notes-grid,
  .timeline-grid,
  .guide-grid,
  .checklist-grid {
    grid-template-columns: repeat(2, minmax(0,1fr));
  }
}
@media (max-width: 1050px) {
  .topbar {
    flex-direction: column;
    align-items: flex-start;
  }
  .status-hero,
  .maintenance-shell {
    grid-template-columns: 1fr;
  }
  .hero-card.main,
  .right-panel {
    grid-column: auto;
  }
  .availability-grid,
  .notes-grid,
  .timeline-grid,
  .guide-grid,
  .checklist-grid {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 700px) {
  .evz-maintenance-page {
    padding: 14px;
  }
  .top-actions > *,
  .main-actions > * {
    width: 100%;
    justify-content: center;
  }
  .hero-card,
  .main-top,
  .bottom-head,
  .safe-save-warning,
  .maintenance-message {
    flex-direction: column;
    align-items: flex-start;
    grid-template-columns: 1fr;
  }
}
`;
