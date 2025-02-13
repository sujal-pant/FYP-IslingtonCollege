import { ActionMode , CanvasInteractionState, LayerType } from '@/types/canvasRawTypes';
import {MousePointer,PenTool,Type,StickyNote, Square, Circle,Undo,Redo,} from 'lucide-react';
import { CanvasSelectedButtons } from './Canvas-Selected-Buttons';

/*
CanvasToolbar is the main toolbar for interacting with the canvas, providing options like selecting tools, 
drawing, inserting shapes, and handling undo/redo actions.
*/

// Defining the props for CanvasToolbar component
interface CanvasToolbarProps {
  undo: () => void;
  redo: () => void;
  UndoAction: boolean;
  RedoAction: boolean;

// The current state of the canvas (mode, layerType)
  canvasState: CanvasInteractionState;
  setCanvasState: (state: CanvasInteractionState) => void;// Function to update the canvas state
}

export const CanvasToolbar = ({
  canvasState,
  setCanvasState,
  undo,
  redo,
  UndoAction,
  RedoAction,
}: CanvasToolbarProps) => (
  <div className="absolute top-1/2 -translate-y-1/2 left-5 flex flex-col gap-2 bg-white p-3 rounded-lg shadow-lg border border-gray-200 transition-all hover:shadow-xl">
    
      {/* Button for selecting items on the canvas */}

    <CanvasSelectedButtons
      Elementlabel="Select"
      Elementicon={MousePointer}
      onClick={() => setCanvasState({ actionType : ActionMode .Empty })}
      isActive={[ActionMode .Empty, ActionMode .Transforming, ActionMode .SelectionNet, ActionMode .Clicking, ActionMode .Resizing].includes(canvasState.actionType)}
    />
    <CanvasSelectedButtons
      Elementlabel="Pen"
      Elementicon={PenTool}
      onClick={() => setCanvasState({ actionType : ActionMode .Freehand })}
      isActive={canvasState.actionType  === ActionMode .Freehand}
    />
    <CanvasSelectedButtons
      Elementlabel="Text"
      Elementicon={Type}
      onClick={() => setCanvasState({ actionType : ActionMode .Inserting, layerType: LayerType.TextBox })}
      isActive={canvasState.actionType  === ActionMode .Inserting && canvasState.layerType === LayerType.TextBox}
    />
    <CanvasSelectedButtons
      Elementlabel="Sticky Note"
      Elementicon={StickyNote}
      onClick={() => setCanvasState({ actionType : ActionMode .Inserting, layerType: LayerType.StickyNote })}
      isActive={canvasState.actionType  === ActionMode .Inserting && canvasState.layerType === LayerType.StickyNote}
    />
    <CanvasSelectedButtons
      Elementlabel="Rectangle"
      Elementicon={Square}
      onClick={() => setCanvasState({ actionType : ActionMode .Inserting, layerType: LayerType.RectangleBox })}
      isActive={canvasState.actionType  === ActionMode .Inserting && canvasState.layerType === LayerType.RectangleBox}
    />
    <CanvasSelectedButtons
      Elementlabel="Ellipse"
      Elementicon={Circle}
      onClick={() => setCanvasState({ actionType : ActionMode .Inserting, layerType: LayerType.Ellipse })}
      isActive={canvasState.actionType  === ActionMode .Inserting && canvasState.layerType === LayerType.Ellipse}
    />

    <div className="flex flex-col gap-2 mt-3 border-t border-gray-300 pt-3">
      <CanvasSelectedButtons Elementlabel="Undo" Elementicon={Undo} onClick={undo} isDisabled={!UndoAction} />
      <CanvasSelectedButtons Elementlabel="Redo" Elementicon={Redo} onClick={redo} isDisabled={!RedoAction} />
    </div>
  </div>
);

// Skeleton loader for the toolbar (used while loading the data)
export const CanvasToolbarSkeleton = () => (
  <div className="absolute top-1/2 -translate-y-1/2 left-5 w-[60px] h-[400px] bg-gray-200 rounded-lg shadow-lg overflow-hidden animate-pulse">
    <div className="h-8 w-full bg-gray-300 mb-3 rounded-md" />
    <div className="h-8 w-full bg-gray-300 mb-3 rounded-md" />
    <div className="h-8 w-full bg-gray-300 mb-3 rounded-md" />
    <div className="h-8 w-full bg-gray-300 mb-3 rounded-md" />
    <div className="h-8 w-full bg-gray-300 mb-3 rounded-md" />
    <div className="h-8 w-full bg-gray-300 mb-3 rounded-md" />
    <div className="h-8 w-full bg-gray-300 mt-3 mb-3 rounded-md" />
    <div className="h-8 w-full bg-gray-300 rounded-md" />
  </div>
);
