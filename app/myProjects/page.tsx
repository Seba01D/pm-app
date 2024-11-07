import TopBar from '@/components/bar/topbar';
import ProjectList from '@/components/projectList';
import React from "react";

export default function page() {
  return (
    <TopBar>
      <div>
        <ProjectList/>
      </div>
    </TopBar>
  );
}
