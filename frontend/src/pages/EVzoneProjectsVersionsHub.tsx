"use client";

import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * EVzone Projects & Versions Hub
 * Premium light-mode-first project management page for EVzone Effect Creator.
 *
 * EVzone palette:
 * Green #03cd8c | Orange #f77f00 | Medium Grey #a6a6a6 | Light Grey #f2f2f2
 *
 * Free studio-connected product:
 * no login, no logout, no billing, no marketplace, no account panel.
 */

type TabName =
  | "All"
  | "Recent"
  | "Drafts"
  | "Live Ready"
  | "Imported to Studio"
  | "Archived"
  | "Favorites"
  | "Collections";

type DetailTab = "overview" | "notes" | "assets" | "versions";

type ProjectStatus =
  | "Live Ready"
  | "Draft"
  | "Imported to Studio"
  | "Archived"
  | "Needs Check";

type Compatibility =
  | "Studio Ready"
  | "Needs Optimization"
  | "Missing Assets"
  | "Archived";

type DateGroup = "Today" | "This week" | "This month" | "Older";

type ProjectAsset = {
  name: string;
  type: string;
  size: string;
  state: "Ready" | "Missing" | "Optimized" | "Generated" | "Heavy";
};

type ProjectVersion = {
  id: string;
  label: string;
  date: string;
  size: string;
  quality: number;
  author: string;
  summary: string;
  current?: boolean;
  restorePoint?: boolean;
};

type ProjectNote = {
  author: string;
  time: string;
  text: string;
};

type Project = {
  id: string;
  name: string;
  description: string;
  type: string;
  category: string;
  status: ProjectStatus;
  studioStatus: string;
  compatibility: Compatibility;
  version: string;
  lastEdited: string;
  dateGroup: DateGroup;
  sizeMb: number;
  quality: number;
  cameraTarget: string;
  studioTarget: string;
  collection: string;
  thumbnail: "beauty" | "overlay" | "gesture" | "chroma" | "world" | "countdown" | "filter" | "poll" | "archive";
  favorite: boolean;
  recent: boolean;
  imported: boolean;
  liveReady: boolean;
  archived: boolean;
  autosave: boolean;
  tags: string[];
  warnings: string[];
  notes: ProjectNote[];
  assets: ProjectAsset[];
  versions: ProjectVersion[];
};

const tabs: TabName[] = [
  "All",
  "Recent",
  "Drafts",
  "Live Ready",
  "Imported to Studio",
  "Archived",
  "Favorites",
  "Collections",
];

const projects: Project[] = [
  {
    id: "freckles-makeup-broadcast",
    name: "Freckles Makeup Broadcast",
    description: "Premium beauty filter with face freckles, soft glam, sparkle highlights, and studio-safe skin material.",
    type: "Face AR + Beauty",
    category: "Beauty / Face AR",
    status: "Live Ready",
    studioStatus: "Synced to Host Scene",
    compatibility: "Studio Ready",
    version: "v2.4",
    lastEdited: "Today, 09:42",
    dateGroup: "Today",
    sizeMb: 4.8,
    quality: 98,
    cameraTarget: "Host Camera",
    studioTarget: "Morning Show / Host Close-Up",
    collection: "Beauty Looks",
    thumbnail: "beauty",
    favorite: true,
    recent: true,
    imported: true,
    liveReady: true,
    archived: false,
    autosave: false,
    tags: ["Beauty", "Face Mesh", "Live Safe", "Host"],
    warnings: [],
    notes: [
      { author: "Studio System", time: "Today 09:42", text: "Runtime budget passed. Ready for live host camera usage." },
      { author: "Creative Note", time: "Yesterday", text: "Keep freckles subtle and preserve natural skin texture under bright studio lighting." },
    ],
    assets: [
      { name: "freckle_mask_EDIT_COLOR.png", type: "Texture", size: "840 KB", state: "Ready" },
      { name: "soft_glam_makeup.mat", type: "Material", size: "128 KB", state: "Optimized" },
      { name: "face_occlusion_mesh.glb", type: "3D Mesh", size: "1.1 MB", state: "Ready" },
      { name: "sparkle_bling.vfx", type: "VFX", size: "460 KB", state: "Optimized" },
    ],
    versions: [
      { id: "v24", label: "v2.4", date: "Today 09:42", author: "EVzone Studio", size: "4.8 MB", quality: 98, summary: "Final live-safe pass with improved sparkle opacity.", current: true, restorePoint: true },
      { id: "v23", label: "v2.3", date: "Yesterday 17:04", author: "EVzone Studio", size: "5.1 MB", quality: 95, summary: "Reduced texture memory and adjusted eye shadow intensity.", restorePoint: true },
      { id: "v20", label: "v2.0", date: "4 days ago", author: "EVzone Studio", size: "5.8 MB", quality: 91, summary: "Added face occlusion and contour control.", restorePoint: true },
    ],
  },
  {
    id: "neon-lower-third-pack",
    name: "Neon Lower Third Pack",
    description: "Animated name tags, speaker intros, and caption plates for premium live production overlays.",
    type: "Studio Overlay",
    category: "Lower Thirds",
    status: "Imported to Studio",
    studioStatus: "Available in Overlay Layer 2",
    compatibility: "Studio Ready",
    version: "v1.8",
    lastEdited: "Yesterday, 17:12",
    dateGroup: "This week",
    sizeMb: 2.1,
    quality: 96,
    cameraTarget: "Overlay Layer",
    studioTarget: "All Interview Scenes",
    collection: "Broadcast Graphics",
    thumbnail: "overlay",
    favorite: true,
    recent: true,
    imported: true,
    liveReady: true,
    archived: false,
    autosave: false,
    tags: ["Lower Third", "Lottie", "Alpha", "Operator Controls"],
    warnings: [],
    notes: [
      { author: "Producer", time: "Yesterday", text: "Use this pack for guest introductions and sponsor cards." },
      { author: "Studio System", time: "Yesterday", text: "Alpha channel verified for live compositing." },
    ],
    assets: [
      { name: "neon_nameplate.lottie", type: "Animation", size: "410 KB", state: "Ready" },
      { name: "evzone_accent_gradient.png", type: "Texture", size: "236 KB", state: "Ready" },
      { name: "lower_third_controls.json", type: "Control Surface", size: "32 KB", state: "Ready" },
    ],
    versions: [
      { id: "v18", label: "v1.8", date: "Yesterday 17:12", author: "EVzone Studio", size: "2.1 MB", quality: 96, summary: "Added operator color slider and safer lower-third margins.", current: true, restorePoint: true },
      { id: "v16", label: "v1.6", date: "Last week", author: "EVzone Studio", size: "2.3 MB", quality: 92, summary: "Improved title animation timing.", restorePoint: true },
    ],
  },
  {
    id: "wave-magic-reaction",
    name: "Wave Magic Reaction",
    description: "Hand gesture trigger that releases animated trails, hearts, and sparkle bursts for live audience moments.",
    type: "Gesture Effect",
    category: "Hand / Gesture",
    status: "Needs Check",
    studioStatus: "Not Yet Synced",
    compatibility: "Needs Optimization",
    version: "v0.9",
    lastEdited: "2 days ago",
    dateGroup: "This week",
    sizeMb: 5.0,
    quality: 82,
    cameraTarget: "Guest Camera",
    studioTarget: "Audience Segment",
    collection: "Audience Reactions",
    thumbnail: "gesture",
    favorite: false,
    recent: true,
    imported: false,
    liveReady: false,
    archived: false,
    autosave: false,
    tags: ["Gesture", "VFX", "Particles", "Guest"],
    warnings: ["GPU particles exceed live-safe burst count."],
    notes: [
      { author: "Creative Note", time: "2 days ago", text: "The wave trigger feels responsive, but spark trails should be reduced for low-power systems." },
      { author: "Quality Center", time: "2 days ago", text: "Recommend reducing particle burst count from 240 to 120." },
    ],
    assets: [
      { name: "wave_spark_trail.vfx", type: "VFX", size: "1.8 MB", state: "Heavy" },
      { name: "gesture_wave.nodegraph", type: "Logic", size: "74 KB", state: "Ready" },
      { name: "magic_chime.wav", type: "Audio", size: "520 KB", state: "Ready" },
    ],
    versions: [
      { id: "v09", label: "v0.9", date: "2 days ago", author: "EVzone Studio", size: "5.0 MB", quality: 82, summary: "Added wave gesture trail and sound reaction.", current: true, restorePoint: true },
      { id: "v07", label: "v0.7", date: "5 days ago", author: "EVzone Studio", size: "4.1 MB", quality: 86, summary: "Early lightweight gesture test.", restorePoint: true },
    ],
  },
  {
    id: "clean-key-green-screen",
    name: "CleanKey Green Screen Studio",
    description: "Chroma key setup with spill removal, edge feathering, and virtual newsroom replacement.",
    type: "Chroma + Background",
    category: "Chroma Key",
    status: "Draft",
    studioStatus: "Draft Only",
    compatibility: "Missing Assets",
    version: "v1.1",
    lastEdited: "3 days ago",
    dateGroup: "This week",
    sizeMb: 3.9,
    quality: 74,
    cameraTarget: "Virtual Camera",
    studioTarget: "Newsroom Scene",
    collection: "Studio Utilities",
    thumbnail: "chroma",
    favorite: false,
    recent: false,
    imported: false,
    liveReady: false,
    archived: false,
    autosave: true,
    tags: ["Chroma", "Background", "Recovery", "Virtual Set"],
    warnings: ["Missing virtual background: newsroom_evening.exr", "Autosave recovery available from 3 days ago."],
    notes: [
      { author: "Autosave", time: "3 days ago", text: "Recovered version available after interrupted export." },
      { author: "Quality Center", time: "3 days ago", text: "Spill removal needs a softer edge around hair." },
    ],
    assets: [
      { name: "newsroom_evening.exr", type: "Background", size: "—", state: "Missing" },
      { name: "green_key_preset.json", type: "Chroma Preset", size: "18 KB", state: "Ready" },
      { name: "spill_removal_lut.png", type: "LUT", size: "94 KB", state: "Ready" },
    ],
    versions: [
      { id: "v11", label: "v1.1", date: "3 days ago", author: "Autosave", size: "3.9 MB", quality: 74, summary: "Autosaved after adding newsroom background.", current: true, restorePoint: true },
      { id: "v10", label: "v1.0", date: "6 days ago", author: "EVzone Studio", size: "2.8 MB", quality: 81, summary: "Base green-screen key with edge feather controls.", restorePoint: true },
    ],
  },
  {
    id: "product-stage-portal",
    name: "Product Stage Portal",
    description: "World AR portal for product demos with image target anchoring and hologram material controls.",
    type: "World AR",
    category: "World / Product AR",
    status: "Live Ready",
    studioStatus: "Bound to Product Demo Scene",
    compatibility: "Studio Ready",
    version: "v3.0",
    lastEdited: "4 days ago",
    dateGroup: "This week",
    sizeMb: 7.2,
    quality: 93,
    cameraTarget: "Studio Camera 2",
    studioTarget: "Product Demo Scene",
    collection: "Product Launch",
    thumbnail: "world",
    favorite: true,
    recent: false,
    imported: true,
    liveReady: true,
    archived: false,
    autosave: false,
    tags: ["World AR", "Product", "Image Target", "Hologram"],
    warnings: [],
    notes: [
      { author: "Producer", time: "4 days ago", text: "Use for product close-up segment. Keep portal glow below 60% intensity." },
    ],
    assets: [
      { name: "portal_ring.glb", type: "3D Model", size: "2.2 MB", state: "Optimized" },
      { name: "product_anchor.marker", type: "Image Target", size: "140 KB", state: "Ready" },
      { name: "hologram_material.mat", type: "Material", size: "260 KB", state: "Ready" },
    ],
    versions: [
      { id: "v30", label: "v3.0", date: "4 days ago", author: "EVzone Studio", size: "7.2 MB", quality: 93, summary: "Optimized model and added camera-safe portal placement.", current: true, restorePoint: true },
      { id: "v25", label: "v2.5", date: "2 weeks ago", author: "EVzone Studio", size: "9.4 MB", quality: 84, summary: "Original product portal with heavier model.", restorePoint: true },
    ],
  },
  {
    id: "countdown-launch-scene",
    name: "Countdown Launch Scene",
    description: "Interactive countdown overlay with timer logic, launch stinger, animated digits, and studio start trigger.",
    type: "Interactive Overlay",
    category: "Countdown / Timer",
    status: "Draft",
    studioStatus: "Draft Only",
    compatibility: "Needs Optimization",
    version: "v0.6",
    lastEdited: "4 days ago",
    dateGroup: "This week",
    sizeMb: 4.4,
    quality: 79,
    cameraTarget: "Overlay Layer",
    studioTarget: "Show Opener",
    collection: "Broadcast Graphics",
    thumbnail: "countdown",
    favorite: false,
    recent: false,
    imported: false,
    liveReady: false,
    archived: false,
    autosave: true,
    tags: ["Countdown", "Timer", "Autosave", "Overlay"],
    warnings: ["Autosave recovery available.", "Text contrast warning on orange gradient."],
    notes: [
      { author: "Quality Center", time: "4 days ago", text: "Improve countdown readability on bright backgrounds." },
      { author: "Autosave", time: "4 days ago", text: "Recovered draft includes new countdown sound." },
    ],
    assets: [
      { name: "countdown_digits.json", type: "Lottie", size: "620 KB", state: "Ready" },
      { name: "launch_stinger.wav", type: "Audio", size: "1.3 MB", state: "Generated" },
      { name: "timer_logic.nodegraph", type: "Logic", size: "86 KB", state: "Ready" },
    ],
    versions: [
      { id: "v06", label: "v0.6", date: "4 days ago", author: "Autosave", size: "4.4 MB", quality: 79, summary: "Autosaved countdown with stinger sound.", current: true, restorePoint: true },
      { id: "v05", label: "v0.5", date: "5 days ago", author: "EVzone Studio", size: "3.4 MB", quality: 83, summary: "Readable timer before new animated gradient.", restorePoint: true },
    ],
  },
  {
    id: "vintage-film-grade",
    name: "Vintage Film Grade",
    description: "Warm cinematic LUT with subtle grain and clean broadcast-safe skin highlight retention.",
    type: "Color Filter / LUT",
    category: "Color / Camera",
    status: "Imported to Studio",
    studioStatus: "Available in Camera Looks",
    compatibility: "Studio Ready",
    version: "v1.2",
    lastEdited: "1 week ago",
    dateGroup: "This month",
    sizeMb: 1.2,
    quality: 97,
    cameraTarget: "All Cameras",
    studioTarget: "Camera Look Library",
    collection: "Camera Looks",
    thumbnail: "filter",
    favorite: true,
    recent: false,
    imported: true,
    liveReady: true,
    archived: false,
    autosave: false,
    tags: ["LUT", "Color", "Film", "Broadcast"],
    warnings: [],
    notes: [
      { author: "Color Note", time: "1 week ago", text: "Excellent for interview scenes with warm key lighting." },
    ],
    assets: [
      { name: "vintage_film_lut.cube", type: "LUT", size: "64 KB", state: "Ready" },
      { name: "grain_overlay.png", type: "Texture", size: "480 KB", state: "Optimized" },
    ],
    versions: [
      { id: "v12", label: "v1.2", date: "1 week ago", author: "EVzone Studio", size: "1.2 MB", quality: 97, summary: "Reduced grain opacity and improved warm highlights.", current: true, restorePoint: true },
      { id: "v10", label: "v1.0", date: "2 weeks ago", author: "EVzone Studio", size: "1.5 MB", quality: 92, summary: "Initial film LUT and grain overlay.", restorePoint: true },
    ],
  },
  {
    id: "studio-poll-reactor",
    name: "Studio Poll Reactor",
    description: "Audience poll visualization with animated response bars, confetti trigger, and operator-safe fallback.",
    type: "Interactive Overlay",
    category: "Poll / Reactions",
    status: "Live Ready",
    studioStatus: "Bound to Audience Segment",
    compatibility: "Studio Ready",
    version: "v1.5",
    lastEdited: "2 weeks ago",
    dateGroup: "This month",
    sizeMb: 3.3,
    quality: 94,
    cameraTarget: "Overlay Layer",
    studioTarget: "Audience Q&A",
    collection: "Audience Reactions",
    thumbnail: "poll",
    favorite: false,
    recent: false,
    imported: true,
    liveReady: true,
    archived: false,
    autosave: false,
    tags: ["Poll", "Interactive", "Confetti", "Studio Trigger"],
    warnings: [],
    notes: [
      { author: "Producer", time: "2 weeks ago", text: "Connect to live poll trigger before audience Q&A." },
    ],
    assets: [
      { name: "poll_bars.konva", type: "2D Overlay", size: "260 KB", state: "Ready" },
      { name: "poll_reactor_logic.nodegraph", type: "Logic", size: "112 KB", state: "Ready" },
      { name: "celebration_confetti.vfx", type: "VFX", size: "1.1 MB", state: "Optimized" },
    ],
    versions: [
      { id: "v15", label: "v1.5", date: "2 weeks ago", author: "EVzone Studio", size: "3.3 MB", quality: 94, summary: "Added studio trigger input and fallback animation.", current: true, restorePoint: true },
      { id: "v13", label: "v1.3", date: "3 weeks ago", author: "EVzone Studio", size: "3.5 MB", quality: 90, summary: "Earlier poll bars with limited operator controls.", restorePoint: true },
    ],
  },
  {
    id: "classic-show-opener-archived",
    name: "Classic Show Opener",
    description: "Archived transition pack from the first production design system.",
    type: "Transition Pack",
    category: "Transitions",
    status: "Archived",
    studioStatus: "Archived Locally",
    compatibility: "Archived",
    version: "v0.8",
    lastEdited: "Last month",
    dateGroup: "Older",
    sizeMb: 6.6,
    quality: 68,
    cameraTarget: "Scene Transition",
    studioTarget: "Archive",
    collection: "Archive",
    thumbnail: "archive",
    favorite: false,
    recent: false,
    imported: false,
    liveReady: false,
    archived: true,
    autosave: false,
    tags: ["Archive", "Transition", "Legacy"],
    warnings: ["Older project format. Restore before editing."],
    notes: [
      { author: "Archive", time: "Last month", text: "Archived after replacing with Neon Lower Third Pack and modern transitions." },
    ],
    assets: [
      { name: "old_opener.mov", type: "Video", size: "5.9 MB", state: "Ready" },
      { name: "classic_wipe.json", type: "Transition", size: "220 KB", state: "Ready" },
    ],
    versions: [
      { id: "v08", label: "v0.8", date: "Last month", author: "EVzone Studio", size: "6.6 MB", quality: 68, summary: "Archived final version.", current: true, restorePoint: true },
    ],
  },
];

const filterDefaults = {
  type: "All Types",
  status: "All Statuses",
  date: "Any Date",
  size: "Any Size",
  compatibility: "All Compatibility",
  camera: "All Targets",
  category: "All Categories",
};

function toSlug(value: string) {
  return value.toLowerCase().replace(/\s+/g, "-").replace(/\//g, "-").replace(/[^\w-]/g, "");
}

function getUnique<K extends keyof Project>(key: K) {
  return Array.from(new Set(projects.map((project) => String(project[key]))));
}

function projectMatchesTab(project: Project, activeTab: TabName) {
  switch (activeTab) {
    case "Recent": return project.recent;
    case "Drafts": return project.status === "Draft" || project.autosave;
    case "Live Ready": return project.liveReady;
    case "Imported to Studio": return project.imported;
    case "Archived": return project.archived;
    case "Favorites": return project.favorite;
    case "Collections": return true;
    default: return true;
  }
}

function tabCount(tab: TabName) {
  if (tab === "Collections") return getUnique("collection").length;
  return projects.filter((project) => projectMatchesTab(project, tab)).length;
}

function sizeMatches(project: Project, size: string) {
  if (size === "Under 3 MB") return project.sizeMb < 3;
  if (size === "3–5 MB") return project.sizeMb >= 3 && project.sizeMb <= 5;
  if (size === "Over 5 MB") return project.sizeMb > 5;
  return true;
}

function badgeClass(value: string) {
  return `evz-badge evz-badge-${toSlug(value)}`;
}

export default function EVzoneProjectsVersionsHub() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabName>("All");
  const [detailTab, setDetailTab] = useState<DetailTab>("overview");
  const [selectedId, setSelectedId] = useState(projects[0].id);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState(filterDefaults);
  const [sortBy, setSortBy] = useState("Last edited");
  const [compareA, setCompareA] = useState(projects[0].versions[0].id);
  const [compareB, setCompareB] = useState(projects[0].versions[1].id);
  const [notice, setNotice] = useState("Ready. Select a project to inspect notes, assets, versions, restore points, and studio status.");

  const selectedProject = useMemo(
    () => projects.find((project) => project.id === selectedId) ?? projects[0],
    [selectedId]
  );

  const filteredProjects = useMemo(() => {
    const query = search.trim().toLowerCase();

    return projects
      .filter((project) => projectMatchesTab(project, activeTab))
      .filter((project) => {
        if (!query) return true;
        return [
          project.name,
          project.description,
          project.type,
          project.category,
          project.status,
          project.studioStatus,
          project.compatibility,
          project.cameraTarget,
          project.collection,
          ...project.tags,
        ].join(" ").toLowerCase().includes(query);
      })
      .filter((project) => filters.type === "All Types" || project.type === filters.type)
      .filter((project) => filters.status === "All Statuses" || project.status === filters.status)
      .filter((project) => filters.date === "Any Date" || project.dateGroup === filters.date)
      .filter((project) => sizeMatches(project, filters.size))
      .filter((project) => filters.compatibility === "All Compatibility" || project.compatibility === filters.compatibility)
      .filter((project) => filters.camera === "All Targets" || project.cameraTarget === filters.camera)
      .filter((project) => filters.category === "All Categories" || project.category === filters.category)
      .sort((a, b) => {
        if (sortBy === "Quality") return b.quality - a.quality;
        if (sortBy === "Size") return a.sizeMb - b.sizeMb;
        if (sortBy === "Name") return a.name.localeCompare(b.name);
        if (sortBy === "Studio status") return a.studioStatus.localeCompare(b.studioStatus);
        return 0;
      });
  }, [activeTab, search, filters, sortBy]);

  const collections = useMemo(() => {
    return getUnique("collection").map((collection) => {
      const collectionProjects = projects.filter((project) => project.collection === collection);
      return {
        name: collection,
        count: collectionProjects.length,
        liveReady: collectionProjects.filter((project) => project.liveReady).length,
        warnings: collectionProjects.reduce((total, project) => total + project.warnings.length, 0),
        size: collectionProjects.reduce((total, project) => total + project.sizeMb, 0).toFixed(1),
      };
    });
  }, []);

  const metrics = useMemo(() => {
    const warnings = projects.reduce((total, project) => total + project.warnings.length, 0);
    const totalSize = projects.reduce((total, project) => total + project.sizeMb, 0);
    const averageQuality = Math.round(projects.reduce((total, project) => total + project.quality, 0) / projects.length);

    return {
      total: projects.length,
      recent: projects.filter((project) => project.recent).length,
      liveReady: projects.filter((project) => project.liveReady).length,
      imported: projects.filter((project) => project.imported).length,
      drafts: projects.filter((project) => project.status === "Draft" || project.autosave).length,
      warnings,
      totalSize: totalSize.toFixed(1),
      averageQuality,
    };
  }, []);

  function resetFilters() {
    setSearch("");
    setFilters(filterDefaults);
    setSortBy("Last edited");
    setNotice("Filters reset. Showing all projects.");
  }

  function selectProject(project: Project) {
    setSelectedId(project.id);
    setDetailTab("overview");
    setCompareA(project.versions[0]?.id ?? "");
    setCompareB(project.versions[1]?.id ?? project.versions[0]?.id ?? "");
    setNotice(`${project.name} opened in the project detail drawer.`);
  }

  function action(label: string, project: Project = selectedProject) {
    if (label === "Create New Effect") {
      navigate("/new-project");
      return;
    }

    if (label === "Open Project") {
      selectProject(project);
      navigate("/editor");
      return;
    }

    if (label === "Send to Studio") {
      selectProject(project);
      navigate("/send-to-studio");
      return;
    }

    if (label === "Repair Assets" || label === "Validate assets") {
      navigate("/preview-quality");
      return;
    }

    setNotice(`${label}: ${project.name}`);
  }

  function updateFilter(key: keyof typeof filterDefaults, value: string) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  function applyCollection(collectionName: string) {
    setActiveTab("All");
    setSearch(collectionName);
    setNotice(`Collection filter applied: ${collectionName}`);
  }

  const selectedCompareA = selectedProject.versions.find((version) => version.id === compareA) ?? selectedProject.versions[0];
  const selectedCompareB = selectedProject.versions.find((version) => version.id === compareB) ?? selectedProject.versions[1] ?? selectedProject.versions[0];

  return (
    <main className="evz-page" aria-label="EVzone Projects and Versions Hub">
      <style>{styles}</style>

      <section className="evz-shell">
        <header className="evz-topbar">
          <div className="evz-brand-cluster">
            <div className="evz-brand-mark">EV</div>
            <div>
              <div className="evz-brand-title">Project Command Center</div>
              <div className="evz-brand-subtitle">Projects & Versions Hub · Studio-native management</div>
            </div>
          </div>

          <div className="evz-studio-status">
            <span className="evz-live-dot" />
            <div>
              <strong>EVzone Studio Connected</strong>
              <small>Morning Show Session · Runtime limits loaded</small>
            </div>
          </div>
        </header>

        <section className="evz-hero">
          <div className="evz-hero-copy">
            <h1>Manage every effect, draft, studio import, and restore point.</h1>
            <p>
              A premium project hub for world-class creators: search, filter, compare versions,
              repair missing assets, recover autosaves, and send live-ready effects directly into EVzone Studio.
            </p>
            <div className="evz-hero-actions">
              <button type="button" className="evz-button evz-primary" onClick={() => action("Create New Effect")}>Create New Effect</button>
              <button type="button" className="evz-button evz-dark" onClick={() => action("Open Project")}>Open Project</button>
              <button type="button" className="evz-button evz-white" onClick={() => action("Send to Studio")}>Send to Studio</button>
            </div>
          </div>

          <div className="evz-command-card">
            <div className="evz-command-head">
              <span>Portfolio health</span>
              <strong>{metrics.averageQuality}%</strong>
            </div>
            <div className="evz-command-grid">
              <div><strong>{metrics.liveReady}</strong><span>Live Ready</span></div>
              <div><strong>{metrics.drafts}</strong><span>Drafts</span></div>
              <div><strong>{metrics.imported}</strong><span>Imported</span></div>
              <div><strong>{metrics.totalSize} MB</strong><span>Cache</span></div>
            </div>
          </div>
        </section>

        <section className="evz-alerts" aria-label="Recovery and warning notices">
          <article className="evz-alert evz-alert-green">
            <span>↺</span>
            <div>
              <strong>Autosave recovery notices</strong>
              <p>2 recoverable drafts are available. Restore or compare them before final studio export.</p>
            </div>
            <button type="button" onClick={() => setActiveTab("Drafts")}>Review Drafts</button>
          </article>
          <article className="evz-alert evz-alert-orange">
            <span>!</span>
            <div>
              <strong>Missing asset warnings</strong>
              <p>1 project requires repair before previewing or sending to EVzone Studio.</p>
            </div>
            <button type="button" onClick={() => {
              setSearch("Missing");
              setNotice("Showing projects with missing asset or compatibility warnings.");
            }}>Repair Assets</button>
          </article>
        </section>

        <section className="evz-metric-row" aria-label="Project metrics">
          <div><span>All Projects</span><strong>{metrics.total}</strong></div>
          <div><span>Recent Work</span><strong>{metrics.recent}</strong></div>
          <div><span>Live Ready</span><strong>{metrics.liveReady}</strong></div>
          <div><span>Open Warnings</span><strong>{metrics.warnings}</strong></div>
        </section>

        <section className="evz-workspace">
          <div className="evz-projects-panel">
            <div className="evz-tabs" role="tablist" aria-label="Project tabs">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  role="tab"
                  type="button"
                  aria-selected={activeTab === tab}
                  className={activeTab === tab ? "active" : ""}
                  onClick={() => {
                    setActiveTab(tab);
                    setNotice(`${tab} tab selected.`);
                  }}
                >
                  {tab}
                  <span>{tabCount(tab)}</span>
                </button>
              ))}
            </div>

            <div className="evz-filterbar" aria-label="Search and filters">
              <label className="evz-search">
                <span>Search</span>
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search projects, effects, status, camera target, collection..."
                />
              </label>

              <select aria-label="Filter by type" value={filters.type} onChange={(event) => updateFilter("type", event.target.value)}>
                {["All Types", ...getUnique("type")].map((option) => <option key={option}>{option}</option>)}
              </select>

              <select aria-label="Filter by status" value={filters.status} onChange={(event) => updateFilter("status", event.target.value)}>
                {["All Statuses", "Live Ready", "Draft", "Imported to Studio", "Needs Check", "Archived"].map((option) => <option key={option}>{option}</option>)}
              </select>

              <select aria-label="Filter by date" value={filters.date} onChange={(event) => updateFilter("date", event.target.value)}>
                {["Any Date", "Today", "This week", "This month", "Older"].map((option) => <option key={option}>{option}</option>)}
              </select>

              <select aria-label="Filter by size" value={filters.size} onChange={(event) => updateFilter("size", event.target.value)}>
                {["Any Size", "Under 3 MB", "3–5 MB", "Over 5 MB"].map((option) => <option key={option}>{option}</option>)}
              </select>

              <select aria-label="Filter by compatibility" value={filters.compatibility} onChange={(event) => updateFilter("compatibility", event.target.value)}>
                {["All Compatibility", "Studio Ready", "Needs Optimization", "Missing Assets", "Archived"].map((option) => <option key={option}>{option}</option>)}
              </select>

              <select aria-label="Filter by camera target" value={filters.camera} onChange={(event) => updateFilter("camera", event.target.value)}>
                {["All Targets", ...getUnique("cameraTarget")].map((option) => <option key={option}>{option}</option>)}
              </select>

              <select aria-label="Filter by category" value={filters.category} onChange={(event) => updateFilter("category", event.target.value)}>
                {["All Categories", ...getUnique("category")].map((option) => <option key={option}>{option}</option>)}
              </select>

              <select aria-label="Sort projects" value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                {["Last edited", "Quality", "Size", "Name", "Studio status"].map((option) => <option key={option}>{option}</option>)}
              </select>

              <button className="evz-reset" type="button" onClick={resetFilters}>Reset</button>
            </div>

            {activeTab === "Collections" ? (
              <div className="evz-collections">
                {collections.map((collection) => (
                  <article key={collection.name} className="evz-collection-card">
                    <span className="evz-collection-orb" />
                    <strong>{collection.name}</strong>
                    <p>{collection.count} projects · {collection.liveReady} live-ready · {collection.size} MB · {collection.warnings} warnings</p>
                    <button type="button" onClick={() => applyCollection(collection.name)}>Open Collection</button>
                  </article>
                ))}
              </div>
            ) : (
              <div className="evz-project-grid">
                {filteredProjects.length === 0 ? (
                  <div className="evz-empty">
                    <strong>No projects match these filters.</strong>
                    <p>Clear filters, switch tabs, or search another effect category, studio status, or camera target.</p>
                    <button type="button" onClick={resetFilters}>Show All Projects</button>
                  </div>
                ) : (
                  filteredProjects.map((project) => (
                    <article
                      key={project.id}
                      role="button"
                      tabIndex={0}
                      aria-label={`Open project ${project.name}`}
                      aria-pressed={project.id === selectedProject.id}
                      className={`evz-project-card ${project.id === selectedProject.id ? "selected" : ""}`}
                      onClick={() => selectProject(project)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          selectProject(project);
                        }
                      }}
                    >
                      <div className={`evz-thumb evz-thumb-${project.thumbnail}`}>
                        <div className="evz-thumb-top">
                          <span>{project.category.split(" ")[0]}</span>
                          <strong>{project.version}</strong>
                        </div>
                        <div className="evz-thumb-bottom">
                          <b>{project.type}</b>
                          <small>{project.cameraTarget}</small>
                        </div>
                      </div>

                      <div className="evz-project-card-body">
                        <div className="evz-project-card-head">
                          <span className={badgeClass(project.status)}>{project.status}</span>
                          {project.favorite && <span className="evz-star">★</span>}
                        </div>

                        <h3>{project.name}</h3>
                        <p>{project.description}</p>

                        <div className="evz-tags">
                          {project.tags.slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}
                        </div>

                        <div className="evz-facts">
                          <div><span>Type</span><strong>{project.type}</strong></div>
                          <div><span>Version</span><strong>{project.version}</strong></div>
                          <div><span>Last edited</span><strong>{project.lastEdited}</strong></div>
                          <div><span>Size</span><strong>{project.sizeMb.toFixed(1)} MB</strong></div>
                          <div><span>Studio</span><strong>{project.studioStatus}</strong></div>
                          <div><span>Target</span><strong>{project.cameraTarget}</strong></div>
                        </div>

                        <div className="evz-quality-row">
                          <div className="evz-quality-line"><span style={{ width: `${project.quality}%` }} /></div>
                          <strong>{project.quality}%</strong>
                        </div>

                        <div className="evz-card-footer">
                          <span className={badgeClass(project.compatibility)}>{project.compatibility}</span>
                          {project.autosave && <span className="evz-inline-recovery">Autosave</span>}
                          {project.warnings.length > 0 && <span className="evz-inline-warning">{project.warnings.length} warning{project.warnings.length > 1 ? "s" : ""}</span>}
                        </div>

                        <div className="evz-card-actions" onClick={(event) => event.stopPropagation()}>
                          <button type="button" onClick={() => selectProject(project)}>Details</button>
                          <button type="button" className="send" onClick={() => action("Send to Studio", project)}>Send</button>
                          <button type="button" onClick={() => action("Duplicate", project)}>Duplicate</button>
                        </div>
                      </div>
                    </article>
                  ))
                )}
              </div>
            )}
          </div>

          <aside className="evz-detail-drawer" aria-label="Project detail drawer">
            <div className="evz-detail-head">
              <div className={`evz-thumb evz-thumb-${selectedProject.thumbnail}`}>
                <span>{selectedProject.category.split(" ")[0]}</span>
                <strong>{selectedProject.version}</strong>
              </div>
              <div className="evz-detail-title">
                <span className={badgeClass(selectedProject.status)}>{selectedProject.status}</span>
                <h2>{selectedProject.name}</h2>
                <p>{selectedProject.type} · {selectedProject.collection}</p>
              </div>
            </div>

            <div className="evz-detail-actions">
              <button type="button" className="evz-primary" onClick={() => action("Send to Studio")}>Send to Studio</button>
              <button type="button" onClick={() => action("Duplicate")}>Duplicate</button>
              <button type="button" onClick={() => action("Rename")}>Rename</button>
              <button type="button" onClick={() => action(selectedProject.archived ? "Restore" : "Archive")}>{selectedProject.archived ? "Restore" : "Archive"}</button>
            </div>

            {selectedProject.warnings.length > 0 && (
              <div className="evz-warning-box">
                <strong>Attention needed</strong>
                {selectedProject.warnings.map((warning) => <span key={warning}>{warning}</span>)}
              </div>
            )}

            <div className="evz-detail-tabs" role="tablist" aria-label="Project detail tabs">
              {(["overview", "notes", "assets", "versions"] as DetailTab[]).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={detailTab === tab}
                  className={detailTab === tab ? "active" : ""}
                  onClick={() => setDetailTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            {detailTab === "overview" && (
              <div className="evz-detail-section">
                <div className="evz-mini-grid">
                  <div><span>Studio Status</span><strong>{selectedProject.studioStatus}</strong></div>
                  <div><span>Camera Target</span><strong>{selectedProject.cameraTarget}</strong></div>
                  <div><span>Compatibility</span><strong>{selectedProject.compatibility}</strong></div>
                  <div><span>Studio Target</span><strong>{selectedProject.studioTarget}</strong></div>
                  <div><span>File Size</span><strong>{selectedProject.sizeMb.toFixed(1)} MB</strong></div>
                  <div><span>Quality Score</span><strong>{selectedProject.quality}%</strong></div>
                </div>

                <div className="evz-readiness-card">
                  <span>Readiness assessment</span>
                  <strong>
                    {selectedProject.quality >= 90
                      ? "Premium live-ready"
                      : selectedProject.quality >= 80
                        ? "Needs small polish"
                        : "Needs repair before live"}
                  </strong>
                  <p>Quality score combines performance, version health, compatibility, missing assets, studio import state, and live-safe runtime limits.</p>
                </div>
              </div>
            )}

            {detailTab === "notes" && (
              <div className="evz-detail-section">
                {selectedProject.notes.map((note) => (
                  <article className="evz-note" key={`${note.author}-${note.time}`}>
                    <div>
                      <strong>{note.author}</strong>
                      <span>{note.time}</span>
                    </div>
                    <p>{note.text}</p>
                  </article>
                ))}
                <button type="button" className="evz-add-button" onClick={() => action("Add project note")}>+ Add Note</button>
              </div>
            )}

            {detailTab === "assets" && (
              <div className="evz-detail-section">
                {selectedProject.assets.map((asset) => (
                  <article className="evz-asset-row" key={asset.name}>
                    <div>
                      <strong>{asset.name}</strong>
                      <span>{asset.type} · {asset.size}</span>
                    </div>
                    <span className={badgeClass(asset.state)}>{asset.state}</span>
                  </article>
                ))}
                <button type="button" className="evz-add-button" onClick={() => action("Validate assets")}>Validate Assets</button>
              </div>
            )}

            {detailTab === "versions" && (
              <div className="evz-detail-section">
                <div className="evz-compare-box">
                  <strong>Compare versions</strong>
                  <div>
                    <select value={compareA} onChange={(event) => setCompareA(event.target.value)}>
                      {selectedProject.versions.map((version) => <option key={version.id} value={version.id}>{version.label}</option>)}
                    </select>
                    <span>→</span>
                    <select value={compareB} onChange={(event) => setCompareB(event.target.value)}>
                      {selectedProject.versions.map((version) => <option key={version.id} value={version.id}>{version.label}</option>)}
                    </select>
                  </div>
                  <p>
                    {selectedCompareA?.label} quality {selectedCompareA?.quality}% / {selectedCompareA?.size}
                    {" "}compared with{" "}
                    {selectedCompareB?.label} quality {selectedCompareB?.quality}% / {selectedCompareB?.size}.
                  </p>
                </div>

                {selectedProject.versions.map((version) => (
                  <article className="evz-version-row" key={version.id}>
                    <div>
                      <strong>{version.label} {version.current ? "· Current" : ""}</strong>
                      <p>{version.summary}</p>
                      <span>{version.date} · {version.author} · {version.size} · Quality {version.quality}%</span>
                    </div>
                    <button type="button" onClick={() => action(`Restore ${version.label}`)}>Restore</button>
                  </article>
                ))}
              </div>
            )}
          </aside>
        </section>

        <div className="evz-toast" role="status" aria-live="polite">
          <span className="evz-live-dot" />
          {notice}
        </div>
      </section>
    </main>
  );
}

const styles = `
  :root { color-scheme: light dark; }

  * { box-sizing: border-box; }

  .evz-page {
    --ev-green: #03cd8c;
    --ev-orange: #f77f00;
    --ev-grey: #a6a6a6;
    --ev-light: var(--app-evz-light);
    --ev-ink: var(--app-evz-ink);
    --ev-muted: var(--app-evz-muted);
    --ev-border: var(--app-evz-border);
    --ev-border-strong: var(--app-evz-border-strong);
    --ev-card: var(--app-evz-card);
    --ev-card-strong: var(--app-evz-card-solid);
    --ev-shadow: var(--app-evz-shadow);
    --ev-shadow-soft: var(--app-evz-shadow-soft);
    min-height: 100vh;
    padding: 28px;
    overflow-x: clip;
    color: var(--ev-ink);
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    background:
      radial-gradient(circle at 8% 4%, rgba(3, 205, 140, 0.20), transparent 30%),
      radial-gradient(circle at 90% 2%, rgba(247, 127, 0, 0.18), transparent 30%),
      radial-gradient(circle at 66% 92%, rgba(3, 205, 140, 0.11), transparent 36%),
      var(--evz-app-bg);
  }

  .evz-page button,
  .evz-page input,
  .evz-page select {
    font: inherit;
  }

  .evz-shell {
    width: 100%;
    max-width: 100%;
    overflow-x: clip;
    margin: 0;
    position: relative;
    display: grid;
    gap: 22px;
  }

  .evz-topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 18px;
    padding: 14px 16px 14px 14px;
    border: 1px solid var(--evz-border);
    border-radius: 28px;
    background: var(--evz-card);
    backdrop-filter: blur(24px);
    box-shadow: var(--ev-shadow-soft);
  }

  .evz-brand-cluster {
    display: flex;
    align-items: center;
    gap: 14px;
    min-width: 0;
  }

  .evz-brand-mark {
    width: 56px;
    height: 56px;
    border-radius: 20px;
    display: grid;
    place-items: center;
    color: #04100c;
    font-weight: 950;
    letter-spacing: -0.06em;
    background: linear-gradient(135deg, var(--ev-green), var(--ev-orange));
    box-shadow: 0 18px 36px rgba(3, 205, 140, 0.24);
  }

  .evz-brand-title {
    font-weight: 950;
    letter-spacing: -0.03em;
  }

  .evz-brand-subtitle {
    margin-top: 3px;
    color: var(--ev-muted);
    font-size: 0.84rem;
  }

  .evz-studio-status {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 11px 14px;
    border: 1px solid rgba(3,205,140,0.24);
    border-radius: 999px;
    background: rgba(3,205,140,0.10);
  }

  .evz-studio-status strong,
  .evz-studio-status small {
    display: block;
  }

  .evz-studio-status small {
    margin-top: 2px;
    color: var(--ev-muted);
    font-size: 0.76rem;
  }

  .evz-live-dot {
    width: 10px;
    height: 10px;
    border-radius: 999px;
    display: inline-block;
    background: var(--ev-green);
    box-shadow: 0 0 0 6px rgba(3, 205, 140, 0.14);
    flex: 0 0 auto;
  }

  .evz-hero {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 390px;
    gap: 22px;
  }

  .evz-hero-copy,
  .evz-command-card,
  .evz-projects-panel,
  .evz-detail-drawer,
  .evz-alert,
  .evz-metric-row > div {
    border: 1px solid var(--evz-border);
    background: var(--ev-card);
    backdrop-filter: blur(24px);
    box-shadow: var(--ev-shadow-soft);
  }

  .evz-hero-copy {
    position: relative;
    overflow: hidden;
    padding: 38px;
    border-radius: 34px;
  }

  .evz-hero-copy:after {
    content: "";
    position: absolute;
    right: -130px;
    top: -160px;
    width: 360px;
    height: 360px;
    border-radius: 999px;
    background: radial-gradient(circle, rgba(247, 127, 0, 0.24), transparent 64%);
    pointer-events: none;
  }

  .evz-eyebrow {
    display: inline-flex;
    align-items: center;
    border: 1px solid rgba(3,205,140,0.25);
    border-radius: 999px;
    padding: 9px 12px;
    color: #047856;
    background: rgba(3,205,140,0.10);
    font-size: 0.76rem;
    font-weight: 950;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .evz-hero h1 {
    max-width: 850px;
    margin: 6px 0 10px;
    font-size: clamp(26px, 4vw, 42px);
    line-height: 1.05;
    letter-spacing: -0.045em;
    color: var(--evz-ink);
  }

  .evz-hero p {
    max-width: 820px;
    margin: 0;
    color: var(--ev-muted);
    font-size: 1.04rem;
    line-height: 1.7;
  }

  .evz-hero-actions {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    margin-top: 28px;
  }

  .evz-button,
  .evz-alert button,
  .evz-reset,
  .evz-collection-card button,
  .evz-empty button,
  .evz-card-actions button,
  .evz-detail-actions button,
  .evz-add-button,
  .evz-version-row button {
    border: 0;
    border-radius: 16px;
    padding: 12px 15px;
    cursor: pointer;
    font-weight: 900;
    transition: transform 160ms ease, box-shadow 160ms ease, background 160ms ease;
  }

  .evz-page button:hover {
    transform: translateY(-1px);
  }

  .evz-page button:focus-visible,
  .evz-page [role="button"]:focus-visible,
  .evz-page input:focus-visible,
  .evz-page select:focus-visible {
    outline: 2px solid color-mix(in srgb, var(--ev-green) 60%, white 40%);
    outline-offset: 2px;
  }

  .evz-primary,
  .evz-button.evz-primary {
    color: #03120d;
    background: linear-gradient(135deg, var(--ev-green), #53f8bd);
    box-shadow: 0 14px 30px rgba(3, 205, 140, 0.25);
  }

  .evz-button.evz-dark {
    color: white;
    background: linear-gradient(135deg, #09120f, #1f2f2a);
  }

  .evz-button.evz-white {
    color: #21322d;
    background: var(--evz-card-solid);
    border: 1px solid var(--ev-border);
  }

  [data-evz-theme='dark'] .evz-button.evz-white {
    color: #e5edf9;
    background: rgba(21, 37, 62, 0.78);
    border-color: rgba(116, 145, 184, 0.44);
  }

  .evz-command-card {
    display: grid;
    gap: 18px;
    padding: 24px;
    border-radius: 34px;
    background:
      radial-gradient(circle at 100% 0%, rgba(3, 205, 140, 0.16), transparent 42%),
      var(--evz-frost-soft);
  }

  .evz-command-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .evz-command-head span {
    color: var(--ev-muted);
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    font-size: 0.75rem;
  }

  .evz-command-head strong {
    color: #047856;
    font-size: 2.7rem;
    letter-spacing: -0.08em;
  }

  .evz-command-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .evz-command-grid div {
    min-height: 112px;
    display: grid;
    align-content: center;
    padding: 18px;
    border-radius: 24px;
    background: var(--evz-card);
    border: 1px solid var(--ev-border);
  }

  .evz-command-grid strong {
    font-size: 1.55rem;
    letter-spacing: -0.04em;
  }

  .evz-command-grid span {
    margin-top: 6px;
    color: var(--ev-muted);
    font-size: 0.82rem;
  }

  .evz-alerts {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  .evz-alert {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 18px;
    border-radius: 26px;
  }

  .evz-alert > span {
    width: 48px;
    height: 48px;
    display: grid;
    place-items: center;
    border-radius: 16px;
    font-weight: 950;
    flex: 0 0 auto;
  }

  .evz-alert strong {
    display: block;
  }

  .evz-alert p {
    margin: 5px 0 0;
    color: var(--ev-muted);
    line-height: 1.45;
  }

  .evz-alert button {
    margin-left: auto;
    white-space: nowrap;
    color: white;
    background: #09120f;
  }

  .evz-alert-green {
    border-color: rgba(3,205,140,0.25);
  }

  .evz-alert-green > span {
    background: rgba(3,205,140,0.13);
    color: #047856;
  }

  .evz-alert-orange {
    border-color: rgba(247,127,0,0.24);
  }

  .evz-alert-orange > span {
    background: rgba(247,127,0,0.13);
    color: #9c4e00;
  }

  .evz-metric-row {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 14px;
  }

  .evz-metric-row > div {
    padding: 20px;
    border-radius: 24px;
  }

  .evz-metric-row span {
    display: block;
    color: var(--ev-muted);
    font-size: 0.82rem;
  }

  .evz-metric-row strong {
    display: block;
    margin-top: 7px;
    font-size: 2rem;
    letter-spacing: -0.05em;
  }

  .evz-workspace {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 430px;
    gap: 18px;
    align-items: start;
  }

  .evz-projects-panel,
  .evz-detail-drawer {
    border-radius: 32px;
    padding: 18px;
  }

  .evz-detail-drawer {
    position: sticky;
    top: 24px;
  }

  .evz-tabs {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    overflow: visible;
    padding: 4px 4px 14px;
  }

  .evz-tabs button {
    flex: 0 1 auto;
    border: 1px solid var(--ev-border);
    color: #55645f;
    background: var(--evz-card);
    border-radius: 999px;
    padding: 10px 12px;
    cursor: pointer;
    font-weight: 900;
  }

  .evz-tabs button span {
    margin-left: 7px;
    padding: 3px 7px;
    border-radius: 999px;
    background: rgba(166,166,166,0.16);
  }

  .evz-tabs button.active {
    color: #03120d;
    border-color: rgba(3,205,140,0.38);
    background: rgba(3,205,140,0.13);
  }

  .evz-filterbar {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 10px;
    margin-bottom: 18px;
  }

  .evz-search {
    display: flex;
    gap: 10px;
    align-items: center;
    min-height: 48px;
    padding: 0 12px;
    grid-column: span 2;
    border-radius: 16px;
    border: 1px solid var(--ev-border);
    background: var(--evz-card-solid);
  }

  .evz-search span {
    color: var(--ev-muted);
    font-size: 0.76rem;
    font-weight: 950;
    text-transform: uppercase;
    letter-spacing: 0.07em;
  }

  .evz-search input {
    width: 100%;
    min-width: 0;
    border: 0;
    outline: 0;
    color: var(--ev-ink);
    background: transparent;
    padding: 13px 0;
  }

  .evz-filterbar select,
  .evz-filterbar .evz-reset {
    min-width: 0;
    min-height: 48px;
    border: 1px solid var(--ev-border);
    border-radius: 16px;
    color: #364641;
    background: var(--evz-card-solid);
    padding: 0 10px;
    outline: 0;
  }

  .evz-reset {
    background: #09120f !important;
    color: white !important;
    padding: 0 12px !important;
  }

  .evz-project-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 320px), 1fr));
    gap: 14px;
    min-width: 0;
  }

  .evz-project-card {
    min-width: 0;
    overflow: hidden;
    border-radius: 26px;
    border: 1px solid rgba(9,18,15,0.08);
    background: var(--evz-card);
    box-shadow: 0 12px 24px rgba(9,18,15,0.06);
    cursor: pointer;
    transition: transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease;
  }

  .evz-project-card:hover,
  .evz-project-card.selected {
    transform: translateY(-3px);
    border-color: rgba(3,205,140,0.40);
    box-shadow: 0 24px 50px rgba(9,18,15,0.12);
  }

  .evz-thumb {
    position: relative;
    height: 152px;
    margin: 12px;
    padding: 16px;
    border-radius: 22px;
    overflow: hidden;
    display: grid;
    gap: 8px;
    align-content: space-between;
    color: #03120d;
    isolation: isolate;
  }

  .evz-thumb:before,
  .evz-thumb:after {
    content: "";
    position: absolute;
    border-radius: 999px;
    z-index: -1;
  }

  .evz-thumb:before {
    width: 180px;
    height: 180px;
    right: -58px;
    top: -64px;
    background: var(--evz-card);
  }

  .evz-thumb:after {
    width: 86px;
    height: 86px;
    left: 22px;
    top: 24px;
    border: 18px solid var(--evz-border);
  }

  .evz-thumb-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 10px;
  }

  .evz-thumb span {
    font-size: 0.76rem;
    font-weight: 950;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .evz-thumb strong {
    font-size: 1.6rem;
    letter-spacing: -0.06em;
  }

  .evz-thumb-bottom {
    display: grid;
    gap: 4px;
    max-width: calc(100% - 8px);
  }

  .evz-thumb-bottom b {
    font-size: 0.86rem;
    letter-spacing: -0.02em;
    line-height: 1.2;
  }

  .evz-thumb-bottom small {
    color: color-mix(in srgb, currentColor 70%, white 30%);
    font-size: 0.74rem;
    line-height: 1.2;
  }

  .evz-thumb-beauty { background: linear-gradient(135deg, rgba(3,205,140,0.88), rgba(247,127,0,0.34)); }
  .evz-thumb-overlay { background: linear-gradient(135deg, rgba(9,18,15,0.92), rgba(3,205,140,0.68)); color: white; }
  .evz-thumb-gesture { background: linear-gradient(135deg, rgba(247,127,0,0.86), color-mix(in srgb, var(--evz-card-solid) 52%, transparent)); }
  .evz-thumb-chroma { background: linear-gradient(135deg, rgba(3,205,140,0.74), color-mix(in srgb, var(--evz-card-solid) 54%, transparent)); }
  .evz-thumb-world { background: linear-gradient(135deg, rgba(3,205,140,0.78), rgba(9,18,15,0.82)); color: white; }
  .evz-thumb-countdown { background: linear-gradient(135deg, rgba(247,127,0,0.78), rgba(9,18,15,0.82)); color: white; }
  .evz-thumb-filter { background: linear-gradient(135deg, rgba(166,166,166,0.55), rgba(247,127,0,0.54)); }
  .evz-thumb-poll { background: linear-gradient(135deg, rgba(3,205,140,0.74), rgba(247,127,0,0.68)); }
  .evz-thumb-archive { background: linear-gradient(135deg, rgba(166,166,166,0.72), rgba(9,18,15,0.42)); color: white; }

  .evz-project-card-body {
    padding: 0 16px 16px;
    min-width: 0;
  }

  .evz-project-card-head,
  .evz-card-footer,
  .evz-quality-row,
  .evz-card-actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .evz-project-card-head,
  .evz-card-footer,
  .evz-quality-row {
    justify-content: space-between;
    min-width: 0;
  }

  .evz-project-card h3 {
    margin: 12px 0 6px;
    font-size: 1.12rem;
    line-height: 1.1;
    letter-spacing: -0.035em;
    overflow-wrap: anywhere;
  }

  .evz-project-card p {
    margin: 0;
    min-height: 48px;
    color: var(--ev-muted);
    line-height: 1.5;
    font-size: 0.9rem;
    overflow-wrap: anywhere;
  }

  .evz-tags {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
    margin: 12px 0;
  }

  .evz-tags span {
    padding: 5px 8px;
    border-radius: 999px;
    color: #52615c;
    background: rgba(166,166,166,0.13);
    font-size: 0.72rem;
    font-weight: 850;
  }

  .evz-facts {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    margin: 13px 0;
  }

  .evz-facts div {
    padding: 10px;
    border-radius: 14px;
    background: var(--evz-card);
    border: 1px solid rgba(9,18,15,0.06);
  }

  .evz-facts span {
    display: block;
    color: var(--ev-muted);
    font-size: 0.68rem;
    margin-bottom: 4px;
  }

  .evz-facts strong {
    display: block;
    font-size: 0.79rem;
    line-height: 1.25;
    overflow-wrap: anywhere;
  }

  .evz-badge {
    display: inline-flex;
    width: fit-content;
    align-items: center;
    border-radius: 999px;
    padding: 6px 9px;
    color: #43534e;
    background: rgba(166,166,166,0.14);
    font-size: 0.72rem;
    font-weight: 950;
    white-space: nowrap;
  }

  .evz-badge-live-ready,
  .evz-badge-studio-ready,
  .evz-badge-ready,
  .evz-badge-optimized,
  .evz-badge-generated {
    color: #046448;
    background: rgba(3,205,140,0.15);
  }

  .evz-badge-draft,
  .evz-badge-needs-check,
  .evz-badge-needs-optimization,
  .evz-badge-heavy {
    color: #8a4b02;
    background: rgba(247,127,0,0.15);
  }

  .evz-badge-imported-to-studio {
    color: #324980;
    background: rgba(3, 97, 205, 0.10);
  }

  .evz-badge-missing-assets,
  .evz-badge-missing {
    color: #9b3308;
    background: rgba(247, 83, 0, 0.13);
  }

  .evz-badge-archived {
    color: #5b6461;
    background: rgba(166,166,166,0.22);
  }

  .evz-star {
    color: var(--ev-orange);
    font-size: 1.1rem;
  }

  .evz-quality-line {
    height: 8px;
    flex: 1;
    overflow: hidden;
    border-radius: 999px;
    background: rgba(166,166,166,0.18);
  }

  .evz-quality-line span {
    display: block;
    height: 100%;
    border-radius: inherit;
    background: linear-gradient(90deg, var(--ev-green), var(--ev-orange));
  }

  .evz-quality-row strong {
    font-size: 0.82rem;
  }

  .evz-card-footer {
    margin-top: 12px;
    flex-wrap: wrap;
    justify-content: flex-start;
  }

  .evz-inline-recovery,
  .evz-inline-warning {
    display: inline-flex;
    border-radius: 999px;
    padding: 6px 9px;
    font-size: 0.72rem;
    font-weight: 950;
  }

  .evz-inline-recovery {
    color: #047856;
    background: rgba(3,205,140,0.12);
  }

  .evz-inline-warning {
    color: #8a4b02;
    background: rgba(247,127,0,0.13);
  }

  .evz-card-actions {
    margin-top: 14px;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .evz-card-actions button {
    min-width: 0;
    padding: 9px 10px;
    border: 1px solid var(--ev-border);
    color: #253530;
    background: var(--evz-card-solid);
    font-size: 0.78rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .evz-card-actions button.send {
    color: white;
    background: #09120f;
  }

  .evz-collections {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;
  }

  .evz-collection-card {
    padding: 22px;
    border-radius: 26px;
    border: 1px solid var(--ev-border);
    background: var(--evz-card);
    box-shadow: 0 12px 28px rgba(9,18,15,0.06);
  }

  .evz-collection-orb {
    display: block;
    width: 52px;
    height: 52px;
    margin-bottom: 22px;
    border-radius: 18px;
    background: linear-gradient(135deg, var(--ev-green), var(--ev-orange));
    box-shadow: 0 16px 34px rgba(3,205,140,0.18);
  }

  .evz-collection-card strong {
    display: block;
    font-size: 1.1rem;
  }

  .evz-collection-card p {
    color: var(--ev-muted);
    line-height: 1.55;
  }

  .evz-collection-card button,
  .evz-empty button,
  .evz-add-button {
    color: white;
    background: #09120f;
  }

  .evz-empty {
    grid-column: 1 / -1;
    min-height: 270px;
    display: grid;
    place-content: center;
    text-align: center;
    border-radius: 26px;
    border: 1px dashed var(--ev-border-strong);
    background: var(--evz-card);
  }

  .evz-empty strong {
    font-size: 1.2rem;
  }

  .evz-empty p {
    color: var(--ev-muted);
  }

  .evz-detail-head {
    display: grid;
    grid-template-columns: 128px minmax(0, 1fr);
    gap: 14px;
    align-items: center;
  }

  .evz-detail-head .evz-thumb {
    margin: 0;
    height: 124px;
  }

  .evz-detail-title h2 {
    margin: 10px 0 5px;
    font-size: 1.38rem;
    line-height: 1.05;
    letter-spacing: -0.04em;
  }

  .evz-detail-title p {
    margin: 0;
    color: var(--ev-muted);
  }

  .evz-detail-actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 9px;
    margin: 16px 0;
  }

  .evz-detail-actions button {
    color: #243631;
    background: var(--evz-card-solid);
    border: 1px solid var(--ev-border);
  }

  .evz-detail-actions .evz-primary {
    border: 0;
  }

  .evz-warning-box {
    display: grid;
    gap: 8px;
    padding: 14px;
    border-radius: 18px;
    color: #7d4301;
    background: rgba(247,127,0,0.12);
    border: 1px solid rgba(247,127,0,0.18);
  }

  .evz-warning-box span {
    font-size: 0.84rem;
  }

  .evz-detail-tabs {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 7px;
    margin: 18px 0 14px;
  }

  .evz-detail-tabs button {
    border: 1px solid var(--ev-border);
    background: var(--evz-card);
    color: #5d6965;
    text-transform: capitalize;
    padding: 10px 8px;
    border-radius: 14px;
    cursor: pointer;
    font-weight: 900;
  }

  .evz-detail-tabs button.active {
    color: #03120d;
    border-color: rgba(3,205,140,0.38);
    background: rgba(3,205,140,0.13);
  }

  .evz-detail-section {
    display: grid;
    gap: 12px;
  }

  .evz-mini-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  .evz-mini-grid div,
  .evz-readiness-card,
  .evz-note,
  .evz-asset-row,
  .evz-compare-box,
  .evz-version-row {
    padding: 14px;
    border-radius: 18px;
    border: 1px solid var(--ev-border);
    background: var(--evz-card);
  }

  .evz-mini-grid span,
  .evz-readiness-card span {
    display: block;
    color: var(--ev-muted);
    font-size: 0.76rem;
    margin-bottom: 5px;
  }

  .evz-mini-grid strong,
  .evz-readiness-card strong {
    font-size: 0.9rem;
  }

  .evz-readiness-card p,
  .evz-note p,
  .evz-compare-box p,
  .evz-version-row p {
    margin: 7px 0 0;
    color: var(--ev-muted);
    line-height: 1.52;
  }

  .evz-note div,
  .evz-asset-row,
  .evz-version-row {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    align-items: flex-start;
  }

  .evz-note span,
  .evz-asset-row span,
  .evz-version-row span {
    color: var(--ev-muted);
    font-size: 0.78rem;
  }

  .evz-asset-row strong {
    display: block;
  }

  .evz-asset-row span {
    display: block;
    margin-top: 3px;
  }

  .evz-compare-box {
    display: grid;
    gap: 10px;
  }

  .evz-compare-box div {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    gap: 8px;
    align-items: center;
  }

  .evz-compare-box select {
    width: 100%;
    border: 1px solid var(--ev-border);
    border-radius: 13px;
    background: var(--evz-card-solid);
    padding: 10px;
    color: #263631;
  }

  .evz-version-row {
    align-items: center;
  }

  .evz-version-row button {
    border: 1px solid var(--ev-border);
    color: #253631;
    background: var(--evz-card-solid);
  }

  .evz-toast {
    position: sticky;
    bottom: 20px;
    z-index: 20;
    width: fit-content;
    max-width: 100%;
    display: flex;
    gap: 12px;
    align-items: center;
    padding: 12px 16px;
    border-radius: 999px;
    color: white;
    background: rgba(9,18,15,0.92);
    box-shadow: 0 18px 42px rgba(9,18,15,0.24);
  }

  [data-evz-theme='dark'] .evz-page {
    --ev-ink: #edf4ff;
    --ev-muted: #b3c5de;
    --ev-border: rgba(126, 154, 195, 0.34);
    --ev-border-strong: rgba(148, 176, 218, 0.48);
    --ev-card: rgba(17, 34, 58, 0.88);
    --ev-card-strong: rgba(20, 42, 72, 0.96);
  }

  [data-evz-theme='dark'] .evz-tabs button,
  [data-evz-theme='dark'] .evz-detail-tabs button {
    color: #c5d5ea;
    background: rgba(19, 39, 66, 0.92);
    border-color: rgba(126, 154, 195, 0.34);
  }

  [data-evz-theme='dark'] .evz-tabs button.active,
  [data-evz-theme='dark'] .evz-detail-tabs button.active {
    color: #f4f8ff;
    border-color: rgba(3, 205, 140, 0.45);
    background: rgba(3, 205, 140, 0.20);
  }

  [data-evz-theme='dark'] .evz-search {
    background: rgba(19, 39, 66, 0.92);
    border-color: rgba(126, 154, 195, 0.34);
  }

  [data-evz-theme='dark'] .evz-search span {
    color: #bfd0e6;
  }

  [data-evz-theme='dark'] .evz-filterbar select,
  [data-evz-theme='dark'] .evz-compare-box select {
    color: #d8e5f7;
    background: rgba(19, 39, 66, 0.92);
    border-color: rgba(126, 154, 195, 0.34);
  }

  [data-evz-theme='dark'] .evz-project-card,
  [data-evz-theme='dark'] .evz-collection-card,
  [data-evz-theme='dark'] .evz-empty,
  [data-evz-theme='dark'] .evz-facts div,
  [data-evz-theme='dark'] .evz-mini-grid div,
  [data-evz-theme='dark'] .evz-readiness-card,
  [data-evz-theme='dark'] .evz-note,
  [data-evz-theme='dark'] .evz-asset-row,
  [data-evz-theme='dark'] .evz-compare-box,
  [data-evz-theme='dark'] .evz-version-row {
    border-color: rgba(126, 154, 195, 0.30);
    background: rgba(17, 34, 58, 0.92);
  }

  [data-evz-theme='dark'] .evz-tags span {
    color: #d2dded;
    background: rgba(126, 154, 195, 0.20);
  }

  [data-evz-theme='dark'] .evz-card-actions button,
  [data-evz-theme='dark'] .evz-detail-actions button,
  [data-evz-theme='dark'] .evz-version-row button,
  [data-evz-theme='dark'] .evz-add-button {
    color: #e7f0ff;
    background: rgba(22, 44, 76, 0.96);
    border-color: rgba(126, 154, 195, 0.36);
  }

  [data-evz-theme='dark'] .evz-card-actions button.send,
  [data-evz-theme='dark'] .evz-alert button,
  [data-evz-theme='dark'] .evz-reset {
    color: #ecfff8;
    background: linear-gradient(135deg, #083427, #0b5f45);
    border-color: rgba(3, 205, 140, 0.42);
  }

  [data-evz-theme='dark'] .evz-warning-box {
    color: #ffdcae;
    background: rgba(247, 127, 0, 0.18);
    border-color: rgba(247, 164, 60, 0.38);
  }

  [data-evz-theme='dark'] .evz-thumb {
    color: #ecf4ff;
  }

  [data-evz-theme='dark'] .evz-thumb-bottom small {
    color: rgba(236, 244, 255, 0.82);
  }

  [data-evz-theme='dark'] .evz-thumb:before {
    background: rgba(17, 34, 58, 0.86);
  }

  [data-evz-theme='dark'] .evz-thumb:after {
    border-color: rgba(126, 154, 195, 0.42);
  }

  @media (max-width: 1420px) {
    .evz-workspace { grid-template-columns: 1fr; }
    .evz-detail-drawer { position: relative; top: 0; }
    .evz-filterbar { grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); }
    .evz-search { grid-column: 1 / -1; }
  }

  @media (max-width: 980px) {
    .evz-page { padding: 14px; }
    .evz-topbar,
    .evz-alert {
      align-items: flex-start;
      flex-direction: column;
    }
    .evz-hero { grid-template-columns: 1fr; }
    .evz-alerts,
    .evz-metric-row,
    .evz-collections {
      grid-template-columns: 1fr;
    }
    .evz-filterbar { grid-template-columns: 1fr; }
    .evz-filterbar select,
    .evz-filterbar .evz-reset { min-height: 46px; }
    .evz-detail-head { grid-template-columns: 1fr; }
  }

  @media (max-width: 620px) {
    .evz-hero-copy { padding: 24px; }
    .evz-hero h1 { font-size: 2.7rem; }
    .evz-command-grid,
    .evz-mini-grid,
    .evz-facts,
    .evz-detail-actions {
      grid-template-columns: 1fr;
    }
    .evz-version-row,
    .evz-note div,
    .evz-asset-row {
      flex-direction: column;
    }
    .evz-project-card {
      border-radius: 20px;
    }
    .evz-thumb {
      height: 128px;
      margin: 10px;
      padding: 12px;
      border-radius: 16px;
    }
    .evz-thumb strong {
      font-size: 1.25rem;
      letter-spacing: 0;
    }
    .evz-project-card-body {
      padding: 0 12px 12px;
    }
    .evz-project-card-head,
    .evz-quality-row {
      align-items: flex-start;
      gap: 8px;
    }
    .evz-project-card-head {
      flex-wrap: wrap;
    }
    .evz-project-card p {
      min-height: 0;
    }
    .evz-card-actions {
      grid-template-columns: 1fr;
    }
    .evz-card-actions button {
      min-height: 40px;
      width: 100%;
    }
  }
`;
