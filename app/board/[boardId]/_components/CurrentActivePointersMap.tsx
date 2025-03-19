"use client"; // Ensures this component runs on the client side

import { memo } from "react";
import { useOthersConnectionIds, useOthersMapped } from "@/liveblocks.config";
import { CursorPresence } from "./Cursor-Presence";
import { shallow } from "@liveblocks/client";
import { PenTool } from "./Pen-Tool-Component";
import { colors } from "@/utils/utils";

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

const Otheruserpen = () => {
  const others = useOthersMapped(
    other => ({
      other_strokes: other.presence.stroke,
      other_user_color: other.presence.color,
    }),
    shallow
  )
  return others.map(([key, other]) => {
    if (other.other_strokes)
      return (
        <PenTool
          key={key}
          x={0}
          y={0}
          points={other.other_strokes}
          fill={other.other_user_color ? colors(other.other_user_color) : '#000'}
        />
      )

    return null
  })
}

// Memoized wrapper to prevent unnecessary re-renders
export const CurrentActivePointers = memo(() => {
  return (
    <>
      <CurrentActivePointersMap />
      <Otheruserpen/>
    </>
  );
});

CurrentActivePointersMap.displayName = "CurrentActivePointersMap";
