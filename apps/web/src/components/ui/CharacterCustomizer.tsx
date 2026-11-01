"use client";

import React, { useState } from "react";
import { X, Check, Palette, Sparkles } from "lucide-react";
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md rounded-3xl bg-amber-50 text-slate-900 border-4 border-amber-800 shadow-2xl p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-amber-700/30">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-amber-800" />
            <h2 className="text-lg font-serif font-black text-amber-950">Customize Character</h2>
          </div>
          <button
            onClick={closeModal}
            className="p-1.5 rounded-full hover:bg-amber-200 text-amber-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Name Input */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-amber-900 mb-1">
            Visitor Nickname
          </label>
          <input
            type="text"
            maxLength={16}
            value={usernameInput}
            onChange={(e) => setUsernameInput(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-amber-100 border border-amber-300 text-sm font-semibold text-amber-950 focus:outline-none focus:border-amber-700"
          />
        </div>

        {/* Apparel Color Picker */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-amber-900 mb-2">
            Shirt / Apparel Color
          </label>
          <div className="grid grid-cols-5 gap-2.5">
            {CHARACTER_COLORS.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                style={{ backgroundColor: color }}
                className={`h-9 rounded-xl flex items-center justify-center shadow-md transition-transform hover:scale-105 active:scale-95 cursor-pointer ${
                  selectedColor === color ? "ring-4 ring-amber-800" : ""
                }`}
              >
                {selectedColor === color && <Check className="w-4 h-4 text-white drop-shadow" />}
              </button>
            ))}
          </div>
        </div>

        {/* Hats & Accessories */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-amber-900 mb-2">
            Hats & Accessories
          </label>
          <div className="grid grid-cols-3 gap-2">
            {CHARACTER_HATS.map((hat) => {
              if (hat === "crown" && !isOwner) return null; // Crown reserved for Owner
              return (
                <button
                  key={hat}
                  onClick={() => setSelectedHat(hat)}
                  className={`p-2 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                    selectedHat === hat
                      ? "bg-amber-800 text-amber-50 border-amber-900 shadow-md"
                      : "bg-amber-100/80 hover:bg-amber-200 text-amber-900 border-amber-300"
                  }`}
                >
                  <span className="text-base">
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

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full py-2.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-amber-50 font-bold text-sm shadow-lg transition-transform active:scale-95 cursor-pointer"
        >
          Apply Customization
        </button>
      </div>
    </div>
  );
};

