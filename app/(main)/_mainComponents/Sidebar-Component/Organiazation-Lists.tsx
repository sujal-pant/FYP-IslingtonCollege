"use client";

import { useOrganizationList } from "@clerk/nextjs";
import { Elementoviewhover } from "../Main-Board-Component/Element-Overview-Hover";

/**
 * OrganizationList Component
 *
 * This component uses Clerk's `useOrganizationList` hook to retrieve the list
 * of organizations (user memberships) that the current user is a part of.
 * It then renders an unordered list of organizations. For each organization,
 * it displays a preview component (Elementoviewhover) along with the organization's name.
 */
export const OrganizationList = () => {
  // Retrieving user memberships (organizations) with infinite scrolling 
  const { userMemberships } = useOrganizationList({
    userMemberships: { infinite: true },
  });

  // If there are no memberships, rendering nothing
  if (!userMemberships?.data?.length) return null;

  return (
    // Unordered list container with spacing and padding
    <ul className="space-y-2 px-3">
      {userMemberships.data.map((membersorg) => (
        <li
          key={membersorg.organization.id}
          className="flex items-center rounded-lg p-2 hover:bg-gray-200 transition-colors duration-200"
        >
          {/* 
            Displaying a preview  for the organization using the 
            Elementoviewhover component. This component is responsible for showing 
            the organization's image and additional hover details.
          */}
          <div className="mr-3">
            <Elementoviewhover
              id={membersorg.organization.id}
              name={membersorg.organization.name}
              imageUrl={membersorg.organization.imageUrl}
            />
          </div>
          <div className="flex-grow">
            <span className="font-semibold text-gray-800 text-sm">
              {membersorg.organization.name}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
};
