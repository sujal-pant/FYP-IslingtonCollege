import { auth, currentUser } from '@clerk/nextjs';
import { Liveblocks } from '@liveblocks/node';
import { ConvexHttpClient } from 'convex/browser';

import { api } from '@/convex/_generated/api';

// Initializing Convex client
const convexClient = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// Initializing Liveblocks client with secret key
const liveblocksClient = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET!,
});

// Handeling POST request
export async function POST(request: Request) {
  // Retrieveing authorization and user details
  const authInfo = await auth();
  const user = await currentUser();

  // Logging auth and user info for debugging
  console.log("Authorization Details:", { authInfo, user });

  // Validating authorization and user
  if (!authInfo || !user) {
    return new Response(null, {
      status: 307,
      headers: {
        Location: 'https://assuring-hog-22.accounts.dev/sign-in', 
      },
    });
  }
  
  // Parsing request payload to get room details
  const { room } = await request.json();

  // Query board details from Convex
  const boardDetails = await convexClient.query(api.boardController.getBoards, { id: room });

  // Checking if the user belongs to the same organization as the board
  if (boardDetails?.orgId !== authInfo.orgId) {
    return new Response('Unauthorized', { status: 403 });
  }

  // Preparing user information for the Liveblocks session
  const userMetadata = {
    name: user.firstName || 'Teammate',
    picture: user.imageUrl,
  };

  // Creating a new Liveblocks session for the user
  const session = liveblocksClient.prepareSession(user.id, { userInfo: userMetadata });

  // Granting full access to the specified room
  if (room) {
    session.allow(room, session.FULL_ACCESS);
  }

  // Authorize the session and return the response
  const { status, body } = await session.authorize();
  return new Response(body, { status });
}
