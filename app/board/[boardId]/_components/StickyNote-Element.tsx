import { Roboto } from 'next/font/google'
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable'
import React, { useCallback } from 'react'

import { StickyNoteLayer } from '@/types/canvasRawTypes'
import { cn, colors, getStickyNoteTextColor } from '@/utils/utils'
import { useMutation } from '@/liveblocks.config'

const font = Roboto({ subsets: ['latin'], weight: ['400'] })

const computeFontSize = (width: number, height: number): number => {
  const maxsize = 50
  const avg_scale = 0.15
  const fontSizeBasedOnHeight = height * avg_scale
  const fontSizeBasedOnWidth = width * avg_scale

  return Math.min(fontSizeBasedOnHeight, fontSizeBasedOnWidth, maxsize)
}

interface CollaborativeStickyNoteProps {
  id: string
  layer: StickyNoteLayer
  onPointerDown: (e: React.PointerEvent<SVGForeignObjectElement>, id: string) => void
  SelectionColorBasedOnConnId?: string
}

export const StickyNote: React.FC<CollaborativeStickyNoteProps> = ({
  layer,
  onPointerDown,
  id,
  SelectionColorBasedOnConnId,
}) => {
  const { x, y, width, height, backgroundColor, value } = layer

  const updateStickyNoteValue = useMutation(
    ({ storage }, newValue: string) => {
      const liveLayers = storage.get('layers')
      liveLayers.get(id)?.set('value' as any, newValue)
    },
    []
  )

  const StickyNoteContentUpdate = useCallback((e: ContentEditableEvent) => {
    updateStickyNoteValue(e.target.value)
  }, [updateStickyNoteValue])

  return (
    <foreignObject
      x={x}
      y={y}
      width={width}
      height={height}
      onPointerDown={(e) => onPointerDown(e, id)}
      style={{
        outline: SelectionColorBasedOnConnId ? `2px dashed ${SelectionColorBasedOnConnId}` : 'none',
        backgroundColor: backgroundColor ? colors(backgroundColor) : '#fefefe',
        borderRadius: '8px',
        overflow: 'hidden',
      }}
      className="shadow-lg"
    >
    <ContentEditable
  tagName="div"
  html={value || 'Text'}
  onChange={StickyNoteContentUpdate}
  className={cn(
    'h-full w-full px-2 py-1',
    !value ? 'flex items-center justify-center text-center' : 'block text-left',
    font.className
  )}
  style={{
    fontSize: computeFontSize(width, height),
    color: backgroundColor ? getStickyNoteTextColor(backgroundColor) : '#333',
    userSelect: 'text',
    whiteSpace: 'pre-wrap',
  }}
/>


    </foreignObject>
  )
}
