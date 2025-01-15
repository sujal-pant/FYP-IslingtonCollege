'use client';
import { usercolor } from '@/lib/utils';
import { useOthers, useSelf } from '@/liveblocks.config';
import { UserAvatar } from './User-Presence-Avatar';

const MAX_SHOWN_USERS = 2;

export const CurrentActiveParticipants = () => {
  const other_users = useOthers();
  const currentUser = useSelf();
  const hasMoreUsers = other_users.length > MAX_SHOWN_USERS;

  return (
    <div className="absolute h-12 top-2 right-2 bg-white rounded-md p-3 flex items-center shadow-md">
      <div className="flex gap-x-2">
        {other_users.slice(0, MAX_SHOWN_USERS).map(({ connectionId, info }) => (
          <UserAvatar
            key={connectionId}
            src={info?.picture}
            name={info?.name}
            fallback={info?.name?.[0] || 'T'}
          />
        ))}

        {currentUser && (
          <UserAvatar
            borderColor={usercolor(currentUser.connectionId)}
            src={currentUser.info?.picture}
            name={`${currentUser.info?.name} (You)`}
            fallback={currentUser.info?.name?.[0]}
          />
        )}

        {hasMoreUsers && (
          <UserAvatar
            name={`${other_users.length - MAX_SHOWN_USERS} more`}
            fallback={`+${other_users.length - MAX_SHOWN_USERS}`}
          />
        )}
      </div>
    </div>
  );
};

export const CurrentActiveParticipantsSkeleton = () => {
  return (
    <div className="absolute h-12 top-2 right-2 bg-white rounded-md p-3 flex items-center shadow-md w-[100px]" />
  );
};
