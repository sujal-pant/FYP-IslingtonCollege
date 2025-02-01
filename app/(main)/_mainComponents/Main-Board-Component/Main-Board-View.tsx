"use client";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Image from "next/image";
import { BoardCard } from "./Board-Card-View";
import { Createnewboard } from "./Create-New-Board";
import { EmptyBoardState } from "./Empty-Board-State";
import { EmptySearch } from "../Sidebar-Component/Empty-Search";

interface BoardListProps {
  orgId: string;
  query: {
    search?: string;
    favorites?: string;
  };
}

export const MainBoardView = ({ orgId, query }: BoardListProps) => {
  const boardsData = useQuery(api.getBoards.get, { orgId, ...query });

  // Handle loading state (if data is undefined)
  if (boardsData === undefined) {
    return (
      <div>
        <div className="flex items-center gap-4">
          <h2 className="text-3xl">
            {query.favorites ? 'Your Favorite Boards' : 'Current Boards'}
          </h2>
          <Createnewboard orgId={orgId} disabled />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 mt-8 pb-10">
          <BoardCard.Skeleton />
          <BoardCard.Skeleton />
          <BoardCard.Skeleton />
          <BoardCard.Skeleton />
        </div>
      </div>
    );
  }

  // Handle case where no boards are found based on search query
  if (!boardsData.length && query.search) {
    return <EmptySearch />;
  }

  // Handle case where no favorite boards are found
  if (!boardsData?.length && query.favorites) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <Image
          src="/empty-favorites.svg"
          height={140}
          width={140}
          alt="Empty"
        />
        <h2 className="text-2xl font-semibold mt-6">You Do Not Have Favorite Boards</h2>
        <p className="text-muted-foreground text-sm mt-2">
          Try favoriting a board
        </p>
      </div>
    );
  }

  // Handle case where no boards are found
  if (!boardsData?.length) {
    return <EmptyBoardState />;
  }

  // Render the boards list
  return (
    <div>
      <div className="flex items-center gap-4">
        <h2 className="text-3xl">
          {query.favorites ? 'Your Favorite Boards' : 'Current Boards'}
        </h2>
        <Createnewboard orgId={orgId} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 mt-8 pb-10">
        {boardsData?.map((boarddata) => (
          <BoardCard
            key={boarddata._id}
            id={boarddata._id}
            title={boarddata.title}
            imageUrl={boarddata.imageUrl}
            BoardOwnerId={boarddata.BoardOwnerId}
            BoardOwnerName={boarddata.BoardOwnerName}
            createdAt={boarddata._creationTime}
            orgId={boarddata.orgId}
            isFavorite={boarddata.isFavorite}
          />
        ))}
      </div>
    </div>
  );
};
