"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowser } from "@/lib/supabase/client";
import Loader from "@/components/loader/loader";
import useUser from "@/app/hook/useUser";
import { useRouter, useParams } from "next/navigation";
import TopBar from "@/components/bar/topbar";
import CreatedNewTask from "@/components/createdNewTask";
import { FiCopy } from "react-icons/fi"; // Import the new copy icon
import { toast } from "sonner"; // Import for notification (optional)


interface Project {
    id: string;
    name: string;
    description?: string;
    created_at: string;
    access_code?: string; // Add access code here
}

export default function ProjectDetails() {
    const router = useRouter();
    const params = useParams();
    const [project, setProject] = useState<Project | null>(null);
    const { data: user, isLoading: userLoading } = useUser();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchParams() {
            const unwrappedParams = await params;
            let id = unwrappedParams.id;

            if (Array.isArray(id)) {
                id = id[0];
            }

            if (userLoading) return;

            if (!user) {
                router.push("/login");
                return;
            }

            if (id) {
                fetchProjectDetails(id);
            }
        }

        fetchParams();
    }, [user, userLoading, params]);

    const fetchProjectDetails = async (projectId: string) => {
        const supabase = createSupabaseBrowser();

        const { data, error } = await supabase
            .from("projects")
            .select("id, name, description, created_at, access_code") // Include access_code
            .eq("id", projectId)
            .single();

        if (error) {
            console.error("Error fetching project details:", error);
        } else {
            setProject(data);
        }
        setLoading(false);
    };

    const copyToClipboard = () => {
        if (project?.access_code) {
            navigator.clipboard.writeText(project.access_code);
            toast.success("Access code copied to clipboard!"); // Optional: Show success message
        }
    };

    if (userLoading || loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader />
            </div>
        );
    }

    if (!project) {
        return (
            <div className="text-center text-gray-500">
                <p>Project not found.</p>
            </div>
        );
    }

    return (
        <TopBar>
            {/* Top Bar with Project Name and Access Code */}
            <div className="fixed top-0 w-full h-14 bg-yellow-300 flex items-center px-4 space-x-4">
                <h1 className="text-2xl font-extrabold text-blue-600">
                    {project.name}
                </h1>
                {project.access_code && (
                    <div className="p-2 rounded-xl border-white bg-white flex items-center space-x-2 ">
                        <span className="text-m font-medium text-gray-800">
                            {project.access_code}
                        </span>
                        <button
                            onClick={copyToClipboard}
                            className="text-gray-600 hover:text-gray-800 transition"
                        >
                            <FiCopy size={18} />
                        </button>
                    </div>
                )}
            </div>

            {/* Project Tasks Section */}
            <div className="mt-14">
                <CreatedNewTask projectId={project.id} />
            </div>
        </TopBar>
    );
}
