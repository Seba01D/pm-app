"use client";

import useUser from "@/app/hook/useUser";
import { useState, useEffect } from "react";
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle } from "react-icons/fa";
import Loader from "@/components/loader/loader";
import JoinProject from "@/components/joinToProject"; // Import the JoinProject component

export default function NewProject() {
    const { data: user, isLoading, isError } = useUser();
    const [projectName, setProjectName] = useState("");
    const [description, setDescription] = useState("");
    const [message, setMessage] = useState({ type: "", text: "" });
    const [activeTab, setActiveTab] = useState("create"); // Track active tab

    useEffect(() => {
        if (message.text) {
            const timer = setTimeout(() => setMessage({ type: "", text: "" }), 5000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    const handleCreateProject = async () => {
        if (!user) {
            setMessage({ type: "warning", text: "You must be logged in to add a project" });
            return;
        }

        const response = await fetch("/api/addProject", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: projectName,
                description: description,
                owner_id: user.id,
            }),
        });

        const result = await response.json();
        if (response.ok) {
            setMessage({ type: "success", text: "Project added successfully" });
            setProjectName("");
            setDescription("");
        } else {
            setMessage({ type: "error", text: result.error });
        }
    };

    if (isLoading) return <div className="flex justify-center items-center h-64"><Loader /></div>;
    if (isError) return <p className="text-center text-red-500">An error occurred while loading user data.</p>;
    if (!user) return <p className="text-center text-yellow-500">You must be logged in to add a new project.</p>;

    return (
        <div className="max-w-2xl mx-auto mt-12 p-8 bg-gray-50 rounded-lg shadow-lg">
            <h1 className="text-2xl font-semibold text-yellow-400 text-center text-gray-800">
                {activeTab === "create" ? "Create a New Project" : "Join a Project"}
            </h1>
            <div className="w-full border-t border-gray-200 mt-3 mb-8"></div>

            {/* Tabs */}
            <div className="flex justify-center items-center space-x-4 mb-6">
                <span
                    className={`cursor-pointer px-2 ${activeTab === "create" ? "text-blue-600 font-semibold" : "text-gray-500"}`}
                    onClick={() => setActiveTab("create")}
                >
                    Create
                </span>
                <span className="text-gray-400">|</span>
                <span
                    className={`cursor-pointer px-2 ${activeTab === "join" ? "text-blue-600 font-semibold" : "text-gray-500"}`}
                    onClick={() => setActiveTab("join")}
                >
                    Join
                </span>
            </div>

            {/* Conditional Rendering */}
            {activeTab === "create" ? (
                <div>
                    {/* Message Alert */}
                    {message.text && (
                        <div className={`fixed top-5 right-5 px-4 py-3 rounded-md shadow-md flex items-center space-x-2 max-w-xs transition-transform duration-300 ${
                            message.type === "success" ? "bg-green-100 text-green-800" :
                            message.type === "error" ? "bg-red-100 text-red-800" :
                            "bg-yellow-100 text-yellow-800"
                        }`}>
                            {message.type === "success" && <FaCheckCircle className="text-green-600" />}
                            {message.type === "error" && <FaExclamationCircle className="text-red-600" />}
                            {message.type === "warning" && <FaInfoCircle className="text-yellow-600" />}
                            <span>{message.text}</span>
                        </div>
                    )}

                    {/* Project Name Input */}
                    <div className="mb-6">
                        <label htmlFor="projectName" className="block text-sm font-medium text-gray-700">Project Name</label>
                        <input
                            type="text"
                            id="projectName"
                            className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            placeholder="Enter the project name"
                        />
                    </div>

                    {/* Project Description Input */}
                    <div className="mb-6">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Project Description</label>
                        <textarea
                            id="description"
                            className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 resize-none"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter a brief description of the project"
                            rows={4}
                        />
                    </div>

                    {/* Create Project Button */}
                    <button
                        onClick={handleCreateProject}
                        className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        Create Project
                    </button>
                </div>
            ) : (
                <JoinProject />
            )}
        </div>
    );
}
