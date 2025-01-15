'use client'

import { useRouter } from 'next/navigation' // Importing Next.js navigation hook for programmatic routing
import { Plus } from 'lucide-react' // Importing the "Plus" icon from Lucide React library for the button
import { toast } from 'sonner' // Importing toast notification utility for success/error messages

import { api } from '@/convex/_generated/api' // Importing the API functions from Convex for board management
import { customapi } from '@/hooks/custom-api' 

interface CreatenewboardProps {
  orgId: string // Organization ID where the new board will be created
  disabled?: boolean // Optional prop to disable the button
}

export const Createnewboard = ({ orgId, disabled }: CreatenewboardProps) => {
  const router = useRouter() 
  const { mutate, pending } = customapi(api.board.create) 

  /**
   * This function handles the creation of a new board.
   * It will be triggered when the button is clicked.
   */
  const handleCreateBoard = () => {
    // Calling the mutate function to create a new board with the specified organization ID and a default title
    mutate({
      orgId,
      title: 'Untitled', // Default title for the new board
    })
      .then((boardId) => {
        // On success, show a success notification and redirect to the newly created board
        toast.success('Board successfully created!')
        router.push(`/board/${boardId}`) // Navigate to the newly created board
      })
      .catch(() => {
        // On error, show an error notification
        toast.error('Failed to create board. Please try again later.')
      })
  }

  return (
    <button
      disabled={pending || disabled} // Disabling the button if the mutation is in progress or if explicitly disabled
      onClick={handleCreateBoard} // Handling the button click to create the board
      className={
        // Applying Tailwind classes for styling with smooth transition and hover effects
        `col-span-1 aspect-[100/127] bg-gray-600 rounded-lg flex flex-col items-center justify-center gap-2 py-4 px-6 transition-all duration-300 ease-in-out transform hover:scale-105 ${pending || disabled ? 'opacity-60 cursor-not-allowed' : ''}`
      }
    >
      <Plus className="h-8 w-8 text-white stroke-1.5" /> {/* Plus icon */}
      <p className="text-sm text-white font-medium">Create New Board</p> {/* Button text */}
    </button>
  )
}
