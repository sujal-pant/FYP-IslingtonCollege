'use client'

import { useRouter } from 'next/navigation'
import { useOrganization } from '@clerk/nextjs'
import Image from 'next/image'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { customapi } from '@/Custom-hooks/custom-api'
import { api } from '@/convex/_generated/api'

/**
 * Component to display when there are no boards available.
 * Provides an option to create a new board for the organization.
 */
export const EmptyBoardState = () => {
  const router = useRouter()  
  const { organization } = useOrganization()  
  const { mutate, pending } = customapi(api.boardController.createnewboard)  // Mutation hook to create a new board

  /**
   * Handles the creation of a new board.
   * It ensures that the organization is available, then makes a request to create a board.
   */
  const handleBoardCreation = () => {
    // If no organization exists
    if (!organization) return

    // Mutate  API to create the board with the given organization ID and a default title
    mutate({
      orgId: organization.id,  // Organization ID
      title: 'Untitled',  // Default title for the new board
    })
      .then(id => {
        // Showing success message and navigate to the new board's page
        toast.success('Successfully created board!')
        router.push(`/board/${id}`)  // Redirecting to the new board page
      })
      .catch(() => {
        // Showing error message if board creation fails
        toast.error('Something went wrong while creating the board')
      })
  }

  return (
    <div className="h-full flex flex-col items-center justify-center">
      <Image src="/note.svg" height={110} width={110} alt="No Boards" />
      
      <h2 className="text-2xl font-semibold mt-6">Start by creating a board!</h2>
      <p className="text-muted-foreground text-sm mt-2">
        Create a board for your organization to get started
      </p>

      <div className="mt-6">
        <Button disabled={pending} onClick={handleBoardCreation} size="lg">
          Create a board
        </Button>
      </div>
    </div>
  )
}
