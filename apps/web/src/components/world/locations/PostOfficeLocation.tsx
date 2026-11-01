"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import { useGameStore } from "@/stores/useGameStore";
import { useAudioStore } from "@/stores/useAudioStore";

export const PostOfficeLocation: React.FC = () => {
  const mailboxFlagRef = useRef<THREE.Mesh>(null);
  const openModal = useGameStore((s) => s.openModal);
  const playChime = useAudioStore((s) => s.playChime);

  useFrame((state) => {
    // Gentle bob of mailbox flag
    if (mailboxFlagRef.current) {
      mailboxFlagRef.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 3) * 0.08;
    }
  });

  return (
    <group position={[-2, 0, -22]}>
      {/* Mail Depot Building */}
      <mesh position={[0, 1.8, 0]} castShadow receiveShadow>
        <boxGeometry args={[5.2, 3.6, 4.2]} />
        <meshStandardMaterial color="#FEF3C7" roughness={0.9} flatShading />
      </mesh>

      {/* Blue Postal Roof */}
      <mesh position={[0, 4.0, 0]} castShadow>
        <coneGeometry args={[3.8, 2.0, 4]} />
        <meshStandardMaterial color="#1D4ED8" roughness={0.7} flatShading />
      </mesh>

      {/* Classic Red Mailbox Outside */}
      <group position={[2.2, 0, 2.4]}>
        {/* Post */}
        <mesh position={[0, 0.5, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.1, 1.0, 6]} />
          <meshStandardMaterial color="#475569" />
        </mesh>
        {/* Mailbox Body */}
        <mesh position={[0, 1.15, 0]} castShadow>
          <boxGeometry args={[0.45, 0.45, 0.7]} />
          <meshStandardMaterial color="#DC2626" roughness={0.4} />
        </mesh>
        {/* Curved Mailbox Top */}
        <mesh position={[0, 1.38, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.22, 0.22, 0.7, 12, 1, false, 0, Math.PI]} />
          <meshStandardMaterial color="#DC2626" roughness={0.4} />
        </mesh>
        {/* Red Mailbox Flag */}
        <mesh ref={mailboxFlagRef} position={[0.26, 1.3, -0.15]}>
          <boxGeometry args={[0.04, 0.35, 0.1]} />
          <meshBasicMaterial color="#FEF08A" />
        </mesh>

        <Html position={[0, 1.8, 0]} center distanceFactor={6}>
          <button
            onClick={() => {
              playChime();
              openModal("post_office");
            }}
            className="px-2 py-1 rounded bg-red-900/90 hover:bg-red-800 border border-red-300 text-red-100 text-[10px] font-bold shadow-lg transition-transform hover:scale-105 active:scale-95 whitespace-nowrap cursor-pointer pointer-events-auto"
          >
            📬 Open Mailbox
          </button>
        </Html>
      </group>

      {/* Village Notice Board Beside Office */}
      <group position={[-2.4, 0, 2.2]} rotation={[0, 0.2, 0]}>
        {/* Wooden Posts */}
        <mesh position={[-0.9, 1.1, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.1, 2.2, 6]} />
          <meshStandardMaterial color="#451A03" />
        </mesh>
        <mesh position={[0.9, 1.1, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.1, 2.2, 6]} />
          <meshStandardMaterial color="#451A03" />
        </mesh>
        {/* Cork Board */}
        <mesh position={[0, 1.4, 0]} castShadow>
          <boxGeometry args={[1.8, 1.1, 0.08]} />
          <meshStandardMaterial color="#A16207" roughness={0.9} />
        </mesh>
        {/* Pinned Notes */}
        {[-0.5, 0, 0.5].map((nx, i) => (
          <mesh key={`note_${i}`} position={[nx, 1.4, 0.05]}>
            <boxGeometry args={[0.3, 0.35, 0.01]} />
            <meshStandardMaterial
              color={["#FEF08A", "#FED7AA", "#BAE6FD"][i]}
              roughness={0.9}
            />
          </mesh>
        ))}
      </group>

      {/* Header Sign */}
      <Html position={[0, 2.8, 2.2]} center distanceFactor={8}>
        <div className="flex flex-col items-center pointer-events-none select-none">
          <div className="px-2.5 py-1 rounded-md text-[11px] font-bold shadow-md border backdrop-blur-md bg-blue-950/90 text-blue-200 border-blue-400">
            ✉️ The Post Office
          </div>
          <div className="text-[9px] text-slate-800 bg-white/80 px-1.5 py-0.5 rounded shadow mt-0.5 font-medium">
            Contact & Guestbook • Press E
          </div>
        </div>
      </Html>
    </group>
  );
};

