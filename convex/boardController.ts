import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Array of placeholder image URLs for boards
const placeholderImages = [
  '/placeholders/1.svg',
  '/placeholders/2.svg',
  '/placeholders/3.svg',
  '/placeholders/4.svg',
  '/placeholders/5.svg',
  '/placeholders/6.svg',
  '/placeholders/7.svg',
  '/placeholders/8.svg',
  '/placeholders/9.svg',
  '/placeholders/10.svg',
  '/placeholders/11.svg',
  '/placeholders/12.svg',
  '/placeholders/13.svg',
  '/placeholders/14.svg',
  '/placeholders/15.svg',
  '/placeholders/16.svg',
  '/placeholders/17.svg',
  '/placeholders/18.svg',
  '/placeholders/19.svg',
  '/placeholders/20.svg',
];

// Mutation to create a new board
export const createnewboard = mutation({
  args: {
    orgId: v.string(), 
    title: v.string(), 
  },
  handler: async (ctx, { orgId, title }) => {
    // Getting the user identity to confirm who is creating the board
    const userIdentity = await ctx.auth.getUserIdentity();
    if (!userIdentity) {
      throw new Error("Sorry"); // If no user identity, throwing an error
    }

    // Selecting a random placeholder image from the array for the new board
    const selectedImage = placeholderImages[Math.floor(Math.random() * placeholderImages.length)];
    
    // Inserting the new board into the database with the provided details
    const newBoard = await ctx.db.insert("boards", {
      title,
      orgId,
      BoardOwnerId: userIdentity.subject, 
      BoardOwnerName: userIdentity.name!, 
      imageUrl: selectedImage, 
    });

    return newBoard; // Returning the newly created board
  }
});

// Mutation to update the title of an existing board
export const updateboard = mutation({
  args: {
    id: v.id('boards'), 
    title: v.string(),
  },
  handler: async (ctx, { id, title }) => {
    // Getting the user identity to confirm who is updating the board
    const userIdentity = await ctx.auth.getUserIdentity();
    if (!userIdentity) {
      throw new Error('Unauthorized'); // If no user identity, throwing an error
    }
    // Cleaning up the title by trimming any extra spaces
    const cleanedTitle = title.trim();
    if (!cleanedTitle) {
      throw new Error('Title is required'); // Ensureing the title is not empty
    }

    // Checking if the title exceeds the 80 character limit
    if (cleanedTitle.length > 80) {
      throw new Error('Title cannot exceed 60 characters'); // If the title is too long, throwing an error
    }

    // Updating the title of the specified board in the database
    const updatedBoard = await ctx.db.patch(id, { title: cleanedTitle });
    return updatedBoard; // Returning the updated board
  }
});

// Mutation to mark a board as a favorite
export const markfavoriteBoard = mutation({
  args: {
    id: v.id('boards'), 
    orgId: v.string(),
  },
  handler: async (ctx, { id, orgId }) => {
    // Getting the user identity to confirm who is marking the board as a favorite
    const userIdentity = await ctx.auth.getUserIdentity();
    if (!userIdentity) {
      throw new Error('Unauthorized'); // If no user identity, throw an error
    }

    // Fetch the board from the database
    const board = await ctx.db.get(id);
    if (!board) {
      throw new Error('Board not found'); // If the board does not exist, throwing an error
    }

    // Checking if the user has already favorited the board
    const userId = userIdentity.subject;
    const existingFavorite = await ctx.db
      .query('FavoritesBoards')
      .withIndex('Favby_userId_boardId_orgId', q =>
        q.eq('userId', userId).eq('boardId', board._id).eq('orgId', orgId)
      )
      .unique();

    if (existingFavorite) {
      throw new Error('Board already favorited'); // If the board is already favorited, throwing an error
    }

    // Inserting a new favorite record for the user and board
    await ctx.db.insert('FavoritesBoards', {
      userId,
      boardId: board._id,
      orgId,
    });

    return board; // Returning the original board after marking it as favorite
  }
});

// Mutation to remove a board from favorites
export const markUnfavoriteBoard = mutation({
  args: {
    id: v.id('boards'), 
  },
  handler: async (ctx, { id }) => {
    // Getting the user identity to confirm who is unfavoriting the board
    const userIdentity = await ctx.auth.getUserIdentity();
    if (!userIdentity) {
      throw new Error('Unauthorized'); // If no user identity, throwing an error
    }

    // Fetching the board from the database
    const board = await ctx.db.get(id);
    if (!board) {
      throw new Error('Board not found'); // If the board does not exist, throwing an error
    }

    // Checking if the user has favorited the board
    const userId = userIdentity.subject;
    const favoriteRecord = await ctx.db
      .query('FavoritesBoards')
      .withIndex('Favby_userId_boardId', q =>
        q.eq('userId', userId).eq('boardId', board._id)
      )
      .unique();

    if (!favoriteRecord) {
      throw new Error('Favorited board not found'); // If the board is not found in favorites, throwing an error
    }

    // Deleting the favorite record for the user and board
    await ctx.db.delete(favoriteRecord._id);
    return board; // Returning the board after unfavoriting
  }
});

// Mutation to remove a board completely (including unfavorites )
export const removeBoard = mutation({
  args: {
    id: v.id('boards'), 
  },
  handler: async (ctx, { id }) => {
    // Getting the user identity to confirm who is removing the board
    const userIdentity = await ctx.auth.getUserIdentity();
    if (!userIdentity) {
      throw new Error('Unauthorized'); // If no user identity, throwing an error
    }

    // Check if the user has favorited the board and remove it from favorites
    const userId = userIdentity.subject;
    const favoriteRecord = await ctx.db
      .query('FavoritesBoards')
      .withIndex('Favby_userId_boardId', q =>
        q.eq('userId', userId).eq('boardId', id)
      )
      .unique();

    if (favoriteRecord) {
      await ctx.db.delete(favoriteRecord._id); // Deleting the favorite record
    }

    // Deleting the board from the database
    await ctx.db.delete(id);
  }
});

// Query to retrieve a specific board by its ID
export const getBoards = query({
  args: {
    id: v.id('boards'), 
  },
  handler: async (ctx, { id }) => {
    // Fetching the board from the database by ID
    const board = await ctx.db.get(id);
    return board; // Returning the fetched board
  }
});
