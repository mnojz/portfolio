"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useGameStore } from "@/stores/useGameStore";
import { Html } from "@react-three/drei";

export const HomeLocation: React.FC = () => {
  const isHomeUnlocked = useGameStore((s) => s.isHomeUnlocked);
  const smokeRef = useRef<THREE.Group>(null);
  const doorRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    // Chimney smoke puff animation
    if (smokeRef.current) {
      smokeRef.current.children.forEach((puff, idx) => {
        puff.position.y += delta * 0.4;
        puff.scale.addScalar(delta * 0.1);
        if (puff.position.y > 2.5) {
          puff.position.y = 0;
          puff.scale.set(1, 1, 1);
        }
      });
    }

    // Door swing animation (open if unlocked)
    if (doorRef.current) {
      const targetAngle = isHomeUnlocked ? -Math.PI / 2 : 0;
      doorRef.current.rotation.y = THREE.MathUtils.lerp(doorRef.current.rotation.y, targetAngle, 0.1);
    }
  });

  return (
    <group position={[-18, 0, -10]}>
      {/* Cottage Main Walls */}
      <mesh position={[0, 2.0, 0]} castShadow receiveShadow>
        <boxGeometry args={[6.8, 4.0, 5.5]} />
        <meshStandardMaterial color="#FFFBEB" roughness={0.9} flatShading />
      </mesh>

      {/* Timber Corner Beams */}
      {[-3.4, 3.4].map((bx) =>
        [-2.75, 2.75].map((bz, idx) => (
          <mesh key={`beam_${bx}_${idx}`} position={[bx, 2.0, bz]} castShadow>
            <boxGeometry args={[0.3, 4.1, 0.3]} />
            <meshStandardMaterial color="#5C381E" roughness={0.8} />
          </mesh>
        ))
      )}

      {/* Gabled Cottage Roof */}
      <mesh position={[0, 4.8, 0]} rotation={[0, 0, 0]} castShadow>
        <coneGeometry args={[5.2, 2.4, 4]} />
        <meshStandardMaterial color="#B91C1C" roughness={0.8} flatShading />
      </mesh>

      {/* Stone Chimney */}
      <group position={[2.2, 4.5, -1.2]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.9, 3.2, 0.9]} />
          <meshStandardMaterial color="#64748B" roughness={0.9} flatShading />
        </mesh>
        {/* Animated Chimney Smoke Puffs */}
        <group ref={smokeRef} position={[0, 1.8, 0]}>
          {[0, 0.7, 1.4].map((offsetY, i) => (
            <mesh key={`smoke_${i}`} position={[0, offsetY, 0]}>
              <sphereGeometry args={[0.22, 6, 6]} />
              <meshBasicMaterial color="#E2E8F0" transparent opacity={0.65} />
            </mesh>
          ))}
        </group>
      </group>

      {/* Front Porch & Welcome Steps */}
      <mesh position={[0, 0.1, 3.2]} castShadow receiveShadow>
        <boxGeometry args={[3.2, 0.2, 1.2]} />
        <meshStandardMaterial color="#78350F" roughness={0.9} />
      </mesh>

      {/* Door Frame & Animated Door */}
      <group position={[0, 1.2, 2.76]}>
        {/* Door Frame */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.5, 2.3, 0.1]} />
          <meshStandardMaterial color="#451A03" />
        </mesh>

        {/* Swingable Door Leaf */}
        <group ref={doorRef} position={[-0.65, 0, 0]}>
          <mesh position={[0.65, 0, 0]} castShadow>
            <boxGeometry args={[1.3, 2.2, 0.08]} />
            <meshStandardMaterial color="#78350F" roughness={0.8} />
          </mesh>
          {/* Brass Door Knob */}
          <mesh position={[1.15, -0.1, 0.06]}>
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshStandardMaterial color="#FBBF24" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>
      </group>

      {/* Plaque / Status Sign */}
      <Html position={[0, 2.9, 2.8]} center distanceFactor={8}>
        <div className="flex flex-col items-center pointer-events-none select-none">
          <div
            className={`px-2.5 py-1 rounded-md text-[11px] font-bold shadow-md border backdrop-blur-md transition-all ${
              isHomeUnlocked
                ? "bg-emerald-900/90 text-emerald-200 border-emerald-400"
                : "bg-amber-950/90 text-amber-200 border-amber-600"
            }`}
          >
            {isHomeUnlocked ? "🏡 The Home (Open House)" : "🏡 The Home (Locked)"}
          </div>
          <div className="text-[9px] text-slate-800 bg-white/80 px-1.5 py-0.5 rounded shadow mt-0.5 font-medium">
            About Manoj • Press E
          </div>
        </div>
      </Html>

      {/* Cozy Interior Desk & Glowing Screen (visible when door is open) */}
      {isHomeUnlocked && (
        <group position={[0, 0, 0]}>
          {/* Desk */}
          <mesh position={[0, 0.8, -1.0]} castShadow>
            <boxGeometry args={[2.0, 0.1, 1.0]} />
            <meshStandardMaterial color="#5C381E" />
          </mesh>
          {/* Glowing Monitor */}
          <mesh position={[0, 1.25, -1.1]}>
            <boxGeometry args={[0.8, 0.5, 0.08]} />
            <meshBasicMaterial color="#38BDF8" />
          </mesh>
          {/* Desk Lamp Glow */}
          <pointLight position={[0.7, 1.3, -0.9]} color="#FEF08A" intensity={1.5} distance={4} />
        </group>
      )}

      {/* Window with Flower Box */}
      {[-2.0, 2.0].map((wx, i) => (
        <group key={`window_${i}`} position={[wx, 1.8, 2.76]}>
          <mesh>
            <boxGeometry args={[1.0, 1.0, 0.08]} />
            <meshBasicMaterial color="#FEF08A" />
          </mesh>
          {/* Flower Box */}
          <mesh position={[0, -0.6, 0.12]} castShadow>
            <boxGeometry args={[1.2, 0.25, 0.25]} />
            <meshStandardMaterial color="#78350F" />
          </mesh>
        </group>
      ))}
    </group>
  );
};

