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
];

// Mutation to create a new board
export const create = mutation({
  args: {
    orgId: v.string(), // Organization ID where the new board will be created
    title: v.string(), // Title for the new board
  },
  handler: async (ctx, { orgId, title }) => {
    // Get the user identity to confirm who is creating the board
    const userIdentity = await ctx.auth.getUserIdentity();
    if (!userIdentity) {
      throw new Error("Sorry"); // If no user identity, throw an error
    }

    // Select a random placeholder image from the array for the new board
    const selectedImage = placeholderImages[Math.floor(Math.random() * placeholderImages.length)];
    
    // Insert the new board into the database with the provided details
    const newBoard = await ctx.db.insert("boards", {
      title,
      orgId,
      authorId: userIdentity.subject, // Store the user's subject as the author ID
      authorName: userIdentity.name!, // Store the user's name as the author name
      imageUrl: selectedImage, // Use a randomly selected placeholder image URL
    });

    return newBoard; // Return the newly created board
  }
});

// Mutation to update the title of an existing board
export const update = mutation({
  args: {
    id: v.id('boards'), // Board ID to update
    title: v.string(), // New title for the board
  },
  handler: async (ctx, { id, title }) => {
    // Get the user identity to confirm who is updating the board
    const userIdentity = await ctx.auth.getUserIdentity();
    if (!userIdentity) {
      throw new Error('Unauthorized'); // If no user identity, throw an error
    }

    // Clean up the title by trimming any extra spaces
    const cleanedTitle = title.trim();
    if (!cleanedTitle) {
      throw new Error('Title is required'); // Ensure the title is not empty
    }

    // Check if the title exceeds the 60 character limit
    if (cleanedTitle.length > 60) {
      throw new Error('Title cannot exceed 60 characters'); // If the title is too long, throw an error
    }

    // Update the title of the specified board in the database
    const updatedBoard = await ctx.db.patch(id, { title: cleanedTitle });
    return updatedBoard; // Return the updated board
  }
});

// Mutation to mark a board as a favorite
export const favorite = mutation({
  args: {
    id: v.id('boards'), // Board ID to mark as favorite
    orgId: v.string(), // Organization ID where the board belongs
  },
  handler: async (ctx, { id, orgId }) => {
    // Get the user identity to confirm who is marking the board as a favorite
    const userIdentity = await ctx.auth.getUserIdentity();
    if (!userIdentity) {
      throw new Error('Unauthorized'); // If no user identity, throw an error
    }

    // Fetch the board from the database
    const board = await ctx.db.get(id);
    if (!board) {
      throw new Error('Board not found'); // If the board does not exist, throw an error
    }

    // Check if the user has already favorited the board
    const userId = userIdentity.subject;
    const existingFavorite = await ctx.db
      .query('userFavorites')
      .withIndex('by_user_board_org', q =>
        q.eq('userId', userId).eq('boardId', board._id).eq('orgId', orgId)
      )
      .unique();

    if (existingFavorite) {
      throw new Error('Board already favorited'); // If the board is already favorited, throw an error
    }

    // Insert a new favorite record for the user and board
    await ctx.db.insert('userFavorites', {
      userId,
      boardId: board._id,
      orgId,
    });

    return board; // Return the original board after marking it as favorite
  }
});

// Mutation to remove a board from favorites
export const unfavorite = mutation({
  args: {
    id: v.id('boards'), // Board ID to remove from favorites
  },
  handler: async (ctx, { id }) => {
    // Get the user identity to confirm who is unfavoriting the board
    const userIdentity = await ctx.auth.getUserIdentity();
    if (!userIdentity) {
      throw new Error('Unauthorized'); // If no user identity, throw an error
    }

    // Fetch the board from the database
    const board = await ctx.db.get(id);
    if (!board) {
      throw new Error('Board not found'); // If the board does not exist, throw an error
    }

    // Check if the user has favorited the board
    const userId = userIdentity.subject;
    const favoriteRecord = await ctx.db
      .query('userFavorites')
      .withIndex('by_user_board', q =>
        q.eq('userId', userId).eq('boardId', board._id)
      )
      .unique();

    if (!favoriteRecord) {
      throw new Error('Favorited board not found'); // If the board is not found in favorites, throw an error
    }

    // Delete the favorite record for the user and board
    await ctx.db.delete(favoriteRecord._id);
    return board; // Return the board after unfavoriting
  }
});

// Mutation to remove a board completely (also unfavorites it)
export const remove = mutation({
  args: {
    id: v.id('boards'), // Board ID to remove
  },
  handler: async (ctx, { id }) => {
    // Get the user identity to confirm who is removing the board
    const userIdentity = await ctx.auth.getUserIdentity();
    if (!userIdentity) {
      throw new Error('Unauthorized'); // If no user identity, throw an error
    }

    // Check if the user has favorited the board and remove it from favorites
    const userId = userIdentity.subject;
    const favoriteRecord = await ctx.db
      .query('userFavorites')
      .withIndex('by_user_board', q =>
        q.eq('userId', userId).eq('boardId', id)
      )
      .unique();

    if (favoriteRecord) {
      await ctx.db.delete(favoriteRecord._id); // Delete the favorite record
    }

    // Delete the board from the database
    await ctx.db.delete(id);
  }
});

// Query to retrieve a specific board by its ID
export const get = query({
  args: {
    id: v.id('boards'), // Board ID to fetch
  },
  handler: async (ctx, { id }) => {
    // Fetch the board from the database by ID
    const board = await ctx.db.get(id);
    return board; // Return the fetched board
  }
});
