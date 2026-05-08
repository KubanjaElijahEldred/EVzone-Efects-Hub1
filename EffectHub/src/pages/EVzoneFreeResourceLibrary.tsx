import React, { useMemo, useState } from "react";
import { toast } from "sonner";

type Category =
  | "All"
  | "Templates"
  | "Effect Presets"
  | "3D Models"
  | "Textures"
  | "Materials"
  | "Shaders"
  | "VFX"
  | "Sounds"
  | "Stickers"
  | "UI Kits"
  | "Avatars"
  | "Studio Overlays"
  | "Virtual Sets"
  | "LUTs"
  | "Gesture Presets"
  | "Subgraphs"
  | "Script Snippets"
  | "AI Prompts"
  | "Studio Controls"
  | "Example Projects";

type Difficulty = "Beginner" | "Intermediate" | "Advanced" | "Studio Pro";
type Compatibility = "EVzone Studio" | "Host Camera" | "Guest Camera" | "Overlay Layer" | "Mobile Preview" | "Web Preview";

type Resource = {
  id: string;
  name: string;
  category: Exclude<Category, "All">;
  type: string;
  difficulty: Difficulty;
  compatibility: Compatibility[];
  tags: string[];
  size: string;
  format: string;
  featured?: boolean;
  recommended?: boolean;
  description: string;
  includes: string[];
  validation: { label: string; status: "Pass" | "Warning" | "Ready" }[];
};

const categories: Category[] = [
  "All",
  "Templates",
  "Effect Presets",
  "3D Models",
  "Textures",
  "Materials",
  "Shaders",
  "VFX",
  "Sounds",
  "Stickers",
  "UI Kits",
  "Avatars",
  "Studio Overlays",
  "Virtual Sets",
  "LUTs",
  "Gesture Presets",
  "Subgraphs",
  "Script Snippets",
  "AI Prompts",
  "Studio Controls",
  "Example Projects",
];

const resources: Resource[] = [
  {
    id: "template-host-intro",
    name: "Premium Host Intro Template",
    category: "Templates",
    type: "Complete Project",
    difficulty: "Beginner",
    compatibility: ["EVzone Studio", "Host Camera", "Overlay Layer"],
    tags: ["intro", "lower-third", "confetti", "studio"],
    size: "3.8 MB",
    format: "EVZ Project",
    featured: true,
    recommended: true,
    description:
      "A complete live-show intro package with host camera framing, lower-third reveal, sparkle VFX, and studio button trigger mapping.",
    includes: ["Scene setup", "Lower third", "Sparkle VFX", "Studio trigger", "Fallback mode"],
    validation: [
      { label: "Studio compatibility", status: "Pass" },
      { label: "Texture budget", status: "Pass" },
      { label: "Fallback rules", status: "Ready" },
    ],
  },
  {
    id: "effect-beauty-clean",
    name: "Clean Broadcast Beauty Preset",
    category: "Effect Presets",
    type: "Beauty Filter",
    difficulty: "Beginner",
    compatibility: ["EVzone Studio", "Host Camera", "Guest Camera", "Mobile Preview"],
    tags: ["beauty", "skin", "face-safe", "filter"],
    size: "860 KB",
    format: "EVZ Preset",
    featured: true,
    description:
      "Natural, face-safe beauty look for live camera output with soft skin, balanced tone, and conservative makeup blending.",
    includes: ["Skin smoothing", "Tone balance", "Eye brighten", "Face-safe limits"],
    validation: [
      { label: "Face-safe limits", status: "Pass" },
      { label: "GPU cost", status: "Pass" },
      { label: "Studio output", status: "Ready" },
    ],
  },
  {
    id: "model-stage-props",
    name: "Studio Stage Prop Pack",
    category: "3D Models",
    type: "GLB Pack",
    difficulty: "Intermediate",
    compatibility: ["EVzone Studio", "Host Camera", "Web Preview"],
    tags: ["3D", "stage", "props", "glb"],
    size: "9.4 MB",
    format: "GLB",
    featured: true,
    description:
      "Optimized 3D props for live virtual sets, including signs, podiums, floating logo frames, and stage accents.",
    includes: ["6 GLB props", "PBR materials", "LOD variants", "Studio-ready scale"],
    validation: [
      { label: "Mesh count", status: "Pass" },
      { label: "Texture compression", status: "Warning" },
      { label: "Studio scale", status: "Pass" },
    ],
  },
  {
    id: "texture-premium-noise",
    name: "Premium Noise Texture Set",
    category: "Textures",
    type: "Texture Pack",
    difficulty: "Beginner",
    compatibility: ["EVzone Studio", "Overlay Layer", "Web Preview"],
    tags: ["texture", "noise", "gradient", "mask"],
    size: "2.1 MB",
    format: "PNG / KTX2",
    description:
      "A polished set of noise maps, gradients, masks, and alpha textures for VFX, overlays, transitions, and hologram materials.",
    includes: ["Noise maps", "Alpha masks", "Gradient ramps", "KTX2 versions"],
    validation: [
      { label: "Texture size", status: "Pass" },
      { label: "Compression", status: "Ready" },
      { label: "Alpha safety", status: "Pass" },
    ],
  },
  {
    id: "material-hologram",
    name: "Emerald Hologram Material",
    category: "Materials",
    type: "PBR Material",
    difficulty: "Intermediate",
    compatibility: ["EVzone Studio", "Host Camera", "Overlay Layer"],
    tags: ["hologram", "green", "glow", "material"],
    size: "1.3 MB",
    format: "EVZ Material",
    featured: true,
    description:
      "A premium EVzone green hologram material with soft scanlines, subtle orange rim glow, and live-safe transparency settings.",
    includes: ["PBR channels", "Emission map", "Shader graph", "Fallback material"],
    validation: [
      { label: "Transparency cost", status: "Warning" },
      { label: "Studio fallback", status: "Ready" },
      { label: "GPU cost", status: "Pass" },
    ],
  },
  {
    id: "shader-glass",
    name: "Studio Glass Shader",
    category: "Shaders",
    type: "Shader Graph",
    difficulty: "Advanced",
    compatibility: ["EVzone Studio", "Web Preview"],
    tags: ["shader", "glass", "refraction", "node"],
    size: "640 KB",
    format: "EVZ Shader",
    description:
      "Node-based glass shader for virtual sets, overlays, and 3D objects with refraction fallback for live production.",
    includes: ["Shader nodes", "Refraction controls", "Opacity controls", "Live fallback"],
    validation: [
      { label: "Node graph", status: "Pass" },
      { label: "Refraction fallback", status: "Ready" },
      { label: "Runtime budget", status: "Warning" },
    ],
  },
  {
    id: "vfx-confetti",
    name: "EVzone Confetti Burst",
    category: "VFX",
    type: "Particle Preset",
    difficulty: "Beginner",
    compatibility: ["EVzone Studio", "Host Camera", "Overlay Layer"],
    tags: ["confetti", "celebration", "particles", "reward"],
    size: "520 KB",
    format: "EVZ VFX",
    recommended: true,
    description:
      "Live-safe confetti burst designed for reward triggers, game success states, and audience celebration moments.",
    includes: ["Emitter", "Particle textures", "Burst settings", "Studio trigger mapping"],
    validation: [
      { label: "Particle density", status: "Pass" },
      { label: "Live-safe score", status: "Pass" },
      { label: "Fallback rule", status: "Ready" },
    ],
  },
  {
    id: "sound-stingers",
    name: "Broadcast Stinger SFX Pack",
    category: "Sounds",
    type: "Audio Pack",
    difficulty: "Beginner",
    compatibility: ["EVzone Studio", "Overlay Layer"],
    tags: ["sound", "alert", "transition", "stinger"],
    size: "4.7 MB",
    format: "WAV",
    description:
      "Clean sound effects for alerts, reveals, countdowns, quiz answers, transitions, and celebration triggers.",
    includes: ["18 WAV sounds", "Volume-safe mix", "Loop markers", "Usage notes"],
    validation: [
      { label: "Peak volume", status: "Pass" },
      { label: "Loop safety", status: "Ready" },
      { label: "Studio playback", status: "Pass" },
    ],
  },
  {
    id: "stickers-live",
    name: "Live Reaction Sticker Set",
    category: "Stickers",
    type: "Sticker Pack",
    difficulty: "Beginner",
    compatibility: ["EVzone Studio", "Overlay Layer", "Mobile Preview"],
    tags: ["stickers", "reaction", "emoji", "animated"],
    size: "2.8 MB",
    format: "PNG / Lottie",
    description:
      "Animated and static live reaction stickers for polls, games, applause, rewards, and audience moments.",
    includes: ["24 stickers", "8 Lottie animations", "Transparent assets", "Reaction tags"],
    validation: [
      { label: "Transparency", status: "Pass" },
      { label: "Animation size", status: "Pass" },
      { label: "Overlay ready", status: "Ready" },
    ],
  },
  {
    id: "ui-kit-studio",
    name: "Studio UI Kit",
    category: "UI Kits",
    type: "UI Components",
    difficulty: "Intermediate",
    compatibility: ["EVzone Studio", "Overlay Layer", "Web Preview"],
    tags: ["ui", "buttons", "cards", "scoreboard", "countdown"],
    size: "1.9 MB",
    format: "EVZ UI",
    featured: true,
    description:
      "Reusable UI kit containing buttons, scoreboards, timer cards, poll cards, alert banners, and caption components.",
    includes: ["Buttons", "Cards", "Countdowns", "Scoreboards", "Poll widgets"],
    validation: [
      { label: "Safe areas", status: "Pass" },
      { label: "Readability", status: "Pass" },
      { label: "Responsive output", status: "Ready" },
    ],
  },
  {
    id: "avatar-presenter",
    name: "Presenter Avatar Starter",
    category: "Avatars",
    type: "Avatar Pack",
    difficulty: "Advanced",
    compatibility: ["EVzone Studio", "Host Camera", "Web Preview"],
    tags: ["avatar", "face-drive", "character", "presenter"],
    size: "11.2 MB",
    format: "GLB / EVZ Rig",
    description:
      "Starter avatar with face-drive, expression mapping, body pose controls, and studio-safe idle animations.",
    includes: ["Avatar GLB", "Face rig", "Expression map", "Idle animations"],
    validation: [
      { label: "Rig validation", status: "Pass" },
      { label: "Mesh budget", status: "Warning" },
      { label: "Tracking ready", status: "Ready" },
    ],
  },
  {
    id: "overlay-lowerthirds",
    name: "Premium Lower Third Collection",
    category: "Studio Overlays",
    type: "Overlay Pack",
    difficulty: "Beginner",
    compatibility: ["EVzone Studio", "Overlay Layer", "Host Camera"],
    tags: ["lower-third", "title", "alert", "caption"],
    size: "2.6 MB",
    format: "EVZ Overlay",
    featured: true,
    recommended: true,
    description:
      "Premium lower thirds, title cards, guest labels, callouts, breaking alerts, and caption bars for EVzone Live Studio.",
    includes: ["Host lower-third", "Guest lower-third", "Alert banner", "Caption bar", "Motion presets"],
    validation: [
      { label: "Overlay safe areas", status: "Pass" },
      { label: "Text readability", status: "Pass" },
      { label: "Studio binding", status: "Ready" },
    ],
  },
  {
    id: "set-future-newsroom",
    name: "Future Newsroom Virtual Set",
    category: "Virtual Sets",
    type: "Virtual Set",
    difficulty: "Studio Pro",
    compatibility: ["EVzone Studio", "Host Camera", "Guest Camera"],
    tags: ["virtual set", "newsroom", "stage", "background"],
    size: "16.8 MB",
    format: "EVZ Set / PNG / GLB",
    featured: true,
    description:
      "A modern EVzone-style virtual newsroom set with desk, background plates, screens, soft lights, and camera-safe layouts.",
    includes: ["Background plates", "3D desk", "Light presets", "Camera frames", "Overlay safe zones"],
    validation: [
      { label: "Set memory", status: "Warning" },
      { label: "Camera framing", status: "Pass" },
      { label: "Studio import", status: "Ready" },
    ],
  },
  {
    id: "lut-broadcast-clean",
    name: "Broadcast Clean LUT Pack",
    category: "LUTs",
    type: "Color Filter Pack",
    difficulty: "Beginner",
    compatibility: ["EVzone Studio", "Host Camera", "Guest Camera", "Mobile Preview"],
    tags: ["lut", "color", "filter", "broadcast"],
    size: "740 KB",
    format: "CUBE / EVZ LUT",
    description:
      "Clean live-broadcast LUTs for skin-safe warmth, cinematic contrast, soft neutral tone, and EVzone green/orange accents.",
    includes: ["8 LUTs", "Skin-safe variants", "Intensity controls", "Before/after previews"],
    validation: [
      { label: "Skin tone safety", status: "Pass" },
      { label: "Preview output", status: "Pass" },
      { label: "Studio color space", status: "Ready" },
    ],
  },
  {
    id: "gesture-pack",
    name: "Gesture Trigger Pack",
    category: "Gesture Presets",
    type: "Gesture Pack",
    difficulty: "Intermediate",
    compatibility: ["EVzone Studio", "Host Camera", "Mobile Preview"],
    tags: ["gesture", "wave", "pinch", "thumbs-up"],
    size: "620 KB",
    format: "EVZ Gesture",
    description:
      "Hand and face trigger presets for wave, pinch, peace sign, thumbs-up, smile, blink, and mouth-open actions.",
    includes: ["Hand gestures", "Face triggers", "Studio actions", "Fallback buttons"],
    validation: [
      { label: "Tracking compatibility", status: "Pass" },
      { label: "Fallback controls", status: "Ready" },
      { label: "Mobile preview", status: "Pass" },
    ],
  },
  {
    id: "subgraph-countdown",
    name: "Countdown Reveal Subgraph",
    category: "Subgraphs",
    type: "Visual Script",
    difficulty: "Intermediate",
    compatibility: ["EVzone Studio", "Overlay Layer"],
    tags: ["node graph", "countdown", "visual scripting"],
    size: "280 KB",
    format: "EVZ Graph",
    description:
      "Reusable no-code subgraph for countdowns, reveal animations, studio triggers, and success/fail logic.",
    includes: ["Timer nodes", "State machine", "Reveal actions", "Studio event output"],
    validation: [
      { label: "Graph validation", status: "Pass" },
      { label: "Variable safety", status: "Pass" },
      { label: "Studio nodes", status: "Ready" },
    ],
  },
  {
    id: "snippet-bridge",
    name: "Studio Bridge Script Snippets",
    category: "Script Snippets",
    type: "Code Snippets",
    difficulty: "Advanced",
    compatibility: ["EVzone Studio", "Web Preview"],
    tags: ["script", "typescript", "bridge", "api"],
    size: "120 KB",
    format: "TS",
    description:
      "Reusable TypeScript snippets for Studio Bridge events, hotkey binding, scene changes, VFX triggers, and runtime fallbacks.",
    includes: ["Bridge events", "Hotkeys", "Fallback handlers", "Type definitions"],
    validation: [
      { label: "TypeScript strict", status: "Pass" },
      { label: "API compatibility", status: "Ready" },
      { label: "Runtime warnings", status: "Pass" },
    ],
  },
  {
    id: "prompt-pack",
    name: "AI Prompt Preset Pack",
    category: "AI Prompts",
    type: "Prompt Pack",
    difficulty: "Beginner",
    compatibility: ["EVzone Studio", "Host Camera", "Overlay Layer"],
    tags: ["ai", "prompt", "effect", "overlay"],
    size: "64 KB",
    format: "EVZ Prompt Pack",
    description:
      "Ready prompts for AI effects, backgrounds, VFX, overlays, lower thirds, studio sets, optimization, and safety checks.",
    includes: ["Prompt starters", "Style modifiers", "Safety prompts", "Optimization prompts"],
    validation: [
      { label: "Prompt safety", status: "Pass" },
      { label: "EVzone palette", status: "Ready" },
      { label: "Studio outputs", status: "Pass" },
    ],
  },
  {
    id: "control-surface",
    name: "Studio Control Surface Presets",
    category: "Studio Controls",
    type: "Control Presets",
    difficulty: "Intermediate",
    compatibility: ["EVzone Studio", "Overlay Layer"],
    tags: ["studio controls", "buttons", "sliders", "hotkeys"],
    size: "460 KB",
    format: "EVZ Controls",
    description:
      "Ready-made buttons, toggles, sliders, hotkeys, and emergency-disable mappings for live operators.",
    includes: ["Buttons", "Toggles", "Sliders", "Hotkeys", "Emergency stop"],
    validation: [
      { label: "Studio binding", status: "Pass" },
      { label: "Operator safety", status: "Pass" },
      { label: "Emergency disable", status: "Ready" },
    ],
  },
  {
    id: "example-quiz-show",
    name: "Quiz Show Example Project",
    category: "Example Projects",
    type: "Example Project",
    difficulty: "Intermediate",
    compatibility: ["EVzone Studio", "Host Camera", "Overlay Layer"],
    tags: ["example", "quiz", "game", "learning"],
    size: "4.2 MB",
    format: "EVZ Project",
    featured: true,
    description:
      "Openable example project showing quiz questions, answer buttons, scoring, timer, reward triggers, and studio control binding.",
    includes: ["Quiz builder", "Scoreboard", "Timer", "Reward VFX", "Tutorial notes"],
    validation: [
      { label: "Project opens", status: "Pass" },
      { label: "Tutorial notes", status: "Ready" },
      { label: "Studio triggers", status: "Pass" },
    ],
  },
];

const featuredPacks = [
  {
    name: "Live Show Starter Pack",
    detail: "Templates, overlays, LUTs, VFX, sound stingers, and studio controls.",
    items: "42 resources",
  },
  {
    name: "Premium AR Host Pack",
    detail: "Beauty preset, face AR, gestures, materials, and intro effect project.",
    items: "28 resources",
  },
  {
    name: "Interactive Game Pack",
    detail: "Quiz, prize wheel, leaderboard, confetti, and visual scripting subgraphs.",
    items: "35 resources",
  },
];

const compatibilityOptions: Compatibility[] = ["EVzone Studio", "Host Camera", "Guest Camera", "Overlay Layer", "Mobile Preview", "Web Preview"];
const difficultyOptions: Difficulty[] = ["Beginner", "Intermediate", "Advanced", "Studio Pro"];

export default function EVzoneFreeResourceLibrary() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState<"All" | Difficulty>("All");
  const [compatibility, setCompatibility] = useState<"All" | Compatibility>("All");
  const [selectedResource, setSelectedResource] = useState<Resource>(resources[0]);
  const [showImportPanel, setShowImportPanel] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "compact">("grid");

  const filteredResources = useMemo(() => {
    const query = search.toLowerCase().trim();
    return resources.filter((resource) => {
      const categoryMatch = activeCategory === "All" || resource.category === activeCategory;
      const difficultyMatch = difficulty === "All" || resource.difficulty === difficulty;
      const compatibilityMatch = compatibility === "All" || resource.compatibility.includes(compatibility);
      const searchMatch =
        !query ||
        [resource.name, resource.type, resource.description, resource.category, resource.format, ...resource.tags]
          .join(" ")
          .toLowerCase()
          .includes(query);
      return categoryMatch && difficultyMatch && compatibilityMatch && searchMatch;
    });
  }, [activeCategory, search, difficulty, compatibility]);

  const stats = useMemo(
    () => [
      { label: "Free resources", value: "1,280+", tone: "green" },
      { label: "Featured packs", value: "36", tone: "orange" },
      { label: "Studio-ready", value: "98%", tone: "green" },
      { label: "Paid items", value: "0", tone: "orange" },
    ],
    []
  );

  const categoryCounts = useMemo(() => {
    return categories.reduce<Record<string, number>>((acc, category) => {
      acc[category] = category === "All" ? resources.length : resources.filter((resource) => resource.category === category).length;
      return acc;
    }, {});
  }, []);

  const importResource = (resource: Resource) => {
    setSelectedResource(resource);
    localStorage.setItem("evzone-last-imported-resource", JSON.stringify({
      id: resource.id,
      name: resource.name,
      format: resource.format,
      importedAt: new Date().toISOString(),
    }));
    toast.success(`${resource.name} imported to your EVzone project.`);
  };

  const remixResource = (resource: Resource) => {
    setSelectedResource(resource);
    setShowImportPanel(true);
    toast.message(`${resource.name} is ready to remix.`);
  };

  return (
    <div className="evz-library-page">
      <style>{styles}</style>

      <header className="topbar">
        <div className="brand-area">
          <div className="brand-mark">EV</div>
          <div>
            <div className="eyebrow">EVzone Effect Creator</div>
            <h1>Free Resource Library</h1>
            <p>One premium free library for templates, presets, assets, AI prompts, scripts, examples, and studio-ready resources. No paid marketplace.</p>
          </div>
        </div>
        <div className="top-actions">
          <span className="studio-chip"><i />Connected to EVzone Studio</span>
          <button className="ghost-btn" onClick={() => setShowImportPanel(true)}>Local Asset Import</button>
          <button className="ghost-btn" data-evz-autowire="1">Validate Assets</button>
          <button className="primary-btn" data-evz-autowire="1">Import Selected</button>
        </div>
      </header>

      <section className="library-hero">
        <div className="hero-copy">
          <div className="eyebrow">Free, curated, studio-native</div>
          <h2>Everything creators need to build premium EVzone effects faster.</h2>
          <p>
            Browse templates, effect presets, 3D assets, VFX, LUTs, gestures, subgraphs, scripts, AI prompts,
            studio controls, and openable example projects.
          </p>
        </div>
        <div className="hero-stats">
          {stats.map((stat) => (
            <div className="stat-card" key={stat.label}>
              <span>{stat.label}</span>
              <strong className={stat.tone}>{stat.value}</strong>
            </div>
          ))}
        </div>
      </section>

      <main className="library-shell">
        <aside className="panel category-panel">
          <div className="panel-head">
            <div>
              <div className="eyebrow">Browse</div>
              <h2>Categories</h2>
            </div>
            <span className="free-pill">Free only</span>
          </div>
          <div className="category-list">
            {categories.map((category) => (
              <button
                key={category}
                className={activeCategory === category ? "active" : ""}
                onClick={() => setActiveCategory(category)}
              >
                <span>{category}</span>
                <em>{categoryCounts[category]}</em>
              </button>
            ))}
          </div>

          <div className="license-card">
            <div className="eyebrow">License / usage notes</div>
            <strong>Free for EVzone Studio projects</strong>
            <p>
              Resources are free to use inside EVzone productions. Keep attribution notes where provided, avoid resale,
              and run validation before live studio use.
            </p>
          </div>
        </aside>

        <section className="main-panel">
          <div className="panel search-panel">
            <div className="search-row">
              <div className="search-box">
                <span>⌕</span>
                <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search templates, presets, VFX, scripts, AI prompts..." />
              </div>
              <select value={difficulty} onChange={(event) => setDifficulty(event.target.value as "All" | Difficulty)}>
                <option>All</option>
                {difficultyOptions.map((item) => <option key={item}>{item}</option>)}
              </select>
              <select value={compatibility} onChange={(event) => setCompatibility(event.target.value as "All" | Compatibility)}>
                <option>All</option>
                {compatibilityOptions.map((item) => <option key={item}>{item}</option>)}
              </select>
              <div className="view-toggle">
                <button className={viewMode === "grid" ? "active" : ""} onClick={() => setViewMode("grid")}>Grid</button>
                <button className={viewMode === "compact" ? "active" : ""} onClick={() => setViewMode("compact")}>Compact</button>
              </div>
            </div>
          </div>

          <div className="featured-packs">
            {featuredPacks.map((pack) => (
              <div className="pack-card" key={pack.name}>
                <div className="pack-art" />
                <div>
                  <span>Featured pack</span>
                  <strong>{pack.name}</strong>
                  <small>{pack.detail}</small>
                </div>
                <em>{pack.items}</em>
              </div>
            ))}
          </div>

          <div className={`resource-grid ${viewMode}`}>
            {filteredResources.map((resource) => (
              <article
                key={resource.id}
                className={`resource-card ${selectedResource.id === resource.id ? "selected" : ""}`}
                onClick={() => setSelectedResource(resource)}
              >
                <div className="resource-art">
                  <span>{resource.category.split(" ")[0]}</span>
                  {resource.featured ? <b>Featured</b> : null}
                </div>
                <div className="resource-body">
                  <div className="resource-head">
                    <div>
                      <strong>{resource.name}</strong>
                      <small>{resource.type} • {resource.format} • {resource.size}</small>
                    </div>
                    <em>{resource.difficulty}</em>
                  </div>
                  <p>{resource.description}</p>
                  <div className="tag-row">
                    {resource.tags.slice(0, 4).map((tag) => <span key={tag}>#{tag}</span>)}
                  </div>
                  <div className="compat-row">
                    {resource.compatibility.slice(0, 3).map((item) => <span key={item}>{item}</span>)}
                  </div>
                  <div className="card-actions">
                    <button onClick={(event) => { event.stopPropagation(); setSelectedResource(resource); }}>Preview</button>
                    <button onClick={(event) => { event.stopPropagation(); importResource(resource); }}>Import</button>
                    <button onClick={(event) => { event.stopPropagation(); remixResource(resource); }}>Remix</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <aside className="panel detail-panel">
          <div className="detail-preview">
            <div className="detail-art">
              <span>{selectedResource.category}</span>
            </div>
            <div className="detail-badges">
              <span>{selectedResource.difficulty}</span>
              <span>Free</span>
              <span>{selectedResource.format}</span>
            </div>
          </div>

          <div className="detail-content">
            <div className="eyebrow">Preview drawer / detail drawer</div>
            <h2>{selectedResource.name}</h2>
            <p>{selectedResource.description}</p>

            <div className="detail-actions">
              <button className="primary-btn" data-evz-autowire="1">Import</button>
              <button className="ghost-btn" data-evz-autowire="1">Remix</button>
              <button className="ghost-btn" data-evz-autowire="1">Open Preview</button>
            </div>

            <div className="detail-section">
              <strong>Includes</strong>
              <div className="include-list">
                {selectedResource.includes.map((item) => <span key={item}>{item}</span>)}
              </div>
            </div>

            <div className="detail-section">
              <strong>Studio compatibility</strong>
              <div className="compat-list">
                {selectedResource.compatibility.map((item) => <span key={item}>{item}</span>)}
              </div>
            </div>

            <div className="detail-section">
              <strong>Asset validation</strong>
              <div className="validation-list">
                {selectedResource.validation.map((item) => (
                  <div key={item.label} className={item.status.toLowerCase()}>
                    <span>{item.label}</span>
                    <em>{item.status}</em>
                  </div>
                ))}
              </div>
            </div>

            <div className="usage-note">
              <strong>License / usage</strong>
              <span>Free for EVzone Studio productions. Do not sell as a standalone marketplace asset. Validate before live use.</span>
            </div>
          </div>
        </aside>
      </main>

      {showImportPanel && (
        <div className="import-overlay" onClick={() => setShowImportPanel(false)}>
          <div className="import-drawer" onClick={(event) => event.stopPropagation()}>
            <div className="drawer-head">
              <div>
                <div className="eyebrow">Local asset import</div>
                <h2>Import and validate your own assets</h2>
                <p>Bring local files into the free resource library workflow, then validate before using them live.</p>
              </div>
              <button className="ghost-btn" onClick={() => setShowImportPanel(false)}>Close</button>
            </div>

            <div className="drop-zone">
              <div className="drop-icon">＋</div>
              <strong>Drop files here or browse local assets</strong>
              <span>Supported: EVZ, GLB, PNG, KTX2, WAV, Lottie, CUBE, TS, JSON, EVZ Graph</span>
            </div>

            <div className="import-validation-grid">
              {[
                ["File type", "Ready"],
                ["Size limit", "Pass"],
                ["Texture dimensions", "Pass"],
                ["Mesh count", "Warning"],
                ["License note", "Required"],
                ["Studio runtime", "Ready"],
              ].map(([label, status]) => (
                <div className={`import-check ${status.toLowerCase()}`} key={label}>
                  <strong>{label}</strong>
                  <span>{status}</span>
                </div>
              ))}
            </div>

            <div className="drawer-actions">
              <button className="ghost-btn" data-evz-autowire="1">Run Validation</button>
              <button className="primary-btn" data-evz-autowire="1">Import to Project</button>
            </div>
          </div>
        </div>
      )}
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
.evz-library-page {
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
.library-hero {
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
.search-row,
.resource-head,
.card-actions,
.detail-actions,
.bottom-actions,
.drawer-head,
.drawer-actions,
.hero-stats {
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
.hero-copy p,
.resource-card p,
.detail-content p,
.drawer-head p {
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
.category-list button,
.card-actions button,
.view-toggle button,
.resource-card,
.search-box,
.search-row select,
.detail-actions button,
.import-check,
.drawer-actions button {
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
.category-list button:hover,
.card-actions button:hover,
.view-toggle button:hover,
.resource-card:hover,
.drawer-actions button:hover {
  transform: translateY(-1px);
  box-shadow: 0 12px 24px rgba(15,23,42,0.08);
}
.primary-btn {
  color: white;
  border-color: transparent;
  background: linear-gradient(135deg, var(--evz-green), #10b981);
  box-shadow: 0 18px 36px rgba(3,205,140,0.25);
}
.library-hero {
  max-width: 100%;
  margin: 0 0 18px;
  border-radius: var(--radius-xl);
  padding: 22px;
  display: grid;
  grid-template-columns: 1fr 0.95fr;
  gap: 18px;
  align-items: center;
}
.hero-copy h2 {
  font-size: clamp(26px, 4vw, 42px);
  line-height: 1.05;
  letter-spacing: -0.045em;
  margin: 6px 0 10px;
}
.hero-stats {
  gap: 12px;
  flex-wrap: wrap;
  justify-content: flex-end;
}
.stat-card {
  min-width: 142px;
  flex: 1;
  border: 1px solid var(--evz-soft-line);
  border-radius: 20px;
  padding: 16px;
  background: var(--evz-card-solid);
  display: grid;
  gap: 5px;
}
.stat-card span {
  color: var(--evz-muted);
  font-size: 12px;
  font-weight: 800;
}
.stat-card strong {
  font-size: 26px;
  letter-spacing: -0.03em;
}
.green { color: var(--evz-green); }
.orange { color: var(--evz-orange); }
.library-shell {
  max-width: 100%;
  margin: 0;
  display: grid;
  grid-template-columns: 305px minmax(680px, 1fr) 380px;
  gap: 18px;
}
.panel {
  border-radius: var(--radius-xl);
  overflow: hidden;
}
.category-panel,
.detail-panel {
  min-height: 980px;
}
.panel-head {
  justify-content: space-between;
  gap: 12px;
  padding: 18px 18px 12px;
  border-bottom: 1px solid var(--evz-soft-line);
}
.panel-head h2 {
  margin: 4px 0 0;
  letter-spacing: -0.03em;
}
.free-pill {
  border-radius: 999px;
  padding: 8px 11px;
  color: var(--evz-green);
  background: rgba(3,205,140,0.10);
  font-weight: 900;
  font-size: 12px;
}
.category-list {
  display: grid;
  gap: 7px;
  padding: 14px;
}
.category-list button {
  width: 100%;
  justify-content: space-between;
  display: flex;
  align-items: center;
  text-align: left;
  padding: 10px 12px;
}
.category-list button.active {
  color: white;
  border-color: transparent;
  background: linear-gradient(135deg, var(--evz-green), #10b981);
  box-shadow: 0 14px 26px rgba(3,205,140,0.19);
}
.category-list em {
  font-style: normal;
  font-size: 12px;
  opacity: .75;
}
.license-card {
  margin: 0 14px 14px;
  border: 1px solid rgba(247,127,0,0.20);
  border-radius: 20px;
  padding: 14px;
  background: var(--evz-warning-surface);
  display: grid;
  gap: 8px;
}
.license-card p {
  color: var(--evz-muted);
  line-height: 1.55;
  margin: 0;
  font-size: 13px;
}
.main-panel {
  display: grid;
  gap: 14px;
  align-content: start;
}
.search-panel {
  padding: 14px;
}
.search-row {
  gap: 10px;
  flex-wrap: wrap;
}
.search-box {
  flex: 1;
  min-width: 280px;
  display: flex;
  align-items: center;
  gap: 9px;
  cursor: text;
}
.search-box span {
  color: var(--evz-green);
  font-weight: 900;
}
.search-box input {
  flex: 1;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--evz-ink);
  font: inherit;
}
.search-row select {
  color: var(--evz-muted);
  min-width: 160px;
}
.view-toggle {
  display: flex;
  gap: 6px;
  padding: 4px;
  border-radius: 16px;
  background: rgba(148,163,184,0.10);
}
.view-toggle button {
  padding: 9px 11px;
}
.view-toggle button.active {
  color: white;
  border-color: transparent;
  background: linear-gradient(135deg, var(--evz-orange), #fb923c);
}
.featured-packs {
  display: grid;
  grid-template-columns: repeat(3, minmax(0,1fr));
  gap: 12px;
}
.pack-card {
  border: 1px solid var(--evz-soft-line);
  background: var(--evz-card-solid);
  border-radius: 22px;
  padding: 14px;
  display: grid;
  grid-template-columns: 70px 1fr;
  gap: 12px;
  position: relative;
  overflow: hidden;
}
.pack-art,
.resource-art,
.detail-art,
.history-art {
  border-radius: 18px;
  background:
    radial-gradient(circle at 26% 28%, rgba(3,205,140,0.40), transparent 28%),
    radial-gradient(circle at 70% 32%, rgba(247,127,0,0.30), transparent 30%),
    var(--evz-card);
}
.pack-art { height: 70px; }
.pack-card span {
  color: var(--evz-orange);
  font-size: 10px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: .12em;
}
.pack-card strong { display: block; margin: 4px 0; }
.pack-card small,
.resource-card small,
.detail-content span,
.include-list span,
.compat-list span {
  color: var(--evz-muted);
  line-height: 1.45;
}
.pack-card em {
  position: absolute;
  right: 12px;
  bottom: 12px;
  color: var(--evz-green);
  font-size: 11px;
  font-style: normal;
  font-weight: 900;
}
.resource-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0,1fr));
  gap: 14px;
}
.resource-grid.compact {
  grid-template-columns: 1fr;
}
.resource-card {
  padding: 0;
  overflow: hidden;
  text-align: left;
  cursor: pointer;
}
.resource-card.selected {
  border-color: rgba(3,205,140,0.45);
  outline: 4px solid rgba(3,205,140,0.12);
}
.resource-art {
  position: relative;
  height: 132px;
  margin: 12px 12px 0;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 12px;
}
.resource-art span,
.resource-art b {
  border-radius: 999px;
  padding: 7px 10px;
  background: var(--evz-card);
  color: var(--evz-green);
  font-size: 11px;
  font-weight: 900;
}
.resource-art b {
  color: var(--evz-orange);
}
.resource-body {
  padding: 14px;
  display: grid;
  gap: 10px;
}
.resource-head {
  justify-content: space-between;
  gap: 12px;
}
.resource-head > div {
  display: grid;
  gap: 4px;
}
.resource-head em {
  color: var(--evz-orange);
  background: rgba(247,127,0,0.10);
  border-radius: 999px;
  padding: 7px 9px;
  font-size: 10px;
  font-style: normal;
  font-weight: 900;
  white-space: nowrap;
}
.resource-card p {
  font-size: 13px;
}
.tag-row,
.compat-row,
.include-list,
.compat-list {
  display: flex;
  gap: 7px;
  flex-wrap: wrap;
}
.tag-row span,
.compat-row span,
.detail-badges span,
.include-list span,
.compat-list span {
  border-radius: 999px;
  padding: 7px 9px;
  background: rgba(148,163,184,0.10);
  color: var(--evz-muted);
  font-size: 11px;
  font-weight: 800;
}
.compat-row span,
.compat-list span {
  color: var(--evz-green);
  background: rgba(3,205,140,0.09);
}
.card-actions {
  gap: 7px;
  flex-wrap: wrap;
}
.card-actions button {
  padding: 8px 10px;
  color: var(--evz-muted);
  font-size: 12px;
}
.detail-panel {
  display: grid;
  grid-template-rows: 220px 1fr;
}
.detail-preview {
  position: relative;
  padding: 16px;
  background:
    radial-gradient(circle at 20% 20%, rgba(3,205,140,0.14), transparent 34%),
    radial-gradient(circle at 80% 15%, rgba(247,127,0,0.14), transparent 34%),
    var(--evz-card);
}
.detail-art {
  height: 100%;
  display: flex;
  align-items: flex-start;
  padding: 16px;
}
.detail-art span {
  color: var(--evz-green);
  background: var(--evz-card);
  padding: 8px 11px;
  border-radius: 999px;
  font-weight: 900;
  font-size: 12px;
}
.detail-badges {
  position: absolute;
  left: 22px;
  right: 22px;
  bottom: 22px;
  display: flex;
  gap: 7px;
  flex-wrap: wrap;
}
.detail-badges span:nth-child(2) {
  color: var(--evz-green);
  background: rgba(3,205,140,0.12);
}
.detail-content {
  padding: 18px;
  display: grid;
  gap: 16px;
  align-content: start;
}
.detail-content h2 {
  margin: 4px 0 0;
  letter-spacing: -0.03em;
}
.detail-actions {
  gap: 8px;
  flex-wrap: wrap;
}
.detail-section {
  border: 1px solid var(--evz-soft-line);
  border-radius: 18px;
  padding: 14px;
  background: var(--evz-card-solid);
  display: grid;
  gap: 10px;
}
.validation-list {
  display: grid;
  gap: 8px;
}
.validation-list div {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  border-radius: 13px;
  padding: 10px;
  background: rgba(148,163,184,0.08);
}
.validation-list em {
  font-style: normal;
  font-size: 11px;
  font-weight: 900;
}
.validation-list .pass em,
.validation-list .ready em {
  color: var(--evz-green);
}
.validation-list .warning em {
  color: var(--evz-orange);
}
.usage-note {
  border: 1px solid rgba(247,127,0,0.20);
  border-radius: 18px;
  padding: 14px;
  background: var(--evz-warning-surface);
  display: grid;
  gap: 6px;
}
.usage-note strong { color: var(--evz-orange); }
.import-overlay {
  position: fixed;
  inset: 0;
  z-index: 70;
  display: grid;
  place-items: center;
  background: rgba(15,23,42,0.34);
  padding: 24px;
}
.import-drawer {
  width: 100%;
  max-width: 100%;
  border-radius: 28px;
  background: var(--evz-card-solid);
  border: 1px solid var(--evz-soft-line);
  box-shadow: var(--shadow-lg);
  padding: 20px;
  display: grid;
  gap: 16px;
}
.drawer-head {
  justify-content: space-between;
  gap: 18px;
}
.drawer-head h2 { margin: 4px 0 8px; }
.drop-zone {
  border: 2px dashed rgba(3,205,140,0.28);
  border-radius: 24px;
  min-height: 180px;
  display: grid;
  place-items: center;
  text-align: center;
  gap: 8px;
  padding: 24px;
  background:
    radial-gradient(circle at 50% 30%, rgba(3,205,140,0.10), transparent 34%),
    var(--evz-card);
}
.drop-icon {
  width: 54px;
  height: 54px;
  border-radius: 18px;
  display: grid;
  place-items: center;
  color: white;
  font-size: 24px;
  font-weight: 900;
  background: var(--evz-green);
}
.drop-zone span {
  color: var(--evz-muted);
  font-size: 13px;
}
.import-validation-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0,1fr));
  gap: 10px;
}
.import-check {
  display: grid;
  gap: 5px;
}
.import-check span {
  color: var(--evz-green);
  font-size: 12px;
  font-weight: 900;
}
.import-check.warning span,
.import-check.required span {
  color: var(--evz-orange);
}
.drawer-actions {
  justify-content: flex-end;
  gap: 10px;
}
@media (max-width: 1500px) {
  .library-shell {
    grid-template-columns: 280px 1fr;
  }
  .detail-panel {
    grid-column: span 2;
    min-height: auto;
    grid-template-columns: 320px 1fr;
    grid-template-rows: auto;
  }
  .resource-grid {
    grid-template-columns: repeat(2, minmax(0,1fr));
  }
}
@media (max-width: 1050px) {
  .topbar,
  .library-hero {
    grid-template-columns: 1fr;
    flex-direction: column;
    align-items: flex-start;
  }
  .library-shell {
    grid-template-columns: 1fr;
  }
  .detail-panel {
    grid-column: auto;
    grid-template-columns: 1fr;
  }
  .featured-packs,
  .resource-grid {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 700px) {
  .evz-library-page {
    padding: 14px;
  }
  .top-actions > *,
  .search-row > * {
    width: 100%;
  }
  .hero-stats,
  .search-row,
  .drawer-head,
  .drawer-actions {
    flex-direction: column;
    align-items: stretch;
  }
  .import-validation-grid {
    grid-template-columns: 1fr;
  }
}
`;
