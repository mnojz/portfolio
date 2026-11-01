"use client";

import React, { useMemo } from "react";
import * as THREE from "three";

export const Terrain: React.FC = () => {
  const { geometry } = useMemo(() => {
    const size = 120;
    const segments = 48;
    const geo = new THREE.PlaneGeometry(size, size, segments, segments);
    geo.rotateX(-Math.PI / 2);

    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);

      let y = 0;

      // Gentle rolling countryside hills
      y += Math.sin(x * 0.05) * Math.cos(z * 0.05) * 0.75;
      y += Math.sin(x * 0.09) * 0.25;

      // The Lookout hill elevation at the northern edge (z: -20 to -50)
      if (z < -20) {
        const hillFactor = Math.min(1, (-z - 20) / 18);
        const hillShape = Math.cos((x / 20) * (Math.PI / 2));
        if (Math.abs(x) < 20) {
          y += hillFactor * hillShape * 4.8;
        }
      }

      // Pond depression at (x: 16, z: 18)
      const pondDist = Math.hypot(x - 16, z - 18);
      if (pondDist < 9) {
        const depth = (1 - pondDist / 9) * 1.5;
        y -= depth;
      }

      // Smooth central crossroads
      const centerDist = Math.hypot(x, z - 12);
      if (centerDist < 8) {
        y *= 0.15;
      }

      pos.setY(i, y);
    }
    geo.computeVertexNormals();
    return { geometry: geo };
  }, []);

  return (
    <group>
      {/* Meadow Terrain */}
      <mesh geometry={geometry} receiveShadow>
        <meshStandardMaterial
          color="#5B9A60"
          roughness={0.85}
          metalness={0.02}
          flatShading={true}
        />
      </mesh>

      {/* Stylized Village Paths */}
      <group position={[0, 0.02, 0]}>
        {/* Central Crossroads Plaza */}
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <circleGeometry args={[5.5, 18]} />
          <meshStandardMaterial color="#C8B38E" roughness={0.88} flatShading />
        </mesh>

        {/* Path to The Home (West) */}
        <mesh position={[-9, 0.01, -4]} rotation={[-Math.PI / 2, 0, 0.4]} receiveShadow>
          <planeGeometry args={[16, 2.8]} />
          <meshStandardMaterial color="#C8B38E" roughness={0.88} flatShading />
        </mesh>

        {/* Path to The Workshop (East) */}
        <mesh position={[10, 0.01, -3]} rotation={[-Math.PI / 2, 0, -0.3]} receiveShadow>
          <planeGeometry args={[18, 2.8]} />
          <meshStandardMaterial color="#C8B38E" roughness={0.88} flatShading />
        </mesh>

        {/* Path to The Library (South-West) */}
        <mesh position={[-10, 0.01, 9]} rotation={[-Math.PI / 2, 0, -0.7]} receiveShadow>
          <planeGeometry args={[18, 2.6]} />
          <meshStandardMaterial color="#C8B38E" roughness={0.88} flatShading />
        </mesh>

        {/* Path to The Pond (South-East) */}
        <mesh position={[8, 0.01, 10]} rotation={[-Math.PI / 2, 0, 0.7]} receiveShadow>
          <planeGeometry args={[16, 2.6]} />
          <meshStandardMaterial color="#C8B38E" roughness={0.88} flatShading />
        </mesh>

        {/* Path to The Post Office (North-Center) */}
        <mesh position={[-1, 0.01, -12]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[3.0, 18]} />
          <meshStandardMaterial color="#C8B38E" roughness={0.88} flatShading />
        </mesh>

        {/* Path climbing to The Lookout (North) */}
        <mesh position={[0, 1.2, -28]} rotation={[-Math.PI / 2, 0.12, 0]} receiveShadow>
          <planeGeometry args={[3.2, 16]} />
          <meshStandardMaterial color="#B09C76" roughness={0.9} flatShading />
        </mesh>

        {/* Stepping Stones scattered along paths */}
        {[-3, -1, 2, 5, 8, -6, -11].map((offset, i) => (
          <mesh
            key={`stone_${i}`}
            position={[offset * 1.5, 0.04, offset * 0.8]}
            rotation={[-Math.PI / 2, 0, (i * 45 * Math.PI) / 180]}
            receiveShadow
          >
            <cylinderGeometry args={[0.42, 0.52, 0.06, 6]} />
            <meshStandardMaterial color="#8898A6" roughness={0.9} flatShading />
          </mesh>
        ))}
      </group>
    </group>
  );
};
