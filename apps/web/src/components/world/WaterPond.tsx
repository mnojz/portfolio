"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export const WaterPond: React.FC = () => {
  const waterMeshRef = useRef<THREE.Mesh>(null);

  // Animated stylized water wave ripple
  useFrame((state) => {
    if (!waterMeshRef.current) return;
    const time = state.clock.getElapsedTime();
    const pos = waterMeshRef.current.geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const u = pos.getX(i);
      const v = pos.getY(i);
      const wave = Math.sin(u * 0.8 + time * 1.5) * Math.cos(v * 0.8 + time * 1.2) * 0.08;
      pos.setZ(i, wave);
    }
    pos.needsUpdate = true;
  });

  return (
    <group position={[16, -0.4, 18]}>
      {/* Water Surface Plane */}
      <mesh ref={waterMeshRef} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[14, 14, 20, 20]} />
        <meshStandardMaterial
          color="#38BDF8"
          roughness={0.1}
          metalness={0.2}
          transparent
          opacity={0.82}
          flatShading
        />
      </mesh>

      {/* Pond Edge Stone Rim */}
      {Array.from({ length: 18 }).map((_, i) => {
        const angle = (i / 18) * Math.PI * 2;
        const radius = 6.8 + (i % 3) * 0.3;
        const rx = Math.cos(angle) * radius;
        const rz = Math.sin(angle) * radius;
        return (
          <mesh key={`pond_rock_${i}`} position={[rx, 0.2, rz]} castShadow receiveShadow>
            <dodecahedronGeometry args={[0.55 + (i % 2) * 0.2, 0]} />
            <meshStandardMaterial color="#64748B" roughness={0.9} flatShading />
          </mesh>
        );
      })}

      {/* Wooden Fishing Pier / Dock */}
      <group position={[-3.5, 0.45, -2]}>
        {/* Pier Planks */}
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.4, 0.15, 6.5]} />
          <meshStandardMaterial color="#78350F" roughness={0.85} flatShading />
        </mesh>

        {/* Pier Support Stilts */}
        {[-1.0, 1.0].map((px) =>
          [-2.5, 0, 2.5].map((pz, idx) => (
            <mesh key={`pier_leg_${px}_${idx}`} position={[px, -0.6, pz]} castShadow>
              <cylinderGeometry args={[0.1, 0.12, 1.4, 6]} />
              <meshStandardMaterial color="#451A03" roughness={0.9} />
            </mesh>
          ))
        )}

        {/* Pier Mooring Post & Lamp */}
        <mesh position={[1.0, 0.5, 3.0]} castShadow>
          <cylinderGeometry args={[0.12, 0.14, 1.1, 6]} />
          <meshStandardMaterial color="#451A03" roughness={0.9} />
        </mesh>
      </group>

      {/* Floating Lily Pads with Pink Water Lilies */}
      {[
        { x: -1.5, z: 2.5, rot: 0.5 },
        { x: 2.2, z: -1.8, rot: 1.2 },
        { x: 3.5, z: 2.0, rot: 2.1 },
        { x: -3.0, z: -2.2, rot: 0.8 },
      ].map((lily, i) => (
        <group key={`lily_${i}`} position={[lily.x, 0.05, lily.z]} rotation={[0, lily.rot, 0]}>
          {/* Lily Pad Leaf */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.65, 8, 0, Math.PI * 1.8]} />
            <meshStandardMaterial color="#15803D" roughness={0.7} flatShading />
          </mesh>
          {/* Lotus Flower */}
          <mesh position={[0, 0.08, 0]}>
            <coneGeometry args={[0.18, 0.18, 6]} />
            <meshStandardMaterial color="#F472B6" roughness={0.5} />
          </mesh>
        </group>
      ))}

      {/* Reeds / Cattails on Pond Bank */}
      {[-4.5, -3.2, 4.0, 5.2].map((rz, i) => (
        <group key={`reed_${i}`} position={[5.5, 0.5, rz]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.02, 0.03, 1.6, 5]} />
            <meshStandardMaterial color="#65A30D" roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.6, 0]}>
            <cylinderGeometry args={[0.07, 0.07, 0.45, 6]} />
            <meshStandardMaterial color="#78350F" roughness={0.9} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

