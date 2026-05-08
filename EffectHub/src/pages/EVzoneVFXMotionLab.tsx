import React, { useMemo, useState } from "react";

type LeftTab = "VFX Presets" | "Emitters" | "Motion" | "Transitions";
type RightTab = "Particle Editor" | "Motion Controls" | "Audio Reactive" | "Physics";
type BottomTab = "Animation Timeline" | "State Graph" | "Transition Builder" | "Live Graphics";
type PreviewMode = "Confetti" | "Sparkles" | "Smoke" | "Hologram";

const vfxPresets = [
  { name: "EVzone Confetti Burst", type: "Confetti", score: 96, tone: "green" },
  { name: "Premium Sparkle Sweep", type: "Sparkles", score: 94, tone: "green" },
  { name: "Hologram Pulse", type: "Hologram", score: 91, tone: "green" },
  { name: "Soft Smoke Reveal", type: "Smoke", score: 87, tone: "orange" },
  { name: "Cinematic Fire Edge", type: "Fire", score: 82, tone: "orange" },
  { name: "Rain Glass Overlay", type: "Rain", score: 89, tone: "green" },
  { name: "Snow Studio Magic", type: "Snow", score: 92, tone: "green" },
  { name: "Lightning Accent", type: "Lightning", score: 78, tone: "orange" },
  { name: "Magic Dust Trail", type: "Magic Dust", score: 95, tone: "green" },
];

const emitterTypes = [
  { name: "Directional Emitter", detail: "Controlled burst direction", status: "Ready" },
  { name: "Radial Burst", detail: "Confetti, sparkles, impact VFX", status: "Ready" },
  { name: "Trail Emitter", detail: "Follow hand, face, object, or text", status: "Ready" },
  { name: "Ambient Field", detail: "Rain, snow, smoke, floating dust", status: "Ready" },
  { name: "Reactive Emitter", detail: "Audio and gesture-triggered particles", status: "Live" },
];

const motionPresets = [
  "Fade in",
  "Pop",
  "Bounce",
  "Slide",
  "Rotate",
  "Scale",
  "Shake",
  "Glow pulse",
  "Ease out expo",
  "Elastic reveal",
  "Lower-third wipe",
  "Caption type-on",
];

const transitionPresets = [
  { name: "Glitch", detail: "Digital distortion and channel split" },
  { name: "Wipe", detail: "Broadcast clean directional reveal" },
  { name: "Zoom", detail: "Camera push or snap zoom" },
  { name: "Flash", detail: "White/orange stage flash" },
  { name: "Whip Pan", detail: "Fast directional scene move" },
  { name: "Cinematic Reveal", detail: "Premium show intro transition" },
];

const graphNodes = [
  { id: "n1", title: "Studio Trigger", type: "Scene Start", x: 6, y: 22, tone: "green" },
  { id: "n2", title: "Beat Detector", type: "Audio", x: 25, y: 10, tone: "orange" },
  { id: "n3", title: "Emitter Core", type: "Particles", x: 28, y: 42, tone: "green" },
  { id: "n4", title: "Force Field", type: "Physics", x: 48, y: 24, tone: "gray" },
  { id: "n5", title: "Glow Material", type: "Material", x: 48, y: 56, tone: "orange" },
  { id: "n6", title: "Motion Curve", type: "Easing", x: 66, y: 18, tone: "green" },
  { id: "n7", title: "Lower Third Animator", type: "Live Graphics", x: 66, y: 55, tone: "green" },
  { id: "n8", title: "Studio Output", type: "EVzone", x: 84, y: 35, tone: "orange" },
];

const timelineClips = [
  { name: "Intro Burst", left: 3, width: 14, lane: 1, tone: "green" },
  { name: "Lower Third Wipe", left: 18, width: 18, lane: 2, tone: "orange" },
  { name: "Beat Pulse", left: 39, width: 12, lane: 1, tone: "green" },
  { name: "Caption Type-On", left: 54, width: 19, lane: 3, tone: "gray" },
  { name: "Live Alert Pop", left: 76, width: 14, lane: 2, tone: "orange" },
];

const stateNodes = ["Idle", "Armed", "Emitting", "Motion", "Live Graphic", "Cooldown"];

export default function EVzoneVFXMotionLab() {
  const [leftTab, setLeftTab] = useState<LeftTab>("VFX Presets");
  const [rightTab, setRightTab] = useState<RightTab>("Particle Editor");
  const [bottomTab, setBottomTab] = useState<BottomTab>("Animation Timeline");
  const [previewMode, setPreviewMode] = useState<PreviewMode>("Confetti");
  const [activePreset, setActivePreset] = useState(vfxPresets[0]);
  const [selectedNode, setSelectedNode] = useState(graphNodes[2]);
  const [values, setValues] = useState({
    particles: 68,
    lifetime: 54,
    speed: 72,
    size: 48,
    spread: 62,
    gravity: 34,
    bounce: 44,
    force: 57,
    beat: 66,
    voice: 51,
    glow: 63,
    easing: 58,
  });

  const vfxStats = useMemo(
    () => [
      { label: "Particles", value: "1,240", tone: "green" },
      { label: "FPS", value: "59.6", tone: "green" },
      { label: "GPU Cost", value: "Med", tone: "orange" },
      { label: "Live-safe", value: "92%", tone: "green" },
    ],
    []
  );

  const updateValue = (key: keyof typeof values, value: number) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const renderSlider = (key: keyof typeof values, label: string, helper?: string) => (
    <div className="slider-card" key={key}>
      <div className="slider-head">
        <div>
          <strong>{label}</strong>
          {helper ? <small>{helper}</small> : null}
        </div>
        <span>{values[key]}%</span>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={values[key]}
        onChange={(event) => updateValue(key, Number(event.target.value))}
      />
      <div className="slider-track"><span style={{ width: `${values[key]}%` }} /></div>
    </div>
  );

  const renderLeftContent = () => {
    if (leftTab === "VFX Presets") {
      return (
        <div className="panel-scroll">
          {vfxPresets.map((preset) => (
            <button
              key={preset.name}
              className={`preset-card ${activePreset.name === preset.name ? "active" : ""}`}
              onClick={() => {
                setActivePreset(preset);
                if (["Confetti", "Sparkles", "Smoke", "Hologram"].includes(preset.type)) {
                  setPreviewMode(preset.type as PreviewMode);
                }
              }}
            >
              <span className={`preset-art ${preset.tone}`} />
              <span className="preset-copy">
                <strong>{preset.name}</strong>
                <small>{preset.type} • Live-safe score {preset.score}%</small>
              </span>
            </button>
          ))}
        </div>
      );
    }

    if (leftTab === "Emitters") {
      return (
        <div className="panel-scroll">
          {emitterTypes.map((emitter) => (
            <div className="emitter-card" key={emitter.name}>
              <span className="emitter-icon">∴</span>
              <div>
                <strong>{emitter.name}</strong>
                <small>{emitter.detail}</small>
              </div>
              <em>{emitter.status}</em>
            </div>
          ))}
          <button className="primary-btn full" data-evz-autowire="1">Create Emitter</button>
        </div>
      );
    }

    if (leftTab === "Motion") {
      return (
        <div className="panel-scroll motion-grid">
          {motionPresets.map((preset) => (
            <button className="motion-card" key={preset} data-evz-autowire="1">
              <span>↗</span>
              <strong>{preset}</strong>
            </button>
          ))}
        </div>
      );
    }

    return (
      <div className="panel-scroll">
        {transitionPresets.map((transition) => (
          <button className="transition-card" key={transition.name} data-evz-autowire="1">
            <span className="transition-art" />
            <strong>{transition.name}</strong>
            <small>{transition.detail}</small>
          </button>
        ))}
      </div>
    );
  };

  const renderRightContent = () => {
    if (rightTab === "Particle Editor") {
      return (
        <div className="panel-scroll">
          <SectionTitle eyebrow="Particle editor" title="Emitters, Bursts & Trails" />
          {renderSlider("particles", "Particle Density", "Controls confetti, sparkles, smoke, rain, snow and dust count")}
          {renderSlider("lifetime", "Particle Lifetime", "How long particles remain visible")}
          {renderSlider("speed", "Emitter Speed", "Launch force for bursts and trails")}
          {renderSlider("size", "Particle Size", "Broadcast scale for camera and overlay output")}
          {renderSlider("spread", "Spread / Cone", "Emitter angle and randomness")}
          <div className="effect-type-grid">
            {["Confetti", "Sparkles", "Smoke", "Fire", "Rain", "Snow", "Lightning", "Magic dust", "Hologram pulse"].map((item) => (
              <button key={item} className={item === previewMode ? "active" : ""} data-evz-autowire="1">{item}</button>
            ))}
          </div>
        </div>
      );
    }

    if (rightTab === "Motion Controls") {
      return (
        <div className="panel-scroll">
          <SectionTitle eyebrow="Motion designer" title="Keyframes, Easing & Tweens" />
          {renderSlider("easing", "Easing Strength", "Controls smoothness and animation personality")}
          {renderSlider("glow", "Motion Glow", "Adds responsive glow during motion")}
          <div className="keyframe-list">
            {[
              ["0.0s", "Scale 0% • Opacity 0%"],
              ["0.6s", "Scale 112% • Opacity 100%"],
              ["1.1s", "Scale 100% • Bounce settle"],
              ["2.4s", "Lower third slide out"],
            ].map(([time, detail]) => (
              <div className="keyframe-row" key={time}>
                <span>{time}</span>
                <strong>{detail}</strong>
              </div>
            ))}
          </div>
          <div className="tween-grid">
            {["Ease Out", "Elastic", "Bounce", "Expo", "Smooth Step", "Overshoot"].map((item) => (
              <button key={item} data-evz-autowire="1">{item}</button>
            ))}
          </div>
        </div>
      );
    }

    if (rightTab === "Audio Reactive") {
      return (
        <div className="panel-scroll">
          <SectionTitle eyebrow="Audio-reactive effects" title="Beat Detection & Voice Meter" />
          {renderSlider("beat", "Beat Sensitivity", "Detect music hits and pulse particles")}
          {renderSlider("voice", "Voice Meter Response", "React to host or guest voice level")}
          <div className="audio-meter">
            <div className="meter-bars">
              {Array.from({ length: 24 }).map((_, index) => (
                <span key={index} style={{ height: `${20 + ((index * 13) % 70)}%` }} />
              ))}
            </div>
            <div className="audio-meta">
              <strong>Live audio input</strong>
              <span>Voice 51% • Beat 66% • Bass pulse active</span>
            </div>
          </div>
          <div className="reaction-map">
            <div><strong>Kick beat</strong><span>→ Hologram pulse</span></div>
            <div><strong>Voice peak</strong><span>→ Caption glow</span></div>
            <div><strong>Applause</strong><span>→ Confetti burst</span></div>
          </div>
        </div>
      );
    }

    return (
      <div className="panel-scroll">
        <SectionTitle eyebrow="Physics" title="Colliders, Gravity & Force Fields" />
        {renderSlider("gravity", "Gravity", "Particle drop, bouncing objects and falling confetti")}
        {renderSlider("bounce", "Bounce", "Collider rebound strength")}
        {renderSlider("force", "Force Field", "Wind, radial push and magnetic motion")}
        <div className="physics-grid">
          {["Colliders", "Gravity", "Bouncing objects", "Force fields", "Wind field", "Floor collision"].map((item) => (
            <button key={item} data-evz-autowire="1">{item}</button>
          ))}
        </div>
        <div className="warning-card">
          <strong>Physics live-safe note</strong>
          <span>Force fields are set to medium complexity. EVzone can lower simulation density during live overload.</span>
        </div>
      </div>
    );
  };

  const renderBottomContent = () => {
    if (bottomTab === "State Graph") {
      return (
        <div className="state-graph">
          {stateNodes.map((state, index) => (
            <React.Fragment key={state}>
              <div className={`state-card ${index === 2 || index === 3 ? "active" : ""}`}>
                <strong>{state}</strong>
                <span>{index === 2 ? "Current emission" : "Transition ready"}</span>
              </div>
              {index < stateNodes.length - 1 && <div className="state-arrow">→</div>}
            </React.Fragment>
          ))}
        </div>
      );
    }

    if (bottomTab === "Transition Builder") {
      return (
        <div className="transition-builder-grid">
          {transitionPresets.map((transition) => (
            <div className="transition-builder-card" key={transition.name}>
              <span className="transition-builder-art" />
              <strong>{transition.name}</strong>
              <small>{transition.detail}</small>
              <button className="ghost-btn small" data-evz-autowire="1">Edit Transition</button>
            </div>
          ))}
        </div>
      );
    }

    if (bottomTab === "Live Graphics") {
      return (
        <div className="live-graphics-grid">
          {[
            ["Lower-third animator", "Animated names, titles, and guest IDs."],
            ["Title card animator", "Show intros, segment cards, and premium openers."],
            ["Caption animation", "Type-on, pop, highlight, and karaoke caption styles."],
            ["Live alert animation", "Breaking alerts, applause, milestones, and callouts."],
          ].map(([title, detail]) => (
            <div className="graphics-card" key={title}>
              <div className="graphics-preview">
                <span />
                <b />
              </div>
              <strong>{title}</strong>
              <small>{detail}</small>
              <div className="graphics-controls">
                <button data-evz-autowire="1">Preview</button>
                <button data-evz-autowire="1">Bind</button>
                <button data-evz-autowire="1">Apply</button>
              </div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="timeline-wrap">
        <div className="ruler">
          {Array.from({ length: 10 }).map((_, index) => <span key={index}>{index * 5}s</span>)}
        </div>
        <div className="timeline-lanes">
          {[1, 2, 3].map((lane) => (
            <div className="timeline-lane" key={lane}>
              <div className="lane-label">Lane {lane}</div>
              <div className="lane-track">
                {timelineClips.filter((clip) => clip.lane === lane).map((clip) => (
                  <div key={clip.name} className={`timeline-clip ${clip.tone}`} style={{ left: `${clip.left}%`, width: `${clip.width}%` }}>
                    {clip.name}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="evz-vfx-page">
      <style>{styles}</style>

      <header className="topbar">
        <div className="brand-area">
          <div className="brand-mark">EV</div>
          <div>
            <div className="eyebrow">EVzone Effect Creator</div>
            <h1>VFX & Motion Lab</h1>
            <p>Particles, VFX graphs, motion design, animation timelines, audio-reactive effects, physics, transitions, and live graphics for EVzone Studio.</p>
          </div>
        </div>
        <div className="top-actions">
          <span className="studio-chip"><i />Connected to EVzone Studio</span>
          <button className="ghost-btn" data-evz-autowire="1">Save Motion Preset</button>
          <button className="ghost-btn" data-evz-autowire="1">Preview in EVzone</button>
          <button className="primary-btn" data-evz-autowire="1">Apply to Editor</button>
        </div>
      </header>

      <main className="vfx-shell">
        <aside className="panel left-panel">
          <div className="panel-head">
            <div>
              <div className="eyebrow">Library</div>
              <h2>VFX Assets</h2>
            </div>
          </div>
          <div className="tab-grid">
            {(["VFX Presets", "Emitters", "Motion", "Transitions"] as LeftTab[]).map((tab) => (
              <button key={tab} className={`tab-btn ${leftTab === tab ? "active" : ""}`} onClick={() => setLeftTab(tab)}>
                {tab}
              </button>
            ))}
          </div>
          {renderLeftContent()}
        </aside>

        <section className="panel center-panel">
          <div className="center-top">
            <div>
              <div className="eyebrow">Active VFX system</div>
              <h2>{activePreset.name}</h2>
              <p>{activePreset.type} system • live-safe VFX graph • animation and studio trigger ready.</p>
            </div>
            <div className="preview-tabs">
              {(["Confetti", "Sparkles", "Smoke", "Hologram"] as PreviewMode[]).map((mode) => (
                <button key={mode} className={previewMode === mode ? "active" : ""} onClick={() => setPreviewMode(mode)}>
                  {mode}
                </button>
              ))}
            </div>
          </div>

          <div className={`vfx-preview-stage ${previewMode.toLowerCase()}`}>
            <div className="stage-grid" />
            <div className="studio-frame">
              <div className="anchor-title">EVzone Live Graphics Preview</div>
              <div className="host-silhouette">
                <span className="head" />
                <span className="body" />
              </div>
              <div className="lower-third">
                <strong>EVzone Live</strong>
                <span>Motion-ready lower third</span>
              </div>
              <div className="caption-bar">Caption animation preview</div>
              <div className="alert-pill">LIVE ALERT</div>

              <div className="particle-field">
                {Array.from({ length: 34 }).map((_, index) => (
                  <span
                    key={index}
                    className={`particle p${index % 6}`}
                    style={{
                      left: `${8 + ((index * 19) % 84)}%`,
                      top: `${10 + ((index * 31) % 78)}%`,
                      animationDelay: `${(index % 10) * 0.12}s`,
                    }}
                  />
                ))}
              </div>
              <div className="smoke-cloud cloud-one" />
              <div className="smoke-cloud cloud-two" />
              <div className="hologram-ring ring-one" />
              <div className="hologram-ring ring-two" />
            </div>

            <div className="preview-card top-left">
              <strong>Preview Mode</strong>
              <span>{previewMode} • particle editor + graph + motion active</span>
            </div>
            <div className="preview-card bottom-left">
              {vfxStats.map((stat) => (
                <div key={stat.label}>
                  <span>{stat.label}</span>
                  <strong className={stat.tone}>{stat.value}</strong>
                </div>
              ))}
            </div>
          </div>

          <div className="vfx-graph">
            <div className="graph-head">
              <div>
                <div className="eyebrow">VFX graph</div>
                <h3>Node-Based Particle & Motion Workflow</h3>
              </div>
              <span className="live-safe">Live-safe graph</span>
            </div>

            <div className="graph-canvas">
              <svg className="connections" viewBox="0 0 1000 420" preserveAspectRatio="none">
                <path className="active" d="M120 130 C230 95 270 95 340 100" />
                <path d="M120 140 C230 250 270 270 350 250" />
                <path className="active orange" d="M400 120 C490 135 530 140 610 150" />
                <path d="M410 260 C500 245 530 245 610 255" />
                <path className="active" d="M410 275 C520 345 560 340 615 320" />
                <path d="M680 155 C760 140 805 155 900 195" />
                <path className="active" d="M690 265 C770 260 810 245 900 210" />
              </svg>
              <div className="canvas-grid" />
              {graphNodes.map((node) => (
                <button
                  key={node.id}
                  className={`vfx-node ${node.tone} ${selectedNode.id === node.id ? "selected" : ""}`}
                  style={{ left: `${node.x}%`, top: `${node.y}%` }}
                  onClick={() => setSelectedNode(node)}
                >
                  <span>{node.type}</span>
                  <strong>{node.title}</strong>
                  <small>{node.id === selectedNode.id ? "Selected" : "Ready"}</small>
                  <i />
                </button>
              ))}
              <div className="node-inspector">
                <strong>{selectedNode.title}</strong>
                <span>{selectedNode.type}</span>
                <small>Validated for EVzone Studio preview and live runtime.</small>
              </div>
            </div>
          </div>
        </section>

        <aside className="panel right-panel">
          <div className="right-tabs">
            {(["Particle Editor", "Motion Controls", "Audio Reactive", "Physics"] as RightTab[]).map((tab) => (
              <button key={tab} className={`tab-btn ${rightTab === tab ? "active" : ""}`} onClick={() => setRightTab(tab)}>
                {tab}
              </button>
            ))}
          </div>
          {renderRightContent()}
        </aside>
      </main>

      <section className="panel bottom-panel">
        <div className="bottom-head">
          <div className="bottom-tabs">
            {(["Animation Timeline", "State Graph", "Transition Builder", "Live Graphics"] as BottomTab[]).map((tab) => (
              <button key={tab} className={`tab-btn ${bottomTab === tab ? "active" : ""}`} onClick={() => setBottomTab(tab)}>
                {tab}
              </button>
            ))}
          </div>
          <div className="bottom-actions">
            <button className="ghost-btn small" data-evz-autowire="1">Add Keyframe</button>
            <button className="ghost-btn small" data-evz-autowire="1">Create Tween</button>
            <button className="primary-btn small" data-evz-autowire="1">Run Motion Check</button>
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
.evz-vfx-page {
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
.center-top,
.preview-tabs,
.preview-card,
.graph-head,
.right-tabs,
.bottom-head,
.bottom-tabs,
.bottom-actions,
.slider-head,
.keyframe-row,
.reaction-map div,
.meter-row,
.state-graph,
.live-graphics-grid,
.graphics-controls {
  display: flex;
  align-items: center;
}
.brand-area { gap: 16px; max-width: 960px; }
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
.center-top p {
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
.preset-card,
.emitter-card,
.motion-card,
.transition-card,
.preview-tabs button,
.effect-type-grid button,
.tween-grid button,
.physics-grid button,
.ai-actions button,
.graphics-controls button {
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
.preset-card:hover,
.motion-card:hover,
.transition-card:hover,
.preview-tabs button:hover,
.effect-type-grid button:hover,
.tween-grid button:hover,
.physics-grid button:hover,
.graphics-controls button:hover {
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
.vfx-shell {
  max-width: 100%;
  margin: 0;
  display: grid;
  grid-template-columns: 315px minmax(650px, 1fr) 395px;
  gap: 18px;
}
.panel {
  border-radius: var(--radius-xl);
  overflow: hidden;
}
.left-panel,
.right-panel,
.center-panel {
  min-height: 890px;
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
.preview-tabs button.active,
.effect-type-grid button.active {
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
.preset-card {
  width: 100%;
  display: grid;
  grid-template-columns: 56px 1fr;
  gap: 12px;
  align-items: center;
  text-align: left;
}
.preset-card.active {
  border-color: rgba(3,205,140,0.35);
  background: rgba(3,205,140,0.07);
}
.preset-art,
.transition-art,
.transition-builder-art,
.graphics-preview {
  height: 54px;
  border-radius: 16px;
  background:
    radial-gradient(circle at 26% 28%, rgba(3,205,140,0.40), transparent 28%),
    radial-gradient(circle at 70% 32%, rgba(247,127,0,0.30), transparent 30%),
    var(--evz-card);
}
.preset-art.orange {
  background:
    radial-gradient(circle at 24% 26%, rgba(247,127,0,0.42), transparent 30%),
    radial-gradient(circle at 70% 34%, rgba(3,205,140,0.24), transparent 30%),
    var(--evz-card);
}
.preset-copy {
  display: grid;
  gap: 4px;
}
small {
  color: var(--evz-muted);
  font-size: 12px;
  line-height: 1.45;
}
.emitter-card {
  display: grid;
  grid-template-columns: 42px 1fr auto;
  gap: 10px;
  align-items: center;
  text-align: left;
}
.emitter-icon {
  width: 40px;
  height: 40px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  color: var(--evz-green);
  background: rgba(3,205,140,0.10);
  font-size: 22px;
  font-weight: 900;
}
.emitter-card div,
.transition-card,
.graphics-card {
  display: grid;
  gap: 4px;
}
.emitter-card em {
  color: var(--evz-green);
  font-size: 11px;
  font-style: normal;
  font-weight: 900;
}
.motion-grid {
  grid-template-columns: 1fr 1fr;
}
.motion-card {
  min-height: 86px;
  display: grid;
  gap: 10px;
  text-align: left;
}
.motion-card span {
  width: 34px;
  height: 34px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  color: var(--evz-orange);
  background: rgba(247,127,0,0.10);
}
.transition-card {
  width: 100%;
  text-align: left;
}
.transition-art {
  height: 78px;
}
.center-panel {
  display: grid;
  grid-template-rows: auto 450px 1fr;
}
.center-top {
  padding: 18px;
  justify-content: space-between;
  gap: 18px;
  border-bottom: 1px solid var(--evz-soft-line);
  background: var(--evz-card);
}
.center-top h2 {
  margin: 4px 0 6px;
  letter-spacing: -0.035em;
}
.preview-tabs {
  gap: 8px;
  flex-wrap: wrap;
  justify-content: flex-end;
}
.preview-tabs button {
  padding: 9px 11px;
  font-size: 12px;
}
.vfx-preview-stage {
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
.stage-grid,
.canvas-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(148,163,184,0.13) 1px, transparent 1px),
    linear-gradient(90deg, rgba(148,163,184,0.13) 1px, transparent 1px);
  background-size: 34px 34px;
}
.studio-frame {
  position: absolute;
  inset: 54px 80px 62px;
  border-radius: 30px;
  overflow: hidden;
  border: 1px solid var(--evz-border);
  background:
    radial-gradient(circle at 50% 24%, rgba(3,205,140,0.18), transparent 30%),
    linear-gradient(180deg, var(--evz-frost-strong), var(--evz-frost-soft));
  box-shadow: inset 0 0 60px var(--evz-frost-soft), 0 30px 70px rgba(15,23,42,0.12);
}
.anchor-title {
  position: absolute;
  top: 18px;
  left: 20px;
  padding: 8px 11px;
  border-radius: 999px;
  background: var(--evz-card);
  color: var(--evz-green);
  font-weight: 900;
  font-size: 12px;
}
.host-silhouette {
  position: absolute;
  left: 50%;
  bottom: 64px;
  width: 160px;
  height: 220px;
  transform: translateX(-50%);
}
.host-silhouette .head {
  position: absolute;
  left: 50%;
  top: 6px;
  width: 86px;
  height: 86px;
  transform: translateX(-50%);
  border-radius: 999px;
  background: linear-gradient(135deg, rgba(247,127,0,0.24), rgba(3,205,140,0.20));
  border: 1px solid var(--evz-border);
}
.host-silhouette .body {
  position: absolute;
  left: 18px;
  bottom: 0;
  width: 124px;
  height: 144px;
  border-radius: 72px 72px 24px 24px;
  background: linear-gradient(135deg, rgba(3,205,140,0.20), rgba(247,127,0,0.14));
}
.lower-third {
  position: absolute;
  left: 10%;
  right: 10%;
  bottom: 28px;
  border-radius: 18px;
  padding: 14px 18px;
  background: var(--evz-card);
  border: 1px solid var(--evz-border);
  box-shadow: 0 18px 36px rgba(15,23,42,0.10);
  display: grid;
  gap: 4px;
}
.lower-third strong { color: var(--evz-green); }
.lower-third span { color: var(--evz-muted); font-size: 12px; }
.caption-bar {
  position: absolute;
  right: 22px;
  bottom: 108px;
  border-radius: 999px;
  padding: 9px 12px;
  background: rgba(15,23,42,0.72);
  color: white;
  font-size: 12px;
  font-weight: 800;
}
.alert-pill {
  position: absolute;
  right: 22px;
  top: 20px;
  border-radius: 999px;
  padding: 8px 11px;
  color: white;
  background: linear-gradient(135deg, var(--evz-orange), #fb923c);
  font-size: 11px;
  font-weight: 900;
  box-shadow: 0 12px 24px rgba(247,127,0,0.22);
}
.particle-field {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.particle {
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 4px;
  background: var(--evz-green);
  animation: floatParticle 3s ease-in-out infinite;
}
.particle.p1 { background: var(--evz-orange); border-radius: 999px; }
.particle.p2 { width: 8px; height: 20px; background: rgba(3,205,140,0.70); }
.particle.p3 { width: 16px; height: 7px; background: rgba(247,127,0,0.76); }
.particle.p4 { background: var(--evz-card); box-shadow: 0 0 18px rgba(3,205,140,0.42); }
.particle.p5 { background: rgba(15,23,42,0.24); }
@keyframes floatParticle {
  0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.35; }
  50% { transform: translateY(-28px) rotate(80deg); opacity: 1; }
}
.smoke-cloud {
  position: absolute;
  width: 180px;
  height: 74px;
  border-radius: 999px;
  background: radial-gradient(circle, rgba(166,166,166,0.26), transparent 70%);
  filter: blur(2px);
  opacity: 0;
}
.smoke .smoke-cloud { opacity: 1; animation: smokeDrift 5s ease-in-out infinite; }
.cloud-one { left: 10%; top: 45%; }
.cloud-two { right: 8%; top: 32%; animation-delay: 1.2s !important; }
@keyframes smokeDrift {
  0%,100% { transform: translateX(0); opacity: .25; }
  50% { transform: translateX(28px); opacity: .65; }
}
.hologram-ring {
  position: absolute;
  left: 50%;
  top: 48%;
  border: 2px solid rgba(3,205,140,0.34);
  border-radius: 999px;
  transform: translate(-50%, -50%);
  opacity: 0;
}
.hologram .hologram-ring { opacity: 1; animation: ringPulse 2.6s ease-in-out infinite; }
.ring-one { width: 260px; height: 260px; }
.ring-two { width: 370px; height: 370px; animation-delay: .4s !important; }
@keyframes ringPulse {
  0%,100% { transform: translate(-50%, -50%) scale(.86); opacity: .18; }
  50% { transform: translate(-50%, -50%) scale(1.08); opacity: .70; }
}
.sparkles .particle { border-radius: 999px; box-shadow: 0 0 20px rgba(3,205,140,0.5); }
.confetti .particle { opacity: .95; }
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
.preview-card .green { color: var(--evz-green); }
.preview-card .orange { color: var(--evz-orange); }
.vfx-graph {
  margin: 0 16px 16px;
  border-radius: 24px;
  overflow: hidden;
  border: 1px solid var(--evz-soft-line);
  background: var(--evz-card-solid);
}
.graph-head {
  justify-content: space-between;
  gap: 16px;
  padding: 16px;
  border-bottom: 1px solid var(--evz-soft-line);
}
.graph-head h3 { margin: 4px 0 0; }
.live-safe {
  border-radius: 999px;
  padding: 8px 11px;
  color: var(--evz-green);
  background: rgba(3,205,140,0.10);
  font-weight: 900;
  font-size: 12px;
}
.graph-canvas {
  position: relative;
  height: 370px;
  overflow: hidden;
  background:
    radial-gradient(circle at 20% 16%, rgba(3,205,140,0.12), transparent 28%),
    var(--evz-card);
}
.connections {
  position: absolute;
  inset: 0;
  z-index: 2;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
.connections path {
  fill: none;
  stroke: rgba(100,116,139,0.42);
  stroke-width: 3;
  stroke-linecap: round;
}
.connections path.active {
  stroke: var(--evz-green);
  stroke-width: 4;
  stroke-dasharray: 10 8;
  animation: dash 1.8s linear infinite;
}
.connections path.orange { stroke: var(--evz-orange); }
@keyframes dash { to { stroke-dashoffset: -36; } }
.vfx-node {
  position: absolute;
  z-index: 4;
  width: 162px;
  min-height: 92px;
  border: 1px solid var(--evz-line);
  border-radius: 16px;
  background: var(--evz-card-solid);
  padding: 11px;
  display: grid;
  gap: 6px;
  text-align: left;
  cursor: pointer;
  box-shadow: 0 14px 28px rgba(15,23,42,0.10);
}
.vfx-node.selected {
  border-color: rgba(3,205,140,0.55);
  outline: 4px solid rgba(3,205,140,0.16);
}
.vfx-node.green { border-top: 5px solid var(--evz-green); }
.vfx-node.orange { border-top: 5px solid var(--evz-orange); }
.vfx-node.gray { border-top: 5px solid var(--evz-medium); }
.vfx-node span {
  width: fit-content;
  border-radius: 999px;
  padding: 5px 7px;
  color: var(--evz-muted);
  background: rgba(148,163,184,0.11);
  font-size: 10px;
  font-weight: 900;
}
.vfx-node i {
  position: absolute;
  right: -7px;
  top: 50%;
  width: 14px;
  height: 14px;
  border-radius: 999px;
  background: var(--evz-green);
  box-shadow: 0 0 0 6px rgba(3,205,140,0.13);
}
.node-inspector {
  position: absolute;
  right: 16px;
  bottom: 16px;
  z-index: 5;
  width: 240px;
  border-radius: 18px;
  padding: 13px;
  background: var(--evz-card);
  border: 1px solid var(--evz-border);
  display: grid;
  gap: 5px;
  box-shadow: 0 14px 26px rgba(15,23,42,0.09);
}
.node-inspector span { color: var(--evz-green); font-weight: 900; }
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
.slider-card,
.keyframe-row,
.warning-card,
.audio-meter,
.reaction-map,
.compression-card,
.timeline-wrap,
.state-card,
.transition-builder-card,
.graphics-card {
  border: 1px solid var(--evz-soft-line);
  border-radius: 18px;
  background: var(--evz-card-solid);
  padding: 14px;
}
.slider-card { display: grid; gap: 10px; }
.slider-head {
  justify-content: space-between;
  gap: 12px;
}
.slider-head > div { display: grid; gap: 4px; }
.slider-head span {
  color: var(--evz-green);
  font-weight: 900;
}
input[type="range"] {
  width: 100%;
  accent-color: var(--evz-green);
}
.slider-track,
.range {
  width: 100%;
  height: 8px;
  border-radius: 999px;
  background: rgba(148,163,184,0.17);
  overflow: hidden;
}
.slider-track span,
.range b {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--evz-green), var(--evz-orange));
}
.effect-type-grid,
.tween-grid,
.physics-grid,
.transition-builder-grid,
.live-graphics-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
.effect-type-grid button,
.tween-grid button,
.physics-grid button {
  color: var(--evz-muted);
  padding: 10px;
}
.keyframe-list {
  display: grid;
  gap: 10px;
}
.keyframe-row {
  justify-content: space-between;
  gap: 12px;
}
.keyframe-row span {
  color: var(--evz-orange);
  font-weight: 900;
}
.keyframe-row strong {
  font-size: 13px;
}
.audio-meter {
  display: grid;
  gap: 12px;
}
.meter-bars {
  height: 120px;
  display: flex;
  align-items: end;
  gap: 5px;
  padding: 12px;
  border-radius: 16px;
  background: var(--evz-card);
  border: 1px solid var(--evz-soft-line);
}
.meter-bars span {
  flex: 1;
  min-width: 4px;
  border-radius: 999px 999px 0 0;
  background: linear-gradient(180deg, var(--evz-orange), var(--evz-green));
  animation: meterPulse 1.2s ease-in-out infinite;
}
.meter-bars span:nth-child(2n) { animation-delay: .2s; }
.meter-bars span:nth-child(3n) { animation-delay: .4s; }
@keyframes meterPulse {
  0%,100% { transform: scaleY(.72); }
  50% { transform: scaleY(1); }
}
.audio-meta {
  display: grid;
  gap: 4px;
}
.audio-meta span,
.warning-card span,
.reaction-map span,
.material-warning p,
.graphics-card small {
  color: var(--evz-muted);
  line-height: 1.45;
}
.reaction-map {
  display: grid;
  gap: 10px;
}
.reaction-map div {
  justify-content: space-between;
  gap: 10px;
  border-bottom: 1px solid var(--evz-soft-line);
  padding-bottom: 10px;
}
.reaction-map div:last-child {
  border-bottom: 0;
  padding-bottom: 0;
}
.warning-card {
  display: grid;
  gap: 6px;
  border-color: rgba(247,127,0,0.24);
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
.timeline-wrap { display: grid; gap: 14px; }
.ruler {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  color: var(--evz-muted);
  font-size: 12px;
}
.timeline-lanes {
  display: grid;
  gap: 12px;
}
.timeline-lane {
  display: grid;
  grid-template-columns: 90px 1fr;
  gap: 12px;
  align-items: center;
}
.lane-label {
  color: var(--evz-muted);
  font-size: 12px;
  font-weight: 900;
}
.lane-track {
  position: relative;
  height: 50px;
  border-radius: 16px;
  background: rgba(148,163,184,0.10);
  border: 1px solid var(--evz-soft-line);
}
.timeline-clip {
  position: absolute;
  top: 8px;
  height: 34px;
  border-radius: 13px;
  color: white;
  font-size: 12px;
  font-weight: 900;
  display: grid;
  place-items: center;
  box-shadow: 0 12px 24px rgba(15,23,42,0.10);
}
.timeline-clip.green { background: linear-gradient(135deg, var(--evz-green), #10b981); }
.timeline-clip.orange { background: linear-gradient(135deg, var(--evz-orange), #fb923c); }
.timeline-clip.gray { background: linear-gradient(135deg, #64748b, #94a3b8); }
.state-graph {
  gap: 10px;
  overflow-x: auto;
}
.state-card {
  min-width: 150px;
  display: grid;
  gap: 6px;
}
.state-card.active {
  border-color: rgba(3,205,140,0.26);
  background: rgba(3,205,140,0.07);
}
.state-card span {
  color: var(--evz-muted);
  font-size: 12px;
}
.state-arrow {
  color: var(--evz-orange);
  font-weight: 900;
  font-size: 22px;
}
.transition-builder-grid {
  grid-template-columns: repeat(6, minmax(0,1fr));
}
.transition-builder-card {
  display: grid;
  gap: 10px;
}
.transition-builder-art {
  height: 82px;
}
.live-graphics-grid {
  grid-template-columns: repeat(4, minmax(0,1fr));
}
.graphics-card {
  display: grid;
  gap: 10px;
}
.graphics-preview {
  position: relative;
  height: 100px;
  overflow: hidden;
}
.graphics-preview span {
  position: absolute;
  left: 12px;
  right: 12px;
  bottom: 16px;
  height: 28px;
  border-radius: 999px;
  background: var(--evz-card);
  box-shadow: 0 10px 20px rgba(15,23,42,0.08);
}
.graphics-preview b {
  position: absolute;
  left: 22px;
  bottom: 24px;
  width: 44%;
  height: 9px;
  border-radius: 999px;
  background: var(--evz-green);
}
.graphics-controls {
  gap: 7px;
  flex-wrap: wrap;
}
.graphics-controls button {
  padding: 8px 10px;
  font-size: 12px;
  color: var(--evz-muted);
}
@media (max-width: 1450px) {
  .vfx-shell { grid-template-columns: 300px 1fr; }
  .right-panel { grid-column: span 2; min-height: auto; }
  .transition-builder-grid,
  .live-graphics-grid { grid-template-columns: repeat(2, minmax(0,1fr)); }
}
@media (max-width: 1050px) {
  .topbar { flex-direction: column; align-items: flex-start; }
  .vfx-shell { grid-template-columns: 1fr; }
  .right-panel { grid-column: auto; }
  .center-panel { grid-template-rows: auto 420px auto; }
  .studio-frame { inset: 58px 36px 62px; }
}
@media (max-width: 700px) {
  .evz-vfx-page { padding: 14px; }
  .top-actions > * { width: 100%; justify-content: center; }
  .center-top,
  .bottom-head { flex-direction: column; align-items: flex-start; }
  .tab-grid,
  .motion-grid,
  .effect-type-grid,
  .tween-grid,
  .physics-grid,
  .transition-builder-grid,
  .live-graphics-grid { grid-template-columns: 1fr; }
  .preview-card.bottom-left { grid-template-columns: 1fr 1fr; right: 16px; }
  .node-inspector { display: none; }
  .vfx-node { width: 140px; }
  .timeline-lane { grid-template-columns: 1fr; }
  .studio-frame { inset: 68px 18px 74px; }
}
`;
