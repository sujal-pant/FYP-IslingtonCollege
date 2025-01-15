'use client'

import { memo } from 'react'
import { MousePointer2 } from 'lucide-react'

import { useOther } from '@/liveblocks.config'
import { usercolor } from '@/lib/utils'

interface PointerProps {
  connectionId: number
}

export const Pointer = memo(({ connectionId }: PointerProps) => {
  const user_info = useOther(connectionId, user => user?.info)
  const user_pointer = useOther(connectionId, user => user.presence.cursor)

  const username = user_info?.name || 'Anonymous'

  if (!user_pointer) return null

  const { x, y } = user_pointer

  return (
    <foreignObject
      style={{ transform: `translateX(${x}px) translateY(${y}px)` }}
      height={50}
      width={username.length * 10 + 24}
      className="relative drop-shadow-md"
    >
      <MousePointer2
        className="h-5 w-5"
        style={{
          fill: usercolor(connectionId),
          color: usercolor(connectionId),
        }}
      />
      <div
        className="absolute left-5 px-1.5 py-0.5 rounded-md text-xs text-white font-semibold"
        style={{ backgroundColor: usercolor(connectionId) }}
      >
        {username}
      </div>
    </foreignObject>
  )
})

Pointer.displayName = 'Pointer'