"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
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
import {
  List,
  ChevronDown,
  Clock,
  Heart,
  X,
  Plus,
  Menu as MenuIcon,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { formatDistanceToNow } from "date-fns";
import { FunctionReference } from "convex/server";
import { Id } from "@/convex/_generated/dataModel";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";

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

const SidebarContent = ({
  activeTab,
  handleTabClick,
  recentBoards,
  organization,
  showOnboarding,
  onboardingStep,
  setOnboardingStep,
  handleCloseOnboarding,
  user,
  isAdmin,
  closeMobileSidebar,
}: {
  activeTab: string;
  handleTabClick: (tab: string) => void;
  recentBoards: ReturnType<typeof useQuery<GetBoardsFunction>>;
  organization: any;
  showOnboarding: boolean;
  onboardingStep: number;
  setOnboardingStep: (step: number) => void;
  handleCloseOnboarding: () => void;
  user: any;
  isAdmin: boolean;
  closeMobileSidebar?: () => void;
}) => {
  const hasNoOrganization = !organization;

  const handleNavClick = (tab: string) => {
    handleTabClick(tab);
    if (closeMobileSidebar) {
      closeMobileSidebar();
    }
  };

  const handleBoardClick = () => {
    if (closeMobileSidebar) {
      closeMobileSidebar();
    }
  };

  return (
    <div className="flex flex-col h-full p-6 space-y-6 bg-gradient-to-br from-white via-gray-50 to-blue-50 shadow-xl rounded-3xl border border-gray-100">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-x-3 group" onClick={handleBoardClick}>
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
                <h2 className="text-lg font-semibold mb-2">
                  Welcome to SketchSphere!
                </h2>
                <p className="text-sm text-gray-500 mb-4">
                  We're excited to have you here. Press <strong>Next</strong>{" "}
                  to learn how to get started.
                </p>
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" onClick={handleCloseOnboarding}>
                    Skip Tutorial
                  </Button>
                  <Button onClick={() => setOnboardingStep(2)}>Next</Button>
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-lg font-semibold mb-2">
                  Create Your Organization
                </h2>
                <p className="text-sm text-gray-500 mb-4">
                  To start collaborating and managing your boards, create an
                  organization now.
                </p>
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" onClick={handleCloseOnboarding}>
                    Skip Tutorial
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <Plus className="h-5 w-5 text-green-600" />
                        <span>Create Organization</span>
                      </Button>
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

      {/* Main Sidebar Content */}
      <div className="flex-1 flex flex-col space-y-6">
        {/* Organization Switcher */}
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

        {/* Create Organization Button */}
        <div className="flex-shrink-0">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start px-4 py-3 gap-3 rounded-xl border text-gray-800 hover:bg-gray-100 transition-all duration-300"
              >
                <Plus className="h-5 w-5 text-green-600" />
                <span className="font-medium">Create Organization</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="p-0 bg-transparent border-none max-w-[480px]">
              <CreateOrganization />
            </DialogContent>
          </Dialog>
        </div>
        <hr className="border-gray-200" />

        {/* Navigation Buttons */}
        <div className="space-y-2">
          <div className="px-2 text-sm font-semibold text-gray-600">
            Navigation
          </div>
          <Button
            onClick={() => handleNavClick("current")}
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
            onClick={() => handleNavClick("favorites")}
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
                const createdAtLabel = formatDistanceToNow(
                  new Date(boarddata._creationTime),
                  { addSuffix: true }
                );
                return (
                  <Link
                    key={boarddata._id}
                    href={`/board/${boarddata._id}`}
                    className="group p-4 bg-white/80 backdrop-blur-sm rounded-xl border shadow-sm hover:bg-gray-100 transition-all duration-200 cursor-pointer block"
                    onClick={handleBoardClick}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-800 truncate max-w-[70%] group-hover:text-gray-900">
                        {boarddata.title}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500 group-hover:text-gray-700">
                      <span className="font-medium">
                        {boarddata.BoardOwnerName}
                      </span>
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
          <div className="flex flex-col gap-2 px-2 py-3">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <p className="text-sm text-gray-600">Logged in as:</p>
                <p className="font-semibold">
                  {user.fullName || user.username || "User"}
                </p>
              </div>
              {isAdmin && (
                <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                  Admin
                </span>
              )}
            </div>
            <SignOutButton>
              <Button
                variant="ghost"
                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-white font-semibold bg-red-500 hover:bg-red-600 rounded-xl shadow-md transition-all duration-300"
              >
                <span>Sign Out</span>
              </Button>
            </SignOutButton>
          </div>
        )}
      </div>
    </div>
  );
};

const OrganizationSidebar = () => {
  // Retrieve current organization and user from Clerk
  const { organization } = useOrganization();
  const { user } = useUser();

  // Get search parameters from the URL
  const searchParams = useSearchParams();
  const favorites = searchParams.get("favorites") ?? undefined;
  const adminBoards = searchParams.get("adminBoards") ?? undefined;
  const query = useMemo(
    () => ({
      search: searchParams.get("search") ?? undefined,
      favorites: favorites,
      adminBoards: adminBoards,
    }),
    [searchParams, favorites, adminBoards]
  );

  // Organization id (or empty string if not available)
  const orgId = organization?.id ?? "";

  // Check if current user is an admin in the organization
  const currentOrgMembership = user?.organizationMemberships?.find(
    (membership) => membership.organization.id === orgId
  );
  const isAdmin = currentOrgMembership?.role === "org:admin";

  // State for onboarding popup (if no organization exists)
  const [showOnboarding, setShowOnboarding] = useState(!orgId);
  // State for onboarding step (1: welcome, 2: organization creation)
  const [onboardingStep, setOnboardingStep] = useState<number>(1);
  // State for navigation tab ("current", "favorites")
  const [activeTab, setActiveTab] = useState<string>("current");

  // State for mobile sidebar visibility
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Function to change active tab
  const handleTabClick = useCallback((tab: string) => {
    setActiveTab(tab);
  }, []);

  // Fetch recent boards via Convex
  const recentBoards = useQuery<GetBoardsFunction>(api.getBoards.get, { orgId });

  // Handler to close onboarding popup
  const handleCloseOnboarding = useCallback(() => {
    setShowOnboarding(false);
  }, []);

  // Close mobile sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById('mobile-sidebar');
      const hamburger = document.getElementById('hamburger-button');
      
      if (mobileSidebarOpen && 
          sidebar && 
          !sidebar.contains(event.target as Node) && 
          hamburger && 
          !hamburger.contains(event.target as Node)) {
        setMobileSidebarOpen(false);
      }
    };

    if (mobileSidebarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileSidebarOpen]);

  // Add/remove body scroll lock when sidebar is open
  useEffect(() => {
    if (mobileSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileSidebarOpen]);

  const closeMobileSidebar = useCallback(() => {
    setMobileSidebarOpen(false);
  }, []);

  return (
    <>
      {/* Mobile Hamburger Button */}
      <div className="lg:hidden p-4">
        <button
          id="hamburger-button"
          onClick={() => setMobileSidebarOpen(true)}
          className="p-2 rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200"
        >
          <MenuIcon className="h-6 w-6 text-gray-800" />
        </button>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex">
        <SidebarContent
          activeTab={activeTab}
          handleTabClick={handleTabClick}
          recentBoards={recentBoards}
          organization={organization}
          showOnboarding={showOnboarding}
          onboardingStep={onboardingStep}
          setOnboardingStep={setOnboardingStep}
          handleCloseOnboarding={handleCloseOnboarding}
          user={user}
          isAdmin={!!isAdmin}
        />
      </div>

      {/* Mobile Sliding Sidebar */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300 lg:hidden ${
          mobileSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeMobileSidebar}
      >
        <div 
          id="mobile-sidebar"
          className={`fixed top-0 bottom-0 left-0 w-80 max-w-[80vw] transition-transform duration-300 ease-in-out z-50 ${
            mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="h-full overflow-y-auto">
            <SidebarContent
              activeTab={activeTab}
              handleTabClick={handleTabClick}
              recentBoards={recentBoards}
              organization={organization}
              showOnboarding={showOnboarding}
              onboardingStep={onboardingStep}
              setOnboardingStep={setOnboardingStep}
              handleCloseOnboarding={handleCloseOnboarding}
              user={user}
              isAdmin={!!isAdmin}
              closeMobileSidebar={closeMobileSidebar}
            />
          </div>
        </div>
        {/* Close button positioned outside sidebar for easy access */}
        <button
          onClick={closeMobileSidebar}
          className={`fixed top-4 right-4 p-2 rounded-full bg-white/80 shadow-md transition-opacity duration-300 ${
            mobileSidebarOpen ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <X className="h-6 w-6 text-gray-800" />
        </button>
      </div>
    </>
  );
};

export default OrganizationSidebar;