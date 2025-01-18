"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowser } from "@/lib/supabase/client";
import Loader from "@/components/loader/loader";
import useUser from "@/app/hook/useUser";
import { useRouter, useParams } from "next/navigation";
import TopBar from "@/components/bar/topbar";
import CreatedNewTask from "@/components/createdNewTask";
import { FiCopy, FiCheck, FiX } from "react-icons/fi"; // Ikony ptaszek i x
import { toast } from "sonner";

interface Project {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  access_code?: string;
}

export default function ProjectDetails() {
  const router = useRouter();
  const params = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const { data: user, isLoading: userLoading } = useUser();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");

  // Sprawdzamy, czy użytkownik jest zalogowany i czy projekt istnieje
  useEffect(() => {
    async function fetchParams() {
      const unwrappedParams = await params;
      let id = unwrappedParams.id;

      if (Array.isArray(id)) {
        id = id[0]; // Używamy pierwszego elementu, jeśli id jest tablicą
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

  // Pobieranie szczegółów projektu
  const fetchProjectDetails = async (projectId: string) => {
    const supabase = createSupabaseBrowser();

    const { data, error } = await supabase
      .from("projects")
      .select("id, name, description, created_at, access_code")
      .eq("id", projectId)
      .single();

    if (error) {
      console.error("Error fetching project details:", error);
      toast.error("Błąd przy pobieraniu projektu.");
    } else {
      setProject(data);
    }
    setLoading(false);
  };

  // Funkcja kopiowania kodu dostępu do schowka
  const copyToClipboard = () => {
    if (project?.access_code) {
      navigator.clipboard.writeText(project.access_code)
        .then(() => {
          toast.success("Access code copied to clipboard!");
        })
        .catch(() => {
          toast.error("Failed to copy access code.");
        });
    }
  };

  // Funkcje do edycji nazwy projektu
  const handleEditName = () => {
    setIsEditing(true);
    setNewProjectName(project?.name || "");
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setNewProjectName("");
  };

  const handleSaveName = async () => {
    if (!project || !newProjectName.trim()) {
      toast.error("Nazwa projektu nie może być pusta.");
      return;
    }

    const supabase = createSupabaseBrowser();
    const { error } = await supabase
      .from("projects")
      .update({ name: newProjectName.trim() })
      .eq("id", project.id);

    if (error) {
      console.error("Error updating project name:", error);
      toast.error("Failed to update project name.");
    } else {
      setProject({ ...project, name: newProjectName.trim() });
      toast.success("Project name updated successfully!");
    }
    setIsEditing(false);
  };

  // Loading
  if (userLoading || loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader />
      </div>
    );
  }

  // Jeśli projekt nie został znaleziony
  if (!project) {
    return (
      <div className="text-center text-gray-500">
        <p>Project not found.</p>
      </div>
    );
  }

  return (
    <TopBar>
      <div className="fixed top-0 w-full h-14 bg-yellow-300 flex items-center px-4 space-x-4">
        {isEditing ? (
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={newProjectName}
              onChange={(e) =>
                setNewProjectName(e.target.value.slice(0, 25))
              }
              maxLength={25}
              className="border-b-2 border-yellow-500 outline-none text-xl font-semibold text-blue-600 focus:border-yellow-700 placeholder-yellow-400 bg-transparent sm:text-lg md:text-xl"
              placeholder="Enter name"
            />
            <button
              onClick={handleSaveName}
              className="text-yellow-600 hover:text-yellow-700 transition"
            >
              <FiCheck size={26} strokeWidth={3} />
            </button>
            <button
              onClick={handleCancelEdit}
              className="text-yellow-600 hover:text-yellow-700 transition"
            >
              <FiX size={26} strokeWidth={3} />
            </button>
          </div>
        ) : (
          <h1
            className="text-2xl font-extrabold text-blue-600 cursor-pointer transition-transform transform hover:scale-105"
            onClick={handleEditName}
          >
            {project.name}
          </h1>
        )}
        {project.access_code && (
          <div className="p-2 rounded-xl border-white bg-white flex items-center space-x-2">
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

      <div className="mt-14">
        <CreatedNewTask projectId={project.id} />
      </div>
    </TopBar>
  );
}
