import { useState, useRef, useEffect } from 'react'
import { Inter } from 'next/font/google'
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable'
import { TextBoxLayer } from '@/types/canvasRawTypes'
import { cn, colors } from '@/utils/utils'
import { useMutation } from '@/liveblocks.config'
import { Settings } from 'lucide-react'
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

  // State to track if the text is active and if the settings popover is visible.
  const [isTextActive, setIsTextActive] = useState(false)
  const [showPopover, setShowPopover] = useState(false)
  // State for custom font size
  const [customFontSize, setCustomFontSize] = useState<number | null>(null)
  // State for custom font family.
  const [customFontFamily, setCustomFontFamily] = useState<string>('Inter')
  // Determining the font size using customFontSize if set  otherwise, calculate based on container dimensions.
  const fontSize = customFontSize !== null ? customFontSize : calculateFontSize(width, height)

  // Refs to detect outside clicks on the container and popover.
  const containerRef = useRef<HTMLDivElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)

  // useEffect hook to close the popover and deactivate text editing if clicking outside the container or popover.
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node
      // If the click target is not inside the container or the popover, closing the popover and deactivating the text.
      if (
        containerRef.current &&
        !containerRef.current.contains(target) &&
        popoverRef.current &&
        !popoverRef.current.contains(target)
      ) {
        setShowPopover(false)
        setIsTextActive(false)
      }
    }

    // Adding event listener for detecting outside clicks.
    document.addEventListener('mousedown', handleClickOutside)
    // Cleaning up the event listener on component unmount.
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    // Rendering the component within an SVG foreignObject so that HTML can be used inside an SVG.
    <foreignObject
      x={x}
      y={y}
      width={width}
      height={height}
      style={{
        // Applying an optional outline if a selection color is provided.
        outline: SelectionColorBasedOnConnId ? `1px solid ${SelectionColorBasedOnConnId}` : 'none',
        overflow: 'visible',
      }}
      // Passing pointer down events to the parent handler with the element's id.
      onPointerDown={(e) => onPointerDown(e, id)}
    >
      <div
        ref={containerRef}
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          overflow: 'visible',
        }}
      >
        <ContentEditable
          // Displaying the current text value or a default string if none is provided.
          html={value ?? 'Text'}
          onChange={handleContentChange} // Updating the text value on content change.
          onFocus={() => setIsTextActive(true)} // Activating text editing state on focus.
          className={cn(
            'h-full w-full flex items-center justify-center text-center drop-shadow-md outline-none',
            interFont.className
          )}
          style={{
            fontSize, 
            color: backgroundColor ? colors(backgroundColor) : '#000', 
            padding: '5px', 
            lineHeight: 1.2, 
            fontFamily: customFontFamily, 
          }}
        />

        {/* Rendering the settings button if the text is active */}
        {(isTextActive || showPopover) && (
          <button
            onClick={(e) => {
              e.stopPropagation() // Prevent the click from propagating to parent elements.
              setShowPopover((prev) => !prev) // Toggle the visibility of the settings popover.
            }}
            style={{
              position: 'absolute',
              top: 5,
              right: 5,
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '50%',
              transition: 'background-color 0.2s',
              zIndex: 1001,
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.05)')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = 'transparent')
            }
            aria-label="Text Settings"
          >
            <Settings size={20} /> 
          </button>
        )}

        {/* Rendering the popover for font settings if showPopover is true */}
        {showPopover && (
          <div
            ref={popoverRef}
            style={{
              position: 'absolute',
              top: 40,
              right: 5,
              background: '#fff',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              padding: '12px',
              zIndex: 1000,
              width: '180px',
            }}
          >
            <div style={{ marginBottom: '10px' }}>
              <label htmlFor="fontSize" style={{ fontSize: '0.85rem', color: '#333' }}>
                Font Size
              </label>
              <input
                id="fontSize"
                type="number"
                value={fontSize} 
                onChange={(e) => setCustomFontSize(Number(e.target.value))} 
                style={{
                  width: '100%',
                  padding: '4px 8px',
                  marginTop: '4px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '0.9rem',
                }}
              />
            </div>
            <div>
              <label htmlFor="fontFamily" style={{ fontSize: '0.85rem', color: '#333' }}>
                Font Family
              </label>
              <select
                id="fontFamily"
                value={customFontFamily} 
                onChange={(e) => setCustomFontFamily(e.target.value)} 
                style={{
                  width: '100%',
                  padding: '4px 8px',
                  marginTop: '4px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '0.9rem',
                }}
              >
                <option value="Inter">Inter</option>
                <option value="Roboto">Roboto</option>
                <option value="Arial">Arial</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </foreignObject>
  )
}
