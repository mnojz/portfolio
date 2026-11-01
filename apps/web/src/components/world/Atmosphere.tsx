"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useGameStore } from "@/stores/useGameStore";

export const Atmosphere: React.FC = () => {
  const timeOfDay = useGameStore((s) => s.timeOfDay);
  const sunLightRef = useRef<THREE.DirectionalLight>(null);
  const cloudsGroupRef = useRef<THREE.Group>(null);
  const firefliesRef = useRef<THREE.Points>(null);

  // Cloud positions
  const clouds = useMemo(() => {
    return [
      { x: -30, y: 22, z: -20, scale: 1.4 },
      { x: 10, y: 25, z: -40, scale: 2.0 },
      { x: 35, y: 20, z: 15, scale: 1.6 },
      { x: -20, y: 24, z: 30, scale: 1.8 },
      { x: 5, y: 23, z: 25, scale: 1.3 },
    ];
  }, []);

  // Night Fireflies Geometry
  const firefliesData = useMemo(() => {
    const count = 45;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Clustered around pond and meadows
      positions[i * 3] = (Math.random() - 0.3) * 60;
      positions[i * 3 + 1] = 0.5 + Math.random() * 2.5;
      positions[i * 3 + 2] = (Math.random() - 0.2) * 60;
    }
    return positions;
  }, []);

  // Calculate Sun / Ambient lighting based on timeOfDay (0 - 24)
  const isNight = timeOfDay < 5.5 || timeOfDay > 20.5;
  const isSunset = (timeOfDay >= 18 && timeOfDay <= 20.5) || (timeOfDay >= 5 && timeOfDay <= 6.5);

  const sunAngle = ((timeOfDay - 6) / 12) * Math.PI; // Peak at 12
  const sunX = Math.cos(sunAngle) * 50;
  const sunY = Math.max(1, Math.sin(sunAngle) * 45);
  const sunZ = -25;

  const sunColor = isSunset ? "#F59E0B" : isNight ? "#60A5FA" : "#FFF7ED";
  const skyColor = isNight ? "#0F172A" : isSunset ? "#D97706" : "#7DD3FC";
  const groundColor = isNight ? "#064E3B" : "#365314";
  const lightIntensity = isNight ? 0.25 : isSunset ? 1.0 : 1.4;

  useFrame((state, delta) => {
    // Drifting clouds
    if (cloudsGroupRef.current) {
      cloudsGroupRef.current.position.x += delta * 0.8;
      if (cloudsGroupRef.current.position.x > 50) {
        cloudsGroupRef.current.position.x = -50;
      }
    }

    // Firefly floating motion
    if (firefliesRef.current && isNight) {
      const pos = firefliesRef.current.geometry.attributes.position;
      const time = state.clock.getElapsedTime();
      for (let i = 0; i < pos.count; i++) {
        const y = pos.getY(i);
        pos.setY(i, y + Math.sin(time * 2 + i) * 0.005);
      }
      pos.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* Background Color & Fog */}
      <color attach="background" args={[skyColor]} />
      <fog attach="fog" args={[skyColor, 40, 95]} />

      {/* Sun / Moon Directional Light */}
      <directionalLight
        ref={sunLightRef}
        position={[sunX, sunY, sunZ]}
        intensity={lightIntensity}
        color={sunColor}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={1}
        shadow-camera-far={110}
        shadow-camera-top={40}
        shadow-camera-right={40}
        shadow-camera-bottom={-40}
        shadow-camera-left={-40}
        shadow-bias={-0.0005}
      />

      {/* Hemispheric Ambient Light */}
      <hemisphereLight args={[skyColor, groundColor, isNight ? 0.35 : 0.7]} />

      {/* Drifting Low-Poly Puffy Clouds */}
      <group ref={cloudsGroupRef}>
        {clouds.map((c, i) => (
          <group key={`cloud_${i}`} position={[c.x, c.y, c.z]} scale={c.scale}>
            <mesh castShadow receiveShadow>
              <sphereGeometry args={[2.5, 7, 7]} />
              <meshStandardMaterial color={isSunset ? "#FED7AA" : "#FFFFFF"} roughness={0.9} flatShading />
            </mesh>
            <mesh position={[-2.0, -0.4, 0]} castShadow receiveShadow>
              <sphereGeometry args={[1.8, 7, 7]} />
              <meshStandardMaterial color={isSunset ? "#FED7AA" : "#FFFFFF"} roughness={0.9} flatShading />
            </mesh>
            <mesh position={[2.2, -0.3, 0.2]} castShadow receiveShadow>
              <sphereGeometry args={[1.9, 7, 7]} />
              <meshStandardMaterial color={isSunset ? "#FED7AA" : "#FFFFFF"} roughness={0.9} flatShading />
            </mesh>
            <mesh position={[0.5, 0.8, -0.4]} castShadow receiveShadow>
              <sphereGeometry args={[1.6, 7, 7]} />
              <meshStandardMaterial color={isSunset ? "#FED7AA" : "#FFFFFF"} roughness={0.9} flatShading />
            </mesh>
          </group>
        ))}
      </group>

      {/* Starry Night Sky & Glowing Crescent Moon */}
      {isNight && (
        <group>
          {/* Glowing Moon */}
          <mesh position={[-30, 38, -45]}>
            <sphereGeometry args={[3.2, 16, 16]} />
            <meshBasicMaterial color="#FEF08A" />
          </mesh>
          <pointLight position={[-30, 38, -45]} color="#FEF08A" intensity={1.2} distance={80} />

          {/* Twinkling Fireflies */}
          <points ref={firefliesRef}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={firefliesData.length / 3}
                array={firefliesData}
                itemSize={3}
              />
            </bufferGeometry>
            <pointsMaterial size={0.35} color="#A3E635" transparent opacity={0.85} />
          </points>
        </group>
      )}
    </group>
  );
};

