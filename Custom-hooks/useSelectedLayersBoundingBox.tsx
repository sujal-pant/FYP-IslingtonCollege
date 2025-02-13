import { shallow } from '@liveblocks/react';
import { Layer, ResizeCoordinate } from '@/types/canvasRawTypes';
import { useStorage, useSelf } from '@/liveblocks.config';

/**
 * 
 * This function determines the minimum and maximum x/y coordinates among the layers
 * to create a box that fully encloses them. If no layers exist,then the code  returns `null`.
 */
const getBoundingBox = (layers: Layer[]): ResizeCoordinate | null => {
  if (layers.length === 0) {
    return null; // No layers selected, so no bounding box is needed
  }

  return layers.reduce(
    (box, { x, y, width, height }) => ({
      x: Math.min(box.x, x), // Leftmost x-coordinate
      y: Math.min(box.y, y), // Topmost y-coordinate
      width: Math.max(box.x + box.width, x + width) - Math.min(box.x, x), // Total width
      height: Math.max(box.y + box.height, y + height) - Math.min(box.y, y), // Total height
    }),
    { x: layers[0].x, y: layers[0].y, width: layers[0].width, height: layers[0].height }
  );
};

/**
 * This hook listens to the user's selection and dynamically calculates the
 * smallest box that encapsulates all selected layers. It updates in real-time
 * as the selection changes.
 */
export const useSelectedLayersBoundingBox = () => {
  // Retrieving the currently selected layer IDs from the user's presence
  const selectedLayerIds = useSelf((me) => me.presence.CurrentlySelectedLayer);

  return useStorage(
    (root) => {
      // Mapping layer IDs to actual layer objects stored in Liveblocks
      const selectedLayers = selectedLayerIds
        .map((layerId) => root.layers.get(layerId)!) // Fetching each selected layer from storage
        .filter(Boolean); // Removing any null/undefined entries

      return getBoundingBox(selectedLayers); // Computing the bounding box
    },
    shallow // Ensuring the hook only re-renders when necessary
  );
};
