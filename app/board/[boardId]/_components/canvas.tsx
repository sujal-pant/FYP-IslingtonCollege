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
} from '@/types/canvas';

import { CanvasInfo } from './Canvas-Info';
import { CanvasToolbar } from './Canvas-ToolBar';
import { CurrentActiveParticipants } from './Current-Active-Participants';
import { CurrentActivePointers } from './CurrentActivePointersMap';
import { LayerInformation } from './Layer-Information';
import { Elementedgs } from './Elements-Edgs';

import { usercolor, pointerEventToCanvasPoint, resizeBoundary } from '@/lib/utils';
import { LiveObject } from '@liveblocks/client';
import { SelectionTools } from './Canvas-Additional-Tools'; 
import { deletelayerhook } from '@/hooks/Delete-Layer-hook';

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

  const Addlayer = useMutation(
    (
      { storage, setMyPresence },
      layerType: LayerType.Ellipse | LayerType.RectangleBox | LayerType.TextBox | LayerType.StickyNote,
      position: Point
    ) => {
      const liveLayers = storage.get('layers');
      if (liveLayers.size >= MAX_NUM_LAYER) return;

      const liveLayerIds = storage.get('layerIds');
      const layerId = nanoid();
      const layer = new LiveObject({
        type: layerType,
        x: position.x,
        y: position.y,
        height: 100,
        width: 100,
        fill: LastUsedColor,
      });

      liveLayerIds.push(layerId);
      liveLayers.set(layerId, layer);

      setMyPresence({ selection: [layerId] }, { addToHistory: true });
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

      for (const id of self.presence.selection) {
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
    if (self.presence.selection.length > 0) {
      setMyPresence({ selection: [] }, { addToHistory: true })
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
      const layer = liveLayers.get(self.presence.selection[0])

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

      const current = pointerEventToCanvasPoint(e, camera);
      
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
      const point = pointerEventToCanvasPoint(e, camera)

      if (canvasState.mode === CanvasMode.Inserting) {
        return
      }

      

      setCanvasState({ origin: point, mode: CanvasMode.Clicking })
    },
    [camera, canvasState.mode, setCanvasState, ]
  )
  const handlePointerUp = useMutation(
    ({}, e) => {
      const point = pointerEventToCanvasPoint(e, camera)

      if (
        canvasState.mode === CanvasMode.Empty ||
        canvasState.mode === CanvasMode.Clicking
      ) {
        clearSelection()
        setCanvasState({
          mode: CanvasMode.Empty,
        })
 
      } else if (canvasState.mode === CanvasMode.Inserting) {
        Addlayer(canvasState.layerType, point)
      } else {
        setCanvasState({
          mode: CanvasMode.Empty,
        })
      }

      history.resume()
    },
    [
      setCanvasState,
      camera,
      canvasState,
      history,
      Addlayer,
      clearSelection,
      
    ]
  )
  const selections = useOthersMapped((other) => other.presence.selection);
  
  const mapLayerToSelectionColor = useMemo(() => {
    const layerToColor: Record<string, string> = {};

    for (const user of selections) {
      const [connectionId, selection] = user;

      for (const layerId of selection) {
        layerToColor[layerId] = usercolor(connectionId);
      }
    }

    return layerToColor;
  }, [selections]);
  

  const handleLayerPointerDown = useMutation(
    ({ self, setMyPresence }, e: React.PointerEvent, layerId: string) => {
      if (canvasState.mode === CanvasMode.Freehand || canvasState.mode === CanvasMode.Inserting) {
        return;
      }

      history.pause();
      e.stopPropagation();

      const point = pointerEventToCanvasPoint(e, camera);

      if (!self.presence.selection.includes(layerId)) {
        setMyPresence({ selection: [layerId] }, { addToHistory: true });
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
          e.preventDefault(); // Prevent default browser behavior
          break;
        }
        break;
      }
      default:
        break;
    }
  }

  // Add event listener on component mount
  window.addEventListener('keydown', onKeyDown);

  // Clean up event listener on component unmount
  return () => {
    window.removeEventListener('keydown', onKeyDown);
  };
}, [deleteCurrent, history]);



return(
  <main className="h-full w-full relative bg-neutral-100 touch-none">
  {/* Info component: Now dynamically imported to ensure it's only rendered client-side */}
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
      {LayerIds.map(layerId => (
        <LayerInformation
          key={layerId}
          id={layerId}
          onLayerPointerDown={handleLayerPointerDown}
          selectionColor={mapLayerToSelectionColor[layerId]}
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
