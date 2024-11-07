"use client";

import React, { useState, useEffect } from "react";
import { FaHome, FaProjectDiagram, FaCog } from "react-icons/fa";
import UserProfile from "../supaauth/user-profile";

export default function TaskBar(): JSX.Element {
	const [isProjectsOpen, setProjectsOpen] = useState<boolean>(false);

	// Odczyt stanu z localStorage podczas pierwszego renderowania
	useEffect(() => {
		const storedProjectsOpen = localStorage.getItem("isProjectsOpen");
		setProjectsOpen(storedProjectsOpen === "true");
	}, []);

	// Funkcja przełączająca i zapisująca stan do localStorage
	const toggleProjectsMenu = () => {
		setProjectsOpen((prev) => {
			const newState = !prev;
			localStorage.setItem("isProjectsOpen", JSON.stringify(newState)); // Zapisanie do localStorage
			return newState;
		});
	};

	return (
		<div
			className="w-40 h-screen p-4 flex flex-col shadow-lg"
			style={{
				background: "linear-gradient(to bottom, #3b82f6, #93c5fd)",
			}}
		>
			<h2 className="text-xl font-semibold text-yellow-400 mb-4">PManager</h2>

			<nav className="flex flex-col space-y-3 text-white text-sm">
				<a href="/dashboard" className="flex items-center space-x-2 hover:text-yellow-400">
					<FaHome />
					<span>Dashboard</span>
				</a>
				<div>
					<button
						onClick={toggleProjectsMenu}
						className="flex items-center space-x-2 hover:text-yellow-400 w-full text-left"
					>
						<FaProjectDiagram />
						<span>Projects</span>
					</button>
					<div
						className={`transition-all duration-700 ease-in-out overflow-hidden ${
							isProjectsOpen ? "max-h-40" : "max-h-0"
						}`}
					>
						<div className="ml-8 mt-1 flex flex-col space-y-1">
							<a href="/myProjects" className="hover:text-yellow-400">
								My Projects
							</a>
							<a href="/newProject" className="hover:text-yellow-400">
								Add Project
							</a>
						</div>
					</div>
				</div>
				<a href="/settings" className="flex items-center space-x-2 hover:text-yellow-400">
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
	);
}
