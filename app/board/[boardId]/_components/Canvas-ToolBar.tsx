import { MousePointer, PenTool, Type, StickyNote, Square, Circle, Undo, Redo } from 'lucide-react';
import { CanvasSelectedButtons } from './Canvas-Selected-Buttons';
import { ActionMode, CanvasInteractionState, LayerType } from '@/types/canvasRawTypes';

interface CanvasToolbarProps {
  undo: () => void;
  redo: () => void;
  UndoAction: boolean;
  RedoAction: boolean;
  canvasState: CanvasInteractionState;
  setCanvasState: (state: CanvasInteractionState) => void;
}

export const CanvasToolbar = ({
  canvasState,
  setCanvasState,
  undo,
  redo,
  UndoAction,
  RedoAction,
}: CanvasToolbarProps) => (
  <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex items-center justify-between gap-3 bg-white p-3 rounded-lg shadow-lg border border-gray-200 transition-all">
    <CanvasSelectedButtons
      Elementlabel="Select"
      Elementicon={MousePointer}
      onClick={() => setCanvasState({ actionType: ActionMode.Empty })}
      isActive={[ActionMode.Empty, ActionMode.Transforming, ActionMode.SelectionNet, ActionMode.Clicking, ActionMode.Resizing].includes(canvasState.actionType)}
    />
   <CanvasSelectedButtons
  Elementlabel="Pen"
  Elementicon={PenTool}
  onClick={() => setCanvasState({ actionType: ActionMode.Freehand })}
  isActive={canvasState.actionType === ActionMode.Freehand}
/>

    <CanvasSelectedButtons
      Elementlabel="Text"
      Elementicon={Type}
      onClick={() => setCanvasState({ actionType: ActionMode.Inserting, layerType: LayerType.TextBox })}
      isActive={canvasState.actionType === ActionMode.Inserting && canvasState.layerType === LayerType.TextBox}
    />
    <CanvasSelectedButtons
      Elementlabel="Sticky Note"
      Elementicon={StickyNote}
      onClick={() => setCanvasState({ actionType: ActionMode.Inserting, layerType: LayerType.StickyNote })}
      isActive={canvasState.actionType === ActionMode.Inserting && canvasState.layerType === LayerType.StickyNote}
    />
    <CanvasSelectedButtons
      Elementlabel="Rectangle"
      Elementicon={Square}
      onClick={() => setCanvasState({ actionType: ActionMode.Inserting, layerType: LayerType.RectangleBox })}
      isActive={canvasState.actionType === ActionMode.Inserting && canvasState.layerType === LayerType.RectangleBox}
    />
    <CanvasSelectedButtons
      Elementlabel="Ellipse"
      Elementicon={Circle}
      onClick={() => setCanvasState({ actionType: ActionMode.Inserting, layerType: LayerType.Ellipse })}
      isActive={canvasState.actionType === ActionMode.Inserting && canvasState.layerType === LayerType.Ellipse}
    />
    <div className="flex items-center gap-4"> 
      <CanvasSelectedButtons Elementlabel="Undo" Elementicon={Undo} onClick={undo} isDisabled={!UndoAction} />
      <CanvasSelectedButtons Elementlabel="Redo" Elementicon={Redo} onClick={redo} isDisabled={!RedoAction} />
    </div>
 
  </div>
);

export const CanvasToolbarSkeleton = () => (
  <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 w-full h-[60px] bg-gray-200 rounded-lg shadow-lg overflow-hidden animate-pulse flex items-center justify-center gap-3 p-3">
   
    {Array.from({ length: 8 }).map((_, index) => (
      <div key={index} className="h-8 w-12 bg-gray-300 rounded-md" />
    ))}
  </div>
);