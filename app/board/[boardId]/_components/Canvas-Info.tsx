'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Poppins } from 'next/font/google'
import { useQuery } from 'convex/react'
import { Menu, ArrowLeft } from 'lucide-react'

import { ElementoviewProps } from '@/components/Element-View'
import { api } from '@/convex/_generated/api'
import { BoardViewAction } from '@/components/Board-View-Action'
import { Button } from '@/components/ui/button'

import { cn } from '@/lib/utils'
import { Id } from '@/convex/_generated/dataModel'
import { modelrename } from '@/store/Model-Rename'

interface InfoProps {
  boardId: string
}

const font = Poppins({ subsets: ['latin'], weight: ['600'] })

const TabSeparator = () => <div className="text-neutral-300 px-1.5">|</div>

export const CanvasInfo = ({ boardId }: InfoProps) => {
  const router = useRouter()
  const { onOpen } = modelrename()

  const boarddata = useQuery(api.boardController.get, {
    id: boardId as Id<'boards'>,
  })

  if (!boarddata) return <InfoSkeleton />

  return (
    <div className="absolute top-2 left-2 bg-white rounded-md px-1.5 h-12 flex items-center shadow-md">
      <ElementoviewProps label="Go to boards" side="bottom" sideOffset={10}>
        <Button asChild variant="board" className="px-2 flex items-center">
          <Link href="/">
            <ArrowLeft className="h-5 w-5 text-black" />
            <span
              className={cn(
                'font-semibold text-xl ml-2 text-black',
                font.className
              )}
            >
              Home
            </span>
          </Link>
        </Button>
      </ElementoviewProps>
      <TabSeparator />
      <ElementoviewProps label="Edit title" side="bottom" sideOffset={10}>
        <Button
          variant="board"
          className="text-base font-normal px-2"
          onClick={() => onOpen(boarddata._id, boarddata.title)}
        >
          {boarddata.title}
        </Button>
      </ElementoviewProps>
      <TabSeparator />
      <BoardViewAction id={boarddata._id} title={boarddata.title} side="bottom" sideOffset={10}>
        <div>
          <ElementoviewProps label="Main menu" side="bottom" sideOffset={10}>
            <Button size="icon" variant="board">
              <Menu />
            </Button>
          </ElementoviewProps>
        </div>
      </BoardViewAction>
    </div>
  )
}

export const InfoSkeleton = () => (
  <div className="absolute top-2 left-2 bg-white rounded-md px-1.5 h-12 flex items-center shadow-md w-[300px]" />
)