"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import { AnimationState } from "@mosswood/shared";

interface CharacterMeshProps {
  color?: string;
  hat?: string;
  animation?: AnimationState;
  username?: string;
  isOwner?: boolean;
  isLocal?: boolean;
}

export const CharacterMesh: React.FC<CharacterMeshProps> = ({
  color = "#3B82F6",
  hat = "none",
  animation = "idle",
  username = "Guest",
  isOwner = false,
  isLocal = false,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Mesh>(null);
  const rightLegRef = useRef<THREE.Mesh>(null);
  const leftArmRef = useRef<THREE.Mesh>(null);
  const rightArmRef = useRef<THREE.Mesh>(null);
  const crownGlowRef = useRef<THREE.PointLight>(null);

  // Procedural Animation Loop
  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (!leftLegRef.current || !rightLegRef.current || !leftArmRef.current || !rightArmRef.current) return;

    if (animation === "walk" || animation === "run") {
      const freq = animation === "run" ? 14 : 9;
      const legAngle = Math.sin(time * freq) * 0.55;
      const armAngle = Math.cos(time * freq) * 0.45;

      leftLegRef.current.rotation.x = legAngle;
      rightLegRef.current.rotation.x = -legAngle;
      leftArmRef.current.rotation.x = -armAngle;
      rightArmRef.current.rotation.x = armAngle;

      // Slight head bob while running/walking
      if (headRef.current) {
        headRef.current.position.y = 1.1 + Math.abs(Math.sin(time * freq)) * 0.05;
      }
    } else if (animation === "jump") {
      leftLegRef.current.rotation.x = 0.4;
      rightLegRef.current.rotation.x = 0.4;
      leftArmRef.current.rotation.x = -1.2;
      rightArmRef.current.rotation.x = -1.2;
    } else if (animation === "wave") {
      leftLegRef.current.rotation.x = 0;
      rightLegRef.current.rotation.x = 0;
      leftArmRef.current.rotation.x = 0;
      rightArmRef.current.rotation.x = -2.4 + Math.sin(time * 12) * 0.3;
      rightArmRef.current.rotation.z = -0.3 + Math.cos(time * 12) * 0.2;
    } else if (animation === "dance") {
      const hop = Math.abs(Math.sin(time * 8)) * 0.2;
      if (groupRef.current) {
        groupRef.current.position.y = hop;
      }
      leftLegRef.current.rotation.x = Math.sin(time * 10) * 0.4;
      rightLegRef.current.rotation.x = -Math.sin(time * 10) * 0.4;
      leftArmRef.current.rotation.z = Math.sin(time * 8) * 0.6 + 0.3;
      rightArmRef.current.rotation.z = -Math.sin(time * 8) * 0.6 - 0.3;
    } else if (animation === "sit") {
      if (groupRef.current) groupRef.current.position.y = -0.25;
      leftLegRef.current.rotation.x = -1.4;
      rightLegRef.current.rotation.x = -1.4;
      leftArmRef.current.rotation.x = -0.5;
      rightArmRef.current.rotation.x = -0.5;
    } else {
      // Idle gentle breathing
      const idle = Math.sin(time * 2.5) * 0.02;
      if (groupRef.current) groupRef.current.position.y = 0;
      leftLegRef.current.rotation.x = 0;
      rightLegRef.current.rotation.x = 0;
      leftArmRef.current.rotation.x = idle;
      rightArmRef.current.rotation.x = -idle;
      leftArmRef.current.rotation.z = 0.1;
      rightArmRef.current.rotation.z = -0.1;

      if (headRef.current) {
        headRef.current.position.y = 1.1 + idle;
      }
    }

    // Owner Crown Golden Glow Pulse
    if (isOwner && crownGlowRef.current) {
      crownGlowRef.current.intensity = 1.2 + Math.sin(time * 4) * 0.5;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Overhead Nameplate & Owner Badge */}
      <Html position={[0, 1.95, 0]} center distanceFactor={12} zIndexRange={[100, 0]}>
        <div className="flex flex-col items-center pointer-events-none select-none">
          {isOwner && (
            <div className="flex items-center gap-1 px-2 py-0.5 mb-0.5 rounded-full bg-amber-500/90 text-white text-[11px] font-bold shadow-lg border border-amber-300 animate-pulse">
              <span>👑</span>
              <span>CREATOR</span>
            </div>
          )}
          <div
            className={`px-2 py-0.5 rounded-md text-xs font-semibold backdrop-blur-md shadow-md border ${
              isLocal
                ? "bg-white/85 text-emerald-900 border-emerald-400"
                : isOwner
                ? "bg-amber-950/80 text-amber-200 border-amber-500"
                : "bg-slate-900/80 text-slate-100 border-slate-700"
            }`}
          >
            {username}
          </div>
        </div>
      </Html>

      {/* Torso (Shirt) */}
      <mesh position={[0, 0.65, 0]} castShadow>
        <boxGeometry args={[0.42, 0.5, 0.28]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>

      {/* Head Group */}
      <group ref={headRef} position={[0, 1.1, 0]}>
        {/* Head */}
        <mesh castShadow>
          <boxGeometry args={[0.38, 0.38, 0.38]} />
          <meshStandardMaterial color="#FFE0BD" roughness={0.7} />
        </mesh>

        {/* Hair / Cap base */}
        <mesh position={[0, 0.16, -0.04]} castShadow>
          <boxGeometry args={[0.4, 0.14, 0.38]} />
          <meshStandardMaterial color="#4A2E18" roughness={0.9} />
        </mesh>

        {/* Stylized Eyes */}
        <mesh position={[-0.09, 0.03, 0.2]}>
          <boxGeometry args={[0.05, 0.08, 0.02]} />
          <meshBasicMaterial color="#1F2937" />
        </mesh>
        <mesh position={[0.09, 0.03, 0.2]}>
          <boxGeometry args={[0.05, 0.08, 0.02]} />
          <meshBasicMaterial color="#1F2937" />
        </mesh>

        {/* Cute blush cheeks */}
        <mesh position={[-0.12, -0.07, 0.195]}>
          <boxGeometry args={[0.06, 0.03, 0.01]} />
          <meshBasicMaterial color="#FCA5A5" />
        </mesh>
        <mesh position={[0.12, -0.07, 0.195]}>
          <boxGeometry args={[0.06, 0.03, 0.01]} />
          <meshBasicMaterial color="#FCA5A5" />
        </mesh>

        {/* Hats & Accessories */}
        {hat === "crown" && (
          <group position={[0, 0.24, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.18, 0.14, 0.12, 6]} />
              <meshStandardMaterial color="#F59E0B" metalness={0.8} roughness={0.2} emissive="#D97706" emissiveIntensity={0.3} />
            </mesh>
            <pointLight ref={crownGlowRef} distance={2.5} color="#FBBF24" intensity={1.5} />
          </group>
        )}

        {hat === "straw_hat" && (
          <group position={[0, 0.2, 0]}>
            {/* Brim */}
            <mesh castShadow>
              <cylinderGeometry args={[0.34, 0.34, 0.03, 16]} />
              <meshStandardMaterial color="#EAB308" roughness={0.9} />
            </mesh>
            {/* Dome */}
            <mesh position={[0, 0.08, 0]} castShadow>
              <cylinderGeometry args={[0.18, 0.2, 0.12, 12]} />
              <meshStandardMaterial color="#CA8A04" roughness={0.9} />
            </mesh>
            {/* Ribbon */}
            <mesh position={[0, 0.04, 0]}>
              <cylinderGeometry args={[0.205, 0.205, 0.03, 12]} />
              <meshBasicMaterial color="#EF4444" />
            </mesh>
          </group>
        )}

        {hat === "wizard_hat" && (
          <group position={[0, 0.22, 0]} rotation={[0.1, 0, 0.05]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.32, 0.32, 0.03, 12]} />
              <meshStandardMaterial color="#4C1D95" roughness={0.7} />
            </mesh>
            <mesh position={[0, 0.22, 0]} castShadow>
              <coneGeometry args={[0.2, 0.42, 12]} />
              <meshStandardMaterial color="#5B21B6" roughness={0.7} />
            </mesh>
          </group>
        )}

        {hat === "cap" && (
          <group position={[0, 0.2, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.38, 0.08, 0.38]} />
              <meshStandardMaterial color="#DC2626" />
            </mesh>
            <mesh position={[0, -0.01, 0.22]} castShadow>
              <boxGeometry args={[0.3, 0.02, 0.15]} />
              <meshStandardMaterial color="#991B1B" />
            </mesh>
          </group>
        )}

        {hat === "beanie" && (
          <group position={[0, 0.22, 0]}>
            <mesh castShadow>
              <sphereGeometry args={[0.22, 12, 10]} />
              <meshStandardMaterial color="#059669" roughness={0.8} />
            </mesh>
          </group>
        )}

        {hat === "flower" && (
          <group position={[0.18, 0.18, 0.1]}>
            <mesh>
              <sphereGeometry args={[0.04, 8, 8]} />
              <meshBasicMaterial color="#FBBF24" />
            </mesh>
            <mesh position={[0, 0, 0.02]}>
              <sphereGeometry args={[0.02, 8, 8]} />
              <meshBasicMaterial color="#EC4899" />
            </mesh>
          </group>
        )}
      </group>

      {/* Arms */}
      <mesh ref={leftArmRef} position={[-0.27, 0.65, 0]} castShadow>
        <boxGeometry args={[0.12, 0.42, 0.14]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      <mesh ref={rightArmRef} position={[0.27, 0.65, 0]} castShadow>
        <boxGeometry args={[0.12, 0.42, 0.14]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>

      {/* Legs (Pants) */}
      <mesh ref={leftLegRef} position={[-0.11, 0.2, 0]} castShadow>
        <boxGeometry args={[0.14, 0.42, 0.18]} />
        <meshStandardMaterial color="#1E293B" roughness={0.8} />
      </mesh>
      <mesh ref={rightLegRef} position={[0.11, 0.2, 0]} castShadow>
        <boxGeometry args={[0.14, 0.42, 0.18]} />
        <meshStandardMaterial color="#1E293B" roughness={0.8} />
      </mesh>
    </group>
  );
};

