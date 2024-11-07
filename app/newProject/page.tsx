import TopBar from '@/components/bar/topbar';
import CreateProjectForm from '@/components/createProjectForm';
import React from "react";

export default function page() {
  return (
    <TopBar>
      <div>
        <CreateProjectForm />
      </div>
    </TopBar>
  );
}
