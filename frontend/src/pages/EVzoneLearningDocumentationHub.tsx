import React, { useMemo, useState } from "react";
import TipsAndUpdatesRoundedIcon from "@mui/icons-material/TipsAndUpdatesRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";

type PathKey =
  | "Getting Started"
  | "First Effect"
  | "Face Effects"
  | "Beauty / Makeup"
  | "Studio Overlay"
  | "Visual Scripting"
  | "AI Effects"
  | "VFX"
  | "Tracking"
  | "Studio Integration";

type RightTab = "Search" | "API Docs" | "Shortcuts" | "Related";
type BottomTab = "Best Practices" | "Technical Guidelines" | "Troubleshooting" | "Example Guides";

type LearningPath = {
  key: PathKey;
  title: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "Studio Pro";
  time: string;
  progress: number;
  summary: string;
  modules: string[];
  outcomes: string[];
  relatedTemplates: string[];
  relatedProjects: string[];
};

const learningPaths: LearningPath[] = [
  {
    key: "Getting Started",
    title: "Getting Started Path",
    level: "Beginner",
    time: "25 min",
    progress: 74,
    summary: "Learn the EVzone Effect Creator workflow, resource library, project setup, preview, and studio send process.",
    modules: ["Open the Creator from EVzone Studio", "Create or import a project", "Understand panels and libraries", "Preview safely", "Send to Studio"],
    outcomes: ["Navigate the creator confidently", "Understand live-safe production flow", "Know where to find templates and help"],
    relatedTemplates: ["Premium Host Intro Template", "Studio Overlay Starter", "Clean Broadcast LUT"],
    relatedProjects: ["First AR Intro", "Studio Lower Third Demo"],
  },
  {
    key: "First Effect",
    title: "First Effect Guide",
    level: "Beginner",
    time: "35 min",
    progress: 58,
    summary: "Build your first complete effect from blank or template, add a camera target, preview it, and send it to EVzone Studio.",
    modules: ["Choose a starter template", "Add beauty + overlay + VFX", "Map a studio button", "Run quality checks", "Package privately"],
    outcomes: ["Create a live-ready starter effect", "Bind the effect to a studio scene", "Generate preview assets"],
    relatedTemplates: ["Live Show Starter Pack", "EVzone Confetti Burst", "Premium Lower Third Collection"],
    relatedProjects: ["First Effect Walkthrough", "Host Camera Intro Example"],
  },
  {
    key: "Face Effects",
    title: "Face Effects Path",
    level: "Intermediate",
    time: "50 min",
    progress: 43,
    summary: "Master face tracking, face mesh, expression triggers, face occlusion, and face-safe AR effects.",
    modules: ["Face tracking basics", "Landmarks and mesh", "Expression triggers", "Face occlusion", "Live-safe face effects"],
    outcomes: ["Build reliable face AR", "Use expression triggers", "Avoid unsafe distortion"],
    relatedTemplates: ["Face Avatar Drive Starter", "Smile Sparkle Trigger", "Face Occlusion Matte"],
    relatedProjects: ["Face AR Demo", "Expression Trigger Example"],
  },
  {
    key: "Beauty / Makeup",
    title: "Beauty and Makeup Path",
    level: "Intermediate",
    time: "45 min",
    progress: 62,
    summary: "Create natural beauty filters, makeup looks, LUTs, skin materials, and conservative face-safe adjustments.",
    modules: ["Beauty controls", "Makeup blending", "LUTs and color", "Skin material safety", "Before/after testing"],
    outcomes: ["Create premium but natural filters", "Keep studio skin tones readable", "Validate makeup intensity"],
    relatedTemplates: ["Clean Broadcast Beauty Preset", "Makeup Velvet Blend", "Broadcast Clean LUT Pack"],
    relatedProjects: ["Beauty Filter Demo", "Makeup Live Preview"],
  },
  {
    key: "Studio Overlay",
    title: "Studio Overlay Path",
    level: "Beginner",
    time: "40 min",
    progress: 80,
    summary: "Design lower thirds, title cards, captions, scoreboards, countdowns, alerts, and overlay-safe motion.",
    modules: ["Overlay safe areas", "Lower thirds", "Caption animation", "Scoreboard setup", "Studio layer binding"],
    outcomes: ["Create studio-safe overlays", "Bind overlays to layers", "Animate readable graphics"],
    relatedTemplates: ["Premium Lower Third Collection", "Studio UI Kit", "Countdown Reveal Subgraph"],
    relatedProjects: ["Lower Third Example", "Scoreboard Overlay Demo"],
  },
  {
    key: "Visual Scripting",
    title: "Visual Scripting Path",
    level: "Intermediate",
    time: "60 min",
    progress: 39,
    summary: "Use no-code logic, variables, subgraphs, state machines, triggers, and EVzone Studio control nodes.",
    modules: ["Node graph basics", "Variables", "Trigger/action/condition builders", "State machines", "Debugging"],
    outcomes: ["Build interactive logic", "Reuse subgraphs", "Debug active paths"],
    relatedTemplates: ["Countdown Reveal Subgraph", "Smile Confetti Graph", "Studio Scene Switcher"],
    relatedProjects: ["Visual Logic Starter", "Interactive Trigger Demo"],
  },
  {
    key: "AI Effects",
    title: "AI Effects Path",
    level: "Beginner",
    time: "38 min",
    progress: 52,
    summary: "Use AI Creator Hub to generate effects, overlays, materials, scripts, node graphs, animations, and prompt presets.",
    modules: ["Prompt writing", "AI result history", "Remix and regenerate", "AI safety checker", "Open result in editor"],
    outcomes: ["Generate studio-native assets", "Improve prompts", "Validate AI results before live use"],
    relatedTemplates: ["AI Prompt Preset Pack", "Emerald Hologram Material", "Premium Host Intro Template"],
    relatedProjects: ["AI Host Intro", "AI Lower Third Pack"],
  },
  {
    key: "VFX",
    title: "VFX Path",
    level: "Advanced",
    time: "55 min",
    progress: 48,
    summary: "Create live-safe particles, transitions, motion, lower-third animations, audio-reactive effects, and physics presets.",
    modules: ["Particle editor", "Emitters and bursts", "Animation timeline", "Audio-reactive effects", "Performance checks"],
    outcomes: ["Build premium VFX", "Keep VFX live-safe", "Use motion without overwhelming viewers"],
    relatedTemplates: ["EVzone Confetti Burst", "Premium Sparkle Sweep", "Hologram Pulse"],
    relatedProjects: ["VFX Motion Demo", "Audio Reactive Overlay"],
  },
  {
    key: "Tracking",
    title: "Tracking Path",
    level: "Advanced",
    time: "70 min",
    progress: 46,
    summary: "Learn face, hand, body, segmentation, image/object, world AR, depth, calibration, and stability scoring.",
    modules: ["Tracking sources", "Calibration", "Gesture builder", "Segmentation", "Stability scoring"],
    outcomes: ["Create robust tracked effects", "Calibrate for studio cameras", "Handle fallback states"],
    relatedTemplates: ["Gesture Trigger Pack", "Face Avatar Drive Starter", "Segmentation Studio"],
    relatedProjects: ["Tracking Lab Demo", "Gesture Interaction Demo"],
  },
  {
    key: "Studio Integration",
    title: "Studio Integration Path",
    level: "Studio Pro",
    time: "65 min",
    progress: 67,
    summary: "Connect effects to EVzone Live Studio scenes, cameras, overlays, triggers, control surfaces, runtime settings, and fallback behavior.",
    modules: ["Bridge status", "Scene and camera binding", "Trigger mapping", "Control surface builder", "Send to Studio"],
    outcomes: ["Connect effects to live production", "Map operator controls", "Send updates safely"],
    relatedTemplates: ["Studio Control Surface Presets", "Studio Overlay Starter", "Live Show Starter Pack"],
    relatedProjects: ["Studio Integration Demo", "Send to Studio Walkthrough"],
  },
];

const apiDocs = [
  { title: "Components API", detail: "Add, update, bind, and validate effect components." },
  { title: "Tracking API", detail: "Face, hand, pose, segmentation, image/object and world AR hooks." },
  { title: "Events API", detail: "Emit, listen, queue, throttle, and debug runtime events." },
  { title: "Studio Bridge API", detail: "Scene binding, camera routing, studio events, hotkeys, and control surfaces." },
  { title: "VFX API", detail: "Emitters, particle bursts, trails, transitions, and animation callbacks." },
  { title: "AI Tools API", detail: "Prompt-to-effect, AI generation, optimization, and safety checks." },
];

const shortcuts = [
  ["⌘ / Ctrl + K", "Open command palette"],
  ["⌘ / Ctrl + S", "Save and snapshot"],
  ["⌘ / Ctrl + Z", "Undo"],
  ["Shift + F", "Frame selection"],
  ["Space", "Preview pause / resume"],
  ["F5", "Trigger studio test event"],
  ["F6", "Reset preview session"],
  ["Shift + 2", "Emergency disable"],
];

const troubleshooting = [
  { title: "Studio bridge disconnected", detail: "Open Studio Connection & Readiness, reconnect bridge, then reload scene targets." },
  { title: "Missing asset warning", detail: "Open Projects & Versions Hub or Assets Panel, then repair missing local references." },
  { title: "Low FPS or high GPU cost", detail: "Run Preview & Quality Center, reduce particles, compress textures, or enable fallback mode." },
  { title: "Tracking unstable", detail: "Recalibrate in Tracking Lab, check lighting, switch preview subject, and validate fallback controls." },
  { title: "Overlay unreadable", detail: "Use accessibility check, increase contrast, verify safe areas, and test mobile frame preview." },
];

const bestPractices = [
  "Design for the live host camera first, then adapt to guest, mobile, and overlay targets.",
  "Keep all generated and imported assets validated before sending to Studio.",
  "Use fallback behavior for heavy VFX, glass shaders, segmentation, and audio-reactive effects.",
  "Prefer readable motion and short animation timings for lower thirds and live alerts.",
  "Save version snapshots before major AI generations, scripting changes, and send-to-studio exports.",
  "Keep private preview and QR links internal to EVzone production workflows.",
];

const technicalGuidelines = [
  { label: "Texture budget", value: "Prefer KTX2 / compressed textures and avoid oversized HDR files." },
  { label: "Frame rate", value: "Target 60 FPS for studio output and prepare fallback below 45 FPS." },
  { label: "Safe areas", value: "Keep overlays, captions, and lower thirds inside broadcast safe margins." },
  { label: "Script timing", value: "Keep runtime scripts under 8 ms where possible." },
  { label: "Accessibility", value: "Avoid intense flashing, overly fast motion, and low-contrast typography." },
  { label: "Studio controls", value: "Every live effect should have a clear operator trigger and emergency disable." },
];

const exampleGuides = [
  { title: "Premium Host Intro", type: "Template Guide", time: "18 min", level: "Beginner" },
  { title: "Smile Confetti Interaction", type: "Visual Logic Guide", time: "24 min", level: "Intermediate" },
  { title: "AI Lower Third Pack", type: "AI Workflow Guide", time: "20 min", level: "Beginner" },
  { title: "Studio Control Surface", type: "Integration Guide", time: "28 min", level: "Studio Pro" },
  { title: "Beauty Filter Preview", type: "Quality Guide", time: "16 min", level: "Intermediate" },
];

const docIndex = [
  "Create New Effect",
  "Open Project",
  "Editor Workspace Panels",
  "Scene Hierarchy",
  "Inspector",
  "Assets Panel",
  "Tracking Lab",
  "Visual Logic Lab",
  "Code & Developer Lab",
  "Materials & Shader Lab",
  "VFX & Motion Lab",
  "Interactive Effects Lab",
  "AI Creator Hub",
  "Free Resource Library",
  "Preview & Quality Center",
  "Studio Integration Center",
  "Send to Studio Wizard",
];

export default function EVzoneLearningDocumentationHub() {
  const [activePath, setActivePath] = useState<PathKey>("Getting Started");
  const [rightTab, setRightTab] = useState<RightTab>("Search");
  const [bottomTab, setBottomTab] = useState<BottomTab>("Best Practices");
  const [search, setSearch] = useState("");
  const [selectedModule, setSelectedModule] = useState(0);

  const currentPath = learningPaths.find((path) => path.key === activePath) ?? learningPaths[0];

  const searchResults = useMemo(() => {
    const query = search.toLowerCase().trim();
    if (!query) return docIndex.slice(0, 7);
    return docIndex.filter((item) => item.toLowerCase().includes(query)).slice(0, 8);
  }, [search]);

  const stats = [
    { label: "Learning paths", value: "10", tone: "green" },
    { label: "Guides", value: "120+", tone: "orange" },
    { label: "API topics", value: "48", tone: "green" },
    { label: "Examples", value: "36", tone: "green" },
  ];

  const renderRightPanel = () => {
    if (rightTab === "API Docs") {
      return (
        <div className="panel-scroll">
          <SectionTitle eyebrow="API docs" title="Developer References" />
          {apiDocs.map((doc) => (
            <button className="api-card" key={doc.title} data-evz-autowire="1">
              <span>API</span>
              <div>
                <strong>{doc.title}</strong>
                <small>{doc.detail}</small>
              </div>
            </button>
          ))}
        </div>
      );
    }

    if (rightTab === "Shortcuts") {
      return (
        <div className="panel-scroll">
          <SectionTitle eyebrow="Keyboard shortcuts" title="Fast Creator Commands" />
          <div className="shortcut-list">
            {shortcuts.map(([key, action]) => (
              <div className="shortcut-row" key={key}>
                <kbd>{key}</kbd>
                <span>{action}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (rightTab === "Related") {
      return (
        <div className="panel-scroll">
          <SectionTitle eyebrow="Related templates" title="Start Faster" />
          <div className="related-list">
            {currentPath.relatedTemplates.map((template) => (
              <button className="related-card" key={template} data-evz-autowire="1">
                <span className="related-art" />
                <strong>{template}</strong>
                <small>Template / asset pack</small>
              </button>
            ))}
          </div>
          <SectionTitle eyebrow="Related example projects" title="Learn by Opening" />
          <div className="related-list">
            {currentPath.relatedProjects.map((project) => (
              <button className="related-card compact" key={project} data-evz-autowire="1">
                <span className="project-dot" />
                <strong>{project}</strong>
              </button>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="panel-scroll">
        <SectionTitle eyebrow="Searchable documentation" title="Find Help Fast" />
        <div className="doc-search">
          <span>⌕</span>
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search docs, APIs, guides, shortcuts..." />
        </div>
        <div className="search-results">
          {searchResults.map((result) => (
            <button key={result} data-evz-autowire="1">
              <strong>{result}</strong>
              <small>Documentation topic • EVzone Creator</small>
            </button>
          ))}
        </div>
        <div className="tip-card">
          <strong>Search tip</strong>
          <span>Try “tracking”, “send to studio”, “node graph”, “keyboard”, “fallback”, or “API”.</span>
        </div>
      </div>
    );
  };

  const renderBottomPanel = () => {
    if (bottomTab === "Technical Guidelines") {
      return (
        <div className="guideline-grid">
          {technicalGuidelines.map((guide) => (
            <div className="guideline-card" key={guide.label}>
              <strong>{guide.label}</strong>
              <span>{guide.value}</span>
            </div>
          ))}
        </div>
      );
    }

    if (bottomTab === "Troubleshooting") {
      return (
        <div className="troubleshooting-grid">
          {troubleshooting.map((item) => (
            <div className="trouble-card" key={item.title}>
              <span className="warning-dot" />
              <div>
                <strong>{item.title}</strong>
                <small>{item.detail}</small>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (bottomTab === "Example Guides") {
      return (
        <div className="example-grid">
          {exampleGuides.map((guide) => (
            <div className="example-card" key={guide.title}>
              <div className="example-art" />
              <div>
                <strong>{guide.title}</strong>
                <small>{guide.type} • {guide.time}</small>
              </div>
              <em>{guide.level}</em>
            </div>
          ))}
        </div>
      );
    }

    return (
        <div className="practice-grid">
          {bestPractices.map((practice, index) => (
            <div className="practice-card" key={practice}>
              <span aria-hidden="true"><TipsAndUpdatesRoundedIcon fontSize="small" /></span>
              <strong>{practice}</strong>
            </div>
          ))}
        </div>
    );
  };

  return (
    <div className="evz-learning-page">
      <style>{styles}</style>

      <header className="topbar">
        <div className="brand-area">
          <div className="brand-mark">EV</div>
          <div>
            <div className="eyebrow">EVzone Effect Creator</div>
            <h1>Learning & Documentation Hub</h1>
            <p>Built-in education, guides, searchable documentation, API references, best practices, troubleshooting, shortcuts, and example project help.</p>
          </div>
        </div>
        <div className="top-actions">
          <span className="studio-chip"><i />Connected to EVzone Studio</span>
          <button className="ghost-btn" data-evz-autowire="1">Open First Effect Guide</button>
          <button className="ghost-btn" data-evz-autowire="1">Search Docs</button>
          <button className="primary-btn" data-evz-autowire="1">Continue Learning</button>
        </div>
      </header>

      <section className="learning-hero">
        <div className="hero-card main">
          <div className="learning-orb">
            <span>{currentPath.progress}%</span>
            <small>Path</small>
          </div>
          <div>
            <div className="eyebrow">Built-in creator education</div>
            <h2>{currentPath.title}</h2>
            <p>{currentPath.summary}</p>
          </div>
        </div>
        {stats.map((stat) => (
          <div className="hero-card mini" key={stat.label}>
            <span>{stat.label}</span>
            <strong className={stat.tone}>{stat.value}</strong>
          </div>
        ))}
      </section>

      <main className="learning-shell">
        <aside className="panel path-panel">
          <div className="panel-head">
            <div>
              <div className="eyebrow">Learning paths</div>
              <h2>Choose a Path</h2>
            </div>
          </div>
          <div className="path-list">
            {learningPaths.map((path) => (
              <button
                key={path.key}
                className={activePath === path.key ? "active" : ""}
                onClick={() => {
                  setActivePath(path.key);
                  setSelectedModule(0);
                }}
              >
                <span className="path-icon">{path.level.slice(0, 2).toUpperCase()}</span>
                <div>
                  <strong>{path.title}</strong>
                  <small>{path.level} • {path.time}</small>
                  <div className="mini-progress"><b style={{ width: `${path.progress}%` }} /></div>
                </div>
              </button>
            ))}
          </div>
        </aside>

        <section className="panel tutorial-panel">
          <div className="tutorial-top">
            <div>
              <div className="eyebrow">Tutorial detail pane</div>
              <h2>{currentPath.title}</h2>
              <p>{currentPath.level} • {currentPath.time} • {currentPath.progress}% complete</p>
            </div>
            <div className="tutorial-actions">
              <button className="ghost-btn" data-evz-autowire="1">Bookmark</button>
              <button className="ghost-btn" data-evz-autowire="1">Open Example</button>
              <button className="primary-btn" data-evz-autowire="1">Start Lesson</button>
            </div>
          </div>

          <div className="tutorial-body">
            <div className="lesson-view">
              <div className="lesson-visual">
                <div className="stage-grid" />
                <div className="lesson-card-preview">
                  <div className="lesson-badge">{currentPath.level}</div>
                  <div className="lesson-screen">
                    <div className="screen-orb" />
                    <div className="screen-line one" />
                    <div className="screen-line two" />
                    <div className="screen-line three" />
                  </div>
                  <div className="lesson-lower-third">
                    <strong>{currentPath.modules[selectedModule]}</strong>
                    <span>{currentPath.title}</span>
                  </div>
                </div>
              </div>

              <div className="lesson-copy">
                <div className="eyebrow">Current lesson</div>
                <h3>{currentPath.modules[selectedModule]}</h3>
                <p>{currentPath.summary}</p>
                <div className="outcome-list">
                  {currentPath.outcomes.map((outcome) => (
                    <span key={outcome}>✓ {outcome}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="module-list">
              {currentPath.modules.map((module, index) => (
                <button key={module} className={selectedModule === index ? "active" : ""} onClick={() => setSelectedModule(index)}>
                  <span aria-hidden="true">{selectedModule === index ? <CheckRoundedIcon fontSize="small" /> : <MenuBookRoundedIcon fontSize="small" />}</span>
                  <div>
                    <strong>{module}</strong>
                    <small>{index === selectedModule ? "Selected lesson" : "Tutorial module"}</small>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        <aside className="panel docs-panel">
          <div className="right-tabs">
            {(["Search", "API Docs", "Shortcuts", "Related"] as RightTab[]).map((tab) => (
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
            {(["Best Practices", "Technical Guidelines", "Troubleshooting", "Example Guides"] as BottomTab[]).map((tab) => (
              <button key={tab} className={bottomTab === tab ? "active" : ""} onClick={() => setBottomTab(tab)}>
                {tab}
              </button>
            ))}
          </div>
          <div className="bottom-actions">
            <button className="ghost-btn small" data-evz-autowire="1">Open Full Docs</button>
            <button className="ghost-btn small" data-evz-autowire="1">Download Shortcut Sheet</button>
            <button className="primary-btn small" data-evz-autowire="1">Open Related Template</button>
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
.evz-learning-page {
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
.learning-hero {
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
.learning-hero,
.hero-card,
.tutorial-top,
.tutorial-actions,
.right-tabs,
.bottom-head,
.bottom-tabs,
.bottom-actions,
.shortcut-row,
.api-card,
.related-card,
.example-card,
.trouble-card {
  display: flex;
  align-items: center;
}
.brand-area { gap: 16px; max-width: 1010px; }
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
.tutorial-top p,
.lesson-copy p,
.tip-card span,
.guideline-card span,
.feedback-card span {
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
.warning-dot {
  width: 9px;
  height: 9px;
  border-radius: 999px;
  background: var(--evz-green);
  box-shadow: 0 0 0 6px rgba(3,205,140,0.13);
}
.ghost-btn,
.primary-btn,
.path-list button,
.module-list button,
.right-tabs button,
.bottom-tabs button,
.api-card,
.related-card,
.search-results button,
.doc-search,
.practice-card,
.guideline-card,
.trouble-card,
.example-card {
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
.path-list button:hover,
.module-list button:hover,
.right-tabs button:hover,
.bottom-tabs button:hover,
.api-card:hover,
.related-card:hover,
.search-results button:hover,
.practice-card:hover,
.guideline-card:hover,
.trouble-card:hover,
.example-card:hover {
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
.learning-hero {
  max-width: 100%;
  margin: 0 0 18px;
  border-radius: var(--radius-xl);
  padding: 18px;
  display: grid;
  grid-template-columns: 1.5fr repeat(4, minmax(135px, .3fr));
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
.learning-orb {
  width: 104px;
  height: 104px;
  flex: 0 0 104px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  border: 10px solid rgba(3,205,140,0.16);
  background: var(--evz-card-solid);
}
.learning-orb span {
  color: var(--evz-green);
  font-size: 30px;
  font-weight: 900;
  line-height: 1;
}
.learning-orb small {
  margin-top: -20px;
  color: var(--evz-muted);
}
.learning-shell {
  max-width: 100%;
  margin: 0;
  display: grid;
  grid-template-columns: 330px minmax(720px, 1fr) 380px;
  gap: 18px;
}
.panel {
  border-radius: var(--radius-xl);
  overflow: hidden;
}
.path-panel,
.tutorial-panel,
.docs-panel {
  min-height: 900px;
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
.path-list {
  padding: 16px 18px;
  display: grid;
  gap: 10px;
}
.path-list button {
  width: 100%;
  display: grid;
  grid-template-columns: 42px 1fr;
  gap: 12px;
  text-align: left;
  align-items: center;
}
.path-list button.active {
  border-color: rgba(3,205,140,0.34);
  background: rgba(3,205,140,0.07);
}
.path-icon {
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
.path-list button div {
  display: grid;
  gap: 4px;
}
small {
  color: var(--evz-muted);
  font-size: 12px;
  line-height: 1.45;
}
.mini-progress {
  height: 7px;
  border-radius: 999px;
  background: rgba(148,163,184,0.15);
  overflow: hidden;
  margin-top: 3px;
}
.mini-progress b {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--evz-green), var(--evz-orange));
}
.tutorial-panel {
  display: grid;
  grid-template-rows: auto 1fr;
}
.tutorial-top {
  justify-content: space-between;
  gap: 18px;
  padding: 18px;
  border-bottom: 1px solid var(--evz-soft-line);
  background: var(--evz-card);
}
.tutorial-top h2 {
  margin: 4px 0 6px;
  letter-spacing: -0.035em;
}
.tutorial-actions {
  gap: 8px;
  flex-wrap: wrap;
  justify-content: flex-end;
}
.tutorial-body {
  padding: 18px;
  display: grid;
  grid-template-rows: 1fr auto;
  gap: 18px;
}
.lesson-view {
  display: grid;
  grid-template-columns: 1.05fr .95fr;
  gap: 18px;
}
.lesson-visual {
  position: relative;
  min-height: 460px;
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
.lesson-card-preview {
  position: absolute;
  inset: 54px 54px;
  border-radius: 28px;
  overflow: hidden;
  border: 1px solid var(--evz-border);
  background: var(--evz-card);
  box-shadow: inset 0 0 60px var(--evz-frost-soft), 0 30px 70px rgba(15,23,42,0.12);
}
.lesson-badge {
  position: absolute;
  left: 20px;
  top: 20px;
  z-index: 5;
  border-radius: 999px;
  padding: 8px 11px;
  color: var(--evz-green);
  background: var(--evz-card);
  font-weight: 900;
  font-size: 12px;
}
.lesson-screen {
  position: absolute;
  left: 50%;
  top: 42%;
  width: 260px;
  height: 180px;
  transform: translate(-50%, -50%);
  border-radius: 24px;
  background:
    radial-gradient(circle at 30% 30%, rgba(3,205,140,0.20), transparent 32%),
    var(--evz-card);
  border: 1px solid var(--evz-soft-line);
  box-shadow: 0 22px 44px rgba(15,23,42,0.10);
}
.screen-orb {
  position: absolute;
  left: 28px;
  top: 28px;
  width: 58px;
  height: 58px;
  border-radius: 18px;
  background: var(--evz-green);
}
.screen-line {
  position: absolute;
  left: 110px;
  right: 28px;
  height: 10px;
  border-radius: 999px;
  background: rgba(148,163,184,0.18);
}
.screen-line.one { top: 42px; }
.screen-line.two { top: 72px; width: 110px; }
.screen-line.three { top: 114px; left: 28px; }
.lesson-lower-third {
  position: absolute;
  left: 10%;
  right: 10%;
  bottom: 28px;
  border-radius: 18px;
  padding: 14px 16px;
  background: var(--evz-card);
  box-shadow: 0 18px 36px rgba(15,23,42,0.10);
  display: grid;
  gap: 4px;
}
.lesson-lower-third strong { color: var(--evz-green); }
.lesson-lower-third span { color: var(--evz-muted); font-size: 12px; }
.lesson-copy {
  border: 1px solid var(--evz-soft-line);
  border-radius: 24px;
  background: var(--evz-card-solid);
  padding: 18px;
  display: grid;
  align-content: center;
  gap: 12px;
}
.lesson-copy h3 {
  font-size: clamp(28px, 4vw, 42px);
  line-height: 1.05;
  letter-spacing: -0.045em;
  margin: 0;
}
.outcome-list {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.outcome-list span {
  border-radius: 999px;
  padding: 8px 10px;
  color: var(--evz-green);
  background: rgba(3,205,140,0.09);
  font-size: 12px;
  font-weight: 900;
}
.module-list {
  display: grid;
  grid-template-columns: repeat(5, minmax(0,1fr));
  gap: 10px;
}
.module-list button {
  display: grid;
  grid-template-columns: 34px 1fr;
  gap: 8px;
  text-align: left;
  align-items: start;
}
.module-list button.active {
  border-color: rgba(3,205,140,0.34);
  background: rgba(3,205,140,0.07);
}
.module-list button > span {
  width: 30px;
  height: 30px;
  border-radius: 11px;
  display: grid;
  place-items: center;
  color: white;
  background: var(--evz-green);
  font-weight: 900;
}
.module-list button > span svg {
  font-size: 20px;
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
.right-tabs button.active,
.bottom-tabs button.active {
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
.doc-search {
  display: flex;
  align-items: center;
  gap: 9px;
  cursor: text;
}
.doc-search span {
  color: var(--evz-green);
  font-weight: 900;
}
.doc-search input {
  flex: 1;
  border: 0;
  outline: 0;
  background: transparent;
  font: inherit;
  color: var(--evz-ink);
}
.search-results,
.shortcut-list,
.related-list {
  display: grid;
  gap: 10px;
}
.search-results button {
  text-align: left;
  display: grid;
  gap: 5px;
}
.tip-card {
  border: 1px solid rgba(247,127,0,0.20);
  border-radius: 18px;
  padding: 14px;
  background: var(--evz-warning-surface);
  display: grid;
  gap: 6px;
}
.tip-card strong {
  color: var(--evz-orange);
}
.api-card {
  display: grid;
  grid-template-columns: 42px 1fr;
  gap: 10px;
  text-align: left;
}
.api-card > span,
.project-dot,
.warning-dot {
  width: 38px;
  height: 38px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  color: var(--evz-orange);
  background: rgba(247,127,0,0.10);
  font-size: 12px;
  font-weight: 900;
}
.api-card div {
  display: grid;
  gap: 4px;
}
.shortcut-row {
  justify-content: space-between;
  gap: 12px;
  border: 1px solid var(--evz-soft-line);
  border-radius: 14px;
  background: var(--evz-card-solid);
  padding: 12px;
}
.shortcut-row kbd {
  border-radius: 12px;
  padding: 8px 10px;
  background: rgba(148,163,184,0.12);
  color: var(--evz-ink);
  font-weight: 900;
}
.shortcut-row span {
  color: var(--evz-muted);
  font-size: 13px;
}
.related-card {
  text-align: left;
  display: grid;
  gap: 8px;
}
.related-card.compact {
  grid-template-columns: 34px 1fr;
  align-items: center;
}
.related-art,
.example-art {
  height: 70px;
  border-radius: 16px;
  background:
    radial-gradient(circle at 26% 28%, rgba(3,205,140,0.40), transparent 28%),
    radial-gradient(circle at 70% 32%, rgba(247,127,0,0.30), transparent 30%),
    var(--evz-card);
}
.project-dot {
  width: 30px;
  height: 30px;
  border-radius: 11px;
  background: var(--evz-green);
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
.practice-grid,
.guideline-grid,
.troubleshooting-grid,
.example-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0,1fr));
  gap: 12px;
}
.practice-card {
  min-height: 132px;
  display: grid;
  gap: 10px;
  align-content: start;
}
.practice-card span {
  width: 34px;
  height: 34px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  color: white;
  background: var(--evz-green);
  font-weight: 900;
}
.practice-card span svg {
  font-size: 22px;
}
.guideline-card {
  display: grid;
  gap: 8px;
}
.guideline-card strong {
  color: var(--evz-green);
}
.trouble-card {
  display: grid;
  grid-template-columns: 12px 1fr;
  gap: 12px;
  align-items: start;
}
.trouble-card .warning-dot {
  width: 10px;
  height: 10px;
  margin-top: 4px;
  border-radius: 999px;
  background: var(--evz-orange);
  box-shadow: 0 0 0 6px rgba(247,127,0,0.13);
}
.trouble-card div {
  display: grid;
  gap: 5px;
}
.example-card {
  display: grid;
  grid-template-columns: 72px 1fr auto;
  gap: 12px;
}
.example-art {
  height: 72px;
}
.example-card div {
  display: grid;
  gap: 4px;
}
.example-card em {
  color: var(--evz-orange);
  font-style: normal;
  font-size: 11px;
  font-weight: 900;
}
@media (max-width: 1500px) {
  .learning-hero,
  .learning-shell {
    grid-template-columns: 310px 1fr;
  }
  .hero-card.main {
    grid-column: span 2;
  }
  .docs-panel {
    grid-column: span 2;
    min-height: auto;
  }
  .practice-grid,
  .guideline-grid,
  .troubleshooting-grid,
  .example-grid {
    grid-template-columns: repeat(3, minmax(0,1fr));
  }
}
@media (max-width: 1050px) {
  .topbar {
    flex-direction: column;
    align-items: flex-start;
  }
  .learning-hero,
  .learning-shell {
    grid-template-columns: 1fr;
  }
  .hero-card.main,
  .docs-panel {
    grid-column: auto;
  }
  .lesson-view {
    grid-template-columns: 1fr;
  }
  .module-list {
    grid-template-columns: 1fr 1fr;
  }
  .practice-grid,
  .guideline-grid,
  .troubleshooting-grid,
  .example-grid {
    grid-template-columns: 1fr 1fr;
  }
}
@media (max-width: 700px) {
  .evz-learning-page {
    padding: 14px;
  }
  .top-actions > *,
  .tutorial-actions > * {
    width: 100%;
    justify-content: center;
  }
  .hero-card,
  .tutorial-top,
  .bottom-head {
    flex-direction: column;
    align-items: flex-start;
  }
  .module-list,
  .practice-grid,
  .guideline-grid,
  .troubleshooting-grid,
  .example-grid {
    grid-template-columns: 1fr;
  }
  .lesson-card-preview {
    inset: 34px 18px;
  }
  .example-card {
    grid-template-columns: 1fr;
  }
}
`;
