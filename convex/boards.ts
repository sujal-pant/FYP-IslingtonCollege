import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAllOrThrow } from "convex-helpers/server/relationships.js";

// Query to fetch boards based on organization ID, optional search term, and optional favorites filter
export const get = query({
  args: {
    orgId: v.string(), // Organization ID to filter boards
    search: v.optional(v.string()), // Optional search term to filter boards by title
    favorites: v.optional(v.string()), // Optional flag to fetch only favorite boards
  },
  handler: async (ctx, { orgId, search, favorites }) => {
    // Fetch the currently authenticated user
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new Error('Unauthorized'); // If user is not authenticated, throw an error
    }

    // If 'favorites' flag is set, fetch only the user's favorite boards
    if (favorites) {
      // Query for the user's favorite boards in the given organization
      const favoriteBoards = await ctx.db
        .query('userFavorites')
        .withIndex('by_user_org', (q) =>
          q.eq('userId', user.subject).eq('orgId', orgId) // Filter favorites by user and organization
        )
        .order('desc') // Order the favorites by descending order (optional)
        .collect();

      // Extract the board IDs from the favorite boards
      const boardIds = favoriteBoards.map(fav => fav.boardId);

      // Retrieve all the boards by their IDs
      const boards = await getAllOrThrow(ctx.db, boardIds);

      // Return the boards with an additional field `isFavorite` set to `true`
      return boards.map(board => ({
        ...board,
        isFavorite: true, // Mark these boards as favorite
      }));
    }

    // If a search term is provided, sanitize and trim it
    const searchTerm = search ? (search as string).trim() : '';
    let boardList = [];

    // If a search term is provided, search for boards with titles matching the search term
    if (searchTerm) {
      boardList = await ctx.db
        .query('boards')
        .withSearchIndex('Search_title', (q) => 
          q.search('title', searchTerm).eq('orgId', orgId) // Search the 'title' field for the term
        )
        .collect();
    } else {
      // If no search term, fetch all boards belonging to the given organization
      boardList = await ctx.db
        .query('boards')
        .withIndex('by_org', (q) => q.eq('orgId', orgId)) // Query boards by organization ID
        .order('desc') // Order the boards by descending order (optional)
        .collect();
    }

    // Map over the board list and check if each board is favorited by the current user
    const boardsWithFavoritesStatus = boardList.map(async (board) => {
      // Check if the current user has favorited this board
      const favorite = await ctx.db
        .query('userFavorites')
        .withIndex('by_user_board', (q) =>
          q.eq('userId', user.subject).eq('boardId', board._id) // Filter by user and board ID
        )
        .unique(); // Get the unique favorite record

      // Return the board with the `isFavorite` field indicating whether the user has favorited it
      return {
        ...board,
        isFavorite: Boolean(favorite), // If a favorite record exists, set isFavorite to true
      };
    });

    // Return the list of boards with their `isFavorite` status after all async operations complete
    return Promise.all(boardsWithFavoritesStatus);
  },
});
