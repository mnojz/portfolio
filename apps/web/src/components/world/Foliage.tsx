"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface TreeInstance {
  x: number;
  z: number;
  scale: number;
  type: "pine" | "oak" | "apple";
}

export const Foliage: React.FC = () => {
  const foliageGroupRef = useRef<THREE.Group>(null);

  // Forest tree positions around village perimeter and clearings
  const trees: TreeInstance[] = useMemo(() => {
    const list: TreeInstance[] = [
      // Northern woods around Lookout base
      { x: -14, z: -32, scale: 1.2, type: "pine" },
      { x: -8, z: -38, scale: 1.4, type: "pine" },
      { x: 12, z: -35, scale: 1.3, type: "pine" },
      { x: 18, z: -28, scale: 1.1, type: "pine" },
      // Western forest behind The Home
      { x: -28, z: -12, scale: 1.3, type: "oak" },
      { x: -32, z: -4, scale: 1.2, type: "apple" },
      { x: -25, z: 2, scale: 1.1, type: "oak" },
      { x: -16, z: 4, scale: 1.0, type: "pine" },
      // Southern perimeter
      { x: -14, z: 28, scale: 1.2, type: "oak" },
      { x: -4, z: 32, scale: 1.3, type: "apple" },
      { x: 6, z: 34, scale: 1.1, type: "oak" },
      { x: 26, z: 30, scale: 1.4, type: "pine" },
      // Eastern woods behind Workshop & Pond
      { x: 34, z: -10, scale: 1.3, type: "oak" },
      { x: 38, z: 2, scale: 1.2, type: "pine" },
      { x: 32, z: 12, scale: 1.1, type: "oak" },
      { x: 28, z: 24, scale: 1.3, type: "apple" },
      // Ancient hollow pine near crossroads
      { x: -8, z: 2, scale: 1.6, type: "pine" },
    ];
    return list;
  }, []);

  // Flowers & wild mushroom clusters
  const flowers = useMemo(() => {
    const fl: { x: number; z: number; color: string }[] = [];
    const colors = ["#F43F5E", "#EAB308", "#A855F7", "#EC4899", "#38BDF8"];
    for (let i = 0; i < 40; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = 4 + Math.random() * 35;
      fl.push({
        x: Math.cos(angle) * r,
        z: Math.sin(angle) * r,
        color: colors[i % colors.length],
      });
    }
    return fl;
  }, []);

  useFrame((state) => {
    // Gentle foliage breeze sway
    if (!foliageGroupRef.current) return;
    const time = state.clock.getElapsedTime();
    foliageGroupRef.current.children.forEach((child, idx) => {
      if (child.name === "tree_crown") {
        child.rotation.z = Math.sin(time * 1.5 + idx) * 0.03;
      }
    });
  });

  return (
    <group ref={foliageGroupRef}>
      {/* Trees */}
      {trees.map((t, i) => (
        <group key={`tree_${i}`} position={[t.x, 0, t.z]} scale={t.scale}>
          {/* Trunk */}
          <mesh position={[0, 1.2, 0]} castShadow>
            <cylinderGeometry args={[0.25, 0.35, 2.4, 6]} />
            <meshStandardMaterial color="#5C381E" roughness={0.9} flatShading />
          </mesh>

          {/* Foliage Canopy based on type */}
          {t.type === "pine" && (
            <group name="tree_crown" position={[0, 2.2, 0]}>
              <mesh position={[0, 0, 0]} castShadow>
                <coneGeometry args={[1.8, 2.2, 7]} />
                <meshStandardMaterial color="#1B4D2E" roughness={0.8} flatShading />
              </mesh>
              <mesh position={[0, 1.2, 0]} castShadow>
                <coneGeometry args={[1.4, 1.8, 7]} />
                <meshStandardMaterial color="#235E38" roughness={0.8} flatShading />
              </mesh>
              <mesh position={[0, 2.2, 0]} castShadow>
                <coneGeometry args={[0.9, 1.5, 7]} />
                <meshStandardMaterial color="#2E7547" roughness={0.8} flatShading />
              </mesh>
            </group>
          )}

          {t.type === "oak" && (
            <group name="tree_crown" position={[0, 2.8, 0]}>
              <mesh position={[0, 0, 0]} castShadow>
                <dodecahedronGeometry args={[1.8, 0]} />
                <meshStandardMaterial color="#367A3E" roughness={0.8} flatShading />
              </mesh>
              <mesh position={[0.7, 0.6, 0.4]} castShadow>
                <dodecahedronGeometry args={[1.2, 0]} />
                <meshStandardMaterial color="#408E4A" roughness={0.8} flatShading />
              </mesh>
              <mesh position={[-0.6, 0.5, -0.3]} castShadow>
                <dodecahedronGeometry args={[1.3, 0]} />
                <meshStandardMaterial color="#4CA357" roughness={0.8} flatShading />
              </mesh>
            </group>
          )}

          {t.type === "apple" && (
            <group name="tree_crown" position={[0, 2.6, 0]}>
              <mesh position={[0, 0, 0]} castShadow>
                <dodecahedronGeometry args={[1.6, 0]} />
                <meshStandardMaterial color="#448B4C" roughness={0.8} flatShading />
              </mesh>
              {/* Red Apples */}
              {[
                { x: 0.8, y: -0.2, z: 0.9 },
                { x: -0.9, y: 0.3, z: 0.7 },
                { x: 0.5, y: 0.7, z: -0.8 },
                { x: -0.6, y: -0.4, z: -0.9 },
              ].map((ap, idx) => (
                <mesh key={`apple_${idx}`} position={[ap.x, ap.y, ap.z]} castShadow>
                  <sphereGeometry args={[0.16, 6, 6]} />
                  <meshStandardMaterial color="#DC2626" roughness={0.4} />
                </mesh>
              ))}
            </group>
          )}
        </group>
      ))}

      {/* Colorful Meadow Flowers */}
      {flowers.map((fl, i) => (
        <group key={`flower_${i}`} position={[fl.x, 0.08, fl.z]}>
          <mesh position={[0, 0.12, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.24, 4]} />
            <meshStandardMaterial color="#15803D" />
          </mesh>
          <mesh position={[0, 0.25, 0]}>
            <sphereGeometry args={[0.09, 5, 5]} />
            <meshStandardMaterial color={fl.color} roughness={0.5} />
          </mesh>
        </group>
      ))}

      {/* Wild Mushrooms */}
      {[
        { x: -7, z: 3, rot: 0.2 },
        { x: -24, z: -14, rot: 0.6 },
        { x: 25, z: -13, rot: -0.4 },
        { x: -31, z: 3, rot: 0.1 },
      ].map((mush, idx) => (
        <group key={`mush_${idx}`} position={[mush.x, 0, mush.z]} rotation={[0, mush.rot, 0]}>
          <mesh position={[0, 0.14, 0]} castShadow>
            <cylinderGeometry args={[0.06, 0.09, 0.28, 6]} />
            <meshStandardMaterial color="#FEF3C7" roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.28, 0]} castShadow>
            <coneGeometry args={[0.24, 0.18, 8]} />
            <meshStandardMaterial color="#EF4444" roughness={0.5} />
          </mesh>
          {/* White Mushroom Cap Spots */}
          <mesh position={[0.08, 0.32, 0.08]}>
            <sphereGeometry args={[0.03, 4, 4]} />
            <meshBasicMaterial color="#FFFFFF" />
          </mesh>
        </group>
      ))}
    </group>
  );
};

