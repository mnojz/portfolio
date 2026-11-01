"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useGameStore } from "@/stores/useGameStore";
import { Html } from "@react-three/drei";

export const Props: React.FC = () => {
  const windmillBladesRef = useRef<THREE.Group>(null);
  const timeOfDay = useGameStore((s) => s.timeOfDay);
  const isNight = timeOfDay < 6 || timeOfDay > 19;

  useFrame((_, delta) => {
    // Rotate windmill blades
    if (windmillBladesRef.current) {
      windmillBladesRef.current.rotation.z += delta * 0.8;
    }
  });

  return (
    <group>
      {/* Entrance Welcome Signpost */}
      <group position={[0, 0, 13]}>
        <mesh position={[-2.2, 1.4, 0]} castShadow>
          <cylinderGeometry args={[0.1, 0.12, 2.8, 6]} />
          <meshStandardMaterial color="#451A03" roughness={0.9} />
        </mesh>
        <mesh position={[2.2, 1.4, 0]} castShadow>
          <cylinderGeometry args={[0.1, 0.12, 2.8, 6]} />
          <meshStandardMaterial color="#451A03" roughness={0.9} />
        </mesh>
        {/* Signboard */}
        <mesh position={[0, 2.5, 0]} castShadow>
          <boxGeometry args={[4.8, 0.9, 0.16]} />
          <meshStandardMaterial color="#78350F" roughness={0.8} />
        </mesh>
        <Html position={[0, 2.5, 0.1]} center transform distanceFactor={9}>
          <div className="flex flex-col items-center justify-center p-2 text-center select-none w-72 pointer-events-none">
            <span className="text-[14px] font-bold tracking-wider text-amber-100 uppercase drop-shadow-md">
              Mosswood
            </span>
            <span className="text-[10px] text-amber-200/90 font-medium leading-tight">
              A Little World About Manoj
            </span>
            <div className="flex gap-2 text-[8px] text-amber-300 font-semibold tracking-widest mt-0.5">
              <span>EXPLORE</span>•<span>DISCOVER</span>•<span>CONNECT</span>
            </div>
          </div>
        </Html>
      </group>

      {/* Wooden Arch Bridge over Creek */}
      <group position={[4, 0, 6]} rotation={[0, 0.6, 0]}>
        {/* Arched Bridge Deck */}
        <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.6, 0.18, 5.5]} />
          <meshStandardMaterial color="#854D0E" roughness={0.85} flatShading />
        </mesh>
        {/* Handrails */}
        <mesh position={[-1.25, 0.85, 0]} castShadow>
          <boxGeometry args={[0.1, 0.7, 5.5]} />
          <meshStandardMaterial color="#713F12" roughness={0.9} />
        </mesh>
        <mesh position={[1.25, 0.85, 0]} castShadow>
          <boxGeometry args={[0.1, 0.7, 5.5]} />
          <meshStandardMaterial color="#713F12" roughness={0.9} />
        </mesh>
      </group>

      {/* Countryside Windmill */}
      <group position={[28, 0, 4]}>
        {/* Base Tower */}
        <mesh position={[0, 3.5, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1.6, 2.4, 7.0, 8]} />
          <meshStandardMaterial color="#E2E8F0" roughness={0.9} flatShading />
        </mesh>
        {/* Conical Roof */}
        <mesh position={[0, 7.8, 0]} castShadow>
          <coneGeometry args={[2.0, 2.0, 8]} />
          <meshStandardMaterial color="#991B1B" roughness={0.7} flatShading />
        </mesh>
        {/* Rotating Blades */}
        <group position={[0, 6.2, 1.7]} ref={windmillBladesRef}>
          {/* Central Hub */}
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.3, 0.3, 0.4, 8]} />
            <meshStandardMaterial color="#475569" />
          </mesh>
          {/* 4 Blades */}
          {[0, Math.PI / 2, Math.PI, (Math.PI * 3) / 2].map((angle, i) => (
            <group key={`blade_${i}`} rotation={[0, 0, angle]}>
              <mesh position={[0, 2.4, 0]} castShadow>
                <boxGeometry args={[0.45, 4.4, 0.04]} />
                <meshStandardMaterial color="#FEF3C7" roughness={0.8} />
              </mesh>
            </group>
          ))}
        </group>
      </group>

      {/* Starlit Campsite (Easter Egg & Rest Spot) */}
      <group position={[-32, 0, 2]}>
        {/* Fire Pit Stone Ring */}
        <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
          <torusGeometry args={[0.8, 0.15, 6, 12]} />
          <meshStandardMaterial color="#475569" roughness={0.9} flatShading />
        </mesh>
        {/* Burning Logs */}
        <mesh position={[0, 0.2, 0]} rotation={[0.4, 0.6, 0]} castShadow>
          <cylinderGeometry args={[0.1, 0.12, 1.1, 5]} />
          <meshStandardMaterial color="#451A03" />
        </mesh>
        <mesh position={[0, 0.22, 0]} rotation={[-0.3, -0.7, 0]} castShadow>
          <cylinderGeometry args={[0.09, 0.11, 1.0, 5]} />
          <meshStandardMaterial color="#451A03" />
        </mesh>
        {/* Crackling Flame */}
        <mesh position={[0, 0.45, 0]}>
          <coneGeometry args={[0.35, 0.65, 6]} />
          <meshBasicMaterial color="#F97316" />
        </mesh>
        <pointLight position={[0, 0.6, 0]} color="#F97316" intensity={1.8} distance={7} />

        {/* Log Benches around campfire */}
        {[
          { x: 0, z: 1.8, rot: 0 },
          { x: -1.8, z: 0, rot: Math.PI / 2 },
          { x: 1.8, z: 0, rot: Math.PI / 2 },
        ].map((bench, idx) => (
          <group key={`camp_bench_${idx}`} position={[bench.x, 0.2, bench.z]} rotation={[0, bench.rot, 0]}>
            <mesh rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
              <cylinderGeometry args={[0.22, 0.25, 2.2, 6]} />
              <meshStandardMaterial color="#5C381E" roughness={0.9} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Village Lantern Posts */}
      {[
        { x: -7, z: -8 },
        { x: 10, z: -7 },
        { x: 2, z: 2 },
        { x: -12, z: 12 },
        { x: 12, z: 14 },
        { x: 0, z: -20 },
      ].map((lp, idx) => (
        <group key={`lantern_${idx}`} position={[lp.x, 0, lp.z]}>
          {/* Post */}
          <mesh position={[0, 1.4, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.1, 2.8, 6]} />
            <meshStandardMaterial color="#334155" />
          </mesh>
          {/* Lantern Head */}
          <mesh position={[0, 2.7, 0]} castShadow>
            <boxGeometry args={[0.32, 0.45, 0.32]} />
            <meshStandardMaterial color="#1E293B" />
          </mesh>
          {/* Glowing Glass */}
          <mesh position={[0, 2.7, 0]}>
            <boxGeometry args={[0.26, 0.38, 0.26]} />
            <meshBasicMaterial color={isNight ? "#FDE047" : "#FEF08A"} />
          </mesh>
          {/* Warm Light Emission at night */}
          {isNight && (
            <pointLight position={[0, 2.7, 0]} color="#FDE047" intensity={1.4} distance={9} />
          )}
        </group>
      ))}

      {/* Village Fences */}
      {[-12, -8, -4, 4, 8, 12].map((fx, i) => (
        <group key={`fence_${i}`} position={[fx, 0.45, 12]}>
          <mesh position={[0, 0, 0]} castShadow>
            <boxGeometry args={[1.9, 0.08, 0.06]} />
            <meshStandardMaterial color="#78350F" roughness={0.9} />
          </mesh>
          <mesh position={[0, -0.2, 0]} castShadow>
            <boxGeometry args={[1.9, 0.08, 0.06]} />
            <meshStandardMaterial color="#78350F" roughness={0.9} />
          </mesh>
          <mesh position={[-0.9, -0.05, 0]} castShadow>
            <cylinderGeometry args={[0.06, 0.07, 0.8, 5]} />
            <meshStandardMaterial color="#5C381E" />
          </mesh>
        </group>
      ))}
    </group>
  );
};

