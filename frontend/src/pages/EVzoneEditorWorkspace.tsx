import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type EditorEffectId = 'beauty' | 'lut' | 'crown' | 'blur' | 'sparkle' | 'echo';

type EditorEffect = {
  id: EditorEffectId;
  name: string;
  tone: 'green' | 'orange' | 'gray';
  intensity: number;
  on: boolean;
};

const initialEditorEffects: EditorEffect[] = [
  { id: 'beauty', name: 'Beauty Retouch', tone: 'green', intensity: 74, on: true },
  { id: 'lut', name: 'Cinematic LUT', tone: 'orange', intensity: 61, on: true },
  { id: 'crown', name: 'Face AR Crown', tone: 'green', intensity: 89, on: true },
  { id: 'blur', name: 'Background Blur', tone: 'gray', intensity: 52, on: false },
  { id: 'sparkle', name: 'Sparkle VFX', tone: 'orange', intensity: 64, on: true },
  { id: 'echo', name: 'Time Echo', tone: 'gray', intensity: 28, on: false },
];

export default function EVzoneEditorWorkspace() {
  const leftPanelTabs = ['Hierarchy', 'Assets', 'Components'] as const;
  const rightPanelTabs = ['Inspector', 'Preview', 'Effects'] as const;
  const bottomTabs = ['Timeline', 'Visual Scripting', 'Console'] as const;

  const [leftTab, setLeftTab] = useState<(typeof leftPanelTabs)[number]>('Hierarchy');
  const [rightTab, setRightTab] = useState<(typeof rightPanelTabs)[number]>('Inspector');
  const [bottomTab, setBottomTab] = useState<(typeof bottomTabs)[number]>('Timeline');
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [layoutName, setLayoutName] = useState('Creator Pro Layout');
  const [activeViewportMode, setActiveViewportMode] = useState<'2D' | '3D'>('3D');
  const [previewSource, setPreviewSource] = useState<'Webcam' | 'Studio Cam' | 'Media'>('Webcam');
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [effects, setEffects] = useState<EditorEffect[]>(initialEditorEffects);
  const [viewportSource, setViewportSource] = useState<'camera' | 'upload'>('camera');
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [uploadedImageName, setUploadedImageName] = useState<string | null>(null);
  const viewportVideoRef = useRef<HTMLVideoElement | null>(null);
  const viewportEchoVideoRef = useRef<HTMLVideoElement | null>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);
  const imageUploadInputRef = useRef<HTMLInputElement | null>(null);
  const uploadedImageObjectUrlRef = useRef<string | null>(null);

  const projectMeta = {
    name: 'Morning Show Intro AR Package',
    autosave: 'Autosaved 14s ago',
    version: 'v12.4',
    quality: 92,
    sceneObjects: 38,
    drawCalls: 64,
    fps: 59,
  };

  const budget = useMemo(
    () => [
      { label: 'Memory', value: 71, tone: 'warning' },
      { label: 'GPU', value: 58, tone: 'good' },
      { label: 'Textures', value: 67, tone: 'good' },
      { label: 'Scripts', value: 43, tone: 'good' },
    ],
    []
  );

  const hierarchyItems = [
    {
      title: 'Main Scene',
      children: [
        'Host Camera',
        'Guest Camera',
        'Face Tracker',
        'AR Crown Group',
        'Glow VFX Emitter',
        'Title Overlay',
        'Countdown Layer',
      ],
    },
    {
      title: 'Utility',
      children: ['Lighting Rig', 'Environment Map', 'Interaction Nodes', 'Scene Audio'],
    },
  ];

  const assetGroups = [
    {
      title: 'Project Files',
      items: ['host_face_mask.glb', 'title_intro.lottie', 'show_theme.wav', 'gradient_lut.cube'],
    },
    {
      title: 'Generated AI Assets',
      items: ['gold_halo_v3.png', 'studio_lowerthird_set.json'],
    },
    {
      title: 'Warnings',
      items: ['speaker_card.psd is missing fonts', 'replace old_countdown.mov'],
    },
  ];

  const components = [
    'Face Tracker',
    'Beauty Retouch',
    'Hand Gesture Detector',
    'Particle Emitter',
    'Timer',
    'Studio Trigger',
    'Material Switcher',
    'Audio Reactive Pulse',
  ];

  const inspectorBlocks = [
    {
      title: 'Transform',
      rows: [
        ['Position', 'X: 0.12  Y: 1.03  Z: -2.2'],
        ['Rotation', 'X: 0°  Y: 12°  Z: 0°'],
        ['Scale', '1.00'],
      ],
    },
    {
      title: 'Render & Material',
      rows: [
        ['Material', 'Holographic Gold'],
        ['Blend Mode', 'Screen'],
        ['Opacity', '88%'],
        ['Brightness', '74%'],
      ],
    },
    {
      title: 'Validation',
      rows: [
        ['Face Occlusion', 'Enabled'],
        ['Live-safe Check', 'Passed'],
        ['Warnings', '1 minor texture size warning'],
      ],
    },
  ];

  const previewSources = ['Webcam', 'Studio Cam', 'Media'] as const;

  const timelineClips = [
    { name: 'Scene Intro', left: 2, width: 18, lane: 1, color: '#03cd8c' },
    { name: 'Name Reveal', left: 24, width: 14, lane: 1, color: '#f77f00' },
    { name: 'Sparkle Burst', left: 40, width: 10, lane: 2, color: '#03cd8c' },
    { name: 'Countdown', left: 53, width: 20, lane: 3, color: '#f59e0b' },
    { name: 'Outro Fade', left: 77, width: 16, lane: 1, color: '#f77f00' },
  ];

  const nodeCards = [
    'On Scene Start',
    'Face Smile Trigger',
    'Play Crown Animation',
    'Spawn Sparkle Burst',
    'Set Countdown Visible',
    'Send Studio Event',
  ];

  const consoleLines = [
    '[12:02:11] Autosave completed successfully',
    '[12:02:18] Budget scan: 1 warning, 0 blockers',
    '[12:02:22] Studio Bridge connected to Live Studio A',
    '[12:02:26] Missing asset repair suggestion: replace old_countdown.mov',
    '[12:02:31] Preview switched to Webcam',
  ];

  const shortcuts = [
    ['⌘/Ctrl + K', 'Open command palette'],
    ['⌘/Ctrl + S', 'Save project snapshot'],
    ['Shift + Space', 'Preview in EVzone'],
    ['⌘/Ctrl + E', 'Send to Studio wizard'],
    ['1 / 2', 'Toggle 2D / 3D viewport'],
    ['⌥/Alt + L', 'Save workspace layout'],
  ];

  const effectById = useMemo(() => {
    const map = new Map<EditorEffectId, EditorEffect>();
    effects.forEach((effect) => map.set(effect.id, effect));
    return map;
  }, [effects]);

  const beautyEffect = effectById.get('beauty') ?? initialEditorEffects[0];
  const lutEffect = effectById.get('lut') ?? initialEditorEffects[1];
  const crownEffect = effectById.get('crown') ?? initialEditorEffects[2];
  const blurEffect = effectById.get('blur') ?? initialEditorEffects[3];
  const sparkleEffect = effectById.get('sparkle') ?? initialEditorEffects[4];
  const echoEffect = effectById.get('echo') ?? initialEditorEffects[5];

  const viewportFilter = useMemo(() => {
    const beautyBrightness = beautyEffect.on ? beautyEffect.intensity * 0.0024 : 0;
    const beautySoften = beautyEffect.on ? beautyEffect.intensity * 0.008 : 0;
    const lutContrast = lutEffect.on ? lutEffect.intensity * 0.0023 : 0;
    const lutSaturation = lutEffect.on ? lutEffect.intensity * 0.0034 : 0;
    const lutHueRotate = lutEffect.on ? Math.round(lutEffect.intensity * 0.2) : 0;
    const backgroundBlur = blurEffect.on ? blurEffect.intensity * 0.03 : 0;

    return [
      `brightness(${(1 + beautyBrightness).toFixed(3)})`,
      `contrast(${(1 + lutContrast).toFixed(3)})`,
      `saturate(${(1 + lutSaturation).toFixed(3)})`,
      `hue-rotate(${lutHueRotate}deg)`,
      `blur(${(beautySoften + backgroundBlur).toFixed(2)}px)`,
    ].join(' ');
  }, [beautyEffect, blurEffect, lutEffect]);

  const showUploadedImage = Boolean(uploadedImageUrl) && viewportSource === 'upload';
  const showCameraFeed = cameraActive && viewportSource === 'camera';
  const crownOpacity = crownEffect.on ? Math.max(0.18, crownEffect.intensity / 100) : 0;
  const haloOpacity = crownEffect.on ? Math.max(0.1, crownEffect.intensity / 160) : 0;
  const sparkleOpacity = sparkleEffect.on ? sparkleEffect.intensity / 150 : 0;
  const echoOpacity = echoEffect.on ? echoEffect.intensity / 260 : 0;
  const echoOffset = echoEffect.on ? Math.max(2, Math.round(echoEffect.intensity / 7)) : 0;

  const updateEffectToggle = useCallback((effectId: EditorEffectId, enabled: boolean) => {
    setEffects((current) => current.map((effect) => (
      effect.id === effectId ? { ...effect, on: enabled } : effect
    )));
  }, []);

  const updateEffectIntensity = useCallback((effectId: EditorEffectId, intensity: number) => {
    setEffects((current) => current.map((effect) => (
      effect.id === effectId ? { ...effect, intensity } : effect
    )));
  }, []);

  const stopCamera = useCallback(() => {
    cameraStreamRef.current?.getTracks().forEach((track) => track.stop());
    cameraStreamRef.current = null;
    if (viewportVideoRef.current) {
      viewportVideoRef.current.srcObject = null;
    }
    if (viewportEchoVideoRef.current) {
      viewportEchoVideoRef.current.srcObject = null;
    }
    setCameraActive(false);
  }, []);

  const resolveCameraErrorMessage = useCallback((error: unknown) => {
    if (!window.isSecureContext) {
      return 'Camera needs a secure origin. Open this app on https:// or http://localhost.';
    }
    if (error instanceof DOMException) {
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        return 'Camera permission was blocked. Allow camera access in browser site settings and retry.';
      }
      if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        return 'No camera device was found. Connect a camera and retry.';
      }
      if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
        return 'Camera is busy in another app or tab. Close the other app and retry.';
      }
      if (error.name === 'OverconstrainedError') {
        return 'Camera constraints were unsupported. Retrying with default camera settings may help.';
      }
    }
    return 'Camera could not start. Check permissions and device availability, then retry.';
  }, []);

  const startCamera = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError('Camera is unavailable in this browser context. Use HTTPS or localhost.');
      setCameraActive(false);
      return;
    }

    try {
      setCameraError(null);
      cameraStreamRef.current?.getTracks().forEach((track) => track.stop());

      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });
      } catch (primaryError) {
        // Retry with looser constraints for browsers/devices that reject facingMode.
        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });
      }

      cameraStreamRef.current?.getTracks().forEach((track) => track.stop());
      cameraStreamRef.current = stream;

      if (viewportVideoRef.current) {
        viewportVideoRef.current.srcObject = stream;
        const playPromise = viewportVideoRef.current.play();
        if (playPromise) {
          await playPromise.catch(() => undefined);
        }
      }
      if (viewportEchoVideoRef.current) {
        viewportEchoVideoRef.current.srcObject = stream;
        const playPromise = viewportEchoVideoRef.current.play();
        if (playPromise) {
          await playPromise.catch(() => undefined);
        }
      }

      setCameraActive(true);
    } catch (error) {
      stopCamera();
      setCameraError(resolveCameraErrorMessage(error));
    }
  }, [resolveCameraErrorMessage, stopCamera]);

  const handleViewportImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setCameraError('Please upload an image file (PNG, JPG, WEBP, etc).');
      if (imageUploadInputRef.current) imageUploadInputRef.current.value = '';
      return;
    }

    if (uploadedImageObjectUrlRef.current) {
      URL.revokeObjectURL(uploadedImageObjectUrlRef.current);
      uploadedImageObjectUrlRef.current = null;
    }

    const imageUrl = URL.createObjectURL(file);
    uploadedImageObjectUrlRef.current = imageUrl;
    setUploadedImageUrl(imageUrl);
    setUploadedImageName(file.name);
    setViewportSource('upload');
    setPreviewSource('Media');
    setCameraError(null);
    if (imageUploadInputRef.current) imageUploadInputRef.current.value = '';
  }, []);

  const clearUploadedImage = useCallback(() => {
    if (uploadedImageObjectUrlRef.current) {
      URL.revokeObjectURL(uploadedImageObjectUrlRef.current);
      uploadedImageObjectUrlRef.current = null;
    }
    setUploadedImageUrl(null);
    setUploadedImageName(null);
    setViewportSource('camera');
    setPreviewSource('Webcam');
  }, []);

  const openImagePicker = useCallback(() => {
    imageUploadInputRef.current?.click();
  }, []);

  useEffect(() => {
    void startCamera();
    return () => {
      stopCamera();
    };
  }, [startCamera, stopCamera]);

  useEffect(() => () => {
    if (uploadedImageObjectUrlRef.current) {
      URL.revokeObjectURL(uploadedImageObjectUrlRef.current);
      uploadedImageObjectUrlRef.current = null;
    }
  }, []);

  const renderLeftPanel = () => {
    if (leftTab === 'Hierarchy') {
      return (
        <div className="panel-scroll">
          {hierarchyItems.map((group) => (
            <div key={group.title} className="group-card">
              <div className="group-title">{group.title}</div>
              <div className="tree-list">
                {group.children.map((child) => (
                  <div className="tree-item" key={child}>
                    <span className="tree-bullet" />
                    <span>{child}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (leftTab === 'Assets') {
      return (
        <div className="panel-scroll">
          {assetGroups.map((group) => (
            <div key={group.title} className="group-card">
              <div className="group-title">{group.title}</div>
              <div className="asset-list">
                {group.items.map((item) => (
                  <div key={item} className={`asset-item ${group.title === 'Warnings' ? 'warning' : ''}`}>
                    <span className="asset-dot" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <button className="ghost-btn full" data-evz-autowire="1">Repair Missing Assets</button>
        </div>
      );
    }

    return (
      <div className="panel-scroll component-grid">
        {components.map((item) => (
          <button key={item} className="component-card" data-evz-autowire="1">
            <span className="component-icon">◧</span>
            <span>{item}</span>
          </button>
        ))}
      </div>
    );
  };

  const renderRightPanel = () => {
    if (rightTab === 'Preview') {
      return (
        <div className="panel-scroll">
          <div className="preview-toolbar segmented">
            {previewSources.map((source) => (
              <button
                key={source}
                className={`seg-btn ${previewSource === source ? 'active' : ''}`}
                onClick={() => setPreviewSource(source)}
              >
                {source}
              </button>
            ))}
          </div>
          <div className="mini-preview-card">
            <div className="preview-stage small">
              <div className="device-frame">
                <div className="preview-avatar" />
                <div className="preview-bars">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            </div>
            <div className="preview-meta-grid">
              <div><strong>Source</strong><span>{previewSource}</span></div>
              <div><strong>FPS</strong><span>59.2</span></div>
              <div><strong>View</strong><span>Before / After</span></div>
              <div><strong>Target</strong><span>iPhone 15 Pro</span></div>
            </div>
          </div>
        </div>
      );
    }

    if (rightTab === 'Effects') {
      return (
        <div className="panel-scroll">
          <div className="group-card">
            <div className="group-title">Viewport Source</div>
            <div className="preview-toolbar segmented">
              <button
                type="button"
                className={`seg-btn ${viewportSource === 'camera' ? 'active' : ''}`}
                onClick={() => {
                  setViewportSource('camera');
                  setPreviewSource('Webcam');
                }}
              >
                Camera
              </button>
              <button
                type="button"
                className={`seg-btn ${viewportSource === 'upload' ? 'active' : ''}`}
                onClick={() => {
                  setViewportSource('upload');
                  setPreviewSource('Media');
                }}
                disabled={!uploadedImageUrl}
              >
                Uploaded Image
              </button>
            </div>
            <input
              ref={imageUploadInputRef}
              type="file"
              accept="image/*"
              className="hidden-upload-input"
              onChange={handleViewportImageUpload}
            />
            <div className="button-row wrap">
              <button type="button" className="ghost-btn" onClick={openImagePicker}>Upload Image</button>
              <button
                type="button"
                className="ghost-btn"
                onClick={clearUploadedImage}
                disabled={!uploadedImageUrl}
              >
                Clear Image
              </button>
            </div>
            <div className="muted">
              {uploadedImageName ? `Loaded: ${uploadedImageName}` : 'Upload an image to preview your edits in the main viewport.'}
            </div>
          </div>

          <div className="stack-header">
            <div>
              <div className="group-title">Effect Stack</div>
              <div className="muted">Beauty + LUT + AR + VFX layering</div>
            </div>
            <span className="status-chip live">Live-safe</span>
          </div>
          <div className="effect-stack-list">
            {effects.map((effect) => (
              <div key={effect.id} className="effect-card">
                <div className="effect-top">
                  <div className={`effect-tag ${effect.tone}`}>{effect.name}</div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={effect.on}
                      onChange={(event) => updateEffectToggle(effect.id, event.target.checked)}
                    />
                    <span />
                  </label>
                </div>
                <div className="effect-row">
                  <span>Intensity</span>
                  <span>{effect.intensity}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={effect.intensity}
                  onChange={(event) => updateEffectIntensity(effect.id, Number(event.target.value))}
                  className="effect-slider"
                  disabled={!effect.on}
                />
                <div className="mini-progress"><span style={{ width: `${effect.intensity}%` }} /></div>
              </div>
            ))}
          </div>
          <button className="primary-btn full" data-evz-autowire="1">Create / Apply Preset</button>
        </div>
      );
    }

    return (
      <div className="panel-scroll inspector-wrap">
        {inspectorBlocks.map((block) => (
          <div key={block.title} className="group-card">
            <div className="group-title">{block.title}</div>
            <div className="property-grid">
              {block.rows.map(([key, value]) => (
                <div key={key} className="property-row">
                  <span>{key}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className="group-card">
          <div className="group-title">Quick Actions</div>
          <div className="button-row wrap">
            <button className="ghost-btn" data-evz-autowire="1">Add Component</button>
            <button className="ghost-btn" data-evz-autowire="1">Add Interaction</button>
            <button className="ghost-btn" data-evz-autowire="1">Apply Preset</button>
          </div>
        </div>
      </div>
    );
  };

  const renderBottomPanel = () => {
    if (bottomTab === 'Visual Scripting') {
      return (
        <div className="bottom-scroll">
          <div className="nodes-wrap">
            {nodeCards.map((node, i) => (
              <div key={node} className={`node-card ${i % 2 === 0 ? 'green' : 'orange'}`}>
                <div className="node-title">{node}</div>
                <div className="node-meta">Connected • Ready</div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (bottomTab === 'Console') {
      return (
        <div className="bottom-scroll console-list">
          {consoleLines.map((line) => (
            <div key={line} className="console-line">{line}</div>
          ))}
        </div>
      );
    }

    return (
      <div className="bottom-scroll">
        <div className="timeline-ruler">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="tick">{i * 10}s</div>
          ))}
        </div>
        <div className="timeline-lanes">
          {[1, 2, 3].map((lane) => (
            <div key={lane} className="timeline-lane">
              <div className="lane-label">Lane {lane}</div>
              <div className="lane-track">
                {timelineClips.filter((clip) => clip.lane === lane).map((clip) => (
                  <div
                    key={clip.name}
                    className="timeline-clip"
                    style={{ left: `${clip.left}%`, width: `${clip.width}%`, background: clip.color }}
                  >
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
    <div className="evz-page">
      <style>{styles}</style>
      <div className="command-bar">
        <div className="brand-wrap">
          <div className="brand-badge">EV</div>
          <div>
            <div className="eyebrow">EVzone Effect Creator</div>
            <div className="brand-title">Editor Workspace</div>
          </div>
        </div>
        <div className="command-actions">
          <div className="meta-pill studio">Connected to EVzone Live Studio</div>
          <button className="ghost-btn" onClick={() => setShowCommandPalette(true)}>Command Palette</button>
          <button className="ghost-btn" onClick={() => setShowShortcuts(true)}>Shortcuts</button>
        </div>
      </div>

      <div className="workspace-shell">
        <header className="titlebar">
          <div className="titlebar-left">
            <div>
              <div className="project-title">{projectMeta.name}</div>
              <div className="project-subtitle">{projectMeta.version} • {projectMeta.autosave}</div>
            </div>
            <div className="button-row compact">
              <button className="ghost-btn" data-evz-autowire="1">Undo</button>
              <button className="ghost-btn" data-evz-autowire="1">Redo</button>
            </div>
          </div>

          <div className="titlebar-center">
            <div className="budget-meter">
              <div className="budget-head">
                <span>Runtime Budget</span>
                <strong>Healthy</strong>
              </div>
              <div className="budget-grid">
                {budget.map((item) => (
                  <div key={item.label} className="budget-item">
                    <div className="budget-row">
                      <span>{item.label}</span>
                      <span>{item.value}%</span>
                    </div>
                    <div className="mini-progress"><span className={item.tone} style={{ width: `${item.value}%` }} /></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="titlebar-right">
            <button className="ghost-btn" data-evz-autowire="1">Preview in EVzone</button>
            <button className="primary-btn" data-evz-autowire="1">Send to Studio</button>
            <button className="accent-btn" data-evz-autowire="1">AI Copilot</button>
            <select
              className="select-control"
              value={layoutName}
              onChange={(e) => setLayoutName(e.target.value)}
            >
              <option>Creator Pro Layout</option>
              <option>Compact Review Layout</option>
              <option>Motion Design Layout</option>
            </select>
          </div>
        </header>

        <section className="workspace-grid">
          <aside className="panel left-panel">
            <div className="panel-header">
              <div className="tab-row">
                {leftPanelTabs.map((tab) => (
                  <button
                    key={tab}
                    className={`tab-btn ${leftTab === tab ? 'active' : ''}`}
                    onClick={() => setLeftTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
            {renderLeftPanel()}
          </aside>

          <main className="panel center-panel">
            <div className="panel-header between">
              <div className="tab-row">
                <button
                  className={`tab-btn ${activeViewportMode === '2D' ? 'active' : ''}`}
                  onClick={() => setActiveViewportMode('2D')}
                >
                  2D
                </button>
                <button
                  className={`tab-btn ${activeViewportMode === '3D' ? 'active' : ''}`}
                  onClick={() => setActiveViewportMode('3D')}
                >
                  3D
                </button>
              </div>
              <div className="meta-strip">
                <span className="meta-pill">Grid</span>
                <span className="meta-pill">Safe Areas</span>
                <span className="meta-pill">Lighting Preview</span>
                <span className="meta-pill">FPS {projectMeta.fps}</span>
              </div>
            </div>
            <div className={`viewport-stage ${showUploadedImage ? 'image-focus' : ''}`}>
              <video
                ref={viewportEchoVideoRef}
                muted
                playsInline
                autoPlay
                className={`viewport-camera ghost ${showCameraFeed && echoEffect.on ? 'live' : ''}`}
                style={{ filter: viewportFilter, transform: `scaleX(-1) translateX(${echoOffset}px)`, opacity: echoOpacity }}
              />
              <video
                ref={viewportVideoRef}
                muted
                playsInline
                autoPlay
                className={`viewport-camera ${showCameraFeed ? 'live' : ''}`}
                style={{ filter: viewportFilter }}
              />
              {uploadedImageUrl && (
                <img
                  src={uploadedImageUrl}
                  alt="Viewport upload preview"
                  className={`viewport-image ghost ${showUploadedImage && echoEffect.on ? 'live' : ''}`}
                  style={{ filter: viewportFilter, transform: `translateX(${echoOffset}px)`, opacity: echoOpacity }}
                />
              )}
              {uploadedImageUrl && (
                <img
                  src={uploadedImageUrl}
                  alt="Viewport upload preview"
                  className={`viewport-image ${showUploadedImage ? 'live' : ''}`}
                  style={{ filter: viewportFilter }}
                />
              )}
              <div
                className="viewport-camera-scrim"
                style={{ opacity: showUploadedImage ? 0.24 : 1 }}
              />
              <div className="viewport-grid" />
              <div className="safe-area outer" />
              <div className="safe-area inner" />
              <div className="viewport-sparkle-layer" style={{ opacity: sparkleOpacity }} />
              <div className="viewport-object crown" style={{ opacity: crownOpacity }} />
              <div className="viewport-object halo" style={{ opacity: haloOpacity }} />
              <div className="gizmo x">X</div>
              <div className="gizmo y">Y</div>
              <div className="gizmo z">Z</div>
              {!showUploadedImage && (
                <div className="viewport-headline">
                  <div className="headline-badge">Scene Viewport</div>
                  <h2>Design in a premium, dockable creator workspace.</h2>
                  <p>
                    Build Beauty, AR, background, VFX, and interactive studio experiences with an EVzone-native editor.
                  </p>
                </div>
              )}
              {!showCameraFeed && !showUploadedImage && (
                <div className="viewport-empty-state">
                  <strong>No active preview source</strong>
                  <span>Turn camera on or upload an image from the Effects tab.</span>
                </div>
              )}
              <div className="scene-stats">
                <div><strong>{projectMeta.sceneObjects}</strong><span>Objects</span></div>
                <div><strong>{projectMeta.drawCalls}</strong><span>Draw Calls</span></div>
                <div><strong>{projectMeta.quality}</strong><span>Quality</span></div>
              </div>
              <div className="camera-status">
                <span className={`camera-pill ${cameraActive ? 'on' : 'off'}`}>
                  {cameraActive ? 'Camera On' : 'Camera Off'}
                </span>
                <span className="camera-pill source">
                  {showUploadedImage ? 'Source: Uploaded Image' : showCameraFeed ? 'Source: Camera' : 'Source: None'}
                </span>
                {cameraActive ? (
                  <button type="button" className="ghost-btn camera-btn" onClick={stopCamera}>Turn Camera Off</button>
                ) : (
                  <button type="button" className="ghost-btn camera-btn" onClick={() => void startCamera()}>Turn Camera On</button>
                )}
              </div>
              {cameraError && <div className="camera-error">{cameraError}</div>}
            </div>
          </main>

          <aside className="panel right-panel">
            <div className="panel-header">
              <div className="tab-row">
                {rightPanelTabs.map((tab) => (
                  <button
                    key={tab}
                    className={`tab-btn ${rightTab === tab ? 'active' : ''}`}
                    onClick={() => setRightTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
            {renderRightPanel()}
          </aside>
        </section>

        <section className="bottom-panel panel">
          <div className="panel-header between">
            <div className="tab-row">
              {bottomTabs.map((tab) => (
                <button
                  key={tab}
                  className={`tab-btn ${bottomTab === tab ? 'active' : ''}`}
                  onClick={() => setBottomTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="button-row compact">
              <button className="ghost-btn" data-evz-autowire="1">Save Layout</button>
              <button className="ghost-btn" data-evz-autowire="1">Restore Layout</button>
              <button className="ghost-btn" data-evz-autowire="1">Version Snapshot</button>
            </div>
          </div>
          {renderBottomPanel()}
        </section>
      </div>

      {showCommandPalette && (
        <div className="overlay" onClick={() => setShowCommandPalette(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <div>
                <div className="eyebrow">Quick Actions</div>
                <h3>Command Palette</h3>
              </div>
              <button className="ghost-btn" onClick={() => setShowCommandPalette(false)}>Close</button>
            </div>
            <input className="search-input" placeholder="Search actions, tools, templates, components, and docs" />
            <div className="command-list">
              {[
                'Create Face AR preset',
                'Open Tracking Lab',
                'Generate with AI Copilot',
                'Preview in EVzone Studio',
                'Repair missing assets',
                'Save current layout',
              ].map((item) => (
                <button key={item} className="command-item" data-evz-autowire="1">{item}</button>
              ))}
            </div>
          </div>
        </div>
      )}

      {showShortcuts && (
        <div className="overlay" onClick={() => setShowShortcuts(false)}>
          <div className="modal-card small" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <div>
                <div className="eyebrow">Productivity</div>
                <h3>Keyboard Shortcuts</h3>
              </div>
              <button className="ghost-btn" onClick={() => setShowShortcuts(false)}>Close</button>
            </div>
            <div className="shortcut-list">
              {shortcuts.map(([key, label]) => (
                <div key={key} className="shortcut-row">
                  <kbd>{key}</kbd>
                  <span>{label}</span>
                </div>
              ))}
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
  --evz-text: var(--evz-ink, #0f172a);
  --evz-subtle: var(--evz-muted, #5b6472);
  --evz-divider: var(--evz-line, rgba(148, 163, 184, 0.22));
  --evz-divider-soft: var(--evz-soft-line, rgba(148, 163, 184, 0.16));
  --evz-card: var(--evz-card);
  --evz-card-strong: var(--app-evz-card-solid);
  --evz-bg: var(--evz-app-bg, linear-gradient(180deg, #f8fbfa 0%, #f2f5f7 100%));
  --evz-gray: #a6a6a6;
  --evz-light: var(--app-evz-light);
  --shadow-lg: 0 28px 70px rgba(15, 23, 42, 0.12);
  --shadow-md: 0 18px 44px rgba(15, 23, 42, 0.10);
  --radius-xl: 24px;
  --radius-lg: 18px;
  --radius-md: 14px;
}
* { box-sizing: border-box; }
body { margin: 0; }
.evz-page {
  min-height: 100vh;
  width: 100%;
  max-width: 100%;
  background: var(--evz-bg);
  color: var(--evz-text);
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  padding: clamp(10px, 1.2vw, 20px);
  overflow-x: clip;
}
.command-bar, .titlebar, .panel, .modal-card {
  border: 1px solid var(--evz-divider-soft);
  background: var(--evz-card);
  backdrop-filter: blur(18px);
}
.command-bar {
  width: 100%;
  margin: 0 0 14px;
  border-radius: var(--radius-xl);
  padding: 16px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  box-shadow: var(--shadow-md);
}
.brand-wrap, .titlebar-left, .titlebar-right, .button-row, .stack-header, .effect-top, .budget-row, .panel-header.between, .preview-toolbar, .command-actions {
  display: flex;
  align-items: center;
}
.brand-wrap { gap: 14px; }
.brand-badge {
  width: 44px; height: 44px; border-radius: 14px;
  display: grid; place-items: center;
  color: white; font-weight: 800;
  background: var(--evz-green);
  box-shadow: 0 16px 32px rgba(3, 205, 140, 0.28);
}
.eyebrow {
  font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; font-weight: 700; color: var(--evz-orange);
}
.brand-title { font-size: 22px; font-weight: 800; margin-top: 2px; }
.workspace-shell { width: 100%; max-width: 100%; margin: 0; display: grid; gap: 14px; min-width: 0; }
.titlebar {
  border-radius: var(--radius-xl);
  padding: 16px 18px;
  display: grid;
  gap: 16px;
  grid-template-columns: 1.1fr 1.2fr 1fr;
  box-shadow: var(--shadow-md);
}
.titlebar-left { justify-content: space-between; gap: 16px; }
.titlebar-center, .titlebar-right { display: flex; align-items: center; gap: 12px; }
.titlebar-right { justify-content: flex-end; flex-wrap: wrap; }
.project-title { font-size: 21px; font-weight: 800; }
.project-subtitle { color: var(--evz-subtle); font-size: 13px; margin-top: 4px; }
.budget-meter {
  width: 100%;
  border-radius: var(--radius-lg);
  background: linear-gradient(180deg, rgba(3,205,140,0.08), rgba(247,127,0,0.04));
  border: 1px solid rgba(3,205,140,0.16);
  padding: 12px;
}
.budget-head { display: flex; align-items: center; justify-content: space-between; font-size: 13px; margin-bottom: 10px; }
.budget-head strong { color: var(--evz-green); }
.budget-grid { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 10px; }
.budget-item { padding: 8px 10px; border-radius: 12px; background: color-mix(in srgb, var(--evz-card-strong) 74%, transparent); }
.workspace-grid { display: grid; grid-template-columns: minmax(260px, 300px) minmax(0, 1fr) minmax(280px, 340px); gap: 14px; min-height: 690px; min-width: 0; }
.panel {
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  overflow: hidden;
}
.left-panel, .right-panel, .bottom-panel { display: flex; flex-direction: column; }
.center-panel { display: flex; flex-direction: column; }
.panel-header {
  padding: 14px 16px;
  border-bottom: 1px solid var(--evz-divider);
  background: var(--evz-card);
}
.tab-row, .meta-strip, .segmented { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.tab-btn, .ghost-btn, .primary-btn, .accent-btn, .seg-btn, .command-item, .component-card {
  border: 1px solid var(--evz-divider-soft);
  background: var(--evz-card-strong);
  color: var(--evz-text);
  border-radius: 12px;
  padding: 10px 12px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: 180ms ease;
}
.tab-btn:hover, .ghost-btn:hover, .seg-btn:hover, .command-item:hover, .component-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 20px rgba(15, 23, 42, 0.08);
}
.tab-btn:disabled, .ghost-btn:disabled, .seg-btn:disabled, .primary-btn:disabled, .accent-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}
.tab-btn.active, .seg-btn.active {
  color: white;
  background: linear-gradient(135deg, var(--evz-green), #10b981);
  border-color: transparent;
}
.ghost-btn { background: color-mix(in srgb, var(--evz-card-strong) 94%, transparent); }
.primary-btn {
  color: white;
  border-color: transparent;
  background: linear-gradient(135deg, var(--evz-green), #14b8a6);
  box-shadow: 0 16px 34px rgba(3,205,140,0.26);
}
.accent-btn {
  color: white;
  border-color: transparent;
  background: linear-gradient(135deg, var(--evz-orange), #fb923c);
  box-shadow: 0 16px 34px rgba(247,127,0,0.24);
}
.full { width: 100%; justify-content: center; }
.select-control, .search-input {
  width: 100%;
  border-radius: 12px;
  border: 1px solid var(--evz-divider);
  background: var(--evz-card-strong);
  padding: 10px 12px;
  color: var(--evz-text);
  font-size: 13px;
  outline: none;
}
.meta-pill {
  padding: 8px 10px;
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.12);
  border: 1px solid rgba(148, 163, 184, 0.18);
  color: var(--evz-subtle);
  font-size: 12px;
  font-weight: 700;
}
.meta-pill.studio {
  color: var(--evz-green);
  background: rgba(3,205,140,0.10);
  border-color: rgba(3,205,140,0.18);
}
.panel-scroll, .bottom-scroll { padding: 16px; overflow: auto; }
.panel-scroll { display: grid; gap: 14px; }
.group-card {
  border: 1px solid var(--evz-divider-soft);
  border-radius: 16px;
  background: linear-gradient(180deg, color-mix(in srgb, var(--evz-card-strong) 92%, transparent), color-mix(in srgb, var(--evz-card-strong) 84%, transparent));
  padding: 14px;
}
.group-title { font-size: 12px; text-transform: uppercase; letter-spacing: 0.14em; color: var(--evz-orange); font-weight: 800; margin-bottom: 10px; }
.tree-list, .asset-list, .property-grid, .effect-stack-list, .shortcut-list, .command-list, .console-list { display: grid; gap: 10px; }
.tree-item, .asset-item, .property-row, .shortcut-row, .console-line {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 12px;
  background: var(--evz-card-strong);
  border: 1px solid var(--evz-divider-soft);
  font-size: 13px;
}
.tree-item { justify-content: flex-start; }
.tree-bullet, .asset-dot {
  width: 8px; height: 8px; border-radius: 999px; background: var(--evz-green); display: inline-block;
}
.asset-item.warning { border-color: rgba(247,127,0,0.24); background: var(--evz-warning-surface); }
.component-grid { grid-template-columns: 1fr 1fr; }
.component-card {
  min-height: 94px;
  display: flex; flex-direction: column; align-items: flex-start; justify-content: space-between;
  text-align: left;
}
.component-icon {
  width: 34px; height: 34px; border-radius: 10px; display: grid; place-items: center;
  background: rgba(3,205,140,0.12); color: var(--evz-green); font-weight: 800;
}
.viewport-stage {
  position: relative;
  flex: 1;
  margin: 16px;
  min-height: 520px;
  border-radius: 24px;
  overflow: hidden;
  border: 1px solid rgba(3,205,140,0.16);
  background:
    radial-gradient(circle at 30% 20%, rgba(3,205,140,0.18), transparent 28%),
    radial-gradient(circle at 75% 30%, rgba(247,127,0,0.18), transparent 24%),
    linear-gradient(180deg, color-mix(in srgb, var(--evz-card-strong) 95%, transparent) 0%, color-mix(in srgb, var(--evz-card-strong) 85%, #dbe5e9 15%) 100%);
}
.viewport-stage.image-focus .viewport-grid { opacity: 0.45; }
.viewport-stage.image-focus .safe-area { opacity: 0.58; }
.viewport-camera, .viewport-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  z-index: 1;
  transition: opacity 220ms ease;
}
.viewport-camera { object-fit: cover; transform: scaleX(-1); }
.viewport-image {
  object-fit: contain;
  padding: 10px;
}
.viewport-camera.ghost, .viewport-image.ghost {
  z-index: 0;
  mix-blend-mode: screen;
}
.viewport-camera.live, .viewport-image.live { opacity: 1; }
.viewport-camera-scrim {
  position: absolute;
  inset: 0;
  z-index: 2;
  background: linear-gradient(180deg, rgba(10, 16, 28, 0.36), rgba(10, 16, 28, 0.18) 42%, rgba(10, 16, 28, 0.36));
}
.viewport-grid {
  position: absolute; inset: 0;
  z-index: 3;
  background-image:
    linear-gradient(rgba(148,163,184,0.13) 1px, transparent 1px),
    linear-gradient(90deg, rgba(148,163,184,0.13) 1px, transparent 1px);
  background-size: 32px 32px;
}
.safe-area {
  position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);
  border: 1.8px dashed rgba(15,23,42,0.18); border-radius: 18px;
  z-index: 4;
}
.safe-area.outer { width: 72%; height: 76%; }
.safe-area.inner { width: 58%; height: 62%; }
.viewport-sparkle-layer {
  position: absolute;
  inset: 0;
  z-index: 5;
  pointer-events: none;
  background:
    radial-gradient(circle at 22% 24%, rgba(255, 255, 255, 0.42), transparent 9%),
    radial-gradient(circle at 68% 34%, rgba(255, 220, 168, 0.46), transparent 12%),
    radial-gradient(circle at 44% 64%, rgba(3, 205, 140, 0.34), transparent 10%),
    radial-gradient(circle at 80% 76%, rgba(255, 255, 255, 0.3), transparent 8%);
}
.viewport-object { position: absolute; border-radius: 999px; z-index: 6; transition: opacity 180ms ease; }
.viewport-object.crown {
  width: 124px; height: 124px; left: 50%; top: 31%; transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(247,127,0,0.30), rgba(247,127,0,0.04));
  border: 2px solid rgba(247,127,0,0.36);
}
.viewport-object.halo {
  width: 240px; height: 240px; left: 52%; top: 53%; transform: translate(-50%, -50%);
  border: 2px solid rgba(3,205,140,0.24);
  background: radial-gradient(circle, rgba(3,205,140,0.06), transparent 65%);
}
.gizmo {
  position: absolute;
  width: 34px; height: 34px; border-radius: 999px; display: grid; place-items: center;
  background: var(--evz-card-strong); border: 1px solid var(--evz-divider-soft); font-weight: 800; font-size: 12px;
  box-shadow: 0 10px 18px rgba(15,23,42,0.08);
  z-index: 8;
}
.gizmo.x { right: 70px; bottom: 70px; color: #ef4444; }
.gizmo.y { right: 116px; bottom: 32px; color: #22c55e; }
.gizmo.z { right: 24px; bottom: 32px; color: #3b82f6; }
.viewport-headline {
  position: absolute; left: 28px; top: 28px; max-width: 420px;
  padding: 20px; border-radius: 20px;
  background: var(--evz-card); border: 1px solid var(--evz-border);
  backdrop-filter: blur(18px);
  z-index: 8;
}
.headline-badge {
  display: inline-flex; padding: 8px 12px; border-radius: 999px; color: var(--evz-green);
  background: rgba(3,205,140,0.10); font-size: 12px; font-weight: 800; margin-bottom: 12px;
}
.viewport-headline h2 { margin: 0 0 10px; font-size: 28px; line-height: 1.15; }
.viewport-headline p { margin: 0; color: var(--evz-subtle); line-height: 1.6; font-size: 14px; }
.viewport-empty-state {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  min-width: min(420px, calc(100% - 38px));
  text-align: center;
  display: grid;
  gap: 6px;
  padding: 14px 16px;
  border-radius: 14px;
  border: 1px solid rgba(148,163,184,0.3);
  background: rgba(15, 23, 42, 0.52);
  color: #f8fafc;
  z-index: 8;
}
.viewport-empty-state strong { font-size: 14px; }
.viewport-empty-state span { font-size: 12px; color: rgba(248, 250, 252, 0.86); }
.scene-stats {
  position: absolute; right: 24px; top: 24px; display: flex; gap: 12px;
  z-index: 8;
}
.scene-stats > div {
  min-width: 88px; padding: 14px; border-radius: 16px; background: var(--evz-card); border: 1px solid var(--evz-border); text-align: center;
}
.scene-stats strong { display: block; font-size: 24px; }
.scene-stats span { color: var(--evz-subtle); font-size: 12px; }
.camera-status {
  position: absolute;
  left: 24px;
  bottom: 24px;
  display: flex;
  gap: 10px;
  align-items: center;
  z-index: 9;
  flex-wrap: wrap;
}
.camera-pill {
  padding: 9px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  border: 1px solid transparent;
}
.camera-pill.on {
  color: #ecfdf5;
  background: rgba(16, 185, 129, 0.7);
  border-color: rgba(110, 231, 183, 0.5);
}
.camera-pill.off {
  color: #fef2f2;
  background: rgba(239, 68, 68, 0.62);
  border-color: rgba(252, 165, 165, 0.45);
}
.camera-pill.source {
  color: #e2e8f0;
  background: rgba(15, 23, 42, 0.6);
  border-color: rgba(148, 163, 184, 0.42);
}
.camera-btn { border-radius: 999px; padding: 9px 12px; }
.camera-error {
  position: absolute;
  left: 24px;
  bottom: 70px;
  max-width: min(62ch, calc(100% - 48px));
  padding: 10px 12px;
  border-radius: 12px;
  background: rgba(127, 29, 29, 0.78);
  border: 1px solid rgba(248, 113, 113, 0.45);
  color: #fef2f2;
  font-size: 12px;
  z-index: 9;
}
.preview-stage.small {
  height: 240px; border-radius: 18px; overflow: hidden;
  background: linear-gradient(180deg, #eff6f4, #fdfefe);
  border: 1px solid var(--evz-divider-soft);
  display: grid; place-items: center;
}
.device-frame {
  width: 170px; height: 240px; border-radius: 32px; border: 8px solid #111827;
  background: linear-gradient(180deg, color-mix(in srgb, var(--evz-card-solid) 82%, #03cd8c 18%), color-mix(in srgb, var(--evz-card-solid) 76%, #f77f00 24%));
  position: relative; padding: 20px;
}
.preview-avatar {
  width: 86px; height: 86px; border-radius: 999px; margin: 24px auto 0;
  background: linear-gradient(135deg, rgba(3,205,140,0.4), rgba(247,127,0,0.4));
}
.preview-bars { position: absolute; bottom: 20px; left: 20px; right: 20px; display: grid; gap: 8px; }
.preview-bars span { height: 10px; border-radius: 999px; background: rgba(15,23,42,0.12); }
.preview-meta-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 12px;
}
.preview-meta-grid > div {
  border-radius: 14px; background: var(--evz-card-strong); border: 1px solid var(--evz-divider-soft); padding: 10px 12px;
  display: grid; gap: 6px;
}
.preview-meta-grid strong { font-size: 12px; color: var(--evz-subtle); }
.preview-meta-grid span { font-weight: 700; font-size: 13px; }
.hidden-upload-input { display: none; }
.effect-card {
  border-radius: 16px; padding: 12px; border: 1px solid var(--evz-divider-soft); background: var(--evz-card-strong);
}
.effect-tag { font-size: 12px; font-weight: 800; }
.effect-tag.green { color: var(--evz-green); }
.effect-tag.orange { color: var(--evz-orange); }
.effect-tag.gray { color: var(--evz-subtle); }
.effect-row { display: flex; align-items: center; justify-content: space-between; font-size: 12px; color: var(--evz-subtle); margin: 10px 0 6px; }
.effect-slider {
  width: 100%;
  accent-color: var(--evz-green);
  margin: 0 0 10px;
}
.effect-slider:disabled {
  opacity: 0.42;
}
.toggle-switch { position: relative; width: 42px; height: 24px; display: inline-flex; }
.toggle-switch input { display: none; }
.toggle-switch span {
  position: absolute; inset: 0; border-radius: 999px; background: rgba(148,163,184,0.28); transition: 180ms ease;
}
.toggle-switch span::after {
  content: ''; position: absolute; width: 18px; height: 18px; left: 3px; top: 3px; border-radius: 999px; background: var(--evz-card-strong); transition: 180ms ease; box-shadow: 0 4px 10px rgba(15,23,42,0.12);
}
.toggle-switch input:checked + span { background: rgba(3,205,140,0.62); }
.toggle-switch input:checked + span::after { transform: translateX(18px); }
.mini-progress {
  width: 100%; height: 8px; border-radius: 999px; background: rgba(148,163,184,0.16); overflow: hidden;
}
.mini-progress span { display: block; height: 100%; border-radius: inherit; background: linear-gradient(90deg, var(--evz-green), var(--evz-orange)); }
.mini-progress span.good { background: linear-gradient(90deg, var(--evz-green), #22c55e); }
.mini-progress span.warning { background: linear-gradient(90deg, var(--evz-orange), #fb923c); }
.muted { color: var(--evz-subtle); font-size: 12px; }
.status-chip {
  padding: 8px 10px; border-radius: 999px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em;
}
.status-chip.live { color: var(--evz-green); background: rgba(3,205,140,0.12); }
.bottom-panel { min-height: 230px; }
.timeline-ruler {
  display: grid; grid-template-columns: repeat(10, 1fr); gap: 0; margin-bottom: 14px;
}
.tick { font-size: 11px; color: var(--evz-subtle); padding-left: 10px; }
.timeline-lanes { display: grid; gap: 12px; }
.timeline-lane {
  display: grid; grid-template-columns: 80px 1fr; gap: 12px; align-items: center;
}
.lane-label { font-size: 12px; font-weight: 700; color: var(--evz-subtle); }
.lane-track {
  position: relative; height: 48px; border-radius: 16px; background: rgba(148,163,184,0.08); border: 1px solid var(--evz-divider-soft);
}
.timeline-clip {
  position: absolute; top: 8px; height: 32px; border-radius: 12px; color: white; font-size: 12px; font-weight: 800; display: flex; align-items: center; justify-content: center;
  box-shadow: 0 10px 20px rgba(15,23,42,0.10);
}
.nodes-wrap {
  display: flex; gap: 14px; align-items: center; flex-wrap: wrap; min-height: 150px;
}
.node-card {
  min-width: 180px; padding: 14px; border-radius: 16px; border: 1px solid var(--evz-divider-soft); background: var(--evz-card-strong);
}
.node-card.green { box-shadow: inset 0 0 0 1px rgba(3,205,140,0.10); }
.node-card.orange { box-shadow: inset 0 0 0 1px rgba(247,127,0,0.12); }
.node-title { font-size: 13px; font-weight: 800; }
.node-meta { margin-top: 8px; font-size: 12px; color: var(--evz-subtle); }
.console-line { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; justify-content: flex-start; }
.button-row.compact { gap: 8px; }
.wrap { flex-wrap: wrap; }
.modal-card {
  width: min(760px, calc(100vw - 32px));
  border-radius: 24px;
  padding: 18px;
  box-shadow: var(--shadow-lg);
}
.modal-card.small { width: min(560px, calc(100vw - 32px)); }
.overlay {
  position: fixed; inset: 0; background: rgba(15,23,42,0.35); display: grid; place-items: center; padding: 16px; z-index: 60;
}
.modal-head {
  display: flex; justify-content: space-between; gap: 16px; align-items: flex-start; margin-bottom: 16px;
}
.modal-head h3 { margin: 4px 0 0; font-size: 24px; }
.search-input { margin-bottom: 14px; }
.command-list { max-height: 360px; overflow: auto; }
.command-item { text-align: left; width: 100%; }
.shortcut-row kbd {
  min-width: 108px; display: inline-flex; justify-content: center; padding: 8px 12px; border-radius: 10px; border: 1px solid var(--evz-divider-soft); background: var(--evz-card-strong); font-weight: 800;
}
[data-evz-theme='dark'] .evz-page {
  --evz-subtle: #a9b4c4;
  --evz-card-strong: rgba(18, 28, 44, 0.96);
  --shadow-lg: 0 28px 70px rgba(2, 6, 12, 0.42);
  --shadow-md: 0 18px 44px rgba(2, 6, 12, 0.34);
}
[data-evz-theme='dark'] .evz-page .panel-header {
  background: linear-gradient(180deg, rgba(17, 28, 45, 0.94), rgba(13, 22, 35, 0.9));
}
[data-evz-theme='dark'] .evz-page .status-chip.live,
[data-evz-theme='dark'] .evz-page .headline-badge,
[data-evz-theme='dark'] .evz-page .budget-head strong {
  color: #34d399;
}
[data-evz-theme='dark'] .evz-page .asset-item.warning {
  background: rgba(247,127,0,0.14);
}
@media (max-width: 1380px) {
  .titlebar { grid-template-columns: 1fr; }
  .workspace-grid { grid-template-columns: 1fr; }
  .right-panel { grid-column: auto; }
  .left-panel, .right-panel { min-height: 380px; }
}
@media (max-width: 1100px) {
  .command-bar { flex-direction: column; align-items: stretch; }
  .workspace-grid { grid-template-columns: 1fr; }
  .left-panel, .right-panel { min-height: 380px; }
  .scene-stats { position: static; margin: 18px 24px 0; }
}
@media (max-width: 760px) {
  .evz-page { padding: 14px; }
  .command-actions { flex-wrap: wrap; }
  .command-actions > * { width: 100%; }
  .panel-header .tab-row {
    flex-wrap: nowrap;
    overflow-x: auto;
    scrollbar-width: none;
    padding-bottom: 2px;
  }
  .panel-header .tab-row::-webkit-scrollbar { display: none; }
  .panel-header .tab-btn {
    flex: 0 0 auto;
    white-space: nowrap;
    color: #1f2937;
    background: #f3f4f6;
    border-color: rgba(15, 23, 42, 0.12);
  }
  .panel-header .tab-btn.active {
    color: #fff;
    background: linear-gradient(135deg, var(--evz-green), #10b981);
    border-color: transparent;
  }
  .viewport-headline { max-width: calc(100% - 32px); left: 16px; right: 16px; top: 16px; }
  .viewport-headline h2 { font-size: 22px; }
  .camera-status {
    left: 16px;
    right: 16px;
    bottom: 16px;
    flex-wrap: wrap;
  }
  .camera-pill.source {
    width: 100%;
    text-align: center;
  }
  .camera-error {
    left: 16px;
    right: 16px;
    bottom: 86px;
    max-width: none;
  }
  .viewport-empty-state {
    min-width: calc(100% - 26px);
  }
  .component-grid, .preview-meta-grid, .budget-grid { grid-template-columns: 1fr; }
  .timeline-lane { grid-template-columns: 1fr; }
  .lane-label { padding-left: 4px; }
}
`;
