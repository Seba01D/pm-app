"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowser } from "@/lib/supabase/client";
import Loader from "@/components/loader/loader";
import useUser from "@/app/hook/useUser";
import { useRouter, useParams } from "next/navigation";
import TopBar from "@/components/bar/topbar";

interface Project {
    id: string;
    name: string;
    description?: string;
    created_at: string;
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
            .select("id, name, description, created_at")
            .eq("id", projectId)
            .single();

        if (error) {
            console.error("Error fetching project details:", error);
        } else {
            setProject(data);
        }
        setLoading(false);
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
            <div className="h-screen mx-auto p-8 bg-white">
                <h1 className="text-4xl font-extrabold mb-6 text-blue-600">{project.name}</h1>
                <p className="text-lg text-gray-700 mb-4">
                    {project.description || "No description provided."}
                </p>
                <p className="text-sm text-gray-500">
                    Created on: {new Date(project.created_at).toLocaleDateString()}
                </p>
            </div>
        </TopBar>
    );
}
