// Twój obecny kod importów i interfejsów
"use client";

import { FaCog, FaHome, FaProjectDiagram,FaFolderOpen, FaPlusCircle } from "react-icons/fa";
import UserProfile from "../supaauth/user-profile";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { ReactNode, useEffect, useState } from "react";

interface DashboardLayoutProps {
	children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps): JSX.Element {
	const [isProjectsOpen, setProjectsOpen] = useState<boolean>(false);

	// Pobieranie stanu z localStorage przy renderowaniu początkowym
	useEffect(() => {
		const storedProjectsOpen = localStorage.getItem("isProjectsOpen");
		setProjectsOpen(storedProjectsOpen === "true");
	}, []);

	// Funkcja do przełączania menu projektów i zapisywania stanu w localStorage
	const toggleProjectsMenu = () => {
		setProjectsOpen((prev) => {
			const newState = !prev;
			localStorage.setItem("isProjectsOpen", JSON.stringify(newState));
			return newState;
		});
	};

	return (
		<div className="flex h-screen">
			{/* Pasek boczny (TaskBar) */}
			<div
				className="w-40 h-screen p-4 flex flex-col shadow-lg fixed top-0 left-0"
				style={{
					background: "linear-gradient(to bottom, #3b82f6, #93c5fd)",
				}}
			>
				<h2 className="text-2xl font-semibold text-yellow-400 mb-4">PManager</h2>

				<nav className="flex flex-col space-y-3 text-white text-sm">
					<a
						href="/dashboard"
						className="flex items-center space-x-2 p-2 hover:bg-yellow-400 rounded-md hover:text-blue-500 transition-colors duration-300 w-full h-10"
					>
						<FaHome />
						<span>Dashboard</span>
					</a>
					<div>
						<button
							onClick={toggleProjectsMenu}
							className="flex items-center space-x-2 p-2 hover:bg-yellow-400 rounded-md hover:text-blue-500 transition-colors duration-300 w-full h-10 text-left"
						>
							<FaProjectDiagram />
							<span>Projects</span>
							<span className="ml-auto">
								{isProjectsOpen ? (
									<IoIosArrowUp className="transition-transform duration-300" />
								) : (
									<IoIosArrowDown className="transition-transform duration-300" />
								)}
							</span>
						</button>
						<div
							className={`transition-all duration-700 ease-in-out overflow-hidden ${
								isProjectsOpen ? "max-h-40" : "max-h-0"
							}`}
						>
							<div className="ml-2 mt-1 flex flex-col space-y-1">
								<a
									href="/myProjects"
									className="flex items-center space-x-2 p-2 hover:bg-yellow-400 rounded-md hover:text-blue-500 transition-colors duration-300 w-full h-10"
								>
									<FaFolderOpen />
									<span>My Projects</span>
								</a>
								<a
									href="/newProject"
									className="flex items-center space-x-2 p-2 hover:bg-yellow-400 rounded-md hover:text-blue-500 transition-colors duration-300 w-full h-10"
								>
									<FaPlusCircle />
									<span>Add Project</span>
								</a>
							</div>
						</div>
					</div>
					<a
						href="/settings"
						className="flex items-center space-x-2 p-2 hover:bg-yellow-400 rounded-md hover:text-blue-500 transition-colors duration-300 w-full h-10"
					>
						<FaCog />
						<span>Settings</span>
					</a>
				</nav>

				<div className="mt-auto pt-4 border-t border-gray-400 flex justify-center">
					<div className="self-center">
						<UserProfile />
					</div>
				</div>
			</div>

			{/* Główna zawartość panelu */}
			<main className="flex-grow ml-40 h-screen overflow-y-auto">
				{children}
			</main>
		</div>
	);
}