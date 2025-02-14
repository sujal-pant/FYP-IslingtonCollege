'use client'

import { memo } from 'react'
import { Trash2 } from 'lucide-react'

import { ElementoviewProps } from '@/components/Global Display/Element-View'
import { Button } from '@/components/ui/button'
import { Camera, ShapeColor } from '@/types/canvasRawTypes'
import { useMutation, useSelf } from '@/liveblocks.config'
import { useSelectedLayersBoundingBox } from '@/Custom-hooks/useSelectedLayersBoundingBox'
import { ShadeSelector } from './ShadeSelector'
import { deletelayerhook } from '@/Custom-hooks/Delete-Layer-hook'

interface SelectionToolsProps {
  camera: Camera
  setLastUsedColor: (color: ShapeColor) => void
}

export const SelectionTools = memo(
  ({ camera, setLastUsedColor }: SelectionToolsProps) => {
    // Getting the IDs of the currently selected layers
    const selectedLayerIds = useSelf(me => me.presence.CurrentlySelectedLayer)

    // Mutation to update the fill color for selected layers
    const setFill = useMutation(
      ({ storage }, backgroundColor : ShapeColor) => {
        const liveLayers = storage.get('layers')
        setLastUsedColor(backgroundColor )

        selectedLayerIds.forEach((id: string) => {
          liveLayers.get(id)?.set('backgroundColor', backgroundColor )
        })

        console.log('setFill', backgroundColor )
      },
      [selectedLayerIds, setLastUsedColor]
    )

    // Getting the bounding box for the selected layers
    const selectionBounds = useSelectedLayersBoundingBox()

    // Hook to delete the selected layer(s)
    const deleteLayer = deletelayerhook()

    if (!selectionBounds) return null

    // Calculating toolbar position based on selection and camera offset
    const toolbarX = selectionBounds.x + camera.x + selectionBounds.width / 2
    const toolbarY = selectionBounds.y + camera.y - 16 
    const toolbarStyle = {
      transform: `translate(calc(${toolbarX}px - 50%), calc(${toolbarY}px - 100%))`,
    }

    return (
      <div
        className="absolute p-4 rounded-lg bg-white shadow-lg border border-gray-200 flex items-center space-x-4 select-none"
        style={toolbarStyle}
      >
        <ShadeSelector onChange={setFill} />
        <div className="flex items-center pl-3 ml-3 border-l border-gray-300">
          <ElementoviewProps label="Delete">
            <Button
              variant="board"
              size="icon"
              onClick={deleteLayer}
              className="text-red-500 hover:text-white hover:bg-red-500 transition rounded-full p-2"
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          </ElementoviewProps>
        </div>
      </div>
    )
  }
)

SelectionTools.displayName = 'SelectionTools'
