'use client'

import { memo } from 'react'
import { BringToFront, SendToBack, Trash2 } from 'lucide-react'

import { ElementoviewProps } from '@/components/Element-View'
import { Button } from '@/components/ui/button'
import { Camera, Color } from '@/types/canvasRawTypes'
import { useMutation, useSelf } from '@/liveblocks.config'
import { selectlayer } from '@/hooks/select-layers'
import { ColorPicker } from './ColorPicker'
import { deletelayerhook } from '@/hooks/Delete-Layer-hook'

interface SelectionToolsProps {
  camera: Camera
  setLastUsedColor: (color: Color) => void
}

export const SelectionTools = memo(
  ({ camera, setLastUsedColor }: SelectionToolsProps) => {
    const selection = useSelf(me => me.presence.CurrentlySelectedLayer)

    const setFill = useMutation(
      ({ storage }, fill: Color) => {
        const liveLayers = storage.get('layers')
        setLastUsedColor(fill)

        selection.forEach(id => {
          liveLayers.get(id)?.set('fill', fill)
        })
        console.log('setFill', fill)
      },
      [selection, setLastUsedColor]
    )

    const selectionBounds = selectlayer()
    const deletelayer = deletelayerhook()

    if (!selectionBounds) return null

    const x = selectionBounds.width / 2 + selectionBounds.x + camera.x
    const y = selectionBounds.y + camera.y

    return (
      <div
        className="absolute p-4 rounded-lg bg-white shadow-lg border border-gray-200 flex items-center space-x-4 select-none"
        style={{
          transform: `translate(
            calc(${x}px - 50%),
            calc(${y - 16}px - 100%)
          )`,
        }}
      >
        <ColorPicker
          onChange={setFill}
        />
        <div className="flex items-center pl-3 ml-3 border-l border-gray-300">
          <ElementoviewProps label="Delete">
            <Button
              variant="board"
              size="icon"
              onClick={deletelayer}
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
