import Image from 'next/image';
import { CreateOrganization } from '@clerk/nextjs';
import { Poppins } from 'next/font/google';
import { cn } from "@/utils/utils";

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

const font = Poppins({ subsets: ["latin"], weight: ["600"] });

export const EmptyOrg = () => (
  <div className="h-full flex flex-col items-center justify-center">
    <Image src="/elements.svg" alt="Empty" height={150} width={150} className="opacity-80" />  
    <h2 className={cn("text-3xl font-semibold mt-6 text-gray-800", font.className)}>
      Welcome to SketchSphere
    </h2>
    <p className="text-muted-foreground text-sm mt-2 text-center max-w-md">  
      Create an organization to unlock the full potential of collaborative boards and streamlined workflows.
    </p>
    <div className="mt-8">
    <Dialog>
        <DialogTrigger asChild>
          <Button size="lg">Create organization</Button>
        </DialogTrigger>
        <DialogContent className="p-0 bg-transparent border-none max-w-[480px]">
          <CreateOrganization />
        </DialogContent>
      </Dialog>
    </div>
  </div>
);