import React, { useEffect, useMemo, useRef, useState } from 'react';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import AutoFixHighRoundedIcon from '@mui/icons-material/AutoFixHighRounded';
import AutoModeRoundedIcon from '@mui/icons-material/AutoModeRounded';
import BlurOnRoundedIcon from '@mui/icons-material/BlurOnRounded';
import Brightness7RoundedIcon from '@mui/icons-material/Brightness7Rounded';
import CameraAltRoundedIcon from '@mui/icons-material/CameraAltRounded';
import CameraswitchRoundedIcon from '@mui/icons-material/CameraswitchRounded';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import ColorLensRoundedIcon from '@mui/icons-material/ColorLensRounded';
import ContrastRoundedIcon from '@mui/icons-material/ContrastRounded';
import CropRoundedIcon from '@mui/icons-material/CropRounded';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import FilterVintageRoundedIcon from '@mui/icons-material/FilterVintageRounded';
import FlashOnRoundedIcon from '@mui/icons-material/FlashOnRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import HdRoundedIcon from '@mui/icons-material/HdRounded';
import IosShareRoundedIcon from '@mui/icons-material/IosShareRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import MusicNoteRoundedIcon from '@mui/icons-material/MusicNoteRounded';
import PersonAddAltRoundedIcon from '@mui/icons-material/PersonAddAltRounded';
import RadioButtonCheckedRoundedIcon from '@mui/icons-material/RadioButtonCheckedRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import SentimentSatisfiedAltRoundedIcon from '@mui/icons-material/SentimentSatisfiedAltRounded';
import SwapVertRoundedIcon from '@mui/icons-material/SwapVertRounded';
import TimerRoundedIcon from '@mui/icons-material/TimerRounded';
import TonalityRoundedIcon from '@mui/icons-material/TonalityRounded';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import VolumeOffRoundedIcon from '@mui/icons-material/VolumeOffRounded';
import WbSunnyRoundedIcon from '@mui/icons-material/WbSunnyRounded';
import type { SvgIconComponent } from '@mui/icons-material';

type SnapView = 'camera' | 'stories' | 'adjust' | 'capture';
type SnapCategory = 'Favourites' | 'For you' | 'Aesthetic';
type CameraMode = 'TIME-LAPSE' | 'SLO-MO' | 'VIDEO' | 'PHOTO' | 'PORTRAIT' | 'SQUARE' | 'PANO';
type LensOverlay =
  | 'clean'
  | 'phone-stack'
  | 'time-mono'
  | 'pink-cap'
  | 'k2'
  | 'baby-pop'
  | 'heart-cloud'
  | 'ai-clips'
  | 'vivid';

type Lens = {
  id: string;
  name: string;
  creator: string;
  count: string;
  category: SnapCategory;
  overlay: LensOverlay;
  accent: string;
  filter: string;
};

type AdjustTool = {
  id: string;
  name: string;
  icon: SvgIconComponent;
  min: number;
  max: number;
  value: number;
};

type Story = {
  id: string;
  name: string;
  handle?: string;
  tone: string;
  badge?: boolean;
};

const snapViews: { id: SnapView; label: string }[] = [
  { id: 'camera', label: 'Camera' },
  { id: 'stories', label: 'Stories' },
  { id: 'adjust', label: 'Adjust' },
  { id: 'capture', label: 'Modes' },
];

const categories: SnapCategory[] = ['Favourites', 'For you', 'Aesthetic'];

const cameraModes: CameraMode[] = ['TIME-LAPSE', 'SLO-MO', 'VIDEO', 'PHOTO', 'PORTRAIT', 'SQUARE', 'PANO'];

const lenses: Lens[] = [
  {
    id: 'clean-camera',
    name: 'Clean',
    creator: 'EVzone',
    count: '2.5bn',
    category: 'Favourites',
    overlay: 'clean',
    accent: '#00c2ff',
    filter: 'saturate(1.08) contrast(1.03)',
  },
  {
    id: 'phone-stack',
    name: 'Phone Stack Challenge',
    creator: 'Lens Lab',
    count: '752m',
    category: 'For you',
    overlay: 'phone-stack',
    accent: '#f97316',
    filter: 'saturate(1.2) contrast(1.08) brightness(1.02)',
  },
  {
    id: 'mono-clock',
    name: 'Memory Mono',
    creator: 'EVzone',
    count: '1.5bn',
    category: 'For you',
    overlay: 'time-mono',
    accent: '#d1d5db',
    filter: 'grayscale(1) contrast(1.18) brightness(.92)',
  },
  {
    id: 'pink-cap',
    name: 'Pink Cap Ears',
    creator: 'Aesthetic Lab',
    count: '3.8bn',
    category: 'Aesthetic',
    overlay: 'pink-cap',
    accent: '#fb7185',
    filter: 'brightness(.97) contrast(1.08) saturate(1.12)',
  },
  {
    id: 'rgb-hearts',
    name: 'RGB Hearts',
    creator: 'Mood FX',
    count: '640m',
    category: 'Favourites',
    overlay: 'heart-cloud',
    accent: '#22c55e',
    filter: 'saturate(1.24) contrast(1.05)',
  },
  {
    id: 'k2-glass',
    name: 'K2 Prism',
    creator: 'Aesthetic Lab',
    count: '420m',
    category: 'Aesthetic',
    overlay: 'k2',
    accent: '#a78bfa',
    filter: 'saturate(1.38) hue-rotate(8deg) contrast(1.1)',
  },
  {
    id: 'baby-pop',
    name: 'Baby Pop',
    creator: 'Fun Lens',
    count: '890m',
    category: 'For you',
    overlay: 'baby-pop',
    accent: '#93c5fd',
    filter: 'brightness(1.08) saturate(1.16)',
  },
  {
    id: 'ai-clips',
    name: 'AI Clips',
    creator: 'EVzone AI',
    count: '1.2bn',
    category: 'Aesthetic',
    overlay: 'ai-clips',
    accent: '#ec4899',
    filter: 'contrast(1.1) saturate(1.3) brightness(1.03)',
  },
  {
    id: 'vivid-camera',
    name: 'Vivid',
    creator: 'Camera',
    count: '980m',
    category: 'Favourites',
    overlay: 'vivid',
    accent: '#facc15',
    filter: 'saturate(1.45) contrast(1.14) brightness(1.04)',
  },
];

const adjustTools: AdjustTool[] = [
  { id: 'auto', name: 'AUTO', icon: AutoModeRoundedIcon, min: 0, max: 100, value: 56 },
  { id: 'brilliance', name: 'BRILLIANCE', icon: AutoFixHighRoundedIcon, min: 0, max: 100, value: 62 },
  { id: 'exposure', name: 'EXPOSURE', icon: Brightness7RoundedIcon, min: 0, max: 100, value: 50 },
  { id: 'highlights', name: 'HIGHLIGHTS', icon: WbSunnyRoundedIcon, min: 0, max: 100, value: 48 },
  { id: 'shadows', name: 'SHADOWS', icon: TonalityRoundedIcon, min: 0, max: 100, value: 44 },
  { id: 'contrast', name: 'CONTRAST', icon: ContrastRoundedIcon, min: 0, max: 100, value: 55 },
  { id: 'brightness', name: 'BRIGHTNESS', icon: Brightness7RoundedIcon, min: 0, max: 100, value: 52 },
  { id: 'blackPoint', name: 'BLACK POINT', icon: ContrastRoundedIcon, min: 0, max: 100, value: 46 },
  { id: 'saturation', name: 'SATURATION', icon: ColorLensRoundedIcon, min: 0, max: 100, value: 58 },
  { id: 'warmth', name: 'WARMTH', icon: WbSunnyRoundedIcon, min: 0, max: 100, value: 61 },
  { id: 'definition', name: 'DEFINITION', icon: BlurOnRoundedIcon, min: 0, max: 100, value: 57 },
  { id: 'vignette', name: 'VIGNETTE', icon: RadioButtonCheckedRoundedIcon, min: 0, max: 100, value: 38 },
];

const filterLooks = [
  { id: 'original', label: 'Original', swatch: 'linear-gradient(135deg,#f8fafc,#9ca3af)', filter: 'none' },
  { id: 'vivid', label: 'Vivid', swatch: 'linear-gradient(135deg,#22d3ee,#facc15,#fb7185)', filter: 'saturate(1.42) contrast(1.12)' },
  { id: 'warm', label: 'Warm', swatch: 'linear-gradient(135deg,#fde68a,#fb923c,#f43f5e)', filter: 'sepia(.18) saturate(1.18) brightness(1.04)' },
  { id: 'cool', label: 'Cool', swatch: 'linear-gradient(135deg,#38bdf8,#6366f1,#f0f9ff)', filter: 'hue-rotate(338deg) saturate(1.12)' },
  { id: 'noir', label: 'Noir', swatch: 'linear-gradient(135deg,#111827,#f8fafc)', filter: 'grayscale(1) contrast(1.22)' },
];

const friends: Story[] = [
  { id: 'hamy', name: 'Hamy Musa', tone: 'linear-gradient(135deg,#76ff03,#00c853)' },
  { id: 'philo', name: 'Philo', tone: 'linear-gradient(135deg,#374151,#d1d5db)' },
  { id: 'gadya', name: 'Gadya...', handle: 'theeprilious', tone: 'linear-gradient(135deg,#111827,#2563eb)', badge: true },
  { id: 'gtk', name: '<gtk-am...', handle: 'shesart24', tone: 'linear-gradient(135deg,#f97316,#ec4899)', badge: true },
  { id: 'joo', name: 'Joo...', handle: 'black...', tone: 'linear-gradient(135deg,#fb7185,#fef3c7)' },
];

const discoverCards = [
  { id: 'glide', title: 'Floating Heels', meta: '3.0M', tone: 'linear-gradient(160deg,#38bdf8 0%,#14b8a6 50%,#0f172a 100%)' },
  { id: 'ghost', title: 'Ghost Forex', meta: 'Quietest trader', tone: 'linear-gradient(160deg,#f97316 0%,#111827 58%,#e5e7eb 100%)' },
  { id: 'slide', title: 'POV: sky launch', meta: 'Discover', tone: 'linear-gradient(160deg,#bfdbfe 0%,#22c55e 56%,#0f766e 100%)' },
  { id: 'spines', title: 'Texture Palm', meta: 'Aesthetic', tone: 'linear-gradient(160deg,#fef3c7 0%,#d9f99d 45%,#92400e 100%)' },
];

function buildAdjustFilter(values: Record<string, number>, activeFilterId: string) {
  const get = (id: string, fallback: number) => values[id] ?? fallback;
  const exposure = 0.76 + get('exposure', 50) / 190;
  const brilliance = 0.84 + get('brilliance', 62) / 250;
  const brightness = 0.8 + get('brightness', 52) / 240;
  const contrast = 0.86 + get('contrast', 55) / 210 + get('blackPoint', 46) / 500;
  const saturation = 0.78 + get('saturation', 58) / 170;
  const warmth = (get('warmth', 61) - 50) * 0.42;
  const definition = 0.94 + get('definition', 57) / 360;
  const look = filterLooks.find((item) => item.id === activeFilterId)?.filter ?? 'none';

  return [
    look,
    `brightness(${(exposure * brilliance * brightness).toFixed(3)})`,
    `contrast(${(contrast * definition).toFixed(3)})`,
    `saturate(${saturation.toFixed(3)})`,
    `sepia(${Math.max(0, warmth / 100).toFixed(3)})`,
    `hue-rotate(${warmth.toFixed(2)}deg)`,
  ].join(' ');
}

function formatDate(date: Date) {
  const weekday = date.toLocaleDateString(undefined, { weekday: 'long' });
  const day = date.getDate();
  const month = date.toLocaleDateString(undefined, { month: 'long' });
  const year = date.getFullYear();
  return `${weekday} ${day} ${month} ${year}`;
}

function formatTime(date: Date) {
  return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false });
}

function ToolButton({
  label,
  children,
  onClick,
  active = false,
}: {
  label: string;
  children: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
}) {
  return (
    <button type="button" className={`snap-icon-btn ${active ? 'active' : ''}`} aria-label={label} title={label} onClick={onClick}>
      {children}
    </button>
  );
}

function LensThumbnail({ lens, active, onClick }: { lens: Lens; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      className={`snap-lens-thumb ${active ? 'active' : ''}`}
      onClick={onClick}
      aria-label={lens.name}
      title={lens.name}
      style={{ '--lens-accent': lens.accent } as React.CSSProperties}
    >
      <span className={`snap-lens-art ${lens.overlay}`}>
        {lens.overlay === 'phone-stack' ? <b>Phone Stack</b> : null}
        {lens.overlay === 'k2' ? <b>K2</b> : null}
        {lens.overlay === 'ai-clips' ? <b>AI</b> : null}
      </span>
    </button>
  );
}

function SimulatedScene({ className = '' }: { className?: string }) {
  return (
    <div className={`snap-sim-scene ${className}`}>
      <div className="snap-wall-line one" />
      <div className="snap-wall-line two" />
      <div className="snap-shoulders" />
      <div className="snap-head">
        <span className="snap-hair" />
        <span className="snap-glasses left" />
        <span className="snap-glasses right" />
        <span className="snap-bridge" />
        <span className="snap-nose" />
        <span className="snap-mouth" />
      </div>
      <div className="snap-shirt left" />
      <div className="snap-shirt right" />
    </div>
  );
}

function LensOverlayLayer({ lens, now }: { lens: Lens; now: Date }) {
  if (lens.overlay === 'phone-stack') {
    return (
      <div className="snap-overlay phone-stack">
        <div className="snap-challenge-copy">
          <strong>Memory Challenge</strong>
          <span>Watch carefully</span>
        </div>
        <div className="snap-phone-row">
          {Array.from({ length: 8 }).map((_, index) => (
            <span key={index} className={index % 3 === 1 ? 'dark' : index % 3 === 2 ? 'light' : ''} />
          ))}
        </div>
        <div className="snap-choice-row">
          <span />
          <button type="button">Get Lens+</button>
          <span />
        </div>
      </div>
    );
  }

  if (lens.overlay === 'time-mono') {
    return (
      <div className="snap-overlay mono-time">
        <strong>{formatTime(now)}</strong>
        <span>{formatDate(now)}</span>
      </div>
    );
  }

  if (lens.overlay === 'pink-cap') {
    return (
      <div className="snap-overlay cap-layer">
        <span className="cap-ear left" />
        <span className="cap-ear right" />
        <span className="cap-brim" />
        <strong>EVZ</strong>
      </div>
    );
  }

  if (lens.overlay === 'heart-cloud') {
    return (
      <div className="snap-overlay heart-cloud">
        <span>❤️</span>
        <span>💚</span>
        <span>💙</span>
      </div>
    );
  }

  if (lens.overlay === 'k2') {
    return (
      <div className="snap-overlay prism-layer">
        <strong>K2</strong>
      </div>
    );
  }

  if (lens.overlay === 'baby-pop') {
    return (
      <div className="snap-overlay baby-layer">
        <span />
      </div>
    );
  }

  if (lens.overlay === 'ai-clips') {
    return (
      <div className="snap-overlay ai-clips-layer">
        <strong>AI</strong>
        <span>CLIPS</span>
      </div>
    );
  }

  if (lens.overlay === 'vivid') {
    return <div className="snap-overlay vivid-layer" />;
  }

  return null;
}

export default function EVzoneSnapLensStudio() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [view, setView] = useState<SnapView>('camera');
  const [activeCategory, setActiveCategory] = useState<SnapCategory>('For you');
  const [activeLensId, setActiveLensId] = useState('phone-stack');
  const [cameraActive, setCameraActive] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [cameraMode, setCameraMode] = useState<CameraMode>('PHOTO');
  const [zoom, setZoom] = useState(1);
  const [activeAdjustId, setActiveAdjustId] = useState('brilliance');
  const [activeFilterId, setActiveFilterId] = useState('vivid');
  const [values, setValues] = useState<Record<string, number>>(
    () => Object.fromEntries(adjustTools.map((tool) => [tool.id, tool.value])),
  );
  const [liked, setLiked] = useState(true);
  const [now, setNow] = useState(() => new Date());

  const activeLens = useMemo(
    () => lenses.find((lens) => lens.id === activeLensId) ?? lenses[0],
    [activeLensId],
  );

  const visibleLenses = useMemo(() => {
    const categoryLenses = lenses.filter((lens) => lens.category === activeCategory);
    return categoryLenses.length ? categoryLenses : lenses;
  }, [activeCategory]);

  const activeTool = useMemo(
    () => adjustTools.find((tool) => tool.id === activeAdjustId) ?? adjustTools[0],
    [activeAdjustId],
  );

  const adjustFilter = useMemo(
    () => buildAdjustFilter(values, activeFilterId),
    [activeFilterId, values],
  );

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  useEffect(() => {
    if (!cameraActive || !videoRef.current || !streamRef.current) return;
    if (videoRef.current.srcObject !== streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      void videoRef.current.play();
    }
  }, [cameraActive, view]);

  async function startCamera(nextFacing = facingMode) {
    if (!navigator.mediaDevices?.getUserMedia) return;
    try {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: nextFacing, width: { ideal: 1080 }, height: { ideal: 1920 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setFacingMode(nextFacing);
      setCameraActive(true);
    } catch {
      setCameraActive(false);
    }
  }

  function stopCamera() {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraActive(false);
  }

  function flipCamera() {
    const next = facingMode === 'user' ? 'environment' : 'user';
    void startCamera(next);
  }

  function handleCameraToggle() {
    if (cameraActive) {
      stopCamera();
      return;
    }
    void startCamera();
  }

  function updateValue(value: number) {
    setValues((current) => ({ ...current, [activeAdjustId]: value }));
  }

  function renderCameraScreen() {
    return (
      <div className="snap-phone-screen snap-camera-screen">
        <div className="snap-camera-media" style={{ filter: `${activeLens.filter} ${adjustFilter}` }}>
          {cameraActive ? <video ref={videoRef} muted playsInline /> : <SimulatedScene />}
        </div>
        <div className="snap-camera-grain" />
        <LensOverlayLayer lens={activeLens} now={now} />

        <div className="snap-left-rail">
          <button type="button" className="snap-avatar-btn" aria-label="Profile">
            <span />
          </button>
          <LensThumbnail lens={activeLens} active={false} onClick={() => setView('stories')} />
          <ToolButton label={liked ? 'Unlike' : 'Like'} onClick={() => setLiked((value) => !value)} active={liked}>
            {liked ? <FavoriteRoundedIcon /> : <FavoriteBorderRoundedIcon />}
          </ToolButton>
          <ToolButton label="Share">
            <IosShareRoundedIcon />
          </ToolButton>
          <div className="snap-view-count">
            <VisibilityRoundedIcon />
            <span>{activeLens.count}</span>
          </div>
        </div>

        <div className="snap-camera-top">
          <ToolButton label="Search">
            <SearchRoundedIcon />
          </ToolButton>
          <button type="button" className="snap-sound-pill" onClick={() => setView('capture')}>
            <MusicNoteRoundedIcon />
            <span>{activeLens.creator}</span>
            <AddRoundedIcon />
          </button>
          <span className="snap-alert-badge">48</span>
        </div>

        <div className="snap-right-rail">
          <ToolButton label={cameraActive ? 'Close camera' : 'Open camera'} onClick={handleCameraToggle} active={cameraActive}>
            <PersonAddAltRoundedIcon />
          </ToolButton>
          <ToolButton label="Flip camera" onClick={flipCamera}>
            <SwapVertRoundedIcon />
          </ToolButton>
          <ToolButton label="Mute">
            <VolumeOffRoundedIcon />
          </ToolButton>
          <ToolButton label="Music">
            <MusicNoteRoundedIcon />
          </ToolButton>
          <ToolButton label="HD" active>
            <HdRoundedIcon />
          </ToolButton>
          <ToolButton label="Night mode">
            <DarkModeRoundedIcon />
          </ToolButton>
          <ToolButton label="More tools" onClick={() => setView('adjust')}>
            <KeyboardArrowDownRoundedIcon />
          </ToolButton>
        </div>

        <div className="snap-lens-tray">
          <div className="snap-lens-row">
            {visibleLenses.map((lens) => (
              <LensThumbnail
                key={lens.id}
                lens={lens}
                active={lens.id === activeLens.id}
                onClick={() => setActiveLensId(lens.id)}
              />
            ))}
          </div>
          <div className="snap-category-row">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={category === activeCategory ? 'active' : ''}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <button type="button" className="snap-memory-btn" aria-label="Memories" onClick={() => setView('capture')}>
          <SentimentSatisfiedAltRoundedIcon />
        </button>
        <button type="button" className="snap-smile-btn" aria-label="Explore lenses">
          <SentimentSatisfiedAltRoundedIcon />
        </button>
      </div>
    );
  }

  function renderStoriesScreen() {
    return (
      <div className="snap-phone-screen snap-stories-screen">
        <div className="snap-stories-top">
          <button type="button" className="snap-mini-avatar" aria-label="Profile" />
          <ToolButton label="Search"><SearchRoundedIcon /></ToolButton>
          <strong>Stories</strong>
          <ToolButton label="Add friend"><PersonAddAltRoundedIcon /></ToolButton>
          <ToolButton label="More"><MoreHorizRoundedIcon /></ToolButton>
        </div>

        <section className="snap-story-section">
          <h3>Friends</h3>
          <div className="snap-friend-row">
            {friends.map((friend) => (
              <button type="button" key={friend.id} className="snap-friend-story">
                <span style={{ background: friend.tone }}>{friend.badge ? <PersonAddAltRoundedIcon /> : null}</span>
                <strong>{friend.name}</strong>
                {friend.handle ? <small>{friend.handle}</small> : null}
              </button>
            ))}
          </div>
        </section>

        <section className="snap-story-section following">
          <h3>Following</h3>
          <div className="snap-following-grid">
            {discoverCards.slice(0, 2).map((card) => (
              <button type="button" key={card.id} style={{ background: card.tone }}>
                <strong>{card.title}</strong>
                <span>{card.meta}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="snap-story-section discover">
          <h3>Discover</h3>
          <div className="snap-discover-grid">
            {discoverCards.slice(2).map((card) => (
              <button type="button" key={card.id} style={{ background: card.tone }}>
                <strong>{card.title}</strong>
                <span>{card.meta}</span>
              </button>
            ))}
          </div>
        </section>

        <div className="snap-stories-nav">
          <LocationOnOutlinedIcon />
          <span><ChatBubbleOutlineRoundedIcon /><b>1</b></span>
          <CameraAltRoundedIcon />
          <GroupsRoundedIcon />
          <span><ChatBubbleOutlineRoundedIcon /><b>7</b></span>
        </div>
      </div>
    );
  }

  function renderAdjustScreen() {
    const activeValue = values[activeAdjustId] ?? activeTool.value;

    return (
      <div className="snap-phone-screen snap-adjust-screen">
        <div className="snap-adjust-preview" style={{ filter: adjustFilter }}>
          <div className="snap-classroom-scene">
            <div className="snap-desk" />
            <div className="snap-laptop" />
            <div className="snap-student main" />
            <div className="snap-student two" />
            <div className="snap-student three" />
            <div className="snap-paper one" />
            <div className="snap-paper two" />
          </div>
          <strong className="snap-adjust-badge">{activeTool.name}</strong>
        </div>

        <div className="snap-adjust-console">
          <div className="snap-adjust-icons">
            {adjustTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <button
                  key={tool.id}
                  type="button"
                  className={tool.id === activeAdjustId ? 'active' : ''}
                  aria-label={tool.name}
                  title={tool.name}
                  onClick={() => setActiveAdjustId(tool.id)}
                >
                  <Icon />
                </button>
              );
            })}
          </div>
          <label className="snap-adjust-slider">
            <input
              type="range"
              min={activeTool.min}
              max={activeTool.max}
              value={activeValue}
              onChange={(event) => updateValue(Number(event.target.value))}
            />
          </label>
          <div className="snap-edit-tabs">
            <button type="button" onClick={() => setValues(Object.fromEntries(adjustTools.map((tool) => [tool.id, tool.value])))}>Cancel</button>
            <FilterVintageRoundedIcon />
            <TuneRoundedIcon className="active" />
            <ColorLensRoundedIcon />
            <CropRoundedIcon />
            <button type="button" onClick={() => setView('camera')}>Done</button>
          </div>
        </div>
      </div>
    );
  }

  function renderCaptureScreen() {
    const activeFilter = filterLooks.find((filter) => filter.id === activeFilterId) ?? filterLooks[0];

    return (
      <div className="snap-phone-screen snap-capture-screen">
        <div className="snap-capture-media" style={{ filter: activeFilter.filter }}>
          <SimulatedScene className="desk" />
          <strong>{activeFilter.label.toUpperCase()}</strong>
        </div>

        <div className="snap-capture-top">
          <ToolButton label="Flash"><FlashOnRoundedIcon /></ToolButton>
          <ToolButton label="Timer"><TimerRoundedIcon /></ToolButton>
          <ToolButton label="Filters"><ColorLensRoundedIcon /></ToolButton>
        </div>

        <button type="button" className="snap-zoom" onClick={() => setZoom((value) => (value >= 2 ? 1 : value + .5))}>
          {zoom}×
        </button>

        <div className="snap-filter-strip">
          {filterLooks.map((filter) => (
            <button
              key={filter.id}
              type="button"
              className={filter.id === activeFilterId ? 'active' : ''}
              onClick={() => setActiveFilterId(filter.id)}
              aria-label={filter.label}
              title={filter.label}
            >
              <span style={{ background: filter.swatch }} />
            </button>
          ))}
        </div>

        <div className="snap-mode-row">
          {cameraModes.map((mode) => (
            <button
              key={mode}
              type="button"
              className={mode === cameraMode ? 'active' : ''}
              onClick={() => setCameraMode(mode)}
            >
              {mode}
            </button>
          ))}
        </div>

        <div className="snap-shutter-row">
          <button type="button" className="snap-mini-capture" aria-label="Last capture" />
          <button type="button" className={`snap-shutter ${cameraMode === 'VIDEO' || cameraMode === 'SLO-MO' ? 'record' : ''}`} aria-label="Capture" />
          <ToolButton label="Flip camera" onClick={flipCamera}><CameraswitchRoundedIcon /></ToolButton>
        </div>
      </div>
    );
  }

  return (
    <main className="snap-studio-page">
      <style>{styles}</style>

      <div className="snap-shell">
        <div className="snap-phone">
          {view === 'camera' ? renderCameraScreen() : null}
          {view === 'stories' ? renderStoriesScreen() : null}
          {view === 'adjust' ? renderAdjustScreen() : null}
          {view === 'capture' ? renderCaptureScreen() : null}
        </div>

        <aside className="snap-control-surface">
          <div className="snap-view-tabs" role="tablist" aria-label="Snap studio views">
            {snapViews.map((item) => (
              <button
                key={item.id}
                type="button"
                className={view === item.id ? 'active' : ''}
                onClick={() => setView(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>

          <section>
            <h2>Snap Lens Studio</h2>
            <div className="snap-lens-grid">
              {lenses.map((lens) => (
                <button
                  key={lens.id}
                  type="button"
                  className={lens.id === activeLens.id ? 'active' : ''}
                  onClick={() => {
                    setActiveLensId(lens.id);
                    setActiveCategory(lens.category);
                    setView('camera');
                  }}
                >
                  <span
                    className={`snap-lens-thumb ${lens.id === activeLens.id ? 'active' : ''}`}
                    style={{ '--lens-accent': lens.accent } as React.CSSProperties}
                  >
                    <span className={`snap-lens-art ${lens.overlay}`}>
                      {lens.overlay === 'phone-stack' ? <b>Phone Stack</b> : null}
                      {lens.overlay === 'k2' ? <b>K2</b> : null}
                      {lens.overlay === 'ai-clips' ? <b>AI</b> : null}
                    </span>
                  </span>
                  <span>
                    <strong>{lens.name}</strong>
                    <small>{lens.count}</small>
                  </span>
                </button>
              ))}
            </div>
          </section>

          <section>
            <h2>Adjust Tools</h2>
            <div className="snap-tool-grid">
              {adjustTools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <button
                    key={tool.id}
                    type="button"
                    className={tool.id === activeAdjustId ? 'active' : ''}
                    onClick={() => {
                      setActiveAdjustId(tool.id);
                      setView('adjust');
                    }}
                  >
                    <Icon />
                    <span>{tool.name}</span>
                  </button>
                );
              })}
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
}

const styles = `
.snap-studio-page,
.snap-studio-page * {
  box-sizing: border-box;
}

.snap-studio-page {
  min-height: 100vh;
  padding: 14px;
  color: #f8fafc;
  background:
    linear-gradient(135deg, rgba(3, 205, 140, .14), transparent 32%),
    linear-gradient(225deg, rgba(247, 127, 0, .12), transparent 36%),
    #101318;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

.snap-shell {
  width: min(100%, 1280px);
  min-height: calc(100vh - 28px);
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(330px, 448px) minmax(300px, 1fr);
  gap: 18px;
  align-items: start;
}

.snap-phone {
  position: sticky;
  top: 14px;
  width: min(100%, 448px);
  aspect-ratio: 9 / 16;
  min-height: 720px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, .14);
  border-radius: 28px;
  background: #050505;
  box-shadow: 0 30px 80px rgba(0, 0, 0, .38);
}

.snap-phone-screen {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.snap-camera-screen,
.snap-capture-screen {
  background: #050505;
}

.snap-camera-media,
.snap-capture-media {
  position: absolute;
  inset: 0;
  overflow: hidden;
  transform: translateZ(0);
}

.snap-camera-media video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scaleX(-1);
}

.snap-sim-scene {
  position: absolute;
  inset: 0;
  overflow: hidden;
  background:
    linear-gradient(100deg, transparent 0 10%, rgba(255,255,255,.18) 10% 12%, transparent 12% 18%),
    linear-gradient(180deg, #ddd4bd 0%, #d4c5a3 55%, #4b342e 100%);
}

.snap-sim-scene::after {
  content: "";
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 48% 43%, rgba(255,255,255,.18), transparent 9%),
    linear-gradient(180deg, rgba(0,0,0,.04), rgba(0,0,0,.34));
}

.snap-sim-scene.desk {
  background:
    linear-gradient(90deg, rgba(0,0,0,.45) 0 11%, transparent 11%),
    linear-gradient(180deg, #d8d2bf 0%, #d9cfba 48%, #8b5d2d 49%, #6b421d 100%);
}

.snap-wall-line {
  position: absolute;
  top: 8%;
  width: 18%;
  height: 18%;
  border: 2px solid rgba(17,24,39,.18);
  background: rgba(255,255,255,.22);
}

.snap-wall-line.one { left: 16%; transform: rotate(-2deg); }
.snap-wall-line.two { right: 12%; width: 14%; height: 15%; transform: rotate(2deg); }

.snap-head {
  position: absolute;
  left: 50%;
  top: 29%;
  width: 42%;
  aspect-ratio: 1 / 1.18;
  transform: translateX(-50%);
  border-radius: 43% 43% 48% 48%;
  background: linear-gradient(180deg, #2c1711, #120b09);
  box-shadow: inset 0 24px 34px rgba(255,255,255,.12), 0 12px 34px rgba(0,0,0,.28);
}

.snap-hair {
  position: absolute;
  left: 12%;
  right: 12%;
  top: -9%;
  height: 20%;
  border-radius: 50% 50% 18% 18%;
  background: #111;
}

.snap-glasses {
  position: absolute;
  top: 40%;
  width: 34%;
  height: 17%;
  border: 4px solid rgba(0,0,0,.76);
  border-radius: 10px;
  background: rgba(10,10,10,.28);
}

.snap-glasses.left { left: 13%; }
.snap-glasses.right { right: 13%; }
.snap-bridge {
  position: absolute;
  left: 47%;
  top: 48%;
  width: 6%;
  height: 2%;
  background: rgba(0,0,0,.82);
}

.snap-nose {
  position: absolute;
  left: 47%;
  top: 52%;
  width: 6%;
  height: 15%;
  border-radius: 99px;
  background: rgba(255,255,255,.12);
}

.snap-mouth {
  position: absolute;
  left: 38%;
  bottom: 18%;
  width: 24%;
  height: 4%;
  border-radius: 99px;
  background: rgba(0,0,0,.72);
}

.snap-shoulders {
  position: absolute;
  left: 21%;
  right: 21%;
  bottom: 2%;
  height: 34%;
  border-radius: 120px 120px 0 0;
  background: linear-gradient(180deg, #1f1515, #090909);
}

.snap-shirt {
  position: absolute;
  bottom: -10%;
  width: 30%;
  height: 40%;
  background: linear-gradient(180deg, #ef4444, #5b1111);
}

.snap-shirt.left { left: 4%; transform: rotate(-11deg); }
.snap-shirt.right { right: 4%; transform: rotate(11deg); }

.snap-camera-grain {
  position: absolute;
  inset: 0;
  opacity: .27;
  mix-blend-mode: overlay;
  pointer-events: none;
  background-image:
    linear-gradient(90deg, rgba(255,0,0,.08), rgba(0,255,255,.06)),
    repeating-radial-gradient(circle at 20% 30%, rgba(255,255,255,.16) 0 1px, transparent 1px 4px);
}

.snap-icon-btn {
  width: 39px;
  height: 39px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: #fff;
  background: rgba(0,0,0,.22);
  text-shadow: 0 2px 10px rgba(0,0,0,.52);
  backdrop-filter: blur(10px);
}

.snap-icon-btn svg {
  width: 28px;
  height: 28px;
}

.snap-icon-btn.active {
  color: #ff477e;
  background: rgba(255,255,255,.18);
}

.snap-left-rail,
.snap-right-rail {
  position: absolute;
  z-index: 8;
  display: grid;
  gap: 10px;
}

.snap-left-rail {
  top: 10px;
  left: 13px;
}

.snap-right-rail {
  top: 16px;
  right: 12px;
}

.snap-right-rail .snap-icon-btn:nth-child(n+5) {
  width: 34px;
  height: 34px;
}

.snap-avatar-btn,
.snap-mini-avatar {
  width: 44px;
  height: 44px;
  border: 0;
  border-radius: 50%;
  background: linear-gradient(180deg,#d1d5db,#64748b);
  position: relative;
}

.snap-avatar-btn::after {
  content: "";
  position: absolute;
  top: -1px;
  right: 1px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #ff3366;
}

.snap-avatar-btn span,
.snap-mini-avatar::before {
  content: "";
  position: absolute;
  inset: 8px 12px 12px;
  border-radius: 50% 50% 45% 45%;
  background: #f2d3c2;
  box-shadow: 0 -7px 0 #263241, 0 13px 0 -4px #263241;
}

.snap-view-count {
  display: grid;
  justify-items: center;
  gap: 0;
  color: #fff;
  font-weight: 900;
  font-size: 12px;
  text-shadow: 0 2px 10px rgba(0,0,0,.7);
}

.snap-view-count svg {
  width: 29px;
  height: 29px;
}

.snap-camera-top {
  position: absolute;
  z-index: 10;
  top: 16px;
  left: 76px;
  right: 66px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.snap-sound-pill {
  min-width: 0;
  flex: 1;
  min-height: 42px;
  padding: 0 9px;
  border: 0;
  border-radius: 999px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #fff;
  background: rgba(0,0,0,.36);
  backdrop-filter: blur(16px);
  font-weight: 850;
}

.snap-sound-pill span {
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.snap-alert-badge {
  position: absolute;
  top: -9px;
  right: -14px;
  min-width: 27px;
  height: 22px;
  padding: 0 7px;
  border-radius: 99px;
  display: inline-grid;
  place-items: center;
  color: white;
  background: #ff477e;
  font-weight: 1000;
  font-size: 13px;
}

.snap-lens-tray {
  position: absolute;
  z-index: 12;
  left: 0;
  right: 0;
  bottom: 20px;
}

.snap-lens-row {
  display: flex;
  align-items: center;
  gap: 10px;
  overflow-x: auto;
  scrollbar-width: none;
  padding: 0 58px 8px;
  scroll-snap-type: x proximity;
}

.snap-lens-row::-webkit-scrollbar {
  display: none;
}

.snap-lens-thumb {
  --lens-accent: #fff;
  width: 62px;
  height: 62px;
  flex: 0 0 62px;
  padding: 3px;
  border: 0;
  border-radius: 50%;
  display: block;
  background: rgba(255,255,255,.92);
  box-shadow: 0 4px 14px rgba(0,0,0,.28);
}

.snap-lens-thumb.active {
  width: 92px;
  height: 92px;
  flex-basis: 92px;
  padding: 7px;
  box-shadow: 0 0 0 6px rgba(255,255,255,.95), 0 8px 22px rgba(0,0,0,.42);
}

.snap-left-rail .snap-lens-thumb {
  width: 48px;
  height: 48px;
  flex-basis: 48px;
}

.snap-lens-art {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: grid;
  place-items: center;
  overflow: hidden;
  color: white;
  background: radial-gradient(circle at 35% 25%, #fff, var(--lens-accent) 24%, #111827 78%);
  font-size: 9px;
  line-height: .95;
  font-weight: 1000;
  text-align: center;
}

.snap-lens-art.clean { background: linear-gradient(135deg,#38bdf8,#fef3c7,#22c55e); }
.snap-lens-art.time-mono { filter: grayscale(1); background: linear-gradient(135deg,#f8fafc,#111827); }
.snap-lens-art.pink-cap { background: linear-gradient(135deg,#fb7185,#fce7f3); }
.snap-lens-art.heart-cloud { background: #fff; color: #111827; }
.snap-lens-art.heart-cloud::before { content: "❤️💚💙"; font-size: 17px; }
.snap-lens-art.baby-pop { background: radial-gradient(circle at 45% 32%, #fee2e2 0 24%, #93c5fd 25% 100%); }
.snap-lens-art.vivid { background: conic-gradient(#ef4444,#facc15,#22c55e,#38bdf8,#a855f7,#ef4444); }

.snap-category-row {
  display: flex;
  justify-content: center;
  gap: 13px;
}

.snap-category-row button {
  min-height: 34px;
  padding: 0 10px;
  border: 0;
  border-radius: 999px;
  color: rgba(255,255,255,.78);
  background: transparent;
  font-size: 15px;
  font-weight: 850;
  text-shadow: 0 2px 8px rgba(0,0,0,.6);
}

.snap-category-row button.active {
  color: #fff;
  background: rgba(0,0,0,.34);
}

.snap-memory-btn,
.snap-smile-btn {
  position: absolute;
  z-index: 13;
  bottom: 28px;
  width: 42px;
  height: 42px;
  border: 0;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: #fff;
  background: rgba(0,0,0,.1);
}

.snap-memory-btn { left: 18px; }
.snap-smile-btn { right: 18px; }

.snap-overlay {
  position: absolute;
  z-index: 5;
  pointer-events: none;
}

.snap-overlay.phone-stack {
  inset: 92px 22px auto;
  min-height: 350px;
  display: grid;
  justify-items: center;
  gap: 42px;
}

.snap-challenge-copy {
  display: grid;
  justify-items: center;
  gap: 4px;
  color: white;
  font-size: 25px;
  font-weight: 1000;
  text-shadow:
    -2px -2px 0 #1f2937,
    2px -2px 0 #1f2937,
    -2px 2px 0 #1f2937,
    2px 2px 0 #1f2937;
}

.snap-challenge-copy span {
  font-size: 23px;
}

.snap-phone-row {
  display: flex;
  align-items: end;
  justify-content: center;
  filter: drop-shadow(0 16px 18px rgba(0,0,0,.28));
}

.snap-phone-row span {
  width: 46px;
  height: 116px;
  margin-left: -11px;
  border-radius: 12px;
  border: 2px solid rgba(255,255,255,.34);
  background: linear-gradient(180deg,#fb923c,#ea580c);
  position: relative;
}

.snap-phone-row span.dark { background: linear-gradient(180deg,#374151,#111827); }
.snap-phone-row span.light { background: linear-gradient(180deg,#f8fafc,#e5e7eb); }

.snap-phone-row span::before {
  content: "";
  position: absolute;
  left: 8px;
  top: 7px;
  width: 23px;
  height: 23px;
  border-radius: 50%;
  background:
    radial-gradient(circle at 30% 30%, #111 0 23%, transparent 24%),
    radial-gradient(circle at 70% 30%, #111 0 23%, transparent 24%),
    radial-gradient(circle at 35% 72%, #111 0 20%, transparent 21%);
}

.snap-choice-row {
  display: flex;
  align-items: center;
  gap: 46px;
}

.snap-choice-row span {
  width: 48px;
  height: 84px;
  border-radius: 10px;
  background: linear-gradient(180deg,#fb923c,#ea580c);
  box-shadow: 0 10px 22px rgba(0,0,0,.28);
}

.snap-choice-row span:last-child {
  background: linear-gradient(180deg,#f8fafc,#e5e7eb);
}

.snap-choice-row button {
  border: 0;
  border-radius: 999px;
  padding: 7px 14px;
  color: white;
  background: #0b0b0b;
  box-shadow: 0 0 0 2px rgba(56,189,248,.8), 0 0 0 4px rgba(236,72,153,.42);
  font-weight: 1000;
}

.snap-overlay.mono-time {
  top: 86px;
  left: 50%;
  transform: translateX(-50%);
  display: grid;
  justify-items: center;
  color: white;
  text-shadow: 0 2px 12px rgba(0,0,0,.48);
}

.snap-overlay.mono-time strong {
  font-size: 52px;
  line-height: .9;
  font-weight: 1000;
}

.snap-overlay.mono-time span {
  font-size: 16px;
  font-weight: 950;
  font-style: italic;
}

.cap-layer {
  left: 50%;
  top: 225px;
  width: 235px;
  height: 112px;
  transform: translateX(-50%) rotate(-1deg);
}

.cap-brim,
.cap-ear {
  position: absolute;
  background: linear-gradient(180deg,#fb7185,#d94672);
  box-shadow: inset 0 8px 20px rgba(255,255,255,.28), 0 8px 18px rgba(0,0,0,.22);
}

.cap-brim {
  left: 19px;
  right: 19px;
  top: 22px;
  height: 72px;
  border-radius: 100px 100px 44px 44px;
}

.cap-ear {
  top: 0;
  width: 70px;
  height: 82px;
  clip-path: polygon(50% 0,100% 100%,0 100%);
}

.cap-ear.left { left: 0; transform: rotate(-22deg); }
.cap-ear.right { right: 0; transform: rotate(22deg); }

.cap-layer strong {
  position: absolute;
  left: 50%;
  top: 34px;
  transform: translateX(-50%);
  color: rgba(127,29,29,.54);
  font-size: 18px;
  letter-spacing: .18em;
}

.heart-cloud {
  left: 50%;
  bottom: 125px;
  transform: translateX(-50%);
  display: flex;
  gap: 2px;
  padding: 14px 16px;
  border-radius: 50%;
  background: rgba(255,255,255,.88);
  font-size: 20px;
}

.prism-layer {
  right: 40px;
  bottom: 123px;
  width: 68px;
  height: 68px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: white;
  background: conic-gradient(from 20deg,#38bdf8,#f0abfc,#fef3c7,#94a3b8,#38bdf8);
  box-shadow: inset 0 0 22px rgba(255,255,255,.6), 0 12px 20px rgba(0,0,0,.24);
  font-size: 22px;
  font-weight: 1000;
}

.baby-layer {
  right: 92px;
  bottom: 128px;
  width: 65px;
  height: 65px;
  border-radius: 50%;
  background: radial-gradient(circle at 50% 38%, #fee2e2 0 31%, #bfdbfe 32% 100%);
  box-shadow: inset 0 0 0 3px rgba(255,255,255,.7), 0 10px 20px rgba(0,0,0,.22);
}

.baby-layer span {
  position: absolute;
  left: 17px;
  top: 31px;
  width: 31px;
  height: 7px;
  border-radius: 99px;
  background: #9f1239;
}

.ai-clips-layer {
  left: 90px;
  bottom: 128px;
  width: 66px;
  height: 66px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: white;
  background: linear-gradient(135deg,#ec4899,#f97316);
  box-shadow: inset 0 0 0 3px rgba(255,255,255,.7), 0 10px 20px rgba(0,0,0,.22);
}

.ai-clips-layer span {
  margin-top: -20px;
  font-size: 9px;
  font-weight: 1000;
}

.vivid-layer {
  inset: 0;
  background:
    linear-gradient(90deg, rgba(255,0,102,.12), transparent 30%, rgba(0,229,255,.12)),
    linear-gradient(180deg, transparent 0 60%, rgba(250,204,21,.14));
  mix-blend-mode: screen;
}

.snap-stories-screen {
  padding: 13px 12px 74px;
  color: #111827;
  background: #fff;
  overflow-y: auto;
}

.snap-stories-top {
  height: 48px;
  display: grid;
  grid-template-columns: 42px 42px 1fr 42px 42px;
  align-items: center;
  gap: 6px;
}

.snap-stories-top .snap-icon-btn {
  color: #374151;
  background: #eef0f4;
}

.snap-stories-top strong {
  text-align: center;
  font-size: 20px;
  font-weight: 1000;
}

.snap-story-section h3 {
  margin: 10px 0 7px;
  font-size: 18px;
  line-height: 1;
  font-weight: 1000;
}

.snap-story-section h3::after {
  content: "›";
  color: #cbd5e1;
  margin-left: 4px;
}

.snap-friend-row {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  scrollbar-width: none;
}

.snap-friend-row::-webkit-scrollbar {
  display: none;
}

.snap-friend-story {
  width: 78px;
  flex: 0 0 78px;
  padding: 0;
  border: 0;
  background: transparent;
  color: #111827;
  text-align: center;
}

.snap-friend-story > span {
  width: 72px;
  height: 72px;
  margin: 0 auto 6px;
  border-radius: 50%;
  display: grid;
  place-items: end center;
  border: 4px solid #d946ef;
  box-shadow: inset 0 0 0 3px white;
  overflow: hidden;
}

.snap-friend-story svg {
  width: 36px;
  height: 24px;
  padding: 3px 9px;
  border-radius: 99px;
  color: white;
  background: #c026d3;
}

.snap-friend-story strong {
  display: block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 13px;
}

.snap-friend-story small {
  display: block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: #9ca3af;
  font-size: 12px;
}

.snap-following-grid,
.snap-discover-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.snap-following-grid button,
.snap-discover-grid button {
  min-height: 180px;
  padding: 10px;
  border: 0;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: end;
  color: white;
  text-align: left;
  box-shadow: inset 0 -70px 44px rgba(0,0,0,.34);
}

.snap-discover-grid button {
  min-height: 248px;
}

.snap-following-grid strong,
.snap-discover-grid strong {
  font-size: 15px;
  font-weight: 1000;
}

.snap-following-grid span,
.snap-discover-grid span {
  font-size: 12px;
  font-weight: 900;
}

.snap-stories-nav {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 65px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  color: #20242c;
  background: #fff;
  border-top: 1px solid #eef2f7;
}

.snap-stories-nav svg {
  width: 27px;
  height: 27px;
}

.snap-stories-nav span {
  position: relative;
  display: grid;
}

.snap-stories-nav b {
  position: absolute;
  top: -9px;
  right: -10px;
  min-width: 19px;
  height: 19px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: white;
  background: #ff3366;
  font-size: 11px;
}

.snap-adjust-screen {
  display: grid;
  grid-template-rows: minmax(0, 1fr) 256px;
  background: #050505;
}

.snap-adjust-preview {
  position: relative;
  min-height: 0;
  overflow: hidden;
  background: #ddd;
}

.snap-classroom-scene {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg,#ddd8c6 0 50%,#9b6b36 51% 100%);
}

.snap-desk {
  position: absolute;
  left: -8%;
  right: -8%;
  bottom: 0;
  height: 38%;
  transform: rotate(-4deg);
  background: linear-gradient(180deg,#b7793f,#7c4a21);
}

.snap-laptop {
  position: absolute;
  left: 32%;
  bottom: 19%;
  width: 36%;
  height: 30%;
  border-radius: 8px;
  transform: rotate(-4deg);
  background: linear-gradient(160deg,#f4f4f5,#c7c9ce);
  box-shadow: 0 12px 28px rgba(0,0,0,.26);
}

.snap-laptop::after {
  content: "hp";
  position: absolute;
  left: 50%;
  top: 45%;
  transform: translate(-50%,-50%);
  color: rgba(168,85,247,.28);
  font-weight: 1000;
}

.snap-student {
  position: absolute;
  border-radius: 50% 50% 42% 42%;
  background: linear-gradient(180deg,#42251a,#15100d);
}

.snap-student.main {
  left: 12%;
  top: 27%;
  width: 22%;
  height: 21%;
}

.snap-student.main::after {
  content: "";
  position: absolute;
  left: -16%;
  right: -16%;
  top: 83%;
  height: 74%;
  border-radius: 28px 28px 0 0;
  background: #4b4337;
}

.snap-student.two {
  left: 53%;
  top: 30%;
  width: 15%;
  height: 15%;
}

.snap-student.two::after {
  content: "";
  position: absolute;
  left: -40%;
  right: -40%;
  top: 86%;
  height: 84%;
  background: #73513f;
}

.snap-student.three {
  right: 8%;
  top: 28%;
  width: 15%;
  height: 15%;
  background: linear-gradient(180deg,#2d1710,#0d0907);
}

.snap-student.three::after {
  content: "";
  position: absolute;
  left: -45%;
  right: -45%;
  top: 86%;
  height: 84%;
  background: #f97316;
}

.snap-paper {
  position: absolute;
  bottom: 7%;
  width: 25%;
  height: 16%;
  border-radius: 4px;
  background: rgba(255,255,255,.86);
  transform: rotate(-8deg);
}

.snap-paper.one { left: 17%; }
.snap-paper.two { left: 58%; bottom: 17%; width: 18%; height: 10%; }

.snap-adjust-badge {
  position: absolute;
  left: 50%;
  bottom: 13px;
  transform: translateX(-50%);
  padding: 7px 13px;
  border-radius: 5px;
  color: white;
  background: #050505;
  font-size: 13px;
  letter-spacing: .08em;
  font-weight: 1000;
}

.snap-adjust-console {
  padding: 22px 15px 14px;
  background: #020202;
}

.snap-adjust-icons {
  display: flex;
  gap: 15px;
  overflow-x: auto;
  scrollbar-width: none;
  padding-bottom: 20px;
}

.snap-adjust-icons::-webkit-scrollbar {
  display: none;
}

.snap-adjust-icons button {
  width: 54px;
  height: 54px;
  flex: 0 0 54px;
  border-radius: 50%;
  border: 2px solid #30333a;
  display: grid;
  place-items: center;
  color: white;
  background: #080808;
}

.snap-adjust-icons button.active {
  background: #2b2d31;
  border-color: #5c6068;
}

.snap-adjust-slider {
  display: block;
  padding: 0 0 17px;
}

.snap-adjust-slider input {
  width: 100%;
  accent-color: #fff;
}

.snap-edit-tabs {
  display: grid;
  grid-template-columns: 1fr repeat(4, 44px) 1fr;
  align-items: center;
  gap: 12px;
  color: white;
}

.snap-edit-tabs button {
  min-height: 36px;
  border: 0;
  color: white;
  background: transparent;
  font-size: 17px;
  font-weight: 850;
}

.snap-edit-tabs button:last-child {
  color: rgba(255,255,255,.32);
}

.snap-edit-tabs svg {
  justify-self: center;
  width: 28px;
  height: 28px;
}

.snap-edit-tabs svg.active {
  color: #ffcc33;
}

.snap-capture-media {
  inset: 0 0 41%;
  background: #111;
}

.snap-capture-media strong {
  position: absolute;
  left: 50%;
  bottom: 16px;
  z-index: 2;
  transform: translateX(-50%);
  padding: 6px 12px;
  border-radius: 5px;
  color: #111;
  background: white;
  font-size: 12px;
  letter-spacing: .08em;
  font-weight: 1000;
}

.snap-capture-top {
  position: absolute;
  z-index: 3;
  top: 34px;
  left: 20px;
  right: 20px;
  display: flex;
  justify-content: space-between;
}

.snap-zoom {
  position: absolute;
  z-index: 3;
  left: 50%;
  top: 42%;
  transform: translate(-50%,-50%);
  width: 70px;
  height: 70px;
  border-radius: 50%;
  border: 2px solid white;
  color: white;
  background: rgba(0,0,0,.12);
  font-size: 24px;
  font-weight: 1000;
}

.snap-filter-strip {
  position: absolute;
  left: 92px;
  right: 92px;
  bottom: 214px;
  display: flex;
  justify-content: center;
  gap: 7px;
}

.snap-filter-strip button {
  width: 42px;
  height: 42px;
  padding: 2px;
  border: 0;
  border-radius: 7px;
  background: rgba(255,255,255,.14);
}

.snap-filter-strip button.active {
  box-shadow: 0 0 0 3px white;
}

.snap-filter-strip span {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 5px;
}

.snap-mode-row {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 154px;
  display: flex;
  gap: 24px;
  overflow-x: auto;
  padding: 0 78px;
  scrollbar-width: none;
}

.snap-mode-row::-webkit-scrollbar {
  display: none;
}

.snap-mode-row button {
  flex: 0 0 auto;
  border: 0;
  color: white;
  background: transparent;
  letter-spacing: .08em;
  font-size: 20px;
  font-weight: 1000;
}

.snap-mode-row button.active {
  color: #facc15;
}

.snap-shutter-row {
  position: absolute;
  left: 50px;
  right: 50px;
  bottom: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.snap-mini-capture {
  width: 46px;
  height: 46px;
  border: 0;
  border-radius: 8px;
  background: linear-gradient(135deg,#111827,#64748b);
}

.snap-shutter {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  border: 7px solid white;
  background: white;
  box-shadow: inset 0 0 0 4px #050505;
}

.snap-shutter.record {
  background: #ff2b35;
}

.snap-control-surface {
  min-width: 0;
  display: grid;
  gap: 14px;
}

.snap-view-tabs {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  padding: 8px;
  background: rgba(255,255,255,.06);
  border: 1px solid rgba(255,255,255,.12);
  border-radius: 8px;
}

.snap-view-tabs button {
  min-height: 38px;
  padding: 0 13px;
  border: 1px solid transparent;
  border-radius: 6px;
  color: rgba(255,255,255,.72);
  background: transparent;
  font-weight: 900;
}

.snap-view-tabs button.active {
  color: #111827;
  background: #f8fafc;
}

.snap-control-surface section {
  padding: 14px;
  border: 1px solid rgba(255,255,255,.12);
  border-radius: 8px;
  background: rgba(255,255,255,.06);
}

.snap-control-surface h2 {
  margin: 0 0 12px;
  color: white;
  font-size: 18px;
  font-weight: 1000;
}

.snap-lens-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(178px, 1fr));
  gap: 8px;
}

.snap-lens-grid > button {
  min-width: 0;
  min-height: 76px;
  padding: 8px;
  border: 1px solid rgba(255,255,255,.1);
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: white;
  background: rgba(255,255,255,.05);
  text-align: left;
}

.snap-lens-grid > button.active,
.snap-tool-grid button.active {
  border-color: rgba(3,205,140,.72);
  background: rgba(3,205,140,.14);
}

.snap-lens-grid .snap-lens-thumb,
.snap-lens-grid .snap-lens-thumb.active {
  pointer-events: none;
  width: 54px;
  height: 54px;
  flex: 0 0 54px;
  padding: 3px;
  box-shadow: 0 4px 14px rgba(0,0,0,.18);
}

.snap-lens-grid span {
  min-width: 0;
}

.snap-lens-grid strong,
.snap-lens-grid small {
  display: block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.snap-lens-grid small {
  margin-top: 4px;
  color: rgba(255,255,255,.62);
  font-weight: 850;
}

.snap-tool-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(128px, 1fr));
  gap: 8px;
}

.snap-tool-grid button {
  min-height: 72px;
  padding: 9px;
  border: 1px solid rgba(255,255,255,.1);
  border-radius: 8px;
  display: grid;
  grid-template-columns: 28px 1fr;
  align-items: center;
  gap: 9px;
  color: white;
  background: rgba(255,255,255,.05);
  text-align: left;
  font-size: 12px;
  font-weight: 950;
}

.snap-tool-grid svg {
  width: 26px;
  height: 26px;
}

html:not([data-evz-theme='dark']) .snap-studio-page {
  background:
    radial-gradient(circle at 6% 7%, rgba(3,205,140,.20), transparent 36%),
    radial-gradient(circle at 96% 5%, rgba(247,127,0,.16), transparent 36%),
    linear-gradient(180deg, #f6fafc, #e9f0f7);
}

html:not([data-evz-theme='dark']) .snap-shell {
  border-color: rgba(15,23,42,.14);
  background: rgba(255,255,255,.88);
  box-shadow: 0 26px 80px rgba(15,23,42,.14);
}

html:not([data-evz-theme='dark']) .snap-phone {
  border-color: rgba(15,23,42,.2);
  box-shadow: 0 18px 40px rgba(15,23,42,.18);
}

html:not([data-evz-theme='dark']) .snap-control-surface {
  border-color: rgba(15,23,42,.14);
  background: linear-gradient(180deg, #f8fbff, #ecf3fb);
}

html:not([data-evz-theme='dark']) .snap-view-tabs button {
  color: #475569;
  background: rgba(255,255,255,.9);
  border-color: rgba(15,23,42,.12);
}

html:not([data-evz-theme='dark']) .snap-view-tabs button.active {
  color: #0f172a;
  background: rgba(3,205,140,.16);
  border-color: rgba(3,205,140,.34);
}

html:not([data-evz-theme='dark']) .snap-control-surface section {
  border-color: rgba(15,23,42,.14);
  background: rgba(255,255,255,.9);
}

html:not([data-evz-theme='dark']) .snap-control-surface h2,
html:not([data-evz-theme='dark']) .snap-lens-grid strong,
html:not([data-evz-theme='dark']) .snap-tool-grid button {
  color: #0f172a;
}

html:not([data-evz-theme='dark']) .snap-lens-grid small {
  color: #475569;
}

html:not([data-evz-theme='dark']) .snap-lens-grid > button,
html:not([data-evz-theme='dark']) .snap-tool-grid button {
  border-color: rgba(15,23,42,.14);
  background: rgba(255,255,255,.94);
}

html:not([data-evz-theme='dark']) .snap-lens-grid > button.active,
html:not([data-evz-theme='dark']) .snap-tool-grid button.active {
  border-color: rgba(3,205,140,.4);
  background: rgba(3,205,140,.14);
}

body:not([data-evz-theme='dark']) .snap-studio-page,
[data-evz-theme='light'] .snap-studio-page {
  background:
    radial-gradient(circle at 6% 7%, rgba(3,205,140,.20), transparent 36%),
    radial-gradient(circle at 96% 5%, rgba(247,127,0,.16), transparent 36%),
    linear-gradient(180deg, #f6fafc, #e9f0f7);
}

body:not([data-evz-theme='dark']) .snap-control-surface,
[data-evz-theme='light'] .snap-control-surface {
  color: #0f172a;
  border-color: rgba(15,23,42,.14);
  background: linear-gradient(180deg, #f8fbff, #ecf3fb);
}

body:not([data-evz-theme='dark']) .snap-control-surface section,
[data-evz-theme='light'] .snap-control-surface section {
  border-color: rgba(15,23,42,.14);
  background: rgba(255,255,255,.94);
}

body:not([data-evz-theme='dark']) .snap-control-surface section *,
[data-evz-theme='light'] .snap-control-surface section * {
  opacity: 1 !important;
}

body:not([data-evz-theme='dark']) .snap-control-surface h2,
body:not([data-evz-theme='dark']) .snap-lens-grid strong,
body:not([data-evz-theme='dark']) .snap-lens-grid small,
body:not([data-evz-theme='dark']) .snap-tool-grid button,
[data-evz-theme='light'] .snap-control-surface h2,
[data-evz-theme='light'] .snap-lens-grid strong,
[data-evz-theme='light'] .snap-lens-grid small,
[data-evz-theme='light'] .snap-tool-grid button {
  color: #0f172a;
}

@media (max-width: 980px) {
  .snap-shell {
    grid-template-columns: 1fr;
    justify-items: center;
  }

  .snap-phone {
    position: relative;
    top: auto;
  }

  .snap-control-surface {
    width: min(100%, 448px);
  }
}

@media (max-width: 560px) {
  .snap-studio-page {
    padding: 0;
  }

  .snap-shell {
    min-height: auto;
    gap: 0;
  }

  .snap-phone {
    width: 100%;
    min-height: calc(100svh - 137px);
    border-radius: 0;
    border-left: 0;
    border-right: 0;
  }

  .snap-control-surface {
    padding: 10px;
  }

  .snap-camera-top {
    left: 66px;
    right: 58px;
  }

  .snap-lens-row {
    padding-inline: 48px;
  }
}
`;
