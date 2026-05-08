import React, { useMemo, useState } from "react";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import PermMediaRoundedIcon from "@mui/icons-material/PermMediaRounded";
import FactCheckRoundedIcon from "@mui/icons-material/FactCheckRounded";
import SensorsRoundedIcon from "@mui/icons-material/SensorsRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import CelebrationRoundedIcon from "@mui/icons-material/CelebrationRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";

type StepKey = "metadata" | "preview" | "quality" | "target" | "export" | "success";
type QualityStatus = "Pass" | "Ready" | "Warning" | "Missing";
type TargetScene = "Morning Show" | "Interview Desk" | "Guest Split" | "Countdown Scene" | "Finale";
type TargetCamera = "Host Camera" | "Guest Camera" | "Virtual Camera" | "Program Output";
type OverlayLayer = "Lower Third" | "Alert Layer" | "Scoreboard" | "Countdown" | "Transparent Overlay";

const steps: { key: StepKey; title: string; caption: string }[] = [
  { key: "metadata", title: "Effect metadata", caption: "Name, category, tags, description and notes" },
  { key: "preview", title: "Preview assets", caption: "Thumbnail, demo, before/after and GIF clip" },
  { key: "quality", title: "Final quality check", caption: "Performance, compatibility and readiness" },
  { key: "target", title: "Studio target", caption: "Scene, camera, overlay and triggers" },
  { key: "export", title: "Export package", caption: "Version, backup, QR and private preview" },
  { key: "success", title: "Success", caption: "Open, test, return or create another effect" },
];

const qualityChecks: { label: string; detail: string; status: QualityStatus; score: number }[] = [
  { label: "Performance", detail: "59.4 FPS, stable preview runtime", status: "Pass", score: 96 },
  { label: "File size", detail: "4.8 MB package, under studio budget", status: "Pass", score: 92 },
  { label: "Missing assets", detail: "All referenced assets resolved", status: "Pass", score: 100 },
  { label: "Compatibility", detail: "Studio, host camera and overlay ready", status: "Ready", score: 94 },
  { label: "Accessibility", detail: "Readability passed, motion review recommended", status: "Warning", score: 86 },
  { label: "Tracking stability", detail: "Face, gesture and fallback stable", status: "Pass", score: 95 },
  { label: "Runtime budget", detail: "GPU cost medium, fallback available", status: "Ready", score: 89 },
  { label: "Studio readiness", detail: "Bridge, controls and target bindings ready", status: "Pass", score: 97 },
];

const previewAssets = [
  { title: "Thumbnail capture", detail: "Hero thumbnail captured from studio preview", status: "Captured" },
  { title: "Demo video recording", detail: "12-second vertical and studio-frame clips", status: "Ready" },
  { title: "Before/after still", detail: "Comparison image generated for quality review", status: "Ready" },
  { title: "Preview GIF / clip", detail: "Short loop for private studio preview", status: "Ready" },
];

const scenes: TargetScene[] = ["Morning Show", "Interview Desk", "Guest Split", "Countdown Scene", "Finale"];
const cameras: TargetCamera[] = ["Host Camera", "Guest Camera", "Virtual Camera", "Program Output"];
const overlays: OverlayLayer[] = ["Lower Third", "Alert Layer", "Scoreboard", "Countdown", "Transparent Overlay"];

const controlOptions = [
  { label: "Start Effect", type: "Button", binding: "Control Surface A1" },
  { label: "Show Overlay", type: "Toggle", binding: "Control Surface A2" },
  { label: "VFX Intensity", type: "Slider", binding: "Control Surface S1" },
  { label: "Emergency Disable", type: "Protected Button", binding: "Shift + 2" },
];

const packageItems = [
  { name: "Effect package", value: "hologram_intro.effect", status: "Ready" },
  { name: "Version notes", value: "v12.5 studio-ready release", status: "Ready" },
  { name: "Local backup", value: "Created in EVzone backups", status: "Ready" },
  { name: "QR preview", value: "PREVIEW-9421", status: "Ready" },
  { name: "Private preview link", value: "Optional internal link", status: "Ready" },
];

const STEP_ICON_BY_KEY: Record<StepKey, typeof DescriptionRoundedIcon> = {
  metadata: DescriptionRoundedIcon,
  preview: PermMediaRoundedIcon,
  quality: FactCheckRoundedIcon,
  target: SensorsRoundedIcon,
  export: Inventory2RoundedIcon,
  success: CelebrationRoundedIcon,
};

export default function EVzoneSendToStudioWizard() {
  const [activeStep, setActiveStep] = useState<StepKey>("metadata");
  const [name, setName] = useState("Emerald Hologram Host Intro");
  const [category, setCategory] = useState("Face AR / Live Graphics");
  const [tags, setTags] = useState("host camera, hologram, lower-third, sparkle, live-safe");
  const [description, setDescription] = useState(
    "A premium EVzone live-show intro with face-safe hologram glow, orange sparkle accents, lower-third reveal, and studio button fallback."
  );
  const [internalNotes, setInternalNotes] = useState(
    "Use Balanced quality mode for live shows. Emergency disable is mapped to Shift + 2 and control surface hold."
  );
  const [scene, setScene] = useState<TargetScene>("Morning Show");
  const [camera, setCamera] = useState<TargetCamera>("Host Camera");
  const [overlay, setOverlay] = useState<OverlayLayer>("Lower Third");
  const [trigger, setTrigger] = useState("Scene Change + Studio Button");
  const [fallbackMode, setFallbackMode] = useState("Keep overlay, disable heavy VFX");
  const [privatePreview, setPrivatePreview] = useState(true);
  const [localBackup, setLocalBackup] = useState(true);
  const [versionNotes, setVersionNotes] = useState(
    "Final live-ready version with thumbnail, demo clip, fallback mode, control surface bindings, and quality report."
  );

  const activeIndex = steps.findIndex((step) => step.key === activeStep);
  const qualityScore = useMemo(() => Math.round(qualityChecks.reduce((sum, check) => sum + check.score, 0) / qualityChecks.length), []);
  const progress = Math.round(((activeIndex + 1) / steps.length) * 100);

  const goNext = () => setActiveStep(steps[Math.min(activeIndex + 1, steps.length - 1)].key);
  const goBack = () => setActiveStep(steps[Math.max(activeIndex - 1, 0)].key);

  const renderStepContent = () => {
    if (activeStep === "preview") {
      return (
        <div className="step-panel">
          <StepHeader eyebrow="Step 2" title="Preview assets" description="Capture all private studio preview assets before packaging the effect." />
          <div className="asset-preview-grid">
            {previewAssets.map((asset, index) => (
              <div className="preview-asset-card" key={asset.title}>
                <div className={`asset-art asset-${index + 1}`}>
                  <span>{asset.status}</span>
                </div>
                <strong>{asset.title}</strong>
                <small>{asset.detail}</small>
                <div className="button-row">
                  <button data-evz-autowire="1">{index === 0 ? "Capture" : index === 1 ? "Record" : "Regenerate"}</button>
                  <button data-evz-autowire="1">Preview</button>
                </div>
              </div>
            ))}
          </div>
          <div className="media-strip">
            <div className="media-frame before"><span>Before</span></div>
            <div className="media-frame after"><span>After</span></div>
            <div className="media-frame clip"><span>GIF / Clip</span></div>
          </div>
        </div>
      );
    }

    if (activeStep === "quality") {
      return (
        <div className="step-panel">
          <StepHeader eyebrow="Step 3" title="Final quality check" description="Run the final live-safe checks before sending the effect into EVzone Studio." />
          <div className="quality-hero">
            <div className="score-orb">
              <span>{qualityScore}</span>
              <small>Runtime Quality</small>
            </div>
            <div>
              <h3>Studio-ready with one polish warning</h3>
              <p>All critical checks passed. Accessibility recommends reducing motion intensity for long live segments.</p>
              <div className="quality-actions">
                <button className="primary-btn" data-evz-autowire="1">Run Full Quality Pass</button>
                <button className="ghost-btn" data-evz-autowire="1">Export Report</button>
              </div>
            </div>
          </div>
          <div className="quality-grid">
            {qualityChecks.map((check) => (
              <div className={`quality-card ${check.status.toLowerCase()}`} key={check.label}>
                <div>
                  <strong>{check.label}</strong>
                  <small>{check.detail}</small>
                </div>
                <em>{check.status}</em>
                <div className="range"><b style={{ width: `${check.score}%` }} /></div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (activeStep === "target") {
      return (
        <div className="step-panel">
          <StepHeader eyebrow="Step 4" title="Studio target" description="Choose exactly where and how the effect will appear in EVzone Live Studio." />
          <div className="target-grid">
            <SelectField title="Scene" value={scene} options={scenes} onChange={(value) => setScene(value as TargetScene)} />
            <SelectField title="Camera" value={camera} options={cameras} onChange={(value) => setCamera(value as TargetCamera)} />
            <SelectField title="Overlay layer" value={overlay} options={overlays} onChange={(value) => setOverlay(value as OverlayLayer)} />
            <label className="form-field">
              <span>Trigger</span>
              <select value={trigger} onChange={(event) => setTrigger(event.target.value)}>
                <option>Scene Change + Studio Button</option>
                <option>Studio Button Only</option>
                <option>Hotkey + Timer Trigger</option>
                <option>Live Segment Trigger</option>
                <option>Audio Beat Trigger</option>
              </select>
            </label>
            <label className="form-field">
              <span>Control surface</span>
              <select>
                <option>EVzone Operator Surface A</option>
                <option>Host Control Surface</option>
                <option>Game Segment Surface</option>
              </select>
            </label>
            <label className="form-field">
              <span>Fallback mode</span>
              <select value={fallbackMode} onChange={(event) => setFallbackMode(event.target.value)}>
                <option>Keep overlay, disable heavy VFX</option>
                <option>Disable particles only</option>
                <option>Switch to static lower third</option>
                <option>Emergency disable all effects</option>
              </select>
            </label>
          </div>

          <div className="studio-route-card">
            <div className="route-node">
              <span>Package</span>
              <strong>{name}</strong>
            </div>
            <div className="route-line" />
            <div className="route-node">
              <span>Target</span>
              <strong>{scene}</strong>
              <small>{camera} • {overlay}</small>
            </div>
            <div className="route-line" />
            <div className="route-node">
              <span>Trigger</span>
              <strong>{trigger}</strong>
              <small>{fallbackMode}</small>
            </div>
          </div>

          <div className="control-map-grid">
            {controlOptions.map((control) => (
              <div className="control-map-card" key={control.label}>
                <span>{control.type.slice(0, 2).toUpperCase()}</span>
                <div>
                  <strong>{control.label}</strong>
                  <small>{control.type} • {control.binding}</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (activeStep === "export") {
      return (
        <div className="step-panel">
          <StepHeader eyebrow="Step 5" title="Export package" description="Generate a private EVzone Studio package with version notes, backup, QR preview and private preview link." />
          <div className="export-layout">
            <div className="package-card">
              <div className="package-art">
                <span>EVZ</span>
              </div>
              <h3>{name}</h3>
              <p>Ready to generate a local EVzone Studio package. This is not a public marketplace publish flow.</p>
              <button className="primary-btn" data-evz-autowire="1">Generate Package</button>
            </div>

            <div className="export-options">
              <label className="form-field">
                <span>Version notes</span>
                <textarea value={versionNotes} onChange={(event) => setVersionNotes(event.target.value)} />
              </label>
              <label className="toggle-row">
                <div>
                  <strong>Create local backup</strong>
                  <small>Save a restore point before sending the package to Studio.</small>
                </div>
                <input type="checkbox" checked={localBackup} onChange={(event) => setLocalBackup(event.target.checked)} />
                <span className="toggle-visual" />
              </label>
              <label className="toggle-row">
                <div>
                  <strong>Create private preview link</strong>
                  <small>Internal private link for producer or operator review if needed.</small>
                </div>
                <input type="checkbox" checked={privatePreview} onChange={(event) => setPrivatePreview(event.target.checked)} />
                <span className="toggle-visual" />
              </label>
            </div>
          </div>

          <div className="package-list">
            {packageItems.map((item) => (
              <div className="package-row" key={item.name}>
                <span className="package-dot" />
                <div>
                  <strong>{item.name}</strong>
                  <small>{item.value}</small>
                </div>
                <em>{item.status}</em>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (activeStep === "success") {
      return (
        <div className="step-panel success-panel">
          <div className="success-badge">✓</div>
          <h2>Effect sent to EVzone Studio</h2>
          <p>
            {name} has been packaged, backed up, assigned to {scene}, bound to {camera}, and prepared for live testing.
          </p>
          <div className="success-actions">
            <button className="primary-btn" data-evz-autowire="1">Open in EVzone Studio</button>
            <button className="ghost-btn" data-evz-autowire="1">Test in Studio</button>
            <button className="ghost-btn" data-evz-autowire="1">Return to Editor</button>
            <button className="ghost-btn" data-evz-autowire="1">Create Another Effect</button>
          </div>
          <div className="success-summary">
            <div><span>Package</span><strong>v12.5</strong></div>
            <div><span>Quality Score</span><strong>{qualityScore}%</strong></div>
            <div><span>QR Preview</span><strong>PREVIEW-9421</strong></div>
            <div><span>Backup</span><strong>{localBackup ? "Created" : "Skipped"}</strong></div>
          </div>
        </div>
      );
    }

    return (
      <div className="step-panel">
        <StepHeader eyebrow="Step 1" title="Effect metadata" description="Name and describe the effect for the local EVzone Studio inventory." />
        <div className="metadata-grid">
          <label className="form-field">
            <span>Name</span>
            <input value={name} onChange={(event) => setName(event.target.value)} />
          </label>
          <label className="form-field">
            <span>Category</span>
            <select value={category} onChange={(event) => setCategory(event.target.value)}>
              <option>Face AR / Live Graphics</option>
              <option>Beauty Filter</option>
              <option>Studio Overlay</option>
              <option>Interactive Game</option>
              <option>VFX / Motion</option>
              <option>Virtual Set</option>
              <option>Audio Reactive</option>
            </select>
          </label>
          <label className="form-field full-span">
            <span>Tags</span>
            <input value={tags} onChange={(event) => setTags(event.target.value)} />
          </label>
          <label className="form-field full-span">
            <span>Description</span>
            <textarea value={description} onChange={(event) => setDescription(event.target.value)} />
          </label>
          <label className="form-field full-span">
            <span>Internal notes</span>
            <textarea value={internalNotes} onChange={(event) => setInternalNotes(event.target.value)} />
          </label>
        </div>
      </div>
    );
  };

  return (
    <div className="evz-send-page">
      <style>{styles}</style>

      <header className="topbar">
        <div className="brand-area">
          <div className="brand-mark">EV</div>
          <div>
            <div className="eyebrow">EVzone Effect Creator</div>
            <h1>Send to Studio Wizard</h1>
            <p>Finalize an effect, create preview assets, run final quality checks, package it, and send it into EVzone Live Studio.</p>
          </div>
        </div>
        <div className="top-actions">
          <span className="studio-chip"><i />Connected to EVzone Studio</span>
          <button className="ghost-btn" data-evz-autowire="1">Save Draft</button>
          <button className="ghost-btn" data-evz-autowire="1">Preview Package</button>
          <button className="primary-btn" data-evz-autowire="1">Send to Studio</button>
        </div>
      </header>

      <section className="wizard-hero">
        <div className="hero-card main">
          <div className="progress-orb">
            <span>{progress}%</span>
            <small>Wizard</small>
          </div>
          <div>
            <div className="eyebrow">Private studio send flow</div>
            <h2>{steps[activeIndex].title}</h2>
            <p>{steps[activeIndex].caption}. This is a local studio delivery workflow, not a public publishing or marketplace flow.</p>
          </div>
        </div>
        <div className="hero-card mini">
          <span>Quality</span>
          <strong className="green">{qualityScore}%</strong>
          <small>Final check score</small>
        </div>
        <div className="hero-card mini">
          <span>Package</span>
          <strong className="green">Ready</strong>
          <small>EVZ studio package</small>
        </div>
        <div className="hero-card mini">
          <span>Target</span>
          <strong className="orange">{scene}</strong>
          <small>{camera}</small>
        </div>
      </section>

      <main className="wizard-shell">
        <aside className="panel stepper-panel">
          <div className="panel-head">
            <div>
              <div className="eyebrow">Steps</div>
              <h2>Finalize Effect</h2>
            </div>
          </div>
          <div className="stepper-list">
            {steps.map((step, index) => {
              const isComplete = index < activeIndex;
              const isActive = step.key === activeStep;
              const StepIcon = isComplete ? CheckRoundedIcon : STEP_ICON_BY_KEY[step.key];
              return (
                <button key={step.key} className={`${isActive ? "active" : ""} ${isComplete ? "complete" : ""}`} onClick={() => setActiveStep(step.key)}>
                  <span aria-hidden="true"><StepIcon fontSize="small" /></span>
                  <div>
                    <strong>{step.title}</strong>
                    <small>{step.caption}</small>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="draft-card">
            <div className="eyebrow">Merged pages</div>
            <strong>Publish, metadata, thumbnail, quality, export, QR and success are now one wizard.</strong>
            <p>No login, no monetization, no public marketplace publishing.</p>
          </div>
        </aside>

        <section className="panel content-panel">
          <div className="content-top">
            <div>
              <div className="eyebrow">Current package</div>
              <h2>{name}</h2>
              <p>{category} • {scene} • {camera} • {overlay}</p>
            </div>
            <div className="content-actions">
              <button className="ghost-btn" disabled={activeIndex === 0} onClick={goBack}>Back</button>
              <button className="primary-btn" onClick={activeStep === "success" ? () => setActiveStep("metadata") : goNext}>
                {activeStep === "export" ? "Finish Send" : activeStep === "success" ? "Start Another" : "Continue"}
              </button>
            </div>
          </div>
          {renderStepContent()}
        </section>

        <aside className="panel summary-panel">
          <div className="panel-head">
            <div>
              <div className="eyebrow">Studio package</div>
              <h2>Send Summary</h2>
            </div>
          </div>

          <div className="live-preview-card">
            <div className="stage-grid" />
            <div className="preview-frame">
              <div className="host-avatar">
                <span className="head" />
                <span className="body" />
                <span className="glow" />
              </div>
              <div className="summary-lower-third">
                <strong>EVzone Live</strong>
                <small>{name}</small>
              </div>
              <div className="particle-field">
                {Array.from({ length: 18 }).map((_, index) => (
                  <i
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
            </div>
          </div>

          <div className="summary-list">
            <SummaryRow label="Metadata" value={name ? "Ready" : "Missing"} tone={name ? "green" : "orange"} />
            <SummaryRow label="Preview assets" value="4 ready" tone="green" />
            <SummaryRow label="Quality check" value={`${qualityScore}%`} tone="green" />
            <SummaryRow label="Studio target" value={`${scene} / ${camera}`} tone="green" />
            <SummaryRow label="Fallback mode" value="Ready" tone="green" />
            <SummaryRow label="Private preview" value={privatePreview ? "Enabled" : "Off"} tone={privatePreview ? "green" : "orange"} />
          </div>

          <div className="qr-mini">
            <div className="qr-grid">
              {Array.from({ length: 49 }).map((_, index) => (
                <span key={index} className={index % 3 === 0 || index % 7 === 0 ? "filled" : ""} />
              ))}
            </div>
            <div>
              <strong>QR Preview</strong>
              <small>PREVIEW-9421</small>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}

function StepHeader({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div className="step-header">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

function SelectField({
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
    <label className="form-field">
      <span>{title}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
    </label>
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
.evz-send-page {
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
.wizard-hero {
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
.wizard-hero,
.hero-card,
.content-top,
.content-actions,
.step-header,
.button-row,
.quality-actions,
.detail-actions,
.package-row,
.summary-row,
.qr-mini {
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
.hero-card p,
.content-top p,
.step-header p,
.package-card p,
.success-panel p,
.draft-card p {
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
.package-dot {
  width: 9px;
  height: 9px;
  border-radius: 999px;
  background: var(--evz-green);
  box-shadow: 0 0 0 6px rgba(3,205,140,0.13);
}
.ghost-btn,
.primary-btn,
.stepper-list button,
.form-field input,
.form-field select,
.form-field textarea,
.button-row button,
.quality-actions button,
.control-map-card,
.package-row,
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
.stepper-list button:hover,
.button-row button:hover,
.quality-actions button:hover,
.control-map-card:hover,
.package-row:hover {
  transform: translateY(-1px);
  box-shadow: 0 12px 24px rgba(15,23,42,0.08);
}
.primary-btn {
  color: white;
  border-color: transparent;
  background: linear-gradient(135deg, var(--evz-green), #10b981);
  box-shadow: 0 18px 36px rgba(3,205,140,0.25);
}
.ghost-btn:disabled {
  opacity: .5;
  cursor: not-allowed;
}
.green { color: var(--evz-green); }
.orange { color: var(--evz-orange); }
.wizard-hero {
  max-width: 100%;
  margin: 0 0 18px;
  border-radius: var(--radius-xl);
  padding: 18px;
  display: grid;
  grid-template-columns: 1.55fr repeat(3, minmax(150px, .35fr));
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
.progress-orb {
  width: 104px;
  height: 104px;
  flex: 0 0 104px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  border: 10px solid rgba(3,205,140,0.16);
  background: var(--evz-card-solid);
}
.progress-orb span {
  color: var(--evz-green);
  font-size: 28px;
  font-weight: 900;
  line-height: 1;
}
.progress-orb small {
  margin-top: -20px;
  color: var(--evz-muted);
}
.wizard-shell {
  max-width: 100%;
  margin: 0;
  display: grid;
  grid-template-columns: 310px minmax(720px, 1fr) 380px;
  gap: 18px;
}
.panel {
  border-radius: var(--radius-xl);
  overflow: hidden;
}
.stepper-panel,
.content-panel,
.summary-panel {
  min-height: 960px;
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
.stepper-list {
  padding: 16px 18px;
  display: grid;
  gap: 10px;
}
.stepper-list button {
  display: grid;
  grid-template-columns: 42px 1fr;
  gap: 12px;
  text-align: left;
  align-items: center;
}
.stepper-list button.active {
  border-color: rgba(3,205,140,0.34);
  background: rgba(3,205,140,0.07);
}
.stepper-list button.complete {
  border-color: rgba(3,205,140,0.22);
}
.stepper-list button > span {
  width: 38px;
  height: 38px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  color: white;
  background: var(--evz-green);
  font-weight: 900;
}
.stepper-list button > span svg {
  font-size: 22px;
}
.stepper-list button div {
  display: grid;
  gap: 4px;
}
small {
  color: var(--evz-muted);
  font-size: 12px;
  line-height: 1.45;
}
.draft-card {
  margin: 0 18px 18px;
  border: 1px solid rgba(247,127,0,0.20);
  border-radius: 22px;
  padding: 14px;
  background: var(--evz-warning-surface);
  display: grid;
  gap: 8px;
}
.content-panel {
  display: grid;
  grid-template-rows: auto 1fr;
}
.content-top {
  justify-content: space-between;
  gap: 18px;
  padding: 18px;
  border-bottom: 1px solid var(--evz-soft-line);
  background: var(--evz-card);
}
.content-top h2 {
  margin: 4px 0 6px;
  letter-spacing: -0.035em;
}
.content-actions {
  gap: 8px;
  justify-content: flex-end;
}
.step-panel {
  padding: 18px;
  display: grid;
  gap: 18px;
}
.step-header {
  justify-content: space-between;
  gap: 16px;
}
.step-header h3 {
  margin: 4px 0 8px;
  font-size: 26px;
  letter-spacing: -0.035em;
}
.metadata-grid,
.target-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}
.form-field {
  display: grid;
  gap: 8px;
}
.form-field.full-span {
  grid-column: 1 / -1;
}
.form-field span {
  color: var(--evz-muted);
  font-size: 12px;
  font-weight: 900;
}
.form-field input,
.form-field select,
.form-field textarea {
  width: 100%;
  cursor: text;
  font: inherit;
  color: var(--evz-ink);
  outline: none;
}
.form-field select {
  cursor: pointer;
}
.form-field textarea {
  min-height: 120px;
  resize: vertical;
}
.asset-preview-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0,1fr));
  gap: 14px;
}
.preview-asset-card {
  border: 1px solid var(--evz-soft-line);
  border-radius: 22px;
  padding: 14px;
  background: var(--evz-card-solid);
  display: grid;
  gap: 10px;
}
.asset-art,
.package-art,
.media-frame,
.history-art {
  min-height: 112px;
  border-radius: 18px;
  background:
    radial-gradient(circle at 26% 28%, rgba(3,205,140,0.40), transparent 28%),
    radial-gradient(circle at 70% 32%, rgba(247,127,0,0.30), transparent 30%),
    var(--evz-card);
  position: relative;
  overflow: hidden;
}
.asset-art span,
.media-frame span {
  position: absolute;
  left: 12px;
  top: 12px;
  border-radius: 999px;
  padding: 7px 10px;
  background: var(--evz-card);
  color: var(--evz-green);
  font-size: 11px;
  font-weight: 900;
}
.button-row {
  gap: 7px;
  flex-wrap: wrap;
}
.button-row button {
  padding: 8px 10px;
  color: var(--evz-muted);
  font-size: 12px;
}
.media-strip {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}
.media-frame {
  min-height: 190px;
}
.quality-hero {
  border-radius: 24px;
  border: 1px solid var(--evz-soft-line);
  background:
    radial-gradient(circle at 18% 20%, rgba(3,205,140,0.16), transparent 34%),
    var(--evz-card);
  padding: 18px;
  display: grid;
  grid-template-columns: 170px 1fr;
  gap: 20px;
  align-items: center;
}
.score-orb {
  width: 150px;
  height: 150px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  border: 12px solid rgba(3,205,140,0.16);
  background: var(--evz-card-solid);
}
.score-orb span {
  color: var(--evz-green);
  font-size: 42px;
  font-weight: 900;
  line-height: 1;
}
.score-orb small {
  margin-top: -28px;
  color: var(--evz-muted);
}
.quality-hero h3 {
  font-size: 26px;
  margin-bottom: 8px;
  letter-spacing: -0.035em;
}
.quality-actions {
  gap: 8px;
  margin-top: 14px;
}
.quality-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0,1fr));
  gap: 12px;
}
.quality-card {
  border: 1px solid var(--evz-soft-line);
  border-radius: 18px;
  background: var(--evz-card-solid);
  padding: 14px;
  display: grid;
  gap: 10px;
}
.quality-card div {
  display: grid;
  gap: 4px;
}
.quality-card em {
  font-style: normal;
  font-size: 12px;
  font-weight: 900;
}
.quality-card.pass em,
.quality-card.ready em {
  color: var(--evz-green);
}
.quality-card.warning em {
  color: var(--evz-orange);
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
.studio-route-card {
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
  min-width: 180px;
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
.route-node small {
  color: var(--evz-muted);
}
.route-line {
  width: 70px;
  height: 4px;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--evz-green), var(--evz-orange));
}
.control-map-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0,1fr));
  gap: 12px;
}
.control-map-card {
  display: grid;
  grid-template-columns: 42px 1fr;
  gap: 10px;
  text-align: left;
}
.control-map-card > span {
  width: 38px;
  height: 38px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  color: white;
  background: var(--evz-green);
  font-weight: 900;
}
.control-map-card div {
  display: grid;
  gap: 4px;
}
.export-layout {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 14px;
}
.package-card,
.export-options {
  border: 1px solid var(--evz-soft-line);
  border-radius: 24px;
  background: var(--evz-card-solid);
  padding: 16px;
  display: grid;
  gap: 12px;
}
.package-art {
  min-height: 180px;
  display: grid;
  place-items: center;
}
.package-art span {
  width: 78px;
  height: 78px;
  display: grid;
  place-items: center;
  color: white;
  border-radius: 24px;
  background: var(--evz-green);
  font-weight: 900;
  font-size: 22px;
}
.toggle-row {
  position: relative;
  border: 1px solid var(--evz-soft-line);
  border-radius: 18px;
  background: var(--evz-card);
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
.package-list {
  display: grid;
  gap: 10px;
}
.package-row {
  display: grid;
  grid-template-columns: 12px 1fr auto;
  align-items: center;
  gap: 12px;
}
.package-row div {
  display: grid;
  gap: 4px;
}
.package-row em {
  color: var(--evz-green);
  font-style: normal;
  font-size: 12px;
  font-weight: 900;
}
.success-panel {
  min-height: 660px;
  place-items: center;
  text-align: center;
  align-content: center;
}
.success-badge {
  width: 112px;
  height: 112px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  color: white;
  font-size: 48px;
  font-weight: 900;
  background: var(--evz-green);
  box-shadow: 0 26px 52px rgba(3,205,140,0.26);
}
.success-panel h2 {
  font-size: clamp(34px, 5vw, 54px);
  letter-spacing: -0.05em;
  margin-bottom: 0;
}
.success-panel p {
  max-width: 720px;
  font-size: 17px;
}
.success-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
}
.success-summary {
  width: 100%;
  max-width: 100%;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}
.success-summary div {
  border: 1px solid var(--evz-soft-line);
  border-radius: 18px;
  background: var(--evz-card-solid);
  padding: 14px;
  display: grid;
  gap: 5px;
}
.success-summary span {
  color: var(--evz-muted);
  font-size: 12px;
}
.success-summary strong {
  color: var(--evz-green);
}
.live-preview-card {
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
.preview-frame {
  position: absolute;
  inset: 26px;
  border-radius: 20px;
  background: var(--evz-card);
  border: 1px solid var(--evz-border);
  overflow: hidden;
}
.host-avatar {
  position: absolute;
  left: 50%;
  top: 24px;
  width: 120px;
  height: 170px;
  transform: translateX(-50%);
}
.host-avatar .head {
  position: absolute;
  left: 50%;
  top: 8px;
  width: 62px;
  height: 62px;
  transform: translateX(-50%);
  border-radius: 999px;
  background: linear-gradient(135deg, rgba(247,127,0,0.24), rgba(3,205,140,0.22));
}
.host-avatar .body {
  position: absolute;
  left: 18px;
  bottom: 0;
  width: 84px;
  height: 100px;
  border-radius: 58px 58px 18px 18px;
  background: linear-gradient(135deg, rgba(3,205,140,0.22), rgba(247,127,0,0.14));
}
.host-avatar .glow {
  position: absolute;
  left: 50%;
  top: 22px;
  width: 150px;
  height: 150px;
  transform: translateX(-50%);
  border-radius: 999px;
  background: radial-gradient(circle, rgba(3,205,140,0.24), transparent 62%);
  animation: pulseGlow 3s ease-in-out infinite;
}
@keyframes pulseGlow { 0%,100%{opacity:.55} 50%{opacity:1} }
.summary-lower-third {
  position: absolute;
  left: 8%;
  right: 8%;
  bottom: 16px;
  z-index: 4;
  border-radius: 15px;
  padding: 10px 12px;
  background: var(--evz-card);
  box-shadow: 0 14px 28px rgba(15,23,42,0.08);
  display: grid;
  gap: 2px;
}
.summary-lower-third strong { color: var(--evz-green); }
.summary-lower-third small { color: var(--evz-muted); }
.particle-field {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.particle {
  position: absolute;
  width: 9px;
  height: 9px;
  border-radius: 4px;
  background: var(--evz-green);
  animation: floatParticle 3s ease-in-out infinite;
}
.particle.p1 { background: var(--evz-orange); border-radius: 999px; }
.particle.p2 { width: 7px; height: 16px; background: rgba(3,205,140,0.70); }
.particle.p3 { width: 14px; height: 6px; background: rgba(247,127,0,0.76); }
.particle.p4 { background: var(--evz-card); box-shadow: 0 0 18px rgba(3,205,140,0.42); }
@keyframes floatParticle { 0%,100%{transform:translateY(0) rotate(0deg);opacity:.35} 50%{transform:translateY(-22px) rotate(80deg);opacity:1} }
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
.qr-mini {
  margin: 16px 18px 18px;
  border: 1px solid var(--evz-soft-line);
  border-radius: 22px;
  background: var(--evz-card-solid);
  padding: 14px;
  gap: 12px;
}
.qr-grid {
  width: 76px;
  height: 76px;
  padding: 6px;
  border-radius: 14px;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 3px;
  border: 1px solid var(--evz-line);
}
.qr-grid span {
  border-radius: 2px;
  background: rgba(148,163,184,0.18);
}
.qr-grid span.filled {
  background: var(--evz-ink);
}
@media (max-width: 1500px) {
  .wizard-hero,
  .wizard-shell {
    grid-template-columns: 300px 1fr;
  }
  .hero-card.main {
    grid-column: span 2;
  }
  .summary-panel {
    grid-column: span 2;
    min-height: auto;
  }
  .asset-preview-grid,
  .quality-grid,
  .control-map-grid {
    grid-template-columns: repeat(2, minmax(0,1fr));
  }
}
@media (max-width: 1050px) {
  .topbar {
    flex-direction: column;
    align-items: flex-start;
  }
  .wizard-hero,
  .wizard-shell {
    grid-template-columns: 1fr;
  }
  .hero-card.main,
  .summary-panel {
    grid-column: auto;
  }
  .metadata-grid,
  .target-grid,
  .export-layout,
  .success-summary {
    grid-template-columns: 1fr;
  }
  .quality-hero {
    grid-template-columns: 1fr;
    text-align: center;
    justify-items: center;
  }
}
@media (max-width: 700px) {
  .evz-send-page {
    padding: 14px;
  }
  .top-actions > *,
  .content-actions > * {
    width: 100%;
    justify-content: center;
  }
  .hero-card,
  .content-top,
  .step-header,
  .package-row,
  .qr-mini {
    flex-direction: column;
    align-items: flex-start;
  }
  .asset-preview-grid,
  .quality-grid,
  .control-map-grid,
  .media-strip {
    grid-template-columns: 1fr;
  }
  .studio-route-card {
    flex-direction: column;
    padding: 18px;
  }
  .route-line {
    width: 4px;
    height: 42px;
  }
}
`;
