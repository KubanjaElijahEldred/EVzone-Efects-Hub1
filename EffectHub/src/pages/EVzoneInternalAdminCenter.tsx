import React, { useMemo, useState } from "react";

type AdminSection =
  | "System Health"
  | "Usage & Crashes"
  | "AI Governance"
  | "Library Management"
  | "Rules & Limits"
  | "Logs"
  | "Release Management";

type BottomTab = "Feature Flags" | "Compatibility Rules" | "Runtime Budgets" | "Content Policy";
type HealthStatus = "Healthy" | "Watch" | "Warning" | "Paused";

const adminSections: { key: AdminSection; caption: string; icon: string }[] = [
  { key: "System Health", caption: "Creator platform, bridge, runtime and services", icon: "SH" },
  { key: "Usage & Crashes", caption: "Editor usage, crash reports and stability", icon: "UC" },
  { key: "AI Governance", caption: "AI usage, safety review and flagged content", icon: "AI" },
  { key: "Library Management", caption: "Resources, templates and preset management", icon: "RL" },
  { key: "Rules & Limits", caption: "Compatibility, budgets, sizes and textures", icon: "RL" },
  { key: "Logs", caption: "System logs and studio connector logs", icon: "LG" },
  { key: "Release Management", caption: "Updates, releases and rollout controls", icon: "RM" },
];

const systemHealth = [
  { label: "Effect Creator Core", value: "Healthy", status: "Healthy" as HealthStatus, detail: "Editor, preview and send-to-studio flows online." },
  { label: "EVzone Studio Bridge", value: "Healthy", status: "Healthy" as HealthStatus, detail: "Heartbeat 8 ms, runtime limits loaded." },
  { label: "AI Creator Services", value: "Watch", status: "Watch" as HealthStatus, detail: "Generation queue stable, safety queue elevated." },
  { label: "Resource Library", value: "Healthy", status: "Healthy" as HealthStatus, detail: "Templates, presets and assets indexed." },
  { label: "Preview Runtime", value: "Healthy", status: "Healthy" as HealthStatus, detail: "Average FPS 59.1 across internal checks." },
  { label: "Internal Reports", value: "Healthy", status: "Healthy" as HealthStatus, detail: "CSV and PDF internal report jobs ready." },
];

const editorUsage = [
  { label: "Editor sessions", value: "1,284", trend: "+12%" },
  { label: "Projects opened", value: "482", trend: "+8%" },
  { label: "Send-to-Studio runs", value: "156", trend: "+18%" },
  { label: "Quality checks", value: "814", trend: "+22%" },
  { label: "Preview sessions", value: "2,406", trend: "+11%" },
  { label: "Autosave recoveries", value: "9", trend: "-3" },
];

const crashReports = [
  { time: "Today 13:08", title: "Preview runtime warning", area: "Preview Center", severity: "Warning", detail: "GPU watch threshold exceeded by one project using glass shader + blur." },
  { time: "Today 12:44", title: "Bridge heartbeat restored", area: "Studio Bridge", severity: "Info", detail: "Studio bridge reconnected automatically after 4 seconds." },
  { time: "Yesterday 18:20", title: "Script validation error", area: "Developer Lab", severity: "Warning", detail: "One local script had missing studio payload field; AI fixer suggested patch." },
  { time: "Yesterday 16:11", title: "Export package completed", area: "Send Wizard", severity: "Info", detail: "No missing assets detected; local backup created." },
];

const aiUsageRows = [
  { label: "Prompt-to-effect", count: 214, safety: "Passed", review: "Low" },
  { label: "Prompt-to-overlay", count: 182, safety: "Passed", review: "Low" },
  { label: "Prompt-to-material", count: 76, safety: "Watch", review: "Medium" },
  { label: "Prompt-to-script", count: 61, safety: "Passed", review: "Low" },
  { label: "Prompt-to-node-graph", count: 97, safety: "Passed", review: "Low" },
  { label: "AI error fixer", count: 128, safety: "Passed", review: "Low" },
];

const flaggedGeneratedContent = [
  { title: "High-motion VFX prompt", reason: "Flashing / rapid motion warning", status: "Needs review", source: "AI Creator Hub" },
  { title: "Oversized glass material", reason: "Runtime risk for live studio", status: "Reviewed", source: "Materials Lab" },
  { title: "Audio stinger request", reason: "Volume and rights review recommended", status: "Needs review", source: "AI Sound" },
  { title: "Face reshape preset", reason: "Beauty intensity exceeds conservative studio default", status: "Reviewed", source: "Tracking Lab" },
];

const resourceRows = [
  { name: "Free templates", count: 186, status: "Published", action: "Manage" },
  { name: "Effect presets", count: 342, status: "Published", action: "Review" },
  { name: "3D models", count: 124, status: "Validated", action: "Manage" },
  { name: "Materials / shaders", count: 208, status: "Watch", action: "Optimize" },
  { name: "VFX packs", count: 96, status: "Published", action: "Manage" },
  { name: "Example projects", count: 48, status: "Published", action: "Review" },
];

const templateRows = [
  { title: "Premium Host Intro Template", category: "Live Graphics", status: "Published", quality: 96 },
  { title: "Quiz Show Example Project", category: "Interactive", status: "Published", quality: 91 },
  { title: "Future Newsroom Virtual Set", category: "Virtual Set", status: "Review", quality: 88 },
  { title: "Clean Broadcast Beauty Preset", category: "Beauty", status: "Published", quality: 98 },
];

const presetRows = [
  { title: "EVzone Confetti Burst", type: "VFX", status: "Published", cost: "Low" },
  { title: "Emerald Hologram Material", type: "Material", status: "Watch", cost: "Medium" },
  { title: "Gesture Trigger Pack", type: "Tracking", status: "Published", cost: "Low" },
  { title: "Studio Button Fallback", type: "Control", status: "Published", cost: "Low" },
];

const logs = [
  { time: "13:21:08", source: "System", level: "Info", message: "Internal admin health scan completed." },
  { time: "13:19:45", source: "Studio Connector", level: "Info", message: "Runtime budget rules synced to EVzone Studio Bridge." },
  { time: "13:17:03", source: "AI Safety", level: "Warning", message: "Flagged high-motion generated VFX for review." },
  { time: "13:12:59", source: "Resource Library", level: "Info", message: "Preset index rebuilt with 342 effect presets." },
  { time: "13:08:42", source: "Preview Runtime", level: "Warning", message: "GPU watch threshold reached in one internal test." },
  { time: "13:02:16", source: "Release", level: "Info", message: "Canary rollout prepared for shader graph preview update." },
];

const studioConnectorLogs = [
  { time: "13:19:45", event: "Runtime limits synced", bridge: "LIVE-A", status: "Success" },
  { time: "13:12:03", event: "Scene target map refreshed", bridge: "LIVE-A", status: "Success" },
  { time: "12:44:20", event: "Heartbeat restored", bridge: "LIVE-A", status: "Recovered" },
  { time: "12:39:55", event: "Control surface schema loaded", bridge: "LIVE-A", status: "Success" },
];

const featureFlags = [
  { name: "AI Graph Editor", key: "ai_graph_editor", enabled: true, rollout: "Internal Beta" },
  { name: "Depth Preview Tools", key: "depth_preview_tools", enabled: false, rollout: "Lab Only" },
  { name: "Advanced Shader Preview", key: "advanced_shader_preview", enabled: true, rollout: "Internal Beta" },
  { name: "Mobile QR Preview v2", key: "mobile_qr_preview_v2", enabled: false, rollout: "Canary" },
  { name: "Control Surface Builder v2", key: "control_surface_builder_v2", enabled: true, rollout: "Internal" },
];

const compatibilityRules = [
  { label: "Studio version", value: ">= 4.8.0", status: "Active" },
  { label: "Browser runtime", value: "WebGPU preferred, WebGL fallback", status: "Active" },
  { label: "Desktop runtime", value: "GPU acceleration required", status: "Active" },
  { label: "Mobile preview", value: "Fallback below 45 FPS", status: "Active" },
  { label: "Overlay alpha", value: "Transparent-safe formats only", status: "Active" },
];

const runtimeRules = [
  { label: "Target FPS", value: "60 FPS", status: "Active" },
  { label: "Warning FPS", value: "< 45 FPS", status: "Active" },
  { label: "Script timing", value: "8 ms recommended", status: "Active" },
  { label: "Draw calls", value: "80 recommended max", status: "Active" },
  { label: "Effect package size", value: "5 MB target / 10 MB max", status: "Active" },
];

const contentPolicies = [
  { label: "Flashing / motion safety", status: "Active", detail: "High-speed flashing and extreme motion are flagged for internal review." },
  { label: "Face-safe beauty limits", status: "Active", detail: "Conservative face reshaping defaults for live studio use." },
  { label: "Audio rights review", status: "Active", detail: "AI-generated or imported stingers can require operator review." },
  { label: "Private preview only", status: "Active", detail: "No public marketplace or monetized publish workflow." },
  { label: "Generated content review", status: "Active", detail: "Flagged AI outputs go to internal safety review." },
];

const releaseRows = [
  { title: "Shader Graph Preview Update", version: "2026.04.28-canary", channel: "Canary", status: "Ready" },
  { title: "Studio Bridge Runtime Rules", version: "v3.8.4", channel: "Internal", status: "Live" },
  { title: "AI Safety Review Queue", version: "v2.1.0", channel: "Internal", status: "Live" },
  { title: "Free Resource Library Index", version: "2026.04", channel: "Stable", status: "Live" },
  { title: "Control Surface Builder v2", version: "v2.0-beta", channel: "Beta", status: "Ready" },
];

export default function EVzoneInternalAdminCenter() {
  const [activeSection, setActiveSection] = useState<AdminSection>("System Health");
  const [bottomTab, setBottomTab] = useState<BottomTab>("Feature Flags");
  const [featureFlagState, setFeatureFlagState] = useState(featureFlags);
  const [assetSizeLimit, setAssetSizeLimit] = useState(10);
  const [textureLimit, setTextureLimit] = useState(2048);
  const [runtimeBudget, setRuntimeBudget] = useState(78);
  const [releaseChannel, setReleaseChannel] = useState("Internal");
  const [safetyQueueMode, setSafetyQueueMode] = useState("Manual review required");
  const [selectedLogLevel, setSelectedLogLevel] = useState("All levels");

  const healthScore = useMemo(() => {
    const healthy = systemHealth.filter((item) => item.status === "Healthy").length;
    return Math.round((healthy / systemHealth.length) * 100);
  }, []);

  const warningCount = logs.filter((log) => log.level === "Warning").length + flaggedGeneratedContent.filter((item) => item.status === "Needs review").length;

  const toggleFlag = (key: string) => {
    setFeatureFlagState((previous) => previous.map((flag) => flag.key === key ? { ...flag, enabled: !flag.enabled } : flag));
  };

  const filteredLogs = useMemo(() => {
    if (selectedLogLevel === "All levels") return logs;
    return logs.filter((log) => log.level === selectedLogLevel);
  }, [selectedLogLevel]);

  const renderMainPanel = () => {
    if (activeSection === "Usage & Crashes") {
      return (
        <AdminPanel eyebrow="Editor usage" title="Usage Metrics, Crash Reports and Stability">
          <div className="usage-grid">
            {editorUsage.map((item) => (
              <div className="usage-card" key={item.label}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
                <em>{item.trend}</em>
              </div>
            ))}
          </div>
          <div className="dual-grid">
            <div className="sub-panel">
              <SectionTitle eyebrow="Crash reports" title="Recent Stability Events" />
              {crashReports.map((report) => (
                <div className={`event-row ${report.severity.toLowerCase()}`} key={`${report.time}-${report.title}`}>
                  <span>{report.time}</span>
                  <div>
                    <strong>{report.title}</strong>
                    <small>{report.area} • {report.detail}</small>
                  </div>
                  <em>{report.severity}</em>
                </div>
              ))}
            </div>
            <div className="sub-panel">
              <SectionTitle eyebrow="Runtime quality" title="Internal Stability Summary" />
              <div className="stability-score">
                <div className="score-orb small-orb">
                  <span>96</span>
                  <small>Stability</small>
                </div>
                <p>Most creator services are healthy. Warnings are internal operational issues, not creator-facing monetization metrics.</p>
              </div>
              <div className="mini-stat-grid">
                <div><span>Crash rate</span><strong>0.04%</strong></div>
                <div><span>Preview failures</span><strong>3</strong></div>
                <div><span>Export failures</span><strong>0</strong></div>
                <div><span>Recoveries</span><strong>9</strong></div>
              </div>
            </div>
          </div>
        </AdminPanel>
      );
    }

    if (activeSection === "AI Governance") {
      return (
        <AdminPanel eyebrow="AI usage and safety" title="AI Usage, Safety Review and Flagged Content">
          <div className="ai-admin-hero">
            <div>
              <div className="eyebrow">AI safety queue</div>
              <h3>{flaggedGeneratedContent.filter((item) => item.status === "Needs review").length} items need review</h3>
              <p>Review AI outputs, risky generated content, high-motion visuals, audio stingers, runtime-heavy materials and face-safe limits.</p>
            </div>
            <label className="setting-field compact">
              <span>Safety queue mode</span>
              <select value={safetyQueueMode} onChange={(event) => setSafetyQueueMode(event.target.value)}>
                <option>Manual review required</option>
                <option>Auto-pass low-risk only</option>
                <option>Pause AI generation</option>
              </select>
            </label>
          </div>

          <div className="dual-grid">
            <div className="sub-panel">
              <SectionTitle eyebrow="AI usage" title="AI Tool Activity" />
              {aiUsageRows.map((row) => (
                <div className={`ai-row ${row.safety.toLowerCase()}`} key={row.label}>
                  <div>
                    <strong>{row.label}</strong>
                    <small>{row.count} generations • Review level {row.review}</small>
                  </div>
                  <em>{row.safety}</em>
                </div>
              ))}
            </div>
            <div className="sub-panel">
              <SectionTitle eyebrow="Flagged generated content" title="Review Queue" />
              {flaggedGeneratedContent.map((item) => (
                <div className={`flagged-row ${item.status === "Needs review" ? "warning" : "reviewed"}`} key={item.title}>
                  <div>
                    <strong>{item.title}</strong>
                    <small>{item.reason} • {item.source}</small>
                  </div>
                  <em>{item.status}</em>
                  <button data-evz-autowire="1">{item.status === "Needs review" ? "Review" : "Open"}</button>
                </div>
              ))}
            </div>
          </div>
        </AdminPanel>
      );
    }

    if (activeSection === "Library Management") {
      return (
        <AdminPanel eyebrow="Resource library management" title="Free Library, Templates and Presets">
          <div className="library-summary-grid">
            {resourceRows.map((row) => (
              <div className={`library-card ${row.status.toLowerCase()}`} key={row.name}>
                <span>{row.name}</span>
                <strong>{row.count}</strong>
                <em>{row.status}</em>
                <button data-evz-autowire="1">{row.action}</button>
              </div>
            ))}
          </div>

          <div className="dual-grid">
            <div className="sub-panel">
              <SectionTitle eyebrow="Template management" title="Template Quality" />
              {templateRows.map((template) => (
                <div className="template-row" key={template.title}>
                  <div>
                    <strong>{template.title}</strong>
                    <small>{template.category} • Quality {template.quality}%</small>
                  </div>
                  <em className={template.status === "Published" ? "green" : "orange"}>{template.status}</em>
                </div>
              ))}
            </div>
            <div className="sub-panel">
              <SectionTitle eyebrow="Preset management" title="Preset Runtime Cost" />
              {presetRows.map((preset) => (
                <div className="preset-row" key={preset.title}>
                  <div>
                    <strong>{preset.title}</strong>
                    <small>{preset.type} • Runtime cost {preset.cost}</small>
                  </div>
                  <em className={preset.status === "Published" ? "green" : "orange"}>{preset.status}</em>
                </div>
              ))}
            </div>
          </div>
        </AdminPanel>
      );
    }

    if (activeSection === "Rules & Limits") {
      return (
        <AdminPanel eyebrow="Compatibility and runtime rules" title="Compatibility Rules, Runtime Budgets, Asset and Texture Limits">
          <div className="rules-grid">
            <NumberRule title="Runtime budget target" value={runtimeBudget} onChange={setRuntimeBudget} min={40} max={100} suffix="%" />
            <NumberRule title="Asset size max" value={assetSizeLimit} onChange={setAssetSizeLimit} min={1} max={50} suffix="MB" />
            <NumberRule title="Texture size max" value={textureLimit} onChange={setTextureLimit} min={512} max={4096} step={512} suffix="px" />
          </div>
          <div className="dual-grid">
            <div className="sub-panel">
              <SectionTitle eyebrow="Compatibility rules" title="Active Rules" />
              {compatibilityRules.map((rule) => (
                <RuleRow key={rule.label} label={rule.label} value={rule.value} status={rule.status} />
              ))}
            </div>
            <div className="sub-panel">
              <SectionTitle eyebrow="Runtime budget rules" title="Runtime Limits" />
              {runtimeRules.map((rule) => (
                <RuleRow key={rule.label} label={rule.label} value={rule.value} status={rule.status} />
              ))}
            </div>
          </div>
          <div className="limit-note">
            <strong>Internal rule update</strong>
            <span>Rules are internal EVzone controls. Changes should be tested in Preview & Quality Center before release.</span>
          </div>
        </AdminPanel>
      );
    }

    if (activeSection === "Logs") {
      return (
        <AdminPanel eyebrow="Logs" title="System Logs and Studio Connector Logs">
          <div className="log-toolbar">
            <label className="setting-field compact">
              <span>Log filter</span>
              <select value={selectedLogLevel} onChange={(event) => setSelectedLogLevel(event.target.value)}>
                <option>All levels</option>
                <option>Info</option>
                <option>Warning</option>
              </select>
            </label>
            <div className="log-actions">
              <button className="ghost-btn" data-evz-autowire="1">Copy Logs</button>
              <button className="ghost-btn" data-evz-autowire="1">Export Logs</button>
              <button className="primary-btn" data-evz-autowire="1">Refresh Logs</button>
            </div>
          </div>
          <div className="dual-grid">
            <div className="sub-panel">
              <SectionTitle eyebrow="System logs" title="Recent Events" />
              <div className="log-list">
                {filteredLogs.map((log) => (
                  <div className={`log-row ${log.level.toLowerCase()}`} key={`${log.time}-${log.message}`}>
                    <span>{log.time}</span>
                    <em>{log.level}</em>
                    <div>
                      <strong>{log.source}</strong>
                      <small>{log.message}</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="sub-panel">
              <SectionTitle eyebrow="Studio connector logs" title="Bridge Events" />
              {studioConnectorLogs.map((log) => (
                <div className={`connector-row ${log.status.toLowerCase()}`} key={`${log.time}-${log.event}`}>
                  <span>{log.time}</span>
                  <div>
                    <strong>{log.event}</strong>
                    <small>{log.bridge}</small>
                  </div>
                  <em>{log.status}</em>
                </div>
              ))}
            </div>
          </div>
        </AdminPanel>
      );
    }

    if (activeSection === "Release Management") {
      return (
        <AdminPanel eyebrow="Release and update management" title="Internal Releases, Rollouts and Updates">
          <div className="release-hero">
            <div>
              <div className="eyebrow">Release/update management</div>
              <h3>Prepare, stage and roll out internal EVzone creator updates.</h3>
              <p>Release management is internal-only and controls creator platform features, bridge rules, resource indexes and safety queues.</p>
            </div>
            <label className="setting-field compact">
              <span>Release channel</span>
              <select value={releaseChannel} onChange={(event) => setReleaseChannel(event.target.value)}>
                <option>Internal</option>
                <option>Canary</option>
                <option>Beta</option>
                <option>Stable</option>
              </select>
            </label>
          </div>
          <div className="release-list">
            {releaseRows.map((release) => (
              <div className={`release-row ${release.status.toLowerCase()}`} key={release.title}>
                <span className="release-icon">UP</span>
                <div>
                  <strong>{release.title}</strong>
                  <small>{release.version} • {release.channel}</small>
                </div>
                <em>{release.status}</em>
                <button data-evz-autowire="1">{release.status === "Ready" ? "Roll out" : "Open"}</button>
              </div>
            ))}
          </div>
        </AdminPanel>
      );
    }

    return (
      <AdminPanel eyebrow="System health" title="Creator Platform Health">
        <div className="health-hero-panel">
          <div className="score-orb">
            <span>{healthScore}</span>
            <small>Health</small>
          </div>
          <div>
            <h3>EVzone Creator systems are operational.</h3>
            <p>System health monitors editor runtime, studio bridge, resource library, AI services, preview runtime, reports and internal operations.</p>
          </div>
        </div>
        <div className="health-grid">
          {systemHealth.map((item) => (
            <div className={`health-card ${item.status.toLowerCase()}`} key={item.label}>
              <div>
                <strong>{item.label}</strong>
                <small>{item.detail}</small>
              </div>
              <em>{item.value}</em>
            </div>
          ))}
        </div>
        <div className="admin-warning">
          <strong>Internal control only</strong>
          <span>This admin center is for EVzone internal operations, quality, library, AI safety, rules, logs and release controls. It is not a creator marketplace, billing or public account area.</span>
        </div>
      </AdminPanel>
    );
  };

  const renderBottomContent = () => {
    if (bottomTab === "Compatibility Rules") {
      return (
        <div className="bottom-rule-grid">
          {compatibilityRules.map((rule) => <RuleCard key={rule.label} {...rule} />)}
        </div>
      );
    }

    if (bottomTab === "Runtime Budgets") {
      return (
        <div className="bottom-rule-grid">
          {runtimeRules.map((rule) => <RuleCard key={rule.label} {...rule} />)}
          <div className="rule-card custom">
            <strong>Asset size limits</strong>
            <span>{assetSizeLimit} MB max package control</span>
            <em>Internal</em>
          </div>
          <div className="rule-card custom">
            <strong>Texture limits</strong>
            <span>{textureLimit}px max default texture size</span>
            <em>Internal</em>
          </div>
        </div>
      );
    }

    if (bottomTab === "Content Policy") {
      return (
        <div className="policy-grid">
          {contentPolicies.map((policy) => (
            <div className="policy-card" key={policy.label}>
              <strong>{policy.label}</strong>
              <span>{policy.detail}</span>
              <em>{policy.status}</em>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="flag-grid">
        {featureFlagState.map((flag) => (
          <div className={`flag-card ${flag.enabled ? "enabled" : "disabled"}`} key={flag.key}>
            <div>
              <strong>{flag.name}</strong>
              <small>{flag.key} • {flag.rollout}</small>
            </div>
            <button onClick={() => toggleFlag(flag.key)}>{flag.enabled ? "Enabled" : "Disabled"}</button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="evz-admin-page">
      <style>{styles}</style>

      <header className="topbar">
        <div className="brand-area">
          <div className="brand-mark">EV</div>
          <div>
            <div className="eyebrow">EVzone Internal</div>
            <h1>Internal Admin Center</h1>
            <p>Internal EVzone control center for system health, editor usage, AI safety, resources, rules, logs and release management.</p>
          </div>
        </div>
        <div className="top-actions">
          <span className="internal-chip"><i />Internal Control Only</span>
          <button className="ghost-btn" data-evz-autowire="1">Refresh Admin Data</button>
          <button className="ghost-btn" data-evz-autowire="1">Export Internal Logs</button>
          <button className="primary-btn" data-evz-autowire="1">Apply Admin Changes</button>
        </div>
      </header>

      <section className="admin-hero">
        <div className="hero-card main">
          <div className="score-orb">
            <span>{healthScore}</span>
            <small>Health</small>
          </div>
          <div>
            <div className="eyebrow">EVzone internal operations</div>
            <h2>{activeSection}</h2>
            <p>System controls, policies, limits and release operations. No public creator access, no billing and no marketplace controls.</p>
          </div>
        </div>
        <div className="hero-card mini">
          <span>Warnings</span>
          <strong className="orange">{warningCount}</strong>
        </div>
        <div className="hero-card mini">
          <span>Editor sessions</span>
          <strong className="green">1,284</strong>
        </div>
        <div className="hero-card mini">
          <span>AI generations</span>
          <strong className="green">758</strong>
        </div>
        <div className="hero-card mini">
          <span>Release channel</span>
          <strong className="orange">{releaseChannel}</strong>
        </div>
      </section>

      <main className="admin-shell">
        <aside className="panel nav-panel">
          <div className="panel-head">
            <div>
              <div className="eyebrow">Admin areas</div>
              <h2>Control Sections</h2>
            </div>
          </div>
          <div className="section-list">
            {adminSections.map((section) => (
              <button key={section.key} className={activeSection === section.key ? "active" : ""} onClick={() => setActiveSection(section.key)}>
                <span>{section.icon}</span>
                <div>
                  <strong>{section.key}</strong>
                  <small>{section.caption}</small>
                </div>
              </button>
            ))}
          </div>

          <div className="scope-card">
            <strong>Internal scope</strong>
            <span>Operations</span>
            <span>Safety</span>
            <span>Rules</span>
            <span>Releases</span>
          </div>
        </aside>

        <section className="panel main-panel">
          <div className="main-top">
            <div>
              <div className="eyebrow">Admin workspace</div>
              <h2>{activeSection}</h2>
              <p>{adminSections.find((section) => section.key === activeSection)?.caption}</p>
            </div>
            <div className="main-actions">
              <button className="ghost-btn" data-evz-autowire="1">Export View</button>
              <button className="ghost-btn" data-evz-autowire="1">Refresh</button>
              <button className="primary-btn" data-evz-autowire="1">Save Admin Changes</button>
            </div>
          </div>
          {renderMainPanel()}
        </section>

        <aside className="panel right-panel">
          <div className="panel-head">
            <div>
              <div className="eyebrow">Admin summary</div>
              <h2>Operational Snapshot</h2>
            </div>
          </div>

          <div className="snapshot-preview">
            <div className="stage-grid" />
            <div className="snapshot-card">
              <div className="snapshot-top">
                <span>EVzone Admin</span>
                <strong>{activeSection}</strong>
              </div>
              <div className="snapshot-bars">
                <span style={{ width: "92%" }} />
                <span style={{ width: "78%" }} />
                <span style={{ width: "64%" }} />
                <span style={{ width: "86%" }} />
              </div>
            </div>
          </div>

          <div className="summary-list">
            <SummaryRow label="System health" value={`${healthScore}%`} tone="green" />
            <SummaryRow label="Warnings" value={`${warningCount}`} tone="orange" />
            <SummaryRow label="Crash reports" value={`${crashReports.length}`} tone="orange" />
            <SummaryRow label="AI review queue" value={`${flaggedGeneratedContent.filter((item) => item.status === "Needs review").length}`} tone="orange" />
            <SummaryRow label="Feature flags" value={`${featureFlagState.filter((flag) => flag.enabled).length}/${featureFlagState.length}`} tone="green" />
            <SummaryRow label="Asset size max" value={`${assetSizeLimit} MB`} tone="green" />
            <SummaryRow label="Texture limit" value={`${textureLimit}px`} tone="green" />
            <SummaryRow label="Marketplace" value="Not included" tone="orange" />
          </div>

          <div className="internal-note-card">
            <strong>Internal control only</strong>
            <span>This page manages platform operations, not creator authentication, billing, earnings, sales or public publishing.</span>
          </div>
        </aside>
      </main>

      <section className="panel bottom-panel">
        <div className="bottom-head">
          <div className="bottom-tabs">
            {(["Feature Flags", "Compatibility Rules", "Runtime Budgets", "Content Policy"] as BottomTab[]).map((tab) => (
              <button key={tab} className={bottomTab === tab ? "active" : ""} onClick={() => setBottomTab(tab)}>
                {tab}
              </button>
            ))}
          </div>
          <div className="bottom-actions">
            <button className="ghost-btn small" data-evz-autowire="1">Export Rules</button>
            <button className="ghost-btn small" data-evz-autowire="1">Validate Changes</button>
            <button className="primary-btn small" data-evz-autowire="1">Apply Internal Rules</button>
          </div>
        </div>
        <div className="bottom-content">
          {renderBottomContent()}
        </div>
      </section>
    </div>
  );
}

function AdminPanel({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <div className="admin-panel">
      <SectionTitle eyebrow={eyebrow} title={title} />
      {children}
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

function NumberRule({
  title,
  value,
  onChange,
  min,
  max,
  step = 1,
  suffix,
}: {
  title: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  suffix: string;
}) {
  return (
    <div className="number-rule">
      <div>
        <strong>{title}</strong>
        <span>{value} {suffix}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} />
      <div className="range"><b style={{ width: `${((value - min) / (max - min)) * 100}%` }} /></div>
    </div>
  );
}

function RuleRow({ label, value, status }: { label: string; value: string; status: string }) {
  return (
    <div className="rule-row">
      <div>
        <strong>{label}</strong>
        <small>{value}</small>
      </div>
      <em>{status}</em>
    </div>
  );
}

function RuleCard({ label, value, status }: { label: string; value: string; status: string }) {
  return (
    <div className="rule-card">
      <strong>{label}</strong>
      <span>{value}</span>
      <em>{status}</em>
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
.evz-admin-page {
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
.admin-hero {
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
.admin-hero,
.hero-card,
.main-top,
.main-actions,
.bottom-head,
.bottom-tabs,
.bottom-actions,
.summary-row,
.event-row,
.rule-row,
.connector-row,
.release-row,
.flag-card,
.health-card,
.log-toolbar,
.log-actions {
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
.health-hero-panel p,
.admin-warning span,
.internal-note-card span,
.limit-note span,
.release-hero p,
.ai-admin-hero p {
  margin-bottom: 0;
  color: var(--evz-muted);
  line-height: 1.6;
}
.top-actions { justify-content: flex-end; gap: 10px; flex-wrap: wrap; }
.internal-chip {
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
.internal-chip i {
  width: 9px;
  height: 9px;
  border-radius: 999px;
  background: var(--evz-green);
  box-shadow: 0 0 0 6px rgba(3,205,140,0.13);
}
.ghost-btn,
.primary-btn,
.section-list button,
.bottom-tabs button,
.setting-field,
.flag-card button,
.library-card button,
.release-row button,
.flagged-row button,
.report-buttons button,
.rule-card,
.health-card,
.usage-card,
.template-row,
.preset-row,
.rule-row,
.event-row,
.connector-row,
.log-row,
.release-row,
.flag-card,
.policy-card,
.ai-row,
.flagged-row {
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
.flag-card:hover,
.library-card:hover,
.release-row:hover,
.flagged-row:hover,
.health-card:hover,
.usage-card:hover,
.event-row:hover,
.log-row:hover,
.rule-card:hover,
.policy-card:hover,
.ai-row:hover {
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
.admin-hero {
  max-width: 100%;
  margin: 0 0 18px;
  border-radius: var(--radius-xl);
  padding: 18px;
  display: grid;
  grid-template-columns: 1.45fr repeat(4, minmax(135px, .3fr));
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
.score-orb {
  width: 104px;
  height: 104px;
  flex: 0 0 104px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  border: 10px solid rgba(3,205,140,0.16);
  background: var(--evz-card-solid);
}
.score-orb span {
  color: var(--evz-green);
  font-size: 32px;
  font-weight: 900;
  line-height: 1;
}
.score-orb small {
  margin-top: -20px;
  color: var(--evz-muted);
}
.small-orb {
  width: 120px;
  height: 120px;
}
.admin-shell {
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
.right-panel {
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
.section-list button > span,
.control-icon,
.release-icon {
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
.section-list button div {
  display: grid;
  gap: 4px;
}
small {
  color: var(--evz-muted);
  font-size: 12px;
  line-height: 1.45;
}
.scope-card {
  margin: 0 18px 18px;
  border: 1px solid rgba(247,127,0,0.20);
  border-radius: 22px;
  padding: 14px;
  background: var(--evz-warning-surface);
  display: grid;
  gap: 9px;
}
.scope-card strong { color: var(--evz-orange); }
.scope-card span {
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
.admin-panel {
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
.health-hero-panel,
.ai-admin-hero,
.release-hero {
  border: 1px solid var(--evz-soft-line);
  border-radius: 24px;
  background:
    radial-gradient(circle at 20% 20%, rgba(3,205,140,0.14), transparent 34%),
    var(--evz-card);
  padding: 18px;
  display: grid;
  grid-template-columns: 130px 1fr;
  gap: 18px;
  align-items: center;
}
.ai-admin-hero,
.release-hero {
  grid-template-columns: 1fr 260px;
}
.health-hero-panel h3,
.ai-admin-hero h3,
.release-hero h3 {
  font-size: 26px;
  letter-spacing: -0.035em;
  margin-bottom: 8px;
}
.health-grid,
.usage-grid,
.rules-grid,
.library-summary-grid,
.mini-stat-grid,
.flag-grid,
.bottom-rule-grid,
.policy-grid,
.release-list,
.report-grid {
  display: grid;
  gap: 12px;
}
.health-grid {
  grid-template-columns: repeat(3, minmax(0,1fr));
}
.health-card {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 10px;
  cursor: default;
}
.health-card div {
  display: grid;
  gap: 4px;
}
.health-card em {
  color: var(--evz-green);
  font-style: normal;
  font-size: 12px;
  font-weight: 900;
}
.health-card.watch em,
.health-card.warning em {
  color: var(--evz-orange);
}
.admin-warning,
.internal-note-card,
.limit-note {
  border: 1px solid rgba(247,127,0,0.20);
  border-radius: 22px;
  padding: 14px;
  background: var(--evz-warning-surface);
  display: grid;
  gap: 7px;
}
.admin-warning strong,
.internal-note-card strong,
.limit-note strong {
  color: var(--evz-orange);
}
.usage-grid {
  grid-template-columns: repeat(3, minmax(0,1fr));
}
.usage-card {
  display: grid;
  gap: 7px;
  cursor: default;
}
.usage-card span {
  color: var(--evz-muted);
  font-size: 12px;
}
.usage-card strong {
  color: var(--evz-green);
  font-size: 26px;
}
.usage-card em {
  color: var(--evz-orange);
  font-size: 12px;
  font-style: normal;
  font-weight: 900;
}
.dual-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}
.sub-panel {
  border: 1px solid var(--evz-soft-line);
  border-radius: 24px;
  background: var(--evz-card);
  padding: 14px;
  display: grid;
  gap: 10px;
}
.event-row {
  display: grid;
  grid-template-columns: 88px 1fr auto;
  gap: 10px;
  cursor: default;
}
.event-row > span {
  color: var(--evz-muted);
  font-size: 12px;
}
.event-row div {
  display: grid;
  gap: 4px;
}
.event-row em {
  color: var(--evz-green);
  font-size: 12px;
  font-style: normal;
}
.event-row.warning em {
  color: var(--evz-orange);
}
.stability-score {
  display: grid;
  justify-items: center;
  gap: 12px;
  text-align: center;
}
.stability-score p {
  color: var(--evz-muted);
  line-height: 1.5;
}
.mini-stat-grid {
  grid-template-columns: repeat(2, minmax(0,1fr));
}
.mini-stat-grid div {
  border: 1px solid var(--evz-soft-line);
  border-radius: 14px;
  padding: 12px;
  background: var(--evz-card-solid);
  display: grid;
  gap: 5px;
}
.mini-stat-grid span {
  color: var(--evz-muted);
  font-size: 12px;
}
.mini-stat-grid strong {
  color: var(--evz-green);
}
.setting-field {
  display: grid;
  gap: 8px;
  cursor: default;
}
.setting-field span {
  color: var(--evz-muted);
  font-size: 12px;
  font-weight: 900;
}
.setting-field select {
  width: 100%;
  border: 1px solid var(--evz-line);
  border-radius: 12px;
  background: var(--evz-card-solid);
  padding: 10px;
  color: var(--evz-ink);
  font-weight: 800;
}
.ai-row,
.flagged-row,
.template-row,
.preset-row,
.rule-row,
.connector-row,
.release-row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 10px;
  align-items: center;
}
.flagged-row {
  grid-template-columns: 1fr auto auto;
}
.ai-row div,
.flagged-row div,
.template-row div,
.preset-row div,
.rule-row div,
.connector-row div,
.release-row div {
  display: grid;
  gap: 4px;
}
.ai-row em,
.flagged-row em,
.template-row em,
.preset-row em,
.rule-row em,
.connector-row em,
.release-row em {
  color: var(--evz-green);
  font-size: 12px;
  font-style: normal;
  font-weight: 900;
}
.ai-row.watch em,
.flagged-row.warning em,
.connector-row.recovered em {
  color: var(--evz-orange);
}
.flagged-row button,
.library-card button,
.release-row button,
.flag-card button {
  border: 0;
  border-radius: 12px;
  padding: 8px 10px;
  color: var(--evz-muted);
  background: rgba(148,163,184,0.10);
  font-weight: 900;
  cursor: pointer;
}
.library-summary-grid {
  grid-template-columns: repeat(3, minmax(0,1fr));
}
.library-card {
  border: 1px solid var(--evz-soft-line);
  border-radius: 18px;
  background: var(--evz-card-solid);
  padding: 14px;
  display: grid;
  gap: 8px;
}
.library-card span {
  color: var(--evz-muted);
  font-size: 12px;
}
.library-card strong {
  color: var(--evz-green);
  font-size: 28px;
}
.library-card em {
  color: var(--evz-green);
  font-size: 12px;
  font-style: normal;
}
.library-card.watch em {
  color: var(--evz-orange);
}
.rules-grid {
  grid-template-columns: repeat(3, minmax(0,1fr));
}
.number-rule {
  border: 1px solid var(--evz-soft-line);
  border-radius: 18px;
  background: var(--evz-card-solid);
  padding: 14px;
  display: grid;
  gap: 10px;
}
.number-rule div:first-child {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.number-rule span {
  color: var(--evz-green);
  font-weight: 900;
}
.number-rule input {
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
.log-toolbar {
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}
.log-actions {
  gap: 8px;
  flex-wrap: wrap;
}
.log-list {
  display: grid;
  gap: 10px;
}
.log-row {
  display: grid;
  grid-template-columns: 70px 74px 1fr;
  gap: 10px;
}
.log-row > span {
  color: var(--evz-muted);
  font-size: 12px;
}
.log-row em {
  color: var(--evz-green);
  font-size: 12px;
  font-style: normal;
  font-weight: 900;
}
.log-row.warning em {
  color: var(--evz-orange);
}
.connector-row {
  grid-template-columns: 78px 1fr auto;
}
.release-list {
  grid-template-columns: 1fr;
}
.release-row {
  grid-template-columns: 42px 1fr auto auto;
}
.snapshot-preview {
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
.snapshot-card {
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
.snapshot-top {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}
.snapshot-top span {
  color: var(--evz-muted);
  font-size: 12px;
  font-weight: 900;
}
.snapshot-top strong {
  color: var(--evz-green);
  font-size: 12px;
}
.snapshot-bars {
  display: grid;
  align-content: center;
  gap: 12px;
}
.snapshot-bars span {
  height: 14px;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--evz-green), var(--evz-orange));
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
.internal-note-card {
  margin: 16px 18px 18px;
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
.flag-grid {
  grid-template-columns: repeat(5, minmax(0,1fr));
}
.flag-card {
  display: grid;
  gap: 10px;
}
.flag-card div {
  display: grid;
  gap: 4px;
}
.flag-card button {
  color: var(--evz-green);
  background: rgba(3,205,140,0.10);
}
.flag-card.disabled button {
  color: var(--evz-orange);
  background: rgba(247,127,0,0.10);
}
.bottom-rule-grid {
  grid-template-columns: repeat(5, minmax(0,1fr));
}
.rule-card {
  display: grid;
  gap: 8px;
  cursor: default;
}
.rule-card span {
  color: var(--evz-muted);
  line-height: 1.45;
}
.rule-card em {
  color: var(--evz-green);
  font-style: normal;
  font-weight: 900;
  font-size: 12px;
}
.policy-grid {
  grid-template-columns: repeat(5, minmax(0,1fr));
}
.policy-card {
  display: grid;
  gap: 8px;
}
.policy-card span {
  color: var(--evz-muted);
  line-height: 1.45;
}
.policy-card em {
  color: var(--evz-green);
  font-style: normal;
  font-size: 12px;
  font-weight: 900;
}
@media (max-width: 1500px) {
  .admin-hero,
  .admin-shell {
    grid-template-columns: 320px 1fr;
  }
  .hero-card.main {
    grid-column: span 2;
  }
  .right-panel {
    grid-column: span 2;
    min-height: auto;
  }
  .flag-grid,
  .bottom-rule-grid,
  .policy-grid,
  .health-grid,
  .usage-grid,
  .rules-grid,
  .library-summary-grid {
    grid-template-columns: repeat(2, minmax(0,1fr));
  }
}
@media (max-width: 1050px) {
  .topbar {
    flex-direction: column;
    align-items: flex-start;
  }
  .admin-hero,
  .admin-shell {
    grid-template-columns: 1fr;
  }
  .hero-card.main,
  .right-panel {
    grid-column: auto;
  }
  .dual-grid,
  .health-hero-panel,
  .ai-admin-hero,
  .release-hero {
    grid-template-columns: 1fr;
  }
  .flag-grid,
  .bottom-rule-grid,
  .policy-grid,
  .health-grid,
  .usage-grid,
  .rules-grid,
  .library-summary-grid {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 700px) {
  .evz-admin-page {
    padding: 14px;
  }
  .top-actions > *,
  .main-actions > *,
  .log-actions > * {
    width: 100%;
    justify-content: center;
  }
  .hero-card,
  .main-top,
  .bottom-head,
  .log-toolbar {
    flex-direction: column;
    align-items: flex-start;
  }
  .event-row,
  .log-row,
  .connector-row,
  .release-row {
    grid-template-columns: 1fr;
  }
}
`;
