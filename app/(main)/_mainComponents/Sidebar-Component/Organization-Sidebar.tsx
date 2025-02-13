"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Poppins } from "next/font/google";
import { cn } from "@/utils/utils";
import {
  SignOutButton,
  useOrganization,
  UserButton,
  useUser,
  OrganizationSwitcher,
  CreateOrganization,
} from "@clerk/nextjs"; 
import { Button } from "@/components/ui/button";
import { List, ChevronDown, Clock, Heart, X, Plus } from "lucide-react"; 
import { useSearchParams } from "next/navigation";
import { OrganizationList } from "./Organiazation-Lists";
import { CreateOrganizationButton } from "./Create-Organization-Button";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { formatDistanceToNow } from "date-fns";
import { FunctionReference } from "convex/server";
import { Id } from "@/convex/_generated/dataModel";
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

const font = Poppins({ subsets: ["latin"], weight: ["600"] });

type GetBoardsFunction = FunctionReference<
  "query",
  "public",
  { search?: string | undefined; favorites?: string | undefined; orgId: string },
  {
    isFavorite: boolean;
    _id: Id<"boards">;
    _creationTime: number;
    BoardOwnerId: string;
    BoardOwnerName: string;
    title: string;
    orgId: string;
    imageUrl: string;
  }[],
  string | undefined
>;

const OrganizationSidebar = () => {
  // Retrieving current user and organization via Clerk
  const { organization } = useOrganization();
  const { user } = useUser();

  // Getting search parameters 
  const searchParams = useSearchParams();
  const favorites = searchParams.get("favorites") ?? undefined;
  const query = useMemo(
    () => ({
      search: searchParams.get("search") ?? undefined,
      favorites: favorites,
    }),
    [searchParams, favorites]
  );

  // Getting organization ID (or null if none)
  const orgId = organization?.id ?? null;

  // State for showing custom organization list popup
  const [isOrgListVisible, setIsOrgListVisible] = useState(false);
  // State for onboarding popup (showing only if no org exists)
  const [showOnboarding, setShowOnboarding] = useState(!orgId);
  // State for onboarding step (1: welcome, 2: organization creation prompt)
  const [onboardingStep, setOnboardingStep] = useState<number>(1);
  // State for navigation tab ("current" or "favorites")
  const [activeTab, setActiveTab] = useState<string>("current");

  // Function to change the active tab
  const handleTabClick = useCallback((tab: string) => {
    setActiveTab(tab);
  }, []);

  
  const recentBoards = useQuery<GetBoardsFunction>(
    api.getBoards.get,
    orgId ? { orgId } : { orgId: "" }
  );

  const hasNoOrganization = !organization;

  const handleCloseOnboarding = useCallback(() => {
    setShowOnboarding(false);
  }, []);

  return (
    <div className="hidden lg:flex flex-col w-[320px] p-6 space-y-6 bg-gradient-to-br from-white via-gray-50 to-blue-50 shadow-xl rounded-3xl border border-gray-100">

      <Link href="/" className="flex items-center gap-x-3 group">
        <div className="relative">
          <Image
            src="/logo.png"
            alt="Logo"
            height={50}
            width={50}
            className="rounded-xl shadow-sm"
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
      <hr className="border-gray-200" />

      {/* Onboarding Popup (Two-Step Modal) */}
      {hasNoOrganization && showOnboarding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-white rounded-xl shadow-lg p-6">
            {onboardingStep === 1 ? (
              <div>
                <h2 className="text-lg font-semibold mb-2">Welcome to SketchSphere!</h2>
                <p className="text-sm text-gray-500 mb-4">
                  We're excited to have you here. Press <strong>Next</strong> to learn how to get started.
                </p>
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" onClick={handleCloseOnboarding}>
                    Skip Tutorial
                  </Button>
                  <Button  onClick={() => setOnboardingStep(2)}>
                    Next
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-lg font-semibold mb-2">Create Your Organization</h2>
                <p className="text-sm text-gray-500 mb-4">
                  To start collaborating and manage your boards, create an organization now.
                </p>
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" onClick={handleCloseOnboarding}>
                    Skip Tutorial
                  </Button>
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
            )}
            <button
              onClick={handleCloseOnboarding}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col space-y-6">
        {/* Clerk Organization Switcher */}
        <OrganizationSwitcher
          hidePersonal
          appearance={{
            elements: {
              rootBox:
                "w-full justify-between border border-gray-300 bg-gray-100 rounded-xl px-4 py-3 hover:bg-gray-200 transition-colors duration-200 flex items-center",
              selectButton: "w-full flex items-center space-x-2",
            },
          }}
        />
        {/* Organization Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-2">
            <span className="text-sm font-semibold text-gray-600">Organizations</span>
          </div>
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
                      <span className="font-medium truncate">{organization.name}</span>
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
                  <div className="p-3 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Select Organization
                    </h3>
                    <Button
                      variant="ghost"
                      onClick={() => setIsOrgListVisible(false)}
                      className="hover:bg-gray-100 rounded-full"
                    >
                      <X className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                  <div className="max-h-64 overflow-y-auto p-3 space-y-2 scrollbar-thin scrollbar-thumb-rounded scrollbar-track-rounded scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    <OrganizationList />
                  </div>
                </div>
              )}
            </div>
            {/* Organization Creation Button */}
            <div className="flex-shrink-0">
              <CreateOrganizationButton />
            </div>
          </div>
        </div>
        <hr className="border-gray-200" />

        {/* Navigation Buttons */}
        <div className="space-y-2">
          <div className="px-2 text-sm font-semibold text-gray-600">Navigation</div>
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
        <hr className="border-gray-200" />

        {/* Recent Boards Section */}
        <div className="space-y-4">
          <div className="px-4 text-sm font-semibold text-gray-600">Recent Boards</div>
          <div className="space-y-3">
            {recentBoards?.length === 0 ? (
              <div className="px-4 py-2 text-sm text-gray-500">No recent boards.</div>
            ) : (
              recentBoards?.slice(0, 3).map((boarddata) => {
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
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-800 truncate max-w-[70%] group-hover:text-gray-900">
                        {boarddata.title}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500 group-hover:text-gray-700">
                      <span className="font-medium">{boarddata.BoardOwnerName}</span>
                      <div className="flex items-center gap-2 text-sm text-gray-500 whitespace-nowrap group-hover:text-gray-700">
                        <Clock className="h-4 w-4" />
                        <span>{createdAtLabel}</span>
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* User Information & Sign Out */}
      <div className="mt-auto pt-6 border-t border-gray-200">
        {user && (
          <div className="flex items-center justify-between px-2 py-3">
            <div className="flex items-center space-x-2">
              <p className="text-sm text-gray-600">Logged in as:</p>
              <p className="font-semibold">{user.fullName || user.username || "User"}</p>
            </div>
          </div>
        )}
        <SignOutButton>
          <Button
            variant="ghost"
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-white font-semibold bg-red-500 hover:bg-red-600 rounded-xl shadow-md transition-all duration-300"
          >
            <span>Sign Out</span>
          </Button>
        </SignOutButton>
      </div>
    </div>
  );
};

export default OrganizationSidebar;
