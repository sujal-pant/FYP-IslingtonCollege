import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAllOrThrow } from "convex-helpers/server/relationships.js";

// Query to fetch boards based on organization ID, optional search term, and optional favorites filter
export const get = query({
  args: {
    orgId: v.string(), 
    search: v.optional(v.string()), 
    favorites: v.optional(v.string()), 
  },
  handler: async (ctx, { orgId, search, favorites }) => {

    // Fetching the currently authenticated user
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new Error('Unauthorized'); // If user is not authenticated, throwing an error
    }

    // If 'favorites'  is set, fetching only the user's favorite boards
    if (favorites) {

      // Query for the user's favorite boards in the given organization
      const favoriteBoards = await ctx.db
        .query('FavoritesBoards')
        .withIndex('Favby_UserId_and_OrgId', (q) =>
          q.eq('userId', user.subject).eq('orgId', orgId) // Filtering favorites by user and organization
        )
        .order('desc') // Order the favorites by descending order 
        .collect();

      // Extracting the board IDs from the favorite boards
      const boardIds = favoriteBoards.map(fav => fav.boardId);

      // Retrieving all the boards by their IDs
      const boards = await getAllOrThrow(ctx.db, boardIds);

      // Returning the boards with an additional field `isFavorite` set to `true`
      return boards.map(board => ({
        ...board,
        isFavorite: true, // Marking these boards as favorite
      }));
    }

    const searchTerm = search ? (search as string).trim() : '';
    let boardList = [];

    // If a search term is provided, search for boards with titles matching the search term
    if (searchTerm) {
      boardList = await ctx.db
        .query('boards')
        .withSearchIndex('Search_Index', (q) => 
          q.search('title', searchTerm).eq('orgId', orgId) // Searching the 'title' field for the term
        )
        .collect();
    } else {
      // If no search term, fetching all boards belonging to the given organization
      boardList = await ctx.db
        .query('boards')
        .withIndex('by_orgId', (q) => q.eq('orgId', orgId)) // Querying boards by organization ID
        .order('desc') // Ordering the boards by descending order (optional)
        .collect();
    }

    // Mapping over the board list and check if each board is favorited by the current user
    const boardsWithFavoritesStatus = boardList.map(async (board) => {
      // Checking if the current user has favorited this board
      const favorite = await ctx.db
        .query('FavoritesBoards')
        .withIndex('Favby_userId_boardId', (q) =>
          q.eq('userId', user.subject).eq('boardId', board._id) // Filtering by user and board ID
        )
        .unique(); // Getting the unique favorite record

      // Return the board with the `isFavorite` field indicating whether the user has favorited it
      return {
        ...board,
        isFavorite: Boolean(favorite), // If a favorite record exists, setting isFavorite to true
      };
    });

    // Returning the list of boards with their `isFavorite` status after all async operations are complete
    return Promise.all(boardsWithFavoritesStatus);
  },
});
