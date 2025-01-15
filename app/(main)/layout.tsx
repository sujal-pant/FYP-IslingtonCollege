import Homesidebar from "./_mainComponents/Sidebar-Component/Home-Sidebar";
import NavigationBar from "./_mainComponents/Sidebar-Component/NavigationBar";
import OrganizationSidebar from "./_mainComponents/Sidebar-Component/Organization-Sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <main className="h-full">
      <Homesidebar />

      <div className="pl-[60px] h-full">
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
