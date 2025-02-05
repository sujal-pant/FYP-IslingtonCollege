'use client';

import { usercolor } from '@/utils/utils'; 
import { useOthers, useSelf } from '@/liveblocks.config';
import { UserAvatar } from './User-Presence-Avatar'; 
import { useState, useEffect, useRef } from 'react';

/**
 * The `CurrentActiveParticipants` component displays a list of active participants in a session.
 * It shows the avatars of other participants and the current user, and can toggle the visibility
 * of additional participants if the number exceeds the limit defined by `MAX_SHOWN_USERS`.
 * The component also includes functionality to close the participant list when clicking anywhere outside.
 */
const MAX_SHOWN_USERS = 0;

export const CurrentActiveParticipants = () => {

  // Fetching participants and current user using liveblocks hooks
  const participants = useOthers(); 
  const currentUser = useSelf(); 

  // State to manage the visibility of the additional participants list
  const [isListVisible, setIsListVisible] = useState(false); 

  // Refs to track the DOM elements for the participant list and outside click detection
  const listRef = useRef<HTMLDivElement | null>(null); 
  const participantsRef = useRef<HTMLDivElement | null>(null);

  // Checking if there are more participants than the max shown
  const additionalUsers = participants.length > MAX_SHOWN_USERS;

  // Sliceing the remaining participants that are not shown by default
  const remainingParticipants = participants.slice(MAX_SHOWN_USERS);

  // Function to toggle the visibility of the extra participants list
  const handleToggleList = () => setIsListVisible(show => !show);


  const handleClickOutside = (event: MouseEvent) => {
    if (
      participantsRef.current &&
      !participantsRef.current.contains(event.target as Node) &&
      listRef.current &&
      !listRef.current.contains(event.target as Node)
    ) {
      setIsListVisible(false);
    }
  };

  // Add event listener for outside click to close the participant list
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside); 
    return () => document.removeEventListener('mousedown', handleClickOutside); 
  }, []);

  return (
    <div ref={participantsRef} className="absolute top-4 right-4 bg-white p-2 rounded-lg shadow-lg flex items-center gap-x-3">
      <div className="flex gap-x-2">
        {/* Looping and display the avatars of participants, respecting the max shown */}
        {participants.slice(0, MAX_SHOWN_USERS).map(({ connectionId, info }) => (
          <UserAvatar key={connectionId} src={info?.picture} userName={info?.name} fallback={info?.name?.[0] || 'T'} />
        ))}

        {/* Display the current user's avatar, with a border color based on connectionId */}
        {currentUser && (
          <UserAvatar
            borderColor={usercolor(currentUser.connectionId)} 
            src={currentUser.info?.picture} 
            userName={`${currentUser.info?.name} (You)`} 
            fallback={currentUser.info?.name?.[0]} 
          />
        )}

        {/* Showing "more" avatar if there are additional users, and allow toggling the list visibility */}
        {additionalUsers && (
          <div className="relative">
            <div className="cursor-pointer" onClick={handleToggleList}>

              {/* Showing the "more" avatar with the count of additional participants */}

              <UserAvatar userName={`${participants.length - MAX_SHOWN_USERS} more`} fallback={`+${participants.length - MAX_SHOWN_USERS}`} />
            </div>

            {/* Showing the list of remaining participants if the list is visible */}
            {isListVisible && (
              <div ref={listRef} className="absolute top-12 right-0 bg-white p-2 w-56 rounded-lg shadow-lg">
                {remainingParticipants.map(({ connectionId, info }) => (
                  <div key={connectionId} className="flex items-center gap-x-2 p-2 hover:bg-gray-200 rounded-md">
                    {/* Displaying the remaining participants' avatars and names */}
                    <UserAvatar src={info?.picture} userName={info?.name} fallback={info?.name?.[0] || 'T'} />
                    <span>{info?.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * skeleton loader for the currentActiveParticipants` component. 
 */
export const CurrentActiveParticipantsSkeleton = () => (
  <div className="absolute top-4 right-4 w-30 h-16 bg-gray-100 animate-pulse rounded-lg shadow-lg flex items-center gap-x-2 p-2">
    <div className="w-10 h-10 bg-gray-300 rounded-full animate-pulse"></div> 
  </div>
);
