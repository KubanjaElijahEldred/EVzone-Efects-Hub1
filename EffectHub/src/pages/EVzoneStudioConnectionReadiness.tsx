"use client";

import React, { useMemo, useState } from "react";

/**
 * EVzone Studio Connection & Readiness
 * Premium light-mode diagnostics page for a free, studio-connected AR/effect creator.
 * Palette from EV Zone Africa Colours:
 * Green: #03cd8c, Orange: #f77f00, Medium Grey: #a6a6a6, Light Grey: #f2f2f2
 */

type ConnectionMode = "connected" | "disconnected";
type CheckState = "ready" | "warning" | "failed" | "idle";
type IconName =
  | "plug"
  | "studio"
  | "camera"
  | "mic"
  | "gpu"
  | "browser"
  | "storage"
  | "phone"
  | "refresh"
  | "shield"
  | "warning"
  | "check"
  | "rocket"
  | "server"
  | "link"
  | "gauge"
  | "terminal"
  | "box"
  | "activity"
  | "clock"
  | "scene"
  | "spark"
  | "monitor"
  | "wifi"
  | "settings";

type ReadinessCheck = {
  title: string;
  subtitle: string;
  detail: string;
  icon: IconName;
  state: CheckState;
  metric: string;
  action?: string;
};

type RuntimeLimit = {
  label: string;
  value: string;
  used: number;
  hint: string;
};

type DiagnosticEvent = {
  time: string;
  label: string;
  detail: string;
  state: CheckState;
};

const css = `
:root {
  --evz-green: #03cd8c;
  --evz-orange: #f77f00;
  --evz-grey: #a6a6a6;
  --evz-light: var(--app-evz-light);
  --evz-ink: var(--app-evz-ink);
  --evz-ink-2: var(--app-evz-ink-2);
  --evz-muted: var(--app-evz-muted);
  --evz-muted-2: var(--app-evz-muted-2);
  --evz-card: var(--app-evz-card);
  --evz-card-solid: var(--app-evz-card-solid);
  --evz-border: var(--app-evz-border);
  --evz-border-strong: var(--app-evz-border-strong);
  --evz-danger: #ef4444;
  --evz-warning: #f59e0b;
  --evz-radius-xl: 36px;
  --evz-radius-lg: 28px;
  --evz-radius-md: 20px;
  --evz-shadow: var(--app-evz-shadow);
  --evz-shadow-soft: var(--app-evz-shadow-soft);
  --evz-shadow-glow: 0 22px 70px rgba(3,205,140,.20);
}

* { box-sizing: border-box; }

.evz-readiness-page {
  min-height: 100vh;
  color: var(--evz-ink);
  background:
    radial-gradient(circle at 8% 6%, rgba(3,205,140,.20), transparent 30%),
    radial-gradient(circle at 92% 0%, rgba(247,127,0,.16), transparent 29%),
    radial-gradient(circle at 52% 86%, rgba(3,205,140,.10), transparent 36%),
    var(--evz-app-bg);
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  position: relative;
  overflow-x: hidden;
  padding: 28px;
}

.evz-readiness-page::before {
  content: "";
  position: fixed;
  inset: 0;
  pointer-events: none;
  background-image:
    linear-gradient(rgba(16,19,20,.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(16,19,20,.035) 1px, transparent 1px);
  background-size: 44px 44px;
  mask-image: radial-gradient(circle at center, rgba(0,0,0,.72), transparent 78%);
}

.evz-readiness-shell {
  width: 100%;
  max-width: 100%;
  margin: 0;
  position: relative;
  z-index: 1;
}

.evz-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 16px 18px;
  background: var(--evz-card);
  border: 1px solid var(--evz-border);
  border-radius: 30px;
  box-shadow: var(--evz-shadow-soft);
  backdrop-filter: blur(24px);
  position: sticky;
  top: 18px;
  z-index: 30;
}

.evz-brand {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
}

.evz-mark {
  width: 48px;
  height: 48px;
  border-radius: 18px;
  background: var(--evz-card);
  display: grid;
  place-items: center;
  box-shadow: 0 18px 34px rgba(3,205,140,.30);
  color: #ffffff;
  position: relative;
  overflow: hidden;
}

.evz-mark::after {
  content: "";
  position: absolute;
  width: 18px;
  height: 18px;
  right: -5px;
  bottom: -3px;
  background: var(--evz-orange);
  border: 4px solid var(--evz-border);
  border-radius: 50%;
}

.evz-brand-text {
  min-width: 0;
}

.evz-eyebrow {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--evz-muted);
  font-size: 12px;
  font-weight: 850;
  text-transform: uppercase;
  letter-spacing: .12em;
  white-space: nowrap;
}

.evz-brand h1 {
  margin: 3px 0 0;
  font-size: clamp(20px, 2vw, 27px);
  line-height: 1;
  letter-spacing: -.04em;
}

.evz-top-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.evz-status-pill,
.evz-mini-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 1px solid var(--evz-border);
  background: var(--evz-card);
  color: var(--evz-ink-2);
  padding: 10px 13px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 850;
  box-shadow: 0 10px 28px rgba(16,19,20,.06);
  white-space: nowrap;
}

.evz-status-pill.connected {
  border-color: rgba(3,205,140,.28);
  background: rgba(3,205,140,.10);
  color: var(--evz-green);
}

.evz-status-pill.disconnected {
  border-color: rgba(239,68,68,.22);
  background: rgba(239,68,68,.08);
  color: #b91c1c;
}

.evz-dot {
  width: 9px;
  height: 9px;
  border-radius: 999px;
  background: var(--evz-green);
  box-shadow: 0 0 0 6px rgba(3,205,140,.12);
}

.evz-status-pill.disconnected .evz-dot { background: var(--evz-danger); box-shadow: 0 0 0 6px rgba(239,68,68,.12); }

.evz-btn {
  border: 0;
  cursor: pointer;
  min-height: 42px;
  padding: 0 15px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-weight: 900;
  letter-spacing: -.01em;
  transition: transform .18s ease, box-shadow .18s ease, background .18s ease, border-color .18s ease;
  font-family: inherit;
  white-space: nowrap;
}

.evz-btn:hover { transform: translateY(-2px); }

.evz-btn-primary {
  background: linear-gradient(135deg, var(--evz-green), #00b77d);
  color: #fff;
  box-shadow: 0 16px 34px rgba(3,205,140,.28);
}

.evz-btn-primary.orange {
  background: linear-gradient(135deg, var(--evz-orange), #ff9f1c);
  box-shadow: 0 16px 34px rgba(247,127,0,.25);
}

.evz-btn-ghost {
  background: var(--evz-card);
  color: var(--evz-ink-2);
  border: 1px solid var(--evz-border);
}

.evz-main-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(390px, .8fr);
  gap: 22px;
  margin-top: 22px;
  align-items: stretch;
}

.evz-hero {
  min-height: 420px;
  border-radius: var(--evz-radius-xl);
  background: var(--evz-card);
  border: 1px solid var(--evz-border);
  box-shadow: var(--evz-shadow);
  backdrop-filter: blur(24px);
  overflow: hidden;
  position: relative;
  padding: clamp(26px, 4vw, 46px);
}

.evz-hero::after {
  content: "";
  position: absolute;
  inset: auto -120px -170px auto;
  width: 420px;
  height: 420px;
  border-radius: 50%;
  background: conic-gradient(from 180deg, rgba(3,205,140,.30), rgba(247,127,0,.22), rgba(166,166,166,.18), rgba(3,205,140,.30));
  filter: blur(18px);
  opacity: .70;
}

.evz-hero-content {
  position: relative;
  z-index: 1;
  max-width: 810px;
}

.evz-kicker {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border-radius: 999px;
  background: rgba(3,205,140,.10);
  border: 1px solid rgba(3,205,140,.20);
  color: var(--evz-green);
  font-size: 12px;
  font-weight: 950;
  text-transform: uppercase;
  letter-spacing: .12em;
}

.evz-hero h2 {
  margin: 6px 0 10px;
  max-width: 740px;
  font-size: clamp(26px, 4vw, 42px);
  line-height: 1.05;
  letter-spacing: -0.045em;
  color: var(--evz-ink);
}

.evz-gradient-text {
  color: inherit;
  background: none;
}

.evz-hero p {
  margin: 0;
  max-width: 760px;
  color: var(--evz-muted);
  font-size: clamp(16px, 1.5vw, 20px);
  line-height: 1.68;
}

.evz-hero-actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 26px;
}

.evz-hero .evz-btn { min-height: 50px; padding: 0 20px; }

.evz-session-strip {
  margin-top: 30px;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  max-width: 950px;
}

.evz-session-card {
  background: var(--evz-card);
  border: 1px solid var(--evz-border);
  border-radius: 20px;
  padding: 14px;
  box-shadow: 0 12px 30px rgba(16,19,20,.06);
}

.evz-session-card span {
  display: block;
  color: var(--evz-muted);
  font-size: 11px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: .09em;
}

.evz-session-card strong {
  display: block;
  margin-top: 6px;
  font-size: 14px;
  line-height: 1.25;
  letter-spacing: -.02em;
}

.evz-score-card {
  border-radius: var(--evz-radius-xl);
  background: var(--evz-card);
  border: 1px solid var(--evz-border);
  box-shadow: var(--evz-shadow);
  backdrop-filter: blur(24px);
  padding: 24px;
  position: relative;
  overflow: hidden;
  min-height: 420px;
  display: flex;
  flex-direction: column;
}

.evz-score-card::before {
  content: "";
  position: absolute;
  inset: -90px -90px auto auto;
  width: 220px;
  height: 220px;
  border-radius: 50%;
  background: rgba(3,205,140,.18);
}

.evz-score-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
  position: relative;
  z-index: 1;
}

.evz-section-title {
  margin: 0;
  font-size: 23px;
  line-height: 1;
  letter-spacing: -.045em;
}

.evz-section-subtitle {
  margin: 8px 0 0;
  color: var(--evz-muted);
  line-height: 1.5;
  font-size: 14px;
}

.evz-ring-wrap {
  display: grid;
  place-items: center;
  margin: 24px auto 16px;
  position: relative;
  z-index: 1;
}

.evz-ring {
  --score: 97;
  width: 178px;
  height: 178px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background:
    radial-gradient(circle at center, var(--evz-card-solid) 0 58%, transparent 59%),
    conic-gradient(var(--evz-green) calc(var(--score) * 1%), rgba(16,19,20,.08) 0);
  box-shadow: 0 20px 46px rgba(3,205,140,.19);
  position: relative;
}

.evz-score-card.disconnected .evz-ring {
  --score: 34;
  background:
    radial-gradient(circle at center, var(--evz-card-solid) 0 58%, transparent 59%),
    conic-gradient(var(--evz-danger) calc(var(--score) * 1%), rgba(16,19,20,.08) 0);
  box-shadow: 0 20px 46px rgba(239,68,68,.14);
}

.evz-ring-core {
  text-align: center;
}

.evz-ring-core strong {
  display: block;
  font-size: 46px;
  letter-spacing: -.07em;
}

.evz-ring-core span {
  color: var(--evz-muted);
  font-size: 12px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: .10em;
}

.evz-score-list {
  display: grid;
  gap: 10px;
  margin-top: auto;
  position: relative;
  z-index: 1;
}

.evz-score-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 12px 13px;
  border-radius: 16px;
  background: var(--evz-card);
  border: 1px solid var(--evz-border);
}

.evz-score-row span {
  color: var(--evz-muted);
  font-size: 13px;
  font-weight: 800;
}

.evz-score-row strong {
  font-size: 13px;
  font-weight: 950;
}

.evz-alert {
  margin-top: 22px;
  border-radius: 26px;
  padding: 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  border: 1px solid rgba(3,205,140,.22);
  background: linear-gradient(135deg, rgba(3,205,140,.18), color-mix(in srgb, var(--evz-card-solid) 78%, transparent));
  box-shadow: var(--evz-shadow-soft);
}

.evz-alert.disconnected {
  border-color: rgba(239,68,68,.18);
  background: linear-gradient(135deg, rgba(239,68,68,.14), color-mix(in srgb, var(--evz-card-solid) 78%, transparent));
}

.evz-alert-copy {
  display: flex;
  align-items: center;
  gap: 12px;
}

.evz-icon-bubble {
  width: 42px;
  height: 42px;
  border-radius: 16px;
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  color: #fff;
  background: linear-gradient(135deg, var(--evz-green), #00b77d);
  box-shadow: 0 12px 26px rgba(3,205,140,.25);
}

.evz-icon-bubble.orange { background: linear-gradient(135deg, var(--evz-orange), #ff9f1c); box-shadow: 0 12px 26px rgba(247,127,0,.22); }
.evz-icon-bubble.grey { background: linear-gradient(135deg, #8a9499, #5b666c); box-shadow: 0 12px 26px rgba(16,19,20,.12); }
.evz-icon-bubble.red { background: linear-gradient(135deg, #ef4444, #b91c1c); box-shadow: 0 12px 26px rgba(239,68,68,.18); }

.evz-alert h3,
.evz-card h3 {
  margin: 0;
  font-size: 16px;
  letter-spacing: -.03em;
}

.evz-alert p {
  margin: 4px 0 0;
  color: var(--evz-muted);
  line-height: 1.45;
  font-size: 13px;
}

.evz-grid-3 {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
  margin-top: 22px;
}

.evz-grid-2 {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 18px;
  margin-top: 18px;
}

.evz-card {
  border: 1px solid var(--evz-border);
  border-radius: var(--evz-radius-lg);
  background: var(--evz-card);
  box-shadow: var(--evz-shadow-soft);
  backdrop-filter: blur(22px);
  padding: 20px;
  position: relative;
  overflow: hidden;
}

.evz-card.glow::before {
  content: "";
  position: absolute;
  inset: -80px -80px auto auto;
  width: 170px;
  height: 170px;
  border-radius: 50%;
  background: rgba(3,205,140,.13);
  pointer-events: none;
}

.evz-card.orange-glow::before { background: rgba(247,127,0,.12); }

.evz-card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  position: relative;
  z-index: 1;
}

.evz-card-header-left {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.evz-check-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  margin-top: 16px;
  position: relative;
  z-index: 1;
}

.evz-check-card {
  background: var(--evz-card);
  border: 1px solid var(--evz-border);
  border-radius: 22px;
  padding: 15px;
  min-height: 174px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease;
}

.evz-check-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 18px 44px rgba(16,19,20,.10);
}

.evz-check-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
}

.evz-check-icon {
  width: 42px;
  height: 42px;
  border-radius: 16px;
  display: grid;
  place-items: center;
  background: rgba(3,205,140,.10);
  color: var(--evz-green);
}

.evz-check-card.warning .evz-check-icon { background: rgba(247,127,0,.11); color: #b45309; }
.evz-check-card.failed .evz-check-icon { background: rgba(239,68,68,.09); color: #b91c1c; }
.evz-check-card.idle .evz-check-icon { background: rgba(166,166,166,.14); color: var(--evz-muted); }

.evz-state-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 9px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 950;
  background: rgba(3,205,140,.10);
  color: var(--evz-green);
  border: 1px solid rgba(3,205,140,.18);
  white-space: nowrap;
}

.evz-state-badge.warning { background: rgba(247,127,0,.10); color: var(--evz-orange); border-color: rgba(247,127,0,.20); }
.evz-state-badge.failed { background: rgba(239,68,68,.08); color: #b91c1c; border-color: rgba(239,68,68,.18); }
.evz-state-badge.idle { background: rgba(166,166,166,.13); color: var(--evz-muted); border-color: rgba(166,166,166,.22); }

.evz-check-card h4 {
  margin: 0;
  font-size: 15px;
  letter-spacing: -.035em;
}

.evz-check-card p {
  margin: 0;
  color: var(--evz-muted);
  font-size: 13px;
  line-height: 1.46;
}

.evz-check-card strong {
  display: block;
  margin-top: auto;
  color: var(--evz-ink);
  font-size: 13px;
  letter-spacing: -.01em;
}

.evz-check-action {
  margin-top: 2px;
  color: var(--evz-green);
  font-size: 12px;
  font-weight: 900;
}

.evz-pipeline {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  align-items: stretch;
  gap: 10px;
  margin-top: 16px;
  position: relative;
  z-index: 1;
}

.evz-pipeline-step {
  border-radius: 22px;
  padding: 15px 13px;
  border: 1px solid var(--evz-border);
  background: var(--evz-card);
  min-height: 142px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  position: relative;
}

.evz-pipeline-step::after {
  content: "";
  position: absolute;
  right: -8px;
  top: 50%;
  width: 8px;
  height: 2px;
  background: linear-gradient(90deg, rgba(3,205,140,.45), rgba(247,127,0,.45));
}
.evz-pipeline-step:last-child::after { display: none; }

.evz-pipeline-step h4 {
  margin: 0;
  font-size: 13px;
  letter-spacing: -.02em;
}

.evz-pipeline-step p {
  margin: 0;
  color: var(--evz-muted);
  font-size: 12px;
  line-height: 1.42;
}

.evz-limit-list {
  display: grid;
  gap: 13px;
  margin-top: 18px;
}

.evz-limit-row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 12px;
  align-items: center;
  padding: 13px;
  border-radius: 18px;
  background: var(--evz-card);
  border: 1px solid var(--evz-border);
}

.evz-limit-label strong {
  display: block;
  font-size: 14px;
  letter-spacing: -.025em;
}

.evz-limit-label span {
  display: block;
  margin-top: 4px;
  font-size: 12px;
  color: var(--evz-muted);
}

.evz-limit-meter {
  width: 150px;
}

.evz-meter-track {
  height: 9px;
  border-radius: 999px;
  background: rgba(16,19,20,.09);
  overflow: hidden;
}

.evz-meter-fill {
  height: 100%;
  width: var(--fill, 50%);
  border-radius: inherit;
  background: linear-gradient(90deg, var(--evz-green), var(--evz-orange));
}

.evz-meter-value {
  display: block;
  margin-top: 6px;
  text-align: right;
  font-size: 12px;
  font-weight: 950;
}

.evz-tools-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin-top: 16px;
}

.evz-tool-button {
  border: 1px solid var(--evz-border);
  background: var(--evz-card);
  border-radius: 20px;
  padding: 14px;
  text-align: left;
  cursor: pointer;
  transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease;
  font-family: inherit;
  color: inherit;
  min-height: 112px;
}

.evz-tool-button:hover {
  transform: translateY(-4px);
  box-shadow: 0 18px 38px rgba(16,19,20,.09);
  border-color: rgba(3,205,140,.22);
}

.evz-tool-button strong {
  display: block;
  margin-top: 10px;
  font-size: 14px;
  letter-spacing: -.025em;
}

.evz-tool-button span {
  display: block;
  margin-top: 5px;
  color: var(--evz-muted);
  font-size: 12px;
  line-height: 1.35;
}

.evz-diagnostics {
  display: grid;
  gap: 10px;
  margin-top: 16px;
  position: relative;
  z-index: 1;
}

.evz-diagnostic-row {
  display: grid;
  grid-template-columns: 80px 1fr auto;
  gap: 12px;
  align-items: center;
  padding: 13px;
  border-radius: 18px;
  background: var(--evz-card);
  border: 1px solid var(--evz-border);
}

.evz-diagnostic-time {
  font-size: 12px;
  color: var(--evz-muted);
  font-weight: 900;
}

.evz-diagnostic-row strong {
  display: block;
  font-size: 13px;
  letter-spacing: -.02em;
}

.evz-diagnostic-row span {
  display: block;
  margin-top: 3px;
  color: var(--evz-muted);
  font-size: 12px;
  line-height: 1.35;
}

.evz-studio-card {
  display: grid;
  grid-template-columns: 170px 1fr;
  gap: 16px;
  align-items: stretch;
  margin-top: 16px;
}

.evz-studio-visual {
  min-height: 176px;
  border-radius: 24px;
  background:
    radial-gradient(circle at 50% 18%, rgba(3,205,140,.22), transparent 35%),
    linear-gradient(135deg, #1c2327, #0c1113);
  position: relative;
  overflow: hidden;
  border: 1px solid var(--evz-border);
  box-shadow: 0 24px 55px rgba(16,19,20,.18);
}

.evz-studio-visual::before {
  content: "";
  position: absolute;
  inset: 20px;
  border-radius: 18px;
  border: 1px solid var(--evz-border);
  background:
    linear-gradient(transparent 48%, rgba(3,205,140,.32) 49% 51%, transparent 52%),
    linear-gradient(90deg, transparent 48%, rgba(247,127,0,.38) 49% 51%, transparent 52%);
}

.evz-studio-visual::after {
  content: "LIVE";
  position: absolute;
  top: 18px;
  right: 18px;
  padding: 6px 9px;
  border-radius: 999px;
  background: rgba(3,205,140,.18);
  color: #c7ffe8;
  font-size: 10px;
  font-weight: 950;
  letter-spacing: .14em;
}

.evz-studio-fields {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.evz-field {
  padding: 13px;
  border-radius: 18px;
  background: var(--evz-card);
  border: 1px solid var(--evz-border);
}

.evz-field span {
  display: block;
  color: var(--evz-muted);
  font-size: 11px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: .08em;
}

.evz-field strong {
  display: block;
  margin-top: 6px;
  font-size: 13px;
  line-height: 1.3;
  letter-spacing: -.02em;
}

.evz-footer-note {
  margin: 22px 0 0;
  color: var(--evz-muted);
  text-align: center;
  font-size: 13px;
  line-height: 1.5;
}

.evz-icon { width: 20px; height: 20px; display: block; }
.evz-icon.small { width: 16px; height: 16px; }

@media (max-width: 1180px) {
  .evz-main-grid,
  .evz-grid-2 { grid-template-columns: 1fr; }
  .evz-check-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .evz-pipeline { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .evz-pipeline-step::after { display: none; }
}

@media (max-width: 820px) {
  .evz-readiness-page { padding: 16px; }
  .evz-topbar { position: relative; top: auto; align-items: flex-start; flex-direction: column; border-radius: 24px; }
  .evz-top-actions { justify-content: flex-start; width: 100%; }
  .evz-hero { padding: 24px; min-height: auto; }
  .evz-session-strip,
  .evz-grid-3,
  .evz-check-grid,
  .evz-tools-grid,
  .evz-studio-card,
  .evz-studio-fields { grid-template-columns: 1fr; }
  .evz-alert { flex-direction: column; align-items: flex-start; }
  .evz-diagnostic-row { grid-template-columns: 1fr; }
  .evz-limit-row { grid-template-columns: 1fr; }
  .evz-limit-meter { width: 100%; }
  .evz-meter-value { text-align: left; }
}
`;

const connectedChecks: ReadinessCheck[] = [
  {
    title: "Studio Bridge",
    subtitle: "Secure local bridge is online",
    detail: "Handshake complete with EVzone Live Studio.",
    icon: "plug",
    state: "ready",
    metric: "18ms heartbeat",
    action: "Bridge v2.8.1",
  },
  {
    title: "Studio Version",
    subtitle: "Version check passed",
    detail: "Active studio build supports Effect Creator runtime packages.",
    icon: "shield",
    state: "ready",
    metric: "v4.8.2 installed",
    action: "Required v4.8.0+",
  },
  {
    title: "Active Session",
    subtitle: "Project context loaded",
    detail: "Current live production session is available for binding.",
    icon: "scene",
    state: "ready",
    metric: "EVzone Live / Main Show",
    action: "Session locked",
  },
  {
    title: "Camera Source",
    subtitle: "Host camera detected",
    detail: "Camera feed is available for preview and effect testing.",
    icon: "camera",
    state: "ready",
    metric: "1080p · 60fps",
    action: "3 sources found",
  },
  {
    title: "Microphone Input",
    subtitle: "Audio stream is ready",
    detail: "Audio-reactive effects and sound tools can use this input.",
    icon: "mic",
    state: "ready",
    metric: "48kHz stereo",
    action: "Noise gate active",
  },
  {
    title: "GPU Runtime",
    subtitle: "Hardware acceleration available",
    detail: "WebGL2 is enabled and WebGPU support has been detected.",
    icon: "gpu",
    state: "ready",
    metric: "8.2ms render budget",
    action: "Live-safe profile",
  },
  {
    title: "Browser / Desktop",
    subtitle: "Runtime shell compatible",
    detail: "Editor panels, preview rendering, and bridge events are supported.",
    icon: "browser",
    state: "ready",
    metric: "Desktop shell OK",
    action: "All APIs available",
  },
  {
    title: "Local Storage",
    subtitle: "Cache and autosave ready",
    detail: "Project drafts, thumbnails, generated assets, and recovery points can be saved.",
    icon: "storage",
    state: "warning",
    metric: "8.7 GB free",
    action: "Clean cache suggested",
  },
  {
    title: "Device Preview",
    subtitle: "Remote preview channel open",
    detail: "Mobile/secondary preview can pair through a QR session.",
    icon: "phone",
    state: "ready",
    metric: "2 devices available",
    action: "QR ready",
  },
];

const disconnectedChecks: ReadinessCheck[] = connectedChecks.map((check, index) => {
  if (index < 3) {
    return {
      ...check,
      state: "failed",
      subtitle: index === 0 ? "Bridge is offline" : index === 1 ? "Version cannot be verified" : "No studio session found",
      detail: index === 0 ? "Effect Creator cannot reach EVzone Live Studio." : "Reconnect to load studio context.",
      metric: index === 0 ? "No heartbeat" : "Unavailable",
      action: "Reconnect required",
    };
  }
  return {
    ...check,
    state: "idle",
    subtitle: "Waiting for studio context",
    detail: "This check will run after the studio bridge reconnects.",
    metric: "Pending",
    action: "Standby",
  };
});

const runtimeLimits: RuntimeLimit[] = [
  { label: "Effect package", value: "18.4 MB / 50 MB", used: 37, hint: "Loaded from EVzone Studio live-safe profile" },
  { label: "Texture budget", value: "42 MB / 128 MB", used: 33, hint: "KTX2/Basis compression recommended" },
  { label: "GPU frame cost", value: "5.6 ms / 8.0 ms", used: 70, hint: "Safe for 60fps studio preview" },
  { label: "Script runtime", value: "1.2 ms / 4.0 ms", used: 30, hint: "Visual logic and scripts within limits" },
  { label: "Preview cache", value: "1.1 GB / 4 GB", used: 28, hint: "Autosave and generated assets available" },
];

const diagnosticsConnected: DiagnosticEvent[] = [
  { time: "00:00.018", label: "Bridge handshake", detail: "EVzone Studio Bridge accepted Effect Creator session.", state: "ready" },
  { time: "00:00.044", label: "Runtime limits loaded", detail: "Studio sent file, texture, memory, and FPS safety limits.", state: "ready" },
  { time: "00:00.083", label: "Project context", detail: "Main Show / Scene 03 / Host Camera A attached.", state: "ready" },
  { time: "00:00.127", label: "Media devices", detail: "Camera and microphone permissions are available from studio shell.", state: "ready" },
  { time: "00:00.190", label: "Storage warning", detail: "Cache is healthy, but cleanup is recommended before large AI exports.", state: "warning" },
];

const diagnosticsDisconnected: DiagnosticEvent[] = [
  { time: "00:00.000", label: "Bridge unavailable", detail: "No heartbeat received from EVzone Live Studio.", state: "failed" },
  { time: "00:00.012", label: "Session context blocked", detail: "Active project, scenes, cameras, and runtime limits cannot be loaded.", state: "failed" },
  { time: "00:00.030", label: "Local editing available", detail: "You can inspect cached projects while reconnecting.", state: "warning" },
];

const pipeline = [
  { icon: "studio" as IconName, title: "EVzone Studio", text: "Existing live production environment and active session." },
  { icon: "server" as IconName, title: "Studio Bridge", text: "Local event channel for scenes, cameras, limits, and preview." },
  { icon: "spark" as IconName, title: "Effect Creator", text: "Editor workspace, AI tools, resources, and project state." },
  { icon: "monitor" as IconName, title: "Preview Runtime", text: "Real-time camera/effect rendering with diagnostics." },
  { icon: "phone" as IconName, title: "Device Preview", text: "QR/mobile preview and secondary screen testing." },
];

const tools = [
  { icon: "refresh" as IconName, title: "Soft Reconnect", text: "Refresh the bridge without closing the editor." },
  { icon: "server" as IconName, title: "Restart Bridge", text: "Ask EVzone Studio to restart the local bridge service." },
  { icon: "camera" as IconName, title: "Refresh Sources", text: "Reload camera, mic, and preview devices." },
  { icon: "storage" as IconName, title: "Clean Cache", text: "Clear temporary previews while keeping projects safe." },
  { icon: "terminal" as IconName, title: "Run Diagnostics", text: "Check bridge, GPU, storage, devices, and studio runtime." },
  { icon: "box" as IconName, title: "Export Logs", text: "Create an internal diagnostic package for support." },
];

function Icon({ name, className = "" }: { name: IconName; className?: string }) {
  const common = {
    className: `evz-icon ${className}`,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  switch (name) {
    case "plug":
      return <svg {...common}><path d="M12 22v-5"/><path d="M9 8V2"/><path d="M15 8V2"/><path d="M18 8v5a6 6 0 0 1-12 0V8Z"/></svg>;
    case "studio":
      return <svg {...common}><path d="M3 7h18v13H3z"/><path d="m8 7 1.5-3h5L16 7"/><path d="M7 14h4"/><path d="M15 14h2"/></svg>;
    case "camera":
      return <svg {...common}><path d="M14.5 4h-9A2.5 2.5 0 0 0 3 6.5v11A2.5 2.5 0 0 0 5.5 20h9a2.5 2.5 0 0 0 2.5-2.5v-11A2.5 2.5 0 0 0 14.5 4Z"/><path d="m17 9 4-2v10l-4-2"/></svg>;
    case "mic":
      return <svg {...common}><path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v1a7 7 0 0 1-14 0v-1"/><path d="M12 18v4"/></svg>;
    case "gpu":
      return <svg {...common}><path d="M6 6h12v12H6z"/><path d="M9 9h6v6H9z"/><path d="M4 9H2"/><path d="M4 15H2"/><path d="M22 9h-2"/><path d="M22 15h-2"/><path d="M9 4V2"/><path d="M15 4V2"/><path d="M9 22v-2"/><path d="M15 22v-2"/></svg>;
    case "browser":
      return <svg {...common}><path d="M3 5h18v16H3z"/><path d="M3 9h18"/><path d="M7 7h.01"/><path d="M11 7h.01"/></svg>;
    case "storage":
      return <svg {...common}><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v10c0 1.7 3.6 3 8 3s8-1.3 8-3V5"/><path d="M4 10c0 1.7 3.6 3 8 3s8-1.3 8-3"/></svg>;
    case "phone":
      return <svg {...common}><path d="M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z"/><path d="M11 18h4"/></svg>;
    case "refresh":
      return <svg {...common}><path d="M21 12a9 9 0 0 1-15.5 6.2"/><path d="M3 12A9 9 0 0 1 18.5 5.8"/><path d="M18 2v4h4"/><path d="M6 22v-4H2"/></svg>;
    case "shield":
      return <svg {...common}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-5"/></svg>;
    case "warning":
      return <svg {...common}><path d="m12 3 10 18H2Z"/><path d="M12 9v5"/><path d="M12 18h.01"/></svg>;
    case "check":
      return <svg {...common}><path d="M20 6 9 17l-5-5"/></svg>;
    case "rocket":
      return <svg {...common}><path d="M4.5 16.5c-1.5 1.26-2 3.74-2 3.74s2.48-.5 3.74-2"/><path d="M9 15 5 11l6.8-6.8A7.4 7.4 0 0 1 20 2c0 3.2-.9 6-2.2 8.2Z"/><path d="m15 9-6 6"/></svg>;
    case "server":
      return <svg {...common}><path d="M4 4h16v6H4z"/><path d="M4 14h16v6H4z"/><path d="M8 7h.01"/><path d="M8 17h.01"/></svg>;
    case "link":
      return <svg {...common}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>;
    case "gauge":
      return <svg {...common}><path d="M21 12a9 9 0 1 0-18 0"/><path d="M12 12 17 7"/><path d="M7 17h10"/></svg>;
    case "terminal":
      return <svg {...common}><path d="m4 17 6-6-6-6"/><path d="M12 19h8"/></svg>;
    case "box":
      return <svg {...common}><path d="m21 8-9-5-9 5 9 5 9-5Z"/><path d="M3 8v8l9 5 9-5V8"/><path d="M12 13v8"/></svg>;
    case "activity":
      return <svg {...common}><path d="M22 12h-4l-3 8L9 4l-3 8H2"/></svg>;
    case "clock":
      return <svg {...common}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>;
    case "scene":
      return <svg {...common}><path d="M4 4h16v16H4z"/><path d="M8 4v16"/><path d="M16 4v16"/><path d="M4 9h16"/><path d="M4 15h16"/></svg>;
    case "spark":
      return <svg {...common}><path d="M12 2 14 8l6 2-6 2-2 6-2-6-6-2 6-2Z"/><path d="m19 17 1 3 3 1-3 1-1 3-1-3-3-1 3-1Z"/></svg>;
    case "monitor":
      return <svg {...common}><path d="M3 4h18v12H3z"/><path d="M8 20h8"/><path d="M12 16v4"/></svg>;
    case "wifi":
      return <svg {...common}><path d="M5 13a10 10 0 0 1 14 0"/><path d="M8.5 16.5a5 5 0 0 1 7 0"/><path d="M12 20h.01"/></svg>;
    case "settings":
      return <svg {...common}><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.1V21a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-.4-1.1 1.7 1.7 0 0 0-1-.6 1.7 1.7 0 0 0-1.88.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.1-.4H3a2 2 0 1 1 0-4h.09a1.7 1.7 0 0 0 1.1-.4 1.7 1.7 0 0 0 .6-1 1.7 1.7 0 0 0-.34-1.88l-.06-.06A2 2 0 1 1 7.22 3.4l.06.06A1.7 1.7 0 0 0 9 4.6c.4-.1.75-.3 1-.6.27-.3.4-.7.4-1.1V3a2 2 0 1 1 4 0v.09c0 .4.13.8.4 1.1.25.3.6.5 1 .6a1.7 1.7 0 0 0 1.88-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.4 9c.1.4.3.75.6 1 .3.27.7.4 1.1.4H21a2 2 0 1 1 0 4h-.09c-.4 0-.8.13-1.1.4-.3.25-.5.6-.6 1Z"/></svg>;
    default:
      return <svg {...common}><path d="M12 2v20"/><path d="M2 12h20"/></svg>;
  }
}

function StatusBadge({ state }: { state: CheckState }) {
  const labels: Record<CheckState, string> = {
    ready: "Ready",
    warning: "Check",
    failed: "Offline",
    idle: "Pending",
  };
  return (
    <span className={`evz-state-badge ${state}`}>
      <Icon name={state === "ready" ? "check" : state === "failed" ? "warning" : state === "warning" ? "warning" : "clock"} className="small" />
      {labels[state]}
    </span>
  );
}

function ReadinessCard({ item }: { item: ReadinessCheck }) {
  return (
    <article className={`evz-check-card ${item.state}`}>
      <div className="evz-check-top">
        <div className="evz-check-icon"><Icon name={item.icon} /></div>
        <StatusBadge state={item.state} />
      </div>
      <div>
        <h4>{item.title}</h4>
        <p>{item.subtitle}</p>
      </div>
      <p>{item.detail}</p>
      <strong>{item.metric}</strong>
      {item.action && <div className="evz-check-action">{item.action}</div>}
    </article>
  );
}

function LimitRow({ item }: { item: RuntimeLimit }) {
  return (
    <div className="evz-limit-row">
      <div className="evz-limit-label">
        <strong>{item.label}</strong>
        <span>{item.hint}</span>
      </div>
      <div className="evz-limit-meter">
        <div className="evz-meter-track"><div className="evz-meter-fill" style={{ "--fill": `${item.used}%` } as React.CSSProperties} /></div>
        <span className="evz-meter-value">{item.value}</span>
      </div>
    </div>
  );
}

function DiagnosticRow({ item }: { item: DiagnosticEvent }) {
  return (
    <div className="evz-diagnostic-row">
      <div className="evz-diagnostic-time">{item.time}</div>
      <div>
        <strong>{item.label}</strong>
        <span>{item.detail}</span>
      </div>
      <StatusBadge state={item.state} />
    </div>
  );
}

function ToolButton({ icon, title, text, onClick }: { icon: IconName; title: string; text: string; onClick?: () => void }) {
  return (
    <button className="evz-tool-button" type="button" onClick={onClick}>
      <div className="evz-check-icon"><Icon name={icon} /></div>
      <strong>{title}</strong>
      <span>{text}</span>
    </button>
  );
}

export default function EVzoneStudioConnectionReadiness() {
  const [mode, setMode] = useState<ConnectionMode>("connected");
  const connected = mode === "connected";

  const checks = useMemo(() => (connected ? connectedChecks : disconnectedChecks), [connected]);
  const diagnostics = useMemo(() => (connected ? diagnosticsConnected : diagnosticsDisconnected), [connected]);
  const readinessScore = connected ? 97 : 34;

  return (
    <main className={`evz-readiness-page ${mode}`}>
      <style>{css}</style>
      <div className="evz-readiness-shell">
        <header className="evz-topbar">
          <div className="evz-brand">
            <div className="evz-mark"><Icon name="plug" /></div>
            <div className="evz-brand-text">
              <div className="evz-eyebrow">EVzone Effect Creator · Studio Diagnostics</div>
              <h1>Studio Connection & Readiness</h1>
            </div>
          </div>
          <div className="evz-top-actions">
            <span className={`evz-status-pill ${mode}`}><span className="evz-dot" />{connected ? "Connected to EVzone Live Studio" : "Studio not connected"}</span>
            <button className="evz-btn evz-btn-ghost" type="button" onClick={() => setMode(connected ? "disconnected" : "connected")}>
              <Icon name={connected ? "warning" : "refresh"} className="small" />
              {connected ? "View not-connected state" : "Reconnect now"}
            </button>
            <button className="evz-btn evz-btn-primary" type="button" data-evz-autowire="1">
              <Icon name="terminal" className="small" />
              Run diagnostics
            </button>
          </div>
        </header>

        <section className="evz-main-grid">
          <div className="evz-hero">
            <div className="evz-hero-content">
              <h2>Studio-grade readiness before every effect goes live.</h2>
              <p>
                Confirm bridge health, studio session context, media devices, GPU capability, local cache, device preview,
                and runtime limits loaded directly from your existing EVzone Live Studio. No separate login. No account layer.
              </p>
              <div className="evz-hero-actions">
                <button className="evz-btn evz-btn-primary" type="button" data-evz-autowire="1"><Icon name="rocket" />Continue to Editor</button>
                <button className="evz-btn evz-btn-ghost" type="button" data-evz-autowire="1"><Icon name="scene" />Select Studio Scene</button>
                <button className="evz-btn evz-btn-ghost" type="button" data-evz-autowire="1"><Icon name="phone" />Pair Preview Device</button>
              </div>
              <div className="evz-session-strip">
                <div className="evz-session-card"><span>Active project</span><strong>{connected ? "EVzone Live / Main Show" : "Waiting for studio"}</strong></div>
                <div className="evz-session-card"><span>Studio scene</span><strong>{connected ? "Scene 03 · Creator Desk" : "Unavailable"}</strong></div>
                <div className="evz-session-card"><span>Primary camera</span><strong>{connected ? "Host Camera A · 1080p" : "Unavailable"}</strong></div>
                <div className="evz-session-card"><span>Runtime profile</span><strong>{connected ? "Live Safe · 60 FPS" : "Not loaded"}</strong></div>
              </div>
            </div>
          </div>

          <aside className={`evz-score-card ${mode}`}>
            <div className="evz-score-header">
              <div>
                <h2 className="evz-section-title">Readiness score</h2>
                <p className="evz-section-subtitle">A production-safe summary of the current studio connection, devices, runtime, and cache.</p>
              </div>
              <span className="evz-mini-pill"><Icon name="activity" className="small" /> Live check</span>
            </div>
            <div className="evz-ring-wrap">
              <div className="evz-ring" style={{ "--score": readinessScore } as React.CSSProperties}>
                <div className="evz-ring-core">
                  <strong>{readinessScore}</strong>
                  <span>{connected ? "Excellent" : "Offline"}</span>
                </div>
              </div>
            </div>
            <div className="evz-score-list">
              <div className="evz-score-row"><span>Bridge heartbeat</span><strong>{connected ? "18ms" : "No signal"}</strong></div>
              <div className="evz-score-row"><span>Studio version</span><strong>{connected ? "Compatible" : "Unknown"}</strong></div>
              <div className="evz-score-row"><span>Runtime limits</span><strong>{connected ? "Loaded" : "Not loaded"}</strong></div>
              <div className="evz-score-row"><span>Preview channel</span><strong>{connected ? "Open" : "Closed"}</strong></div>
            </div>
          </aside>
        </section>

        <section className={`evz-alert ${mode}`}>
          <div className="evz-alert-copy">
            <div className={`evz-icon-bubble ${connected ? "" : "red"}`}><Icon name={connected ? "check" : "warning"} /></div>
            <div>
              <h3>{connected ? "EVzone Studio Bridge is healthy" : "Studio is not connected"}</h3>
              <p>{connected ? "Effect Creator has the active studio session, scene list, camera sources, preview channel, and live-safe runtime limits." : "Reconnect to EVzone Live Studio to load scenes, cameras, runtime limits, and studio preview tools."}</p>
            </div>
          </div>
          <button className={`evz-btn evz-btn-primary ${connected ? "" : "orange"}`} type="button" onClick={() => setMode("connected")}>
            <Icon name="refresh" />{connected ? "Refresh connection" : "Reconnect to studio"}
          </button>
        </section>

        <section className="evz-card glow" style={{ marginTop: 22 }}>
          <div className="evz-card-header">
            <div className="evz-card-header-left">
              <div className="evz-icon-bubble"><Icon name="gauge" /></div>
              <div>
                <h2 className="evz-section-title">System readiness checks</h2>
                <p className="evz-section-subtitle">Everything required for premium live AR/effect creation, preview, export, and studio control.</p>
              </div>
            </div>
            <span className="evz-mini-pill"><Icon name="clock" className="small" /> Last checked now</span>
          </div>
          <div className="evz-check-grid">
            {checks.map((item) => <ReadinessCard key={item.title} item={item} />)}
          </div>
        </section>

        <section className="evz-grid-2">
          <article className="evz-card glow">
            <div className="evz-card-header">
              <div className="evz-card-header-left">
                <div className="evz-icon-bubble"><Icon name="scene" /></div>
                <div>
                  <h2 className="evz-section-title">Active studio project / session</h2>
                  <p className="evz-section-subtitle">Current EVzone Live Studio context available to the effect creator.</p>
                </div>
              </div>
              <span className={`evz-state-badge ${connected ? "ready" : "failed"}`}>{connected ? "Loaded" : "Unavailable"}</span>
            </div>
            <div className="evz-studio-card">
              <div className="evz-studio-visual" />
              <div className="evz-studio-fields">
                <div className="evz-field"><span>Workspace</span><strong>{connected ? "EVzone Live Studio" : "Not connected"}</strong></div>
                <div className="evz-field"><span>Production</span><strong>{connected ? "Main Show Package" : "Unavailable"}</strong></div>
                <div className="evz-field"><span>Session ID</span><strong>{connected ? "EVZ-LIVE-482-778" : "—"}</strong></div>
                <div className="evz-field"><span>Scene</span><strong>{connected ? "Scene 03 · Creator Desk" : "—"}</strong></div>
                <div className="evz-field"><span>Camera</span><strong>{connected ? "Host Camera A" : "—"}</strong></div>
                <div className="evz-field"><span>Last heartbeat</span><strong>{connected ? "18ms ago" : "No heartbeat"}</strong></div>
              </div>
            </div>
          </article>

          <article className="evz-card orange-glow">
            <div className="evz-card-header">
              <div className="evz-card-header-left">
                <div className="evz-icon-bubble orange"><Icon name="settings" /></div>
                <div>
                  <h2 className="evz-section-title">Runtime limits from EVzone Studio</h2>
                  <p className="evz-section-subtitle">Live-safe budgets loaded from the active studio runtime profile.</p>
                </div>
              </div>
              <span className={`evz-state-badge ${connected ? "ready" : "idle"}`}>{connected ? "Profile active" : "Not loaded"}</span>
            </div>
            <div className="evz-limit-list">
              {runtimeLimits.map((item) => <LimitRow key={item.label} item={connected ? item : { ...item, value: "Not loaded", used: 0, hint: "Reconnect to load this limit" }} />)}
            </div>
          </article>
        </section>

        <section className="evz-grid-2">
          <article className="evz-card glow">
            <div className="evz-card-header">
              <div className="evz-card-header-left">
                <div className="evz-icon-bubble"><Icon name="link" /></div>
                <div>
                  <h2 className="evz-section-title">Studio bridge pipeline</h2>
                  <p className="evz-section-subtitle">The complete data path from live studio context to preview devices.</p>
                </div>
              </div>
            </div>
            <div className="evz-pipeline">
              {pipeline.map((step) => (
                <div className="evz-pipeline-step" key={step.title}>
                  <div className="evz-check-icon"><Icon name={step.icon} /></div>
                  <h4>{step.title}</h4>
                  <p>{step.text}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="evz-card">
            <div className="evz-card-header">
              <div className="evz-card-header-left">
                <div className="evz-icon-bubble grey"><Icon name="terminal" /></div>
                <div>
                  <h2 className="evz-section-title">Bridge diagnostics</h2>
                  <p className="evz-section-subtitle">Recent connection events, checks, warnings, and recovery notices.</p>
                </div>
              </div>
              <span className="evz-mini-pill"><Icon name="activity" className="small" /> Trace</span>
            </div>
            <div className="evz-diagnostics">
              {diagnostics.map((item) => <DiagnosticRow key={`${item.time}-${item.label}`} item={item} />)}
            </div>
          </article>
        </section>

        <section className="evz-card glow" style={{ marginTop: 18 }}>
          <div className="evz-card-header">
            <div className="evz-card-header-left">
              <div className="evz-icon-bubble"><Icon name="refresh" /></div>
              <div>
                <h2 className="evz-section-title">Reconnect tools</h2>
                <p className="evz-section-subtitle">Fast recovery actions for bridge, media devices, cache, and internal diagnostics.</p>
              </div>
            </div>
            <span className="evz-mini-pill"><Icon name="shield" className="small" /> Studio-safe tools</span>
          </div>
          <div className="evz-tools-grid">
            {tools.map((tool, index) => <ToolButton key={tool.title} {...tool} onClick={index === 0 ? () => setMode("connected") : undefined} />)}
          </div>
        </section>

        <p className="evz-footer-note">
          This page is studio-native: it uses the existing EVzone Live Studio session and does not introduce login, logout, billing, account, or marketplace controls.
        </p>
      </div>
    </main>
  );
}
