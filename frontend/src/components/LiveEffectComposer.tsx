import React from 'react';
import AutoFixHighRoundedIcon from '@mui/icons-material/AutoFixHighRounded';
import AutoModeRoundedIcon from '@mui/icons-material/AutoModeRounded';
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded';
import BlurOnRoundedIcon from '@mui/icons-material/BlurOnRounded';
import Brightness7RoundedIcon from '@mui/icons-material/Brightness7Rounded';
import CameraAltRoundedIcon from '@mui/icons-material/CameraAltRounded';
import CameraswitchRoundedIcon from '@mui/icons-material/CameraswitchRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ColorLensRoundedIcon from '@mui/icons-material/ColorLensRounded';
import ContrastRoundedIcon from '@mui/icons-material/ContrastRounded';
import CropRoundedIcon from '@mui/icons-material/CropRounded';
import FlashOffRoundedIcon from '@mui/icons-material/FlashOffRounded';
import FlashOnRoundedIcon from '@mui/icons-material/FlashOnRounded';
import FileDownloadRoundedIcon from '@mui/icons-material/FileDownloadRounded';
import FilterVintageRoundedIcon from '@mui/icons-material/FilterVintageRounded';
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import MusicNoteRoundedIcon from '@mui/icons-material/MusicNoteRounded';
import PauseRoundedIcon from '@mui/icons-material/PauseRounded';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import RadioButtonCheckedRoundedIcon from '@mui/icons-material/RadioButtonCheckedRounded';
import RotateLeftRoundedIcon from '@mui/icons-material/RotateLeftRounded';
import RotateRightRoundedIcon from '@mui/icons-material/RotateRightRounded';
import TimerRoundedIcon from '@mui/icons-material/TimerRounded';
import TonalityRoundedIcon from '@mui/icons-material/TonalityRounded';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import UploadFileRoundedIcon from '@mui/icons-material/UploadFileRounded';
import WbSunnyRoundedIcon from '@mui/icons-material/WbSunnyRounded';
import type { SvgIconComponent } from '@mui/icons-material';

type EffectPreset = {
  id: string;
  name: string;
  label: string;
  colors: string[];
  filter: string;
};

type CameraMode = 'TIME LAPSE' | 'SLO-MO' | 'VIDEO' | 'PHOTO' | 'PORTRAIT' | 'SQUARE' | 'PANO';

type CameraFilter = {
  id: string;
  name: string;
  filter: string;
  swatch: string;
};

type AdjustmentTool = {
  id: string;
  name: string;
  icon: SvgIconComponent;
  min: number;
  max: number;
  defaultValue: number;
};

type LiveEffectComposerProps = {
  title?: string;
  compact?: boolean;
  onNotify?: (message: string) => void;
  onOpenEditor?: () => void;
};

type ImageBounds = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type PreviewToolPanel = 'upload' | 'effects' | 'face' | 'adjust' | 'music' | 'actions';

const CANVAS_WIDTH = 720;
const CANVAS_HEIGHT = 1280;

const effectPresets: EffectPreset[] = [
  {
    id: 'clean-camera',
    name: 'Clean Camera',
    label: 'Clean',
    colors: ['#ffffff'],
    filter: 'none',
  },
  {
    id: 'dreamy-glow',
    name: 'Dreamy Glow',
    label: 'Soft beauty',
    colors: ['#03cd8c', '#92f8d4', '#ffffff', '#f7c948'],
    filter: 'brightness(1.12) contrast(0.96) saturate(1.16)',
  },
  {
    id: 'star-sparkle',
    name: 'Star Sparkle',
    label: 'VFX sparkle',
    colors: ['#7c4dff', '#00e5ff', '#f77f00', '#ffffff'],
    filter: 'brightness(1.05) contrast(1.12) saturate(1.35)',
  },
  {
    id: 'soft-black',
    name: 'Soft Black',
    label: 'Teal grade',
    colors: ['#28d6f0', '#0f172a', '#116466', '#d6f7f4'],
    filter: 'brightness(0.9) contrast(1.18) saturate(0.94)',
  },
  {
    id: 'creator-lut',
    name: 'Creator LUT',
    label: 'Warm studio',
    colors: ['#f77f00', '#ffc84a', '#03cd8c', '#ffffff'],
    filter: 'brightness(1.02) contrast(1.1) saturate(1.18) sepia(0.1)',
  },
];

const creatorModeStrip: Array<{ mode: CameraMode; label: string }> = [
  { mode: 'TIME LAPSE', label: '10m' },
  { mode: 'VIDEO', label: '60s' },
  { mode: 'SLO-MO', label: '15s' },
  { mode: 'PHOTO', label: 'PHOTO' },
  { mode: 'PORTRAIT', label: 'TEXT' },
];

const captureStripFilterIds = ['original', 'vivid', 'natural', 'dramatic', 'warm', 'cool', 'noir'] as const;

const previewToolPanelLabels: Record<PreviewToolPanel, string> = {
  upload: 'Upload & Camera',
  effects: 'Filter Presets',
  face: 'Face Editing',
  adjust: 'Adjust',
  music: 'Music',
  actions: 'Save & Export',
};

const cameraFilters: CameraFilter[] = [
  { id: 'original', name: 'Original', filter: 'none', swatch: 'linear-gradient(135deg, #ffffff, #d8dee9)' },
  { id: 'vivid', name: 'Vivid', filter: 'saturate(1.38) contrast(1.13) brightness(1.04)', swatch: 'linear-gradient(135deg, #00c2ff, #ffcf33, #ff2d55)' },
  { id: 'natural', name: 'Natural Light', filter: 'brightness(1.08) contrast(1.03) saturate(1.05)', swatch: 'linear-gradient(135deg, #f7f1df, #ffffff, #c9d8ff)' },
  { id: 'dramatic', name: 'Dramatic', filter: 'contrast(1.28) saturate(0.9) brightness(0.93)', swatch: 'linear-gradient(135deg, #111827, #64748b)' },
  { id: 'warm', name: 'Warm', filter: 'sepia(0.18) saturate(1.18) brightness(1.04)', swatch: 'linear-gradient(135deg, #ffb347, #f77f00)' },
  { id: 'cool', name: 'Cool', filter: 'saturate(1.08) hue-rotate(338deg) brightness(1.02)', swatch: 'linear-gradient(135deg, #38bdf8, #6366f1)' },
  { id: 'noir', name: 'Noir', filter: 'grayscale(1) contrast(1.26) brightness(0.94)', swatch: 'linear-gradient(135deg, #f8fafc, #111827)' },
];

const adjustmentTools: AdjustmentTool[] = [
  { id: 'auto', name: 'Auto', icon: AutoModeRoundedIcon, min: 0, max: 100, defaultValue: 50 },
  { id: 'blackPoint', name: 'Black Point', icon: ContrastRoundedIcon, min: 0, max: 100, defaultValue: 42 },
  { id: 'shadows', name: 'Shadows', icon: TonalityRoundedIcon, min: 0, max: 100, defaultValue: 48 },
  { id: 'brilliance', name: 'Brilliance', icon: AutoFixHighRoundedIcon, min: 0, max: 100, defaultValue: 56 },
  { id: 'definition', name: 'Definition', icon: BlurOnRoundedIcon, min: 0, max: 100, defaultValue: 52 },
  { id: 'warmth', name: 'Warmth', icon: WbSunnyRoundedIcon, min: 0, max: 100, defaultValue: 54 },
  { id: 'vignette', name: 'Vignette', icon: RadioButtonCheckedRoundedIcon, min: 0, max: 70, defaultValue: 24 },
  { id: 'exposure', name: 'Exposure', icon: Brightness7RoundedIcon, min: 0, max: 100, defaultValue: 50 },
  { id: 'saturation', name: 'Saturation', icon: ColorLensRoundedIcon, min: 0, max: 100, defaultValue: 56 },
];

function hexToRgba(hex: string, alpha: number) {
  const value = hex.replace('#', '');
  const bigint = parseInt(value.length === 3 ? value.split('').map((char) => char + char).join('') : value, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function adjustmentFilter(adjustments: Record<string, number>) {
  const exposure = 0.78 + (adjustments.exposure ?? 50) / 170;
  const blackPoint = 0.9 + (adjustments.blackPoint ?? 42) / 260;
  const shadows = 0.88 + (adjustments.shadows ?? 48) / 360;
  const brilliance = 0.9 + (adjustments.brilliance ?? 56) / 340;
  const definition = 0.92 + (adjustments.definition ?? 52) / 250;
  const saturation = 0.82 + (adjustments.saturation ?? 56) / 180;
  const warmth = ((adjustments.warmth ?? 54) - 50) * 0.35;
  return [
    `brightness(${(exposure * shadows * brilliance).toFixed(3)})`,
    `contrast(${(blackPoint * definition).toFixed(3)})`,
    `saturate(${saturation.toFixed(3)})`,
    `sepia(${Math.max(0, warmth / 100).toFixed(3)})`,
    `hue-rotate(${warmth.toFixed(2)}deg)`,
  ].join(' ');
}

function drawContainedSource(
  ctx: CanvasRenderingContext2D,
  source: CanvasImageSource,
  sourceWidth: number,
  sourceHeight: number,
  zoom = 1,
): ImageBounds {
  const scale = Math.min(CANVAS_WIDTH / sourceWidth, CANVAS_HEIGHT / sourceHeight) * zoom;
  const width = sourceWidth * scale;
  const height = sourceHeight * scale;
  const x = (CANVAS_WIDTH - width) / 2;
  const y = (CANVAS_HEIGHT - height) / 2;
  ctx.drawImage(source, x, y, width, height);
  return { x, y, width, height };
}

function drawNoseReshape(
  ctx: CanvasRenderingContext2D,
  source: CanvasImageSource,
  sourceWidth: number,
  sourceHeight: number,
  bounds: ImageBounds,
  noseSize: number,
) {
  const centerX = bounds.x + bounds.width * 0.5;
  const centerY = bounds.y + bounds.height * 0.49;
  const regionWidth = Math.max(58, bounds.width * 0.17);
  const regionHeight = Math.max(72, bounds.height * 0.19);
  const scaleX = 0.72 + noseSize * 0.0056;
  const scaleY = 0.92 + noseSize * 0.0016;

  const sx = ((centerX - regionWidth / 2 - bounds.x) / bounds.width) * sourceWidth;
  const sy = ((centerY - regionHeight / 2 - bounds.y) / bounds.height) * sourceHeight;
  const sw = (regionWidth / bounds.width) * sourceWidth;
  const sh = (regionHeight / bounds.height) * sourceHeight;
  const dw = regionWidth * scaleX;
  const dh = regionHeight * scaleY;

  ctx.save();
  ctx.beginPath();
  ctx.ellipse(centerX, centerY, dw / 2, dh / 2, 0, 0, Math.PI * 2);
  ctx.clip();
  ctx.globalAlpha = 0.94;
  ctx.drawImage(source, sx, sy, sw, sh, centerX - dw / 2, centerY - dh / 2, dw, dh);
  ctx.restore();
}

function drawSparkles(ctx: CanvasRenderingContext2D, color: string, intensity: number, pulse: number) {
  const count = Math.max(8, Math.round(intensity / 4));
  ctx.save();
  ctx.fillStyle = color;
  ctx.strokeStyle = hexToRgba(color, 0.72);
  ctx.lineWidth = 2;

  for (let index = 0; index < count; index += 1) {
    const x = 80 + ((index * 149) % 800);
    const y = 70 + ((index * 91) % 500);
    const radius = 4 + ((index * 7) % 14) + pulse * 5;

    ctx.beginPath();
    ctx.moveTo(x, y - radius);
    ctx.lineTo(x + radius * 0.32, y - radius * 0.32);
    ctx.lineTo(x + radius, y);
    ctx.lineTo(x + radius * 0.32, y + radius * 0.32);
    ctx.lineTo(x, y + radius);
    ctx.lineTo(x - radius * 0.32, y + radius * 0.32);
    ctx.lineTo(x - radius, y);
    ctx.lineTo(x - radius * 0.32, y - radius * 0.32);
    ctx.closePath();
    ctx.globalAlpha = 0.38 + ((index % 4) * 0.1);
    ctx.fill();
    ctx.globalAlpha = 0.75;
    ctx.stroke();
  }
  ctx.restore();
}

function drawEffectOverlay(
  ctx: CanvasRenderingContext2D,
  preset: EffectPreset,
  color: string,
  softness: number,
  sparkle: number,
  vignette: number,
  pulse: number,
) {
  const isHeartPreset = preset.id.toLowerCase().includes('heart') || preset.name.toLowerCase().includes('heart');
  if (preset.id === 'clean-camera' || isHeartPreset) {
    return;
  }

  const gradient = ctx.createRadialGradient(
    CANVAS_WIDTH / 2,
    CANVAS_HEIGHT / 2,
    40,
    CANVAS_WIDTH / 2,
    CANVAS_HEIGHT / 2,
    CANVAS_WIDTH * 0.72,
  );
  gradient.addColorStop(0, hexToRgba(color, 0.05 + softness / 800));
  gradient.addColorStop(0.62, hexToRgba(color, 0.05));
  gradient.addColorStop(1, `rgba(5, 12, 20, ${vignette / 120})`);
  ctx.save();
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  if (preset.id === 'dreamy-glow') {
    ctx.strokeStyle = hexToRgba(color, 0.62);
    ctx.lineWidth = 8;
    ctx.shadowColor = color;
    ctx.shadowBlur = 34 + pulse * 22;
    ctx.beginPath();
    ctx.ellipse(CANVAS_WIDTH / 2, CANVAS_HEIGHT * 0.45, 150, 190, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  if (preset.id === 'soft-black') {
    ctx.fillStyle = 'rgba(2, 6, 23, 0.18)';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.strokeStyle = hexToRgba(color, 0.7);
    ctx.lineWidth = 5;
    ctx.strokeRect(44, 44, CANVAS_WIDTH - 88, CANVAS_HEIGHT - 88);
  }

  if (preset.id === 'creator-lut') {
    const wash = ctx.createLinearGradient(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    wash.addColorStop(0, hexToRgba(color, 0.18));
    wash.addColorStop(1, 'rgba(3, 205, 140, 0.12)');
    ctx.fillStyle = wash;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }

  drawSparkles(ctx, color, sparkle, pulse);
  ctx.restore();
}

export function LiveEffectComposer({
  title = 'Live Image Effect Composer',
  compact = false,
  onNotify,
  onOpenEditor,
}: LiveEffectComposerProps) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const musicInputRef = React.useRef<HTMLInputElement | null>(null);
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const imageUrlRef = React.useRef<string | null>(null);
  const musicUrlRef = React.useRef<string | null>(null);
  const cameraStreamRef = React.useRef<MediaStream | null>(null);

  const [imageElement, setImageElement] = React.useState<HTMLImageElement | null>(null);
  const [imageName, setImageName] = React.useState('');
  const [musicName, setMusicName] = React.useState('');
  const [activeEffectId, setActiveEffectId] = React.useState(effectPresets[0].id);
  const [activeColor, setActiveColor] = React.useState(effectPresets[0].colors[0]);
  const [showPalette, setShowPalette] = React.useState(false);
  const [noseSize, setNoseSize] = React.useState(50);
  const [softness, setSoftness] = React.useState(0);
  const [sparkle, setSparkle] = React.useState(0);
  const [vignette, setVignette] = React.useState(6);
  const [uploadProgress, setUploadProgress] = React.useState(0);
  const [uploadStatus, setUploadStatus] = React.useState('Upload an image to start editing.');
  const [musicPlaying, setMusicPlaying] = React.useState(false);
  const [musicVolume, setMusicVolume] = React.useState(72);
  const [pulse, setPulse] = React.useState(0);
  const [cameraActive, setCameraActive] = React.useState(false);
  const [cameraFacing, setCameraFacing] = React.useState<'user' | 'environment'>('user');
  const [cameraMode, setCameraMode] = React.useState<CameraMode>('VIDEO');
  const [zoomLevel, setZoomLevel] = React.useState(1);
  const [snapshotUrl, setSnapshotUrl] = React.useState('');
  const [activeCameraFilterId, setActiveCameraFilterId] = React.useState('vivid');
  const [activeAdjustmentId, setActiveAdjustmentId] = React.useState('brilliance');
  const [cameraHudCollapsed, setCameraHudCollapsed] = React.useState(false);
  const [cameraFlashEnabled, setCameraFlashEnabled] = React.useState(false);
  const [cameraTimerEnabled, setCameraTimerEnabled] = React.useState(false);
  const [cameraGridEnabled, setCameraGridEnabled] = React.useState(false);
  const [cameraBeautyEnabled, setCameraBeautyEnabled] = React.useState(true);
  const [cameraFiltersVisible, setCameraFiltersVisible] = React.useState(true);
  const [previewToolPanel, setPreviewToolPanel] = React.useState<PreviewToolPanel | null>(null);
  const [toolBadge, setToolBadge] = React.useState('');
  const [adjustments, setAdjustments] = React.useState<Record<string, number>>(
    () => Object.fromEntries(adjustmentTools.map((tool) => [tool.id, tool.defaultValue])),
  );

  const activePreset = React.useMemo(
    () => effectPresets.find((preset) => preset.id === activeEffectId) ?? effectPresets[0],
    [activeEffectId],
  );
  const activeCameraFilter = React.useMemo(
    () => cameraFilters.find((filter) => filter.id === activeCameraFilterId) ?? cameraFilters[0],
    [activeCameraFilterId],
  );
  const activeAdjustment = React.useMemo(
    () => adjustmentTools.find((tool) => tool.id === activeAdjustmentId) ?? adjustmentTools[0],
    [activeAdjustmentId],
  );
  const handleHorizontalWheel = React.useCallback((event: React.WheelEvent<HTMLDivElement>) => {
    if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
      event.currentTarget.scrollLeft += event.deltaY;
      event.preventDefault();
    }
  }, []);
  const togglePreviewToolPanel = React.useCallback((panel: PreviewToolPanel) => {
    setPreviewToolPanel((current) => (current === panel ? null : panel));
  }, []);
  const captureStripFilters = React.useMemo(
    () =>
      captureStripFilterIds
        .map((id) => cameraFilters.find((filter) => filter.id === id))
        .filter((filter): filter is CameraFilter => Boolean(filter)),
    [],
  );
  const activeAdjustmentValue = activeAdjustmentId === 'vignette'
    ? vignette
    : adjustments[activeAdjustmentId] ?? activeAdjustment.defaultValue;
  const renderFilter = React.useMemo(
    () => [activePreset.filter, activeCameraFilter.filter, adjustmentFilter(adjustments)].filter(Boolean).join(' '),
    [activeCameraFilter.filter, activePreset.filter, adjustments],
  );

  const notify = React.useCallback(
    (message: string) => {
      setUploadStatus(message);
      onNotify?.(message);
    },
    [onNotify],
  );

  React.useEffect(() => {
    return () => {
      if (imageUrlRef.current) URL.revokeObjectURL(imageUrlRef.current);
      if (musicUrlRef.current) URL.revokeObjectURL(musicUrlRef.current);
      cameraStreamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  React.useEffect(() => {
    if (!musicPlaying) {
      setPulse(0);
      return undefined;
    }
    const interval = window.setInterval(() => {
      setPulse((value) => (value > 0.9 ? 0.1 : value + 0.12));
    }, 130);
    return () => window.clearInterval(interval);
  }, [musicPlaying]);

  React.useEffect(() => {
    if (!toolBadge) return undefined;
    const timer = window.setTimeout(() => setToolBadge(''), 850);
    return () => window.clearTimeout(timer);
  }, [toolBadge]);

  React.useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = musicVolume / 100;
  }, [musicVolume, musicName]);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;
    let animationFrame = 0;

    const draw = () => {
      canvas.width = CANVAS_WIDTH;
      canvas.height = CANVAS_HEIGHT;
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      const bg = ctx.createLinearGradient(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      bg.addColorStop(0, '#101010');
      bg.addColorStop(0.58, '#171717');
      bg.addColorStop(1, '#0f172a');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      const video = videoRef.current;
      const hasCameraFrame = cameraActive && video && video.videoWidth > 0 && video.videoHeight > 0;
      const source = hasCameraFrame ? video : imageElement;
      const sourceWidth = hasCameraFrame ? video.videoWidth : imageElement?.naturalWidth;
      const sourceHeight = hasCameraFrame ? video.videoHeight : imageElement?.naturalHeight;

      if (source && sourceWidth && sourceHeight) {
        ctx.save();
        ctx.filter = renderFilter;
        const bounds = drawContainedSource(ctx, source, sourceWidth, sourceHeight, zoomLevel);
        drawNoseReshape(ctx, source, sourceWidth, sourceHeight, bounds, noseSize);
        ctx.restore();

        drawEffectOverlay(ctx, activePreset, activeColor, softness, sparkle, vignette, pulse);
      }

      if (cameraMode === 'SQUARE') {
        const cropSize = Math.min(CANVAS_WIDTH, CANVAS_HEIGHT);
        const x = (CANVAS_WIDTH - cropSize) / 2;
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, .45)';
        ctx.fillRect(0, 0, x, CANVAS_HEIGHT);
        ctx.fillRect(x + cropSize, 0, x, CANVAS_HEIGHT);
        ctx.strokeStyle = 'rgba(255, 255, 255, .82)';
        ctx.lineWidth = 3;
        ctx.strokeRect(x + 8, 8, cropSize - 16, cropSize - 16);
        ctx.restore();
      }

      if (cameraMode === 'PORTRAIT') {
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, .28)';
        ctx.fillRect(0, 0, CANVAS_WIDTH, 48);
        ctx.fillRect(0, CANVAS_HEIGHT - 48, CANVAS_WIDTH, 48);
        ctx.restore();
      }

      if (hasCameraFrame) {
        animationFrame = window.requestAnimationFrame(draw);
      }
    };

    draw();
    return () => {
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
    };
  }, [activeColor, activePreset, cameraActive, cameraMode, imageElement, noseSize, pulse, renderFilter, softness, sparkle, vignette, zoomLevel]);

  const handleImageUpload = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
      if (!file.type.startsWith('image/')) {
        notify('Please choose an image file.');
        return;
      }

      if (imageUrlRef.current) URL.revokeObjectURL(imageUrlRef.current);
      const url = URL.createObjectURL(file);
      imageUrlRef.current = url;
      setImageName(file.name);
      setUploadProgress(42);
      setUploadStatus('Loading image into the effect canvas...');

      const image = new Image();
      image.onload = () => {
        setImageElement(image);
        setUploadProgress(100);
        notify(`${file.name} is fully loaded. Effects are live.`);
      };
      image.onerror = () => {
        setUploadProgress(0);
        notify('The image could not be loaded.');
      };
      image.src = url;
      event.target.value = '';
    },
    [notify],
  );

  const stopCamera = React.useCallback(() => {
    cameraStreamRef.current?.getTracks().forEach((track) => track.stop());
    cameraStreamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraActive(false);
    notify('Camera closed.');
  }, [notify]);

  const startCamera = React.useCallback(
    async (facing: 'user' | 'environment' = cameraFacing) => {
      if (!navigator.mediaDevices?.getUserMedia) {
        notify('Camera access is not available in this browser.');
        return;
      }
      try {
        cameraStreamRef.current?.getTracks().forEach((track) => track.stop());
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: facing, width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });
        cameraStreamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        setCameraFacing(facing);
        setCameraActive(true);
        setUploadProgress(100);
        notify('Camera is live. Modes, filters, crop, zoom, and adjust tools are ready.');
      } catch {
        notify('Camera permission was blocked or no camera was found.');
      }
    },
    [cameraFacing, notify],
  );

  const flipCamera = React.useCallback(() => {
    const nextFacing = cameraFacing === 'user' ? 'environment' : 'user';
    void startCamera(nextFacing);
  }, [cameraFacing, startCamera]);

  const captureFrame = React.useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    setSnapshotUrl(dataUrl);
    const image = new Image();
    image.onload = () => {
      setImageElement(image);
      setImageName(`${cameraMode.toLowerCase().replace(/\s+/g, '-')}-capture.png`);
      notify(`${cameraMode} capture saved as the latest editable image.`);
    };
    image.src = dataUrl;
  }, [cameraMode, notify]);

  const updateAdjustment = React.useCallback((id: string, value: number) => {
    if (id === 'vignette') {
      setVignette(value);
      setToolBadge('Vignette');
      return;
    }
    setAdjustments((current) => ({ ...current, [id]: value }));
    const tool = adjustmentTools.find((item) => item.id === id);
    setToolBadge(tool?.name ?? 'Adjust');
  }, []);

  const handleMusicUpload = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
      if (!file.type.startsWith('audio/')) {
        notify('Please choose an audio file for music.');
        return;
      }

      if (musicUrlRef.current) URL.revokeObjectURL(musicUrlRef.current);
      const url = URL.createObjectURL(file);
      musicUrlRef.current = url;
      setMusicName(file.name);
      setMusicPlaying(false);
      window.setTimeout(() => {
        if (audioRef.current) audioRef.current.src = url;
      }, 0);
      notify(`${file.name} added to the effect timeline.`);
      event.target.value = '';
    },
    [notify],
  );

  const toggleMusic = React.useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || !musicName) {
      notify('Upload a music file first.');
      return;
    }
    if (musicPlaying) {
      audio.pause();
      setMusicPlaying(false);
      notify('Music paused.');
      return;
    }
    try {
      await audio.play();
      setMusicPlaying(true);
      notify('Music is playing with the effect preview.');
    } catch {
      notify('Browser blocked playback. Press play again after selecting music.');
    }
  }, [musicName, musicPlaying, notify]);

  const selectEffect = React.useCallback(
    (preset: EffectPreset) => {
      setActiveEffectId(preset.id);
      setActiveColor(preset.colors[0]);
      setShowPalette(true);
      notify(`${preset.name} selected. Choose a color to preview it instantly.`);
    },
    [notify],
  );

  const saveEffect = React.useCallback(() => {
    const saved = {
      imageName,
      musicName,
      effect: activePreset.name,
      color: activeColor,
      cameraMode,
      cameraFilter: activeCameraFilter.name,
      controls: { noseSize, softness, sparkle, vignette, adjustments },
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem('evzone-live-effect-draft', JSON.stringify(saved));
    notify('Effect draft saved locally and ready for editor handoff.');
  }, [activeCameraFilter.name, activeColor, activePreset.name, adjustments, cameraMode, imageName, musicName, noseSize, notify, softness, sparkle, vignette]);

  const exportImage = React.useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (!blob) {
        notify('Export failed. Try another image.');
        return;
      }
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `evzone-${activePreset.id}-effect.png`;
      anchor.click();
      URL.revokeObjectURL(url);
      notify('Effect image exported.');
    }, 'image/png');
  }, [activePreset.id, notify]);

  const statusPills = React.useMemo(
    () => [
      imageElement ? 'Image ready' : 'Image needed',
      cameraActive ? 'Camera live' : 'Camera optional',
      cameraMode,
      activeCameraFilter.name,
      musicName ? 'Music attached' : 'Music optional',
      `${activePreset.label}`,
    ],
    [activeCameraFilter.name, activePreset.label, cameraActive, cameraMode, imageElement, musicName],
  );

  return (
    <section className={`evz-live-composer ${compact ? 'compact' : ''}`} aria-label="Live image effect composer">
      <style>{composerStyles}</style>
      <div className="evz-live-composer-head">
        <div>
          <span>Image effects studio</span>
          <h2>{title}</h2>
          <p>Upload an image, choose a filter, pick a color, adjust face controls, add music, and preview the result immediately.</p>
        </div>
        <div className="evz-composer-status">
          {statusPills.map((pill) => (
            <em key={pill}>{pill}</em>
          ))}
        </div>
      </div>

      <div className="evz-live-composer-grid">
        <div className="evz-canvas-panel">
          <div className={`evz-camera-stage ${cameraActive ? 'live' : ''}`}>
            <video ref={videoRef} muted playsInline className="evz-hidden-video" />
            <canvas ref={canvasRef} className="evz-effect-canvas" aria-label="Live effect preview" />
            {cameraGridEnabled ? <div className="evz-camera-grid" aria-hidden="true" /> : null}
            {!imageElement && !cameraActive && (
              <div className="evz-empty-preview">
                <span />
              </div>
            )}
            <div className="evz-camera-topbar" aria-label="Camera top controls">
              <button
                type="button"
                className="evz-stage-icon-btn evz-plain-icon"
                aria-label={cameraActive ? 'Close camera' : 'Clear preview'}
                onClick={() => {
                  if (cameraActive) {
                    stopCamera();
                  } else {
                    setImageElement(null);
                    setImageName('');
                    notify('Preview cleared.');
                  }
                }}
              >
                <CloseRoundedIcon />
              </button>
              <button
                type="button"
                className="evz-sound-pill"
                onClick={() => musicInputRef.current?.click()}
                aria-label="Add sound"
              >
                <MusicNoteRoundedIcon fontSize="small" />
                <span>{musicName ? 'Sound added' : 'Add sound'}</span>
              </button>
              <button type="button" className="evz-stage-icon-btn evz-plain-icon" aria-label="Flip camera" onClick={flipCamera}>
                <AutorenewRoundedIcon />
              </button>
              <input ref={musicInputRef} type="file" accept="audio/*" className="evz-hidden-file-input" onChange={handleMusicUpload} />
            </div>
            <div className="evz-camera-right-rail" aria-label="Camera quick tools">
              <button
                type="button"
                className={`evz-stage-icon-btn evz-plain-icon ${cameraFlashEnabled ? 'active' : ''}`}
                aria-label={cameraFlashEnabled ? 'Disable flash' : 'Enable flash'}
                onClick={() => {
                  setCameraFlashEnabled((value) => !value);
                  notify(cameraFlashEnabled ? 'Flash turned off.' : 'Flash turned on.');
                }}
              >
                {cameraFlashEnabled ? <FlashOnRoundedIcon /> : <FlashOffRoundedIcon />}
              </button>
              <span className="evz-rail-separator" aria-hidden="true" />
              <button
                type="button"
                className={`evz-stage-icon-btn evz-plain-icon ${cameraTimerEnabled ? 'active' : ''}`}
                aria-label={cameraTimerEnabled ? 'Disable timer' : 'Enable timer'}
                onClick={() => {
                  setCameraTimerEnabled((value) => !value);
                  notify(cameraTimerEnabled ? 'Timer disabled.' : '3 second timer enabled.');
                }}
              >
                <TimerRoundedIcon />
              </button>
              <button
                type="button"
                className={`evz-stage-icon-btn evz-plain-icon ${cameraGridEnabled ? 'active' : ''}`}
                aria-label={cameraGridEnabled ? 'Hide composition grid' : 'Show composition grid'}
                onClick={() => {
                  setCameraGridEnabled((value) => !value);
                  notify(cameraGridEnabled ? 'Composition grid hidden.' : 'Composition grid shown.');
                }}
              >
                <GridViewRoundedIcon />
              </button>
              <button
                type="button"
                className={`evz-stage-icon-btn evz-plain-icon evz-beauty-btn ${cameraBeautyEnabled ? 'active' : ''}`}
                aria-label={cameraBeautyEnabled ? 'Disable beauty assist' : 'Enable beauty assist'}
                onClick={() => {
                  setCameraBeautyEnabled((value) => !value);
                  notify(cameraBeautyEnabled ? 'Beauty assist disabled.' : 'Beauty assist enabled.');
                }}
              >
                <AutoFixHighRoundedIcon />
                <span />
              </button>
              <span className="evz-rail-separator" aria-hidden="true" />
              <button
                type="button"
                className={`evz-stage-icon-btn evz-plain-icon ${cameraFiltersVisible ? 'active' : ''}`}
                aria-label={cameraFiltersVisible ? 'Hide filters' : 'Show filters'}
                onClick={() => setCameraFiltersVisible((value) => !value)}
              >
                <BlurOnRoundedIcon />
              </button>
              <button
                type="button"
                className={`evz-stage-icon-btn evz-plain-icon ${cameraHudCollapsed ? 'active' : ''}`}
                aria-label={cameraHudCollapsed ? 'Expand capture controls' : 'Collapse capture controls'}
                onClick={() => setCameraHudCollapsed((value) => !value)}
              >
                <KeyboardArrowDownRoundedIcon />
              </button>
              <span className="evz-rail-separator" aria-hidden="true" />
              <button
                type="button"
                className={`evz-stage-icon-btn evz-plain-icon evz-tool-launcher ${previewToolPanel === 'upload' ? 'active' : ''}`}
                aria-label="Open upload and camera tools"
                onClick={() => togglePreviewToolPanel('upload')}
              >
                <CameraAltRoundedIcon />
              </button>
              <button
                type="button"
                className={`evz-stage-icon-btn evz-plain-icon evz-tool-launcher ${previewToolPanel === 'effects' ? 'active' : ''}`}
                aria-label="Open filter preset tools"
                onClick={() => togglePreviewToolPanel('effects')}
              >
                <FilterVintageRoundedIcon />
              </button>
              <button
                type="button"
                className={`evz-stage-icon-btn evz-plain-icon evz-tool-launcher ${previewToolPanel === 'face' ? 'active' : ''}`}
                aria-label="Open face editing tools"
                onClick={() => togglePreviewToolPanel('face')}
              >
                <WbSunnyRoundedIcon />
              </button>
              <button
                type="button"
                className={`evz-stage-icon-btn evz-plain-icon evz-tool-launcher ${previewToolPanel === 'adjust' ? 'active' : ''}`}
                aria-label="Open adjustment tools"
                onClick={() => togglePreviewToolPanel('adjust')}
              >
                <TuneRoundedIcon />
              </button>
              <button
                type="button"
                className={`evz-stage-icon-btn evz-plain-icon evz-tool-launcher ${previewToolPanel === 'music' ? 'active' : ''}`}
                aria-label="Open music tools"
                onClick={() => togglePreviewToolPanel('music')}
              >
                <MusicNoteRoundedIcon />
              </button>
              <button
                type="button"
                className={`evz-stage-icon-btn evz-plain-icon evz-tool-launcher ${previewToolPanel === 'actions' ? 'active' : ''}`}
                aria-label="Open save and export tools"
                onClick={() => togglePreviewToolPanel('actions')}
              >
                <FileDownloadRoundedIcon />
              </button>
            </div>
            {previewToolPanel ? (
              <div className="evz-preview-tool-panel" aria-label="Preview editing tools">
                <div className="evz-preview-tool-head">
                  <strong>{previewToolPanelLabels[previewToolPanel]}</strong>
                  <button type="button" aria-label="Close tool panel" onClick={() => setPreviewToolPanel(null)}>
                    <CloseRoundedIcon fontSize="small" />
                  </button>
                </div>

                {previewToolPanel === 'upload' ? (
                  <div className="evz-preview-panel-stack">
                    <label className="evz-preview-file">
                      <UploadFileRoundedIcon fontSize="small" />
                      Upload image
                      <input type="file" accept="image/*" onChange={handleImageUpload} />
                    </label>
                    <button type="button" className="evz-preview-action primary" onClick={() => void startCamera()}>
                      Open camera
                    </button>
                    <button type="button" className="evz-preview-action" onClick={stopCamera} disabled={!cameraActive}>
                      Close
                    </button>
                  </div>
                ) : null}

                {previewToolPanel === 'effects' ? (
                  <div className="evz-preview-panel-stack">
                    <div className="evz-preview-effect-list">
                      {effectPresets.map((preset) => (
                        <button
                          key={preset.id}
                          type="button"
                          className={preset.id === activePreset.id ? 'active' : ''}
                          onClick={() => selectEffect(preset)}
                        >
                          <AutoFixHighRoundedIcon fontSize="small" />
                          <span>{preset.name}</span>
                        </button>
                      ))}
                    </div>
                    <button type="button" className="evz-preview-action" onClick={() => setShowPalette((value) => !value)}>
                      {showPalette ? 'Hide colors' : 'Show colors'}
                    </button>
                    {showPalette ? (
                      <div className="evz-preview-color-row">
                        {activePreset.colors.map((color) => (
                          <button
                            key={color}
                            type="button"
                            className={color === activeColor ? 'active' : ''}
                            style={{ background: color }}
                            aria-label={`Use ${color}`}
                            onClick={() => {
                              setActiveColor(color);
                              notify(`${activePreset.name} color updated.`);
                            }}
                          />
                        ))}
                      </div>
                    ) : null}
                  </div>
                ) : null}

                {previewToolPanel === 'face' ? (
                  <div className="evz-preview-panel-stack">
                    <label className="evz-preview-slider">
                      <span>Nose size</span>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        value={noseSize}
                        onChange={(event) => {
                          setNoseSize(Number(event.target.value));
                          setToolBadge('Nose adjusted');
                        }}
                      />
                      <b>{noseSize}%</b>
                    </label>
                    <label className="evz-preview-slider">
                      <span>Softness</span>
                      <input type="range" min="0" max="100" value={softness} onChange={(event) => setSoftness(Number(event.target.value))} />
                      <b>{softness}%</b>
                    </label>
                    <label className="evz-preview-slider">
                      <span>Sparkle</span>
                      <input type="range" min="0" max="100" value={sparkle} onChange={(event) => setSparkle(Number(event.target.value))} />
                      <b>{sparkle}%</b>
                    </label>
                    <label className="evz-preview-slider">
                      <span>Vignette</span>
                      <input type="range" min="0" max="70" value={vignette} onChange={(event) => setVignette(Number(event.target.value))} />
                      <b>{vignette}%</b>
                    </label>
                  </div>
                ) : null}

                {previewToolPanel === 'adjust' ? (
                  <div className="evz-preview-panel-stack">
                    <div className="evz-preview-adjust-icons" aria-label="Adjustment tools">
                      {adjustmentTools.map((tool) => {
                        const Icon = tool.icon;
                        return (
                          <button
                            key={tool.id}
                            type="button"
                            className={activeAdjustmentId === tool.id ? 'active' : ''}
                            aria-label={tool.name}
                            onClick={() => setActiveAdjustmentId(tool.id)}
                          >
                            <Icon fontSize="small" />
                          </button>
                        );
                      })}
                    </div>
                    <strong className="evz-preview-adjust-label">{activeAdjustment.name}</strong>
                    <label className="evz-preview-slider single">
                      <input
                        type="range"
                        min={activeAdjustment.min}
                        max={activeAdjustment.max}
                        value={activeAdjustmentValue}
                        onChange={(event) => updateAdjustment(activeAdjustment.id, Number(event.target.value))}
                      />
                    </label>
                    <div className="evz-preview-adjust-actions">
                      <button
                        type="button"
                        onClick={() => {
                          setAdjustments(Object.fromEntries(adjustmentTools.map((tool) => [tool.id, tool.defaultValue])));
                          setVignette(6);
                          notify('Adjustments reset.');
                        }}
                      >
                        Cancel
                      </button>
                      <button type="button" onClick={() => setActiveCameraFilterId(activeCameraFilter.id === 'vivid' ? 'natural' : 'vivid')}>
                        Filter
                      </button>
                      <button type="button" onClick={() => setShowPalette((value) => !value)}>
                        Color
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setCameraMode('SQUARE');
                          notify('Square crop guide enabled.');
                        }}
                      >
                        Crop
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          saveEffect();
                          setPreviewToolPanel(null);
                        }}
                      >
                        Done
                      </button>
                    </div>
                  </div>
                ) : null}

                {previewToolPanel === 'music' ? (
                  <div className="evz-preview-panel-stack">
                    <label className="evz-preview-file">
                      <MusicNoteRoundedIcon fontSize="small" />
                      {musicName || 'Add music'}
                      <input type="file" accept="audio/*" onChange={handleMusicUpload} />
                    </label>
                    <button type="button" className="evz-preview-action" onClick={toggleMusic}>
                      {musicPlaying ? 'Pause' : 'Play'}
                    </button>
                    <label className="evz-preview-slider">
                      <span>Volume</span>
                      <input type="range" min="0" max="100" value={musicVolume} onChange={(event) => setMusicVolume(Number(event.target.value))} />
                      <b>{musicVolume}%</b>
                    </label>
                  </div>
                ) : null}

                {previewToolPanel === 'actions' ? (
                  <div className="evz-preview-panel-stack">
                    <button type="button" className="evz-preview-action primary" onClick={saveEffect}>
                      Save effect
                    </button>
                    <button type="button" className="evz-preview-action" onClick={exportImage}>
                      Export PNG
                    </button>
                    <button type="button" className="evz-preview-action" onClick={onOpenEditor}>
                      Open editor
                    </button>
                  </div>
                ) : null}
              </div>
            ) : null}
            {toolBadge ? <div className="evz-clean-tool-badge">{toolBadge}</div> : null}
            {!cameraHudCollapsed ? (
              <div className="evz-mode-strip" aria-label="Camera modes" onWheel={handleHorizontalWheel}>
                {creatorModeStrip.map((mode) => (
                  <button
                    key={mode.mode}
                    type="button"
                    className={cameraMode === mode.mode ? 'active' : ''}
                    onClick={() => {
                      setCameraMode(mode.mode);
                      notify(`${mode.label} mode ready.`);
                    }}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            ) : null}
            {!cameraHudCollapsed && cameraFiltersVisible ? (
              <div className="evz-filter-filmstrip" aria-label="Camera filters" onWheel={handleHorizontalWheel}>
                {captureStripFilters.map((filter) => (
                  <button
                    key={filter.id}
                    type="button"
                    className={filter.id === activeCameraFilter.id ? 'active' : ''}
                    onClick={() => {
                      setActiveCameraFilterId(filter.id);
                      notify(`${filter.name} filter applied.`);
                    }}
                  >
                    <span className={`evz-lens-avatar evz-lens-avatar-${filter.id}`} />
                  </button>
                ))}
              </div>
            ) : null}
            <div className="evz-camera-controls" aria-label="Camera capture controls">
              <span className="evz-capture-spacer" aria-hidden="true" />
              <button
                type="button"
                className={`evz-shutter ${cameraMode === 'VIDEO' || cameraMode === 'SLO-MO' || cameraMode === 'TIME LAPSE' ? 'record' : ''}`}
                aria-label="Capture"
                onClick={captureFrame}
              />
              <span className="evz-capture-spacer" aria-hidden="true" />
            </div>
          </div>
          <div className="evz-post-row">
            <button
              type="button"
              className="evz-post-thumb"
              aria-label="Open recent capture"
              onClick={() => notify(snapshotUrl ? 'Latest capture ready for posting.' : 'Capture an image first.')}
            >
              {snapshotUrl ? <img src={snapshotUrl} alt="" /> : <CameraAltRoundedIcon fontSize="small" />}
            </button>
            <strong>POST</strong>
            <button
              type="button"
              className="evz-post-action"
              aria-label={cameraActive ? 'Close camera' : 'Open camera'}
              onClick={cameraActive ? stopCamera : () => void startCamera()}
            >
              {cameraActive ? 'Close' : 'Open'}
            </button>
          </div>
          <div className="evz-upload-progress" aria-label="Upload status">
            <span style={{ width: `${uploadProgress}%` }} />
          </div>
          <p className="evz-status-line">{uploadStatus}</p>
          <div className="evz-home-indicator" aria-hidden="true" />
        </div>

        <div className="evz-composer-controls">
          <div className="evz-control-group">
            <div className="evz-control-title">
              <strong>Upload</strong>
              <small>{imageName || 'No image selected'}</small>
            </div>
            <label className="evz-file-button">
              <UploadFileRoundedIcon fontSize="small" />
              Upload image
              <input type="file" accept="image/*" onChange={handleImageUpload} />
            </label>
            <div className="evz-camera-open-row">
              <button type="button" className="evz-mini-action primary" onClick={() => void startCamera()}>
                <CameraAltRoundedIcon fontSize="small" />
                Open camera
              </button>
              <button type="button" className="evz-mini-action" onClick={stopCamera} disabled={!cameraActive}>
                Close
              </button>
            </div>
          </div>

          <div className="evz-control-group">
            <div className="evz-control-title">
              <strong>Filters</strong>
              <small>Colors open when a filter is selected</small>
            </div>
            <div className="evz-effect-selector">
              {effectPresets.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  className={preset.id === activePreset.id ? 'active' : ''}
                  onClick={() => selectEffect(preset)}
                >
                  <AutoFixHighRoundedIcon fontSize="small" />
                  <span>{preset.name}</span>
                </button>
              ))}
            </div>
            {showPalette && (
              <div className="evz-color-popover">
                <strong>{activePreset.name} colors</strong>
                <div>
                  {activePreset.colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={color === activeColor ? 'selected' : ''}
                      style={{ background: color }}
                      aria-label={`Use ${color}`}
                      onClick={() => {
                        setActiveColor(color);
                        notify(`${activePreset.name} color updated.`);
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="evz-control-group">
            <div className="evz-control-title">
              <strong>Face editing</strong>
              <small>Nose size updates live, labels export clean</small>
            </div>
            <label className="evz-slider-row">
              <span>Nose size</span>
              <input
                type="range"
                min="10"
                max="100"
                value={noseSize}
                onChange={(event) => {
                  setNoseSize(Number(event.target.value));
                  setToolBadge('Nose adjusted');
                }}
              />
              <b>{noseSize}%</b>
            </label>
            <label className="evz-slider-row">
              <span>Softness</span>
              <input type="range" min="0" max="100" value={softness} onChange={(event) => setSoftness(Number(event.target.value))} />
              <b>{softness}%</b>
            </label>
            <label className="evz-slider-row">
              <span>Sparkle</span>
              <input type="range" min="0" max="100" value={sparkle} onChange={(event) => setSparkle(Number(event.target.value))} />
              <b>{sparkle}%</b>
            </label>
            <label className="evz-slider-row">
              <span>Vignette</span>
              <input type="range" min="0" max="70" value={vignette} onChange={(event) => setVignette(Number(event.target.value))} />
              <b>{vignette}%</b>
            </label>
          </div>

          <div className="evz-control-group evz-adjust-card">
            <div className="evz-adjust-head">
              <button type="button" aria-label="Undo adjust" onClick={() => notify('Undo adjust ready.')}>
                <RotateLeftRoundedIcon fontSize="small" />
              </button>
              <strong>ADJUST</strong>
              <button type="button" aria-label="Redo adjust" onClick={() => notify('Redo adjust ready.')}>
                <RotateRightRoundedIcon fontSize="small" />
              </button>
            </div>
            <div className="evz-adjust-icons" aria-label="Photo adjustment tools">
              {adjustmentTools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <button
                    key={tool.id}
                    type="button"
                    className={activeAdjustmentId === tool.id ? 'active' : ''}
                    aria-label={tool.name}
                    onClick={() => {
                      setActiveAdjustmentId(tool.id);
                      notify(`${tool.name} ready.`);
                    }}
                  >
                    <Icon fontSize="small" />
                  </button>
                );
              })}
            </div>
            <strong className="evz-adjust-label">{activeAdjustment.name}</strong>
            <label className="evz-camera-slider">
              <input
                type="range"
                min={activeAdjustment.min}
                max={activeAdjustment.max}
                value={activeAdjustmentValue}
                onChange={(event) => updateAdjustment(activeAdjustment.id, Number(event.target.value))}
              />
            </label>
            <div className="evz-editor-toolbar" aria-label="Editor tool bar">
              <button
                type="button"
                onClick={() => {
                  setAdjustments(Object.fromEntries(adjustmentTools.map((tool) => [tool.id, tool.defaultValue])));
                  setVignette(24);
                  notify('Adjustments reset.');
                }}
              >
                Cancel
              </button>
              <button type="button" aria-label="Filters" onClick={() => setActiveCameraFilterId(activeCameraFilter.id === 'vivid' ? 'natural' : 'vivid')}>
                <FilterVintageRoundedIcon fontSize="small" />
              </button>
              <button type="button" className="active" aria-label="Adjust">
                <TuneRoundedIcon fontSize="small" />
              </button>
              <button type="button" aria-label="Color" onClick={() => setShowPalette((value) => !value)}>
                <ColorLensRoundedIcon fontSize="small" />
              </button>
              <button
                type="button"
                aria-label="Crop"
                onClick={() => {
                  setCameraMode('SQUARE');
                  notify('Square crop guide enabled.');
                }}
              >
                <CropRoundedIcon fontSize="small" />
              </button>
              <button type="button" onClick={saveEffect}>Done</button>
            </div>
          </div>

          <div className="evz-control-group">
            <div className="evz-control-title">
              <strong>Music</strong>
              <small>{musicName || 'Add a soundtrack or stinger'}</small>
            </div>
            <div className="evz-music-actions">
              <label className="evz-file-button">
                <MusicNoteRoundedIcon fontSize="small" />
                Add music
                <input type="file" accept="audio/*" onChange={handleMusicUpload} />
              </label>
              <button type="button" className="evz-mini-action" onClick={toggleMusic}>
                {musicPlaying ? <PauseRoundedIcon fontSize="small" /> : <PlayArrowRoundedIcon fontSize="small" />}
                {musicPlaying ? 'Pause' : 'Play'}
              </button>
            </div>
            <label className="evz-slider-row">
              <span>Volume</span>
              <input type="range" min="0" max="100" value={musicVolume} onChange={(event) => setMusicVolume(Number(event.target.value))} />
              <b>{musicVolume}%</b>
            </label>
            <audio ref={audioRef} onEnded={() => setMusicPlaying(false)} />
          </div>

          <div className="evz-action-row">
            <button type="button" className="evz-mini-action primary" onClick={saveEffect}>
              Save effect
            </button>
            <button type="button" className="evz-mini-action" onClick={exportImage}>
              <FileDownloadRoundedIcon fontSize="small" />
              Export PNG
            </button>
            <button type="button" className="evz-mini-action" onClick={onOpenEditor}>
              Open editor
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

const composerStyles = `
.evz-live-composer,
.evz-live-composer * {
  box-sizing: border-box;
}

.evz-live-composer {
  margin-top: 16px;
  border: 1px solid rgba(15, 23, 42, .10);
  border-radius: 30px;
  padding: 18px;
  background: rgba(255, 255, 255, .88);
  box-shadow: 0 16px 42px rgba(15, 23, 42, .08);
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
}

.evz-live-composer.compact {
  padding: 14px;
  border-radius: 22px;
  background: rgba(248, 250, 252, .92);
}

.evz-live-composer-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
}

.evz-live-composer-head span {
  color: #00a879;
  text-transform: uppercase;
  letter-spacing: .12em;
  font-size: 11px;
  font-weight: 1000;
}

.evz-live-composer-head h2 {
  margin: 7px 0 0;
  color: #07120d;
  font-size: 28px;
  line-height: 1;
  font-weight: 1000;
  letter-spacing: -.055em;
}

.evz-live-composer.compact .evz-live-composer-head h2 {
  font-size: 20px;
}

.evz-live-composer-head p {
  max-width: 780px;
  margin: 10px 0 0;
  color: #607086;
  font-size: 13.5px;
  line-height: 1.5;
  font-weight: 750;
}

.evz-composer-status {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.evz-composer-status em {
  min-height: 30px;
  padding: 0 10px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  color: #008262;
  background: rgba(3, 205, 140, .11);
  border: 1px solid rgba(3, 205, 140, .22);
  font-style: normal;
  font-size: 11px;
  font-weight: 950;
}

.evz-live-composer-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 340px), 1fr));
  gap: 16px;
  align-items: start;
}

.evz-live-composer.compact .evz-live-composer-grid {
  grid-template-columns: 1fr;
}

.evz-canvas-panel {
  overflow: hidden;
  border-radius: 30px;
  border: 1px solid rgba(255, 255, 255, .12);
  background: #000;
}

.evz-camera-stage {
  position: relative;
  min-height: 0;
  aspect-ratio: 9 / 16;
  background: #010101;
  isolation: isolate;
  overflow: hidden;
}

.evz-hidden-video {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
}

.evz-effect-canvas {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  background: #050505;
}

.evz-empty-preview {
  position: absolute;
  inset: 0;
  z-index: 4;
  background: #030303;
  pointer-events: none;
}

.evz-empty-preview span {
  display: none;
}

.evz-camera-topbar {
  position: absolute;
  z-index: 10;
  top: 16px;
  left: 14px;
  right: 14px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.evz-stage-icon-btn,
.evz-zoom-chip,
.evz-flip-camera,
.evz-last-capture,
.evz-post-thumb,
.evz-post-action {
  border: 0;
  color: #fff;
  background: rgba(0, 0, 0, .38);
  backdrop-filter: blur(10px);
}

.evz-hidden-file-input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
  width: 1px;
  height: 1px;
}

.evz-stage-icon-btn {
  width: 42px;
  height: 42px;
  flex: 0 0 42px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  border: 1px solid rgba(255, 255, 255, .14);
  cursor: pointer;
}

.evz-stage-icon-btn svg {
  font-size: 30px;
}

.evz-stage-icon-btn.active {
  color: #ffffff;
  opacity: .82;
}

.evz-plain-icon {
  width: 40px;
  height: 40px;
  flex-basis: 40px;
  border: 0;
  background: transparent;
  backdrop-filter: none;
  color: #fff;
}

.evz-plain-icon svg {
  font-size: 38px;
}

.evz-sound-pill {
  min-height: 42px;
  border: 0;
  border-radius: 999px;
  padding: 0 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #fff;
  background: rgba(0, 0, 0, .45);
  font-size: 13px;
  font-weight: 900;
  letter-spacing: 0;
  cursor: pointer;
}

.evz-sound-pill span {
  white-space: nowrap;
}

.evz-camera-right-rail {
  position: absolute;
  z-index: 10;
  top: 72px;
  right: 12px;
  display: grid;
  justify-items: end;
  gap: 10px;
  max-height: calc(100% - 220px);
  overflow-y: auto;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
}

.evz-camera-right-rail::-webkit-scrollbar {
  display: none;
}

.evz-camera-right-rail .evz-plain-icon {
  width: 38px;
  height: 38px;
  flex-basis: 38px;
}

.evz-camera-right-rail .evz-plain-icon svg {
  font-size: 34px;
}

.evz-rail-separator {
  width: 24px;
  height: 1px;
  background: rgba(255, 255, 255, .45);
  margin: 2px 5px;
}

.evz-tool-launcher.active {
  color: #34d399;
  transform: scale(1.06);
}

.evz-preview-tool-panel {
  position: absolute;
  z-index: 11;
  top: 64px;
  left: 12px;
  right: 66px;
  max-height: calc(100% - 300px);
  overflow-y: auto;
  padding: 12px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, .18);
  background: rgba(4, 8, 14, .82);
  backdrop-filter: blur(16px);
  display: grid;
  gap: 10px;
  box-shadow: 0 12px 28px rgba(0, 0, 0, .42);
}

.evz-preview-tool-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.evz-preview-tool-head strong {
  color: #f8fafc;
  font-size: 12px;
  font-weight: 1000;
  text-transform: uppercase;
  letter-spacing: .05em;
}

.evz-preview-tool-head button {
  width: 30px;
  height: 30px;
  border: 0;
  border-radius: 999px;
  display: grid;
  place-items: center;
  color: #e2e8f0;
  background: rgba(255, 255, 255, .1);
}

.evz-preview-panel-stack {
  display: grid;
  gap: 8px;
}

.evz-preview-file,
.evz-preview-action,
.evz-preview-effect-list button {
  min-height: 36px;
  border: 1px solid rgba(255, 255, 255, .16);
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #e2e8f0;
  background: rgba(255, 255, 255, .06);
  font-size: 12px;
  font-weight: 850;
  cursor: pointer;
}

.evz-preview-file {
  width: 100%;
  position: relative;
}

.evz-preview-file input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}

.evz-preview-action.primary,
.evz-preview-effect-list button.active {
  color: #ffffff;
  border-color: rgba(16, 185, 129, .64);
  background: linear-gradient(135deg, rgba(16, 185, 129, .88), rgba(5, 150, 105, .88));
}

.evz-preview-action:disabled {
  opacity: .45;
  cursor: not-allowed;
}

.evz-preview-effect-list {
  display: grid;
  gap: 6px;
}

.evz-preview-effect-list button {
  justify-content: flex-start;
  padding: 0 10px;
}

.evz-preview-color-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.evz-preview-color-row button {
  width: 26px;
  height: 26px;
  border-radius: 999px;
  border: 2px solid rgba(255, 255, 255, .78);
}

.evz-preview-color-row button.active {
  box-shadow: 0 0 0 2px rgba(16, 185, 129, .7);
}

.evz-preview-slider {
  display: grid;
  grid-template-columns: 70px 1fr 42px;
  align-items: center;
  gap: 8px;
  color: #cbd5e1;
  font-size: 11px;
  font-weight: 800;
}

.evz-preview-slider.single {
  grid-template-columns: 1fr;
}

.evz-preview-slider input {
  width: 100%;
  accent-color: #facc15;
}

.evz-preview-slider b {
  text-align: right;
  color: #fff;
}

.evz-preview-adjust-icons {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 2px;
  scrollbar-width: none;
}

.evz-preview-adjust-icons::-webkit-scrollbar {
  display: none;
}

.evz-preview-adjust-icons button {
  flex: 0 0 34px;
  width: 34px;
  height: 34px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, .2);
  display: grid;
  place-items: center;
  color: #e2e8f0;
  background: rgba(255, 255, 255, .08);
}

.evz-preview-adjust-icons button.active {
  color: #111827;
  background: #facc15;
}

.evz-preview-adjust-label {
  justify-self: center;
  color: #f8fafc;
  font-size: 12px;
  font-weight: 900;
  text-transform: uppercase;
}

.evz-preview-adjust-actions {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 6px;
}

.evz-preview-adjust-actions button {
  min-height: 30px;
  border: 1px solid rgba(255, 255, 255, .16);
  border-radius: 8px;
  color: #e2e8f0;
  background: rgba(255, 255, 255, .06);
  font-size: 11px;
  font-weight: 850;
}

.evz-beauty-btn {
  position: relative;
}

.evz-beauty-btn span {
  position: absolute;
  right: 1px;
  bottom: 2px;
  width: 11px;
  height: 11px;
  border-radius: 999px;
  background: #ff2d55;
  border: 2px solid #fff;
}

.evz-camera-grid {
  position: absolute;
  z-index: 3;
  inset: 0;
  pointer-events: none;
  background:
    linear-gradient(to right, transparent calc(33.33% - .5px), rgba(255,255,255,.34) calc(33.33% - .5px), rgba(255,255,255,.34) calc(33.33% + .5px), transparent calc(33.33% + .5px)),
    linear-gradient(to right, transparent calc(66.66% - .5px), rgba(255,255,255,.34) calc(66.66% - .5px), rgba(255,255,255,.34) calc(66.66% + .5px), transparent calc(66.66% + .5px)),
    linear-gradient(to bottom, transparent calc(33.33% - .5px), rgba(255,255,255,.34) calc(33.33% - .5px), rgba(255,255,255,.34) calc(33.33% + .5px), transparent calc(33.33% + .5px)),
    linear-gradient(to bottom, transparent calc(66.66% - .5px), rgba(255,255,255,.34) calc(66.66% - .5px), rgba(255,255,255,.34) calc(66.66% + .5px), transparent calc(66.66% + .5px));
}

.evz-clean-tool-badge {
  position: absolute;
  z-index: 9;
  left: 50%;
  bottom: 256px;
  transform: translateX(-50%);
  min-width: 132px;
  max-width: calc(100% - 40px);
  padding: 9px 16px;
  border-radius: 10px;
  color: #fff;
  background: rgba(0, 0, 0, .86);
  text-align: center;
  text-transform: uppercase;
  font-size: 13px;
  line-height: 1;
  font-weight: 1000;
  letter-spacing: .06em;
  pointer-events: none;
  animation: evzBadgeOut .85s ease both;
}

@keyframes evzBadgeOut {
  0%, 62% { opacity: 1; transform: translateX(-50%) translateY(0); }
  100% { opacity: 0; transform: translateX(-50%) translateY(8px); }
}

.evz-mode-strip {
  position: absolute;
  z-index: 11;
  left: 0;
  right: 0;
  bottom: 192px;
  display: flex;
  gap: 26px;
  align-items: center;
  justify-content: flex-start;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 0 42px;
  touch-action: pan-x;
  overscroll-behavior-x: contain;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}

.evz-mode-strip::-webkit-scrollbar,
.evz-filter-filmstrip::-webkit-scrollbar {
  display: none;
}

.evz-mode-strip button {
  border: 0;
  color: rgba(255, 255, 255, .92);
  background: transparent;
  white-space: nowrap;
  font-size: clamp(21px, 2vw, 30px);
  font-weight: 1000;
  letter-spacing: 0;
}

.evz-mode-strip button.active {
  color: #090909;
  background: #fff;
  min-height: 38px;
  padding: 0 14px;
  border-radius: 999px;
}

.evz-filter-filmstrip {
  position: absolute;
  z-index: 11;
  left: 0;
  right: 0;
  bottom: 60px;
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: flex-start;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 0 34px;
  touch-action: pan-x;
  overscroll-behavior-x: contain;
  -webkit-overflow-scrolling: touch;
}

.evz-filter-filmstrip button {
  width: 78px;
  border: 0;
  background: transparent;
  color: rgba(255, 255, 255, .82);
  display: grid;
  justify-items: center;
  gap: 0;
}

.evz-lens-avatar {
  width: 72px;
  height: 72px;
  border-radius: 999px;
  border: 2px solid rgba(255, 255, 255, .2);
  box-shadow: 0 8px 18px rgba(0, 0, 0, .42);
}

.evz-lens-avatar-vivid {
  background:
    radial-gradient(circle at 56% 38%, #f3c7a5 0 23%, transparent 24%),
    radial-gradient(circle at 48% 23%, #1f2937 0 21%, transparent 22%),
    linear-gradient(130deg, #f472b6, #f97316 52%, #7c3aed);
}

.evz-lens-avatar-original {
  background:
    radial-gradient(circle at 56% 38%, #f7dfcc 0 24%, transparent 25%),
    radial-gradient(circle at 47% 23%, #2f3540 0 21%, transparent 22%),
    linear-gradient(130deg, #ffffff, #d6dbe6 52%, #9ca3af);
}

.evz-lens-avatar-natural {
  background:
    radial-gradient(circle at 56% 38%, #f7d9bd 0 24%, transparent 25%),
    radial-gradient(circle at 47% 22%, #111827 0 21%, transparent 22%),
    linear-gradient(130deg, #67e8f9, #38bdf8 52%, #22c55e);
}

.evz-lens-avatar-dramatic {
  background:
    radial-gradient(circle at 56% 39%, #d5b08d 0 24%, transparent 25%),
    radial-gradient(circle at 47% 23%, #09090b 0 21%, transparent 22%),
    linear-gradient(130deg, #111827, #334155 56%, #6b7280);
}

.evz-lens-avatar-warm {
  background:
    radial-gradient(circle at 56% 39%, #d7a37f 0 24%, transparent 25%),
    radial-gradient(circle at 47% 23%, #09090b 0 21%, transparent 22%),
    linear-gradient(130deg, #fbbf24, #fb7185 56%, #fb923c);
}

.evz-lens-avatar-cool {
  background:
    radial-gradient(circle at 56% 39%, #c58f66 0 24%, transparent 25%),
    radial-gradient(circle at 47% 24%, #0f172a 0 21%, transparent 22%),
    linear-gradient(130deg, #818cf8, #60a5fa 52%, #1e3a8a);
}

.evz-lens-avatar-noir {
  background:
    radial-gradient(circle at 56% 39%, #b89472 0 24%, transparent 25%),
    radial-gradient(circle at 47% 24%, #000000 0 21%, transparent 22%),
    linear-gradient(130deg, #f8fafc, #6b7280 52%, #0f172a);
}

.evz-filter-filmstrip button.active > span {
  box-shadow: 0 0 0 3px #fff;
}

.evz-camera-controls {
  position: absolute;
  z-index: 10;
  left: 16px;
  right: 16px;
  bottom: 56px;
  display: grid;
  grid-template-columns: 64px 1fr 64px;
  align-items: center;
  justify-items: center;
  gap: 12px;
  pointer-events: none;
}

.evz-shutter {
  width: 116px;
  height: 116px;
  border-radius: 999px;
  border: 6px solid #fff;
  pointer-events: auto;
  background: #ff2d55;
  box-shadow: inset 0 0 0 4px #050505, 0 0 0 2px rgba(255, 255, 255, .34);
  cursor: pointer;
}

.evz-shutter.record {
  background: #ff2d55;
  box-shadow: inset 0 0 0 4px #050505, 0 0 0 1px rgba(255, 255, 255, .34);
}

.evz-capture-spacer {
  width: 52px;
  height: 52px;
  border-radius: 999px;
}

.evz-post-row {
  min-height: 82px;
  padding: 8px 16px;
  display: grid;
  grid-template-columns: 56px 1fr auto;
  align-items: center;
  gap: 10px;
  color: #fff;
  background: #000;
}

.evz-post-thumb {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  border: 1px solid rgba(255, 255, 255, .24);
}

.evz-post-thumb img {
  width: 100%;
  height: 100%;
  border-radius: 10px;
  object-fit: cover;
}

.evz-post-row strong {
  text-align: center;
  font-size: 41px;
  font-weight: 1000;
}

.evz-post-action {
  min-height: 36px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, .25);
  padding: 0 12px;
  font-size: 12px;
  font-weight: 900;
  cursor: pointer;
}

.evz-camera-open-row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
  margin-top: 8px;
}

.evz-upload-progress {
  display: none;
}

.evz-upload-progress span {
  display: block;
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, #03cd8c, #f77f00);
  transition: width .24s ease;
}

.evz-status-line {
  display: none;
}

.evz-home-indicator {
  width: 40%;
  height: 5px;
  margin: 8px auto 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, .34);
}

.evz-composer-controls {
  display: grid;
  gap: 12px;
  min-width: 0;
}

.evz-control-group {
  padding: 14px;
  border-radius: 20px;
  border: 1px solid rgba(15, 23, 42, .08);
  background: #ffffff;
  min-width: 0;
  max-width: 100%;
  overflow-x: hidden;
}

.evz-control-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 10px;
}

.evz-control-title strong {
  color: #0f172a;
  font-size: 13.5px;
  font-weight: 1000;
}

.evz-control-title small {
  min-width: 0;
  color: #64748b;
  font-size: 11.5px;
  font-weight: 800;
  text-align: right;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.evz-file-button,
.evz-mini-action,
.evz-effect-selector button {
  min-height: 42px;
  border: 1px solid rgba(15, 23, 42, .10);
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #102033;
  background: #f8fafc;
  font-size: 12.5px;
  font-weight: 950;
  cursor: pointer;
  min-width: 0;
}

.evz-file-button {
  width: 100%;
  position: relative;
}

.evz-file-button input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}

.evz-effect-selector {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.evz-effect-selector button {
  justify-content: flex-start;
  padding: 0 10px;
}

.evz-effect-selector button.active,
.evz-mini-action.primary {
  color: #ffffff;
  border-color: transparent;
  background: linear-gradient(135deg, #03cd8c, #0aa779);
  box-shadow: 0 14px 28px rgba(3, 205, 140, .20);
}

.evz-color-popover {
  margin-top: 10px;
  padding: 12px;
  border-radius: 16px;
  border: 1px solid rgba(15, 23, 42, .10);
  background: #f8fafc;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, .8);
}

.evz-color-popover strong {
  display: block;
  margin-bottom: 9px;
  color: #0f172a;
  font-size: 12px;
  font-weight: 950;
}

.evz-color-popover div {
  display: flex;
  flex-wrap: wrap;
  gap: 9px;
}

.evz-color-popover button {
  width: 34px;
  height: 34px;
  border: 2px solid rgba(255, 255, 255, .9);
  border-radius: 999px;
  box-shadow: 0 8px 18px rgba(15, 23, 42, .14);
}

.evz-color-popover button.selected {
  outline: 3px solid rgba(3, 205, 140, .35);
}

.evz-slider-row {
  display: grid;
  grid-template-columns: 84px minmax(0, 1fr) 48px;
  gap: 10px;
  align-items: center;
  min-height: 34px;
  color: #475569;
  font-size: 12px;
  font-weight: 900;
}

.evz-slider-row input {
  width: 100%;
  accent-color: #03cd8c;
}

.evz-slider-row b {
  color: #0f172a;
  text-align: right;
}

.evz-music-actions,
.evz-action-row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
}

.evz-action-row {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.evz-mini-action {
  padding: 0 12px;
}

.evz-mini-action:disabled {
  opacity: .45;
  cursor: not-allowed;
}

.evz-adjust-card {
  color: #fff;
  background: #050505;
  border-color: rgba(255, 255, 255, .12);
}

.evz-adjust-head {
  display: grid;
  grid-template-columns: 42px 1fr 42px;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.evz-adjust-head strong {
  color: #fff;
  text-align: center;
  font-size: 13px;
  font-weight: 1000;
  letter-spacing: .1em;
}

.evz-adjust-head button,
.evz-adjust-icons button,
.evz-editor-toolbar button {
  border: 0;
  color: #fff;
  background: transparent;
}

.evz-adjust-head button {
  width: 36px;
  height: 36px;
  border-radius: 999px;
  color: rgba(255, 255, 255, .72);
  background: rgba(255, 255, 255, .08);
}

.evz-adjust-icons {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding: 4px 0 8px;
  scrollbar-width: none;
}

.evz-adjust-icons::-webkit-scrollbar {
  display: none;
}

.evz-adjust-icons button {
  flex: 0 0 54px;
  width: 54px;
  height: 54px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  border: 2px solid rgba(255, 255, 255, .22);
  background: rgba(255, 255, 255, .04);
}

.evz-adjust-icons button.active {
  border-color: rgba(255, 255, 255, .36);
  background: rgba(255, 255, 255, .16);
  box-shadow: 0 0 0 2px rgba(255, 216, 61, .42);
}

.evz-adjust-label {
  display: block;
  width: fit-content;
  margin: 4px auto 10px;
  padding: 7px 12px;
  border-radius: 8px;
  color: #fff;
  background: #000;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: 1000;
  letter-spacing: .08em;
}

.evz-camera-slider {
  display: block;
  padding: 0 4px 8px;
}

.evz-camera-slider input {
  width: 100%;
  accent-color: #ffd83d;
}

.evz-editor-toolbar {
  display: grid;
  grid-template-columns: 1fr 38px 38px 38px 38px 1fr;
  gap: 10px;
  align-items: center;
  margin-top: 8px;
}

.evz-editor-toolbar button {
  min-height: 38px;
  display: grid;
  place-items: center;
  color: rgba(255, 255, 255, .86);
  font-size: 14px;
  font-weight: 950;
}

.evz-editor-toolbar button.active {
  color: #ffd83d;
}

.evz-editor-toolbar button:first-child {
  justify-items: start;
}

.evz-editor-toolbar button:last-child {
  justify-items: end;
  color: rgba(255, 255, 255, .42);
}

[data-evz-theme='dark'] .evz-live-composer {
  border-color: rgba(148, 163, 184, .24);
  background: rgba(16, 32, 48, .92);
}

[data-evz-theme='dark'] .evz-control-group,
[data-evz-theme='dark'] .evz-color-popover {
  border-color: rgba(148, 163, 184, .22);
  background: rgba(20, 38, 56, .94);
}

[data-evz-theme='dark'] .evz-live-composer-head h2,
[data-evz-theme='dark'] .evz-control-title strong,
[data-evz-theme='dark'] .evz-color-popover strong,
[data-evz-theme='dark'] .evz-slider-row b {
  color: #e8f2fb;
}

[data-evz-theme='dark'] .evz-live-composer-head p,
[data-evz-theme='dark'] .evz-control-title small,
[data-evz-theme='dark'] .evz-slider-row {
  color: #9fb0c2;
}

[data-evz-theme='dark'] .evz-file-button,
[data-evz-theme='dark'] .evz-mini-action,
[data-evz-theme='dark'] .evz-effect-selector button {
  border-color: rgba(148, 163, 184, .24);
  color: #d9e7f3;
  background: rgba(15, 28, 43, .92);
}

[data-evz-theme='dark'] .evz-adjust-card {
  background: #050505;
}

@media (max-width: 1180px) {
  .evz-live-composer-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .evz-live-composer {
    padding: 12px;
    border-radius: 20px;
  }

  .evz-live-composer-head {
    flex-direction: column;
  }

  .evz-composer-status {
    justify-content: flex-start;
  }

  .evz-effect-selector,
  .evz-action-row,
  .evz-music-actions {
    grid-template-columns: 1fr;
  }

  .evz-camera-open-row {
    grid-template-columns: 1fr;
  }

  .evz-control-title {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }

  .evz-control-title small {
    text-align: left;
    white-space: normal;
    overflow: visible;
    text-overflow: initial;
  }

  .evz-file-button,
  .evz-mini-action,
  .evz-effect-selector button {
    width: 100%;
    justify-content: flex-start;
    padding-inline: 12px;
    white-space: normal;
    text-align: left;
  }

  .evz-slider-row {
    grid-template-columns: 78px minmax(0, 1fr) 44px;
    gap: 8px;
  }

  .evz-camera-topbar {
    top: 12px;
    left: 10px;
    right: 10px;
  }

  .evz-plain-icon {
    width: 38px;
    height: 38px;
    flex-basis: 38px;
  }

  .evz-plain-icon svg {
    font-size: 30px;
  }

  .evz-sound-pill {
    min-height: 38px;
    padding: 0 12px;
    font-size: 12px;
  }

  .evz-camera-right-rail {
    top: 58px;
    right: 8px;
    gap: 6px;
    max-height: calc(100% - 200px);
  }

  .evz-preview-tool-panel {
    top: 54px;
    left: 8px;
    right: 56px;
    max-height: calc(100% - 248px);
    padding: 10px;
  }

  .evz-preview-adjust-actions {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .evz-mode-strip {
    justify-content: flex-start;
    bottom: 166px;
    gap: 16px;
    padding: 0 16px;
  }

  .evz-filter-filmstrip {
    justify-content: flex-start;
    bottom: 54px;
    gap: 8px;
    padding: 0 14px;
  }

  .evz-filter-filmstrip button {
    width: 66px;
  }

  .evz-lens-avatar {
    width: 58px;
    height: 58px;
  }

  .evz-camera-controls {
    grid-template-columns: 48px 1fr 48px;
    bottom: 48px;
  }

  .evz-shutter {
    width: 94px;
    height: 94px;
    border-width: 5px;
  }

  .evz-capture-spacer {
    width: 46px;
    height: 46px;
  }

  .evz-clean-tool-badge {
    bottom: 218px;
  }

  .evz-post-row strong {
    font-size: 32px;
  }

  .evz-post-action {
    min-height: 34px;
    padding-inline: 10px;
  }

  .evz-editor-toolbar {
    grid-template-columns: minmax(50px, 1fr) repeat(4, 34px) minmax(50px, 1fr);
    gap: 6px;
  }
}

@media (max-width: 420px) {
  .evz-live-composer {
    padding: 10px;
  }

  .evz-control-group {
    padding: 11px;
    border-radius: 16px;
  }

  .evz-effect-selector {
    grid-template-columns: 1fr;
  }

  .evz-slider-row {
    grid-template-columns: 1fr;
    gap: 6px;
  }

  .evz-slider-row b {
    text-align: left;
  }

  .evz-adjust-icons button {
    flex: 0 0 48px;
    width: 48px;
    height: 48px;
  }

  .evz-camera-stage {
    aspect-ratio: 9 / 16;
  }

  .evz-sound-pill span {
    max-width: 84px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .evz-preview-slider {
    grid-template-columns: 1fr;
    gap: 5px;
  }

  .evz-post-row {
    min-height: 66px;
    padding: 8px 12px;
    grid-template-columns: 46px 1fr auto;
  }

  .evz-post-thumb {
    width: 42px;
    height: 42px;
    border-radius: 10px;
  }

  .evz-post-row strong {
    font-size: 22px;
  }

  .evz-post-action {
    min-height: 30px;
    padding: 0 8px;
    font-size: 11px;
  }

  .evz-preview-tool-panel {
    right: 50px;
    max-height: calc(100% - 230px);
  }

  .evz-preview-adjust-actions {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .evz-editor-toolbar {
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }

  .evz-editor-toolbar button {
    justify-items: center !important;
  }
}
`;
