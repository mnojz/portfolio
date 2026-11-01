"use client";

import React from "react";
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";

export const MobileJoystick: React.FC = () => {
  const triggerKey = (code: string, down: boolean) => {
    window.dispatchEvent(
      new KeyboardEvent(down ? "keydown" : "keyup", {
        code,
        bubbles: true,
      })
    );
  };

  return (
    <div className="md:hidden fixed bottom-6 left-6 z-40 pointer-events-auto flex flex-col items-center select-none">
      <button
        onPointerDown={() => triggerKey("KeyW", true)}
        onPointerUp={() => triggerKey("KeyW", false)}
        className="w-12 h-12 rounded-2xl bg-slate-900/80 active:bg-amber-500 border border-slate-700 flex items-center justify-center text-white shadow-xl touch-none mb-1"
      >
        <ArrowUp className="w-5 h-5" />
      </button>

      <div className="flex gap-1">
        <button
          onPointerDown={() => triggerKey("KeyA", true)}
          onPointerUp={() => triggerKey("KeyA", false)}
          className="w-12 h-12 rounded-2xl bg-slate-900/80 active:bg-amber-500 border border-slate-700 flex items-center justify-center text-white shadow-xl touch-none"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <button
          onPointerDown={() => triggerKey("KeyS", true)}
          onPointerUp={() => triggerKey("KeyS", false)}
          className="w-12 h-12 rounded-2xl bg-slate-900/80 active:bg-amber-500 border border-slate-700 flex items-center justify-center text-white shadow-xl touch-none"
        >
          <ArrowDown className="w-5 h-5" />
        </button>

        <button
          onPointerDown={() => triggerKey("KeyD", true)}
          onPointerUp={() => triggerKey("KeyD", false)}
          className="w-12 h-12 rounded-2xl bg-slate-900/80 active:bg-amber-500 border border-slate-700 flex items-center justify-center text-white shadow-xl touch-none"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

