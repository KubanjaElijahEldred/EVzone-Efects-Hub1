"use client";


import React, { useMemo, useState } from "react";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded";
import SensorsRoundedIcon from "@mui/icons-material/SensorsRounded";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import DashboardCustomizeRoundedIcon from "@mui/icons-material/DashboardCustomizeRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";

/**
 * EVzone New Project Wizard
 * Premium, light-mode-first project starter for EVzone Effect Creator.
 *
 * EVzone palette from the provided colour file:
 * Green: #03cd8c | Orange: #f77f00 | Grey Medium: #a6a6a6 | Grey Light: #f2f2f2
 *
 * No authentication, no pricing, no account panel.
 */

type WizardStep = {
  id: string;
  label: string;
  eyebrow: string;
  title: string;
  description: string;
};

type WizardOption = {
  id: string;
  title: string;
  eyebrow: string;
  description: string;
  icon: string;
  badge?: string;
  meta?: string;
  recommended?: boolean;
};

type ProjectSettings = {
  name: string;
  category: string;
  aspectRatio: string;
  resolution: string;
  previewSource: string;
  studioDestination: string;
  runtimeBudget: string;
  starterAssets: string[];
};

const steps: WizardStep[] = [
  {
    id: "method",
    label: "Creation Method",
    eyebrow: "Step 01",
    title: "Choose how this effect begins",
    description:
      "Start from a blank canvas, generate with AI, remix an existing effect, or pull an overlay/preset directly from EVzone Live Studio.",
  },
  {
    id: "type",
    label: "Project Type",
    eyebrow: "Step 02",
    title: "Select the effect category",
    description:
      "Pick the creative direction so the wizard can prepare the right trackers, assets, starter logic, runtime budget, and studio controls.",
  },
  {
    id: "target",
    label: "Studio Target",
    eyebrow: "Step 03",
    title: "Choose where it will live inside EVzone Studio",
    description:
      "Bind the new project to a camera, overlay layer, transition, lower third, countdown, poll, or preview-only destination.",
  },
  {
    id: "settings",
    label: "Project Settings",
    eyebrow: "Step 04",
    title: "Finalize the project blueprint",
    description:
      "Set the name, aspect ratio, resolution, preview source, starter assets, destination, and live-safe runtime target.",
  },
  {
    id: "editor",
    label: "Open in Editor",
    eyebrow: "Step 05",
    title: "Ready to create in the Editor Workspace",
    description:
      "Review the generated project blueprint and open the professional editor with the right panels, assets, trackers, and studio bindings ready.",
  },
];

const creationMethods: WizardOption[] = [
  {
    id: "blank",
    title: "Blank Project",
    eyebrow: "Clean canvas",
    description: "Start with an empty studio-ready scene and build every component yourself.",
    icon: "✦",
    badge: "Manual",
    meta: "Best for custom systems",
  },
  {
    id: "ai-generated",
    title: "AI-Generated Project",
    eyebrow: "Prompt to effect",
    description: "Describe your idea and let EVzone prepare starter assets, logic, and visual direction.",
    icon: "✨",
    badge: "Modern",
    meta: "AI starter blueprint",
    recommended: true,
  },
  {
    id: "template",
    title: "Template Project",
    eyebrow: "Production ready",
    description: "Use a premium free template with prebuilt layout, assets, and studio-ready settings.",
    icon: "▦",
    badge: "Fast",
    meta: "Great for creators",
  },
  {
    id: "import",
    title: "Import Project",
    eyebrow: "Bring files in",
    description: "Import an existing project package, texture pack, 3D scene, scripts, or overlays.",
    icon: "⇪",
    badge: "Import",
    meta: "Package or assets",
  },
  {
    id: "remix",
    title: "Remix Existing Project",
    eyebrow: "Iterate safely",
    description: "Duplicate and transform an existing project without damaging the original version.",
    icon: "↺",
    badge: "Remix",
    meta: "Version safe",
  },
  {
    id: "studio-overlay",
    title: "Existing EVzone Studio Overlay",
    eyebrow: "Studio native",
    description: "Start from a title card, lower third, countdown, alert, or scene overlay already in Studio.",
    icon: "▣",
    badge: "Studio",
    meta: "Bridge connected",
  },
  {
    id: "studio-filter",
    title: "Existing Filter / Preset",
    eyebrow: "Upgrade current filters",
    description: "Convert current Beauty, Filter, AR, Background, Chroma, Gesture, or Time presets into a full project.",
    icon: "◐",
    badge: "Preset",
    meta: "From current studio",
  },
];

const projectTypes: WizardOption[] = [
  { id: "beauty", title: "Beauty Filter", eyebrow: "Camera polish", description: "Skin smoothing, clean tone, eye brightening, and live-safe enhancement.", icon: "✧", meta: "Face + camera" },
  { id: "makeup", title: "Makeup Effect", eyebrow: "Creative glam", description: "Lips, blush, contour, lashes, brows, freckles, and face paint layers.", icon: "◒", meta: "Face mesh" },
  { id: "face-ar", title: "Face AR", eyebrow: "Masks & props", description: "Face-attached objects, masks, stickers, mesh effects, and expression triggers.", icon: "☺", meta: "Face tracker", recommended: true },
  { id: "hair", title: "Hair Effect", eyebrow: "Hair style", description: "Hair color, highlights, glow, segmentation, and creative hair looks.", icon: "≋", meta: "Segmentation" },
  { id: "background", title: "Background Effect", eyebrow: "Scene control", description: "Blur, dim, black, virtual sets, bokeh, and studio backdrops.", icon: "▤", meta: "Person cutout" },
  { id: "chroma", title: "Chroma Key Setup", eyebrow: "Green / blue screen", description: "Custom keying, spill removal, tolerance, feather, and replacement scenes.", icon: "▧", meta: "Live keying" },
  { id: "segmentation", title: "Segmentation Effect", eyebrow: "Smart masks", description: "Person, hair, face, clothing, sky, and depth masks for premium composites.", icon: "◌", meta: "AI vision" },
  { id: "gesture", title: "Hand / Gesture Effect", eyebrow: "Interactive control", description: "Wave, peace sign, pinch, fist, open palm, and gesture-triggered VFX.", icon: "✋", meta: "Hand tracker" },
  { id: "body", title: "Body / Pose Effect", eyebrow: "Full-body AR", description: "Pose overlays, body particles, outfit-style placements, and motion triggers.", icon: "♢", meta: "Pose tracker" },
  { id: "world-ar", title: "World AR", eyebrow: "3D placement", description: "Floor, table, wall, portal, floating logo, and product mockup placement.", icon: "◈", meta: "3D scene" },
  { id: "image-object", title: "Image / Object Tracking", eyebrow: "Tracked targets", description: "Attach AR to logos, posters, objects, product cards, and branded signs.", icon: "⌖", meta: "Target tracking" },
  { id: "time-camera", title: "Time / Camera Effect", eyebrow: "Motion style", description: "Slow motion, fast motion, freeze, echo, zoom, shake, glitch, and VHS looks.", icon: "◷", meta: "Camera FX" },
  { id: "studio-overlay", title: "Studio Overlay", eyebrow: "Broadcast graphics", description: "Lower thirds, title cards, captions, alerts, scoreboards, and polls.", icon: "▰", meta: "2D overlay" },
  { id: "interactive-game", title: "Interactive / Game Effect", eyebrow: "Live participation", description: "Quizzes, randomizers, mini-games, prize wheels, score logic, and reward triggers.", icon: "◆", meta: "Logic + UI" },
  { id: "audio-reactive", title: "Audio-Reactive Effect", eyebrow: "Sound driven", description: "Beat pulses, voice meters, waveform glow, bass shake, and reactive particles.", icon: "♬", meta: "Audio input" },
  { id: "ai-stylized", title: "AI Stylized Effect", eyebrow: "Generative style", description: "AI-driven looks, backgrounds, textures, VFX variations, and creative transformations.", icon: "✺", meta: "AI assisted" },
];

const studioTargets: WizardOption[] = [
  { id: "host-camera", title: "Host Camera", eyebrow: "Primary talent", description: "Apply the effect to the main presenter camera inside EVzone Studio.", icon: "◎", meta: "Camera source", recommended: true },
  { id: "guest-camera", title: "Guest Camera", eyebrow: "Remote / guest", description: "Prepare the effect for guest or co-host camera sources.", icon: "◉", meta: "Camera source" },
  { id: "virtual-camera", title: "Virtual Camera", eyebrow: "Routed output", description: "Use the effect on a virtual camera or composited studio output.", icon: "▣", meta: "Virtual feed" },
  { id: "overlay-layer", title: "Overlay Layer", eyebrow: "Layered graphics", description: "Place the effect above camera/video as a transparent studio layer.", icon: "▥", meta: "Alpha safe" },
  { id: "scene-transition", title: "Scene Transition", eyebrow: "Between scenes", description: "Trigger the effect during switching, intros, outros, or scene changes.", icon: "⇄", meta: "Transition" },
  { id: "lower-third", title: "Lower Third", eyebrow: "Names & titles", description: "Create a branded title, name tag, guest label, or speaker identifier.", icon: "▂", meta: "Broadcast graphic" },
  { id: "countdown-scoreboard-poll", title: "Countdown / Scoreboard / Poll", eyebrow: "Live utility", description: "Build live timers, score panels, audience poll graphics, and result visuals.", icon: "◫", meta: "Interactive overlay" },
  { id: "mobile-preview", title: "Mobile Preview Only", eyebrow: "Testing mode", description: "Use this project for device testing without sending it to the main studio scene yet.", icon: "▯", meta: "Preview" },
  { id: "web-preview", title: "Web Preview Only", eyebrow: "Browser preview", description: "Generate a lightweight browser preview for review and internal testing.", icon: "⌁", meta: "Preview" },
];

const WIZARD_STEP_ICON_BY_ID: Record<string, typeof AutoAwesomeRoundedIcon> = {
  method: AutoAwesomeRoundedIcon,
  type: CategoryRoundedIcon,
  target: SensorsRoundedIcon,
  settings: TuneRoundedIcon,
  editor: DashboardCustomizeRoundedIcon,
};

const starterAssetOptions = [
  "Studio safe-area guides",
  "Runtime budget meter",
  "EVzone preview camera",
  "Face tracker scaffold",
  "Hand gesture triggers",
  "Beauty controls",
  "Color/LUT stack",
  "Overlay frame kit",
  "Chroma controls",
  "VFX starter pack",
  "Audio reaction nodes",
  "AI prompt pack",
];

const aspectRatios = ["9:16", "16:9", "1:1", "4:5", "21:9", "Custom"];
const resolutions = ["1080 × 1920", "1920 × 1080", "1280 × 720", "1440 × 1440", "2160 × 3840", "Custom"];
const previewSources = ["EVzone Host Camera", "EVzone Guest Camera", "Built-in Preview Person", "Custom Image/Video", "Mobile Device Preview", "Web Preview Feed"];
const runtimeBudgets = ["Live Safe • 5 MB / 60 FPS", "Balanced • 12 MB / 30 FPS", "Premium Preview • 25 MB / 30 FPS", "Prototype • No strict limit"];
const destinations = ["Current EVzone Live Studio Session", "Host Camera Scene", "Guest Camera Scene", "Overlay Layer 1", "Overlay Layer 2", "Transitions Bin", "Preview Only"];

const defaultSettings: ProjectSettings = {
  name: "Premium EVzone Effect",
  category: "Face AR",
  aspectRatio: "9:16",
  resolution: "1080 × 1920",
  previewSource: "EVzone Host Camera",
  studioDestination: "Current EVzone Live Studio Session",
  runtimeBudget: "Live Safe • 5 MB / 60 FPS",
  starterAssets: ["Studio safe-area guides", "Runtime budget meter", "EVzone preview camera", "Face tracker scaffold"],
};

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function getOption(options: WizardOption[], id: string) {
  return options.find((option) => option.id === id) ?? options[0];
}

function OptionCard({
  option,
  selected,
  onSelect,
  compact,
}: {
  key?: string;
  option: WizardOption;
  selected: boolean;
  onSelect: () => void;
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      className={cx("evz-option-card", selected && "is-selected", compact && "is-compact")}
      onClick={onSelect}
      aria-pressed={selected}
    >
      <span className="evz-option-glow" />
      <span className="evz-option-topline">
        <span className="evz-option-icon">{option.icon}</span>
        <span className="evz-option-meta">
          <span>{option.eyebrow}</span>
          {option.recommended && <strong>Recommended</strong>}
        </span>
      </span>
      <span className="evz-option-title">{option.title}</span>
      <span className="evz-option-description">{option.description}</span>
      <span className="evz-option-footer">
        <span>{option.meta}</span>
        {option.badge && <b>{option.badge}</b>}
      </span>
    </button>
  );
}

export default function EVzoneNewProjectWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedMethod, setSelectedMethod] = useState("ai-generated");
  const [selectedType, setSelectedType] = useState("face-ar");
  const [selectedTarget, setSelectedTarget] = useState("host-camera");
  const [settings, setSettings] = useState<ProjectSettings>(defaultSettings);

  const method = getOption(creationMethods, selectedMethod);
  const projectType = getOption(projectTypes, selectedType);
  const studioTarget = getOption(studioTargets, selectedTarget);

  const blueprint = useMemo(
    () => ({
      method,
      projectType,
      studioTarget,
      settings,
    }),
    [method, projectType, studioTarget, settings]
  );

  const progress = ((currentStep + 1) / steps.length) * 100;

  const updateSetting = <K extends keyof ProjectSettings>(key: K, value: ProjectSettings[K]) => {
    setSettings((previous) => ({ ...previous, [key]: value }));
  };

  const toggleStarterAsset = (asset: string) => {
    setSettings((previous) => {
      const exists = previous.starterAssets.includes(asset);
      return {
        ...previous,
        starterAssets: exists
          ? previous.starterAssets.filter((item) => item !== asset)
          : [...previous.starterAssets, asset],
      };
    });
  };

  const selectProjectType = (id: string) => {
    const nextType = getOption(projectTypes, id);
    setSelectedType(id);
    setSettings((previous) => ({ ...previous, category: nextType.title }));
  };

  const goNext = () => setCurrentStep((step) => Math.min(step + 1, steps.length - 1));
  const goBack = () => setCurrentStep((step) => Math.max(step - 1, 0));

  const openEditor = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("evzone:open-editor", {
          detail: {
            creationMethod: blueprint.method.title,
            projectType: blueprint.projectType.title,
            studioTarget: blueprint.studioTarget.title,
            settings: blueprint.settings,
          },
        })
      );
    }
  };

  return (
    <main className="evz-wizard-page">
      <style>{styles}</style>

      <section className="evz-shell">
        <header className="evz-topbar" aria-label="EVzone Effect Creator New Project Wizard">
          <div className="evz-brand-lockup">
            <div className="evz-brand-mark">EV</div>
            <div>
              <p>EVzone Effect Creator</p>
              <h1>New Project Wizard</h1>
            </div>
          </div>

          <div className="evz-topbar-status">
            <span className="evz-live-pill"><i /> Studio Connected</span>
            <span className="evz-soft-pill">Free Creator Tool</span>
            <span className="evz-soft-pill">No Authentication Required</span>
          </div>
        </header>

        <section className="evz-hero-card">
          <div className="evz-hero-copy">
            <h2>Create a world-class AR/effect project in five guided steps.</h2>
            <p>
              Build from scratch, generate with AI, remix an existing preset, or start from EVzone Studio overlays.
              The wizard prepares the right trackers, assets, studio target, preview source, and live-safe runtime budget.
            </p>
          </div>
          <div className="evz-hero-metrics" aria-label="Wizard readiness summary">
            <div>
              <strong>{settings.aspectRatio}</strong>
              <span>Canvas</span>
            </div>
            <div>
              <strong>5 MB</strong>
              <span>Live-safe target</span>
            </div>
            <div>
              <strong>60 FPS</strong>
              <span>Preferred output</span>
            </div>
          </div>
        </section>

        <section className="evz-workspace-grid">
          <aside className="evz-stepper-card" aria-label="Project wizard steps">
            <div className="evz-stepper-header">
              <span>Wizard Progress</span>
              <strong>{currentStep + 1}/5</strong>
            </div>
            <div className="evz-progress-track"><span style={{ width: `${progress}%` }} /></div>

            <div className="evz-step-list">
              {steps.map((step, index) => (
                <button
                  key={step.id}
                  type="button"
                  className={cx("evz-step-item", index === currentStep && "is-active", index < currentStep && "is-complete")}
                  onClick={() => setCurrentStep(index)}
                >
                  <span aria-hidden="true">
                    {(() => {
                      const StepIcon = index < currentStep ? CheckRoundedIcon : WIZARD_STEP_ICON_BY_ID[step.id] ?? AutoAwesomeRoundedIcon;
                      return <StepIcon fontSize="small" />;
                    })()}
                  </span>
                  <b>{step.label}</b>
                  <small>{index === currentStep ? "Currently editing" : index < currentStep ? "Completed" : "Upcoming"}</small>
                </button>
              ))}
            </div>

            <div className="evz-studio-context">
              <span className="evz-status-dot" />
              <div>
                <b>Current Studio Session</b>
                <p>Main Live Production · Host Camera active · Runtime limits loaded</p>
              </div>
            </div>
          </aside>

          <section className="evz-stage-card" aria-live="polite">
            <div className="evz-stage-header">
              <div>
                <span>{steps[currentStep].eyebrow}</span>
                <h3>{steps[currentStep].title}</h3>
                <p>{steps[currentStep].description}</p>
              </div>
              <span className="evz-stage-badge">{steps[currentStep].label}</span>
            </div>

            {currentStep === 0 && (
              <div className="evz-options-grid evz-options-grid--methods">
                {creationMethods.map((option) => (
                  <OptionCard
                    key={option.id}
                    option={option}
                    selected={selectedMethod === option.id}
                    onSelect={() => setSelectedMethod(option.id)}
                  />
                ))}
              </div>
            )}

            {currentStep === 1 && (
              <div className="evz-options-grid evz-options-grid--types">
                {projectTypes.map((option) => (
                  <OptionCard
                    key={option.id}
                    option={option}
                    selected={selectedType === option.id}
                    onSelect={() => selectProjectType(option.id)}
                    compact
                  />
                ))}
              </div>
            )}

            {currentStep === 2 && (
              <div className="evz-options-grid evz-options-grid--targets">
                {studioTargets.map((option) => (
                  <OptionCard
                    key={option.id}
                    option={option}
                    selected={selectedTarget === option.id}
                    onSelect={() => setSelectedTarget(option.id)}
                  />
                ))}
              </div>
            )}

            {currentStep === 3 && (
              <div className="evz-settings-grid">
                <label className="evz-field evz-field--wide">
                  <span>Project name</span>
                  <input value={settings.name} onChange={(event) => updateSetting("name", event.currentTarget.value)} />
                </label>

                <label className="evz-field">
                  <span>Category</span>
                  <input value={settings.category} onChange={(event) => updateSetting("category", event.currentTarget.value)} />
                </label>

                <label className="evz-field">
                  <span>Aspect ratio</span>
                  <select value={settings.aspectRatio} onChange={(event) => updateSetting("aspectRatio", event.currentTarget.value)}>
                    {aspectRatios.map((item) => <option key={item}>{item}</option>)}
                  </select>
                </label>

                <label className="evz-field">
                  <span>Resolution</span>
                  <select value={settings.resolution} onChange={(event) => updateSetting("resolution", event.currentTarget.value)}>
                    {resolutions.map((item) => <option key={item}>{item}</option>)}
                  </select>
                </label>

                <label className="evz-field">
                  <span>Preview source</span>
                  <select value={settings.previewSource} onChange={(event) => updateSetting("previewSource", event.currentTarget.value)}>
                    {previewSources.map((item) => <option key={item}>{item}</option>)}
                  </select>
                </label>

                <label className="evz-field">
                  <span>Studio destination</span>
                  <select value={settings.studioDestination} onChange={(event) => updateSetting("studioDestination", event.currentTarget.value)}>
                    {destinations.map((item) => <option key={item}>{item}</option>)}
                  </select>
                </label>

                <label className="evz-field">
                  <span>Runtime budget target</span>
                  <select value={settings.runtimeBudget} onChange={(event) => updateSetting("runtimeBudget", event.currentTarget.value)}>
                    {runtimeBudgets.map((item) => <option key={item}>{item}</option>)}
                  </select>
                </label>

                <div className="evz-starter-assets evz-field--wide">
                  <div className="evz-section-title">
                    <span>Starter assets</span>
                    <b>{settings.starterAssets.length} selected</b>
                  </div>
                  <div className="evz-chip-grid">
                    {starterAssetOptions.map((asset) => {
                      const selected = settings.starterAssets.includes(asset);
                      return (
                        <button
                          key={asset}
                          type="button"
                          className={cx("evz-asset-chip", selected && "is-selected")}
                          onClick={() => toggleStarterAsset(asset)}
                        >
                          <span>{selected ? "✓" : "+"}</span>
                          {asset}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="evz-final-review">
                <div className="evz-final-visual">
                  <div className="evz-preview-phone">
                    <div className="evz-phone-camera" />
                    <div className="evz-phone-scene">
                      <span>{projectType.icon}</span>
                      <b>{settings.name || "Untitled EVzone Effect"}</b>
                      <p>{projectType.title} · {studioTarget.title}</p>
                    </div>
                  </div>
                  <div className="evz-editor-path">
                    <span>Wizard</span><i />
                    <span>Editor Workspace</span><i />
                    <span>Preview & Quality</span><i />
                    <span>Send to Studio</span>
                  </div>
                </div>

                <div className="evz-final-details">
                  <span className="evz-kicker">Project blueprint ready</span>
                  <h4>{settings.name || "Untitled EVzone Effect"}</h4>
                  <p>
                    EVzone will open the Editor Workspace with the selected creation method, effect category,
                    studio target, preview source, starter assets, and runtime budget preconfigured.
                  </p>
                  <div className="evz-ready-list">
                    {[
                      "Studio bridge connected",
                      "Runtime target selected",
                      "Preview source assigned",
                      "Starter assets prepared",
                      "Editor panels will open automatically",
                    ].map((item) => <span key={item}>✓ {item}</span>)}
                  </div>
                  <button type="button" className="evz-primary-action" onClick={openEditor}>
                    Open in Editor Workspace
                  </button>
                </div>
              </div>
            )}

            <footer className="evz-stage-footer">
              <button type="button" className="evz-secondary-action" onClick={goBack} disabled={currentStep === 0}>Back</button>
              <div className="evz-footer-hint">
                <span>{method.title}</span>
                <i />
                <span>{projectType.title}</span>
                <i />
                <span>{studioTarget.title}</span>
              </div>
              {currentStep < steps.length - 1 ? (
                <button type="button" className="evz-primary-action" onClick={goNext}>Continue</button>
              ) : (
                <button type="button" className="evz-secondary-action" onClick={() => setCurrentStep(0)}>Start Over</button>
              )}
            </footer>
          </section>

          <aside className="evz-blueprint-card" aria-label="Live project blueprint">
            <div className="evz-blueprint-header">
              <span>Live Blueprint</span>
              <b>Studio-ready</b>
            </div>

            <div className="evz-blueprint-summary">
              <div className="evz-blueprint-icon">{projectType.icon}</div>
              <h3>{settings.name || "Untitled EVzone Effect"}</h3>
              <p>{projectType.title} prepared for {studioTarget.title}</p>
            </div>

            <div className="evz-blueprint-list">
              <div><span>Method</span><b>{method.title}</b></div>
              <div><span>Type</span><b>{projectType.title}</b></div>
              <div><span>Studio target</span><b>{studioTarget.title}</b></div>
              <div><span>Canvas</span><b>{settings.aspectRatio} · {settings.resolution}</b></div>
              <div><span>Preview</span><b>{settings.previewSource}</b></div>
              <div><span>Runtime</span><b>{settings.runtimeBudget}</b></div>
            </div>

            <div className="evz-mini-checklist">
              <span className="evz-section-title"><span>Starter checklist</span><b>{settings.starterAssets.length}</b></span>
              {settings.starterAssets.slice(0, 7).map((asset) => <p key={asset}>✓ {asset}</p>)}
              {settings.starterAssets.length > 7 && <p>+ {settings.starterAssets.length - 7} more assets</p>}
            </div>

            <button type="button" className="evz-outline-action" onClick={() => setCurrentStep(4)}>Review & Open</button>
          </aside>
        </section>
      </section>
    </main>
  );
}

const styles = `
:root {
  --evz-green: #03cd8c;
  --evz-orange: #f77f00;
  --evz-grey: #a6a6a6;
  --evz-light: var(--app-evz-light);
  --evz-ink: var(--app-evz-ink);
  --evz-muted: var(--app-evz-muted);
  --evz-line: var(--app-evz-line);
  --evz-card: var(--app-evz-card);
  --evz-card-strong: var(--app-evz-card-solid);
  --evz-shadow: var(--app-evz-shadow);
  --evz-soft-shadow: 0 14px 44px rgba(21, 32, 29, 0.09);
  --evz-radius-xl: 34px;
  --evz-radius-lg: 24px;
  --evz-radius-md: 18px;
  --evz-radius-sm: 12px;
}

* { box-sizing: border-box; }

.evz-wizard-page {
  min-height: 100vh;
  color: var(--evz-ink);
  background:
    radial-gradient(circle at 9% 7%, rgba(3, 205, 140, 0.22), transparent 28%),
    radial-gradient(circle at 91% 10%, rgba(247, 127, 0, 0.2), transparent 30%),
    var(--evz-app-bg);
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  padding: 28px;
}

.evz-wizard-page::before {
  content: "";
  position: fixed;
  inset: 0;
  pointer-events: none;
  background-image:
    linear-gradient(rgba(21, 32, 29, 0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(21, 32, 29, 0.035) 1px, transparent 1px);
  background-size: 34px 34px;
  mask-image: linear-gradient(to bottom, rgba(0,0,0,0.7), transparent 72%);
}

.evz-shell {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 100%;
  margin: 0;
}

.evz-topbar,
.evz-hero-card,
.evz-stepper-card,
.evz-stage-card,
.evz-blueprint-card {
  border: 1px solid var(--evz-border);
  background: var(--evz-card);
  box-shadow: var(--evz-shadow);
  backdrop-filter: blur(26px);
}

.evz-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 18px 20px;
  border-radius: 26px;
}

.evz-brand-lockup {
  display: flex;
  align-items: center;
  gap: 14px;
}

.evz-brand-mark {
  width: 52px;
  height: 52px;
  display: grid;
  place-items: center;
  border-radius: 18px;
  color: #fff;
  font-weight: 950;
  letter-spacing: -0.08em;
  background:
    linear-gradient(135deg, rgba(3, 205, 140, 1), rgba(3, 205, 140, 0.86)),
    radial-gradient(circle at top right, rgba(247, 127, 0, 0.85), transparent 52%);
  box-shadow: 0 18px 34px rgba(3, 205, 140, 0.28);
}

.evz-brand-lockup p,
.evz-brand-lockup h1 {
  margin: 0;
}

.evz-brand-lockup p {
  color: var(--evz-muted);
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.16em;
}

.evz-brand-lockup h1 {
  font-size: clamp(20px, 2vw, 30px);
  letter-spacing: -0.05em;
}

.evz-topbar-status {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  flex-wrap: wrap;
}

.evz-live-pill,
.evz-soft-pill,
.evz-stage-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 13px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 900;
  white-space: nowrap;
}

.evz-live-pill {
  color: #04533c;
  background: rgba(3, 205, 140, 0.13);
  border: 1px solid rgba(3, 205, 140, 0.26);
}

.evz-live-pill i,
.evz-status-dot {
  width: 9px;
  height: 9px;
  border-radius: 999px;
  background: var(--evz-green);
  box-shadow: 0 0 0 6px rgba(3, 205, 140, 0.15);
}

.evz-soft-pill,
.evz-stage-badge {
  color: #5e5043;
  background: var(--evz-card);
  border: 1px solid var(--evz-line);
}

.evz-hero-card {
  margin-top: 20px;
  border-radius: var(--evz-radius-xl);
  overflow: hidden;
  padding: 28px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(320px, 0.38fr);
  align-items: start;
  gap: 24px;
  position: relative;
}

.evz-hero-card::after {
  content: "";
  position: absolute;
  width: 360px;
  height: 360px;
  right: -120px;
  top: -180px;
  background: radial-gradient(circle, rgba(247, 127, 0, 0.22), transparent 70%);
  pointer-events: none;
}

.evz-kicker {
  display: inline-flex;
  width: fit-content;
  padding: 9px 12px;
  border-radius: 999px;
  color: #07664c;
  font-size: 0.76rem;
  font-weight: 950;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  background: rgba(3, 205, 140, 0.12);
  border: 1px solid rgba(3, 205, 140, 0.22);
}

.evz-hero-copy h2 {
  margin: 6px 0 10px;
  max-width: 850px;
  font-size: clamp(26px, 4vw, 42px);
  line-height: 1.05;
  letter-spacing: -0.045em;
}

.evz-hero-copy p {
  max-width: 820px;
  margin: 0;
  color: var(--evz-muted);
  font-size: 1.04rem;
  line-height: 1.7;
}

.evz-hero-metrics {
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
  align-self: start;
  align-content: start;
  position: relative;
  z-index: 1;
}

.evz-hero-metrics div {
  padding: 8px 14px;
  border-radius: 14px;
  background: var(--evz-card);
  border: 1px solid var(--evz-border);
}

.evz-hero-metrics strong,
.evz-hero-metrics span {
  display: block;
}

.evz-hero-metrics strong {
  font-size: 1.25rem;
  letter-spacing: -0.04em;
  line-height: 1.1;
}

.evz-hero-metrics span {
  margin-top: 2px;
  color: var(--evz-muted);
  font-size: 0.76rem;
  font-weight: 900;
  text-transform: none;
  letter-spacing: 0;
  line-height: 1.25;
}

.evz-workspace-grid {
  margin-top: 20px;
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr) 330px;
  gap: 20px;
  align-items: start;
}

.evz-stepper-card,
.evz-stage-card,
.evz-blueprint-card {
  border-radius: var(--evz-radius-xl);
}

.evz-stepper-card,
.evz-blueprint-card {
  padding: 18px;
  position: sticky;
  top: 20px;
}

.evz-stepper-header,
.evz-blueprint-header,
.evz-section-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.evz-stepper-header span,
.evz-blueprint-header span,
.evz-section-title span {
  color: var(--evz-muted);
  font-size: 12px;
  font-weight: 950;
  text-transform: uppercase;
  letter-spacing: 0.14em;
}

.evz-stepper-header strong,
.evz-blueprint-header b,
.evz-section-title b {
  font-size: 12px;
  color: #075b44;
  padding: 7px 10px;
  border-radius: 999px;
  background: rgba(3, 205, 140, 0.12);
}

.evz-progress-track {
  height: 10px;
  margin: 16px 0 18px;
  border-radius: 999px;
  background: rgba(21, 32, 29, 0.08);
  overflow: hidden;
}

.evz-progress-track span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--evz-green), var(--evz-orange));
  box-shadow: 0 0 28px rgba(3, 205, 140, 0.35);
  transition: width 0.35s ease;
}

.evz-step-list {
  display: grid;
  gap: 10px;
}

.evz-step-item {
  display: grid;
  grid-template-columns: 40px 1fr;
  gap: 10px;
  align-items: center;
  width: 100%;
  padding: 11px;
  border: 1px solid var(--evz-border);
  border-radius: 18px;
  background: var(--evz-card);
  text-align: left;
  color: var(--evz-ink);
  cursor: pointer;
  transition: transform 0.22s ease, border-color 0.22s ease, background 0.22s ease, box-shadow 0.22s ease;
}

.evz-step-item:hover,
.evz-step-item.is-active {
  transform: translateY(-2px);
  border-color: rgba(3, 205, 140, 0.38);
  background: var(--evz-card);
  box-shadow: var(--evz-soft-shadow);
}

.evz-step-item.is-complete {
  border-color: rgba(3, 205, 140, 0.22);
  background: rgba(3, 205, 140, 0.08);
}

.evz-step-item span {
  grid-row: span 2;
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  border-radius: 14px;
  color: #fff;
  font-weight: 950;
  background: var(--evz-green);
}

.evz-step-item span svg {
  font-size: 22px;
}

.evz-step-item.is-active span {
  color: #fff;
  background: var(--evz-green);
  box-shadow: 0 10px 18px rgba(3,205,140,0.24);
}

.evz-step-item b {
  font-size: 13px;
}

.evz-step-item small {
  color: var(--evz-muted);
  font-size: 11px;
  font-weight: 800;
}

.evz-studio-context {
  margin-top: 16px;
  padding: 15px;
  display: flex;
  gap: 12px;
  border-radius: 20px;
  background: linear-gradient(135deg, rgba(3, 205, 140, 0.1), rgba(247, 127, 0, 0.08));
  border: 1px solid rgba(3, 205, 140, 0.18);
}

.evz-studio-context b,
.evz-studio-context p {
  margin: 0;
}

.evz-studio-context p {
  margin-top: 4px;
  color: var(--evz-muted);
  font-size: 12px;
  line-height: 1.45;
}

.evz-stage-card {
  min-height: 720px;
  padding: 20px;
  overflow: hidden;
}

.evz-stage-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 18px;
  padding: 8px 6px 14px;
  border-bottom: 1px solid var(--evz-line);
}

.evz-stage-header span:not(.evz-stage-badge) {
  color: var(--evz-orange);
  font-size: 12px;
  font-weight: 950;
  text-transform: uppercase;
  letter-spacing: 0.16em;
}

.evz-stage-header h3 {
  margin: 8px 0 7px;
  font-size: clamp(24px, 3vw, 42px);
  line-height: 1;
  letter-spacing: -0.07em;
}

.evz-stage-header p {
  margin: 0;
  max-width: 820px;
  color: var(--evz-muted);
  line-height: 1.65;
}

.evz-options-grid {
  display: grid;
  gap: 14px;
}

.evz-options-grid--methods {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.evz-options-grid--types {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.evz-options-grid--targets {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.evz-option-card {
  position: relative;
  min-height: 198px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 10px;
  padding: 18px;
  border: 1px solid var(--evz-border);
  border-radius: 24px;
  overflow: hidden;
  background: var(--evz-card);
  text-align: left;
  color: var(--evz-ink);
  cursor: pointer;
  box-shadow: 0 12px 30px rgba(21, 32, 29, 0.06);
  transition: transform 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease;
}

.evz-option-card.is-compact {
  min-height: 178px;
  padding: 15px;
}

.evz-option-card:hover,
.evz-option-card.is-selected {
  transform: translateY(-4px);
  border-color: rgba(3, 205, 140, 0.48);
  box-shadow: 0 22px 55px rgba(3, 205, 140, 0.14);
}

.evz-option-card.is-selected::after {
  content: "Selected";
  position: absolute;
  top: 13px;
  right: 13px;
  padding: 7px 9px;
  border-radius: 999px;
  color: #fff;
  font-size: 11px;
  font-weight: 950;
  background: linear-gradient(135deg, var(--evz-green), #00a874);
  box-shadow: 0 10px 22px rgba(3, 205, 140, 0.22);
}

.evz-option-glow {
  position: absolute;
  width: 160px;
  height: 160px;
  right: -60px;
  bottom: -80px;
  border-radius: 999px;
  background: radial-gradient(circle, rgba(247, 127, 0, 0.17), transparent 68%);
  pointer-events: none;
}

.evz-option-topline {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  position: relative;
  z-index: 1;
}

.evz-option-icon {
  flex: 0 0 auto;
  width: 48px;
  height: 48px;
  display: grid;
  place-items: center;
  border-radius: 17px;
  font-size: 24px;
  background: rgba(3, 205, 140, 0.11);
  border: 1px solid rgba(3, 205, 140, 0.17);
}

.evz-option-meta {
  display: grid;
  gap: 6px;
  padding-top: 2px;
}

.evz-option-meta span {
  color: var(--evz-muted);
  font-size: 11px;
  font-weight: 950;
  text-transform: uppercase;
  letter-spacing: 0.13em;
}

.evz-option-meta strong {
  width: fit-content;
  padding: 6px 8px;
  border-radius: 999px;
  color: #925107;
  font-size: 10px;
  background: rgba(247, 127, 0, 0.13);
}

.evz-option-title {
  position: relative;
  z-index: 1;
  display: block;
  font-size: 18px;
  font-weight: 950;
  letter-spacing: -0.04em;
}

.evz-option-description {
  position: relative;
  z-index: 1;
  flex: 1;
  color: var(--evz-muted);
  font-size: 13px;
  line-height: 1.55;
}

.evz-option-footer {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  color: var(--evz-muted);
  font-size: 11px;
  font-weight: 850;
}

.evz-option-footer b {
  color: #fff;
  padding: 6px 8px;
  border-radius: 999px;
  background: #15201d;
}

.evz-settings-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.evz-field {
  display: grid;
  gap: 8px;
  padding: 16px;
  border-radius: 22px;
  background: var(--evz-card);
  border: 1px solid var(--evz-border);
  box-shadow: 0 12px 32px rgba(21, 32, 29, 0.05);
}

.evz-field--wide {
  grid-column: 1 / -1;
}

.evz-field span {
  color: var(--evz-muted);
  font-size: 12px;
  font-weight: 950;
  text-transform: uppercase;
  letter-spacing: 0.12em;
}

.evz-field input,
.evz-field select {
  width: 100%;
  border: 1px solid var(--evz-border);
  border-radius: 15px;
  padding: 13px 14px;
  background: var(--evz-card-solid);
  color: var(--evz-ink);
  font: inherit;
  font-weight: 800;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.evz-field input:focus,
.evz-field select:focus {
  border-color: rgba(3, 205, 140, 0.58);
  box-shadow: 0 0 0 4px rgba(3, 205, 140, 0.12);
}

.evz-starter-assets {
  padding: 18px;
  border-radius: 24px;
  background: var(--evz-card);
  border: 1px solid var(--evz-border);
}

.evz-chip-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 9px;
  margin-top: 14px;
}

.evz-asset-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 999px;
  border: 1px solid var(--evz-border);
  background: var(--evz-card-solid);
  color: var(--evz-muted);
  font-size: 12px;
  font-weight: 900;
  cursor: pointer;
}

.evz-asset-chip span {
  width: 19px;
  height: 19px;
  display: grid;
  place-items: center;
  border-radius: 999px;
  background: var(--evz-light);
}

.evz-asset-chip.is-selected {
  color: #07523e;
  border-color: rgba(3, 205, 140, 0.34);
  background: rgba(3, 205, 140, 0.1);
}

.evz-asset-chip.is-selected span {
  color: #fff;
  background: var(--evz-green);
}

.evz-final-review {
  display: grid;
  grid-template-columns: 360px minmax(0, 1fr);
  gap: 22px;
  align-items: stretch;
}

.evz-final-visual,
.evz-final-details {
  border-radius: 28px;
  padding: 22px;
  background: var(--evz-card);
  border: 1px solid var(--evz-border);
}

.evz-preview-phone {
  width: 230px;
  height: 420px;
  margin: 0;
  padding: 14px;
  border-radius: 36px;
  background: linear-gradient(160deg, #1d2825, #0f1715);
  box-shadow: 0 30px 70px rgba(21, 32, 29, 0.26);
}

.evz-phone-camera {
  width: 70px;
  height: 20px;
  margin: 0 0 14px;
  border-radius: 999px;
  background: var(--evz-card);
}

.evz-phone-scene {
  height: calc(100% - 34px);
  border-radius: 26px;
  display: grid;
  place-items: center;
  align-content: center;
  gap: 10px;
  padding: 18px;
  text-align: center;
  color: #fff;
  background:
    radial-gradient(circle at 20% 20%, rgba(3, 205, 140, 0.7), transparent 30%),
    radial-gradient(circle at 80% 10%, rgba(247, 127, 0, 0.62), transparent 32%),
    linear-gradient(180deg, #26332f, #14201d);
}

.evz-phone-scene span {
  width: 74px;
  height: 74px;
  display: grid;
  place-items: center;
  border-radius: 24px;
  font-size: 34px;
  background: var(--evz-card);
  border: 1px solid var(--evz-border);
}

.evz-phone-scene b {
  font-size: 18px;
  letter-spacing: -0.04em;
}

.evz-phone-scene p {
  margin: 0;
  opacity: 0.78;
  font-size: 12px;
  line-height: 1.5;
}

.evz-editor-path {
  display: grid;
  gap: 7px;
  margin-top: 20px;
}

.evz-editor-path span {
  padding: 10px 12px;
  border-radius: 14px;
  color: #07523e;
  background: rgba(3, 205, 140, 0.09);
  font-size: 12px;
  font-weight: 950;
  text-align: center;
}

.evz-editor-path i {
  width: 1px;
  height: 14px;
  margin: 0;
  background: rgba(3, 205, 140, 0.32);
}

.evz-final-details h4 {
  margin: 18px 0 10px;
  font-size: clamp(28px, 4vw, 52px);
  line-height: 0.98;
  letter-spacing: -0.08em;
}

.evz-final-details p {
  margin: 0;
  color: var(--evz-muted);
  line-height: 1.7;
}

.evz-ready-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  margin: 24px 0;
}

.evz-ready-list span {
  padding: 12px;
  border-radius: 15px;
  color: #07523e;
  background: rgba(3, 205, 140, 0.09);
  border: 1px solid rgba(3, 205, 140, 0.16);
  font-size: 12px;
  font-weight: 900;
}

.evz-stage-footer {
  margin-top: 22px;
  padding-top: 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  border-top: 1px solid var(--evz-line);
}

.evz-footer-hint {
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
  color: var(--evz-muted);
  font-size: 12px;
  font-weight: 900;
}

.evz-footer-hint i {
  width: 5px;
  height: 5px;
  border-radius: 999px;
  background: var(--evz-green);
}

.evz-primary-action,
.evz-secondary-action,
.evz-outline-action {
  border: 0;
  border-radius: 16px;
  padding: 13px 17px;
  font: inherit;
  font-size: 13px;
  font-weight: 950;
  cursor: pointer;
  transition: transform 0.18s ease, box-shadow 0.18s ease, opacity 0.18s ease;
}

.evz-primary-action {
  color: #fff;
  background: linear-gradient(135deg, var(--evz-green), #02b57c);
  box-shadow: 0 16px 32px rgba(3, 205, 140, 0.24);
}

.evz-secondary-action {
  color: var(--evz-ink);
  background: var(--evz-card);
  border: 1px solid var(--evz-border);
}

.evz-outline-action {
  width: 100%;
  color: #07523e;
  background: rgba(3, 205, 140, 0.1);
  border: 1px solid rgba(3, 205, 140, 0.22);
}

.evz-primary-action:hover,
.evz-secondary-action:hover,
.evz-outline-action:hover {
  transform: translateY(-2px);
}

.evz-secondary-action:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  transform: none;
}

.evz-blueprint-header b {
  background: rgba(247, 127, 0, 0.12);
  color: #89510a;
}

.evz-blueprint-summary {
  margin: 16px 0;
  padding: 18px;
  border-radius: 24px;
  background:
    radial-gradient(circle at 15% 0%, rgba(3, 205, 140, 0.16), transparent 42%),
    radial-gradient(circle at 100% 0%, rgba(247, 127, 0, 0.16), transparent 42%),
    var(--evz-frost-soft);
  border: 1px solid var(--evz-border);
}

.evz-blueprint-icon {
  width: 62px;
  height: 62px;
  display: grid;
  place-items: center;
  border-radius: 22px;
  color: #fff;
  font-size: 30px;
  background: var(--evz-green);
  box-shadow: 0 18px 35px rgba(3, 205, 140, 0.18);
}

.evz-blueprint-summary h3 {
  margin: 14px 0 6px;
  font-size: 24px;
  line-height: 1.04;
  letter-spacing: -0.06em;
}

.evz-blueprint-summary p {
  margin: 0;
  color: var(--evz-muted);
  font-size: 13px;
  line-height: 1.5;
}

.evz-blueprint-list {
  display: grid;
  gap: 9px;
  margin-bottom: 16px;
}

.evz-blueprint-list div {
  display: grid;
  gap: 4px;
  padding: 12px;
  border-radius: 16px;
  background: var(--evz-card);
  border: 1px solid var(--evz-border);
}

.evz-blueprint-list span {
  color: var(--evz-muted);
  font-size: 10px;
  font-weight: 950;
  text-transform: uppercase;
  letter-spacing: 0.12em;
}

.evz-blueprint-list b {
  font-size: 13px;
  line-height: 1.35;
}

.evz-mini-checklist {
  display: grid;
  gap: 7px;
  padding: 14px;
  border-radius: 18px;
  background: rgba(21, 32, 29, 0.035);
  margin-bottom: 14px;
}

.evz-mini-checklist p {
  margin: 0;
  color: var(--evz-muted);
  font-size: 12px;
  font-weight: 800;
}

[data-evz-theme='dark'] .evz-wizard-page .evz-live-pill {
  color: #34e6b0;
  border-color: rgba(3, 205, 140, 0.36);
  background: rgba(3, 205, 140, 0.18);
}

[data-evz-theme='dark'] .evz-wizard-page .evz-soft-pill,
[data-evz-theme='dark'] .evz-wizard-page .evz-stage-badge {
  color: var(--evz-ink-2);
  background: var(--evz-card-solid);
  border-color: var(--evz-border);
}

[data-evz-theme='dark'] .evz-wizard-page .evz-kicker,
[data-evz-theme='dark'] .evz-wizard-page .evz-stepper-header strong,
[data-evz-theme='dark'] .evz-wizard-page .evz-section-title b,
[data-evz-theme='dark'] .evz-wizard-page .evz-outline-action {
  color: #34e6b0;
  border-color: rgba(3, 205, 140, 0.34);
  background: rgba(3, 205, 140, 0.17);
}

[data-evz-theme='dark'] .evz-wizard-page .evz-blueprint-header b {
  color: #ffc166;
  border-color: rgba(247, 127, 0, 0.28);
  background: rgba(247, 127, 0, 0.18);
}

[data-evz-theme='dark'] .evz-wizard-page .evz-blueprint-summary {
  background:
    radial-gradient(circle at 15% 0%, rgba(3, 205, 140, 0.22), transparent 42%),
    radial-gradient(circle at 100% 0%, rgba(247, 127, 0, 0.20), transparent 42%),
    var(--evz-card-solid);
  border-color: var(--evz-border-strong);
}

[data-evz-theme='dark'] .evz-wizard-page .evz-blueprint-summary h3 {
  color: var(--evz-ink);
}

[data-evz-theme='dark'] .evz-wizard-page .evz-blueprint-summary p {
  color: var(--evz-ink-2);
}

[data-evz-theme='dark'] .evz-wizard-page .evz-blueprint-list div {
  background: color-mix(in srgb, var(--evz-card-solid) 96%, transparent);
  border-color: var(--evz-border);
}

[data-evz-theme='dark'] .evz-wizard-page .evz-mini-checklist {
  background: color-mix(in srgb, var(--evz-card-solid) 92%, transparent);
  border: 1px solid var(--evz-border);
}

@media (max-width: 1220px) {
  .evz-workspace-grid { grid-template-columns: 250px minmax(0, 1fr); }
  .evz-blueprint-card { grid-column: 1 / -1; position: static; }
  .evz-options-grid--types { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}

@media (max-width: 920px) {
  .evz-wizard-page { padding: 16px; }
  .evz-topbar, .evz-hero-card, .evz-stage-header, .evz-stage-footer { flex-direction: column; align-items: stretch; }
  .evz-hero-card, .evz-workspace-grid, .evz-final-review { grid-template-columns: 1fr; }
  .evz-stepper-card { position: static; }
  .evz-options-grid--methods, .evz-options-grid--targets, .evz-options-grid--types, .evz-settings-grid { grid-template-columns: 1fr; }
  .evz-ready-list { grid-template-columns: 1fr; }
}

@media (max-width: 560px) {
  .evz-hero-copy h2 { font-size: 34px; }
  .evz-option-card { min-height: auto; }
  .evz-preview-phone { width: 100%; max-width: 230px; }
}
`;
