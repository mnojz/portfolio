"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import { useGameStore } from "@/stores/useGameStore";
import { useAudioStore } from "@/stores/useAudioStore";

export const PondLocation: React.FC = () => {
  const gramophoneHornRef = useRef<THREE.Group>(null);
  const openModal = useGameStore((s) => s.openModal);
  const playChime = useAudioStore((s) => s.playChime);

  useFrame((state) => {
    // Gentle gentle wobble of vinyl/horn
    if (gramophoneHornRef.current) {
      gramophoneHornRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 2) * 0.1;
    }
  });

  return (
    <group position={[16, 0, 18]}>
      {/* Location Overhead Badge */}
      <Html position={[-3.5, 2.5, -2]} center distanceFactor={8}>
        <div className="flex flex-col items-center pointer-events-none select-none">
          <div className="px-2.5 py-1 rounded-md text-[11px] font-bold shadow-md border backdrop-blur-md bg-sky-950/90 text-sky-200 border-sky-400">
            🎣 The Pond
          </div>
          <div className="text-[9px] text-slate-800 bg-white/80 px-1.5 py-0.5 rounded shadow mt-0.5 font-medium">
            Personal Side • Press E
          </div>
        </div>
      </Html>

      {/* Rest Bench on Shore */}
      <group position={[-5.2, 0, 0]} rotation={[0, 0.4, 0]}>
        {/* Seat */}
        <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.0, 0.1, 0.6]} />
          <meshStandardMaterial color="#78350F" roughness={0.8} />
        </mesh>
        {/* Backrest */}
        <mesh position={[0, 0.85, -0.28]} rotation={[0.1, 0, 0]} castShadow>
          <boxGeometry args={[2.0, 0.5, 0.08]} />
          <meshStandardMaterial color="#78350F" roughness={0.8} />
        </mesh>
        {/* Legs */}
        {[-0.8, 0.8].map((lx) => (
          <mesh key={`bench_leg_${lx}`} position={[lx, 0.22, 0]} castShadow>
            <cylinderGeometry args={[0.06, 0.08, 0.45, 6]} />
            <meshStandardMaterial color="#334155" />
          </mesh>
        ))}
      </group>

      {/* Vintage Gramophone on Wooden Table */}
      <group position={[-2.5, 0, -4.5]}>
        {/* Table */}
        <mesh position={[0, 0.45, 0]} castShadow>
          <cylinderGeometry args={[0.6, 0.65, 0.9, 8]} />
          <meshStandardMaterial color="#5C381E" />
        </mesh>
        {/* Gramophone Box */}
        <mesh position={[0, 0.95, 0]} castShadow>
          <boxGeometry args={[0.5, 0.2, 0.5]} />
          <meshStandardMaterial color="#92400E" />
        </mesh>
        {/* Brass Horn */}
        <group ref={gramophoneHornRef} position={[0.1, 1.15, 0]} rotation={[0, 0, 0.4]}>
          <mesh castShadow>
            <coneGeometry args={[0.35, 0.6, 12, 1, true]} />
            <meshStandardMaterial color="#F59E0B" metalness={0.8} roughness={0.2} side={THREE.DoubleSide} />
          </mesh>
        </group>

        {/* Music Notes Indicator */}
        <Html position={[0, 1.8, 0]} center distanceFactor={6}>
          <button
            onClick={() => {
              playChime();
              openModal("pond");
            }}
            className="px-2 py-1 rounded bg-amber-950/90 hover:bg-amber-900 border border-amber-400 text-amber-200 text-[10px] font-bold shadow-lg transition-transform hover:scale-105 active:scale-95 whitespace-nowrap cursor-pointer pointer-events-auto"
          >
            🎵 Playlists & Hobbies
          </button>
        </Html>
      </group>

      {/* Leaning Fishing Rod */}
      <group position={[-3.2, 0.4, 1.0]} rotation={[0.4, 0, -0.3]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.02, 0.04, 3.2, 6]} />
          <meshStandardMaterial color="#CA8A04" />
        </mesh>
      </group>
    </group>
  );
};

