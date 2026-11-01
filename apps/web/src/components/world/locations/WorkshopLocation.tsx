"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import { PROJECTS } from "@/content/projects";
import { useGameStore } from "@/stores/useGameStore";
import { useAudioStore } from "@/stores/useAudioStore";

export const WorkshopLocation: React.FC = () => {
  const gearRef = useRef<THREE.Group>(null);
  const waterWheelRef = useRef<THREE.Group>(null);
  const setSelectedProject = useGameStore((s) => s.setSelectedProject);
  const playChime = useAudioStore((s) => s.playChime);

  useFrame((_, delta) => {
    if (gearRef.current) gearRef.current.rotation.z += delta * 0.7;
    if (waterWheelRef.current) waterWheelRef.current.rotation.x += delta * 0.5;
  });

  return (
    <group position={[20, 0, -8]}>
      {/* Workshop Main Building */}
      <mesh position={[0, 2.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[8.5, 4.8, 6.5]} />
        <meshStandardMaterial color="#475569" roughness={0.9} flatShading />
      </mesh>

      {/* Industrial Pitched Roof */}
      <mesh position={[0, 5.4, 0]} rotation={[0, 0, 0]} castShadow>
        <coneGeometry args={[6.2, 2.6, 4]} />
        <meshStandardMaterial color="#334155" roughness={0.7} flatShading />
      </mesh>

      {/* Rotating Water Wheel on the side */}
      <group ref={waterWheelRef} position={[4.6, 1.8, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[2.0, 2.0, 0.4, 12]} />
          <meshStandardMaterial color="#78350F" roughness={0.8} />
        </mesh>
        {/* Wheel Paddles */}
        {Array.from({ length: 8 }).map((_, i) => (
          <group key={`paddle_${i}`} rotation={[(i * Math.PI) / 4, 0, 0]}>
            <mesh position={[0, 1.9, 0]} castShadow>
              <boxGeometry args={[0.35, 0.08, 0.6]} />
              <meshStandardMaterial color="#9A3412" />
            </mesh>
          </group>
        ))}
      </group>

      {/* Decorative Rotating Gear Cog over the Entrance */}
      <group ref={gearRef} position={[0, 4.2, 3.3]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.8, 0.8, 0.15, 8]} />
          <meshStandardMaterial color="#D97706" metalness={0.7} roughness={0.3} />
        </mesh>
      </group>

      {/* Workshop Sign */}
      <Html position={[0, 3.1, 3.4]} center distanceFactor={8}>
        <div className="flex flex-col items-center pointer-events-none select-none">
          <div className="px-2.5 py-1 rounded-md text-[11px] font-bold shadow-md border backdrop-blur-md bg-slate-900/90 text-amber-300 border-amber-500">
            ⚙️ The Workshop
          </div>
          <div className="text-[9px] text-slate-800 bg-white/80 px-1.5 py-0.5 rounded shadow mt-0.5 font-medium">
            Projects Showcase • Press E
          </div>
        </div>
      </Html>

      {/* Interactive Project Hologram Pedestals on the Workshop Porch */}
      <group position={[0, 0, 4.2]}>
        {PROJECTS.slice(0, 4).map((project, idx) => {
          const posX = (idx - 1.5) * 2.1;
          return (
            <group key={project.id} position={[posX, 0.5, 0]}>
              {/* Pedestal */}
              <mesh castShadow receiveShadow>
                <cylinderGeometry args={[0.35, 0.45, 0.9, 8]} />
                <meshStandardMaterial color="#1E293B" roughness={0.8} />
              </mesh>
              {/* Holographic Glowing Terminal / Model */}
              <mesh position={[0, 0.65, 0]}>
                <boxGeometry args={[0.4, 0.35, 0.3]} />
                <meshStandardMaterial
                  color="#38BDF8"
                  roughness={0.2}
                  emissive="#0284C7"
                  emissiveIntensity={0.6}
                />
              </mesh>
              <pointLight position={[0, 0.8, 0]} color="#38BDF8" intensity={0.8} distance={2.5} />

              <Html position={[0, 1.25, 0]} center distanceFactor={6}>
                <button
                  onClick={() => {
                    playChime();
                    setSelectedProject(project);
                  }}
                  className="px-2 py-1 rounded bg-slate-950/90 hover:bg-sky-950 border border-sky-400 text-sky-200 text-[10px] font-bold shadow-lg transition-transform hover:scale-105 active:scale-95 whitespace-nowrap cursor-pointer pointer-events-auto"
                >
                  💻 {project.title.split("—")[0].trim()}
                </button>
              </Html>
            </group>
          );
        })}
      </group>
    </group>
  );
};

