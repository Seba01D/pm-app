"use client";

import React, { useEffect, useState } from "react";
import useUser from "@/app/hook/useUser";
import { createSupabaseBrowser } from "@/lib/supabase/client";
import Loader from "@/components/loader/loader";
import { FaFolderOpen } from "react-icons/fa";

export default function Page() {
    const { data: user, isLoading, isError } = useUser();
    const [createdProjectsCount, setCreatedProjectsCount] = useState(0);
    const [joinedProjectsCount, setJoinedProjectsCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchProjects();
        }
    }, [user]);

    const fetchProjects = async () => {
        if (!user) return; // Check if user exists

        setLoading(true);
        const supabase = createSupabaseBrowser();

        const { data: createdProjects, error: createdError } = await supabase
            .from("projects")
            .select("id")
            .eq("owner_id", user.id);

        const { data: joinedProjects, error: joinedError } = await supabase
            .from("project_members")
            .select("project_id")
            .eq("user_id", user.id);

        if (createdError || joinedError) {
            console.error("Error fetching projects:", createdError || joinedError);
        } else {
            setCreatedProjectsCount(createdProjects?.length || 0);
            setJoinedProjectsCount(joinedProjects?.length || 0);
        }

        setLoading(false);
    };

    if (isLoading || loading) {
        return <div className="flex justify-center items-center h-64"> <Loader /></div>;
    }

    if (isError) {
        return <p className="text-center text-red-500">An error occurred while loading data.</p>;
    }

    if (!user) {
        return (
            <p className="text-center text-yellow-500">
                You must be logged in to view your projects.
            </p>
        );
    }

    return (
            <div className="h-screen bg-white rounded-lg shadow-lg p-6">
                <h1 className="text-2xl font-semibold pt-5 text-center text-blue-600 mb-4">
                    Welcome to Your Project Dashboard
                </h1>
                <p className="text-gray-700 text-center mb-6">
                    Manage your created and joined projects here, and keep track of everything in one place!
                </p>
    
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mx-auto">
                    <div className="flex flex-col items-center bg-blue-50 p-6 rounded-lg shadow-md">
                        <FaFolderOpen className="text-blue-600 text-5xl mb-3" />
                        <h2 className="text-lg font-semibold text-blue-700 mb-2">Created Projects</h2>
                        <p className="text-gray-700 text-lg">{createdProjectsCount}</p>
                    </div>
                    <div className="flex flex-col items-center bg-green-50 p-6 rounded-lg shadow-md">
                        <FaFolderOpen className="text-green-600 text-5xl mb-3" />
                        <h2 className="text-lg font-semibold text-green-700 mb-2">Joined Projects</h2>
                        <p className="text-gray-700 text-lg">{joinedProjectsCount}</p>
                    </div>
                </div>
    
                <div className="mt-10 text-center">
                    <div className="h-px bg-gray-200 w-full mb-4"></div>
                    <p className="text-gray-500 text-sm">
                        Create or join a project to start collaborating with your team.
                    </p>
                </div>
            </div> 
	);
}	