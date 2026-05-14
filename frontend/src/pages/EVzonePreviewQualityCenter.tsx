import React, { useMemo, useState } from "react";

type SourceMode = "Webcam" | "EVzone Studio Camera" | "Built-in Media" | "Custom Upload";
type SubjectMode = "Single Face" | "Multiple People" | "Hand Gesture" | "Pet/Object" | "Environment";
type RightTab = "Quality Score" | "Performance" | "Compatibility" | "Accessibility";
type BottomTab = "Optimization" | "Crash/Error" | "Test History" | "Feedback Notes";
type DeviceFrame = "Studio 16:9" | "Mobile 9:16" | "Square 1:1" | "Transparent Overlay";

const sourceModes: SourceMode[] = ["Webcam", "EVzone Studio Camera", "Built-in Media", "Custom Upload"];
const subjectModes: SubjectMode[] = ["Single Face", "Multiple People", "Hand Gesture", "Pet/Object", "Environment"];
const deviceFrames: DeviceFrame[] = ["Studio 16:9", "Mobile 9:16", "Square 1:1", "Transparent Overlay"];

const previewMedia = [
  { name: "Presenter Face", type: "Built-in person", status: "Ready" },
  { name: "Two Guests", type: "Multiple people", status: "Ready" },
  { name: "Hand Gesture Set", type: "Gesture preview", status: "Ready" },
  { name: "Pet/Object Scene", type: "Object preview", status: "Ready" },
  { name: "Studio Background", type: "Environment", status: "Ready" },
];

const effectStack = [
  { name: "Clean Broadcast Beauty", type: "Filter", load: 14, enabled: true },
  { name: "Emerald Hologram Intro", type: "AR/VFX", load: 28, enabled: true },
  { name: "Lower Third Reveal", type: "Overlay", load: 12, enabled: true },
  { name: "Smile Confetti Trigger", type: "Logic", load: 17, enabled: true },
  { name: "Soft Background Blur", type: "Segmentation", load: 21, enabled: false },
];

const profilerMetrics = [
  { label: "FPS", value: "59.4", score: 96, tone: "green" },
  { label: "Memory", value: "286 MB", score: 72, tone: "green" },
  { label: "CPU Cost", value: "31%", score: 64, tone: "green" },
  { label: "GPU Cost", value: "48%", score: 58, tone: "orange" },
  { label: "Draw Calls", value: "64", score: 70, tone: "green" },
  { label: "File Size", value: "4.8 MB", score: 82, tone: "green" },
  { label: "Texture Budget", value: "23 MB", score: 76, tone: "green" },
  { label: "Script Timing", value: "6.2 ms", score: 84, tone: "green" },
];

const compatibilityRows = [
  { label: "EVzone Studio", status: "Ready", detail: "All bindings and runtime limits loaded." },
  { label: "Host Camera", status: "Ready", detail: "Face and overlay effects stable." },
  { label: "Guest Camera", status: "Ready", detail: "Multiple-person fallback enabled." },
  { label: "Mobile Preview", status: "Warning", detail: "Disable background blur for older devices." },
  { label: "Transparent Overlay", status: "Ready", detail: "Alpha-safe lower-third and alert layers." },
];

const accessibilityChecks = [
  { label: "Flashing/motion warning", status: "Passed", tone: "green" },
  { label: "Readability check", status: "Passed", tone: "green" },
  { label: "Caption contrast", status: "Passed", tone: "green" },
  { label: "Motion intensity", status: "Review", tone: "orange" },
  { label: "Safe-area visibility", status: "Passed", tone: "green" },
];

const optimizationItems = [
  { title: "Compress two 1024px textures", result: "Save 9.2 MB", status: "Recommended" },
  { title: "Reduce confetti density by 12%", result: "Improve GPU cost", status: "Optional" },
  { title: "Merge lower-third animation curves", result: "Save 1.6 ms script time", status: "Recommended" },
  { title: "Create low-power fallback", result: "Mobile-safe preview", status: "Ready" },
  { title: "Remove unused blur preset", result: "Clean effect stack", status: "Optional" },
];

const crashReports = [
  { time: "12:44:20", title: "Preview reload", severity: "Info", detail: "Preview refreshed successfully after asset reload." },
  { time: "12:41:06", title: "Texture warning", severity: "Warning", detail: "chrome_reflection.hdr exceeds recommended mobile budget." },
  { time: "12:39:55", title: "Script check", severity: "Info", detail: "No runtime errors detected in latest session." },
  { time: "12:36:12", title: "Bridge heartbeat", severity: "Info", detail: "EVzone Studio bridge remained connected." },
];

const testSessions = [
  { title: "Studio Camera A", subject: "Host face", score: 94, duration: "05:32" },
  { title: "Mobile QR Preview", subject: "9:16 frame", score: 88, duration: "03:20" },
  { title: "Multiple Guests", subject: "2 people", score: 91, duration: "04:12" },
  { title: "Hand Gesture Set", subject: "Wave / pinch", score: 92, duration: "02:45" },
];

const feedbackNotes = [
  { author: "Producer note", text: "Lower-third reveal feels premium. Keep animation speed under 0.8 seconds for live intros." },
  { author: "Operator note", text: "Emergency disable and studio button fallback are ready for the host camera scene." },
  { author: "Quality note", text: "Consider reducing hologram glow for guests wearing bright clothing." },
];

export default function EVzonePreviewQualityCenter() {
  const [sourceMode, setSourceMode] = useState<SourceMode>("EVzone Studio Camera");
  const [subjectMode, setSubjectMode] = useState<SubjectMode>("Single Face");
  const [rightTab, setRightTab] = useState<RightTab>("Quality Score");
  const [bottomTab, setBottomTab] = useState<BottomTab>("Optimization");
  const [deviceFrame, setDeviceFrame] = useState<DeviceFrame>("Studio 16:9");
  const [beforeAfter, setBeforeAfter] = useState(true);
  const [qrOpen, setQrOpen] = useState(false);
  const [stack, setStack] = useState(effectStack);

  const qualityScore = useMemo(() => 92, []);

  const toggleStackItem = (name: string) => {
    setStack((previous) => previous.map((item) => item.name === name ? { ...item, enabled: !item.enabled } : item));
  };

  const activeCost = stack.reduce((total, item) => total + (item.enabled ? item.load : 0), 0);

  const renderPreviewSubject = () => {
    if (subjectMode === "Multiple People") {
      return (
        <div className="multi-subject">
          <PersonAvatar label="Host" />
          <PersonAvatar label="Guest" variant="orange" />
        </div>
      );
    }

    if (subjectMode === "Hand Gesture") {
      return (
        <div className="hand-preview">
          <span className="palm" />
          <span className="finger f1" />
          <span className="finger f2" />
          <span className="finger f3" />
          <span className="finger f4" />
          <div className="gesture-label">Wave / Pinch / Peace Sign</div>
        </div>
      );
    }

    if (subjectMode === "Pet/Object") {
      return (
        <div className="object-preview">
          <div className="pet-shape">
            <span className="ear left" />
            <span className="ear right" />
            <span className="eye left" />
            <span className="eye right" />
          </div>
          <div className="object-box">Tracked Object</div>
        </div>
      );
    }

    if (subjectMode === "Environment") {
      return (
        <div className="environment-preview">
          <div className="plane floor">Plane detected</div>
          <div className="wall left" />
          <div className="wall right" />
          <div className="floating-logo">EV</div>
        </div>
      );
    }

    return <PersonAvatar label="Host" />;
  };

  const renderRightPanel = () => {
    if (rightTab === "Performance") {
      return (
        <div className="panel-scroll">
          <SectionTitle eyebrow="Performance profiler" title="Broadcast Runtime Metrics" />
          <div className="metric-grid">
            {profilerMetrics.map((metric) => (
              <div className={`metric-card ${metric.tone}`} key={metric.label}>
                <div>
                  <span>{metric.label}</span>
                  <strong>{metric.value}</strong>
                </div>
                <div className="range"><b style={{ width: `${metric.score}%` }} /></div>
              </div>
            ))}
          </div>
          <div className="warning-card">
            <strong>GPU cost watch</strong>
            <span>Hologram glow and background blur together increase GPU cost. Keep one fallback ready for live studio use.</span>
          </div>
        </div>
      );
    }

    if (rightTab === "Compatibility") {
      return (
        <div className="panel-scroll">
          <SectionTitle eyebrow="Compatibility report" title="Device, Camera & Output Support" />
          <div className="compat-list">
            {compatibilityRows.map((item) => (
              <div className={`compat-row ${item.status.toLowerCase()}`} key={item.label}>
                <div>
                  <strong>{item.label}</strong>
                  <small>{item.detail}</small>
                </div>
                <em>{item.status}</em>
              </div>
            ))}
          </div>
          <div className="device-frame-card">
            <strong>Device frame preview</strong>
            <select value={deviceFrame} onChange={(event) => setDeviceFrame(event.target.value as DeviceFrame)}>
              {deviceFrames.map((frame) => <option key={frame}>{frame}</option>)}
            </select>
          </div>
          <button className="primary-btn full" onClick={() => setQrOpen(true)}>Open QR / Mobile Preview</button>
        </div>
      );
    }

    if (rightTab === "Accessibility") {
      return (
        <div className="panel-scroll">
          <SectionTitle eyebrow="Accessibility check" title="Safe Viewing & Readability" />
          <div className="accessibility-list">
            {accessibilityChecks.map((check) => (
              <div className={`accessibility-row ${check.tone}`} key={check.label}>
                <strong>{check.label}</strong>
                <span>{check.status}</span>
              </div>
            ))}
          </div>
          <div className="readability-card">
            <div className="sample-title">EVzone Live</div>
            <div className="sample-caption">Readable caption preview with safe contrast and motion intensity.</div>
          </div>
          <div className="warning-card">
            <strong>Motion intensity note</strong>
            <span>Hologram pulse is acceptable for studio use but should stay below high intensity during long segments.</span>
          </div>
        </div>
      );
    }

    return (
      <div className="panel-scroll">
        <SectionTitle eyebrow="Runtime quality score" title="Live-Ready Quality" />
        <div className="score-orb">
          <span>{qualityScore}</span>
          <small>Quality Score</small>
        </div>
        <div className="quality-breakdown">
          {[
            ["Visual polish", 94],
            ["Performance", 89],
            ["Tracking stability", 96],
            ["Accessibility", 91],
            ["Studio readiness", 95],
          ].map(([label, score]) => (
            <div className="quality-row" key={label}>
              <div>
                <strong>{label}</strong>
                <span>{score}%</span>
              </div>
              <div className="range"><b style={{ width: `${score}%` }} /></div>
            </div>
          ))}
        </div>
        <button className="primary-btn full" data-evz-autowire="1">Run Full Quality Check</button>
      </div>
    );
  };

  const renderBottomContent = () => {
    if (bottomTab === "Crash/Error") {
      return (
        <div className="report-grid">
          {crashReports.map((report) => (
            <div className={`report-card ${report.severity.toLowerCase()}`} key={`${report.time}-${report.title}`}>
              <span>{report.time}</span>
              <strong>{report.title}</strong>
              <em>{report.severity}</em>
              <small>{report.detail}</small>
            </div>
          ))}
        </div>
      );
    }

    if (bottomTab === "Test History") {
      return (
        <div className="history-grid">
          {testSessions.map((session) => (
            <div className="history-card" key={session.title}>
              <div className="history-art" />
              <div>
                <strong>{session.title}</strong>
                <small>{session.subject} • {session.duration}</small>
              </div>
              <em>{session.score}%</em>
            </div>
          ))}
        </div>
      );
    }

    if (bottomTab === "Feedback Notes") {
      return (
        <div className="feedback-grid">
          {feedbackNotes.map((note) => (
            <div className="feedback-card" key={note.author}>
              <strong>{note.author}</strong>
              <span>{note.text}</span>
            </div>
          ))}
          <div className="feedback-entry">
            <textarea placeholder="Add a test note, producer comment, or polish reminder..." />
            <button className="primary-btn" data-evz-autowire="1">Save Note</button>
          </div>
        </div>
      );
    }

    return (
      <div className="optimization-grid">
        {optimizationItems.map((item) => (
          <div className="optimization-card" key={item.title}>
            <div>
              <strong>{item.title}</strong>
              <small>{item.result}</small>
            </div>
            <em className={item.status === "Recommended" ? "orange" : "green"}>{item.status}</em>
            <button data-evz-autowire="1">Apply</button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="evz-preview-page">
      <style>{styles}</style>

      <header className="topbar">
        <div className="brand-area">
          <div className="brand-mark">EV</div>
          <div>
            <div className="eyebrow">EVzone Effect Creator</div>
            <h1>Preview & Quality Center</h1>
            <p>Test, polish, profile, compare, validate, and prepare effects before sending them to EVzone Live Studio.</p>
          </div>
        </div>
        <div className="top-actions">
          <span className="studio-chip"><i />Connected to EVzone Studio</span>
          <button className="ghost-btn" data-evz-autowire="1">Upload Image</button>
          <button className="ghost-btn" data-evz-autowire="1">Upload Video</button>
          <button className="primary-btn" data-evz-autowire="1">Send to Studio</button>
        </div>
      </header>

      <main className="preview-shell">
        <aside className="panel left-panel">
          <div className="panel-head">
            <div>
              <div className="eyebrow">Preview source</div>
              <h2>Camera & Media</h2>
            </div>
          </div>
          <div className="source-grid">
            {sourceModes.map((mode) => (
              <button key={mode} className={sourceMode === mode ? "active" : ""} onClick={() => setSourceMode(mode)}>
                {mode}
              </button>
            ))}
          </div>

          <div className="panel-section">
            <div className="section-title">
              <span>Subjects</span>
              <h3>Built-in preview people/media</h3>
            </div>
            <div className="subject-list">
              {subjectModes.map((mode) => (
                <button key={mode} className={subjectMode === mode ? "active" : ""} onClick={() => setSubjectMode(mode)}>
                  {mode}
                </button>
              ))}
            </div>
          </div>

          <div className="panel-section">
            <div className="section-title">
              <span>Media Library</span>
              <h3>Test Assets</h3>
            </div>
            <div className="media-list">
              {previewMedia.map((media) => (
                <div className="media-card" key={media.name}>
                  <span className="media-icon">PM</span>
                  <div>
                    <strong>{media.name}</strong>
                    <small>{media.type}</small>
                  </div>
                  <em>{media.status}</em>
                </div>
              ))}
            </div>
          </div>

          <div className="upload-card">
            <div className="upload-icon">＋</div>
            <strong>Custom media upload</strong>
            <span>Import custom images or videos for exact camera, lighting, or client testing.</span>
            <div className="upload-actions">
              <button data-evz-autowire="1">Image</button>
              <button data-evz-autowire="1">Video</button>
            </div>
          </div>
        </aside>

        <section className="panel center-panel">
          <div className="preview-toolbar">
            <div>
              <div className="eyebrow">Live preview</div>
              <h2>{sourceMode}</h2>
              <p>{subjectMode} • {deviceFrame} • effect stack cost {activeCost}%</p>
            </div>
            <div className="toolbar-actions">
              <button className={beforeAfter ? "active" : ""} onClick={() => setBeforeAfter(!beforeAfter)}>Before / After</button>
              <button onClick={() => setQrOpen(true)}>QR Preview</button>
              <button data-evz-autowire="1">Record Test</button>
            </div>
          </div>

          <div className={`preview-stage ${deviceFrame.toLowerCase().replace(/[^a-z0-9]/g, "-")} ${beforeAfter ? "compare" : ""}`}>
            <div className="stage-grid" />
            <div className="device-shell">
              <div className="before-pane">
                <span>Before</span>
                <div className="raw-preview">{renderPreviewSubject()}</div>
              </div>
              <div className="after-pane">
                <span>After</span>
                <div className="processed-preview">
                  {renderPreviewSubject()}
                  <div className="effect-glow" />
                  <div className="overlay-lower-third">
                    <strong>EVzone Live</strong>
                    <small>Preview-ready effect stack</small>
                  </div>
                  <div className="particle-field">
                    {Array.from({ length: 26 }).map((_, index) => (
                      <i
                        key={index}
                        className={`particle p${index % 5}`}
                        style={{
                          left: `${8 + ((index * 21) % 82)}%`,
                          top: `${8 + ((index * 29) % 78)}%`,
                          animationDelay: `${index * 0.12}s`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="safe-area" />
              <div className="fps-badge">59.4 FPS</div>
            </div>

            <div className="preview-card top-left">
              <strong>Preview Target</strong>
              <span>{deviceFrame} • {sourceMode}</span>
            </div>
            <div className="preview-card bottom-left">
              {profilerMetrics.slice(0, 4).map((metric) => (
                <div key={metric.label}>
                  <span>{metric.label}</span>
                  <strong className={metric.tone}>{metric.value}</strong>
                </div>
              ))}
            </div>
          </div>

          <div className="effect-stack-panel">
            <div className="stack-head">
              <div>
                <div className="eyebrow">Effect stack test</div>
                <h3>Combined effect runtime</h3>
              </div>
              <span className="stack-cost">Active cost {activeCost}%</span>
            </div>
            <div className="stack-list">
              {stack.map((item) => (
                <button key={item.name} className={`stack-item ${item.enabled ? "active" : ""}`} onClick={() => toggleStackItem(item.name)}>
                  <span className="stack-dot" />
                  <div>
                    <strong>{item.name}</strong>
                    <small>{item.type} • {item.load}% load</small>
                  </div>
                  <em>{item.enabled ? "On" : "Off"}</em>
                </button>
              ))}
            </div>
          </div>
        </section>

        <aside className="panel right-panel">
          <div className="right-tabs">
            {(["Quality Score", "Performance", "Compatibility", "Accessibility"] as RightTab[]).map((tab) => (
              <button key={tab} className={rightTab === tab ? "active" : ""} onClick={() => setRightTab(tab)}>
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
            {(["Optimization", "Crash/Error", "Test History", "Feedback Notes"] as BottomTab[]).map((tab) => (
              <button key={tab} className={bottomTab === tab ? "active" : ""} onClick={() => setBottomTab(tab)}>
                {tab}
              </button>
            ))}
          </div>
          <div className="bottom-actions">
            <button className="ghost-btn small" data-evz-autowire="1">Export Report</button>
            <button className="ghost-btn small" data-evz-autowire="1">Save Test Session</button>
            <button className="primary-btn small" data-evz-autowire="1">Run Full Quality Pass</button>
          </div>
        </div>
        <div className="bottom-content">
          {renderBottomContent()}
        </div>
      </section>

      {qrOpen && (
        <div className="qr-overlay" onClick={() => setQrOpen(false)}>
          <div className="qr-card" onClick={(event) => event.stopPropagation()}>
            <div className="qr-head">
              <div>
                <div className="eyebrow">QR / Mobile Preview</div>
                <h2>Scan to preview on device</h2>
                <p>Use this for mobile, hand gesture, multi-face, or live-camera field testing.</p>
              </div>
              <button className="ghost-btn" onClick={() => setQrOpen(false)}>Close</button>
            </div>
            <div className="qr-body">
              <div className="qr-code">
                {Array.from({ length: 49 }).map((_, index) => <span key={index} className={index % 3 === 0 || index % 7 === 0 ? "filled" : ""} />)}
              </div>
              <div className="qr-info">
                <strong>EVzone Mobile Preview</strong>
                <span>Session: PREVIEW-9421</span>
                <span>Device frame: {deviceFrame}</span>
                <span>Quality score: {qualityScore}%</span>
                <button className="primary-btn" data-evz-autowire="1">Copy Preview Link</button>
              </div>
            </div>
          </div>
        </div>
      )}
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

function PersonAvatar({ label, variant = "green" }: { label: string; variant?: "green" | "orange" }) {
  return (
    <div className={`person-avatar ${variant}`}>
      <span className="hair" />
      <span className="face">
        <i className="eye left" />
        <i className="eye right" />
        <i className="mouth" />
      </span>
      <span className="body" />
      <strong>{label}</strong>
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
.evz-preview-page {
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
.preview-toolbar,
.toolbar-actions,
.preview-card,
.stack-head,
.stack-list,
.right-tabs,
.bottom-head,
.bottom-tabs,
.bottom-actions,
.slider-head,
.quality-row > div,
.score-orb,
.device-frame-card,
.feedback-entry,
.qr-head,
.qr-body {
  display: flex;
  align-items: center;
}
.brand-area { gap: 16px; max-width: 980px; }
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
.preview-toolbar p,
.warning-card span,
.feedback-card span,
.qr-head p {
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
.source-grid button,
.subject-list button,
.toolbar-actions button,
.stack-item,
.right-tabs button,
.bottom-tabs button,
.optimization-card button,
.report-card,
.media-card,
.upload-actions button,
.qr-card button {
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
.source-grid button:hover,
.subject-list button:hover,
.toolbar-actions button:hover,
.stack-item:hover,
.right-tabs button:hover,
.bottom-tabs button:hover,
.optimization-card button:hover,
.upload-actions button:hover {
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
.preview-shell {
  max-width: 100%;
  margin: 0;
  display: grid;
  grid-template-columns: 310px minmax(680px, 1fr) 405px;
  gap: 18px;
}
.panel { border-radius: var(--radius-xl); overflow: hidden; }
.left-panel,
.right-panel,
.center-panel { min-height: 960px; }
.panel-head {
  justify-content: space-between;
  padding: 18px 18px 12px;
  border-bottom: 1px solid var(--evz-soft-line);
}
.panel-head h2 {
  margin: 4px 0 0;
  letter-spacing: -0.03em;
}
.source-grid {
  display: grid;
  gap: 10px;
  padding: 16px 18px;
}
.source-grid button.active,
.subject-list button.active,
.toolbar-actions button.active,
.right-tabs button.active,
.bottom-tabs button.active {
  color: white;
  border-color: transparent;
  background: linear-gradient(135deg, var(--evz-green), #10b981);
  box-shadow: 0 14px 26px rgba(3,205,140,0.19);
}
.panel-section {
  border-top: 1px solid var(--evz-soft-line);
  padding: 16px 18px;
  display: grid;
  gap: 12px;
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
.subject-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
}
.media-list {
  display: grid;
  gap: 10px;
}
.media-card {
  display: grid;
  grid-template-columns: 42px 1fr auto;
  gap: 10px;
  align-items: center;
  text-align: left;
  padding: 11px;
}
.media-icon {
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
.media-card div { display: grid; gap: 4px; }
small {
  color: var(--evz-muted);
  font-size: 12px;
  line-height: 1.45;
}
.media-card em {
  color: var(--evz-green);
  font-size: 11px;
  font-style: normal;
  font-weight: 900;
}
.upload-card {
  margin: 0 18px 18px;
  border: 2px dashed rgba(3,205,140,0.24);
  border-radius: 22px;
  padding: 18px;
  display: grid;
  gap: 10px;
  text-align: center;
  background: rgba(3,205,140,0.05);
}
.upload-icon {
  width: 46px;
  height: 46px;
  margin: 0;
  border-radius: 16px;
  display: grid;
  place-items: center;
  color: white;
  background: var(--evz-green);
  font-size: 22px;
  font-weight: 900;
}
.upload-card span { color: var(--evz-muted); font-size: 13px; }
.upload-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}
.center-panel {
  display: grid;
  grid-template-rows: auto 1fr auto;
}
.preview-toolbar {
  justify-content: space-between;
  gap: 18px;
  padding: 18px;
  border-bottom: 1px solid var(--evz-soft-line);
  background: var(--evz-card);
}
.preview-toolbar h2 {
  margin: 4px 0 6px;
  letter-spacing: -0.035em;
}
.toolbar-actions {
  gap: 8px;
  flex-wrap: wrap;
  justify-content: flex-end;
}
.toolbar-actions button {
  padding: 9px 11px;
  font-size: 12px;
}
.preview-stage {
  position: relative;
  margin: 16px;
  min-height: 610px;
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
.device-shell {
  position: absolute;
  inset: 70px 74px 86px;
  border-radius: 30px;
  border: 1px solid var(--evz-border);
  background:
    radial-gradient(circle at 50% 24%, rgba(3,205,140,0.14), transparent 30%),
    linear-gradient(180deg, var(--evz-frost-strong), var(--evz-frost-soft));
  box-shadow: inset 0 0 60px var(--evz-frost-soft), 0 30px 70px rgba(15,23,42,0.12);
  overflow: hidden;
  display: grid;
  grid-template-columns: 1fr 1fr;
}
.preview-stage.mobile-9-16 .device-shell {
  inset: 54px auto 62px 50%;
  width: 280px;
  transform: translateX(-50%);
  border: 10px solid #111827;
  border-radius: 34px;
}
.preview-stage.square-1-1 .device-shell {
  inset: 78px 170px 96px;
}
.preview-stage.transparent-overlay .device-shell {
  inset: 98px 92px 116px;
  background: repeating-conic-gradient(rgba(148,163,184,0.12) 0% 25%, transparent 0% 50%) 50% / 30px 30px;
}
.before-pane,
.after-pane {
  position: relative;
  display: grid;
  place-items: center;
  overflow: hidden;
}
.before-pane {
  background: var(--evz-card);
}
.after-pane {
  background:
    radial-gradient(circle at 45% 30%, rgba(3,205,140,0.10), transparent 34%),
    rgba(255,255,255,0.18);
}
.before-pane > span,
.after-pane > span {
  position: absolute;
  top: 14px;
  left: 14px;
  z-index: 5;
  border-radius: 999px;
  padding: 7px 10px;
  background: var(--evz-card);
  color: var(--evz-muted);
  font-size: 11px;
  font-weight: 900;
}
.preview-stage:not(.compare) .before-pane {
  display: none;
}
.preview-stage:not(.compare) .device-shell {
  grid-template-columns: 1fr;
}
.raw-preview,
.processed-preview {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
}
.person-avatar {
  position: relative;
  width: 160px;
  height: 245px;
}
.person-avatar .hair {
  position: absolute;
  left: 42px;
  top: 18px;
  width: 76px;
  height: 96px;
  border-radius: 52px 52px 28px 28px;
  background: linear-gradient(135deg, rgba(247,127,0,0.32), rgba(15,23,42,0.10));
}
.person-avatar.orange .hair {
  background: linear-gradient(135deg, rgba(3,205,140,0.32), rgba(247,127,0,0.12));
}
.person-avatar .face {
  position: absolute;
  left: 50%;
  top: 48px;
  width: 82px;
  height: 104px;
  transform: translateX(-50%);
  border-radius: 48% 52% 45% 55%;
  background: linear-gradient(180deg, color-mix(in srgb, var(--evz-card-solid) 82%, #f59e0b 18%), color-mix(in srgb, var(--evz-card-solid) 70%, #f59e0b 30%));
  border: 1px solid rgba(247,127,0,0.16);
}
.person-avatar .eye {
  position: absolute;
  top: 40px;
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: #0f172a;
}
.person-avatar .eye.left { left: 22px; }
.person-avatar .eye.right { right: 22px; }
.person-avatar .mouth {
  position: absolute;
  left: 50%;
  bottom: 24px;
  width: 34px;
  height: 10px;
  transform: translateX(-50%);
  border-bottom: 3px solid rgba(247,127,0,0.55);
  border-radius: 999px;
}
.person-avatar .body {
  position: absolute;
  left: 20px;
  bottom: 0;
  width: 120px;
  height: 108px;
  border-radius: 70px 70px 24px 24px;
  background: linear-gradient(135deg, rgba(3,205,140,0.22), rgba(247,127,0,0.14));
}
.person-avatar strong {
  position: absolute;
  left: 50%;
  bottom: -30px;
  transform: translateX(-50%);
  border-radius: 999px;
  padding: 8px 11px;
  color: var(--evz-green);
  background: var(--evz-card);
  font-size: 12px;
  white-space: nowrap;
}
.multi-subject {
  display: flex;
  gap: 34px;
  align-items: flex-end;
  justify-content: center;
}
.multi-subject .person-avatar {
  transform: scale(.82);
}
.hand-preview {
  position: relative;
  width: 220px;
  height: 260px;
}
.hand-preview .palm {
  position: absolute;
  left: 85px;
  top: 120px;
  width: 68px;
  height: 72px;
  border-radius: 24px;
  border: 3px solid var(--evz-orange);
  background: rgba(247,127,0,0.08);
}
.finger {
  position: absolute;
  width: 16px;
  height: 110px;
  border-radius: 999px;
  background: rgba(247,127,0,0.36);
  transform-origin: bottom;
}
.f1 { left: 56px; top: 50px; transform: rotate(-28deg); }
.f2 { left: 86px; top: 24px; transform: rotate(-8deg); }
.f3 { left: 116px; top: 28px; transform: rotate(8deg); }
.f4 { left: 146px; top: 54px; transform: rotate(26deg); }
.gesture-label,
.object-box,
.plane.floor,
.floating-logo {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 8px;
  border-radius: 999px;
  padding: 8px 11px;
  background: var(--evz-card-solid);
  color: var(--evz-green);
  font-size: 12px;
  font-weight: 900;
}
.object-preview {
  position: relative;
  width: 260px;
  height: 260px;
}
.pet-shape {
  position: absolute;
  left: 50%;
  top: 38px;
  width: 130px;
  height: 130px;
  transform: translateX(-50%);
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(166,166,166,0.30), rgba(3,205,140,0.16));
}
.pet-shape .ear {
  position: absolute;
  top: -18px;
  width: 44px;
  height: 44px;
  background: rgba(247,127,0,0.26);
  clip-path: polygon(50% 0, 100% 100%, 0 100%);
}
.pet-shape .ear.left { left: 12px; }
.pet-shape .ear.right { right: 12px; }
.pet-shape .eye {
  position: absolute;
  top: 56px;
  width: 12px;
  height: 12px;
  border-radius: 999px;
  background: #0f172a;
}
.pet-shape .eye.left { left: 42px; }
.pet-shape .eye.right { right: 42px; }
.environment-preview {
  position: relative;
  width: 330px;
  height: 260px;
}
.plane.floor {
  bottom: 28px;
  width: 240px;
  height: 72px;
  display: grid;
  place-items: center;
  border: 1px dashed rgba(3,205,140,0.34);
  background: radial-gradient(ellipse, rgba(3,205,140,0.16), transparent 72%);
}
.wall {
  position: absolute;
  top: 70px;
  width: 82px;
  height: 120px;
  border-radius: 18px;
  background: var(--evz-card);
  border: 1px solid var(--evz-border);
}
.wall.left { left: 28px; }
.wall.right { right: 28px; }
.floating-logo {
  top: 50px;
  bottom: auto;
  width: 58px;
  height: 58px;
  display: grid;
  place-items: center;
  color: white;
  background: var(--evz-green);
}
.effect-glow {
  position: absolute;
  left: 50%;
  top: 45%;
  width: 280px;
  height: 280px;
  transform: translate(-50%, -50%);
  border-radius: 999px;
  background: radial-gradient(circle, rgba(3,205,140,0.22), transparent 62%);
  pointer-events: none;
  animation: pulseGlow 3s ease-in-out infinite;
}
@keyframes pulseGlow {
  0%,100% { opacity:.55; }
  50% { opacity:1; }
}
.overlay-lower-third {
  position: absolute;
  left: 12%;
  right: 12%;
  bottom: 38px;
  z-index: 4;
  border-radius: 18px;
  padding: 12px 16px;
  background: var(--evz-card);
  box-shadow: 0 18px 36px rgba(15,23,42,0.10);
  display: grid;
  gap: 2px;
}
.overlay-lower-third strong { color: var(--evz-green); }
.overlay-lower-third small { color: var(--evz-muted); }
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
.safe-area {
  position: absolute;
  inset: 38px 48px;
  border: 1px dashed rgba(15,23,42,0.18);
  border-radius: 24px;
  pointer-events: none;
}
.fps-badge {
  position: absolute;
  right: 16px;
  top: 16px;
  z-index: 8;
  border-radius: 999px;
  padding: 8px 11px;
  color: var(--evz-green);
  background: var(--evz-card);
  font-size: 12px;
  font-weight: 900;
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
  grid-template-columns: repeat(4, minmax(72px, 1fr));
  gap: 12px;
}
.preview-card.bottom-left div { display: grid; gap: 4px; }
.preview-card.bottom-left span {
  color: var(--evz-muted);
  font-size: 11px;
}
.preview-card .green,
.green { color: var(--evz-green); }
.preview-card .orange,
.orange { color: var(--evz-orange); }
.effect-stack-panel {
  margin: 0 16px 16px;
  border: 1px solid var(--evz-soft-line);
  border-radius: 24px;
  background: var(--evz-card-solid);
  padding: 16px;
  display: grid;
  gap: 12px;
}
.stack-head {
  justify-content: space-between;
  gap: 12px;
}
.stack-head h3 { margin: 4px 0 0; }
.stack-cost {
  border-radius: 999px;
  padding: 8px 11px;
  color: var(--evz-orange);
  background: rgba(247,127,0,0.10);
  font-weight: 900;
  font-size: 12px;
}
.stack-list {
  gap: 9px;
  overflow-x: auto;
}
.stack-item {
  min-width: 210px;
  display: grid;
  grid-template-columns: 12px 1fr auto;
  gap: 10px;
  text-align: left;
  align-items: center;
}
.stack-item.active {
  border-color: rgba(3,205,140,0.28);
  background: rgba(3,205,140,0.06);
}
.stack-dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: var(--evz-medium);
}
.stack-item.active .stack-dot {
  background: var(--evz-green);
  box-shadow: 0 0 0 6px rgba(3,205,140,0.12);
}
.stack-item div { display: grid; gap: 4px; }
.stack-item em {
  font-style: normal;
  color: var(--evz-green);
  font-size: 12px;
}
.right-tabs {
  gap: 8px;
  flex-wrap: wrap;
  padding: 16px;
  border-bottom: 1px solid var(--evz-soft-line);
}
.right-tabs button,
.bottom-tabs button {
  padding: 9px 11px;
  font-size: 12px;
}
.panel-scroll {
  padding: 16px 18px 18px;
  display: grid;
  gap: 12px;
}
.metric-grid,
.quality-breakdown,
.compat-list,
.accessibility-list,
.optimization-grid,
.report-grid,
.history-grid,
.feedback-grid {
  display: grid;
  gap: 12px;
}
.metric-grid {
  grid-template-columns: 1fr 1fr;
}
.metric-card,
.quality-row,
.compat-row,
.accessibility-row,
.warning-card,
.readability-card,
.optimization-card,
.report-card,
.history-card,
.feedback-card,
.feedback-entry,
.device-frame-card {
  border: 1px solid var(--evz-soft-line);
  border-radius: 18px;
  background: var(--evz-card-solid);
  padding: 14px;
}
.metric-card {
  display: grid;
  gap: 10px;
}
.metric-card div:first-child {
  display: grid;
  gap: 5px;
}
.metric-card span,
.quality-row span {
  color: var(--evz-muted);
  font-size: 12px;
}
.metric-card strong {
  font-size: 20px;
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
.score-orb {
  width: 180px;
  height: 180px;
  margin: 8px auto;
  border-radius: 999px;
  display: grid;
  place-items: center;
  border: 14px solid rgba(3,205,140,0.16);
  background: var(--evz-card-solid);
  box-shadow: inset 0 0 40px rgba(3,205,140,0.08);
}
.score-orb span {
  font-size: 54px;
  font-weight: 900;
  line-height: 1;
  color: var(--evz-green);
}
.score-orb small {
  margin-top: -32px;
  color: var(--evz-muted);
}
.quality-row {
  display: grid;
  gap: 9px;
}
.quality-row > div {
  justify-content: space-between;
}
.quality-row > div span {
  color: var(--evz-green);
  font-weight: 900;
}
.compat-row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}
.compat-row div {
  display: grid;
  gap: 4px;
}
.compat-row em {
  font-size: 11px;
  font-style: normal;
  font-weight: 900;
}
.compat-row.ready em { color: var(--evz-green); }
.compat-row.warning em { color: var(--evz-orange); }
.device-frame-card {
  justify-content: space-between;
  gap: 12px;
}
.device-frame-card select {
  border: 1px solid var(--evz-line);
  border-radius: 12px;
  background: var(--evz-card-solid);
  padding: 10px;
  color: var(--evz-muted);
  font-weight: 800;
}
.accessibility-row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}
.accessibility-row span {
  font-weight: 900;
}
.accessibility-row.green span { color: var(--evz-green); }
.accessibility-row.orange span { color: var(--evz-orange); }
.readability-card {
  background:
    radial-gradient(circle at 15% 20%, rgba(3,205,140,0.14), transparent 32%),
    var(--evz-card);
}
.sample-title {
  font-size: 30px;
  font-weight: 900;
  color: var(--evz-green);
}
.sample-caption {
  margin-top: 8px;
  color: var(--evz-muted);
}
.warning-card {
  display: grid;
  gap: 6px;
  border-color: rgba(247,127,0,0.22);
  background: var(--evz-warning-surface);
}
.warning-card strong { color: var(--evz-orange); }
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
.optimization-grid,
.report-grid,
.history-grid {
  grid-template-columns: repeat(5, minmax(0,1fr));
}
.optimization-card {
  display: grid;
  gap: 9px;
}
.optimization-card div {
  display: grid;
  gap: 4px;
}
.optimization-card em {
  font-style: normal;
  font-size: 12px;
  font-weight: 900;
}
.optimization-card button {
  padding: 8px 10px;
  color: var(--evz-muted);
  font-size: 12px;
}
.report-card {
  display: grid;
  gap: 7px;
}
.report-card > span {
  color: var(--evz-muted);
  font-size: 12px;
}
.report-card em {
  font-style: normal;
  color: var(--evz-green);
  font-weight: 900;
}
.report-card.warning em { color: var(--evz-orange); }
.history-card {
  display: grid;
  grid-template-columns: 62px 1fr auto;
  gap: 12px;
  align-items: center;
}
.history-art {
  height: 62px;
  border-radius: 18px;
  background:
    radial-gradient(circle at 26% 28%, rgba(3,205,140,0.40), transparent 28%),
    radial-gradient(circle at 70% 32%, rgba(247,127,0,0.30), transparent 30%),
    var(--evz-card);
}
.history-card div { display: grid; gap: 4px; }
.history-card em {
  color: var(--evz-green);
  font-style: normal;
  font-weight: 900;
}
.feedback-grid {
  grid-template-columns: repeat(3, minmax(0,1fr)) 1.4fr;
}
.feedback-card {
  display: grid;
  gap: 8px;
}
.feedback-card strong { color: var(--evz-green); }
.feedback-entry {
  align-items: stretch;
  gap: 10px;
}
.feedback-entry textarea {
  flex: 1;
  min-height: 112px;
  border: 1px solid var(--evz-line);
  border-radius: 14px;
  padding: 12px;
  font: inherit;
  resize: vertical;
}
.qr-overlay {
  position: fixed;
  inset: 0;
  z-index: 80;
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgba(15,23,42,0.34);
}
.qr-card {
  width: 100%;
  max-width: 100%;
  border-radius: 28px;
  padding: 20px;
  background: var(--evz-card-solid);
  border: 1px solid var(--evz-soft-line);
  box-shadow: var(--shadow-lg);
  display: grid;
  gap: 16px;
}
.qr-head {
  justify-content: space-between;
  gap: 16px;
}
.qr-head h2 { margin: 4px 0 8px; }
.qr-body {
  gap: 20px;
  align-items: stretch;
}
.qr-code {
  width: 220px;
  height: 220px;
  padding: 14px;
  border-radius: 24px;
  background: var(--evz-card-solid);
  border: 1px solid var(--evz-line);
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
}
.qr-code span {
  border-radius: 6px;
  background: rgba(148,163,184,0.16);
}
.qr-code span.filled {
  background: var(--evz-ink);
}
.qr-info {
  flex: 1;
  border-radius: 22px;
  padding: 16px;
  background:
    radial-gradient(circle at 20% 20%, rgba(3,205,140,0.14), transparent 34%),
    var(--evz-card);
  display: grid;
  gap: 10px;
  align-content: center;
}
.qr-info strong {
  font-size: 22px;
}
.qr-info span {
  color: var(--evz-muted);
}
@media (max-width: 1500px) {
  .preview-shell {
    grid-template-columns: 300px 1fr;
  }
  .right-panel {
    grid-column: span 2;
    min-height: auto;
  }
  .optimization-grid,
  .report-grid,
  .history-grid {
    grid-template-columns: repeat(3, minmax(0,1fr));
  }
}
@media (max-width: 1050px) {
  .topbar {
    flex-direction: column;
    align-items: flex-start;
  }
  .preview-shell {
    grid-template-columns: 1fr;
  }
  .right-panel {
    grid-column: auto;
  }
  .device-shell {
    inset: 78px 28px 96px;
  }
  .feedback-grid,
  .optimization-grid,
  .report-grid,
  .history-grid {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 700px) {
  .evz-preview-page {
    padding: 14px;
  }
  .top-actions > * {
    width: 100%;
    justify-content: center;
  }
  .preview-toolbar,
  .bottom-head,
  .qr-head,
  .qr-body,
  .feedback-entry {
    flex-direction: column;
    align-items: stretch;
  }
  .device-shell {
    inset: 88px 14px 118px;
  }
  .preview-card.bottom-left {
    grid-template-columns: 1fr 1fr;
    right: 16px;
  }
  .stack-list {
    flex-direction: column;
    align-items: stretch;
  }
  .metric-grid {
    grid-template-columns: 1fr;
  }
  .qr-code {
    width: 100%;
    height: auto;
    aspect-ratio: 1;
  }
}
`;
