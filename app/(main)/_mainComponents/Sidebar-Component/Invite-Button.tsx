import { Plus } from 'lucide-react';
import { OrganizationProfile } from '@clerk/nextjs';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

export const InviteButton = () => (
  <Dialog>
    <DialogTrigger asChild>
      <Button variant="outline" className="h-[45px] lg:h-[40px] text-gray-800"> {/* Adjusted text color */}
        <Plus className="h-4 w-4 mr-2" /> {/* Ensure spacing is applied */}
        <span className="hidden sm:inline-flex">Invite </span> {/* Removed 'xs:' in favor of 'sm:' */}
      </Button>
    </DialogTrigger>
    <DialogContent className="p-0 max-w-[880px]"> {/* Removed background and border styles */}
      <OrganizationProfile />
    </DialogContent>
  </Dialog>
);
