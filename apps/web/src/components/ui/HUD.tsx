"use client";

import React from "react";
import {
  Compass,
  Users,
  Volume2,
  VolumeX,
  MapPin,
  Palette,
  ShieldCheck,
  Sun,
  Moon,
  FileText,
  Gamepad2,
  Sparkles,
} from "lucide-react";
import { useGameStore } from "@/stores/useGameStore";
import { useMultiplayerStore } from "@/stores/useMultiplayerStore";
import { useAudioStore } from "@/stores/useAudioStore";
import { useAuthStore } from "@/stores/useAuthStore";

export const HUD: React.FC = () => {
  const viewMode = useGameStore((s) => s.viewMode);
  const setViewMode = useGameStore((s) => s.setViewMode);
  const currentLocationName = useGameStore((s) => s.currentLocationName);
  const timeOfDay = useGameStore((s) => s.timeOfDay);
  const openModal = useGameStore((s) => s.openModal);

  const onlineCount = useMultiplayerStore((s) => s.onlineCount);
  const isConnected = useMultiplayerStore((s) => s.isConnected);
  const sendEmote = useMultiplayerStore((s) => s.sendEmote);

  const isMuted = useAudioStore((s) => s.isMuted);
  const toggleMute = useAudioStore((s) => s.toggleMute);
  const playChime = useAudioStore((s) => s.playChime);

  const isOwner = useAuthStore((s) => s.isOwner);

  const isNight = timeOfDay < 6 || timeOfDay > 19;
  const formattedHour = Math.floor(timeOfDay);
  const formattedMinutes = Math.floor((timeOfDay % 1) * 60)
    .toString()
    .padStart(2, "0");
  const timeString = `${formattedHour % 12 || 12}:${formattedMinutes} ${formattedHour >= 12 ? "PM" : "AM"}`;

  return (
    <div className="absolute inset-0 pointer-events-none z-30 flex flex-col justify-between p-4 sm:p-6 overflow-hidden font-sans">
      {/* Top Floating Glass Header Row */}
      <div className="flex items-center justify-between gap-3">
        {/* Top-Left: Logo, Location & View Toggle */}
        <div className="flex flex-wrap items-center gap-2 pointer-events-auto">
          {/* Logo & World Pill */}
          <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-950/60 backdrop-blur-xl border border-white/10 shadow-lg text-slate-100 transition-all hover:bg-slate-950/70">
            <span className="text-sm">🌲</span>
            <div className="flex items-center gap-1.5">
              <span className="font-serif font-bold text-sm tracking-wide text-amber-100">
                Mosswood
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
          </div>

          {/* Current Location Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-950/50 backdrop-blur-xl border border-white/10 text-xs font-medium text-slate-200 shadow-md">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span className="truncate max-w-[180px]">{currentLocationName || "Peaceful Meadows"}</span>
          </div>

          {/* 3D World ⇄ Classic CV Toggle */}
          <div className="flex items-center p-1 rounded-full bg-slate-950/60 backdrop-blur-xl border border-white/10 shadow-lg">
            <button
              onClick={() => {
                playChime();
                setViewMode("3d");
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                viewMode === "3d"
                  ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Gamepad2 className="w-3.5 h-3.5" />
              <span>3D World</span>
            </button>
            <button
              onClick={() => {
                playChime();
                setViewMode("classic");
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                viewMode === "classic"
                  ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Classic CV</span>
            </button>
          </div>
        </div>

        {/* Top-Right: Visitors, Time, Audio & Admin */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Online Visitors Counter */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-950/60 backdrop-blur-xl border border-white/10 shadow-lg text-slate-200 text-xs font-medium">
            <Users className="w-3.5 h-3.5 text-sky-400" />
            <span>
              {onlineCount} {onlineCount === 1 ? "visitor" : "visitors"}
            </span>
            <span
              className={`w-2 h-2 rounded-full ${
                isConnected ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" : "bg-amber-400"
              }`}
            />
          </div>

          {/* Day/Night Clock */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-950/60 backdrop-blur-xl border border-white/10 text-slate-300 text-xs font-mono shadow-md">
            {isNight ? (
              <Moon className="w-3.5 h-3.5 text-amber-300" />
            ) : (
              <Sun className="w-3.5 h-3.5 text-amber-400" />
            )}
            <span>{timeString}</span>
          </div>

          {/* Audio Toggle */}
          <button
            onClick={toggleMute}
            className="p-2 rounded-full bg-slate-950/60 hover:bg-slate-900/90 backdrop-blur-xl border border-white/10 text-slate-300 hover:text-amber-300 transition-all shadow-md cursor-pointer active:scale-95"
            title={isMuted ? "Unmute Ambient Sound" : "Mute Sound"}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
          </button>

          {/* Admin / Creator Button */}
          <button
            onClick={() => {
              playChime();
              openModal("admin_login");
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full backdrop-blur-xl border shadow-lg text-xs font-semibold transition-all active:scale-95 cursor-pointer ${
              isOwner
                ? "bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 border-amber-300 shadow-amber-500/20 font-bold"
                : "bg-slate-950/60 hover:bg-slate-900/90 text-slate-200 border-white/10"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{isOwner ? "👑 Creator" : "Owner"}</span>
          </button>
        </div>
      </div>

      {/* Bottom Floating Island Row */}
      <div className="flex items-end justify-between gap-4">
        {/* Bottom-Left: Subtle Tactile Keyboard Hint */}
        <div className="hidden md:flex flex-col gap-1.5 px-3.5 py-2.5 rounded-2xl bg-slate-950/50 backdrop-blur-xl border border-white/5 text-[11px] text-slate-300 shadow-xl pointer-events-auto">
          <div className="flex items-center gap-1.5">
            <span className="px-1.5 py-0.5 rounded bg-white/10 border border-white/10 font-mono text-[10px] text-slate-100 shadow-sm">W</span>
            <span className="px-1.5 py-0.5 rounded bg-white/10 border border-white/10 font-mono text-[10px] text-slate-100 shadow-sm">A</span>
            <span className="px-1.5 py-0.5 rounded bg-white/10 border border-white/10 font-mono text-[10px] text-slate-100 shadow-sm">S</span>
            <span className="px-1.5 py-0.5 rounded bg-white/10 border border-white/10 font-mono text-[10px] text-slate-100 shadow-sm">D</span>
            <span className="text-slate-400 ml-0.5">Move</span>
            <span className="mx-1 text-slate-600">•</span>
            <span className="px-1.5 py-0.5 rounded bg-white/10 border border-white/10 font-mono text-[10px] text-slate-100 shadow-sm">Shift</span>
            <span className="text-slate-400">Run</span>
            <span className="mx-1 text-slate-600">•</span>
            <span className="px-1.5 py-0.5 rounded bg-white/10 border border-white/10 font-mono text-[10px] text-slate-100 shadow-sm">Space</span>
            <span className="text-slate-400">Jump</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <span className="px-1.5 py-0.5 rounded bg-white/10 border border-white/10 font-mono text-[10px] text-slate-100 shadow-sm">E</span>
            <span>Inspect</span>
            <span className="mx-1 text-slate-600">•</span>
            <span className="px-1.5 py-0.5 rounded bg-white/10 border border-white/10 font-mono text-[10px] text-slate-100 shadow-sm">Enter</span>
            <span>Chat Invite</span>
            <span className="mx-1 text-slate-600">•</span>
            <span className="text-slate-500">Drag mouse to orbit</span>
          </div>
        </div>

        {/* Bottom-Right: Floating Game Dock (Emotes, Avatar, Map) */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Emotes Pill */}
          <div className="flex items-center gap-1 p-1 rounded-full bg-slate-950/60 backdrop-blur-xl border border-white/10 shadow-lg">
            <button
              onClick={() => sendEmote("wave")}
              className="px-3 py-1.5 rounded-full text-xs font-medium text-slate-200 hover:bg-white/10 transition-colors flex items-center gap-1"
              title="Wave (Key 1)"
            >
              <span>👋</span>
              <span className="hidden sm:inline">Wave</span>
            </button>
            <button
              onClick={() => sendEmote("dance")}
              className="px-3 py-1.5 rounded-full text-xs font-medium text-slate-200 hover:bg-white/10 transition-colors flex items-center gap-1"
              title="Dance (Key 2)"
            >
              <span>🕺</span>
              <span className="hidden sm:inline">Dance</span>
            </button>
            <button
              onClick={() => sendEmote("sit")}
              className="px-3 py-1.5 rounded-full text-xs font-medium text-slate-200 hover:bg-white/10 transition-colors flex items-center gap-1"
              title="Sit (Key 3)"
            >
              <span>🪑</span>
              <span className="hidden sm:inline">Sit</span>
            </button>
          </div>

          {/* Avatar Customizer Button */}
          <button
            onClick={() => {
              playChime();
              openModal("customizer");
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-slate-950/60 hover:bg-slate-900/90 backdrop-blur-xl border border-white/10 shadow-lg text-slate-200 text-xs font-semibold cursor-pointer transition-all active:scale-95"
            title="Customize Character"
          >
            <Palette className="w-3.5 h-3.5 text-pink-400" />
            <span className="hidden sm:inline">Avatar</span>
          </button>

          {/* Illustrated Map Button */}
          <button
            onClick={() => {
              playChime();
              openModal("map");
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/20 cursor-pointer transition-all active:scale-95"
            title="Open World Map"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Map</span>
          </button>
        </div>
      </div>
    </div>
  );
};
