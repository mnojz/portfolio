"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import { useGameStore } from "@/stores/useGameStore";
import { useAudioStore } from "@/stores/useAudioStore";

export const LibraryLocation: React.FC = () => {
  const floatingBookRef = useRef<THREE.Group>(null);
  const openModal = useGameStore((s) => s.openModal);
  const playChime = useAudioStore((s) => s.playChime);

  useFrame((state) => {
    // Floating enchanted scroll/book bobbing
    if (floatingBookRef.current) {
      const time = state.clock.getElapsedTime();
      floatingBookRef.current.position.y = 1.6 + Math.sin(time * 2) * 0.1;
      floatingBookRef.current.rotation.y = time * 0.6;
    }
  });

  return (
    <group position={[-20, 0, 16]}>
      {/* Stone Foundation & Steps */}
      <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[7.5, 0.4, 6.5]} />
        <meshStandardMaterial color="#64748B" roughness={0.9} flatShading />
      </mesh>

      {/* Classical Stone Pillars */}
      {[-3.0, 3.0].map((px) =>
        [-2.5, 2.5].map((pz, idx) => (
          <mesh key={`pillar_${px}_${idx}`} position={[px, 2.2, pz]} castShadow>
            <cylinderGeometry args={[0.35, 0.45, 3.6, 8]} />
            <meshStandardMaterial color="#E2E8F0" roughness={0.8} />
          </mesh>
        ))
      )}

      {/* Library Archway Roof */}
      <mesh position={[0, 4.4, 0]} castShadow>
        <boxGeometry args={[7.8, 0.8, 6.8]} />
        <meshStandardMaterial color="#334155" roughness={0.8} flatShading />
      </mesh>
      <mesh position={[0, 5.2, 0]} castShadow>
        <coneGeometry args={[4.5, 1.8, 4]} />
        <meshStandardMaterial color="#1E293B" roughness={0.7} flatShading />
      </mesh>

      {/* Bookshelves along back wall */}
      <mesh position={[0, 2.0, -2.4]} castShadow receiveShadow>
        <boxGeometry args={[5.2, 3.2, 0.8]} />
        <meshStandardMaterial color="#451A03" roughness={0.85} />
      </mesh>
      {/* Colorful Books on Shelves */}
      {[-1.8, -0.6, 0.6, 1.8].map((bx, i) => (
        <mesh key={`books_${i}`} position={[bx, 2.2, -1.9]}>
          <boxGeometry args={[0.9, 0.8, 0.3]} />
          <meshStandardMaterial
            color={["#DC2626", "#2563EB", "#16A34A", "#9333EA"][i]}
            roughness={0.7}
          />
        </mesh>
      ))}

      {/* Central Knowledge Podium */}
      <group position={[0, 0.4, 0]}>
        <mesh position={[0, 0.5, 0]} castShadow>
          <cylinderGeometry args={[0.45, 0.55, 1.0, 8]} />
          <meshStandardMaterial color="#475569" />
        </mesh>

        {/* Floating Glowing Tome / Knowledge Orb */}
        <group ref={floatingBookRef} position={[0, 1.6, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.6, 0.15, 0.45]} />
            <meshStandardMaterial
              color="#A855F7"
              emissive="#7E22CE"
              emissiveIntensity={0.6}
              roughness={0.3}
            />
          </mesh>
          <pointLight color="#A855F7" intensity={1.5} distance={4} />
        </group>
      </group>

      {/* Library Title Header */}
      <Html position={[0, 3.4, 2.8]} center distanceFactor={8}>
        <div className="flex flex-col items-center pointer-events-none select-none">
          <div className="px-2.5 py-1 rounded-md text-[11px] font-bold shadow-md border backdrop-blur-md bg-purple-950/90 text-purple-200 border-purple-400">
            📚 The Library
          </div>
          <div className="text-[9px] text-slate-800 bg-white/80 px-1.5 py-0.5 rounded shadow mt-0.5 font-medium">
            Tech Stack & Knowledge • Press E
          </div>
        </div>
      </Html>

      {/* Interactive Podium Button */}
      <Html position={[0, 1.9, 0]} center distanceFactor={6}>
        <button
          onClick={() => {
            playChime();
            openModal("library");
          }}
          className="px-2.5 py-1 rounded bg-purple-900/90 hover:bg-purple-800 border border-purple-300 text-purple-100 text-[10px] font-bold shadow-lg transition-transform hover:scale-105 active:scale-95 whitespace-nowrap cursor-pointer pointer-events-auto"
        >
          📖 Inspect Tech Stack
        </button>
      </Html>
    </group>
  );
};

