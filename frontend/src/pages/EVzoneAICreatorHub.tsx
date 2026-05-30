import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createAIGeneration, type AIGenerationResult } from "../services/aiCreator";

type LeftTab = "Create" | "Media AI" | "Studio Assets" | "Logic & Code" | "Quality";
type RightTab = "Copilot" | "Generation Settings" | "Safety Checker" | "Optimization";
type BottomTab = "Result History" | "Asset Queue" | "Prompt Presets" | "AI Graph";
type PreviewMode = "Effect" | "Overlay" | "Studio Set" | "Node Graph";

const creationTools = [
  { name: "Prompt-to-effect", type: "Full effect", score: 98, tone: "green" },
  { name: "Prompt-to-filter", type: "Beauty / LUT", score: 96, tone: "green" },
  { name: "Prompt-to-background", type: "Virtual background", score: 94, tone: "green" },
  { name: "Prompt-to-overlay", type: "Studio graphics", score: 95, tone: "green" },
  { name: "Prompt-to-VFX", type: "Particles", score: 92, tone: "green" },
  { name: "Prompt-to-material", type: "Shader / PBR", score: 91, tone: "green" },
  { name: "Prompt-to-texture", type: "Texture set", score: 90, tone: "green" },
  { name: "Prompt-to-script", type: "TypeScript", score: 89, tone: "orange" },
  { name: "Prompt-to-node-graph", type: "Visual logic", score: 93, tone: "green" },
  { name: "Prompt-to-animation", type: "Motion", score: 88, tone: "orange" },
  { name: "Prompt-to-sound", type: "SFX / stinger", score: 87, tone: "orange" },
];

const mediaTools = [
  "AI image generation",
  "AI video / image-alive",
  "AI keyframe morph",
  "AI lip sync",
  "AI art texture",
  "AI style transfer",
  "AI variation generator",
  "AI sound design",
];

const studioAssetTools = [
  { title: "AI Background Generator", detail: "Virtual backgrounds, green-screen plates, stage looks, and scene plates." },
  { title: "AI Lower-Third Generator", detail: "Names, titles, captions, speaker cards, and animated lower-thirds." },
  { title: "AI Studio Set Generator", detail: "Premium virtual sets for news, podcast, education, worship, and events." },
  { title: "AI 3D Assistant", detail: "Generate prop concepts, optimize models, create variants, and prepare GLB assets." },
  { title: "AI Material Generator", detail: "Glass, skin, neon, hologram, chrome, fabric, and broadcast-safe PBR looks." },
  { title: "AI Texture Generator", detail: "Albedo, masks, gradients, roughness, emission, and normal-map suggestions." },
];

const logicTools = [
  { title: "AI Script Generator", detail: "Generate EVzone-safe TypeScript for triggers, studio events, overlays, and VFX." },
  { title: "AI Node Graph Generator", detail: "Convert prompts into no-code visual logic graphs with variables and actions." },
  { title: "AI Error Fixer", detail: "Explain and patch scripts, graph problems, asset issues, and export blockers." },
  { title: "AI Animation Generator", detail: "Create keyframes, easing, tween presets, lower-third animation, and alert motion." },
];

const qualityTools = [
  { title: "AI Optimization", detail: "Compress textures, simplify graphs, reduce particle cost, and improve FPS." },
  { title: "AI Safety Checker", detail: "Check flashing visuals, brand safety, copyright risk, and studio broadcast safety." },
  { title: "Live-Safe Validator", detail: "Confirm memory, GPU, FPS, audio, fallback, and studio runtime limits." },
  { title: "Fallback Generator", detail: "Create low-cost versions for heavy effects and weaker devices." },
];

const resultHistory = [
  { title: "Emerald Hologram Intro", type: "Prompt-to-effect", status: "Ready", score: 94 },
  { title: "Premium Lower Third Pack", type: "Overlay", status: "Added", score: 97 },
  { title: "Studio Set: Future Newsroom", type: "Background", status: "Ready", score: 92 },
  { title: "Smile Confetti Logic", type: "Node graph", status: "Opened", score: 96 },
  { title: "Soft Skin Broadcast LUT", type: "Filter", status: "Saved", score: 98 },
];

const assetQueue = [
  { name: "hologram_intro.effect", size: "3.4 MB", state: "Ready" },
  { name: "lower_third_pack.json", size: "780 KB", state: "Added to project" },
  { name: "emerald_stage_background.png", size: "2.1 MB", state: "Ready" },
  { name: "smile_confetti_graph.evzgraph", size: "340 KB", state: "Open in editor" },
  { name: "ai_stinger_soft_hit.wav", size: "420 KB", state: "Needs review" },
];

const promptPresets = [
  "Create a premium AR intro for a live interview show with EVzone green glow and orange accent sparks.",
  "Generate a clean broadcast beauty filter with natural skin, soft makeup and no exaggerated reshaping.",
  "Create a lower-third pack for host, guest, breaking alert, and poll result graphics.",
  "Generate a smile-triggered sparkle node graph and studio button fallback.",
  "Create a futuristic virtual studio set with transparent overlays and live-safe lighting.",
  "Optimize this effect for 60 FPS and reduce texture memory without losing premium quality.",
];

const graphNodes = [
  { id: "n1", title: "Prompt Parser", type: "Text", x: 7, y: 28, tone: "green" },
  { id: "n2", title: "Style Director", type: "Brand", x: 26, y: 14, tone: "orange" },
  { id: "n3", title: "Asset Generator", type: "Image / 3D", x: 28, y: 48, tone: "green" },
  { id: "n4", title: "Logic Generator", type: "Node Graph", x: 49, y: 27, tone: "green" },
  { id: "n5", title: "Safety Check", type: "Policy", x: 66, y: 14, tone: "orange" },
  { id: "n6", title: "Optimization", type: "Performance", x: 67, y: 51, tone: "gray" },
  { id: "n7", title: "Open in Editor", type: "EVzone", x: 84, y: 32, tone: "green" },
];

const resultCards = [
  {
    title: "Emerald Hologram Host Intro",
    tag: "Effect",
    description: "Face-safe intro with hologram pulse, lower-third reveal, and sparkle burst on host smile.",
    score: 94,
  },
  {
    title: "EVzone Live Lower Third Set",
    tag: "Overlay",
    description: "Host, guest, poll, alert, countdown, and scoreboard graphics with motion-ready components.",
    score: 97,
  },
  {
    title: "Smile → Confetti Node Graph",
    tag: "Logic",
    description: "Visual logic graph with smile trigger, studio button fallback, confetti, and live alert event.",
    score: 96,
  },
];

const copilotMessages = [
  { role: "AI", text: "I can generate the effect, create its asset pack, build the node graph, then run safety and optimization checks before opening it in the editor." },
  { role: "User", text: "Make it premium and live-ready for the host camera." },
  { role: "AI", text: "Recommended: hologram intro, soft EVzone green glow, orange sparkle accents, safe confetti density, and emergency disable fallback." },
];

export default function EVzoneAICreatorHub() {
  const [leftTab, setLeftTab] = useState<LeftTab>("Create");
  const [rightTab, setRightTab] = useState<RightTab>("Copilot");
  const [bottomTab, setBottomTab] = useState<BottomTab>("Result History");
  const [previewMode, setPreviewMode] = useState<PreviewMode>("Effect");
  const [activeTool, setActiveTool] = useState(creationTools[0]);
  const [prompt, setPrompt] = useState(
    "Create a premium live-show AR intro for EVzone Studio: emerald hologram glow, orange sparkle accents, host face-safe tracking, lower-third reveal, and studio button fallback."
  );
  const [selectedNode, setSelectedNode] = useState(graphNodes[3]);
  const [settings, setSettings] = useState({
    creativity: 62,
    quality: 92,
    speed: 58,
    liveSafe: 96,
    optimization: 84,
    safety: 91,
  });
  const [generatedResults, setGeneratedResults] = useState<AIGenerationResult[]>([]);
  const [generationMessage, setGenerationMessage] = useState("Ready to generate. Add OPENAI_API_KEY on the backend for real image output.");
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewCameraActive, setPreviewCameraActive] = useState(false);
  const [previewCameraFacing, setPreviewCameraFacing] = useState<"user" | "environment">("user");
  const [previewCameraError, setPreviewCameraError] = useState<string | null>(null);
  const previewVideoRef = useRef<HTMLVideoElement | null>(null);
  const previewCameraStreamRef = useRef<MediaStream | null>(null);

  const readResultImage = (result?: AIGenerationResult["result"]) => {
    if (!result) return "";
    const imageDataUrl = typeof result.imageDataUrl === "string" ? result.imageDataUrl : "";
    const imageUrl = typeof result.imageUrl === "string" ? result.imageUrl : "";
    return imageDataUrl || imageUrl;
  };

  const latestGeneratedImage = useMemo(() => {
    const newestResultWithImage = generatedResults.find((item) => readResultImage(item.result));
    return readResultImage(newestResultWithImage?.result);
  }, [generatedResults]);

  const metrics = useMemo(
    () => [
      { label: "AI Mode", value: "Studio-native", tone: "green" },
      { label: "Safety", value: "91%", tone: "green" },
      { label: "Runtime", value: "Live-safe", tone: "green" },
      { label: "Cost", value: "Free", tone: "orange" },
    ],
    []
  );

  const updateSetting = (key: keyof typeof settings, value: number) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const stopPreviewCamera = useCallback(() => {
    previewCameraStreamRef.current?.getTracks().forEach((track) => track.stop());
    previewCameraStreamRef.current = null;
    if (previewVideoRef.current) {
      previewVideoRef.current.srcObject = null;
    }
    setPreviewCameraActive(false);
  }, []);

  const resolvePreviewCameraError = useCallback((error: unknown) => {
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

  const startPreviewCamera = useCallback(
    async (facing: "user" | "environment" = previewCameraFacing) => {
      if (!navigator.mediaDevices?.getUserMedia) {
        setPreviewCameraError("Camera is unavailable in this browser context.");
        setPreviewCameraActive(false);
        return;
      }

      try {
        setPreviewCameraError(null);
        setPreviewCameraFacing(facing);
        previewCameraStreamRef.current?.getTracks().forEach((track) => track.stop());

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

        previewCameraStreamRef.current = stream;
        if (previewVideoRef.current) {
          previewVideoRef.current.srcObject = stream;
          const playPromise = previewVideoRef.current.play();
          if (playPromise) {
            await playPromise.catch(() => undefined);
          }
        }
        setPreviewCameraActive(true);
      } catch (error) {
        stopPreviewCamera();
        setPreviewCameraError(resolvePreviewCameraError(error));
      }
    },
    [previewCameraFacing, resolvePreviewCameraError, stopPreviewCamera],
  );

  useEffect(() => {
    void startPreviewCamera();
    return () => {
      stopPreviewCamera();
    };
  }, [startPreviewCamera, stopPreviewCamera]);

  const resolveTarget = (): "effect" | "filter" | "background" | "overlay" | "vfx" | "material" | "script" | "node-graph" => {
    const label = `${activeTool.name} ${activeTool.type}`.toLowerCase();
    if (label.includes("filter") || label.includes("beauty") || label.includes("lut")) return "filter";
    if (label.includes("background") || label.includes("studio set")) return "background";
    if (label.includes("overlay") || label.includes("lower-third")) return "overlay";
    if (label.includes("vfx") || label.includes("particle")) return "vfx";
    if (label.includes("material") || label.includes("texture")) return "material";
    if (label.includes("script") || label.includes("typescript")) return "script";
    if (label.includes("node") || label.includes("graph")) return "node-graph";
    return "effect";
  };

  const runGeneration = async (mode: "Generate" | "Regenerate" | "Remix" = "Generate") => {
    if (!prompt.trim()) {
      setGenerationMessage("Add a prompt before generating.");
      return;
    }

    setIsGenerating(true);
    setGenerationMessage(`${mode} is running through the EVzone backend...`);
    try {
      const result = await createAIGeneration({
        prompt: mode === "Remix" ? `${prompt}\nRemix this with a different color direction and a stronger live-safe fallback.` : prompt,
        target: resolveTarget(),
      });
      setGeneratedResults((previous) => [result, ...previous].slice(0, 6));
      const needsKey = Boolean(result.result?.requiresApiKey);
      const failed = Boolean(result.result?.failed);
      const resultMessage = typeof result.result?.message === "string" ? result.result.message : "";
      const hasImage = Boolean(readResultImage(result.result));
      setGenerationMessage(
        needsKey
          ? "Backend connected. Real AI image output needs OPENAI_API_KEY in EVzone_Effect_Hub_Backend/.env."
          : failed
            ? `Image generation failed: ${resultMessage || "Backend provider returned an error."}`
            : hasImage
              ? `${mode} finished. The preview and result list updated.`
              : `${mode} finished, but no image was returned. Check model settings and backend logs.`,
      );
    } catch (error) {
      setGenerationMessage(error instanceof Error ? error.message : "AI generation failed.");
    } finally {
      setIsGenerating(false);
    }
  };

  const renderSlider = (key: keyof typeof settings, label: string, helper?: string) => (
    <div className="slider-card" key={key}>
      <div className="slider-head">
        <div>
          <strong>{label}</strong>
          {helper ? <small>{helper}</small> : null}
        </div>
        <span>{settings[key]}%</span>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={settings[key]}
        onChange={(event) => updateSetting(key, Number(event.target.value))}
      />
      <div className="slider-track"><span style={{ width: `${settings[key]}%` }} /></div>
    </div>
  );

  const renderLeftContent = () => {
    if (leftTab === "Create") {
      return (
        <div className="panel-scroll">
          {creationTools.map((tool) => (
            <button
              key={tool.name}
              className={`tool-card ${activeTool.name === tool.name ? "active" : ""}`}
              onClick={() => setActiveTool(tool)}
            >
              <span className={`tool-art ${tool.tone}`} />
              <span className="tool-copy">
                <strong>{tool.name}</strong>
                <small>{tool.type} • Studio score {tool.score}%</small>
              </span>
            </button>
          ))}
        </div>
      );
    }

    if (leftTab === "Media AI") {
      return (
        <div className="panel-scroll media-grid">
          {mediaTools.map((tool) => (
            <button className="media-tool" key={tool} data-evz-autowire="1">
              <span>AI</span>
              <strong>{tool}</strong>
            </button>
          ))}
        </div>
      );
    }

    if (leftTab === "Studio Assets") {
      return (
        <div className="panel-scroll">
          {studioAssetTools.map((tool) => (
            <button className="asset-tool-card" key={tool.title} data-evz-autowire="1">
              <span className="asset-art" />
              <strong>{tool.title}</strong>
              <small>{tool.detail}</small>
            </button>
          ))}
        </div>
      );
    }

    if (leftTab === "Logic & Code") {
      return (
        <div className="panel-scroll">
          {logicTools.map((tool) => (
            <button className="asset-tool-card" key={tool.title} data-evz-autowire="1">
              <span className="asset-art logic" />
              <strong>{tool.title}</strong>
              <small>{tool.detail}</small>
            </button>
          ))}
        </div>
      );
    }

    return (
      <div className="panel-scroll">
        {qualityTools.map((tool) => (
          <button className="quality-card" key={tool.title} data-evz-autowire="1">
            <span>✓</span>
            <div>
              <strong>{tool.title}</strong>
              <small>{tool.detail}</small>
            </div>
          </button>
        ))}
      </div>
    );
  };

  const renderRightContent = () => {
    if (rightTab === "Copilot") {
      return (
        <div className="panel-scroll">
          <SectionTitle eyebrow="AI Copilot chat" title="Project-Aware Assistant" />
          <div className="chat-box">
            {copilotMessages.map((message, index) => (
              <div key={index} className={`chat-message ${message.role.toLowerCase()}`}>
                <strong>{message.role}</strong>
                <span>{message.text}</span>
              </div>
            ))}
          </div>
          <div className="copilot-input">
            <input value="Add a safe fallback and studio trigger." readOnly />
            <button className="primary-btn" data-evz-autowire="1">Send</button>
          </div>
          <div className="quick-ai-actions">
            <button data-evz-autowire="1">Generate</button>
            <button data-evz-autowire="1">Explain</button>
            <button data-evz-autowire="1">Fix</button>
            <button data-evz-autowire="1">Optimize</button>
          </div>
        </div>
      );
    }

    if (rightTab === "Generation Settings") {
      return (
        <div className="panel-scroll">
          <SectionTitle eyebrow="Generation settings" title="Creative Direction & Output" />
          {renderSlider("creativity", "Creativity", "Balances novelty with predictable studio output")}
          {renderSlider("quality", "Premium Quality", "Controls polish, detail, and refinement pass")}
          {renderSlider("speed", "Generation Speed", "Faster drafts or slower premium results")}
          <div className="setting-grid">
            {["EVzone palette", "Face-safe", "Studio-ready", "Transparent overlays", "Mobile preview", "Local cache"].map((item) => (
              <button key={item} data-evz-autowire="1">{item}</button>
            ))}
          </div>
        </div>
      );
    }

    if (rightTab === "Safety Checker") {
      return (
        <div className="panel-scroll">
          <SectionTitle eyebrow="AI safety checker" title="Broadcast & Asset Safety" />
          {renderSlider("safety", "Safety Score", "Checks brand risk, flashing visuals, copyright risk, and policy issues")}
          <div className="safety-list">
            <div className="safety-row green"><strong>Flashing visuals</strong><span>Passed</span></div>
            <div className="safety-row green"><strong>Brand safety</strong><span>Passed</span></div>
            <div className="safety-row green"><strong>Face-safe beauty</strong><span>Passed</span></div>
            <div className="safety-row orange"><strong>Audio stinger</strong><span>Review recommended</span></div>
            <div className="safety-row green"><strong>Studio fallback</strong><span>Ready</span></div>
          </div>
          <div className="warning-card">
            <strong>Safety note</strong>
            <span>Generated assets remain private to EVzone Studio unless manually exported. No public marketplace or monetization flow is included.</span>
          </div>
        </div>
      );
    }

    return (
      <div className="panel-scroll">
        <SectionTitle eyebrow="AI optimization" title="Performance & Error Fixing" />
        {renderSlider("optimization", "Optimization Readiness", "Reduces texture memory, graph cost, particles, script load and export blockers")}
        {renderSlider("liveSafe", "Live-Safe Runtime", "Ensures studio-friendly fallbacks and stable broadcast FPS")}
        <div className="optimization-list">
          {[
            ["Texture compression", "Save 42 MB"],
            ["Particle density", "Reduce by 18%"],
            ["Node graph", "Merge 3 actions"],
            ["Script warning", "Patch missing payload field"],
            ["Fallback mode", "Create low-cost version"],
          ].map(([title, detail]) => (
            <div className="optimization-row" key={title}>
              <strong>{title}</strong>
              <span>{detail}</span>
              <button data-evz-autowire="1">Apply</button>
            </div>
          ))}
        </div>
        <button className="primary-btn full" data-evz-autowire="1">Fix and Optimize All</button>
      </div>
    );
  };

  const renderPreviewContent = () => {
    if (latestGeneratedImage) {
      return (
        <div className="generated-image-preview">
          <img src={latestGeneratedImage} alt="AI generated EVzone visual" />
          <div>
            <strong>{generatedResults[0]?.title ?? "Generated AI image"}</strong>
            <span>{generatedResults[0]?.result?.requiresApiKey ? "API key required for real OpenAI image output" : "Live generated visual"}</span>
          </div>
        </div>
      );
    }

    if (previewMode === "Overlay") {
      return (
        <div className="overlay-preview">
          <div className="lower-third-preview">
            <strong>EVzone Live</strong>
            <span>Premium generated lower-third overlay</span>
          </div>
          <div className="alert-preview">AI GENERATED LIVE ALERT</div>
          <div className="caption-preview">Caption animation and highlight preview</div>
        </div>
      );
    }

    if (previewMode === "Studio Set") {
      return (
        <div className="studio-set-preview">
          <div className="set-floor" />
          <div className="set-screen left" />
          <div className="set-screen right" />
          <div className="set-desk" />
          <div className="set-title">AI Studio Set Generator</div>
        </div>
      );
    }

    if (previewMode === "Node Graph") {
      return (
        <div className="mini-node-preview">
          {["Prompt", "Assets", "Logic", "Safety", "Editor"].map((node, index) => (
            <React.Fragment key={node}>
              <div className={`mini-node ${index === 3 ? "orange" : "green"}`}>{node}</div>
              {index < 4 && <div className="mini-link" />}
            </React.Fragment>
          ))}
        </div>
      );
    }

    return (
      <div className="effect-preview">
        <div className="host-preview">
          <span className="head" />
          <span className="body" />
          <div className="face-glow" />
        </div>
        <div className="hologram-ring ring-one" />
        <div className="hologram-ring ring-two" />
        <div className="effect-lower-third">
          <strong>Host Intro</strong>
          <span>Generated AR effect preview</span>
        </div>
        <div className="particle-field">
          {Array.from({ length: 32 }).map((_, index) => (
            <span
              key={index}
              className={`particle p${index % 5}`}
              style={{
                left: `${8 + ((index * 19) % 84)}%`,
                top: `${10 + ((index * 31) % 78)}%`,
                animationDelay: `${(index % 10) * 0.12}s`,
              }}
            />
          ))}
        </div>
      </div>
    );
  };

  const renderBottomContent = () => {
    if (bottomTab === "Asset Queue") {
      return (
        <div className="asset-queue-grid">
          {assetQueue.map((asset) => (
            <div className="queue-card" key={asset.name}>
              <span className="queue-icon">AI</span>
              <div>
                <strong>{asset.name}</strong>
                <small>{asset.size}</small>
              </div>
              <em>{asset.state}</em>
            </div>
          ))}
        </div>
      );
    }

    if (bottomTab === "Prompt Presets") {
      return (
        <div className="prompt-preset-grid">
          {promptPresets.map((preset) => (
            <button key={preset} className="prompt-preset-card" onClick={() => setPrompt(preset)}>
              <span>✦</span>
              <strong>{preset}</strong>
            </button>
          ))}
        </div>
      );
    }

    if (bottomTab === "AI Graph") {
      return (
        <div className="ai-graph-canvas">
          <svg className="connections" viewBox="0 0 1000 360" preserveAspectRatio="none">
            <path className="active" d="M120 145 C230 115 265 105 345 105" />
            <path d="M120 155 C230 235 265 250 350 250" />
            <path className="active orange" d="M410 120 C500 140 535 145 615 155" />
            <path className="active" d="M410 260 C500 250 535 245 615 245" />
            <path className="active" d="M675 160 C760 145 800 165 910 190" />
            <path d="M675 252 C760 260 800 240 910 210" />
          </svg>
          <div className="canvas-grid" />
          {graphNodes.map((node) => (
            <button
              key={node.id}
              className={`ai-node ${node.tone} ${selectedNode.id === node.id ? "selected" : ""}`}
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
            <small>AI graph is checked for EVzone Studio compatibility.</small>
          </div>
        </div>
      );
    }

    return (
      <div className="history-grid">
        {resultHistory.map((result) => (
          <div className="history-card" key={result.title}>
            <span className="history-art" />
            <div>
              <strong>{result.title}</strong>
              <small>{result.type} • {result.status}</small>
            </div>
            <em>{result.score}%</em>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="evz-ai-page">
      <style>{styles}</style>

      <header className="topbar">
        <div className="brand-area">
          <div className="brand-mark">EV</div>
          <div>
            <div className="eyebrow">EVzone Effect Creator</div>
            <h1>AI Creator Hub</h1>
            <p>Free studio-native AI tools for effects, filters, backgrounds, overlays, VFX, materials, textures, scripts, node graphs, animations, sounds, safety, and optimization.</p>
          </div>
        </div>
        <div className="top-actions">
          <span className="studio-chip"><i />Connected to EVzone Studio</span>
          <button className="ghost-btn" data-evz-autowire="1">Save AI Preset</button>
          <button className="ghost-btn" data-evz-autowire="1">Add to Project</button>
          <button className="primary-btn" data-evz-autowire="1">Open Result in Editor</button>
        </div>
      </header>

      <main className="ai-shell">
        <aside className="panel left-panel">
          <div className="panel-head">
            <div>
              <div className="eyebrow">AI suite</div>
              <h2>Creation Tools</h2>
            </div>
          </div>
          <div className="tab-grid">
            {(["Create", "Media AI", "Studio Assets", "Logic & Code", "Quality"] as LeftTab[]).map((tab) => (
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
              <div className="eyebrow">Active AI tool</div>
              <h2>{activeTool.name}</h2>
              <p>{activeTool.type} generator • studio-native output • free creation flow • EVzone live-safe checks.</p>
            </div>
            <div className="preview-tabs">
              {(["Effect", "Overlay", "Studio Set", "Node Graph"] as PreviewMode[]).map((mode) => (
                <button key={mode} className={previewMode === mode ? "active" : ""} onClick={() => setPreviewMode(mode)}>
                  {mode}
                </button>
              ))}
            </div>
          </div>

          <div className="prompt-composer">
            <div className="prompt-head">
              <div>
                <div className="eyebrow">Prompt composer</div>
                <h3>Describe what EVzone should create</h3>
              </div>
              <span className="free-badge">Free studio-native AI</span>
            </div>
            <textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} />
            <div className={`generation-status ${isGenerating ? "running" : ""}`}>
              <span />
              <strong>{generationMessage}</strong>
            </div>
            <div className="prompt-actions">
              <button className="primary-btn" onClick={() => runGeneration("Generate")} disabled={isGenerating}>
                {isGenerating ? "Generating..." : "Generate"}
              </button>
              <button className="ghost-btn" onClick={() => runGeneration("Regenerate")} disabled={isGenerating}>Regenerate</button>
              <button className="ghost-btn" onClick={() => runGeneration("Remix")} disabled={isGenerating}>Remix</button>
              <button className="ghost-btn" data-evz-autowire="1">Save AI Preset</button>
            </div>
          </div>

          <div className={`ai-preview-stage ${previewMode.toLowerCase().replace(" ", "-")}`}>
            <div className="stage-grid" />
            <div className="preview-inner">
              <video
                ref={previewVideoRef}
                muted
                playsInline
                autoPlay
                className={`lab-camera-feed ${previewCameraActive ? "live" : ""} ${previewCameraFacing === "user" ? "mirror" : ""}`}
              />
              {renderPreviewContent()}
              {!previewCameraActive ? (
                <div className="lab-camera-placeholder">
                  <strong>{previewCameraError ? "Camera unavailable" : "Starting camera..."}</strong>
                  <span>Allow browser camera permission to view live AI preview output.</span>
                  <button type="button" className="camera-control-btn active" onClick={() => void startPreviewCamera()}>
                    Retry Camera
                  </button>
                </div>
              ) : null}
            </div>
            <div className="preview-card top-left">
              <strong>{previewMode} Preview</strong>
              <span>{activeTool.name} • Safety + optimization enabled</span>
            </div>
            <div className="preview-card top-right camera-controls">
              <button
                type="button"
                className={`camera-control-btn ${previewCameraActive ? "active" : ""}`}
                onClick={() => (previewCameraActive ? stopPreviewCamera() : void startPreviewCamera())}
              >
                {previewCameraActive ? "Stop Camera" : "Open Camera"}
              </button>
              <button
                type="button"
                className="camera-control-btn"
                onClick={() => void startPreviewCamera(previewCameraFacing === "user" ? "environment" : "user")}
              >
                Flip Camera
              </button>
            </div>
            <div className="preview-card bottom-left">
              {metrics.map((metric) => (
                <div key={metric.label}>
                  <span>{metric.label}</span>
                  <strong className={metric.tone}>{metric.value}</strong>
                </div>
              ))}
            </div>
            {previewCameraError ? <div className="lab-camera-error">{previewCameraError}</div> : null}
          </div>

          <div className="results-row">
            {generatedResults.map((result) => (
              <div className="result-card live-result" key={result.id}>
                {readResultImage(result.result) ? (
                  <img className="result-image" src={readResultImage(result.result)} alt={result.title} />
                ) : (
                  <div className="result-art" />
                )}
                <div className="result-content">
                  <span>{result.target}</span>
                  <strong>{result.title}</strong>
                  <small>
                    {result.result?.requiresApiKey
                      ? "Add OPENAI_API_KEY to enable paid OpenAI image generation."
                      : result.result?.failed
                        ? (typeof result.result?.message === "string" ? result.result.message : "Image generation failed on backend provider.")
                        : result.prompt}
                  </small>
                </div>
                <div className="result-actions">
                  <em>{result.safetyStatus ?? result.status}</em>
                  <button data-evz-autowire="1">Open</button>
                  <button data-evz-autowire="1">Add</button>
                </div>
              </div>
            ))}
            {resultCards.map((result) => (
              <div className="result-card" key={result.title}>
                <div className="result-art" />
                <div className="result-content">
                  <span>{result.tag}</span>
                  <strong>{result.title}</strong>
                  <small>{result.description}</small>
                </div>
                <div className="result-actions">
                  <em>{result.score}%</em>
                  <button data-evz-autowire="1">Open</button>
                  <button data-evz-autowire="1">Add</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <aside className="panel right-panel">
          <div className="right-tabs">
            {(["Copilot", "Generation Settings", "Safety Checker", "Optimization"] as RightTab[]).map((tab) => (
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
            {(["Result History", "Asset Queue", "Prompt Presets", "AI Graph"] as BottomTab[]).map((tab) => (
              <button key={tab} className={`tab-btn ${bottomTab === tab ? "active" : ""}`} onClick={() => setBottomTab(tab)}>
                {tab}
              </button>
            ))}
          </div>
          <div className="bottom-actions">
            <button className="ghost-btn small" data-evz-autowire="1">Clear History</button>
            <button className="ghost-btn small" data-evz-autowire="1">Export Prompt Pack</button>
            <button className="primary-btn small" data-evz-autowire="1">Add Selected to Project</button>
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
}
* { box-sizing: border-box; }
body { margin: 0; }
.evz-ai-page {
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
.prompt-head,
.prompt-actions,
.right-tabs,
.bottom-head,
.bottom-tabs,
.bottom-actions,
.slider-head,
.copilot-input,
.quick-ai-actions,
.result-actions,
.safety-row,
.optimization-row,
.history-card,
.queue-card {
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
.tool-card,
.media-tool,
.asset-tool-card,
.quality-card,
.preview-tabs button,
.quick-ai-actions button,
.setting-grid button,
.ai-actions button,
.result-actions button,
.prompt-preset-card,
.optimization-row button {
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
.tool-card:hover,
.media-tool:hover,
.asset-tool-card:hover,
.quality-card:hover,
.preview-tabs button:hover,
.quick-ai-actions button:hover,
.setting-grid button:hover,
.result-actions button:hover,
.prompt-preset-card:hover {
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
.ai-shell {
  max-width: 100%;
  margin: 0;
  display: grid;
  grid-template-columns: 315px minmax(680px, 1fr) 395px;
  gap: 18px;
}
.panel {
  border-radius: var(--radius-xl);
  overflow: hidden;
}
.left-panel,
.right-panel,
.center-panel {
  min-height: 940px;
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
  grid-template-columns: 1fr;
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
.tool-card {
  width: 100%;
  display: grid;
  grid-template-columns: 56px 1fr;
  gap: 12px;
  align-items: center;
  text-align: left;
}
.tool-card.active {
  border-color: rgba(3,205,140,0.35);
  background: rgba(3,205,140,0.07);
}
.tool-art,
.asset-art,
.history-art,
.result-art {
  height: 54px;
  border-radius: 16px;
  background:
    radial-gradient(circle at 26% 28%, rgba(3,205,140,0.40), transparent 28%),
    radial-gradient(circle at 70% 32%, rgba(247,127,0,0.30), transparent 30%),
    var(--evz-card);
}
.tool-art.orange,
.asset-art.logic {
  background:
    radial-gradient(circle at 24% 26%, rgba(247,127,0,0.42), transparent 30%),
    radial-gradient(circle at 70% 34%, rgba(3,205,140,0.24), transparent 30%),
    var(--evz-card);
}
.tool-copy {
  display: grid;
  gap: 4px;
}
small {
  color: var(--evz-muted);
  font-size: 12px;
  line-height: 1.45;
}
.media-grid {
  grid-template-columns: 1fr 1fr;
}
.media-tool {
  min-height: 104px;
  display: grid;
  gap: 10px;
  text-align: left;
}
.media-tool span,
.quality-card > span,
.prompt-preset-card > span,
.queue-icon {
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
.asset-tool-card {
  width: 100%;
  display: grid;
  gap: 8px;
  text-align: left;
}
.asset-art {
  height: 78px;
}
.quality-card {
  display: grid;
  grid-template-columns: 42px 1fr;
  gap: 10px;
  text-align: left;
}
.quality-card div {
  display: grid;
  gap: 4px;
}
.quality-card > span {
  color: var(--evz-green);
  background: rgba(3,205,140,0.10);
}
.center-panel {
  display: grid;
  grid-template-rows: auto auto 430px auto;
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
.prompt-composer {
  margin: 16px 16px 0;
  border: 1px solid var(--evz-soft-line);
  border-radius: 24px;
  background: var(--evz-card-solid);
  padding: 16px;
  display: grid;
  gap: 12px;
}
.prompt-head {
  justify-content: space-between;
  gap: 16px;
}
.prompt-head h3 { margin: 4px 0 0; }
.free-badge {
  border-radius: 999px;
  padding: 8px 11px;
  color: var(--evz-green);
  background: rgba(3,205,140,0.10);
  font-weight: 900;
  font-size: 12px;
}
.prompt-composer textarea {
  width: 100%;
  min-height: 120px;
  border: 1px solid var(--evz-line);
  border-radius: 18px;
  padding: 14px;
  outline: none;
  resize: vertical;
  color: var(--evz-ink);
  font: inherit;
  line-height: 1.55;
  background: var(--evz-card);
}
.generation-status {
  min-height: 40px;
  padding: 9px 12px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--evz-muted);
  background: rgba(3,205,140,0.07);
  border: 1px solid rgba(3,205,140,0.14);
  font-size: 12px;
  font-weight: 850;
}
.generation-status span {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: var(--evz-green);
  box-shadow: 0 0 0 5px rgba(3,205,140,0.12);
}
.generation-status.running span {
  animation: pulseGlow 1.1s ease-in-out infinite;
}
.generation-status strong {
  color: inherit;
  font-size: 12px;
  font-weight: 900;
}
.prompt-actions {
  gap: 8px;
  flex-wrap: wrap;
}
.ai-preview-stage {
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
.ai-preview-stage > .stage-grid { z-index: 1; }
.stage-grid,
.canvas-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(148,163,184,0.13) 1px, transparent 1px),
    linear-gradient(90deg, rgba(148,163,184,0.13) 1px, transparent 1px);
  background-size: 34px 34px;
}
.preview-inner {
  position: absolute;
  inset: 60px 70px 70px;
  border-radius: 30px;
  overflow: hidden;
  border: 1px solid var(--evz-border);
  background:
    radial-gradient(circle at 50% 24%, rgba(3,205,140,0.18), transparent 30%),
    linear-gradient(180deg, var(--evz-frost-strong), var(--evz-frost-soft));
  box-shadow: inset 0 0 60px var(--evz-frost-soft), 0 30px 70px rgba(15,23,42,0.12);
  z-index: 3;
}
.lab-camera-feed {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  z-index: 0;
  transition: opacity 220ms ease;
  filter: contrast(1.08) saturate(1.08);
}
.lab-camera-feed.live { opacity: 1; }
.lab-camera-feed.mirror { transform: scaleX(-1); }
.lab-camera-placeholder {
  position: absolute;
  inset: 0;
  z-index: 4;
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
.effect-preview,
.overlay-preview,
.studio-set-preview,
.mini-node-preview,
.generated-image-preview {
  position: absolute;
  inset: 0;
  z-index: 2;
}
.generated-image-preview {
  display: grid;
  place-items: end start;
  overflow: hidden;
  padding: 18px;
}
.generated-image-preview img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.generated-image-preview div {
  position: relative;
  z-index: 2;
  max-width: 420px;
  border-radius: 18px;
  padding: 14px 16px;
  display: grid;
  gap: 5px;
  color: #f8fafc;
  background: rgba(2, 6, 23, .62);
  border: 1px solid rgba(255,255,255,.16);
  backdrop-filter: blur(16px);
}
.generated-image-preview strong {
  font-size: 15px;
  font-weight: 1000;
}
.generated-image-preview span {
  color: rgba(255,255,255,.78);
  font-size: 12px;
  font-weight: 850;
}
.host-preview {
  position: absolute;
  left: 50%;
  bottom: 66px;
  width: 160px;
  height: 220px;
  transform: translateX(-50%);
}
.host-preview .head {
  position: absolute;
  left: 50%;
  top: 6px;
  width: 88px;
  height: 88px;
  transform: translateX(-50%);
  border-radius: 999px;
  background: linear-gradient(135deg, rgba(247,127,0,0.22), rgba(3,205,140,0.22));
  border: 1px solid var(--evz-border);
}
.host-preview .body {
  position: absolute;
  left: 18px;
  bottom: 0;
  width: 124px;
  height: 144px;
  border-radius: 72px 72px 24px 24px;
  background: linear-gradient(135deg, rgba(3,205,140,0.22), rgba(247,127,0,0.14));
}
.face-glow {
  position: absolute;
  left: 50%;
  top: 50px;
  width: 124px;
  height: 124px;
  transform: translateX(-50%);
  border-radius: 999px;
  background: radial-gradient(circle, rgba(3,205,140,0.30), transparent 62%);
  animation: pulseGlow 3s ease-in-out infinite;
}
.hologram-ring {
  position: absolute;
  left: 50%;
  top: 45%;
  border: 2px solid rgba(3,205,140,0.34);
  border-radius: 999px;
  transform: translate(-50%, -50%);
  animation: ringPulse 2.6s ease-in-out infinite;
}
.ring-one { width: 250px; height: 250px; }
.ring-two { width: 360px; height: 360px; animation-delay: .4s; }
@keyframes pulseGlow { 0%,100%{opacity:.55} 50%{opacity:1} }
@keyframes ringPulse { 0%,100%{transform:translate(-50%,-50%) scale(.86);opacity:.18} 50%{transform:translate(-50%,-50%) scale(1.08);opacity:.70} }
.effect-lower-third,
.lower-third-preview {
  position: absolute;
  left: 11%;
  right: 11%;
  bottom: 34px;
  border-radius: 18px;
  padding: 14px 18px;
  background: var(--evz-card);
  border: 1px solid var(--evz-border);
  box-shadow: 0 18px 36px rgba(15,23,42,0.10);
  display: grid;
  gap: 4px;
}
.effect-lower-third strong,
.lower-third-preview strong { color: var(--evz-green); }
.effect-lower-third span,
.lower-third-preview span { color: var(--evz-muted); font-size: 12px; }
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
@keyframes floatParticle {
  0%,100% { transform: translateY(0) rotate(0deg); opacity: .35; }
  50% { transform: translateY(-28px) rotate(80deg); opacity: 1; }
}
.alert-preview {
  position: absolute;
  right: 34px;
  top: 34px;
  border-radius: 999px;
  padding: 10px 14px;
  color: white;
  background: linear-gradient(135deg, var(--evz-orange), #fb923c);
  font-weight: 900;
  font-size: 12px;
}
.caption-preview {
  position: absolute;
  left: 50%;
  top: 42%;
  transform: translateX(-50%);
  border-radius: 999px;
  padding: 10px 14px;
  color: white;
  background: rgba(15,23,42,0.72);
  font-weight: 800;
  font-size: 12px;
}
.set-floor {
  position: absolute;
  left: 12%;
  right: 12%;
  bottom: 38px;
  height: 90px;
  border-radius: 50%;
  background: radial-gradient(ellipse, rgba(3,205,140,0.18), transparent 72%);
  border: 1px dashed rgba(3,205,140,0.32);
}
.set-screen {
  position: absolute;
  top: 76px;
  width: 150px;
  height: 110px;
  border-radius: 18px;
  background: linear-gradient(135deg, rgba(3,205,140,0.18), rgba(247,127,0,0.12));
  border: 1px solid var(--evz-border);
}
.set-screen.left { left: 14%; }
.set-screen.right { right: 14%; }
.set-desk {
  position: absolute;
  left: 50%;
  bottom: 82px;
  width: 250px;
  height: 72px;
  transform: translateX(-50%);
  border-radius: 20px 20px 50px 50px;
  background: var(--evz-card);
  box-shadow: 0 18px 36px rgba(15,23,42,0.10);
}
.set-title {
  position: absolute;
  left: 50%;
  top: 36px;
  transform: translateX(-50%);
  color: var(--evz-green);
  font-weight: 900;
}
.mini-node-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 30px;
}
.mini-node {
  min-width: 82px;
  border-radius: 16px;
  padding: 14px;
  text-align: center;
  color: var(--evz-green);
  background: var(--evz-card-solid);
  border: 1px solid rgba(3,205,140,0.22);
  font-weight: 900;
  box-shadow: 0 14px 28px rgba(15,23,42,0.08);
}
.mini-node.orange {
  color: var(--evz-orange);
  border-color: rgba(247,127,0,0.22);
}
.mini-link {
  width: 38px;
  height: 3px;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--evz-green), var(--evz-orange));
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
.preview-card.bottom-left div { display: grid; gap: 4px; }
.preview-card.bottom-left span {
  color: var(--evz-muted);
  font-size: 11px;
}
.preview-card .green { color: var(--evz-green); }
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
.results-row {
  margin: 0 16px 16px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0,1fr));
  gap: 12px;
}
.result-card {
  border: 1px solid var(--evz-soft-line);
  border-radius: 20px;
  background: var(--evz-card-solid);
  padding: 12px;
  display: grid;
  gap: 10px;
}
.result-card.live-result {
  border-color: rgba(3,205,140,0.28);
  box-shadow: 0 14px 32px rgba(3,205,140,0.10);
}
.result-art {
  height: 82px;
}
.result-image {
  width: 100%;
  height: 118px;
  border-radius: 16px;
  object-fit: cover;
  background: var(--evz-card);
}
.result-content {
  display: grid;
  gap: 5px;
}
.result-content span {
  color: var(--evz-orange);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: .12em;
  font-weight: 900;
}
.result-actions {
  justify-content: space-between;
  gap: 7px;
}
.result-actions em {
  color: var(--evz-green);
  font-style: normal;
  font-weight: 900;
}
.result-actions button {
  padding: 8px 10px;
  color: var(--evz-muted);
  font-size: 12px;
}
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
.chat-box {
  display: grid;
  gap: 10px;
}
.chat-message {
  border-radius: 18px;
  padding: 13px;
  display: grid;
  gap: 6px;
  border: 1px solid var(--evz-soft-line);
  background: var(--evz-card-solid);
}
.chat-message.ai {
  border-color: rgba(3,205,140,0.20);
  background: rgba(3,205,140,0.06);
}
.chat-message.user {
  border-color: rgba(247,127,0,0.20);
  background: rgba(247,127,0,0.06);
}
.chat-message strong {
  color: var(--evz-green);
}
.chat-message.user strong {
  color: var(--evz-orange);
}
.chat-message span,
.warning-card span,
.ai-plan p {
  color: var(--evz-muted);
  line-height: 1.45;
}
.copilot-input {
  gap: 8px;
}
.copilot-input input {
  flex: 1;
  border: 1px solid var(--evz-line);
  border-radius: 14px;
  padding: 11px 13px;
  background: var(--evz-card-solid);
  color: var(--evz-muted);
}
.quick-ai-actions,
.setting-grid,
.ai-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
.quick-ai-actions button,
.setting-grid button,
.ai-actions button {
  color: var(--evz-muted);
}
.slider-card,
.warning-card,
.safety-row,
.optimization-row,
.history-card,
.queue-card,
.prompt-preset-card {
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
.slider-track {
  width: 100%;
  height: 8px;
  border-radius: 999px;
  background: rgba(148,163,184,0.17);
  overflow: hidden;
}
.slider-track span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--evz-green), var(--evz-orange));
}
.safety-list,
.optimization-list {
  display: grid;
  gap: 10px;
}
.safety-row {
  justify-content: space-between;
  gap: 12px;
}
.safety-row.green span {
  color: var(--evz-green);
}
.safety-row.orange span {
  color: var(--evz-orange);
}
.warning-card {
  display: grid;
  gap: 6px;
  border-color: rgba(247,127,0,0.24);
  background: var(--evz-warning-surface);
}
.warning-card strong { color: var(--evz-orange); }
.optimization-row {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 10px;
  align-items: center;
}
.optimization-row span {
  color: var(--evz-muted);
  font-size: 12px;
}
.optimization-row button {
  padding: 8px 10px;
  color: var(--evz-muted);
  font-size: 12px;
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
.history-grid,
.asset-queue-grid,
.prompt-preset-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0,1fr));
  gap: 12px;
}
.history-card {
  display: grid;
  grid-template-columns: 56px 1fr auto;
  gap: 12px;
}
.history-art {
  height: 52px;
}
.history-card div,
.queue-card div {
  display: grid;
  gap: 4px;
}
.history-card em {
  color: var(--evz-green);
  font-style: normal;
  font-weight: 900;
}
.queue-card {
  display: grid;
  grid-template-columns: 42px 1fr;
  gap: 10px;
}
.queue-card em {
  grid-column: 2;
  color: var(--evz-muted);
  font-size: 12px;
  font-style: normal;
  font-weight: 900;
}
.prompt-preset-card {
  min-height: 118px;
  text-align: left;
  display: grid;
  gap: 10px;
}
.ai-graph-canvas {
  position: relative;
  height: 360px;
  overflow: hidden;
  border-radius: 24px;
  background:
    radial-gradient(circle at 20% 16%, rgba(3,205,140,0.12), transparent 28%),
    var(--evz-card);
  border: 1px solid var(--evz-soft-line);
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
.ai-node {
  position: absolute;
  z-index: 4;
  width: 160px;
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
.ai-node.selected {
  border-color: rgba(3,205,140,0.55);
  outline: 4px solid rgba(3,205,140,0.16);
}
.ai-node.green { border-top: 5px solid var(--evz-green); }
.ai-node.orange { border-top: 5px solid var(--evz-orange); }
.ai-node.gray { border-top: 5px solid var(--evz-medium); }
.ai-node span {
  width: fit-content;
  border-radius: 999px;
  padding: 5px 7px;
  color: var(--evz-muted);
  background: rgba(148,163,184,0.11);
  font-size: 10px;
  font-weight: 900;
}
.ai-node i {
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
.node-inspector span {
  color: var(--evz-green);
  font-weight: 900;
}
@media (max-width: 1450px) {
  .ai-shell { grid-template-columns: 300px 1fr; }
  .right-panel { grid-column: span 2; min-height: auto; }
  .history-grid,
  .asset-queue-grid,
  .prompt-preset-grid { grid-template-columns: repeat(3, minmax(0,1fr)); }
}
@media (max-width: 1050px) {
  .topbar { flex-direction: column; align-items: flex-start; }
  .ai-shell { grid-template-columns: 1fr; }
  .right-panel { grid-column: auto; }
  .center-panel { grid-template-rows: auto auto 420px auto; }
  .preview-inner { inset: 62px 36px 72px; }
  .results-row { grid-template-columns: 1fr; }
}
@media (max-width: 700px) {
  .evz-ai-page { padding: 14px; }
  .top-actions > * { width: 100%; justify-content: center; }
  .center-top,
  .bottom-head,
  .prompt-head { flex-direction: column; align-items: flex-start; }
  .media-grid,
  .quick-ai-actions,
  .setting-grid,
  .ai-actions,
  .history-grid,
  .asset-queue-grid,
  .prompt-preset-grid { grid-template-columns: 1fr; }
  .preview-card.bottom-left { grid-template-columns: 1fr 1fr; right: 16px; }
  .preview-card.top-right {
    left: 16px;
    right: 16px;
    top: auto;
    bottom: 84px;
    max-width: none;
  }
  .preview-inner { inset: 78px 18px 88px; }
  .node-inspector { display: none; }
  .ai-node { width: 138px; }
  .optimization-row { grid-template-columns: 1fr; }
  .lab-camera-error {
    left: 16px;
    right: 16px;
    bottom: 16px;
  }
}
`;
