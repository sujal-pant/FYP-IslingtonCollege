'use client'

import { Link2, Pencil, Trash2 } from 'lucide-react'; // Importing necessary icons for actions
import { toast } from 'sonner'; // For displaying toast notifications
import { DropdownMenuContentProps } from '@radix-ui/react-dropdown-menu'; // Types for dropdown props

// Importing components for the dropdown menu and button
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'; 
import { Button } from '@/components/ui/button';

// Importing API mutations and hooks for managing board actions
import { api } from '@/convex/_generated/api';
import { customapi } from '@/hooks/custom-api';

// Importing components for confirmation modal and renaming functionality
import { ConfirmModal } from './confirm-model';
import { modelrename } from '@/store/Model-Rename';

interface BoardViewActionProps {
  children: React.ReactNode; // Children will be the trigger for the dropdown
  side?: DropdownMenuContentProps['side']; // Optional dropdown positioning
  sideOffset?: DropdownMenuContentProps['sideOffset']; // Optional offset for dropdown
  id: string; // The unique identifier for the board
  title: string; // Title of the board
}

export const BoardViewAction = ({
  children,
  side,
  sideOffset,
  id,
  title,
}: BoardViewActionProps) => {
  // Hook to manage renaming modal
  const { onOpen } = modelrename();
  
  // Mutation hook for deleting a board
  const { mutate, pending } = customapi(api.board.remove);

  // Function to handle copying the board link to the clipboard
  const onCopyLink = () => {
    navigator.clipboard
      .writeText(`${window.location.origin}/board/${id}`)
      .then(() => toast.success('Link copied successfully!'))
      .catch(() => toast.error('Failed to copy the link'));
  };

  // Function to handle the deletion of the board
  const onDelete = () => {
    mutate({ id }) // Trigger the delete mutation
      .then(() => toast.success('Board successfully deleted'))
      .catch(() => toast.error('Failed to delete the board'));
  };

  return (
    <DropdownMenu>
      {/* Trigger element for dropdown (e.g., button or icon) */}
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      
      {/* Dropdown content, positioned based on props */}
      <DropdownMenuContent
        onClick={(e) => e.stopPropagation()} // Prevents closing dropdown on item click
        side={side}
        sideOffset={sideOffset}
        className="w-60" // Width of the dropdown content
      >
        {/* Option to copy the board link */}
        <DropdownMenuItem onClick={onCopyLink} className="p-3 cursor-pointer">
          <Link2 className="h-4 w-4 mr-2" /> {/* Copy link icon */}
          Copy link
        </DropdownMenuItem>
        
        {/* Option to rename the board */}
        <DropdownMenuItem
          onClick={() => onOpen(id, title)} // Open rename modal with board id and title
          className="p-3 cursor-pointer"
        >
          <Pencil className="h-4 w-4 mr-2" /> {/* Rename icon */}
          Rename
        </DropdownMenuItem>
        
        {/* Confirmation modal for board deletion */}
        <ConfirmModal
          header="Delete board?"
          description="This action will permanently delete the board and its contents."
          disabled={pending} // Disable button if pending deletion
          onConfirm={onDelete} // Trigger delete on confirmation
        >
          {/* Delete option in the dropdown */}
          <Button
            variant="ghost"
            className="p-3 cursor-pointer text-sm w-full justify-start font-normal"
          >
            <Trash2 className="h-4 w-4 mr-2" /> {/* Trash icon */}
            Delete
          </Button>
        </ConfirmModal>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
