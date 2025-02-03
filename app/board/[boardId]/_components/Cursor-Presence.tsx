'use client'

import { memo } from 'react'
import { MousePointer } from 'lucide-react'

import { useOther } from '@/liveblocks.config'
import { usercolor } from '@/lib/utils'

interface CursorPresenceProps {
  connectionId: number
}

// Memoized component to optimize re-renders
export const CursorPresence = memo(({ connectionId }: CursorPresenceProps) => {
  // Getting user info (name) from Liveblocks
  const userName = useOther(connectionId, user => user?.info)

  // Getting user's cursor position from Liveblocks
  const cursorPosition = useOther(connectionId, user => user.presence.cursor)

  // Default username if no user info is found
  const username = userName?.name || 'Team Member'

  // If the user's cursor is not available, not rendering the component
  if (!cursorPosition) return null

  const { x, y } = cursorPosition // Extracting cursor position

  return (
    <foreignObject
      // Position the cursor based on user's coordinates
      style={{ transform: `translateX(${x}px) translateY(${y}px)` }}
      height={50}
      width={username.length * 10 + 34}
      className="relative drop-shadow-md"
    >
      {/* Cursor Icon */}
      <MousePointer
        className="h-5 w-5"
        style={{
          fill: usercolor(connectionId), // Assignning color based on user ID
          color: usercolor(connectionId),
        }}
      />

      {/* Username Display */}
      <div
  className="absolute left-7 top-2 px-3 py-1 rounded-lg text-xs font-medium text-white shadow-lg border border-white/20"
  style={{
    backgroundColor: usercolor(connectionId),
    backdropFilter: "blur(4px)", 
    whiteSpace: "nowrap", 
  }}
>
  {username}
</div>

    </foreignObject>
  )
})

CursorPresence.displayName = 'CursorPresence'
