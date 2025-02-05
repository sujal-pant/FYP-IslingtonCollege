'use client';

import { nanoid } from 'nanoid';
import { useCallback, useMemo, useState,useEffect } from 'react';

import { 
  useHistory, 
  useCanUndo, 
  useCanRedo, 
  useMutation, 
  useStorage, 
  useOthersMapped 
} from '@/liveblocks.config';

import {
  Camera,
  CanvasMode,
  CanvasState,
  Color,
  LayerType,
  Point,
  RectEdge,
  ResizeCoordinate,
} from '@/types/canvasRawTypes';

import { CanvasInfo } from './Canvas-Info';
import { CanvasToolbar } from './Canvas-ToolBar';
import { CurrentActiveParticipants } from './Current-Active-Participants';
import { CurrentActivePointers } from './CurrentActivePointersMap';
import { DifferentLayerRenderInformation } from './Different-Layer-Render-formation';
import { Elementedgs } from './Elements-Edgs';

import { usercolor, getCanvasCoordinatesFromPointer , resizeBoundary } from '@/utils/utils';
import { LiveObject } from '@liveblocks/client';
import { SelectionTools } from './Canvas-Additional-Tools'; 
import { deletelayerhook } from '@/Custom-hooks/Delete-Layer-hook';

const MAX_NUM_LAYER = 100;

interface CanvasProps {
  boardId: string;
}

export const Canvas = ({ boardId }: CanvasProps) => {
  const LayerIds = useStorage((root) => root.layerIds);

  const [canvasState, setCanvasState] = useState<CanvasState>({
    mode: CanvasMode.Empty,
  });

  const [camera, setCamera] = useState<Camera>({ x: 0, y: 0 });
  const [LastUsedColor, setLastUsedColor] = useState<Color>({
    r: 0,
    g: 0,
    b: 0,
  });

  const history = useHistory();
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();


  /*
  This function adds a new layer to the canvas by generating a unique ID, setting its initial position, dimensions, 
  and fill color, and storing it in the layer collection. It also ensures the maximum layer limit is not exceeded, updates
  the user's selected layer, and resets the canvas state after insertion.
  */
  const AddlayerOnCanvas = useMutation(
    (
      { storage, setMyPresence },
      layerType: LayerType.Ellipse | LayerType.RectangleBox | LayerType.TextBox | LayerType.StickyNote,
      positionOnScreen: Point
    ) => {
      const infoAllLayers = storage.get('layers');
      if (infoAllLayers.size >= MAX_NUM_LAYER) return;

      const infoAllLayerIds = storage.get('layerIds');
      const newlayerId = nanoid();
      const newInsertlayer = new LiveObject({
        type: layerType,
        x: positionOnScreen.x,
        y: positionOnScreen.y,
        height: 100,
        width: 100,
        fill: LastUsedColor,
      });

      infoAllLayerIds.push(newlayerId);
      infoAllLayers.set(newlayerId, newInsertlayer);

      setMyPresence({ CurrentlySelectedLayer: [newlayerId] }, { addToHistory: true });
      setCanvasState({ mode: CanvasMode.Empty });
    },
    [LastUsedColor]
  );

  const MoveSelectedlayers = useMutation(
    ({ storage, self }, point: Point) => {
      if (canvasState.mode !== CanvasMode.Transforming) {
        return
      }

      const offset = {
        x: point.x - canvasState.current.x,
        y: point.y - canvasState.current.y,
      }

      const liveLayers = storage.get('layers')

      for (const id of self.presence.CurrentlySelectedLayer) {
        const layer = liveLayers.get(id)

        if (layer) {
          layer.update({
            x: layer.get('x') + offset.x,
            y: layer.get('y') + offset.y,
          })
        }
      }

      setCanvasState({ mode: CanvasMode.Transforming, current: point })
    },
    [canvasState]
  )
  const clearSelection = useMutation(({ self, setMyPresence }) => {
    if (self.presence.CurrentlySelectedLayer.length > 0) {
      setMyPresence({ CurrentlySelectedLayer: [] }, { addToHistory: true })
    }
  }, [])

  const resizeLayer = useMutation(
    ({ storage, self }, point: Point) => {
      if (canvasState.mode !== CanvasMode.Resizing) {
        return
      }

      const bounds = resizeBoundary(
        canvasState.initialBounds,
        canvasState.corner,
        point
      )

      const liveLayers = storage.get('layers')
      const layer = liveLayers.get(self.presence.CurrentlySelectedLayer[0])

      if (layer) {
        layer.update(bounds)
      }
    },
    [canvasState]
  )
  const handleResizeStart = useCallback(
    (corner: RectEdge, initialBounds: ResizeCoordinate) => {
      history.pause()
      setCanvasState({
        mode: CanvasMode.Resizing,
        initialBounds,
        corner,
      })
    },
    [history]
  )

  const handleCameraMove = useCallback((e: React.WheelEvent) => {
    setCamera(camera => ({
      x: camera.x - e.deltaX,
      y: camera.y - e.deltaY,
    }))
  }, [])


   
  const handlePointerMove = useMutation(
    ({ setMyPresence }, e: React.PointerEvent) => {
      e.preventDefault();

      const current = getCanvasCoordinatesFromPointer (e, camera);
      
      if (canvasState.mode === CanvasMode.Transforming) {
        MoveSelectedlayers(current);
      }
      else if(canvasState.mode === CanvasMode.Resizing) {
        resizeLayer(current);
      }

      setMyPresence({ cursor: current });
    },
    [camera, canvasState, resizeLayer,MoveSelectedlayers]
  );
  
  const handlePointerLeave = useMutation(({ setMyPresence }) => {
    setMyPresence({ cursor: null })
  }, [])

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      const point = getCanvasCoordinatesFromPointer (e, camera)

      if (canvasState.mode === CanvasMode.Inserting) {
        return
      }

      

      setCanvasState({ origin: point, mode: CanvasMode.Clicking })
    },
    [camera, canvasState.mode, setCanvasState, ]
  )

/*
  The handlePointerUp function is a mutation hook that manages the pointer-up event within the canvas. 
  It updates the canvas state based on the current interaction mode. If the canvas is in Empty or Clicking mode,
  it clears any selection and resets the canvas state. If the mode is Inserting, it adds a new layer to the canvas at the specified position. 
  After each interaction, the function resumes history tracking, ensuring all actions are recorded.
*/
const handlePointerUp = useMutation(
  ({}, e) => {
    // Getting the canvas coordinates from the pointer event and the camera position
    const point = getCanvasCoordinatesFromPointer(e, camera)

    // Checking the current canvas state mode
    if (
      canvasState.mode === CanvasMode.Empty || // If in Empty mode or clicking mode
      canvasState.mode === CanvasMode.Clicking
    ) {
      // Clearing any selection and reseting canvas mode to Empty
      clearSelection()
      setCanvasState({
        mode: CanvasMode.Empty, // Setting the canvas state back to Empty
      })
    } else if (canvasState.mode === CanvasMode.Inserting) {
      // If the current mode is Inserting, adding the a newly created layer to the canvas
      AddlayerOnCanvas(canvasState.layerType, point)
    } else {
      // For any other modes, reseting canvas state to Empty
      setCanvasState({
        mode: CanvasMode.Empty,
      })
    }

    // Resuming history tracking 
    history.resume()
  },
  [
    setCanvasState, // Function to update canvas state
    camera, // Current camera position
    canvasState, // Current canvas state
    history, // History object to track changes
    AddlayerOnCanvas, // Function to add layers to the canvas
    clearSelection, // Function to clear any selected layers
  ]
)
/*
 This CurrentSelectedLayers retrieves the currently selected layer of other users in real-time. 
 It collects this data to track which layers are being selected by all users.
*/  
const CurrentSelectedLayers = useOthersMapped((user) => user.presence.CurrentlySelectedLayer);
  
/* The mapColorToLayerByConnId function creates a mapping of layer IDs to colors based on user selections.
 It uses 'useMemo' to ensure that the mapping is only recalculated when 'CurrenetSelectedLayers' changes.
*/
  const mapColorToLayarByConnId = useMemo(() => {
    // Initializing an empty object to store the mapping of layer IDs to colors
    const ColorAsPerConnIds: Record<string, string> = {};
  // Iterating over each user and their selected layers

    for (const user of CurrentSelectedLayers) {
      const [connectionId, CurrentlySelectedLayer] = user;
    // Iterating over each selected layer and mapping the layerId to the corresponding color based on connectionId

      for (const layerId of CurrentlySelectedLayer) {
        ColorAsPerConnIds[layerId] = usercolor(connectionId);// Assigning color for each layer
      }
    }

    return ColorAsPerConnIds;
  }, [CurrentSelectedLayers]);
  

  const handleLayerPointerDown = useMutation(
    ({ self, setMyPresence }, e: React.PointerEvent, layerId: string) => {
      if (canvasState.mode === CanvasMode.Freehand || canvasState.mode === CanvasMode.Inserting) {
        return;
      }

      history.pause();
      e.stopPropagation();

      const point = getCanvasCoordinatesFromPointer (e, camera);

      if (!self.presence.CurrentlySelectedLayer.includes(layerId)) {
        setMyPresence({ CurrentlySelectedLayer: [layerId] }, { addToHistory: true });
      }

      setCanvasState({ mode: CanvasMode.Transforming, current: point });
    },
    [canvasState, camera, history,canvasState.mode]
  );
  const deleteCurrent = deletelayerhook();

useEffect(() => {
  function onKeyDown(e: KeyboardEvent) {
    switch (e.key) {
      case 'z': {
        if (e.ctrlKey || e.metaKey) {
          // Undo
          history.undo();
          break;
        }
        break;
      }
      case 'y': {
        if (e.ctrlKey || e.metaKey) {
          // Redo
          history.redo();
          break;
        }
        break;
      }
      case 'd': {
        if (e.ctrlKey || e.metaKey) {
          // Delete
          deleteCurrent();
          e.preventDefault(); 
          break;
        }
        break;
      }
      default:
        break;
    }
  }

  // Adding event listener on component mount
  window.addEventListener('keydown', onKeyDown);

  // Cleaning up event listener on component unmount
  return () => {
    window.removeEventListener('keydown', onKeyDown);
  };
}, [deleteCurrent, history]);



return(
  <main className="h-full w-full relative bg-neutral-100 touch-none">
  <CanvasInfo boardId={boardId} />
  <CurrentActiveParticipants />
  <CanvasToolbar
    canvasState={canvasState}
    setCanvasState={setCanvasState}
    RedoAction={canRedo}
    UndoAction={canUndo}
    undo={history.undo}
    redo={history.redo}
  />
  <SelectionTools camera={camera} setLastUsedColor={setLastUsedColor} />
  <svg
    className="h-[100vh] w-[100vw]"
    onWheel={handleCameraMove}
    onPointerMove={handlePointerMove}
    onPointerLeave={handlePointerLeave}
    onPointerDown={onPointerDown}
    onPointerUp={handlePointerUp}
  >
    <g style={{ transform: `translate(${camera.x}px, ${camera.y}px)` }}>
    {/* Mapping over each layerId in LayerIds array to render a DifferentLayerRenderInformation component for each layer.*/}
      {LayerIds.map(layerId => (

        <DifferentLayerRenderInformation
          key={layerId}
          id={layerId}
          onLayerPointerDown={handleLayerPointerDown}
          layerColorWithConnId={mapColorToLayarByConnId[layerId]}
        />
      ))}
      <Elementedgs onResizeHandlePointerDown={handleResizeStart} />
      <CurrentActivePointers />
    </g>
  </svg>
</main>
);
};
export default Canvas;
