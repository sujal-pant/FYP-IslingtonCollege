"use client";

import { useOrganization } from "@clerk/nextjs";

import { EmptyOrg } from "./_mainComponents/Sidebar-Component/Empty-Organization";
import { MainBoardView } from "./_mainComponents/Main-Board-Component/Main-Board-View";

interface DashboardPageProps {
  searchParams: {
    search?: string;
    favorites?: string;
  };
}

const DashboardPage = ({ searchParams }: DashboardPageProps) => {
  const { organization } = useOrganization();

  return (
    <div className="flex-1 h-[calc(100%-80px)] p-6">
      {!organization ? <EmptyOrg /> :<MainBoardView
      orgId={organization.id}
      query={searchParams}/>}
    </div>
  );
};

export default DashboardPage;
