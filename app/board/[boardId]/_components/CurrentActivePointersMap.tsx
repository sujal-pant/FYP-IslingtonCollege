"use client";
import { memo } from "react";
import { useOthersConnectionIds } from "@/liveblocks.config";
import { Pointer } from "./Pointer";
const CurrentActivePointersMap = () => {
  const users_id = useOthersConnectionIds();
  return (
    <g>
      { users_id.map((connectionId) => (
        <Pointer key={connectionId} connectionId={connectionId} />
      ))}
    </g>
  );
};
export const CurrentActivePointers = memo(() => {
  return (
    <>
      <CurrentActivePointersMap />
    </>
  );
});
CurrentActivePointersMap.displayName = "CurrentActivePointersMap";
