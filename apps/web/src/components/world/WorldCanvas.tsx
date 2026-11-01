"use client";

import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { WorldScene } from "./WorldScene";
import { useGameStore } from "@/stores/useGameStore";

export const WorldCanvas: React.FC = () => {
  const graphicsQuality = useGameStore((s) => s.graphicsQuality);
  const shadowsEnabled = graphicsQuality !== "low";

  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing select-none bg-gradient-to-b from-[#87CEEB] to-[#C8E6C9]">
      <Canvas
        shadows={shadowsEnabled}
        camera={{ position: [0, 8, 18], fov: 46, near: 0.1, far: 200 }}
        gl={{
          antialias: graphicsQuality === "high",
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
        }}
        onCreated={({ gl }) => {
          if (shadowsEnabled) {
            gl.shadowMap.type = THREE.PCFSoftShadowMap;
          }
        }}
      >
        <Suspense fallback={null}>
          <WorldScene />
        </Suspense>
      </Canvas>
    </div>
  );
};
