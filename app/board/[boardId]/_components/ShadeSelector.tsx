'use client';

import { useState, useRef, useEffect } from 'react';
import { ShapeColor } from '@/types/canvasRawTypes';
import { colors } from '@/utils/utils';
import { Button } from "@/components/ui/button";
import { Palette, X } from "lucide-react";

/**
 * Convert HSL values to RGB.
 * @param h - Hue (0-360)
 * @param s - Saturation (0-100)
 * @param l - Lightness (0-100)
 * @returns Color object in RGB format.
 */
function hslToRgb(h: number, s: number, l: number): ShapeColor {
  s /= 100;
  l /= 100;
  let r: number, g: number, b: number;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h/360 + 1/3);
    g = hue2rgb(p, q, h/360);
    b = hue2rgb(p, q, h/360 - 1/3);
  }
  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}

interface ColorPickerProps {
  onChange: (color: ShapeColor) => void;
}

/**
 *
 * Displays a grid of preset color buttons and a trigger button to open the advanced color picker popover.
 * The popover allows users to adjust the hue, saturation, and lightness values.
 */
export const ShadeSelector = ({ onChange }: ColorPickerProps) => {
  // State to control popover visibility.
  const [isOpen, setIsOpen] = useState(false);
  // State for the current HSL values.
  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(100);
  const [lightness, setLightness] = useState(50);
  // State for the background color of the saturation/lightness area.
  const [saturationLightnessColor, setSaturationLightnessColor] = useState<ShapeColor>(hslToRgb(0, 100, 50));
  // State for the preview color.
  const [previewColor, setPreviewColor] = useState<ShapeColor>(hslToRgb(0, 100, 50));

  // Ref for the popover container.
  const pickerRef = useRef<HTMLDivElement>(null);
  // Ref for the saturation/lightness interactive area.
  const saturationLightnessRef = useRef<HTMLDivElement>(null);

  // Closing the popover if clicking outside.
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handling changes in the hue slider.
  const handleHueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newHue = parseInt(event.target.value, 10);
    setHue(newHue);
    setSaturationLightnessColor(hslToRgb(newHue, 100, 50));
    const newColor = hslToRgb(newHue, saturation, lightness);
    setPreviewColor(newColor);
    onChange(newColor);
  };

  // Updating saturation and lightness based on mouse position over the interactive area.
  const updateSaturationLightness = (event: MouseEvent | React.MouseEvent<HTMLDivElement>) => {
    const rect = saturationLightnessRef.current!.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const newSaturation = Math.max(0, Math.min(100, (x / rect.width) * 100));
    const newLightness = Math.max(0, Math.min(100, (1 - y / rect.height) * 100));
    setSaturation(newSaturation);
    setLightness(newLightness);
    const newColor = hslToRgb(hue, newSaturation, newLightness);
    setPreviewColor(newColor);
    onChange(newColor);
  };

  // Handling mouse down event in the saturation/lightness area to start dragging.
  const handleSaturationLightnessMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    updateSaturationLightness(event);
    const handleMouseMove = (moveEvent: MouseEvent) => {
      updateSaturationLightness(moveEvent);
    };
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Style for the hue slider background.
  const hueSliderStyle = {
    background: `linear-gradient(to right, 
      rgb(255, 0, 0), 
      rgb(255, 255, 0), 
      rgb(0, 255, 0), 
      rgb(0, 255, 255), 
      rgb(0, 0, 255), 
      rgb(255, 0, 255), 
      rgb(255, 0, 0)
    )`,
  };

  return (
    <div className="relative">
      {/* Preset for Colors Grid */}
      <div className="grid grid-cols-4 gap-2 p-3 border border-gray-200 rounded-lg shadow-sm bg-gray-50">
        <ColorButton color={{ r: 243, g: 82, b: 35 }} onClick={onChange} />
        <ColorButton color={{ r: 255, g: 249, b: 177 }} onClick={onChange} />
        <ColorButton color={{ r: 68, g: 202, b: 99 }} onClick={onChange} />
        {/* Advanced Picker Trigger */}
        <Button
          variant="ghost"
          className="w-10 h-10 p-0 rounded-full hover:opacity-90 transition flex items-center justify-center relative border-2"
          onClick={() => setIsOpen(!isOpen)}
          style={{
            backgroundColor: '#fff',
            borderColor: `hsl(0, 0%, 80%)`,
          }}
          aria-label="Open advanced color picker"
        >
          <Palette className="h-5 w-5 text-gray-600" />
        </Button>
        <ColorButton color={{ r: 39, g: 142, b: 237 }} onClick={onChange} />
        <ColorButton color={{ r: 155, g: 105, b: 245 }} onClick={onChange} />
        <ColorButton color={{ r: 252, g: 142, b: 42 }} onClick={onChange} />
        <ColorButton color={{ r: 0, g: 0, b: 0 }} onClick={onChange} />
      </div>

      {/* Advanced Color Picker Popover  */}
      {isOpen && (
        <div
          ref={pickerRef}
          className="absolute z-20 bottom-full mb-2 left-0 w-64 p-4 bg-white border border-gray-200 rounded-lg shadow-lg transition transform duration-200 ease-out"
        >
          {/* Popover Header */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-semibold text-gray-700">Advanced Color Picker</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700 transition"
              aria-label="Close color picker"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          {/* Hue Slider Section */}
          <div className="mb-4">
            <label htmlFor="hueSlider" className="block text-sm text-gray-600 mb-1">
              Hue
            </label>
            <input
              type="range"
              id="hueSlider"
              min="0"
              max="360"
              value={hue}
              onChange={handleHueChange}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer"
              style={hueSliderStyle}
            />
          </div>
          {/* Saturation & Lightness Section */}
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">Saturation &amp; Lightness</label>
            <div
              ref={saturationLightnessRef}
              onMouseDown={handleSaturationLightnessMouseDown}
              className="relative h-32 rounded-lg overflow-hidden cursor-pointer"
              style={{
                background: `rgb(${saturationLightnessColor.r}, ${saturationLightnessColor.g}, ${saturationLightnessColor.b})`,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
              <div
                className="absolute w-4 h-4 border-2 border-white rounded-full"
                style={{
                  left: `${saturation}%`,
                  top: `${100 - lightness}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface ColorButtonProps {
  onClick: (color: ShapeColor) => void;
  color: ShapeColor;
}

/**
 * ColorButton Component
 *
 * Renders a button displaying a preset color.
 */
const ColorButton = ({ onClick, color }: ColorButtonProps) => (
  <button
    onClick={() => onClick(color)}
    aria-label={`Select color: rgb(${color.r}, ${color.g}, ${color.b})`}
    className="w-10 h-10 rounded-md border border-gray-300 hover:shadow-md transition"
    style={{ background: colors(color) }}
  />
);

export default ShadeSelector;
