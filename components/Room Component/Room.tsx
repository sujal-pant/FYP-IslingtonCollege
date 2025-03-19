"use client";

import { ReactNode } from "react";
import { ClientSideSuspense } from "@liveblocks/react";
import { LiveMap, LiveList, LiveObject } from "@liveblocks/client";
import { Layer } from "@/types/canvasRawTypes";
import { RoomProvider } from "@/liveblocks.config";

interface RoomProps {
  children: ReactNode; // Components to be rendered inside the room
  roomId: string; // Unique identifier for the collaboration room
  fallback: NonNullable<ReactNode> | null; // UI to display while loading data
}
/**
 * Room Component for Managing Live Collaboration State
 *
 * 
 * This component sets up a real-time collaborative environment using Liveblocks.
 * It initializes shared presence (cursor position, selected layers) and storage (canvas layers).
 *
 **/

export const Room = ({ children, roomId, fallback }: RoomProps) => {
  return (
    <RoomProvider
      id={roomId} // Assigning the unique room ID for Liveblocks session
      initialPresence={{
        cursor: null, // It Stores the user's cursor position (initially it store null)
        CurrentlySelectedLayer: [], // Tracks the layers selected by the 
        stroke: null, // Stores the drawing stroke data
        color: null, // Stores the selected color
      }}
      initialStorage={{
        layers: new LiveMap<string, LiveObject<Layer>>(), // Stores all layers using a map with unique IDs
        layerIds: new LiveList(), // Maintains a list of layer IDs to preserve order
      }}
    >
      {/* Suspense wrapper to handle loading states while fetching live data */}
      <ClientSideSuspense fallback={fallback}>
        {() => children}
      </ClientSideSuspense>
    </RoomProvider>
  );
};

