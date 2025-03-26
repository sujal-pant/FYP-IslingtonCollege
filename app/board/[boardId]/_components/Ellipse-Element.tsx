import { EllipseLayer } from '@/types/canvasRawTypes'
import { colors } from '@/utils/utils'

interface EllipseProps {
  id: string
  layer: EllipseLayer
  onPointerDown: (e: React.PointerEvent, id: string) => void
  selectionColor?: string
}

export const EllipseElement = ({
  id,
  layer,
  onPointerDown,
  selectionColor,
}: EllipseProps) => (
  <ellipse
    className="drop-shadow-md"
    onPointerDown={e => onPointerDown(e, id)}
    style={{ transform: `translate(${layer.x}px, ${layer.y}px)` }}
    cx={layer.width / 2}
    cy={layer.height / 2}
    rx={layer.width / 2}
    ry={layer.height / 2}
    fill={layer.backgroundColor ? colors(layer.backgroundColor) : '#000'}
    stroke={selectionColor || 'transparent'}
    strokeWidth="1"
  />
)