'use client'

import { memo } from 'react'

import { LayerType } from '@/types/canvasRawTypes'  
import { useStorage } from '@/liveblocks.config'  
import { Rectangle } from './Rectangle-Element'  
import { TextElement } from './TextBox-Element'
import { StickyNote } from './StickyNote-Element'
import { PenTool } from './Pen-Tool-Component'
import { colors } from '@/utils/utils'
import { EllipseElement } from './Ellipse-Element'
interface DifferentLayerInformationProps {
  id: string  // Unique ID for the layer
  onLayerPointerDown: (e: React.PointerEvent, layerId: string) => void  
  layerColorWithConnId?: string  
}

// Memoizing the component to prevent unnecessary re-renders
export const DifferentLayerRenderInformation = memo(
  ({ id, onLayerPointerDown, layerColorWithConnId }: DifferentLayerInformationProps) => {
    // Fetching the layer object from the storage based on its ID
    const Currentlayer = useStorage(root => root.layers.get(id))

    // If the layer is not found, returning null to avoid rendering anything
    if (!Currentlayer) return null

    // Rendering different types of layers based on the layer type
    switch (Currentlayer.type) {
      case LayerType.Ellipse:
        return (
          <EllipseElement
            key={id}
            id={id}
            layer={Currentlayer}
            onPointerDown={e => onLayerPointerDown(e, id)}
            selectionColor={layerColorWithConnId}
          />
        );
      
      case LayerType.PenTool:
        return (
          <PenTool
            key={id}
            points={Currentlayer.coordinates}
            onPointerDown={e => onLayerPointerDown(e, id)}
            x={Currentlayer.x}
            y={Currentlayer.y}
            fill={Currentlayer.backgroundColor ? colors(Currentlayer.backgroundColor) : '#000'}
            stroke={layerColorWithConnId}
          />
        )

      case LayerType.StickyNote:  //  StickyNoteLayer
      return (
        
          // Rendering the StickyNote component 
        <StickyNote
          id={id}
          layer={Currentlayer}
          onPointerDown={onLayerPointerDown}
          SelectionColorBasedOnConnId={layerColorWithConnId}
        />
      )

      case LayerType.TextBox:  //  TextBoxLayer
        return (
            // Rendering the TextBox component 
          <TextElement
            id={id}
            layer={Currentlayer}
            onPointerDown={onLayerPointerDown}
            SelectionColorBasedOnConnId={layerColorWithConnId}
          />
        )
      case LayerType.RectangleBox:  //  RectangleBox Layer
        return (
          // Rendering the Rectangle component 
          <Rectangle
            id={id}
            layer={Currentlayer}
            onPointerDown={onLayerPointerDown}
            SelectionColorBasedOnConnId={layerColorWithConnId}
          />
        )
      default:
        // Logging a warning for any unknown layer are found
        console.warn('Unknown layer Found!')
        return null
    }
  }
)

DifferentLayerRenderInformation.displayName = 'DifferentLayerRenderInformation'
