"use client";

import React from "react";
import {
  Compass,
  Users,
  Volume2,
  VolumeX,
  MapPin,
  Palette,
  Sparkles,
  ShieldCheck,
  Sun,
  Moon,
  FileText,
  Gamepad2,
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
    <div className="absolute inset-0 pointer-events-none z-30 flex flex-col justify-between p-4 sm:p-6 overflow-hidden">
      {/* Top Header Row */}
      <div className="flex items-center justify-between gap-4">
        {/* Top-Left: World Title, Current Location, & 3D / Classic Toggle */}
        <div className="flex flex-wrap items-center gap-2.5 pointer-events-auto">
          {/* Logo Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/85 backdrop-blur-md border border-amber-600/40 shadow-lg text-amber-100">
            <span className="text-base">🌲</span>
            <div>
              <div className="text-xs font-bold tracking-wider uppercase">Mosswood</div>
              <div className="text-[10px] text-amber-300/80 font-medium leading-none">Manoj&apos;s 3D World</div>
            </div>
          </div>

          {/* Current Location Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/85 backdrop-blur-md border border-slate-700/60 shadow-lg text-slate-200 text-xs font-semibold">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>{currentLocationName || "Peaceful Meadows"}</span>
          </div>

          {/* 3D World ⇄ Classic Portfolio Toggle Switch */}
          <div className="flex items-center p-0.5 rounded-xl bg-slate-900/85 backdrop-blur-md border border-slate-700/80 shadow-lg">
            <button
              onClick={() => {
                playChime();
                setViewMode("3d");
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                viewMode === "3d"
                  ? "bg-amber-500 text-slate-950 font-bold shadow"
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
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                viewMode === "classic"
                  ? "bg-amber-500 text-slate-950 font-bold shadow"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Classic CV</span>
            </button>
          </div>
        </div>

        {/* Top-Right: Visitors, Clock, Audio & Admin */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Online Visitors Counter */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/85 backdrop-blur-md border border-slate-700/80 shadow-lg text-slate-200 text-xs font-medium">
            <Users className="w-3.5 h-3.5 text-sky-400" />
            <span>
              {onlineCount} {onlineCount === 1 ? "visitor" : "visitors"}
            </span>
            <span
              className={`w-2 h-2 rounded-full ${
                isConnected ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
              }`}
            />
          </div>

          {/* Dynamic Day/Night Clock */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900/85 backdrop-blur-md border border-slate-700/80 shadow-lg text-slate-300 text-xs font-mono">
            {isNight ? (
              <Moon className="w-3.5 h-3.5 text-amber-300" />
            ) : (
              <Sun className="w-3.5 h-3.5 text-amber-400" />
            )}
            <span>{timeString}</span>
          </div>

          {/* Audio Mute/Unmute */}
          <button
            onClick={() => {
              toggleMute();
            }}
            className="p-2 rounded-xl bg-slate-900/85 hover:bg-slate-800 backdrop-blur-md border border-slate-700/80 shadow-lg text-slate-300 hover:text-amber-300 transition-colors cursor-pointer"
            title={isMuted ? "Unmute Audio" : "Mute Audio"}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* Admin / Owner Login Button */}
          <button
            onClick={() => {
              playChime();
              openModal("admin_login");
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl backdrop-blur-md border shadow-lg text-xs font-semibold transition-transform active:scale-95 cursor-pointer ${
              isOwner
                ? "bg-amber-500/90 hover:bg-amber-400 border-amber-300 text-slate-950 font-bold"
                : "bg-slate-900/85 hover:bg-slate-800 border-slate-700/80 text-slate-300"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{isOwner ? "👑 Creator" : "Owner Login"}</span>
          </button>
        </div>
      </div>

      {/* Bottom Bar Row */}
      <div className="flex items-end justify-between gap-4">
        {/* Bottom-Left: Keyboard Controls Hint */}
        <div className="hidden md:flex flex-col gap-1 p-2.5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-800 text-[11px] text-slate-300 shadow-xl pointer-events-auto">
          <div className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[10px]">W</kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[10px]">A</kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[10px]">S</kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[10px]">D</kbd>
            <span className="text-slate-400">Move</span>
            <span className="mx-1 text-slate-600">•</span>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[10px]">Shift</kbd>
            <span className="text-slate-400">Run</span>
            <span className="mx-1 text-slate-600">•</span>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[10px]">Space</kbd>
            <span className="text-slate-400">Jump</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[10px]">E</kbd>
            <span>Interact</span>
            <span className="mx-1 text-slate-600">•</span>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[10px]">Enter</kbd>
            <span>Chat Invite</span>
            <span className="mx-1 text-slate-600">•</span>
            <span>Drag mouse to orbit camera</span>
          </div>
        </div>

        {/* Bottom-Right: Emotes, Character Customizer, & Map */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Emotes Bar */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900/85 backdrop-blur-md border border-slate-700/80 shadow-lg">
            <button
              onClick={() => sendEmote("wave")}
              className="px-2.5 py-1 rounded-lg text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-amber-300 transition-colors"
              title="Wave (Key 1)"
            >
              👋 Wave
            </button>
            <button
              onClick={() => sendEmote("dance")}
              className="px-2.5 py-1 rounded-lg text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-amber-300 transition-colors"
              title="Dance (Key 2)"
            >
              🕺 Dance
            </button>
            <button
              onClick={() => sendEmote("sit")}
              className="px-2.5 py-1 rounded-lg text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-amber-300 transition-colors"
              title="Sit (Key 3)"
            >
              🪑 Sit
            </button>
          </div>

          {/* Character Customizer Button */}
          <button
            onClick={() => {
              playChime();
              openModal("customizer");
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/85 hover:bg-slate-800 backdrop-blur-md border border-slate-700/80 shadow-lg text-slate-200 text-xs font-semibold cursor-pointer"
            title="Customize Character"
          >
            <Palette className="w-4 h-4 text-pink-400" />
            <span className="hidden sm:inline">Avatar</span>
          </button>

          {/* Illustrated Map Button */}
          <button
            onClick={() => {
              playChime();
              openModal("map");
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 backdrop-blur-md border border-amber-400 shadow-lg text-slate-950 text-xs font-bold cursor-pointer transition-transform active:scale-95"
            title="Open World Map"
          >
            <Compass className="w-4 h-4" />
            <span>Map</span>
          </button>
        </div>
      </div>
    </div>
  );
};

