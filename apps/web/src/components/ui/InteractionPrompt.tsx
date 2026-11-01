"use client";

import React from "react";
import { useGameStore } from "@/stores/useGameStore";
import { Sparkles } from "lucide-react";

export const InteractionPrompt: React.FC = () => {
  const interactionTarget = useGameStore((s) => s.interactionTarget);

  if (!interactionTarget) return null;

  return (
    <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-30 pointer-events-none animate-float">
      <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-950/75 backdrop-blur-xl border border-amber-400/30 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.5),0_0_15px_rgba(245,158,11,0.2)] text-amber-100">
        <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-gradient-to-b from-amber-400 to-amber-600 text-slate-950 font-mono font-black text-xs shadow-md border border-amber-300/40">
          E
        </span>
        <span className="text-xs sm:text-sm font-semibold tracking-wide text-amber-50 drop-shadow">
          {interactionTarget.promptText}
        </span>
        <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse ml-0.5" />
      </div>
    </div>
  );
};
