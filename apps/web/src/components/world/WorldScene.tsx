"use client";

import React from "react";
import { Atmosphere } from "./Atmosphere";
import { Terrain } from "./Terrain";
import { WaterPond } from "./WaterPond";
import { Foliage } from "./Foliage";
import { Props } from "./Props";
import { HomeLocation } from "./locations/HomeLocation";
import { WorkshopLocation } from "./locations/WorkshopLocation";
import { PondLocation } from "./locations/PondLocation";
import { LibraryLocation } from "./locations/LibraryLocation";
import { PostOfficeLocation } from "./locations/PostOfficeLocation";
import { LookoutLocation } from "./locations/LookoutLocation";
import { LocalPlayer } from "./character/LocalPlayer";
import { RemotePlayer } from "./character/RemotePlayer";
import { useMultiplayerStore } from "@/stores/useMultiplayerStore";

export const WorldScene: React.FC = () => {
  const remotePlayers = useMultiplayerStore((s) => s.remotePlayers);

  return (
    <group>
      {/* Dynamic Synchronized Atmosphere (Day/Night, Clouds, Moon, Fireflies) */}
      <Atmosphere />

      {/* Low-Poly Rolling Green Meadow Terrain & Paths */}
      <Terrain />

      {/* Animated Stylized Water Pond & Fishing Dock */}
      <WaterPond />

      {/* Low-Poly Trees, Bushes, Apples, Mushrooms & Flowers */}
      <Foliage />

      {/* Village Props: Windmill, Bridge, Fences, Lanterns, Campsite, Entrance Sign */}
      <Props />

      {/* The 6 Interactive Portfolio Locations */}
      <HomeLocation />
      <WorkshopLocation />
      <PondLocation />
      <LibraryLocation />
      <PostOfficeLocation />
      <LookoutLocation />

      {/* Local Controllable Player */}
      <LocalPlayer />

      {/* Remote Synchronized Visitors */}
      {Object.values(remotePlayers).map((player) => (
        <RemotePlayer key={player.sessionId} player={player} />
      ))}
    </group>
  );
};

