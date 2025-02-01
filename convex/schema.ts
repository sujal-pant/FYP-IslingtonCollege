import { v } from "convex/values"; 
import { defineSchema, defineTable } from "convex/server"; 

export default defineSchema({
  // Defining the "boards" table to store board details
  boards: defineTable({
    BoardOwnerId: v.string(), 
    BoardOwnerName: v.string(), 
    title: v.string(), 
    orgId: v.string(),
    imageUrl: v.string(), 
  })
  // Indexing by 'orgId' to efficiently query boards by organization ID
    .index("by_orgId", ["orgId"]) 
    .searchIndex("Search_Index", {
      searchField: "title",
      filterFields: ["orgId"],
    }),

  // Defining the "FavoritesBoards" table to manage the user's favorite boards

  FavoritesBoards: defineTable({
    userId: v.string(), 
    orgId: v.string(),
    boardId: v.id('boards'), 
  })
    // Index to fetch user favorites by user ID and organization ID
    .index('Favby_UserId_and_OrgId', ['userId', 'orgId'])

    // Index to fetch user favorites by user ID and board ID (individual favorite record)
    .index('Favby_userId_boardId', ['userId', 'boardId'])

    // Index to fetch user favorites by user ID, board ID, and organization ID (combining all three)
    .index('Favby_userId_boardId_orgId', ['userId', 'boardId', 'orgId']),
});
