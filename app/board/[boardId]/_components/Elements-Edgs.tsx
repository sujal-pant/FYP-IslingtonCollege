"use client";

import { memo } from "react";
import { RectEdge, ResizeCoordinate } from "@/types/canvasRawTypes";
import { useSelf, useStorage } from "@/liveblocks.config";
import { useSelectedLayersBoundingBox } from "@/Custom-hooks/useSelectedLayersBoundingBox";

interface ElementEdgesProps {
  onResizeHandlePointerDown: (
    corner: RectEdge,
    initialBounds: ResizeCoordinate
  ) => void;
}

const RESIZE_HANDLE_SIZE = 8; // Constant for the size of the resize handles.

const HANDLE_POSITIONS = [
  // Defining the positions and cursor styles for resizing at the corners and edges of the selected element.
  { edge: RectEdge.Top + RectEdge.Left, cursor: "nwse-resize", x: 0, y: 0 },
  { edge: RectEdge.Top, cursor: "ns-resize", x: 0.5, y: 0 },
  { edge: RectEdge.Top + RectEdge.Right, cursor: "nesw-resize", x: 1, y: 0 },
  { edge: RectEdge.Right, cursor: "ew-resize", x: 1, y: 0.5 },
  { edge: RectEdge.Bottom + RectEdge.Right, cursor: "nwse-resize", x: 1, y: 1 },
  { edge: RectEdge.Bottom, cursor: "ns-resize", x: 0.5, y: 1 },
  { edge: RectEdge.Bottom + RectEdge.Left, cursor: "nesw-resize", x: 0, y: 1 },
  { edge: RectEdge.Left, cursor: "ew-resize", x: 0, y: 0.5 },
];

export const Elementedgs = memo(
  ({ onResizeHandlePointerDown }: ElementEdgesProps) => {
    // Fetching the selected layer ID from the liveblocks.
    const selectedLayerId = useSelf((me) =>
      me.presence.CurrentlySelectedLayer.length === 1
        ? me.presence.CurrentlySelectedLayer[0]
        : null
    );

    // Checking if the handles should be visible based on the selected layer.
    const shouldShowHandles = useStorage(
      (root) => selectedLayerId && root.layers.get(selectedLayerId)
    );

    // Getting the bounding box of the selected layers.
    const selectedLayerBounds = useSelectedLayersBoundingBox();

    // If there's no bounding box
    if (!selectedLayerBounds) return null;

    return (
      <>
        {/* Rendering a transparent rectangle representing the selection area */}
        <rect
          className="fill-transparent stroke-blue-500 stroke-1 pointer-events-none"
          style={{
            transform: `translate(${selectedLayerBounds.x}px, ${selectedLayerBounds.y}px)`,
          }} // Positioning the selection box.
          x={0}
          y={0}
          width={selectedLayerBounds.width}
          height={selectedLayerBounds.height}
        />

        {/* Rendering resize handles */}
        {shouldShowHandles &&
          HANDLE_POSITIONS.map(({ edge, cursor, x, y }) => (
            <rect
              key={edge}
              className="fill-white stroke-1 stroke-blue-500"
              style={{
                cursor, // Useing the appropriate cursor for resizing.
                width: RESIZE_HANDLE_SIZE, // Size of the handle.
                height: RESIZE_HANDLE_SIZE,
                transform: `translate(
              ${selectedLayerBounds.x + x * selectedLayerBounds.width - RESIZE_HANDLE_SIZE / 2}px,
              ${selectedLayerBounds.y + y * selectedLayerBounds.height - RESIZE_HANDLE_SIZE / 2}px
            )`, // Positioning the handle at the correct spot relative to the bounding box.
              }}
              onPointerDown={(e) => {
                e.stopPropagation(); // Prevent other events from firing.
                onResizeHandlePointerDown(edge, selectedLayerBounds); // Calling the passed function to handle the resizing logic.
              }}
            />
          ))}
      </>
    );
  }
);

Elementedgs.displayName = "SelectionBox";
