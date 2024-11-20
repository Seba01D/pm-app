import { createSupabaseBrowser } from "@/lib/supabase/client";
import { Task } from "@/app/types";

export const fetchTasksForTile = async (tileId: string): Promise<Task[]> => {
  const supabase = createSupabaseBrowser();
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("tile_id", tileId);

  if (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
  return data || [];
};

export const addTaskToTile = async (description: string, tileId: string): Promise<Task> => {
  const supabase = createSupabaseBrowser();
  const { data, error } = await supabase
    .from("tasks")
    .insert([{ description, tile_id: tileId, is_complete: false }])
    .select()
    .single();

  if (error) {
    console.error("Error adding task:", error);
    throw error;
  }
  return data;
};

export const toggleTaskComplete = async (taskId: string, isComplete: boolean): Promise<void> => {
  const supabase = createSupabaseBrowser();
  const { error } = await supabase
    .from("tasks")
    .update({ is_complete: !isComplete })
    .eq("id", taskId);

  if (error) {
    console.error("Error toggling task completion:", error);
    throw error;
  }
};

export const updateTaskDescription = async (taskId: string, description: string): Promise<void> => {
  const supabase = createSupabaseBrowser();
  const { error } = await supabase
    .from("tasks")
    .update({ description })
    .eq("id", taskId);

  if (error) {
    console.error("Error updating task description:", error);
    throw error;
  }
};

export const deleteTask = async (taskId: string): Promise<void> => {
  const supabase = createSupabaseBrowser();
  const { error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", taskId);

  if (error) {
    console.error("Error deleting task:", error);
    throw error;
  }


};
export const updateTaskDetails = async (
  taskId: string,
  updates: Partial<Pick<Task, "description" | "full_description">>
): Promise<void> => {
  const supabase = createSupabaseBrowser();
  const { error } = await supabase
    .from("tasks")
    .update(updates)
    .eq("id", taskId);

  if (error) {
    console.error("Error updating task details:", error);
    throw error;
  }
};
