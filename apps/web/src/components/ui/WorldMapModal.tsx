"use client";

import React from "react";
import { X, MapPin } from "lucide-react";
import { useGameStore } from "@/stores/useGameStore";
import { LOCATIONS } from "@mosswood/shared";

export const WorldMapModal: React.FC = () => {
  const activeModal = useGameStore((s) => s.activeModal);
  const closeModal = useGameStore((s) => s.closeModal);
  const currentLocationName = useGameStore((s) => s.currentLocationName);

  if (activeModal !== "map") return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl rounded-3xl bg-amber-50 text-slate-900 border-4 border-amber-800 shadow-2xl p-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-amber-700/30">
          <div className="flex items-center gap-2">
            <span className="text-xl">🗺️</span>
            <div>
              <h2 className="text-lg font-serif font-black text-amber-950">Map of Mosswood</h2>
              <p className="text-xs text-amber-800">Peaceful Countryside Hamlet</p>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="p-1.5 rounded-full hover:bg-amber-200 text-amber-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Illustrated Map Canvas */}
        <div className="relative my-4 aspect-[4/3] rounded-2xl bg-[#DBC094] border-2 border-amber-700/50 p-4 shadow-inner overflow-hidden select-none">
          {/* Compass Rose */}
          <div className="absolute top-3 right-3 text-amber-950/40 font-serif font-bold text-xs text-center">
            ▲ N<br />W + E<br />▼ S
          </div>

          {/* Dirt Pathways (SVG lines) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
            {/* Center crossroad to North (Lookout) */}
            <path d="M 50 60 Q 50 40 50 18" stroke="#A67C52" strokeWidth="3" fill="none" strokeDasharray="2,2" />
            {/* To West (Home) */}
            <path d="M 50 60 Q 35 60 25 50" stroke="#A67C52" strokeWidth="3" fill="none" strokeDasharray="2,2" />
            {/* To East (Workshop) */}
            <path d="M 50 60 Q 65 60 75 50" stroke="#A67C52" strokeWidth="3" fill="none" strokeDasharray="2,2" />
            {/* To South-West (Library) */}
            <path d="M 50 60 Q 35 75 25 80" stroke="#A67C52" strokeWidth="3" fill="none" strokeDasharray="2,2" />
            {/* To South-East (Pond) */}
            <path d="M 50 60 Q 65 75 75 80" stroke="#A67C52" strokeWidth="3" fill="none" strokeDasharray="2,2" />
            {/* Pond Water Silhouette */}
            <circle cx="75" cy="80" r="11" fill="#7DD3FC" opacity="0.6" />
          </svg>

          {/* Location Badges Placed on Map */}
          {/* 1. The Lookout (North peak) */}
          <div className="absolute top-[12%] left-[50%] -translate-x-1/2 flex flex-col items-center">
            <span className="text-base">🏔️</span>
            <span className="text-[10px] font-bold font-serif text-amber-950 bg-amber-100/90 px-1.5 py-0.5 rounded shadow">
              The Lookout
            </span>
          </div>

          {/* 2. The Post Office (North Center) */}
          <div className="absolute top-[32%] left-[48%] -translate-x-1/2 flex flex-col items-center">
            <span className="text-base">✉️</span>
            <span className="text-[10px] font-bold font-serif text-amber-950 bg-amber-100/90 px-1.5 py-0.5 rounded shadow">
              Post Office
            </span>
          </div>

          {/* 3. The Home (West) */}
          <div className="absolute top-[44%] left-[22%] -translate-x-1/2 flex flex-col items-center">
            <span className="text-base">🏡</span>
            <span className="text-[10px] font-bold font-serif text-amber-950 bg-amber-100/90 px-1.5 py-0.5 rounded shadow">
              The Home
            </span>
          </div>

          {/* 4. The Workshop (East) */}
          <div className="absolute top-[44%] left-[76%] -translate-x-1/2 flex flex-col items-center">
            <span className="text-base">⚙️</span>
            <span className="text-[10px] font-bold font-serif text-amber-950 bg-amber-100/90 px-1.5 py-0.5 rounded shadow">
              The Workshop
            </span>
          </div>

          {/* 5. The Library (South-West) */}
          <div className="absolute top-[75%] left-[24%] -translate-x-1/2 flex flex-col items-center">
            <span className="text-base">📚</span>
            <span className="text-[10px] font-bold font-serif text-amber-950 bg-amber-100/90 px-1.5 py-0.5 rounded shadow">
              The Library
            </span>
          </div>

          {/* 6. The Pond (South-East) */}
          <div className="absolute top-[75%] left-[75%] -translate-x-1/2 flex flex-col items-center">
            <span className="text-base">🎣</span>
            <span className="text-[10px] font-bold font-serif text-amber-950 bg-amber-100/90 px-1.5 py-0.5 rounded shadow">
              The Pond
            </span>
          </div>

          {/* Entrance / Crossroads */}
          <div className="absolute top-[57%] left-[50%] -translate-x-1/2 flex flex-col items-center">
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping absolute" />
            <div className="w-3 h-3 rounded-full bg-emerald-600 border border-white shadow" />
            <span className="text-[9px] font-bold text-emerald-950 mt-1">Crossroads</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between text-xs text-amber-900 pt-1">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-emerald-700" />
            <span>Currently exploring: <strong>{currentLocationName}</strong></span>
          </div>
          <span className="text-[11px] text-amber-700 italic">Press Esc to close</span>
        </div>
      </div>
    </div>
  );
};

