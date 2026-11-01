"use client";

import React, { useState } from "react";
import { X, Check, Palette, Sparkles, User } from "lucide-react";
import { useGameStore } from "@/stores/useGameStore";
import { useMultiplayerStore } from "@/stores/useMultiplayerStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { CHARACTER_COLORS, CHARACTER_HATS } from "@mosswood/shared";

export const CharacterCustomizer: React.FC = () => {
  const activeModal = useGameStore((s) => s.activeModal);
  const closeModal = useGameStore((s) => s.closeModal);

  const myUsername = useMultiplayerStore((s) => s.myUsername);
  const myColor = useMultiplayerStore((s) => s.myColor);
  const myHat = useMultiplayerStore((s) => s.myHat);
  const customizeAvatar = useMultiplayerStore((s) => s.customizeAvatar);

  const isOwner = useAuthStore((s) => s.isOwner);

  const [usernameInput, setUsernameInput] = useState(myUsername);
  const [selectedColor, setSelectedColor] = useState(myColor);
  const [selectedHat, setSelectedHat] = useState(myHat);

  if (activeModal !== "customizer") return null;

  const handleSave = () => {
    customizeAvatar(selectedColor, selectedHat, usernameInput.trim());
    closeModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fade-in font-sans">
      <div className="relative w-full max-w-md rounded-3xl bg-[#FAF7F2] text-slate-800 border border-stone-300 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] p-6 space-y-5 animate-modal-pop">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-200">
          <div className="flex items-center gap-2.5">
            <Palette className="w-5 h-5 text-amber-800" />
            <div>
              <h2 className="text-lg font-serif font-bold text-amber-950">Avatar Customizer</h2>
              <p className="text-xs text-amber-800/80">Style your visitor appearance</p>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="p-1.5 rounded-full hover:bg-stone-200 text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Name Input */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5" /> Visitor Handle
          </label>
          <input
            type="text"
            maxLength={16}
            value={usernameInput}
            onChange={(e) => setUsernameInput(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl bg-white border border-stone-300 text-sm font-semibold text-stone-900 focus:outline-none focus:border-amber-700 shadow-sm transition-colors"
          />
        </div>

        {/* Color Palette */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
            Shirt / Apparel Tone
          </label>
          <div className="grid grid-cols-5 gap-2.5">
            {CHARACTER_COLORS.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                style={{ backgroundColor: color }}
                className={`h-9 rounded-xl flex items-center justify-center shadow transition-all hover:scale-105 active:scale-95 cursor-pointer ${
                  selectedColor === color ? "ring-3 ring-amber-800 ring-offset-2 ring-offset-[#FAF7F2]" : ""
                }`}
              >
                {selectedColor === color && <Check className="w-4 h-4 text-white drop-shadow" />}
              </button>
            ))}
          </div>
        </div>

        {/* Hats & Headwear */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
            Hats & Headwear
          </label>
          <div className="grid grid-cols-3 gap-2">
            {CHARACTER_HATS.map((hat) => {
              if (hat === "crown" && !isOwner) return null;
              return (
                <button
                  key={hat}
                  onClick={() => setSelectedHat(hat)}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                    selectedHat === hat
                      ? "bg-amber-900 text-amber-50 border-amber-950 shadow-sm"
                      : "bg-white hover:bg-stone-100 text-stone-700 border-stone-200"
                  }`}
                >
                  <span className="text-lg">
                    {hat === "none" && "🧑"}
                    {hat === "straw_hat" && "👒"}
                    {hat === "beanie" && "🧢"}
                    {hat === "wizard_hat" && "🧙"}
                    {hat === "flower" && "🌸"}
                    {hat === "cap" && "🧢"}
                    {hat === "crown" && "👑"}
                  </span>
                  <span className="capitalize text-[11px]">
                    {hat === "none"
                      ? "None"
                      : hat === "straw_hat"
                      ? "Straw Hat"
                      : hat === "wizard_hat"
                      ? "Wizard"
                      : hat}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleSave}
          className="w-full py-2.5 rounded-xl bg-amber-900 hover:bg-amber-800 text-amber-50 font-bold text-sm shadow-md transition-all active:scale-95 cursor-pointer"
        >
          Save Appearance
        </button>
      </div>
    </div>
  );
};
