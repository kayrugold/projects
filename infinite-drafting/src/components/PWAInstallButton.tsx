import React, { useState } from 'react';
import { usePWAInstall } from '../lib/usePWAInstall';
import { Download, Smartphone } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);

  // If already running as an installed PWA, hide the button
  if (isInstalled) {
    return null;
  }

  const handleButtonClick = async () => {
    if (isInstallable) {
      const installed = await install();
      if (!installed) {
        setShowGuide(true);
      }
    } else {
      setShowGuide(true);
    }
  };

  return (
    <div className="pointer-events-auto">
      <button
        onClick={handleButtonClick}
        className="flex items-center justify-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-600 text-white text-xs sm:text-sm font-semibold hover:bg-blue-700 active:bg-blue-800 rounded-full shadow-lg transition-all active:scale-95 border border-blue-400/30"
        title="Install App"
      >
        <Download size={16} />
        <span>Install App</span>
      </button>

      {showGuide && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 pointer-events-auto"
          onClick={() => setShowGuide(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-3 text-blue-600">
              <Smartphone size={24} />
              <h3 className="text-lg font-bold text-slate-900">Install App</h3>
            </div>

            {isIOS ? (
              <p className="text-sm text-slate-600 leading-relaxed">
                1. Tap the <strong>Share</strong> button in Safari toolbar.<br />
                2. Scroll down and tap <strong>Add to Home Screen</strong>.
              </p>
            ) : (
              <p className="text-sm text-slate-600 leading-relaxed">
                1. Tap your browser menu button (<strong>⋮</strong> or <strong>⋯</strong> at the top right/bottom).<br />
                2. Tap <strong>Add to Home screen</strong> or <strong>Install app</strong>.
              </p>
            )}

            <button
              onClick={() => setShowGuide(false)}
              className="mt-5 w-full rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 active:scale-98 transition-all shadow-sm"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
