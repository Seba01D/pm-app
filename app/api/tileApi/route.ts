import { createSupabaseBrowser } from "@/lib/supabase/client";

export interface Tile {
  id: string;
  name: string;
  project_id: string;
}

// Pobieranie kafelków
export const fetchTiles = async (projectId: string): Promise<Tile[]> => {
  const supabase = createSupabaseBrowser();
  const { data, error } = await supabase
    .from("project_tiles")
    .select("*")
    .eq("project_id", projectId);

  if (error) {
    console.error("Error fetching tiles:", error);
    return [];
  }
  return data || [];
};

// Dodanie kafelka
export const addTile = async (
  tileName: string,
  projectId: string
): Promise<Tile | null> => {
  const supabase = createSupabaseBrowser();
  const { data, error } = await supabase
    .from("project_tiles")
    .insert([{ name: tileName, project_id: projectId }])
    .select()
    .single();

  if (error) {
    console.error("Error adding tile:", error);
    return null;
  }
  return data;
};

// Aktualizacja kafelka
export const updateTile = async (
  tileId: string,
  newName: string
): Promise<boolean> => {
  const supabase = createSupabaseBrowser();
  const { error } = await supabase
    .from("project_tiles")
    .update({ name: newName })
    .eq("id", tileId);

  if (error) {
    console.error("Error updating tile:", error);
    return false;
  }
  return true;
};

// Usunięcie kafelka
export const deleteTile = async (tileId: string): Promise<boolean> => {
  const supabase = createSupabaseBrowser();
  const { error } = await supabase.from("project_tiles").delete().eq("id", tileId);

  if (error) {
    console.error("Error deleting tile:", error);
    return false;
  }
  return true;
};

