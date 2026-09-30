import React, { useState, useEffect } from 'react';
import ColorWheel from '@uiw/react-color-wheel';
import ShadeSlider from '@uiw/react-color-shade-slider';
import { hexToHsva, hsvaToHex } from '@uiw/color-convert';
import { X } from 'lucide-react';

interface ColorPickerWheelProps {
  color: string;
  onChange: (color: string) => void;
  onClose: () => void;
}

const PRESET_COLORS = [
  '#000000', '#FFFFFF', '#ef4444', '#f97316', 
  '#f59e0b', '#84cc16', '#22c55e', '#06b6d4', 
  '#3b82f6', '#8b5cf6', '#d946ef', '#64748b'
];

export const ColorPickerWheel: React.FC<ColorPickerWheelProps> = ({ color, onChange, onClose }) => {
  const [hsva, setHsva] = useState(() => hexToHsva(color));

  useEffect(() => {
    // Sync external color changes (only if it significantly differs to prevent loops)
    const newHsva = hexToHsva(color);
    if (hsvaToHex(newHsva) !== hsvaToHex(hsva)) {
      setHsva(newHsva);
    }
  }, [color]);

  const handleColorChange = (newColor: any) => {
    setHsva(newColor.hsva);
    onChange(newColor.hex);
  };

  const handlePresetClick = (hex: string) => {
    const newHsva = hexToHsva(hex);
    setHsva(newHsva);
    onChange(hex);
  };

  return (
    <div className="pointer-events-auto bg-white/95 backdrop-blur-md shadow-xl border border-slate-200 rounded-2xl p-4 w-64 flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <h3 className="font-bold text-slate-800 text-sm">Color Wheel</h3>
        <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors">
          <X size={16} />
        </button>
      </div>
      
      <div className="flex flex-col items-center gap-6 py-2">
        <ColorWheel
          color={hsva}
          onChange={handleColorChange}
          width={180}
          height={180}
        />
        <div className="w-full px-2">
          <ShadeSlider
            hsva={hsva}
            style={{ width: '100%', height: 16, borderRadius: 8 }}
            onChange={(newShade) => {
              setHsva({ ...hsva, ...newShade });
              onChange(hsvaToHex({ ...hsva, ...newShade }));
            }}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-6 gap-2">
        {PRESET_COLORS.map(c => (
          <button
            key={c}
            className="w-8 h-8 rounded-full border border-slate-200 shadow-sm transition-transform hover:scale-110 active:scale-95"
            style={{ backgroundColor: c }}
            onClick={() => handlePresetClick(c)}
            title={c}
          />
        ))}
      </div>

      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full border border-slate-200 shadow-sm" style={{ backgroundColor: hsvaToHex(hsva) }} />
        <div className="text-sm font-mono text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg flex-1 text-center border border-slate-100">
          {hsvaToHex(hsva).toUpperCase()}
        </div>
      </div>
    </div>
  );
};
