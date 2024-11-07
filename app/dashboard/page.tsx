"use client";

import TopBar from "@/components/bar/topbar";
import React from "react";
import InfoDashboard from "@/components/infoDashboard";

export default function Page() {
	return (
		<div>
			<TopBar>
				<InfoDashboard/>
			</TopBar>
		</div>
	);
}
