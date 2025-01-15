import { v } from "convex/values"; 
import { defineSchema, defineTable } from "convex/server"; 

// Define the schema for the application
export default defineSchema({
  // Define the 'boards' table
  boards: defineTable({
    title: v.string(), // Board title as a string
    orgId: v.string(), 
    authorId: v.string(), // Author ID (user ID)
    authorName: v.string(), // Author name (user's display name)
    imageUrl: v.string(), // URL to an image associated with the board
  })
    .index("by_org", ["orgId"]) 
    .searchIndex("Search_title", {
      searchField: "title", // Enable searching on the 'title' field
      filterFields: ["orgId"], // Filter search results by organization
    }),

  // Define the 'userFavorites' table (a mapping of users to favorite boards)
  userFavorites: defineTable({
    orgId: v.string(), // Organization ID associated with the favorite
    userId: v.string(), 
    boardId: v.id('boards'), 
  })
    // Index to fetch user favorites by board ID
    .index('by_board', ['boardId']) 

    // Index to fetch user favorites by user ID and organization ID
    .index('by_user_org', ['userId', 'orgId'])

    // Index to fetch user favorites by user ID and board ID (individual favorite record)
    .index('by_user_board', ['userId', 'boardId'])

    // Index to fetch user favorites by user ID, board ID, and organization ID (combining all three)
    .index('by_user_board_org', ['userId', 'boardId', 'orgId']),
});
