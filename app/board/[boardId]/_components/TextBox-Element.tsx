import { Inter } from 'next/font/google'
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable'
import { TextBoxLayer } from '@/types/canvasRawTypes'
import { cn, colors } from '@/utils/utils'
import { useMutation } from '@/liveblocks.config'
const interFont = Inter({ subsets: ['latin'], weight: ['400'] })

/**
 * This code calculates an appropriate font size based on the dimensions of the text box.
 * It subtracts a fixed padding value from both width and height so the text fits within the boundaries.
 */
function calculateFontSize(width: number, height: number): number {
  const padding = 10; 
  return Math.min(width - padding, height - padding) / 2; 
}

interface TextProps {
  id: string
  layer: TextBoxLayer
  onPointerDown: (e: React.PointerEvent, id: string) => void
  SelectionColorBasedOnConnId?: string
}

/**
 * This code renders a live, editable text box within an SVG foreignObject,
 * with a gear icon that opens a pop-up to adjust font size and style.
 */
export const TextElement: React.FC<TextProps> = ({
  id,
  layer,
  onPointerDown,
  SelectionColorBasedOnConnId,
}) => {
  // Destructuring the  properties from the layer object.
  const { x, y, width, height, backgroundColor, value } = layer

  // Liveblocks mutation code to update the text value.
  const updateValue = useMutation(
    ({ storage }, newValue: string) => {
      const liveLayers = storage.get('layers')
      // Updating the 'value' property of the specified layer.
      liveLayers.get(id)?.set('value' as any, newValue)
    },
    []
  )

  // Handler function for content changes in the editable text component.
  const handleContentChange = (e: ContentEditableEvent): void => {
    updateValue(e.target.value)
  }

 

  return (
    <foreignObject
      x={x}
      y={y}
      width={width}
      height={height}
      onPointerDown={e => onPointerDown(e, id)}
      style={{
        outline: SelectionColorBasedOnConnId ? `1px solid ${SelectionColorBasedOnConnId}` : 'none',
      }}
    >
      <ContentEditable
        html={value || 'Text'}
        onChange={handleContentChange}
        className={cn(
          'h-full w-full flex items-center justify-center text-center drop-shadow-md outline-none',
          interFont.className
        )}
        style={{
          fontSize: calculateFontSize(width, height),
          color: backgroundColor ? colors(backgroundColor) : '#000',
        }}
      />
    </foreignObject>
  )
}