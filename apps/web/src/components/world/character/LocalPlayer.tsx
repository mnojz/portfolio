"use client";

import React, { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { CharacterMesh } from "./CharacterMesh";
import { useMultiplayerStore } from "@/stores/useMultiplayerStore";
import { useGameStore } from "@/stores/useGameStore";
import { useAudioStore } from "@/stores/useAudioStore";
import { useChatStore } from "@/stores/useChatStore";
import { LOCATIONS, WORLD_CONFIG } from "@mosswood/shared";
import { EASTER_EGGS } from "@/content/easter-eggs";

interface KeyState {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  run: boolean;
  jump: boolean;
}

// World Obstacles for simple AABB / radius collision
const OBSTACLES = [
  // Cottages & major structures
  { x: -18, z: -10, radius: 4.5 }, // The Home
  { x: 20, z: -8, radius: 5.5 },   // The Workshop
  { x: -20, z: 16, radius: 5.0 },  // The Library
  { x: -2, z: -22, radius: 4.0 },  // The Post Office
  { x: 0, z: -35, radius: 4.5 },   // The Lookout platform
  { x: 16, z: 18, radius: 4.0 },   // Pond main water basin (walkable on dock)
  { x: 28, z: 4, radius: 3.5 },    // Windmill
];

export const LocalPlayer: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();

  const myUsername = useMultiplayerStore((s) => s.myUsername);
  const myColor = useMultiplayerStore((s) => s.myColor);
  const myHat = useMultiplayerStore((s) => s.myHat);
  const sendMovement = useMultiplayerStore((s) => s.sendMovement);
  const sendEmote = useMultiplayerStore((s) => s.sendEmote);
  const nearbyPlayers = useMultiplayerStore((s) => s.nearbyPlayers);
  const sendChatInvite = useMultiplayerStore((s) => s.sendChatInvite);

  const isHomeUnlocked = useGameStore((s) => s.isHomeUnlocked);
  const openModal = useGameStore((s) => s.openModal);
  const setInteractionTarget = useGameStore((s) => s.setInteractionTarget);
  const setCurrentLocationName = useGameStore((s) => s.setCurrentLocationName);
  const unlockSecret = useGameStore((s) => s.unlockSecret);
  const setActiveEasterEgg = useGameStore((s) => s.setActiveEasterEgg);
  const triggerRandomJournal = useGameStore((s) => s.triggerRandomJournal);

  const playFootstep = useAudioStore((s) => s.playFootstep);
  const playChime = useAudioStore((s) => s.playChime);
  const playDiscovery = useAudioStore((s) => s.playDiscovery);

  const pendingInvite = useChatStore((s) => s.pendingInvite);
  const activePartner = useChatStore((s) => s.activePartner);

  // Character Kinematics
  const position = useRef(new THREE.Vector3(WORLD_CONFIG.DEFAULT_SPAWN.x, 0, WORLD_CONFIG.DEFAULT_SPAWN.z));
  const velocity = useRef(new THREE.Vector3(0, 0, 0));
  const rotationY = useRef(Math.PI);
  const isGrounded = useRef(true);
  const currentAnimation = useRef<"idle" | "walk" | "run" | "jump" | "wave" | "dance" | "sit">("idle");
  const stepTimer = useRef(0);
  const lastNetworkSend = useRef(0);

  // Camera Orbit angles
  const cameraAngle = useRef({ theta: Math.PI, phi: 0.35, distance: 7.5 });
  const isDragging = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  const keys = useRef<KeyState>({
    forward: false,
    backward: false,
    left: false,
    right: false,
    run: false,
    jump: false,
  });

  // Handle Keyboard Inputs
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing inside an input/textarea
      if (["INPUT", "TEXTAREA"].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      switch (e.code) {
        case "KeyW":
        case "ArrowUp":
          keys.current.forward = true;
          break;
        case "KeyS":
        case "ArrowDown":
          keys.current.backward = true;
          break;
        case "KeyA":
        case "ArrowLeft":
          keys.current.left = true;
          break;
        case "KeyD":
        case "ArrowRight":
          keys.current.right = true;
          break;
        case "ShiftLeft":
        case "ShiftRight":
          keys.current.run = true;
          break;
        case "Space":
          if (isGrounded.current) {
            velocity.current.y = 7.5;
            isGrounded.current = false;
            currentAnimation.current = "jump";
          }
          break;
        case "KeyE":
          // Contextual Interaction
          triggerContextualInteraction();
          break;
        case "Enter":
          // Quick Enter to Accept Chat or Invite Nearby Player
          if (pendingInvite) {
            useMultiplayerStore.getState().respondChatInvite(pendingInvite.fromId, true);
          } else if (nearbyPlayers.length > 0 && !activePartner) {
            sendChatInvite(nearbyPlayers[0].id);
          }
          break;
        case "Digit1":
          currentAnimation.current = "wave";
          sendEmote("wave");
          break;
        case "Digit2":
          currentAnimation.current = "dance";
          sendEmote("dance");
          break;
        case "Digit3":
          currentAnimation.current = "sit";
          sendEmote("sit");
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case "KeyW":
        case "ArrowUp":
          keys.current.forward = false;
          break;
        case "KeyS":
        case "ArrowDown":
          keys.current.backward = false;
          break;
        case "KeyA":
        case "ArrowLeft":
          keys.current.left = false;
          break;
        case "KeyD":
        case "ArrowRight":
          keys.current.right = false;
          break;
        case "ShiftLeft":
        case "ShiftRight":
          keys.current.run = false;
          break;
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      // Enable mouse drag orbit
      if ((e.target as HTMLElement).tagName === "CANVAS") {
        isDragging.current = true;
        lastMousePos.current = { x: e.clientX, y: e.clientY };
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const deltaX = e.clientX - lastMousePos.current.x;
      const deltaY = e.clientY - lastMousePos.current.y;
      lastMousePos.current = { x: e.clientX, y: e.clientY };

      cameraAngle.current.theta -= deltaX * 0.006;
      cameraAngle.current.phi = Math.max(0.1, Math.min(1.2, cameraAngle.current.phi + deltaY * 0.005));
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    const handleWheel = (e: WheelEvent) => {
      if ((e.target as HTMLElement).tagName === "CANVAS") {
        cameraAngle.current.distance = Math.max(3.5, Math.min(16, cameraAngle.current.distance + e.deltaY * 0.01));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("wheel", handleWheel, { passive: true });

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("wheel", handleWheel);
    };
  }, [nearbyPlayers, pendingInvite, activePartner]);

  // Contextual Interaction Trigger
  const triggerContextualInteraction = () => {
    const p = position.current;

    // Check 6 Locations
    for (const [key, loc] of Object.entries(LOCATIONS)) {
      const dist = Math.hypot(p.x - loc.coordinates.x, p.z - loc.coordinates.z);
      if (dist <= loc.radius) {
        playChime();
        if (loc.id === "home") {
          openModal("home");
        } else if (loc.id === "workshop") {
          openModal("workshop");
        } else if (loc.id === "pond") {
          openModal("pond");
        } else if (loc.id === "library") {
          openModal("library");
        } else if (loc.id === "post_office") {
          openModal("post_office");
        } else if (loc.id === "lookout") {
          openModal("lookout");
        }
        return;
      }
    }

    // Check Easter Eggs
    for (const egg of EASTER_EGGS) {
      const dist = Math.hypot(p.x - egg.coordinates.x, p.z - egg.coordinates.z);
      if (dist <= egg.radius) {
        const isNew = unlockSecret(egg.id);
        if (isNew) playDiscovery();
        else playChime();
        setActiveEasterEgg(egg);
        return;
      }
    }

    // Check Forgotten Journal near pond / campsite
    const journalDist = Math.hypot(p.x - 10, p.z - 22);
    if (journalDist <= 3.0) {
      playDiscovery();
      triggerRandomJournal();
    }
  };

  // Main Physics and Movement Loop
  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Gravity & Ground Check
    if (!isGrounded.current) {
      velocity.current.y -= 22 * delta;
      position.current.y += velocity.current.y * delta;
      if (position.current.y <= 0) {
        position.current.y = 0;
        velocity.current.y = 0;
        isGrounded.current = true;
      }
    }

    // Calculate movement vector relative to camera direction
    const moveX = (keys.current.right ? 1 : 0) - (keys.current.left ? 1 : 0);
    const moveZ = (keys.current.backward ? 1 : 0) - (keys.current.forward ? 1 : 0);

    const hasInput = moveX !== 0 || moveZ !== 0;

    if (hasInput && isGrounded.current) {
      const speed = keys.current.run ? 7.5 : 4.5;
      currentAnimation.current = keys.current.run ? "run" : "walk";

      // Input angle relative to camera
      const inputAngle = Math.atan2(moveX, moveZ);
      const moveAngle = cameraAngle.current.theta + inputAngle;

      // Desired velocity
      const targetVelX = Math.sin(moveAngle) * speed;
      const targetVelZ = Math.cos(moveAngle) * speed;

      // New potential position
      const nextX = position.current.x + targetVelX * delta;
      const nextZ = position.current.z + targetVelZ * delta;

      // Obstacle collision resolution
      let canMoveX = true;
      let canMoveZ = true;

      // Check map boundaries (-55 to +55)
      if (Math.abs(nextX) > 55) canMoveX = false;
      if (Math.abs(nextZ) > 55) canMoveZ = false;

      // Check solid obstacles
      for (const obs of OBSTACLES) {
        // If it's The Home and home is unlocked, allow entry
        if (obs.x === -18 && obs.z === -10 && isHomeUnlocked) {
          continue;
        }

        const distNext = Math.hypot(nextX - obs.x, nextZ - obs.z);
        if (distNext < obs.radius) {
          // Slide along obstacle tangent
          if (Math.hypot(nextX - obs.x, position.current.z - obs.z) < obs.radius) canMoveX = false;
          if (Math.hypot(position.current.x - obs.x, nextZ - obs.z) < obs.radius) canMoveZ = false;
        }
      }

      if (canMoveX) position.current.x = nextX;
      if (canMoveZ) position.current.z = nextZ;

      // Smooth rotation toward movement heading
      let diff = moveAngle - rotationY.current;
      diff = Math.atan2(Math.sin(diff), Math.cos(diff));
      rotationY.current += diff * (1 - Math.exp(-20 * delta));

      // Footstep sound interval
      stepTimer.current += delta;
      const stepInterval = keys.current.run ? 0.28 : 0.42;
      if (stepTimer.current >= stepInterval) {
        playFootstep();
        stepTimer.current = 0;
      }
    } else if (isGrounded.current && !["wave", "dance", "sit"].includes(currentAnimation.current)) {
      currentAnimation.current = "idle";
    }

    // Sync 3D Transform
    groupRef.current.position.copy(position.current);
    groupRef.current.rotation.y = rotationY.current;

    // Third-person Smooth Camera Follow
    const camDist = cameraAngle.current.distance;
    const camPhi = cameraAngle.current.phi;
    const camTheta = cameraAngle.current.theta;

    const camTargetX = position.current.x + Math.sin(camTheta) * Math.cos(camPhi) * camDist;
    const camTargetY = position.current.y + 1.2 + Math.sin(camPhi) * camDist;
    const camTargetZ = position.current.z + Math.cos(camTheta) * Math.cos(camPhi) * camDist;

    camera.position.lerp(new THREE.Vector3(camTargetX, camTargetY, camTargetZ), 1 - Math.exp(-12 * delta));
    camera.lookAt(position.current.x, position.current.y + 1.2, position.current.z);

    // Contextual Prompts & Current Location Detection
    updateProximityAndLocation(position.current);

    // Network Sync (20 ticks/sec)
    const now = performance.now();
    if (now - lastNetworkSend.current > 50) {
      lastNetworkSend.current = now;
      sendMovement({
        x: Math.round(position.current.x * 100) / 100,
        y: Math.round(position.current.y * 100) / 100,
        z: Math.round(position.current.z * 100) / 100,
        rotationY: Math.round(rotationY.current * 100) / 100,
        animation: currentAnimation.current,
      });
    }
  });

  const updateProximityAndLocation = (pos: THREE.Vector3) => {
    let activeLoc: string | null = null;
    let foundTarget = false;

    // Check Locations
    for (const [key, loc] of Object.entries(LOCATIONS)) {
      const dist = Math.hypot(pos.x - loc.coordinates.x, pos.z - loc.coordinates.z);
      if (dist <= loc.radius) {
        activeLoc = loc.name;
        setInteractionTarget({
          type: "location",
          id: loc.id,
          title: loc.name,
          promptText: `Press E to explore ${loc.name.split("—")[0].trim()}`,
        });
        foundTarget = true;
        break;
      }
    }

    // Check Easter Eggs
    if (!foundTarget) {
      for (const egg of EASTER_EGGS) {
        const dist = Math.hypot(pos.x - egg.coordinates.x, pos.z - egg.coordinates.z);
        if (dist <= egg.radius) {
          setInteractionTarget({
            type: "easter-egg",
            id: egg.id,
            title: egg.title,
            promptText: `Press E to inspect ${egg.title}`,
          });
          foundTarget = true;
          break;
        }
      }
    }

    // Check Forgotten Journal
    if (!foundTarget) {
      const journalDist = Math.hypot(pos.x - 10, pos.z - 22);
      if (journalDist <= 3.0) {
        setInteractionTarget({
          type: "journal",
          id: "forgotten-journal",
          title: "The Forgotten Journal",
          promptText: "Press E to read a random journal entry",
        });
        foundTarget = true;
      }
    }

    if (!foundTarget) {
      setInteractionTarget(null);
    }
    setCurrentLocationName(activeLoc || "Peaceful Meadows");
  };

  return (
    <group ref={groupRef} position={[WORLD_CONFIG.DEFAULT_SPAWN.x, 0, WORLD_CONFIG.DEFAULT_SPAWN.z]}>
      <CharacterMesh
        color={myColor}
        hat={myHat}
        animation={currentAnimation.current}
        username={myUsername}
        isOwner={useMultiplayerStore.getState().myHat === "crown"}
        isLocal={true}
      />
    </group>
  );
};

