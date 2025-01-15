'use client'

import { memo } from 'react'

 
import { LayerType } from '@/types/canvas'
import { useStorage } from '@/liveblocks.config'
import { Rectangle } from './Rectangle-Element'

interface LayerInformationProps {
  id: string
  onLayerPointerDown: (e: React.PointerEvent, layerId: string) => void
  selectionColor?: string
}

export const LayerInformation = memo(
  ({ id, onLayerPointerDown, selectionColor }: LayerInformationProps) => {
    const layer = useStorage(root => root.layers.get(id))

    if (!layer) return null

    switch (layer.type) {
     
      case LayerType.RectangleBox:
        return (
          <Rectangle
            id={id}
            layer={layer}
            onPointerDown={onLayerPointerDown}
            selectionColor={selectionColor}
          />
        )
      default:
        console.warn('Unknown layer type')
        return null
    }
  }
)

LayerInformation.displayName = 'LayerPreview'