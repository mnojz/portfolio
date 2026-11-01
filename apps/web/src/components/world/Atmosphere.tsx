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
      { x: -32, y: 24, z: -22, scale: 1.5 },
      { x: 12, y: 26, z: -42, scale: 2.1 },
      { x: 38, y: 22, z: 12, scale: 1.7 },
      { x: -22, y: 25, z: 28, scale: 1.9 },
      { x: 6, y: 24, z: 22, scale: 1.4 },
    ];
  }, []);

  // Night Fireflies Geometry
  const firefliesData = useMemo(() => {
    const count = 50;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.3) * 65;
      positions[i * 3 + 1] = 0.6 + Math.random() * 2.8;
      positions[i * 3 + 2] = (Math.random() - 0.2) * 65;
    }
    return positions;
  }, []);

  const isNight = timeOfDay < 5.5 || timeOfDay > 20.5;
  const isSunset = (timeOfDay >= 18 && timeOfDay <= 20.5) || (timeOfDay >= 5 && timeOfDay <= 6.5);

  const sunAngle = ((timeOfDay - 6) / 12) * Math.PI;
  const sunX = Math.cos(sunAngle) * 52;
  const sunY = Math.max(2, Math.sin(sunAngle) * 48);
  const sunZ = -28;

  // Harmonized soft color palette
  const skyColor = isNight ? "#0C1222" : isSunset ? "#F59E0B" : "#7CC2F2";
  const horizonColor = isNight ? "#090E1A" : isSunset ? "#FB7185" : "#BAE6FD";
  const groundAmbient = isNight ? "#064E3B" : isSunset ? "#78350F" : "#4A7C59";
  const sunColor = isSunset ? "#FBBF24" : isNight ? "#93C5FD" : "#FFFBEB";
  const sunIntensity = isNight ? 0.3 : isSunset ? 1.2 : 1.5;

  useFrame((state, delta) => {
    if (cloudsGroupRef.current) {
      cloudsGroupRef.current.position.x += delta * 0.7;
      if (cloudsGroupRef.current.position.x > 50) {
        cloudsGroupRef.current.position.x = -50;
      }
    }

    if (firefliesRef.current && isNight) {
      const pos = firefliesRef.current.geometry.attributes.position;
      const time = state.clock.getElapsedTime();
      for (let i = 0; i < pos.count; i++) {
        const y = pos.getY(i);
        pos.setY(i, y + Math.sin(time * 2 + i) * 0.006);
      }
      pos.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* Background & Atmospheric Fog */}
      <color attach="background" args={[skyColor]} />
      <fog attach="fog" args={[horizonColor, 45, 100]} />

      {/* Main Directional Sunlight */}
      <directionalLight
        ref={sunLightRef}
        position={[sunX, sunY, sunZ]}
        intensity={sunIntensity}
        color={sunColor}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={1}
        shadow-camera-far={120}
        shadow-camera-top={45}
        shadow-camera-right={45}
        shadow-camera-bottom={-45}
        shadow-camera-left={-45}
        shadow-bias={-0.0004}
      />

      {/* Ambient Fill Light */}
      <hemisphereLight args={[skyColor, groundAmbient, isNight ? 0.45 : 0.85]} />
      <ambientLight intensity={isNight ? 0.2 : 0.35} color="#FFF8F0" />

      {/* Drifting Stylized Low-Poly Clouds */}
      <group ref={cloudsGroupRef}>
        {clouds.map((c, i) => (
          <group key={`cloud_${i}`} position={[c.x, c.y, c.z]} scale={c.scale}>
            <mesh castShadow receiveShadow>
              <sphereGeometry args={[2.6, 8, 8]} />
              <meshStandardMaterial color={isSunset ? "#FED7AA" : "#FFFFFF"} roughness={0.9} flatShading />
            </mesh>
            <mesh position={[-2.1, -0.3, 0]} castShadow receiveShadow>
              <sphereGeometry args={[1.9, 8, 8]} />
              <meshStandardMaterial color={isSunset ? "#FED7AA" : "#FFFFFF"} roughness={0.9} flatShading />
            </mesh>
            <mesh position={[2.3, -0.2, 0.2]} castShadow receiveShadow>
              <sphereGeometry args={[2.0, 8, 8]} />
              <meshStandardMaterial color={isSunset ? "#FED7AA" : "#FFFFFF"} roughness={0.9} flatShading />
            </mesh>
            <mesh position={[0.4, 0.9, -0.3]} castShadow receiveShadow>
              <sphereGeometry args={[1.7, 8, 8]} />
              <meshStandardMaterial color={isSunset ? "#FED7AA" : "#FFFFFF"} roughness={0.9} flatShading />
            </mesh>
          </group>
        ))}
      </group>

      {/* Night Sky: Moon & Fireflies */}
      {isNight && (
        <group>
          <mesh position={[-32, 40, -48]}>
            <sphereGeometry args={[3.4, 16, 16]} />
            <meshBasicMaterial color="#FEF08A" />
          </mesh>
          <pointLight position={[-32, 40, -48]} color="#FEF08A" intensity={1.4} distance={90} />

          <points ref={firefliesRef}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={firefliesData.length / 3}
                array={firefliesData}
                itemSize={3}
              />
            </bufferGeometry>
            <pointsMaterial size={0.35} color="#FBBF24" transparent opacity={0.9} />
          </points>
        </group>
      )}
    </group>
  );
};
