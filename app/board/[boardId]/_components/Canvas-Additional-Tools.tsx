'use client'

import { memo } from 'react'
import { Layers, Trash2 } from 'lucide-react'

import { ElementoviewProps } from '@/components/Global Display/Element-View'
import { Button } from '@/components/ui/button'
import { Camera, ShapeColor } from '@/types/canvasRawTypes'
import { useMutation, useSelf } from '@/liveblocks.config'
import { useSelectedLayersBoundingBox } from '@/Custom-hooks/useSelectedLayersBoundingBox'
import { ShadeSelector } from './ShadeSelector'
import { deletelayerhook as useDeleteLayer  } from '@/Custom-hooks/Canvas-Hooks/Delete-Layer-hook' 

interface SelectionToolsProps {
  camera: Camera
  setLastUsedColor: (color: ShapeColor) => void
}

/**
 * This renders a toolbar with actions that apply to the currently selected layers.
 * It allows to change the  color, adjust the z-index (bring to front / send to back),
 * and delete the selected layers.
 */
const SelectionToolsComponent = ({ camera, setLastUsedColor }: SelectionToolsProps) => {
  // Getting the array of currently selected layer IDs from Liveblocks presence
  const selectedLayerIds = useSelf((me) => me.presence.CurrentlySelectedLayer)

  /**
   * Bringing the selected layers to the front (highest z-index).
   */
  const bringSelectedLayersToFront = useMutation(
    ({ storage }) => {
      const layerOrder = storage.get('layerIds')
      const selectedIndices: number[] = []
      const layerIdsArray = layerOrder.toImmutable()

      // Finding indices of the selected layers in the current layer order
      for (let i = 0; i < layerIdsArray.length; i++) {
        if (selectedLayerIds.includes(layerIdsArray[i])) {
          selectedIndices.push(i)
        }
      }

      // Moving each selected layer to the front while preserving their relative order.
      for (let i = selectedIndices.length - 1; i >= 0; i--) {
        layerOrder.move(
          selectedIndices[i],
          layerIdsArray.length - 1 - (selectedIndices.length - 1 - i)
        )
      }
    },
    [selectedLayerIds]
  )

  /**
   * Sending the selected layers to the back (lowest z-index).
   */
  const sendSelectedLayersToBack = useMutation(
    ({ storage }) => {
      const layerOrder = storage.get('layerIds')
      const selectedIndices: number[] = []
      const layerIdsArray = layerOrder.toImmutable()

      // Finding indices of the selected layers in the current layer order
      for (let i = 0; i < layerIdsArray.length; i++) {
        if (selectedLayerIds.includes(layerIdsArray[i])) {
          selectedIndices.push(i)
        }
      }

      // Moving each selected layer to the back while preserving their relative order.
      for (let i = 0; i < selectedIndices.length; i++) {
        layerOrder.move(selectedIndices[i], i)
      }
    },
    [selectedLayerIds]
  )

  /**
   * Updating the  color of all selected layers.
   */
  const updateSelectedLayersColor = useMutation(
    ({ storage }, newColor: ShapeColor) => {
      const layersMap = storage.get('layers')
      setLastUsedColor(newColor)

      selectedLayerIds.forEach((layerId: string) => {
        layersMap.get(layerId)?.set('backgroundColor', newColor)
      })

      console.log('Updated fill color:', newColor)
    },
    [selectedLayerIds, setLastUsedColor]
  )

  // Getting the bounding box covering all selected layers
  const selectionBoundingBox = useSelectedLayersBoundingBox()

  // Hook to delete selected layers.
  const deleteSelectedLayers = useDeleteLayer()

  // If nothing is selected
  if (!selectionBoundingBox) return null

  // Calculating toolbar position using the selection's bounding box and current camera offset.
  const toolbarX = selectionBoundingBox.x + camera.x + selectionBoundingBox.width / 2
  const toolbarY = selectionBoundingBox.y + camera.y - 16
  const toolbarStyle = {
    transform: `translate(calc(${toolbarX}px - 50%), calc(${toolbarY}px - 100%))`,
    willChange: 'transform'
  }

  return (
    <div
      className="absolute z-50 p-1 rounded bg-white/80 dark:bg-gray-900/80 shadow-sm border border-gray-200 dark:border-gray-700 flex items-center space-x-1 select-none transition-transform duration-50 ease-out"
      style={toolbarStyle}
    >
      {/* Shade selector to update the  color of selected layers */}
      <ShadeSelector onChange={updateSelectedLayersColor} />

      {/* Z-index controls: bring to front and send to back */}
      <div className="flex flex-col gap-y-1">
        <ElementoviewProps label="Bring to front">
          <Button
            onClick={bringSelectedLayersToFront}
            variant="board"
            size="icon"
            aria-label="Bring selected layers to front"
          >
            <Layers className="w-4 h-4" />
          </Button>
        </ElementoviewProps>
        <ElementoviewProps label="Send to back" side="bottom">
          <Button
            onClick={sendSelectedLayersToBack}
            variant="board"
            size="icon"
            aria-label="Send selected layers to back"
          >
            <Layers
              className="w-4 h-4"
              style={{ transform: 'rotate(180deg)' }}
            />
          </Button>
        </ElementoviewProps>
      </div>

      {/* Delete selected layers */}
      <div className="flex items-center pl-1 border-l border-gray-200 dark:border-gray-700">
        <ElementoviewProps label="Delete">
          <Button
            variant="board"
            size="icon"
            onClick={deleteSelectedLayers}
            aria-label="Delete selected layers"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </ElementoviewProps>
      </div>
    </div>
  )
}

SelectionToolsComponent.displayName = 'SelectionTools'

export const SelectionTools = memo(SelectionToolsComponent)
