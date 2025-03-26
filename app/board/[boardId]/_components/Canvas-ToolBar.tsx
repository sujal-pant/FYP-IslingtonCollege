'use client'

import React, { useState } from 'react';
import {
  MousePointer,
  PenTool,
  Type,
  StickyNote,
  Square,
  Circle,
  Undo,
  Redo,
  ChevronDown,
} from 'lucide-react';
import { ActionMode, CanvasInteractionState, LayerType, ShapeColor } from '@/types/canvasRawTypes';
import { ShadeSelector } from './ShadeSelector';
import { useMutation } from '@/liveblocks.config';
import { CanvasSelectedButtons } from './Canvas-Selected-Buttons';

interface CanvasToolbarProps {
  undo: () => void;
  redo: () => void;
  UndoAction: boolean;
  RedoAction: boolean;
  canvasState: CanvasInteractionState;
  setCanvasState: (state: CanvasInteractionState) => void;
  selectedLayerIds: string[];
  setLastUsedColor: (color: ShapeColor) => void;
  storage: any;
}

export const CanvasToolbar = ({
  undo,
  redo,
  UndoAction,
  RedoAction,
  canvasState,
  setCanvasState,
  selectedLayerIds,
  setLastUsedColor,
  storage,
}: CanvasToolbarProps) => {
  const [showShadePopup, setShowShadePopup] = useState(false);

  const toggleShadePopup = () => {
    setShowShadePopup((prev) => !prev);
  };

  const updateSelectedLayersColor = useMutation(
    ({ storage }, newColor: ShapeColor) => {
      const layersMap = storage.get('layers');
      setLastUsedColor(newColor);

      selectedLayerIds?.forEach((layerId: string) => {
        layersMap.get(layerId)?.set('backgroundColor', newColor);
      });

      console.log('Updated fill color:', newColor);
    },
    [selectedLayerIds, setLastUsedColor]
  );

  return (
    <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex items-center justify-between gap-3 bg-white p-3 rounded-lg shadow-lg border border-gray-200 transition-all">
      <CanvasSelectedButtons
        Elementlabel="Select"
        Elementicon={MousePointer}
        onClick={() => {
          setCanvasState({ actionType: ActionMode.Empty });
          setShowShadePopup(false);
        }}
        isActive={[
          ActionMode.Empty,
          ActionMode.Transforming,
          ActionMode.SelectionNet,
          ActionMode.Clicking,
          ActionMode.Resizing,
        ].includes(canvasState.actionType)}
      />
      <div className="relative flex items-center">
        <CanvasSelectedButtons
          Elementlabel="Pen"
          Elementicon={PenTool}
          onClick={() => setCanvasState({ actionType: ActionMode.Freehand })}
          isActive={canvasState.actionType === ActionMode.Freehand}
        />
        <div className="relative">
          <button
            onClick={toggleShadePopup}
            className="ml-1 p-1 rounded hover:bg-gray-200"
            aria-label="Toggle Shade Selector"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
          {showShadePopup && (
            <div className="absolute bottom-full mb-2 left-0 bg-white p-4 border border-gray-300 rounded shadow-lg z-10 w-64">
              <div className="mb-2">
                <ShadeSelector onChange={updateSelectedLayersColor} />
              </div>
              <div className="flex justify-end">
                <button
                  onClick={toggleShadePopup}
                  className="text-sm text-blue-500 underline"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <CanvasSelectedButtons
        Elementlabel="Text"
        Elementicon={Type}
        onClick={() => {
          setCanvasState({ actionType: ActionMode.Inserting, layerType: LayerType.TextBox });
          setShowShadePopup(false);
        }}
        isActive={
          canvasState.actionType === ActionMode.Inserting &&
          canvasState.layerType === LayerType.TextBox
        }
      />
      <CanvasSelectedButtons
        Elementlabel="Sticky Note"
        Elementicon={StickyNote}
        onClick={() => {
          setCanvasState({ actionType: ActionMode.Inserting, layerType: LayerType.StickyNote });
          setShowShadePopup(false);
        }}
        isActive={
          canvasState.actionType === ActionMode.Inserting &&
          canvasState.layerType === LayerType.StickyNote
        }
      />
      <CanvasSelectedButtons
        Elementlabel="Rectangle"
        Elementicon={Square}
        onClick={() => {
          setCanvasState({ actionType: ActionMode.Inserting, layerType: LayerType.RectangleBox });
          setShowShadePopup(false);
        }}
        isActive={
          canvasState.actionType === ActionMode.Inserting &&
          canvasState.layerType === LayerType.RectangleBox
        }
      />
      <CanvasSelectedButtons
        Elementlabel="Ellipse"
        Elementicon={Circle}
        onClick={() => {
          setCanvasState({ actionType: ActionMode.Inserting, layerType: LayerType.Ellipse });
          setShowShadePopup(false);
        }}
        isActive={
          canvasState.actionType === ActionMode.Inserting &&
          canvasState.layerType === LayerType.Ellipse
        }
      />
      <div className="flex items-center gap-4">
        <CanvasSelectedButtons Elementlabel="Undo" Elementicon={Undo} onClick={undo} isDisabled={!UndoAction} />
        <CanvasSelectedButtons Elementlabel="Redo" Elementicon={Redo} onClick={redo} isDisabled={!RedoAction} />
      </div>
    </div>
  );
};

export const CanvasToolbarSkeleton = () => (
  <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 w-full h-[60px] bg-gray-200 rounded-lg shadow-lg overflow-hidden animate-pulse flex items-center justify-center gap-3 p-3">
    {Array.from({ length: 8 }).map((_, index) => (
      <div key={index} className="h-8 w-12 bg-gray-300 rounded-md" />
    ))}
  </div>
);