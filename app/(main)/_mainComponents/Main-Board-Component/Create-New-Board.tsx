'use client'

import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

import { api } from '@/convex/_generated/api';
import { customapi } from '@/Custom-hooks/custom-api';

interface CreatenewboardProps {
  orgId: string;
  disabled?: boolean;
}
  /*
  The Createnewboard component allows users to create a new board within an organization. 
  Upon success, the user is redirected to the new board, with notifications for success or failure.
  */

export const Createnewboard = ({ orgId, disabled }: CreatenewboardProps) => {
  const router = useRouter();
  // Calling the  API function to create a new board.
  const { mutate, pending } = customapi(api.boardController.createnewboard);

//function for creating a new board.
  const handleCreateBoard = () => {
    mutate({
      orgId,
      title: 'Untitled',
    })
      .then((boardId) => {
        toast.success('Board successfully created!');
        router.push(`/board/${boardId}`);
      })
      .catch(() => {
        toast.error('Failed to create board. Please try again later.');
      });
  };

  return (
        // Button for creating a new board.
    <button
      disabled={pending || disabled}
      onClick={handleCreateBoard}
      className={`flex items-center justify-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-300 ease-in-out
        ${
          pending || disabled
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-blue-500 hover:bg-blue-600 text-white shadow-sm hover:shadow-md'
        }`}
    >
      <Plus className="h-4 w-4 text-white" />
      Create Board
    </button>
  );
};
