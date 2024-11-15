"use client";
import { useEffect, useState } from "react";
import { createSupabaseBrowser } from "@/lib/supabase/client";
import useUser from "@/app/hook/useUser";
import { FaFolderOpen, FaTrashAlt, FaSignOutAlt } from "react-icons/fa";
import Link from "next/link";
import Loader from "@/components/loader/loader";

interface Project {
    id: string;
    name: string;
    description?: string;
    isOwner: boolean;
    created_at: string;
}

export default function UserProjects() {
    const { data: user, isLoading: userLoading, isError } = useUser();
    const [ownedProjects, setOwnedProjects] = useState<Project[]>([]);
    const [joinedProjects, setJoinedProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [confirmAction, setConfirmAction] = useState<{ type: "delete" | "leave"; projectId: string } | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState<"owned" | "joined">("owned");
    const [tooltipContent, setTooltipContent] = useState<string | null>(null);
    const [tooltipVisible, setTooltipVisible] = useState(false);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        if (user) {
            fetchProjects();
        }
    }, [user]);

    const fetchProjects = async () => {
        if (!user) return;

        setLoading(true);
        const supabase = createSupabaseBrowser();

        const { data: ownedData, error: ownedError } = await supabase
            .from("projects")
            .select("*")
            .eq("owner_id", user.id)
            .order("created_at", { ascending: false });

        const { data: joinedData, error: joinedError } = await supabase
            .from("project_members")
            .select("projects(id, name, description, created_at)")
            .eq("user_id", user.id);

        if (ownedError || joinedError) {
            console.error("Error fetching projects:", ownedError || joinedError);
        } else {
            setOwnedProjects((ownedData || []).map((project) => ({ ...project, isOwner: true })));
            setJoinedProjects((joinedData || []).map((item: any) => ({ ...item.projects, isOwner: false })));
        }
        setLoading(false);
    };

    const deleteProject = async (projectId: string) => {
        const supabase = createSupabaseBrowser();
        const { error } = await supabase.from("projects").delete().eq("id", projectId);

        if (error) {
            console.error("Error deleting project:", error);
        } else {
            setOwnedProjects(ownedProjects.filter((project) => project.id !== projectId));
            setConfirmAction(null);
        }
    };

    const leaveProject = async (projectId: string) => {
        const supabase = createSupabaseBrowser();
        const { error } = await supabase
            .from("project_members")
            .delete()
            .eq("project_id", projectId)
            .eq("user_id", user?.id);

        if (error) {
            console.error("Error leaving project:", error);
        } else {
            setJoinedProjects(joinedProjects.filter((project) => project.id !== projectId));
            setConfirmAction(null);
        }
    };

    const filteredOwnedProjects = ownedProjects.filter((project) =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredJoinedProjects = joinedProjects.filter((project) =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const truncateDescription = (description = "", maxLength = 50) =>
        description.length > maxLength ? `${description.slice(0, maxLength)}...` : description;

    const handleMouseEnter = (description: string, event: React.MouseEvent) => {
        setTooltipContent(description);
        setTooltipPosition({ x: event.clientX, y: event.clientY });
        setTooltipVisible(true);
    };

    const handleMouseLeave = () => {
        setTooltipVisible(false);
        setTooltipContent(null);
    };

    if (userLoading || loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex justify-center items-center h-64">
                <p className="text-center text-red-500">
                    An error occurred while loading user data.
                </p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex justify-center items-center h-64">
                <p className="text-center text-yellow-500">
                    You must be logged in to view your projects.
                </p>
            </div>
        );
    }

    return (
        <div className="h-screen mx-auto bg-white rounded-lg shadow-lg overflow-y-auto relative">
            {/* Tooltip */}
           {/*} {tooltipVisible && (
                <div
                    className="absolute bg-black text-white text-xs rounded p-2 shadow-lg z-50 max-w-xs"
                    style={{ top: tooltipPosition.y, left: tooltipPosition.x}}
                >
                    {tooltipContent}
                </div>
            )}*/}

            {/* Header section with sticky search input */}
            <div className="sticky top-0 p-6 bg-white z-10 shadow-sm">
                <h1 className="text-2xl font-bold text-center text-blue-600 flex items-center justify-center gap-2">
                    <FaFolderOpen className="text-blue-500" /> Your Projects
                </h1>
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mt-4">
                    Search:
                </label>
                <input
                    id="search"
                    type="text"
                    placeholder="Search projects..."
                    className="p-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                {/* Tabs for Owned and Joined Projects */}
                <div className="flex justify-center items-center space-x-2">
                    <span
                        className={`cursor-pointer px-2 ${activeTab === "owned" ? "text-yellow-400 font-semibold" : "text-gray-500"}`}
                        onClick={() => setActiveTab("owned")}
                    >
                        Owned Projects
                    </span>
                    <span className="text-gray-400">|</span>
                    <span
                        className={`cursor-pointer px-2 ${activeTab === "joined" ? "text-yellow-400 font-semibold" : "text-gray-500"}`}
                        onClick={() => setActiveTab("joined")}
                    >
                        Joined Projects
                    </span>
                </div>
            </div>

            {/* Display Projects based on the selected tab */}
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {(activeTab === "owned" ? filteredOwnedProjects : filteredJoinedProjects).map((project) => (
                    <Link key={project.id} href={`/projects/${project.id}`}>
                        <div className="project-tile bg-gray-100 p-4 rounded-lg shadow-md hover:shadow-lg transition duration-200 cursor-pointer">
                            <h2 className="text-lg font-semibold text-blue-700">{project.name}</h2>
                            <p
                                className="text-gray-600 text-sm mt-2 description"
                                onMouseEnter={(e) => handleMouseEnter(project.description || "No description available", e)}
                                onMouseLeave={handleMouseLeave}
                            >
                                {truncateDescription(project.description || "No description available")}
                            </p>
                            <p className="text-gray-400 text-xs mt-1">Created at: {new Date(project.created_at).toLocaleDateString()}</p>
                            <div className="flex justify-end space-x-2 mt-4">
                                {project.isOwner ? (
                                    <button
                                        className="text-gray-700 hover:text-gray-900"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setConfirmAction({ type: "delete", projectId: project.id });
                                        }}
                                    >
                                        <FaTrashAlt />
                                    </button>
                                ) : (
                                    <button
                                        className="text-red-600 hover:text-red-800"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setConfirmAction({ type: "leave", projectId: project.id });
                                        }}
                                    >
                                        <FaSignOutAlt />
                                    </button>
                                )}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Confirmation Modal */}
            {confirmAction && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
                        <h2 className="text-xl font-semibold mb-4 text-center">
                            {confirmAction.type === "delete" ? "Delete Project" : "Leave Project"}
                        </h2>
                        <p className="text-gray-700 mb-6 text-center">
                            Are you sure you want to {confirmAction.type === "delete" ? "delete" : "leave"} this project?
                        </p>
                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={() => {
                                    confirmAction.type === "delete"
                                        ? deleteProject(confirmAction.projectId)
                                        : leaveProject(confirmAction.projectId);
                                }}
                                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                            >
                                Confirm
                            </button>
                            <button
                                onClick={() => setConfirmAction(null)}
                                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
