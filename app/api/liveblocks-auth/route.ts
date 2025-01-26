import { auth, currentUser } from '@clerk/nextjs';
import { Liveblocks } from '@liveblocks/node';
import { ConvexHttpClient } from 'convex/browser';

import { api } from '@/convex/_generated/api';

// Initialize Convex client
const convexClient = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// Initialize Liveblocks client with secret key
const liveblocksClient = new Liveblocks({
  secret: "sk_dev_m-fp8ntnKG9HMLEgQ6Mx86a8LThYvKCX9bmsn-JTojK7FLQJbKHFz5UaUakYQD_b",
});

// Handle POST request
export async function POST(request: Request) {
  // Retrieve authorization and user details
  const authInfo = await auth();
  const user = await currentUser();

  // Log auth and user info for debugging
  console.log("Authorization Details:", { authInfo, user });

  // Validate authorization and user
  if (!authInfo || !user) {
    return new Response('Unauthorized', { status: 403 });
  }

  // Parse request payload to get room details
  const { room } = await request.json();

  // Query board details from Convex
  const boardDetails = await convexClient.query(api.board.get, { id: room });

  // Check if the user belongs to the same organization as the board
  if (boardDetails?.orgId !== authInfo.orgId) {
    return new Response('Unauthorized', { status: 403 });
  }

  // Prepare user information for the Liveblocks session
  const userMetadata = {
    name: user.firstName || 'Teammate',
    picture: user.imageUrl,
  };

  // Create a new Liveblocks session for the user
  const session = liveblocksClient.prepareSession(user.id, { userInfo: userMetadata });

  // Grant full access to the specified room
  if (room) {
    session.allow(room, session.FULL_ACCESS);
  }

  // Authorize the session and return the response
  const { status, body } = await session.authorize();
  return new Response(body, { status });
}
