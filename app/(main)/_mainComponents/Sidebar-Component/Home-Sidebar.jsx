import React from 'react';
import { CreateOrganizationButton } from './Create-Organization-Button';
import { OrganizationList } from './Organiazation-Lists';

const Homesidebar = () => {
  return (
    <aside className="fixed z-10 left-0 bg-gradient-to-b from-gray-50 to-gray-200 h-full w-[60px] flex p-3 flex-col gap-y-4 text-gray-800 shadow-md">
      {/* Organization List */}
      <OrganizationList />

      {/* Create Organization Button */}
      <CreateOrganizationButton />
    </aside>
  );
};

export default Homesidebar;
