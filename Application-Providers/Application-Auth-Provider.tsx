"use client";

import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { AuthLoading, Authenticated, ConvexReactClient } from "convex/react";
import { AuthLoader } from "@/components/Authentication/Auth-Loader";

interface ApplicationAuthProviderProps {
  children: React.ReactNode;
}

// Ensuring that the Convex client is initialized before rendering any children.
// This ensures that the user is authenticated before rendering any content.
// Throw an error if the Convex URL is defined
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
if (!convexUrl) {
  throw new Error(
    "Environment variable NEXT_PUBLIC_CONVEX_URL is missing. Please set it in your environment."
  );
}

// Initialize the Convex client
const convex = new ConvexReactClient(convexUrl);
export const ApplicationAuthProvider = ({
  children,
}: ApplicationAuthProviderProps) => {
  return (
    <ClerkProvider>
      <ConvexProviderWithClerk useAuth={useAuth} client={convex}>
        <Authenticated>  {children}</Authenticated>
        <AuthLoading><AuthLoader/></AuthLoading>
      
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
};
