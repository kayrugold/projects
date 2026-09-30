/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  X, 
  MapPin, 
  Sparkles, 
  Code2, 
  Heart, 
  ExternalLink, 
  Compass, 
  ShieldCheck, 
  FileText, 
  Trash2, 
  Lock, 
  CheckCircle2, 
  Copy, 
  Check, 
  Mail, 
  Globe,
  UserCheck,
  Smartphone, 
  ShieldAlert, 
  Sun, 
  Moon,
  Scale,
  DollarSign
} from 'lucide-react';

interface AboutModalProps {
  key?: React.Key;
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'about' | 'privacy' | 'terms' | 'deletion';
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

interface LibraryCredit {
  name: string;
  creator: string;
  role: string;
}

const LIBRARIES: LibraryCredit[] = [
  {
    name: 'React 19 & React DOM',
    creator: 'Meta Open Source & React Team',
    role: 'Core declarative UI framework and component state architecture',
  },
  {
    name: 'TypeScript',
    creator: 'Microsoft',
    role: 'Type-safe vector math, coordinate systems, and contract enforcement',
  },
  {
    name: 'Vite',
    creator: 'Evan You & Vite Core Team',
    role: 'Blazing-fast build pipeline and modern ESM runtime',
  },
  {
    name: 'Tailwind CSS v4',
    creator: 'Adam Wathan & Tailwind Labs',
    role: 'High-performance utility-first styling and tablet responsive layout',
  },
  {
    name: 'Firebase & Cloud Firestore',
    creator: 'Google Firebase Team',
    role: 'Cross-device cloud document persistence & Google Authentication',
  },
  {
    name: 'Lucide Icons',
    creator: 'Lucide Project & Cole Bemis (Feather)',
    role: 'Clean vector drafting and architectural iconography',
  },
  {
    name: '@uiw/react-color',
    creator: 'Kenny Wong & UIW Open Source',
    role: 'Interactive hue wheel and value/shade sliders',
  },
  {
    name: 'Motion',
    creator: 'Framer / Matt Perry',
    role: 'Hardware-accelerated interface motion and tactile gestures',
  },
  {
    name: 'Vite PWA Plugin',
    creator: 'Anthony Fu & Vite PWA Contributors',
    role: 'Offline-ready Progressive Web App tablet caching & installation',
  },
];

export function AboutModal({ 
  isOpen, 
  onClose, 
  defaultTab = 'about',
  isDarkMode = false,
  onToggleDarkMode
}: AboutModalProps) {
  const [activeTab, setActiveTab] = useState<'about' | 'privacy' | 'terms' | 'deletion'>(defaultTab);
  const [copiedEmail, setCopiedEmail] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(defaultTab);
    }
  }, [isOpen, defaultTab]);

  if (!isOpen) return null;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('andys.dev.studio@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 pointer-events-auto animate-in fade-in duration-200">
      <div 
        className={`rounded-2xl sm:rounded-3xl shadow-2xl border max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden transition-colors ${
          isDarkMode 
            ? 'bg-slate-900 border-slate-800 text-slate-100' 
            : 'bg-white border-slate-200/90 text-slate-800'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="about-dialog-title"
      >
        {/* Header */}
        <div className={`flex items-center justify-between px-4 sm:px-6 py-4 border-b shrink-0 transition-colors ${
          isDarkMode ? 'border-slate-800 bg-slate-900/90' : 'border-slate-100 bg-slate-50/80'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/25 shrink-0">
              <Compass size={22} strokeWidth={2.2} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="about-dialog-title" className={`font-bold text-base sm:text-lg leading-tight ${
                  isDarkMode ? 'text-slate-100' : 'text-slate-900'
                }`}>
                  Infinite Drafting
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-blue-100 text-blue-700 rounded-full">
                  v1.0.0
                </span>
              </div>
              <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Andy's Dev Studio • Google Play & Legal Compliance
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onToggleDarkMode && (
              <button
                onClick={onToggleDarkMode}
                className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 text-xs font-semibold transition-all shadow-2xs ${
                  isDarkMode 
                    ? 'bg-slate-800 border-slate-700 text-amber-300 hover:bg-slate-700' 
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
                title="Toggle Dark / Light Theme"
              >
                {isDarkMode ? <Moon size={14} className="text-amber-400 fill-amber-400/20" /> : <Sun size={14} className="text-amber-500 fill-amber-500/20" />}
                <span className="hidden sm:inline">{isDarkMode ? 'Dark Mode' : 'Light Mode'}</span>
              </button>
            )}

            <button
              onClick={onClose}
              className={`p-2 rounded-xl transition-colors ${
                isDarkMode ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-200/60'
              }`}
              title="Close dialog"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Tab Selector - Responsive Segment Grid */}
        <div className={`px-4 sm:px-6 py-2.5 border-b shrink-0 transition-colors ${
          isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-100/80 border-slate-200/80'
        }`}>
          <div className={`grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 rounded-2xl text-xs font-semibold ${
            isDarkMode ? 'bg-slate-800/80' : 'bg-slate-200/60'
          }`}>
            <button
              onClick={() => setActiveTab('about')}
              className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl transition-all text-center ${
                activeTab === 'about'
                  ? isDarkMode ? 'bg-slate-900 text-blue-400 shadow-xs border border-slate-700 font-bold' : 'bg-white text-blue-700 shadow-xs border border-slate-200/80 font-bold'
                  : isDarkMode ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50' : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Heart size={14} className={activeTab === 'about' ? 'text-rose-500 fill-rose-500' : 'shrink-0'} />
              <span className="truncate">About & Credits</span>
            </button>

            <button
              onClick={() => setActiveTab('privacy')}
              className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl transition-all text-center ${
                activeTab === 'privacy'
                  ? isDarkMode ? 'bg-slate-900 text-blue-400 shadow-xs border border-slate-700 font-bold' : 'bg-white text-blue-700 shadow-xs border border-slate-200/80 font-bold'
                  : isDarkMode ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50' : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <ShieldCheck size={14} className={activeTab === 'privacy' ? 'text-emerald-500' : 'shrink-0'} />
              <span className="truncate">Privacy Policy</span>
            </button>

            <button
              onClick={() => setActiveTab('terms')}
              className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl transition-all text-center ${
                activeTab === 'terms'
                  ? isDarkMode ? 'bg-slate-900 text-blue-400 shadow-xs border border-slate-700 font-bold' : 'bg-white text-blue-700 shadow-xs border border-slate-200/80 font-bold'
                  : isDarkMode ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50' : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <FileText size={14} className={activeTab === 'terms' ? 'text-indigo-400' : 'shrink-0'} />
              <span className="truncate">Terms & Safety</span>
            </button>

            <button
              onClick={() => setActiveTab('deletion')}
              className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl transition-all text-center ${
                activeTab === 'deletion'
                  ? isDarkMode ? 'bg-slate-900 text-blue-400 shadow-xs border border-slate-700 font-bold' : 'bg-white text-blue-700 shadow-xs border border-slate-200/80 font-bold'
                  : isDarkMode ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50' : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Trash2 size={14} className={activeTab === 'deletion' ? 'text-amber-500' : 'shrink-0'} />
              <span className="truncate">Data Deletion</span>
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto px-4 sm:px-6 py-5 space-y-5 text-sm flex-1">
          {/* TAB 1: ABOUT & CREDITS */}
          {activeTab === 'about' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Developer Studio Card */}
              <div className={`border rounded-2xl p-4 sm:p-5 shadow-xs transition-colors ${
                isDarkMode 
                  ? 'bg-slate-800/90 border-slate-700' 
                  : 'bg-gradient-to-br from-blue-50 via-indigo-50/40 to-slate-50 border-blue-200/80'
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1 flex items-center gap-1">
                      <Heart size={12} className="text-rose-500 fill-rose-500" />
                      Creator & Development Studio
                    </div>
                    <div className={`text-lg font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      Andy Davis
                    </div>
                    <div className={`text-sm font-semibold mt-0.5 ${isDarkMode ? 'text-blue-300' : 'text-blue-900'}`}>
                      Andy's Dev Studio
                    </div>
                    <div className={`flex flex-wrap items-center gap-1.5 text-xs mt-1 font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      <MapPin size={13} className="text-red-500 shrink-0" />
                      <span>Redding, CA, USA</span>
                      <span>•</span>
                      <button 
                        onClick={handleCopyEmail}
                        className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
                        title="Copy support email"
                      >
                        <Mail size={12} />
                        <span>andys.dev.studio@gmail.com</span>
                        {copiedEmail && <Check size={12} className="text-emerald-500" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap sm:flex-col gap-2 shrink-0">
                    <a
                      href="https://andysdevstudio.pages.dev"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors shrink-0"
                    >
                      <Globe size={13} />
                      <span>Studio Homepage</span>
                      <ExternalLink size={11} />
                    </a>

                    <a
                      href="https://andysdevstudio.pages.dev/legal.html"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border transition-colors shrink-0 ${
                        isDarkMode 
                          ? 'bg-slate-700 hover:bg-slate-600 text-slate-200 border-slate-600' 
                          : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300 shadow-2xs'
                      }`}
                    >
                      <ShieldCheck size={13} className="text-emerald-500" />
                      <span>Legal & Compliance Hub</span>
                      <ExternalLink size={11} />
                    </a>
                  </div>
                </div>
              </div>

              {/* AI Studio Contribution Card */}
              <div className={`border rounded-2xl p-4 sm:p-5 space-y-2.5 transition-colors ${
                isDarkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                  <Sparkles size={13} className="text-indigo-500" />
                  Google AI Studio Co-Engineering Contribution
                </div>
                <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                  Co-engineered using <strong>Google AI Studio</strong>. AI Studio contributed to:
                </p>
                <ul className={`text-xs space-y-1.5 list-disc list-inside ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                  <li>
                    <strong className={isDarkMode ? 'text-slate-100' : 'text-slate-800'}>Infinite 2D Vector Engine:</strong> Sub-pixel S Pen coordinate transformations, dual-finger pan/zoom, and live spatial viewport culling for large multi-note documents.
                  </li>
                  <li>
                    <strong className={isDarkMode ? 'text-slate-100' : 'text-slate-800'}>Smart Drafting Tools:</strong> Snapping grid, 15° angle guides, interactive protractor, point-to-point ruler, and numbered box grids.
                  </li>
                  <li>
                    <strong className={isDarkMode ? 'text-slate-100' : 'text-slate-800'}>Persistence Architecture:</strong> High-capacity IndexedDB offline engine that preserves exact camera viewports and layers without browser quota limits.
                  </li>
                  <li>
                    <strong className={isDarkMode ? 'text-slate-100' : 'text-slate-800'}>Cloud Sync & Security:</strong> Firebase Firestore session synchronization and Google OAuth sign-in.
                  </li>
                </ul>
              </div>

              {/* Open-Source Libraries */}
              <div className="space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                  <Code2 size={13} className="text-slate-500" />
                  Open-Source Code & Library Creators
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {LIBRARIES.map((lib) => (
                    <div 
                      key={lib.name}
                      className={`border rounded-xl p-3 transition-colors ${
                        isDarkMode ? 'bg-slate-800/70 border-slate-700/80' : 'bg-white border-slate-200/90'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`font-semibold text-xs ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{lib.name}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium block mt-0.5">{lib.creator}</span>
                      <p className={`text-[11px] mt-1 leading-snug ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                        {lib.role}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Design Philosophy */}
              <div className={`border rounded-2xl p-4 text-xs leading-relaxed ${
                isDarkMode ? 'bg-amber-950/20 border-amber-800/60 text-amber-200' : 'bg-amber-50/70 border-amber-200/70 text-amber-950'
              }`}>
                <strong className="font-semibold">Intuitive by Design:</strong> Infinite Drafting is built to be naturally self-explanatory. Draw with pen or touch, use two fingers to pan and zoom, toggle precision snapping tools as needed, and your work is safely preserved locally and in the cloud.
              </div>
            </div>
          )}

          {/* TAB 2: PRIVACY POLICY */}
          {activeTab === 'privacy' && (
            <div className="space-y-4 text-xs leading-relaxed animate-in fade-in duration-150">
              <div className={`border rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                isDarkMode ? 'bg-emerald-950/30 border-emerald-800/80 text-emerald-200' : 'bg-emerald-50 border-emerald-200/90 text-emerald-900'
              }`}>
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-sm">
                    <ShieldCheck size={16} className="text-emerald-500" />
                    <span>Official Privacy Policy & Zero Data Pledge</span>
                  </div>
                  <p className={`mt-1 text-xs ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                    Published by <strong>Andy's Dev Studio</strong> (Redding, CA, USA) for Google Play Store compliance.
                  </p>
                </div>
                <a
                  href="https://andysdevstudio.pages.dev/privacy-policy.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors shrink-0 shadow-xs"
                >
                  <span>View Online Policy</span>
                  <ExternalLink size={12} />
                </a>
              </div>

              <div className={`space-y-3 border rounded-2xl p-4 sm:p-5 ${
                isDarkMode ? 'bg-slate-800/90 border-slate-700 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
              }`}>
                {/* ZERO DATA COLLECTION GUARANTEE BANNER */}
                <div className={`border rounded-xl p-3.5 font-medium ${
                  isDarkMode ? 'bg-emerald-950/40 border-emerald-700/80 text-emerald-200' : 'bg-emerald-500/10 border-emerald-300 text-emerald-950'
                }`}>
                  <span className="font-bold block text-xs uppercase tracking-wide mb-1 text-emerald-600 dark:text-emerald-400">
                    🛡️ Developer's Core Promise: Zero Data Collection
                  </span>
                  <p className="leading-snug">
                    Andy's Dev Studio promises that <strong>Infinite Drafting collects zero personal data, requires no user login, and stores drawings locally on device storage.</strong> Your privacy is 100% respected.
                  </p>
                </div>

                <h3 className={`font-bold text-sm border-b pb-2 ${isDarkMode ? 'text-white border-slate-700' : 'text-slate-900 border-slate-100'}`}>
                  1. Overview & Commitment
                </h3>
                <p>
                  <strong>Infinite Drafting</strong> is created by <strong>Andy's Dev Studio</strong> (Andy Davis, Redding, CA, USA). We operate on a strict privacy-first principle: <strong>We do not collect, harvest, view, or receive your personal information.</strong>
                </p>

                <h3 className={`font-bold text-sm border-b pb-2 pt-2 ${isDarkMode ? 'text-white border-slate-700' : 'text-slate-900 border-slate-100'}`}>
                  2. Local Storage & Zero Mandatory Account
                </h3>
                <ul className="list-disc list-inside space-y-1.5 pl-1">
                  <li>
                    <strong>Local Drawing Storage:</strong> By default, all vector lines, pen strokes, layers, and draft files are stored exclusively on your device hardware using browser IndexedDB. No user login or registration is required to draft, create, or export.
                  </li>
                  <li>
                    <strong>Optional Google / Firebase Cloud Sync:</strong> If you choose to enable cloud backup to sync drawings across your tablets or devices, authentication is handled directly by Google Firebase client libraries. <strong>Andy's Dev Studio does not receive or store your Google credentials, passwords, or personal identity details.</strong>
                  </li>
                  <li>
                    <strong>Isolated Cloud Storage:</strong> Cloud drafts in Google Firestore are secured by strict per-user access control rules. Andy's Dev Studio does not harvest, analyze, monitor, or access your saved drawings.
                  </li>
                  <li>
                    <strong>Stylus & Drawing Input:</strong> Touch coordinates, pen pressure, and tilt are calculated locally in real time on your device GPU for instant responsiveness. No biometric, drawing, or behavioral telemetry is ever transmitted.
                  </li>
                </ul>

                <h3 className={`font-bold text-sm border-b pb-2 pt-2 ${isDarkMode ? 'text-white border-slate-700' : 'text-slate-900 border-slate-100'}`}>
                  3. Zero Advertising, Zero Selling & Zero Tracking
                </h3>
                <p>
                  <strong>Zero Third-Party SDKs:</strong> Infinite Drafting contains zero third-party advertisement networks, zero analytics tracking beacons, and zero telemetry monitors. We never sell, rent, monetize, or trade user data.
                </p>

                <h3 className={`font-bold text-sm border-b pb-2 pt-2 ${isDarkMode ? 'text-white border-slate-700' : 'text-slate-900 border-slate-100'}`}>
                  4. Children's Privacy (COPPA & GDPR)
                </h3>
                <p>
                  Infinite Drafting does not collect or request any personal information from anyone, including children under 13.
                </p>

                <div className="pt-2 text-center">
                  <h3 className={`font-bold text-sm border-b pb-2 ${isDarkMode ? 'text-white border-slate-700' : 'text-slate-900 border-slate-100'}`}>
                    5. Developer & Data Safety Contact Info (Play Console Required)
                  </h3>
                  <p className="pt-2 text-xs text-slate-600 dark:text-slate-400">
                    For any privacy questions or data inquiries, reach out directly to the developer:
                  </p>
                </div>

                <div className={`p-4 rounded-2xl border text-center flex flex-col items-center justify-center space-y-3 mx-auto max-w-lg shadow-2xs ${isDarkMode ? 'bg-slate-900/60 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex flex-col items-center text-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">Developer</span>
                    <span className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">Andy Davis</span>
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Andy's Dev Studio</span>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <button 
                      onClick={handleCopyEmail}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-xs font-semibold hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors shadow-2xs"
                      title="Click to copy email address"
                    >
                      <Mail size={13} className="text-blue-600 dark:text-blue-400" />
                      <span>andys.dev.studio@gmail.com</span>
                      {copiedEmail ? <Check size={13} className="text-emerald-500" /> : <Copy size={11} className="text-blue-500 opacity-70" />}
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
                    <a 
                      href="https://andysdevstudio.pages.dev" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-medium hover:border-blue-400 transition-colors shadow-2xs"
                    >
                      <Globe size={13} className="text-blue-500" />
                      <span>Studio Homepage</span>
                      <ExternalLink size={10} className="text-slate-400" />
                    </a>

                    <a 
                      href="https://andysdevstudio.pages.dev/legal.html" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-medium hover:border-indigo-400 transition-colors shadow-2xs"
                    >
                      <ShieldCheck size={13} className="text-emerald-500" />
                      <span>Legal Compliance Hub</span>
                      <ExternalLink size={10} className="text-slate-400" />
                    </a>
                  </div>
                </div>

                <div className={`pt-2.5 border-t flex flex-wrap items-center justify-center gap-2 text-center text-[11px] ${isDarkMode ? 'border-slate-700 text-slate-400' : 'border-slate-100 text-slate-500'}`}>
                  <span>Official Direct Privacy Link:</span>
                  <a 
                    href="https://andysdevstudio.pages.dev/privacy-policy.html" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 font-semibold"
                  >
                    <span>https://andysdevstudio.pages.dev/privacy-policy.html</span>
                    <ExternalLink size={10} />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TERMS & DATA SAFETY */}
          {activeTab === 'terms' && (
            <div className="space-y-4 text-xs leading-relaxed animate-in fade-in duration-150">
              {/* Header Badge */}
              <div className={`border rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                isDarkMode ? 'bg-indigo-950/30 border-indigo-800/80 text-indigo-200' : 'bg-indigo-50 border-indigo-200/90 text-indigo-950'
              }`}>
                <div>
                  <div className="flex items-center gap-2 font-bold text-sm mb-1">
                    <Scale size={16} className="text-indigo-500" />
                    <span>Terms of Service, EULA & Purchase Policies</span>
                  </div>
                  <p className={`text-xs ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                    Commercial paid software license ($1.99) & Google Play compliance.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href="https://andysdevstudio.pages.dev/terms.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors shadow-xs"
                  >
                    <span>Terms</span>
                    <ExternalLink size={12} />
                  </a>
                  <a
                    href="https://andysdevstudio.pages.dev/eula.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 font-semibold rounded-xl border transition-colors shadow-2xs ${
                      isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'
                    }`}
                  >
                    <span>EULA</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>

              {/* 4 Compliance Policy Action Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* 1. Terms of Service */}
                <a 
                  href="https://andysdevstudio.pages.dev/terms.html"
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`border rounded-xl p-3 block transition-all group hover:border-indigo-400 ${
                    isDarkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                      <FileText size={13} className="text-indigo-500" />
                      <span>Terms of Service / Terms of Use</span>
                    </span>
                    <ExternalLink size={12} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                    Outlines acceptable usage, 100% intellectual property ownership of your artwork, and disclaimer of warranties.
                  </p>
                  <span className="text-[10px] text-blue-600 dark:text-blue-400 font-medium mt-1.5 inline-block">
                    andysdevstudio.pages.dev/terms.html
                  </span>
                </a>

                {/* 2. End User License Agreement (EULA) */}
                <a 
                  href="https://andysdevstudio.pages.dev/eula.html"
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`border rounded-xl p-3 block transition-all group hover:border-indigo-400 ${
                    isDarkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                      <Smartphone size={13} className="text-purple-500" />
                      <span>End User License Agreement (EULA)</span>
                    </span>
                    <ExternalLink size={12} className="text-slate-400 group-hover:text-purple-600 transition-colors" />
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                    Defines the personal, non-exclusive software license granted to the purchaser upon downloading the APK / AAB.
                  </p>
                  <span className="text-[10px] text-blue-600 dark:text-blue-400 font-medium mt-1.5 inline-block">
                    andysdevstudio.pages.dev/eula.html
                  </span>
                </a>

                {/* 3. Refund & Purchase Policy */}
                <a 
                  href="https://andysdevstudio.pages.dev/return-policy.html"
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`border rounded-xl p-3 block transition-all group hover:border-indigo-400 ${
                    isDarkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                      <DollarSign size={13} className="text-emerald-500" />
                      <span>Refund & Purchase Policy ($1.99)</span>
                    </span>
                    <ExternalLink size={12} className="text-slate-400 group-hover:text-emerald-600 transition-colors" />
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                    Required for commercial $1.99 paid apps. Informs users about Google Play's 48-hour automated refund window and developer support.
                  </p>
                  <span className="text-[10px] text-blue-600 dark:text-blue-400 font-medium mt-1.5 inline-block">
                    andysdevstudio.pages.dev/return-policy.html
                  </span>
                </a>

                {/* 4. Complete Legal & Compliance Hub */}
                <a 
                  href="https://andysdevstudio.pages.dev/legal.html"
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`border rounded-xl p-3 block transition-all group hover:border-indigo-400 ${
                    isDarkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                      <ShieldCheck size={13} className="text-blue-500" />
                      <span>Complete Legal & Compliance Hub</span>
                    </span>
                    <ExternalLink size={12} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                    An all-in-one central directory linking to privacy, terms, refunds, EULA, and publisher contact information.
                  </p>
                  <span className="text-[10px] text-blue-600 dark:text-blue-400 font-medium mt-1.5 inline-block">
                    andysdevstudio.pages.dev/legal.html
                  </span>
                </a>
              </div>

              {/* Terms of Service & EULA Content Details */}
              <div className={`space-y-3 border rounded-2xl p-4 sm:p-5 ${
                isDarkMode ? 'bg-slate-800/90 border-slate-700 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
              }`}>
                <div className={`flex items-center justify-between border-b pb-2 ${isDarkMode ? 'border-slate-700' : 'border-slate-100'}`}>
                  <h3 className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    Terms of Service & License Summary
                  </h3>
                  <a
                    href="https://andysdevstudio.pages.dev/terms.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-semibold text-[11px]"
                  >
                    <span>Full Terms</span>
                    <ExternalLink size={10} />
                  </a>
                </div>
                <p>
                  Welcome to <strong>Infinite Drafting</strong>, created by <strong>Andy's Dev Studio</strong> (Redding, CA, USA). By downloading or using the software, you agree to the following terms:
                </p>

                <h4 className={`font-semibold pt-1 ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>1. Intellectual Property & 100% User Ownership</h4>
                <p>
                  You retain full, unrestricted 100% copyright and intellectual property rights to all artwork, sketches, vector drawings, exported SVG/PNG files, and project documents created within Infinite Drafting.
                </p>

                <h4 className={`font-semibold pt-1 ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>2. License Grant (EULA)</h4>
                <p>
                  Andy's Dev Studio grants you a personal, non-exclusive, non-transferable software license to use Infinite Drafting on compatible tablet, mobile, desktop, or web devices under the terms of the standard Android EULA.
                </p>

                <h4 className={`font-semibold pt-1 ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>3. Acceptable Use</h4>
                <p>
                  You agree not to attempt to reverse engineer, decompile, or compromise the cloud synchronization infrastructure or security rules.
                </p>

                <h4 className={`font-semibold pt-1 ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>4. 48-Hour Refund Window ($1.99 Paid Apps)</h4>
                <p>
                  Infinite Drafting is a commercial paid app ($1.99). Google Play provides an automated 48-hour refund window directly through the Play Store order history. In addition, you can reach out directly to <strong>andys.dev.studio@gmail.com</strong> for assistance.
                </p>

                <h4 className={`font-semibold pt-1 ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>5. Disclaimer of Warranties</h4>
                <p>
                  Infinite Drafting is provided "AS IS" and "AS AVAILABLE". We recommend regularly exporting important drawings to JSON or SVG backup files.
                </p>

                <div className={`pt-2.5 border-t flex flex-wrap items-center justify-between gap-2 text-[11px] ${isDarkMode ? 'border-slate-700 text-slate-400' : 'border-slate-100 text-slate-500'}`}>
                  <span>Legal Compliance Directory:</span>
                  <a 
                    href="https://andysdevstudio.pages.dev/legal.html" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <span>andysdevstudio.pages.dev/legal.html</span>
                    <ExternalLink size={10} />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ACCOUNT & DATA DELETION */}
          {activeTab === 'deletion' && (
            <div className="space-y-4 text-xs leading-relaxed animate-in fade-in duration-150">
              <div className={`border rounded-2xl p-4 ${
                isDarkMode ? 'bg-amber-950/30 border-amber-800/80 text-amber-200' : 'bg-amber-50 border-amber-200/90 text-amber-950'
              }`}>
                <div className="flex items-center gap-2 font-bold text-sm mb-1">
                  <ShieldAlert size={16} className="text-amber-500" />
                  <span>Google Play Account & Data Deletion Requirement</span>
                </div>
                <p className={isDarkMode ? 'text-slate-300' : 'text-amber-900'}>
                  Google Play policies require all apps that offer account creation (Google Sign-In) to provide clear mechanisms to request account and associated data deletion.
                </p>
              </div>

              <div className={`space-y-4 border rounded-2xl p-4 sm:p-5 ${
                isDarkMode ? 'bg-slate-800/90 border-slate-700 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
              }`}>
                <h3 className={`font-bold text-sm border-b pb-2 ${isDarkMode ? 'text-white border-slate-700' : 'text-slate-900 border-slate-100'}`}>
                  Self-Service Data Removal Options
                </h3>

                <div className="space-y-3">
                  <div className={`p-3 border rounded-xl space-y-1 ${isDarkMode ? 'bg-slate-900/60 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                    <div className={`font-semibold flex items-center gap-1.5 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      <Trash2 size={14} className="text-rose-500" />
                      <span>1. Delete Local Drawings & Device Data</span>
                    </div>
                    <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>
                      Open the <strong>Library (Folder icon)</strong> in the left toolbar, go to the <strong>Device Storage</strong> tab, and click the trash button on any draft. You can also clear browser cache / site data for this domain to purge all offline IndexedDB storage immediately.
                    </p>
                  </div>

                  <div className={`p-3 border rounded-xl space-y-1 ${isDarkMode ? 'bg-slate-900/60 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                    <div className={`font-semibold flex items-center gap-1.5 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      <Trash2 size={14} className="text-amber-500" />
                      <span>2. Delete Individual Cloud Drafts</span>
                    </div>
                    <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>
                      Open <strong>Library &gt; Cloud Storage</strong> while signed in to delete specific cloud drafts permanently from Cloud Firestore.
                    </p>
                  </div>

                  <div className={`p-3 border rounded-xl space-y-2 ${isDarkMode ? 'bg-slate-900/60 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                    <div className={`font-semibold flex items-center gap-1.5 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      <UserCheck size={14} className="text-blue-500" />
                      <span>3. Complete Account & Cloud Data Purge Request</span>
                    </div>
                    <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>
                      To delete your entire account record, Google auth session link, and all associated Cloud Firestore records, you may submit an email request or visit our developer studio legal portal:
                    </p>
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <a
                        href="https://andysdevstudio.pages.dev"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg text-xs transition-colors"
                      >
                        <Globe size={13} />
                        <span>Andy's Dev Studio</span>
                        <ExternalLink size={11} />
                      </a>

                      <a
                        href="https://andysdevstudio.pages.dev/legal.html"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 border font-medium rounded-lg text-xs transition-colors ${
                          isDarkMode ? 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700' : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                        }`}
                      >
                        <ShieldCheck size={13} className="text-emerald-500" />
                        <span>Legal Portal</span>
                        <ExternalLink size={11} />
                      </a>

                      <button
                        onClick={handleCopyEmail}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 font-medium rounded-lg text-xs transition-colors dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800"
                      >
                        <Mail size={13} />
                        <span>Email andys.dev.studio@gmail.com</span>
                        {copiedEmail ? <Check size={12} className="text-emerald-500" /> : <Copy size={11} />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`px-4 sm:px-6 py-3 border-t flex flex-col items-center justify-center gap-2 text-xs shrink-0 transition-colors text-center ${
          isDarkMode ? 'bg-slate-900/90 border-slate-800 text-slate-400' : 'bg-slate-50/90 border-slate-100 text-slate-500'
        }`}>
          <div className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-center">
            <span className={`font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>Andy Davis (Andy's Dev Studio)</span>
            <span className="text-slate-300 dark:text-slate-600">•</span>
            <a 
              href="https://andysdevstudio.pages.dev" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 font-medium"
            >
              <span>Homepage</span>
              <ExternalLink size={10} />
            </a>
            <span className="text-slate-300 dark:text-slate-600">•</span>
            <a 
              href="https://andysdevstudio.pages.dev/legal.html" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 font-medium"
            >
              <span>Legal Hub</span>
              <ExternalLink size={10} />
            </a>
            <span className="text-slate-300 dark:text-slate-600">•</span>
            <a 
              href="https://andysdevstudio.pages.dev/privacy-policy.html" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 font-medium"
            >
              <span>Privacy</span>
              <ExternalLink size={10} />
            </a>
          </div>

          <button
            onClick={onClose}
            className="px-6 py-1.5 bg-slate-900 hover:bg-slate-800 active:bg-black text-white font-medium rounded-xl transition-colors shadow-xs text-center dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
