"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { HUD } from "@/components/ui/HUD";
import { InteractionPrompt } from "@/components/ui/InteractionPrompt";
import { ProximityChat } from "@/components/ui/ProximityChat";
import { InspectionModal } from "@/components/ui/InspectionModal";
import { WorldMapModal } from "@/components/ui/WorldMapModal";
import { CharacterCustomizer } from "@/components/ui/CharacterCustomizer";
import { AdminAuthModal } from "@/components/ui/AdminAuthModal";
import { ClassicPortfolio } from "@/components/ui/ClassicPortfolio";
import { MobileJoystick } from "@/components/ui/MobileJoystick";
import { useGameStore } from "@/stores/useGameStore";
import { useMultiplayerStore } from "@/stores/useMultiplayerStore";

// Dynamically import WorldCanvas to disable SSR for WebGL Three.js
const WorldCanvas = dynamic(
  () => import("@/components/world/WorldCanvas").then((mod) => mod.WorldCanvas),
  { ssr: false }
);

export default function Home() {
  const viewMode = useGameStore((s) => s.viewMode);
  const initConnection = useMultiplayerStore((s) => s.initConnection);

  const [loading, setLoading] = useState(true);
  const [webGLSupported, setWebGLSupported] = useState(true);

  useEffect(() => {
    // Check WebGL Support
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) {
        setWebGLSupported(false);
      }
    } catch (e) {
      setWebGLSupported(false);
    }

    // Connect to multiplayer server
    initConnection();

    // Short atmospheric loading screen
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1800);

    return () => clearTimeout(timer);
  }, [initConnection]);

  // If recruiter/user selects Classic or WebGL unsupported, show Classic CV
  if (viewMode === "classic" || !webGLSupported) {
    return <ClassicPortfolio />;
  }

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-slate-950">
      {/* 3D R3F World Canvas */}
      <WorldCanvas />

      {/* Atmospheric Loading Screen */}
      {loading && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-slate-100 transition-opacity duration-700">
          <div className="flex flex-col items-center gap-4 animate-pulse">
            <span className="text-5xl">🌲</span>
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl font-serif font-black tracking-widest text-amber-200 uppercase">
                Mosswood
              </h1>
              <p className="text-xs sm:text-sm text-amber-400/80 font-medium mt-1">
                A Little World About Manoj
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono mt-4">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Spawning countryside and synchronizing visitors...</span>
            </div>
          </div>
        </div>
      )}

      {/* Heads-Up Display (HUD) */}
      <HUD />

      {/* Contextual Interaction Prompt (Press E) */}
      <InteractionPrompt />

      {/* Proximity Chat & Consent Invitation Panel */}
      <ProximityChat />

      {/* Content Inspection Modal (The Home, Workshop, Pond, Library, Post Office, Lookout) */}
      <InspectionModal />

      {/* Illustrated World Map */}
      <WorldMapModal />

      {/* Character Customizer Modal */}
      <CharacterCustomizer />

      {/* Creator / Owner Admin Modal */}
      <AdminAuthModal />

      {/* Mobile Touch Screen Virtual Joystick */}
      <MobileJoystick />
    </main>
  );
}

