"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PlayerData } from "@mosswood/shared";
import { CharacterMesh } from "./CharacterMesh";

interface RemotePlayerProps {
  player: PlayerData;
}

export const RemotePlayer: React.FC<RemotePlayerProps> = ({ player }) => {
  const groupRef = useRef<THREE.Group>(null);
  const targetPos = useRef(new THREE.Vector3(player.position.x, player.position.y, player.position.z));
  const targetRot = useRef(player.rotationY);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    targetPos.current.set(player.position.x, player.position.y, player.position.z);
    targetRot.current = player.rotationY;

    // Smooth interpolation (lerp) for remote player movement
    groupRef.current.position.lerp(targetPos.current, 1 - Math.exp(-15 * delta));

    // Smooth rotation lerp
    let diff = targetRot.current - groupRef.current.rotation.y;
    // Normalize diff to -PI .. PI
    diff = Math.atan2(Math.sin(diff), Math.cos(diff));
    groupRef.current.rotation.y += diff * (1 - Math.exp(-15 * delta));
  });

  return (
    <group
      ref={groupRef}
      position={[player.position.x, player.position.y, player.position.z]}
      rotation={[0, player.rotationY, 0]}
    >
      <CharacterMesh
        color={player.color}
        hat={player.hat}
        animation={player.animation}
        username={player.username}
        isOwner={player.isOwner}
        isLocal={false}
      />
    </group>
  );
};

