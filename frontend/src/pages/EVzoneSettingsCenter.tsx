import React, { useMemo, useState } from "react";
import DashboardCustomizeRoundedIcon from "@mui/icons-material/DashboardCustomizeRounded";
import DevicesRoundedIcon from "@mui/icons-material/DevicesRounded";
import EditNoteRoundedIcon from "@mui/icons-material/EditNoteRounded";
import HubRoundedIcon from "@mui/icons-material/HubRounded";
import NotificationsActiveRoundedIcon from "@mui/icons-material/NotificationsActiveRounded";
import PrivacyTipRoundedIcon from "@mui/icons-material/PrivacyTipRounded";
import PsychologyAltRoundedIcon from "@mui/icons-material/PsychologyAltRounded";
import ScienceRoundedIcon from "@mui/icons-material/ScienceRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import StorageRoundedIcon from "@mui/icons-material/StorageRounded";
import type { SvgIconComponent } from "@mui/icons-material";
import { useEffectHubStore } from "../store/useEffectHubStore";

type SectionKey =
  | "General"
  | "Workspace"
  | "Editor"
  | "Devices"
  | "Studio Bridge"
  | "AI"
  | "Storage & Backup"
  | "Notifications"
  | "Privacy & Data"
  | "Experimental";

type BottomTab = "Keyboard Shortcuts" | "Storage & Cache" | "Backup / Restore" | "Local Data Export";

type ToggleSetting = {
  title: string;
  detail: string;
  value: boolean;
  setter: (value: boolean) => void;
};

const sections: { key: SectionKey; caption: string; Icon: SvgIconComponent }[] = [
  { key: "General", caption: "Language, region and project defaults", Icon: SettingsRoundedIcon },
  { key: "Workspace", caption: "Editor and workspace layouts", Icon: DashboardCustomizeRoundedIcon },
  { key: "Editor", caption: "Autosave, grid, snapping and tools", Icon: EditNoteRoundedIcon },
  { key: "Devices", caption: "Camera, microphone and preview devices", Icon: DevicesRoundedIcon },
  { key: "Studio Bridge", caption: "Bridge, runtime limits and studio sync", Icon: HubRoundedIcon },
  { key: "AI", caption: "Copilot, generation and safety defaults", Icon: PsychologyAltRoundedIcon },
  { key: "Storage & Backup", caption: "Cache, backups and restore points", Icon: StorageRoundedIcon },
  { key: "Notifications", caption: "Quality, autosave and bridge alerts", Icon: NotificationsActiveRoundedIcon },
  { key: "Privacy & Data", caption: "Local data, history and private previews", Icon: PrivacyTipRoundedIcon },
  { key: "Experimental", caption: "Preview-only creator features", Icon: ScienceRoundedIcon },
];

const shortcuts = [
  ["⌘ / Ctrl + S", "Save project and create snapshot", "Global"],
  ["⌘ / Ctrl + K", "Open command palette", "Global"],
  ["Shift + F", "Frame selected object", "Viewport"],
  ["Space", "Pause / resume preview", "Preview"],
  ["F5", "Trigger studio test event", "Studio"],
  ["F6", "Reset preview session", "Preview"],
  ["Shift + 2", "Emergency disable test", "Studio"],
  ["⌘ / Ctrl + B", "Toggle visual scripting dock", "Editor"],
];

const cacheRows = [
  { label: "Project cache", value: "1.8 GB", status: "Healthy" },
  { label: "AI result cache", value: "742 MB", status: "Can clear" },
  { label: "Preview media cache", value: "418 MB", status: "Healthy" },
  { label: "Autosave snapshots", value: "128 items", status: "Backed up" },
  { label: "Shader cache", value: "96 MB", status: "Healthy" },
];

const backupRows = [
  { label: "Last local backup", value: "Today, 12:48", status: "Ready" },
  { label: "Restore points", value: "18 snapshots", status: "Available" },
  { label: "Project versions", value: "7 versions", status: "Available" },
  { label: "Backup location", value: "EVzone Local Backups", status: "Writable" },
];

const exportRows = [
  { label: "Settings JSON", detail: "Language, layout, device, AI, bridge and notification settings." },
  { label: "Workspace presets", detail: "Saved layouts, panels, docks, grids and shortcut overrides." },
  { label: "Local project index", detail: "Local project metadata without account, billing or profile data." },
  { label: "Quality reports", detail: "Internal CSV/PDF-ready analytics and quality reports." },
];

export default function EVzoneSettingsCenter() {
  const [activeSection, setActiveSection] = useState<SectionKey>("General");
  const [bottomTab, setBottomTab] = useState<BottomTab>("Keyboard Shortcuts");

  const [language, setLanguage] = useState("English");
  const [region, setRegion] = useState("Africa / Kampala");
  const [timeFormat, setTimeFormat] = useState("24-hour");
  const [defaultProjectType, setDefaultProjectType] = useState("Studio Overlay + Face AR");

  const [editorLayout, setEditorLayout] = useState("Premium Creator");
  const [workspaceLayout, setWorkspaceLayout] = useState("Docked Studio");
  const [autosave, setAutosave] = useState(true);
  const [autosaveInterval, setAutosaveInterval] = useState(3);
  const [gridVisible, setGridVisible] = useState(true);
  const [snapping, setSnapping] = useState(true);
  const [snapSize, setSnapSize] = useState(8);

  const [cameraDevice, setCameraDevice] = useState("EVzone Studio Camera");
  const [microphoneDevice, setMicrophoneDevice] = useState("Studio Microphone");
  const [previewDevice, setPreviewDevice] = useState("Studio 16:9 Preview");
  const [targetFps, setTargetFps] = useState("60 FPS");

  const [bridgeAutoConnect, setBridgeAutoConnect] = useState(true);
  const [runtimeLimitSync, setRuntimeLimitSync] = useState(true);
  const [studioAssetSync, setStudioAssetSync] = useState(true);
  const [bridgeDiagnostics, setBridgeDiagnostics] = useState(true);

  const [aiCopilot, setAiCopilot] = useState(true);
  const [aiSafety, setAiSafety] = useState(true);
  const [aiLocalHistory, setAiLocalHistory] = useState(true);
  const [aiQuality, setAiQuality] = useState(88);

  const [cacheWarnings, setCacheWarnings] = useState(true);
  const [autoBackup, setAutoBackup] = useState(true);
  const [backupLimit, setBackupLimit] = useState(25);

  const [qualityNotifications, setQualityNotifications] = useState(true);
  const [autosaveNotifications, setAutosaveNotifications] = useState(true);
  const [bridgeNotifications, setBridgeNotifications] = useState(true);
  const [soundNotifications, setSoundNotifications] = useState(false);

  const [localFirst, setLocalFirst] = useState(true);
  const [privatePreviewExpiry, setPrivatePreviewExpiry] = useState("24 hours");
  const [telemetry, setTelemetry] = useState("Quality diagnostics only");
  const [clearHistoryAfter, setClearHistoryAfter] = useState("Never automatically");

  const [experimentalShaderPreview, setExperimentalShaderPreview] = useState(true);
  const [experimentalAIGraph, setExperimentalAIGraph] = useState(true);
  const [experimentalMobilePreview, setExperimentalMobilePreview] = useState(false);
  const [experimentalDepthPreview, setExperimentalDepthPreview] = useState(false);
  const themeMode = useEffectHubStore((state) => state.themeMode);
  const setThemeMode = useEffectHubStore((state) => state.setThemeMode);

  const [cacheCleared, setCacheCleared] = useState(false);
  const [layoutReset, setLayoutReset] = useState(false);
  const [exportReady, setExportReady] = useState(false);
  const [restoreReady, setRestoreReady] = useState(false);

  const unsavedChanges = useMemo(() => {
    return cacheCleared || layoutReset || exportReady || restoreReady;
  }, [cacheCleared, layoutReset, exportReady, restoreReady]);

  const healthCards = [
    { label: "Autosave", value: autosave ? `Every ${autosaveInterval} min` : "Off", tone: autosave ? "green" : "orange" },
    { label: "Bridge", value: bridgeAutoConnect ? "Auto-connect" : "Manual", tone: bridgeAutoConnect ? "green" : "orange" },
    { label: "Cache", value: cacheCleared ? "Recently cleared" : "Healthy", tone: "green" },
    { label: "Account settings", value: "Not included", tone: "orange" },
  ];

  const renderMainPanel = () => {
    if (activeSection === "Workspace") {
      return (
        <SettingsPanel eyebrow="Workspace settings" title="Editor and Workspace Layout">
          <div className="setting-grid">
            <SelectSetting label="Editor layout" value={editorLayout} onChange={setEditorLayout} options={["Premium Creator", "Compact Editor", "Visual Scripting Focus", "Studio Preview Focus", "Developer Layout"]} />
            <SelectSetting label="Workspace layout" value={workspaceLayout} onChange={setWorkspaceLayout} options={["Docked Studio", "Floating Panels", "Dual Screen", "Preview First", "Custom Saved Layout"]} />
          </div>
          <div className="layout-preview">
            <div className="layout-block sidebar">Hierarchy</div>
            <div className="layout-block main">Viewport</div>
            <div className="layout-block preview">Preview</div>
            <div className="layout-block inspector">Inspector</div>
            <div className="layout-block bottom">Visual Logic / Timeline / Console</div>
          </div>
          <div className="action-grid">
            <button className="ghost-btn" onClick={() => setLayoutReset(true)}>Reset Layout</button>
            <button className="ghost-btn" data-evz-autowire="1">Save Current Layout</button>
            <button className="ghost-btn" data-evz-autowire="1">Restore Last Layout</button>
            <button className="primary-btn" data-evz-autowire="1">Apply Workspace</button>
          </div>
          {layoutReset ? <InlineNotice title="Layout reset queued" detail="The layout will reset to Premium Creator defaults after saving settings." /> : null}
        </SettingsPanel>
      );
    }

    if (activeSection === "Editor") {
      return (
        <SettingsPanel eyebrow="Editor settings" title="Autosave, Grid, Snapping and Creator Tools">
          <div className="toggle-stack">
            <ToggleSettingRow title="Autosave" detail="Save local changes and snapshots while editing." checked={autosave} onChange={setAutosave} />
            <ToggleSettingRow title="Show viewport grid" detail="Display grid lines in 2D and 3D scene views." checked={gridVisible} onChange={setGridVisible} />
            <ToggleSettingRow title="Enable snapping" detail="Snap objects, overlays and guides to grid or safe areas." checked={snapping} onChange={setSnapping} />
          </div>
          <div className="setting-grid">
            <NumberSetting label="Autosave interval" value={autosaveInterval} onChange={setAutosaveInterval} min={1} max={15} suffix="minutes" />
            <NumberSetting label="Snap size" value={snapSize} onChange={setSnapSize} min={1} max={32} suffix="px" />
            <SelectSetting label="Default transform tool" value="Move + scale" onChange={() => undefined} options={["Move + scale", "Move only", "Rotate", "Universal transform"]} />
            <SelectSetting label="Guides" value="Safe areas + center lines" onChange={() => undefined} options={["Safe areas + center lines", "Safe areas only", "Center lines only", "Off"]} />
          </div>
          <div className="keyboard-card">
            <strong>Keyboard shortcuts</strong>
            <span>Shortcut overrides are available in the bottom panel. No account profile is required.</span>
          </div>
        </SettingsPanel>
      );
    }

    if (activeSection === "Devices") {
      return (
        <SettingsPanel eyebrow="Camera and device settings" title="Preview Devices, Camera and Audio Inputs">
          <div className="setting-grid">
            <SelectSetting label="Camera source" value={cameraDevice} onChange={setCameraDevice} options={["EVzone Studio Camera", "Webcam", "Virtual Camera", "External Capture Card", "Built-in Preview Media"]} />
            <SelectSetting label="Microphone / audio input" value={microphoneDevice} onChange={setMicrophoneDevice} options={["Studio Microphone", "System Default", "Guest Audio Mix", "No Audio Input"]} />
            <SelectSetting label="Preview device frame" value={previewDevice} onChange={setPreviewDevice} options={["Studio 16:9 Preview", "Mobile 9:16 Preview", "Square Preview", "Transparent Overlay Preview"]} />
            <SelectSetting label="Target preview FPS" value={targetFps} onChange={setTargetFps} options={["60 FPS", "30 FPS", "Adaptive", "Low Power"]} />
          </div>
          <div className="device-grid">
            <DeviceStatus label="Camera readiness" value="Ready" tone="green" />
            <DeviceStatus label="Audio input" value="Detected" tone="green" />
            <DeviceStatus label="GPU preview" value="Healthy" tone="green" />
            <DeviceStatus label="Device frame" value={previewDevice} tone="orange" />
          </div>
          <div className="action-grid">
            <button className="ghost-btn" data-evz-autowire="1">Test Camera</button>
            <button className="ghost-btn" data-evz-autowire="1">Test Audio</button>
            <button className="ghost-btn" data-evz-autowire="1">Refresh Devices</button>
            <button className="primary-btn" data-evz-autowire="1">Apply Device Settings</button>
          </div>
        </SettingsPanel>
      );
    }

    if (activeSection === "Studio Bridge") {
      return (
        <SettingsPanel eyebrow="Studio bridge settings" title="EVzone Studio Bridge and Runtime Sync">
          <div className="bridge-card">
            <div className="bridge-orb"><span>8ms</span><small>Heartbeat</small></div>
            <div>
              <strong>Connected to EVzone Live Studio</strong>
              <span>Bridge schema v3.8 • Runtime limits loaded • Active session LIVE-A</span>
            </div>
          </div>
          <div className="toggle-stack">
            <ToggleSettingRow title="Auto-connect to Studio Bridge" detail="Reconnect automatically when EVzone Studio is already running." checked={bridgeAutoConnect} onChange={setBridgeAutoConnect} />
            <ToggleSettingRow title="Sync runtime limits from Studio" detail="Load memory, file size, frame rate and compatibility limits from EVzone Studio." checked={runtimeLimitSync} onChange={setRuntimeLimitSync} />
            <ToggleSettingRow title="Sync studio assets" detail="Keep Studio assets visible inside the Effect Creator asset panel." checked={studioAssetSync} onChange={setStudioAssetSync} />
            <ToggleSettingRow title="Bridge diagnostics" detail="Collect local connection diagnostics for troubleshooting only." checked={bridgeDiagnostics} onChange={setBridgeDiagnostics} />
          </div>
          <div className="action-grid">
            <button className="ghost-btn" data-evz-autowire="1">Reconnect Bridge</button>
            <button className="ghost-btn" data-evz-autowire="1">Reload Runtime Limits</button>
            <button className="ghost-btn" data-evz-autowire="1">Run Diagnostics</button>
            <button className="primary-btn" data-evz-autowire="1">Save Bridge Settings</button>
          </div>
        </SettingsPanel>
      );
    }

    if (activeSection === "AI") {
      return (
        <SettingsPanel eyebrow="AI settings" title="AI Copilot, Generation Defaults and Safety">
          <div className="toggle-stack">
            <ToggleSettingRow title="AI Copilot in creator pages" detail="Show project-aware AI help in editor, materials, VFX, logic and developer labs." checked={aiCopilot} onChange={setAiCopilot} />
            <ToggleSettingRow title="AI safety checker" detail="Run local checks for flashing, risky prompts, unsafe motion and studio readiness." checked={aiSafety} onChange={setAiSafety} />
            <ToggleSettingRow title="Keep AI result history locally" detail="Store generated results in local history for remixing and undo." checked={aiLocalHistory} onChange={setAiLocalHistory} />
          </div>
          <div className="ai-quality-card">
            <div>
              <strong>Default AI quality level</strong>
              <span>{aiQuality}% premium generation priority</span>
            </div>
            <input type="range" min="0" max="100" value={aiQuality} onChange={(event) => setAiQuality(Number(event.target.value))} />
            <div className="range"><b style={{ width: `${aiQuality}%` }} /></div>
          </div>
          <div className="ai-mode-grid">
            {["Prompt-to-effect", "Prompt-to-overlay", "Prompt-to-material", "Prompt-to-node-graph", "AI error fixer", "AI optimization"].map((mode) => (
              <div className="ai-mode" key={mode}>
                <span>AI</span>
                <strong>{mode}</strong>
              </div>
            ))}
          </div>
        </SettingsPanel>
      );
    }

    if (activeSection === "Storage & Backup") {
      return (
        <SettingsPanel eyebrow="Storage and backup" title="Cache, Local Storage, Backup and Restore">
          <div className="storage-hero">
            <div className="storage-meter">
              <span>2.9 GB</span>
              <small>Local creator data</small>
            </div>
            <div>
              <strong>Local-first project storage</strong>
              <span>Project cache, preview media, AI results, shader cache, autosave snapshots and local backups are stored locally.</span>
            </div>
          </div>
          <div className="toggle-stack">
            <ToggleSettingRow title="Cache warnings" detail="Notify when cache or preview media grows beyond recommended local limits." checked={cacheWarnings} onChange={setCacheWarnings} />
            <ToggleSettingRow title="Automatic local backups" detail="Create local restore points before major sends, AI generations and project imports." checked={autoBackup} onChange={setAutoBackup} />
          </div>
          <NumberSetting label="Backup restore point limit" value={backupLimit} onChange={setBackupLimit} min={5} max={100} suffix="snapshots" />
          <div className="action-grid">
            <button className="ghost-btn" onClick={() => setCacheCleared(true)}>Clear Cache</button>
            <button className="ghost-btn" onClick={() => setRestoreReady(true)}>Create Backup</button>
            <button className="ghost-btn" data-evz-autowire="1">Restore Backup</button>
            <button className="primary-btn" onClick={() => setExportReady(true)}>Export Local Data</button>
          </div>
        </SettingsPanel>
      );
    }

    if (activeSection === "Notifications") {
      return (
        <SettingsPanel eyebrow="Notifications" title="Creator Alerts and Studio Notices">
          <div className="toggle-stack">
            <ToggleSettingRow title="Quality warnings" detail="Show alerts for FPS, memory, flashing, readability and runtime budget issues." checked={qualityNotifications} onChange={setQualityNotifications} />
            <ToggleSettingRow title="Autosave notifications" detail="Show confirmation when autosave snapshots and local backups are created." checked={autosaveNotifications} onChange={setAutosaveNotifications} />
            <ToggleSettingRow title="Studio bridge notifications" detail="Notify when the bridge disconnects, reconnects or receives updated runtime limits." checked={bridgeNotifications} onChange={setBridgeNotifications} />
            <ToggleSettingRow title="Sound notifications" detail="Play gentle local sounds for long exports, quality reports and backup completion." checked={soundNotifications} onChange={setSoundNotifications} />
          </div>
          <div className="notification-preview">
            <strong>Notification preview</strong>
            <span>Quality check complete. Runtime score 94%. Ready to send to EVzone Studio.</span>
          </div>
        </SettingsPanel>
      );
    }

    if (activeSection === "Privacy & Data") {
      return (
        <SettingsPanel eyebrow="Privacy and data" title="Local Data, Private Previews and Export Controls">
          <div className="privacy-banner">
            <strong>No account settings are included.</strong>
            <span>This page does not contain password, profile, billing, authentication, account recovery, payout or marketplace settings.</span>
          </div>
          <div className="toggle-stack">
            <ToggleSettingRow title="Local-first data mode" detail="Keep creator preferences, cache, history and backups on the local studio machine." checked={localFirst} onChange={setLocalFirst} />
          </div>
          <div className="setting-grid">
            <SelectSetting label="Private preview link expiry" value={privatePreviewExpiry} onChange={setPrivatePreviewExpiry} options={["1 hour", "24 hours", "7 days", "Manual only"]} />
            <SelectSetting label="Diagnostics collection" value={telemetry} onChange={setTelemetry} options={["Off", "Quality diagnostics only", "Bridge diagnostics only", "Quality + bridge diagnostics"]} />
            <SelectSetting label="Clear test history" value={clearHistoryAfter} onChange={setClearHistoryAfter} options={["Never automatically", "After 7 days", "After 30 days", "After each studio session"]} />
            <SelectSetting label="Local export format" value="JSON + CSV reports" onChange={() => undefined} options={["JSON + CSV reports", "JSON only", "CSV only", "Full local archive"]} />
          </div>
          <div className="action-grid">
            <button className="ghost-btn" data-evz-autowire="1">Clear Test History</button>
            <button className="ghost-btn" data-evz-autowire="1">Clear Private Links</button>
            <button className="primary-btn" onClick={() => setExportReady(true)}>Local Data Export</button>
          </div>
        </SettingsPanel>
      );
    }

    if (activeSection === "Experimental") {
      return (
        <SettingsPanel eyebrow="Experimental features" title="Preview-Only Creator Features">
          <div className="experimental-warning">
            <strong>Experimental features are local and can be switched off anytime.</strong>
            <span>Use these for testing future creator tools before they become standard EVzone workflows.</span>
          </div>
          <div className="toggle-stack">
            <ToggleSettingRow title="Advanced shader preview" detail="Preview experimental shader graph improvements in the Materials & Shader Lab." checked={experimentalShaderPreview} onChange={setExperimentalShaderPreview} />
            <ToggleSettingRow title="AI graph preview" detail="Enable experimental prompt-to-node-graph suggestions in Visual Logic Lab." checked={experimentalAIGraph} onChange={setExperimentalAIGraph} />
            <ToggleSettingRow title="New mobile preview frame" detail="Try an experimental mobile QR/device preview layout." checked={experimentalMobilePreview} onChange={setExperimentalMobilePreview} />
            <ToggleSettingRow title="Depth preview tools" detail="Enable experimental depth and occlusion previews in Tracking Lab." checked={experimentalDepthPreview} onChange={setExperimentalDepthPreview} />
          </div>
          <div className="action-grid">
            <button className="ghost-btn" data-evz-autowire="1">Disable All Experiments</button>
            <button className="primary-btn" data-evz-autowire="1">Save Experimental Settings</button>
          </div>
        </SettingsPanel>
      );
    }

    return (
      <SettingsPanel eyebrow="General settings" title="Language, Region, Time and Project Defaults">
        <div className="toggle-stack">
          <ToggleSettingRow
            title="Dark theme"
            detail="Switch between premium light and dark mode. Recommended for mobile control instead of top-bar icon."
            checked={themeMode === "dark"}
            onChange={(value) => setThemeMode(value ? "dark" : "light")}
          />
        </div>
        <div className="setting-grid">
          <SelectSetting label="Language" value={language} onChange={setLanguage} options={["English", "French", "Swahili", "Arabic", "Portuguese", "Spanish"]} />
          <SelectSetting label="Region" value={region} onChange={setRegion} options={["Africa / Kampala", "Africa / Nairobi", "Africa / Lagos", "Africa / Johannesburg", "Europe / London", "UTC"]} />
          <SelectSetting label="Time format" value={timeFormat} onChange={setTimeFormat} options={["24-hour", "12-hour", "Studio session time", "UTC"]} />
          <SelectSetting label="Default project type" value={defaultProjectType} onChange={setDefaultProjectType} options={["Studio Overlay + Face AR", "Blank Project", "Beauty Filter", "Interactive Effect", "VFX Motion", "AI Generated Project"]} />
        </div>
        <div className="general-preview">
          <div className="preview-item">
            <span>Language</span>
            <strong>{language}</strong>
          </div>
          <div className="preview-item">
            <span>Region</span>
            <strong>{region}</strong>
          </div>
          <div className="preview-item">
            <span>Time format</span>
            <strong>{timeFormat}</strong>
          </div>
          <div className="preview-item">
            <span>Default project</span>
            <strong>{defaultProjectType}</strong>
          </div>
        </div>
        <InlineNotice title="Non-account settings only" detail="No password, profile, billing, authentication or account recovery settings are shown in this center." />
      </SettingsPanel>
    );
  };

  const renderBottomContent = () => {
    if (bottomTab === "Storage & Cache") {
      return (
        <div className="cache-grid">
          {cacheRows.map((row) => (
            <div className="cache-card" key={row.label}>
              <span className="cache-icon">ST</span>
              <div>
                <strong>{row.label}</strong>
                <small>{row.value}</small>
              </div>
              <em>{row.status}</em>
            </div>
          ))}
        </div>
      );
    }

    if (bottomTab === "Backup / Restore") {
      return (
        <div className="backup-grid">
          {backupRows.map((row) => (
            <div className="backup-card" key={row.label}>
              <strong>{row.label}</strong>
              <span>{row.value}</span>
              <em>{row.status}</em>
            </div>
          ))}
          <div className="backup-actions">
            <button className="ghost-btn" onClick={() => setRestoreReady(true)}>Create Restore Point</button>
            <button className="primary-btn" data-evz-autowire="1">Restore Selected Backup</button>
          </div>
        </div>
      );
    }

    if (bottomTab === "Local Data Export") {
      return (
        <div className="export-grid">
          {exportRows.map((row) => (
            <div className="export-card" key={row.label}>
              <span>EX</span>
              <strong>{row.label}</strong>
              <small>{row.detail}</small>
            </div>
          ))}
          <div className="export-actions">
            <button className="ghost-btn" data-evz-autowire="1">Preview Export</button>
            <button className="primary-btn" onClick={() => setExportReady(true)}>Export Local Data</button>
          </div>
        </div>
      );
    }

    return (
      <div className="shortcut-grid">
        {shortcuts.map(([key, action, area]) => (
          <div className="shortcut-card" key={key}>
            <kbd>{key}</kbd>
            <div>
              <strong>{action}</strong>
              <small>{area}</small>
            </div>
            <button data-evz-autowire="1">Edit</button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="evz-settings-page">
      <style>{styles}</style>

      <header className="topbar">
        <div className="brand-area">
          <div className="brand-mark">EV</div>
          <div>
            <div className="eyebrow">EVzone Effect Creator</div>
            <h1>Settings Center</h1>
            <p>All non-account settings for creator workflow, editor layout, studio bridge, AI, cache, backups, notifications, privacy and experiments.</p>
          </div>
        </div>
        <div className="top-actions">
          <span className="studio-chip"><i />Connected to EVzone Studio</span>
          <button className="ghost-btn" data-evz-autowire="1">Import Settings</button>
          <button className="ghost-btn" onClick={() => setExportReady(true)}>Local Data Export</button>
          <button className="primary-btn" data-evz-autowire="1">Save Settings</button>
        </div>
      </header>

      <section className="settings-hero">
        <div className="hero-card main">
          <div className="settings-orb">
            <span>{unsavedChanges ? "!" : "✓"}</span>
            <small>{unsavedChanges ? "Pending" : "Saved"}</small>
          </div>
          <div>
            <div className="eyebrow">Non-account configuration</div>
            <h2>{activeSection}</h2>
            <p>Change local creator preferences without profile, password, billing, authentication, account or marketplace settings.</p>
          </div>
        </div>
        {healthCards.map((card) => (
          <div className="hero-card mini" key={card.label}>
            <span>{card.label}</span>
            <strong className={card.tone}>{card.value}</strong>
          </div>
        ))}
      </section>

      <main className="settings-shell">
        <aside className="panel nav-panel">
          <div className="panel-head">
            <div>
              <div className="eyebrow">Settings</div>
              <h2>Sections</h2>
            </div>
          </div>
          <div className="section-list">
            {sections.map((section) => {
              const Icon = section.Icon;
              return (
                <button key={section.key} className={activeSection === section.key ? "active" : ""} onClick={() => setActiveSection(section.key)}>
                  <span className="section-icon-badge" aria-hidden="true"><Icon /></span>
                  <div>
                    <strong>{section.key}</strong>
                    <small>{section.caption}</small>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="blocked-card">
            <strong>Not included</strong>
            <span>Password</span>
            <span>Profile</span>
            <span>Billing</span>
            <span>Authentication</span>
          </div>
        </aside>

        <section className="panel main-panel">
          <div className="main-top">
            <div>
              <div className="eyebrow">Active section</div>
              <h2>{activeSection}</h2>
              <p>{sections.find((section) => section.key === activeSection)?.caption}</p>
            </div>
            <div className="main-actions">
              <button className="ghost-btn" onClick={() => setLayoutReset(true)}>Reset Layout</button>
              <button className="ghost-btn" onClick={() => setCacheCleared(true)}>Clear Cache</button>
              <button className="primary-btn" data-evz-autowire="1">Save Changes</button>
            </div>
          </div>

          {renderMainPanel()}
        </section>

        <aside className="panel summary-panel">
          <div className="panel-head">
            <div>
              <div className="eyebrow">Summary</div>
              <h2>Current Settings</h2>
            </div>
          </div>

          <div className="summary-preview">
            <div className="stage-grid" />
            <div className="settings-device">
              <div className="device-top">
                <span>EVzone Creator</span>
                <strong>{workspaceLayout}</strong>
              </div>
              <div className="device-body">
                <div className="mini-panel left" />
                <div className="mini-panel center" />
                <div className="mini-panel right" />
                <div className="mini-panel bottom" />
              </div>
            </div>
          </div>

          <div className="summary-list">
            <SummaryRow label="Language" value={language} tone="green" />
            <SummaryRow label="Region" value={region} tone="green" />
            <SummaryRow label="Default project" value={defaultProjectType} tone="green" />
            <SummaryRow label="Autosave" value={autosave ? `${autosaveInterval} min` : "Off"} tone={autosave ? "green" : "orange"} />
            <SummaryRow label="Studio bridge" value={bridgeAutoConnect ? "Auto" : "Manual"} tone={bridgeAutoConnect ? "green" : "orange"} />
            <SummaryRow label="AI safety" value={aiSafety ? "On" : "Off"} tone={aiSafety ? "green" : "orange"} />
            <SummaryRow label="Cache" value={cacheCleared ? "Cleared" : "Healthy"} tone="green" />
            <SummaryRow label="Account settings" value="Excluded" tone="orange" />
          </div>

          <div className="privacy-card">
            <strong>Local studio settings</strong>
            <span>Settings are designed for EVzone Live Studio connection and local creator workflow. No account panel is required.</span>
          </div>
        </aside>
      </main>

      <section className="panel bottom-panel">
        <div className="bottom-head">
          <div className="bottom-tabs">
            {(["Keyboard Shortcuts", "Storage & Cache", "Backup / Restore", "Local Data Export"] as BottomTab[]).map((tab) => (
              <button key={tab} className={bottomTab === tab ? "active" : ""} onClick={() => setBottomTab(tab)}>
                {tab}
              </button>
            ))}
          </div>
          <div className="bottom-actions">
            <button className="ghost-btn small" onClick={() => setLayoutReset(true)}>Reset Layout</button>
            <button className="ghost-btn small" onClick={() => setCacheCleared(true)}>Clear Cache</button>
            <button className="primary-btn small" onClick={() => setExportReady(true)}>Export Local Data</button>
          </div>
        </div>
        <div className="bottom-content">
          {renderBottomContent()}
        </div>
      </section>

      {cacheCleared || exportReady || restoreReady || layoutReset ? (
        <div className="toast-stack">
          {layoutReset ? <Toast title="Layout reset queued" detail="Premium Creator layout will be restored when settings are saved." onClose={() => setLayoutReset(false)} /> : null}
          {cacheCleared ? <Toast title="Cache cleared" detail="Local preview, shader and AI cache actions have been applied." onClose={() => setCacheCleared(false)} /> : null}
          {exportReady ? <Toast title="Local export ready" detail="Settings, workspace presets and internal reports can be exported locally." onClose={() => setExportReady(false)} /> : null}
          {restoreReady ? <Toast title="Backup action ready" detail="A local restore point can now be created or restored." onClose={() => setRestoreReady(false)} /> : null}
        </div>
      ) : null}
    </div>
  );
}

function SettingsPanel({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <div className="settings-panel">
      <div className="section-title">
        <span>{eyebrow}</span>
        <h3>{title}</h3>
      </div>
      {children}
    </div>
  );
}

function SelectSetting({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <label className="setting-field">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
    </label>
  );
}

function NumberSetting({ label, value, onChange, min, max, suffix }: { label: string; value: number; onChange: (value: number) => void; min: number; max: number; suffix: string }) {
  return (
    <label className="setting-field number-setting">
      <span>{label}</span>
      <div>
        <input type="range" min={min} max={max} value={value} onChange={(event) => onChange(Number(event.target.value))} />
        <strong>{value} {suffix}</strong>
      </div>
    </label>
  );
}

function ToggleSettingRow({ title, detail, checked, onChange }: { title: string; detail: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <label className="toggle-row">
      <div>
        <strong>{title}</strong>
        <small>{detail}</small>
      </div>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      <span className="toggle-visual" />
    </label>
  );
}

function DeviceStatus({ label, value, tone }: { label: string; value: string; tone: "green" | "orange" }) {
  return (
    <div className={`device-status ${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
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

function InlineNotice({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="inline-notice">
      <strong>{title}</strong>
      <span>{detail}</span>
    </div>
  );
}

function Toast({ title, detail, onClose }: { title: string; detail: string; onClose: () => void }) {
  return (
    <div className="toast">
      <div>
        <strong>{title}</strong>
        <span>{detail}</span>
      </div>
      <button onClick={onClose}>×</button>
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
.evz-settings-page {
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
.settings-hero {
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
.settings-hero,
.hero-card,
.main-top,
.main-actions,
.bottom-head,
.bottom-tabs,
.bottom-actions,
.summary-row,
.shortcut-card,
.cache-card,
.qr-mini,
.toast,
.bridge-card,
.storage-hero {
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
.privacy-card span,
.inline-notice span,
.toast span,
.privacy-banner span,
.experimental-warning span,
.storage-hero span,
.bridge-card span,
.notification-preview span {
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
.setting-field,
.toggle-row,
.bottom-tabs button,
.shortcut-card,
.cache-card,
.backup-card,
.export-card,
.summary-row,
.device-status,
.ai-mode,
.control-card {
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
.shortcut-card:hover,
.cache-card:hover,
.backup-card:hover,
.export-card:hover,
.device-status:hover,
.ai-mode:hover {
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
.settings-hero {
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
  font-size: 21px;
}
.settings-orb,
.bridge-orb,
.storage-meter {
  width: 104px;
  height: 104px;
  flex: 0 0 104px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  border: 10px solid rgba(3,205,140,0.16);
  background: var(--evz-card-solid);
}
.settings-orb span,
.bridge-orb span,
.storage-meter span {
  color: var(--evz-green);
  font-size: 32px;
  font-weight: 900;
  line-height: 1;
}
.settings-orb small,
.bridge-orb small,
.storage-meter small {
  margin-top: -20px;
  color: var(--evz-muted);
}
.settings-shell {
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
.nav-panel,
.main-panel,
.summary-panel {
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
.section-list button > span {
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
.section-icon-badge svg {
  width: 22px;
  height: 22px;
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
.blocked-card {
  margin: 0 18px 18px;
  border: 1px solid rgba(247,127,0,0.20);
  border-radius: 22px;
  padding: 14px;
  background: var(--evz-warning-surface);
  display: grid;
  gap: 9px;
}
.blocked-card strong { color: var(--evz-orange); }
.blocked-card span {
  border-radius: 999px;
  padding: 8px 10px;
  color: var(--evz-muted);
  background: var(--evz-card-solid);
  font-size: 12px;
  font-weight: 900;
}
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
.settings-panel {
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
.setting-grid,
.general-preview,
.device-grid,
.ai-mode-grid,
.action-grid,
.cache-grid,
.backup-grid,
.export-grid,
.shortcut-grid {
  display: grid;
  gap: 12px;
}
.setting-grid {
  grid-template-columns: repeat(2, minmax(0,1fr));
}
.setting-field {
  display: grid;
  gap: 8px;
  cursor: default;
}
.setting-field span,
.toggle-row span,
.runtime-row span {
  color: var(--evz-muted);
  font-size: 12px;
  font-weight: 900;
}
.setting-field select,
.setting-field input[type="range"] {
  width: 100%;
  border: 1px solid var(--evz-line);
  border-radius: 12px;
  background: var(--evz-card-solid);
  padding: 10px;
  color: var(--evz-ink);
  font-weight: 800;
}
.number-setting div {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 10px;
  align-items: center;
}
.number-setting input {
  accent-color: var(--evz-green);
}
.number-setting strong {
  color: var(--evz-green);
  white-space: nowrap;
}
.general-preview {
  grid-template-columns: repeat(4, minmax(0,1fr));
}
.preview-item,
.keyboard-card,
.notification-preview,
.privacy-banner,
.experimental-warning,
.inline-notice,
.ai-quality-card {
  border: 1px solid var(--evz-soft-line);
  border-radius: 18px;
  background: var(--evz-card-solid);
  padding: 14px;
  display: grid;
  gap: 6px;
}
.preview-item span {
  color: var(--evz-muted);
  font-size: 12px;
}
.preview-item strong {
  color: var(--evz-green);
}
.inline-notice,
.privacy-banner,
.experimental-warning {
  border-color: rgba(247,127,0,0.20);
  background: var(--evz-warning-surface);
}
.inline-notice strong,
.privacy-banner strong,
.experimental-warning strong {
  color: var(--evz-orange);
}
.layout-preview {
  min-height: 350px;
  border-radius: 24px;
  padding: 14px;
  background:
    radial-gradient(circle at 20% 20%, rgba(3,205,140,0.12), transparent 34%),
    var(--evz-card);
  border: 1px solid var(--evz-soft-line);
  display: grid;
  grid-template-columns: 150px 1fr 160px;
  grid-template-rows: 1fr 110px;
  gap: 10px;
}
.layout-block {
  border-radius: 18px;
  border: 1px solid var(--evz-soft-line);
  background: var(--evz-card-solid);
  display: grid;
  place-items: center;
  color: var(--evz-muted);
  font-size: 12px;
  font-weight: 900;
}
.layout-block.main {
  color: var(--evz-green);
  background:
    linear-gradient(rgba(148,163,184,0.10) 1px, transparent 1px),
    linear-gradient(90deg, rgba(148,163,184,0.10) 1px, transparent 1px),
    white;
  background-size: 28px 28px;
}
.layout-block.bottom {
  grid-column: 1 / -1;
  color: var(--evz-orange);
}
.toggle-stack {
  display: grid;
  gap: 10px;
}
.toggle-row {
  position: relative;
  padding: 14px 64px 14px 14px;
  display: grid;
  gap: 4px;
  cursor: pointer;
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
.action-grid {
  grid-template-columns: repeat(4, minmax(0,1fr));
}
.device-grid {
  grid-template-columns: repeat(4, minmax(0,1fr));
}
.device-status {
  display: grid;
  gap: 6px;
  cursor: default;
}
.device-status span {
  color: var(--evz-muted);
  font-size: 12px;
}
.device-status.green strong { color: var(--evz-green); }
.device-status.orange strong { color: var(--evz-orange); }
.bridge-card,
.storage-hero {
  gap: 16px;
  border: 1px solid var(--evz-soft-line);
  border-radius: 24px;
  background:
    radial-gradient(circle at 18% 20%, rgba(3,205,140,0.14), transparent 34%),
    var(--evz-card);
  padding: 18px;
}
.bridge-card div:last-child,
.storage-hero div:last-child {
  display: grid;
  gap: 7px;
}
.ai-quality-card input {
  width: 100%;
  accent-color: var(--evz-green);
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
.ai-mode-grid {
  grid-template-columns: repeat(3, minmax(0,1fr));
}
.ai-mode {
  display: grid;
  gap: 8px;
  cursor: default;
}
.ai-mode span,
.cache-icon,
.export-card > span {
  width: 36px;
  height: 36px;
  border-radius: 13px;
  display: grid;
  place-items: center;
  color: var(--evz-orange);
  background: rgba(247,127,0,0.10);
  font-size: 12px;
  font-weight: 900;
}
.summary-preview {
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
.settings-device {
  position: absolute;
  inset: 26px;
  border-radius: 20px;
  background: var(--evz-card);
  border: 1px solid var(--evz-border);
  overflow: hidden;
  display: grid;
  grid-template-rows: 48px 1fr;
}
.device-top {
  padding: 12px;
  border-bottom: 1px solid var(--evz-soft-line);
  display: flex;
  justify-content: space-between;
  gap: 10px;
}
.device-top span {
  color: var(--evz-muted);
  font-size: 12px;
  font-weight: 900;
}
.device-top strong {
  color: var(--evz-green);
  font-size: 12px;
}
.device-body {
  padding: 12px;
  display: grid;
  grid-template-columns: 1fr 1.6fr 1fr;
  grid-template-rows: 1fr 52px;
  gap: 8px;
}
.mini-panel {
  border-radius: 12px;
  background: var(--evz-card-solid);
  border: 1px solid var(--evz-soft-line);
}
.mini-panel.center {
  background:
    linear-gradient(rgba(148,163,184,0.10) 1px, transparent 1px),
    linear-gradient(90deg, rgba(148,163,184,0.10) 1px, transparent 1px),
    white;
  background-size: 20px 20px;
}
.mini-panel.bottom {
  grid-column: 1 / -1;
}
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
.privacy-card {
  margin: 16px 18px 18px;
  border: 1px solid rgba(247,127,0,0.20);
  border-radius: 22px;
  padding: 14px;
  background: var(--evz-warning-surface);
  display: grid;
  gap: 7px;
}
.privacy-card strong {
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
.shortcut-grid {
  grid-template-columns: repeat(4, minmax(0,1fr));
}
.shortcut-card {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 10px;
  align-items: center;
}
.shortcut-card kbd {
  grid-column: 1 / -1;
  width: fit-content;
  border-radius: 12px;
  padding: 8px 10px;
  background: rgba(148,163,184,0.12);
}
.shortcut-card div {
  display: grid;
  gap: 4px;
}
.shortcut-card button {
  border: 0;
  border-radius: 12px;
  padding: 8px 10px;
  color: var(--evz-muted);
  background: rgba(148,163,184,0.10);
  font-weight: 900;
}
.cache-grid,
.backup-grid,
.export-grid {
  grid-template-columns: repeat(5, minmax(0,1fr));
}
.cache-card {
  display: grid;
  grid-template-columns: 42px 1fr;
  gap: 10px;
}
.cache-card div {
  display: grid;
  gap: 4px;
}
.cache-card em {
  grid-column: 2;
  color: var(--evz-green);
  font-style: normal;
  font-size: 12px;
  font-weight: 900;
}
.backup-card,
.export-card {
  display: grid;
  gap: 8px;
}
.backup-card span,
.export-card small {
  color: var(--evz-muted);
  line-height: 1.45;
}
.backup-card em {
  color: var(--evz-green);
  font-style: normal;
  font-weight: 900;
}
.backup-actions,
.export-actions {
  grid-column: span 2;
  border: 1px solid var(--evz-soft-line);
  border-radius: 18px;
  background: var(--evz-card-solid);
  padding: 14px;
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: flex-end;
}
.toast-stack {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 60;
  display: grid;
  gap: 10px;
  width: min(420px, calc(100vw - 48px));
}
.toast {
  justify-content: space-between;
  gap: 12px;
  border: 1px solid var(--evz-soft-line);
  border-radius: 18px;
  padding: 14px;
  background: var(--evz-card);
  box-shadow: var(--shadow-md);
}
.toast div {
  display: grid;
  gap: 4px;
}
.toast strong {
  color: var(--evz-green);
}
.toast button {
  border: 0;
  width: 34px;
  height: 34px;
  border-radius: 12px;
  color: var(--evz-orange);
  background: rgba(247,127,0,0.10);
  font-size: 18px;
  cursor: pointer;
}
@media (max-width: 1500px) {
  .settings-hero,
  .settings-shell {
    grid-template-columns: 320px 1fr;
  }
  .hero-card.main {
    grid-column: span 2;
  }
  .summary-panel {
    grid-column: span 2;
    min-height: auto;
  }
  .shortcut-grid,
  .cache-grid,
  .backup-grid,
  .export-grid {
    grid-template-columns: repeat(2, minmax(0,1fr));
  }
}
@media (max-width: 1050px) {
  .topbar {
    flex-direction: column;
    align-items: flex-start;
  }
  .settings-hero,
  .settings-shell {
    grid-template-columns: 1fr;
  }
  .hero-card.main,
  .summary-panel {
    grid-column: auto;
  }
  .setting-grid,
  .general-preview,
  .device-grid,
  .ai-mode-grid,
  .action-grid {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 700px) {
  .evz-settings-page {
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
  .bridge-card,
  .storage-hero,
  .backup-actions,
  .export-actions {
    flex-direction: column;
    align-items: flex-start;
  }
  .shortcut-grid,
  .cache-grid,
  .backup-grid,
  .export-grid {
    grid-template-columns: 1fr;
  }
  .backup-actions,
  .export-actions {
    grid-column: auto;
  }
}
`;
