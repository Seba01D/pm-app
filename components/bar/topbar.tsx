import TaskBar from "@/components/bar/taskbar";
import React, { ReactNode } from "react";

interface TopBarProps {
	children: ReactNode;
}

export default function TopBar({ children }: TopBarProps) {
	return (
		<div className="flex h-screen">
			{/* Sidebar (TaskBar) */}
			<TaskBar />
				{/* Main Dashboard Content - children will render here */}
				<main className="flex-grow">
					{children}
				</main>
		</div>
	);
}
