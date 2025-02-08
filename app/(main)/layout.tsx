import NavigationBar from "./_mainComponents/Sidebar-Component/NavigationBar";
import OrganizationSidebar from "./_mainComponents/Sidebar-Component/Organization-Sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <main className="h-full">
      <div className="h-full">
        <div className="flex gap-x-3 h-full">
          <OrganizationSidebar />
          <div className="h-full flex-1">
            <NavigationBar />
            {children}
          </div>
        </div>
      </div>
    </main>
  );
};

export default DashboardLayout;
