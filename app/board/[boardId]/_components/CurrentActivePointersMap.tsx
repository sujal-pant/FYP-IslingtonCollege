"use client"; // Ensures this component runs on the client side

import { memo } from "react";
import { useOthersConnectionIds } from "@/liveblocks.config";
import { CursorPresence } from "./Cursor-Presence";

/* This component maps over all active users' connection IDs 
and renders a CursorPresence component for each user.
*/
const CurrentActivePointersMap = () => {
  const usersId = useOthersConnectionIds(); // Fetching all active user connection IDs

  return (
    <g>
      {usersId.map((connectionId) => (
        <CursorPresence key={connectionId} connectionId={connectionId} />
      ))}
    </g>
  );
};

// Memoized wrapper to prevent unnecessary re-renders
export const CurrentActivePointers = memo(() => {
  return (
    <>
      <CurrentActivePointersMap />
    </>
  );
});

CurrentActivePointersMap.displayName = "CurrentActivePointersMap";
