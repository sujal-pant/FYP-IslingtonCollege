import {
  Circle,
  MousePointer2,
  Pencil,
  Redo2,
  Square,
  StickyNote,
  Type,
  Undo2,
} from 'lucide-react'

import { CanvasSelectedButtons } from './Canvas-Selected-Buttons'

import { CanvasMode, CanvasState, LayerType } from '@/types/canvas'

interface ToolbarProps {
  canvasState: CanvasState
  setCanvasState: (newState: CanvasState) => void
  undo: () => void
  redo: () => void
  canUndo: boolean
  canRedo: boolean
}

export const Toolbar = ({
  canvasState,
  setCanvasState,
  undo,
  redo,
  canUndo,
  canRedo,
}: ToolbarProps) => (
  <div className="absolute top-[50%] -translate-y-[50%] left-2 flex flex-col gap-y-4">
    <div className="bg-white rounded-md p-1.5 flex gap-y-1 flex-col items-center shadow-md">
      <CanvasSelectedButtons
        label="Select"
        icon={MousePointer2}
        onClick={() =>
          setCanvasState({
            mode: CanvasMode.Empty,
          })
        }
        isActive={
          canvasState.mode === CanvasMode.Empty ||
          canvasState.mode === CanvasMode.Transforming ||
          canvasState.mode === CanvasMode.SelectionNet ||
          canvasState.mode === CanvasMode.Clicking ||
          canvasState.mode === CanvasMode.Resizing
        }
      />
      <CanvasSelectedButtons
        label="Text"
        icon={Type}
        onClick={() =>
          setCanvasState({
            mode: CanvasMode.Inserting,
            layerType: LayerType.TextBox,
          })
        }
        isActive={
          canvasState.mode === CanvasMode.Inserting &&
          canvasState.layerType === LayerType.TextBox
        }
      />
      <CanvasSelectedButtons
        label="Sticky note"
        icon={StickyNote}
        onClick={() =>
          setCanvasState({
            mode: CanvasMode.Inserting,
            layerType: LayerType.StickyNote,
          })
        }
        isActive={
          canvasState.mode === CanvasMode.Inserting &&
          canvasState.layerType === LayerType.StickyNote
        }
      />
      <CanvasSelectedButtons
        label="Rectangle"
        icon={Square}
        onClick={() =>
          setCanvasState({
            mode: CanvasMode.Inserting,
            layerType: LayerType.RectangleBox,
          })
        }
        isActive={
          canvasState.mode === CanvasMode.Inserting &&
          canvasState.layerType === LayerType.RectangleBox
        }
      />
      <CanvasSelectedButtons
        label="Ellipse"
        icon={Circle}
        onClick={() =>
          setCanvasState({
            mode: CanvasMode.Inserting,
            layerType: LayerType.Ellipse,
          })
        }
        isActive={
          canvasState.mode === CanvasMode.Inserting &&
          canvasState.layerType === LayerType.Ellipse
        }
      />
      <CanvasSelectedButtons
        label="Pen"
        icon={Pencil}
        onClick={() => setCanvasState({ mode: CanvasMode.Freehand })}
        isActive={canvasState.mode === CanvasMode.Freehand}
      />
    </div>
    <div className="bg-white rounded-md p-1.5 flex flex-col items-center shadow-md">
      <CanvasSelectedButtons
        label="Undo"
        icon={Undo2}
        onClick={undo}
        isDisabled={!canUndo}
      />
      <CanvasSelectedButtons
        label="Redo"
        icon={Redo2}
        onClick={redo}
        isDisabled={!canRedo}
      />
    </div>
  </div>
)

export const ToolbarSkeleton = () => (
  <div className="absolute top-[50%] -translate-y-[50%] left-2 flex flex-col gap-y-4 bg-white h-[360px] w-[52px] shadow-md rounded-md" />
)