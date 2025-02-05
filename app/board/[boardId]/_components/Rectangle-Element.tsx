import { colors } from '@/utils/utils'
import { RectangleBoxLayer } from '@/types/canvasRawTypes'

interface RectangleProps {
  id: string
  layer: RectangleBoxLayer
  onPointerDown: (e: React.PointerEvent, id: string) => void
  SelectionColorBasedOnConnId?: string
}

/*
This component renders a rectangle on a canvas interface with interactive properties 
like position, size, fill color, and stroke color (border). 
*/
export const Rectangle = ({
  id,
  layer,
  onPointerDown,
  SelectionColorBasedOnConnId,
}: RectangleProps) => {
  const { x, y, width, height, fill } = layer

  return (
    <rect
      // Applying CSS for pointer cursor and a small shadow for better visibility
      className="cursor-pointer drop-shadow-sm" 
      
      // Trigger the onPointerDown event when the rectangle is clicked
      onPointerDown={e => onPointerDown(e, id)}
      
      // Position the rectangle using the transform property based on 'x' and 'y'
      style={{ transform: `translate(${x}px, ${y}px)` }}
      
      // Fixed position in the rectangle (always at 0,0 inside the 'rect' element)
      x={0}
      y={0}
      
      // Setting the width and height of the rectangle based on the 'layer' prop
      width={width}
      height={height}
      
      // Setting the stroke width of the rectangle's border
      strokeWidth={1}
      
      // Setting the fill color of the rectangle. If 'fill' is provided, using it otherwise using default to black.
      fill={fill ? colors(fill) : "#000"}
      
      // Set the stroke color (border). If a connection ID-based color is provided, using that otherwise making it transparent.
      stroke={SelectionColorBasedOnConnId || 'transparent'}
    />
  )
}
