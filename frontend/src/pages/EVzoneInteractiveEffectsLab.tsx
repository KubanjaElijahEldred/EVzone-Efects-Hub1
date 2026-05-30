import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import FlagRoundedIcon from "@mui/icons-material/FlagRounded";
import EmojiEventsRoundedIcon from "@mui/icons-material/EmojiEventsRounded";

type LeftTab = "Builders" | "Inputs" | "Game Kits" | "Live Presets";
type RightTab = "Effect Builder" | "Game Rules" | "State Flow" | "Fallback";
type BottomTab = "Input Mapping" | "Leaderboard" | "Studio Controls" | "Reward Logic";
type PreviewMode = "Game" | "Quiz" | "Randomizer" | "Poll";

const builders = [
  { name: "Interactive Effect Builder", type: "Core", score: 98, tone: "green" },
  { name: "Mini-Game Builder", type: "Game", score: 94, tone: "green" },
  { name: "Quiz Builder", type: "Quiz", score: 96, tone: "green" },
  { name: "Randomizer", type: "Picker", score: 93, tone: "green" },
  { name: "Prize Wheel", type: "Reward", score: 91, tone: "green" },
  { name: "Poll Reaction Builder", type: "Audience", score: 88, tone: "orange" },
  { name: "Countdown Builder", type: "Timer", score: 97, tone: "green" },
  { name: "Scoreboard Builder", type: "Score", score: 95, tone: "green" },
  { name: "Reaction Meter", type: "Engagement", score: 92, tone: "green" },
];

const inputMappings = [
  { name: "Touch", detail: "Tap, hold, swipe, drag", status: "Ready" },
  { name: "Keyboard", detail: "Operator keyboard controls", status: "Ready" },
  { name: "Studio button", detail: "EVzone control surface button", status: "Bound" },
  { name: "Studio hotkey", detail: "F5 / F6 / custom hotkeys", status: "Bound" },
  { name: "Scene change", detail: "Start effects on studio scene transitions", status: "Ready" },
  { name: "Face expression", detail: "Smile, blink, mouth open", status: "Ready" },
  { name: "Hand gesture", detail: "Wave, pinch, peace sign, thumbs-up", status: "Ready" },
  { name: "Audio beat", detail: "Music and voice-reactive triggers", status: "Live" },
  { name: "Timer", detail: "Countdown, timeout, loop interval", status: "Ready" },
];

const gameKits = [
  { title: "Catch the Spark", caption: "Face/hand controlled mini-game with score and timer." },
  { title: "EVzone Quiz Show", caption: "Question cards, answer buttons, timer and result screen." },
  { title: "Prize Wheel Live", caption: "Spin wheel controlled by studio button or gesture." },
  { title: "Poll Reaction Wall", caption: "Audience poll result visualization and reactions." },
  { title: "Countdown Challenge", caption: "Timed reveal with confetti and studio trigger." },
  { title: "Score Battle Overlay", caption: "Team scores, local leaderboard and celebration triggers." },
];

const livePresets = [
  "Smile to reveal lower third",
  "Wave for confetti",
  "Studio button starts prize wheel",
  "Audio beat reaction meter",
  "Timer launches countdown overlay",
  "Poll result changes background",
  "Hotkey increments scoreboard",
  "Gesture unlocks reward badge",
];

const gameStates = ["Intro", "Active", "Success", "Fail", "Outro"];

const stateCards = [
  { name: "Intro", detail: "Show title card and instructions", status: "Ready" },
  { name: "Active", detail: "Collect score, answers, taps, or reactions", status: "Current" },
  { name: "Success", detail: "Play reward, confetti, badge, and studio event", status: "Ready" },
  { name: "Fail", detail: "Show retry, timeout, or safe fallback", status: "Ready" },
  { name: "Outro", detail: "Reset inputs and return to studio-ready idle", status: "Ready" },
];

const leaderboard = [
  { name: "Team Emerald", score: 1240, change: "+180" },
  { name: "Studio Host", score: 1125, change: "+90" },
  { name: "Guest Team", score: 980, change: "+75" },
  { name: "Audience Pick", score: 840, change: "+120" },
];

const rewardTriggers = [
  { title: "Confetti trigger", source: "Success state", action: "Spawn EVzone Confetti Burst" },
  { title: "Reward badge", source: "Score reaches 100", action: "Reveal achievement overlay" },
  { title: "Studio alert", source: "Prize wheel lands", action: "Send live alert event" },
  { title: "Audio stinger", source: "Quiz answered", action: "Play celebration sound" },
];

const graphNodes = [
  { id: "n1", title: "Studio Button Start", type: "Input", x: 7, y: 22, tone: "green" },
  { id: "n2", title: "Face Smile Bonus", type: "Input", x: 24, y: 10, tone: "orange" },
  { id: "n3", title: "Timer 30s", type: "Timer", x: 26, y: 48, tone: "gray" },
  { id: "n4", title: "Game State Machine", type: "State", x: 46, y: 28, tone: "green" },
  { id: "n5", title: "Score + Count", type: "Score", x: 63, y: 14, tone: "orange" },
  { id: "n6", title: "Reward Trigger", type: "Reward", x: 64, y: 50, tone: "green" },
  { id: "n7", title: "Confetti + Alert", type: "VFX", x: 82, y: 28, tone: "orange" },
];

const studioControls = [
  { control: "Start Game", type: "Studio Button", binding: "Control Surface A1" },
  { control: "Reset Round", type: "Hotkey", binding: "F6" },
  { control: "Spin Wheel", type: "Studio Button", binding: "Control Surface A2" },
  { control: "Reveal Winner", type: "Scene Change", binding: "Finale Scene" },
  { control: "Emergency Stop", type: "Fallback", binding: "Operator Hold" },
];

export default function EVzoneInteractiveEffectsLab() {
  const [leftTab, setLeftTab] = useState<LeftTab>("Builders");
  const [rightTab, setRightTab] = useState<RightTab>("Effect Builder");
  const [bottomTab, setBottomTab] = useState<BottomTab>("Input Mapping");
  const [previewMode, setPreviewMode] = useState<PreviewMode>("Game");
  const [activeBuilder, setActiveBuilder] = useState(builders[1]);
  const [selectedNode, setSelectedNode] = useState(graphNodes[3]);
  const [values, setValues] = useState({
    timer: 62,
    difficulty: 46,
    rewardChance: 38,
    confetti: 70,
    reaction: 58,
    fallback: 86,
    audio: 52,
    gesture: 66,
  });
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraFacing, setCameraFacing] = useState<"user" | "environment">("user");
  const [cameraError, setCameraError] = useState<string | null>(null);
  const previewVideoRef = useRef<HTMLVideoElement | null>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);

  const runtimeStats = useMemo(
    () => [
      { label: "Input Latency", value: "10 ms", tone: "green" },
      { label: "Game FPS", value: "59.4", tone: "green" },
      { label: "Triggers", value: "9", tone: "green" },
      { label: "Fallback", value: "Ready", tone: "orange" },
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
    if (leftTab === "Builders") {
      return (
        <div className="panel-scroll">
          {builders.map((builder) => (
            <button
              key={builder.name}
              className={`builder-card ${activeBuilder.name === builder.name ? "active" : ""}`}
              onClick={() => {
                setActiveBuilder(builder);
                if (builder.name.includes("Quiz")) setPreviewMode("Quiz");
                if (builder.name.includes("Randomizer") || builder.name.includes("Prize")) setPreviewMode("Randomizer");
                if (builder.name.includes("Poll") || builder.name.includes("Reaction")) setPreviewMode("Poll");
                if (builder.name.includes("Mini") || builder.name.includes("Interactive")) setPreviewMode("Game");
              }}
            >
              <span className={`builder-art ${builder.tone}`} />
              <span className="builder-copy">
                <strong>{builder.name}</strong>
                <small>{builder.type} • Live-safe score {builder.score}%</small>
              </span>
            </button>
          ))}
        </div>
      );
    }

    if (leftTab === "Inputs") {
      return (
        <div className="panel-scroll">
          {inputMappings.map((input) => (
            <div className="input-card" key={input.name}>
              <span className="input-icon">⌁</span>
              <div>
                <strong>{input.name}</strong>
                <small>{input.detail}</small>
              </div>
              <em className={input.status === "Bound" || input.status === "Live" ? "active" : ""}>{input.status}</em>
            </div>
          ))}
          <button className="primary-btn full" data-evz-autowire="1">Add Input Mapping</button>
        </div>
      );
    }

    if (leftTab === "Game Kits") {
      return (
        <div className="panel-scroll">
          {gameKits.map((kit) => (
            <button className="kit-card" key={kit.title} data-evz-autowire="1">
              <span className="kit-art" />
              <strong>{kit.title}</strong>
              <small>{kit.caption}</small>
            </button>
          ))}
        </div>
      );
    }

    return (
      <div className="panel-scroll live-preset-grid">
        {livePresets.map((preset) => (
          <button className="live-preset-card" key={preset} data-evz-autowire="1">
            <span>✦</span>
            <strong>{preset}</strong>
          </button>
        ))}
      </div>
    );
  };

  const renderRightContent = () => {
    if (rightTab === "Effect Builder") {
      return (
        <div className="panel-scroll">
          <SectionTitle eyebrow="Interactive effect builder" title="Triggers, Rewards & Reactions" />
          {renderSlider("timer", "Round Timer", "Countdown, timeout, loop interval and studio reset")}
          {renderSlider("difficulty", "Difficulty", "Controls speed, score target, question time, and input sensitivity")}
          {renderSlider("rewardChance", "Reward Chance", "For randomizer, prize wheel and unlock moments")}
          {renderSlider("confetti", "Confetti Trigger Intensity", "Celebration density for success states")}
          <div className="builder-grid">
            {["Mini-game", "Quiz", "Randomizer", "Prize wheel", "Poll reaction", "Countdown", "Scoreboard", "Reaction meter"].map((item) => (
              <button key={item} className={activeBuilder.name.includes(item.split(" ")[0]) ? "active" : ""} data-evz-autowire="1">{item}</button>
            ))}
          </div>
        </div>
      );
    }

    if (rightTab === "Game Rules") {
      return (
        <div className="panel-scroll">
          <SectionTitle eyebrow="Game rules" title="Score, Timer & Local Session Rules" />
          <div className="rule-card">
            <strong>Score target</strong>
            <span>100 points or highest local leaderboard score</span>
          </div>
          <div className="rule-card">
            <strong>Time limit</strong>
            <span>30 seconds with studio-controlled reset</span>
          </div>
          <div className="rule-card">
            <strong>Win condition</strong>
            <span>Success state triggers reward badge, confetti, and studio event</span>
          </div>
          <div className="rule-card">
            <strong>Fail condition</strong>
            <span>Timeout or missed action triggers safe outro and reset</span>
          </div>
          <div className="rule-card">
            <strong>Local leaderboard</strong>
            <span>Enabled for this studio session only</span>
          </div>
        </div>
      );
    }

    if (rightTab === "State Flow") {
      return (
        <div className="panel-scroll">
          <SectionTitle eyebrow="Game states" title="Intro → Active → Result → Outro" />
          <div className="state-list">
            {stateCards.map((state, index) => (
              <div key={state.name} className={`state-row ${state.status === "Current" ? "current" : ""}`}>
                <span aria-hidden="true"><FlagRoundedIcon fontSize="small" /></span>
                <div>
                  <strong>{state.name}</strong>
                  <small>{state.detail}</small>
                </div>
                <em>{state.status}</em>
              </div>
            ))}
          </div>
          <div className="state-actions">
            <button data-evz-autowire="1">Preview Flow</button>
            <button data-evz-autowire="1">Add State</button>
            <button data-evz-autowire="1">Reset Flow</button>
          </div>
        </div>
      );
    }

    return (
      <div className="panel-scroll">
        <SectionTitle eyebrow="Live-safe fallback" title="Fallback Behavior" />
        {renderSlider("fallback", "Fallback Readiness", "Auto-disable heavy visuals while preserving gameplay and overlays")}
        <div className="fallback-card">
          <strong>When FPS drops below 45</strong>
          <span>Reduce confetti density, disable audio-reactive particles, keep scoreboard active.</span>
        </div>
        <div className="fallback-card">
          <strong>When input is lost</strong>
          <span>Switch to studio button controls and continue current state.</span>
        </div>
        <div className="fallback-card">
          <strong>When studio scene changes</strong>
          <span>Save local score, hide active VFX, and transition to Outro.</span>
        </div>
        <div className="fallback-card orange">
          <strong>Emergency stop</strong>
          <span>Operator can disable all interactive logic instantly from EVzone Studio.</span>
        </div>
      </div>
    );
  };

  const renderBottomContent = () => {
    if (bottomTab === "Leaderboard") {
      return (
        <div className="leaderboard-grid">
          <div className="leaderboard-hero">
            <div>
              <div className="eyebrow">Local leaderboard</div>
              <h3>Studio Session Rankings</h3>
              <p>Local-only leaderboard for studio sessions. No public account, no monetization, no external publishing.</p>
            </div>
            <button className="primary-btn" data-evz-autowire="1">Reset Session Scores</button>
          </div>
          <div className="leaderboard-list">
            {leaderboard.map((item, index) => (
              <div className="leaderboard-row" key={item.name}>
                <span aria-hidden="true"><EmojiEventsRoundedIcon fontSize="small" /></span>
                <strong>{item.name}</strong>
                <em>{item.score}</em>
                <b>{item.change}</b>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (bottomTab === "Studio Controls") {
      return (
        <div className="studio-control-grid">
          {studioControls.map((control) => (
            <div className="studio-control-card" key={control.control}>
              <span className="control-icon">EV</span>
              <div>
                <strong>{control.control}</strong>
                <small>{control.type}</small>
              </div>
              <em>{control.binding}</em>
            </div>
          ))}
        </div>
      );
    }

    if (bottomTab === "Reward Logic") {
      return (
        <div className="reward-grid">
          {rewardTriggers.map((trigger) => (
            <div className="reward-card" key={trigger.title}>
              <div className="reward-art">
                <span />
                <b />
              </div>
              <strong>{trigger.title}</strong>
              <small>{trigger.source}</small>
              <em>{trigger.action}</em>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="mapping-grid">
        {inputMappings.map((input) => (
          <div className="mapping-card" key={input.name}>
            <span className="mapping-dot" />
            <div>
              <strong>{input.name}</strong>
              <small>{input.detail}</small>
            </div>
            <em className={input.status === "Bound" || input.status === "Live" ? "active" : ""}>{input.status}</em>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="evz-interactive-page">
      <style>{styles}</style>

      <header className="topbar">
        <div className="brand-area">
          <div className="brand-mark">EV</div>
          <div>
            <div className="eyebrow">EVzone Effect Creator</div>
            <h1>Interactive Effects Lab</h1>
            <p>Studio-ready interactive effects, mini-games, quiz experiences, randomizers, prize wheels, polls, countdowns, scoreboards, and live-safe operator controls.</p>
          </div>
        </div>
        <div className="top-actions">
          <span className="studio-chip"><i />Connected to EVzone Studio</span>
          <button className="ghost-btn" data-evz-autowire="1">Save Interaction</button>
          <button className="ghost-btn" data-evz-autowire="1">Preview in EVzone</button>
          <button className="primary-btn" data-evz-autowire="1">Apply to Editor</button>
        </div>
      </header>

      <main className="interactive-shell">
        <aside className="panel left-panel">
          <div className="panel-head">
            <div>
              <div className="eyebrow">Library</div>
              <h2>Interactive Assets</h2>
            </div>
          </div>
          <div className="tab-grid">
            {(["Builders", "Inputs", "Game Kits", "Live Presets"] as LeftTab[]).map((tab) => (
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
              <div className="eyebrow">Active interactive system</div>
              <h2>{activeBuilder.name}</h2>
              <p>{activeBuilder.type} module • EVzone Studio controls • local leaderboard • live-safe fallback behavior.</p>
            </div>
            <div className="preview-tabs">
              {(["Game", "Quiz", "Randomizer", "Poll"] as PreviewMode[]).map((mode) => (
                <button key={mode} className={previewMode === mode ? "active" : ""} onClick={() => setPreviewMode(mode)}>
                  {mode}
                </button>
              ))}
            </div>
          </div>

          <div className={`interactive-preview ${previewMode.toLowerCase()}`}>
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
                <span>Allow browser camera permission to view live interactive output.</span>
                <button type="button" className="camera-control-btn active" onClick={() => void startCamera()}>
                  Retry Camera
                </button>
              </div>
            ) : null}
            <div className="studio-stage">
              <div className="stage-label">EVzone Studio Preview</div>
              <div className="game-card">
                <div className="game-header">
                  <span>{previewMode === "Game" ? "Catch the Spark" : previewMode === "Quiz" ? "EVzone Quiz" : previewMode === "Randomizer" ? "Prize Wheel" : "Poll Reaction"}</span>
                  <strong>LIVE</strong>
                </div>

                <div className="game-display">
                  {previewMode === "Randomizer" && (
                    <div className="wheel">
                      <span className="slice one" />
                      <span className="slice two" />
                      <span className="slice three" />
                      <b>SPIN</b>
                    </div>
                  )}

                  {previewMode === "Quiz" && (
                    <div className="quiz-card">
                      <strong>Which segment is live next?</strong>
                      <button data-evz-autowire="1">Interview</button>
                      <button data-evz-autowire="1">Game</button>
                      <button data-evz-autowire="1">Countdown</button>
                    </div>
                  )}

                  {previewMode === "Poll" && (
                    <div className="poll-card">
                      <div><strong>Green Team</strong><span style={{ width: "72%" }} /></div>
                      <div><strong>Orange Team</strong><span style={{ width: "48%" }} /></div>
                      <div><strong>Studio Pick</strong><span style={{ width: "61%" }} /></div>
                    </div>
                  )}

                  {previewMode === "Game" && (
                    <div className="mini-game">
                      <span className="player" />
                      {Array.from({ length: 10 }).map((_, index) => (
                        <i
                          key={index}
                          style={{
                            left: `${12 + ((index * 17) % 76)}%`,
                            top: `${14 + ((index * 29) % 72)}%`,
                            animationDelay: `${index * 0.14}s`,
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div className="game-footer">
                  <span>Score 1,240</span>
                  <span>Timer 00:30</span>
                  <span>State Active</span>
                </div>
              </div>

              <div className="reaction-meter">
                <strong>Reaction Meter</strong>
                <div className="meter"><span style={{ width: `${values.reaction}%` }} /></div>
              </div>

              <div className="countdown-orb">
                <span>30</span>
                <small>Countdown</small>
              </div>

              <div className="scoreboard">
                <strong>Scoreboard</strong>
                <div><span>Emerald</span><b>1240</b></div>
                <div><span>Orange</span><b>980</b></div>
              </div>

              <div className="confetti-layer">
                {Array.from({ length: 28 }).map((_, index) => (
                  <span
                    key={index}
                    className={`confetti c${index % 5}`}
                    style={{
                      left: `${7 + ((index * 23) % 86)}%`,
                      top: `${9 + ((index * 31) % 80)}%`,
                      animationDelay: `${index * 0.11}s`,
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="preview-card top-left">
              <strong>Preview Mode</strong>
              <span>{previewMode} • inputs + states + rewards active</span>
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
              {runtimeStats.map((stat) => (
                <div key={stat.label}>
                  <span>{stat.label}</span>
                  <strong className={stat.tone}>{stat.value}</strong>
                </div>
              ))}
            </div>
            {cameraError ? <div className="lab-camera-error">{cameraError}</div> : null}
          </div>

          <div className="logic-graph">
            <div className="graph-head">
              <div>
                <div className="eyebrow">Interaction graph</div>
                <h3>Input → State → Reward → Studio Output</h3>
              </div>
              <span className="live-safe">Live-safe logic</span>
            </div>

            <div className="graph-canvas">
              <svg className="connections" viewBox="0 0 1000 380" preserveAspectRatio="none">
                <path className="active" d="M120 130 C225 92 260 88 340 115" />
                <path d="M120 142 C230 240 270 250 360 250" />
                <path className="active orange" d="M410 130 C500 145 540 150 615 150" />
                <path d="M410 255 C500 245 540 245 615 250" />
                <path className="active" d="M675 155 C750 145 790 165 900 190" />
                <path className="active orange" d="M675 260 C760 260 805 240 900 210" />
              </svg>
              <div className="canvas-grid" />
              {graphNodes.map((node) => (
                <button
                  key={node.id}
                  className={`logic-node ${node.tone} ${selectedNode.id === node.id ? "selected" : ""}`}
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
                <small>Validated for EVzone Studio live interactivity.</small>
              </div>
            </div>
          </div>
        </section>

        <aside className="panel right-panel">
          <div className="right-tabs">
            {(["Effect Builder", "Game Rules", "State Flow", "Fallback"] as RightTab[]).map((tab) => (
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
            {(["Input Mapping", "Leaderboard", "Studio Controls", "Reward Logic"] as BottomTab[]).map((tab) => (
              <button key={tab} className={`tab-btn ${bottomTab === tab ? "active" : ""}`} onClick={() => setBottomTab(tab)}>
                {tab}
              </button>
            ))}
          </div>
          <div className="bottom-actions">
            <button className="ghost-btn small" data-evz-autowire="1">Add Mapping</button>
            <button className="ghost-btn small" data-evz-autowire="1">Test Round</button>
            <button className="primary-btn small" data-evz-autowire="1">Run Live-Safe Check</button>
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
.evz-interactive-page {
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
.state-row,
.state-actions,
.reaction-meter,
.game-header,
.game-footer,
.scoreboard div,
.studio-control-card,
.leaderboard-row,
.graphics-controls {
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
.builder-card,
.input-card,
.kit-card,
.live-preset-card,
.preview-tabs button,
.builder-grid button,
.state-actions button,
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
.builder-card:hover,
.kit-card:hover,
.live-preset-card:hover,
.preview-tabs button:hover,
.builder-grid button:hover,
.state-actions button:hover,
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
.interactive-shell {
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
  min-height: 900px;
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
.builder-grid button.active {
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
.builder-card {
  width: 100%;
  display: grid;
  grid-template-columns: 56px 1fr;
  gap: 12px;
  align-items: center;
  text-align: left;
}
.builder-card.active {
  border-color: rgba(3,205,140,0.35);
  background: rgba(3,205,140,0.07);
}
.builder-art,
.kit-art,
.reward-art,
.graphics-preview {
  height: 54px;
  border-radius: 16px;
  background:
    radial-gradient(circle at 26% 28%, rgba(3,205,140,0.40), transparent 28%),
    radial-gradient(circle at 70% 32%, rgba(247,127,0,0.30), transparent 30%),
    var(--evz-card);
}
.builder-art.orange {
  background:
    radial-gradient(circle at 24% 26%, rgba(247,127,0,0.42), transparent 30%),
    radial-gradient(circle at 70% 34%, rgba(3,205,140,0.24), transparent 30%),
    var(--evz-card);
}
.builder-copy {
  display: grid;
  gap: 4px;
}
small {
  color: var(--evz-muted);
  font-size: 12px;
  line-height: 1.45;
}
.input-card {
  display: grid;
  grid-template-columns: 42px 1fr auto;
  gap: 10px;
  align-items: center;
  text-align: left;
}
.input-icon,
.control-icon {
  width: 40px;
  height: 40px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  color: var(--evz-green);
  background: rgba(3,205,140,0.10);
  font-size: 18px;
  font-weight: 900;
}
.input-card div,
.kit-card,
.live-preset-card,
.reward-card {
  display: grid;
  gap: 4px;
}
.input-card em {
  color: var(--evz-muted);
  font-size: 11px;
  font-style: normal;
  font-weight: 900;
}
.input-card em.active {
  color: var(--evz-green);
}
.kit-card {
  width: 100%;
  text-align: left;
}
.kit-art {
  height: 82px;
}
.live-preset-grid {
  grid-template-columns: 1fr 1fr;
}
.live-preset-card {
  min-height: 94px;
  text-align: left;
}
.live-preset-card span {
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  color: var(--evz-orange);
  background: rgba(247,127,0,0.10);
  border-radius: 12px;
}
.center-panel {
  display: grid;
  grid-template-rows: auto 460px 1fr;
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
.interactive-preview {
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
.interactive-preview > .stage-grid { z-index: 1; }
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
.studio-stage {
  position: absolute;
  inset: 54px 70px 62px;
  border-radius: 30px;
  overflow: hidden;
  border: 1px solid var(--evz-border);
  background:
    radial-gradient(circle at 50% 24%, rgba(3,205,140,0.18), transparent 30%),
    linear-gradient(180deg, var(--evz-frost-strong), var(--evz-frost-soft));
  box-shadow: inset 0 0 60px var(--evz-frost-soft), 0 30px 70px rgba(15,23,42,0.12);
  z-index: 3;
}
.stage-label {
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
.game-card {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 340px;
  min-height: 255px;
  transform: translate(-50%, -50%);
  border-radius: 28px;
  background: var(--evz-card);
  border: 1px solid var(--evz-border);
  box-shadow: 0 26px 60px rgba(15,23,42,0.13);
  overflow: hidden;
}
.game-header,
.game-footer {
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px;
  background: var(--evz-card-solid);
  border-bottom: 1px solid var(--evz-soft-line);
}
.game-footer {
  border-bottom: 0;
  border-top: 1px solid var(--evz-soft-line);
}
.game-header span {
  font-weight: 900;
}
.game-header strong {
  color: white;
  background: linear-gradient(135deg, var(--evz-orange), #fb923c);
  border-radius: 999px;
  padding: 6px 9px;
  font-size: 11px;
}
.game-footer span {
  color: var(--evz-muted);
  font-size: 12px;
  font-weight: 900;
}
.game-display {
  position: relative;
  height: 176px;
  display: grid;
  place-items: center;
  overflow: hidden;
}
.mini-game {
  position: relative;
  width: 260px;
  height: 140px;
  border-radius: 22px;
  background: linear-gradient(135deg, rgba(3,205,140,0.12), rgba(247,127,0,0.10));
  border: 1px solid var(--evz-soft-line);
  overflow: hidden;
}
.mini-game .player {
  position: absolute;
  left: 50%;
  bottom: 18px;
  width: 44px;
  height: 44px;
  border-radius: 999px;
  transform: translateX(-50%);
  background: var(--evz-green);
  box-shadow: 0 14px 24px rgba(3,205,140,0.24);
}
.mini-game i {
  position: absolute;
  width: 14px;
  height: 14px;
  border-radius: 999px;
  background: var(--evz-orange);
  animation: itemFloat 2.8s ease-in-out infinite;
}
@keyframes itemFloat {
  0%,100% { transform: translateY(0) scale(.9); opacity: .55; }
  50% { transform: translateY(-16px) scale(1.12); opacity: 1; }
}
.wheel {
  position: relative;
  width: 140px;
  height: 140px;
  border-radius: 999px;
  background:
    conic-gradient(var(--evz-green) 0 33%, var(--evz-orange) 33% 66%, #a6a6a6 66% 100%);
  box-shadow: 0 24px 44px rgba(15,23,42,0.15);
  animation: slowSpin 9s linear infinite;
}
@keyframes slowSpin {
  to { transform: rotate(360deg); }
}
.wheel b {
  position: absolute;
  inset: 42px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  color: var(--evz-ink);
  background: var(--evz-card-solid);
  font-size: 16px;
}
.quiz-card {
  width: 250px;
  display: grid;
  gap: 9px;
}
.quiz-card strong {
  text-align: center;
  margin-bottom: 6px;
}
.quiz-card button {
  border: 1px solid var(--evz-soft-line);
  border-radius: 999px;
  background: var(--evz-card-solid);
  padding: 9px 11px;
  font-weight: 800;
}
.poll-card {
  width: 250px;
  display: grid;
  gap: 13px;
}
.poll-card div {
  display: grid;
  gap: 6px;
}
.poll-card strong {
  font-size: 12px;
}
.poll-card span {
  display: block;
  height: 12px;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--evz-green), var(--evz-orange));
}
.reaction-meter,
.countdown-orb,
.scoreboard {
  position: absolute;
  background: var(--evz-card);
  border: 1px solid var(--evz-border);
  box-shadow: 0 14px 26px rgba(15,23,42,0.09);
  backdrop-filter: blur(16px);
}
.reaction-meter {
  left: 24px;
  bottom: 88px;
  width: 190px;
  border-radius: 18px;
  padding: 12px;
  display: grid;
  gap: 9px;
}
.meter {
  height: 12px;
  border-radius: 999px;
  background: rgba(148,163,184,0.16);
  overflow: hidden;
}
.meter span {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, var(--evz-green), var(--evz-orange));
}
.countdown-orb {
  right: 34px;
  bottom: 88px;
  width: 86px;
  height: 86px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  border: 8px solid rgba(3,205,140,0.14);
}
.countdown-orb span {
  font-size: 28px;
  font-weight: 900;
  color: var(--evz-orange);
  line-height: 1;
}
.countdown-orb small {
  margin-top: -18px;
}
.scoreboard {
  right: 24px;
  top: 62px;
  width: 180px;
  border-radius: 18px;
  padding: 12px;
  display: grid;
  gap: 8px;
}
.scoreboard div {
  justify-content: space-between;
  font-size: 12px;
}
.scoreboard b {
  color: var(--evz-green);
}
.confetti-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.confetti {
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 4px;
  background: var(--evz-green);
  animation: confettiFloat 3s ease-in-out infinite;
}
.confetti.c1 { background: var(--evz-orange); border-radius: 999px; }
.confetti.c2 { background: var(--evz-card); box-shadow: 0 0 15px rgba(3,205,140,0.36); }
.confetti.c3 { width: 7px; height: 18px; background: #a6a6a6; }
.confetti.c4 { width: 16px; height: 7px; background: rgba(247,127,0,0.74); }
@keyframes confettiFloat {
  0%,100% { transform: translateY(0) rotate(0deg); opacity: .4; }
  50% { transform: translateY(-24px) rotate(90deg); opacity: 1; }
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

[data-evz-theme='dark'] .evz-interactive-page .studio-stage {
  background:
    radial-gradient(circle at 50% 24%, rgba(3,205,140,0.18), transparent 30%),
    linear-gradient(180deg, color-mix(in srgb, var(--evz-card-solid) 96%, transparent), color-mix(in srgb, var(--evz-card-solid) 90%, transparent));
  box-shadow: inset 0 0 48px rgba(3,205,140,0.12), 0 30px 70px rgba(2,6,12,0.45);
}

[data-evz-theme='dark'] .evz-interactive-page .game-card,
[data-evz-theme='dark'] .evz-interactive-page .preview-card,
[data-evz-theme='dark'] .evz-interactive-page .reaction-meter,
[data-evz-theme='dark'] .evz-interactive-page .countdown-orb,
[data-evz-theme='dark'] .evz-interactive-page .scoreboard {
  background: color-mix(in srgb, var(--evz-card-solid) 96%, transparent);
  border-color: var(--evz-border);
}

[data-evz-theme='dark'] .evz-interactive-page .game-header,
[data-evz-theme='dark'] .evz-interactive-page .game-footer {
  background: color-mix(in srgb, var(--evz-card-solid) 98%, transparent);
  border-color: var(--evz-border);
}

[data-evz-theme='dark'] .evz-interactive-page .game-footer span,
[data-evz-theme='dark'] .evz-interactive-page .preview-card.top-left span {
  color: var(--evz-ink-2);
}
.logic-graph {
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
  height: 360px;
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
.logic-node {
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
.logic-node.selected {
  border-color: rgba(3,205,140,0.55);
  outline: 4px solid rgba(3,205,140,0.16);
}
.logic-node.green { border-top: 5px solid var(--evz-green); }
.logic-node.orange { border-top: 5px solid var(--evz-orange); }
.logic-node.gray { border-top: 5px solid var(--evz-medium); }
.logic-node span {
  width: fit-content;
  border-radius: 999px;
  padding: 5px 7px;
  color: var(--evz-muted);
  background: rgba(148,163,184,0.11);
  font-size: 10px;
  font-weight: 900;
}
.logic-node i {
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
.rule-card,
.state-row,
.fallback-card,
.mapping-card,
.leaderboard-hero,
.leaderboard-row,
.studio-control-card,
.reward-card {
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
.builder-grid,
.state-actions,
.physics-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
.builder-grid button,
.state-actions button {
  color: var(--evz-muted);
  padding: 10px;
}
.rule-card,
.fallback-card {
  display: grid;
  gap: 6px;
}
.rule-card span,
.fallback-card span,
.leaderboard-hero p,
.reward-card small,
.reward-card em {
  color: var(--evz-muted);
  line-height: 1.45;
}
.fallback-card.orange {
  border-color: rgba(247,127,0,0.24);
  background: var(--evz-warning-surface);
}
.fallback-card.orange strong {
  color: var(--evz-orange);
}
.state-list {
  display: grid;
  gap: 10px;
}
.state-row {
  display: grid;
  grid-template-columns: 38px 1fr auto;
  gap: 10px;
}
.state-row > span {
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  color: white;
  border-radius: 12px;
  background: var(--evz-green);
  font-weight: 900;
}
.state-row > span svg {
  font-size: 20px;
}
.state-row.current {
  border-color: rgba(3,205,140,0.26);
  background: rgba(3,205,140,0.07);
}
.state-row em {
  color: var(--evz-green);
  font-size: 11px;
  font-style: normal;
  font-weight: 900;
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
.mapping-grid,
.studio-control-grid,
.reward-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0,1fr));
  gap: 12px;
}
.mapping-card,
.studio-control-card {
  display: grid;
  grid-template-columns: 12px 1fr;
  gap: 12px;
  align-items: start;
}
.mapping-card em,
.studio-control-card em {
  grid-column: 2;
  color: var(--evz-muted);
  font-size: 12px;
  font-style: normal;
  font-weight: 900;
}
.mapping-card em.active {
  color: var(--evz-green);
}
.mapping-dot {
  width: 10px;
  height: 10px;
  margin-top: 4px;
  border-radius: 999px;
  background: var(--evz-green);
  box-shadow: 0 0 0 6px rgba(3,205,140,0.12);
}
.leaderboard-grid {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 14px;
}
.leaderboard-hero {
  justify-content: space-between;
  gap: 16px;
  background:
    radial-gradient(circle at 16% 18%, rgba(3,205,140,0.18), transparent 34%),
    var(--evz-card);
}
.leaderboard-hero h3 {
  margin: 4px 0 8px;
}
.leaderboard-hero p {
  margin: 0;
}
.leaderboard-list {
  display: grid;
  gap: 10px;
}
.leaderboard-row {
  display: grid;
  grid-template-columns: 42px 1fr auto auto;
  gap: 12px;
}
.leaderboard-row > span {
  width: 34px;
  height: 34px;
  border-radius: 12px;
  color: white;
  display: grid;
  place-items: center;
  background: var(--evz-green);
  font-weight: 900;
}
.leaderboard-row > span svg {
  font-size: 20px;
}
.leaderboard-row em {
  font-style: normal;
  font-weight: 900;
  color: var(--evz-ink);
}
.leaderboard-row b {
  color: var(--evz-green);
}
.control-icon {
  font-size: 12px;
}
.reward-grid {
  grid-template-columns: repeat(4, minmax(0,1fr));
}
.reward-card {
  display: grid;
  gap: 9px;
}
.reward-art {
  position: relative;
  height: 92px;
  overflow: hidden;
}
.reward-art span {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 54px;
  height: 54px;
  transform: translate(-50%, -50%);
  border-radius: 999px;
  background: var(--evz-green);
  box-shadow: 0 20px 34px rgba(3,205,140,0.22);
}
.reward-art b {
  position: absolute;
  left: 26px;
  right: 26px;
  bottom: 16px;
  height: 10px;
  border-radius: 999px;
  background: var(--evz-card);
}
.reward-card em {
  font-style: normal;
}
@media (max-width: 1450px) {
  .interactive-shell { grid-template-columns: 300px 1fr; }
  .right-panel { grid-column: span 2; min-height: auto; }
  .mapping-grid,
  .studio-control-grid { grid-template-columns: repeat(3, minmax(0,1fr)); }
  .reward-grid { grid-template-columns: repeat(2, minmax(0,1fr)); }
}
@media (max-width: 1050px) {
  .topbar { flex-direction: column; align-items: flex-start; }
  .interactive-shell { grid-template-columns: 1fr; }
  .right-panel { grid-column: auto; }
  .center-panel { grid-template-rows: auto 430px auto; }
  .studio-stage { inset: 58px 36px 62px; }
  .leaderboard-grid { grid-template-columns: 1fr; }
}
@media (max-width: 700px) {
  .evz-interactive-page { padding: 14px; }
  .top-actions > * { width: 100%; justify-content: center; }
  .center-top,
  .bottom-head,
  .leaderboard-hero { flex-direction: column; align-items: flex-start; }
  .tab-grid,
  .live-preset-grid,
  .builder-grid,
  .state-actions,
  .mapping-grid,
  .studio-control-grid,
  .reward-grid { grid-template-columns: 1fr; }
  .preview-card.bottom-left { grid-template-columns: 1fr 1fr; right: 16px; }
  .preview-card.top-right {
    left: 16px;
    right: 16px;
    top: auto;
    bottom: 84px;
    max-width: none;
  }
  .node-inspector { display: none; }
  .logic-node { width: 140px; }
  .studio-stage { inset: 66px 18px 78px; }
  .game-card { width: min(300px, calc(100% - 24px)); }
  .scoreboard, .reaction-meter, .countdown-orb { display: none; }
  .lab-camera-error {
    left: 16px;
    right: 16px;
    bottom: 16px;
  }
}
`;
