"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Poppins } from "next/font/google";
import { cn } from "@/utils/utils";
import { SignOutButton, useOrganization, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { List, ChevronDown, Clock, Heart } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { OrganizationList } from "./Organiazation-Lists";
import { CreateOrganizationButton } from "./Create-Organization-Button";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { formatDistanceToNow } from "date-fns";

const font = Poppins({ subsets: ["latin"], weight: ["600"] });

const OrganizationSidebar = () => {
  // Retrieving the current organization using Clerk's hook
  const { organization } = useOrganization();

  // Retrieving query parameters for search and favorites from the URL
  const searchParams = useSearchParams();
  const favorites = searchParams.get("favorites");
  const query = {
    search: searchParams.get("search") ?? undefined,
    favorites: favorites ?? undefined,
  };

  // Getting the organization ID from the current organization
  const orgId = organization?.id;
  if (!orgId) {
    console.error("Organization ID is not available");
    return <div>Error: Organization not found</div>;
  }

  // Fetching recent boards based on the organization ID and query parameters
  const recentBoards = useQuery(api.getBoards.get, { orgId, ...query });

  const [isOrgListVisible, setIsOrgListVisible] = useState(false);

  // Local state for the active navigation tab ("current" or "favorites")
  const [activeTab, setActiveTab] = useState<string>("current");

  // Function to change the active tab based on user clicks
  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="hidden lg:flex flex-col w-[320px] p-6 space-y-6 bg-gradient-to-br from-white via-gray-50 to-blue-50 shadow-xl rounded-3xl border border-gray-100">
     
     <Link
  href="/"
  className="flex items-center gap-x-3 group transition-transform duration-200"  
>
  <div className="relative">
    <Image
      src="/logo.png"
      alt="Logo"
      height={50}
      width={50}
      className="rounded-xl shadow-sm group-hover:shadow-md transition-shadow duration-200"
    />
  </div>
  <span
    className={cn(
      "font-bold text-2xl bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent",
      font.className
    )}
  >
    SketchSphere
  </span>
</Link>
      {/* Organization Section */}
      <div className="space-y-3">
        {/* Header for organizations */}
        <div className="flex items-center justify-between px-2">
          <span className="text-sm font-semibold text-gray-600">
            Organizations
          </span>
        </div>

        {/* Organization Switcher and Organization Creation Button */}
        <div className="flex items-center space-x-2">
        
          <div className="relative flex-grow">
            <Button
              onClick={() => setIsOrgListVisible(!isOrgListVisible)}
              variant="ghost"
              className="w-full justify-between border border-gray-300 bg-gray-100 rounded-xl px-4 py-3 hover:bg-gray-200 transition-colors duration-200 flex items-center"
            >
              <div className="flex items-center space-x-2">
                {organization ? (
                  <>
                    
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                      {organization.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium truncate">
                      {organization.name}
                    </span>
                  </>
                ) : (
                  <>
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold">
                      T
                    </div>
                    <span className="font-medium">Team Space</span>
                  </>
                )}
              </div>
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </Button>

            {/* Organization List Popup */}
            {isOrgListVisible && (
              <div className="absolute left-full ml-3 top-0 w-[300px] bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl shadow-lg z-50 animate-in slide-in-from-left-1 duration-200">
                <div className="max-h-64 overflow-y-auto p-4 space-y-2">
                  <OrganizationList />
                </div>
              </div>
            )}
          </div>

          {/* Organization Creation Button  */}
          <div className="flex-shrink-0">
          
            <CreateOrganizationButton />
          </div>
        </div>
      </div>
<hr />
      {/* Navigation Buttons */}
      <div className="space-y-2">
       
        <Button
          onClick={() => handleTabClick("current")}
          variant={activeTab === "current" ? "outline" : "ghost"}
          asChild
          className={cn(
            "w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-gray-800 hover:bg-gray-100 transition-all duration-300",
            activeTab === "current"
              ? "bg-white shadow-md border-blue-200 hover:border-blue-300"
              : "hover:shadow-sm"
          )}
        >
          <Link href="/">
            <List className="h-5 w-5 text-blue-600" />
            <span className="font-medium">Current Boards</span>
          </Link>
        </Button>
        <Button
          onClick={() => handleTabClick("favorites")}
          variant={activeTab === "favorites" ? "outline" : "ghost"}
          asChild
          className={cn(
            "w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-gray-800 hover:bg-gray-100 transition-all duration-300",
            activeTab === "favorites"
              ? "bg-white shadow-md border-red-200 hover:border-red-300"
              : "hover:shadow-sm"
          )}
        >
          <Link href={{ pathname: "/", query: { favorites: true } }}>
            <Heart
              className={cn(
                "h-5 w-5 transition-colors duration-300",
                activeTab === "favorites"
                  ? "text-red-500 fill-red-500"
                  : "text-red-400"
              )}
            />
            <span className="font-medium">Favorite Boards</span>
          </Link>
        </Button>
      </div>
<hr />
      {/* Recent Boards Section */}
      <div className="space-y-4">
        <div className="px-4 text-sm font-semibold text-gray-600">
          Recent Boards
        </div>
        <div className="space-y-3">
          {recentBoards?.length === 0 ? (
            <div className="px-4 py-2 text-sm text-gray-500">
              No recent boards.
            </div>
          ) : (
            recentBoards?.slice(0, 3).map((boarddata) => {
              // Formatting the creation date to a relative time string 
              const createdAtLabel = formatDistanceToNow(
                new Date(boarddata._creationTime),
                { addSuffix: true }
              );

              return (
                <Link
                  key={boarddata._id}
                  href={`/board/${boarddata._id}`}
                  className="group p-4 bg-white/80 backdrop-blur-sm rounded-xl border shadow-sm hover:bg-gray-100 transition-all duration-200 cursor-pointer block"
                >
                  {/*  board title and creation time */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-800 truncate max-w-[70%] group-hover:text-gray-900">
                      {boarddata.title}
                    </span>
                    <div className="flex items-center gap-2 text-sm text-gray-500 whitespace-nowrap group-hover:text-gray-700">
                      <Clock className="h-4 w-4" />
                      <span>{createdAtLabel}</span>
                    </div>
                  </div>
                  {/*board owner's name */}
                  <div className="flex items-center gap-2 text-sm text-gray-500 group-hover:text-gray-700">
                    <span className="font-medium">
                      {boarddata.BoardOwnerName}
                    </span>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>

      {/* Sign Out Button */}
      <SignOutButton>
        <Button
          variant="ghost"
          className="w-full flex items-center justify-center gap-2 px-4 py-3 text-white font-semibold bg-red-500 hover:bg-red-600 rounded-xl shadow-md transition-all duration-300"
        >
          <span>Sign Out</span>
        </Button>
      </SignOutButton>
    </div>
  );
};

export default OrganizationSidebar;
