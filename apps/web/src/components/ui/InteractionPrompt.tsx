"use client";

import React from "react";
import { useGameStore } from "@/stores/useGameStore";

export const InteractionPrompt: React.FC = () => {
  const interactionTarget = useGameStore((s) => s.interactionTarget);

  if (!interactionTarget) return null;

  return (
    <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-30 pointer-events-none animate-bounce">
      <div className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-amber-500/60 shadow-2xl text-amber-100">
        <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-amber-500 text-slate-950 font-mono font-black text-xs shadow-inner">
          E
        </span>
        <span className="text-sm font-semibold tracking-wide drop-shadow">
          {interactionTarget.promptText}
        </span>
      </div>
    </div>
  );
};

