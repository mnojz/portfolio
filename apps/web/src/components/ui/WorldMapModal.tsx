"use client";

import React from "react";
import { X, MapPin } from "lucide-react";
import { useGameStore } from "@/stores/useGameStore";

export const WorldMapModal: React.FC = () => {
  const activeModal = useGameStore((s) => s.activeModal);
  const closeModal = useGameStore((s) => s.closeModal);
  const currentLocationName = useGameStore((s) => s.currentLocationName);

  if (activeModal !== "map") return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fade-in font-sans">
      <div className="relative w-full max-w-xl rounded-3xl bg-[#FAF7F2] text-slate-800 border border-stone-300 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] p-6 space-y-4 animate-modal-pop">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-200">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🗺️</span>
            <div>
              <h2 className="text-lg font-serif font-bold text-amber-950">Cartography of Mosswood</h2>
              <p className="text-xs text-amber-800/80">Interactive Countryside Survey</p>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="p-1.5 rounded-full hover:bg-stone-200 text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Illustrated Map Canvas */}
        <div className="relative aspect-[4/3] rounded-2xl bg-[#E8DCBA] border border-amber-800/20 p-4 shadow-inner overflow-hidden select-none">
          {/* Compass Rose */}
          <div className="absolute top-3 right-3 text-amber-950/35 font-serif font-bold text-xs text-center select-none">
            ▲ N<br />W + E<br />▼ S
          </div>

          {/* Dirt Pathways (SVG lines) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
            {/* Center crossroad to North (Lookout) */}
            <path d="M 50 60 Q 50 40 50 18" stroke="#B8976C" strokeWidth="3" fill="none" strokeDasharray="2,2" />
            {/* To West (Home) */}
            <path d="M 50 60 Q 35 60 25 50" stroke="#B8976C" strokeWidth="3" fill="none" strokeDasharray="2,2" />
            {/* To East (Workshop) */}
            <path d="M 50 60 Q 65 60 75 50" stroke="#B8976C" strokeWidth="3" fill="none" strokeDasharray="2,2" />
            {/* To South-West (Library) */}
            <path d="M 50 60 Q 35 75 25 80" stroke="#B8976C" strokeWidth="3" fill="none" strokeDasharray="2,2" />
            {/* To South-East (Pond) */}
            <path d="M 50 60 Q 65 75 75 80" stroke="#B8976C" strokeWidth="3" fill="none" strokeDasharray="2,2" />
            {/* Pond Water Silhouette */}
            <circle cx="75" cy="80" r="11" fill="#7DD3FC" opacity="0.65" />
          </svg>

          {/* 1. The Lookout */}
          <div className="absolute top-[12%] left-[50%] -translate-x-1/2 flex flex-col items-center">
            <span className="text-base drop-shadow">🏔️</span>
            <span className="text-[10px] font-bold font-serif text-amber-950 bg-white/90 backdrop-blur px-2 py-0.5 rounded-full shadow-sm border border-stone-200">
              The Lookout
            </span>
          </div>

          {/* 2. The Post Office */}
          <div className="absolute top-[32%] left-[48%] -translate-x-1/2 flex flex-col items-center">
            <span className="text-base drop-shadow">✉️</span>
            <span className="text-[10px] font-bold font-serif text-amber-950 bg-white/90 backdrop-blur px-2 py-0.5 rounded-full shadow-sm border border-stone-200">
              Post Office
            </span>
          </div>

          {/* 3. The Home */}
          <div className="absolute top-[44%] left-[22%] -translate-x-1/2 flex flex-col items-center">
            <span className="text-base drop-shadow">🏡</span>
            <span className="text-[10px] font-bold font-serif text-amber-950 bg-white/90 backdrop-blur px-2 py-0.5 rounded-full shadow-sm border border-stone-200">
              The Home
            </span>
          </div>

          {/* 4. The Workshop */}
          <div className="absolute top-[44%] left-[76%] -translate-x-1/2 flex flex-col items-center">
            <span className="text-base drop-shadow">⚙️</span>
            <span className="text-[10px] font-bold font-serif text-amber-950 bg-white/90 backdrop-blur px-2 py-0.5 rounded-full shadow-sm border border-stone-200">
              The Workshop
            </span>
          </div>

          {/* 5. The Library */}
          <div className="absolute top-[75%] left-[24%] -translate-x-1/2 flex flex-col items-center">
            <span className="text-base drop-shadow">📚</span>
            <span className="text-[10px] font-bold font-serif text-amber-950 bg-white/90 backdrop-blur px-2 py-0.5 rounded-full shadow-sm border border-stone-200">
              The Library
            </span>
          </div>

          {/* 6. The Pond */}
          <div className="absolute top-[75%] left-[75%] -translate-x-1/2 flex flex-col items-center">
            <span className="text-base drop-shadow">🎣</span>
            <span className="text-[10px] font-bold font-serif text-amber-950 bg-white/90 backdrop-blur px-2 py-0.5 rounded-full shadow-sm border border-stone-200">
              The Pond
            </span>
          </div>

          {/* Crossroads / Player Position */}
          <div className="absolute top-[57%] left-[50%] -translate-x-1/2 flex flex-col items-center">
            <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 animate-ping absolute" />
            <div className="w-3.5 h-3.5 rounded-full bg-emerald-600 border-2 border-white shadow-md" />
            <span className="text-[9px] font-bold text-emerald-950 mt-1 bg-white/80 px-1.5 py-0.5 rounded">
              You are here
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between text-xs text-stone-600 pt-1">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>Nearby landmark: <strong className="text-stone-900">{currentLocationName}</strong></span>
          </div>
          <span className="text-[11px] text-stone-400">Esc to close</span>
        </div>
      </div>
    </div>
  );
};
