'use client'

import { memo } from 'react'

import { LayerType } from '@/types/canvasRawTypes'  
import { useStorage } from '@/liveblocks.config'  
import { Rectangle } from './Rectangle-Element'  

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
