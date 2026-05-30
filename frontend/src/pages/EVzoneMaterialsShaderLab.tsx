import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

type LeftTab = "Presets" | "Textures" | "Materials" | "AI Results";
type RightTab = "PBR Controls" | "Skin / Makeup" | "Blend & Output" | "AI Generator";
type BottomTab = "LUT & Color" | "Texture Compression" | "Performance";

const presets = [
  { name: "Broadcast Skin Soft", type: "Skin", score: 98, tone: "green" },
  { name: "Hologram Glass", type: "Hologram", score: 91, tone: "green" },
  { name: "Neon Pulse Edge", type: "Neon", score: 88, tone: "orange" },
  { name: "Luxury Chrome Gold", type: "Metal", score: 85, tone: "orange" },
  { name: "Face Occlusion Matte", type: "Occlusion", score: 97, tone: "green" },
  { name: "Makeup Velvet Blend", type: "Makeup", score: 94, tone: "green" },
  { name: "Studio Glass Refraction", type: "Glass", score: 82, tone: "orange" },
  { name: "Clean Broadcast LUT", type: "Color", score: 99, tone: "green" },
];

const textures = [
  { name: "skin_soft_albedo.png", type: "Albedo", size: "1024²", status: "Compressed" },
  { name: "makeup_mask_lips.png", type: "Mask", size: "512²", status: "Ready" },
  { name: "hologram_noise.ktx2", type: "Noise", size: "512²", status: "GPU Ready" },
  { name: "chrome_reflection.hdr", type: "HDRI", size: "2K", status: "Warning" },
  { name: "face_occlusion_depth.png", type: "Depth", size: "1024²", status: "Ready" },
  { name: "neon_emission_map.png", type: "Emission", size: "1024²", status: "Ready" },
];

const materials = [
  { name: "EVZ_BroadcastSkin", slots: 6, target: "Face mesh" },
  { name: "EVZ_HologramGlass", slots: 8, target: "AR prop" },
  { name: "EVZ_NeonPulse", slots: 7, target: "Overlay edge" },
  { name: "EVZ_FaceOcclusion", slots: 4, target: "Occluder" },
  { name: "EVZ_LuxuryChrome", slots: 9, target: "3D title" },
];

const aiResults = [
  { name: "AI Neon Emerald Glass", prompt: "premium neon material for live studio graphics" },
  { name: "AI Soft Skin Gold", prompt: "natural skin material with subtle warm glow" },
  { name: "AI Hologram Stage", prompt: "transparent hologram material with scanlines" },
];

const shaderNodes = [
  { id: "n1", title: "Base Texture", type: "Texture Sample", x: 8, y: 20, tone: "green" },
  { id: "n2", title: "Makeup Mask", type: "Texture Mask", x: 8, y: 52, tone: "orange" },
  { id: "n3", title: "PBR Mix", type: "Material Core", x: 33, y: 30, tone: "green" },
  { id: "n4", title: "Emission Glow", type: "Glow", x: 54, y: 12, tone: "orange" },
  { id: "n5", title: "Refraction / Glass", type: "Optics", x: 54, y: 43, tone: "gray" },
  { id: "n6", title: "Face Occlusion", type: "AR Safety", x: 53, y: 70, tone: "green" },
  { id: "n7", title: "Studio Output", type: "Material Output", x: 78, y: 38, tone: "orange" },
];

const textureSlots = [
  ["Albedo", "skin_soft_albedo.png", "Ready"],
  ["Normal", "soft_skin_normal.ktx2", "Ready"],
  ["Roughness", "skin_roughness.png", "Compressed"],
  ["Metalness", "none", "Empty"],
  ["Emission", "neon_emission_map.png", "Ready"],
  ["Occlusion", "face_occlusion_depth.png", "Ready"],
];

const blendModes = ["Normal", "Multiply", "Screen", "Overlay", "Additive", "Soft Light", "Linear Dodge"];

export default function EVzoneMaterialsShaderLab() {
  const [leftTab, setLeftTab] = useState<LeftTab>("Presets");
  const [rightTab, setRightTab] = useState<RightTab>("PBR Controls");
  const [bottomTab, setBottomTab] = useState<BottomTab>("LUT & Color");
  const [activePreset, setActivePreset] = useState(presets[0]);
  const [selectedNode, setSelectedNode] = useState(shaderNodes[2]);
  const [previewMode, setPreviewMode] = useState<"Sphere" | "Face" | "Overlay" | "Prop">("Face");
  const [aiPrompt, setAiPrompt] = useState(
    "Create a premium studio-safe hologram glass material with subtle EVzone green glow, low GPU cost, and soft orange rim light."
  );
  const [values, setValues] = useState({
    opacity: 82,
    roughness: 46,
    metalness: 18,
    emission: 64,
    refraction: 32,
    glow: 58,
    skinSmooth: 56,
    makeupBlend: 48,
    occlusion: 72,
  });
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraFacing, setCameraFacing] = useState<"user" | "environment">("user");
  const [cameraError, setCameraError] = useState<string | null>(null);
  const previewVideoRef = useRef<HTMLVideoElement | null>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);

  const materialStats = useMemo(
    () => [
      { label: "GPU Cost", value: "Low", tone: "green" },
      { label: "Texture Memory", value: "23 MB", tone: "green" },
      { label: "Draw Calls", value: "4", tone: "green" },
      { label: "Warning", value: "1", tone: "orange" },
    ],
    []
  );

  const updateValue = (key: keyof typeof values, value: number) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const stopCamera = useCallback(() => {
    cameraStreamRef.current?.getTracks().forEach((track) => track.stop());
    cameraStreamRef.current = null;
    if (previewVideoRef.current) {
      previewVideoRef.current.srcObject = null;
    }
    setCameraActive(false);
  }, []);

  const resolveCameraErrorMessage = useCallback((error: unknown) => {
    if (!window.isSecureContext) {
      return "Camera needs a secure origin. Open this app on https:// or http://localhost.";
    }
    if (error instanceof DOMException) {
      if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
        return "Camera permission was blocked. Allow camera access in browser site settings.";
      }
      if (error.name === "NotFoundError" || error.name === "DevicesNotFoundError") {
        return "No camera device was found.";
      }
      if (error.name === "NotReadableError" || error.name === "TrackStartError") {
        return "Camera is busy in another app or tab.";
      }
    }
    return "Camera could not start. Check permissions and camera availability.";
  }, []);

  const startCamera = useCallback(
    async (facing: "user" | "environment" = cameraFacing) => {
      if (!navigator.mediaDevices?.getUserMedia) {
        setCameraError("Camera is unavailable in this browser context.");
        setCameraActive(false);
        return;
      }

      try {
        setCameraError(null);
        setCameraFacing(facing);
        cameraStreamRef.current?.getTracks().forEach((track) => track.stop());

        let stream: MediaStream;
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: facing, width: { ideal: 1920 }, height: { ideal: 1080 } },
            audio: false,
          });
        } catch {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { width: { ideal: 1280 }, height: { ideal: 720 } },
            audio: false,
          });
        }

        cameraStreamRef.current = stream;
        if (previewVideoRef.current) {
          previewVideoRef.current.srcObject = stream;
          const playPromise = previewVideoRef.current.play();
          if (playPromise) {
            await playPromise.catch(() => undefined);
          }
        }
        setCameraActive(true);
      } catch (error) {
        stopCamera();
        setCameraError(resolveCameraErrorMessage(error));
      }
    },
    [cameraFacing, resolveCameraErrorMessage, stopCamera],
  );

  useEffect(() => {
    void startCamera();
    return () => {
      stopCamera();
    };
  }, [startCamera, stopCamera]);

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
    if (leftTab === "Presets") {
      return (
        <div className="panel-scroll">
          {presets.map((preset) => (
            <button
              key={preset.name}
              className={`preset-card ${activePreset.name === preset.name ? "active" : ""}`}
              onClick={() => setActivePreset(preset)}
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

    if (leftTab === "Textures") {
      return (
        <div className="panel-scroll">
          {textures.map((texture) => (
            <div className={`texture-card ${texture.status === "Warning" ? "warning" : ""}`} key={texture.name}>
              <span className="texture-icon">TX</span>
              <div>
                <strong>{texture.name}</strong>
                <small>{texture.type} • {texture.size}</small>
              </div>
              <em>{texture.status}</em>
            </div>
          ))}
          <button className="primary-btn full" data-evz-autowire="1">Assign Texture</button>
        </div>
      );
    }

    if (leftTab === "Materials") {
      return (
        <div className="panel-scroll">
          {materials.map((material) => (
            <button className="material-card" key={material.name} data-evz-autowire="1">
              <span className="material-preview" />
              <strong>{material.name}</strong>
              <small>{material.slots} slots • Target: {material.target}</small>
            </button>
          ))}
          <button className="ghost-btn full" data-evz-autowire="1">Create Material</button>
        </div>
      );
    }

    return (
      <div className="panel-scroll">
        {aiResults.map((result) => (
          <button className="ai-result-card" key={result.name} data-evz-autowire="1">
            <span className="ai-result-art" />
            <strong>{result.name}</strong>
            <small>{result.prompt}</small>
          </button>
        ))}
        <button className="primary-btn full" data-evz-autowire="1">Generate New Material</button>
      </div>
    );
  };

  const renderRightContent = () => {
    if (rightTab === "PBR Controls") {
      return (
        <div className="panel-scroll">
          <SectionTitle eyebrow="Material editor" title="PBR Material Controls" />
          {renderSlider("opacity", "Opacity", "Transparent, glass, overlay and face-safe blending")}
          {renderSlider("roughness", "Roughness", "Controls highlight softness and broadcast reflection")}
          {renderSlider("metalness", "Metalness", "For chrome, gold, product and title materials")}
          {renderSlider("emission", "Emission / Glow", "Neon, hologram and reactive light output")}
          {renderSlider("refraction", "Refraction / Glass", "Optical distortion and glass strength")}
          <div className="blend-card">
            <strong>Blend Mode</strong>
            <select>
              {blendModes.map((mode) => <option key={mode}>{mode}</option>)}
            </select>
          </div>
        </div>
      );
    }

    if (rightTab === "Skin / Makeup") {
      return (
        <div className="panel-scroll">
          <SectionTitle eyebrow="Face-safe material" title="Skin, Makeup & Occlusion" />
          {renderSlider("skinSmooth", "Skin Material Smoothness", "Keeps detail while softening harsh texture")}
          {renderSlider("makeupBlend", "Makeup Blend", "Lip, blush, contour, freckles and eye shadow blending")}
          {renderSlider("occlusion", "Face Occlusion Strength", "Keeps AR props behind face landmarks when needed")}
          <div className="skin-grid">
            {["Lip mask", "Blush mask", "Eye shadow", "Freckles", "Face mesh", "Occlusion matte"].map((item) => (
              <button key={item} data-evz-autowire="1">{item}</button>
            ))}
          </div>
          <div className="warning-card green">
            <strong>Face-safe result</strong>
            <span>Beauty and makeup controls remain within broadcast-safe live limits.</span>
          </div>
        </div>
      );
    }

    if (rightTab === "Blend & Output") {
      return (
        <div className="panel-scroll">
          <SectionTitle eyebrow="Output controls" title="Texture Assignment & Studio Output" />
          <div className="texture-slot-list">
            {textureSlots.map(([slot, file, status]) => (
              <div className="slot-row" key={slot}>
                <span>{slot}</span>
                <strong>{file}</strong>
                <em className={status === "Empty" ? "empty" : ""}>{status}</em>
              </div>
            ))}
          </div>
          <div className="output-card">
            <div>
              <strong>Output Target</strong>
              <span>Face Mesh + Studio Overlay</span>
            </div>
            <div>
              <strong>Color Space</strong>
              <span>sRGB / Broadcast Preview</span>
            </div>
            <div>
              <strong>Runtime Fallback</strong>
              <span>Disable refraction, keep albedo + occlusion</span>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="panel-scroll">
        <SectionTitle eyebrow="AI material generator" title="Generate Premium Materials" />
        <textarea className="ai-prompt" value={aiPrompt} onChange={(event) => setAiPrompt(event.target.value)} />
        <div className="ai-actions">
          <button data-evz-autowire="1">Generate material</button>
          <button data-evz-autowire="1">Generate texture set</button>
          <button data-evz-autowire="1">Optimize material</button>
          <button data-evz-autowire="1">Make live-safe</button>
        </div>
        <div className="ai-plan">
          <strong>AI generation plan</strong>
          <p>
            Creates albedo, roughness, emission, and mask textures, builds a shader graph, applies EVzone glow accents,
            then runs texture compression and studio performance checks.
          </p>
        </div>
      </div>
    );
  };

  const renderBottomContent = () => {
    if (bottomTab === "Texture Compression") {
      return (
        <div className="compression-grid">
          {[
            ["Albedo", "PNG → KTX2", "74% smaller", 74],
            ["Normal", "PNG → Basis", "68% smaller", 68],
            ["Emission", "PNG → KTX2", "61% smaller", 61],
            ["HDRI", "HDR → compressed", "42% smaller", 42],
          ].map(([name, mode, result, score]) => (
            <div className="compression-card" key={name}>
              <div>
                <strong>{name}</strong>
                <small>{mode}</small>
              </div>
              <span>{result}</span>
              <div className="range"><b style={{ width: `${score}%` }} /></div>
            </div>
          ))}
          <div className="compression-preview">
            <div className="before-after">
              <span>Before 68 MB</span>
              <span>After 23 MB</span>
            </div>
            <strong>Texture compression preview</strong>
            <small>Preview compressed material quality before exporting to EVzone Studio.</small>
          </div>
        </div>
      );
    }

    if (bottomTab === "Performance") {
      return (
        <div className="performance-grid">
          {[
            ["Shader complexity", "Medium", 72, "orange"],
            ["Texture memory", "Healthy", 61, "green"],
            ["Draw calls", "Excellent", 36, "green"],
            ["Transparency cost", "Watch", 79, "orange"],
            ["Live-safe score", "92%", 92, "green"],
          ].map(([label, value, score, tone]) => (
            <div className={`perf-card ${tone}`} key={label}>
              <div>
                <strong>{label}</strong>
                <small>{value}</small>
              </div>
              <div className="range"><b style={{ width: `${score}%` }} /></div>
            </div>
          ))}
          <div className="material-warning">
            <strong>Material performance warning</strong>
            <p>Glass refraction and additive glow are close to the live transparency limit. EVzone can auto-disable refraction on lower-end devices.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="lut-grid">
        <div className="lut-preview-card">
          <div className="lut-strip">
            <span style={{ background: "#03cd8c" }} />
            <span style={{ background: "#f77f00" }} />
            <span style={{ background: "#a6a6a6" }} />
            <span style={{ background: "var(--evz-card-solid)" }} />
          </div>
          <strong>EVzone Broadcast Clean LUT</strong>
          <small>Balanced colour grading for studio-safe skin, neon, glass, and overlay materials.</small>
        </div>
        {[
          ["Exposure", 52],
          ["Contrast", 58],
          ["Saturation", 46],
          ["Warmth", 41],
          ["Green accent", 64],
          ["Orange rim", 37],
        ].map(([label, score]) => (
          <div className="lut-control" key={label}>
            <div>
              <strong>{label}</strong>
              <span>{score}%</span>
            </div>
            <div className="range"><b style={{ width: `${score}%` }} /></div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="evz-materials-page">
      <style>{styles}</style>

      <header className="topbar">
        <div className="brand-area">
          <div className="brand-mark">EV</div>
          <div>
            <div className="eyebrow">EVzone Effect Creator</div>
            <h1>Materials & Shader Lab</h1>
            <p>Premium visual look development with node-based materials, PBR controls, texture assignment, shader graphs, AI generation, and live-safe studio output.</p>
          </div>
        </div>
        <div className="top-actions">
          <span className="studio-chip"><i />Connected to EVzone Studio</span>
          <button className="ghost-btn" data-evz-autowire="1">Save Material</button>
          <button className="ghost-btn" data-evz-autowire="1">Preview in EVzone</button>
          <button className="primary-btn" data-evz-autowire="1">Apply to Editor</button>
        </div>
      </header>

      <main className="materials-shell">
        <aside className="panel left-panel">
          <div className="panel-head">
            <div>
              <div className="eyebrow">Library</div>
              <h2>Material Assets</h2>
            </div>
          </div>
          <div className="tab-grid">
            {(["Presets", "Textures", "Materials", "AI Results"] as LeftTab[]).map((tab) => (
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
              <div className="eyebrow">Active material</div>
              <h2>{activePreset.name}</h2>
              <p>{activePreset.type} material • broadcast-ready shader graph • EVzone live-safe preview.</p>
            </div>
            <div className="preview-tabs">
              {(["Sphere", "Face", "Overlay", "Prop"] as const).map((mode) => (
                <button key={mode} className={previewMode === mode ? "active" : ""} onClick={() => setPreviewMode(mode)}>
                  {mode}
                </button>
              ))}
            </div>
          </div>

          <div className="material-preview-stage">
            <div className="stage-grid" />
            <video
              ref={previewVideoRef}
              muted
              playsInline
              autoPlay
              className={`lab-camera-feed ${cameraActive ? "live" : ""} ${cameraFacing === "user" ? "mirror" : ""}`}
            />
            {!cameraActive ? (
              <div className="lab-camera-placeholder">
                <strong>{cameraError ? "Camera unavailable" : "Starting camera..."}</strong>
                <span>Allow browser camera permission to view live material output.</span>
                <button type="button" className="camera-control-btn active" onClick={() => void startCamera()}>
                  Retry Camera
                </button>
              </div>
            ) : null}
            <div className={`preview-object ${previewMode.toLowerCase()}`}>
              <div className="material-glow" />
              <div className="material-face">
                <span className="face-eye left" />
                <span className="face-eye right" />
                <span className="face-lip" />
                <span className="makeup-blush left" />
                <span className="makeup-blush right" />
              </div>
              <div className="hologram-lines">
                {Array.from({ length: 8 }).map((_, index) => <span key={index} />)}
              </div>
            </div>

            <div className="preview-card top-left">
              <strong>Preview Mode</strong>
              <span>{previewMode} • PBR + LUT + occlusion enabled</span>
            </div>
            <div className="preview-card top-right camera-controls">
              <button
                type="button"
                className={`camera-control-btn ${cameraActive ? "active" : ""}`}
                onClick={() => (cameraActive ? stopCamera() : void startCamera())}
              >
                {cameraActive ? "Stop Camera" : "Open Camera"}
              </button>
              <button
                type="button"
                className="camera-control-btn"
                onClick={() => void startCamera(cameraFacing === "user" ? "environment" : "user")}
              >
                Flip Camera
              </button>
            </div>
            <div className="preview-card bottom-left">
              {materialStats.map((stat) => (
                <div key={stat.label}>
                  <span>{stat.label}</span>
                  <strong className={stat.tone}>{stat.value}</strong>
                </div>
              ))}
            </div>
            {cameraError ? <div className="lab-camera-error">{cameraError}</div> : null}
          </div>

          <div className="shader-graph">
            <div className="graph-head">
              <div>
                <div className="eyebrow">Shader graph</div>
                <h3>Node-Based Material Workflow</h3>
              </div>
              <span className="live-safe">Live-safe graph</span>
            </div>

            <div className="graph-canvas">
              <svg className="connections" viewBox="0 0 1000 420" preserveAspectRatio="none">
                <path d="M130 110 C250 90 270 135 370 160" />
                <path d="M130 250 C250 270 270 220 370 185" />
                <path className="active" d="M430 170 C520 120 590 95 650 90" />
                <path d="M430 185 C520 205 590 210 650 215" />
                <path className="active orange" d="M430 205 C525 290 590 315 650 330" />
                <path className="active" d="M735 110 C820 145 850 170 910 195" />
                <path d="M735 225 C820 215 850 205 910 202" />
                <path d="M735 335 C820 290 850 240 910 215" />
              </svg>
              <div className="canvas-grid" />
              {shaderNodes.map((node) => (
                <button
                  key={node.id}
                  className={`shader-node ${node.tone} ${selectedNode.id === node.id ? "selected" : ""}`}
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
                <small>Output validated for EVzone Studio runtime.</small>
              </div>
            </div>
          </div>
        </section>

        <aside className="panel right-panel">
          <div className="right-tabs">
            {(["PBR Controls", "Skin / Makeup", "Blend & Output", "AI Generator"] as RightTab[]).map((tab) => (
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
            {(["LUT & Color", "Texture Compression", "Performance"] as BottomTab[]).map((tab) => (
              <button key={tab} className={`tab-btn ${bottomTab === tab ? "active" : ""}`} onClick={() => setBottomTab(tab)}>
                {tab}
              </button>
            ))}
          </div>
          <div className="bottom-actions">
            <button className="ghost-btn small" data-evz-autowire="1">Reset Look</button>
            <button className="ghost-btn small" data-evz-autowire="1">Create Preset</button>
            <button className="primary-btn small" data-evz-autowire="1">Run Material Check</button>
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
.evz-materials-page {
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
.blend-card,
.package-row,
.meter-row {
  display: flex;
  align-items: center;
}
.brand-area { gap: 16px; max-width: 950px; }
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
.texture-card,
.material-card,
.ai-result-card,
.preview-tabs button,
.api-btn,
.skin-grid button,
.ai-actions button {
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
.material-card:hover,
.ai-result-card:hover,
.preview-tabs button:hover,
.skin-grid button:hover,
.ai-actions button:hover {
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
.materials-shell {
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
  min-height: 860px;
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
.preview-tabs button.active {
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
.material-preview,
.ai-result-art {
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
.texture-card {
  display: grid;
  grid-template-columns: 42px 1fr auto;
  gap: 10px;
  align-items: center;
  text-align: left;
}
.texture-card.warning {
  border-color: rgba(247,127,0,0.28);
  background: var(--evz-warning-surface);
}
.texture-icon {
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
.texture-card div,
.material-card,
.ai-result-card {
  display: grid;
  gap: 4px;
}
.texture-card em {
  color: var(--evz-green);
  font-size: 11px;
  font-style: normal;
  font-weight: 900;
}
.texture-card.warning em { color: var(--evz-orange); }
.material-card,
.ai-result-card {
  width: 100%;
  text-align: left;
}
.material-preview,
.ai-result-art {
  height: 76px;
}
.center-panel {
  display: grid;
  grid-template-rows: auto 430px 1fr;
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
.material-preview-stage {
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
.material-preview-stage > .stage-grid { z-index: 1; }
.lab-camera-feed {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  z-index: 0;
  transition: opacity 220ms ease;
  filter: contrast(1.07) saturate(1.08);
}
.lab-camera-feed.live { opacity: 1; }
.lab-camera-feed.mirror { transform: scaleX(-1); }
.lab-camera-placeholder {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: grid;
  place-content: center;
  justify-items: center;
  gap: 10px;
  padding: 20px;
  text-align: center;
  background: linear-gradient(160deg, rgba(15, 23, 42, 0.72), rgba(15, 23, 42, 0.34));
}
.lab-camera-placeholder strong {
  font-size: 18px;
  letter-spacing: 0.02em;
}
.lab-camera-placeholder span {
  max-width: 320px;
  color: rgba(226, 232, 240, 0.86);
  font-size: 13px;
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
.preview-object {
  position: absolute;
  left: 50%;
  top: 52%;
  width: 260px;
  height: 260px;
  transform: translate(-50%, -50%);
  border-radius: 999px;
  background:
    radial-gradient(circle at 32% 24%, var(--evz-frost-strong), transparent 16%),
    radial-gradient(circle at 60% 72%, rgba(3,205,140,0.42), transparent 34%),
    radial-gradient(circle at 74% 28%, rgba(247,127,0,0.48), transparent 30%),
    linear-gradient(135deg, rgba(3,205,140,0.24), rgba(247,127,0,0.24));
  box-shadow:
    0 38px 80px rgba(15,23,42,0.18),
    inset 0 0 45px var(--evz-frost-soft);
  overflow: hidden;
  z-index: 3;
}
.preview-object.face {
  width: 220px;
  height: 280px;
  border-radius: 48% 52% 46% 54%;
}
.preview-object.overlay {
  width: 430px;
  height: 150px;
  border-radius: 36px;
}
.preview-object.prop {
  width: 250px;
  height: 250px;
  border-radius: 42px;
  transform: translate(-50%, -50%) rotate(12deg);
}
.material-glow {
  position: absolute;
  inset: -20px;
  background: radial-gradient(circle, rgba(3,205,140,0.22), transparent 60%);
  animation: pulseGlow 3s ease-in-out infinite;
}
@keyframes pulseGlow {
  0%, 100% { opacity: 0.55; }
  50% { opacity: 1; }
}
.material-face {
  position: absolute;
  inset: 42px 54px 54px;
  border-radius: inherit;
  background: linear-gradient(180deg, rgba(255,238,222,0.65), rgba(247,127,0,0.08));
  opacity: 0.75;
}
.face-eye {
  position: absolute;
  top: 74px;
  width: 18px;
  height: 18px;
  border-radius: 999px;
  background: rgba(15,23,42,0.75);
}
.face-eye.left { left: 42px; }
.face-eye.right { right: 42px; }
.face-lip {
  position: absolute;
  left: 50%;
  bottom: 62px;
  width: 50px;
  height: 16px;
  transform: translateX(-50%);
  border-radius: 999px;
  background: rgba(247,127,0,0.44);
}
.makeup-blush {
  position: absolute;
  top: 112px;
  width: 36px;
  height: 18px;
  border-radius: 999px;
  background: rgba(247,127,0,0.18);
}
.makeup-blush.left { left: 28px; }
.makeup-blush.right { right: 28px; }
.hologram-lines {
  position: absolute;
  inset: 0;
  display: grid;
  gap: 18px;
  padding: 22px 0;
  transform: rotate(-12deg);
  opacity: 0.28;
}
.hologram-lines span {
  height: 2px;
  background: var(--evz-card);
}
.preview-card {
  position: absolute;
  border-radius: 18px;
  padding: 13px 15px;
  background: var(--evz-card);
  border: 1px solid var(--evz-border);
  backdrop-filter: blur(16px);
  box-shadow: 0 14px 26px rgba(15,23,42,0.09);
  z-index: 8;
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
.preview-card.top-right {
  right: 22px;
  top: 22px;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  max-width: min(380px, calc(100% - 32px));
}
.camera-control-btn {
  border: 1px solid var(--evz-line);
  border-radius: 12px;
  background: var(--evz-card-solid);
  color: var(--evz-ink);
  font-weight: 800;
  padding: 8px 10px;
  font-size: 12px;
  cursor: pointer;
  transition: 180ms ease;
}
.camera-control-btn:hover { transform: translateY(-1px); }
.camera-control-btn.active {
  color: white;
  border-color: transparent;
  background: linear-gradient(135deg, var(--evz-green), #10b981);
  box-shadow: 0 10px 20px rgba(3,205,140,0.22);
}
.preview-card.bottom-left {
  left: 22px;
  bottom: 22px;
  display: grid;
  grid-template-columns: repeat(4, minmax(72px, 1fr));
  gap: 12px;
}
.preview-card.bottom-left div {
  display: grid;
  gap: 4px;
}
.preview-card.bottom-left span {
  color: var(--evz-muted);
  font-size: 11px;
}
.preview-card strong.green,
.preview-card .green { color: var(--evz-green); }
.preview-card strong.orange,
.preview-card .orange { color: var(--evz-orange); }
.lab-camera-error {
  position: absolute;
  left: 22px;
  right: 22px;
  bottom: 18px;
  z-index: 9;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid rgba(248, 113, 113, 0.45);
  background: rgba(127, 29, 29, 0.82);
  color: #fef2f2;
  font-size: 12px;
  font-weight: 700;
}
.shader-graph {
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
.graph-head h3 {
  margin: 4px 0 0;
}
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
@keyframes dash {
  to { stroke-dashoffset: -36; }
}
.shader-node {
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
.shader-node.selected {
  border-color: rgba(3,205,140,0.55);
  outline: 4px solid rgba(3,205,140,0.16);
}
.shader-node.green { border-top: 5px solid var(--evz-green); }
.shader-node.orange { border-top: 5px solid var(--evz-orange); }
.shader-node.gray { border-top: 5px solid var(--evz-medium); }
.shader-node span {
  width: fit-content;
  border-radius: 999px;
  padding: 5px 7px;
  color: var(--evz-muted);
  background: rgba(148,163,184,0.11);
  font-size: 10px;
  font-weight: 900;
}
.shader-node i {
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
.blend-card,
.warning-card,
.slot-row,
.output-card,
.ai-plan,
.compression-card,
.compression-preview,
.lut-preview-card,
.lut-control,
.perf-card,
.material-warning {
  border: 1px solid var(--evz-soft-line);
  border-radius: 18px;
  background: var(--evz-card-solid);
  padding: 14px;
}
.slider-card {
  display: grid;
  gap: 10px;
}
.slider-head {
  justify-content: space-between;
  gap: 12px;
}
.slider-head > div {
  display: grid;
  gap: 4px;
}
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
.blend-card {
  justify-content: space-between;
  gap: 12px;
}
.blend-card select {
  border: 1px solid var(--evz-line);
  border-radius: 12px;
  padding: 10px;
  background: var(--evz-card-solid);
  color: var(--evz-muted);
  font-weight: 800;
}
.skin-grid,
.ai-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
.skin-grid button,
.ai-actions button {
  color: var(--evz-muted);
}
.warning-card {
  display: grid;
  gap: 6px;
}
.warning-card.green {
  border-color: rgba(3,205,140,0.22);
  background: rgba(3,205,140,0.07);
}
.warning-card strong { color: var(--evz-green); }
.warning-card span,
.ai-plan p,
.material-warning p {
  color: var(--evz-muted);
  line-height: 1.55;
  margin: 0;
}
.texture-slot-list {
  display: grid;
  gap: 10px;
}
.slot-row {
  display: grid;
  grid-template-columns: 82px 1fr auto;
  gap: 10px;
  align-items: center;
}
.slot-row span {
  color: var(--evz-muted);
  font-weight: 800;
}
.slot-row em {
  color: var(--evz-green);
  font-size: 11px;
  font-style: normal;
  font-weight: 900;
}
.slot-row em.empty { color: var(--evz-orange); }
.output-card {
  display: grid;
  gap: 12px;
}
.output-card div {
  display: grid;
  gap: 5px;
}
.output-card span {
  color: var(--evz-muted);
}
.ai-prompt {
  width: 100%;
  min-height: 150px;
  border: 1px solid var(--evz-line);
  border-radius: 18px;
  padding: 14px;
  outline: none;
  resize: vertical;
  color: var(--evz-ink);
  font: inherit;
  line-height: 1.55;
  background: var(--evz-card-solid);
}
.ai-plan {
  display: grid;
  gap: 8px;
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
.bottom-content {
  padding: 18px;
}
.lut-grid,
.compression-grid,
.performance-grid {
  display: grid;
  grid-template-columns: 1.2fr repeat(3, 1fr);
  gap: 12px;
}
.lut-preview-card {
  display: grid;
  gap: 10px;
  grid-row: span 2;
}
.lut-strip {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  height: 80px;
  border-radius: 18px;
  overflow: hidden;
}
.lut-preview-card small,
.compression-preview small {
  color: var(--evz-muted);
  line-height: 1.45;
}
.lut-control {
  display: grid;
  gap: 12px;
}
.lut-control div:first-child {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}
.lut-control span {
  color: var(--evz-green);
  font-weight: 900;
}
.compression-card {
  display: grid;
  gap: 10px;
}
.compression-card div {
  display: grid;
  gap: 4px;
}
.compression-card > span {
  color: var(--evz-green);
  font-weight: 900;
}
.compression-preview {
  grid-column: span 2;
  display: grid;
  gap: 10px;
  background:
    radial-gradient(circle at 20% 20%, rgba(3,205,140,0.16), transparent 40%),
    var(--evz-card);
}
.before-after {
  display: flex;
  gap: 10px;
}
.before-after span {
  border-radius: 999px;
  padding: 8px 10px;
  background: rgba(148,163,184,0.12);
  color: var(--evz-muted);
  font-size: 12px;
  font-weight: 900;
}
.perf-card {
  display: grid;
  gap: 12px;
}
.perf-card div:first-child {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}
.perf-card.green strong { color: var(--evz-green); }
.perf-card.orange strong { color: var(--evz-orange); }
.material-warning {
  grid-column: span 2;
  border-color: rgba(247,127,0,0.24);
  background: var(--evz-warning-surface);
}
.material-warning strong {
  color: var(--evz-orange);
}
@media (max-width: 1450px) {
  .materials-shell { grid-template-columns: 300px 1fr; }
  .right-panel { grid-column: span 2; min-height: auto; }
}
@media (max-width: 1050px) {
  .topbar { flex-direction: column; align-items: flex-start; }
  .materials-shell { grid-template-columns: 1fr; }
  .right-panel { grid-column: auto; }
  .center-panel { grid-template-rows: auto 390px auto; }
  .lut-grid,
  .compression-grid,
  .performance-grid { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 700px) {
  .evz-materials-page { padding: 14px; }
  .top-actions > * { width: 100%; justify-content: center; }
  .center-top,
  .bottom-head { flex-direction: column; align-items: flex-start; }
  .tab-grid,
  .skin-grid,
  .ai-actions,
  .lut-grid,
  .compression-grid,
  .performance-grid { grid-template-columns: 1fr; }
  .preview-card.bottom-left { grid-template-columns: 1fr 1fr; right: 16px; }
  .preview-card.top-right {
    left: 16px;
    right: 16px;
    top: auto;
    bottom: 86px;
    max-width: none;
  }
  .node-inspector { display: none; }
  .shader-node { width: 140px; }
  .slot-row { grid-template-columns: 1fr; }
  .compression-preview,
  .material-warning { grid-column: auto; }
  .lab-camera-error {
    left: 16px;
    right: 16px;
    bottom: 16px;
  }
}
`;
