import { createClient,LiveList,LiveMap,LiveObject } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";
import {Layer,Color} from"@/types/canvas"
// Initialize the Liveblocks client with your public API key
const client = createClient({
  throttle: 16,
  authEndpoint: "/api/liveblocks-auth",
});


// Define the Presence type (used to represent the real-time state of each user)
type Presence = {
 cursor: { x: number; y: number } | null,
 selection:string[];
};

// Define the Storage type (persistent document shared between users)
type Storage = {
 layers : LiveMap<string,LiveObject<Layer>>;

 layerIds  : LiveList<string>;

};

// Define the UserMeta type (user-specific metadata like names, avatars, etc.)
type UserMeta = {
  id?: string;
  info?: {
    name?: string;
    picture?: string;
  };

  // Example: name: string;
  // avatar: string;
};

// Define the RoomEvent type (for broadcasting and listening to custom events)
type RoomEvent = {
  // Example: type: "NOTIFICATION"; message: string;
};

// Define the ThreadMetadata type (used for thread-specific metadata in comments)
type ThreadMetadata = {
  // Example: resolved: boolean;
};

// Create the RoomContext with defined types
export const {
  suspense: {
    RoomProvider,
    useRoom,
    useMyPresence,
    useUpdateMyPresence,
    useSelf,
    useOthers,
    useOthersMapped,
    useOthersConnectionIds,
    useOther,
    useBroadcastEvent,
    useEventListener,
    useErrorListener,
    useStorage,
    useObject,
    useMap,
    useList,
    useBatch,
    useHistory,
    useUndo,
    useRedo,
    useCanUndo,
    useCanRedo,
    useMutation,
    useStatus,
    useLostConnectionListener,
    useThreads,
    useUser,
    useCreateThread,
    useEditThreadMetadata,
    useCreateComment,
    useEditComment,
    useDeleteComment,
    useAddReaction,
    useRemoveReaction,
  },
} = createRoomContext<Presence, Storage, UserMeta, RoomEvent, ThreadMetadata>(client, {
  async resolveUsers({ userIds }) {
    // Fetch user information based on userIds for comments, mentions, etc.
    // Replace this with your own logic to fetch user data from your database

    // Example:
    // const usersData = await fetchUsersFromDatabase(userIds);
    // return usersData.map((user) => ({
    //   name: user.name,
    //   avatar: user.avatarUrl,
    // }));

    return [];
  },

  async resolveMentionSuggestions({ text, roomId }) {
    // Provide userId suggestions for mentions based on input text in comments
    // Replace with your own logic to filter users for mentions

    // Example:
    // const allUserIds = await fetchUserIdsFromDatabase(roomId);
    // if (!text) {
    //   return allUserIds;
    // }
    // return allUserIds.filter((userId) =>
    //   userId.toLowerCase().includes(text.toLowerCase())
    // );

    return [];
  },
});
