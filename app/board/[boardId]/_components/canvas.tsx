'use client';

import { nanoid } from 'nanoid';
import { useCallback, useMemo, useState,useEffect } from 'react';

import { 
  useHistory, 
  useCanUndo, 
  useCanRedo, 
  useMutation, 
  useStorage, 
  useOthersMapped, 
  useSelf
} from '@/liveblocks.config';

import {
  Camera,
  ActionMode ,
  CanvasInteractionState,
  ShapeColor,
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

import { usercolor, getCanvasCoordinatesFromPointer , calculateResizedBoundary, selectLayersWithinRect, colors } from '@/utils/utils';
import { LiveObject } from '@liveblocks/client';
import { SelectionTools } from './Canvas-Additional-Tools'; 
import { deletelayerhook } from '@/Custom-hooks/Canvas-Hooks/Delete-Layer-hook';
import { createPathLayerFromStroke } from '@/utils/pentool_utils';
import { PenTool } from './Pen-Tool-Component';

const MAX_NUM_LAYER = 1000;

interface CanvasProps {
  boardId: string;
}

export const Canvas = ({ boardId }: CanvasProps) => {
  const CurrentLayerIds = useStorage((root) => root.layerIds);

  const [CurrentcanvasState, UpdateCurrentCanvasState] = useState<CanvasInteractionState>({
    actionType : ActionMode .Empty,
  });

  const stroke = useSelf((self) => self.presence.stroke);
  const [camera, setCamera] = useState<Camera>({ x: 0, y: 0 });
  const [LastUsedColor, setLastUsedColor] = useState<ShapeColor>({
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
        backgroundColor : LastUsedColor,
      });

      infoAllLayerIds.push(newlayerId);
      infoAllLayers.set(newlayerId, newInsertlayer);

      setMyPresence({ CurrentlySelectedLayer: [newlayerId] }, { addToHistory: true });
      UpdateCurrentCanvasState({ actionType : ActionMode .Empty });
    },
    [LastUsedColor]
  );


// Function to move the currently selected layer based on user interaction
  const MoveCurrentSelectedlayer = useMutation(
    ({ storage, self }, point: Point) => {
    
      // Ensuring movement occurs only in "Transforming" mode

      if (CurrentcanvasState.actionType  !== ActionMode .Transforming) {
        return
      }

    // Calculating the movement offset relative to the last recorded position

      const pointsonScreen = {
        x: point.x - CurrentcanvasState.current.x,
        y: point.y - CurrentcanvasState.current.y,
      }

      // Retrieving all layers from storage

      const getCurrentLayer = storage.get('layers')

      // Iterating through the selected layer IDs and update their positions

      for (const id of self.presence.CurrentlySelectedLayer) {
        const layerinfo = getCurrentLayer.get(id)

          // Updating layer position by applying the calculated movement offset

        if (layerinfo) {
          layerinfo.update({
            x: layerinfo.get('x') + pointsonScreen.x,
            y: layerinfo.get('y') + pointsonScreen.y,
          })
        }
      }
      // Updating the canvas state to reflect the new transformation position

      UpdateCurrentCanvasState({ actionType : ActionMode .Transforming, current: point })
    },
    [CurrentcanvasState]
  )
  const clearSelection = useMutation(({ self, setMyPresence }) => {
    if (self.presence.CurrentlySelectedLayer.length > 0) {
      setMyPresence({ CurrentlySelectedLayer: [] }, { addToHistory: true })
    }
  }, [])
  const FreehandDrawing = useMutation(
    ({ self, setMyPresence }, point: Point, e: React.PointerEvent) => {
      const { stroke } = self.presence;
  
      if (
        CurrentcanvasState.actionType !== ActionMode.Freehand ||
        e.buttons !== 1 ||
        !stroke
      ) {
        return;
      }
  
      const isSamePoint =
        stroke.length === 1 &&
        stroke[0][0] === point.x &&
        stroke[0][1] === point.y;
  
      if (!isSamePoint) {
        setMyPresence({
          cursor: point,
          stroke: [...stroke, [point.x, point.y, e.pressure]],
        });
      }
    },
    [CurrentcanvasState.actionType]
  );
  
  const PentoolStart = useMutation(
    ({ setMyPresence }, point: Point, size: number) => {
      setMyPresence({
        stroke: [[point.x, point.y, size]],
        color: LastUsedColor,
      });
    },
    [LastUsedColor]
  );
  
  /*
    This Function help in resizing the selected layer on the canvas.
     It listens for a resizing event and updates the selected layer's boundary
    based on the current mouse position.
   */
  const resizeSelctedLayer = useMutation(
    ({ storage, self }, point: Point) => {

          // Ensuring that the canvas is in resizing mode before proceeding

      if (CurrentcanvasState.actionType  !== ActionMode .Resizing) {
        return
      }

    // Calculating the new boundary of the selected layer based on the current mouse position

      const Currentbounds = calculateResizedBoundary(
        CurrentcanvasState.initialBounds,
        CurrentcanvasState.edge,
        point
      )
    // Retrieving the current layers from the storage

      const currentLayerInfo = storage.get('layers')
    // Getting the selected layer based on the presence information

      const Selecetedlayer = currentLayerInfo.get(self.presence.CurrentlySelectedLayer[0])
    // If the layer is found, updating its boundary with the newly calculated size

      if (Selecetedlayer) {
        Selecetedlayer.update(Currentbounds)
      }
    },
    [CurrentcanvasState]
  )
 
 /**
 * 
 * This function is called when the user begins to resize a layer or object on the canvas,
 * and it ensures that the resizing process is tracked properly by updating the canvas state.
 */
const handleResizeStart = useCallback(
  (edge: RectEdge, initialBounds: ResizeCoordinate) => {
    // Pauses the history to prevent changes during resizing from being added to undo/redo history
    history.pause()

    // Updates the current canvas state to indicate that resizing has started
    UpdateCurrentCanvasState({
      actionType : ActionMode .Resizing, 
      initialBounds,             
      edge,                    
    })
  },
  [history] 
)
// This code initiates the selection process when the pointer's movement exceeds a minimal threshold.
const handleSelectionStart  = useCallback((current: Point, origin: Point) => {
  // Defining the minimal movement required to consider it a valid selection drag.
  const MOVEMENT_THRESHOLD = 5;
  
  // Checking if the combined movement in x and y directions exceeds the threshold.
  if (Math.abs(current.x - origin.x) + Math.abs(current.y - origin.y) > MOVEMENT_THRESHOLD) {
    // Updating the canvas state to start drawing the selection net.
    UpdateCurrentCanvasState({
      actionType: ActionMode.SelectionNet,
      origin,
      current,
    });
  }
}, []);



// Updating the selection net as the user drags and sets the currently selected layers.
const handleSelectionUpdate = useMutation(
  ({ storage, setMyPresence }, current: Point, origin: Point) => {
    // Retrieving the current layers from storage and converting them to an immutable structure.
    const Currentlayers = storage.get('layers').toImmutable();
    
    // Updating the canvas state with the new selection net coordinates.
    UpdateCurrentCanvasState({
      actionType: ActionMode.SelectionNet,
      origin,
      current,
    });

    // Determining which layers intersect with the current selection rectangle.
    const selectedLayerIds = selectLayersWithinRect(
      CurrentLayerIds, 
      Currentlayers,   
      origin,          
      current          
    );

    // Updating the user's presence with the IDs of the layers that are currently selected.
    setMyPresence({ CurrentlySelectedLayer: selectedLayerIds });
  },
  [CurrentLayerIds]
);

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
      if (CurrentcanvasState.actionType === ActionMode.Clicking) {
        handleSelectionStart (current, CurrentcanvasState.origin)
      }
      else if (CurrentcanvasState.actionType === ActionMode.SelectionNet) {
        handleSelectionUpdate (current, CurrentcanvasState.origin)
      }
        else if (CurrentcanvasState.actionType  === ActionMode .Transforming) {
        MoveCurrentSelectedlayer(current);
      }
      else if(CurrentcanvasState.actionType  === ActionMode .Resizing) {
        resizeSelctedLayer(current);
      }
      else if(CurrentcanvasState.actionType  === ActionMode .Freehand) {
        FreehandDrawing(current,e);
      }

      setMyPresence({ cursor: current });
    },
    [camera, CurrentcanvasState, resizeSelctedLayer,MoveCurrentSelectedlayer,FreehandDrawing]
  );
  
  const handlePointerLeave = useMutation(({ setMyPresence }) => {
    setMyPresence({ cursor: null })
  }, [])

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      const point = getCanvasCoordinatesFromPointer (e, camera)

      if (CurrentcanvasState.actionType  === ActionMode .Inserting) {
        return
      }
      
      if(CurrentcanvasState.actionType  === ActionMode .Freehand) {
        PentoolStart(point,e.pressure);
        return;
      }

      

      UpdateCurrentCanvasState({ origin: point, actionType : ActionMode .Clicking })
    },
    [camera, CurrentcanvasState.actionType , UpdateCurrentCanvasState, PentoolStart]
  )
  const PenContent = useMutation(({ storage, self, setMyPresence }) => {
    const { stroke } = self.presence;
    if (!stroke || stroke.length < 2) {
      setMyPresence({ stroke: null });
      return;
    }
  
    const liveLayers = storage.get("layers");
    if (liveLayers.size >= MAX_NUM_LAYER) {
      setMyPresence({ stroke: null });
      return;
    }
  
    const id = nanoid();
    const newLayer = new LiveObject(createPathLayerFromStroke(stroke, LastUsedColor));
  
    liveLayers.set(id, newLayer);
    storage.get("layerIds").push(id);
  
    setMyPresence({ stroke: null });
    UpdateCurrentCanvasState({ actionType: ActionMode.Freehand });
  }, [LastUsedColor]);
  
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
      CurrentcanvasState.actionType  === ActionMode .Empty || // If in Empty mode or clicking mode
      CurrentcanvasState.actionType  === ActionMode .Clicking
    ) {
      // Clearing any selection and reseting canvas mode to Empty
      clearSelection()
      UpdateCurrentCanvasState({
        actionType : ActionMode .Empty, // Setting the canvas state back to Empty
      })
    } 
  
  else if (CurrentcanvasState.actionType === ActionMode.Freehand) {
    PenContent()
  } 
  else if (CurrentcanvasState.actionType  === ActionMode .Inserting) {
      // If the current mode is Inserting, adding the a newly created layer to the canvas
      AddlayerOnCanvas(CurrentcanvasState.layerType, point)
    } else {
      // For any other modes, reseting canvas state to Empty
      UpdateCurrentCanvasState({
        actionType : ActionMode .Empty,
      })
    }

    // Resuming history tracking 
    history.resume()
  },
  [PenContent,
    UpdateCurrentCanvasState, // Function to update canvas state
    camera, // Current camera position
    CurrentcanvasState, // Current canvas state
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
      if (CurrentcanvasState.actionType  === ActionMode .Freehand || CurrentcanvasState.actionType  === ActionMode .Inserting) {
        return;
      }

      history.pause();
      e.stopPropagation();

      const point = getCanvasCoordinatesFromPointer (e, camera);

      if (!self.presence.CurrentlySelectedLayer.includes(layerId)) {
        setMyPresence({ CurrentlySelectedLayer: [layerId] }, { addToHistory: true });
      }

      UpdateCurrentCanvasState({ actionType : ActionMode .Transforming, current: point });
    },
    [CurrentcanvasState, camera, history,CurrentcanvasState.actionType ]
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
      canvasState={CurrentcanvasState}
      setCanvasState={UpdateCurrentCanvasState}
      RedoAction={canRedo}
      UndoAction={canUndo}
      undo={history.undo}
      redo={history.redo}
      setLastUsedColor={setLastUsedColor} selectedLayerIds={[]} storage={undefined}  />
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
      {CurrentLayerIds.map(layerId => (

        <DifferentLayerRenderInformation
          key={layerId}
          id={layerId}
          onLayerPointerDown={handleLayerPointerDown}
          layerColorWithConnId={mapColorToLayarByConnId[layerId]}
        />
      ))}
      <Elementedgs onResizeHandlePointerDown={handleResizeStart} />
      {CurrentcanvasState.actionType === ActionMode.SelectionNet &&
            CurrentcanvasState.current != null && (
              <rect
                className="fill-blue-500/5 stroke-blue-400 "
                x={Math.min(CurrentcanvasState.origin.x, CurrentcanvasState.current.x)}
                y={Math.min(CurrentcanvasState.origin.y, CurrentcanvasState.current.y)}
                width={Math.abs(CurrentcanvasState.origin.x - CurrentcanvasState.current.x)}
                height={Math.abs(CurrentcanvasState.origin.y - CurrentcanvasState.current.y)}
              />
            )}
      <CurrentActivePointers />
      {stroke != null && stroke.length > 0 && (
            <PenTool
              points={stroke}
              fill={colors(LastUsedColor)}
              x={0}
              y={0}
            />
          )}
    </g>
  </svg>
</main>
);
};
export default Canvas;
