"use client";

import { Plus } from "lucide-react";
import { CreateOrganization } from "@clerk/nextjs";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ElementoviewProps } from "@/components/Element-View";

export const CreateOrganizationButton = () => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className="aspect-square">
                    <ElementoviewProps label="Create Organization" side="right" align="start" sideOffset={18}>
                        <button className="bg-gray-100 h-full rounded-md flex items-center justify-center text-gray-700 hover:bg-gray-200 hover:text-gray-900 transition shadow-sm">
                            <Plus className="h-5 w-5" />
                        </button>
                    </ElementoviewProps>
                </div>
            </DialogTrigger>

            <DialogContent className="p-0 bg-white border border-gray-300 rounded-lg max-w-[480px] shadow-lg">
                <CreateOrganization />
            </DialogContent>
        </Dialog>
    );
};
