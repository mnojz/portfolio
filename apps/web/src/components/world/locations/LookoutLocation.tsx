"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import { useGameStore } from "@/stores/useGameStore";
import { useAudioStore } from "@/stores/useAudioStore";

export const LookoutLocation: React.FC = () => {
  const flagRef = useRef<THREE.Mesh>(null);
  const trophyRef = useRef<THREE.Group>(null);
  const openModal = useGameStore((s) => s.openModal);
  const playChime = useAudioStore((s) => s.playChime);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    // Fluttering milestone flag
    if (flagRef.current) {
      flagRef.current.rotation.y = Math.sin(time * 3) * 0.15;
    }
    // Rotating golden trophy
    if (trophyRef.current) {
      trophyRef.current.rotation.y = time * 0.8;
    }
  });

  return (
    <group position={[0, 3.5, -35]}>
      {/* Stone Lookout Citadel Platform */}
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[4.2, 4.6, 0.8, 12]} />
        <meshStandardMaterial color="#475569" roughness={0.9} flatShading />
      </mesh>

      {/* Stone Battlement Rim */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * Math.PI) / 6;
        const x = Math.cos(angle) * 4.0;
        const z = Math.sin(angle) * 4.0;
        return (
          <mesh key={`crenel_${i}`} position={[x, 1.1, z]} castShadow>
            <boxGeometry args={[0.7, 0.6, 0.3]} />
            <meshStandardMaterial color="#334155" roughness={0.9} />
          </mesh>
        );
      })}

      {/* Brass Telescope on Tripod */}
      <group position={[1.8, 0.8, 2.2]} rotation={[0, -0.4, 0]}>
        {/* Tripod Legs */}
        {[-0.2, 0.2].map((tx) =>
          [-0.2, 0.2].map((tz, idx) => (
            <mesh key={`tripod_${tx}_${idx}`} position={[tx, 0.4, tz]} castShadow>
              <cylinderGeometry args={[0.02, 0.03, 0.8, 4]} />
              <meshStandardMaterial color="#334155" />
            </mesh>
          ))
        )}
        {/* Telescope Barrel */}
        <mesh position={[0, 0.9, 0]} rotation={[0.3, 0, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.14, 0.9, 8]} />
          <meshStandardMaterial color="#F59E0B" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>

      {/* Golden Milestone Trophy Pedestal */}
      <group position={[-1.8, 0.8, 2.2]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.35, 0.45, 0.7, 8]} />
          <meshStandardMaterial color="#1E293B" />
        </mesh>
        {/* Rotating Trophy */}
        <group ref={trophyRef} position={[0, 0.65, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.2, 0.1, 0.35, 8]} />
            <meshStandardMaterial color="#FBBF24" metalness={0.8} roughness={0.2} />
          </mesh>
          <pointLight color="#FDE047" intensity={0.9} distance={3} />
        </group>
      </group>

      {/* Tall Milestone Flagpole */}
      <group position={[0, 0.8, -2.5]}>
        <mesh position={[0, 2.5, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.08, 5.0, 6]} />
          <meshStandardMaterial color="#94A3B8" metalness={0.6} />
        </mesh>
        {/* Flag */}
        <mesh ref={flagRef} position={[0.7, 4.4, 0]} castShadow>
          <boxGeometry args={[1.4, 0.8, 0.02]} />
          <meshStandardMaterial color="#DC2626" roughness={0.6} />
        </mesh>
      </group>

      {/* Overhead Header Badge */}
      <Html position={[0, 3.2, 0]} center distanceFactor={8}>
        <div className="flex flex-col items-center pointer-events-none select-none">
          <div className="px-2.5 py-1 rounded-md text-[11px] font-bold shadow-md border backdrop-blur-md bg-amber-950/90 text-amber-200 border-amber-400">
            🏔️ The Lookout
          </div>
          <div className="text-[9px] text-slate-800 bg-white/80 px-1.5 py-0.5 rounded shadow mt-0.5 font-medium">
            Journey & Achievements • Press E
          </div>
        </div>
      </Html>

      {/* Inspect Button */}
      <Html position={[0, 1.6, 2.2]} center distanceFactor={6}>
        <button
          onClick={() => {
            playChime();
            openModal("lookout");
          }}
          className="px-2.5 py-1 rounded bg-amber-900/90 hover:bg-amber-800 border border-amber-300 text-amber-100 text-[10px] font-bold shadow-lg transition-transform hover:scale-105 active:scale-95 whitespace-nowrap cursor-pointer pointer-events-auto"
        >
          🏆 View Achievements & Roadmap
        </button>
      </Html>
    </group>
  );
};

