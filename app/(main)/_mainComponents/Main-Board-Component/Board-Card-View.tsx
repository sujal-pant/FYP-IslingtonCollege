'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@clerk/nextjs'
import { MoreHorizontal } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { toast } from 'sonner'

import { api } from '@/convex/_generated/api'
import { BoardViewAction } from '@/app/(main)/_mainComponents/Main-Board-Component/Board-View-Action'
import { Skeleton } from '@/components/ui/skeleton'
import { BoardCardInfo } from './Board-Card-Info'
import { BoardWholeHover } from './Board-Whole-Hover'

import { customapi } from '@/Custom-hooks/custom-api'

interface BoardCardProps {
  id: string
  title: string
  BoardOwnerName: string
  BoardOwnerId: string
  createdAt: number
  imageUrl: string
  orgId: string
  isFavorite: boolean
}

export const BoardCard = ({
  id,
  title,
  BoardOwnerId,
  BoardOwnerName,
  createdAt,
  imageUrl,
  orgId,
  isFavorite,
}: BoardCardProps) => {
  const { userId } = useAuth()

  // Set the label for the author (use 'You' if the current user is the author)
  const authorLabel = userId === BoardOwnerId ? 'You' : BoardOwnerName
  
  // Format the creation date to show relative time
  const createdAtLabel = formatDistanceToNow(createdAt, {
    addSuffix: true,
  })

  // API mutation hooks for favoriting/unfavoriting
  const { mutate: onFavorite, pending: pendingFavorite } = customapi(
    api.boardController.favorite
  )
  const { mutate: onUnfavorite, pending: pendingUnfavorite } = customapi(
    api.boardController.unfavorite
  )

  // Toggle favorite status based on the current state
  const toggleFavorite = () => {
    if (isFavorite)
      onUnfavorite({ id }).catch(() => toast.error('Failed to unfavorite'))
    else
      onFavorite({ id, orgId }).catch(() => toast.error('Failed to favorite'))
  }

  return (
    <Link href={`/board/${id}`}>
      <div className="group aspect-[100/130] border rounded-lg flex flex-col justify-between overflow-hidden max-w-[220px] w-full">
        <div className="relative flex-1 bg-amber-50">
          <Image src={imageUrl} alt={title} layout="fill" objectFit="cover" />
          <BoardWholeHover />
          {/* Action button for options (shown on hover) */}
          <BoardViewAction id={id} title={title} side="right">
            <button className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg bg-white shadow-md">
              <MoreHorizontal className="text-black-500 opacity-75 hover:opacity-100 transition-opacity" />
            </button>
          </BoardViewAction>
        </div>
        {/* Display board card info like title, author, and creation date */}
        <BoardCardInfo
          isFavorite={isFavorite}
          title={title}
          authorLabel={authorLabel}
          createdAtLabel={createdAtLabel}
          onClick={toggleFavorite}
          disabled={pendingFavorite || pendingUnfavorite}
        />
      </div>
    </Link>
  )
}

// Skeleton loader component for the board card (used during loading)
BoardCard.Skeleton = function BoardCardSkeleton() {
  return (
    <div className="aspect-[100/130] rounded-lg overflow-hidden max-w-[220px] w-full">
      <Skeleton className="w-full h-full" />
    </div>
  )
}
