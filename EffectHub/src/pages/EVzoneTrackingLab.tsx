import React, { useMemo, useState } from "react";

type LabMode =
  | "Face"
  | "Hand & Gestures"
  | "Body"
  | "World / Image / Object"
  | "Segmentation"
  | "Calibration";

type ToggleMap = Record<string, boolean>;

const EV_GREEN = "#03cd8c";
const EV_ORANGE = "#f77f00";

export default function EVzoneTrackingLab() {
  const modes: LabMode[] = [
    "Face",
    "Hand & Gestures",
    "Body",
    "World / Image / Object",
    "Segmentation",
    "Calibration",
  ];

  const [activeMode, setActiveMode] = useState<LabMode>("Face");
  const [previewDevice, setPreviewDevice] = useState("Studio Camera A");
  const [toggles, setToggles] = useState<ToggleMap>({
    "Face tracking": true,
    "Face landmarks": true,
    "Face mesh": true,
    "Face avatar drive": true,
    "Face mask camera": true,
    "Head tracking": true,
    Smile: true,
    Blink: true,
    Wink: false,
    "Mouth open": true,
    Eyebrows: true,
    "Head nod": false,
    "Head shake": false,
    "Hair segmentation": true,
    "Hand tracking": true,
    "Body tracking": true,
    "World anchors": true,
    "Person segmentation": true,
    "Depth occlusion": true,
  });

  const trackingSystems = useMemo(
    () => [
      { name: "Face Engine", score: 96, status: "Locked", detail: "468 landmarks • mesh active" },
      { name: "Hand Engine", score: 91, status: "Ready", detail: "21 landmarks per hand" },
      { name: "Body Pose", score: 88, status: "Ready", detail: "Full-body skeleton detected" },
      { name: "World AR", score: 82, status: "Scanning", detail: "Plane detection + anchors" },
      { name: "Segmentation", score: 93, status: "Clean", detail: "Person + hair mask active" },
      { name: "Object/Image", score: 79, status: "Standby", detail: "Targets loaded: 3" },
    ],
    []
  );

  const faceControls = [
    { label: "Skin smoothing", value: 62 },
    { label: "Makeup blend", value: 48 },
    { label: "Eye brightening", value: 56 },
    { label: "Face-safe intensity", value: 72 },
  ];

  const shapeControls = [
    "Slim face",
    "Thin nose",
    "Long chin",
    "Forehead",
    "Jawline",
    "Cheek lift",
    "Eye enlarge",
  ];

  const makeupControls = [
    "Clean skin",
    "Soft glam",
    "Lip color",
    "Blush",
    "Contour",
    "Eyelashes",
    "Eye shadow",
    "Freckles",
  ];

  const hairEffects = ["Hair color", "Hair glow", "Hair segmentation", "Highlight streaks"];

  const gestures = ["Wave", "Peace sign", "Pinch", "Open palm", "Fist", "Thumbs up"];

  const bodyTools = [
    "Body / pose tracking",
    "Body avatar drive",
    "Clothing try-on templates",
    "Character drive templates",
    "Dance trails",
    "Pose-triggered VFX",
  ];

  const worldTools = [
    "World AR placement",
    "Plane detection",
    "Anchors",
    "Image tracking",
    "Object tracking",
    "Floor / wall / table targeting",
  ];

  const segmentationTools = [
    "Person segmentation",
    "Background removal",
    "Green screen enhancement",
    "Hair segmentation",
    "Depth mask",
    "Foreground edge refinement",
    "Depth and occlusion",
  ];

  const toggle = (key: string) => setToggles((prev) => ({ ...prev, [key]: !prev[key] }));

  const renderToggle = (label: string, caption?: string) => (
    <button
      key={label}
      className={`toggle-card ${toggles[label] ? "active" : ""}`}
      onClick={() => toggle(label)}
      type="button"
    >
      <span className="toggle-copy">
        <strong>{label}</strong>
        {caption ? <small>{caption}</small> : null}
      </span>
      <span className="toggle-knob" />
    </button>
  );

  const renderActiveControlPanel = () => {
    if (activeMode === "Face") {
      return (
        <div className="control-stack">
          <SectionTitle eyebrow="Core face AR" title="Face Tracking System" />
          <div className="toggle-grid">
            {[
              "Face tracking",
              "Face landmarks",
              "Face mesh",
              "Face avatar drive",
              "Face mask camera",
              "Head tracking",
            ].map((item) => renderToggle(item))}
          </div>

          <SectionTitle eyebrow="Expression triggers" title="Live Expression Builder" />
          <div className="chip-grid">
            {["Smile", "Blink", "Wink", "Mouth open", "Eyebrows", "Head nod", "Head shake"].map((item) => (
              <button key={item} className={`trigger-chip ${toggles[item] ? "active" : ""}`} onClick={() => toggle(item)}>
                <span className="pulse-dot" />
                {item}
              </button>
            ))}
          </div>

          <SectionTitle eyebrow="Beauty + makeup" title="Broadcast-Safe Retouch Controls" />
          <div className="slider-list">
            {faceControls.map((control) => (
              <div className="slider-row" key={control.label}>
                <div className="slider-label">
                  <span>{control.label}</span>
                  <strong>{control.value}%</strong>
                </div>
                <div className="range"><span style={{ width: `${control.value}%` }} /></div>
              </div>
            ))}
          </div>

          <div className="dual-list">
            <FeatureMini title="Makeup Controls" items={makeupControls} />
            <FeatureMini title="Face Shape Controls" items={shapeControls} />
            <FeatureMini title="Hair Effects" items={hairEffects} />
          </div>
        </div>
      );
    }

    if (activeMode === "Hand & Gestures") {
      return (
        <div className="control-stack">
          <SectionTitle eyebrow="Hand tracking" title="Gesture Builder" />
          {renderToggle("Hand tracking", "Two-hand landmark detection")}
          <div className="gesture-grid">
            {gestures.map((gesture) => (
              <button className="gesture-card" key={gesture} data-evz-autowire="1">
                <span className="gesture-icon">{gesture === "Pinch" ? "⌁" : gesture === "Peace sign" ? "✌" : "✦"}</span>
                <strong>{gesture}</strong>
                <small>Map to VFX, scene, overlay, or studio trigger</small>
              </button>
            ))}
          </div>
          <SectionTitle eyebrow="Studio mapping" title="Gesture-to-Studio Actions" />
          <div className="mapping-card">
            <div>
              <strong>Wave</strong>
              <span>→ Trigger sparkle intro on Host Camera</span>
            </div>
            <div>
              <strong>Thumbs up</strong>
              <span>→ Reveal lower-third and applause SFX</span>
            </div>
            <div>
              <strong>Pinch</strong>
              <span>→ Freeze frame + highlight overlay</span>
            </div>
          </div>
        </div>
      );
    }

    if (activeMode === "Body") {
      return (
        <div className="control-stack">
          <SectionTitle eyebrow="Pose engine" title="Body / Character Tracking" />
          <div className="feature-grid">
            {bodyTools.map((item) => (
              <FeatureCard key={item} title={item} caption="Studio-ready module" />
            ))}
          </div>
          <SectionTitle eyebrow="Body avatar drive" title="Drive Templates" />
          <div className="template-strip">
            {["Presenter Avatar", "Dance Trail", "Outfit Preview", "Mascot Driver"].map((item) => (
              <div className="template-card" key={item}>
                <span />
                <strong>{item}</strong>
                <small>Live-safe preset</small>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (activeMode === "World / Image / Object") {
      return (
        <div className="control-stack">
          <SectionTitle eyebrow="Spatial tracking" title="World AR, Image & Object Tracking" />
          <div className="feature-grid">
            {worldTools.map((item) => (
              <FeatureCard key={item} title={item} caption="Bind to camera, scene, or overlay" />
            ))}
          </div>
          <div className="anchor-map">
            <div className="anchor-map-grid" />
            <div className="anchor-point a">A1</div>
            <div className="anchor-point b">B2</div>
            <div className="anchor-point c">C3</div>
            <div className="anchor-label">Detected plane with 3 persistent anchors</div>
          </div>
        </div>
      );
    }

    if (activeMode === "Segmentation") {
      return (
        <div className="control-stack">
          <SectionTitle eyebrow="Cutout engine" title="Segmentation + Background Control" />
          <div className="feature-grid">
            {segmentationTools.map((item) => (
              <FeatureCard key={item} title={item} caption="Preview, calibrate, and export to studio" />
            ))}
          </div>
          <div className="segmentation-preview">
            <div className="seg-avatar" />
            <div className="seg-layer layer-one">Person mask</div>
            <div className="seg-layer layer-two">Hair mask</div>
            <div className="seg-layer layer-three">Depth occlusion</div>
          </div>
        </div>
      );
    }

    return (
      <div className="control-stack">
        <SectionTitle eyebrow="Calibration" title="Tracking Calibration & Stability" />
        <div className="calibration-grid">
          {[
            ["Lighting", "Excellent", 94],
            ["Camera focus", "Stable", 91],
            ["Face lock", "Locked", 96],
            ["Gesture clarity", "Strong", 89],
            ["Depth confidence", "Good", 84],
            ["Studio latency", "11 ms", 98],
          ].map(([label, value, score]) => (
            <div className="calibration-card" key={label}>
              <div>
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
              <div className="range"><span style={{ width: `${score}%` }} /></div>
            </div>
          ))}
        </div>
        <div className="diagnostic-card">
          <h3>Calibration Actions</h3>
          <div className="button-row wrap">
            <button className="ghost-btn" data-evz-autowire="1">Run Tracker Scan</button>
            <button className="ghost-btn" data-evz-autowire="1">Recalibrate Camera</button>
            <button className="ghost-btn" data-evz-autowire="1">Refresh Anchors</button>
            <button className="primary-btn" data-evz-autowire="1">Save Calibration</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="evz-tracking-page">
      <style>{styles}</style>

      <header className="top-shell">
        <div className="brand-block">
          <div className="brand-mark">EV</div>
          <div>
            <div className="eyebrow">EVzone Effect Creator</div>
            <h1>Tracking Lab</h1>
            <p>Face, hand, body, world, image/object, segmentation, and calibration in one studio-native AR control room.</p>
          </div>
        </div>

        <div className="top-actions">
          <div className="studio-pill">
            <span />
            Connected to EVzone Live Studio
          </div>
          <select className="select-control" value={previewDevice} onChange={(e) => setPreviewDevice(e.target.value)}>
            <option>Studio Camera A</option>
            <option>Guest Camera B</option>
            <option>Virtual Camera</option>
            <option>Webcam Preview</option>
          </select>
          <button className="ghost-btn" data-evz-autowire="1">Preview in EVzone</button>
          <button className="primary-btn" data-evz-autowire="1">Apply to Editor</button>
        </div>
      </header>

      <main className="tracking-grid">
        <aside className="panel system-panel">
          <div className="panel-head">
            <div>
              <div className="eyebrow">System Readiness</div>
              <h2>Tracking Engines</h2>
            </div>
            <span className="score-badge">92%</span>
          </div>

          <div className="engine-list">
            {trackingSystems.map((system) => (
              <button
                key={system.name}
                data-evz-autowire="1"
                className={`engine-card ${system.score >= 90 ? "excellent" : system.score >= 84 ? "good" : "watch"}`}
              >
                <div className="engine-top">
                  <strong>{system.name}</strong>
                  <span>{system.status}</span>
                </div>
                <small>{system.detail}</small>
                <div className="range"><span style={{ width: `${system.score}%` }} /></div>
              </button>
            ))}
          </div>

          <div className="runtime-card">
            <div className="runtime-circle">
              <span>96</span>
              <small>Stability</small>
            </div>
            <div>
              <h3>Tracking Stability Score</h3>
              <p>Current camera and runtime conditions are ready for live studio use.</p>
              <div className="micro-grid">
                <span>Latency 11 ms</span>
                <span>FPS 59.4</span>
                <span>Jitter Low</span>
                <span>Fallback Ready</span>
              </div>
            </div>
          </div>
        </aside>

        <section className="panel preview-panel">
          <div className="mode-tabs">
            {modes.map((mode) => (
              <button key={mode} className={`mode-tab ${activeMode === mode ? "active" : ""}`} onClick={() => setActiveMode(mode)}>
                {mode}
              </button>
            ))}
          </div>

          <div className="preview-stage">
            <div className="stage-grid" />
            <div className="camera-frame">
              <div className="face-model">
                <div className="hair-shape" />
                <div className="face-shape">
                  {Array.from({ length: 28 }).map((_, index) => (
                    <span
                      key={index}
                      className="landmark"
                      style={{
                        left: `${18 + ((index * 17) % 64)}%`,
                        top: `${18 + ((index * 23) % 62)}%`,
                      }}
                    />
                  ))}
                  <div className="eye left" />
                  <div className="eye right" />
                  <div className="mouth" />
                  <div className="mesh-ring" />
                </div>
                <div className="neck" />
                <div className="shoulders" />
              </div>

              <div className="hand-skeleton">
                <span className="palm" />
                <span className="finger f1" />
                <span className="finger f2" />
                <span className="finger f3" />
                <span className="finger f4" />
              </div>

              <div className="pose-skeleton">
                <span className="joint head" />
                <span className="joint chest" />
                <span className="joint hip" />
                <span className="bone torso" />
                <span className="bone arm-left" />
                <span className="bone arm-right" />
                <span className="bone leg-left" />
                <span className="bone leg-right" />
              </div>

              <div className="plane-visual">
                <span>Plane detected</span>
              </div>
            </div>

            <div className="preview-overlay top-left">
              <strong>{activeMode}</strong>
              <span>{previewDevice} • Live-safe preview</span>
            </div>

            <div className="preview-overlay bottom-left">
              <div><strong>Face</strong><span>96%</span></div>
              <div><strong>Hand</strong><span>91%</span></div>
              <div><strong>Pose</strong><span>88%</span></div>
              <div><strong>Seg</strong><span>93%</span></div>
            </div>

            <div className="preview-overlay top-right">
              <button className="tiny-btn" data-evz-autowire="1">Before / After</button>
              <button className="tiny-btn" data-evz-autowire="1">Safe Area</button>
              <button className="tiny-btn" data-evz-autowire="1">Landmarks</button>
            </div>
          </div>

          <div className="under-preview">
            <div className="metric-card">
              <span>Active Trackers</span>
              <strong>6</strong>
            </div>
            <div className="metric-card">
              <span>Expression Triggers</span>
              <strong>7</strong>
            </div>
            <div className="metric-card">
              <span>Gesture Presets</span>
              <strong>6</strong>
            </div>
            <div className="metric-card">
              <span>Runtime Cost</span>
              <strong>Medium</strong>
            </div>
          </div>
        </section>

        <aside className="panel control-panel">
          {renderActiveControlPanel()}
        </aside>
      </main>

      <section className="bottom-suite">
        <div className="panel preset-panel">
          <div className="panel-head">
            <div>
              <div className="eyebrow">EVzone originals</div>
              <h2>Studio Tracking Templates</h2>
            </div>
            <button className="ghost-btn" data-evz-autowire="1">Browse All</button>
          </div>
          <div className="template-grid">
            {[
              ["AR Placement", "Place virtual props on floor, desk, or wall."],
              ["Segmentation Studio", "Clean subject cutout with depth-safe background."],
              ["Hand Gesture FX", "Wave, pinch, peace sign, and thumbs-up triggers."],
              ["Clothing Try-On", "Pose-aware outfit and accessory overlays."],
              ["Character Drive", "Control a mascot or avatar with face and pose."],
              ["Face Avatar Drive", "Drive facial animation with expressions."],
              ["Head Tracking", "Attach objects to head rotation and movement."],
              ["Face Inset", "Picture-in-face or reaction-frame effects."],
            ].map(([name, caption]) => (
              <div className="studio-template" key={name}>
                <div className="template-art" />
                <strong>{name}</strong>
                <span>{caption}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="panel diagnostics-panel">
          <div className="panel-head">
            <div>
              <div className="eyebrow">Diagnostics</div>
              <h2>Calibration Timeline</h2>
            </div>
            <button className="primary-btn" data-evz-autowire="1">Run Full Calibration</button>
          </div>
          <div className="timeline">
            {[
              ["Camera lock", "Passed", EV_GREEN],
              ["Face mesh", "Passed", EV_GREEN],
              ["Gesture detection", "Passed", EV_GREEN],
              ["World plane", "Needs brighter floor", EV_ORANGE],
              ["Studio bridge", "Passed", EV_GREEN],
            ].map(([label, status, color]) => (
              <div className="timeline-item" key={label}>
                <span style={{ background: color }} />
                <div>
                  <strong>{label}</strong>
                  <small>{status}</small>
                </div>
              </div>
            ))}
          </div>
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

function FeatureCard({ title, caption }: { title: string; caption: string }) {
  return (
    <div className="feature-card">
      <div className="feature-icon">✦</div>
      <strong>{title}</strong>
      <span>{caption}</span>
    </div>
  );
}

function FeatureMini({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="mini-feature-list">
      <strong>{title}</strong>
      {items.map((item) => (
        <span key={item}>{item}</span>
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
  --evz-card: var(--app-evz-card);
  --evz-line: var(--app-evz-line);
  --evz-soft-line: var(--app-evz-soft-line);
  --shadow-lg: 0 30px 80px rgba(15,23,42,0.12);
  --shadow-md: 0 18px 45px rgba(15,23,42,0.09);
  --radius-xl: 28px;
  --radius-lg: 20px;
  --radius-md: 15px;
}
* { box-sizing: border-box; }
body { margin: 0; }
.evz-tracking-page {
  min-height: 100vh;
  color: var(--evz-ink);
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  padding: 24px;
  background:
    radial-gradient(circle at 8% 8%, rgba(3,205,140,0.12), transparent 32%),
    radial-gradient(circle at 90% 12%, rgba(247,127,0,0.12), transparent 30%),
    var(--evz-app-bg);
}
.top-shell,
.panel {
  border: 1px solid var(--evz-soft-line);
  background: var(--evz-card);
  backdrop-filter: blur(18px);
  box-shadow: var(--shadow-md);
}
.top-shell {
  max-width: 100%;
  margin: 0 0 18px;
  border-radius: var(--radius-xl);
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}
.brand-block,
.top-actions,
.panel-head,
.engine-top,
.button-row,
.mode-tabs,
.chip-grid,
.under-preview,
.preview-overlay,
.timeline-item,
.slider-label {
  display: flex;
  align-items: center;
}
.brand-block { gap: 16px; max-width: 850px; }
.brand-mark {
  width: 56px;
  height: 56px;
  border-radius: 18px;
  display: grid;
  place-items: center;
  color: #fff;
  font-weight: 900;
  background: var(--evz-green);
  box-shadow: 0 18px 36px rgba(3,205,140,0.28);
}
.eyebrow {
  color: var(--evz-orange);
  font-size: 11px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.16em;
}
h1, h2, h3, p { margin-top: 0; }
.brand-block h1 {
  margin: 4px 0 6px;
  font-size: clamp(28px, 4vw, 44px);
  line-height: 1;
  letter-spacing: -0.04em;
}
.brand-block p {
  margin-bottom: 0;
  color: var(--evz-muted);
  line-height: 1.6;
}
.top-actions { gap: 10px; flex-wrap: wrap; justify-content: flex-end; }
.studio-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border-radius: 999px;
  padding: 10px 14px;
  color: var(--evz-green);
  font-weight: 800;
  font-size: 13px;
  background: rgba(3,205,140,0.10);
  border: 1px solid rgba(3,205,140,0.18);
}
.studio-pill span {
  width: 9px;
  height: 9px;
  border-radius: 999px;
  background: var(--evz-green);
  box-shadow: 0 0 0 6px rgba(3,205,140,0.12);
}
.select-control,
.ghost-btn,
.primary-btn,
.tiny-btn,
.mode-tab,
.trigger-chip,
.gesture-card {
  border: 1px solid var(--evz-line);
  border-radius: 14px;
  background: var(--evz-card-solid);
  color: var(--evz-ink);
  font-weight: 800;
  padding: 11px 13px;
  cursor: pointer;
  transition: 180ms ease;
}
.select-control { min-width: 190px; color: var(--evz-muted); }
.ghost-btn:hover,
.mode-tab:hover,
.trigger-chip:hover,
.gesture-card:hover,
.tiny-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 12px 24px rgba(15,23,42,0.08);
}
.primary-btn {
  color: white;
  border-color: transparent;
  background: linear-gradient(135deg, var(--evz-green), #11b981);
  box-shadow: 0 18px 34px rgba(3,205,140,0.25);
}
.tracking-grid {
  max-width: 100%;
  margin: 0;
  display: grid;
  grid-template-columns: 320px minmax(540px, 1fr) 430px;
  gap: 18px;
  align-items: stretch;
}
.panel {
  border-radius: var(--radius-xl);
  overflow: hidden;
}
.system-panel,
.control-panel {
  padding: 18px;
}
.panel-head {
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
}
.panel-head h2 {
  margin: 4px 0 0;
  font-size: 22px;
  letter-spacing: -0.03em;
}
.score-badge {
  width: 58px;
  height: 58px;
  border-radius: 18px;
  display: grid;
  place-items: center;
  color: white;
  font-weight: 900;
  background: var(--evz-green);
  box-shadow: 0 14px 26px rgba(3,205,140,0.20);
}
.engine-list {
  display: grid;
  gap: 12px;
}
.engine-card {
  width: 100%;
  text-align: left;
  border: 1px solid var(--evz-soft-line);
  background: var(--evz-card);
  border-radius: 18px;
  padding: 14px;
}
.engine-card small {
  display: block;
  color: var(--evz-muted);
  margin: 6px 0 10px;
}
.engine-top {
  justify-content: space-between;
  gap: 12px;
}
.engine-top span {
  font-size: 11px;
  font-weight: 900;
  color: var(--evz-green);
  padding: 6px 9px;
  border-radius: 999px;
  background: rgba(3,205,140,0.10);
}
.engine-card.watch .engine-top span {
  color: var(--evz-orange);
  background: rgba(247,127,0,0.10);
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
.runtime-card {
  margin-top: 16px;
  border-radius: 22px;
  padding: 16px;
  background:
    radial-gradient(circle at 20% 20%, rgba(3,205,140,0.16), transparent 38%),
    var(--evz-card);
  border: 1px solid rgba(3,205,140,0.16);
  display: grid;
  grid-template-columns: 92px 1fr;
  gap: 16px;
  align-items: center;
}
.runtime-circle {
  width: 86px;
  height: 86px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  border: 8px solid rgba(3,205,140,0.18);
  background: var(--evz-card-solid);
}
.runtime-circle span {
  display: block;
  font-size: 26px;
  font-weight: 900;
  line-height: 1;
}
.runtime-circle small { color: var(--evz-muted); font-size: 10px; margin-top: -12px; }
.runtime-card h3 { margin: 0 0 6px; font-size: 17px; }
.runtime-card p { color: var(--evz-muted); font-size: 13px; line-height: 1.45; margin-bottom: 12px; }
.micro-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}
.micro-grid span {
  border-radius: 999px;
  padding: 7px 9px;
  font-size: 11px;
  font-weight: 800;
  background: rgba(3,205,140,0.09);
  color: var(--evz-green);
}
.preview-panel {
  display: flex;
  flex-direction: column;
}
.mode-tabs {
  gap: 8px;
  padding: 16px;
  border-bottom: 1px solid var(--evz-soft-line);
  background: var(--evz-card);
  flex-wrap: wrap;
}
.mode-tab.active {
  color: white;
  border-color: transparent;
  background: linear-gradient(135deg, var(--evz-green), #10b981);
  box-shadow: 0 14px 24px rgba(3,205,140,0.22);
}
.preview-stage {
  position: relative;
  flex: 1;
  min-height: 650px;
  margin: 16px;
  border-radius: 28px;
  overflow: hidden;
  border: 1px solid rgba(3,205,140,0.16);
  background:
    radial-gradient(circle at 30% 16%, rgba(3,205,140,0.20), transparent 30%),
    radial-gradient(circle at 78% 16%, rgba(247,127,0,0.18), transparent 28%),
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
.camera-frame {
  position: absolute;
  inset: 70px 120px 86px;
  border-radius: 30px;
  border: 2px dashed rgba(15,23,42,0.16);
  background: var(--evz-card);
}
.face-model {
  position: absolute;
  left: 50%;
  top: 52%;
  width: 230px;
  height: 360px;
  transform: translate(-50%, -50%);
}
.hair-shape {
  position: absolute;
  left: 44px;
  top: 8px;
  width: 142px;
  height: 174px;
  border-radius: 80px 80px 55px 55px;
  background: linear-gradient(135deg, rgba(247,127,0,0.26), rgba(15,23,42,0.10));
  box-shadow: 0 28px 44px rgba(15,23,42,0.10);
}
.face-shape {
  position: absolute;
  left: 58px;
  top: 40px;
  width: 116px;
  height: 146px;
  border-radius: 52% 48% 48% 52%;
  background: linear-gradient(180deg, color-mix(in srgb, var(--evz-card-solid) 82%, #f59e0b 18%), color-mix(in srgb, var(--evz-card-solid) 72%, #f59e0b 28%));
  border: 1px solid rgba(247,127,0,0.18);
}
.eye {
  position: absolute;
  top: 56px;
  width: 13px;
  height: 13px;
  border-radius: 999px;
  background: #0f172a;
}
.eye.left { left: 30px; }
.eye.right { right: 30px; }
.mouth {
  position: absolute;
  left: 50%;
  bottom: 34px;
  width: 38px;
  height: 12px;
  transform: translateX(-50%);
  border-bottom: 3px solid rgba(247,127,0,0.55);
  border-radius: 999px;
}
.mesh-ring {
  position: absolute;
  inset: 8px;
  border: 1px solid rgba(3,205,140,0.30);
  border-radius: inherit;
}
.landmark {
  position: absolute;
  width: 5px;
  height: 5px;
  border-radius: 999px;
  background: var(--evz-green);
  box-shadow: 0 0 0 4px rgba(3,205,140,0.12);
}
.neck {
  position: absolute;
  left: 93px;
  top: 178px;
  width: 44px;
  height: 48px;
  background: color-mix(in srgb, var(--evz-card-solid) 72%, rgba(247,127,0,0.26));
  border-radius: 18px;
}
.shoulders {
  position: absolute;
  left: 20px;
  top: 218px;
  width: 190px;
  height: 88px;
  border-radius: 80px 80px 20px 20px;
  background: linear-gradient(135deg, rgba(3,205,140,0.22), rgba(247,127,0,0.13));
}
.hand-skeleton {
  position: absolute;
  right: 9%;
  top: 30%;
  width: 120px;
  height: 132px;
}
.hand-skeleton .palm {
  position: absolute;
  left: 38px;
  top: 58px;
  width: 44px;
  height: 46px;
  border-radius: 18px;
  border: 2px solid var(--evz-orange);
  background: rgba(247,127,0,0.08);
}
.finger {
  position: absolute;
  width: 10px;
  height: 58px;
  border-radius: 999px;
  background: rgba(247,127,0,0.35);
  transform-origin: bottom;
}
.f1 { left: 22px; top: 22px; transform: rotate(-28deg); }
.f2 { left: 43px; top: 8px; transform: rotate(-8deg); }
.f3 { left: 62px; top: 10px; transform: rotate(8deg); }
.f4 { left: 82px; top: 22px; transform: rotate(26deg); }
.pose-skeleton {
  position: absolute;
  left: 8%;
  bottom: 20%;
  width: 140px;
  height: 180px;
}
.joint {
  position: absolute;
  width: 13px;
  height: 13px;
  border-radius: 999px;
  background: var(--evz-green);
  box-shadow: 0 0 0 6px rgba(3,205,140,0.12);
}
.joint.head { left: 64px; top: 18px; }
.joint.chest { left: 64px; top: 70px; }
.joint.hip { left: 64px; top: 118px; }
.bone {
  position: absolute;
  height: 3px;
  border-radius: 999px;
  background: rgba(3,205,140,0.55);
  transform-origin: left center;
}
.bone.torso { width: 68px; left: 70px; top: 75px; transform: rotate(90deg); }
.bone.arm-left { width: 62px; left: 70px; top: 74px; transform: rotate(155deg); }
.bone.arm-right { width: 62px; left: 76px; top: 74px; transform: rotate(25deg); }
.bone.leg-left { width: 70px; left: 70px; top: 122px; transform: rotate(120deg); }
.bone.leg-right { width: 70px; left: 70px; top: 122px; transform: rotate(60deg); }
.plane-visual {
  position: absolute;
  left: 18%;
  right: 18%;
  bottom: 34px;
  height: 62px;
  border-radius: 50%;
  background: radial-gradient(ellipse, rgba(3,205,140,0.18), transparent 72%);
  border: 1px dashed rgba(3,205,140,0.34);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--evz-green);
  font-weight: 900;
  font-size: 12px;
}
.preview-overlay {
  position: absolute;
  gap: 8px;
  border-radius: 18px;
  padding: 12px 14px;
  background: var(--evz-card);
  border: 1px solid var(--evz-border);
  backdrop-filter: blur(16px);
  box-shadow: 0 12px 24px rgba(15,23,42,0.08);
}
.preview-overlay strong { font-size: 14px; }
.preview-overlay span { color: var(--evz-muted); font-size: 12px; }
.preview-overlay.top-left {
  left: 22px;
  top: 22px;
  flex-direction: column;
  align-items: flex-start;
}
.preview-overlay.top-right {
  right: 22px;
  top: 22px;
}
.preview-overlay.bottom-left {
  left: 22px;
  bottom: 22px;
  gap: 10px;
}
.preview-overlay.bottom-left div {
  display: grid;
  gap: 3px;
}
.tiny-btn {
  padding: 8px 10px;
  font-size: 12px;
}
.under-preview {
  gap: 12px;
  padding: 0 16px 16px;
  flex-wrap: wrap;
}
.metric-card {
  flex: 1;
  min-width: 120px;
  border-radius: 18px;
  padding: 14px;
  background: var(--evz-card-solid);
  border: 1px solid var(--evz-soft-line);
}
.metric-card span {
  display: block;
  color: var(--evz-muted);
  font-size: 12px;
  margin-bottom: 5px;
}
.metric-card strong {
  font-size: 22px;
  letter-spacing: -0.03em;
}
.control-panel {
  overflow: auto;
  max-height: 920px;
}
.control-stack {
  display: grid;
  gap: 16px;
}
.section-title span {
  color: var(--evz-orange);
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  font-weight: 900;
}
.section-title h3 {
  margin: 5px 0 0;
  letter-spacing: -0.03em;
}
.toggle-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
.toggle-card {
  min-height: 76px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  border-radius: 18px;
  border: 1px solid var(--evz-soft-line);
  background: var(--evz-card-solid);
  padding: 12px;
  text-align: left;
  cursor: pointer;
}
.toggle-card.active {
  border-color: rgba(3,205,140,0.34);
  background: rgba(3,205,140,0.07);
}
.toggle-copy {
  display: grid;
  gap: 4px;
}
.toggle-copy small {
  color: var(--evz-muted);
}
.toggle-knob {
  position: relative;
  flex: 0 0 42px;
  height: 24px;
  border-radius: 999px;
  background: rgba(148,163,184,0.25);
}
.toggle-knob::after {
  content: "";
  position: absolute;
  width: 18px;
  height: 18px;
  left: 3px;
  top: 3px;
  border-radius: 999px;
  background: var(--evz-card-solid);
  box-shadow: 0 4px 9px rgba(15,23,42,0.16);
  transition: 180ms ease;
}
.toggle-card.active .toggle-knob {
  background: rgba(3,205,140,0.60);
}
.toggle-card.active .toggle-knob::after {
  transform: translateX(18px);
}
.chip-grid {
  gap: 9px;
  flex-wrap: wrap;
}
.trigger-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.trigger-chip.active {
  color: white;
  background: linear-gradient(135deg, var(--evz-green), #10b981);
  border-color: transparent;
}
.pulse-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: currentColor;
  opacity: 0.75;
}
.slider-list {
  display: grid;
  gap: 12px;
}
.slider-row {
  border-radius: 16px;
  padding: 12px;
  background: var(--evz-card-solid);
  border: 1px solid var(--evz-soft-line);
}
.slider-label {
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 9px;
}
.slider-label span {
  color: var(--evz-muted);
}
.dual-list,
.feature-grid,
.gesture-grid,
.calibration-grid {
  display: grid;
  gap: 12px;
}
.dual-list {
  grid-template-columns: 1fr;
}
.mini-feature-list,
.feature-card,
.gesture-card,
.calibration-card,
.diagnostic-card,
.mapping-card,
.anchor-map,
.segmentation-preview {
  border-radius: 18px;
  background: var(--evz-card-solid);
  border: 1px solid var(--evz-soft-line);
  padding: 14px;
}
.mini-feature-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.mini-feature-list strong {
  flex-basis: 100%;
}
.mini-feature-list span {
  border-radius: 999px;
  padding: 7px 9px;
  background: rgba(148,163,184,0.10);
  color: var(--evz-muted);
  font-size: 12px;
  font-weight: 800;
}
.gesture-grid,
.feature-grid,
.calibration-grid {
  grid-template-columns: 1fr 1fr;
}
.gesture-card {
  min-height: 132px;
  display: grid;
  gap: 8px;
  text-align: left;
}
.gesture-icon,
.feature-icon {
  width: 38px;
  height: 38px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  color: var(--evz-green);
  background: rgba(3,205,140,0.11);
  font-size: 20px;
}
.gesture-card small,
.feature-card span,
.template-card small,
.studio-template span,
.timeline-item small {
  color: var(--evz-muted);
  line-height: 1.45;
}
.mapping-card {
  display: grid;
  gap: 10px;
}
.mapping-card div {
  display: grid;
  gap: 4px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--evz-soft-line);
}
.mapping-card div:last-child {
  border-bottom: 0;
  padding-bottom: 0;
}
.template-strip {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.template-card {
  border-radius: 18px;
  padding: 13px;
  background: var(--evz-card-solid);
  border: 1px solid var(--evz-soft-line);
  display: grid;
  gap: 8px;
}
.template-card span:first-child {
  height: 68px;
  border-radius: 14px;
  background:
    radial-gradient(circle at 26% 24%, rgba(3,205,140,0.35), transparent 28%),
    radial-gradient(circle at 70% 35%, rgba(247,127,0,0.25), transparent 30%),
    var(--evz-card);
}
.feature-card {
  display: grid;
  gap: 8px;
}
.anchor-map {
  position: relative;
  height: 230px;
  overflow: hidden;
  background: var(--evz-card);
}
.anchor-map-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(148,163,184,0.14) 1px, transparent 1px),
    linear-gradient(90deg, rgba(148,163,184,0.14) 1px, transparent 1px);
  background-size: 28px 28px;
}
.anchor-point {
  position: absolute;
  width: 44px;
  height: 44px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  color: white;
  font-weight: 900;
  background: var(--evz-green);
}
.anchor-point.a { left: 22%; top: 32%; }
.anchor-point.b { right: 26%; top: 24%; }
.anchor-point.c { left: 48%; bottom: 24%; }
.anchor-label {
  position: absolute;
  left: 18px;
  bottom: 18px;
  right: 18px;
  border-radius: 14px;
  padding: 12px;
  color: var(--evz-muted);
  background: var(--evz-card);
  font-weight: 800;
  font-size: 13px;
}
.segmentation-preview {
  position: relative;
  height: 260px;
  overflow: hidden;
  background:
    radial-gradient(circle at 50% 34%, rgba(3,205,140,0.18), transparent 30%),
    var(--evz-card);
}
.seg-avatar {
  position: absolute;
  left: 50%;
  top: 46%;
  width: 150px;
  height: 210px;
  transform: translate(-50%, -50%);
  border-radius: 70px 70px 50px 50px;
  background: linear-gradient(180deg, #f7d7bd, #f4c9aa);
  box-shadow: 0 0 0 12px rgba(3,205,140,0.12), 0 0 0 26px rgba(247,127,0,0.10);
}
.seg-layer {
  position: absolute;
  border-radius: 999px;
  padding: 8px 10px;
  color: white;
  font-size: 12px;
  font-weight: 900;
}
.layer-one { left: 28px; top: 36px; background: var(--evz-green); }
.layer-two { right: 28px; top: 82px; background: var(--evz-orange); }
.layer-three { left: 44px; bottom: 34px; background: #0f172a; }
.calibration-card {
  display: grid;
  gap: 12px;
}
.calibration-card div:first-child {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}
.calibration-card span {
  color: var(--evz-muted);
}
.diagnostic-card h3 {
  margin-bottom: 12px;
}
.wrap { flex-wrap: wrap; gap: 10px; }
.bottom-suite {
  max-width: 100%;
  margin: 18px auto 0;
  display: grid;
  grid-template-columns: 1.55fr 0.75fr;
  gap: 18px;
}
.preset-panel,
.diagnostics-panel {
  padding: 18px;
}
.template-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0,1fr));
  gap: 12px;
}
.studio-template {
  border-radius: 18px;
  border: 1px solid var(--evz-soft-line);
  background: var(--evz-card-solid);
  padding: 12px;
  display: grid;
  gap: 9px;
}
.template-art {
  height: 88px;
  border-radius: 16px;
  background:
    radial-gradient(circle at 24% 28%, rgba(3,205,140,0.35), transparent 26%),
    radial-gradient(circle at 72% 28%, rgba(247,127,0,0.30), transparent 28%),
    var(--evz-card);
}
.timeline {
  display: grid;
  gap: 13px;
}
.timeline-item {
  gap: 12px;
}
.timeline-item > span {
  width: 14px;
  height: 14px;
  border-radius: 999px;
  box-shadow: 0 0 0 7px rgba(148,163,184,0.12);
}
.timeline-item div {
  display: grid;
  gap: 3px;
}
@media (max-width: 1360px) {
  .tracking-grid { grid-template-columns: 300px 1fr; }
  .control-panel { grid-column: span 2; max-height: none; }
  .bottom-suite { grid-template-columns: 1fr; }
}
@media (max-width: 980px) {
  .top-shell { align-items: flex-start; flex-direction: column; }
  .tracking-grid { grid-template-columns: 1fr; }
  .control-panel { grid-column: auto; }
  .preview-stage { min-height: 560px; }
  .camera-frame { inset: 80px 40px 90px; }
  .template-grid { grid-template-columns: repeat(2, minmax(0,1fr)); }
}
@media (max-width: 680px) {
  .evz-tracking-page { padding: 14px; }
  .top-actions { width: 100%; justify-content: stretch; }
  .top-actions > * { flex: 1; min-width: 100%; }
  .toggle-grid,
  .gesture-grid,
  .feature-grid,
  .calibration-grid,
  .template-strip,
  .template-grid,
  .micro-grid { grid-template-columns: 1fr; }
  .camera-frame { inset: 95px 18px 110px; }
  .hand-skeleton,
  .pose-skeleton { display: none; }
  .preview-overlay.top-right { display: none; }
  .preview-overlay.bottom-left { right: 18px; flex-wrap: wrap; }
}
`;
