"use client";

import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { WorldScene } from "./WorldScene";
import { useGameStore } from "@/stores/useGameStore";

export const WorldCanvas: React.FC = () => {
  const graphicsQuality = useGameStore((s) => s.graphicsQuality);
  const shadowsEnabled = graphicsQuality !== "low";

  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing select-none">
      <Canvas
        shadows={shadowsEnabled}
        camera={{ position: [0, 8, 19], fov: 50, near: 0.1, far: 200 }}
        gl={{
          antialias: graphicsQuality === "high",
          powerPreference: "high-performance",
        }}
      >
        <Suspense fallback={null}>
          <WorldScene />
        </Suspense>
      </Canvas>
    </div>
  );
};

