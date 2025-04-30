'use client'
import { useRouter } from 'next/navigation'; // ✅ Add this

import { Link2, Pencil, Trash2 } from 'lucide-react'; 
import { toast } from 'sonner'; 
import { DropdownMenuContentProps } from '@radix-ui/react-dropdown-menu';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'; 
import { Button } from '@/components/ui/button';
import { api } from '@/convex/_generated/api';
import { customapi } from '@/Custom-hooks/custom-api';
import { ConfirmModal } from '../../../../components/modals/confirm-model';
import { modelrename } from '@/components/modals/Model-Rename';
import { useOrganization, useUser } from '@clerk/nextjs';

interface BoardViewActionProps {
  children: React.ReactNode; 
  side?: DropdownMenuContentProps['side']; 
  sideOffset?: DropdownMenuContentProps['sideOffset']; 
  id: string; 
  title: string; 
}

export const BoardViewAction = ({
  children,
  side,
  sideOffset,
  id,
  title,
}: BoardViewActionProps) => {
  const { user } = useUser();
  const { organization } = useOrganization(); // Get the current active organization
  const router = useRouter(); 

  const currentOrgId = organization?.id;
  const currentOrgMembership = user?.organizationMemberships?.find(
    (membership) => membership.organization.id === currentOrgId
  );
  const currentRole = currentOrgMembership?.role;

  // Hook to manage renaming modal
  const { onOpen } = modelrename();
  
  // Mutation hook for deleting a board
  const { mutate, pending } = customapi(api.boardController.removeBoard);

  // Function to handle copying the board link to the clipboard
  const onCopyLink = () => {
    navigator.clipboard
      .writeText(`${window.location.origin}/board/${id}`)
      .then(() => toast.success('Link copied successfully!'))
      .catch(() => toast.error('Failed to copy the link'));
  };

  // Function to handle the deletion of the board
  const onDelete = () => {
    mutate({ id })
      .then(() => {
        toast.success('Board successfully deleted');
        router.push('/'); 
      })
      .catch(() => toast.error('Failed to delete the board'));
  };
  



  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      
      <DropdownMenuContent
        onClick={(e) => e.stopPropagation()} 
        side={side}
        sideOffset={sideOffset}
        className="w-60" 
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

        {currentRole === 'org:admin' && (
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
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
