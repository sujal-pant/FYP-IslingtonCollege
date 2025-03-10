'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Poppins } from 'next/font/google'
import { useQuery, useMutation } from 'convex/react'
import { Menu, ArrowLeft, Heart, HeartOff } from 'lucide-react'
import { toast } from 'sonner' 
import { ElementoviewProps } from '@/components/Global Display/Element-View'
import { api } from '@/convex/_generated/api'
import { BoardViewAction } from '@/app/(main)/_mainComponents/Main-Board-Component/Board-View-Action'
import { Button } from '@/components/ui/button'

import { cn } from '@/utils/utils'
import { Id } from '@/convex/_generated/dataModel'
import { modelrename } from '@/components/modals/Model-Rename'
import { useState, useEffect } from 'react'

interface InfoProps {
  boardId: string
}

const font = Poppins({ subsets: ['latin'], weight: ['600'] })

const TabSeparator = () => <div className="text-neutral-300 px-1.5">|</div>

export const CanvasInfo = ({ boardId }: InfoProps) => {
  const router = useRouter()
  const { onOpen } = modelrename()

  const boarddata: { _id: Id<'boards'>; _creationTime: number; BoardOwnerId: string; BoardOwnerName: string; title: string; orgId: string; imageUrl: string; isFavorite?: boolean } | null | undefined = useQuery(api.boardController.getBoards, {
    id: boardId as Id<'boards'>,
  });


  const [isFavorite, setIsFavorite] = useState(false);  

  useEffect(() => {
    if (boarddata) {
      setIsFavorite(boarddata.isFavorite ?? false)
    }
  }, [boarddata?.isFavorite])  
  const markFavorite = useMutation(api.boardController.markfavoriteBoard)
  const unmarkFavorite = useMutation(api.boardController.markUnfavoriteBoard)

  if (!boarddata) return <InfoSkeleton />

  const handleFavoriteToggle = async () => {
    try {
      if (isFavorite) {
        setIsFavorite(false)  
        await unmarkFavorite({ id: boardId as Id<'boards'> }) 
        toast.success("Removed from favorites")
      } else {
        setIsFavorite(true) 
        await markFavorite({ id: boardId as Id<'boards'>, orgId: boarddata.orgId })  
        toast.success("Added to favorites")
      }
    } catch (error) {
      console.error("Error toggling favorite status:", error)
      setIsFavorite(!isFavorite); 
      toast.error("Failed to update favorite status")
    }
  }

  return (
    <div className="absolute top-2 left-2 bg-white rounded-md px-1.5 h-12 flex items-center shadow-md">
      <ElementoviewProps label="Go to boards" side="bottom" sideOffset={10}>
        <Button asChild variant="board" className="px-2 flex items-center">
          <Link href="/">
            <ArrowLeft className="h-5 w-5 text-black" />
            <span className={cn('font-semibold text-xl ml-2 text-black', font.className)}>Home</span>
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
      <ElementoviewProps label={isFavorite ? "Remove from favorites" : "Add to favorites"} side="bottom" sideOffset={10}>
        <Button
          variant="board"
          className="text-base font-normal px-2"
          onClick={handleFavoriteToggle}
        >
          {isFavorite ? <Heart className="text-yellow-500" /> : <HeartOff className="text-gray-500" />}
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




